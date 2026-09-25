## Rationale ledger

*Why each contested decision in this snapshot has its current shape.* A decision is **contested** if it
was derived against alternatives, disputed, or retracted — not merely written down. Explanatory prose
inherits the nearest enclosing entry; the ledger records decisions, not sentences.

**Reading an entry.** *Decision* — what the snapshot now says. *Why* — the argument that forces it.
*Governs* — where it applies. *Trace* — where its history lives. *Evidence* — external facts it rests
on, with access dates. *Superseded* — the alternative it replaced, when that is what makes the current
shape intelligible.

**Two kinds of trace.** Where the reasoning is still live, entries cite the **canvas** by path — it is a
current document, not a historical one. Where the reasoning lived in a document absorbed on 2026-07-30,
entries cite the annotated tag: `docs-history-2026-07-30:<path>#<heading>`. Retrieve either with
`git show docs-history-2026-07-30:<path>`. Never a line number — see [R-METHOD-04](#r-method-04).

Rejected ideas appear only where they explain why a surviving decision has its current shape.

---

### <a id="r-apex-01"></a>R-APEX-01 · Four properties, in two families

- **Decision.** The apex is exactly four properties in two families: **point-properties** measured at a
  single context (`reliable`, `predictable`) and **envelope-properties** measured over context-hardness ×
  time (`resilient`, `secure`).
- **Why.** `reliable` and `predictable` are independent axes, proven by two thought experiments — a
  correct-but-unforeseeable setup is reliable and not predictable; a foreseeable-but-wrong setup is the
  reverse. Neither can absorb the other, so both get a seat.
- **Governs.** `docs/snapshot/02-destination-four-properties.md`, `docs/snapshot/01-system-at-a-glance.md`.
- **Trace.** `sdlc-canvas/00-framing.md` §2 — the destination.

### <a id="r-apex-02"></a>R-APEX-02 · `secure` sits beside `resilient`, not under it

- **Decision.** `secure` takes a fourth seat *beside* `resilient` rather than a slot beneath it.
- **Why.** Both are envelopes over context-hardness, but stone #8 splits that axis **by the source of the
  hardness**: reality *samples* the context space blindly (#5, #6), while an adversary *searches* it for
  the worst case. The statistical machinery that manufactures resilience — redundancy, retries, graceful
  degrade — actively fails against a directed opponent, because retries feed a denial-of-service. Same
  shape, different opponent, and a distinct security repertoire is therefore forced.
- **Governs.** `docs/snapshot/02-destination-four-properties.md`,
  `docs/snapshot/08-repertoires.md`.
- **Trace.** `sdlc-canvas/00-framing.md` §2.
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
- **Governs.** `docs/snapshot/03-bedrock.md`, `docs/snapshot/13-appendices.md#appendix-b-the-stones-to-responses-matrix`.
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
  E9. This is a design assumption for the non-persistent branch, not a claim about every agent system.
- **Superseded.** Treating task-level incentives as the response to non-persistent inference.

### <a id="r-bedrock-05"></a>R-BEDROCK-05 · Cost-asymmetry is a derived law, not a stone

- **Decision.** *Attack is cheaper than defence* is a **derived law**, not a bedrock stone.
- **Why.** It decomposes without residue into #8 (an adversary searches) plus #3 (the system exceeds one
  mind, so there are many seams and one undefended seam suffices). A pressure that fully decomposes into
  existing stones fails the admission criterion.
- **Governs.** `docs/snapshot/08-repertoires.md`, `docs/snapshot/03-bedrock.md`.
- **Trace.** `sdlc-canvas/01-bedrock-atom-fractal.md` (T6, iteration 35) · `sdlc-canvas/05-laws-and-insights.md`.

### <a id="r-loop-01"></a>R-LOOP-01 · One atom: `define → do → check → reflect`

- **Decision.** The stones force exactly one atom — `define → do → check → reflect ↺` — where `reflect`
  decomposes into **analyze** (frame and root-cause) then **decide** (*accept* a known issue ·
  *re-target* · *escalate*).
- **Why.** Each beat is the forced response to a stone that cannot be answered elsewhere: intent is
  hidden, so the target must be made explicit (`define`); we err, so the result must be tested against
  the target (`check`); and a failed check is uninformative unless something frames *why* before the
  loop turns again (`reflect`).
- **Governs.** `docs/snapshot/04-atom-unit-control-loop.md`, `docs/snapshot/05-elements.md`.
- **Trace.** `sdlc-canvas/01-bedrock-atom-fractal.md` §4.

### <a id="r-loop-02"></a>R-LOOP-02 · `reflect` is the loop's only backward channel

- **Decision.** `reflect` is a forced MUST-HAVE beat and the loop's **only** backward channel; its
  artifact is existence-gated.
- **Why.** Every other beat moves the work forward. Without `reflect`, a failed `check` can only repeat
  the same attempt, so the loop cannot converge — it oscillates. Convergence is what `reliable`
  *is*, so removing `reflect` removes the property.
- **Governs.** `docs/snapshot/04-atom-unit-control-loop.md`, `docs/snapshot/05-elements.md`,
  `docs/snapshot/10-artifacts.md`.
- **Trace.** `sdlc-canvas/03-mechanism-of-done.md` §10.5.

### <a id="r-loop-03"></a>R-LOOP-03 · `observe` must own a real sensor

- **Decision.** `observe` is a forced element, and telemetry is both a **detector** and `analyze`'s
  actual operand — not a reporting nicety.
- **Why.** `check` covers what was anticipated at `define` time. Stones #5 and #6 guarantee that reality
  supplies conditions nobody anticipated, so a loop with no sensor cannot discover them, and `analyze`
  has nothing to reason over. The sensor is what makes the envelope-properties observable at all.
- **Governs.** `docs/snapshot/05-elements.md`, `docs/snapshot/11-hard-gates-vs-graded.md`.
- **Trace.** `sdlc-canvas/03-mechanism-of-done.md` §10.6.

### <a id="r-loop-04"></a>R-LOOP-04 · Ceremony is proportional insurance

- **Decision.** The loop is a **fractal**: every element is itself the same loop, and a beat **collapses
  toward bare `do`** wherever its stone is absent. A named seam gate and required evidence at the
  accountable work unit remain in force.
- **Why.** Ceremony is insurance against a specific hazard. Where the hazard is absent the premium buys
  nothing, and a model that demanded full ceremony everywhere would be self-refuting: it would spend the
  finite resources that stone #2 says are scarce. The collapse rule is what makes the ideal *affordable*
  without making it optional where it matters.
- **Applies to.** `docs/snapshot/06-fractal.md`.
- **Evidence.** Historical support: `docs-history-2026-07-30:sdlc-canvas/03-mechanism-of-done.md`
  §10.7, the inward base case. [R-GATE-04](#r-gate-04) sets the gate's attachment point.

### <a id="r-loop-05"></a>R-LOOP-05 · `implement` is the base act, `release` is a seam

- **Decision.** `implement` is the **base act** — the operand the loop controls — and the one licensed
  exception to the self-test. `release` is the build→operate **seam**, governed by the stone-#5
  machinery. Neither is a stone-response, so neither is a row in the stones matrix; `plan` likewise is
  `scope`+`specify` projected onto the time axis.
- **Why.** The self-test asks which stone forces each element. Applied to `implement` it has no answer,
  because `implement` is not a *response* to a hazard — it is the thing the responses are about. Marking
  it as the licensed exception keeps the self-test sharp everywhere else.
- **Governs.** `docs/snapshot/07-lifecycle.md`, `docs/snapshot/13-appendices.md#appendix-b-the-stones-to-responses-matrix`.
- **Trace.** `sdlc-canvas/03-mechanism-of-done.md` §10.10.

### <a id="r-unit-01"></a>R-UNIT-01 · A work unit has a boundary and an acceptance vector

- **Decision.** Each accountable work unit declares a boundary (scope, exclusions, delegated authority,
  and budget) and an acceptance vector (the four apex properties plus named target qualities). Child
  targets project the constraints that apply to their part without silently relaxing the parent.
- **Why.** The boundary says what work and authority the unit owns; the vector says how its result will
  be accepted. Mixing scope into a quality list hides exclusions and budget while omitting `secure`.
  Separating the two also makes propagation precise: a child inherits applicable constraints, not an
  identical set of targets regardless of its role.
- **Applies to.** `docs/snapshot/09-mechanism-of-done.md`, `docs/snapshot/13-appendices.md`.
- **Evidence.** Historical support: `docs-history-2026-09-24:ROADMAP.md#3-tier-e-model-repairs-phase-0`
  E1. This records the accepted repair, not the original motivation for every target quality.
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
- **Applies to.** `docs/snapshot/09-mechanism-of-done.md`, `docs/snapshot/13-appendices.md`.
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
  `docs/snapshot/06-fractal.md`, and `docs/snapshot/13-appendices.md`.
- **Evidence.** Historical support: `docs-history-2026-09-24:ROADMAP.md#3-tier-e-model-repairs-phase-0`
  E3; prior harm rule: `docs-history-2026-07-30:sdlc-canvas/03-mechanism-of-done.md`.
- **Superseded.** "Hard gate iff non-local" as an exhaustive rule, and "secure is hard wholesale" as
  one untestable gate.

### <a id="r-gate-02"></a>R-GATE-02 · Gate the per-seam binary, grade the aggregate

- **Decision.** Gate a named seam's signal and detection bound when silent failure is non-local or
  outside authority requires evidence. Other coverage remains proportional to risk and may collapse
  to zero on a fully modeled, reversible, local path. Separate debug records from audit records.
  Specify sampling, redaction, cost limits, and retention without dropping required evidence.
- **Why.** Richer logs elsewhere cannot replace a required signal at the seam where harm occurs.
  That does not make every silent local failure non-local. Continuous emission on every path would
  contradict the collapse rule and consume resources without a demonstrated detection need. Debug
  sampling can serve diagnosis; audit evidence must preserve the required accountable events. Neither
  an aggregate coverage score nor the presence of a log proves the detection contract is met.
- **Applies to.** `docs/snapshot/11-hard-gates-vs-graded.md`, `docs/snapshot/13-appendices.md`.
- **Evidence.** Historical support: `docs-history-2026-09-24:ROADMAP.md#3-tier-e-model-repairs-phase-0`
  E7; earlier seam argument: `docs-history-2026-07-30:sdlc-canvas/03-mechanism-of-done.md`, §10.9.
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
- **Applies to.** `docs/snapshot/11-hard-gates-vs-graded.md`, `docs/snapshot/10-artifacts.md`.
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
- **Applies to.** `docs/snapshot/06-fractal.md`, `docs/snapshot/11-hard-gates-vs-graded.md`,
  `docs/snapshot/13-appendices.md`.
- **Evidence.** Historical support: `docs-history-2026-09-24:ROADMAP.md#3-tier-e-model-repairs-phase-0`
  E4 and Q7. The accountable work-unit boundary is [R-UNIT-01](#r-unit-01).
- **Superseded.** The reading of the convergent law that gated an artifact at every fractal node.

### <a id="r-artifact-01"></a>R-ARTIFACT-01 · Stone #7 forces artifacts, and distance sets their cost

- **Decision.** Artifacts are the forced, persistent carriers of a loop's target, result and lesson
  across the **time** and **agent** boundaries. The **boundary-distance law** says the further a fact
  must travel, the more explicit it must be made.
- **Why.** Knowledge is scattered and perishable (#7). A fact that stays in one head at one moment is
  unavailable to the next loop, so the response cannot be a practice — it must be a *thing* that
  outlives the beat that produced it.
- **Governs.** `docs/snapshot/10-artifacts.md`.
- **Trace.** `sdlc-canvas/02-elements-flow-circuit-artifacts.md` §9.
- **Evidence.** Historical implementation contrast: `docs-history-2026-09-24:docs/agent-architecture/04_memory/episodic_memory.md`
  records durable action history alongside strategy reflections lost on restart;
  `docs-history-2026-09-24:docs/agent-architecture/04_memory/persistent_memory.md` records filesystem
  instructions that survive sessions but may be truncated when loaded. Storage and recall are separate
  concerns; these examples do not settle the attention-boundary question below.
- **Open.** Whether the agent context window is a *third* boundary — an **attention** boundary, where a
  fact is explicit and even in memory but cannot be attended to — is Q4 in `ROADMAP.md` §8.

### <a id="r-artifact-02"></a>R-ARTIFACT-02 · Stone #5's two organs: the regression ratchet and rollback

- **Decision.** Change (#5) forces two distinct organs: a **regression ratchet** (lessons compiled into
  auto-firing checks, existence-gated) and **rollback** (graded, with a hard gate at its irreversible
  limit).
- **Why.** A lesson that is not compiled into a check decays to folklore, and a change that cannot be
  undone converts an ordinary mistake into a non-local one. The two answer opposite halves of the same
  stone: the ratchet makes fixes stick, rollback keeps changes reversible.
- **Applies to.** `docs/snapshot/10-artifacts.md`, `docs/snapshot/13-appendices.md`.
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
  evidence; an authorization decision bounds effects rather than proving correctness.
- **Applies to.** `docs/snapshot/12-agentic-sdlc.md`, `docs/snapshot/04-atom-unit-control-loop.md`,
  `docs/snapshot/06-fractal.md`, `docs/snapshot/08-repertoires.md`, `docs/snapshot/13-appendices.md`.
- **Evidence.** Historical support: `docs-history-2026-09-24:ROADMAP.md#3-tier-e-model-repairs-phase-0`
  E5 and E9; agent-turn mechanics: `docs-history-2026-09-24:docs/agent-architecture/01_core_loop/agentic_loop.md`
  and `docs-history-2026-09-24:docs/agent-architecture/01_core_loop/turn_lifecycle.md`; earlier
  second-order argument: `docs-history-2026-07-30:sdlc-canvas/01-bedrock-atom-fractal.md`.
- **Superseded.** The claim that removing the human drives independence and alignment to zero.

### <a id="r-method-01"></a>R-METHOD-01 · Four sources of truth, with declared precedence

- **Decision.** The repository has exactly four normative documents — canvas (reasoning), snapshot
  (presentation), ledger (justification), roadmap (forward work) — and precedence is declared in the
  snapshot's front matter and nowhere else.
- **Why.** Before 2026-07-30 there were seven documents and no stated precedence, so a disagreement
  between any two had no settled answer and each new document had to re-assert its own authority. Four
  roles that do not overlap, plus one declaration of precedence, removes the ambiguity without
  collapsing genuinely different kinds of content into one file.
- **Governs.** `docs/snapshot/00-front-matter.md`, `docs/snapshot/13-appendices.md#appendix-d-working-with-this-repository`.
- **Trace.** `docs-history-2026-07-30:HANDOFF.md#2-file-map` — the seven-document map this replaces.

### <a id="r-method-02"></a>R-METHOD-02 · The ideal stays uncontaminated: the concrete audit is descoped

- **Decision.** This derivation produces the **ideal MUST-HAVE** lifecycle — what any such lifecycle is
  logically forced to contain. Auditing a *concrete* stack against the ideal was descoped at iteration
  28 and is a separate exercise.
- **Why.** Deriving the ideal while looking at an existing setup biases the derivation toward what that
  setup already has: present practices get rationalised as forced, and absent ones get quietly omitted.
  Keeping the audit out is what lets the ideal be used later as an actual measuring instrument.
- **Governs.** `docs/snapshot/00-front-matter.md`, `docs/snapshot/13-appendices.md#appendix-c-the-snapshot-boundary-and-the-rationale-conventions`.
- **Trace.** `sdlc-canvas/00-framing.md#-resume-instructions-read-first-on-a-fresh-context` ·
  `docs-history-2026-07-30:HANDOFF.md#8-where-we-are-what-s-next`.
- **Note.** The descoped audit is **not** a numbered canvas track. It was removed by decision, so it
  cannot be counted as track residue; it now sits in `ROADMAP.md` as Phase 2, run against our own
  repositories.

### <a id="r-method-03"></a>R-METHOD-03 · Specs are produced here; the factory is built elsewhere

- **Decision.** The Tier D control plane is **specified** in this repository and **implemented in a
  separate build repository**. Tier D does not enter the canvas as bedrock derivation.
- **Why.** The canvas derives what is logically forced; a control plane is a contingent engineering
  choice about a concrete stack. Letting implementation work into the canvas would contaminate the ideal
  with the accidents of one toolchain — the same failure [R-METHOD-02](#r-method-02) guards against. A
  spec is done when a competent engineer could build it without asking a question, not when it reads
  well.
- **Governs.** `ROADMAP.md` §1, §4.
- **Trace.** `sdlc-canvas/06-iteration-log.md` iteration 28 ·
  `docs-history-2026-07-30:HANDOFF.md#8-where-we-are-what-s-next`.

### <a id="r-method-04"></a>R-METHOD-04 · Cite a tag and a heading, never a line number

- **Decision.** Historical references cite `docs-history-2026-07-30:<path>#<heading>`. Cross-references
  within live documents cite a section or row identifier. Line-number anchors are not used, and
  `file://` links are forbidden outright.
- **Why.** Line anchors into a living file rot on the first insertion — and this repository has already
  been bitten twice: `ROADMAP.md:259`, cited for item C8, had drifted onto the A3 row, and
  `ROADMAP.md:244`, cited as the B1 row, had drifted into the middle of a C3b bullet. A `HANDOFF.md:127`
  citation of the method section likewise pointed two lines above the heading it meant. `file://` links
  additionally encode one machine's directory layout, so they are dead for every other reader.
- **Governs.** `docs/RATIONALE.md`, `docs/snapshot/13-appendices.md#appendix-c-the-snapshot-boundary-and-the-rationale-conventions`,
  `scripts/verify-docs.mjs`.
- **Trace.** `docs-history-2026-07-30:REVIEW-ASSESSMENT-2026-07.md#reviewed-artifact-provenance-a-gap-not-a-record-rev-3`.
- **Enforced.** `scripts/verify-docs.mjs` fails on any `file://` link or pseudo-line reference in the
  snapshot or the ledger, and warns when a trace does not resolve inside the tag.

### <a id="r-method-05"></a>R-METHOD-05 · What was absorbed on 2026-07-30, and what was verified first

- **Decision.** Three documents were absorbed into the four survivors and removed from the active tree:
  `HANDOFF.md`, `sdlc-evolution-ideas.md`, and `REVIEW-ASSESSMENT-2026-07.md`. All three remain complete
  inside the tag.
- **Why.** Each had become a second answer to a question another document already answered — the
  handoff duplicated the method and the plan, the idea catalogue duplicated the roadmap's traceability,
  and the review assessment was a rationale record with no home for rationale. What was *not*
  duplicated was moved rather than dropped, and each drop was verified before it was made:
  - The **`pipeline-graph` schema** existed only in the handoff. It is now Appendix D, verbatim —
    without it all 29 charts in the repository become unmaintainable.
  - The handoff's method section is now the canvas's `▶ RESUME INSTRUCTIONS`, which it already named as
    authoritative.
  - All **24** idea identifiers (A1–A4, B1–B8, C1–C12) were confirmed present in `ROADMAP.md` §6 before
    the catalogue was retired — the set difference was empty, so no item lost its disposition.
  - All **five** open structural questions were confirmed carried into `ROADMAP.md` §8 as Q1–Q5.
  - The handoff's Phase-0 dependency order was byte-identical to `ROADMAP.md` §10; its track history was
    a derived summary of the canvas register, which it named as authoritative; its model summary was
    covered by Chapter 1 and the chapters it pointed into. Those were dropped as duplicates.
- **Governs.** the whole repository.
- **Trace.** `docs-history-2026-07-30:HANDOFF.md#1-read-these-first-in-order` ·
  `docs-history-2026-07-30:sdlc-evolution-ideas.md#open-structural-questions` ·
  `docs-history-2026-07-30:REVIEW-ASSESSMENT-2026-07.md#5-bottom-line`.

### <a id="r-evidence-01"></a>R-EVIDENCE-01 · Dated EU AI Act status

- **Decision.** No legal-status prose appears in the snapshot. The regulatory position is recorded here,
  with a verification date, rather than as an enduring part of the model. An outside legal obligation
  may still create a gate under [R-GATE-01](#r-gate-01).
- **Why.** Legal status decays faster than anything else in this repository, and it decayed twice inside
  a single month of editing. A model whose text asserts what a statute currently requires becomes wrong
  without anyone touching it. The durable claims — that exogenous authority can create a
  non-compensatory gate — belong to the gate calculus; the dates belong in a dated ledger entry.
- **Evidence.** [Regulation (EU) 2026/1744](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:32026R1744),
  *Official Journal* 24 July 2026, entered into force 27 July 2026 and replaced Article 4 with a duty
  to support AI literacy. Article 50 obligations apply from 2 August 2026 where their conditions are
  met. Providers whose systems were on the market before that date have until 2 December 2026 for the
  Article 50(2) marking requirement. The amended Article 113 moves specified Annex III high-risk
  obligations to 2 December 2027 and specified Annex I obligations to 2 August 2028. Classification
  depends on the system's intended use; a coding assistant is not automatically high-risk. Verified
  against the primary text 2026-09-25. A specific conformance decision still requires checking the
  applicable provisions and facts of the use case.
- **Trace.** `docs-history-2026-07-30:REVIEW-ASSESSMENT-2026-07.md#4-verification-log` rows 1–4 ·
  `docs-history-2026-07-30:REVIEW-ASSESSMENT-2026-07.md#3-errors-in-our-own-documents-that-the-review-did-not-catch` R1–R2.
- **Superseded.** The Act does not classify all autonomous coding agents as high-risk. The Omnibus is
  in force, replaces Article 4, and changes the applicable dates. Earlier claims that it was pending or
  left Articles 4 and 50 untouched were wrong. Employment-related uses, such as evaluating workers,
  require their own Annex III assessment.

### <a id="r-evidence-02"></a>R-EVIDENCE-02 · CVE-2026-25253 and its token-exfiltration mechanism

- **Decision.** CVE-2026-25253 is a code vulnerability in the Control UI's handling of `gatewayUrl`.
  It does not show a sandbox escape or a malicious skill package.
- **Why.** The mechanism matters for routing: a client-side URL-handling flaw argues for input
  validation and egress control at the client boundary. It cannot support a claim about workload
  isolation failure.
- **Evidence.** The [NVD record](https://nvd.nist.gov/vuln/detail/CVE-2026-25253) describes OpenClaw
  before `2026.1.29` reading `gatewayUrl` from a query string and automatically opening a WebSocket
  connection that sends a token. The [vendor advisory](https://github.com/openclaw/openclaw/security/advisories/GHSA-g8p2-7wf7-98mq)
  confirms token exfiltration through the Control UI and a fix in `2026.1.29`. Verified 2026-09-25.
- **Trace.** `docs-history-2026-07-30:REVIEW-ASSESSMENT-2026-07.md#4-verification-log` row 13 ·
  `docs-history-2026-07-30:REVIEW-ASSESSMENT-2026-07.md#3-errors-in-our-own-documents-that-the-review-did-not-catch` R3.
- **Superseded.** Two claims, in sequence, and the second was worse than the first: originally "a
  malicious skill package, not a code vulnerability"; then, correcting it, "a Docker sandbox escape via a
  crafted skill package, patched in v2.3.1". The second mechanism was **invented**, unsourced, and had
  already propagated into a P1 justification before it was caught. The record and vendor advisory
  support the actual mechanism; a plausible reconstruction is not a source. "First agentic CVE" is
  also dropped, absent a defensible definition.

### <a id="r-evidence-03"></a>R-EVIDENCE-03 · NIST SP 800-218A does not cover deployment or operation

- **Decision.** SP 800-218A is not citable as converged guidance for the *operation* of an agentic
  lifecycle.
- **Why.** Its own scope statement excludes the phase where an agentic control plane does most of its
  work, so citing it there would misrepresent the state of published guidance — in a document arguing
  for evidentiary discipline.
- **Evidence.** NIST SP 800-218A §1.2, p. 2 (primary text read): scope is "AI model development… as
  well as incorporating and integrating AI models into other software", and "practices for the
  **deployment and operation** of AI systems with AI models **are out of scope**". Accessed 2026-07-29.
- **Trace.** `docs-history-2026-07-30:REVIEW-ASSESSMENT-2026-07.md#4-verification-log` row 9 ·
  `docs-history-2026-07-30:REVIEW-ASSESSMENT-2026-07.md#1-disagreements` D9.

### <a id="r-evidence-04"></a>R-EVIDENCE-04 · Specification construction is *a* bottleneck, and proof is expensive

- **Decision.** Formal methods are positioned as a **selective** modality for the highest-tier work, not
  a general answer. Specification construction is *a* central bottleneck — not *the* central one.
- **Why.** The cost is empirical and large, and it falls on exactly the artifact that
  [R-DONE-02](#r-done-02) says still carries the blind spot. That combination makes proof a targeted
  instrument rather than a strategy.
- **Evidence.** arXiv 2511.17330, *Agentic Verification of Software Systems* — full text, not abstract:
  formal capture "requires significant efforts in manually annotating specifications and crafting loop
  invariants", and reports **seL4 ≈ 22 person-years** and **CompCert ≈ 6 person-years and
  100,000 proof lines**. Verified in the [paper's introduction](https://arxiv.org/html/2511.17330v3)
  2026-09-25.
- **Trace.** `docs-history-2026-07-30:REVIEW-ASSESSMENT-2026-07.md#4-verification-log` row 11 ·
  `docs-history-2026-07-30:REVIEW-ASSESSMENT-2026-07.md#1-disagreements` D10.
- **Superseded.** An earlier round judged this paper *unsupportive* by reading only its **abstract**;
  the supporting figures are in the introduction. Recorded because the failure is mechanical and
  therefore preventable: read the introduction or the full text, never the abstract alone.

### <a id="r-evidence-05"></a>R-EVIDENCE-05 · Benchmark-passing work is not merge-ready work

- **Decision.** Test-passing is treated as a *proxy* that must be checked against acceptance, never as
  acceptance itself — the empirical basis for [R-DONE-01](#r-done-01) and for the failure-routing rule
  that a green check is not a true leaf.
- **Why.** Two independent measurements show a large gap between "tests pass" and "a maintainer would
  merge this", which is precisely the Goodhart surface the mechanism of Done is built to survive.
- **Evidence.** (a) METR, *Many SWE-Bench-passing PRs would not be merged into main* (10 Mar 2026) — 296
  PRs, 4 recruited maintainers, 3 repositories, 95 tasks; roughly half of test-passing PRs judged not
  mergeable, a 24.2 pp gap; and ~68% of *human* golden patches were re-accepted. Because the
  re-reviewers were recruited rather than the original mergers, the figure measures review-pipeline
  noise, **not** a 32% defect rate. (b) OpenAI, *Separating signal from noise in coding evaluations* —
  of 731 SWE-Bench Pro tasks, the pipeline flagged **200 (27.4%)** and a human campaign **249 (34.1%)**
  as broken; pass rates moved 23.3% → 80.3% in eight months. Both accessed 2026-07-29 (openai.com 403s
  to direct fetch; confirmed via verbatim quotation and multiple independent write-ups).
- **Trace.** `docs-history-2026-07-30:REVIEW-ASSESSMENT-2026-07.md#4-verification-log` rows 6–7 ·
  `docs-history-2026-07-30:REVIEW-ASSESSMENT-2026-07.md#1-disagreements` D11.
- **Superseded.** "OpenAI retracted SWE-Bench Pro." It did not: it withdrew its *recommendation* that
  the community use the benchmark. OpenAI does not own SWE-Bench Pro — Scale AI does — and could not
  withdraw it.

### <a id="r-evidence-06"></a>R-EVIDENCE-06 · Agentic entropy is evidenced as a pressure, not as a stone

- **Decision.** Quality decay across long agentic edit histories is accepted as a **real pressure** and
  routed to priority work. It is **not** admitted as an eleventh stone.
- **Why.** Evidence of a pressure is not evidence of irreducibility. Under the admission criterion the
  question is whether it forces a response that #4, #7 and #9 do not already force, and that has not
  been shown — it is Q1 in `ROADMAP.md` §8, still open.
- **Evidence.** arXiv 2603.03823 (SWE-CI) — 100 tasks over 233-day / 71-commit histories, 20 models;
  quality decay over repository evolution confirmed. Accessed 2026-07-29. Note it is a benchmark
  **preprint**. Also OWASP GenAI Security Project, Agentic Top 10 (announced 9 Dec 2025) — **ASI08 =
  Cascading Failures**, the citation behind the cascading-failure item. Accessed 2026-07-29.
- **Trace.** `docs-history-2026-07-30:REVIEW-ASSESSMENT-2026-07.md#4-verification-log` rows 5, 14 ·
  `docs-history-2026-07-30:sdlc-evolution-ideas.md#a4-agentic-entropy-the-eleventh-stone`.

### <a id="r-evidence-07"></a>R-EVIDENCE-07 · A control counts as handled only when its config has been read

- **Decision.** No claim that an existing tool already handles a hazard survives here without a config
  read *in the round the claim is made*. Specifically: the local LiteLLM proxy does **not** enforce a
  cost ceiling, so cost containment remains unbuilt work.
- **Why.** The presumption that the environment supplies a control is how a gap becomes invisible: the
  claim reads as coverage, nobody re-checks it, and the roadmap deprioritises the item. This one was
  falsified only when the config was actually opened.
- **Evidence.** `~/.litellm-proxy/config.yaml` — the file the launchd job loads (local, unversioned):
  allow-list present; RPM limit present; concurrency limit present; routing partial (no fallbacks, no
  complexity-based routing); **cost ceiling absent and unenforceable as configured** —
  `store_model_in_db: False` and no `database_url`, so spend tracking cannot run. Read 2026-07-29.
- **Trace.** `docs-history-2026-07-30:REVIEW-ASSESSMENT-2026-07.md#4-verification-log` row 15 ·
  `docs-history-2026-07-30:REVIEW-ASSESSMENT-2026-07.md#1-disagreements` D14.

### <a id="r-evidence-08"></a>R-EVIDENCE-08 · The reviewed artifact was never retained — a live defect

- **Decision.** The July-2026 external review that this ledger's evidence entries adjudicate **is not
  stored anywhere in this repository** — no copy, no URL, no content hash, no author, no receipt date.
  Every characterisation of what that review "treats as missing" or "proposes" is therefore an
  assertion no future reader can verify. Entries above are worded to rest on *our* verified sources
  rather than on the review's claims about itself.
- **Why.** This is recorded rather than quietly dropped because it is the exact failure the roadmap
  exists to prevent, committed in the document arguing for it: an evidence graph whose principal input
  is unretained. It already caused two disagreements to be manufactured against positions that may
  never have been held, and there is no way to know whether it happened elsewhere.
- **Rule adopted.** A claim about an artifact you cannot produce is not a finding. Preserve or hash the
  artifact, or narrow the claim to what you actually quoted.
- **Governs.** every `R-EVIDENCE-*` entry above.
- **Trace.** `docs-history-2026-07-30:REVIEW-ASSESSMENT-2026-07.md#reviewed-artifact-provenance-a-gap-not-a-record-rev-3`.
