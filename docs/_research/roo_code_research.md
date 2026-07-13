# Roo Code — Architecture Research Report

> **Agent:** `[ROO]` | **Phase:** 4 | **Source:** `./Roo-Code/` (verified against HEAD `ad25634`, fetched 2026-04-28)
> **Researcher:** Antigravity (Task 10) | **Date:** 2026-04-28
> **Comparator:** `docs/_research/cline_research.md` (Cline HEAD `5fe6c9a`)

---

## 0. Orientation

Roo Code is a **VS Code extension fork of Cline** (originally `cline.bot`, the project formerly known as Roo Cline). It keeps Cline's core agentic loop but layers on three architecturally distinctive primitives:

1. **Modes** — first-class agent personas (`architect`, `code`, `ask`, `debug`, `orchestrator`) and an arbitrary number of user-defined custom modes. Each mode is a tuple of `(roleDefinition, customInstructions, toolGroups, fileRegex restrictions)` that swaps the system prompt and the allowed-tool surface at runtime.
2. **Boomerang / Task Orchestration** — a parent→child task delegation model where the `orchestrator` mode (or any mode) calls the `new_task` tool to spawn a child task in a *different* mode, the child runs in isolation, and on `attempt_completion` a synthetic `tool_result` is injected back into the parent's API conversation history so the parent resumes with the child's summary as the result.
3. **Embedded code-index (Qdrant + multi-embedder)** — an optional vector store (`./src/services/code-index/`) that powers the `codebase_search` tool. This replaces Cline's reliance on `ripgrep`-only retrieval and is a clear divergence.

Two important historical notes from `CHANGELOG.md`:
- The `orchestrator` mode was originally shipped under the marketing name **"Boomerang Orchestrator"** (CHANGELOG line 2374); it was later renamed to **"Task Orchestration"** (line 1976). The boomerang emoji `🪃` survives as the mode icon.
- The `browser` tool group was **deprecated and removed** (`packages/types/src/tool.ts:16` — `deprecatedToolGroups = ["browser"]`). This is one of the most consequential architectural divergences from Cline.

---

## 1. Mode System

### 1.1 What a Mode Is

A mode is defined by [`ModeConfig`](../../Roo-Code/packages/types/src/mode.ts:96):

```typescript
modeConfigSchema = z.object({
  slug: z.string().regex(/^[a-zA-Z0-9-]+$/),
  name: z.string().min(1),
  roleDefinition: z.string().min(1),  // becomes the LEADING line of the system prompt
  whenToUse: z.string().optional(),    // exposed to the orchestrator picker
  description: z.string().optional(),
  customInstructions: z.string().optional(),
  groups: groupEntryArraySchema,        // tool groups + per-group fileRegex restrictions
  source: z.enum(["global", "project"]).optional(),
})
```

Three derived schemas matter:
- `groupEntrySchema` accepts either `"read"` or `["edit", { fileRegex: "...", description: "..." }]` — the second form lets a mode allow only edits matching a regex.
- `customModesSettingsSchema` enforces unique slugs.
- `groupEntryArraySchema` is wrapped in a `z.preprocess` that **silently strips** entries whose group name is in `deprecatedToolGroups` (currently just `"browser"`), so old user configs that still list the `browser` group don't fail validation — they just have it removed.

### 1.2 The Five Built-In Modes

From [`packages/types/src/mode.ts:168-227`](../../Roo-Code/packages/types/src/mode.ts) (`DEFAULT_MODES`):

| Slug | Name | `groups` | `roleDefinition` (gist) | Notable `customInstructions` |
|---|---|---|---|---|
| `architect` | 🏗️ Architect | `read`, `["edit", { fileRegex: "\\.md$" }]`, `mcp` | "experienced technical leader… create a detailed plan… which the user will review and approve before they switch into another mode to implement" | Build an `update_todo_list`; ask clarifying questions; use Mermaid diagrams; **end with `switch_mode` to request implementation** |
| `code` | 💻 Code | `read`, `edit`, `command`, `mcp` | "highly skilled software engineer with extensive knowledge in many programming languages, frameworks, design patterns, and best practices" | (none — minimal) |
| `ask` | ❓ Ask | `read`, `mcp` | "knowledgeable technical assistant focused on answering questions" | "do not switch to implementing code unless explicitly requested"; include Mermaid when helpful |
| `debug` | 🪲 Debug | `read`, `edit`, `command`, `mcp` | "expert software debugger specializing in systematic problem diagnosis" | "Reflect on 5-7 different possible sources… distill to 1-2… add logs to validate… ask the user to confirm the diagnosis before fixing" |
| `orchestrator` | 🪃 Orchestrator | `[]` (empty!) | "strategic workflow orchestrator who coordinates complex tasks by delegating them to appropriate specialized modes" | The full Boomerang playbook (see §3) |

Two design facts pop out of the table:
- **`architect` is read-mostly with markdown-only edits.** The `fileRegex: "\\.md$"` means architect can write `plan.md` / `todo.md` but *cannot* touch source code — this is enforced at the `validateToolUse` layer (`src/core/tools/validateToolUse.ts:206-213`) which throws `FileRestrictionError` when the path doesn't match.
- **`orchestrator` has `groups: []`.** It deliberately has no read, no edit, no command, no MCP tools. The only tools it can use are the [`ALWAYS_AVAILABLE_TOOLS`](../../Roo-Code/src/shared/tools.ts:317): `ask_followup_question`, `attempt_completion`, `switch_mode`, `new_task`, `update_todo_list`, `run_slash_command`, `skill`. Specifically, `new_task` and `switch_mode` are how it does its job. CHANGELOG line 2344: *"Remove tool groups from orchestrator mode definition."*

### 1.3 Tool Groups

Defined in [`src/shared/tools.ts:296-314`](../../Roo-Code/src/shared/tools.ts):

```typescript
TOOL_GROUPS = {
  read:    { tools: ["read_file", "search_files", "list_files", "codebase_search"] },
  edit:    { tools: ["apply_diff", "write_to_file", "generate_image"],
             customTools: ["edit", "search_replace", "edit_file", "apply_patch"] },  // opt-in via modelInfo.includedTools
  command: { tools: ["execute_command", "read_command_output"] },
  mcp:     { tools: ["use_mcp_tool", "access_mcp_resource"] },
  modes:   { tools: ["switch_mode", "new_task"], alwaysAvailable: true },
}

ALWAYS_AVAILABLE_TOOLS = [
  "ask_followup_question", "attempt_completion", "switch_mode",
  "new_task", "update_todo_list", "run_slash_command", "skill",
]
```

Notes:
- `customTools` are **opt-in**: they only appear in a mode if the active model's `ModelInfo.includedTools` lists them ([`filter-tools-for-mode.ts:152-220`](../../Roo-Code/src/core/prompts/tools/filter-tools-for-mode.ts)). This is how Roo lets newer/native diff-format models like Codex/GPT-5 use `apply_patch` while older models stick with `apply_diff`.
- `TOOL_ALIASES = { write_file: "write_to_file", search_and_replace: "edit" }` ([`tools.ts:337`](../../Roo-Code/src/shared/tools.ts)) — model-emitted alias names get resolved to the canonical tool name at the validator/dispatcher boundary, so the alias appears in API conversation history but the canonical handler runs.
- `modes.alwaysAvailable: true` is what guarantees `switch_mode` and `new_task` are exposed even when the mode's `groups` array is empty — that's the trick that makes `orchestrator` viable.

### 1.4 Tool-Allowance Decision Logic

From [`src/core/tools/validateToolUse.ts:120-239`](../../Roo-Code/src/core/tools/validateToolUse.ts), the `isToolAllowedForMode` decision is (paraphrased):

```
1. Resolve aliases (write_file → write_to_file).
2. If toolRequirements explicitly disables the tool → false.
3. If tool is in ALWAYS_AVAILABLE_TOOLS → true.
4. If tool is a custom tool registered in the experiments system → true.
5. If tool name starts with "mcp_" (dynamic MCP tool) AND mode has the "mcp" group → true.
6. Otherwise, look up the mode by slug in (customModes ∪ DEFAULT_MODES).
7. Walk mode.groups:
   a. If the tool is in groupConfig.tools (or in customTools AND model includedTools) → check group options.
   b. If group has fileRegex AND this is an actual edit op (params include path/content/diff/etc.) →
      validate filePath against regex, throw FileRestrictionError if no match.
   c. For apply_patch, extract every file path from the patch and validate each against the regex.
   d. Return true.
8. No matching group → false.
```

This is the gatekeeper that turns a YAML mode definition into runtime enforcement. There is no separate per-tool RBAC layer; the mode's `groups` list IS the permission policy. Native-tool construction can still apply feature/configuration gates after this: `codebase_search` is omitted unless code indexing is enabled and configured, `update_todo_list` is omitted when the todo-list setting is off, `generate_image` / `run_slash_command` depend on experiments, and `disabledTools` can remove tools from the final native-tool catalog.

### 1.5 System Prompt Assembly per Mode

[`src/core/prompts/system.ts:41-110`](../../Roo-Code/src/core/prompts/system.ts) constructs the system prompt as:

```
${roleDefinition}                       ← from active mode
${markdownFormattingSection()}
${getSharedToolUseSection()}            ← native-only protocol; "tool catalog" string is empty (tools are in API metadata)
${getToolUseGuidelinesSection()}
${getCapabilitiesSection(cwd, mcpHub)}  ← MCP servers omitted unless mode has "mcp" group AND servers exist
${modesSection}                         ← list of ALL modes (slug, name, whenToUse) for switch_mode/new_task picker
${skillsSection}                        ← available skills (if any)
${getRulesSection(cwd, settings)}
${getSystemInfoSection(cwd)}
${getObjectiveSection()}
${addCustomInstructions(...)}           ← global + mode-specific + .roo/rules-${mode}/* + AGENTS.md + .roorules
```

The MCP gating ([`system.ts:67-70`](../../Roo-Code/src/core/prompts/system.ts)) is mode-aware:
```typescript
const hasMcpGroup    = modeConfig.groups.some(g => getGroupName(g) === "mcp")
const hasMcpServers  = mcpHub && mcpHub.getServers().length > 0
const shouldIncludeMcp = hasMcpGroup && hasMcpServers
```
So the `code` mode in a workspace with MCP servers will see the MCP tools/servers in its prompt, but `architect` (which *does* have `mcp` in groups) will too — whereas `orchestrator` (`groups: []`) will not. The MCP catalog is conditional on the mode, not just on connection state.

The `modesSection` ([`src/core/prompts/sections/modes.ts`](../../Roo-Code/src/core/prompts/sections/modes.ts)) is the same for every mode — it lists *all* available modes with their `whenToUse` text, which is what gives the orchestrator (and `switch_mode` in any mode) enough information to pick a target mode by slug.

### 1.6 Mode-Specific Rule Files

[`src/core/prompts/sections/custom-instructions.ts:402-438`](../../Roo-Code/src/core/prompts/sections/custom-instructions.ts) loads mode-specific instructions in this priority order, per mode `${mode}`:

1. `~/.roo/rules-${mode}/*` (global) — directory of files
2. `<cwd>/.roo/rules-${mode}/*` (project-local) — directory of files
3. *(if `enableSubfolderRules`)* recursive subfolder discovery
4. Fallback: `<cwd>/.roorules-${mode}` (single legacy file)
5. Fallback²: `<cwd>/.clinerules-${mode}` (Cline-compat single file)

This is why the Roo-Code repo itself ships `.roo/rules-code/`, `.roo/rules-debug/`, `.roo/rules-translate/`, etc. — those are **mode-scoped** prompt overrides for the team working *on* Roo Code.

### 1.7 Mode Switching at Runtime

Two distinct primitives:

- **`switch_mode { mode_slug, reason }`** ([`SwitchModeTool.ts`](../../Roo-Code/src/core/tools/SwitchModeTool.ts)) — switches the *current* task's mode. Requires user approval. Persists the new mode via `provider.handleModeSwitch(mode_slug)`, which: (a) updates `taskHistory[].mode`, (b) writes `globalState.mode`, (c) loads the API config saved for that mode (per-mode model selection — see §4.2), (d) re-renders the webview. Does NOT clear conversation history. Then sleeps 500ms before the next tool runs (waiting for state to settle).

- **`new_task { mode, message, todos? }`** — spawns a *child* task in the named mode. Always switches mode (via `handleModeSwitch`) before constructing the child Task. This is the Boomerang primitive (§3).

`handleModeSwitch` ([`ClineProvider.ts:1394-1479`](../../Roo-Code/src/core/webview/ClineProvider.ts)) emits two events: `TaskModeSwitched` (task-level) and `ModeChanged` (provider-level). The per-mode API config lookup uses `ProviderSettingsManager.getModeConfigId(newMode)` — Roo lets you pin different LLMs to different modes (e.g., GPT-5 for `code`, Claude Opus for `architect`).

---

## 2. Custom Modes

### 2.1 Where Custom Modes Live

Two on-disk locations, with **project precedence**:

1. **Project-level**: `<workspace>/.roomodes` (YAML or JSON; `.roomodes` is the conventional name, `ROOMODES_FILENAME` constant in [`CustomModesManager.ts:19`](../../Roo-Code/src/core/config/CustomModesManager.ts))
2. **Global-level**: `<VS Code extension global storage or customStoragePath>/settings/custom_modes.yaml` (resolved via `ensureSettingsDirectoryExists` and `GlobalFileNames.customModes`)

Merge rule ([`CustomModesManager.ts:226-247`](../../Roo-Code/src/core/config/CustomModesManager.ts)):
- Project modes are added first; their slugs reserve those names.
- Global modes are added only if their slug isn't already taken by a project mode.
- The merged list is then layered *over* the built-in modes by [`getAllModes()`](../../Roo-Code/src/shared/modes.ts:70) — a custom mode with the same slug as a built-in **overrides the built-in** entirely (replace, not merge).

### 2.2 The `.roomodes` File Format

The repo's own `.roomodes` ships seven project-level custom modes: `translate`, `issue-fixer`, `pr-fixer`, `merge-resolver`, `docs-extractor`, `issue-investigator`, and `issue-writer`. A representative entry:

```yaml
customModes:
  - slug: docs-extractor
    name: 📚 Docs Extractor
    roleDefinition: |-
      You are Roo Code, a codebase analyst who extracts raw facts for documentation teams.
      You do NOT write documentation. You extract and organize information.
      ...
    whenToUse: Use this mode only for two tasks; ...
    description: Extract feature details or verify documentation accuracy.
    groups:
      - read
      - - edit
        - fileRegex: \.roo/extraction/.*\.(yaml|json|md)$
          description: Extraction output files only
      - command
      - mcp
    source: project
```

The `groups: [["edit", { fileRegex: ... }]]` form is the canonical way to author a write-restricted mode. The loader tags modes as `source: "project"` or `source: "global"` based on the file they came from; the repo's checked-in entries also include `source: project`.

### 2.3 The Loader / Watcher Pipeline

[`CustomModesManager`](../../Roo-Code/src/core/config/CustomModesManager.ts) is a debounced, queued, cached loader:

- **Read pipeline** (`getCustomModes`, `loadModesFromFile`):
  1. `cleanInvisibleCharacters()` strips problematic Unicode (NBSP, zero-width, smart quotes, dashes) — a defensive step against pasting mode YAML from chat clients.
  2. `parseYamlSafely()` runs `yaml.parse()` first; on failure for `.roomodes` only, it falls back to `JSON.parse()` of the *original* (uncleaned) content. This dual-format support is unusual.
  3. `customModesSettingsSchema.safeParse()` validates structure, surfaces validation errors to `vscode.window.showErrorMessage` with line numbers when possible.
  4. Successful modes get tagged with `source: "project" | "global"` based on the file they came from.
  5. Result is cached for 10 seconds (`cacheTTL = 10_000`).

- **File watcher** (`watchCustomModesFiles`): registers `vscode.workspace.createFileSystemWatcher` for both the global settings file and `<workspace>/.roomodes`. On change/create/delete, it re-merges, writes to `globalState.customModes`, clears the cache, and calls `onUpdate()` to trigger a webview refresh.

- **Write pipeline** (`updateCustomMode`): all writes go through a serial `writeQueue` (`processWriteQueue`) to prevent concurrent file rewrites racing each other. Routes to `.roomodes` for `source: project` and to global for `source: global`.

- **Import / export** (`exportModeWithRules` / `importModeWithRules`): can bundle a mode with its `.roo/rules-${slug}/*` rule files into a single YAML for sharing — a marketplace-friendly artifact.

### 2.4 Mode Override Semantics in the System Prompt

System-prompt assembly does **not** call [`getFullModeDetails`](../../Roo-Code/src/shared/modes.ts:176-217) directly. [`SYSTEM_PROMPT`](../../Roo-Code/src/core/prompts/system.ts) resolves mode text through `getModeSelection(mode, promptComponent, customModeConfigs)`, then appends rule/custom-instruction layers through `addCustomInstructions(...)`.

The practical layering is:

1. **Custom mode wins first**: if `customModeConfigs` contains the active slug, `getModeSelection` returns that mode's `roleDefinition`, `customInstructions`, and `description`. The prompt-component override is ignored for that slug at system-prompt time.
2. **Built-in prompt-component override**: if no custom mode matches, a Settings UI prompt component can override a built-in mode's `roleDefinition` and `customInstructions`. The built-in `description` remains UI metadata; `whenToUse` is used by the mode picker/listing path.
3. **Instruction layering**: `addCustomInstructions(...)` then prepends/appends language preference, global custom instructions, mode-specific custom instructions, `.roo/rules-${slug}/`, generic rule files, `AGENTS.md`, `.roorules`, and compatibility rule files.

[`getFullModeDetails`](../../Roo-Code/src/shared/modes.ts:176-217) is still a useful richer resolver for UI/export and helper flows, but it should not be treated as the exact system-prompt resolver.

---

## 3. Boomerang Orchestration

This is the architectural centerpiece of Roo Code, and the most novel pattern in the entire blueprint so far.

### 3.1 The Orchestrator Mode's `customInstructions` (verbatim summary)

From [`mode.ts:223-227`](../../Roo-Code/packages/types/src/mode.ts), the `orchestrator` mode is told to:

1. Decompose the task into subtasks.
2. For each subtask, call `new_task { mode, message }` where `message` MUST include:
   - All necessary context from parent / previous subtasks.
   - Clearly defined scope.
   - Explicit "do only this; do not deviate" instruction.
   - Direction to call `attempt_completion` with a "concise yet thorough summary" — emphasizing **"this summary will be the source of truth used to keep track of what was completed on this project"**.
   - Statement that "these specific instructions supersede any conflicting general instructions the subtask's mode might have" — solves the prompt-injection problem when the child mode's role definition disagrees with the parent's intent.
3. Track and manage subtask progress.
4. Synthesize subtask results when all are done.
5. Suggest workflow improvements based on results.

This is policy delivered via prompt — the *enforcement* is the rest of this section.

### 3.2 The Single-Open-Task Invariant

`ClineProvider` keeps a `clineStack: Task[]` ([`ClineProvider.ts:139`](../../Roo-Code/src/core/webview/ClineProvider.ts)) — but Boomerang **does not actually use it as a stack of concurrently-living tasks**. Instead, it enforces a **single-open invariant**: at most one Task is "active" (loaded into memory, streaming the LLM, executing tools) at any time.

This is a deliberate departure from naive "spawn child, suspend parent in memory" designs. The reason, from comments in [`ClineProvider.ts:3251-3296`](../../Roo-Code/src/core/webview/ClineProvider.ts):

- The parent's API conversation history (especially pending `tool_result` blocks for tools called *before* `new_task`) must be **flushed to disk** before the parent is disposed, or the parent will be unresumable (the Anthropic API rejects assistant messages with `tool_use` blocks that lack matching `tool_result` blocks).
- The active Task instance owns scarce resources (file watchers, MCP refcounts, in-progress streams). Keeping two alive simultaneously courts race conditions.

So the actual flow is: **persist parent → dispose parent → switch mode → create child → persist parent's "delegated" metadata → start child**. The "stack" is really just the resume metadata threaded through `HistoryItem.parentTaskId / childIds / awaitingChildId / delegatedToId`.

### 3.3 The `new_task` Tool — Step by Step

From [`NewTaskTool.execute()`](../../Roo-Code/src/core/tools/NewTaskTool.ts):

```
1. Validate params (mode, message; todos optional unless newTaskRequireTodos setting is on).
2. Look up target mode in (customModes ∪ DEFAULT_MODES); reject if not found.
3. Parse `todos` markdown checklist into TodoItem[].
4. Build tool_message { tool: "newTask", mode: targetMode.name, content: message, todos }.
5. askApproval("tool", tool_message) — user sees the proposal, can approve/reject.
6. Call provider.delegateParentAndOpenChild({ parentTaskId, message, initialTodos, mode }).
7. pushToolResult("Delegated to child task ${child.taskId}").
   ← Note: by the time this callback runs, delegateParentAndOpenChild (§3.5)
   has already flushed and disposed the parent before starting the child. This
   immediate string is not the durable return payload the parent resumes from;
   the durable return is the later synthetic child-summary tool_result (§3.7).
```

### 3.4 `new_task` Isolation Enforcement

`new_task` is not just another tool that can be freely interleaved with later tool calls. The native tool description says it **must be called alone**. Runtime enforcement in [`Task.ts`](../../Roo-Code/src/core/task/Task.ts) preserves a weaker but critical invariant: if an assistant message contains `new_task` and any later blocks, Roo truncates all blocks after `new_task`, truncates the pending execution array, and pre-injects error `tool_result` blocks for the skipped tools. Tools before `new_task` are preserved and flushed before delegation.

The reason is the same Anthropic pairing rule described in §3.2: after `new_task`, the parent task is about to be persisted and disposed. Allowing later tool uses in the same assistant message would create orphaned `tool_use` blocks that the parent cannot safely execute while control has moved to the child. This behavior is covered by `new-task-isolation.spec.ts`.

### 3.5 `delegateParentAndOpenChild` — The Handoff

[`ClineProvider.ts:3231-3361`](../../Roo-Code/src/core/webview/ClineProvider.ts), 130 lines of carefully ordered work:

| Step | Action | Why |
|---|---|---|
| 1 | Verify `getCurrentTask().taskId === parentTaskId` | Prevent stale-call bugs |
| 2 | `parent.flushPendingToolResultsToHistory()` | Otherwise parent's API history is missing tool_results for tools called before `new_task` → Anthropic 400 on resume |
| 3 | `removeClineFromStack({ skipDelegationRepair: true })` | Dispose parent; `skip…Repair` because steps 5–6 will set the metadata correctly |
| 4 | `handleModeSwitch(mode)` | Persists mode change + loads per-mode API config BEFORE constructing child (Task constructor reads provider.getState().mode) |
| 5 | `createTask(message, undefined, parent, { initialTodos, initialStatus: "active", startTask: false })` | Build child but do NOT start the loop yet — race condition with step 6 |
| 6 | Persist parent's history with `status: "delegated"`, `delegatedToId: child.taskId`, `awaitingChildId: child.taskId`, `childIds: [...prior, child.taskId]` | Without this written before step 7, child's `startTask` racing with this write can lose the delegation pointer |
| 7 | `child.start()` | Now safe to begin the child's task loop |
| 8 | `emit(TaskDelegated, parentTaskId, child.taskId)` | API/bridge listeners |

The ordering of 5→6→7 is the critical correctness invariant — comments at [`ClineProvider.ts:3318-3324`](../../Roo-Code/src/core/webview/ClineProvider.ts) call out the race: "the child's fire-and-forget startTask() races with step 5 [should read 6], and the last writer to globalState overwrites the other's changes — causing the parent's delegation fields to be lost."

### 3.6 Child Lifetime & `attempt_completion`

The child runs as a normal Task — same `recursivelyMakeClineRequests` loop, same tool surface (filtered by *its* mode), same approval gates. It does NOT know it's a subtask except that `task.parentTaskId` is set.

When the child calls `attempt_completion` ([`AttemptCompletionTool.ts:84-130`](../../Roo-Code/src/core/tools/AttemptCompletionTool.ts)):

1. If `task.parentTaskId` is set, look up the child's own historyItem to check status:
   - `"completed"` → already returned (user is revisiting a finished subtask); skip delegation, fall through to normal completion ask.
   - `"active"` → call `delegateToParent()`.
   - other (undefined / `"delegated"`) → log error, fall through (these indicate a bug).
2. `delegateToParent()`:
   - `askFinishSubTaskApproval()` — user must approve "Finish & return to parent". Rejection denies the `attempt_completion`.
   - On approve, call `provider.reopenParentFromDelegation({ parentTaskId, childTaskId, completionResultSummary: result })`.

### 3.7 `reopenParentFromDelegation` — Synthetic `tool_result` Injection

[`ClineProvider.ts:3366-3560`](../../Roo-Code/src/core/webview/ClineProvider.ts), the most subtle code in the project:

| Step | Action |
|---|---|
| 1 | Load parent's `historyItem`, `clineMessages` (UI), `apiMessages` (LLM conversation) from disk. |
| 2a | Append a synthetic UI message: `{ type: "say", say: "subtask_result", text: completionResultSummary }`. Persist. |
| 2b | **Find the `tool_use_id`** for the `new_task` call in the parent's API history by scanning backwards through assistant messages. |
| 2c | If found: append a `user` message containing `{ type: "tool_result", tool_use_id, content: "Subtask ${childTaskId} completed.\n\nResult:\n${completionResultSummary}" }`. This makes the parent's history Anthropic-API-compliant: `user → assistant(tool_use:new_task) → user(tool_result:new_task)`. **Idempotent** — if the last message already has a tool_result for that id (e.g., on retry), the content is overwritten in place. |
| 2d | If NOT found (corrupted history): fall back to a plain `text` user message — the parent can still resume but loses the formal tool-call pairing. |
| 2e | Run `validateAndFixToolResultIds()` to defend against multi-tool-call assistant messages where this tool_result might need reordering. |
| 3 | If child instance is still active in memory (`getCurrentTask()?.taskId === childTaskId`), `removeClineFromStack()` to dispose it — ordered BEFORE step 4 because abort writes status, and we don't want it overwriting `"completed"`. |
| 4 | Update child's `historyItem.status = "completed"`. |
| 5 | Update parent's `historyItem`: `status: "active"`, `completedByChildId: childTaskId`, `completionResultSummary`, `awaitingChildId: undefined`. |
| 6 | `emit(TaskDelegationCompleted)`. |
| 7 | `createTaskWithHistoryItem(parentHistory, { startTask: false })` — re-load parent into memory. |
| 8 | `parentInstance.overwriteClineMessages(...)`, `overwriteApiConversationHistory(...)` — restore in-memory state from the synthetic-augmented disk state. |
| 9 | `parentInstance.resumeAfterDelegation()` — re-enter the loop without an explicit "resume" prompt to the user. |
| 10 | `emit(TaskDelegationResumed)`. |

The parent then continues from where it left off, but its next LLM call sees the new `tool_result` in the conversation as if `new_task` had returned synchronously with the child's summary. **The LLM has no notion that hours of clock time, dozens of subtask tool calls, or even multiple model providers may have elapsed between its `new_task` call and this `tool_result`.** That's the boomerang: the call goes out, the call comes back, the same agent picks up the conversation.

### 3.8 Boomerang Flow Diagram

```
PARENT (orchestrator mode)              SYSTEM                   CHILD (e.g., code mode)
       │
       │── new_task {mode:"code", message, todos} ─┐
       │                                            │
       │                    askApproval("tool")─────┤
       │                                            │
       │                                  flushPendingToolResultsToHistory()
       │                                  removeClineFromStack(skip repair)
       │                                  handleModeSwitch("code")
       │                                  createTask(parent=this, startTask:false)
       │                                  persist parent.status="delegated"
       │                                  child.start()
       │                                                              │── recursivelyMakeClineRequests()
       │                                                              │   tools, edits, commands, MCP …
       │                                                              │── attempt_completion {result:"..."}
       │                                                                 │
       │                                  askFinishSubTaskApproval()────┤
       │                                  reopenParentFromDelegation:
       │                                    inject tool_result(new_task_id)
       │                                    update parent.status="active"
       │                                    dispose child
       │                                    reload parent
       │                                    parent.resumeAfterDelegation()
       │
       │←── (next API turn sees tool_result for new_task) ──
       │
       │── decide next subtask, or attempt_completion ──
```

### 3.9 Hierarchical / Nested Delegation

`HistoryItem.childIds` is an *array* and the `delegateToParent()` flow correctly handles multi-level chains: child A spawns grandchild B, B's `attempt_completion` returns to A, A's eventual `attempt_completion` returns to the root parent. The `parentTaskId` chain is walked one level at a time. The `skipDelegationRepair` flag in `removeClineFromStack` exists specifically because in transitions like A→B→C the caller (`delegateParentAndOpenChild`) is intentionally replacing the active child and will re-write the parent's `awaitingChildId` itself.

### 3.10 Why "Boomerang" — The Key Architectural Insight

The novel idea, distilled:

- **Cline-style sub-agents** (like Claude Code's `Agent` tool, like Cline's own `use_subagents`) are *fire-and-forget within a single turn*: spawn child, parallel-execute, collect results, all before the parent's next LLM call.
- **Boomerang sub-tasks** are *durable, persistent, mode-typed children that span unbounded time and turns*: the parent literally exits memory, the child gets the entire UI / API stack, and the child's eventual completion is replayed into the parent's API history as a single `tool_result` block.

The parent's LLM sees: *"I called `new_task`, and it returned this summary."* It has no architectural awareness of the sub-conversation that produced that summary. This is the same illusion as a function call in a programming language: the caller doesn't see the callee's local variables, only the return value.

This pattern unlocks:
- **Mode-typed delegation**: `architect` plans → spawns `code` to implement → spawns `debug` to fix issues. Each subtask sees only the prompt suited to its role.
- **Per-mode model routing**: child can use Sonnet for `code`, Opus for `architect`, automatically (per-mode API config in §4.2).
- **Context isolation**: the child does not inherit the parent's full API history — only the carefully crafted `message` parameter. The parent does not pollute its own history with the child's reasoning steps — only the summary.

---

## 4. Differences from Cline

This section is explicit about architectural divergence. Roo is a Cline fork (the project descended from "Roo Cline"), and many subsystems are still recognizably Cline. The differences below are the meaningful ones.

### 4.1 What Was Added

| Feature | Roo Code | Cline |
|---|---|---|
| **Mode system** | First-class — 5 built-in + arbitrary custom; YAML-defined; per-mode tool groups; per-mode `fileRegex` write restrictions; per-mode rule directories `.roo/rules-${mode}/`. | Has only Plan/Act mode — a binary toggle inside one Task, not first-class personas. |
| **Boomerang `new_task`** | Persistent, mode-typed parent↔child delegation with synthetic `tool_result` injection (§3). | `new_task` exists but is "create a new task with preloaded continuation context" — it does NOT keep parent state, does NOT auto-return; user has to manually return to the previous task. |
| **`switch_mode` tool** | Yes — runtime mode change, optionally per-mode API config. | No equivalent. Plan/Act toggle is via `plan_mode_respond` UI button, not a tool call. |
| **`update_todo_list` tool** | Always-available; markdown checklist; `preventCompletionWithOpenTodos` setting blocks `attempt_completion` if any todo is open. | Cline has a "Focus Chain" surfaced as `task_progress` parameter on every tool — same goal, different mechanism (Roo: explicit tool; Cline: implicit per-tool side channel). |
| **Embedded code-index / `codebase_search`** | Qdrant vector store (`./src/services/code-index/vector-store/qdrant-client.ts`) + 8 embedder backends (OpenAI, OpenAI-compat, Bedrock, Gemini, Mistral, Ollama, OpenRouter, Vercel AI Gateway). `codebase_search` tool is in the `read` group. | No vector index. Cline relies on `search_files` (ripgrep) + `list_code_definition_names` (tree-sitter). Cline has tree-sitter for symbol listing only, not retrieval. |
| **`run_slash_command` tool** | Always-available tool that lets the LLM itself invoke slash commands as if the user typed them. | Cline's slash commands are user-typed only (parsed from input mentions / chat). |
| **`skill` tool** | Always-available tool that loads a configured skill (via `SkillsManager`). | Cline has a `use_skill` tool for the same purpose — naming difference only. |
| **`generate_image` tool** | In the `edit` group (image generation as a "writing" capability). | Not present in Cline. |
| **`edit` group `customTools`** | `edit`, `search_replace`, `edit_file`, `apply_patch` are opt-in via model `includedTools` — letting GPT-5/Codex use their preferred patch format. | Cline has model-family-aware tool surfaces (different parameters for native/GPT-5/etc.) but does not expose the per-tool opt-in mechanism the same way. |

### 4.2 What Was Modified

- **Per-mode API config** (`ProviderSettingsManager.getModeConfigId(mode)`): each mode can have a different LLM/provider/model bound to it. `handleModeSwitch` automatically loads the saved config for the new mode (or falls through to the workspace lock). Cline has no equivalent — one task, one provider config.
- **MCP transport names**: Roo uses `"streamable-http"` (`StreamableHTTPClientTransport`); Cline uses `"streamableHttp"` (camelCase). Both support stdio and SSE. Project-level config path differs: Roo reads `<workspace>/.roo/mcp.json`; Cline uses its own watcher path. Roo also separates `disabledTools` and `alwaysAllow` lists per server (write-back via `updateServerToolList`, [`McpHub.ts:1780-1850`](../../Roo-Code/src/services/mcp/McpHub.ts)).
- **Tool aliasing**: `TOOL_ALIASES` registry maps model-emitted alias names to canonical names while preserving the original name in API conversation history. Cline does some name normalization in its dynamic MCP path but does not have the explicit alias registry.
- **System prompt assembly**: Roo's [`SYSTEM_PROMPT`](../../Roo-Code/src/core/prompts/system.ts) is simpler / more linear than Cline's "PromptRegistry → PromptBuilder → TemplateEngine → variants" architecture. Roo concatenates sections (`getRulesSection`, `getCapabilitiesSection`, etc.); the leading `roleDefinition` line literally becomes the first line of the system prompt and is the *primary* way modes differentiate.
- **Mode-scoped rules discovery**: `<workspace>/.roo/rules-${mode}/` directories — there's no Cline equivalent. Cline's `.clinerules/` is mode-agnostic.
- **AGENTS.md support**: `loadAllAgentRulesFiles` reads `AGENTS.md` (and `.agents/`) at workspace root + optionally subfolders. Cline also reads `.agents/` for compat; Roo specifically promotes `AGENTS.md` to a primary rule source.
- **Provider count**: at the verified HEAD, Roo has 35 TypeScript files under `src/api/providers/` (30 provider handlers after excluding base/index/constants/router scaffolding); Cline has 44 under `cline/src/core/api/providers/` (43 if excluding `types.ts`). Notable Roo-only providers/files include `roo.ts`, `poe.ts`, `unbound.ts`, and `anthropic-vertex.ts`; `vercel-ai-gateway.ts` exists in both. Cline-only providers include many enterprise/regional ones (`asksage`, `dify`, `doubao`, `huawei-cloud-maas`, `nebius`, `nousresearch`, `oca`, `sapaicore`, `wandb`, etc.). Both share Anthropic, Bedrock, OpenAI, OpenRouter, Gemini, Vertex, Vercel AI Gateway, etc.

### 4.3 What Was Removed

- **Browser automation entirely.** [`packages/types/src/tool.ts:16`](../../Roo-Code/packages/types/src/tool.ts) declares `deprecatedToolGroups = ["browser"]`. The schema preprocessor (`groupEntryArraySchema`) silently strips `browser` from any custom mode's groups. There is no active `browser_action` tool or `BrowserSession.ts` under the current `src/` tree. The current `src/package.json` still declares `puppeteer-core` and `puppeteer-chromium-resolver`, so this is a code-surface removal rather than a dependency-tree removal. *This is the biggest removal.* Cline retains full screenshot-based browser automation. Roo's design choice: delegate browser work to MCP servers (e.g., the `browsermcp` MCP server), keeping the agent core leaner.
- **Plan / Act modes (the binary toggle).** Roo has no `plan_mode_respond` / `act_mode_respond` tools, no "strict plan mode" flag. Planning is now a *mode* (`architect`) — same intent, but generalized into the mode framework rather than a hardcoded binary.
- **Hooks system.** Cline has 9 lifecycle hooks (`TaskStart`, `TaskResume`, `TaskCancel`, `TaskComplete`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Notification`, `PreCompact`) executed as external processes with JSON I/O. Roo has no equivalent extension surface (verified by absence of `hooks/` directory and `executeHook` references). Roo emits internal `RooCodeEventName.*` events on the `EventEmitter` (`TaskDelegated`, `TaskDelegationCompleted`, `TaskCompleted`, `ModeChanged`, …) but these are for in-process API/bridge consumers, not user-extensible scripts.
- **`.clineignore` (renamed)**: Roo uses `.rooignore` ([`/Users/deepg/Desktop/agent/Roo-Code/.rooignore`](../../Roo-Code/.rooignore)) — same gitignore-style mechanism, different filename.
- **`load_mcp_documentation`** tool (Cline has it; Roo does not in its `toolNames` enum).
- **`web_fetch` / `web_search` tools** (Cline-specific provider tools, removed in Roo — web access goes through MCP if needed).
- **Sub-agents in the Cline `use_subagents` sense** (in-process parallel siblings) — Roo replaces this with Boomerang. There is no fan-out parallel sub-agent API; delegation is strictly sequential.

### 4.4 The Unifying Architectural Bet

Cline's bet: **one well-instrumented agent loop with rich approval UX and a broad first-party tool catalog** (browser, web fetch/search, hooks for extensibility, focus chain, plan/act).

Roo's bet: **mode plurality is the primary axis of variation**. Instead of Plan/Act + many tools, you get many modes + a smaller core tool set, with everything else either pushed to MCP servers (browser, web) or expressed as a custom mode (translation, issue-fixing, PR-fixing, merge-resolving, doc extraction). The Boomerang pattern is what makes mode plurality compositional — one mode can hand off cleanly to another and get a typed result back.

---

## 5. MCP Integration

### 5.1 Architecture

`McpHub` ([`./src/services/mcp/McpHub.ts`](../../Roo-Code/src/services/mcp/McpHub.ts), 1995 lines) — same name as Cline's hub, similar shape, but the implementations diverge in details. `McpServerManager` is a thin singleton wrapper that lets multiple `ClineProvider` instances share the same hub via reference counting.

### 5.2 Server Configuration

Two configuration sources:

- **Global**: `<extension global storage>/mcp_settings.json` — auto-created with `{"mcpServers": {}}` if missing. Watched via `vscode.workspace.createFileSystemWatcher`.
- **Project**: `<workspace>/.roo/mcp.json` — optional. Watched separately. Project takes precedence on slug collisions.

Schema (`McpSettingsSchema` → `ServerConfigSchema` discriminated union):

```jsonc
{
  "mcpServers": {
    "name": {
      "type": "stdio" | "sse" | "streamable-http",   // required when type=sse|streamable-http
      "command": "node",                              // stdio only
      "args": ["..."],                                // stdio only
      "cwd": "...",                                   // stdio (defaults to workspace root)
      "env": { "K": "V" },                            // stdio only
      "url": "https://...",                           // sse / streamable-http only
      "headers": { "Authorization": "Bearer ..." },   // sse / streamable-http only
      "disabled": false,
      "alwaysAllow": ["tool1", "tool2"],              // skip per-tool approval for these
      "disabledTools": ["dangerous-tool"],            // hide these from the LLM entirely
      "timeout": 60                                   // seconds; default 60
    }
  }
}
```

The validator ([`McpHub.ts:215-260`](../../Roo-Code/src/services/mcp/McpHub.ts)) enforces strict separation: a stdio config cannot have `url`/`headers`, a url-config cannot have `command`/`args`/`env`. Mixed fields throw before connection.

### 5.3 Transport Implementations

| Transport | Class | Implementation Status |
|---|---|---|
| **stdio** | `StdioClientTransport` (from `@modelcontextprotocol/sdk/client/stdio.js`) | Fully implemented. Custom `transport.start()` no-op patch + manual `start()` to capture stderr stream **before** `client.connect()` is called (the SDK's `connect` would otherwise own startup and miss early stderr). |
| **sse** | `SSEClientTransport` (from `@modelcontextprotocol/sdk/client/sse.js`) | Fully implemented. URL + optional headers. |
| **streamable-http** | `StreamableHTTPClientTransport` (from `@modelcontextprotocol/sdk/client/streamableHttp.js`) | Fully implemented. URL + optional headers. |

All three transports get `onerror` and `onclose` handlers for log propagation and reconnection signaling.

**Comparison with Cline**: Cline supports the same three transports, but the implementations and reconnection strategies differ slightly. Both projects wire `ReconnectingEventSource` for SSE. Cline has additional StreamableHTTP reconnection/compatibility logic, while Roo's `streamable-http` path is the simpler SDK transport plus headers. Both projects use the official `@modelcontextprotocol/sdk`.

**Comparison with Claude Code (claw-code)**: Claude Code only fully implements stdio; SSE/HTTP/WS routes parse but route to `unsupported_servers` (per `cline_research.md` part 2 source-of-truth note). Roo and Cline both win on transport breadth.

### 5.4 Connection Lifecycle

[`McpHub`](../../Roo-Code/src/services/mcp/McpHub.ts) constructor flow:
```
constructor(provider) →
  watchMcpSettingsFile() / watchProjectMcpFile() / setupWorkspaceFoldersWatcher()
  initializationPromise = Promise.all([
    initializeGlobalMcpServers(),     // read global settings, connect each
    initializeProjectMcpServers(),    // read .roo/mcp.json, connect each
  ])
```

`McpServerManager.getInstance()` awaits `hub.waitUntilReady()` when first creating the singleton. `Task.getSystemPrompt()` ([`Task.ts:3755-3764`](../../Roo-Code/src/core/task/Task.ts)) then gets that singleton and waits up to 10 seconds for `!mcpHub.isConnecting` before generating the system prompt — ensuring the prompt's MCP catalog includes reachable servers when they are ready, while still proceeding on timeout.

For each server:
```
connectToServer(name, configInjected, source) →
  Create Client (with name/version metadata)
  Construct Transport based on config.type
  await transport.start() [stdio only — for stderr capture]
  await client.connect(transport)
  fetchToolsList() → connection.server.tools = [...]
  fetchResourcesList() / fetchResourceTemplatesList() / fetchPromptsList()
  Register notification handler for ToolListChanged etc.
```

Disconnect cleanup (`removeConnection`):
```
connection.transport.close()
connection.client.close()
remove from this.connections
```

### 5.5 Tool Surfacing & Invocation

Two paths into MCP from the LLM:

1. **`use_mcp_tool { server_name, tool_name, arguments }`** — the wrapper tool, generic. The `mcp` tool group exposes this. Routes to `McpHub.callTool(serverName, toolName, args, source)` which issues `{ method: "tools/call", params: { name, arguments } }` over the transport.
2. **Native dynamic MCP tools (`mcp_<sanitizedServerName>_<toolName>`)** — when the model supports native tool calling, MCP server tools are also surfaced as direct first-class tools with the prefix `mcp_`. [`isToolAllowedForMode`](../../Roo-Code/src/core/tools/validateToolUse.ts:159-186) special-cases `tool.startsWith("mcp_")` and the `mcp` group: if the mode has the `mcp` group, dynamic MCP tools pass the gate. This avoids the wrapper indirection for newer models.

`McpHub.sanitizedNameRegistry` is what produces the safe prefix names (sanitized server name → registered key).

`callTool()` ([`McpHub.ts:1730-1769`](../../Roo-Code/src/services/mcp/McpHub.ts)) reads the per-server `timeout` from the saved config (default 60s, in milliseconds) and applies it to the `client.request()`. Disabled servers throw immediately. Connections in non-`"connected"` state throw with a "Please make sure to use MCP servers available under 'Connected MCP Servers'" hint — this is the exact wording the LLM may see and may then act on.

### 5.6 Per-Tool Allow / Disable Lists

`updateServerToolList(serverName, source, toolName, listName, addTool)` ([`McpHub.ts:1780-1855`](../../Roo-Code/src/services/mcp/McpHub.ts)) updates either `alwaysAllow` or `disabledTools` arrays on a per-server basis in the appropriate config file. Sets `isProgrammaticUpdate` flag temporarily so the file watcher doesn't restart the server on its own write.

`alwaysAllow` is the per-MCP-tool auto-approval list — the auto-approval handler ([`./src/core/auto-approval/mcp.ts`](../../Roo-Code/src/core/auto-approval/mcp.ts)) consults it before showing the user the approval ask. `disabledTools` removes the tool from `fetchToolsList`'s output entirely so the LLM never sees it.

### 5.7 Differences from Cline's MCP Integration

| Dimension | Roo | Cline |
|---|---|---|
| Project config path | `<workspace>/.roo/mcp.json` | Cline's project paths differ; both use a watched JSON file |
| Type name for streamable HTTP | `"streamable-http"` (kebab) | `"streamableHttp"` (camel) — config files are NOT cross-compatible |
| Per-server `disabledTools` list | Yes — hides tools from LLM | Cline supports `autoApprove` per server; `disabledTools` is less prominent |
| Per-tool auto-approval | Per-server `alwaysAllow: ["tool1", ...]` array | Per-tool `autoApprove: true` flag in mcp_settings.json |
| Native tool surfacing | `mcp_${serverName}_${toolName}` prefix when native tool calling enabled | `${server.uid}__cline_mcp_tool__${tool}` naming convention |
| Mode-conditional MCP catalog | MCP section appears in system prompt only if active mode has `mcp` group | All-or-nothing — MCP appears whenever servers exist |
| Enterprise controls | Marketplace-style server discovery (`./src/services/marketplace/`) | `blockPersonalRemoteMCPServers`, `mcpMarketplaceEnabled`, `allowedMCPServers` allowlist |

The mode-conditional MCP catalog (Roo) is a meaningful difference — `architect` mode in Roo can be configured *with or without* MCP access by toggling whether `mcp` is in its groups list. In Cline, MCP availability is global to the workspace.

---

## 6. Unique Patterns Worth Calling Out (For Synthesis)

These are patterns that haven't appeared elsewhere in the blueprint and are likely to be the most cited Roo contributions in the synthesis pass (Task 11):

1. **Mode = persona × tool-RBAC × file-RBAC × per-mode model config.** A single `ModeConfig` record is simultaneously a system-prompt override, a tool-allowlist, a write-path-allowlist (via `fileRegex`), and a routing key into per-mode API config. Other agents have personas (Claude Code sub-agents, OpenCode build/plan, Cursor modes); none unify all four axes into a user-editable YAML primitive.
2. **Boomerang as a synthetic-`tool_result` injection pattern.** §3.7 — the parent's API conversation is rewritten on disk to include a `tool_result` for the original `new_task` call, with the child's summary as content. This is mechanically different from in-process sub-agents (Claude Code `Agent`, AutoGPT child agents) and gives mode-typed, durable, persistable, restartable cross-mode delegation.
3. **Single-open-task invariant + persistent delegation metadata.** Treat the "stack" as a tree-edge in a persisted history graph (`parentTaskId`, `childIds`, `awaitingChildId`, `delegatedToId`, `completedByChildId`, status enum {active, delegated, completed}) rather than as an in-memory call stack. This makes delegation survive editor restarts.
4. **Custom-mode loader hardening.** [`CustomModesManager`](../../Roo-Code/src/core/config/CustomModesManager.ts) defends against pasted YAML quirks (NBSP, smart quotes, zero-width joiners, em-dash variants), supports JSON fallback for `.roomodes`, and serializes writes through a per-instance write queue. Production-grade input handling for a feature most projects would treat as a config file.
5. **Mode-scoped rule directories** (`.roo/rules-${mode}/`). Rules can be authored to apply to specific personas — e.g., debugger-only rules for "always add a log first." Stronger separation than Cline's flat `.clinerules/`.
6. **`switch_mode` as a first-class tool** with optional automatic per-mode API-config switching. Lets the agent itself reason about "I should switch to debug mode for this and load the model best suited for it."
7. **Tool aliasing registry** (`TOOL_ALIASES`) preserving the model-emitted name in API history while routing to canonical handlers. Lets `search_and_replace` and `edit` share a handler without breaking conversation continuity if the model re-reads its own past turns.
8. **`preventCompletionWithOpenTodos`** + `update_todo_list` as an explicit prompt-checklist pattern. Cline's focus-chain and Roo's todo-list are convergent designs for the same problem (visible task progress); Roo's choice to make completion-blocking a setting is a unique knob.
9. **Embedded vector index (Qdrant) with 8 embedder backends** as a `read`-group tool. Most agents in the blueprint either use ripgrep (Aider, Cline, Claude Code) or rely on the user to bring their own indexer. Roo bundles the indexer.
10. **Browser-deprecation-as-policy.** The decision to drop in-process browser automation in favor of MCP-delivered browser tools is itself an architectural pattern: *push novel I/O to the protocol layer rather than the core agent*. This is the cleanest example of "MCP eats the agent's first-party feature surface" we've seen.

---

## 7. Source-of-Truth Notes (For the Synthesis Agent)

- **HEAD verified**: `ad25634` (2026-04-24).
- **Browser automation does not exist in Roo Code's current `src/`**. Synthesis docs that need a "browser interaction" pattern from Phase 4 should attribute it to `[CLINE]` only. Roo's contribution to `browser_interaction.md` is the *deprecation rationale* (push to MCP), not an implementation. Do not infer live browser automation from dependency presence alone: the current `src/package.json` still carries Puppeteer packages.
- **`new_task` has TWO meanings across this blueprint**: in Cline it's "create a new conversation with preloaded context" (no parent linkage, no return path); in Roo it's the Boomerang primitive (parent linkage, synthetic return). When writing `multi_agent_patterns.md`, contrast both side by side — same tool name, fundamentally different semantics.
- **`new_task` should be treated as isolated / terminal within an assistant message**. Roo truncates tool blocks after `new_task` and injects error `tool_result` blocks for skipped tools so delegation cannot leave orphaned tool-use blocks in the parent conversation.
- **The "Boomerang" name is historical / marketing**. The current code uses "delegation" (`delegateParentAndOpenChild`, `reopenParentFromDelegation`, `TaskDelegated` event, `delegatedToId` field). Synthesis should use both names so search across docs works.
- **Orchestrator mode has `groups: []`**. If a future doc claims "Roo's orchestrator can use MCP" or "can read files," that's wrong. It can ONLY use the always-available tools — its job is purely coordination.
- **Mode switching has TWO tools**: `switch_mode` (in-place, same task) and `new_task` (delegation, child task). They are not interchangeable. Mode switching for a one-off context shift = `switch_mode`; mode switching as a sub-task = `new_task`.
- **Per-mode model selection is a feature**, not just config. `handleModeSwitch` actively loads the saved API config for the new mode. If synthesis docs cover "model routing," Roo's per-mode binding is a distinct strategy from Aider's architect/editor split (which is per-call) and Cline's per-task config (which is one-per-task).
- **Roo lacks a hooks subsystem**. Anywhere upstream Cline docs talk about hook-based extensibility, Roo's answer is "use MCP servers" — there's no equivalent of `PreToolUse` / `PostToolUse` external hooks in Roo. Roo's `RooCodeEventName.*` event emitter is for in-process listeners (the API package), not for shelling out to user scripts.
