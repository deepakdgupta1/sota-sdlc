## 11. Current frontier & next steps

**Recent arc (historical; through iteration 22 — newer work 23–28 is in the §13 log):** the **premise-B lever & design's two quality bars** (§10.2)
— a good bet must (1) *fail cheap* (§10.1) **and** (2) carry **tightest-sufficient contracts**:
tightening a contract manufactures `predictable` at the seam and dials premise B
statistical→deterministic→a-priori, but the **floor is `reliable`** (tighten past the required set of
realities and a valid input is rejected) — so *tightest-sufficient*, not tightest; all three §2
properties re-instantiate at every interface. Before that (21): the **design-as-a-bet reframe** (§10.1)
— `design` states
a bet (interface contracts + composition hypothesis) that **stub-composition** falsifies cheaply and
one-sidedly, discharging the wiring (⟹) and **factoring** the risk into premise A (leaves real →
`verify`/deterministic leaf) and premise B (whole value-domain → `observe`/statistical leaf); the
single reason it reaches neither is that it is a-priori and a stub is a *proxy* for a not-yet-built
real (§11 seam + proxy thread); **R2 closed**. Before that (19): derived the **mechanism of Done** (§10) — an
element's target is *inherited by decomposition* from its parent (root elicited by `specify`),
bottoming out in binary leaf-checks; each decomposition asserts a *composition hypothesis*
`(∧Lᵢ) ⟹ P` that is really a proxy, and a green-leaves-but-rejected composite *falsifies that
hypothesis* → re-target `design`. Earlier (18): the artifacts (§9), the `decompose` fold, and the
interactive fractal/process-flow diagrams.

**Decisions locked in:**
- **`correct` → `understand` → `reflect`.** The fourth beat is *diagnosis + judgement*:
  **analyze** (frame the issue — e.g. "loop can't converge" — and root-cause it) then
  **decide** — accept the gap as a *known issue*, or **re-target** (re-iterate into the next
  **define**). Escalation is the cross-cutting third exit.
- **All elements are verbs now** (specify · scope · design · implement · verify · observe ·
  analyze · decide), to match the action each names.
- **`decompose` removed (folded into `design`).** Two elements rested on stone #3; but
  `design` already outputs the decomposition, the fractal applies the loop to each part, and
  `reflect → re-target(design)` (shift-left) carries the implement→design feedback — so a
  standalone `decompose` was vestigial. `do` is now execution-only (`implement`).
- **The responses are cross-cutting, not a beat.** escalate · degrade · recover · roll back
  form a **resilience repertoire** invoked from `reflect` at any element and any scale (mostly
  run-time). They are what manufactures the **resilient** property.
- **The loop nests *down* into every element**, not just up across scope. Each element is its
  own define → do → check → reflect loop.

**Resolved — graded targets & measurement.** A target is *not* binary; it is a **threshold on
a quality range**, and `check` is a *measurement* against it (*done = measured ≥ threshold*).
Most metrics are **proxies** (coverage ≈ "well-tested", NPS ≈ "trust", latency ≈ "feels
fast").

- **The proxy failure & where it's caught — `specify` (a-priori) vs `analyze` (a-posteriori).**
  `specify` catches every proxy↔intent gap that is *deducible at t0* — but it can only *reason
  about the risk*, never *measure a gap that isn't a fact yet*. Measurement is inherently a
  posteriori. The residue `specify` cannot reach (so `analyze`, fed by `observe`, must) has
  three sources:
  1. **Goodhart / induced** — the gap is *created* by optimising the proxy; it doesn't exist
     until you iterate. *(#5 change, via the feedback of use)*
  2. **Reality-contingent** — the proxy↔intent map runs through reality not yet observed.
     *(#1 hidden, #6 uncertain)*
  3. **Intent drift** — the proxy was faithful to t0-intent; real intent has since moved.
     *(#1, #5)*
- **Why it matters:** if none of the three held, `specify` would catch everything and the loop
  would **collapse to a single forward pass**. `analyze`/`reflect` exist *only* because the
  stones guarantee an irreducible a-posteriori residue.

**Open-tracks register (consolidated, iteration 28).** Every thread opened and not yet closed,
deduplicated into one list. `active` = current derivation · `open` = queued · `janitorial` = cleanup ·
`descoped` = deliberately out of scope. (Historical "next frontiers" prose folded into the §13 log.)

_Active frontier_
- **— between tracks (iteration 31).** **T5 closed** → admitted as **stone #9 (reflexivity, §3)**: a
  *conditional, second-order* stone (about the *solver*, not the task) that bites only in the **automated
  autonomous multi-agent** pipeline. A correlated checker is an **echo-chamber** (zero information;
  `verify` → *declare*); **independence** is what lets stacked checks drive error → 0, and reflexivity is
  the brute fact that it is never total — irreducible to #4 (joint vs marginal). Rippled through
  §2/§3/§4/§5/§6/§8/§12. **Pending question for the user: which track is next?** Candidates below (T2 · T3 ·
  T6 · T11), plus structural T7–T10. **· Iteration 32:** added **§10.7 — the inward base case / reducibility
  law** (advanced **T2**). **· Iteration 33 (parallel sub-agent fold-in):** closed **T3** (§10.8 change-axis —
  regression + rollback), **T11** (§10.9 observability silent-failure gate) and **T7/T8** (§10.10
  lifecycle-projection + plan-as-schedule-bet); folded **T9**; surfaced the **existence-hard / fidelity-graded**
  convergent law (§12). **Active frontier at iter 33 → T6 (bedrock pressure-test):** a full derivation draft was
  readied (sub-agent, iteration 33) and **held for the user's decision** — the one track deliberately *not* folded
  in, because it would renumber the bedrock and formalize a 'second-order' stone class. **· Iteration 34
  (documentation-parity pass — no derivation advanced):** design doc synced to iter 33 (Ch 7 node-kinds +
  §7.1 schedule bet · §10.1 change axis · §11.1 silent-failure gate · §11.2 convergent law · Appendix C
  road-ahead), the handoff document refreshed, **T10 closed** (both diagram fixes landed). **· Iteration 35 (T6
  folded in — the bedrock pressure-test is CLOSED):** the user resolved both held forks → **admit
  conditional second-order stone #10 (incentive-divergence)** and **formalize the second-order tier** (order
  = arity of referent). Also landed the settled parts: **(i)** 8 first-order stones pairwise-irreducible +
  the **bundling rule**; **(ii)** **cost-asymmetry rejected** (a derived law → §12). Rippled §2/§3/§8/§12.
  Bedrock is now **8 first-order + 2 second-order**.
  **ROADMAP — in decision order (T6 closed; frontier now → T11 forks):**
  1. **T11 forks** (three candidate promotions): (a) tamper-evident / append-only sensor — forced or
     inherited from §10.3? (b) emission-character ≙ temporal-type — law or analogy? (c) is graded/gated
     stable if "#6-absent" is unknowable a-priori?
  2. **T2 residue** — the fully-general, cross-domain gate-vs-graded seam rule (settled for observability
     by §10.9's *gate-the-binary / grade-the-aggregate*).
  3. **Beyond the ideal** — the descoped concrete-setup audit (map a real stack: mis-typed gates ·
     undefended stones · collapsible ceremony), a **separate exercise** and the natural next project once
     1–2 close.
  *(Docs: the snapshot (`docs/snapshot/`) is at **full iter-35 parity** — the fold-in landed as
  iteration 36, a documentation-parity pass: ten-stone bedrock, the second-order-tier section, Ch 12
  reworked to both seats, the L0/bedrock/L4 charts updated, glossary + stones-matrix + Appendix C synced.
  The Tier E model repairs in `ROADMAP.md` §3 are **not** yet applied.)*

_Open derivation frontiers_
- **T2 · Proxy-leaves: graded by default, gated only at non-compensatory seams** *(open; ex-G1,
  generalized; sharpened by T4)*. A *proxy* quality bar (coverage · NPS · latency ≈ intent) is a
  **statistical leaf that stays gradable** (`analyze` checks proxy-vs-intent; an absolute gate invites
  Goodhart) — **except** where a single miss is non-local (§10.4), which earns a hard gate. **T4/§10.6
  confirmed this exact shape for observability** (instrument-coverage graded, gated only at
  non-compensatory seams). Still to pin down in general: the precise seam between a deterministic-leaf gate
  and a must-stay-graded proxy. [§10 leaf-kinds; §10.4 amplifiers; §12 proxy thread. Observability
  instance: **T11**.] **Iteration 32 (§10.7) supplied the general frame** — graded ⇒ ceremony collapsible ·
  gated ⇒ non-waivable; the residual *which-seam-is-gated* classification was **resolved for observability by
§10.9** (iter 33 — gate the per-seam binary, grade the aggregate); the fully-general cross-domain seam
classification remains the light residue.
- **T3 · Stone #5 (change): the regression + rollback machinery** *(**closed — iter 33 → §10.8**; ex-G3)*.
  **Answered — yes, both: the #5 time-axis pair.** Regression = the executable §10.5 artifact
  (existence-hard / coverage-graded); rollback = the reversibility net (graded, hard gate at its irreversible
  *limit*); the two halves gate by *different* amplifiers. Original question: does the
  ideal **over-time** loop MUST-HAVE an explicit **regression-suite** (catch re-introduced defects) and
  **rollback** (revert to known-good), and are they **hard gates** (via the irreversibility amplifier?)
  or graded? [§6 resilience repertoire; §7 OPERATE; folds in janitorial T9.]
- **T6 · Bedrock pressure-test** *(**closed — iter 35 → §3**; partly done iter-23 & iter-31)*. All three
  sub-questions answered. **(i) Reducibility — none:** the 8 first-order stones are pairwise-irreducible (the
  scan parts every tempting pair on distinct forced machinery), and it yielded the **bundling rule** (shared
  response ⇒ one stone; distinct ⇒ siblings), now the §3 self-test's third direction. **(ii) Candidates:**
  *cost-asymmetry* **rejected** — a derived law (attack≪defence = #8+#3; fix-early≪fix-late = shift-left over
  #3+#5+#7) → §12, not the bedrock; *incentives* **splits** — its *unintentional* face reduces to #1+Goodhart,
  its **willful** face is irreducible (≠#1 known · ≠#4 slip · ≠#8 hostile) and was **admitted as conditional
  second-order stone #10 (incentive-divergence)**, the conative sibling of #9 (user resolved the brute-gate
  fork → admit). **(iii) Second-order class — formalized** as a tier: *order = arity of the stone's referent*
  (first-order = solver×world, monadic, so #4 stays first-order; second-order = solver×solver/self,
  relational), with exactly **two seats** — independence (#9) · alignment (#10). (#8 adversarial was the 8th,
  iter-23; #9 reflexivity the 9th, iter-31; #10 incentive-divergence the 10th, iter-35.)
- **T11 · Observability: graded coverage vs non-compensatory gates** *(**closed — iter 33 → §10.9**)*.
  **Open forks (candidate promotions, for the user):** (1) does the sensor-as-adversarial-target force a
  distinct **tamper-evidence / append-only** MUST-HAVE, or just inherit §10.3? (2) is *emission-character =
  the §2 property-family of the carried fact* a forced law or an analogy? (3) is the graded/gated frame
  stable, or does observability tilt wholesale if '#6-absent' is not knowable a-priori? §10.6 fixed the
  *shape* — `observe`-instrumentation is a **graded target** (how
  much to instrument) with **hard gates only at non-compensatory seams**. Still to derive in depth: (a) the
  **decision rule** for *which* seams are gated (whose silent failure is irreversible / adversary-amplified
  / machinery-degrading, §10.4); (b) telemetry's **emission character** — the ADR is one-shot (design-time)
  but telemetry is **continuous / every-seam** (each un-instrumented path a fresh blind spot), a shape
  closer to `secure`'s every-seam wall (§10.3); (c) the coverage metric is itself a **proxy** (Goodhartable),
  tying back to **T2**. The concrete observability instance of T2.

_Structural backlog (external-review R-series; resolved ones dropped)_
- **T7 · R1 · `implement` + lifecycle stages under-derived** *(**closed — iter 33 → §10.10**: base act +
  projection; `release` = the build→operate seam → T3)*. Carve `implement`
  out of the §3 self-test (it is the **base act**, defends no stone); annotate §7 as the lifecycle
  **projection** of the derived elements; derive the genuinely-orphaned `plan` / `release`.
- **T8 · R6 · planning / predictability under-derived — the orphaned `plan`** *(**closed — iter 33 → §10.10**:
  a plan is a *schedule bet* — a time-axis projection of scope+specify, not a new element)*.
  Boundedness buys only *cost*-predictability; outcome / timing needs a **forecast / commitment**
  mechanism. New element, or scope+specify over the time axis? Reshaped by design-as-a-bet: **a plan is a
  schedule bet.** [Pairs with T7.]
- **T9 · R3 · resilience-repertoire formula cleanup** *(**done — iter 33, folded into §10.8**)*. Compact form — escalate = the
  structural up-exit; degrade / recover / roll back = in-place; add rollback to §7 OPERATE. [Folds into T3.]
- **T10 · R7 · artifacts diagram under-draws crossings** *(**closed — iter 34**; janitorial, upgraded
  iteration 29)*. **Done, both halves:** the artifacts chart now draws `reflect`'s two backward edges
  (**ADR** → *a later root-causer* = agent-face; **post-mortem** → *next iteration's define* = time-face)
  visibly crossing **both** #7 boundaries to explicit consumer nodes — with a forward edge relabelled
  *insures* — making the §9/§10.5 boundary-distance law the picture's point; and the process-flow chart
  gained the missing **`roll back`** node in OPERATE (§10.8's station). Design-doc charts synced the same
  way.

_Descoped (iteration 28)_
- **Map-model-onto-a-concrete-setup** — *removed by decision.* This canvas is the **ideal**; auditing a
  real stack (any Ouroboros / TDD / routing / gate configuration) against it is a **separate** exercise,
  kept out so the ideal is not entangled with what a given setup already has or lacks. Its still-useful
  *general* residue survives as **T2 / T3 / T4**.

_Closed (for the record)_ — **T10 (artifacts / rollback-node diagrams → iter 34)** · **T3 (change-axis regression+rollback → §10.8, iter 33)** · **T7/T8
(lifecycle-projection + plan-as-schedule-bet → §10.10, iter 33)** · **T9 (repertoire compact form → folded
into §10.8, iter 33)** · **T11 (observability silent-failure gate → §10.9, iter 33; promotion-forks open)** ·
**T5 (reflexivity → conditional 2nd-order stone #9, §3, iter 31)** · **T4
(`observe` is the forced sensor — §10.6, iter 30)** · **T1 (`reflect` is a forced MUST-HAVE — §10.5, iter
29)** · R2 (design's artifact, §10.1) · R4 (§8 bedrock line, iter 23) ·
R5 (hard gates, §10.4) · "does #8 force a 4th property" (§2, iter 24–25) · "does secure recurse every
seam" (§10.3) · "is secure the only non-gradable property" (§10.4). Full history in §13.

