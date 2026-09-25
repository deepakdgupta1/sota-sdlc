## Appendix A — Glossary

<sup>[↪ Why](#r-method-01)</sup>

Plain-language definitions of the recurring terms.

- **Stone.** A brute, unavoidable fact about reality that makes software hard and *forces* a specific
  response. There are ten — eight **first-order** (about the problem) plus a two-seat **second-order
  tier** (about who staffs the loop) (Chapter 3). <sup>[↪ Why](#r-bedrock-01)</sup>
- **The loop / the atom.** The single feedback cycle `define → do → check → reflect ↺` that everything
  reduces to (Chapter 4). <sup>[↪ Why](#r-loop-01)</sup>
- **Beat.** One of the four scale-invariant phases of the loop (define, do, check, reflect). <sup>[↪ Why](#r-loop-01)</sup>
- **Element.** The outermost loop's concrete staffing of a beat (specify, scope, design, implement,
  verify, observe, analyze, decide). <sup>[↪ Why](#r-loop-01)</sup>
- **Work unit.** An accountable piece of work with a declared boundary and acceptance vector. Its
  child targets inherit applicable constraints; a small inner loop is not automatically a separate
  accountable work unit. <sup>[↪ Why](#r-unit-01)</sup>
- **Boundary.** The work unit's scope, exclusions, delegated authority, and budget. It states what the
  unit may change and what it must leave outside. <sup>[↪ Why](#r-unit-01)</sup>
- **Acceptance vector.** The work unit's targets for `reliable`, `predictable`, `resilient`, and `secure`,
  plus named qualities relevant to its outcome. Child targets project applicable criteria from the
  parent. <sup>[↪ Why](#r-unit-01)</sup>
- **Fractal.** The property that the loop repeats, unchanged in shape, both up across scope and down
  into each element (Chapter 6). <sup>[↪ Why](#r-loop-04)</sup>
- **Point-property.** A property measured at a single task in a single context: *reliable*, *predictable*. <sup>[↪ Why](#r-apex-01)</sup>
- **Envelope-property.** A property measured across the range of contexts over time: *resilient* (vs.
  random hardship), *secure* (vs. a directed adversary). <sup>[↪ Why](#r-apex-02)</sup>
- **Graded target.** A "done" expressed as a threshold on a quality range, checked by measurement — as
  opposed to a yes/no. <sup>[↪ Why](#r-gate-01)</sup>
- **Proxy.** A measurable stand-in for a quality you can't measure directly (coverage for "well-tested,"
  latency for "feels fast"). Proxies can be gamed — the gap between proxy and intent is where defects
  hide. <sup>[↪ Why](#r-done-02)</sup>
- **Composition hypothesis.** The bet `design` makes that "if every part is done, the whole is done"
  — `(∧Lᵢ) ⟹ P`. A failed parent acceptance check with green leaf checks calls for diagnosis of
  the composition, leaf oracles, and environment model. <sup>[↪ Why](#r-done-03)</sup>
- **Stub-composition.** Wiring together behaviour-less stubs of each component at design time, to cheaply
  refute a bad decomposition before building. <sup>[↪ Why](#r-done-01)</sup>
- **Premises A, B, and C.** After stub-composition, A says the leaves behave as contracted (`verify`);
  B says the contracts hold across their input range (sampled at build and monitored by `observe`);
  C says the contract set would deliver the parent target even if perfectly honoured (design review,
  followed by integration and acceptance evidence). <sup>[↪ Why](#r-done-01)</sup>
- **Leaf.** A target checkable without further decomposition — *deterministic* (an assertion) or
  *statistical* (a threshold on a sampled value). <sup>[↪ Why](#r-done-02)</sup>
- **Repertoire.** A set of cross-cutting responses invoked from `reflect`: the *resilience* repertoire
  (escalate, degrade, recover, roll back) and the *security* repertoire (authn/authz, sanitize, harden,
  red-team). <sup>[↪ Why](#r-apex-02)</sup>
- **Hard gate.** A constraint the work unit cannot locally waive, either because one violation is
  non-local or because outside authority imposes it (Chapter 11). <sup>[↪ Why](#r-gate-01)</sup>
- **Existence gate.** Required evidence must exist for its accountable work unit. Nested loops may
  share that evidence; a named seam gate still applies at the seam. <sup>[↪ Why](#r-gate-04)</sup>
- **Amplifier.** One of the three things that make a violation non-local: adversarial, irreversible,
  machinery-degrading. <sup>[↪ Why](#r-gate-01)</sup>
- **Artifact.** The persistent, explicit carrier of a loop's target / result / lesson across the *time*
  and *agent* boundaries (Chapter 10). <sup>[↪ Why](#r-artifact-01)</sup>
- **Boundary-distance law.** The forced durability of an artifact scales with the distance between its
  producer and its consumer; `reflect`'s backward-feeding artifact is the extreme case (the sole
  channel). <sup>[↪ Why](#r-artifact-01)</sup>
- **Base act.** `implement` (with `release` as its seam-analogue): the operand the loop controls — the
  plant, not the controller. It defends no stone by design; the one *licensed exception* to the
  Chapter 3 self-test (§7). <sup>[↪ Why](#r-loop-05)</sup>
- **Schedule bet.** `plan`'s conjecture that if every task lands in its slot, the whole ships by the
  date — `scope`+`specify` projected onto the time axis. An estimate is the stub of a task;
  critical-path feasibility is stub-composition on time. Baseline existence gated; dates graded (§7.1). <sup>[↪ Why](#r-gate-03)</sup>
- **Regression ratchet.** Retained lessons and rationale from fixed failures, with re-runnable checks
  for relevant failure classes (§10.1). Obsolete, redundant, or misleading test instances can retire
  with a recorded reason while required guards remain. Existence gated; coverage graded.
  <sup>[↪ Why](#r-artifact-03)</sup>
- **Reversible envelope (rollback's reach).** The region of version-space `roll back` can restore.
  Irreversibility ≡ beyond it; hard gates fall at its limit, and widening the envelope converts
  pre-execution gates back into graded bets (§10.1). <sup>[↪ Why](#r-artifact-02)</sup>
- **Silent failure.** A path that fails *and emits no telemetry* — the unit the observability gate rule
  classifies (§11.1). Gate a named seam's signal when silent failure is non-local or outside authority
  requires it; grade aggregate coverage. Debug sampling cannot replace required audit evidence.
  <sup>[↪ Why](#r-gate-02)</sup>
- **Convergent law (existence-hard, fidelity-graded).** At an accountable work unit, each required
  artifact must exist; nested loops may share evidence. Fidelity, coverage, and content remain graded
  (§11.2). plan : predictable :: ADR : reliable :: regression : resilient :: telemetry : observe. <sup>[↪ Why](#r-gate-04)</sup>
- **Second-order tier.** The two stones that are facts about the *solver* rather than the problem, and
  bite only under delegation/autonomy. Formalized by the **arity of the stone's referent**: first-order
  stones are properties of *(solver × world)* — true of one mind (so "we err," #4, stays first-order);
  second-order stones are properties of *(solver × solver / self)* — relational. Two seats:
  independence (#9) and alignment (#10) — the count the admission criterion currently yields, not a
  proven ceiling (Chapter 12). <sup>[↪ Why](#r-bedrock-03)</sup>
- **Reflexivity (stone #9).** The second-order risk that a delegated checker shares the doer's
  assumptions or evidence, so its checks add little information unless they use an independent method
  or source (Chapter 12). <sup>[↪ Why](#r-agentic-01)</sup>
- **Independence.** The degree to which a check adds information because its errors differ from the
  doer's. A human, distinct method, or separate evidence source can provide it. <sup>[↪ Why](#r-agentic-01)</sup>
- **Accountable principal.** The person or authority responsible for the delegated result and its
  consequences. Human judgment remains for values, accountability, and exceptional authority. <sup>[↪ Why](#r-agentic-01)</sup>
- **Incentive-divergence (stone #10).** The second-order, delegated-only stone about the *doer*: a
  persistent party optimises its own payoff over your target even when your intent is fully known
  (misaligned — not hostile like #8, not mistaken like #4). Its willful face forces **alignment**
  (Chapter 12). <sup>[↪ Why](#r-bedrock-04)</sup>
- **Alignment.** For persistent parties, outcome-linked incentives and accountability connect their
  payoff to the intended result. <sup>[↪ Why](#r-bedrock-04)</sup> For non-persistent inference, use
  capability containment, proxy-resistant evaluation, and independent evidence; the model assumes no
  continuing payoff that task-level rewards can shape. <sup>[↪ Why](#r-bedrock-06)</sup>
- **Bundling rule.** The self-test's third direction: two faces of a pressure are **one** stone only if
  they share a *single* forced response, else they are **sibling** stones — why "distributed + perishable"
  is one stone (#7) but "change" and "uncertain" are two (#5, #6), and why #9 and #10 are siblings, not
  one stone. It is a **self-test heuristic, not an identity criterion** — the pressure→response relation
  is many-to-many, so the rule cannot establish a closed count. <sup>[↪ Why](#r-bedrock-02)</sup>
- **Admission criterion.** What earns a pressure a seat in the bedrock: it is a brute fact rather than a
  contingent choice, it forces a response the existing stones do not already force, and it survives the
  three-direction self-test. This — not a proof of exhaustiveness — is what the bedrock rests on, and
  what makes a candidate eleventh stone admissible rather than excluded. <sup>[↪ Why](#r-bedrock-01)</sup>
- **Ouroboros / evolve.** The product-level feedback edge that feeds run-time learning back into the
  target, turning the loop into an improving spiral. <sup>[↪ Why](#r-apex-01)</sup>

## Appendix B — The stones-to-responses matrix

<sup>[↪ Why](#r-bedrock-01)</sup>

One table, the whole causal skeleton.

| Stone | Fact | Forced response(s) | Property served |
|---|---|---|---|
| 1 | intent is hidden | `specify` (elicit the root target) | reliable |
| 2 | unbounded vs. finite | `scope`, `decide` | predictable |
| 3 | complexity > one step | `design` (decompose + composition hypothesis) | all four, at every seam |
| 4 | humans & models err | `verify`, `analyze` | reliable |
| 5 | reality keeps changing | the **regression ratchet** (the `reflect`→`verify` bridge; existence gated) + **`roll back`** (graded, gate at its limit) — §10.1; version / integrate | resilient — the *over-time* clause |
| 6 | reality is uncertain | `observe` (telemetry); `degrade`, `recover` | resilient |
| 7 | knowledge distributed & perishable | **artifacts** (persist + make explicit) | all four (carries every loop's output) |
| 8 | adversarial actors | security repertoire (authn/authz, sanitize, harden, red-team) | secure |
| 9 | reflexivity — checker not independent *(autonomous only)* | independence-seeking (external terminal, adversarial/diverse review) | protects reliable |
| 10 | incentive-divergence and the non-persistent inference branch *(delegated only)* | persistent parties: incentives and accountability; inference: capability containment, proxy-resistant evaluation, independent evidence | protects reliable |

> Three lifecycle boxes are deliberately **not** rows. `plan` is `scope`+`specify` projected onto the
> time axis (§7.1) and `release` is the build→operate seam whose governance *is* the stone-#5 machinery
> (§10.1) — projections and seams, not stone-responses. `implement` is the **base act** — the operand
> the loop controls — the one licensed exception to the self-test (§7).

## Appendix C — The snapshot boundary and the rationale conventions

<sup>[↪ Why](#r-method-05)</sup>

- **What this is, and as of when.** This document presents the **ideal MUST-HAVE** design: what *any*
  reliable, predictable, resilient, and secure SDLC is logically forced to contain. It deliberately
  does **not** audit any particular real-world setup against the ideal — that is a separate exercise,
  kept out so the ideal stays uncontaminated. It is **frozen as of 2026-07-30** (`asOf` in
  `docs/snapshot.parts.json`): historical truth as of that date, not a claim of perpetual freshness.
- **What is not yet in it.** Tier E repairs E1 through E6 are represented in this snapshot. The
  remaining repairs in `ROADMAP.md` §3 are pending. Read the current sections with their rationale
  entries; the roadmap records work that has not yet changed the model.
- **Source of the derivation.** Every claim here is derived, step by step, in the companion
  [canvas](index.html), which also holds the audit trail
  — the Socratic question-and-answer history, the iteration log, and the open-tracks register (§11
  there), which is the authoritative list of what remains. When you want to know *why* a piece is
  shaped the way it is, or *how* we got here, read the canvas; when you want to *understand the
  design*, read this.
- **The charts are regenerable.** Every chart on this page is a fenced `pipeline-graph` block in this
  file. Edit the block (or drag nodes in the viewer and use **Export**) and the picture updates — the
  visuals never drift from the text.

### Rationale conventions

<sup>[↪ Why](#r-method-04)</sup>

Every contested decision in this document has an entry in the **rationale ledger**
(`docs/RATIONALE.md`, rendered as the final section of this page). A decision is *contested* if it was
derived against alternatives, disputed, or retracted — not merely written down.

- **Coverage.** Each H2/H3 section, each chart, and each glossary definition that encodes a contested
  choice carries a small **↪ Why** link to its governing entry. Tables carry one link for the table;
  a row gets its own only when that row is itself a contested decision. **Explanatory prose inherits
  the nearest enclosing entry** — the ledger records decisions, not sentences.
- **Identifiers** are stable and semantic — `R-APEX-01`, `R-BEDROCK-04`, `R-LOOP-02`, `R-GATE-03`,
  `R-DONE-01`, `R-AGENTIC-01` — namespaced by *subject*, never by chapter number, so renumbering a
  chapter never invalidates a reference.
- **Historical traces** cite the annotated Git tag and a heading, never a line number:
  `docs-history-2026-07-30:<path>#<heading>`. Line numbers rot on the next edit; headings and tags do
  not. Retrieve any traced source with `git show docs-history-2026-07-30:<path>`.
- **External evidence** appears only where a claim actually rests on it, and always as *source ·
  the exact claim it supports · access date*. Legal and vulnerability facts decay fastest; an
  undated external claim in this repository is a defect.
- **No status field.** Every ledger entry is accepted by definition. Unresolved work lives in
  `ROADMAP.md`; rejected ideas appear only where they explain why a surviving piece has its shape.

**Maintenance rule.** The canvas is where derivation continues; this document is regenerated from it
whenever the model advances. If the two ever disagree, the canvas wins on *reasoning* and this
document wins on *presentation* — and the disagreement itself is a sync task. A substantive change
advances `asOf` and updates the affected ledger entries in the same commit.

---

## Appendix D — Working with this repository

<sup>[↪ Why](#r-method-01)</sup>

*Operating instructions for the documents themselves. Nothing here is part of the model.*

### What is where

<sup>[↪ Why](#r-method-01)</sup>

| Path | Role |
|---|---|
| `sdlc-canvas/` (8 parts) + `sdlc-canvas.parts.json` | the **canvas** — source of truth for *reasoning*: the derived model, the `▶ RESUME INSTRUCTIONS` (the method, in `00-framing.md`), the current frontier and open-tracks register (`04-frontier.md` §11), the iteration log (`06-iteration-log.md`), and the canvas diagram data (`07-interactive-diagrams.md`). Designed to be resumed from by itself. |
| `docs/snapshot/` (14 parts) + `docs/snapshot.parts.json` | **this document** — source of truth for *understanding*: one file per chapter, 21 inline charts, glossary. Regenerated from the canvas when the model advances. |
| `docs/RATIONALE.md` | the **ledger** — source of truth for *justification*. Rendered as the last section of this page. |
| `ROADMAP.md` | source of truth for *what's next* — phases and gates, the Tier E (model repairs) and Tier D (control plane) registers, traceability for every prior A/B/C/T item, and the open-questions register Q1–Q10. |
| `index.html` | the canvas viewer — fetches the manifest, concatenates the parts, and hoists every diagram into one tabbed editable panel. |
| `sdlc-design.html` | the snapshot viewer — same fetch-and-concatenate, but charts render **inline** in context, with zoom chips and a floating chart ladder. |
| `vendor/` | `marked` and `cytoscape`, vendored locally. |
| `scripts/verify-docs.mjs` | the documentation gate — run it before committing. |
| `.claude/launch.json` | preview server configs — **`canvas`** on port 4321, **`snapshot`** on port 4330. Either serves the whole folder, so both pages are reachable from either port. |

### Running the site

<sup>[↪ Why](#r-method-01)</sup>

The page **must be served over http** — it `fetch()`es the markdown, and `file://` is blocked.

- **In Claude Code:** `preview_start` with name **`canvas`** (port 4321) or **`snapshot`**
  (port 4330), then open the preview.
- **Manually:** from the repository root, `python3 -m http.server 4321`, then open
  `http://localhost:4321` for the canvas or `http://localhost:4321/sdlc-design.html` for this
  document.
- **Validate first:** `node scripts/verify-docs.mjs`.

### What the site does

<sup>[↪ Why](#r-method-01)</sup>

- **Hot-linked content.** Fetches the manifest, then every part it lists, concatenating them in order
  with `cache:no-store` — on load and then **every 3.5 s** (the *Auto-sync* toggle in the header).
  Edit any part file and the page updates within seconds; *Refresh* forces a reload. Auto-sync pauses
  while you are renaming a node or in fullscreen, so it never clobbers an in-progress edit.
- **Rendering.** Markdown via `marked`; auto-built sidebar TOC with scrollspy, top progress bar,
  section reveal-on-scroll, dark "glass" styling.
- **Interactive diagrams.** Every fenced `pipeline-graph` block is *hoisted* out of the prose and
  rendered as a live **Cytoscape** canvas — inline here, and in a tabbed panel on the canvas viewer.

**Diagram controls.** Drag the background to pan · scroll to zoom · drag a node to move it.
Double-click a node to **rename**, double-click empty space to **add**, select and press **Delete**
to remove, and use **Connect** mode to click source then target for a new edge. The toolbar carries
`＋ Node` · `⇢ Connect` · `✕ Delete` · `⊹ Fit` · `✦ Tidy` (auto-layout) · `⟲ Reset` (reload from the
markdown) · `⤓ Export` (copy JSON to clipboard) · `⛶ Pop out` (fullscreen; `Esc` exits).

**Persisting diagram edits.** In-browser edits are client-side and ephemeral. To make one permanent,
click **⤓ Export** — it copies a `pipeline-graph` block to the clipboard — then paste it over the
matching block in its part file. Every canvas diagram lives in
`sdlc-canvas/07-interactive-diagrams.md`; each snapshot chart sits inline in its own chapter file
under `docs/snapshot/`. This is what keeps the visuals regenerable from the text, which is the
stated philosophy: the charts never drift from the prose because they *are* the prose.

### Diagram data model (to add or change a diagram)

<sup>[↪ Why](#r-method-05)</sup>

Add a fenced block to the markdown:

~~~
```pipeline-graph
{
  "title": "My diagram",
  "nodes": [ {"id":"a","label":"A","group":"beat","x":0,"y":0} ],
  "edges": [ {"source":"a","target":"b","dashed":true,"label":"…","member":true} ]
}
```
~~~

- `group` → colour: **beat** (purple) · **element** (teal) · **stone** (coral) ·
  **repertoire** (amber) · **property** (pink) · **terminal** (gray).
- `edge.dashed` = pink dashed feedback edge · `edge.member` = faint structural link (no arrow) ·
  `edge.label` = small caption.
- `x`/`y` are preset positions (nodes stay draggable).

### Caveats

<sup>[↪ Why](#r-method-01)</sup>

- **One remaining network dependency.** `marked` and `cytoscape` are vendored under `vendor/`, so the
  page works offline — but the **Inter and JetBrains Mono webfonts still load from Google Fonts**.
  Offline, the page renders and functions normally with fallback fonts.
- **Harmless console warnings.** A custom wheel-sensitivity note, and a `label` width/height
  deprecation from Cytoscape 3.30 (still functional; the version is pinned). Neither is an error.
- **Pop-out fullscreen** uses the Fullscreen API — it works in a normal browser tab on a user
  gesture, but a sandboxed preview iframe may block it.
- **Never open either viewer via `file://`** — the markdown fetch will fail. The page detects this
  and tells you to serve over http.
