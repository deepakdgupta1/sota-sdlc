# Documentation consolidation plan

Status: active
Owner: Codex
Source revision: `a38623b`
Current revision: `HEAD`
Current step: `00b` complete
Next step: `01`

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

### 02f. Reconcile the agent core loop

Compare `docs/agent-architecture/01_core_loop/` with the current model and rationale.

Exit: current loop decisions have the right shape and historical support.

### 02g. Reconcile agent cognition

Compare `docs/agent-architecture/02_cognition/` with the current model and rationale.

Exit: current cognition decisions have the right shape and historical support.

### 02h. Reconcile context handling

Compare `docs/agent-architecture/03_context_engine/` with the current model and rationale.

Exit: current context decisions have the right shape and historical support.

### 02i. Reconcile memory

Compare `docs/agent-architecture/04_memory/` with the current model and rationale.

Exit: current memory decisions have the right shape and historical support.

### 02j. Reconcile actions and tools

Compare `docs/agent-architecture/05_action_and_tools/` with the current model and rationale.

Exit: current action and tool decisions have the right shape and historical support.

### 02k. Reconcile orchestration

Compare `docs/agent-architecture/06_orchestration/` with the current model and rationale.

Exit: current orchestration decisions have the right shape and historical support.

### 02l. Reconcile governance

Compare `docs/agent-architecture/07_permissions_and_governance/` with the current model and rationale.

Exit: current governance decisions have the right shape and historical support.

### 02m. Reconcile user interaction

Compare `docs/agent-architecture/08_user_interaction/` with the current model and rationale.

Exit: current interaction decisions have the right shape and historical support.

### 02n. Reconcile the agent evaluation report

Compare `docs/ai_agent_evaluation_metrics_kpis_2026.md` with the current model and rationale. Keep only accepted current criteria and cite the September history tag.

Exit: the standalone report contributes no unexplained current decision.

### 03a. Audit rationale coverage in chapters 00 through 03

Identify each independent decision or claim. Reuse an existing rationale ID when it explains the current content. Add an entry only for a distinct reason. Check that subordinate prose, tables, definitions, and diagrams have an unambiguous governing decision.

Exit: every independent claim in chapters 00 through 03 has a current reason and historical support, and the ledger links resolve.

### 03b. Audit rationale coverage in chapters 04 through 06

Apply the same decision-level review to chapters 04 through 06.

Exit: every independent claim in these chapters has a current reason and historical support.

### 03c. Audit rationale coverage in chapters 07 through 10

Apply the same decision-level review to chapters 07 through 10.

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

Completed scope: current-state inspection, initial plan, and the accepted design revision.
Evidence: source revision `a38623b`; `docs-history-2026-07-30` exists; the current `node scripts/verify-docs.mjs` passes with 14 chapters, 33 rationale entries, and 29 charts. The chart total includes eight canvas charts.
Dirty files: none after the step 00b planning commit.
Verification state: complete for step 00b after the plan diff and commit check.
Exact next action: create and verify the annotated `docs-history-2026-09-24` tag at `a38623b`. The next user-initiated turn starts step 01.
