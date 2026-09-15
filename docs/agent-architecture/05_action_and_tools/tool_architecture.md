# Tool Architecture
> Module: 05_action_and_tools | Status: Phase 7 | Last Agent: Phase 7 Specialist Synthesis

## 1. Overview
Tool architecture describes the full lifecycle of a tool from declaration to invocation: how a tool is defined, advertised to the model, gated by permissions, dispatched, and how its result is fed back into the loop. This document specifies the [CLAUDE] tool architecture as the Phase 2 reference; later phases will add Codex's autonomy-gated tools, Cline's per-action approval, AutoGPT's plugin system, OpenCode's TUI-driven tool surface, and Pi Agent's tool-calling runtime.

[CLAUDE] tool architecture is a **typed-spec registry** (`GlobalToolRegistry`) plus a **runtime executor** (`ToolExecutor` trait), connected through the agentic loop's permission gate. The model sees tool definitions as structured JSON schemas via Anthropic's native `tools` field, not as text in the system prompt; tool calls arrive as `ContentBlock::ToolUse { id, name, input }` blocks; tool results are appended as `ContentBlock::ToolResult { tool_use_id, tool_name, output, is_error }` blocks correlated by `tool_use_id` (claw-code: `rust/crates/runtime/src/conversation.rs:375-499`; `session.rs:18-25, 38-43`).

> Naming convention note (from research, Part 1 §2): the upstream task.md asks for "Read, Write, Edit, Bash, Glob, Grep, etc." (Title-cased). The claw-code Rust harness exposes them under snake_case canonical names (`read_file`, `write_file`, `edit_file`, `bash`, `glob_search`, `grep_search`); upstream-style aliases are mapped only at the `--allowedTools` parsing layer (`tools/src/lib.rs:216-224`).

## 2. Blueprint Specification

### `ToolSpec` shape [CLAUDE]
Each built-in tool is declared as a `ToolSpec { name, description, input_schema, required_permission }` (`tools/src/lib.rs:101-106`). The fields:

| Field | Purpose |
| --- | --- |
| `name` | Canonical model-facing name (snake_case for claw-code built-ins; `mcp__server__tool` for MCP-bridged tools). |
| `description` | Free-text description sent to the model alongside the schema. |
| `input_schema` | JSON Schema describing inputs and required fields. |
| `required_permission` | Minimum `PermissionMode` needed to authorize this tool: `ReadOnly`, `WorkspaceWrite`, or `DangerFullAccess`. |

### Three sources of tool definitions [CLAUDE]
The registry composes definitions from three sources, all visible to the model on a single `MessageRequest.tools` field:

1. **Built-in specs** — `tools::mvp_tool_specs()` returns `Vec<ToolSpec>` with **50 live built-in specs** at HEAD `a389f8d` (`tools/src/lib.rs:385-1171`). Citation audit: the repo's top-level `PARITY.md:145-150` claims 40 — that count is stale; treat the source registry as authoritative.
2. **Plugin tools** — registered through plugin manifests; conflict-checked against built-in names.
3. **Runtime MCP tools** — registered via `with_runtime_tools(...)` after MCP server discovery (`tools/src/lib.rs:159-184`). These appear with qualified names `mcp__<server>__<tool>`.

`GlobalToolRegistry::definitions(allowed_tools)` produces the combined `Vec<ToolDefinition>`, applying the optional `--allowedTools` filter (`tools/src/lib.rs:247-278`). The CLI's `filter_tool_specs` delegates to this registry (`main.rs:1608-1612`).

### How tool definitions reach the model [CLAUDE]
The Anthropic-flavored API client puts the registry result into `MessageRequest.tools` with `tool_choice: Auto` when tools are enabled (`AnthropicRuntimeClient::stream`, `main.rs:7518-7526`). The model never sees tool docs as text in the system prompt — they are sent as a structured field on the request body, allowing the provider to marshal them into native tool-use semantics.

### Tool-call dispatch [CLAUDE]
The runtime calls dispatch through two layers:

1. **`ToolExecutor` trait** (`conversation.rs:58`):
   ```
   async fn execute(&mut self, name: &str, input: &str) -> Result<String, ToolError>
   ```
   The CLI binds `CliToolExecutor` (`main.rs:7315-7320, 8735-8756`).

2. **`CliToolExecutor::execute`** dispatches in this order (`main.rs:8693-8731, 8735-8756`):
   - Try `execute_runtime_tool` for runtime/MCP-registered tools first.
   - Fall back to `GlobalToolRegistry::execute(name, input)` for built-ins and plugins (`tools/src/lib.rs:339-349`).

The built-in `MCP`, `ListMcpResources`, and `ReadMcpResource` specs go through `tools::global_mcp_registry()` for execution; for *real* configured MCP servers, the runtime-qualified path `mcp__server__tool` is the production execution route (see `extensibility.md`).

### Built-in catalog summary [CLAUDE]
The 50 built-in specs are grouped by domain (full table in research Part 1 §2):

| Domain | Tools |
| --- | --- |
| File I/O | `read_file`, `write_file`, `edit_file`, `glob_search`, `grep_search`, `NotebookEdit` |
| Command execution | `bash`, `PowerShell`, `REPL` |
| Web | `WebFetch`, `WebSearch` |
| Planning / cognition | `TodoWrite`, `Skill`, `Agent`, `ToolSearch`, `EnterPlanMode`, `ExitPlanMode`, `StructuredOutput`, `AskUserQuestion`, `Sleep`, `SendUserMessage`, `Config` |
| Task registry (bookkeeping) | `TaskCreate`, `RunTaskPacket`, `TaskGet`, `TaskList`, `TaskStop`, `TaskUpdate`, `TaskOutput` |
| Worker harness (external) | `WorkerCreate`, `WorkerGet`, `WorkerObserve`, `WorkerResolveTrust`, `WorkerAwaitReady`, `WorkerSendPrompt`, `WorkerRestart`, `WorkerTerminate`, `WorkerObserveCompletion` |
| Teams / Cron | `TeamCreate`, `TeamDelete`, `CronCreate`, `CronDelete`, `CronList` |
| Editor / language | `LSP` |
| MCP-facing built-ins | `ListMcpResources`, `ReadMcpResource`, `McpAuth`, `MCP` |
| Network / test | `RemoteTrigger`, `TestingPermission` |

### Allowed-tools normalization [CLAUDE]
`normalize_allowed_tools(values)` accepts comma- or whitespace-separated tokens and resolves aliases `read|write|edit|glob|grep` → snake_case canonical names (`tools/src/lib.rs:192-244`). The CLI exposes this through `--allowedTools` / `--allowed-tools` (`main.rs:773-784`). A tool absent from the allowed set is simply not advertised to the model.

### Tool-call shape on the wire [CLAUDE]
- **Outbound** (model → harness): `ContentBlock::ToolUse { id: String, name: String, input: serde_json::Value }`.
- **Inbound** (harness → model, on next iteration): `ContentBlock::ToolResult { tool_use_id: String, tool_name: String, output: String, is_error: bool }`.
- **Wire format for Anthropic**: `convert_messages` maps the harness's `MessageRole::Tool` to provider role `"user"` while preserving the tool-result content block (`main.rs:8793-8831`).

## 3. Logic Flow

1. **Definition load** (once per turn): `GlobalToolRegistry::definitions(allowed_tools)` aggregates built-ins + plugins + runtime MCP, filters by `--allowedTools`, returns `Vec<ToolDefinition>`.
2. **Request construction** (per iteration): `MessageRequest.tools = definitions; tool_choice = Auto`.
3. **Stream parse**: `AssistantEvent::ToolUse { id, name, input }` events become `ContentBlock::ToolUse` blocks in the assistant message.
4. **Permission gate**: `permission_policy.authorize_with_context(name, input, ctx, prompter)` runs (`permissions.rs:175-292`); see `permission_model.md`.
5. **Hook gate**: `run_pre_tool_use_hook` runs before the permission gate proper, can override the decision via `PermissionOverride::{Allow, Deny, Ask}` and may rewrite `input` via `updatedInput`. See `audit_and_observability.md`.
6. **Execute**: `tool_executor.execute(name, input)` runs the tool; returns `Result<String, ToolError>`.
7. **Post-hook**: `run_post_tool_use_hook` (success) or `run_post_tool_use_failure_hook` (error); `merge_hook_feedback` appends labelled hook output to the result.
8. **Append result**: `ConversationMessage::tool_result(tool_use_id, tool_name, output, is_error)` is pushed to `Session::messages`.
9. **Re-enter loop**: next iteration's request includes the tool result; the model decides to continue, retry, or terminate.

## 4. Flowchart
```mermaid
flowchart TD
    Decl[Built-in mvp_tool_specs + plugin tools + runtime MCP tools] --> Reg[GlobalToolRegistry]
    Reg --> Filter[normalize_allowed_tools applied]
    Filter --> Defs[Vec ToolDefinition]
    Defs --> Req[MessageRequest.tools with tool_choice Auto]
    Req --> Model[Model produces ContentBlock::ToolUse]
    Model --> Detect[Detect pending_tool_uses in run_turn]
    Detect --> Pre[run_pre_tool_use_hook]
    Pre --> Gate[permission_policy.authorize_with_context]
    Gate -- Allow --> Exec[CliToolExecutor::execute]
    Gate -- Deny --> Skip[Synthesize deny ToolResult is_error=true]
    Exec --> Try1{Runtime/MCP tool?}
    Try1 -- yes --> RT[execute_runtime_tool]
    Try1 -- no --> Builtin[GlobalToolRegistry::execute -> built-in or plugin]
    RT --> Out[output string]
    Builtin --> Out
    Out --> Post[run_post_tool_use_hook or _failure]
    Post --> Append[Append ContentBlock::ToolResult to Session]
    Skip --> Append
    Append --> Next[Next iteration sees ToolResult]
```

## 5. Sequence Diagram
```mermaid
sequenceDiagram
    participant CLI
    participant Reg as GlobalToolRegistry
    participant Runtime as ConversationRuntime
    participant API as ApiClient
    participant Exec as CliToolExecutor
    participant Tool as built-in or plugin or MCP

    CLI->>Reg: definitions(allowed_tools)
    Reg-->>Runtime: Vec<ToolDefinition>

    loop per iteration
        Runtime->>API: stream(MessageRequest with tools)
        API-->>Runtime: ToolUse{id, name, input}
        Runtime->>Runtime: hook + permission gate
        alt Allowed
            Runtime->>Exec: execute(name, input)
            Exec->>Exec: try execute_runtime_tool first
            alt Runtime/MCP match
                Exec->>Tool: dispatch via runtime registry
            else Built-in or plugin
                Exec->>Reg: GlobalToolRegistry::execute
                Reg->>Tool: built-in handler
            end
            Tool-->>Exec: output
            Exec-->>Runtime: Ok(output) or ToolError
        else Denied
            Runtime->>Runtime: synth deny
        end
        Runtime->>Runtime: append ContentBlock::ToolResult{tool_use_id, output, is_error}
    end
```

## 6. Variations & Trade-offs

| Variation | Benefit | Trade-off |
| --- | --- | --- |
| **Typed `ToolSpec` registry** [CLAUDE] | Schema-validated inputs, model-native rendering, self-documenting catalog. | Adding a tool requires Rust code; no runtime "register a tool from JSON" path for built-ins. |
| **Three-source composition (built-in / plugin / MCP)** [CLAUDE] | Same model-facing surface for all tools; the model doesn't know whether a tool is in-process or over JSON-RPC. | Naming collisions across sources are policed at registration time (`with_runtime_tools` checks; `tools/src/lib.rs:159-184`); silent failures if checks miss. |
| **`tool_choice: Auto`** [CLAUDE] | Lets the model decide whether to call a tool or emit text only — natural termination. | Cannot force a tool call without changing this; no `tool_choice: { type: "tool", name: "X" }` enforcement at HEAD. |
| **Three permission tiers per spec** [CLAUDE] | Tier per tool means a single `PermissionMode` can authorize the whole catalog without per-call config. | Coarse-grained: any `bash` invocation requires `DangerFullAccess` regardless of the actual command; finer gating belongs in deny-rules and hooks. |
| **`--allowedTools` filter** [CLAUDE] | Reduces the model's option space and prompt token cost. | If the user filters out a tool the system prompt assumes is available (e.g. `read_file`), the model may try and fail; harness will deny gracefully but the user-visible flow stalls. |
| **Component-based tool composition** [AUTOGPT] | Tools live as decorated methods on `AgentComponent` subclasses; `_topological_sort` orders components by `run_after()` declarations; `CommandProvider.get_commands` is re-run *every cycle* so commands can be state-dependent (`unload_skill` only appears once a skill is loaded). 18 components wired in `Agent.__init__`. | No central registry; lookup walks `self.commands` in reverse to allow shadowing. Adding a tool requires subclassing a component or modifying an existing one — there is no runtime "register a tool from JSON" path for built-ins. The legacy plugin system (`classic/original_autogpt/plugins/`) is **defunct** in this checkout — empty directory, no `install_plugin_deps` wiring. |
| **Three-tier pipeline retry** [AUTOGPT] | `ComponentEndpointError` retries the same component (3x); `EndpointPipelineError` restarts the whole pipeline (3x) with original args restored via `_selective_copy`; `ComponentSystemError` propagates and is used by `WatchdogComponent` to force a fresh prompt build. | Three separate retry budgets must be reasoned about; pathological retry storms are possible if every component error type is raised. |
| **Pluggable operations objects** [PI] | Every built-in tool accepts a `*Operations` interface (e.g. `BashOperations.exec(command, cwd, options)`) so tools can target SSH, container, or remote backends without changing tool code. Aider and Cline hard-code execution; Pi's design supports remote backends. | Operations interface defines the contract; remote implementations must mirror local semantics (truncation, exit codes, signal handling). |
| **TypeBox schema-first tool definition** [PI] | `parameters: TSchema` is the single source of truth — runtime validation, JSON schema for LLM, and TypeScript types via `Static<TParameters>` all derive from it. | Adding a tool requires TypeBox; not portable to non-TypeScript runtimes. |
| **Order-preserving parallel tool execution** [PI] | Tools execute concurrently (`Promise.all`), but `tool_execution_end` events fire in completion order (live UI progress) while tool-result *messages* are emitted in assistant source order (LLM message-history correctness). Other agents (Aider, Cline) execute sequentially or don't preserve message order. | Two-tier event ordering is novel and requires careful subscriber design; an event ordering bug here would corrupt either UI or message history. |
| **`terminate: true` early-stop hint** [PI] | If every tool result in a batch sets `terminate: true`, the agent stops without another LLM call. Runtime-only — the transcript still shows standard tool results. | Termination is an array-level AND, not OR; mixing terminating and non-terminating tools in one batch keeps the loop running. |
| **Custom message extension via TypeScript declaration merging** [PI] | Apps can inject custom `AgentMessage` types via `declare module "@earendil-works/pi-agent-core" { interface CustomAgentMessages { artifact: {...}; notification: {...} } }`. Custom messages are filtered out by `convertToLlm()` before LLM calls, allowing UI-only message types without per-message `is_llm_visible` flags. | TypeScript declaration merging is the only extension surface; runtime-discovered message types not supported. |
| **Backend-abstracted tool dispatch** [HERMES] | Tool calls are dispatched to one of seven terminal backends (local, Docker, SSH, Singularity, Modal, Daytona, Vercel Sandbox) via a `Backend(ABC)` interface (`tools/backends/`). Each backend implements `execute(command)` and `cleanup()`. This is architecturally comparable to Pi's `*Operations` objects but targets cloud-native runtimes (Modal, Daytona, Singularity) rather than SSH/container parity. | Backend selection adds indirection; each backend must replicate local execution semantics. Cloud backends add network latency and require credential management. |
| **ACP-based tool registration** [ZED] | Tools are registered via Agent Control Protocol (ACP) servers, an emerging protocol for connecting editors to external tool providers. ACP tools appear alongside Zed's built-in tools in the agent panel. This is Zed's alternative to MCP — tighter integration with the editor's entity model but with a smaller ecosystem. | ACP is emerging with limited adoption; MCP has broader ecosystem support. |
| **Two-style plugin system** [OPENCLAW] | OpenClaw supports two plugin styles: **isolated plugins** (run in a separate process/sandbox, communicate over a wire protocol analogous to MCP) and **in-process plugins** (TypeScript modules loaded directly into the agent runtime for lower latency). The 22+ channel adapter abstraction (`adapters/`) uses the same interface pattern, enabling plugins for Telegram, Discord, Slack, etc. | Two plugin styles double the maintenance surface; in-process plugins lose failure isolation. |

## 7. Agent Attribution Table

| Agent | Source-backed contribution |
| --- | --- |
| [CLAUDE] | `ToolSpec { name, description, input_schema, required_permission }` declaration shape; `GlobalToolRegistry` three-source composition (50 built-ins + plugins + runtime MCP); `ToolExecutor::execute` async trait; `CliToolExecutor` runtime/MCP-first dispatch order; `MessageRequest.tools` + `tool_choice: Auto` provider-native delivery; snake_case canonical names + alias resolution at `--allowedTools` boundary; `ContentBlock::ToolUse` / `ContentBlock::ToolResult` correlation via `tool_use_id`. |
| [AUTOGPT] | **Component-based tool architecture** (`classic/forge/forge/agent/components.py`, `protocols.py`, `command/{command,decorator,parameter}.py`) — replaces the defunct legacy plugin system (the `classic/original_autogpt/plugins/` directory exists but is empty in this checkout, and `app/main.py` no longer respects `install_plugin_deps`). Tools are declared as methods on `AgentComponent` subclasses decorated with `@command(names, description, parameters={"name": JSONSchema(...)})`; the decorator builds a `Command(names, description, method, parameters)` object whose `__get__` descriptor re-binds to the instance. `_parameters_match` validates that the decorator's declared parameters exactly match the function signature minus `self` at *class-definition time*. `function_specs_from_commands(...)` (`forge/llm/providers/utils.py`) converts a `list[Command]` into the `CompletionModelFunction` JSON spec sent to the LLM. **No central tool registry** — components implement the `CommandProvider` protocol with `get_commands() -> Iterator[Command]`, and `Agent.commands = await self.run_pipeline(CommandProvider.get_commands)` collects them per cycle (so commands are state-dependent, e.g. `unload_skill` only appears once a skill is loaded). Lookup walks `self.commands` in *reverse* so later-added commands shadow earlier ones (`_get_command`). 18 components are wired in `Agent.__init__`: `SystemComponent`, `ActionHistoryComponent`, `UserInteractionComponent`, `FileManagerComponent`, `CodeExecutorComponent` (Docker container per agent), `GitOperationsComponent`, `ImageGeneratorComponent`, `WebSearchComponent`, `WebPlaywrightComponent`, `ContextComponent`, `TodoComponent`, `ArchiveHandlerComponent`, `ClipboardComponent`, `DataProcessorComponent`, `HTTPClientComponent`, `MathUtilsComponent`, `TextUtilsComponent`, `WatchdogComponent`, `PlatformBlocksComponent` (gated on `PLATFORM_API_KEY`), `SkillComponent`. Three-tier pipeline retry (`ComponentEndpointError` retries the component up to 3x; `EndpointPipelineError` restarts the whole pipeline up to 3x with original args restored; `ComponentSystemError` propagates and is used by `WatchdogComponent` to force a fresh prompt build). |
| [PI] | `AgentTool<TParameters, TDetails>` interface (`packages/agent/src/types.ts:332-355`) extending `Tool<TParameters>` from `pi-ai`: `name`, `description`, `parameters: TSchema` (TypeBox schema-first), `label` (human-readable UI label), `prepareArguments?(args)` compat shim, `execute(toolCallId, params, signal?, onUpdate?) → Promise<AgentToolResult<TDetails>>`, `executionMode?: "sequential" | "parallel"`. `AgentToolResult<T>` shape: `content: (TextContent\|ImageContent)[]` (returned to LLM), `details: T` (arbitrary structured data for UI), `terminate?: boolean` (early-stop hint — when every tool result in a batch has `terminate: true`, the agent stops without another LLM call, runtime-only; transcript still shows standard tool results). **No central tool registry** — tools attached directly to `Agent.state.tools`; the agent loop looks up by name via reverse-walk and emits an error result on miss (`packages/agent/src/agent-loop.ts:536-542`). Two-checkpoint validation: optional `prepareArguments` shim rewrites malformed input first, then `validateToolArguments` enforces the TypeBox schema. **Pluggable operations objects**: each built-in tool accepts a `*Operations` interface (e.g. `BashOperations.exec(command, cwd, options)`) so tools can target SSH, container, or remote backends without changing tool code (`packages/coding-agent/src/core/tools/bash.ts:39-56`). 7 built-in tools in the coding agent: `read`, `bash`, `edit`, `write`, `grep`, `find`, `ls`. Two execution modes: **parallel** (default) preflights all tools, runs async-ready ones in `Promise.all`, emits `tool_execution_end` events as each tool *finishes* (completion order) but emits tool-result *messages* in **assistant source order** so UI can show progress live while LLM message ordering is preserved; **sequential** prepares-executes-finalizes one tool before the next. Per-tool hooks: `beforeToolCall(toolCall, args, assistantMessage, context) → { block?, reason? }` runs after argument validation; `afterToolCall(...)` can override `content`, `details`, `isError`, `terminate` per-field (no deep merge). Errors are caught and wrapped as `{ content: [error message], isError: true }`. |

### Pi tool-call dispatch [PI]
```mermaid
flowchart TD
    LLM[LLM streams toolcall_delta events] --> Parse[Parse tool_calls from assistant message]
    Parse --> Mode{toolExecution mode?}
    Mode -- parallel --> Pre[Sequential preflight:<br/>prepareArguments → schema validation → beforeToolCall]
    Pre --> Block{beforeToolCall blocks?}
    Block -- yes --> Imm[Immediate error result]
    Block -- no --> Async{Async ready?}
    Async -- yes --> Batch[Add to Promise.all batch]
    Async -- no --> Imm
    Batch --> Gather[Promise.all dispatch<br/>concurrent execution]
    Gather --> Done[tool_execution_end events fire as each tool finishes]
    Done --> Order[Emit tool-result messages in<br/>assistant source order]
    Mode -- sequential --> Seq[For each tool:<br/>prepare → execute → finalize → next]
    Seq --> Done2[Emit tool_execution_end + result message immediately]
    Order --> After[afterToolCall: per-field merge of<br/>content, details, isError, terminate]
    Done2 --> After
    After --> Term{All results terminate=true?}
    Term -- yes --> Stop[Stop agent without another LLM call]
    Term -- no --> Next[Next iteration]
    Imm --> After
```

### Component-based tool registration [AUTOGPT]
```mermaid
flowchart TD
    Decorator["@command(names, description, parameters={'name': JSONSchema(...)})"] --> Build[Decorator builds Command object<br/>_parameters_match validates signature at class-definition time]
    Build --> Comp[Method lives on AgentComponent subclass]
    Comp --> Init[Agent.__init__ instantiates 18 components]
    Init --> Topo[AgentMeta.__call__ calls _collect_components<br/>_topological_sort via run_after declarations]
    Topo --> Cycle[Each cycle: Agent.commands = await run_pipeline CommandProvider.get_commands]
    Cycle --> Reverse[_get_command walks self.commands in reverse<br/>later-added commands shadow earlier]
    Reverse --> Specs[function_specs_from_commands → CompletionModelFunction JSON for LLM]
    Specs --> LLM[MultiProvider sends native function/tool calls]
    LLM --> Lookup[Match toolCall.name to Command]
    Lookup --> Exec[Command.method invoked with kwargs from arguments]
    Exec --> Wrap[ActionSuccessResult or ActionErrorResult.from_exception]
    Wrap --> Pipeline[Three-tier pipeline retry on ComponentEndpointError / EndpointPipelineError]
```

> [AIDER]'s edit-format-as-tools (whole/diff/udiff/search-replace) is documented in `code_modification.md`; [BABYAGI] has no first-class tool layer and is intentionally absent from this module. Phase 5's [OPENCODE] TUI-driven tool surface is documented in `08_user_interaction/output_formatting.md`.

### [HERMES] Backend Dispatch
```mermaid
flowchart TD
    TC[Tool call from LLM] --> BK{Backend type?}
    BK -- local --> L[Local shell execution]
    BK -- docker --> D[Docker container execution]
    BK -- ssh --> S[SSH remote execution]
    BK -- singularity --> SG[Singularity container]
    BK -- modal --> M[Modal serverless execution]
    BK -- daytona --> DT[Daytona sandbox]
    BK -- vercel --> V[Vercel Sandbox]
    L --> R[Collect output + exit code]
    D --> R
    S --> R
    SG --> R
    M --> R
    DT --> R
    V --> R
    R --> Mem[Update persistent memory if needed]
    Mem --> Cur{Curator: notable completion?}
    Cur -- yes --> SK[Auto-create/refine skill]
    Cur -- no --> Next[Return result to agent loop]
    SK --> Next
```

## 8. Repository Implementations

### Roo-Code
- **Mode-Gated Tool Surface**: Tool definitions are dynamically filtered per turn based on the active mode (e.g., `code`, `architect`, `ask`). The `filterToolsForMode` function computes the intersection of available native tools and the current mode's allowed tool groups (e.g., `read`, `edit`, `command`, `mcp`), meaning the model's schema shrinks or expands depending on its persona.
- **Boomerang Delegation**: The `new_task` tool allows the current mode to spawn a sub-task, delegating work to another mode (e.g., Architect delegating to Code) and returning the result back.
