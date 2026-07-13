# Architectural Hierarchy v_FINAL

This document tracks the evolution of the Master AI Agent Blueprint framework.
Version: v_FINAL

## Version history

| Version | Phase | Agents folded in | Source reports |
| --- | --- | --- | --- |
| v0 | 0 | (seed) | `AI Agent Feature Hierarchy Development.md` |
| v1 | 1 | [AIDER], [BABYAGI] | `aider_research.md`, `babyagi_research.md` |
| v2 | 2 | + [CLAUDE] (claw-code) | `claude_code_research_part1.md`, `claude_code_research_part2.md` |
| v3 | 3 | + [CODEX] | `codex_research.md` |
| v4 | 4 | + [CLINE], [ROO] | `cline_research.md`, `roo_code_research.md` |
| v5 | 5 | + [KILO], [OPENCODE] | `kilo_code_research.md`, `opencode_research.md` |
| v6 | 6 | + [AUTOGPT], [PI] | `autogpt_research.md`, `pi_agent_research.md` |
| **v_FINAL** | 7 | + [CONTINUE], [HERMES], [OPENCLAW], [ZED] | `specialist_agents_research.md` |

## Scope of v_FINAL

Version v_FINAL incorporates Phase 7 findings from `docs/_research/specialist_agents_research.md`, integrating four specialist agents: [CONTINUE], [HERMES], [OPENCLAW], and [ZED]. Seven structural additions define v_FINAL:

1. **Distributed, source-controlled rule-based extensibility.** [CONTINUE] introduces a **prompt-as-code** paradigm where agent behavior is defined in markdown rules with YAML frontmatter (`.continuerules`, `.continue/checks/`, `.continue/agents/`, colocated `rules.md`). Rules compose with pluggable context providers and execute as IDE commands or CI status checks. The CLI (`cn`) reads check rules, hydrates them with project context, calls the LLM, and posts green/red GitHub status checks with suggested diffs — treating code review policies as testable artifacts. This is a fifth extensibility paradigm alongside MCP (protocol), code-based plugins, loaders, and autonomous skills.

2. **Autonomous procedural memory creation (closed learning loop).** [HERMES] introduces a **self-improving agent** pattern where the agent monitors successful task completions via `agent/curator.py` and auto-creates reusable skills (markdown with YAML metadata in `~/.hermes/skills/`). Skills are compatible with the [agentskills.io](https://agentskills.io) open standard. Future similar tasks are planned by invoking existing skills rather than re-solving from scratch. This is the first **procedural-memory-driven planning paradigm** in the blueprint — not seen in prior agents' episodic, semantic, or instruction-file memory.

3. **Multi-channel messaging gateway and backend-abstracted tool dispatch.** [HERMES] routes incoming messages from 7+ channels (Telegram, Discord, Slack, WhatsApp, Signal, Email, CLI) through a gateway abstraction. Tool calls are dispatched to one of seven terminal backends (local, Docker, SSH, Singularity, Modal, Daytona, Vercel Sandbox) via a `Backend(ABC)` interface. [OPENCLAW] extends the multi-channel pattern to 22+ adapters with a Canvas live rendering surface. This is the **widest I/O surface** in the blueprint.

4. **Agent-as-native-editor-entity.** [ZED] models the agent as a GPUI `Entity` struct that shares memory with the editor — synchronous access to buffer content, cursor position, worktrees, and undo/redo. Output is rendered via GPUI (GPU-accelerated, sub-frame latency). This is a fundamentally different **deployment model** from CLI processes, VS Code extensions, or HTTP servers. The agent is a data structure, not a process.

5. **Five extensibility paradigms consolidated.** The blueprint now recognises five extensibility paradigms: protocol (MCP), code-based plugins (AutoGPT components + Pi hooks), loader-based (OpenCode), rule-based/CI-integrated (Continue), and autonomous skill creation (Hermes). The extensibility comparison table is expanded to five columns.

6. **ACP and two-style plugin system.** [ZED] introduces Agent Control Protocol (ACP) servers as an MCP alternative integrated into the editor's entity model. [OPENCLAW] introduces a two-style plugin system (isolated vs. in-process) with 22+ channel adapters.

7. **Provider transport abstraction.** [HERMES] adds a provider transport layer (`agent/transports/base.py`) with per-provider tool normalization (not just message conversion). [ZED] adds a `LanguageModelRegistry` with ACP support. Both extend the model routing paradigm beyond Phase 6's six patterns.

1. **Autonomous goal-seeking loop as a fifth macro-pattern.** The blueprint now recognises five loop families: interactive code-edit (Aider), tool-use protocol (Claude Code, Codex), IDE-embedded per-action-approval (Cline, Roo Code), TUI/CLI-driven session (OpenCode, Kilo), and **autonomous goal-seeking** [AUTOGPT]. The autonomous loop centers on a single `propose_action` / `execute` pair driven by a configurable prompt strategy, with implicit observation (next-prompt assembly reads `event_history`), permission denial as feedback rather than termination, and a watchdog repetition detector that reactively escalates `fast_llm → smart_llm`. Termination is reached via `finish` (LLM-emitted), `consecutive_failures >= 3`, SIGINT, or `--continuous-limit`. (`classic/original_autogpt/autogpt/agents/agent.py:266-339, 373-460`; `app/main.py:607-787`.) [AUTOGPT]

2. **Swappable prompt-strategy state machine.** A single agent runtime hosts seven dramatically different planning paradigms — `one_shot`, `plan_execute`, `rewoo`, `reflexion`, `tree_of_thoughts`, `lats`, `multi_agent_debate` — each holding its own phase enum that is mutated *inside* `parse_response_content`. ReWOO's `EXECUTING` phase introduces the **`UseCachedActionException`** pattern: `build_prompt` raises a typed exception to skip the LLM call entirely and replay a cached `AssistantFunctionCall`, registering the action in history without a model round-trip. Reflexion contributes a structured `Reflection` record with a strategy-local `ReflexionMemory` buffer (capped at 20, FIFO). Three strategies (ToT, LATS, multi-agent debate) decompose by spawning real `Agent` sub-instances with `ResourceBudget` decrementing per level. (`prompt_strategies/{one_shot,plan_execute,rewoo,reflexion,tree_of_thoughts,lats,multi_agent_debate,base}.py`.) [AUTOGPT]

3. **Episodic memory populated from stub.** `docs/04_memory/episodic_memory.md` is no longer a stub — it documents AutoGPT's `EpisodicActionHistory` (`Episode(action, result, summary)` records with lazy LLM-driven compression of older entries via `asyncio.gather summarize_text` over `fast_llm` + spaCy chunking; idempotent caching of `Episode.summary`; two-tier prompt assembly with last 4 verbatim + summarized progress capped at `max_tokens=1024`), the `Reflection` record + `ReflexionMemory` buffer, `state.json` persistence after every Agent Protocol step, and the **honest gap** that `ReflexionPromptStrategy.memory` is *not* serialized to `state.json`. [AUTOGPT]

4. **Code-based plugin paradigm as a third extensibility model.** The blueprint now recognises three plugin paradigms: protocol-based (MCP, Phase 2/4), code-based ([AUTOGPT]'s component system + `SKILL.md` runtime-discoverable skills + [PI]'s extension hooks), and loader-based (OpenCode `customLoaders`). AutoGPT's component system uses `AgentComponent` ABC + protocols (`DirectiveProvider`, `CommandProvider`, `MessageProvider`, `AfterParse`, `AfterExecute`, `ExecutionFailure`) + `@command(names, description, parameters)` decorator with class-time `_parameters_match` signature validation + `AgentMeta.__call__` metaclass auto-discovery + `_topological_sort` via `run_after()` declarations. The `SKILL.md` skills system provides 3-level progressive disclosure (METADATA always loaded, FULL_CONTENT on `load_skill`, ADDITIONAL on `read_skill_file`) aligned with Anthropic's open Agent Skills standard. The legacy `auto_gpt_plugin_template` system is **defunct** in this checkout (empty `classic/original_autogpt/plugins/`, no `install_plugin_deps` wiring) — flagged honestly. Pi's extension hooks (`transformContext`, `convertToLlm`, `beforeToolCall`, `afterToolCall`, `shouldStopAfterTurn`, steering/follow-up queues) and pluggable `*Operations` objects on tools complete the in-process pluggability story. [AUTOGPT] [PI]

5. **Budget-as-soft-guardrail and minimal-by-design guardrails as two contrasting safety paradigms.** `docs/07_permissions_and_governance/safety_guardrails.md` is no longer a stub — it documents AutoGPT's **four-axis budget model** (cycle, token, money, sub-agent depth/count) with the **honest gap** that `total_budget` cost tracking is logged-only and NOT enforced as a hard stop (gap vs Codex), three liveness mechanisms (`consecutive_failures`, `WatchdogComponent` repetition detection, SIGINT handling), six structural termination conditions, and an output-size guard that replaces tool results > `send_token_limit // 3` with a deterministic error. Pi sits at the opposite end of the spectrum: **minimal guardrails by design** — no built-in cost / cycle / sandbox surface; the `beforeToolCall` hook is the single extension point. Pi's research §7 explicitly flags that bash runs in the user's shell with full access — Pi delegates safety to the embedding application. [AUTOGPT] [PI]

6. **Lazy-loaded multi-LLM API as a third routing paradigm.** Model routing now distinguishes three patterns: Aider's role-split (architect / editor / weak / main), Kilo's gateway proxy (`@kilocode/kilo-gateway` wrapping 5 AI SDK providers), and **Pi's lazy-loaded API registry** ([PI] `@earendil-works/pi-ai`). Pi uses a strict one-to-one API → provider registry where each provider's SDK module is *dynamically imported on first use* via `createLazyStream(loadProviderModule)` — users who never touch Bedrock never load the AWS SDK. 14 supported APIs include direct SDK clients (Anthropic, OpenAI, Google, Mistral) and direct HTTP for OpenAI-compat endpoints (Groq, Cerebras, xAI). Reasoning is unified via a provider-agnostic `ThinkingLevel` enum (`minimal | low | medium | high | xhigh`) with optional per-level token budgets that providers map to native fields. (`packages/ai/src/providers/register-builtins.ts:89-403`, `stream.ts:17-59`.) [PI]

Additional v6 refinements:

- **Output formatting populated from stub.** `docs/08_user_interaction/output_formatting.md` documents Pi's `pi-tui` differential rendering, three rendering strategies (first / width-change / normal), CSI 2026 synchronized output, IME support via `CURSOR_MARKER` zero-width APC sequence, Kitty keyboard protocol opt-in, and the component-model with `render(width: number): string[]` interface. (`packages/tui/src/tui.ts`.) [PI]
- **Reasoning patterns extended.** `docs/02_cognition/reasoning_patterns.md` adds the `self_criticism` schema field (forced on every cycle for all 7 strategies), the **Reflexion** explicit verbal-reinforcement loop (with pluggable `Evaluator` — `EvaluatorType.HEURISTIC` regex by default, `EvaluatorType.LLM` declared but currently falls back to heuristic), the **ReWOO cached-action replay** pattern, **ToT** categorical evaluation with multi-sample voting, and **Multi-Agent Debate** structured `CRITIQUE / CONSENSUS` phases. The implicit-vs-explicit critique split is preserved as a modeling distinction. [AUTOGPT]
- **Pi tool-calling runtime contributions.** `AgentTool<TParameters, TDetails>` interface with TypeBox schema-first definitions, `AgentToolResult { content, details, terminate }` shape, parallel-mode execution that preserves assistant source order for tool-result messages while emitting `tool_execution_end` events in completion order, pluggable `*Operations` objects on tools for SSH/container/remote backends, and TypeScript declaration merging on `CustomAgentMessages` for app-extensible message types. [PI]
- **Sub-agent depth tree.** `ResourceBudget {max_depth=5, max_sub_agents=25, max_cycles_per_agent=50}` decrements `max_depth` per level via `create_child_budget()` and **zeroes `explicit_allow_rules`** so children must get explicit permissions; deny rules are inherited. Distinct from Roo's Boomerang and Kilo's worktree orchestration. [AUTOGPT]
- **No vector store in modern AutoGPT Classic — negative result.** `docs/04_memory/semantic_memory.md` records that the 2023 Pinecone/FAISS pattern has been retired; semantic memory is gone in this checkout. The `SkillComponent` is YAML-frontmatter-based discovery, not similarity-keyed. Worth recording as a deliberate architectural retreat. [AUTOGPT]

> **Source-of-truth note (v6)**: the [AUTOGPT] research is grounded in a local checkout of `Significant-Gravitas/AutoGPT` at HEAD `c08b9774dc90f45f0958c6c0d9e9538d094a08af` with primary focus on `classic/forge/` + `classic/original_autogpt/` (the unsupported but architecturally substantive subtree); the supported `autogpt_platform/` block-based product is documented as a "platform delta" but does not contribute the autonomous-loop pattern this phase targets. The [PI] research is grounded in the local checkout of `pi-mono` at HEAD `3d5cbe98c3bc67ef8433bdeee45fbe5f0d8a24db`, covering `packages/ai/`, `packages/agent/`, `packages/coding-agent/`, and `packages/tui/`.

## Scope of v5

Version v5 incorporates Phase 5 findings from `docs/_research/kilo_code_research.md` and `docs/_research/opencode_research.md`. Five structural additions dominate v5:

1. **Task lifecycle populated from stub.** `docs/06_orchestration/task_lifecycle.md` is no longer a stub — it documents Kilo Code's plan→code handoff pipeline (structured `PlanFollowup` with LLM-generated handover summaries, cross-session todo persistence, and code model resolution), OpenCode's git-based snapshot system (separate snapshot repo at `~/.local/share/kilo/snapshot/` with `track` → `patch` → `restore` → `revert` operations), and Kilo's AI code review system (`/local-review` with structured severity/confidence thresholds and post-review mode routing). [KILO] [OPENCODE]

2. **Config-file protection as a fifth permission paradigm.** The permission taxonomy now has five paradigms: mode-based [CLAUDE], two-dimensional matrix [CODEX], per-action approval [CLINE], mode-as-permission [ROO], and config-file protection [KILO]. Kilo's `ConfigProtection` layer intercepts `edit` and `external_directory` permissions targeting agent config files, with the "Always Allow" UI disabled for config paths. The `drainCovered` mechanism auto-resolves permissions across concurrent sub-agents. Per-agent bash rulesets (`bash` full-access vs `readOnlyBash` deny-default) provide granular command filtering. [KILO]

3. **Proxy-first multi-provider routing.** Model routing gains the Kilo Gateway (`@kilocode/kilo-gateway`) — a proxy provider wrapping OpenRouter, Anthropic, OpenAI, Alibaba, and OpenAI-compatible backends behind a single `createKilo()` factory. Provider-specific patches (Anthropic beta headers, Cerebras 3rd-party headers, Azure endpoint overrides) are applied transparently. A custom `buildTimeoutSignal()` prevents aborting healthy streaming responses. OpenCode's `customLoaders` system provides the extensible provider foundation. [KILO] [OPENCODE]

4. **Named-agent system alongside mode framework.** Kilo defines six native agents (`code`, `plan`, `debug`, `ask`, `orchestrator`, `explore`) with per-agent permission rulesets composed via `Permission.fromConfig()` + `Permission.merge()`. This parallels but is structurally distinct from Roo's `ModeConfig` YAML system — Kilo uses TypeScript-defined permission merging with explicit composition order (defaults → agent-specific → user config → deny overrides), while Roo uses tool-group RBAC with file-regex restrictions. [KILO]

5. **Git worktree multi-session orchestration.** The Agent Manager (VS Code extension) uses git worktrees for OS-level filesystem isolation of parallel agent sessions. Each worktree has its own branch, working directory, and `kilo serve` backend. Multi-version exploration spawns N worktrees with the same prompt but different models. Selective apply/revert operates at the file level across worktrees. This is the only agent in the blueprint with OS-level session isolation. [KILO]

Additional v5 refinements:

- **Semantic search tool.** Kilo adds `semantic_search` (LanceDB vector search), `codebase_search` (multi-step intelligent code search via warpgrep), and `recall` (context memory) to the tool catalog. [KILO]
- **Plan→code handover generation.** The `compaction` agent generates structured handover summaries (Discoveries, Relevant Files, Implementation Notes) with a 60-second timeout, enabling curated knowledge transfer between planning and implementation sessions. [KILO]
- **`build → code` agent renaming.** OpenCode's `build` agent is renamed to `code` in Kilo with backward compatibility maintained via `resolveKey()` and `preprocessConfig()`. [KILO]

> **Source-of-truth note (v5)**: the [KILO] research is grounded in the local checkout of `kilocode` (the `kilocode/` directory in the workspace). Kilo Code is a fork of OpenCode — the `packages/opencode/` directory is shared upstream code, and Kilo-specific additions live in `packages/opencode/src/kilocode/` directories marked with `kilocode_change` comment markers. The [OPENCODE] research is grounded in the same repository's upstream `packages/opencode/` code. The `packages/kilo-vscode/` directory contains the VS Code extension including the Agent Manager.

## Scope of v4

Version v4 incorporates Phase 4 findings from `docs/_research/cline_research.md` and `docs/_research/roo_code_research.md`. Four structural additions dominate v4:

1. **IDE-embedded agent loop as a third macro-pattern.** The blueprint now recognises three distinct loop families: *interactive code-edit loop* (Aider, terminal-based), *tool-use protocol loop* (Claude Code, Rust runtime / Codex, Rust CLI), and *IDE-embedded per-action-approval loop* (Cline/Roo Code, VS Code extension). The IDE-embedded loop introduces per-action approval as the default, streaming partial tool presentation in the webview, mode-multiplexed prompt/tool-surface swapping (Roo), and VS Code extension lifecycle management. [CLINE] [ROO]

2. **Mode system as a first-class orchestration primitive.** Roo Code elevates persona-switching from a binary Plan/Act toggle (Cline) to a full `ModeConfig` framework — `(roleDefinition, groups, customInstructions, fileRegex restrictions)` — with five built-in modes (architect, code, debug, ask, orchestrator) and unlimited user-defined custom modes via `.roomodes` YAML files. Mode simultaneously controls system prompt persona, tool-group RBAC, file-write restrictions, and per-mode model routing. No other agent in the blueprint unifies all four axes into a single user-editable record. [ROO]

3. **Boomerang multi-agent delegation.** Roo Code's `new_task { mode, message, todos? }` implements a durable, persistent, mode-typed parent↔child delegation pattern where: the parent is flushed to disk and disposed; the child runs as a normal Task with the full UI/API stack; on `attempt_completion`, the child's summary is injected as a **synthetic `tool_result`** into the parent's API conversation history; the parent resumes as if `new_task` returned synchronously. [ROO]

4. **Per-action approval as a third permission paradigm.** The permission taxonomy now has four paradigms: mode-based (`PermissionMode` enum [CLAUDE]), two-dimensional matrix (`AskForApproval × SandboxPolicy` [CODEX]), per-action approval (`ask()` blocking with granular auto-approval categories [CLINE]), and mode-as-permission (tool-group RBAC with `fileRegex` restrictions [ROO]). [CLINE] [ROO]

> **Source-of-truth note (v4)**: the [CLINE] research is grounded in a local checkout of `cline/cline` (the `cline/` directory in the workspace). The [ROO] research is grounded in a local checkout of `RooVetGit/Roo-Code` (the `Roo-Code/` directory).

## Scope of v3

Version v3 incorporates Phase 3 findings from `docs/_research/codex_research.md`. Two structural additions dominate v3:

1. **Sandbox-first execution as a runtime property.** The blueprint now treats *containment* as a property of the runtime independent of *approval*. [CODEX]
2. **Two-dimensional autonomy: `AskForApproval × SandboxPolicy`.** The permission system gains a second axis. [CODEX]

> **Source-of-truth note (v3)**: the [CODEX] research is grounded in a local checkout of `openai/codex` at commit `87bc72408c5ef08f8d21f2cdd00c55451c3be33f`.

## Scope of v2

Version v2 incorporates Phase 2 findings from `docs/_research/claude_code_research_part1.md` and `docs/_research/claude_code_research_part2.md`.

> **Source-of-truth note**: the [CLAUDE] research is grounded in the local clone at `/Users/deepg/Desktop/agent/claw-code/` pinned at HEAD `a389f8d`.

## The v6 Framework Mapped to the 8-Module Structure

### Level 1: Macro-Architecture and Ecosystem Autonomy
Mapped to:
- `docs/01_core_loop/`
- `docs/06_orchestration/`
- `docs/07_permissions_and_governance/`

Refinement from v6: the macro-architecture now recognises **five distinct loop families**: (1) interactive code-edit loop [AIDER], (2) tool-use protocol loop [CLAUDE] [CODEX], (3) IDE-embedded per-action-approval loop [CLINE] [ROO], (4) TUI/CLI-driven session loop [OPENCODE] [KILO], and (5) **autonomous goal-seeking loop** [AUTOGPT] driven by a `propose_action` / `execute` pair with implicit observation, permission denial as feedback, and reactive watchdog model escalation.

### Level 4: The Core Cognitive Engine
Mapped to:
- `docs/01_core_loop/`
- `docs/02_cognition/`

Refinement from v6: cognition gains a **swappable prompt-strategy state machine** [AUTOGPT] — seven planning paradigms hot-swap a `BaseMultiStepPromptStrategy` instance. Model routing gains a **lazy-loaded multi-LLM API registry** [PI] — strict one-to-one API → provider mapping with dynamic SDK imports.

### Level 5: Metacognition, Feedback, and Self-Regulation
Mapped to:
- `docs/02_cognition/reasoning_patterns.md`

Refinement from v6: reasoning patterns gain **explicit self-critique mechanisms** [AUTOGPT] — built-in `self_criticism` schema field on every cycle, **Reflexion** verbal-reinforcement loop with pluggable `Evaluator`, **ReWOO** cached-action replay via `UseCachedActionException`, **ToT** categorical evaluation with multi-sample voting, and **Multi-Agent Debate** structured `CRITIQUE → CONSENSUS` phases.

### Level 6: Memory Architecture and Temporal Persistence
Mapped to:
- `docs/04_memory/`

Refinement from v6: episodic memory becomes a first-class subsystem [AUTOGPT] — `EpisodicActionHistory` with lazy LLM-driven compression, two-tier prompt assembly, and `state.json` Pydantic dump persistence. Semantic memory documents the **negative result** that AutoGPT Classic has retired its 2023 Pinecone/FAISS vector store [AUTOGPT].

### Level 7: Action Orchestration and Executable Skill Libraries
Mapped to:
- `docs/05_action_and_tools/`

Refinement from v6: tool architecture gains **AutoGPT's component system** [AUTOGPT] (`AgentComponent` ABC + `@command` decorator + protocols) and **Pi's `AgentTool<TParameters, TDetails>`** [PI] (TypeBox schema-first, pluggable `*Operations` objects, parallel execution with order-preserving messages). Extensibility now has **three paradigms**: protocol (MCP), code-based plugins (AutoGPT components / `SKILL.md` skills + Pi extension hooks), and loader-based (OpenCode `customLoaders`).

### Level 8: Governance, Guardrails, and Alignment
Mapped to:
- `docs/07_permissions_and_governance/`
- `docs/08_user_interaction/`

Refinement from v6: safety guardrails gain a **four-axis budget model** [AUTOGPT] (cycle, token, money, sub-agent depth/count) with the **honest gap** that monetary `total_budget` is logged-only and not enforced as a hard stop. Pi sits at the opposite end with **minimal guardrails by design** [PI] — `beforeToolCall` is the single hook; bash runs in the user's shell with full access. Output formatting gains **terminal UI primitives** [PI] (differential rendering, CSI 2026 synchronized output, IME support via `CURSOR_MARKER`, Kitty keyboard protocol).

## What Changed from v5 (v6 deltas)

| Change | Why it changed in v6 | Phase 6 evidence |
| :--- | :--- | :--- |
| **Autonomous goal-seeking loop** recognised as a fifth macro-pattern. | The four prior loop families don't capture a `propose_action` / `execute` pair driven by implicit observation (next-prompt re-reads `event_history`). | `classic/original_autogpt/autogpt/agents/agent.py:266-339, 373-460`; `app/main.py:607-787`. [AUTOGPT] |
| **Swappable prompt-strategy state machine** with seven planning paradigms. | Aider has one edit format at startup; Claude Code has fixed loop semantics; Cline/Roo/Kilo have modes but those modes share a single ReAct-style loop. AutoGPT's strategy abstraction is broader. | `prompt_strategies/{one_shot,plan_execute,rewoo,reflexion,tree_of_thoughts,lats,multi_agent_debate,base}.py`. [AUTOGPT] |
| **`UseCachedActionException`** — skipping the LLM call. | Token-optimization pattern not seen in other agents. ReWOO's `EXECUTING` phase replays cached `AssistantFunctionCall`s by raising a typed exception out of `build_prompt`. | `prompt_strategies/rewoo.py`; caught by string-name comparison in `agent.py` to avoid an import cycle. [AUTOGPT] |
| **Episodic memory populated from stub.** | v5 flagged this as a Phase 6 gap. AutoGPT introduces the most structured episodic memory in the blueprint. | `forge/components/action_history/{action_history,model}.py`; `EpisodicActionHistory` with lazy `asyncio.gather summarize_text`. [AUTOGPT] |
| **Code-based plugin paradigm** as a third extensibility pattern. | v5's extensibility was MCP-centric. AutoGPT components + `SKILL.md` and Pi extension hooks are in-process plugin patterns. | `forge/agent/components.py`, `forge/agent/protocols.py`, `forge/components/skills/`, `packages/agent/src/agent.ts`. [AUTOGPT] [PI] |
| **`SKILL.md` 3-level progressive disclosure.** | New runtime-discoverable, user-contributable plugin pattern aligned with Anthropic's open Agent Skills standard. | `forge/components/skills/`; `SkillConfiguration { skill_directories, max_loaded_skills=5 }`. [AUTOGPT] |
| **Defunct legacy plugin system honestly flagged.** | The `auto_gpt_plugin_template` system from AutoGPT 0.4.x is empty in this checkout — recording the retreat. | Empty `classic/original_autogpt/plugins/`; no `install_plugin_deps` wiring. [AUTOGPT] |
| **Safety guardrails populated from stub** with four-axis budget model. | v5 flagged this as a Phase 6 gap. AutoGPT introduces the most explicit budget surface. | `BaseAgentConfiguration.cycle_budget`, `send_token_limit`, `ModelProviderBudget`, `ResourceBudget`. [AUTOGPT] |
| **Cost as soft guardrail** — honest gap. | `total_budget` is tracked but not enforced as a hard stop. Records the divergence from Codex which can hard-cap. | `forge/llm/providers/schema.py::ModelProviderBudget::update_usage_and_cost`. [AUTOGPT] |
| **Lazy-loaded multi-LLM API** as a third routing pattern. | Aider's role-split and Kilo's gateway proxy don't capture lazy SDK loading and strict API → provider one-to-one mapping. | `packages/ai/src/providers/register-builtins.ts:89-403`; `stream.ts:17-59`. [PI] |
| **Output formatting populated from stub** with terminal UI primitives. | v5 had no first-class TUI documentation. Pi introduces a component-model with differential rendering, CSI 2026, IME, Kitty protocol. | `packages/tui/src/tui.ts`; `packages/tui/README.md:579-587` (rendering strategies). [PI] |
| **Reasoning patterns extended** with explicit self-critique. | v2 deferred this to Phase 6. AutoGPT contributes Reflexion + ReWOO replay + ToT + Multi-Agent Debate. | `prompt_strategies/{reflexion,rewoo,tree_of_thoughts,multi_agent_debate}.py`; `prompt_strategies/base.py:83-163` (Reflection, ReflexionMemory). [AUTOGPT] |
| **Sub-agent depth tree** with reset-on-each-level allow rules. | Roo's Boomerang and Kilo's worktree orchestration don't have a hierarchical budget tree with explicit-allow zeroing per level. | `forge/agent/execution_context.py::ResourceBudget::create_child_budget`. [AUTOGPT] |
| **No vector store in modern AutoGPT Classic** — negative result. | The 2023 Pinecone/FAISS lineage is documented as deliberately retired; the project chose `EpisodicActionHistory` + `state.json` over semantic recall. | Empty vector-memory components in `classic/forge/forge/components/`; only `SkillComponent` filesystem discovery (YAML-frontmatter, not similarity). [AUTOGPT] |
| **Pi `AgentTool<TParameters, TDetails>`** with parallel order-preserving messages. | Aider/Cline execute sequentially or don't preserve message order. Pi's parallel mode emits `tool_execution_end` in completion order while emitting tool-result messages in assistant source order. | `packages/agent/src/types.ts:332-355`, `agent-loop.ts:424-483`. [PI] |
| **Pluggable `*Operations` objects on tools** for remote execution. | Aider/Cline hard-code execution; Pi's design supports SSH/container backends without changing tool code. | `packages/coding-agent/src/core/tools/bash.ts:39-56`. [PI] |
| **Minimal guardrails by design** as a counterpoint to AutoGPT's four-axis budget. | Two contrasting safety paradigms in the same v6 — explicit budgets vs minimal hooks. | `packages/agent/src/agent-loop.ts:548-564, 629-654, 218`; research §7 (honest gaps). [PI] |

## The v5 Framework Mapped to the 8-Module Structure

### Level 1: Macro-Architecture and Ecosystem Autonomy
Mapped to:
- `docs/01_core_loop/`
- `docs/06_orchestration/`
- `docs/07_permissions_and_governance/`

Refinement from v5: macro-architecture now recognises **four distinct loop families**: (1) interactive code-edit loop [AIDER], (2) tool-use protocol loop [CLAUDE] [CODEX], (3) IDE-embedded per-action-approval loop [CLINE] [ROO], and (4) TUI/CLI-driven session loop [OPENCODE] [KILO] where the agentic loop runs within a session lifecycle managed by `SessionPrompt.loop()`. [OPENCODE] [KILO]

Refinement from v5: orchestration gains **git worktree multi-session orchestration** [KILO]. The Agent Manager enables OS-level filesystem isolation for parallel sessions, multi-version exploration, and selective file-level apply/revert across worktrees.

Refinement from v5: the task lifecycle module (`docs/06_orchestration/task_lifecycle.md`) is now fully populated with plan→code handoff, snapshot checkpointing, and AI code review. [KILO] [OPENCODE]

### Level 2: Sensory Perception and Input Processing
Mapped to:
- `docs/08_user_interaction/input_processing.md`
- `docs/03_context_engine/`

No structural change in v5. Kilo and OpenCode use the same slash-command system as Aider/Claude Code. The `/local-review` and `/local-review-uncommitted` commands [KILO] extend the command surface.

### Level 3: Context and Retrieval Engine
Mapped to:
- `docs/03_context_engine/context_assembly.md`
- `docs/03_context_engine/repo_map_and_indexing.md`
- `docs/03_context_engine/retrieval_strategies.md`
- `docs/03_context_engine/token_economics.md`

Refinement from v5: retrieval gains **semantic vector search** [KILO] via LanceDB indexing with natural-language queries. This joins Roo's Qdrant-backed `codebase_search` as a second embedded code-index pattern.

### Level 4: The Core Cognitive Engine
Mapped to:
- `docs/01_core_loop/`
- `docs/02_cognition/`

Refinement from v5: model routing gains the **Kilo Gateway proxy provider** pattern [KILO] — a unified API wrapping 5 AI SDK providers with custom auth, org scoping, provider-specific patches, and custom timeout handling. OpenCode's **custom loader system** [OPENCODE] provides the extensible foundation.

### Level 5: Metacognition, Feedback, and Self-Regulation
Mapped to:
- `docs/02_cognition/reasoning_patterns.md`
- `docs/08_user_interaction/feedback_loops.md`
- `docs/07_permissions_and_governance/`

Refinement from v5: feedback loops gain **AI code review as a structured feedback mechanism** [KILO]. The `/local-review` system produces severity-rated findings with confidence thresholds and offers mode-specific fix routing (code/debug/orchestrator), creating a structured quality gate within the development loop.

Refinement from v5: the plan→code handover with LLM-generated summaries [KILO] adds a **metacognitive handover** pattern — the system reflects on the planning conversation to distill high-entropy knowledge before transitioning to implementation.

### Level 6: Memory Architecture and Temporal Persistence
Mapped to:
- `docs/04_memory/`
- `docs/03_context_engine/retrieval_strategies.md`

Refinement from v5: persistence gains the **snapshot git repository** pattern [OPENCODE] [KILO]. A separate git repo at `~/.local/share/kilo/snapshot/` provides per-turn filesystem checkpointing with deterministic revert, independent of the user's project git history.

Refinement from v5: cross-session memory gains **todo persistence** [KILO]. Todos created during planning persist across sessions and are injected into implementation sessions as markdown checklists.

### Level 7: Action Orchestration and Executable Skill Libraries
Mapped to:
- `docs/05_action_and_tools/`
- `docs/07_permissions_and_governance/permission_model.md`

Refinement from v5: the tool catalog gains **semantic search** (`semantic_search` via LanceDB), **intelligent code search** (`codebase_search` via warpgrep), and **recall** tools [KILO]. The `question` tool gains structured options with mode-switching capability.

Refinement from v5: the `suggest` tool [KILO] is conditionally registered (CLI and VS Code clients only), demonstrating client-aware tool surface adaptation.

### Level 8: Governance, Guardrails, and Alignment
Mapped to:
- `docs/07_permissions_and_governance/`
- `docs/08_user_interaction/`

Refinement from v5: the permission taxonomy expands to **five paradigms**: mode-based [CLAUDE], two-dimensional matrix [CODEX], per-action approval [CLINE], mode-as-permission [ROO], and **config-file protection** [KILO]. Kilo's `ConfigProtection` layer adds path-based interception of config edits, `DISABLE_ALWAYS_KEY` for per-edit-only approval, and `drainCovered` for cross-sub-agent permission resolution. Per-agent bash rulesets (`bash` vs `readOnlyBash`) add command-level filtering. [KILO]

## What Changed from v4 (v5 deltas)

| Change | Why it changed in v5 | Phase 5 evidence |
| :--- | :--- | :--- |
| **Task lifecycle populated** from stub with plan→code handoff, snapshot checkpointing, and AI review. | v4 flagged this as a Phase 5 gap. Kilo introduces the most structured task lifecycle in the blueprint. | `plan-followup.ts`, `snapshot/index.ts`, `review/review.ts`, `worktree-diff.ts`. [KILO] [OPENCODE] |
| **Config-file protection** as a fifth permission paradigm. | No prior agent protected its own config files from agentic modification. Kilo's `ConfigProtection` is the most granular config-file guard. | `config-paths.ts`, `drain.ts`, `routes.ts`, `DISABLE_ALWAYS_KEY`. [KILO] |
| **Proxy-first multi-provider routing** via Kilo Gateway. | v4's model routing was limited to direct provider connections and per-mode selection. Kilo adds a unified proxy with auth, org scoping, and provider-specific patches. | `kilo-gateway/src/provider.ts`, `patchCustomLoaderResult`, `buildTimeoutSignal`. [KILO] |
| **Named-agent system** paralleling Roo's mode framework. | Kilo and Roo independently developed persona-switching systems with different architectures (TypeScript permission merging vs YAML mode records). | `kilocode/agent/index.ts`, `patchAgents()`, `Permission.merge()`. [KILO] |
| **Git worktree multi-session orchestration** as a unique pattern. | No prior agent uses OS-level filesystem isolation for parallel sessions. | `kilo-vscode/src/agent-manager/`, `WorktreeManager.ts`, `GitOps.ts`. [KILO] |
| **Semantic vector search** as an additional retrieval strategy. | v4 had Roo's Qdrant-backed `codebase_search`; Kilo adds LanceDB-based `semantic_search` as a second embedded index. | `kilocode/tool/semantic-search.ts`, `kilocode/indexing`. [KILO] |
| **Model routing updated** from Phase 1 to Phase 5. | `model_routing.md` had only [AIDER] and [BABYAGI] content. Now includes Kilo Gateway, OpenCode custom loaders, and Roo per-mode routing. | `kilo-gateway/src/provider.ts`, `kilocode/provider/provider.ts`. [KILO] [OPENCODE] |
| **Workflow modes expanded** with Kilo's named-agent comparison table. | Documents the structural difference between Kilo's `patchAgents()` and Roo's `ModeConfig` — two parallel solutions to the same problem. | `kilocode/agent/index.ts` vs `packages/types/src/mode.ts`. [KILO] vs [ROO] |

## What Changed from v3 (v4 deltas)

| Change | Why it changed in v4 | Phase 4 evidence |
| :--- | :--- | :--- |
| IDE-embedded agent loop recognised as a **third macro-pattern**. | Terminal loops (Aider) and Rust-runtime loops (Claude Code, Codex) don't capture the VS Code extension lifecycle. | `src/core/task/index.ts::recursivelyMakeClineRequests`. [CLINE] |
| **Mode system** elevated to a first-class orchestration primitive. | Cline's binary Plan/Act toggle doesn't generalise. Roo's `ModeConfig` framework provides personas × tool-RBAC × file-RBAC × model-routing. | `packages/types/src/mode.ts`, `CustomModesManager.ts`. [ROO] |
| **Boomerang delegation** as a durable multi-agent pattern. | Claude Code's `Agent` tool is ephemeral. Roo's `new_task` persists parent to disk. | `ClineProvider.ts`, `NewTaskTool.ts`. [ROO] |
| **Per-action approval** as a third permission paradigm. | Claude Code's mode-based and Codex's matrix-based don't capture per-tool blocking. | `ask()` / `say()` paradigm, `AutoApprove` class. [CLINE] |

## What Changed from v2 (v3 deltas)

| Change | Why it changed in v3 | Phase 3 evidence |
| :--- | :--- | :--- |
| Sandbox elevated to a **runtime-level property**. | Phase 2 didn't enforce sandbox. Codex shows the proper pattern. | `codex-rs/sandboxing/`. [CODEX] |
| Permission model becomes **two-dimensional**. | Collapsing both questions into one variant loses the distinction. | `core/src/safety.rs`, `core/src/exec_policy.rs`. [CODEX] |

## What Changed from v1 and Why

| Change | Why it changed in v2 | Phase 2 evidence |
| :--- | :--- | :--- |
| Promoted **multi-tool-call turn** as a first-class pattern. | Structurally different from Aider's retry and BabyAGI's queue. | `ConversationRuntime::run_turn`. [CLAUDE] |
| Added **typed-spec tool registry** to Level 7. | Phase 1 didn't define a tool architecture. | `tools::mvp_tool_specs()`. [CLAUDE] |
| Added **mode-based permission system** to Level 8. | Phase 1 didn't define a policy layer. | `permissions.rs`. [CLAUDE] |
| Added **hooks system** to Level 5. | Hooks introduce programmable feedback. | `hooks.rs`. [CLAUDE] |
| Added **filesystem-backed persistent memory** to Level 6. | Instruction-file-based persistence. | `prompt.rs`. [CLAUDE] |
| Added **sub-agent spawning** to Level 1. | Phase 1 had no sub-agent primitive. | `tools/src/lib.rs`. [CLAUDE] |
| Added **MCP extensibility** to Level 7. | Phase 1 had no plugin surface. | `mcp_stdio.rs`. [CLAUDE] |

## v5 Phase 5 Gaps — Resolution status as of v6

| Gap (v5) | Phase 6 resolution |
| --- | --- |
| Episodic memory stub | **Resolved** — `docs/04_memory/episodic_memory.md` populated with `EpisodicActionHistory`, lazy compression, two-tier prompt assembly, `state.json` persistence, and the honest `ReflexionMemory` non-persistence gap. [AUTOGPT] |
| Output formatting stub | **Resolved** — `docs/08_user_interaction/output_formatting.md` populated with `pi-tui` differential rendering, CSI 2026, IME via `CURSOR_MARKER`, Kitty keyboard protocol, three operating modes (interactive / print / RPC). [PI] |
| Safety guardrails stub | **Resolved** — `docs/07_permissions_and_governance/safety_guardrails.md` populated with four-axis budget model, three liveness mechanisms, six structural termination conditions, output-size guard, plus Pi's contrasting minimal-guardrails-by-design surface. [AUTOGPT] [PI] |
| Reasoning patterns beyond Phase 2 | **Resolved** — `docs/02_cognition/reasoning_patterns.md` extended with built-in `self_criticism`, **Reflexion** explicit verbal-reinforcement loop with pluggable `Evaluator`, **ReWOO** cached-action replay via `UseCachedActionException`, **ToT** categorical evaluation with multi-sample voting, **Multi-Agent Debate** structured `CRITIQUE / CONSENSUS` phases. [AUTOGPT] |
| Plugin paradigm contrast | **Resolved** — `docs/05_action_and_tools/extensibility.md` now documents three paradigms: protocol (MCP), code-based plugins (AutoGPT components / `SKILL.md` skills + Pi extension hooks), and loader-based (OpenCode `customLoaders`). [AUTOGPT] [PI] |

## v6 Phase 6 Gaps — Resolution status as of v_FINAL

Honest list of items that remain partial or still stubs:

- **Specialist-agent integration** — **RESOLVED** in v_FINAL. Continue, Hermes, OpenClaw, Zed (Phase 7 / Task 18) are now fully integrated across all 30 module files. The `agent_registry.md` reflects v_FINAL status.
- **Reflexion memory persistence** [AUTOGPT] — `ReflexionPromptStrategy.memory` is *not* serialized to `state.json` so a process restart erases reflections. The blueprint records this as a real gap; future refinement could persist strategy state. **UNRESOLVED — carried forward.**
- **Cost as hard stop** [AUTOGPT] — `total_budget` is logged but not enforced. A future blueprint refinement could codify "soft vs hard budget" as a first-class distinction. **UNRESOLVED — carried forward.**
- **Pi's bash sandbox** [PI] — Pi runs bash in the user's shell with full access. Apps must wire their own sandboxing (no built-in equivalent of Codex's sandbox-first runtime). **UNRESOLVED — carried forward.**
- **AutoGPT's `EvaluatorType.LLM`** [AUTOGPT] — declared in `EvaluatorType` enum but currently falls back to the heuristic regex evaluator. Marked as "would need LLM call" in source. **UNRESOLVED — carried forward.**
