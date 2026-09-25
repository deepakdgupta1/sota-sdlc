## Appendix A — Glossary

<sup>[↪ Why](#r-method-01)</sup>

Plain-language definitions of the recurring terms.

- **Stone.** An admitted pressure in the current hazard taxonomy, with a response not already forced
  by its other members. The current set has eight **first-order** stones (about the problem) and two
  **second-order** stones (about staffing). The count is pressure-tested, not proven exhaustive
  (Chapter 3). <sup>[↪ Why](#r-bedrock-01)</sup>
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
  B says the contracts hold across their input range (checked with an appropriate modality and
  monitored by `observe` where needed);
  C says the contract set would deliver the parent target even if perfectly honoured (design review,
  followed by integration and acceptance evidence). <sup>[↪ Why](#r-done-01)</sup>
- **Tightest-sufficient contract.** The narrowest practical input domain that admits every required
  expected and adverse case. Exhaustive checks or internal types can reduce input-range uncertainty
  without proving the specification or parent target (§9.2). <sup>[↪ Why](#r-done-04)</sup>
- **Leaf.** A target checkable without further decomposition. Its evidence can be deterministic,
  statistical, formal, simulated, human-experiential, runtime-assured, or a combination. Each modality
  leaves a stated residue and can be optimized as a proxy for the wrong outcome (§9).
  <sup>[↪ Why](#r-done-02)</sup>
- **Repertoire.** A set of cross-cutting responses invoked from `reflect`: the *resilience* repertoire
  (escalate, degrade, recover, roll back) and the *security* repertoire (authn/authz, sanitize, harden,
  red-team). <sup>[↪ Why](#r-repertoire-01) · [↪ Why](#r-repertoire-02)</sup>
- **Hard gate.** A constraint the work unit cannot locally waive, either because one violation is
  non-local or because outside authority imposes it (Chapter 11). <sup>[↪ Why](#r-gate-01)</sup>
- **Existence gate.** Required evidence must exist for its accountable work unit. Nested loops may
  share that evidence; a named seam gate still applies at the seam. <sup>[↪ Why](#r-gate-04)</sup>
- **Amplifier.** One of the three things that make a violation non-local: adversarial, irreversible,
  machinery-degrading. <sup>[↪ Why](#r-gate-01)</sup>
- **Artifact.** An explicit carrier of a work unit's target, result, or lesson for a later or different
  consumer. It must be retrievable when the handoff crosses time or agent boundaries; nested loops may
  share it (Chapter 10). <sup>[↪ Why](#r-artifact-01) · [↪ Why](#r-gate-04)</sup>
- **Boundary-distance law.** The further a fact must travel from producer to consumer, the more
  explicit and retrievable its carrier must be. `reflect`'s lesson commonly serves a later iteration
  (Chapter 10). <sup>[↪ Why](#r-artifact-01)</sup>
- **Base act.** `implement` (with `release` as its seam-analogue): the operand the loop controls — the
  plant, not the controller. It defends no stone by design; the one *licensed exception* to the
  Chapter 3 self-test (§7). <sup>[↪ Why](#r-loop-05)</sup>
- **Schedule bet.** `plan`'s conditional conjecture that task estimates hold, execution conditions
  remain within the forecast, and the selected tasks deliver the intended release by the date.
  Critical-path feasibility checks the arrangement, not those premises. Baseline existence is gated;
  dates are graded (§7.1). <sup>[↪ Why](#r-schedule-01) · [↪ Why](#r-gate-03)</sup>
- **Regression ratchet.** Retained lessons and rationale from fixed failures, with re-runnable checks
  for relevant failure classes (§10.1). Obsolete, redundant, or misleading test instances can retire
  with a recorded reason while required guards remain. Existence gated; coverage graded.
  <sup>[↪ Why](#r-artifact-03)</sup>
- **Reversible envelope (rollback's reach).** The effects `roll back` can actually restore. Beyond
  that reach, assess non-local irreversible harm before execution. Inside it, other non-local or
  outside-authority gates may still apply (§10.1). <sup>[↪ Why](#r-artifact-02) · [↪ Why](#r-gate-01)</sup>
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
  persistent party can optimise its own payoff over the target even when intent is known
  (misaligned — not hostile like #8, not mistaken like #4). Its incentive branch calls for **alignment**
  (Chapter 12). <sup>[↪ Why](#r-bedrock-04)</sup>
- **Alignment.** For persistent parties, outcome-linked incentives and accountability connect their
  payoff to the intended result. <sup>[↪ Why](#r-bedrock-04)</sup> For non-persistent inference, use
  capability containment, proxy-resistant evaluation, and independent evidence; the model assumes no
  continuing payoff that task-level rewards can shape. <sup>[↪ Why](#r-bedrock-06)</sup>
- **Bundling rule.** The self-test's third direction compares forced responses to detect duplicate
  pressure descriptions. A shared response supports bundling; distinct responses support separation.
  It is a **self-test heuristic, not an identity criterion**, because pressures and responses have a
  many-to-many relation. The rule cannot establish a closed count. <sup>[↪ Why](#r-bedrock-02)</sup>
- **Admission criterion.** What earns a pressure a seat in the bedrock: it is a brute fact rather than a
  contingent choice, it forces a response the existing stones do not already force, and it survives the
  three-direction self-test. This — not a proof of exhaustiveness — is what the bedrock rests on, and
  what makes a candidate eleventh stone admissible rather than excluded. <sup>[↪ Why](#r-bedrock-01)</sup>
- **Ouroboros / evolve.** The product-level feedback edge that feeds run-time learning back into the
  target, turning the loop into an improving spiral. <sup>[↪ Why](#r-apex-01)</sup>

## Appendix B — The stones-to-responses matrix

<sup>[↪ Why](#r-bedrock-01)</sup>

The current stone-to-response mapping.

| Stone | Fact | Forced response(s) | Property served |
|---|---|---|---|
| 1 | intent is hidden | `specify` (elicit the root target) | reliable |
| 2 | unbounded vs. finite | `scope`, `decide` | predictable |
| 3 | complexity > one step | `design` (decompose + composition hypothesis) | all four, at every seam |
| 4 | humans & models err | `verify`, `analyze` | reliable |
| 5 | reality keeps changing | the **regression ratchet** (the `reflect`→`verify` bridge; required evidence gated) + **`roll back`** (reduces irreversibility risk within its reach) — §10.1; version / integrate | resilient — the *over-time* clause |
| 6 | reality is uncertain | `observe` (telemetry); `degrade`, `recover` | resilient |
| 7 | knowledge distributed & perishable | **artifacts** (persist, make explicit, and surface the needed part across a handoff) | carries required targets, results, and lessons |
| 8 | adversarial actors | security repertoire (authn/authz, sanitize, harden, red-team) | secure |
| 9 | reflexivity — checker may share the doer's error *(delegated only)* | independent-enough evidence and review with different failure modes | protects reliable |
| 10 | incentive-divergence and the non-persistent inference branch *(delegated only)* | persistent parties: incentives and accountability; inference: capability containment, proxy-resistant evaluation, independent evidence | protects reliable |

> Three lifecycle boxes are deliberately **not** rows. `plan` is `scope`+`specify` projected onto the
> time axis (§7.1) and `release` is the build→operate seam whose governance *is* the stone-#5 machinery
> (§10.1) — projections and seams, not stone-responses. `implement` is the **base act** — the operand
> the loop controls — the one licensed exception to the self-test (§7).
