## Rationale ledger

The current model is in `docs/snapshot/`; this ledger explains its independent decisions. Supporting
prose, tables, and charts inherit the nearest governing decision. The model links to entries by stable
ID, and each entry names the content it governs.

**Reading an entry.** *Decision* states the present rule; *Why* gives its justification; *Applies to*
locates it in the model. *Evidence* cites tagged Git history or an external source when the decision
depends on it. *Superseded* appears only when a replaced choice explains the present one.

Historical sources are available under `docs-history-2026-07-30` and
`docs-history-2026-09-24`. Cite a tag, path, and heading, not a line number; see
[R-METHOD-04](#r-method-04). Rejected ideas remain only when they explain a current decision.

---

### <a id="r-apex-01"></a>R-APEX-01 · Four properties, in two families

- **Decision.** The apex is exactly four properties in two families: **point-properties** measured at a
  single context (`reliable`, `predictable`) and **envelope-properties** measured over context-hardness ×
  time (`resilient`, `secure`).
- **Why.** `reliable` and `predictable` are independent axes, proven by two thought experiments — a
  correct-but-unforeseeable setup is reliable and not predictable; a foreseeable-but-wrong setup is the
  reverse. Neither can absorb the other, so both get a seat. Random hardship and directed search also
  demand distinct envelopes; [R-APEX-02](#r-apex-02) gives that argument.
- **Governs.** `docs/snapshot/02-destination-four-properties.md`, `docs/snapshot/01-system-at-a-glance.md`.
- **Trace.** `docs-history-2026-07-30:sdlc-canvas/00-framing.md#2-the-destination-four-properties-the-apex`
  — historical support for the destination.

### <a id="r-apex-02"></a>R-APEX-02 · `secure` sits beside `resilient`, not under it

- **Decision.** `secure` takes a fourth seat *beside* `resilient` rather than a slot beneath it.
- **Why.** Both are envelopes over context-hardness, but stone #8 splits that axis **by the source of the
  hardness**: reality *samples* the context space blindly (#5, #6), while an adversary *searches* it for
  the worst case. The statistical machinery that manufactures resilience — redundancy, retries, graceful
  degrade — actively fails against a directed opponent, because retries feed a denial-of-service. Same
  shape, different opponent, and a distinct security repertoire is therefore forced.
- **Governs.** `docs/snapshot/02-destination-four-properties.md`,
  `docs/snapshot/08-repertoires.md`.
- **Trace.** `docs-history-2026-07-30:sdlc-canvas/00-framing.md#2-the-destination-four-properties-the-apex`.
- **Superseded.** A single `resilient` envelope with security as its hardest case. Rejected: it predicts
  that more redundancy buys more security, which is false at the seam an adversary chooses.

### <a id="r-apex-03"></a>R-APEX-03 · Named qualities belong in acceptance vectors

- **Decision.** `specify` records performance, accessibility, maintainability, privacy, and other
  relevant qualities as acceptance criteria, with contexts and thresholds. Map each criterion to the
  apex property affected by its failure; one criterion can map to several properties.
- **Why.** The apex classifies failure modes. A quality such as performance can affect foreseeable
  latency and survival under load without becoming a fifth property. Naming the quality at the work
  unit preserves its specific target as `design` projects criteria into child work.
- **Applies to.** `docs/snapshot/02-destination-four-properties.md`,
  `docs/snapshot/09-mechanism-of-done.md`.
- **Evidence.** Historical support: `docs-history-2026-09-24:ROADMAP.md#3-tier-e-model-repairs-phase-0`
  E10.

### <a id="r-apex-04"></a>R-APEX-04 · Predictability has distinct cost, outcome, and schedule mechanisms

- **Decision.** Bounded attempts and a budget constrain a work unit's cost, tight interface contracts
  constrain its output, and a schedule bet addresses delivery timing across work units. The
  schedule is an aggregate over time, not a property established by one bounded unit.
- **Why.** A cap on retries and a resource budget bound expenditure, but do not say what an attempt
  returns or when many dependent attempts finish. Contracts constrain output at a seam; a plan states
  the dependencies and duration assumptions needed for a delivery forecast. Each mechanism answers a
  different uncertainty.
- **Applies to.** `docs/snapshot/01-system-at-a-glance.md`,
  `docs/snapshot/02-destination-four-properties.md`, `docs/snapshot/04-atom-unit-control-loop.md`,
  `docs/snapshot/07-lifecycle.md`.
- **Evidence.** Historical support:
  `docs-history-2026-07-30:sdlc-canvas/00-framing.md#2-the-destination-four-properties-the-apex`,
  schedule caveat; `docs-history-2026-07-30:sdlc-canvas/03-mechanism-of-done.md`, §10.10.

### <a id="r-bedrock-01"></a>R-BEDROCK-01 · The bedrock is a pressure-tested taxonomy, not a proof

- **Decision.** The bedrock is a **derived, pressure-tested hazard taxonomy with an explicit admission
  criterion**. A pressure earns a seat when it is a brute fact (not a contingent choice), it forces a
  response the existing stones do not already force, and it survives the three-direction self-test.
  Claims of *proven* exhaustiveness — "exactly eight first-order stones", "exactly two second-order
  seats" — are **retracted**. Every stone stands.
- **Why.** The document itself grants that the pressure→response relation is many-to-many, so the
  bundling rule cannot function as an identity criterion; it is a **self-test heuristic**. A count
  derived from a heuristic is a tested judgment, not a theorem. The criterion allows a candidate
  eleventh stone to be assessed on its facts and required response instead of excluding it by count.
- **Governs.** `docs/snapshot/00-front-matter.md`, `docs/snapshot/01-system-at-a-glance.md`,
  `docs/snapshot/03-bedrock.md`,
  `docs/snapshot/13-appendices.md#appendix-b-the-stones-to-responses-matrix`.
- **Trace.** `docs-history-2026-09-24:ROADMAP.md#3-tier-e-model-repairs-phase-0` E12 ·
  `docs-history-2026-07-30:sdlc-canvas/01-bedrock-atom-fractal.md`.
- **Superseded.** "The bundling rule establishes exactly eight first-order stones." Retracted 2026-07-30.
  This does **not** reopen canvas track T6, which closed the pressure-test; it corrects the *epistemic
  status* of the count, not its content.

### <a id="r-bedrock-02"></a>R-BEDROCK-02 · The bundling rule is a self-test heuristic

- **Decision.** A shared forced response supports bundling two pressure descriptions; distinct
  responses support separate stones. This is a self-test heuristic, not a necessary or sufficient
  identity test. "Distributed" and "perishable" currently sit under #7; "change" and "uncertain"
  remain #5 and #6.
- **Why.** A pressure can force several responses, and several pressures can share one. Response
  comparison helps detect duplicate descriptions but cannot prove a closed stone count.
- **Governs.** `docs/snapshot/03-bedrock.md`.
- **Trace.** `docs-history-2026-07-30:sdlc-canvas/01-bedrock-atom-fractal.md` — the bundling rule (T6).
- **See also.** [R-BEDROCK-01](#r-bedrock-01) — the rule is a heuristic, so it cannot close the count.

### <a id="r-bedrock-03"></a>R-BEDROCK-03 · The second-order tier and candidate residues

- **Decision.** Stones #9 and #10 sit on a formalized **second-order tier**, where *order = the arity of
  the stone's referent*: first-order stones are monadic (solver × world — so "we err" (#4) stays
  first-order), second-order stones are relational (solver × solver, or solver × self). The tier has
  **two seats** — independence (#9) and alignment (#10) — because the loop makes two silent assumptions
  about the minds it delegates to: that the checker is independent, and that the doer is faithful.
  Capability and liveness are not admitted as separate stones under the current criterion.
- **Why.** The partition is not cosmetic: it *predicts* the class's shape. Second-order stones are
  relational, **conditional** (they collapse to nothing when one aligned mind does everything), and they
  erode a point-property by breaking a staffing assumption rather than by making the problem harder.
  Capability mismatch is contingent on the selected delegate and task.
  `design`, `verify`, and escalation answer it under #3 and #4; capability selection, tool access, and
  routing remain distinct design needs. Liveness failure is a contingent interruption of the selected
  execution. Bounded work, recovery, and artifacts answer it under #2, #5, and #7; timeouts,
  checkpoints, and resumption remain distinct design needs. Neither candidate currently meets the
  brute-fact requirement for another stone. This judgment can change on new evidence.
- **Applies to.** `docs/snapshot/03-bedrock.md`, `docs/snapshot/12-agentic-sdlc.md`,
  `docs/snapshot/13-appendices.md`.
- **Evidence.** Historical support: `docs-history-2026-07-30:sdlc-canvas/01-bedrock-atom-fractal.md`,
  `docs-history-2026-07-30:sdlc-canvas/05-laws-and-insights.md`; correction:
  `docs-history-2026-09-24:ROADMAP.md#3-tier-e-model-repairs-phase-0` E12.
- **Superseded.** The unexplained one-line folds of capability into #4 and liveness into #7.

### <a id="r-bedrock-04"></a>R-BEDROCK-04 · Incentives apply to persistent delegated parties

- **Decision.** Stone #10's incentive branch applies to persistent parties such as vendors, teams,
  and contractors. Outcome-linked incentives and an accountable principal address divergence between
  their payoff and the intended result. Non-persistent inference follows [R-BEDROCK-06](#r-bedrock-06).
- **Why.** A party can know the target and still benefit from a different outcome. Better specification
  or an independent checker alone cannot change that payoff. This rationale depends on continuing
  interests that incentives can influence; it cannot be assumed for every software-agent invocation.
- **Applies to.** `docs/snapshot/03-bedrock.md`, `docs/snapshot/12-agentic-sdlc.md`,
  `docs/snapshot/01-system-at-a-glance.md`, `docs/snapshot/13-appendices.md`.
- **Evidence.** Historical support: `docs-history-2026-09-24:ROADMAP.md#3-tier-e-model-repairs-phase-0`
  E9; earlier admission argument: `docs-history-2026-07-30:sdlc-canvas/06-iteration-log.md`, iteration 35.
- **Superseded.** The assumption that every delegated doer has its own continuing payoff to align.

### <a id="r-bedrock-06"></a>R-BEDROCK-06 · Contain and evaluate non-persistent inference

- **Decision.** For non-persistent inference, require capability containment, proxy-resistant
  evaluation, and independent evidence. An accountable principal owns acceptance and consequences.
- **Why.** This branch assumes no continuing payoff that a task-level reward can shape. An inference
  call can still produce an output that passes a proxy while missing intent. Limiting tools,
  permissions, and effects bounds exposure; checking actual outcomes and independent evidence reduces
  reliance on the proxy and on the executor's own report. These controls do not prove perfect alignment.
- **Applies to.** `docs/snapshot/03-bedrock.md`, `docs/snapshot/12-agentic-sdlc.md`,
  `docs/snapshot/13-appendices.md`.
- **Evidence.** Historical support: `docs-history-2026-09-24:ROADMAP.md#3-tier-e-model-repairs-phase-0`
  E9. Implementation contrasts in
  `docs-history-2026-09-24:docs/agent-architecture/05_action_and_tools/command_execution.md`
  and `docs-history-2026-09-24:docs/agent-architecture/07_permissions_and_governance/permission_model.md`
  distinguish tool approval from execution policy;
  `docs-history-2026-09-24:docs/agent-architecture/07_permissions_and_governance/sandboxing.md`
  shows runtime containment as a separate control, while
  `docs-history-2026-09-24:docs/agent-architecture/05_action_and_tools/extensibility.md`
  notes that extension-provided safety annotations can be self-declared. Model-visible tool definitions
  alone are not an enforcement boundary. This is a design assumption for the non-persistent branch,
  not a claim about every agent system.
- **Superseded.** Treating task-level incentives as the response to non-persistent inference.

### <a id="r-bedrock-05"></a>R-BEDROCK-05 · Cost-asymmetry is a derived law, not a stone

- **Decision.** *Attack is cheaper than defence* is a **derived law**, not a bedrock stone.
- **Why.** It decomposes without residue into #8 (an adversary searches) plus #3 (the system exceeds one
  mind, so there are many seams and one undefended seam suffices). A pressure that fully decomposes into
  existing stones fails the admission criterion.
- **Governs.** `docs/snapshot/08-repertoires.md`, `docs/snapshot/03-bedrock.md`.
- **Trace.** `docs-history-2026-07-30:sdlc-canvas/01-bedrock-atom-fractal.md` (T6, iteration 35) ·
  `docs-history-2026-07-30:sdlc-canvas/05-laws-and-insights.md`.

### <a id="r-loop-01"></a>R-LOOP-01 · One atom: `define → do → check → reflect`

- **Decision.** The stones force exactly one atom — `define → do → check → reflect ↺` — where `reflect`
  decomposes into **analyze** (frame and root-cause) then **decide** (*accept* a known issue ·
  *re-target* · *escalate*). At product scale, the same feedback re-aims the target after operation.
- **Why.** Each beat is the forced response to a stone that cannot be answered elsewhere: intent is
  hidden, so the target must be made explicit (`define`); we err, so the result must be tested against
  the target (`check`); and a failed check is uninformative unless something frames *why* before the
  loop turns again (`reflect`). Runtime learning feeds the same re-target step at product scale.
- **Governs.** `docs/snapshot/01-system-at-a-glance.md`,
  `docs/snapshot/04-atom-unit-control-loop.md`, `docs/snapshot/05-elements.md`,
  `docs/snapshot/07-lifecycle.md`.
- **Trace.** `docs-history-2026-07-30:sdlc-canvas/01-bedrock-atom-fractal.md` §4;
  product-scale projection: `docs-history-2026-07-30:sdlc-canvas/02-elements-flow-circuit-artifacts.md`
  §7–8.

### <a id="r-loop-02"></a>R-LOOP-02 · `reflect` is the loop's only backward channel

- **Decision.** `reflect` is a forced MUST-HAVE beat and the loop's **only** backward channel; its
  required evidence is existence-gated at the accountable work unit.
- **Why.** Every other beat moves the work forward. Without `reflect`, a failed `check` can only repeat
  the same attempt, so the loop cannot converge — it oscillates. Convergence is what `reliable`
  *is*, so removing `reflect` removes the property.
- **Governs.** `docs/snapshot/04-atom-unit-control-loop.md`, `docs/snapshot/05-elements.md`,
  `docs/snapshot/10-artifacts.md`.
- **Trace.** `docs-history-2026-07-30:sdlc-canvas/03-mechanism-of-done.md` §10.5.
  [R-GATE-04](#r-gate-04) supplies the current accountable-unit attachment point.

### <a id="r-loop-03"></a>R-LOOP-03 · `observe` must own a real sensor

- **Decision.** `observe` is a forced element, and telemetry is both a **detector** and `analyze`'s
  actual operand — not a reporting nicety.
- **Why.** `check` covers what was anticipated at `define` time. Stones #5 and #6 guarantee that reality
  supplies conditions nobody anticipated, so a loop with no sensor cannot discover them, and `analyze`
  has nothing to reason over. The sensor is what makes the envelope-properties observable at all.
- **Governs.** `docs/snapshot/04-atom-unit-control-loop.md`, `docs/snapshot/05-elements.md`,
  `docs/snapshot/11-hard-gates-vs-graded.md`.
- **Trace.** `docs-history-2026-07-30:sdlc-canvas/03-mechanism-of-done.md` §10.6.

### <a id="r-loop-04"></a>R-LOOP-04 · Ceremony is proportional insurance

- **Decision.** A beat **collapses toward bare `do`** wherever its forcing stone is absent. A named
  seam gate and required evidence at the accountable work unit remain in force.
- **Why.** Ceremony is insurance against a specific hazard. Where the hazard is absent the premium buys
  nothing, and a model that demanded full ceremony everywhere would be self-refuting: it would spend the
  finite resources that stone #2 says are scarce. The collapse rule is what makes the ideal *affordable*
  without making it optional where it matters.
- **Applies to.** `docs/snapshot/06-fractal.md`.
- **Evidence.** Historical support: `docs-history-2026-07-30:sdlc-canvas/03-mechanism-of-done.md`
  §10.7, the inward base case. [R-GATE-04](#r-gate-04) sets the gate's attachment point.

### <a id="r-loop-06"></a>R-LOOP-06 · The same loop nests across scope and within elements

- **Decision.** The four beats recur outward in each part that `design` carves and inward when an
  element's own work needs a target, check, and reflection. An inner loop escalates to its parent.
  Beats are scale-invariant; the named elements staff the outermost SDLC loop.
- **Why.** Decomposing work does not remove hidden intent, error, uncertainty, or finite resources
  from its parts. A second control shape at each scale would duplicate the response to those stones.
  Applying the same shape to an element's output makes its own failure and escalation checkable.
- **Applies to.** `docs/snapshot/05-elements.md`, `docs/snapshot/06-fractal.md`.
- **Evidence.** Historical support: `docs-history-2026-07-30:sdlc-canvas/01-bedrock-atom-fractal.md`
  §5. [R-LOOP-04](#r-loop-04) governs when the inward loop may collapse.

### <a id="r-element-01"></a>R-ELEMENT-01 · Elements staff beats without duplicating their work

- **Decision.** The outermost loop uses `specify`, `scope`, and `design` to define; `implement` to do;
  `verify` and `observe` to check; and `analyze` and `decide` to reflect. `design` owns decomposition;
  a separate `decompose` element adds no output. `implement` is the licensed base-act exception to
  the stone-response self-test.
- **Why.** Each control element has a distinct job forced by a stone. `decompose` would repeat
  `design`'s output and own no separate artifact. The build itself is the operand being controlled,
  so demanding that it defend a stone would misapply the self-test.
- **Applies to.** `docs/snapshot/04-atom-unit-control-loop.md`, `docs/snapshot/05-elements.md`.
- **Evidence.** Historical support: `docs-history-2026-07-30:sdlc-canvas/02-elements-flow-circuit-artifacts.md`
  §6 and `docs-history-2026-07-30:sdlc-canvas/03-mechanism-of-done.md` §10.10.

### <a id="r-repertoire-01"></a>R-REPERTOIRE-01 · Escalation and in-place responses are cross-cutting

- **Decision.** `escalate`, `degrade`, `recover`, and `roll back` are responses available from
  `reflect` at different scopes; none is a fifth beat. Escalation hands the problem upward, while
  the other responses trade completeness, spare capacity, or newness to keep operation viable.
- **Why.** A failed check may need a response besides another build attempt. That choice depends on
  the failure and scope, so hard-wiring a response as a sequential beat would misstate the loop.
  Escalation changes who decides; the other moves preserve service within the current scope.
- **Applies to.** `docs/snapshot/04-atom-unit-control-loop.md`,
  `docs/snapshot/07-lifecycle.md`, `docs/snapshot/08-repertoires.md`,
  `docs/snapshot/13-appendices.md`.
- **Evidence.** Historical support: `docs-history-2026-07-30:sdlc-canvas/01-bedrock-atom-fractal.md`
  §4 and `docs-history-2026-07-30:sdlc-canvas/02-elements-flow-circuit-artifacts.md` §6.
  [R-ARTIFACT-02](#r-artifact-02) explains the change-axis role of rollback.

### <a id="r-repertoire-02"></a>R-REPERTOIRE-02 · A directed adversary needs distinct responses

- **Decision.** The security repertoire covers identity and authority checks, boundary validation,
  surface reduction, and adversarial review. These responses can be applied at the relevant seams
  and scales; they are not additional beats of the lifecycle.
- **Why.** A directed adversary can impersonate, inject input, probe exposed weaknesses, and adapt to
  the defenses it observes. Random-failure recovery alone does not address these choices. A roster
  of controls makes the different attack paths visible without claiming every instance is a hard gate.
- **Applies to.** `docs/snapshot/08-repertoires.md`, `docs/snapshot/12-agentic-sdlc.md`,
  `docs/snapshot/13-appendices.md`.
- **Evidence.** Historical support: `docs-history-2026-07-30:sdlc-canvas/02-elements-flow-circuit-artifacts.md`
  §6. [R-GATE-01](#r-gate-01) sets the narrower current rule for named seam gates.

### <a id="r-schedule-01"></a>R-SCHEDULE-01 · A plan is a conditional schedule bet

- **Decision.** `plan` projects `scope` and `specify` onto time. Task estimates and milestone
  contracts form a schedule bet; critical-path and capacity checks can refute infeasible plans but
  cannot confirm delivery. A surviving plan leaves three premises: tasks meet their estimates,
  execution conditions stay within the forecast, and the selected tasks actually deliver the
  intended release. Check these with per-task progress, observed slip, and release acceptance.
- **Why.** A feasible arrangement of estimated tasks establishes only internal consistency. Tasks
  may take longer, dependencies and capacity may change, or the planned task set may omit work
  needed for the release. The last failure is the schedule analogue of design's Premise C.
- **Applies to.** `docs/snapshot/07-lifecycle.md`, `docs/snapshot/13-appendices.md`.
- **Evidence.** Historical schedule bet and two-premise account:
  `docs-history-2026-07-30:sdlc-canvas/03-mechanism-of-done.md` §10.10. The third premise applies
  the accepted composition repair in `docs-history-2026-09-24:ROADMAP.md#3-tier-e-model-repairs-phase-0`
  E2 to that schedule bet. [R-DONE-01](#r-done-01) gives the design analogue.

### <a id="r-loop-05"></a>R-LOOP-05 · `implement` is the base act, `release` is a seam

- **Decision.** `implement` is the **base act** — the operand the loop controls — and the one licensed
  exception to the self-test. `release` is the build→operate **seam**, governed by the stone-#5
  machinery. Neither is a stone-response, so neither is a row in the stones matrix; `plan` likewise is
  `scope`+`specify` projected onto the time axis.
- **Why.** The self-test asks which stone forces each element. Applied to `implement` it has no answer,
  because `implement` is not a *response* to a hazard — it is the thing the responses are about. Marking
  it as the licensed exception keeps the self-test sharp everywhere else.
- **Governs.** `docs/snapshot/03-bedrock.md`, `docs/snapshot/04-atom-unit-control-loop.md`,
  `docs/snapshot/05-elements.md`, `docs/snapshot/06-fractal.md`, `docs/snapshot/07-lifecycle.md`,
  `docs/snapshot/13-appendices.md#appendix-b-the-stones-to-responses-matrix`.
- **Trace.** `docs-history-2026-07-30:sdlc-canvas/03-mechanism-of-done.md` §10.10.

### <a id="r-unit-01"></a>R-UNIT-01 · A work unit has a boundary and an acceptance vector

- **Decision.** Each accountable work unit declares a boundary (scope, exclusions, delegated authority,
  and budget) and an acceptance vector (the four apex properties plus named target qualities). Child
  targets project the constraints that apply to their part without silently relaxing the parent.
- **Why.** The boundary says what work and authority the unit owns; the vector says how its result will
  be accepted. Mixing scope into a quality list hides exclusions and budget while omitting `secure`.
  Separating the two also makes propagation precise: a child inherits applicable constraints, not an
  identical set of targets regardless of its role.
- **Applies to.** `docs/snapshot/00-front-matter.md`, `docs/snapshot/02-destination-four-properties.md`,
  `docs/snapshot/09-mechanism-of-done.md`, `docs/snapshot/13-appendices.md`.
- **Evidence.** Historical support: `docs-history-2026-09-24:ROADMAP.md#3-tier-e-model-repairs-phase-0`
  E1. This records the accepted repair, not the original motivation for every target quality.
  `docs-history-2026-09-24:docs/ai_agent_evaluation_metrics_kpis_2026.md#segment-everything`
  illustrates why outcome, cost, latency, and safety measures need task- and risk-specific contexts
  instead of one universal agent score.
- **Superseded.** The four-axis propagation schema that counted scope as an axis and omitted `secure`.

### <a id="r-done-01"></a>R-DONE-01 · Design is a bet, and stub-composition tests it cheaply

- **Decision.** Design states a composition bet. Stub-composition can refute incompatible contract
  wiring cheaply, but a green result leaves three premises: A, the real leaves meet their contracts; B,
  the contracts hold across their input ranges; and C, the contract set delivers the parent target even
  if perfectly honoured. Route A to `verify`, B to `observe`, and C to design review and integration
  acceptance evidence.
- **Why.** Compatible wiring cannot establish that the contracts describe the right whole. Naming C
  prevents a green stub check from being mistaken for proof of the parent target. The three premises
  keep distinct failure causes and evidence paths visible before implementation and integration.
- **Applies to.** `docs/snapshot/06-fractal.md`, `docs/snapshot/07-lifecycle.md`,
  `docs/snapshot/09-mechanism-of-done.md`,
  `docs/snapshot/13-appendices.md`.
- **Evidence.** Historical support: `docs-history-2026-09-24:ROADMAP.md#3-tier-e-model-repairs-phase-0`
  E2; earlier design bet: `docs-history-2026-07-30:sdlc-canvas/03-mechanism-of-done.md`.
- **Superseded.** "Green stubs discharge the implication" and a two-premise account that omitted
  contract adequacy.

### <a id="r-done-02"></a>R-DONE-02 · A formal proof relocates the blind spot; it does not remove it

- **Decision.** Formal proof is a check modality that **relocates** the reflexivity blind spot from the
  code into the specification. It does not escape it, and it does not make a check non-Goodhartable.
  A leaf can use deterministic, statistical, formal, simulated, human-experiential, or runtime-assured
  evidence. Each modality has a residue and a proxy that can be optimized instead of the outcome.
- **Why.** Two independent arguments converge. Internally, stacking correlated checkers cannot multiply
  into confidence — there is a common-mode floor of shared error that iteration never crosses, and a
  proof shares the specification's error. Externally, models have been observed **Goodharting a formal
  verifier**: exploiting weak formal specifications instead of implementing the intended solution.
  Other check modalities also differ in evidence, residual uncertainty, and opportunities to optimize
  the proxy rather than the intended result.
- **Governs.** `docs/snapshot/12-agentic-sdlc.md`, `docs/snapshot/09-mechanism-of-done.md`.
- **Evidence.** Max Tan, [*Automating Formal Verification with Reinforcement Learning and Recursive
  Inference*](https://arxiv.org/abs/2605.30914), 29 May 2026, reports specification hacking against
  weak formal specifications. Accessed 2026-09-25. Historical support for the modality expansion:
  `docs-history-2026-09-24:ROADMAP.md#3-tier-e-model-repairs-phase-0` E13.
- **Trace.** `docs-history-2026-07-30:REVIEW-ASSESSMENT-2026-07.md#4-verification-log` row 12 ·
  `docs-history-2026-07-30:sdlc-evolution-ideas.md#a3-formal-verification`.
- **Superseded.** "A formal proof is non-Goodhartable, and drives premise B to zero." Retracted: it
  contradicted this snapshot's own text, which already said a proof only relocates the blind spot.
  The deterministic and statistical examples were also treated as exhaustive; they are now two of six
  check modalities.

### <a id="r-done-03"></a>R-DONE-03 · Diagnose a green-check acceptance failure before routing it

- **Decision.** If parent acceptance fails while leaf checks pass, `analyze` tests the composition
  hypothesis, the leaf oracles, and the environment model. `decide` then routes the repair to `design`,
  the affected leaf and `verify`, or `observe` and `specify`, according to the failed assumption.
- **Why.** A passing check establishes only that its oracle accepted the observed result. It does not
  prove that the leaf met the intended target or that the environment matched the model. Re-decomposing
  every such failure would leave bad oracles and missing environmental conditions untouched.
- **Applies to.** `docs/snapshot/09-mechanism-of-done.md`, `docs/snapshot/13-appendices.md`.
- **Evidence.** Historical support: `docs-history-2026-09-24:ROADMAP.md#3-tier-e-model-repairs-phase-0`
  E6; the earlier composition bet: `docs-history-2026-07-30:sdlc-canvas/03-mechanism-of-done.md`.
- **Superseded.** The claim that green leaf checks prove the leaves kept their promises and therefore
  falsify only the composition hypothesis.

### <a id="r-done-04"></a>R-DONE-04 · Tighten contracts only as far as the required realities allow

- **Decision.** Choose the narrowest interface domain that admits every required expected and adverse
  input. A smaller, specified domain can make more of Premise B exhaustively checkable; internal types
  can make invalid values unrepresentable within that domain. Validate external inputs at the boundary.
- **Why.** A loose contract leaves more combinations to sample or monitor. An over-tight contract
  excludes legitimate cases and breaks the parent target. Exhausting a specified domain removes its
  input-range residue, not specification error, environmental uncertainty, or Premise C.
- **Applies to.** `docs/snapshot/09-mechanism-of-done.md`, `docs/snapshot/13-appendices.md`.
- **Evidence.** Historical support: `docs-history-2026-07-30:sdlc-canvas/03-mechanism-of-done.md`
  §10.2. [R-DONE-01](#r-done-01) states the three premises; [R-DONE-02](#r-done-02) states the remaining
  check and specification blind spots.
- **Superseded.** Unqualified claims that type encoding rules out invalid external inputs or that
  exhaustive checking makes the whole contract or parent target residue-free.

### <a id="r-gate-01"></a>R-GATE-01 · A gate follows non-local harm or outside authority

- **Decision.** A work unit has no local accept exit when one violation is non-local or an outside
  authority imposes a gate. Three harm amplifiers explain the model-derived source: adversarial search,
  irreversibility, and damage to the correcting machinery. Outside authority is a separate gate source,
  not a fourth amplifier. Treat unknown blast radius as non-local until evidence bounds it. For
  security, gate forbidden-output reachability at a named seam and grade defence depth and posture.
- **Why.** A non-local loss cannot be offset by green checks elsewhere. An outside authority can also
  remove local discretion even when local harm is bounded. Unknown scope does not support a claim that a
  violation is local. A per-seam reachability result is checkable; an undivided assertion that all of
  `secure` passes is not.
- **Applies to.** `docs/snapshot/11-hard-gates-vs-graded.md`, `docs/snapshot/09-mechanism-of-done.md`,
  `docs/snapshot/10-artifacts.md`, `docs/snapshot/06-fractal.md`, and
  `docs/snapshot/13-appendices.md`.
- **Evidence.** Historical support: `docs-history-2026-09-24:ROADMAP.md#3-tier-e-model-repairs-phase-0`
  E3; prior harm rule: `docs-history-2026-07-30:sdlc-canvas/03-mechanism-of-done.md`.
- **Superseded.** "Hard gate iff non-local" as an exhaustive rule, and "secure is hard wholesale" as
  one untestable gate.

### <a id="r-gate-02"></a>R-GATE-02 · Gate the per-seam binary, grade the aggregate

- **Decision.** Gate a named seam's signal and detection bound when silent failure is non-local or
  outside authority requires evidence. Other coverage remains proportional to risk and may collapse
  to zero on a fully modeled, reversible, local path unless outside authority imposes an aggregate
  threshold. Such a threshold cannot replace a required seam signal. Separate debug records from
  audit records.
  Specify sampling, redaction, cost limits, and retention without dropping required evidence.
- **Why.** Richer logs elsewhere cannot replace a required signal at the seam where harm occurs.
  That does not make every silent local failure non-local. Continuous emission on every path would
  contradict the collapse rule and consume resources without a demonstrated detection need. Debug
  sampling can serve diagnosis; audit evidence must preserve the required accountable events. Neither
  an aggregate coverage score nor the presence of a log proves the detection contract is met.
- **Applies to.** `docs/snapshot/06-fractal.md`, `docs/snapshot/11-hard-gates-vs-graded.md`,
  `docs/snapshot/13-appendices.md`.
- **Evidence.** Historical support: `docs-history-2026-09-24:ROADMAP.md#3-tier-e-model-repairs-phase-0`
  E7; earlier seam argument: `docs-history-2026-07-30:sdlc-canvas/03-mechanism-of-done.md`, §10.9.
  `docs-history-2026-09-24:docs/agent-architecture/07_permissions_and_governance/audit_and_observability.md`
  contrasts persisted tool-use records with optional tracing and hook output; it does not establish a
  required detection bound for any SDLC seam.
- **Superseded.** Telemetry as a forced continuous, every-seam property; the claim that every silent
  seam is necessarily non-local. Required audit evidence cannot be replaced by sampled debug logs.

### <a id="r-gate-03"></a>R-GATE-03 · The convergent law — existence-hard, fidelity-graded

- **Decision.** At an accountable work unit, each required artifact obeys one rule: **its existence is
  gated, its fidelity is graded.**
  `plan : predictable :: ADR : reliable :: regression : resilient :: telemetry : observe`.
- **Why.** The four instances were derived independently and landed on the same shape, which is what
  promotes a pattern to a law. It also explains why the model resists both failure modes at once:
  demanding perfect artifacts would be unaffordable ceremony, while allowing an artifact to be *absent*
  would silently delete the property it carries.
- **Applies to.** `docs/snapshot/07-lifecycle.md`, `docs/snapshot/11-hard-gates-vs-graded.md`,
  `docs/snapshot/10-artifacts.md`, `docs/snapshot/13-appendices.md`.
- **Evidence.** Historical support: `docs-history-2026-07-30:sdlc-canvas/05-laws-and-insights.md`
  §12. [R-GATE-04](#r-gate-04) states the attachment point for this rule.

### <a id="r-gate-04"></a>R-GATE-04 · Required evidence attaches to the accountable work unit

- **Decision.** Gate the existence of required evidence at the accountable work unit. Its nested loops
  may share an artifact if it identifies the unit and preserves the evidence they need. A gate for a
  named seam remains at that seam.
- **Why.** Requiring a separate artifact from every nested element conflicts with the collapse rule
  and consumes effort without adding evidence. Allowing the accountable unit to omit required evidence
  would blind its later `analyze`. The accountable unit is an explicit policy choice for ownership,
  not a granularity derived from the bedrock. Seam gates retain their own location because harm can
  occur before the unit completes.
- **Applies to.** `docs/snapshot/06-fractal.md`, `docs/snapshot/10-artifacts.md`, `docs/snapshot/11-hard-gates-vs-graded.md`,
  `docs/snapshot/13-appendices.md`.
- **Evidence.** Historical support: `docs-history-2026-09-24:ROADMAP.md#3-tier-e-model-repairs-phase-0`
  E4 and Q7. The accountable work-unit boundary is [R-UNIT-01](#r-unit-01).
- **Superseded.** The reading of the convergent law that gated an artifact at every fractal node.

### <a id="r-artifact-01"></a>R-ARTIFACT-01 · Stone #7 forces artifacts, and distance sets their cost

- **Decision.** At an accountable work unit, retain the targets, results, and lessons that must cross
  **time** or **agent** boundaries in explicit artifacts; nested loops may share a carrier. Make the
  needed portion findable and available to its consumer. The **boundary-distance law** says the
  further a fact must travel, the more explicit and retrievable it must be made.
- **Why.** Knowledge is scattered and perishable (#7). A fact kept only in one head at one moment is
  unavailable to another consumer. Persistence alone also fails if the later consumer cannot find or
  attend to the needed part; retrieval and presentation complete the existing handoff rather than
  establish a third bedrock boundary.
- **Governs.** `docs/snapshot/10-artifacts.md`, `docs/snapshot/13-appendices.md`.
- **Trace.** `docs-history-2026-07-30:sdlc-canvas/02-elements-flow-circuit-artifacts.md` §9.
- **Evidence.** Historical implementation contrast: `docs-history-2026-09-24:docs/agent-architecture/04_memory/episodic_memory.md`
  records durable action history alongside strategy reflections lost on restart;
  `docs-history-2026-09-24:docs/agent-architecture/04_memory/persistent_memory.md` records filesystem
  instructions that survive sessions but may be truncated when loaded.
  `docs-history-2026-09-24:docs/agent-architecture/06_orchestration/task_lifecycle.md` shows a plan,
  todos, and handover carried into a new implementation session. Storage and recall are separate
  obligations of the same handoff. [R-GATE-04](#r-gate-04) sets its accountable-unit attachment point.
- **Disposition of historical Q4.** A finite context window can prevent a stored fact from reaching a
  consumer. Treat this as a retrieval and presentation failure at an existing time or agent crossing;
  the cited examples do not establish an independent third boundary.

### <a id="r-artifact-02"></a>R-ARTIFACT-02 · Stone #5's two organs: the regression ratchet and rollback

- **Decision.** Change (#5) forces two distinct organs: a **regression ratchet** (lessons compiled into
  auto-firing checks, existence-gated) and **rollback** (graded within its reach, with a pre-execution
  gate for irreversible non-local effects). Other non-local harm or outside authority can still impose gates
  inside rollback's reach under [R-GATE-01](#r-gate-01).
- **Why.** A lesson that is not compiled into a check decays to folklore, and a change that cannot be
  undone can amplify an ordinary mistake into non-local loss. The two answer opposite halves of the same
  stone: the ratchet makes fixes stick, rollback keeps changes reversible.
- **Applies to.** `docs/snapshot/07-lifecycle.md`, `docs/snapshot/08-repertoires.md`,
  `docs/snapshot/10-artifacts.md`, `docs/snapshot/13-appendices.md`.
- **Evidence.** Historical support: `docs-history-2026-07-30:sdlc-canvas/03-mechanism-of-done.md`, §10.8.
  [R-ARTIFACT-03](#r-artifact-03) distinguishes the retained lesson from a governed test instance.

### <a id="r-artifact-03"></a>R-ARTIFACT-03 · Preserve lessons and govern test instances

- **Decision.** Retain each regression lesson and its rationale. A test instance may be replaced or
  retired when obsolete, redundant, or misleading. Record why, with a replacement guard or an
  explanation that the failure class no longer applies. Preserve any still-required guard.
- **Why.** Tests encode assumptions about a system that changes. Keeping an obsolete assertion can
  reward the wrong behavior, while redundant checks consume effort without retaining more knowledge.
  Preserving the failure, its significance, and the retirement reason keeps the learning available
  without requiring the suite's test count to grow forever.
- **Applies to.** `docs/snapshot/10-artifacts.md`, `docs/snapshot/13-appendices.md`.
- **Evidence.** Historical support: `docs-history-2026-09-24:ROADMAP.md#3-tier-e-model-repairs-phase-0`
  E8. The earlier regression argument is in [R-ARTIFACT-02](#r-artifact-02).
- **Superseded.** Every fixed failure must add a permanent test instance and none may be dropped.

### <a id="r-agentic-01"></a>R-AGENTIC-01 · The second-order tier prices autonomy; it does not forbid it

- **Decision.** Delegation raises two risks to `reliable`: shared checking errors and departure from
  the intended result. Require independent evidence, an accountable principal, and safeguards suited
  to the delegate. Persistent parties need suitable incentives; non-persistent inference needs
  containment and proxy-resistant evaluation as well as independent evidence. A human decides matters requiring
  human accountability, value judgment, or exceptional authority. `Resilient` refers to continued
  operation and recovery, not intent-faithfulness. An agent turn's stop condition alone does not
  establish acceptance of the work unit.
- **Why.** A human is one possible independent judge, but removing a human does not make every check
  correlated or every doer unfaithful. The two risks need different evidence and responses. Naming
  the human's authority role prevents a staffing choice from being mistaken for a proof of either
  independence or alignment. Model/tool loops can terminate on a final response without outcome
  evidence; approval and execution isolation govern different parts of exposure, and neither proves
  correctness.
- **Applies to.** `docs/snapshot/01-system-at-a-glance.md`,
  `docs/snapshot/02-destination-four-properties.md`, `docs/snapshot/04-atom-unit-control-loop.md`,
  `docs/snapshot/06-fractal.md`, `docs/snapshot/08-repertoires.md`,
  `docs/snapshot/12-agentic-sdlc.md`, `docs/snapshot/13-appendices.md`.
- **Evidence.** Historical support: `docs-history-2026-09-24:ROADMAP.md#3-tier-e-model-repairs-phase-0`
  E5 and E9; agent-turn mechanics: `docs-history-2026-09-24:docs/agent-architecture/01_core_loop/agentic_loop.md`
  and `docs-history-2026-09-24:docs/agent-architecture/01_core_loop/turn_lifecycle.md`;
  `docs-history-2026-09-24:docs/agent-architecture/06_orchestration/multi_agent_patterns.md`
  contrasts child-result handoffs with task bookkeeping that spawns no runtime. Neither is the
  parent's outcome check.
  `docs-history-2026-09-24:docs/agent-architecture/08_user_interaction/feedback_loops.md`
  describes per-action approval and a user-facing completion prompt; neither interaction alone
  establishes the independent work-unit check required here. The historical evaluation report at
  `docs-history-2026-09-24:docs/ai_agent_evaluation_metrics_kpis_2026.md#kpi-taxonomy`
  separates a run's terminal state from verified task success and tracks unsafe actions in the
  trajectory. Earlier second-order argument:
  `docs-history-2026-07-30:sdlc-canvas/01-bedrock-atom-fractal.md`.
- **Superseded.** The claim that removing the human drives independence and alignment to zero.

### <a id="r-method-01"></a>R-METHOD-01 · Present the model as a zoom lens

- **Decision.** The model starts with the whole system, then moves through its properties, pressures,
  loop, mechanisms, and applications. Inline charts and a glossary support that reading order.
- **Why.** A reader needs the relationships before the details: the overview establishes the terms,
  and each closer view explains how one part serves the whole. Keeping charts beside their explanations
  lets readers check the visual claim against the prose.
- **Governs.** `docs/snapshot/00-front-matter.md#how-to-read-this-document`,
  `docs/snapshot/13-appendices.md#appendix-a-glossary`.

### <a id="r-method-02"></a>R-METHOD-02 · Keep the reference model separate from concrete audits

- **Decision.** This repository states a current SDLC reference model. Auditing a particular stack
  against it is a separate exercise; the model does not claim a universally necessary lifecycle.
- **Why.** Starting from one existing setup can bias the model toward its present practices and hide
  missing controls. A separate audit can compare the setup with the model's stated assumptions,
  pressure tests, and work-unit acceptance criteria without treating the model as a proof.
- **Governs.** `docs/snapshot/00-front-matter.md#scope-assumptions-and-admission`.
- **Trace.** `docs-history-2026-07-30:sdlc-canvas/00-framing.md#resume-instructions-read-first-on-a-fresh-context` ·
  `docs-history-2026-07-30:HANDOFF.md#8-where-we-are-what-s-next`.

### <a id="r-method-04"></a>R-METHOD-04 · Cite tagged history by path and heading

- **Decision.** Historical references cite an annotated tag, path, and heading. Cross-references
  within current documents use stable section or decision IDs. Do not use line-number anchors or
  `file://` links.
- **Why.** Line offsets in the earlier roadmap and handoff drifted onto unrelated text after edits.
  A tagged path and heading identifies the intended passage without depending on that offset.
  Machine-specific `file://` links also fail for other readers.
- **Governs.** `docs/RATIONALE.md`, `README.md`, `scripts/verify-docs.mjs`.
- **Trace.** `docs-history-2026-07-30:REVIEW-ASSESSMENT-2026-07.md#reviewed-artifact-provenance-a-gap-not-a-record-rev-3`.
- **Enforced.** `scripts/verify-docs.mjs` fails on any `file://` link or pseudo-line reference in the
  snapshot or the ledger, and warns when a trace does not resolve inside a tag.
