## 13. Iteration log (compressed)

1. Distinguished reliable / predictable / resilient (three failures, not one word).
2. Proved reliability ⊥ predictability (Setup A vs Setup B).
3. Placed resilience as the envelope on a third axis (context hardness × time).
4. Found the bedrock brute facts; saw facts ≠ stages 1:1.
5. Derived element #1 verification + shift-left; saw the verify *gate* = a feedback loop.
6. Split "done" into scope (boundary) + specification (correctness across realities).
7. Saw specification set targets for all three properties at once; surfaced stone #6.
8. Closed the loop (correct beat), bounded + escalation + non-convergence-as-signal.
9. Revealed the fractal: one loop, nested at every scale.
10. Mapped loop behaviours → properties (converge/bound/nest); drew the complete circuit.
11. Finished the elements band (organised by loop-beat).
12. Drew the giant process flow chart; created this living document.
13. Built the master synthesis visual; reframed beat 4 `correct`→`understand` (diagnose →
    re-target); lifted escalate/degrade/redundancy/rollback into a cross-cutting resilience
    repertoire; saw the loop also nests *downward* into each element (graded targets +
    metric/proxy); opened the metrics/Goodhart deep-dive.
14. Switched all elements to verb names (specify, implement, decompose, …); `understand` →
    `reflect`; split `reflect` into **analyze** (frame + root-cause) and **decide** (accept a
    known issue · or re-target), with escalate as the cross-cutting third exit.
15. Distinguished the two planes (scale-invariant *beats* vs the outermost loop's *elements*);
    resolved the metrics frontier — `specify` catches the a-priori/deducible proxy-risk,
    `analyze` (via `observe`) measures the a-posteriori residue (Goodhart / reality-contingent
    / intent-drift); saw the loop is irreducible precisely because that residue can't be zeroed.
16. Opened the artifacts derivation and flushed the **7th stone — knowledge is distributed &
    perishable** (the §3 suspect): artifacts are forced because a loop's information must cross
    the *agent* boundary (distributed → needs an explicit/external form) and the *time* boundary
    (perishable → needs persistence). Root derived: artifact = persistent, explicit carrier of
    a loop's info across boundaries.
17. Enumerated the per-beat artifacts (spec/target · code · tests + telemetry · postmortem /
    ADR · version history · runbooks) and captured them as the two interactive `pipeline-graph`
    diagrams below. Built the **living website** (`index.html`) — dark, hot-linked to this file
    (live fetch + auto-sync), diagrams interactive/editable with an embedded↔fullscreen toggle.
18. Wrote the per-beat artifacts up as **prose (§9)** with a dedicated `pipeline-graph`
    diagram — closing a gap where iteration 17's log had *claimed* the artifacts were captured
    as diagrams, but the file only actually held the loop + circuit. **Folded `decompose` into
    `design`** (vestigial: shared stone #3, owned no artifact, and its job is subsumed by
    design's output + the fractal + the shift-left re-target edge); `do` is now execution-only.
    **Promoted the fractal (§5) and process-flow (§7)** ASCII into interactive diagrams — the
    canvas now carries **5 live diagrams**.
19. Derived the **mechanism of Done** (new §10): a per-element target is *inherited by
    decomposition* (`Done(element) = Done(parent)` on the universal four-axis schema), rooted in
    `specify`-elicited intent and bottoming out in **binary leaf-checks** (deterministic or
    statistical). Each decomposition asserts a **composition hypothesis** `(∧Lᵢ) ⟹ P` — itself a
    *proxy* for the parent, judgment-laden where *P* is qualitative — and a green-leaves-yet-
    rejected composite **falsifies that hypothesis**, routing `analyze` → `decide` back to
    `design`; traceability forces the hypothesis to be a written artifact. Resolved the
    generalization question: **Done's form is universal (from the stones), its content
    contingent.** Added a 6th interactive diagram (**Done propagation**).
20. Independently triaged an external review of an older canvas version into *accept /
    partly-obsolete / contentious* and recorded it as the **Review backlog (R1–R7)** in §11. Key
    finding: **R2 (design needs a durable artifact) is now a live §9↔§10 contradiction** — §9 says
    design owns no artifact, §10 says its composition hypothesis *must* be written. R2 & R6 fold
    into the design-as-a-bet reframe (next).
21. **The design-as-a-bet reframe (new §10.1).** Established that `design`'s artifact is a **bet** —
    a decomposition + **interface contracts** + the composition hypothesis — that **stub-composition**
    falsifies **cheaply and one-sidedly** *before* the build (assume-guarantee reasoning; the design
    sub-loop's own `check`; shift-left on the hypothesis). It **discharges the wiring (⟹) and suspends
    the premises**, thereby **factoring** risk: after a green stub-check none remains in the wiring and
    all is relocated to **Premise A** (leaves are real → `verify` / deterministic leaf) and **Premise
    B** (the contract holds across its whole value-domain / "all permutations" → `observe` / statistical
    leaf). The **single reason** stub-composition reaches neither: it is **a-priori** and a **stub is a
    proxy for a not-yet-built real**, so both behavioral premises collapse into one a-posteriori
    stub↔real gap — §11's `define`-a-priori / `verify`·`observe`-a-posteriori seam and the proxy thread,
    reconfirmed from the interface side. **Closed R2** (design's durable artifact = the contracts +
    hypothesis, written executable-as-stubs); updated §9 note + table row. Added a 7th interactive
    diagram (**Stub-composition**). Next: the **premise-B lever** — can `design` shrink the
    a-posteriori residue by narrowing/totalizing contracts?
22. **The premise-B lever & design's two quality bars (new §10.2).** Resolved the lever: Premise B's
    *size* is something `design` **chooses** by how tight it draws each interface contract. Tightening
    **manufactures `predictable` at the seam** and dials premise B between the §10 leaf-kinds — loose →
    **statistical leaf** (sampled at `observe`, residue>0); tight → **deterministic leaf** (exhausted at
    `verify`, residue→0); type-encoded → **a-priori** (illegal values unrepresentable, never reaching
    run-time). But there is a **floor**: even with free prediction, tightening past the **required set of
    realities** (§4) rejects a valid input → breaks **`reliable`** (and **`resilient`** on the adverse
    slice). So the second quality bar is **tightest-sufficient contracts**, not *tightest* — and **all
    three §2 properties re-instantiate at every interface** (reliable + resilient = which realities must
    cross = the floor; predictable = how foreseeably = the tightening). Design's bet thus meets two bars:
    **fails cheap** (§10.1) + **tightest-sufficient contracts** (§10.2). Added an 8th interactive diagram
    (**premise-B lever / tightness dial**). Next: the long-open **map-onto-real-setup** step, now with a
    sharp lens (contract/stub tests = wiring bar; unit = premise A/deterministic; property+integration+
    e2e+telemetry = premise B/statistical; type-tightness = premise-B reduction; hard gates = R5).
23. **Admitted Stone #8 — adversarial actors — the first bedrock change since it was "complete at 7."**
    The governance audit (element-walk) reached `build`: `implement` is the *base act* (R1, defends no
    stone), so the audit target was the Hard Gates around it. Two catches — (a) `handle-all-errors` (the
    *total* premise-B lever) and `input-validation` (the *narrow* lever) are both §10.2 premise-B
    reductions; (b) the **security cluster** (SQLi · XSS · CSRF · credential theft) rested on **no
    stone** → by the §3 self-test's second direction, *a stone is missing*. Named it **#8: adversarial
    actors** — a **directed optimiser** over premise B, distinct from #6's random sampling and #4's
    accidental error, and *irreducible* (its defenses — authn/authz · sanitize · harden · threat-model
    — don't fall out of redundancy/degrade). Forces a cross-cutting **security repertoire** (§6). Closed
    **R4** (added #7 + #8 to the §8 ASCII line) and updated §3 (self-test now 1–8) + the circuit diagram
    + §12 + header. Opened: does #8 force a **4th property (secure)**? (test the §2 way).
24. **Admitted the 4th apex property — `secure` — as `resilient`'s *sibling* (§2).** Resolved
    iteration 23's open question. The context-hardness axis §2 gave `resilient` has **two sources of
    hardness**: *random* (#5 change / #6 uncertain — a blind **sampler** of the context-space) and
    *directed* (#8 adversarial — a **search** for the worst case). Resilience is the envelope against
    the random; **security is the envelope against the directed** — *same shape, different opponent* —
    so `secure` is a **fourth seat beside `resilient`, not under it** (statistical resilience machinery
    fails on, and can even feed, a directed foe — §12). Recast §2 from three properties to **four in
    two families** (point: reliable · predictable; envelope: resilient vs random · secure vs directed);
    added the `secure` row + the two-sources framing; synced header + §11. Opened the breakdown:
    secure's **loop-behaviour** (the empty §4/§8 seat — candidate: adversarial self-search / red-team),
    the **independence proof** (resilient-but-insecure / secure-but-fragile), and the ripple into §4 + §8.
25. **Filled `secure`'s behaviour cell + rippled the circuit.** Named the loop-behaviour that
    manufactures `secure`: **preempts** — the loop *proactively* red-teams its own inputs, searching
    permutations/combinations for any that drive an output **outside the allowed set** (leaked secret ·
    DoS · forged/intercepted message — the CIA triad, reproduced from scratch), then forecloses them. It
    must be *proactive* (unlike resilient's *reactive* nest-&-escalate) because a directed searcher (#8)
    hits the exact premise-B residue a random sampler (#6) would miss. Proved **secure ⊥ resilient** the
    §2 way (resilient-but-insecure vs secure-but-fragile). Rippled: §4 behaviour line; §8 prose + ASCII +
    the "complete circuit" pipeline-graph (added `secure`/`preempts` nodes + edges); the §2 secure row.
    Behaviour→property map now complete for all four. Opened iteration-25 frontier: does `secure`
    re-instantiate at every seam as a **forbidden-output wall** — the §10.2 dual (reliable/resilient =
    input *floor*; secure = output *ceiling*)?
26. **`secure` recurses at every seam — the forbidden-output wall (new §10.3).** Resolved iteration-25's
    frontier: `secure` re-instantiates at every interface *and* every element, exactly like the other
    three, along both the §5 element-fractal and the §10.2 seam (the decomposition tree's nodes *are* its
    seams). It is the **output-side dual** of the input-floor — floor = admit the required inputs
    (reliable/resilient), **wall = forbid the illegal outputs** (secure) — so every seam's Done is
    **four**-axed. Key catch (user's `.env` example): a design can be insecure **with every leaf green** —
    the flaw is the *decomposition* (a repo `.env` leaks when a full-disk backup syncs the working tree
    off-box, though the reader works and git excludes it) → the **security composition-hypothesis**
    falsified → re-target `design` (→ Keychain); MITM = same at the network-topology seam, SQLi = the
    leaf/build instance. Walked `secure` across all beats (specify abuse-cases → scope surface → design
    decomposition → implement injection-safe → verify red-team → observe IDS → reflect IR → evolve patch).
    **Why forced everywhere:** a directed optimiser enters at the **weakest link**, so one undefended seam
    = the whole envelope's hole (non-local, unlike a reliability leaf). Added §10.3 + a §12 law; synced
    §11 + header. Opened: does weakest-link / non-compensatory ⇒ `secure` is a **hard gate** (R5 / the
    governance Hard Gates), the first hit of the map-onto-real-setup step?
27. **Mapped the model onto the governance Hard Gates (new §10.4) — the map-onto-real-setup step, opened.**
    Derived *when* a leaf becomes a **hard gate**: iff a single violation is **non-local**
    (non-compensatory), via one of three amplifiers — **adversarial** (#8, guaranteed → `secure` hard
    *wholesale*), **irreversible** (escapes recover/rollback — a leaked secret can't be un-leaked), or
    **machinery-degrading** (a swallowed error / un-instrumented call / retrofitted test / mutation blinds
    or couples the loop). **Answered iteration-26's parked test:** `secure` is not the *only* non-gradable
    property, just the only one hard *wholesale*. Mapped every governance Hard Gate onto the three
    amplifiers and ran the §3 self-test → four findings: **G1** 80 % coverage is a proxy mis-gated
    (Goodhart); **G2** stone #7 / `reflect` **undefended** (no ADR/post-mortem — reconfirms the iter-22
    reflect-thin audit); **G3** stone #5 / change lightly gated (no regression/rollback gate); **G4**
    LLM-routing-via-proxy is really the observability sensor + concurrency cap, not "infra." Derived the
    predictive rule (violation non-local? → gate, else grade). **Closed R5.** Next: derive the missing
    `reflect` gate (mandated ADR + incident post-mortem), then finish the stack walk.
28. **Redirected to the ideal, consolidated the open tracks, re-opened on `reflect`.** Per the user: this
    canvas derives the **ideal MUST-HAVE** SDLC *only* — the current-setup mapping is **not** mixed in.
    Stripped §10.4's concrete governance-gate table and its G1–G4 current-setup findings, keeping the
    **ideal law** (hard gate = non-compensatory leaf; three amplifiers: adversarial · irreversible ·
    machinery-degrading) + the **predictive rule**; added a scope note. **Consolidated** every still-open
    thread from the last several sessions into one deduplicated **Open-tracks register** (§11): **T1**
    `reflect` (active) · **T2** proxy-graded-not-gated (ex-G1) · **T3** change-axis regression+rollback
    (ex-G3) · **T4** observability-as-sensor (ex-G4) · **T5** reflexivity / circular-verifier · **T6**
    bedrock pressure-test · **T7** R1 implement+lifecycle · **T8** R6 orphaned `plan` · **T9** R3
    resilience-formula · **T10** R7 artifacts-diagram; **descoped** map-onto-concrete-setup. Set the
    **active frontier to T1 — derive `reflect` as a MUST-HAVE** (hypothesis: its artifact is forced
    non-optional because *unwritten ⇒ machinery-degrading ⇒ untraceable*, §10.4; and `reflect` is the
    loop's only *learning* beat, feeding the Ouroboros evolve edge). Relabeled §1 + subtitle to four
    properties; updated HANDOFF.md.
29. **Closed T1 — `reflect` is the forced-MUST-HAVE beat (new §10.5).** Ran the artifact-*absence* trace in
    the two directions `reflect` feeds and found both fail as the **same** failure. *Within-loop* (the
    **agent** face): a green-leaves composite (§10) can't be root-caused once the composition hypothesis
    (§10.1) is unwritten — `analyze` is **starved** (intent-hidden #1, perished #7) → `reflect` collapses
    into `check`. *Next-loop* (the **time** face): with no post-mortem the Ouroboros **evolve** edge (§7/§8)
    is **unfed** → the failure-class recurs and the loop can't raise its floor. Both are **one transient
    reflect-output failure through the two faces of stone #7** (agent = **ADR**, time = **post-mortem**) —
    not a coincidence. **Backward-feed proof:** `reflect` is the only beat whose consumers are *all* across a
    #7 boundary, so its artifact is the **sole channel**, not insurance ⇒ **machinery-degrading (§10.4) ⇒
    forced hard gate** (confirming the iter-28 hypothesis). Folded out the **general boundary-distance law**
    (forced durability ∝ producer→consumer distance) into §9/§12 and **upgraded T10** from "redraw" to "a law
    to show." Edits: refined §9 (reflect-output = ADR + post-mortem, one category per boundary-face), added
    **§10.5**, two §12 laws, moved **T1 → Closed** in §11, synced header. Frontier: **between tracks** —
    user picks next (lean T4 observability, the other half of the machinery-degrading amplifier).
30. **Closed T4 — `observe` is the forced sensor (new §10.6); pressed the T1 coupling.** `analyze`
    (root-cause) is a *comparison* — **intended** (the ADR, §10.5) vs **actual** (run-time telemetry) — so
    telemetry is `analyze`'s missing second operand. The twist: telemetry does **two jobs** — `observe`'s
    **detector** (lets the run-time `check` fire → *THAT* it broke) *and* `analyze`'s **operand** (*WHY*) —
    so its absence blinds `observe` **and** starves `analyze`, **machinery-degrading (§10.4) one beat
    upstream** of the ADR. Absent it, detection is outsourced to the **end user** (silent churn ·
    non-diagnostic · no artifact — #7); *user-knows ≠ loop-knows.* Established **classify by the stone each
    defends, not where it runs** (verify/#4 ≠ observe/#6, non-substitutable), and the coupling **T1 =
    memory / T4 = senses** (sense ⊳ diagnose ⊳ remember; both forced by the irreducible a-posteriori
    residue that makes the loop a loop — closes the `observe`/#6 thin climax). Fork decided: `observe` is a
    **graded target with hard gates only at non-compensatory seams** (not wholesale like `secure`) — *the
    sensor's existence is forced, its coverage is graded* — deep-dive **deferred as T11** (cross-links T2).
    Edits: new **§10.6**, §9 check-row, three §12 laws, §11 (T4→Closed, T2 sharpened, **T11** added), header.
    Frontier: between tracks.
31. **Closed T5 — admitted a conditional second-order 9th stone: reflexivity (§3 #9).** Pressed the
    reflexivity angle against the T1/T4 coupling (the executor reading the loop's memory/senses shares their
    defect). Crux: `check` is only worth the **information** it adds beyond the doer's belief, so a checker
    whose errors are **correlated** with the doer's is an **echo-chamber** (zero bits; `verify` collapses
    into *declare*). The property at stake is **independence** — what lets stacked checks drive error → 0
    (→ `reliable`); reflexivity is the brute fact that it is **never total** (a common-mode floor; even
    formal proof only relocates the blind spot to the spec). **Irreducible to #4** (marginal error vs the
    *joint* correlated-error fact) → clears the §3 self-test. Flagged **second-order** (about the *solver*,
    not the task — the first of its kind) and **conditional**: it bites only in the **automated autonomous
    multi-agent** pipeline — with a human escape-hatch (§4/§5) it stays bounded; remove the human and
    terminal-independence → 0, so **an autonomous loop cannot be its own ground truth.** Forces
    independence-seeking (non-removable external/human terminal · adversarial review — §6 `red-team`, double
    duty with #8). Rippled: §3 (stone #9 + self-test), header, §2 caveat, §4/§5 escape-hatch, §6 red-team
    note, §8 (bedrock line + circuit-diagram node/edge), §12 law. **Partly closes T6** (the "is there a 9th?"
    sub-question). T5 → Closed. Frontier: between tracks.
32. **Backported design-doc Ch 6.4 → the inward base case / reducibility law (new §10.7).** The user
    directed the two-worked-example expansion of the fractal in the *design doc* (rate-limiting = graded ·
    password-reset = hard-gated); its §6.4 asked whether the full four-beat ceremony is always MUST-HAVE.
    Derived: **no** — a beat responds to a stone (§3), so where the stone is absent for a node the beat adds
    **zero information** and the inner loop **collapses toward bare `do`** (`implement`, the base act, T7).
    This **generalizes** the loop's known collapse ("single forward pass," §11/§12) from `reflect`/`observe`
    to **all four beats**, and pairs the **inward** base case with §10's **outward** termination (the fractal
    bottoms out on both axes). The collapse is itself a `decide` — ceremony = **insurance**, premium ∝
    `P(error)×cost(error)`, the *tightest-sufficient* move of §10.2. Two overrides delete `accept`: **hard
    gate** (§10.4 — non-local violation; the `observe`/`reflect`-artifact self-gates included) and
    **non-convergence** (§4 — a trivial-looking step that keeps failing reveals a hidden stone → re-expand).
    Gives **T2** its general frame (graded ⇒ collapsible · gated ⇒ non-waivable). Edits: new **§10.7**, §5
    base-case pointer, §11 (T2 advanced + active-frontier note), one §12 law, header sync. Frontier: between
    tracks (T2 advanced; next T3 · T6 · T11).
33. **Parallel sub-agent fold-in — closed T3, T11, T7/T8 (+ T9); surfaced the existence/fidelity law.** Ran
    four tracks concurrently (one sub-agent each; T6 held for the user). Folded in three: **T3** (new
    **§10.8**) — stone #5 has *two* time-faces forcing dual organs: **regression** = the §10.5 reflect-artifact
    made *executable* (the `reflect → verify` ratchet; *existence* hard/machinery-degrading, *coverage* graded),
    **rollback** = the reversibility net, *dual to* the §10.4 irreversibility amplifier (**irreversibility ≡
    beyond rollback's reach**) so rollback is graded and the hard gate falls at its *limit*. Corrected T3's own
    guess (the two halves gate by *different* amplifiers). Folded **T9** (repertoire compact form: escalate =
    up-exit · degrade/recover/roll back = in-place). **T11** (new **§10.9**) — the gate rule is §10.4 with
    "silent failure" for "violation" (irreversible/adversarial/machinery seams); telemetry is
    continuous/every-seam (a *dynamic envelope-fact*) vs the ADR's one-shot *point-fact*; gate the per-seam
    binary, grade the aggregate (resolves T2 for observability). **T7/T8** (new **§10.10**) — `implement` is the
    base act & `release` the base seam (exempt from the §3 self-test); §7 is a *projection* of §6 onto
    wall-clock; **a plan is a schedule bet** (`scope`+`specify` on the time axis — estimate = stub of a task,
    critical-path = stub-composition on time; existence-hard/content-graded). **Convergent law** (found by all
    three): *every forced artifact is existence-hard, fidelity-graded* — **plan : predictable :: ADR : reliable
    :: regression : resilient :: telemetry : observe**. Edits: **§10.8/§10.9/§10.10**, six §12 laws, §7 OPERATE
    +rollback & projection note, §3 base-act exception, §2 predictable caveat, §6 repertoire note, §11
    (T3/T7/T8/T9 → Closed, T11 → Closed w/ forks, T2 sharpened, frontier → **T6 held** + janitorial T10),
    header. Frontier at that point: **T6 (bedrock pressure-test) — derived draft ready, awaiting the user's call.**
34. **Documentation-parity pass (no derivation advanced).** Deep scrutiny found the doc set lagging the
    model: design doc at iter-32 parity (missing all of iter 33), HANDOFF at iter-31, canvas header stale
    ("iteration 32" lead over an iter-33 status line), and T10's two diagram gaps. Synced the **design
    doc** to iteration 33: Ch 2 three-faces-of-predictable note; Ch 5 regression-bridge note; Ch 7 four
    node-kinds + **§7.1 a plan is a schedule bet** (+ "The schedule bet" chart) + `roll back` in the
    lifecycle chart; Ch 8 repertoire compact form; **§10.1 the change axis** (+ chart) + sole-channel edge
    labels on the artifacts chart; **§11.1 the silent-failure gate**; **§11.2 the convergent law** (+
    chart, incl. the four-instance table); Ch 12 threads-back + glossary + stones-matrix (plan/release/
    implement footnote) updated; Appendix C → **"Provenance, status, and the road ahead"** with the
    ordered roadmap. **Closed T10** in this canvas: process-flow chart gains `roll back` (OPERATE);
    artifacts chart redrawn per the boundary-distance law (reflect-output's two backward sole-channel
    edges → explicit consumers *a later root-causer* / *next iteration's define*; forward spec edge
    relabelled *insures*). Refreshed `HANDOFF.md` (file map now lists the design doc + `sdlc-design.html`
    + the `design` launch config; §8 rewritten to iter-34 state + roadmap). Fixed the header lead.
    **Roadmap consolidated at the head of §11** (T6 decision → T11 forks → T2 residue → the descoped
    audit). Frontier unchanged: **T6 held for the user.**
35. **Folded in T6 — closed the bedrock pressure-test (the first bedrock change since #9, iter-31).** The
    user resolved both held forks → **admit** conditional second-order **stone #10 (incentive-divergence)**
    and **formalize the second-order tier**. Landed the settled parts too. **(i) Reducibility — none:** the 8
    first-order stones are pairwise-irreducible — the tempting pairs part on distinct forced machinery (#1/#6
    elicit-a-priori vs sense-a-posteriori · #2/#3 vanishes vs survives the infinite-resources test · #5/#7
    invalidates vs deletes an artifact · #5/#6 variance across time vs possibility) — yielding the **bundling
    rule** (shared response ⇒ one stone; distinct ⇒ siblings; why #7 is one but #5/#6 are two), now the §3
    self-test's **third direction**. **(ii) Candidates:** *cost-asymmetry* **rejected** as a derived law
    (attack≪defence = #8+#3; fix-early≪fix-late = shift-left over #3/#5/#7) → §12; *incentives* **splits** —
    unintentional face → #1+Goodhart, **willful face → new stone #10** (directed at a *different goal*, not
    your failure #8; forces **alignment** machinery — reward design · skin-in-the-game — beyond #9's
    independence-seeking; conditional, collapses at principal=agent but floor > 0 under realistic multi-drive
    agents, by parity with #4/#9). **(iii) Second-order tier — formalized:** *order = arity of the stone's
    referent* (first-order = *(solver × world)*, monadic — so #4 stays first-order; second-order = *(solver ×
    solver/self)*, relational — #9, #10); the tier has **exactly two seats** (independence #9 · alignment #10),
    both hollowing `check` → `declare` and eroding `reliable`. Also made the **admission criterion** explicit
    (3 gates: brute · generative · irreducible; 2 descriptors: class · modality). Edits: §2 (second-order-
    erosion box), §3 (stone #10 + admission criterion + reducibility scan + bundling rule + class partition +
    3-direction self-test), §8 (ASCII bedrock line + circuit-JSON node/edge mirroring #9), §11 (T6 → Closed,
    roadmap re-headed to T11 forks), §12 (four laws), header. **Frontier now → T11's three promotion-forks**,
    then T2's general-seam residue, then the descoped concrete-setup audit. `HANDOFF.md` §8 roadmap synced;
    the design doc's bedrock chapter awaits the next documentation-parity pass.
36. **Documentation-parity pass — synced the design doc to the iter-35 model (no derivation advanced).**
    Folded the closed T6 into `sdlc-design-document.md`. **Ch 3** reworked: intro → *eight first-order +
    two second-order* with the 8 **pairwise-irreducible**; the self-test gains its **third direction**
    (the bundling rule); the "ninth stone" subsection became **"The second-order tier — two stones about
    who staffs the loop"** (#9 first seat = independence · **#10 incentive-divergence** second seat =
    alignment); the L1 chart → **"The bedrock — ten forces"** (+ #10 node, `alignment` response, edge).
    **Ch 12** restructured from a single stone to the **two-seat tier**: added the #10 treatment
    (misaligned ≠ hostile #8 ≠ mistaken #4; willful vs proxy-gaming face; forces alignment), the
    "neither judge nor trust" consequence, a fourth "engineered alignment" bullet, the threads-back +
    takeaway, and a broadened **L4 "second-order tier"** chart (both failure paths → `declare` → erodes
    reliable). **L0 circuit chart** + **Ch 2** ⟐ callout gained the #10 node/edge (two coral nodes now).
    **Appendix A** glossary: ten stones + new entries (second-order tier · incentive-divergence ·
    alignment · bundling rule; reflexivity re-scoped to "first seat"). **Appendix B** matrix: row 10.
    **Appendix C**: parity → iter 35; road-ahead's done sync-item dropped, T11 forks promoted to #1. All
    **21** design-doc charts validate; both viewers render clean, zero console errors. Design doc +
    `HANDOFF.md` now at **full iter-35 parity**. Frontier unchanged: **T11's three promotion-forks**.

---

