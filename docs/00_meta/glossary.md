# Glossary

| Term | Definition |
|---|---|
| Agentic Loop | The core perceive-think-act-observe cycle that an autonomous agent executes. |
| Tool-Call | The mechanism by which an LLM requests execution of an external function (usually via JSON schema). |
| MCP | Model Context Protocol, a standard for connecting AI models to context and tools. |
| Repo-Map | A compressed representation of a codebase (often built with tree-sitter) used to give the LLM context. |
| Context Window | The maximum number of tokens an LLM can process in a single inference pass. |
| Vector Store | A database optimized for storing and retrieving high-dimensional vector embeddings (used for semantic memory). |
| Tree-sitter | A parser generator tool used to build concrete syntax trees and extract structural codebase information. |
| RAG | Retrieval-Augmented Generation, fetching relevant documents from a database to ground the LLM's response. |
| Context Assembly | The process of selecting, truncating, and formatting information to fit within the context window. |
| Semantic Memory | Long-term factual knowledge stored typically in a vector database. |
| Working Memory | Short-term context, such as the conversation buffer of the current session. |
| Episodic Memory | Logs of past events, tool executions, or exact conversational turns. |
| Procedural Memory | Structural logic or behavioral rules the agent follows. |
| Sub-Agent | A subordinate agent spawned by a main agent to handle a specific sub-task with a restricted toolset. |
| CoT (Chain of Thought) | A prompting technique forcing the model to articulate intermediate reasoning steps before answering. |
| ToolUse Block | A structured assistant content block carrying `{ id, name, input }` that requests a tool invocation; paired with a `ToolResult` block by `tool_use_id`. [CLAUDE] |
| ToolResult Block | A structured content block carrying `{ tool_use_id, tool_name, output, is_error }` that returns the outcome of a tool invocation; appended to the session before the next iteration. [CLAUDE] |
| Tool-Use Loop | An agentic loop pattern where the model decides termination by emitting an assistant response with no `ToolUse` blocks; each iteration is one (LLM call → tool dispatch → result injection) cycle. [CLAUDE] |
| Permission Mode | The active authorization tier for tool invocations (`ReadOnly`, `WorkspaceWrite`, `DangerFullAccess`, plus runtime-internal `Prompt` and `Allow`). [CLAUDE] |
| Permission Rule | A `ToolName(matcher)` grammar entry in `permissions.{allow, deny, ask}` that matches against an extracted subject from the tool input. [CLAUDE] |
| Hook | A shell command configured under `hooks.{PreToolUse, PostToolUse, PostToolUseFailure}` that fires at a tool-call lifecycle event with a JSON payload on stdin and an extensible JSON schema on stdout. [CLAUDE] |
| Auto-Compaction | A post-turn pass that rewrites a session by replacing older messages with a system summary while preserving the last 4 verbatim, triggered when cumulative input tokens exceed `CLAUDE_CODE_AUTO_COMPACT_INPUT_TOKENS` (default `100_000`). [CLAUDE] |
| Sub-Agent (Claude Code) | A child `ConversationRuntime` spawned by the `Agent` tool in a separate thread with a fresh `Session`, isolated permissions, a per-`subagent_type` tool subset, and `max_iterations: 32`; communicates results via `<agent_id>.md` + `<agent_id>.json` manifest files. [CLAUDE] |
| Qualified MCP Tool Name | The literal model-facing name of an MCP-bridged tool, formatted as `mcp__<server>__<tool>` after `normalize_name_for_mcp` sanitization. [CLAUDE] |
| Dynamic Boundary Marker | The literal string `__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__` inserted between static safety preamble and dynamic context in the system prompt; a string anchor, not a JSON delimiter. [CLAUDE] |
| `.claw/` Settings Root | claw-code's branded settings directory (analog of upstream's `.claude/`); houses `settings.json`, `settings.local.json`, optional `CLAUDE.md` and `instructions.md`. [CLAUDE] |
| `.continuerules` | Version-controlled markdown files with YAML frontmatter defining agent behavior, check policies, and slash commands. Can be placed at workspace root, in `.continue/checks/`, `.continue/agents/`, or colocated as `rules.md`. [CONTINUE] |
| Context Provider | A pluggable retrieval seam in Continue's `core/context/` that implements `getContextItems(query): Promise<ContextItem[]>`. Providers include codebase search, terminal output, git history, web search, docs, and filesystem. Agnostic to IDE vs. CLI execution context. [CONTINUE] |
| Skill (Hermes) | A reusable procedural memory file stored in `~/.hermes/skills/` as markdown with YAML metadata (name, description, parameters, instructions). Compatible with the [agentskills.io](https://agentskills.io) open standard. Auto-created by the curator after successful task completions. [HERMES] |
| Curator | The closed-learning-loop component (`agent/curator.py`) in Hermes that monitors successful completions and auto-creates or refines reusable skills for future invocation. [HERMES] |
| Backend (Hermes) | A `Backend(ABC)` implementation in `tools/backends/` that executes tool calls against a specific runtime: local shell, Docker, SSH, Singularity, Modal, Daytona, or Vercel Sandbox. [HERMES] |
| Provider Transport | `agent/transports/base.py` in Hermes: a `ProviderTransport(ABC)` with `convert_messages`, `convert_tools`, `build_kwargs`, and `normalize_response` \u2014 abstracting per-LLM-provider differences in both message and tool-call formats. [HERMES] |
| Channel Adapter | A messaging-channel abstraction in Hermes (`tui_gateway/`) and OpenClaw (`adapters/`) that normalizes platform-specific input (Telegram, Discord, Slack, WhatsApp, Signal, Email, CLI, etc.) to a canonical `Message` shape. [HERMES] [OPENCLAW] |
| Canvas (OpenClaw) | A live interactive rendering surface in OpenClaw that adapts structured agent output (code blocks, tables, progress indicators) to platform-specific formats (Telegram markdown, Discord embeds, Slack Block Kit, email HTML, ANSI terminal). [OPENCLAW] |
| Two-Style Plugin | OpenClaw's dual plugin architecture: **isolated plugins** communicate over a wire protocol (process-separated, MCP-like) and **in-process plugins** are TypeScript modules loaded directly into the runtime (lower latency, no failure isolation). [OPENCLAW] |
| GPUI | Zed's GPU-accelerated UI framework used to render editor components, including the agent panel and inline assist. Agent output is rendered as native GPUI elements, not via terminal protocols or web technologies. [ZED] |
| Entity (Zed) | A GPUI `Entity<T>` struct that wraps a data type with reactive subscriptions. The agent is an `Entity` \u2014 a data structure inside the editor, not a separate process. Updates propagate to all views via `cx.notify()`. [ZED] |
| Thread (Zed) | A GPUI `Entity<Thread>` that manages the current conversation's messages within the agent. Analogous to `cur_messages` in Aider or `Session::messages` in Claude Code, but integrated into the editor's reactive model. [ZED] |
| ACP | Agent Control Protocol \u2014 an emerging protocol in Zed for connecting editors to external tool providers. ACP servers register tools that appear alongside Zed's built-in tools. Comparable to MCP but integrated into Zed's editor entity model. [ZED] |
| LanguageModelRegistry | A unified registry in Zed (`crates/language_model/`) for querying available models, managing credentials, and routing calls across Anthropic, OpenAI, Ollama, and ACP-compatible servers. [ZED] |
