## 12. Key laws & insights derived along the way

- **Shift-left:** cost of a defect grows ~exponentially with detection latency ⇒ verify at
  *every* stage, while deviations are cheap and local. (Hence verification is a cross-cutting
  layer, not a step bolted on after "build".)
- **Verification is a comparison** (actual vs expected) ⇒ it *requires* an objective "done";
  you cannot verify against nothing.
- **Properties are emergent**, produced by the loop's behaviours — they are not bolt-on
  features.
- **Facts ≠ stages (many-to-many):** one brute fact drives several responses.
- **Non-convergence points at the target:** a loop that won't converge often signals a wrong
  spec, not just a buggy build.
- **"Done" is graded, not binary:** it is a *threshold on a quality range*; `check` is a
  measurement (*done = measured ≥ threshold*), which is why it needs a metric.
- **Done is set by decomposition, not invention (§10):** `Done(element) = Done(parent)`
  decomposed onto its slice, cast on the universal four-axis schema (scope · reliable ·
  resilient · predictable). Only the **root** is *elicited* from hidden intent by `specify`;
  every internal Done is *derived*. **Form is universal, content is contingent** — which is why
  Done generalizes across any software.
- **A leaf Done is a binary verdict:** grading bottoms out into pass/fail, from either a
  *deterministic* measurement (logic → assertion) or a *statistical* one (proxy → threshold on a
  sampled value). The statistical leaf is the a-posteriori residue made concrete.
- **Decomposition = proxy-construction:** splitting *P* into leaves {Lᵢ} *asserts* the
  hypothesis `(∧Lᵢ) ⟹ P`; that conjunction **is a proxy** for *P*, so it inherits Goodhart /
  drift. Where *P* is qualitative, the hypothesis rests on human judgment.
- **A green-leaves-but-rejected composite falsifies the composition hypothesis:** the defect is
  in the *decomposition*, not the leaves ⇒ `analyze` → `decide` re-targets `design`. This
  localizes "non-convergence points at the target." Traceability *requires* the hypothesis be a
  written artifact (design/ADR) — unwritten, the failure can't be traced back.
- **Metrics are often proxies; proxies invite Goodhart:** optimising the proxy can diverge
  from true intent ⇒ `reflect`/`observe` must check proxy-vs-intent, not just
  actual-vs-proxy.
- **The corrective responses are cross-cutting, not a beat:** escalate / degrade / recover /
  roll back are a repertoire invoked at any element & scale; together they *are* the
  resilient property's machinery.
- **The fractal runs *both* ways:** the loop nests up across scope *and* down into every
  element — and the *up* nesting is not a separate act: `design` carves the parts, each part
  recurses, so the nesting is *emergent*, not staffed by its own element.
- **Two elements on one stone is a redundancy smell:** `design` and `decompose` both rested on
  stone #3 (complexity); since `design`'s output *is* the decomposition and the re-target edge
  carries the late feedback, `decompose` was ceremony and folded away. This *sharpens the §3
  self-test*: not only *stone-with-no-element* and *element-with-no-stone*, but also
  *two-elements-on-one-stone-where-one-is-derivable*.
- **`decide` is where the loop's behaviours become a choice:** *accept* (stop — the
  *bounded* / predictable exit) · *re-target* (refine — the *converges* / reliable exit) ·
  *escalate* (hand up — the *nests & escalates* / resilient exit).
- **`specify` is a-priori, `analyze` is a-posteriori:** `specify` *reasons about* what should
  be true; `analyze` *measures* what turned out true. Pure logic at `specify` catches only
  *deducible* gaps — it cannot measure a gap that isn't a fact yet.
- **A proxy gap is often not a fact at t0:** it is induced by optimisation (Goodhart),
  contingent on unobserved reality, or relative to drifted intent — so measuring it is
  irreducibly a-posteriori.
- **The loop exists because of that residue:** with no residue (intent known & fixed, reality
  predictable, proxy immune to its own use), the loop collapses to one forward pass.
- **Artifacts are forced by boundary-crossings (stone #7):** a loop's information must cross
  *time* (→ defeated by **persistence**) and *agent* (→ defeated by an **explicit / external**
  form). An *artifact* = the **persistent, explicit carrier** of a loop's target / result /
  lesson across those boundaries; the loop-level hand-off is just these two at fine grain.
- **Shared understanding is the *output*, distribution is the *fact*:** knowledge isn't shared
  by default because it's distributed across private stores; the artifact manufactures the
  shared copy.
- **Design is a bet, not a drawing (§10.1):** `design`'s deliverable is the **composition
  hypothesis + interface contracts**, and its first quality is *how cheaply it fails when wrong*.
- **Stub-composition = cheap, one-sided falsification of the *wiring*:** stubs are contracts with
  the behavior deleted, so composing them is **assume-guarantee** reasoning that discharges the
  **⟹** and suspends the premises. It **factors** risk (after green: none in the wiring, all in
  {leaves, interface value-domains}) — it does not reduce it. It is the `check` beat of the design
  sub-loop (a-priori w.r.t. the build), i.e. shift-left on the composition hypothesis.
- **A stub is a proxy for a not-yet-built real:** so the stub↔real gap is **a-posteriori by
  construction** (§11 seam + proxy thread), which is the single reason stub-composition reaches
  *neither* premise. The two premises discharge at *different* stations — A (leaf real) at `verify`
  = **deterministic leaf**; B (whole value-domain / "all permutations") at `observe` = **statistical
  leaf** (§10).
- **Design has two quality bars (§10.1–10.2):** (1) **fails cheap** — the composition hypothesis is
  stub-falsifiable; (2) **tightest-sufficient contracts** — every interface as predictable as
  possible without excluding a required reality, minimising the premise-B residue handed to `observe`.
- **A tight contract manufactures `predictable` at the seam:** it dials premise B from a
  **statistical leaf** (loose → sampled at `observe`) to a **deterministic leaf** (tight → exhausted
  at `verify`) to **a-priori** (type-encoded → illegal values unrepresentable). Premise B's residue
  *is* unpredictability at the interface.
- **The floor is `reliable` (with `resilient` on the adverse slice):** tighten a contract past the
  **required set of realities** (§4) and it rejects a valid input → wrong-thing-on-a-legitimate-
  reality. So contracts are *tightest-sufficient*, not tightest — and **all three §2 properties
  re-instantiate at every interface**: reliable + resilient set *which* realities must cross (the
  floor), predictable is bought by tightening toward it.
- **specify-cuts vs scope-cuts — the infinite-resources test:** when you cut work, ask *"would I
  still cut it if resources were infinite?"* **Yes** → a **specify** cut (excluded because it's
  *not what's wanted* — stone #1, correctness). **No** (you'd include it given infinite time/money)
  → a **scope** cut (excluded *only* for finiteness — stone #2). Scope-cuts *vanish* under infinite
  resources; specify-cuts *survive*. Operationalises §4's composite Done (scope = boundary ×
  specify = correctness) — and shows scope's true sibling is **`decide`** (both stone #2: scope
  bounds *before*, decide bounds *after*).
- **Stone #8 — the adversary is a *directed optimiser* over premise B:** where #6 (uncertain)
  *samples* the value-domain at random, an adversary *searches* it for the worst case — so
  statistical defenses (redundancy · retries · graceful degrade) that beat #6 **fail** against #8
  (retries just feed a DoS; the attacker targets the exact residue). It forces its own **security
  repertoire** (authn/authz · sanitize · harden · threat-model, §6), irreducible to #6. Found by the
  §3 self-test firing *in reverse*: the security Hard Gates rested on **no stone** ⇒ a stone was
  missing. And `sanitize/validate` = the §10.2 premise-B narrow-lever with its floor set by an
  attacker — which is why "never trust external data" is a *hard* gate.
- **`secure` recurses at every seam as the *output-wall* (§10.3):** dual to the input-floor of the other
  three — floor = admit the required inputs (reliable/resilient), wall = forbid the illegal outputs
  (secure). It fails at the **composition node with green leaves** (a bad *decomposition* is insecure
  however well the leaves are built — the security composition-hypothesis), and is **forced** to hold at
  *every* seam because a directed optimiser enters at the **weakest link**: one undefended stage is the
  whole envelope's hole, so `secure` is **non-compensatory** in a way the other three are not.
- **A hard gate = a non-compensatory leaf (§10.4):** `decide`'s **accept** exit is deleted **iff a single
  violation is non-local** — amplified by a directed adversary (#8, guaranteed → `secure` hard wholesale),
  *irreversible* (escapes recover/rollback), or *machinery-degrading* (blinds a `check`/`observe`, or
  couples leaves). So **non-compensability — not "importance" — is what makes a rule a gate;** a graded
  proxy mis-gated (80 % coverage) invites Goodhart, and an undefended stone (#7 / `reflect`) was the last
  open risk — **now closed (§10.5): the reflect-artifact is that gate.**
- **`reflect` is the forced-MUST-HAVE beat — its artifact is the loop's only *backward* channel (§10.5):**
  every forward beat hands its output *live* to the next beat in the same iteration (artifact = insurance),
  but `reflect` feeds **backward** — its consumers are a *later* root-causer (the **ADR**, agent-face) and a
  *future* iteration's `define` (the **post-mortem**, time-face), both across a stone-#7 boundary by
  construction. So its artifact is the **sole channel**, not insurance: unwritten, a composite failure is
  untraceable (`analyze` **starved** → `reflect` collapses into `check`) *and* the same class recurs
  (`evolve` **unfed** → the loop can't raise its floor). Same failure, **two faces of one stone** ⇒
  **machinery-degrading (§10.4) ⇒ forced hard gate**, not documentation hygiene.
- **Forced durability scales with boundary-distance (§9):** how durable an artifact is *forced* to be is a
  function of the **producer→consumer boundary-distance** — adjacent (forward, same iteration) ⇒ a live
  hand-off, the artifact merely insures; backward / cross-iteration ⇒ the artifact is the **sole channel**,
  mandatory. `reflect` is the extreme case; this is the law the §9 / T10 artifacts diagram should show.
- **`observe` is the forced sensor; telemetry does two jobs (§10.6):** `analyze` is a *comparison* —
  intended (the ADR, §10.5) vs **actual** (telemetry) — so telemetry is both `observe`'s **detector** (lets
  the run-time `check` fire → *THAT* it broke) and `analyze`'s **actual operand** (*WHY* it broke). Absent,
  the loop outsources detection to the **end user** (probabilistic churn · non-diagnostic · no artifact —
  stone #7), blinding `observe` **and** starving `analyze` — machinery-degrading (§10.4) one beat further
  upstream than the ADR. **What's forced is that `observe` owns a sensor at all;** *how much* to instrument
  is graded (T2), hard-gated only at non-compensatory seams (T11).
- **Classify each element by the stone it defends, not where it runs (§10.6):** `verify` (#4) and
  `observe` (#6) are both the `check` beat but are **non-substitutable** — #4's build-time sensor is
  structurally blind to #6's a-posteriori residue. Filing by station ("both are checks") is the trap that
  makes you think a test will catch a run-time reality gap.
- **Senses vs memory — the T1↔T4 coupling (§10.6):** the loop exists only for the irreducible a-posteriori
  residue (§11), so it needs an organ to **sense** it (observe/telemetry, T4) and one to **remember** it
  (reflect-output, T1); *sense ⊳ diagnose ⊳ remember.* Kill either and the loop degrades toward a single
  forward pass — **blind** or **amnesiac**.
- **Reflexivity — the checker shares the doer's fault (§3 #9, second-order · autonomous):** a check's worth
  is the **information** it adds beyond the doer's own belief, so a checker whose errors are **correlated**
  with the doer's is an **echo-chamber** (zero bits; `verify` → *declare*). **Independence** — what lets
  stacked checks drive error → 0 (→ `reliable`) — is never total (even formal proof only relocates the blind
  spot to the spec). Irreducible to #4 (marginal error) because it is the *joint* fact (correlated error). It
  bites only in the **autonomous multi-agent** pipeline: the human escape-hatch (§4/§5) is a partially-
  independent terminal, so **an autonomous loop cannot be its own ground truth** — forcing independence-
  seeking (external/human terminal · adversarial/independent review, the §6 `red-team` doing double duty
  with #8). *First **second-order** stone: a fact about the solver, not the task.*
- **The bundling rule (§3 self-test, T6):** two faces of a pressure bundle into **one** stone iff they
  share a **single** forced response; distinct responses ⇒ **sibling** stones. Why **#7 is one** (distributed
  + perishable → the one response *artifact*) but **#5/#6 are two** (rollback vs redundancy), and why **#9/#10
  are siblings** (independence-seeking vs alignment), not one stone.
- **Order = the arity of the stone's referent (§3, T6):** *first-order* = a property of *(solver × world)*,
  **monadic** in the solver — so **#4 "we err" is first-order** (the *marginal* fact, true of a lone agent);
  *second-order* = a property of *(solver × solver / self)*, **relational** — so **#9 reflexivity** (the
  *joint* fact) and **#10 incentive-divergence**. Second-order stones are relational + conditional + erode a
  point-property by breaking a *staffing* assumption.
- **The loop's two silent staffing assumptions (§3, T6):** convergence assumes the checker is **independent**
  (#9) and the doer is **faithful** (#10); each breach turns `check` into a hollow `declare` (echo-chamber ·
  self-report) and erodes `reliable`. The second-order tier has **two seats** — capability folds to
  #4, liveness to #7. **(E12, 2026-07-30: "exactly two" is retracted as a proof and restated as the
  admission criterion's current output; the two folds are criterion-based judgments whose residue is not
  yet recorded — see Q10. This records the judgment; T6 stays closed.)**
- **Cost-asymmetry is a derived law, not a stone (T6):** *attack ≪ defence* = #8 + #3 (one undefended seam
  holes the envelope, §10.3); *fix-early ≪ fix-late* = the shift-left law over #3 + #5 + #7. Real and
  load-bearing, but **downstream** of existing stones — it belongs here, not in the §3 bedrock. (The contrast
  case that shows the admission criterion has teeth.)
- **Ceremony is proportional insurance — the inward base case (§10.7):** each beat is forced by a stone
  (§3); absent that stone it adds no information, so the inner loop **collapses toward bare `do`**
  (generalizing "degrades toward a single forward pass" from `reflect`/`observe` to all four beats). Run
  loop-ceremony ∝ residual risk `P(error)×cost(error)` — *tightest-sufficient* again (§10.2). The fractal
  bottoms out on **both** axes: outward at a checkable leaf (§10), inward at a stone-free node. **Overrides
  that forbid the collapse:** hard gates (§10.4) and non-convergence (§4) delete the *skip/accept* exit.
- **The change-axis machinery — regression & rollback (§10.8):** stone #5 forces two dual organs.
  **Regression** = the §10.5 reflect-artifact made *executable* — a fixed failure-class persisted as an
  auto-firing, monotonically-accumulating `verify` check (the ratchet that makes fixes stick: circle →
  spiral); *existence* is a **hard gate** (machinery-degrading), *coverage* is **graded** (T2). **Rollback ⟺
  irreversibility are dual:** the §10.4 irreversibility amplifier is *exactly the region beyond rollback's
  reach*, so rollback is a **graded** response and the **hard gate falls at its limit** (reversible ⇒
  graded/insured bet; irreversible seam ⇒ pre-execution gate). Keep *code reversible* (rollback), keep
  *lessons irreversible* (regression) — together they manufacture `resilient`'s **over-time** clause.
- **Observability's silent-failure gate & emission character (§10.9):** instrument-coverage is graded, but a
  seam is **hard-gated iff its *silent* (un-observed) failure is non-local** — the §10.4 test with "silent
  failure" for "violation": irreversible-seam · adversarial-seam (inherits §10.3 wholesale) · machinery-seam
  (blinds the loop to its own blindness). **Gate the per-seam binary signal; never the aggregate coverage %**
  (a Goodhartable proxy) — the concrete resolution of T2. And **emission character follows the fact's
  temporal type:** a *static point-fact* → **one-shot / single-locus** artifact (the ADR); a *dynamic
  envelope-fact*, regenerated every run and location-unknown a-priori → **continuous / every-seam** sensor
  (telemetry). So observe-coverage wears `secure`'s every-seam *form* but a *blind-sampler* (#5/#6) opponent
  — `resilient`-shaped and graded — tipping to `secure`'s wholesale wall only at security seams.
- **The lifecycle is a projection; `implement`/`release` are base act & seam (§10.10):** §7 is the §6
  elements projected onto wall-clock at product scale — a *view*, not new primitives (four node-kinds:
  control-element · base act · seam · phase-loop · Ouroboros). `implement` (the operand the loop controls)
  and `release` (the build→operate seam) are stone-free in their own right, so **exempt from the §3
  self-test** (one licensed exception, which makes the test *sound*).
- **A plan is a schedule bet (§10.10):** `scope`+`specify` projected onto the time axis — **an estimate is
  the stub of a task; critical-path feasibility is stub-composition on time**; premise A per-task
  (verify-like), premise B whole-future (observe-like → re-plan). So **`predictable` = cost (bounded, §4) +
  schedule (the bet)**, the schedule half a time-axis projection, *not* the point-property. The **forecast**
  is the bet's premise B; the **commitment** is its #7 artifact.
- **Every forced artifact is existence-hard, fidelity-graded (§10.5/§10.6/§10.8/§10.10):** across the ADR
  (`reliable`), telemetry (`observe`), the regression ratchet (`resilient`), and the plan (`predictable`),
  the *same* shape recurs — the intended-operand `analyze` compares against must **exist** (its absence is
  machinery-degrading, blinding the loop's own `analyze`/`check` → **hard gate**), but need only be **as
  accurate as the residual risk warrants** (its fidelity/coverage/content is a Goodhartable proxy →
  **graded**). **plan : predictable :: ADR : reliable :: regression : resilient :: telemetry : observe.** A
  convergent law found independently by tracks T3, T11, and T7/T8 (iteration 33).

