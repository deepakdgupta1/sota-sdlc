# OpenCode — Architectural Research Report

> **Agent:** OpenCode  
> **Tag:** `[OPENCODE]`  
> **Phase:** 5  
> **Task:** 15  
> **Primary Source:** Local repository `./opencode/` (commit HEAD)  
> **Secondary Source:** https://opencode.ai  

---

## Table of Contents

1. [Core Loop](#1-core-loop)
2. [Client/Server Architecture](#2-clientserver-architecture)
3. [Built-in Agents](#3-built-in-agents)
4. [Multi-Provider Support](#4-multi-provider-support)
5. [Plugin/Extension System](#5-pluginextension-system)
6. [Cross-Agent Comparisons](#6-cross-agent-comparisons)

---

## 1. Core Loop

### 1.1 Overview

OpenCode's agentic loop is a **TUI-driven, session-based pipeline** built on SolidJS + [opentui](https://github.com/sst/opentui) for the terminal frontend and the [Effect](https://effect.website) library for backend service composition. The loop follows:

```
User Input → Agent Selection → System Prompt Assembly → LLM Streaming → Tool Execution → Permission Gate → Result Display → (Loop or Stop)
```

Unlike IDE-embedded agents (Cline, Roo Code) or sandbox-first agents (Codex), OpenCode runs as a **standalone terminal process** with a rich client/server split.

### 1.2 Session Lifecycle

**Source:** `packages/opencode/src/session/session.ts`, `prompt.ts`, `processor.ts`

Sessions are the fundamental unit of conversation state, persisted via Drizzle ORM + SQLite:

```
┌─────────────┐
│  Session     │  ← ID, title, parentID (for sub-sessions), agent, permission ruleset
├─────────────┤
│  Messages[]  │  ← User / Assistant messages with parentID chain
├─────────────┤
│  Parts[]     │  ← Text, Tool, Reasoning, File, Step, Compaction, Patch parts
└─────────────┘
```

Key lifecycle events: `Created`, `Updated`, `Deleted`, `Error`, `Shared`, `Compacted`.

### 1.3 Prompt Assembly Pipeline

**Source:** `packages/opencode/src/session/prompt.ts` (lines 84–528)

The `SessionPrompt` service orchestrates the full prompt cycle:

1. **Agent Resolution** — Resolve the agent (build/plan/general/explore) from session state or user selection.
2. **Model Resolution** — Get the model from agent config, session config, or last-used model.
3. **System Prompt** — Model-specific prompt (`anthropic.txt`, `gpt.txt`, `gemini.txt`, etc.) + environment info (working dir, platform, date) + skills listing.
4. **Instruction Injection** — Custom instructions from `.opencode/` config, `CLAUDE.md`/`AGENTS.md` compatibility files, and `instructions` config array.
5. **Reminder Insertion** — Agent-specific reminders (plan mode constraints, build-switch notifications).
6. **Tool Resolution** — `ToolRegistry` filters tools by agent permissions, model capabilities, and user config.
7. **Message Transform** — Plugin hooks (`experimental.chat.messages.transform`, `chat.params`, `chat.headers`).
8. **LLM Streaming** — Via `LLM.Service` wrapping Vercel AI SDK's `streamText`.
9. **Event Processing** — `SessionProcessor` handles stream events (text deltas, tool calls, reasoning, step boundaries).
10. **Compaction** — Auto-compaction when context overflows, with summary generation and tail preservation.

### 1.4 Streaming & Processing

**Source:** `packages/opencode/src/session/llm.ts`, `processor.ts`

The `LLM.Service` wraps `streamText` from the Vercel AI SDK:

- **Middleware**: Custom `ProviderTransform` middleware modifies prompts per-provider (image handling, cache control, etc.)
- **Tool Repair**: Auto-repairs tool calls with case mismatches; routes invalid calls to a stub `invalid` tool.
- **Doom Loop Detection**: `SessionProcessor` detects when the same tool is called 3x with identical args and triggers a permission gate.
- **Retry Policy**: `SessionRetry` handles transient provider errors with exponential backoff.
- **Snapshot Tracking**: Each step boundary captures filesystem snapshots for undo/revert capability.

### 1.5 Compaction System

**Source:** `packages/opencode/src/session/compaction.ts`

When token usage exceeds model context limits:

1. **Prune**: Strip old tool outputs (beyond `PRUNE_PROTECT` = 40k tokens threshold).
2. **Select Tail**: Preserve recent turns (default 2) within a token budget.
3. **Summarize**: Use a dedicated `compaction` agent to generate a structured summary (Goal, Progress, Decisions, Next Steps, Files).
4. **Auto-Continue**: Optionally replay the last user message after compaction.

---

## 2. Client/Server Architecture

### 2.1 Architecture Overview

**Source:** `packages/opencode/src/server/server.ts`, `packages/opencode/src/index.ts`

OpenCode uses a **local HTTP/WebSocket server** architecture:

```
┌──────────────────────┐     HTTP/WS      ┌──────────────────────┐
│   TUI Client         │ ◄───────────────► │   Backend Server     │
│   (SolidJS/opentui)  │   localhost:4096  │   (Hono + Effect)    │
├──────────────────────┤                   ├──────────────────────┤
│  Web App Client      │ ◄───────────────► │   Session Engine     │
│  (SolidJS SPA)       │                   │   Tool Executor      │
├──────────────────────┤                   │   Provider Manager   │
│  Desktop Client      │ ◄───────────────► │   Plugin System      │
│  (Tauri wrapper)     │                   │   SQLite (Drizzle)   │
└──────────────────────┘                   └──────────────────────┘
```

### 2.2 Server Implementation

**Source:** `packages/opencode/src/server/server.ts`

- **Framework**: Hono with middleware for CORS, auth (Basic), error handling, and content limiting.
- **Routes**: Organized in `routes/` — `global.ts` (cross-instance), `instance/` (per-workspace), `control/` (lifecycle).
- **Instance Isolation**: Each workspace directory gets its own instance context with isolated config, sessions, and state. The server manages multiple instances simultaneously.
- **WebSocket**: Used for real-time event streaming (SSE via `EventSource` pattern). The `Bus` service publishes events that clients subscribe to.
- **Authentication**: Optional Basic auth via `OPENCODE_SERVER_PASSWORD` env var.

### 2.3 CLI Entry Points

**Source:** `packages/opencode/src/index.ts`, `cli/cmd/`

The CLI uses `yargs` to expose multiple commands:

| Command | Description |
|---------|-------------|
| `opencode` (default) | Start the TUI |
| `opencode serve` | Headless API server |
| `opencode web` | Server + browser UI |
| `opencode run` | Non-interactive single-prompt execution |
| `opencode attach` | Connect TUI to existing server |
| `opencode session` | List/manage sessions |
| `opencode export` | Export session history |

The `run` command (`cli/cmd/run.ts`) is particularly important — it enables **headless/CI execution** with structured output, making OpenCode usable in automation pipelines.

### 2.4 Communication Protocol

- **REST API**: Standard HTTP endpoints for CRUD operations on sessions, messages, config, providers.
- **Server-Sent Events (SSE)**: Real-time streaming of session events (message updates, tool calls, errors).
- **SDK Client**: Auto-generated TypeScript SDK (`@opencode-ai/sdk`) for programmatic access.
- **Bus System**: Internal `Bus.Service` implements pub/sub for cross-service communication, backed by `BusEvent` typed events.

### 2.5 Database Layer

**Source:** `packages/opencode/src/storage/`

- **ORM**: Drizzle with SQLite (`better-sqlite3`).
- **Schema**: Sessions, Messages, Parts, Permissions, Snapshots — all with ULID-based IDs for sortability.
- **Migrations**: Managed via Drizzle's migration system, auto-run on startup.

---

## 3. Built-in Agents

### 3.1 Agent Architecture

**Source:** `packages/opencode/src/agent/agent.ts`

OpenCode defines agents through the `Agent.Service` which merges native (hardcoded) and custom (config/plugin) definitions:

```typescript
// Agent categories
type AgentMode = "primary" | "subagent" | "system"

// Native agents: build, plan, general, explore, title, summary, compaction
```

Each agent has:
- **`name`** — Unique identifier
- **`mode`** — `primary` (user-facing), `subagent` (spawnable), or `system` (internal)
- **`permission`** — `Permission.Ruleset` defining tool access
- **`prompt`** — Optional custom system prompt (overrides model-specific prompts)
- **`model`** — Optional fixed provider/model override
- **`hidden`** — Whether to show in agent selection UI
- **`temperature`** / **`topP`** — Generation parameters
- **`options`** — Provider-specific options

### 3.2 Primary Agents

#### `build` (Default)

- **Mode**: `primary`
- **Purpose**: Full-access development agent. Default when no agent is specified.
- **Permissions**: All tools enabled — read, write, edit, bash, task (sub-agents), etc.
- **Behavior**: Receives model-specific prompts (Anthropic, GPT, Gemini variants). Can spawn sub-agents via the `task` tool.

#### `plan`

- **Mode**: `primary`
- **Purpose**: Read-only exploration and planning agent.
- **Permissions**: Write/edit/bash tools **denied** by default. Only read-only operations allowed.
- **Behavior**: Follows a structured 5-phase workflow (see below). Can only modify a `plan.md` file.
- **Plan Workflow**:
  1. **Initial Understanding** — Launch up to 3 `explore` sub-agents in parallel
  2. **Design** — Launch `general` sub-agent(s) for implementation design
  3. **Review** — Read critical files, verify alignment with user intent
  4. **Final Plan** — Write to plan file (the only writable file)
  5. **Exit** — Call `plan_exit` tool to signal completion

**Key Distinction from Roo Code**: Roo Code's modes are configuration-driven with arbitrary custom modes. OpenCode's plan/build split is more structured, with plan mode enforcing a specific multi-phase workflow and sub-agent orchestration pattern.

### 3.3 Sub-agents

#### `general`

- **Mode**: `subagent`
- **Purpose**: Complex/parallel task execution. Spawned by primary agents via the `task` tool.
- **Permissions**: Full tool access (same as `build`).
- **Prompt**: Defined in `agent/prompt/` — focused on executing specific tasks.

#### `explore`

- **Mode**: `subagent`  
- **Purpose**: Read-only codebase exploration.
- **Permissions**: Write/edit/bash **denied**. Read, glob, grep, list, and web fetch allowed.
- **Prompt**: Explores code structure and reports findings.

### 3.4 System Agents

| Agent | Purpose | Notes |
|-------|---------|-------|
| `title` | Auto-generate session titles | Uses small model variant |
| `summary` | Generate conversation summaries | Per-step summary |
| `compaction` | Summarize context for compaction | Structured template output |

### 3.5 Permission System

**Source:** `packages/opencode/src/permission/index.ts`

Permissions use a **rule-based evaluation** system:

```typescript
type Rule = {
  permission: string   // Tool name or wildcard pattern
  pattern: string      // File path pattern or "*"
  action: "allow" | "deny" | "ask"
}
type Ruleset = Rule[]
```

Evaluation flow:
1. Agent's built-in ruleset is evaluated.
2. Session-level overrides are merged.
3. Config-level permissions are merged.
4. For each tool call pattern: `deny` → block immediately, `allow` → proceed, `ask` → prompt user.
5. User responses: `once` (allow this call), `always` (add permanent allow rule), `reject` (fail with `RejectedError` or `CorrectedError` with feedback).

**Comparison with Claude Code**: Claude Code uses a simpler per-action confirmation model. OpenCode's system is more granular with wildcard patterns, persistent allow-rules, and the ability to provide feedback on rejection.

**Comparison with Roo Code**: Roo Code's mode-based governance statically defines tool availability per mode. OpenCode's permission system is dynamic — rules can be added at runtime via user approval.

---

## 4. Multi-Provider Support

### 4.1 Provider Architecture

**Source:** `packages/opencode/src/provider/provider.ts`

OpenCode uses the **Vercel AI SDK** as its model abstraction layer, with 20+ bundled provider packages:

| Provider | SDK Package |
|----------|------------|
| Anthropic | `@ai-sdk/anthropic` |
| OpenAI | `@ai-sdk/openai` |
| Google (Gemini) | `@ai-sdk/google` |
| Google Vertex | `@ai-sdk/google-vertex` |
| AWS Bedrock | `@ai-sdk/amazon-bedrock` |
| Azure OpenAI | `@ai-sdk/azure` |
| xAI (Grok) | `@ai-sdk/xai` |
| Mistral | `@ai-sdk/mistral` |
| Groq | `@ai-sdk/groq` |
| OpenRouter | `@openrouter/ai-sdk-provider` |
| Together AI | `@ai-sdk/togetherai` |
| GitLab | `gitlab-ai-provider` |
| Cloudflare | Custom |
| GitHub Copilot | Custom |

### 4.2 Provider Resolution

Each provider has a `CustomLoader` function that:

1. **Auto-detects credentials** — Checks env vars, auth store, and config.
2. **Returns `autoload: boolean`** — Whether the provider should be automatically available.
3. **Provides custom model resolution** — `getModel(sdk, modelID, options)` handles provider-specific model creation (e.g., Bedrock's cross-region inference prefixes).
4. **Injects custom options** — Headers, authentication, region configuration.

### 4.3 Model Registry

- **External Registry**: Model metadata (context limits, capabilities, costs) sourced from `models.dev`.
- **Capability Flags**: `temperature`, `reasoning`, `attachment`, `toolcall`, input/output modalities (text, audio, image, video, pdf).
- **Variants**: Models support named variants (e.g., different reasoning levels) configurable per-user.
- **Small Model**: Each provider can designate a "small model" for lightweight tasks (title generation, summarization).

### 4.4 Provider Transforms

**Source:** `packages/opencode/src/provider/transform.ts`

Provider-specific transformations handle:
- **Max output tokens** — Provider-specific caps and overrides.
- **Cache control** — Anthropic-style cache breakpoints for system/instruction messages.
- **Image handling** — Resize, format conversion, URL vs base64 encoding per provider requirements.
- **Schema adaptation** — JSON schema transformations for tool definitions per provider.
- **Provider options** — Reasoning effort, thinking budgets, safety settings.

### 4.5 Authentication

**Source:** `packages/opencode/src/auth/`

Multiple auth strategies:
- **API Key** — Via env vars or `opencode auth <provider>` CLI command.
- **OAuth** — For providers like GitHub Copilot, GitLab, OpenAI.
- **Well-Known Config** — Enterprise `.well-known/opencode` endpoint for remote config + auth.
- **Auth Store** — Persistent credential storage with per-provider metadata.

---

## 5. Plugin/Extension System

### 5.1 Plugin Architecture

**Source:** `packages/opencode/src/plugin/index.ts`, `packages/plugin/`

OpenCode has a **hook-based plugin system** with both internal (bundled) and external (npm/local) plugins:

```
┌─────────────────┐
│  Plugin Loader   │  ← Resolves npm packages, local files, URLs
├─────────────────┤
│  Plugin Instance │  ← Factory function: (input) => Hooks
├─────────────────┤
│  Hooks Interface │  ← Named lifecycle hooks (before/after patterns)
└─────────────────┘
```

### 5.2 Plugin Input

Plugins receive a `PluginInput` object with SDK client, project info, workspace paths, server URL, and workspace adaptor registration.

### 5.3 Hook System

Plugins register hooks that are called sequentially:

| Hook | Phase | Purpose |
|------|-------|---------|
| `tool.execute.before` | Pre-tool | Intercept/modify tool args |
| `tool.execute.after` | Post-tool | Process tool results |
| `chat.params` | Pre-LLM | Modify temperature, options |
| `chat.headers` | Pre-LLM | Add custom HTTP headers |
| `experimental.chat.system.transform` | Pre-LLM | Modify system prompt |
| `experimental.chat.messages.transform` | Pre-LLM | Modify message history |
| `experimental.text.complete` | Post-LLM | Transform assistant text |
| `experimental.session.compacting` | Pre-compaction | Inject compaction context |
| `experimental.compaction.autocontinue` | Post-compaction | Control auto-continue |
| `event` | Realtime | Subscribe to all bus events |

### 5.4 Built-in Internal Plugins

Six bundled auth plugins: CodexAuth, CopilotAuth, GitlabAuth, PoeAuth, CloudflareWorkersAuth, CloudflareAIGatewayAuth.

### 5.5 External Plugin Loading

**Source:** `packages/opencode/src/plugin/loader.ts`

External plugins are loaded from:
1. **Config** — `plugin` array in `opencode.json` (npm packages or local paths).
2. **Auto-discovery** — `.opencode/plugin/` and `.opencode/plugins/` directories.
3. **Plugin origins** — Track which config file declared each plugin (scope: `global` vs `local`).

### 5.6 Skill System

**Source:** `packages/opencode/src/skill/index.ts`

Skills are **markdown-based instruction files** (`SKILL.md`) that provide specialized workflows:

```markdown
---
name: my-skill
description: A specialized workflow for X
---
Step-by-step workflow content...
```

Discovery locations:
- `.opencode/skills/` directories
- `.claude/skills/` and `.agents/skills/` (cross-agent compatibility)
- Custom paths via `skills.paths` config
- Remote URLs via `skills.urls` config

Skills are loaded on-demand via the `skill` tool.

### 5.7 MCP Integration

MCP servers are configured via `opencode.json` and their tools are merged into the tool registry alongside built-in tools, with permission checks and truncation applied uniformly.

### 5.8 Custom Agent Definition

Users can define custom agents in config or via markdown files in `.opencode/agent/` directories with frontmatter — specifying mode, model, prompt, permissions, and temperature.

---

## 6. Cross-Agent Comparisons

### 6.1 vs Claude Code Sub-agents

| Dimension | OpenCode | Claude Code |
|-----------|----------|-------------|
| Sub-agent spawn | `task` tool with typed agents | `Task` tool with prompt-defined scope |
| Agent types | Named personas (general, explore) | Single sub-agent type |
| Permission inheritance | Agent-level rulesets, merged | Inherited from parent |
| Parallelism | Up to 3 explore agents in parallel | Sequential by default |
| Plan workflow | Structured 5-phase process | Ad-hoc planning |

### 6.2 vs Roo Code Modes

| Dimension | OpenCode | Roo Code |
|-----------|----------|----------|
| Mode system | Fixed personas + config custom agents | Fully config-driven custom modes |
| Permission model | Dynamic rule evaluation with wildcards | Static per-mode tool lists |
| Mode switching | Agent selection + plan/build reminders | Boomerang orchestration |
| Sub-agents | First-class `task` tool | Mode-switch delegation |

### 6.3 vs Cline/Codex

| Dimension | OpenCode | Cline | Codex |
|-----------|----------|-------|-------|
| Interface | TUI + Web + Desktop | IDE panel | CLI + sandbox |
| Architecture | Client/Server | IDE-embedded | Sandbox-first |
| Approval | Rule-based permissions | Per-action confirm | Autonomy levels |
| State | SQLite sessions | VS Code state | Cloud sessions |

---

## Appendix: Key Source Files

| Component | Path |
|-----------|------|
| Entry point | `packages/opencode/src/index.ts` |
| Agent definitions | `packages/opencode/src/agent/agent.ts` |
| Session service | `packages/opencode/src/session/session.ts` |
| Prompt assembly | `packages/opencode/src/session/prompt.ts` |
| LLM streaming | `packages/opencode/src/session/llm.ts` |
| Session processor | `packages/opencode/src/session/processor.ts` |
| Compaction | `packages/opencode/src/session/compaction.ts` |
| System prompts | `packages/opencode/src/session/system.ts` |
| Server | `packages/opencode/src/server/server.ts` |
| Provider manager | `packages/opencode/src/provider/provider.ts` |
| Tool registry | `packages/opencode/src/tool/registry.ts` |
| Permission system | `packages/opencode/src/permission/index.ts` |
| Plugin system | `packages/opencode/src/plugin/index.ts` |
| Config system | `packages/opencode/src/config/config.ts` |
| Skill system | `packages/opencode/src/skill/index.ts` |
| TUI code | `packages/opencode/src/cli/cmd/tui/` |
