# Pi Agent — Research Report
> Tag: [PI] | Source: pi-mono @ HEAD 3d5cbe98c3bc67ef8433bdeee45fbe5f0d8a24db | Phase 6

## 1. Core Loop

The interactive coding agent loop is implemented via two complementary entry points: `agentLoop()` for new prompts and `agentLoopContinue()` for resuming from existing context. Both funnel into a unified `runLoop()` that manages message queuing, LLM calls, tool execution, and steering/follow-up injection.

### Entry Points (packages/agent/src/agent-loop.ts)

**`agentLoop(prompts, context, config, signal?, streamFn?)`** initializes a new run:
- Adds new prompt messages to the context (line 103)
- Emits lifecycle events: `agent_start`, `turn_start`, messages for each prompt, then enters `runLoop`
- Returns an `EventStream<AgentEvent, AgentMessage[]>` that yields events and resolves with all messages added during the run

**`agentLoopContinue(context, config, signal?, streamFn?)`** resumes without a new message:
- Validates the last message is not "assistant" (line 74)
- Calls `runLoop` directly without adding messages
- Used for retries after errors or when steering queues still have work

### Main Loop Logic (agent-loop.ts:155-246)

`runLoop()` implements a dual-loop structure with outer and inner scopes:

**Outer loop** (line 168): Continues when follow-up messages arrive after the agent would naturally stop.

**Inner loop** (line 172): Processes one turn consisting of:
1. Steering message injection (line 180-187): If pending messages exist, they're added to context before the LLM call
2. Stream assistant response via `streamAssistantResponse()` (line 191)
3. Parse tool calls from the response (line 201)
4. Execute tool calls (line 206), collecting results
5. Check `shouldStopAfterTurn` callback (line 218)
6. Poll for steering messages (line 230)

If no more tool calls and no steering messages, the loop checks for follow-up messages. If found, they become pending and the inner loop continues. Otherwise, the run terminates.

### LLM Streaming (agent-loop.ts:252-345)

`streamAssistantResponse()` bridges `AgentMessage[]` to the LLM:

1. **Transform context** (line 261): Optional user-provided transformation (e.g., pruning old messages)
2. **Convert to LLM format** (line 266): Mandatory `convertToLlm()` filters out custom message types and yields only `user`, `assistant`, `toolResult`
3. **Build LLM context** (line 269-273): Combine systemPrompt, converted messages, and tools into a `Context` object
4. **Resolve API key** (line 278-279): Dynamic key resolution for expiring OAuth tokens
5. **Stream from provider** (line 281): Call `streamFn` (default: `streamSimple` from `pi-ai`) and iterate events

Events from the provider are classified and re-emitted:
- `start`: Partial assistant message added to context (line 293-296)
- `text_delta`, `toolcall_delta`, etc.: Update the partial message in-place (line 308-316)
- `done`/`error`: Finalize, emit `message_end` (line 319-331)

### Tool Execution (agent-loop.ts:350-662)

Tool calls are dispatched based on `toolExecution` mode:

**Parallel mode** (line 424-483, default):
- Tool calls are preflighted sequentially: each call is validated and `beforeToolCall` is invoked (line 442)
- If preparation fails, tool becomes "immediate" (line 443-451)
- Async-ready calls enter a Promise.all batch (line 454)
- Tool execution order is concurrent; `tool_execution_end` events fire as each tool finishes (line 464)
- Tool-result message events are emitted after all tools complete, in assistant source order (line 472-476)

**Sequential mode** (line 372-422):
- Each tool call is prepared, executed, and finalized before the next one starts (line 383-415)
- `tool_execution_end` and tool-result messages are emitted immediately after each tool

#### Per-Tool Hooks

**`beforeToolCall`** (line 548-564): Runs after argument validation. Returns `{ block: true, reason?: string }` to prevent execution and emit an error result. Receives toolCall, validated args, assistantMessage, and context.

**`afterToolCall`** (line 629-654): Runs after execution, before `tool_execution_end`. Can override result content, details, isError, or terminate flag. Fields are merged per-field (no deep merge).

#### Error Handling

Tool errors are caught (line 609-615) and wrapped as `{ content: [error message], isError: true }`. Thrown errors from the tool become tool-result messages with `isError: true` (line 612-614).

**Termination hint**: If every tool result in a batch has `terminate: true`, the agent stops after that batch without another LLM call (line 511-512). This is runtime-only; the transcript still shows standard tool results.

### Files and Line References

| Component | File | Key Lines |
| --- | --- | --- |
| Agent loop entry | packages/agent/src/agent-loop.ts | 31-93 |
| Main loop logic | packages/agent/src/agent-loop.ts | 155-246 |
| LLM streaming | packages/agent/src/agent-loop.ts | 252-345 |
| Tool execution dispatch | packages/agent/src/agent-loop.ts | 350-365 |
| Parallel execution | packages/agent/src/agent-loop.ts | 424-483 |
| Sequential execution | packages/agent/src/agent-loop.ts | 372-422 |

---

## 2. Monorepo Architecture

Pi is organized as a five-package monorepo with strict dependency boundaries:

```
pi-mono (root)
├── packages/ai               [LLM provider abstraction]
├── packages/agent            [Agent core runtime]
├── packages/coding-agent      [CLI coding agent]
├── packages/tui              [Terminal UI library]
└── packages/web-ui           [Web components]
```

### Package Responsibilities

#### `@earendil-works/pi-ai` (packages/ai/)
Unified multi-provider LLM API. Exposes:
- `streamSimple(model, context, options)` → event stream
- `stream(model, context, options)` → event stream (provider-specific options)
- Provider registration registry
- Model discovery and cost tracking
- OAuth utilities
- Tool call validation

**Public API**: Via package.json subpath exports (./anthropic, ./google, ./openai-responses, etc.)

#### `@earendil-works/pi-agent-core` (packages/agent/)
Stateful agent with tool calling and event streaming. Exposes:
- `Agent` class with `prompt()`, `continue()`, `steer()`, `followUp()`
- `agentLoop()`, `agentLoopContinue()` low-level streams
- Tool definition interface: `AgentTool<TParameters, TDetails>`
- Event types: `AgentEvent` (start/end/turn/message/tool events)
- Message abstraction: `AgentMessage` (extensible via declaration merging for custom types)

**Dependency**: Depends on `@earendil-works/pi-ai` for `streamSimple`, `Context`, `Tool`, `AssistantMessage`.

#### `@earendil-works/pi-coding-agent` (packages/coding-agent/)
Interactive CLI coding agent. Implements:
- Tool suite: read, bash, edit, write, grep, find, ls (7 tools total)
- Interactive mode (TUI): real-time streaming, input, model selection
- Print mode: batch processing for CI/scripting
- RPC mode: headless JSON API
- Session management: save/load/branch/compact sessions
- Extensions: hook system for custom tools and behaviors

**Dependencies**: Depends on `@earendil-works/pi-agent-core` and `@earendil-works/pi-tui`.

#### `@earendil-works/pi-tui` (packages/tui/)
Minimal terminal UI framework with differential rendering. Provides:
- Component model: `Component` interface with `render(width): string[]`
- Built-in components: Text, Editor, SelectList, Markdown, Loader, Image, etc.
- Synchronized output (CSI 2026) for flicker-free updates
- Three-strategy rendering: full redraw, width-change redraw, or incremental update
- Keyboard handling with support for Kitty protocol
- IME support via `Focusable` interface and `CURSOR_MARKER`

**Dependencies**: None (standalone). Optional koffi for native clipboard (not required).

#### `@earendil-works/pi-web-ui` (packages/web-ui/)
Web components for chat interfaces. Status: separate, minimal integration with core packages at present.

### Inter-Package Data Flow

```mermaid
graph LR
    A["Agent Loop<br/>(agent-loop.ts)"]
    AI["pi-ai<br/>(streamSimple)"]
    AC["Agent Class<br/>(Agent.ts)"]
    CA["coding-agent<br/>(AgentSession)"]
    TUI["TUI<br/>(components)"]
    
    A -->|yields events| AC
    AC -->|calls| A
    A -->|calls| AI
    CA -->|creates & uses| AC
    CA -->|feeds events to| TUI
    TUI -->|renders to stdout|
```

**Agent Loop → pi-ai**: Low-level loop calls `streamFn(model, context, options)` which defaults to `streamSimple` from pi-ai.

**Agent Class ↔ Agent Loop**: Agent wraps the loop. It maintains state, emits events to listeners, manages steering/follow-up queues.

**Coding Agent → Agent Class**: Creates an Agent instance, configures it with tools (built from tool factories), subscribes to events, persists state.

**Coding Agent ↔ TUI**: Event listeners update TUI components; TUI sends user input to the coding-agent event loop.

---

## 3. Tool-Calling Runtime

### Tool Definition Shape (packages/agent/src/types.ts:332-355)

```typescript
interface AgentTool<TParameters extends TSchema = TSchema, TDetails = any> extends Tool<TParameters> {
  name: string;
  description: string;
  parameters: TSchema;  // TypeBox schema
  label: string;        // Human-readable label for UI
  prepareArguments?: (args: unknown) => Static<TParameters>;  // Compat shim
  execute: (
    toolCallId: string,
    params: Static<TParameters>,
    signal?: AbortSignal,
    onUpdate?: AgentToolUpdateCallback<TDetails>
  ) => Promise<AgentToolResult<TDetails>>;
  executionMode?: "sequential" | "parallel";
}

interface AgentToolResult<T> {
  content: (TextContent | ImageContent)[];  // Returned to LLM
  details: T;                                 // Arbitrary structured data
  terminate?: boolean;                        // Early-stop hint
}
```

Tools are **TypeBox-based** (schema-first), allowing automatic validation and code generation. The `Tool` base interface comes from `pi-ai` (packages/ai/src/types.ts).

### Tool Registry & Dispatch

Pi does **not** use a central tool registry. Instead:

1. Tools are attached directly to `Agent.state.tools` (packages/agent/src/agent.ts:230)
2. When the LLM returns a tool call, `agent-loop` looks up the tool by name (agent-loop.ts:536)
3. If found, execution proceeds; if not found, an error result is emitted (agent-loop.ts:538-542)

Tools are **registered at creation time**, not at registration time. The coding agent creates tools via factory functions (packages/coding-agent/src/core/tools/index.ts:96-166).

### Built-in Tool Suite (coding-agent)

All 7 tools use the same execution template: parameter validation → operation execution → result wrapping.

| Tool | File | Schema | Execute Signature | Details Type |
| --- | --- | --- | --- | --- |
| **read** | packages/coding-agent/src/core/tools/read.ts | `{ path: string, offset?: number, limit?: number }` | Reads file bytes, detects images, resizes if needed | `{ truncation?: TruncationResult }` |
| **bash** | packages/coding-agent/src/core/tools/bash.ts | `{ command: string, timeout?: number }` | Spawns shell subprocess, streams stdout/stderr | `{ truncation?: TruncationResult, fullOutputPath?: string }` |
| **edit** | packages/coding-agent/src/core/tools/edit.ts | `{ path: string, start?: number, end?: number, content: string }` | Line-range edits or full write | `{ oldContent?: string, newContent?: string }` |
| **write** | packages/coding-agent/src/core/tools/write.ts | `{ path: string, content: string }` | Atomic write with parent directory creation | `{ truncation?: TruncationResult }` |
| **grep** | packages/coding-agent/src/core/tools/grep.ts | `{ pattern: string, path?: string, flags?: string, glob?: string }` | Regex search, outputs matches with context | `{ matches?: number, truncation?: TruncationResult }` |
| **find** | packages/coding-agent/src/core/tools/find.ts | `{ path: string, name: string, type?: string }` | Filesystem search, paginated results | `{ count?: number }` |
| **ls** | packages/coding-agent/src/core/tools/ls.ts | `{ path: string, recursive?: boolean }` | Directory listing with metadata | (empty) |

All tools:
- Accept **pluggable operations** (read, bash, write, grep, find, ls all have `*Operations` interfaces) for remote execution (SSH, containers, etc.)
- Return **output truncation metadata** for context window management
- Emit **tool_execution_update** events for streaming progress
- Validate arguments via TypeBox before execution

### Tool Argument Validation

Validation happens at two checkpoints:

1. **Schema validation** (agent-loop.ts:547): `validateToolArguments(tool, toolCall)` from pi-ai ensures args match the TypeBox schema
2. **Optional compat shim** (agent-loop.ts:546): `prepareArguments(toolCall.arguments)` allows tools to rewrite malformed input (e.g., lowercase tool names) before schema validation

Example from read tool (read.ts, lines 1-24):
```typescript
const readSchema = Type.Object({
  path: Type.String({ description: "Path to the file to read" }),
  offset: Type.Optional(Type.Number({ description: "Line number to start reading from (1-indexed)" })),
  limit: Type.Optional(Type.Number({ description: "Maximum number of lines to read" })),
});
export type ReadToolInput = Static<typeof readSchema>;
```

Tools are stateless; all execution context comes through parameters.

---

## 4. Unified Multi-LLM API

### Provider Abstraction (packages/ai/src/)

Pi abstracts all LLM providers behind a single `streamSimple()` entry point that:
- Takes a typed `Model<Api>`, a `Context` (system prompt, messages, tools), and `SimpleStreamOptions`
- Returns an `AssistantMessageEventStream` with unified event types
- Handles model-specific differences internally

### Architecture: Registry Pattern

**Provider Registration** (packages/ai/src/providers/register-builtins.ts:342-403):

Providers are **lazy-loaded** to avoid dependencies on unused SDKs:

```typescript
export const streamAnthropic = createLazyStream(loadAnthropicProviderModule);
export const streamSimpleAnthropic = createLazySimpleStream(loadAnthropicProviderModule);

registerApiProvider({
  api: "anthropic-messages",
  stream: streamAnthropic,
  streamSimple: streamSimpleAnthropic,
});
```

Each API (e.g., `"anthropic-messages"`, `"openai-responses"`) maps to provider module with `stream()` and `streamSimple()` exports. Providers are registered at startup via `registerBuiltInApiProviders()` (line 403), called automatically on pi-ai import.

**Dispatch** (packages/ai/src/stream.ts:17-59):

```typescript
function resolveApiProvider(api: Api) {
  const provider = getApiProvider(api);
  if (!provider) throw new Error(`No API provider registered for api: ${api}`);
  return provider;
}

export function streamSimple<TApi extends Api>(
  model: Model<TApi>,
  context: Context,
  options?: SimpleStreamOptions,
): AssistantMessageEventStream {
  const provider = resolveApiProvider(model.api);
  return provider.streamSimple(model, context, options);
}
```

The model's `.api` field determines the provider. No routing table; strict one-to-one mapping.

### Provider Interface

Each provider module exports:

```typescript
interface LazyProviderModule<TApi, TOptions, TSimpleOptions> {
  stream: (model: Model<TApi>, context: Context, options?: TOptions) => AsyncIterable<AssistantMessageEvent>;
  streamSimple: (model: Model<TApi>, context: Context, options?: TSimpleOptions) => AsyncIterable<AssistantMessageEvent>;
}
```

Both return an async iterable of `AssistantMessageEvent` objects, which are piped into a unified `AssistantMessageEventStream` wrapper.

### Unified Event Stream

All providers emit normalized events (packages/ai/src/utils/event-stream.ts):

```typescript
type AssistantMessageEvent =
  | { type: "start"; partial: AssistantMessage }
  | { type: "text_start" }
  | { type: "text_delta"; delta: string; partial: AssistantMessage }
  | { type: "text_end" }
  | { type: "toolcall_start"; id: string; name: string }
  | { type: "toolcall_delta"; id: string; args_delta: string; partial: AssistantMessage }
  | { type: "toolcall_end"; id: string; partial: AssistantMessage }
  | { type: "thinking_start"; budget?: number }
  | { type: "thinking_delta"; delta: string }
  | { type: "thinking_end" }
  | { type: "done"; message: AssistantMessage }
  | { type: "error"; reason: string; error: AssistantMessage };
```

**Note**: All deltas are emitted for streaming; providers that only support batch completion emit `text_delta` with the full text (Codex, Completions models).

### Provider Implementations

Supported APIs (14 total):

- `"anthropic-messages"` → Anthropic SDK
- `"openai-responses"` → OpenAI Chat Completions
- `"openai-completions"` → OpenAI Completions (legacy)
- `"openai-codex-responses"` → OpenAI Codex via OAuth
- `"azure-openai-responses"` → Azure OpenAI
- `"mistral-conversations"` → Mistral API
- `"google-generative-ai"` → Google Gemini API
- `"google-vertex"` → Vertex AI (Gemini)
- `"bedrock-converse-stream"` → AWS Bedrock (Node.js only)
- Plus OpenRouter, Vercel AI Gateway, Cloudflare, xAI, Groq, Cerebras, etc. (via OpenAI-compat endpoints)

Each provider:
1. Transforms pi's unified `Message[]` to provider-native format
2. Maps tool definitions to provider tool schema
3. Streams events from the provider's SDK or HTTP API
4. Normalizes stop reasons, usage, cost
5. Handles errors and retries

### Message and Tool Normalization

**Message transformation** (packages/ai/src/providers/transform-messages.ts):

Pi's canonical message format (user/assistant/toolResult) is transformed to each provider's expected format. For example:
- Anthropic expects `role: "user" | "assistant"` with `content: BlockParam[]`
- OpenAI expects `role: "user" | "assistant" | "tool"` with `content: string | ChatCompletionContentPart[]`

Each provider re-implements `transformMessages()` to handle their specific format.

**Tool normalization**: Tools are converted from pi's TypeBox schemas to:
- Anthropic: `Tool` with `input_schema: JSONSchema`
- OpenAI: `ChatCompletionTool` with `function.parameters: JSONSchema`
- Google: `Tool` with `function_declarations`

Reverse mapping: provider tool calls (e.g., `tool_call.function.name`) are mapped back to pi's `ToolCall` format.

### Comparison with Other Agents

**Aider's multi-model strategy**: Aider uses "architect" and "editor" models selected by role, with model-specific prompts. Pi uses a single model selected upfront, delegating all role/persona to the system prompt.

**Kilo Code's OpenRouter proxy**: Kilo routes all provider requests through OpenRouter's unified API. Pi supports direct SDK clients (Anthropic, OpenAI, Google, Mistral) and direct HTTP for others (Groq, Cerebras, xAI). No proxy layer; each provider implements its own transport.

**Pi's novel approach**: Lazy provider loading (saves memory for unused SDKs), declarative registration (extensions can add providers without modifying core), unified event stream (agent code is provider-agnostic).

### Key Files

| Function | File | Lines |
| --- | --- | --- |
| Lazy loading | packages/ai/src/providers/register-builtins.ts | 89-201 |
| Provider registration | packages/ai/src/providers/register-builtins.ts | 342-403 |
| Stream dispatch | packages/ai/src/stream.ts | 17-59 |
| Event normalization | packages/ai/src/utils/event-stream.ts | (full file) |
| Anthropic provider | packages/ai/src/providers/anthropic.ts | (full file, ~500 lines) |

---

## 5. Terminal UI

### Rendering Architecture (packages/tui/src/tui.ts)

The TUI uses a **component-based model** with **differential rendering**:

**Component Interface** (tui.ts:39-62):
```typescript
interface Component {
  render(width: number): string[];      // Return lines (no line may exceed width)
  handleInput?(data: string): void;     // Raw terminal input
  invalidate?(): void;                  // Clear cached state
  wantsKeyRelease?: boolean;            // Kitty protocol: receive key releases
}
```

**Rendering Strategies** (README.md:579-587):
1. **First render**: Output all lines without clearing scrollback
2. **Width changed or change above viewport**: Clear screen and re-render all
3. **Normal update**: Move cursor to first changed line, clear to end of screen, render changed lines

All updates are wrapped in **synchronized output** (`CSI 2026h`...`CSI 2026l`) for atomic, flicker-free rendering.

### Component Library

**Text components**:
- `Text`: Multi-line with word wrap and padding
- `TruncatedText`: Single line, truncates with ellipsis
- `Markdown`: Renders markdown with syntax highlighting

**Input components**:
- `Input`: Single-line text input with Ctrl+A/E/U/K bindings, IME support
- `Editor`: Multi-line editor with autocomplete, slash commands, large paste handling

**List components**:
- `SelectList`: Interactive selection with keyboard navigation
- `SettingsList`: Settings panel with cycling and submenus

**Layout components**:
- `Container`: Group children
- `Box`: Container with padding and background color
- `Spacer`: Empty lines

**Specialized**:
- `Loader`/`CancellableLoader`: Animated spinner
- `Image`: Inline images (Kitty or iTerm2 protocol, falls back to text)

### IME Support (Focusable Interface)

For input components to work correctly with Input Method Editors (CJK languages), they implement `Focusable`:

```typescript
interface Focusable {
  focused: boolean;  // Set by TUI
}
```

When `focused = true`, the component emits `CURSOR_MARKER` (a zero-width APC sequence) at the cursor position:

```typescript
export const CURSOR_MARKER = "\x1b_pi:c\x07";
```

The TUI scans rendered output for this marker, strips it, and positions the hardware terminal cursor there. This enables IME candidate windows to appear at the correct location.

**Example** (Input component):
```typescript
render(width: number): string[] {
  const marker = this.focused ? CURSOR_MARKER : "";
  const before = this.value.substring(0, this.cursorPos);
  const at = this.value[this.cursorPos] || " ";
  const after = this.value.substring(this.cursorPos + 1);
  return [before + marker + "\x1b[7m" + at + "\x1b[27m" + after];
}
```

### Message Stream Display (coding-agent integration)

The coding-agent subscribes to Agent events and renders them in the TUI:

1. **User message** (`message_start/end`): Display in message list with "You" label
2. **Assistant message streaming** (`message_start`, `message_update` with `text_delta`): Render markdown, append text chunks
3. **Tool execution** (`tool_execution_start`, `tool_execution_update`, `tool_execution_end`): Show command, accumulated output, exit code
4. **Tool result** (`message_start/end`): Display tool result (file content, bash output, etc.)

Tool results are **rendered via custom renderers** (packages/coding-agent/src/core/export-html/tool-renderer.ts) that format tool output for the TUI (code highlighting, truncation, etc.).

**Key rendering components** (packages/coding-agent/src/modes/interactive/components/):
- `assistant-message.ts`: Renders assistant text and tool calls
- `bash-execution.ts`: Renders bash command execution with output
- `custom-message.ts`: Generic message container

### Key Files

| Component | File |
| --- | --- |
| Core TUI | packages/tui/src/tui.ts |
| Differential rendering | packages/tui/src/tui.ts:180-350 (rendering logic) |
| Input component | packages/tui/src/components/input.ts |
| Editor component | packages/tui/src/components/editor.ts |
| Markdown renderer | packages/tui/src/components/markdown.ts |
| Agent integration | packages/coding-agent/src/modes/interactive/components/ |

---

## 6. Unique Patterns

### 1. Agent Message Abstraction with Declaration Merging

**Novel pattern**: Pi's `AgentMessage` type is extensible via TypeScript declaration merging. Apps can inject custom message types:

```typescript
declare module "@earendil-works/pi-agent-core" {
  interface CustomAgentMessages {
    artifact: { role: "artifact"; id: string; content: string; timestamp: number };
    notification: { role: "notification"; text: string; timestamp: number };
  }
}
```

Custom messages are **filtered out by `convertToLlm()`** before LLM calls, allowing UI-only message types. This is more flexible than Aider's fixed message set and avoids the need for per-message "is_llm_visible" flags.

**Files**: packages/agent/src/types.ts:270-280, packages/agent/README.md:354-377

### 2. Parallel Tool Execution with Order-Preserving Events

**Novel pattern**: Tools can execute concurrently (parallel mode, default), but:
- `tool_execution_end` events fire as each tool **finishes** (completion order)
- `toolResult` message events fire **after all tools complete**, in **assistant source order** (line 472-476)

This allows the UI to show tool progress in real-time while preserving LLM message order. Other agents (Aider, Cline) typically execute sequentially or don't preserve message order.

**Files**: packages/agent/src/agent-loop.ts:424-483

### 3. Lazy Provider Loading with Typed Dispatch

**Novel pattern**: Pi loads LLM provider SDKs on-demand:
```typescript
let anthropicProviderModulePromise: Promise<...> | undefined;
function loadAnthropicProviderModule() {
  anthropicProviderModulePromise ||= import("./anthropic.js").then(...);
  return anthropicProviderModulePromise;
}
```

This saves memory for unused providers (e.g., users who never touch Bedrock won't load the AWS SDK). Compare to Kilo Code (OpenRouter proxy, single HTTP endpoint) and Aider (multiple SDKs always loaded).

**Files**: packages/ai/src/providers/register-builtins.ts:91-321

### 4. Event Stream Abstraction for Observational Semantics

**Novel pattern**: Agent events are **emitted immediately without waiting for handlers**. This allows UIs to be non-blocking:

```typescript
for await (const event of agentLoop(...)) {
  // Async handler can be slow without blocking the loop
  await ui.render(event);
}
```

However, the `Agent` class wraps the loop with a **barrier** (`processEvents`, agent.ts:496): it awaits each listener before proceeding to the next event. This ensures state updates happen in order.

**Files**: packages/agent/src/agent-loop.ts:37-54 (low-level stream), packages/agent/src/agent.ts:219-543 (stateful wrapper)

### 5. Tool Pluggability via Operations Objects

**Novel pattern**: Tools accept pluggable `*Operations` objects (e.g., `ReadOperations`, `BashOperations`) to delegate execution:

```typescript
export interface BashOperations {
  exec: (command: string, cwd: string, options: { onData, signal, timeout, env }) 
    => Promise<{ exitCode: number | null }>;
}

export function createBashTool(cwd: string, options?: BashToolOptions): AgentTool {
  const operations = options?.operations ?? createLocalBashOperations();
  // ...
}
```

This enables SSH, container, and remote execution without changing tool code. Aider and Cline hard-code execution; Pi's design supports remote backends.

**Files**: packages/coding-agent/src/core/tools/bash.ts:39-56, read.ts:43-50, etc.

### 6. Thinking/Reasoning with Budget Control

**Novel pattern**: Reasoning level is unified across providers via `ThinkingLevel` ("minimal", "low", "medium", "high", "xhigh"), with optional **per-level token budgets**:

```typescript
export interface ThinkingBudgets {
  minimal?: number;
  low?: number;
  medium?: number;
  high?: number;
}
```

Providers map budgets to their native formats (Anthropic's budget_tokens, Claude's thinking_budget_tokens, etc.). This is provider-agnostic reasoning configuration.

**Files**: packages/ai/src/types.ts:62-72, packages/agent/src/agent.ts:181-182

### 7. Synchronized Output for Atomic Rendering

**Novel pattern**: All TUI updates use CSI 2026 (synchronized output) to prevent flicker:

```
\x1b[?2026h    // Begin synchronized update
[render lines]
\x1b[?2026l    // End synchronized update
```

Most TUIs don't use this. Pi ensures every screen update is atomic and flicker-free.

**Files**: packages/tui/src/tui.ts:270-330 (synchronized write logic)

---

## 7. Source-of-Truth Notes

### Missing Capabilities

1. **No built-in memory/context management** beyond transformContext hook. Pi assumes the embedding app (or hooks) handle summarization, pruning, etc. Other agents like AutoGPT have built-in memory modules.

2. **No sandbox/isolation** for bash execution. Commands run in the user's shell with full access. Cline has explicit exec policies; Pi delegates to beforeToolCall hooks.

3. **No explicit permission system**. Tools are "all or nothing". beforeToolCall can block specific tool calls, but there's no model-level permission declaration.

4. **Tool-call argument streaming is provider-dependent**. Some providers (Anthropic, some OpenAI models) stream tool-call arguments as partial JSON. Others (Codex, Completions) don't. Tools can't reliably react to partial arguments.

### Architectural Caveats

1. **Agent state mutation is shallow-copied**. Assigning `agent.state.tools = [...]` or `agent.state.messages = [...]` copies the top-level array but not nested objects. Mutating nested content affects other references.

2. **Event listeners are awaited in order**. If a subscriber is slow, subsequent listeners block. This is by design (ordering guarantee), but can be surprising. Low-level agentLoop doesn't await listeners (observational semantics).

3. **Provider SDKs vary in retry behavior**. Anthropic and OpenAI SDKs have built-in retries (default 2 max_retries). Others (Google, Mistral) have different defaults. maxRetries option is passed through but not guaranteed to be honored.

4. **Tool definition names are case-sensitive**. The agent matches tool calls to tool.name exactly. There's a special case for Anthropic where Pi mirrors Claude Code's canonical casing (line 98 in anthropic.ts), but this is an edge case.

5. **transformContext and convertToLlm are called every LLM turn**. They must be fast. If they're async, they block the entire turn. Use wisely; don't do I/O in these hooks.

### Package Quality Notes

| Package | Status | Notes |
| --- | --- | --- |
| pi-ai | Production | Mature; 14 providers; active maintenance |
| pi-agent-core | Production | Stable API; well-tested loop semantics |
| pi-coding-agent | Production | CLI is feature-complete; extensions experimental |
| pi-tui | Production | Robust differential rendering; tested on multiple terminals |
| pi-web-ui | Experimental | Minimal integration with core; separate maintenance |

### Version Alignment

All packages in the monorepo are **lockstep versioned** (currently 0.74.0). Breaking changes in one package bump the minor version for all. This is enforced by release scripts (scripts/release.mjs).

### Documentation Quality

- **pi-agent-core**: Excellent. README covers event flow, hooks, steering/follow-up, tools, custom messages.
- **pi-ai**: Comprehensive. Covers all 14 providers, OAuth, thinking, images, token tracking.
- **pi-coding-agent**: Good for CLI; extensions doc is sparse.
- **pi-tui**: Excellent. Full component reference, keyboard handling, rendering strategy.

---

## Agent Attribution Table

| Section | Subsystem | File:line refs |
| --- | --- | --- |
| Core loop entry | agent-loop | agent-loop.ts:31-93 |
| Main loop logic | agent-loop | agent-loop.ts:155-246 |
| LLM streaming | agent-loop | agent-loop.ts:252-345 |
| Tool dispatch | agent-loop | agent-loop.ts:350-365 |
| Parallel execution | agent-loop | agent-loop.ts:424-483 |
| Agent wrapper | Agent class | agent.ts:158-544 |
| Monorepo: ai | pi-ai | packages/ai/package.json, types.ts:1-200 |
| Monorepo: agent | pi-agent-core | packages/agent/package.json, types.ts:1-390 |
| Monorepo: coding-agent | pi-coding-agent | packages/coding-agent/package.json, core/agent-session.ts |
| Monorepo: tui | pi-tui | packages/tui/src/tui.ts:1-150 |
| Provider registry | pi-ai | api-registry.ts:1-99 |
| Lazy loading | pi-ai | register-builtins.ts:89-321 |
| Stream dispatch | pi-ai | stream.ts:17-59 |
| Tool definitions | coding-agent | core/tools/index.ts:96-166 |
| Read tool | coding-agent | core/tools/read.ts:1-80 |
| Bash tool | coding-agent | core/tools/bash.ts:1-80 |
| TUI rendering | pi-tui | tui.ts:1-150 |
| Focusable/IME | pi-tui | tui.ts:74-90, README.md:157-207 |
| Differential rendering | pi-tui | README.md:579-587 |
| Message abstraction | pi-agent-core | types.ts:270-280, agent.ts:355-372 |
| Parallel tool exec | agent-loop | agent-loop.ts:424-483 |
| Thinking budgets | pi-ai | types.ts:62-72 |

