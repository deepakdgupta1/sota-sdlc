# Cline — Architecture Research Report

> **Agent:** `[CLINE]` | **Phase:** 4 | **Source:** `./cline/` (verified against HEAD `5fe6c9a`)
> **Researcher:** Antigravity | **Date:** 2026-04-28

---

## 1. Core Loop

### 1.1 High-Level Flow

Cline is an **IDE-embedded autonomous coding agent** implemented as a VS Code extension. Its core loop is a recursive, tool-use-driven cycle:

```
User Input → Task Creation → System Prompt Assembly → LLM API Call →
Stream Response → Parse Tool Uses → Present to User (ask/say) →
Human Approval/Auto-Approve → Tool Execution → Collect Results →
Append to Conversation → Next LLM API Call → ... → attempt_completion
```

### 1.2 Entry Points

The loop has two entry points in `src/core/task/index.ts`:

1. **`startTask(task, images, files)`** — New task. Clears conversation history, wraps user input in `<task>` XML tags, runs `TaskStart` and `UserPromptSubmit` hooks, then calls `initiateTaskLoop()`.
2. **`resumeTaskFromHistory()`** — Resumes from saved state. Loads persisted `clineMessages` and `apiConversationHistory` from disk, presents a resume button, then re-enters `initiateTaskLoop()`.

### 1.3 The Recursive Loop: `initiateTaskLoop` → `recursivelyMakeClineRequests`

```typescript
// Simplified from src/core/task/index.ts
private async initiateTaskLoop(userContent: ClineContent[]): Promise<void> {
    let nextUserContent = userContent
    while (!this.taskState.abort) {
        const didEndLoop = await this.recursivelyMakeClineRequests(nextUserContent)
        if (didEndLoop) break
        // If no tools were used, nudge the LLM to use attempt_completion
        nextUserContent = [{ type: "text", text: formatResponse.noToolsUsed() }]
        this.taskState.consecutiveMistakeCount++
    }
}
```

**`recursivelyMakeClineRequests`** performs one full API round-trip:

1. **Context Loading** — Parses `@mentions`, resolves slash commands, builds environment details (OS, shell, cwd, open tabs, workspace structure).
2. **Compaction Check** — If context window is near capacity, triggers `summarize_task` tool or standard truncation.
3. **System Prompt Assembly** — Calls `getSystemPrompt()` which uses a registry-based prompt builder with variant support.
4. **API Request** — Calls `attemptApiRequest()` which waits for MCP servers, assembles the full prompt context, and streams the LLM response.
5. **Stream Processing** — Iterates over chunks, parsing them into `AssistantMessageContent` blocks (text or tool_use) via `parseAssistantMessageV2()`.
6. **Presentation** — Each block is presented via `presentAssistantMessage()`:
   - **Text blocks** → displayed in chat UI via `say("text", content)`.
   - **Tool-use blocks** → delegated to `ToolExecutor.executeTool(block)`.
7. **Result Collection** — Tool results are accumulated in `taskState.userMessageContent[]`.
8. **Loop Continuation** — After all blocks are processed, the accumulated tool results become the next user message and the loop repeats.

### 1.4 Stream Processing Pipeline

```
API Stream → StreamResponseHandler → parseAssistantMessageV2() →
AssistantMessageContent[] → StreamChunkCoordinator →
TaskPresentationScheduler → presentAssistantMessage()
```

The `TaskPresentationScheduler` batches UI updates with configurable cadence (faster for local, slower for remote workspaces). It uses priority levels: `"immediate"` for first visible content and tool transitions, `"normal"` for ongoing text streaming.

### 1.5 Termination Conditions

The loop ends when:
- The LLM calls `attempt_completion` → user sees completion result
- User aborts → `abortTask()` with 7-phase cleanup
- Consecutive mistake limit reached (configurable `maxConsecutiveMistakes`)
- YOLO mode + too many mistakes → automatic failure
- Context window exhausted with no truncatable messages

---

## 2. Human-in-the-Loop Model

### 2.1 The ask/say Paradigm

Cline's approval model is built on two communication primitives:

- **`say(type, text, images, files, partial)`** — One-way message to the user (informational). Does NOT block execution.
- **`ask(type, text, partial)`** — Two-way message that **blocks until the user responds**. The method uses `pWaitFor()` to poll `taskState.askResponse` every 100ms.

**Ask types** (approval boundaries):
| Ask Type | When Triggered | User Options |
|---|---|---|
| `tool` | File, read/search/list, web, and other tool proposals shown through the generic tool UI | Approve / Reject / Edit where applicable |
| `command` | Shell command proposed | Approve / Reject |
| `command_output` | Running command requests/receives additional output | Provide output / Continue |
| `browser_action_launch` | Browser launch requested | Approve / Reject |
| `use_mcp_server` | MCP server/tool use requires approval | Approve / Reject |
| `use_subagents` | Subagent delegation requested | Approve / Reject |
| `completion_result` | Task completion proposed | Accept / Provide Feedback |
| `api_req_failed` | API error occurred | Retry / Cancel |
| `mistake_limit_reached` | Too many errors | Provide Guidance / Cancel |
| `resume_task` | Resuming from history | Resume / Cancel |
| `resume_completed_task` | Resuming a task already marked complete | Resume / Start New Task / Cancel |
| `followup` | LLM asks a question | Respond |
| `plan_mode_respond` | Plan Mode response shown to user | Send feedback / choose option / switch to Act Mode |
| `act_mode_respond` | Act Mode progress message | Non-blocking display |
| `new_task` | New-task context proposal | Create New Task / Keep Chatting / Feedback |
| `condense` | Manual context condensation proposal | Accept condensation / Feedback |
| `summarize_task` | Automatic context compaction summary | Records summary/compaction result |
| `report_bug` | Bug report proposal | Open GitHub issue / Feedback |

### 2.2 Per-Action Approval Flow

For each **approval-gated tool use** (file read/write/edit, command, browser action, MCP/web/subagent use when applicable), Cline:

1. **Streams partial blocks** to show the user what's being proposed in real-time (via `handlePartialBlock`)
2. **On block completion**, checks auto-approve settings
3. If NOT auto-approved → calls `ask()` which renders an approval UI in the webview
4. **Blocks** until the user clicks Approve, Reject, or provides feedback
5. If rejected → sets `taskState.didRejectTool = true`, all subsequent tool blocks in the same turn are skipped
6. If approved → executes the tool, runs pre/post hooks

### 2.3 Auto-Approval Modes

Cline provides granular auto-approval via the `AutoApprove` class (`src/core/task/tools/autoApprove.ts`):

| Mode | Behavior |
|---|---|
| **YOLO Mode** (`yoloModeToggled`) | Auto-approves ALL tools — reads, writes, commands, browser, MCP |
| **Auto-Approve All** (`autoApproveAllToggled`) | Same as YOLO but separate toggle |
| **Granular Settings** (`autoApprovalSettings`) | Per-category: `readFiles`, `editFiles`, `executeSafeCommands`, `executeAllCommands`, `useBrowser`, `useMcp` |
| **Path-Aware** | Distinguishes local workspace files vs external files (separate `editFilesExternally` toggle) |
| **MCP Per-Tool** | Individual MCP tools can be marked `autoApprove` in `mcp_settings.json` |

### 2.4 Notification System

When an `ask` blocks, Cline can emit:
- **VS Code notifications** — desktop-level alerts when approval is needed
- **Notification hooks** — `Notification` hook events for user-attention and task-complete notifications
- **User prompt hooks** — `UserPromptSubmit` can validate or enrich submitted user text before it enters the loop
- **Sound notifications** — configurable audio alerts

---

## 3. Tool System

### 3.1 Architecture

Tools are defined in `ClineDefaultTool` enum (`src/shared/tools.ts`) and registered via a **coordinator pattern**:

```
ToolExecutor → ToolExecutorCoordinator → IFullyManagedTool handlers
```

- `ToolExecutor` — owned by `Task`, routes tool blocks to the coordinator
- `ToolExecutorCoordinator` — registry mapping tool names to handlers
- Individual `*Handler` classes — each implements `IFullyManagedTool` with `execute()` and optional `handlePartialBlock()`

### 3.2 Complete Tool Catalog

The runtime registry is `ClineDefaultTool`, but the model-facing parameter surface comes from `src/core/prompts/system-prompt/tools/*` and can vary by model family, provider settings, and feature flags. Parameters marked `*` are required. `task_progress` is the focus-chain checklist parameter; it is included only when the `focus_chain` dependency is enabled by the prompt context.

| Tool Name | Handler / Surface | Parameters | Description / Availability |
|---|---|---|---|
| `execute_command` | `ExecuteCommandToolHandler` | `command*`, `requires_approval*`, `timeout` | Run shell commands. `timeout` is exposed only in the generic/YOLO-aware variant. |
| `read_file` | `ReadFileToolHandler` | `path*`, `start_line`, `end_line`, `task_progress` | Read file contents with optional line range. |
| `write_to_file` | `WriteToFileToolHandler` | `path*` or `absolutePath*`, `content*`, `task_progress` | Create or overwrite files. Native next-gen/GPT-5 variants use `absolutePath`; generic XML variants use `path`. |
| `replace_in_file` | `SharedToolHandler` -> `WriteToFileToolHandler` | `path*` or `absolutePath*`, `diff*`, `task_progress` | Search/replace edits in existing files. Native next-gen/GPT-5 variants use `absolutePath`. |
| `apply_patch` | `ApplyPatchHandler` | `input*`, `task_progress` | Apply Cline's custom patch format. Available for GPT-5/GPT-OSS model contexts. |
| `search_files` | `SearchFilesToolHandler` | `path*`, `regex*`, `file_pattern`, `task_progress` | Regex search across files, backed by ripgrep. |
| `list_files` | `ListFilesToolHandler` | `path*`, `recursive`, `task_progress` | List directory contents. |
| `list_code_definition_names` | `ListCodeDefinitionNamesToolHandler` | `path*`, `task_progress` | Tree-sitter-based symbol listing. |
| `browser_action` | `BrowserToolHandler` | `action*`, `url`, `coordinate`, `text` | Puppeteer browser actions. `url` is for `launch`, `coordinate` for `click`, and `text` for `type`. |
| `ask_followup_question` | `AskFollowupQuestionToolHandler` | `question*`, `options`, `task_progress` | Ask the user for missing information. |
| `attempt_completion` | `AttemptCompletionHandler` | `result*`, `command`, `task_progress` | Present final result; may optionally include a demo command. |
| `use_mcp_tool` | `UseMcpToolHandler` | `server_name*`, `tool_name*`, `arguments*`, `task_progress` | Invoke a tool from a connected MCP server by name. |
| `access_mcp_resource` | `AccessMcpResourceHandler` | `server_name*`, `uri*`, `task_progress` | Read an MCP resource. |
| `load_mcp_documentation` | `LoadMcpDocumentationHandler` | none | Load Cline's MCP server authoring docs; exposed only when `mcpHub` exists. |
| `web_fetch` | `WebFetchToolHandler` | `url*`, `prompt*`, `task_progress` | Fetch and analyze a URL. Exposed for Cline provider web tools; MCP web-fetch tools are preferred when present. |
| `web_search` | `WebSearchToolHandler` | `query*`, `allowed_domains`, `blocked_domains`, `task_progress` | Web search with optional domain allow/block filters. Exposed for Cline provider web tools; `allowed_domains` and `blocked_domains` are mutually exclusive. |
| `new_task` | `NewTaskHandler` | `context*` | Create a new task with preloaded continuation context. |
| `use_subagents` | `UseSubagentsToolHandler` | `prompt_1*`, `prompt_2`, `prompt_3`, `prompt_4`, `prompt_5` | Run up to five in-process subagents in parallel when subagents are enabled. |
| configured subagent tools | dynamic `SharedToolHandler` -> `UseSubagentsToolHandler` | `prompt*` | If configured subagents exist, Cline can surface each as a dedicated native tool name instead of the generic `use_subagents` shape. |
| `use_skill` | `UseSkillToolHandler` | `skill_name*` | Load and apply a configured Cline skill. |
| `summarize_task` | `SummarizeTaskHandler` | `context*`, `task_progress` | Automatic context compaction summary. May run `PreCompact` before applying truncation. |
| `condense` | `CondenseHandler` | `context*`, `task_progress` | Manual `/smol` or `/compact` conversation condensation. |
| `plan_mode_respond` | `PlanModeRespondHandler` | `response*`, `needs_more_exploration`, `task_progress` | Respond in Plan Mode; some native variants omit `needs_more_exploration`. |
| `act_mode_respond` | `ActModeRespondHandler` | `response*`, `task_progress` | Progress/preamble response in Act Mode for native-tool models. |
| `new_rule` | `SharedToolHandler` -> `WriteToFileToolHandler` | `path*`, `content*` | Slash-command-only tool for creating `.clinerules/*.md` rule files. |
| `report_bug` | `ReportBugHandler` | `title*`, `what_happened*`, `steps_to_reproduce*`, `api_request_output*`, `additional_context*` | Slash-command-only tool for preparing a Cline GitHub bug report. The slash command text describes the last two as optional, but the handler currently rejects missing values. |
| `generate_explanation` | `GenerateExplanationToolHandler` | `title*`, `from_ref*`, `to_ref` | Opens a multi-file diff explanation view; not exposed in CLI environments. |
| `focus_chain` | placeholder dependency, no runtime handler | none | Not an executable tool. It is registered with an empty description so other tools can conditionally include `task_progress`. |
| MCP native dynamic tools | normalized to `UseMcpToolHandler` | server-defined JSON Schema parameters | When native tool calling is enabled, MCP server tools can also be registered directly as `<server.uid>__cline_mcp_tool__<tool>`, preserving each server tool's input schema. |

### 3.3 Tool Execution Flow

```
ToolExecutor.execute(block)
  → Check didRejectTool (skip if prior rejection)
  → Check didAlreadyUseTool (if parallel calling disabled)
  → Check strict plan-mode restrictions when enabled (FILE_NEW, FILE_EDIT, APPLY_PATCH blocked)
  → Close browser if non-browser tool
  → If partial → handlePartialBlock (UI only)
  → If complete → handleCompleteBlock:
      → coordinator.execute(config, block) → handler.execute()
      → pushToolResult()
      → Loop detection (checkRepeatedToolCall)
      → PostToolUse hook
```

### 3.4 Plan/Act Mode

Cline has two modes:
- **Plan Mode** — Exploration/planning mode. When `strictPlanModeEnabled` is on, file modification tools (`write_to_file`, `replace_in_file`, `apply_patch`, `new_rule`) are blocked and the model must switch modes before editing.
- **Act Mode** — All tools available.

The LLM presents plans through `plan_mode_respond`; the user can respond, select an option, or switch the task to Act Mode from that blocking ask. `act_mode_respond` is the non-blocking Act Mode progress/preamble tool and is guarded against consecutive narration loops.

### 3.5 Parallel Tool Calling

When enabled (via settings or model capability), multiple tools can execute in a single turn. When disabled, `didAlreadyUseTool` flag prevents more than one tool per turn.

---

## 4. Browser Automation

### 4.1 Architecture

Browser automation is implemented via Puppeteer in `src/services/browser/BrowserSession.ts`. It supports:

- **Local headless browser** — Launches Chrome/Chromium in headless `"shell"` mode
- **Remote browser** — Connects to an existing Chrome instance via WebSocket (Chrome DevTools Protocol)
- **Auto-discovery** — If no remote host is configured, tries Chrome's debug endpoint on `localhost` and `127.0.0.1`

### 4.2 Browser Actions

| Action | Method | Description |
|---|---|---|
| `launch` | `launchBrowser()` + `navigateToUrl(url)` | Start browser and navigate to URL |
| `click` | `click(coordinate)` | Click at x,y coordinate |
| `type` | `type(text)` | Type text via keyboard |
| `scroll_down` | `scrollDown()` | Scroll page down by 600px |
| `scroll_up` | `scrollUp()` | Scroll page up by 600px |
| `close` | `closeBrowser()` | Close browser session |

### 4.3 Screenshot-Driven Interaction

After every action, `doAction()`:
1. Attaches console log and page error listeners
2. Executes the action
3. Waits for console log inactivity (500ms quiet period, 3s timeout)
4. Takes a **screenshot** (WebP or PNG based on model support)
5. Returns `BrowserActionResult`: `{ screenshot, logs, currentUrl, currentMousePosition }`

The screenshot is sent back to the LLM as an image content block, enabling **visual reasoning**. The LLM sees what the page looks like and decides what to click/type next. This is the core of Cline's "Computer Use" capability.

### 4.4 Browser Discovery

`BrowserDiscovery.ts` provides:
- Localhost-only discovery for Chrome's debug port (`9222`) via `localhost` and `127.0.0.1`
- WebSocket endpoint discovery via the Chrome DevTools `/json/version` endpoint
- Cached WebSocket endpoint reuse in `BrowserSession` for recent remote connections (1-hour TTL)

### 4.5 Stability Mechanisms

- `waitTillHTMLStable()` — Polls page HTML size every 500ms, waits for 3 consecutive identical readings before considering the page loaded
- Network activity detection on click — if click triggers network requests, waits for navigation completion
- Automatic fallback from remote to local browser on connection failure

---

## 5. MCP Client

### 5.1 Architecture

Cline's MCP implementation is in `src/services/mcp/McpHub.ts` — a centralized hub managing multiple MCP server connections.

### 5.2 Server Configuration

MCP servers are configured via a JSON settings file (watched by chokidar for live reload):

```json
{
  "mcpServers": {
    "server-name": {
      "type": "stdio" | "sse" | "streamableHttp",
      "transportType": "...", // legacy field accepted and normalized
      "command": "...",      // for stdio
      "args": ["..."],       // for stdio
      "cwd": "...",          // for stdio
      "url": "...",          // for sse/streamableHttp
      "headers": {},         // for sse/streamableHttp
      "env": {},             // environment variables
      "disabled": false,
      "autoApprove": ["tool1", "tool2"],
      "timeout": 60,
      "remoteConfigured": false
    }
  }
}
```

Environment variables support `${env:VAR_NAME}` expansion syntax.

### 5.3 Transport Support

| Transport | Implementation | Status |
|---|---|---|
| **stdio** | `StdioClientTransport` | Full support with stderr piping |
| **SSE** | `SSEClientTransport` | Full support with `ReconnectingEventSource` |
| **Streamable HTTP** | `StreamableHTTPClientTransport` | Full support with reconnection handler |

### 5.4 Connection Lifecycle

```
watchMcpSettingsFile() → initializeMcpServers() →
  for each server: connectToServer(name, config) →
    Create Client → Create Transport → client.connect(transport) →
    Handle OAuth if UnauthorizedError →
    Fetch tools/resources/prompts/resourceTemplates →
    Register notification handler
```

### 5.5 Tool Surfacing

MCP tools appear alongside native Cline tools. The `McpHub` generates unique short keys (6-char nanoid prefixed with `c`) for each server to keep tool names compact. In XML-style prompting they are invoked via `use_mcp_tool`, which delegates to `McpHub.callTool()`. When native tool calling is enabled, MCP server tools may also be converted into direct provider tool specs with names containing `__cline_mcp_tool__`; the coordinator normalizes those names back to `UseMcpToolHandler`.

### 5.6 Enterprise Controls

- `blockPersonalRemoteMCPServers` — Only allow remote MCP servers from approved URL list
- `mcpMarketplaceEnabled` — Toggle for local MCP server marketplace
- `allowedMCPServers` — Allowlist of permitted server IDs

---

## 6. Context Management

### 6.1 System Prompt Assembly

The system prompt is built via a **registry + variant + template** architecture:

```
PromptRegistry → PromptBuilder → TemplateEngine → variants
```

The `SystemPromptContext` includes:
- Working directory, IDE info, provider/model info
- MCP hub (for tool descriptions)
- Available skills
- Focus chain settings
- Rules: global `.clinerules`, local `.clinerules`, Cursor rules, Windsurf rules, agent rules
- `.clineignore` restrictions
- Preferred language instructions
- Browser settings, subagent settings
- Editor tabs (open/visible)

### 6.2 Conversation History Management

- **API conversation history** — The actual messages sent to the LLM API
- **Cline messages** — The full UI message history (includes partial messages, metadata)
- **Deleted range** — `conversationHistoryDeletedRange: [start, end]` for truncation without losing persistence

### 6.3 Context Window Strategies

1. **Standard Truncation** — When context window is exceeded, removes a quarter of the conversation from the deleted range
2. **Auto-Condense** (`summarize_task`) — When context is near capacity, triggers the LLM to generate a comprehensive summary, then masks the old messages
3. **File Read Optimization** — Before compacting, attempts to rewrite file-read results to save tokens
4. **Token Tracking** — Each API request tracks input/output/cache tokens for cost monitoring

### 6.4 Mentions and Slash Commands

User input is pre-processed for:
- **`@url`** — Fetches URL content and injects as markdown
- **`@problems`** — Injects VS Code diagnostics (errors/warnings)
- **`@file`** / **`@folder`** — Injects file/folder contents
- **Slash commands** — built-ins include `/newtask`, `/smol`, `/compact`, `/newrule`, `/reportbug`, `/deep-planning`, and `/explain-changes`
- **Workflow commands** — custom Markdown workflows are loaded from `.clinerules/workflows/`, with local workflows taking precedence over global workflows, then remote workflows

### 6.5 Rules System

Cline supports multiple rule sources, all injected into the system prompt:
- **Global `.clinerules/`** — User-level rules directory
- **Local `.clinerules/`** — Project-level rules directory
- **Conditional rules** — Rules with conditions evaluated against context (file patterns, workspace state)
- **External rules** — `.cursorrules`, `.windsurfrules`, `.agents/` (compatibility with other tools)
- **`.clineignore`** — gitignore-style patterns for files Cline cannot access

### 6.6 Checkpoints

Cline creates git-based checkpoints when checkpoints are enabled and a checkpoint manager is available:
- Initializes and commits an initial checkpoint before the first API request
- Saves checkpoints after tool execution batches and on task completion
- Users can compare (diff) or restore to any checkpoint
- Implemented via `ICheckpointManager` abstraction
- Disabled/error surfaced when checkpoint support is unavailable, including current multi-root workspace limitations

---

## 7. Hooks System

### 7.1 Hook Lifecycle Events

| Hook | When | Cancellable | Purpose |
|---|---|---|---|
| `TaskStart` | Before first API call | Yes | Custom initialization, context injection |
| `TaskResume` | When user clicks Resume | Yes | Restore state on resume |
| `TaskCancel` | When task is aborted | No | Cleanup, logging |
| `TaskComplete` | After the user confirms completion | No | Completion logging/integration |
| `UserPromptSubmit` | Before user message is sent | Yes | Input validation, context enrichment |
| `PreToolUse` | After approval, before execution | Yes | Gate tool execution |
| `PostToolUse` | After tool execution | Yes, after-the-fact | Logging, validation, optional task cancellation; it cannot undo the already executed tool |
| `Notification` | User-attention/task-complete notification events | No | Observation-only external notification integration |
| `PreCompact` | Before context truncation | Yes | Custom compaction logic |

### 7.2 Hook Execution

Hooks are executed via `executeHook()` which:
- Spawns an external process (the hook script)
- Pipes JSON input (hook name, parameters, model context)
- Reads JSON output (cancel, contextModification, errorMessage)
- Supports abort via `AbortController`
- Shows hook status in the UI via `hook_status` and `hook_output_stream` messages

### 7.3 Context Modification

Hooks can inject context into the conversation via `contextModification` output:
```xml
<hook_context source="PreToolUse" type="workspace_rules">
  Additional instructions injected by the hook
</hook_context>
```

---

## 8. Command Permission System

### 8.1 Architecture

The `CommandPermissionController` (`src/core/permissions/CommandPermissionController.ts`) validates shell commands against configurable allow/deny rules.

### 8.2 Configuration

Via `CLINE_COMMAND_PERMISSIONS` environment variable:
```json
{
  "allow": ["npm *", "git *", "echo *"],
  "deny": ["rm -rf *", "sudo *"],
  "allowRedirects": false
}
```

### 8.3 Evaluation Rules

1. Parse command into segments (split by `&&`, `||`, `|`, `;`)
2. Detect dangerous characters (backticks outside single quotes, newlines outside quotes)
3. Check for redirect operators (`>`, `>>`, `<`) — blocked unless `allowRedirects: true`
4. Validate **each segment** against deny rules (first, takes precedence), then allow rules
5. Recursively validate subshell contents `(...)` and `$(...)`
6. No rules defined → allow everything (backward compatibility)

---

## 9. Unique/Novel Patterns

### 9.1 Per-Action Approval as Default

Unlike Claude Code's "permissive" or "auto" modes, Cline defaults to **per-action human approval** for every file write and command execution. This is the most conservative approval model in the agent landscape.

### 9.2 Screenshot-Driven Browser Use

Cline's browser automation is **vision-based** — the LLM receives screenshots and reasons about coordinates to click. This contrasts with DOM-based approaches and requires models with image understanding.

### 9.3 Streaming Partial Tool Presentation

Cline shows tool parameters **as they stream** from the LLM. Users can see what file will be written or what command will be run before the LLM finishes generating. This is implemented via the `handlePartialBlock` / `handleCompleteBlock` split.

### 9.4 Loop Detection

The `checkRepeatedToolCall()` function detects when the LLM is calling the same tool with identical parameters repeatedly:
- **Soft warning** at `LOOP_DETECTION_SOFT_THRESHOLD` — injects a warning into context
- **Hard escalation** — forces the mistake limit to trigger user intervention

### 9.5 Focus Chain (TODO List)

Focus Chain is modeled as a placeholder tool dependency rather than a normal executable handler. When enabled, the prompt builder exposes a `task_progress` parameter on many tools, and tool execution updates the living checklist from that parameter. This gives the user real-time visibility into the agent's task model without requiring a separate `focus_chain` tool call.

### 9.6 IDE-Native Diff View

File edits are shown in VS Code's native diff editor, allowing users to **edit the LLM's proposed changes** directly before accepting them. This is a unique UX pattern not available in terminal-based agents.

### 9.7 Multi-Root Workspace Support

Cline supports VS Code's multi-root workspaces, with path resolution via `@workspace:path` syntax and workspace-aware auto-approval (checking if files are in any workspace root).

---

## 10. Architecture Comparison Notes

| Dimension | Cline | Claude Code | Aider | Codex |
|---|---|---|---|---|
| **Environment** | IDE (VS Code extension) | Terminal CLI | Terminal CLI | Sandboxed cloud |
| **Default Approval** | Per-action (every tool) | Default mode (some auto) | Implicit (auto-commit) | Autonomy levels |
| **Browser** | Puppeteer (screenshot-based) | None (delegate to sub-agent) | None | None |
| **MCP** | Full client (stdio, SSE, HTTP) | Full client | None | None |
| **Context Mgmt** | Truncation + auto-condense | Truncation + compaction | Repo-map (tree-sitter) | Sandboxed context |
| **Edit Format** | Diff view in editor | Search/replace blocks | Multiple (whole/diff/udiff) | Patches |
| **Hooks** | 9 lifecycle events | 3 events (pre/post/notification) | None | None |
| **Checkpoints** | Git-based snapshots | None built-in | Git auto-commit | Sandbox snapshots |
