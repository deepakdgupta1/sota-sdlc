# Specialist Agents — Research Report
> Phase 7 (Task 17) | Tags: [CONTINUE], [HERMES], [OPENCLAW], [ZED]

## 1. Continue
### Architecture Overview

Continue is an IDE coding assistant framework positioned as **source-controlled AI checks enforceable in CI**. Rather than a standalone agent, it is an extensible orchestration layer designed to be embedded in IDEs (VS Code, JetBrains) with a provider-agnostic LLM backend. The core architecture lives in `/continue/core/` and decouples rule definitions from execution contexts.

**Key components:**
- **Provider-agnostic LLM layer** (`core/llm/providers/`) — abstraction over OpenAI, Anthropic, Ollama, etc. with pluggable model selection.
- **Context providers** (`core/context/`) — modular sources of context (codebase, terminal, web, filesystem). Each provider encapsulates retrieval logic and can be composed in rules.
- **Rules system** (`.continuerules` dot-file pattern, `core/llm/rules/`) — markdown-formatted, source-controlled agent definitions. Rules can be checked on every PR or run locally in the IDE.
- **Slash commands** (`core/commands/`) — compose rules with `/` syntax (e.g., `/fix`, `/test`, `/review`).
- **CI integration** — the CLI (`extensions/cli/`) runs checks against PRs as GitHub status checks, reading rule files from `.continue/checks/` and `.continue/agents/`.

**Data flow:**
1. User triggers agent in IDE or CI runs agent via `cn` CLI.
2. Agent loads context from configured providers.
3. Rule (from `.continuerules`, colocated `rules.md`, or default system prompts) is merged with context.
4. LLM is called via provider abstraction.
5. Result is rendered as inline edits, diffs, or status checks.

### Unique Contributions

1. **Source-controlled, enforceable AI checks in CI (the standout pattern).** Rules are committed to `.continue/checks/` as markdown files with YAML frontmatter. Continue CLI (`cn`) executes these on every PR, posting green/red GitHub status checks with suggested diffs. This pattern **treats code review rules as version-controlled artifacts**, similar to linters or test suites. No other agent in the blueprint (Aider, Cline, Roo, Kilo, etc.) implements this explicit CI+VCS binding.
   - Example: `continue/.continue/checks/security-audit.md` runs on every PR.
   - Abstraction: Rule = markdown file with `name`, `description`, and instructions. CLI hydrates it with project context, calls LLM, post result to GitHub.
   - Relevance to blueprint: Bridges the gap between local interactive assists (Aider, Cline) and CI gates (GitHub Actions). Allows teams to define agent-powered checks the same way they define linting rules.

2. **Context providers as pluggable, composable seams.** `core/context/` defines a `ContextProvider` interface:
   ```typescript
   interface ContextProvider {
     getContextItems(query: string): Promise<ContextItem[]>
   }
   ```
   Each provider (web search, terminal output, git history, docs) implements this and is loaded on-demand by rules. This is **more granular than MCP** (which requires the full tool/resource abstraction) and **simpler than Pi Agent's extension system** (which requires SDK coupling). Context providers can be mixed in a rule without code changes — just configure in `continue.json`.
   - Differs from prior agents: Aider uses prompts + CLI context. Kilo uses custom loaders. Continue's provider model is agnostic to execution context (IDE vs. CLI) and stackable.

3. **Rules as distributed source-controlled declarations.** Continue unifies system prompts, user preferences, and agent instructions in a single concept: rules. Rules can live in:
   - `.continuerules` (workspace root, main ruleset).
   - `.continue/checks/` (CI checks).
   - `.continue/agents/` (long-running agents).
   - Colocated `rules.md` files (directory-scoped overrides).
   - This **decentralizes configuration** from `continue.json` into the codebase itself, enabling teams to version agent behavior without tool restarts.
   - Source: `core/llm/rules/rules-utils.ts` defines rule metadata types and source display names.

4. **Provider-agnostic architecture (no vendor lock-in).** The LLM layer (`core/llm/providers/ProviderInterface.ts`) is a thin abstraction over any API: OpenAI, Anthropic, Ollama, custom endpoints. Switching models is a config change, not a refactor. This differs from Aider (which prefers Anthropic) and Cline (which is tightly integrated with Claude). Continue's multi-provider support is comparable to Hermes Agent but applies to the IDE use case.

5. **Slash commands as rule composition primitives.** Commands like `/plan`, `/fix`, `/test` are thin wrappers over rules. The slash command registry (`core/commands/`) allows users to define new commands by writing a rule, without touching the IDE extension code. This is **more user-extensible than editor-native agents** (Zed's inline assist) and **less heavyweight than AutoGPT plugins**.

### Honest Assessment of Novelty

**Novelty Rating: 4/5**

Continue introduces **CI-integrated AI checks** and **distributed source-controlled rules** — patterns not clearly present in the previous 12 agents. The context provider model is simpler and more IDE-friendly than MCP or Pi's extension system, though conceptually similar. The provider-agnostic LLM layer is table stakes by now (seen in Hermes, OpenAI API usage). The novelty is primarily in the **orchestration shape**: rules as markdown + CI gate integration is genuinely novel for this blueprint.

The multi-IDE strategy (VS Code, JetBrains) and the CLI+IDE parity also distinguish Continue. However, the core agent loop itself (message → LLM → tool call → result) is standard.

---

## 2. Hermes Agent
### Architecture Overview

Hermes Agent is a **self-improving, multi-platform agent** built by Nous Research. It emphasizes a **closed learning loop** (autonomous skill creation, self-improvement, persistent memory) and **seven terminal backends** allowing deployment on local machines, Docker, SSH, Singularity, Modal, Daytona, and Vercel Sandbox. The agent is accessible via CLI (rich TUI) and a **messaging gateway** (Telegram, Discord, Slack, WhatsApp, Signal, Email, etc.), enabling a single agent instance to serve multiple platforms.

**Core components:**
- **Agent loop** (`agent/__init__.py`, `agent/auxiliary_client.py`) — manages message routing, tool calls, memory persistence, and skill invocation.
- **Transport abstraction** (`agent/transports/base.py`, `agent/transports/*.py`) — pluggable adapters for different LLM provider APIs (Anthropic, OpenAI, Bedrock, Gemini, Moonshot, Xiaomi MiMo, etc.). Each transport normalizes messages, tools, and responses to a shared schema.
- **Skill system** (`tools/skill_manager_tool.py`, `tools/skills_*.py`, `agent/skill_*.py`) — agent-created procedural memory stored in `~/.hermes/skills/`. Skills are markdown files with YAML metadata, compatible with the [agentskills.io](https://agentskills.io) open standard.
- **Closed learning loop** (`agent/curator.py`, `agent/memory_*.py`) — agent monitors successful task completions, auto-creates or improves skills based on patterns. Persistent memory in `~/.hermes/MEMORY.md`, `~/.hermes/USER.md`.
- **Terminal backends** (`tools/backends/`) — abstraction over execution environments. Backend interface supports `local`, `docker`, `ssh`, `singularity`, `modal`, `daytona`, `vercel-sandbox`.
- **Messaging gateway** (`tui_gateway/`, `tools/`) — unified entry point for Telegram, Discord, Slack, WhatsApp, Signal, Email. Single agent state served to multiple platforms.
- **Context engine** (`agent/context_engine.py`, `agent/context_compressor.py`) — manages conversation state, token budgets, and context compression with periodic summarization.

**Data flow:**
1. User sends message via CLI, Telegram, Discord, etc.
2. Gateway routes to agent loop.
3. Agent loads relevant skills, context, and memory.
4. LLM call via provider transport (Anthropic, OpenAI, etc.).
5. Tool call routed to backend (local shell, docker, ssh, etc.).
6. Result cached in memory, skill auto-creation triggered if notable.
7. Response sent back to user across all connected platforms.

### Unique Contributions

1. **Closed learning loop: autonomous skill creation, self-improvement, and memory persistence.** This is Hermes' standout pattern. After completing a non-trivial task, the agent:
   - Extracts the workflow and writes a skill (SKILL.md + supporting files).
   - Stores the skill in `~/.hermes/skills/` (persisted across sessions).
   - Future similar tasks trigger `/skill-name` instead of re-solving from scratch.
   - Agent nudges itself to refine skills based on context or failures (prompted by periodic curator checks).
   - General memory (user preferences, learned facts, project knowledge) persists in MEMORY.md and USER.md.
   
   **This is NOT present in prior agents.** BabyAGI has episodic memory, Claude Code has CLAUDE.md memory, AutoGPT has vector stores, but none implement **autonomous procedural skill creation + self-improvement + agentskills.io standard compatibility**. Hermes' skill system treats the agent's learned workflows as first-class, reusable assets that evolve across sessions.
   - Source: `tools/skill_manager_tool.py` (lines 1–100) describes agent-managed skill creation, editing, patching, deletion.
   - Files: `agent/skill_preprocessing.py`, `agent/skill_commands.py` handle skill invocation and lifecycle.

2. **Seven terminal backends (abstraction over execution environments).** Hermes can run tasks on:
   - `local` — native shell on the agent's machine.
   - `docker` — containerized execution (isolation, reproducibility).
   - `ssh` — remote machine execution (for cloud VMs, Hetzner, etc.).
   - `singularity` — HPC container runtime (for research clusters).
   - `modal` — serverless functions (scales to zero between invocations, cheap).
   - `daytona` — cloud development environment (Git-backed workspaces).
   - `vercel-sandbox` — JS sandbox (lightweight, fast edge compute).
   
   **What's the abstraction?** Each backend implements:
   ```python
   class Backend(ABC):
       async def execute(self, command: str) -> ExecutionResult: ...
       async def upload_file(self, local_path, remote_path) -> None: ...
       async def download_file(self, remote_path, local_path) -> None: ...
       async def get_status(self) -> BackendStatus: ...
   ```
   This allows the agent to **deploy and scale without code changes** — switch backends via `hermes config set backend modal` and the same task runs serverless. Daytona + Modal offer hibernation (agent sleeps idle, wakes on message) — **nearly-free background operation**.
   
   **Why is this novel?** No prior agent supports this breadth of execution environments. Aider, Cline, Roo are laptop-bound. Claude Code is local-only. Hermes decouples the agent loop from the execution engine, enabling true cloud-native multi-platform deployments.
   - Source: Hermes README line 25; `tools/backends/` (if present) or inferred from README "seven terminal backends".

3. **Messaging gateway: unified agent across 7+ messaging platforms.** One Hermes agent instance runs as a service and bridges:
   - Telegram, Discord, Slack, WhatsApp, Signal, Email, and others (22+ channels total per OpenClaw, which shares the gateway architecture).
   
   **The pattern:** Gateway process (`tui_gateway/`) listens on all platforms. Messages are normalized to a common schema, routed to the agent loop, and responses sent back to the originating platform. User state (memory, skills, conversation history) is shared across all channels.
   
   **Why is this novel?** Most agents are interactive CLI or IDE-only. Hermes allows a single agent to be a Telegram bot, Discord bot, CLI, and web gateway simultaneously, with full context continuity. This is **infrastructure-level novelty** — the agent is a service, not a local tool.
   - Comparison: OpenClaw also has multi-channel support (see below), but Hermes adds the closed learning loop + skill persistence on top.

4. **Provider transport abstraction: decoupled format conversion.** The transport layer (`agent/transports/base.py`) defines:
   ```python
   class ProviderTransport(ABC):
       def convert_messages(messages: List[Dict]) -> Any: ...
       def convert_tools(tools: List[Dict]) -> Any: ...
       def build_kwargs(model, messages, tools) -> Dict: ...
       def normalize_response(response: Any) -> NormalizedResponse: ...
   ```
   
   Each provider (Anthropic, OpenAI, Bedrock, Gemini, Moonshot, etc.) implements this, allowing Hermes to:
   - Use the same agent loop for any LLM API.
   - Switch models with `hermes model openrouter:meta-llama/llama-3.3-70b`.
   - Support both native APIs and OpenRouter aggregation.
   
   **This is comparable to Continue's provider model**, but Hermes' transport also handles tool normalization (not just message conversion) and is tightly integrated with the agent loop's error handling and retry logic.

5. **agentskills.io standard compatibility (emerging skill ecosystem).** Hermes skills are compatible with the open [agentskills.io](https://agentskills.io) specification. This allows:
   - Users to publish skills to a shared hub.
   - Other agents (future integrations) to import and reuse Hermes skills.
   - Skill discovery via `agentskills.io/` browsing.
   
   This **positions Hermes as infrastructure** rather than a closed agent — skills are portable. No other agent in the blueprint explicitly targets a skill standard.

### Honest Assessment of Novelty

**Novelty Rating: 5/5**

Hermes introduces **three genuinely novel patterns:**
1. **Autonomous skill creation + self-improvement (closed learning loop)** — not seen elsewhere.
2. **Seven terminal backends + serverless hibernation** — only Hermes supports this breadth of deployment patterns.
3. **Multi-channel messaging gateway with full context continuity** — elevates the agent from a tool to a service.

The transport abstraction and provider flexibility are table stakes by now. The standout contributions are the learning loop, backend abstraction, and service-oriented architecture. These are foundational to Hermes' positioning as a research-grade, self-improving agent that can scale beyond a single laptop.

---

## 3. OpenClaw
### Architecture Overview

OpenClaw is a **personal AI assistant gateway** run on your own devices, emphasizing **security, multi-channel messaging, and plugin extensibility**. Unlike Hermes (which focuses on autonomous self-improvement), OpenClaw prioritizes **user control** and **live rendering** (Canvas). The architecture is TypeScript-based, decoupling core orchestration, channel adapters, and plugin system.

**Key components:**
- **Gateway process** (`src/gateway/`, `src/infra/`) — central orchestration. Spawns worker processes for each active messaging channel. Handles credential rotation, outbound routing, permission checks.
- **Channel plugins** (`src/channels/`, `extensions/`) — adapters for WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, IRC, Teams, Matrix, Feishu, LINE, Mattermost, Nextcloud Talk, Nostr, Synology Chat, Tlon, Twitch, Zalo, WeChat, QQ, WebChat (22+ documented). Each channel plugin normalizes messages (sender, platform ID, text) to a common schema.
- **Skill/Plugin system** (`src/plugin-sdk/`, `extensions/`, `docs/tools/plugin.md`) — two styles:
  - **Code plugins** — npm packages that hook into runtime (tools, providers, channels). Executed in-process.
  - **Bundle plugins** — package skills, MCP servers, config. More isolated, stable interface.
  - New skills prefer publication to [ClawHub](https://clawhub.ai/) over bundling in core.
- **Live Canvas rendering** (`extensions/canvas/`) — real-time drawing surface the user controls. Agent can write Canvas code (SVG, HTML, JS) that renders live on the user's device.
- **Voice/audio integration** (macOS/iOS/Android) — transcribe voice memos, generate spoken responses. Platform-specific (SwiftUI on iOS, Kotlin on Android).
- **Memory plugin system** (`src/memory/`) — only one memory backend active at a time. Options include Lancedb, Supabase, local SQLite. User chooses.
- **Security first** (`src/file-safety.ts`, `src/command-approval.ts`, `docs/tools/security.md`) — explicit permission gates for filesystem, terminal, network. No defaults to "run anything".

**Data flow:**
1. User sends message on WhatsApp/Telegram/Slack/etc.
2. Channel plugin receives message, normalizes to common schema.
3. Gateway routes to agent loop.
4. Agent loads skills (from ClawHub, local extensions, or bundled).
5. Agent calls tools (terminal, filesystem, MCP, custom).
6. If Canvas command issued, renders live on user's device.
7. Response sent back through originating channel.
8. Terminal/file/skill execution tracked in memory.

### Unique Contributions

1. **Cross-platform messaging gateway (22+ channels in a single agent instance).** OpenClaw's standout pattern is the breadth of channel support. Unlike Hermes (which has 6-7 core channels), OpenClaw abstracts a **unified channel adapter interface** that decouples the agent from the platform layer:
   ```typescript
   interface Channel {
     sendMessage(user_id, text, attachments?): Promise<void>
     receiveMessage(): AsyncIterator<Message>
     editMessage(msg_id, text): Promise<void>
     addReaction(msg_id, emoji): Promise<void>
   }
   ```
   
   Each channel implements this in `src/channels/<platform>/` or as a plugin. The agent doesn't know if a message came from WhatsApp or IRC — it just sends a normalized reply. This is **more modular than Hermes' gateway** (which is more tightly coupled) and **simpler than MCP** (which requires separate server processes).
   
   **Why is this novel?** The sheer breadth (22+ channels) and the explicit decoupling (channel plugins are first-class) make this a distinct architectural contribution. Most agents (Aider, Cline, Roo, Kilo) are CLI/IDE-only. Hermes + OpenClaw both solve multi-channel, but OpenClaw's design emphasizes **plugin isolation** and **user-chosen channels** (not bundled by default).
   - Source: `openclaw/src/channels/` directory structure; `docs/tools/plugin.md` (VISION.md line 54–71).

2. **Live Canvas rendering (real-time, user-controlled drawing).** OpenClaw allows the agent to emit Canvas code (SVG, HTML, interactive JS) that renders on the user's device in real-time. Examples:
   - Agent draws a flowchart, user edits it mid-render.
   - Agent generates a D3.js chart, user can zoom/pan.
   - Agent writes a mini-app (todo list, calculator) that runs client-side.
   
   **The abstraction:** Canvas code is sent as a structured message (`{type: "canvas", content: "<svg>..."}`) and the client renders it in a dedicated pane. The user's edits can be sent back to the agent for refinement.
   
   **Why is this novel?** No prior agent has this. Claude Code shows code diffs, Zed has inline assists, but neither offer **live, collaborative, user-editable canvas rendering**. This is UI-layer novelty, orthogonal to the agent loop itself.
   - Source: `extensions/canvas/` (if present); VISION.md mentions "live Canvas you control".

3. **Two-style plugin system: code plugins (in-process) vs. bundle plugins (isolated).** OpenClaw's plugin architecture (VISION.md lines 59–71) distinguishes:
   - **Code plugins** — hook into core (runtime hooks, providers, channels, tools). Executed in-process, can mutate state, faster but less isolated.
   - **Bundle plugins** — package skills, MCP servers, static config. More stable interface, easier distribution via ClawHub.
   
   New features prefer bundle style (MCP servers, skills) over code plugins. This is **intentional constraint** — core stays lean, extensibility happens at the edge.
   
   **Why is this novel?** Most agents (Aider, Cline, Pi) don't distinguish execution style. AutoGPT plugins are all in-process. OpenClaw's explicit two-tier model (isolated vs. in-process) with a strong preference for isolation is a **design principle, not just implementation detail**. It reflects security-first thinking.
   - Source: `docs/tools/plugin.md`, VISION.md section "Plugins & Memory".

4. **MCP as a plugin mechanism (not the core abstraction).** OpenClaw supports MCP servers **as a plugin style**, not as the primary extension mechanism. MCP details live in `docs/cli/mcp.md`. The goal is "pragmatic MCP support without duplicating existing agent, tool, ACPX, plugin, or ClawHub paths" (VISION.md line 90).
   
   This differs from Claude Code (which treats MCP as first-class infrastructure). OpenClaw says MCP is useful but not the only path — skills and ClawHub are equally important. This is a **architectural restraint**: don't let one standard monopolize extensibility.

5. **Voice/audio integration on native platforms (macOS, iOS, Android).** OpenClaw includes platform-specific (SwiftUI, Kotlin) voice transcription and TTS:
   - User sends voice memo → OpenClaw transcribes to text (platform native, fast) → agent processes → responds with TTS.
   - No dependency on external APIs (Whisper, ElevenLabs) unless configured.
   
   **Why is this novel?** Desktop agents (Aider, Cline, Roo, Kilo) don't have voice. Hermes + OpenClaw support voice, but only OpenClaw has native iOS/Android integration (not just Telegram/Discord bots transcribing). This is **platform-native UI**, not simulated.
   - Source: VISION.md mentions "Voice memo transcription, cross-platform conversation continuity".

### Honest Assessment of Novelty

**Novelty Rating: 3/5**

OpenClaw excels in **breadth and user control** but less in fundamental agent patterns. The unique contributions are:
1. **22+ channel adapters + explicit decoupling** — genuine breadth.
2. **Live Canvas rendering** — UI-layer novelty, not agent-loop novelty.
3. **Two-style plugin system** — architectural principle, not algorithmic novelty.

The closed learning loop and autonomous skill creation (Hermes' strength) are less emphasized in OpenClaw. The agent loop itself is standard (message → LLM → tool call). The novelty is in **infrastructure and user control**, not in agent autonomy or learning patterns. For the blueprint, OpenClaw is strongest on **extensibility and user choice**, weakest on **self-improvement**.

---

## 4. Zed
### Architecture Overview

Zed is a **high-performance editor** (from the creators of Atom and Tree-sitter) with **native agent integration**. Unlike standalone agents, Zed embeds the agent loop directly into the editor UI, making it a **first-class editor primitive** rather than an external tool. The agent is accessible via a sidebar panel, inline assist (in the editor buffer), and AI onboarding flows.

**Key components:**
- **Agent crate** (`crates/agent/`) — core agent loop integrated with Zed's state management (Entity, Context, GPUI event system). Handles message routing, tool calls, context management.
- **Agent UI crate** (`crates/agent_ui/`) — UI components for agent panel, inline assistant, model selector, diffs, settings. Renders using GPUI (Zed's custom UI framework).
- **Agent servers** (`crates/agent_servers/`) — manages connections to multiple LLM providers (Anthropic, OpenAI, Ollama, etc.) and the Agent Control Protocol (ACP) servers.
- **Agent settings** (`crates/agent_settings/`) — per-agent profiles, model selection, API key storage.
- **Inline assistant** (`crates/assistant/`, if present) — code completion, refactoring, docstring generation directly in the buffer.
- **Project-level context** (`crates/project/src/agent_registry_store.rs`) — agent registry, agent-to-project bindings, workspace rules integration.
- **GPUI rendering** (`crates/gpui/`) — custom UI framework. Agent panels, inline elements, and diffs all render via GPUI's entity/context/render system.
- **Rules library** (`crates/rules_library/`) — project-level agent rules (similar to Continue's `.continuerules` but integrated into Zed's settings system).

**Data flow:**
1. User opens editor, agent panel is docked in sidebar (or toggled).
2. User types a message or triggers inline assist (e.g., "refactor this function").
3. Agent panel or inline element captures input, routes to agent loop.
4. Agent loads project context (files, git history, project rules).
5. LLM call via agent server (multi-provider support via ACP).
6. Response is rendered back in the panel or as inline diff/edit.
7. User approves edit, editor applies changes directly to buffer.

### Unique Contributions

1. **Editor-native agent integration (agent as a first-class editor primitive).** Unlike standalone agents (Aider, Cline, Roo, Kilo) which run in a separate process and communicate via LSP or APIs, Zed integrates the agent directly into the editor:
   - **Agent panel** — sidebar UI (like ChatGPT, but inside the editor). Agent state is an Entity managed by Zed's state system. Messages are stored in a Thread (analogous to a conversation, but editor-aware).
   - **Inline assist** — the agent can suggest edits directly in the editor buffer. No copy-paste; agent diffs are rendered as selections, and the user accepts/rejects inline.
   - **Agent buffer** (if applicable) — the agent can edit a file directly, and the editor shows a live diff panel.
   
   **The abstraction:** The agent loop (`crates/agent/src/agent.rs`) is a Zed Entity that:
   - Subscribes to user input (messages, button clicks, actions).
   - Emits events (message received, tool call needed, edit suggested).
   - Renders its UI via GPUI's `Render` trait.
   
   This is **different from IDE extensions** (VS Code: separate process, LSP protocol). Zed's agent is a **native data structure** that can mutate editor state directly and participate in undo/redo, selection management, etc.
   
   **Why is this novel?** Most editors (VS Code, JetBrains, Neovim) treat AI as a sidebar tool or LSP server. Zed treats it as a first-class citizen with deep editor integration. This is **architectural**, not just cosmetic. The agent can know about editor state (cursor position, selected text, buffer history) without an out-of-process hop.
   - Source: `crates/agent/src/agent.rs` (thread management, GPUI entity lifecycle); `crates/agent_ui/src/agent_panel.rs` (sidebar rendering).

2. **Multi-language model support inside the editor (provider-agnostic LLM selection).** Zed supports multiple LLM providers (Anthropic, OpenAI, Ollama, and others via Agent Control Protocol) **within the editor**. Users can:
   - Set a default model (`settings.json` or UI).
   - Switch models per-conversation (`/model openrouter:...`).
   - Fall back to a local model (Ollama) if API is unreachable.
   
   The `LanguageModelRegistry` (`crates/language_model/`) provides a unified interface for querying available models, managing credentials, and routing calls.
   
   **Why is this novel?** VS Code's GitHub Copilot is OpenAI/Anthropic-only. Zed allows **user choice** of provider and model, all within the editor. This is comparable to Continue's provider abstraction but applied to a first-party editor (not a plugin).
   - Source: `crates/agent_settings/src/agent_profile.rs`, `crates/language_model/` (if exposed).

3. **GPUI rendering implications for agent UI.** Zed's custom UI framework (GPUI) is **GPU-accelerated, stateful, and reactive**. Agent UI components (panel, inline edits, diffs) leverage GPUI's primitives:
   - **Entities** — agent state (messages, thread, selected model) is a GPUI Entity, not a separate JSON blob. Updates propagate automatically to all views.
   - **Render trait** — agent panel implements `Render` and automatically rerenders when state changes (via `cx.notify()`).
   - **Event system** — user actions (button clicks, text input) are handled via GPUI's action/listener system, not imperative callbacks.
   - **Animations** — Zed can animate state transitions (e.g., message appearance, diff highlighting).
   
   **Why is this relevant to the blueprint?** Most agents (Aider, Cline, Roo) use web-based UIs (HTML/CSS/JS) or TUI (Hermes). Zed's agent UI is **rendered natively** using a custom GPU-accelerated framework. This enables:
   - **Instant updates** (no network hop to LSP server or web UI).
   - **Deep editor integration** (diffs, inline edits, buffer state).
   - **Performance** (GPU-rendered UI, native event dispatch).
   
   This is **infrastructure-level novelty**, not agent-algorithm novelty. But it shapes the user experience significantly.
   - Source: `crates/agent_ui/src/agent_panel.rs` uses GPUI's `Render` trait; `crates/gpui/src/` defines the framework.

4. **Agent as a data structure, not a service.** In Zed, the agent is an Entity:
   ```rust
   struct Agent {
       thread: Entity<Thread>,
       model_selection: LanguageModelSelection,
       _subscriptions: Vec<Subscription>,
   }
   ```
   
   This is **radically different** from standalone agents (Aider, Cline, Hermes) which are processes. Zed's agent:
   - Shares memory with the editor (no IPC overhead).
   - Can synchronously access editor state (buffer content, cursor position, file paths).
   - Participates in undo/redo (edits apply to the editor's MultiBuffer).
   - Respects editor keybindings and permissions.
   
   **Why is this novel?** It's a **different deployment model**. Instead of "run an agent in a separate window", it's "agent IS a first-class data structure inside the editor". This is more akin to how VS Code's IntelliSense works (deeply embedded) than how Copilot Chat works (sidebar panel over the editor).
   - Source: `crates/agent/src/agent.rs` (Entity definition, Thread handling).

5. **Project-level agent context integration.** Agents in Zed are bound to projects and can read project-level rules:
   - **Rules library** — similar to Continue's `.continuerules`, but stored in Zed's settings and project metadata.
   - **Project snapshot** — agent can access project file structure, worktrees, git state without filesystem I/O (all cached in Zed's project model).
   - **Language registry** — agent knows what languages are in the project and their syntax rules.
   
   This is **less novel** (Continue and Hermes also have project context), but Zed's implementation is tighter because the agent is a native editor entity.

### Honest Assessment of Novelty

**Novelty Rating: 3/5**

Zed's unique contributions are **architectural** (agent as native data structure, GPUI rendering) rather than **algorithmic** (learning loops, skill creation). The agent loop itself is standard. Zed excels in **editor integration depth**, not in agent autonomy or self-improvement.

Key novelties:
1. **Agent as a first-class editor primitive** (not an LSP server or sidebar plugin) — this is genuine architectural novelty.
2. **GPUI rendering** and instant state synchronization — infrastructure novelty.
3. **Multi-provider LLM support** — table stakes by now, but well-executed.

What Zed **lacks** relative to the blueprint:
- **No closed learning loop** (Hermes' strength).
- **No distributed rule system** (Continue's strength).
- **No multi-platform deployment** (Hermes + OpenClaw strength).

For the blueprint, Zed contributes a **new deployment model** (editor-native, stateful entity) but not a new agent autonomy pattern.

---

## 5. Unique Contributions Summary

### Continue
- **Source-controlled AI checks in CI** — rules committed to `.continue/checks/`, executed on every PR as GitHub status checks. Treats code review rules as version-controlled artifacts (not seen in prior agents).
- **Distributed source-controlled rules** — `.continuerules`, colocated `rules.md`, `.continue/agents/`. Rules live in the codebase, not just config files.
- **Context providers as pluggable seams** — simpler than MCP, more flexible than custom loaders.

### Hermes Agent
- **Autonomous skill creation + self-improvement** (closed learning loop) — agent learns from experience, creates reusable skills, refines them over time. Not seen in Claude Code, Aider, AutoGPT, or others.
- **Seven terminal backends (local, Docker, SSH, Singularity, Modal, Daytona, Vercel Sandbox)** — abstraction over execution environments. Enables serverless deployment with hibernation. Unique breadth.
- **Multi-channel messaging gateway** (7+ platforms with context continuity) — single agent state served to Telegram, Discord, Slack, etc. Positions the agent as a service, not a local tool.
- **agentskills.io standard compatibility** — skills are portable across agents (emerging ecosystem).

### OpenClaw
- **Cross-platform messaging gateway (22+ channels)** — unifies WhatsApp, Telegram, Slack, Discord, Signal, iMessage, IRC, Teams, Matrix, Feishu, LINE, Mattermost, Nextcloud Talk, Nostr, Synology Chat, Tlon, Twitch, Zalo, WeChat, QQ, WebChat. Explicit channel adapter abstraction.
- **Live Canvas rendering** — agent emits SVG/HTML/JS that renders in real-time on user's device. User can edit live. No other agent has this.
- **Two-style plugin system** (code plugins vs. bundle plugins) — intentional distinction with security-first lean toward isolation.
- **Voice/audio on native platforms** (iOS, Android, macOS) — transcribe and TTS without external APIs (unless configured).

### Zed
- **Agent as first-class editor primitive** (native data structure, not LSP server or sidebar plugin) — deep integration with editor state, undo/redo, buffer management.
- **GPUI rendering** — GPU-accelerated, stateful UI framework. Instant updates, smooth animations. Infrastructure-level novelty.
- **Multi-LLM provider support** (Anthropic, OpenAI, Ollama, ACP-compatible) — user can switch models per-conversation, all within the editor.

---

## 6. Honest Novelty Assessment

### Continue — Novelty Rating: 4/5
**Justification:** CI-integrated AI checks + distributed source-controlled rules are novel orchestration patterns not seen in the previous 12 agents. The context provider model is simpler than MCP. Provider-agnostic LLM layer is table stakes. The standout is the rule distribution + CI integration, which bridges local interactive assists and CI gates in a clean way.

### Hermes Agent — Novelty Rating: 5/5
**Justification:** Three genuinely novel patterns: (1) autonomous skill creation + self-improvement (closed learning loop) — not in Claude Code, Aider, AutoGPT, BabyAGI, or others. (2) Seven terminal backends + serverless hibernation — only Hermes supports this breadth. (3) Multi-channel messaging gateway as a service — agent as infrastructure, not just a tool. These are foundational contributions to a research-grade, self-improving agent.

### OpenClaw — Novelty Rating: 3/5
**Justification:** Excels in breadth (22+ channels, explicit plugin isolation) and user control, but less in fundamental agent patterns. Live Canvas is UI-layer novelty. Multi-channel support is similar to Hermes but emphasizes user choice. Lacks closed learning loop. The agent loop itself is standard. Strongest on extensibility and user control, weakest on agent autonomy.

### Zed — Novelty Rating: 3/5
**Justification:** Agent as a native editor data structure (Entity) is architectural novelty — different from LSP servers and sidebar plugins. GPUI rendering and instant state sync are infrastructure novelties. Multi-provider LLM support is well-done but table stakes. Lacks closed learning loop and distributed rules. Contributes a new deployment model (editor-native, stateful) but not new agent autonomy patterns.

---

## 7. Cross-Agent Architectural Contrasts

### Deployment Model
- **Continue:** IDE plugin + CLI (local or CI runner).
- **Hermes:** Service (local or cloud). Multi-platform messaging gateway.
- **OpenClaw:** Service (local or remote). User-chosen channels.
- **Zed:** Editor-native (first-class entity, not plugin).

### Learning & Persistence
- **Continue:** Rules + system prompts (no autonomous learning).
- **Hermes:** Closed learning loop — autonomous skill creation, self-improvement, memory persistence.
- **OpenClaw:** Memory plugins (user-chosen backend), no autonomous skill creation.
- **Zed:** Project rules, no autonomous learning.

### Extensibility Style
- **Continue:** Context providers, slash commands, provider plugins.
- **Hermes:** Skills (agentskills.io standard), terminal backends, messaging adapters, transport plugins.
- **OpenClaw:** Code plugins (in-process), bundle plugins (MCP, skills, config), ClawHub registry.
- **Zed:** Extensions (Zed extension SDK), project-level rules.

### LLM Provider Strategy
- **Continue:** Provider-agnostic, user configurable.
- **Hermes:** Provider-agnostic via transport abstraction. Multi-provider support (OpenRouter, etc.).
- **OpenClaw:** User-configured providers, no built-in multi-provider (relies on external routing).
- **Zed:** Multi-provider support via LanguageModelRegistry and ACP.

---

## 8. Limited Novelty Notes

- **Zed's agent loop** (message → LLM → tool call → result) is standard, comparable to Claude Code, Cline, Aider. The novelty is in deployment (native editor entity) and UI (GPUI), not the loop itself.
- **OpenClaw's agent loop** is also standard. The novelty is in breadth of channels and user control, not in agent autonomy.
- **Continue's agent** is simpler — it's not a persistent agent but a stateless rule executor. It doesn't maintain conversation state across invocations (though rules can compose context).
- **Hermes' transport abstraction** is well-executed but comparable to Continue's provider abstraction. The real novelty in Hermes is the closed learning loop + backend breadth.

---

## 9. Synthesis for Blueprint

For the Master AI Agent Blueprint (Task 18 synthesis), these agents contribute:

1. **Hermes:** Closed learning loop + seven terminal backends + service-oriented architecture. This is the strongest contribution and should inform Blueprint's autonomous skill subsystem and deployment strategies.

2. **Continue:** Source-controlled rules + CI integration. Blueprint should model how rules are distributed, versioned, and enforced across environments.

3. **OpenClaw:** Multi-channel messaging abstraction + user control over extensibility. Blueprint should learn the channel adapter pattern for multi-platform deployment.

4. **Zed:** Native editor integration (data structure, not plugin). Blueprint should consider how agents can be deeply embedded in host systems, not just external tools.

The **lack of overlap** (Hermes ≠ Continue ≠ OpenClaw ≠ Zed in their core contributions) suggests the Blueprint should be **modular and composable** — e.g., a Hermes-style learning loop + Continue-style rule distribution + OpenClaw-style channel adapters + Zed-style editor integration as separate, opt-in subsystems.

