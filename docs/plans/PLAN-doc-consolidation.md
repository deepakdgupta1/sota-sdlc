# Documentation consolidation plan

Status: active
Owner: Codex
Source revision: `a38623b`
Current revision: `HEAD`
Current step: `03b` complete
Next step: `03c`

## Objective

Keep one current SDLC reference model and one explanation ledger. Define the model's scope, assumptions, and admission criteria. Use tagged Git history to support the current reasons. Remove roadmaps, handoffs, research notes, derivations, review records, and parallel document sets from the active tree after their useful reasoning is linked to the current model.

The user has already chosen these rules:

- `docs/snapshot/` is the only normative content set.
- Git history stores historical material.
- Stable rationale IDs connect current content to `docs/RATIONALE.md`.
- Reconcile accepted corrections before publishing the current model.

## Exit condition

The consolidation is complete when all of these statements are true:

- `README.md` is the only Markdown file in the repository root.
- `docs/snapshot/` contains the normative chapters listed by `docs/snapshot.parts.json`.
- `docs/RATIONALE.md` explains every independent current decision and claim. Supporting prose, tables, glossary entries, and diagrams inherit the governing decision.
- `index.html` shows the model in manifest order and opens rationale entries on demand. The ledger is not a manifest part.
- `scripts/check-doc-structure.mjs` verifies structural claims it can establish. Human review checks semantic coverage and the strength of each justification.
- Historical sources are absent from the active tree and recoverable from annotated tags.
- The structural checker and a browser check pass at the final commit.

## Current state

The first consolidation was partly completed in commits `07abc67` through `3f73877`. The annotated tag `docs-history-2026-07-30` preserves the original handoff, review, idea catalogue, roadmap inputs, canvas, and design files.

Revision `a38623b` later added another handoff and 47 agent-architecture Markdown files. The active tree now has 74 Markdown files:

- 3 files in the repository root
- 14 snapshot chapters
- 47 agent-architecture files
- 1 rationale ledger
- 1 standalone agent-evaluation report
- 8 canvas chapters

The current checker passes with 14 chapters, 33 rationale entries, and 29 charts across both viewers. The current `README.md` still advertises four documentation authorities. Its 21-chart claim applies to the snapshot viewer; the checker includes eight canvas charts. The ambiguity comes from counting different sets.

## Final active structure

```text
README.md
index.html
docs/
  RATIONALE.md
  snapshot.parts.json
  snapshot/
    00-front-matter.md
    01-system-at-a-glance.md
    02-destination-four-properties.md
    03-bedrock.md
    04-atom-unit-control-loop.md
    05-elements.md
    06-fractal.md
    07-lifecycle.md
    08-repertoires.md
    09-mechanism-of-done.md
    10-artifacts.md
    11-hard-gates-vs-graded.md
    12-agentic-sdlc.md
    13-appendices.md
scripts/
  check-doc-structure.mjs
```

The plan file is temporary. The final retirement commit removes it, so Git history keeps the execution record without adding another active documentation authority.

## Rationale contract

Use one stable rationale ID for each independent decision or claim. A rule, exception, table row, glossary definition, or diagram gets its own ID only when it makes an independent claim. Otherwise it inherits the ID of the decision that governs it. A section heading alone does not require an ID. The visible link sits at the decision, close enough that a reader can identify what it governs.

Each rationale entry contains only these fields:

- **Decision.** The current content or rule.
- **Why.** The present justification.
- **Applies to.** Snapshot anchors governed by the entry.
- **Evidence.** Tagged historical paths and headings, such as `docs-history-2026-09-24:<path>#<heading>`. Add an external source, its supported claim, and access date only when the decision depends on that fact. Label a source as an original decision record only if it explicitly records the original choice; otherwise it supplies historical support.
- **Superseded.** A replaced choice, only when that contrast explains the current decision.

Do not add status, owner, priority, completeness, or review fields. The active ledger contains accepted decisions only. Git records changes to those decisions.

The snapshot has no manually maintained freeze date or chapter and chart totals. The manifest defines chapter order, the viewer counts parts and charts from loaded content, and Git records each revision. The README states the change rule: a design change updates the snapshot and its rationale in the same commit; completed plans stay in Git history.

## Serial work packets

Complete one packet per user-initiated turn. Update the `Current step`, `Next step`, findings, revision, dirty files, and verification fields before each handoff.

### 00. Save the execution plan

Output: this file.
Verification: confirm that the worktree contains no other changes and that this plan names the current revision.

Exit: the plan is the only uncommitted file.

### 00b. Incorporate the accepted design changes

Output: a committed plan with a current reference model, decision-level rationale, on-demand rationale viewing, no duplicated dates or counts, and a structural checker whose name matches its scope.
Verification: inspect the changed plan, run `git diff --cached --check`, and confirm that the planning commit contains only this file.

Exit: the accepted changes are explicit in the work packets and the worktree is clean.

### 01. Preserve the September source set

Create the annotated tag `docs-history-2026-09-24` at `a38623b`. Do not move or replace `docs-history-2026-07-30`.

Verification:

```bash
git rev-parse docs-history-2026-09-24^{}
git show docs-history-2026-09-24:HANDOFF.md
git show docs-history-2026-09-24:docs/agent-architecture/00_meta/architectural_hierarchy.md
```

Exit: both history tags resolve, the representative files are readable, and the active files are unchanged.

For each packet in step 02, inspect only the named sources and affected current sections. Update the model and its rationale together. Run the current checker after edits and record the checked revision, changed files, evidence, and remaining questions in the handoff. If a packet exceeds the usage limit, finish a smaller verifiable subset and name the continuation packet. The imported `_research` files supply evidence when a current decision needs it; they are not a second model to reproduce.

### 02a. Reconcile E1 through E3

Apply the accepted work-unit boundary, Premise C, and gate refinements from `ROADMAP.md` §3.

Exit: E1 through E3 are represented in the affected chapters and rationale entries.

### 02b. Reconcile E4 through E6

Apply the accepted existence-gate placement, terminal-state, and failure-routing corrections.

Exit: E4 through E6 are represented in the affected chapters and rationale entries.

### 02c. Reconcile E7 through E9

Apply the accepted telemetry, lesson/test-instance, and agent containment corrections.

Exit: E7 through E9 are represented in the affected chapters and rationale entries.

### 02d. Reconcile E10 through E13

Apply E10, E12, and E13. Use E11 to remove factual errors and retain the formal-proof caveat. Leave Tier D implementation plans in Git history.

Exit: the accepted repairs are represented without importing a future work register.

### 02e. Reconcile agent architecture metadata

Compare `docs/agent-architecture/00_meta/` with the current model and rationale.

Exit: each relevant concept is represented in the current model or identified as historical support.

Disposition at `b17f44d`:

- `agent_registry.md` identifies the 14 products studied and their source repositories. It is research
  provenance, preserved at `docs-history-2026-09-24:docs/agent-architecture/00_meta/agent_registry.md`.
- `architectural_hierarchy.md` compares product loop families, prompts, memory stores, plugins,
  transports, permission models, and interfaces. The model-level loop, bounded work, retained lessons,
  and delegated controls already appear in snapshot chapters 04, 09, 10, and 12. Product-specific
  patterns, including source-controlled rules, generated skills, worktree orchestration, and the
  approval-versus-sandbox comparison, are historical implementation evidence, not additional SDLC
  stages. The source resolves at `docs-history-2026-09-24:docs/agent-architecture/00_meta/architectural_hierarchy.md`.
- `glossary.md` supplies vocabulary for that product comparison. Its generic loop, memory, tool, and
  delegation terms map to chapters 04, 10, and 12; vendor symbols and protocol details remain historical
  support for the later module packets. The tagged glossary resolves at
  `docs-history-2026-09-24:docs/agent-architecture/00_meta/glossary.md`.
- `quality_report.md` records May 2026 completeness, attribution, diagram, and link checks for the old
  30-module set. Its counts are historical QA evidence, not current model claims. The tagged report
  resolves at `docs-history-2026-09-24:docs/agent-architecture/00_meta/quality_report.md`.

No new independent model decision was found in the metadata. The module packets 02f through 02m will
review the underlying source chapters for any decision that the metadata only names.

### 02f. Reconcile the agent core loop

Compare `docs/agent-architecture/01_core_loop/` with the current model and rationale.

Exit: current loop decisions have the right shape and historical support.

Disposition at `18b690b`:

- `agentic_loop.md` compares product model/tool cycles, authorization, observation, and stop conditions.
  Its general turn mechanics support the new Chapter 12 distinction between an agent turn and work-unit
  acceptance. Product protocols, transports, and provider details remain historical evidence at
  `docs-history-2026-09-24:docs/agent-architecture/01_core_loop/agentic_loop.md`.
- `turn_lifecycle.md` shows how one incoming request can contain several model/tool iterations and end
  on a turn-level stop condition. Chapter 12 and `R-AGENTIC-01` now state that the enclosing work
  unit still needs its own outcome check and decision. The tagged source resolves at
  `docs-history-2026-09-24:docs/agent-architecture/01_core_loop/turn_lifecycle.md`.
- `prompt_orchestration.md` describes product-specific context selection, prompt ordering, output
  contracts, and token handling. These are ways to staff a turn, not new SDLC beats. Its tagged source
  resolves at `docs-history-2026-09-24:docs/agent-architecture/01_core_loop/prompt_orchestration.md`.
- `modular-agent-architecture-canvas.md` is a proposed modular agent design. Its small kernel,
  authorization, observation, and pause/stop ideas are compatible with Chapters 04 and 12; its module
  contracts and topology are design options, not current SDLC requirements. The tagged source resolves
  at `docs-history-2026-09-24:docs/agent-architecture/01_core_loop/modular-agent-architecture-canvas.md`.

The current four-beat SDLC loop remains unchanged. A model/tool turn can execute within any beat, but
its final message or tool stop condition does not discharge the work unit's acceptance check.

### 02g. Reconcile agent cognition

Compare `docs/agent-architecture/02_cognition/` with the current model and rationale.

Exit: current cognition decisions have the right shape and historical support.

Disposition at `2636a7d`:

- `planning_strategies.md` compares embedded plans, task queues, and skill-driven procedures. The
  model already places decomposition in `design` (Chapter 5) and the schedule bet in `plan` (Chapter 7).
  These product planning methods do not require another SDLC element. The tagged source resolves at
  `docs-history-2026-09-24:docs/agent-architecture/02_cognition/planning_strategies.md`.
- `task_decomposition.md` compares file scope, result-driven task creation, plan/execute strategies,
  and search through candidate steps. Chapter 9 already requires child work units to inherit applicable
  boundaries and acceptance criteria; Chapter 5 identifies decomposition as `design`'s output. Queue
  formats, parsers, and sub-agent search remain historical implementations at
  `docs-history-2026-09-24:docs/agent-architecture/02_cognition/task_decomposition.md`.
- `reasoning_patterns.md` distinguishes displayed self-criticism from staged feedback that updates
  strategy state. The current `reflect` beat already analyzes results and decides among exits
  (`R-LOOP-01`, `R-LOOP-02`). Chapter 12 requires independent-enough evidence for delegated checks
  (`R-AGENTIC-01`). A critique field alone guarantees neither. Its tagged source resolves at
  `docs-history-2026-09-24:docs/agent-architecture/02_cognition/reasoning_patterns.md`.
- `model_routing.md` compares model, provider, prompt, and parser routes. `R-BEDROCK-03` already treats
  capability selection and routing as contingent design needs rather than a new stone. Provider
  registries, gateway headers, and API choices remain historical implementation details at
  `docs-history-2026-09-24:docs/agent-architecture/02_cognition/model_routing.md`.

No independent SDLC decision emerged. The current model and rationale keep their existing shape.

### 02h. Reconcile context handling

Compare `docs/agent-architecture/03_context_engine/` with the current model and rationale.

Exit: current context decisions have the right shape and historical support.

Disposition at `247658a`:

- `context_assembly.md` compares prompt composition, task state, file roles, history, and memory
  selection. Its editable/read-only split is an agent authority boundary; the current work-unit boundary
  and delegated capability controls cover the model-level requirement. Prompt ordering remains historical
  implementation support at
  `docs-history-2026-09-24:docs/agent-architecture/03_context_engine/context_assembly.md`.
- `repo_map_and_indexing.md` compares source graphs, ranked snippets, and vector indexing. These are
  ways to locate context for work; a ranked snippet can omit details needed for an outcome check. The
  tagged source resolves at
  `docs-history-2026-09-24:docs/agent-architecture/03_context_engine/repo_map_and_indexing.md`.
- `retrieval_strategies.md` compares explicit file scope, graph ranking, semantic recall, and context
  providers. Its source selection and file-role labels do not themselves establish the result's truth.
  Chapter 12 already requires evidence outside the executor's unchecked report. The tagged source
  resolves at `docs-history-2026-09-24:docs/agent-architecture/03_context_engine/retrieval_strategies.md`.
- `token_economics.md` compares token estimates, repo-map budgets, summaries, and output caps. Finite
  budget is already part of the accountable work-unit boundary (`R-UNIT-01`); compression can lose
  details, so acceptance still rests on the work unit's checks. The tagged source resolves at
  `docs-history-2026-09-24:docs/agent-architecture/03_context_engine/token_economics.md`.

No independent SDLC decision emerged. Context machinery remains a choice of implementation under the
existing boundary, check, and delegation requirements.

### 02i. Reconcile memory

Compare `docs/agent-architecture/04_memory/` with the current model and rationale.

Exit: current memory decisions have the right shape and historical support.

Disposition at `22a5bba`:

- `working_memory.md` compares active chat/file state with an in-memory task queue. These volatile
  stores can staff a turn but cannot carry a lesson across the time and agent boundaries in Chapter 10.
  Product state shapes remain historical support at
  `docs-history-2026-09-24:docs/agent-architecture/04_memory/working_memory.md`.
- `persistent_memory.md` compares filesystem instruction files and reusable procedures. Persistence
  crosses sessions, while prompt loading can truncate content; a durable file alone does not prove
  that a later agent used its lesson. The tagged source supports `R-ARTIFACT-01` at
  `docs-history-2026-09-24:docs/agent-architecture/04_memory/persistent_memory.md`.
- `episodic_memory.md` distinguishes serialized action history from strategy-local reflections lost on
  restart, and records compression that can drop early details. These are concrete failure modes for
  the existing reflect-artifact and boundary-distance decisions, not a new memory beat. The tagged
  source supports `R-ARTIFACT-01` at
  `docs-history-2026-09-24:docs/agent-architecture/04_memory/episodic_memory.md`.
- `semantic_memory.md` compares similarity-based recall with structural repository indexing. An index
  helps find stored information but does not replace the durable target, result, or lesson itself.
  Vector-store and retrieval choices remain historical at
  `docs-history-2026-09-24:docs/agent-architecture/04_memory/semantic_memory.md`.

No independent SDLC decision emerged. The sources illustrate the current artifact requirement and
its implementation limits. They do not resolve `R-ARTIFACT-01`'s open Q4 on an attention boundary;
step 03c will assess that claim before step 04b removes open-question prose from the model.

### 02j. Reconcile actions and tools

Compare `docs/agent-architecture/05_action_and_tools/` with the current model and rationale.

Exit: current action and tool decisions have the right shape and historical support.

Disposition at `723671f`:

- `tool_architecture.md` compares model-facing tool schemas, registry filtering, dispatch, and result
  framing. Exposing a tool definition does not establish authorized effects or a checked outcome.
  Registry shapes remain historical at
  `docs-history-2026-09-24:docs/agent-architecture/05_action_and_tools/tool_architecture.md`.
- `code_modification.md` compares edit formats, parsing, guarded application, Git checkpoints, and
  lint/test feedback. Those mechanisms can staff `do` and `check`; an applied patch or commit alone
  does not accept the accountable work unit. The tagged source remains historical at
  `docs-history-2026-09-24:docs/agent-architecture/05_action_and_tools/code_modification.md`.
- `command_execution.md` separates command permission decisions, execution isolation, and tool
  results. Its implementation contrasts support the capability-containment limit in `R-BEDROCK-06`
  at `docs-history-2026-09-24:docs/agent-architecture/05_action_and_tools/command_execution.md`.
- `browser_interaction.md` compares screenshot-driven actions, per-action approval, and delegated
  browser tooling. A screenshot is an observation for the next turn, not independent acceptance of the
  intended result. Browser methods remain historical at
  `docs-history-2026-09-24:docs/agent-architecture/05_action_and_tools/browser_interaction.md`.
- `extensibility.md` compares external protocols, in-process plugins, and other extension surfaces.
  Self-declared tool safety metadata is not an operator-enforced boundary; this tagged source supports
  `R-BEDROCK-06` at
  `docs-history-2026-09-24:docs/agent-architecture/05_action_and_tools/extensibility.md`.

No independent SDLC decision emerged. Chapter 12 already separates capability containment from
outcome evidence and accountable acceptance; tool and browser implementations remain historical.

### 02k. Reconcile orchestration

Compare `docs/agent-architecture/06_orchestration/` with the current model and rationale.

Exit: current orchestration decisions have the right shape and historical support.

Disposition at `2ffdb9c`:

- `task_lifecycle.md` compares session status, plan-to-code handover, checkpoints, review routing,
  and todos. Its explicit cross-session plan and handover support the artifact boundary in
  `R-ARTIFACT-01`. A session completion signal or checklist state is not work-unit acceptance.
  Lifecycle mechanics remain historical at
  `docs-history-2026-09-24:docs/agent-architecture/06_orchestration/task_lifecycle.md`.
- `workflow_modes.md` compares personas, tool and file restrictions, model routing, and mode switches.
  These are ways to select and constrain a delegate under `R-UNIT-01` and `R-BEDROCK-06`; a prompt role
  alone does not enforce authority or prove a checked result. Mode schemas remain historical at
  `docs-history-2026-09-24:docs/agent-architecture/06_orchestration/workflow_modes.md`.
- `multi_agent_patterns.md` distinguishes spawned child runtimes, bookkeeping-only tasks, persistent
  parent-child delegation, and unlinked task handoffs. Its result summaries support
  `R-AGENTIC-01`'s separation of delegation from accountable acceptance. Parent and child mechanics
  remain historical at
  `docs-history-2026-09-24:docs/agent-architecture/06_orchestration/multi_agent_patterns.md`.

No independent SDLC decision emerged. Chapters 9, 10, and 12 already require projected child
constraints, durable handoff artifacts, and a separate outcome check by the accountable work unit.

### 02l. Reconcile governance

Compare `docs/agent-architecture/07_permissions_and_governance/` with the current model and rationale.

Exit: current governance decisions have the right shape and historical support.

Disposition at `d8d0eb2`:

- `permission_model.md` compares mode rules, per-action approval, and approval-plus-sandbox policies.
  These support Chapter 12's distinction between permission to run and containment during execution.
  Product policy matrices remain historical at
  `docs-history-2026-09-24:docs/agent-architecture/07_permissions_and_governance/permission_model.md`.
- `sandboxing.md` compares runtime isolation with rule- and confirmation-based approaches. A workspace
  sandbox restricts local execution but cannot by itself bound external service effects. The tagged
  source supports `R-BEDROCK-06` at
  `docs-history-2026-09-24:docs/agent-architecture/07_permissions_and_governance/sandboxing.md`.
- `safety_guardrails.md` compares cycle, token, cost, depth, and liveness limits. These implement the
  finite budget in `R-UNIT-01`; a logged cost field is not an enforced cap, and stopping a turn is not
  outcome acceptance. Thresholds and watchdogs remain historical at
  `docs-history-2026-09-24:docs/agent-architecture/07_permissions_and_governance/safety_guardrails.md`.
- `audit_and_observability.md` compares persisted tool records, optional telemetry, and programmable
  hooks. Action traces support accountability but do not replace a named seam's detection contract or
  independent outcome evidence. The tagged source supports `R-GATE-02` at
  `docs-history-2026-09-24:docs/agent-architecture/07_permissions_and_governance/audit_and_observability.md`.

No independent SDLC decision emerged. The current model now states the approval/containment
distinction explicitly; product-specific mechanisms remain historical.

### 02m. Reconcile user interaction

Compare `docs/agent-architecture/08_user_interaction/` with the current model and rationale.

Exit: current interaction decisions have the right shape and historical support.

Disposition at `f992fe6`:

- `input_processing.md` compares command-first routing, explicit file-scope changes, and channel
  adapters. These are ways to present and control an agent session, not a replacement for the
  accountable boundary and acceptance vector in `R-UNIT-01`. Product input grammars remain historical
  at `docs-history-2026-09-24:docs/agent-architecture/08_user_interaction/input_processing.md`.
- `feedback_loops.md` compares bounded edit repair, user-gated validation repair, per-action
  approval, completion feedback, and asynchronous CI checks. These staff parts of the Chapter 4
  loop, but neither an approval nor a completion prompt proves the work unit met its target. The
  tagged contrast supports `R-AGENTIC-01` at
  `docs-history-2026-09-24:docs/agent-architecture/08_user_interaction/feedback_loops.md`.
- `output_formatting.md` compares terminal, webview, native-editor, and channel-specific renderers.
  Rendering progress and tool results makes a session legible but supplies no independent outcome
  check. UI protocols and component choices remain historical at
  `docs-history-2026-09-24:docs/agent-architecture/08_user_interaction/output_formatting.md`.

No independent SDLC decision emerged. The current loop and delegation model already distinguish
session interaction from the accountable work unit and its outcome check.

### 02n. Reconcile the agent evaluation report

Compare `docs/ai_agent_evaluation_metrics_kpis_2026.md` with the current model and rationale. Keep only accepted current criteria and cite the September history tag.

Exit: the standalone report contributes no unexplained current decision.

Disposition at `67d0507`:

- `docs/ai_agent_evaluation_metrics_kpis_2026.md` distinguishes terminal completion from verified
  task success, separates outcome from tool/trajectory and safety measures, and calls for task- and
  risk-specific segmentation. These support the accountable acceptance and delegated-evidence
  decisions in `R-UNIT-01` and `R-AGENTIC-01`, which now cite the September history tag.
- The report's example dashboard weights, standing north-star KPI, blanket audit-coverage gate,
  pre-production zero-critical-incident gate, benchmark catalogue, and telemetry schema are
  historical proposals, not current SDLC criteria. The current model sets an acceptance vector per
  work unit and gates a named seam when non-local harm or outside authority requires it
  (`R-GATE-01`, `R-GATE-02`). A metric, completed run, or favorable trajectory score cannot replace
  an outcome check.

No independent SDLC decision emerged. The snapshot already has the accepted criteria and needs no
change for this report.

### 03a. Audit rationale coverage in chapters 00 through 03

Identify each independent decision or claim. Reuse an existing rationale ID when it explains the current content. Add an entry only for a distinct reason. Check that subordinate prose, tables, definitions, and diagrams have an unambiguous governing decision.

Exit: every independent claim in chapters 00 through 03 has a current reason and historical support, and the ledger links resolve.

Disposition at `dc935ae`:

- Chapter 00's authority and reading instructions map to `R-METHOD-01` and `R-METHOD-02`; the chart
  ladder is navigation. Its four-authority, ideal-model, and freeze-date prose is transitional and
  remains scheduled for steps 04a–04b, not a new current design decision.
- Chapter 01's synthesis now points from bedrock, loop, predictability, and delegation claims to
  their distinct reasons. Product-scale `evolve` is the same loop's re-target edge, not another beat.
- Chapter 02 needed one new decision, `R-APEX-04`, for predictability's cost, outcome, and schedule
  mechanisms. The point-property prose and two chart edges now state boundedness's limited role.
  The existing `R-APEX-01` through `03` and `R-AGENTIC-01` cover the other independent claims.
- Chapter 03's taxonomy, bundling, and two delegate risks remain under `R-BEDROCK-01` through `04`,
  `R-BEDROCK-06`, and `R-AGENTIC-01`. `R-LOOP-05` now covers the base-act exception in prose and chart.
  Concrete tools are choices, not forced stones. No further independent ID was needed.

Historical support for the added or clarified reasons resolves in `docs-history-2026-07-30` and
`docs-history-2026-09-24`. The documentation checker resolves the current rationale links.

### 03b. Audit rationale coverage in chapters 04 through 06

Apply the same decision-level review to chapters 04 through 06.

Exit: every independent claim in these chapters has a current reason and historical support.

Completed in this packet:

- Chapter 04's loop anatomy reuses `R-LOOP-01` and assigns the cross-cutting responses to
  `R-REPERTOIRE-01`, with precise links for the base act, the runtime
  sensor, non-convergence, and the delegated escape hatch. Its boundedness claim now assigns only
  cost control to the attempt cap; `R-APEX-04` covers output contracts and schedule bets separately.
- Chapter 05's outer element roster and the `decompose` fold have their own decision,
  `R-ELEMENT-01`. The prose states the `implement` exception; the time bridge points to
  `R-ARTIFACT-02`, and `decide` includes escalation.
- Chapter 06 separates the fractal's reuse of one control shape (`R-LOOP-06`) from proportional
  collapse (`R-LOOP-04`). The rate-limit example now has a consistent fixed-window failure and
  keeps design premises A/B/C open after a green stub check. The password-reset sensor is gated
  only at a named non-local seam, under `R-GATE-02`.

All three new reasons resolve to `docs-history-2026-07-30` sources. The checker resolves every added
link; current historical support for `R-LOOP-02` and `R-LOOP-03` now cites the tag explicitly.

### 03c. Audit rationale coverage in chapters 07 through 10

Apply the same decision-level review to chapters 07 through 10.
Assess `R-ARTIFACT-01`'s open Q4 on an attention boundary: establish a distinct current requirement
with evidence, place the concern under an existing requirement, or retain it as an unanswered research
question outside the current model before step 04b removes open-question prose.

Exit: every independent claim in these chapters has a current reason and historical support.

### 03d. Audit rationale coverage in chapters 11 through 13

Apply the same decision-level review to chapters 11 through 13. Check that every ledger entry governs at least one current location.

Exit: the full model has decision-level coverage, no duplicate IDs, and no orphaned ledger entries.

### 04a. State the model's scope and assumptions

Rename the model to "Current SDLC reference model" in its title and introduction. State its scope, assumptions, and admission criteria. Remove universal claims such as "any lifecycle" and "logically forced" unless a specific argument supports them. Use the accepted pressure-tested taxonomy claim.

Exit: the title and opening chapters describe the current model without promising universal completeness.

### 04b. Remove historical and maintenance prose from the model

Remove roadmap language, review state, open questions, priorities, iteration notes, freeze dates, duplicated chapter and chart totals, and claims that depend on a parallel document. Move the short serving and editing procedure from Appendix D to `README.md`. Keep the diagram data format discoverable through working examples and the structural checker.

Exit: the model describes only the current design and can be read without a retired file or repository procedure.

### 05. Retire parallel documentation

Delete these active sources after their accepted reasoning is represented in the snapshot and ledger:

- `HANDOFF.md`
- `ROADMAP.md`
- `sdlc-canvas/`
- `sdlc-canvas.parts.json`
- `docs/agent-architecture/`
- `docs/ai_agent_evaluation_metrics_kpis_2026.md`
- `sdlc-design.html`

Promote the design viewer to `index.html`. Remove `docs/RATIONALE.md` from the manifest's `parts` list, retain it as the `rationale` field, and load a requested rationale entry in an on-demand panel. Direct links to rationale IDs must open the same entry. Rewrite `README.md` as a short how-to for reading, serving, changing, checking, and retrieving history. State that a design change updates the model and its rationale in the same commit; completed plans stay in Git history.

Exit: the final active structure matches this plan and both tags restore every retired source set.

### 06. Narrow and rename the automated check

Rename `scripts/verify-docs.mjs` to `scripts/check-doc-structure.mjs`. Make it fail on:

- a missing, duplicate, or unlisted chapter, or chapter order that conflicts with numbered filenames
- a broken local link or anchor
- a `file://` link or pseudo-line link
- a missing, duplicate, or unused rationale ID
- a malformed decision marker or a rationale link that does not resolve
- a reference to a retired active path
- invalid chart data
- more than one Markdown file in the repository root

Derive chapter and chart counts from the manifest and loaded content. Do not assert a fixed count or claim that code proves semantic completeness. The human review in step 03 owns that judgment.

Exit: inject one representative failure at a time for at most two checks, confirm that the checker rejects each failure, revert the temporary changes, and confirm that the clean model passes.

### 07. Verify and retire the plan

Run the structural checker. Serve the repository and inspect every manifest part, the table of contents, every chart, and rationale links that open the on-demand panel. Check the browser console. Confirm that both history tags restore their representative files.

Commit the final consolidation and remove this already committed plan in that commit. Git keeps the execution record.

Exit: the worktree is clean, the final active structure matches this plan, the structural and browser checks pass, and Git history contains the plan and all retired sources.

## Findings and handoff

Completed scope: step 03b audited prose, tables, and charts in snapshot chapters 04 through 06 against the rationale ledger. Three distinct decisions gained `R-LOOP-06` (fractal reuse), `R-ELEMENT-01` (outer element staffing and no separate decomposition), and `R-REPERTOIRE-01` (cross-cutting responses). Existing IDs now point to the precise predictability, sensor, base-act, hard-gate, and delegation reasons. The rate-limit example's algorithm and failure now agree.
Evidence: `docs-history-2026-07-30:sdlc-canvas/01-bedrock-atom-fractal.md` §5 supports the fractal; `02-elements-flow-circuit-artifacts.md` §6 and `03-mechanism-of-done.md` §10.10 support the element roster and base-act exception. `03-mechanism-of-done.md` §§10.5–10.7 support the reflect, sensor, and collapse entries.
Changed files: snapshot chapters 04, 05, and 06; `docs/RATIONALE.md`; and this plan. Dirty files: none after this packet's commit.
Verification state: step 03b complete at `HEAD` (this checkpoint commit). The documentation checker and `git diff --check` pass. Browser QA remains scheduled for step 07. The old `asOf` date and historical prose remain assigned to later packets.
Exact next action: start step 03c by auditing independent decisions in snapshot chapters 07 through 10 against the ledger. Assess `R-ARTIFACT-01`'s open attention-boundary Q4 as the step requires, then verify links and tagged support.
