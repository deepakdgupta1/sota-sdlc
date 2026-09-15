# Claude Code Architecture Research Report (claw-code)

Source-of-truth: local clone at `/Users/deepg/Desktop/agent/claw-code/`.
HEAD pinned: `a389f8dff1d591d2eafc2f48747313cd556412ee`.

Scope note: the harness lives in the **Rust** workspace under `rust/crates/`, not in `src/`. The Python `src/` tree is a porting-workspace scaffold that mirrors upstream TypeScript metadata via JSON snapshots (`src/reference_data/*.json`); its `tools.py`, `commands.py`, `permissions.py`, `hooks/`, `cli/`, and `schemas/` are placeholders that proxy archive metadata rather than implement runtime behavior (claw-code: `src/tools.py`, `src/permissions.py`, `src/hooks/__init__.py`). Citations below therefore reference `rust/crates/...` for harness behavior and the Python tree only where it materially adds (e.g., the snapshotted upstream tool catalog).

## 1. Agentic Loop

- **Turn entry point**: `ConversationRuntime::run_turn(user_input, prompter)` is the single function that drives one user-turn (claw-code: `rust/crates/runtime/src/conversation.rs:314`). It is invoked from the CLI's `LiveCli::run_turn` / `run_turn_with_output` (claw-code: `rust/crates/rusty-claude-cli/src/main.rs:4256, 4298`).
- **Pre-turn health probe**: when `session.compaction.is_some()` the runtime first runs `run_session_health_probe` and aborts the turn with a "session may be in an inconsistent state" error if the post-compaction probe fails (`conversation.rs:322`).
- **User message append**: the user input is pushed to the session as a Text block via `Session::push_user_text` before any model call (`conversation.rs:333`, `session.rs:245`).
- **System prompt assembly**: built once outside the loop by `SystemPromptBuilder::build` from `load_system_prompt(cwd, current_date, os, os_version)`, which discovers `CLAUDE.md`, `CLAUDE.local.md`, `.claw/CLAUDE.md`, `.claw/instructions.md` walking up from cwd, plus `ConfigLoader::default_for(&cwd).load()` settings (claw-code: `rust/crates/runtime/src/prompt.rs:144`, `prompt.rs:213-219`, `prompt.rs:432`). Sections in order: simple intro -> output style (if set) -> simple system -> doing-tasks -> actions -> dynamic boundary marker -> environment context -> project context -> instruction files -> runtime config -> appended sections (`prompt.rs:144-166`).
- **Per-iteration LLM dispatch**: each loop iteration constructs `ApiRequest { system_prompt, messages: session.messages.clone() }` and calls `self.api_client.stream(request)` returning a `Vec<AssistantEvent>` (`conversation.rs:352-362`). The trait is `ApiClient::stream` (`conversation.rs:53`); the CLI wires `AnthropicRuntimeClient` and `CliToolExecutor` into `ConversationRuntime::new_with_features` in `build_runtime_with_plugin_state` (`main.rs:7304-7324`).
- **Stream event reduction**: `build_assistant_message(events)` walks `AssistantEvent` variants — `TextDelta(String)` accumulates text, `ToolUse { id, name, input }` flushes the pending text into a `ContentBlock::Text` then pushes a `ContentBlock::ToolUse`, `Usage(TokenUsage)` records token counts, `PromptCache(...)` records cache telemetry, `MessageStop` ends the message (`conversation.rs:706-753`). Streaming is event-batched: the API client returns the full event list synchronously; deltas are not yielded to the caller mid-flight (no async streaming surface in `run_turn`).
- **Tool-use detection**: after the assistant message is built, `pending_tool_uses` is collected by filtering `assistant_message.blocks` for `ContentBlock::ToolUse { id, name, input }` (`conversation.rs:375-384`). If empty, the loop breaks — that is the **termination condition** (`conversation.rs:396-398`).
- **Tool dispatch**: for each pending tool-use the runtime runs (a) `run_pre_tool_use_hook(tool_name, input)`, (b) constructs a `PermissionContext` from the hook's `permission_override`/`permission_reason`, (c) computes a `PermissionOutcome` via `permission_policy.authorize_with_context(name, effective_input, ctx, prompter)`, (d) on `Allow` calls `tool_executor.execute(name, input)` (`ToolExecutor` trait, `conversation.rs:58`), (e) runs `run_post_tool_use_hook` or `run_post_tool_use_failure_hook`, (f) appends a `ConversationMessage::tool_result(tool_use_id, tool_name, output, is_error)` to the session (`conversation.rs:400-499`).
- **Tool result injection**: `ConversationMessage::tool_result` persists a `MessageRole::Tool` message with a single `ContentBlock::ToolResult { tool_use_id, tool_name, output, is_error }` block, pushed via `session.push_message` (`session.rs:18-25, 38-43, 653-665`; `conversation.rs:494-496`). For Anthropic-compatible requests, `convert_messages` maps `MessageRole::Tool` to provider role `"user"` while preserving the `tool_result` content block (`main.rs:8793-8831`). The next loop iteration re-clones `session.messages` into the next `ApiRequest`, so tool results re-enter the model context naturally.
- **Iteration cap**: `max_iterations` defaults to `usize::MAX` (`conversation.rs:181`); a `RuntimeError` is returned if exceeded (`conversation.rs:344-350`). Builder `with_max_iterations` lets callers tighten it (`conversation.rs:192`).
- **Post-turn auto-compaction**: after the loop exits, `maybe_auto_compact` runs and may produce an `AutoCompactionEvent` whose threshold is `CLAUDE_CODE_AUTO_COMPACT_INPUT_TOKENS` env var, default `100_000` (`conversation.rs:18, 502, 690-704`).
- **Turn telemetry**: `record_turn_started`, `record_assistant_iteration`, `record_tool_started`, `record_tool_finished`, `record_turn_completed`/`record_turn_failed` push attributes into an optional `SessionTracer` for observability (`conversation.rs:585-686`).

## 2. Tool System

Note: task.md asks for "Read, Write, Edit, Bash, Glob, Grep, etc." (upstream Title-cased names). The claw-code Rust harness exposes them under snake_case canonical names (`read_file`, `write_file`, `edit_file`, `bash`, `glob_search`, `grep_search`); upstream-style aliases are mapped only at the `--allowedTools` parsing layer (`tools/src/lib.rs:216-224`).

- **Built-in registry**: `tools::mvp_tool_specs()` returns a `Vec<ToolSpec>` with **50 live built-in specs** at HEAD `a389f8d` (claw-code: `rust/crates/tools/src/lib.rs:385-1171`). Each `ToolSpec` carries `name`, `description`, `input_schema`, and `required_permission` (`tools/src/lib.rs:101-106`). **Citation audit note:** the repo's top-level `PARITY.md` still says 40 exposed specs (`PARITY.md:145-150`), but the source-of-truth Rust registry now has 50; treat the parity count as stale.
- **Built-in tool catalog and parameters**:

| Tool | Required input | Optional input | Permission |
|---|---|---|---|
| `bash` | `command` | `timeout`, `description`, `run_in_background`, `dangerouslyDisableSandbox`, `namespaceRestrictions`, `isolateNetwork`, `filesystemMode`, `allowedMounts` | `DangerFullAccess` |
| `read_file` | `path` | `offset`, `limit` | `ReadOnly` |
| `write_file` | `path`, `content` | none | `WorkspaceWrite` |
| `edit_file` | `path`, `old_string`, `new_string` | `replace_all` | `WorkspaceWrite` |
| `glob_search` | `pattern` | `path` | `ReadOnly` |
| `grep_search` | `pattern` | `path`, `glob`, `output_mode`, `-B`, `-A`, `-C`, `context`, `-n`, `-i`, `type`, `head_limit`, `offset`, `multiline` | `ReadOnly` |
| `WebFetch` | `url`, `prompt` | none | `ReadOnly` |
| `WebSearch` | `query` | `allowed_domains`, `blocked_domains` | `ReadOnly` |
| `TodoWrite` | `todos[].content`, `todos[].activeForm`, `todos[].status` | none | `WorkspaceWrite` |
| `Skill` | `skill` | `args` | `ReadOnly` |
| `Agent` | `description`, `prompt` | `subagent_type`, `name`, `model` | `DangerFullAccess` |
| `ToolSearch` | `query` | `max_results` | `ReadOnly` |
| `NotebookEdit` | `notebook_path` | `cell_id`, `new_source`, `cell_type`, `edit_mode` | `WorkspaceWrite` |
| `Sleep` | `duration_ms` | none | `ReadOnly` |
| `SendUserMessage` | `message`, `status` | `attachments` | `ReadOnly` |
| `Config` | `setting` | `value` | `WorkspaceWrite` |
| `EnterPlanMode` | none | none | `WorkspaceWrite` |
| `ExitPlanMode` | none | none | `WorkspaceWrite` |
| `StructuredOutput` | none | arbitrary JSON properties | `ReadOnly` |
| `REPL` | `code`, `language` | `timeout_ms` | `DangerFullAccess` |
| `PowerShell` | `command` | `timeout`, `description`, `run_in_background` | `DangerFullAccess` |
| `AskUserQuestion` | `question` | `options` | `ReadOnly` |
| `TaskCreate` | `prompt` | `description` | `DangerFullAccess` |
| `RunTaskPacket` | `objective`, `scope`, `repo`, `branch_policy`, `acceptance_tests`, `commit_policy`, `reporting_contract`, `escalation_policy` | none in the model schema | `DangerFullAccess` |
| `TaskGet` | `task_id` | none | `ReadOnly` |
| `TaskList` | none | none | `ReadOnly` |
| `TaskStop` | `task_id` | none | `DangerFullAccess` |
| `TaskUpdate` | `task_id`, `message` | none | `DangerFullAccess` |
| `TaskOutput` | `task_id` | none | `ReadOnly` |
| `WorkerCreate` | `cwd` | `trusted_roots`, `auto_recover_prompt_misdelivery` | `DangerFullAccess` |
| `WorkerGet` | `worker_id` | none | `ReadOnly` |
| `WorkerObserve` | `worker_id`, `screen_text` | none | `ReadOnly` |
| `WorkerResolveTrust` | `worker_id` | none | `DangerFullAccess` |
| `WorkerAwaitReady` | `worker_id` | none | `ReadOnly` |
| `WorkerSendPrompt` | `worker_id` | `prompt`, `task_receipt` | `DangerFullAccess` |
| `WorkerRestart` | `worker_id` | none | `DangerFullAccess` |
| `WorkerTerminate` | `worker_id` | none | `DangerFullAccess` |
| `WorkerObserveCompletion` | `worker_id`, `finish_reason`, `tokens_output` | none | `DangerFullAccess` |
| `TeamCreate` | `name`, `tasks[].prompt` | `tasks[].description` | `DangerFullAccess` |
| `TeamDelete` | `team_id` | none | `DangerFullAccess` |
| `CronCreate` | `schedule`, `prompt` | `description` | `DangerFullAccess` |
| `CronDelete` | `cron_id` | none | `DangerFullAccess` |
| `CronList` | none | none | `ReadOnly` |
| `LSP` | `action` | `path`, `line`, `character`, `query` | `ReadOnly` |
| `ListMcpResources` | none | `server` | `ReadOnly` |
| `ReadMcpResource` | `uri` | `server` | `ReadOnly` |
| `McpAuth` | `server` | none | `DangerFullAccess` |
| `RemoteTrigger` | `url` | `method`, `headers`, `body` | `DangerFullAccess` |
| `MCP` | `server`, `tool` | `arguments` | `DangerFullAccess` |
| `TestingPermission` | `action` | none | `DangerFullAccess` |

  Schema sources: core file/web/todo/agent tools (`tools/src/lib.rs:387-600`), notebook/config/repl/question/task tools (`tools/src/lib.rs:603-854`), worker/team/cron/LSP/MCP/remote/test tools (`tools/src/lib.rs:855-1170`).
- **Tool definitions sent to model**: `GlobalToolRegistry::definitions(allowed_tools)` returns a `Vec<ToolDefinition>` from built-ins + runtime-registered + plugin tools, applying the optional allowed-tools filter (`tools/src/lib.rs:247-278`). `filter_tool_specs` delegates to that registry (`main.rs:1608-1612`), and `AnthropicRuntimeClient::stream` puts the result into `MessageRequest.tools` with `tool_choice: Auto` when tools are enabled (`main.rs:7518-7526`).
- **Tool-call dispatch entry**: `GlobalToolRegistry::execute(name, input)` checks `mvp_tool_specs()` for a built-in match, otherwise dispatches plugin tools; it does **not** execute runtime MCP tools itself (`tools/src/lib.rs:339-349`). The runtime-side trait that the loop calls is `ToolExecutor::execute(&mut self, name: &str, input: &str) -> Result<String, ToolError>` (`conversation.rs:58`); the CLI binds it via `CliToolExecutor` in `build_runtime_with_plugin_state` (`main.rs:7315-7320`) and dispatches model tool calls through `CliToolExecutor::execute` (`main.rs:8735-8756`).
- **MCP tool registration**: dynamic MCP tools are registered as `RuntimeToolDefinition`s via `with_runtime_tools(...)`, with conflict checks against built-in and plugin names (`tools/src/lib.rs:159-184`). They are model-visible through `GlobalToolRegistry::definitions`, but execution is handled by `CliToolExecutor::execute_runtime_tool` before falling back to the built-in/plugin registry (`main.rs:8693-8731, 8735-8756`). The separate built-in MCP-facing specs are `ListMcpResources`, `ReadMcpResource`, `McpAuth`, and `MCP` (`tools/src/lib.rs:1089-1158`).
- **Allowed-tools normalization**: `normalize_allowed_tools(values)` accepts comma- or whitespace-separated tokens and resolves aliases `read|write|edit|glob|grep` -> snake_case canonical names (`tools/src/lib.rs:192-244`). Driven by CLI `--allowedTools` / `--allowed-tools` (`main.rs:773-784`).
- **Upstream catalog (snapshot only)**: the JSON snapshot mirrored from archived upstream TypeScript contains 184 module entries and 41 distinct names ending in `Tool` (claw-code: `src/reference_data/tools_snapshot.json`). It includes upstream-only or differently named surfaces such as `EnterWorktreeTool`, `ExitWorktreeTool`, `ExitPlanModeV2Tool`, `BriefTool`, `SendMessageTool`, and `SyntheticOutputTool`. These are catalog metadata only; live model-visible specs come from `mvp_tool_specs()`, plus plugin/runtime/MCP registrations.

## 3. Permission Model

Note: task.md references "3 modes (default, permissive, auto)"; the source defines five `PermissionMode` variants — `ReadOnly`, `WorkspaceWrite`, `DangerFullAccess`, `Prompt`, `Allow` — with three CLI-exposed labels. Reporting source reality below.

- **Mode enum**: `PermissionMode::{ReadOnly, WorkspaceWrite, DangerFullAccess, Prompt, Allow}` with `as_str` labels `"read-only" | "workspace-write" | "danger-full-access" | "prompt" | "allow"` (claw-code: `rust/crates/runtime/src/permissions.rs:9-28`). `Prompt` and `Allow` are runtime-internal — only the first three are reachable from the CLI flag (`main.rs:1525-1542`).
- **Settings-file mode parsing**: `parse_optional_permission_mode` first checks top-level `permissionMode`, then `permissions.defaultMode`. Accepted values map as: `"default"|"plan"|"read-only" -> ReadOnly`, `"acceptEdits"|"auto"|"workspace-write" -> WorkspaceWrite`, `"dontAsk"|"danger-full-access" -> DangerFullAccess` (`config.rs:831-863`).
- **Default mode (CLI)**: `default_permission_mode()` resolves `RUSTY_CLAUDE_PERMISSION_MODE` env var first, then the merged config's `permissionMode` / `permissions.defaultMode`, falling back to `PermissionMode::DangerFullAccess` (`main.rs:1552-1559`). Divergence from upstream: upstream Claude Code defaults to a prompting/plan mode, not full-access.
- **Settings precedence (last-wins deep merge)**: `ConfigLoader::discover()` orders entries: (1) user legacy `<HOME>/.claw.json`, (2) user `<config_home>/settings.json`, (3) project `<cwd>/.claw.json`, (4) project `<cwd>/.claw/settings.json`, (5) local `<cwd>/.claw/settings.local.json` (`config.rs:242-269`). `load()` deep-merges in that order so later entries override earlier — local > project > user (`config.rs:271-296`; verified by test `loads_and_merges_claude_code_config_files_by_precedence`, `config.rs:1296-1395`). `<config_home>` is `$CLAW_CONFIG_HOME` else `$HOME/.claw` (`config.rs:561-563`).
- **Project path branding**: claw-code uses `.claw/` not `.claude/`. Files: `.claw/settings.json` (project), `.claw/settings.local.json` (local override), `~/.claw/settings.json` (user). The legacy alias `.claw.json` exists at project and user roots for back-compat (`config.rs:243-269`).
- **Managed/enterprise paths**: **Not implemented in claw-code at HEAD a389f8d.** No `/etc/claude`, `/Library/Application Support/ClaudeCode`, or `%PROGRAMDATA%\ClaudeCode` paths are loaded; `ConfigLoader::discover` enumerates exactly the five paths above (grep `managed|enterprise|/etc/claude|ProgramData` over `rust/crates/runtime/src/` and `rust/crates/rusty-claude-cli/src/` returns no policy-loading hits).
- **Allow / deny / ask rules**: `permissions.{allow, deny, ask}: string[]` parsed by `parse_optional_permission_rules` (`config.rs:780-798`). Each rule string is parsed by `PermissionRule::parse`: form `ToolName(matcher)`, where matcher is `*` or empty -> `Any`, `prefix:*` -> `Prefix(prefix)`, otherwise `Exact(value)` (`permissions.rs:349-402`). Bare `ToolName` (no parens) becomes `Any`.
- **Rule subject extraction**: `extract_permission_subject(input)` parses the tool input as JSON and probes keys in this order — `command`, `path`, `file_path`, `filePath`, `notebook_path`, `notebookPath`, `url`, `pattern`, `code`, `message` — falling back to the raw input string (`permissions.rs:447-469`).
- **Authorization order** (`PermissionPolicy::authorize_with_context`): (1) any matching deny rule -> `Deny`. (2) Hook `PermissionOverride::Deny` -> `Deny`. (3) Hook `Ask` -> prompt-or-deny. (4) Hook `Allow` -> Allow unless an ask rule matches (then prompt). (5) Default: matching ask rule -> prompt; allow rule or `current_mode == Allow` or `current_mode >= required_mode` -> Allow; `current_mode == Prompt` or `WorkspaceWrite -> DangerFullAccess` escalation -> prompt; else -> `Deny` (`permissions.rs:175-292`).
- **Prompter contract**: `PermissionPrompter::decide(&PermissionRequest) -> PermissionPromptDecision::{Allow, Deny{reason}}`. `PermissionRequest` carries `tool_name, input, current_mode, required_mode, reason` (`permissions.rs:69-88`). Without a prompter, prompt-required outcomes hard-deny (`permissions.rs:310-323`).
- **Example rules** (from test fixtures, `permissions.rs:570-605`): `"Read"` (ToolName-only), `"bash(git:*)"` (prefix), `"bash(rm -rf:*)"` (prefix), `"Edit"` (ask). Settings JSON shape used in tests: `{"permissions":{"defaultMode":"plan","allow":["Read"],"deny":["Bash(rm -rf)"],"ask":["Edit"]}}` (`config.rs:1310, 1320`).
- **Workspace-boundary enforcement**: `PermissionEnforcer::check_file_write(path, workspace_root)` denies writes outside the workspace under `WorkspaceWrite`, denies all writes under `ReadOnly`, allows under `Allow`/`DangerFullAccess`, and denies under `Prompt` with reason `"file write requires confirmation in prompt mode"` (`permission_enforcer.rs:108-142`). `check_bash` uses an `is_read_only_command` heuristic to allow `cat|grep|git log|...` even under `ReadOnly` (`permission_enforcer.rs:145-173`, `permission_enforcer.rs:194-201`).
- **In-loop wiring**: per tool-use, `run_turn` calls `permission_policy.authorize_with_context(name, effective_input, ctx, prompter)`; `effective_input` is `pre_hook_result.updated_input()` if the hook rewrote it, else the original (`conversation.rs:401-445`).

## 4. Hooks System

Note: task.md references upstream's `PreToolUse | PostToolUse | Notification | UserPromptSubmit | Stop | SubagentStop | SessionStart | PreCompact | SessionEnd`. The source implements only three. Reporting source reality.

- **Implemented events**: `HookEvent::{PreToolUse, PostToolUse, PostToolUseFailure}`, with `as_str` returning the matching string keys for settings (claw-code: `rust/crates/runtime/src/hooks.rs:21-37`). `Notification`, `UserPromptSubmit`, `Stop`, `SubagentStop`, `SessionStart`, `PreCompact`, `SessionEnd` are **Not implemented in claw-code at HEAD a389f8d** — grep across `rust/` returns hits only inside test strings and a plugin-manifest validator that explicitly rejects upstream-style `SessionStart` hooks (`rust/crates/plugins/src/lib.rs:2637, 2653`).
- **Settings shape**: `hooks` is an object whose keys must be `"PreToolUse" | "PostToolUse" | "PostToolUseFailure"`, each mapping to a `string[]` of shell commands (claw-code: `rust/crates/runtime/src/config.rs:757-771`). Matcher syntax (per-tool patterns wrapping the command list as in upstream `{matcher, hooks:[...]}`) is **not supported**; commands are run unconditionally for the event regardless of tool name.
- **Hook input (stdin payload)**: built by `hook_payload(event, tool_name, tool_input, tool_output, is_error)` (`hooks.rs:632-657`). For `PreToolUse`/`PostToolUse`: `{hook_event_name, tool_name, tool_input (parsed JSON or {raw: ...}), tool_input_json, tool_output, tool_result_is_error}`. For `PostToolUseFailure`: `{hook_event_name, tool_name, tool_input, tool_input_json, tool_error, tool_result_is_error: true}`. Payload is delivered on stdin to a shell subprocess (`hooks.rs:439`).
- **Hook env vars**: each hook subprocess additionally receives `HOOK_EVENT`, `HOOK_TOOL_NAME`, `HOOK_TOOL_INPUT`, `HOOK_TOOL_IS_ERROR`, and `HOOK_TOOL_OUTPUT` when applicable (`hooks.rs:431-437`).
- **Hook output schema (parsed from stdout JSON)**: top-level keys recognized — `systemMessage: string` (appended to messages), `reason: string` (appended), `continue: false` -> deny, `decision: "block"` -> deny. Nested `hookSpecificOutput: {additionalContext?: string, permissionDecision?: "allow"|"deny"|"ask", permissionDecisionReason?: string, updatedInput?: object}` (`hooks.rs:588-623`). `permissionDecision` maps to `PermissionOverride::{Allow, Deny, Ask}` consumed by `PermissionPolicy`. `updatedInput` replaces the tool input for downstream evaluation and execution.
- **Exit-code semantics**: status `0` -> Allow (or Deny if `decision: "block"` or `continue: false`); status `2` -> Deny with fallback reason `"<event> hook denied tool \`<tool>\`"`; any other non-zero -> `Failed` with formatted failure reason and stderr; signal-killed -> `Failed`; cancelled via `HookAbortSignal` -> `Cancelled` (`hooks.rs:445-493`, `hooks.rs:496-501`).
- **Loop interception**: `run_turn` calls `run_pre_tool_use_hook` *before* permission evaluation; the hook's `permission_override` and `permission_reason` flow into the `PermissionContext` (`conversation.rs:401-408`). A `Cancelled`/`Failed`/`Denied` hook short-circuits to `PermissionOutcome::Deny` with the hook's messages baked into the reason (`conversation.rs:410-430`). Post-execution, `run_post_tool_use_hook` (or `run_post_tool_use_failure_hook` when `is_error`) runs and `merge_hook_feedback` appends labelled "Hook feedback" / "Hook feedback (error)" sections to the tool result (`conversation.rs:457-483`, `conversation.rs:771-787`).
- **Multiple commands per event**: `run_commands` iterates configured commands sequentially; the first `Deny`/`Failed`/`Cancelled` short-circuits the rest (`hooks.rs:313-414`). Allow outcomes are merged via `merge_parsed_hook_output`.
- **Progress reporting**: an optional `HookProgressReporter` receives `Started`/`Completed`/`Cancelled` events for UI feedback (`hooks.rs:39-60`).
- **Matchers**: **Not implemented**. Upstream's `{matcher: "Bash", hooks: [{type: "command", command: "..."}]}` shape is not parsed; a flat `string[]` is the only accepted form (`config.rs:766-770`).

## 5. Autonomy Levels

- **`--dangerously-skip-permissions` flag**: parsed in `parse_args`; sets `permission_mode_override = Some(PermissionMode::DangerFullAccess)` (claw-code: `rust/crates/rusty-claude-cli/src/main.rs:691-694`). It bypasses prompting and rule-driven escalation (because `DangerFullAccess >= required_mode` for every built-in tool), but it does **not** bypass deny rules in `permissions.deny`, hook-driven `PermissionOverride::Deny`, or workspace-boundary checks in `PermissionEnforcer::check_file_write` (those evaluate before / orthogonally to the active mode — `permissions.rs:182-189`, `permission_enforcer.rs:108-142`).
- **`--permission-mode <value>` flag**: accepts exactly `read-only | workspace-write | danger-full-access`; any other value is rejected with the message `"unsupported permission mode '<value>'. Use read-only, workspace-write, or danger-full-access."` (`main.rs:1525-1542`, `main.rs:6119`). Aliases like `plan`, `acceptEdits`, `dontAsk`, `auto` are accepted only in settings JSON, not on the CLI (`config.rs:855-858` vs `main.rs:6119`).
- **`permissions.defaultMode` accepted values**: `"default" | "plan" | "read-only" | "acceptEdits" | "auto" | "workspace-write" | "dontAsk" | "danger-full-access"` — anything else returns `ConfigError::Parse("...: unsupported permission mode ...")` (`config.rs:851-863`). Top-level `permissionMode` shares the same parser.
- **Mode-resolution precedence (effective)**: CLI flag (`--dangerously-skip-permissions` or `--permission-mode`) > `RUSTY_CLAUDE_PERMISSION_MODE` env var > merged config (`permissionMode` then `permissions.defaultMode`) > built-in default `DangerFullAccess` (`main.rs:611-693`, `main.rs:1552-1559`).
- **`--allowedTools` interaction**: orthogonal to mode — restricts the tool catalog exposed to the model (`tools/src/lib.rs:192-244`, `main.rs:773-784`); a tool absent from the allowed set is simply not advertised, regardless of mode.
- **`--allow-broad-cwd`**: a separate boolean flag carried through `CliAction::Prompt` (`main.rs:732-735, 752`) — gates broad-cwd handling but does not change `PermissionMode`.
- **Managed / enterprise policy enforcement**: **Not implemented in claw-code at HEAD a389f8d.** No managed-policy file paths, no MDM-style override layer above user settings, and no policy that overrides `--dangerously-skip-permissions`. The PARITY checklist confirms permission scope is limited to `PermissionEnforcer::check`, `check_file_write`, and `check_bash` (claw-code: `PARITY.md:131-143`).
- **Residual gates under DangerFullAccess**: even with the flag set, the loop still runs hooks (`run_pre_tool_use_hook`/`run_post_tool_use_hook`) and any deny rule or hook-deny still produces `PermissionOutcome::Deny` (`conversation.rs:401-445`, `permissions.rs:182-189`). `--dangerously-skip-permissions` is therefore not a true YOLO bypass — it is "skip the prompter and the mode escalation gate."

## Honesty checklist

- Hook event coverage: claw-code implements 3 of the 9 upstream events (`PreToolUse`, `PostToolUse`, `PostToolUseFailure`). The other six are absent from `rust/`.
- Permission modes: 5 internal variants, 3 CLI-reachable; the task.md trio of "default, permissive, auto" does not match the source — those are settings-file aliases, not CLI mode names.
- Settings root: `.claw/`, not `.claude/`. `CLAUDE.md` files are still discovered for prompt assembly (`prompt.rs:213-219`).
- Managed/enterprise policy paths: not present.
- Hook matcher syntax: not present; commands fire unconditionally per event.
- Default permission mode: `DangerFullAccess` — claw-code-specific, diverges from upstream's safer default.
- The Python `src/` is a metadata scaffold; do not cite it as the harness.
