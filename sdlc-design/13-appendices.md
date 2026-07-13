## Appendix A — Glossary

Plain-language definitions of the recurring terms.

- **Stone.** A brute, unavoidable fact about reality that makes software hard and *forces* a specific
  response. There are ten — eight **first-order** (about the problem) plus a two-seat **second-order
  tier** (about who staffs the loop) (Chapter 3).
- **The loop / the atom.** The single feedback cycle `define → do → check → reflect ↺` that everything
  reduces to (Chapter 4).
- **Beat.** One of the four scale-invariant phases of the loop (define, do, check, reflect).
- **Element.** The outermost loop's concrete staffing of a beat (specify, scope, design, implement,
  verify, observe, analyze, decide).
- **Fractal.** The property that the loop repeats, unchanged in shape, both up across scope and down
  into each element (Chapter 6).
- **Point-property.** A property measured at a single task in a single context: *reliable*, *predictable*.
- **Envelope-property.** A property measured across the range of contexts over time: *resilient* (vs.
  random hardship), *secure* (vs. a directed adversary).
- **Graded target.** A "done" expressed as a threshold on a quality range, checked by measurement — as
  opposed to a yes/no.
- **Proxy.** A measurable stand-in for a quality you can't measure directly (coverage for "well-tested,"
  latency for "feels fast"). Proxies can be gamed — the gap between proxy and intent is where defects
  hide.
- **Composition hypothesis.** The bet `design` makes that "if every part is done, the whole is done"
  — `(∧Lᵢ) ⟹ P`. Falsifiable; when a composite fails with green leaves, this hypothesis is what broke.
- **Stub-composition.** Wiring together behaviour-less stubs of each component at design time, to cheaply
  refute a bad decomposition before building.
- **Premise A / Premise B.** After stub-composition, the two remaining risks: A = "the leaves are real"
  (checked at build by `verify`); B = "the contract holds across its whole input range" (sampled at
  build, residue caught at run time by `observe`).
- **Leaf.** A target checkable without further decomposition — *deterministic* (an assertion) or
  *statistical* (a threshold on a sampled value).
- **Repertoire.** A set of cross-cutting responses invoked from `reflect`: the *resilience* repertoire
  (escalate, degrade, recover, roll back) and the *security* repertoire (authn/authz, sanitize, harden,
  red-team).
- **Hard gate.** A leaf whose *accept* exit is deleted — non-waivable — because a single violation is
  non-local (Chapter 11).
- **Amplifier.** One of the three things that make a violation non-local: adversarial, irreversible,
  machinery-degrading.
- **Artifact.** The persistent, explicit carrier of a loop's target / result / lesson across the *time*
  and *agent* boundaries (Chapter 10).
- **Boundary-distance law.** The forced durability of an artifact scales with the distance between its
  producer and its consumer; `reflect`'s backward-feeding artifact is the extreme case (the sole
  channel).
- **Base act.** `implement` (with `release` as its seam-analogue): the operand the loop controls — the
  plant, not the controller. It defends no stone by design; the one *licensed exception* to the
  Chapter 3 self-test (§7).
- **Schedule bet.** `plan`'s conjecture that if every task lands in its slot, the whole ships by the
  date — `scope`+`specify` projected onto the time axis. An estimate is the stub of a task;
  critical-path feasibility is stub-composition on time. Baseline existence gated; dates graded (§7.1).
- **Regression ratchet.** The monotonically-accumulating suite of re-runnable checks compiled from
  fixed failures — the executable time-face of the reflect-artifact, the forced `reflect` → `verify`
  bridge (§10.1). Existence gated; coverage graded.
- **Reversible envelope (rollback's reach).** The region of version-space `roll back` can restore.
  Irreversibility ≡ beyond it; hard gates fall at its limit, and widening the envelope converts
  pre-execution gates back into graded bets (§10.1).
- **Silent failure.** A path that fails *and emits no telemetry* — the unit the observability gate rule
  classifies (§11.1). Gate the per-seam binary signal; never gate the aggregate coverage %.
- **Convergent law (existence-hard, fidelity-graded).** Every forced artifact must *exist* (hard gate —
  absence is machinery-degrading) while its fidelity / coverage / content stays a graded, Goodhartable
  proxy (§11.2). plan : predictable :: ADR : reliable :: regression : resilient :: telemetry : observe.
- **Second-order tier.** The two stones that are facts about the *solver* rather than the problem, and
  bite only under delegation/autonomy. Formalized by the **arity of the stone's referent**: first-order
  stones are properties of *(solver × world)* — true of one mind (so "we err," #4, stays first-order);
  second-order stones are properties of *(solver × solver / self)* — relational. Exactly two seats:
  independence (#9) and alignment (#10) (Chapter 12).
- **Reflexivity (stone #9).** The second-order, autonomous-only stone about the *checker*: an
  agent-staffed checker shares the doer's correlated blind spot, so its checks add no information unless
  **independence** is injected (Chapter 12).
- **Independence.** The property — across checkers — that lets stacked checks drive error toward zero.
  Never total; supplied mainly by an external/human terminal. The forced response to stone #9.
- **Incentive-divergence (stone #10).** The second-order, delegated-only stone about the *doer*: a
  self-interested agent optimises its own payoff over your target even when your intent is fully known
  (misaligned — not hostile like #8, not mistaken like #4). Its willful face forces **alignment**
  (Chapter 12).
- **Alignment.** The forced response to stone #10: engineering the agent's payoff to track true-Done
  (skin in the game, outcome-linked incentives, an aligned principal that owns the loss). Alignment is to
  the *doer* what independence is to the *checker*.
- **Bundling rule.** The self-test's third direction: two faces of a pressure are **one** stone only if
  they share a *single* forced response, else they are **sibling** stones — why "distributed + perishable"
  is one stone (#7) but "change" and "uncertain" are two (#5, #6), and why #9 and #10 are siblings, not
  one stone.
- **Ouroboros / evolve.** The product-level feedback edge that feeds run-time learning back into the
  target, turning the loop into an improving spiral.

## Appendix B — The stones-to-responses matrix

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
| 10 | incentive-divergence — doer not faithful *(delegated only)* | alignment (reward design, skin-in-the-game, outcome-linked payoff, aligned principal) | protects reliable |

> Three lifecycle boxes are deliberately **not** rows. `plan` is `scope`+`specify` projected onto the
> time axis (§7.1) and `release` is the build→operate seam whose governance *is* the stone-#5 machinery
> (§10.1) — projections and seams, not stone-responses. `implement` is the **base act** — the operand
> the loop controls — the one licensed exception to the self-test (§7).

## Appendix C — Provenance, status, and the road ahead

- **Status.** This document presents the **ideal MUST-HAVE** design: what *any* reliable, predictable,
  resilient, and secure SDLC is logically forced to contain. It deliberately does **not** audit any
  particular real-world setup against the ideal — that is a separate exercise, kept out so the ideal
  stays uncontaminated.
- **Parity.** Synced to canvas **iteration 35** (revision of 2026-07-10). The iter-34→35 sync closed the
  **bedrock pressure-test (canvas track T6)**: it admitted a **tenth stone** — **#10 incentive-divergence**
  (conditional, second-order — the *willful* face of a delegated agent serving its own payoff) — and
  formalized the **second-order tier** (*order = arity of the stone's referent*; two seats — independence
  #9 · alignment #10). That reshaped Chapter 3 (intro, the three-direction self-test with the *bundling
  rule*, the second-order-tier section, and the bedrock chart → "ten forces"), Chapter 12 (restructured to
  both seats, with alignment machinery and a broadened L4 chart), the Chapter 2 autonomy callout, the
  glossary, and the stones matrix. *(Prior — iter-33→34: §7.1 the schedule bet, the four node-kinds in
  Chapter 7, §10.1 the change axis, §11.1 the silent-failure gate, §11.2 the convergent law, and the
  compact repertoires in Chapter 8.)*
- **Source of the derivation.** Every claim here is derived, step by step, in the companion
  [canvas](index.html), which also holds the audit trail
  — the Socratic question-and-answer history, the iteration log, and the open-tracks register (§11
  there), which is the authoritative list of what remains. When you want to know *why* a piece is
  shaped the way it is, or *how* we got here, read the canvas; when you want to *understand the
  design*, read this.
- **The charts are regenerable.** Every chart on this page is a fenced `pipeline-graph` block in this
  file. Edit the block (or drag nodes in the viewer and use **Export**) and the picture updates — the
  visuals never drift from the text.

### The road ahead

The derivation is **substantively complete**: four properties, ten stones (eight first-order plus the
two-seat second-order tier), a fully-staffed loop with both base cases, two repertoires, the mechanism of
Done, the artifact laws, the gate calculus, and the convergent law that ties them together. The bedrock
pressure-test (T6) is now **closed**. What remains is deliberately small, and it is a *decision queue*,
not a backlog of unfinished chapters — in order:

1. **Three observability promotion-forks** *(canvas T11, from §11.1 here — the live derivation frontier).*
   (a) Does the sensor's status as an adversarial *target* force a distinct tamper-evidence / append-only
   MUST-HAVE, or does it simply inherit `secure`'s wall? (b) Is "emission character follows the carried
   fact's temporal type" a forced law or a good analogy? (c) Does the graded/gated frame stay stable if
   "#6 is absent here" is itself not knowable a-priori?
2. **The general gate-vs-graded seam rule** *(canvas T2's light residue).* "Gate the per-seam binary,
   grade the aggregate" settled it for observability; the fully general, cross-domain classification
   rule is the remaining thread.
3. **Beyond the ideal — the audit** *(descoped by design, and the natural next project).* Mapping a
   *concrete* stack against this ideal: which of its rules are mis-typed gates (graded proxies
   masquerading as gates, or gates with no amplifier behind them), which stones it leaves undefended,
   and where its ceremony is collapsible. Kept out of this document on purpose; once the frontier
   above closes, it is the obvious application.

**Maintenance rule.** The canvas is where derivation continues; this document is regenerated from it
whenever the model advances. If the two ever disagree, the canvas wins on *reasoning* and this
document wins on *presentation* — and the disagreement itself is a sync task.
