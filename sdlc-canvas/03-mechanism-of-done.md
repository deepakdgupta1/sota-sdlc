## 10. The mechanism of Done — how each element's target is set

§4 said a Done is a *graded threshold on a quality range*; §5 said every element is a loop with
"its own graded target." This section derives **how that per-element target is actually set** —
and shows the mechanism is software-independent.

**Origination → propagation → termination.**
- **Origination (the root).** The top Done has no parent to inherit from; it is **elicited from
  hidden intent by `specify`** (stone #1). This is the one *contingent seed* — it cannot be
  derived, only drawn out.
- **Propagation (internal nodes).** `design` decomposes a parent Done *P* into child Dones
  {L₁…Lₙ}, one per element, each cast on the **universal four-axis schema** — *scope · reliable
  · resilient · predictable* (the same composite §4 forced at the top; it is **scale-invariant**).
  So `Done(element) = Done(parent), decomposed onto this element's slice`.
- **Termination (the leaf).** Decomposition stops where a Done is checkable *without further
  decomposition* — its `check` yields a **binary verdict** (`measured ≥ threshold`); the grading
  bottoms out into pass/fail. Two leaf kinds: **deterministic** (logic → an assertion / unit
  test) and **statistical** (an irreducible proxy → a threshold on a *sampled* value, "done with
  confidence ≥ c"). The statistical leaf is where stones #6 (uncertain) and #5 (change) keep the
  check from ever being purely deterministic — the a-posteriori residue of §11 made concrete.

**The composition hypothesis (load-bearing).** To decompose *P* into {Lᵢ} is to *assert* a
conjecture:

> **(L₁ ∧ L₂ ∧ … ∧ Lₙ) ⟹ P** — "if every part is done, the whole is done."

This is **not a deduction**; it is a **hypothesis** `design` makes, and where *P* is qualitative
("feels trustworthy," "is intuitive") it rests on **human judgment**. So *decomposition and
proxy-construction are the same act*: the conjunction of leaf Dones **is a constructed proxy**
for the parent Done, inheriting every proxy pathology from §11 (Goodhart, reality-contingent,
intent-drift). "All units pass" is a proxy for "the feature works"; the gap is the residue.

**Bottom-up verification & failure routing.** Leaves are checked directly (binary). A composite
is done iff (a) its leaves pass *and* (b) the composition hypothesis holds — the latter confirmed
at qualitative nodes by **human acceptance**. If a composite **fails acceptance while its leaves
are green**, the parts kept their promise but the whole did not → the **composition hypothesis is
falsified**. `analyze` root-causes to *that hypothesis*; `decide` **re-targets `design`** to
re-decompose — *not* the leaves. This is "non-convergence points at the target, not the build"
(§4), now **localized** to the decomposition.

**Traceability forces the hypothesis to be an artifact.** To trace a composite failure *back* to
the hypothesis that licensed the decomposition, that hypothesis must be **written** — it is the
crux of the `design` / ADR artifact (§9). Left unwritten (as it usually is), the failure is
untraceable. Stone #7 once more: persist it + make it explicit, or lose the trace.

**So — can Done be generalized regardless of the software? Yes, along a clean seam:**
- **Universal (form):** the four-axis schema, the *elicit-root → decompose → bottom-out*
  mechanism, the composition-hypothesis structure, and the *failure-routes-to-the-hypothesis*
  rule. All forced by the stones.
- **Contingent (content):** the specific thresholds, which proxies, and *which decomposition*
  `design` bets on. Only the **root** is elicited; every internal Done is **derived by
  decomposition** — yet each decomposition injects a fresh, judgment-laden hypothesis.

### 10.1 Design-as-a-bet — the composition hypothesis is cheaply, one-sidedly falsifiable (iteration 21)

If the composition hypothesis `(∧Lᵢ) ⟹ P` is design's central artifact, then **`design` is not
"draw the structure" — it is "state and defend a bet"**: a decomposition into components, the
**interface contracts** between them, and the conjecture that they compose to *P*. The reframe's
force is that this bet is **cheaply and one-sidedly falsifiable *before* the build**, via
**stub-composition**.

- **Stub-composition (the design sub-loop's own `check`).** Replace each component with a **stub**
  — its interface contract with the *behavior deleted* (right shape, computes nothing) — and check
  the stubs wire together. This is the `check` beat of the **`design` sub-loop** (the fractal, §5):
  a genuine check, yet still **a-priori** with respect to the outer build. It is **shift-left**
  (§12) aimed at the composition hypothesis itself — the earliest, cheapest place to execute the bet.
- **It discharges the *arrow*, suspends the *premises* — a conditional proof.** A green
  stub-composition tests only the **⟹** (that the contracts are *mutually coherent* — what A emits
  is what B accepts, across the graph). It is **assume-guarantee reasoning**: each stub is the
  "guarantee" half of a contract; composing them checks the guarantees *link up* while taking the
  guarantees themselves **on credit**. It is one-sided — it can only **fail cheap** (kill a bad
  decomposition) or **survive**; it never *confirms*.
- **It factors risk; it does not reduce it.** After a green stub-check, provably **zero** design
  risk lives in the wiring, and **all** of it has been relocated into two named, attackable premises:
  - **Premise A — the leaves are real** (each stub ≈ the real component). Discharged at
    **build-time `verify`** (a unit test on the real leaf) → the §10 **deterministic leaf**.
  - **Premise B — the contract holds across its *whole* value-domain** ("all permutations and
    combinations" over the interface = §4's **set of potential realities** at the seam: expected →
    reliable, adverse → resilient, enumerated → predictable). Only **sampled** at build (property
    tests), residue caught at **run-time `observe`** (telemetry) → the §10 **statistical leaf**.
- **Why stub-composition reaches *neither* premise — the single reason.** It is an **a-priori** act
  in `define`, and a **stub is a proxy for a component that does not exist yet**. Both premises are
  claims about *behavior* — the one thing a stub deletes by construction — so neither becomes a
  *fact* until the real thing is built and run. Both therefore **collapse into one root**: the
  **stub↔real (proxy↔real) gap**, unmeasurable until the real exists. This is exactly §11's seam
  (**`specify`/`define` a-priori: reason about the risk; `verify`/`observe` a-posteriori: measure
  what turned out true**) and the **proxy** thread (§10): the stub↔real gap is the
  **reality-contingent residue** of §11 — the proxy↔intent map running through reality not yet observed.
- **Where it sits in the machinery.** Stub-composition is the layer *above* Done-propagation: its
  **failure routes straight back to `design`** (re-decompose — "non-convergence points at the
  target," now at design-time), and its **survival hands the two premises *down*** to the
  deterministic (`verify`) and statistical (`observe`) leaf-checks of §10.

**R2 resolved.** §9 said `design` owns no *separate* artifact; §10 said the composition hypothesis
*must* be written — no contradiction once stated precisely: the design artifact **is** part of the
define-beat spec/target doc, and its load-bearing content is exactly **the interface contracts +
the composition hypothesis, written in a form executable as stubs**. Unwritten, a composite failure
can't be traced back to the decomposition that licensed it (§10, traceability); written-and-
stubbable, the bet is *runnable* and fails cheap.

### 10.2 The two quality bars of a good bet — "fails cheap" + "tightest-sufficient contracts" (iteration 22)

§10.1 gave design's *first* quality bar (**fails cheap**: the wiring bet is one-sidedly falsifiable
by stub-composition). The **premise-B lever** gives the *second*. Premise B — "the contract holds
across its whole value-domain" — is **not a fixed cost**; its *size* is something `design`
**chooses**, by how tight it draws each interface contract.

- **A tight contract manufactures `predictable` at the seam.** Premise B's residue *is*
  unpredictability at the interface (the unforeseen permutations), so §2's apex property
  `predictable` reappears *locally* at every contract. Tightening dials premise B between the §10
  leaf-kinds: **loose** → a domain too big to exhaust (**statistical leaf**, sampled at `observe`,
  residue > 0); **tight** → a domain small enough to exhaust (**deterministic leaf** at `verify`,
  residue → 0); **type-encoded** → illegal values can't be *constructed* (discharged **a-priori**,
  never reaching run-time). Contract-tightness sets how much of premise B is pre-paid
  deterministically at design-time vs. left as a-posteriori residue.
- **The contract governs the WHAT, not the HOW** — it constrains the leaf's observable I/O while
  leaving its interior free, which is exactly why a *stub* can stand in (keep the WHAT, drop the
  HOW) and why premises A and B were separable at all. Encapsulation, first-principled.
- **There is a floor, so the bar is *tightest-sufficient*, not *tightest*.** Even with free,
  infinite prediction, tightening past the **set of realities the leaf must serve** (§4) rejects a
  *valid* input the real need sends → the leaf returns the wrong thing / nothing on a legitimate
  reality → **`reliable` breaks** (and on the *adverse-but-valid* realities, **`resilient`**). The
  contract's domain must equal the **required set of realities — no wider** (needless premise-B
  residue) **, no narrower** (excluded reality → unreliable).
- **Synthesis — all three §2 properties re-instantiate at every seam.** The contract's *floor*
  (which realities MUST cross) = **reliable** (expected) + **resilient** (adverse); its *downward
  pressure* (how foreseeably they cross) = **predictable**. The optimum contract is **maximal
  predictability subject to admitting the whole required set of realities** — §2's three-property
  tension, projected onto the interface.

**So a good design bet meets two bars:** (1) **fails cheap** — the composition hypothesis is
stub-falsifiable (§10.1); (2) **tightest-sufficient contracts** — every interface as predictable as
possible without excluding a required reality, minimising the premise-B residue handed to `observe`
(§10.2).

### 10.3 Secure re-instantiates at every seam too — the forbidden-output wall (iteration 26)

§10.2 showed reliable · resilient · predictable reappear at every interface (the contract's **floor**:
which realities MUST cross). `secure` is the **complement, on the output side**: not "admit the whole
required *input* set" but "**forbid the whole illegal *output* set**" — a **wall / ceiling** dual to the
floor. So every seam's Done is **four**-axed, and the apex-vs-recursive question closes: `secure`
recurses exactly like the other three, along *both* axes (the §5 element-fractal **and** the §10.2 seam)
— because the decomposition tree's nodes *are* its seams.

- **It fails at the *composition* node, green leaves and all — the security composition-hypothesis.**
  A design can be insecure *no matter how correctly each leaf is built*: the flaw is in the
  **decomposition**, not the parts. Worked example — storing a credential in a repo `.env` (plaintext)
  and `.gitignore`-ing it: each leaf is green (the reader works; git *does* exclude it), yet the whole
  leaks the instant an **un-modelled egress** opens — a full-disk backup syncing the working tree to
  Drive before an OS upgrade. The forbidden output (secret readable at rest, off-box) is **reachable**,
  so the hypothesis `(∧Lᵢ) ⟹ secure` is **falsified with green leaves** → root-cause to the
  *decomposition*, **re-target `design`** (`.env` → Keychain). This is §10's "green-leaves-but-rejected
  composite" rule on the **secure** axis — proof `secure` lives at the **design / composition** node,
  not only in the leaves. (MITM is the same shape at the *network-topology* seam; SQLi is the
  leaf-level, build-stage instance.)
- **So it staffs every beat, like the other three:**

| beat | `secure` instantiation | the forbidden output it walls |
|---|---|---|
| **specify** | abuse-cases / elicit the **forbidden set** (the negative of the user story) | "must never leak PII / escalate privilege" |
| **scope** | **minimise attack surface** — every feature admitted is surface to defend (YAGNI as a control) | the unused endpoint that becomes the way in |
| **design** | a **secure decomposition** — the composition wall (the `.env` / topology example) | secret at rest · unauthenticated path |
| **implement** | injection-safe code (parameterise · output-encode) | SQLi · XSS |
| **verify** | **red-team / SAST / pen-test** — where `preempts` actually *executes* | any reachable breach, found before ship |
| **observe** | IDS · audit log · anomaly detection — the adversary is **live** and **adapts** (#8 × #5) | a breach in progress |
| **reflect** | incident response — root-cause to the **breached seam**; `decide` may **not** waive | a repeat of the same class |
| **evolve** | patch · rotate secrets · **security-regression** on every integrate | a newly-published CVE |

- **Why the recursion is *forced* — harder than for the other three.** The opponent is a **directed
  optimiser that enters at the least-defended seam**, so security of the whole is the **weakest link**,
  not the average. A single undefended stage is not a *local* degradation (as one weak leaf is for
  reliability) — it is the *whole* envelope's hole, because the attacker *finds* it and pivots. So
  `secure` cannot be defended "mostly": it holds at **every** seam or it does not hold. (And the `.env`
  leak was *accidental*, yet still a security defect — #8 assumes the residue **will** be found, so
  "unlikely to sync to Drive" is not "walled": the directed optimiser collapses the probability the
  random sampler #6 would have discounted.)

### 10.4 The hard gate — a non-compensatory leaf (iteration 27)

§10 gave `decide` three exits (**accept** a known issue · **re-target** · **escalate**). A **hard gate**
is a leaf where the **accept** exit is *deleted*. The model now says exactly *when* a leaf earns that:
**iff a single violation is *non-local* — no amount of green elsewhere buys it back (non-compensatory).**
Three amplifiers make a violation non-local:

1. **Adversarial (#8)** — a directed optimiser turns *any* hole into a whole compromise. Amplification is
   **guaranteed**, which is why **all** of `secure` is hard, wholesale (§10.3).
2. **Irreversible** — the damage escapes `recover`/`rollback` (data loss; a *leaked* secret can't be
   un-leaked), so the run-time repertoire can't undo it after the fact.
3. **Machinery-degrading** — the violation blinds the loop's own `check`/`observe`, or couples leaves so
   one corrupts another: a swallowed error (no signal), an un-instrumented call (no telemetry), a
   retrofitted test (can't falsify), a mutation (shared-state coupling). Non-local *by construction* —
   it disables the very thing that would have caught it.

**This resolves the parked question.** `secure` is **not** the only non-gradable property — it is the
only one hard **wholesale**; `reliable`/`predictable` stay graded *except* at their irreversible or
machinery-degrading leaves. Non-compensability is the general phenomenon; a *guaranteed* amplifier is
what promotes a whole property to hard.

**The predictive rule (the whole R5 residue, derived not asserted).** To classify *any* candidate
constraint, ask: **"is a single violation *non-local* — adversary-amplified, irreversible, or does it
blind the loop?"** Yes → **hard gate** (delete `decide`'s *accept*). No → **graded target** (keep
`decide`'s discretion). Corollary: a *graded proxy* mis-declared a gate (e.g. a coverage % — a
statistical-leaf proxy, §10 / §12) invites Goodhart; and a hard gate with **no amplifier** behind it is
mis-typed. This rule is exactly what the ideal stack uses to decide *which* leaves are gates.

> **Scope note (iteration 28).** This canvas derives the **ideal MUST-HAVE** stack only. Auditing any
> *concrete* setup against it — labelling real rules, finding a given stack's undefended stones or
> vestigial ceremony — is a **separate exercise**, deliberately kept out so the ideal stays
> uncontaminated by what a setup happens to have. The *general* questions such an audit surfaces
> (proxy-vs-gate, the change-axis machinery, observability-as-sensor) live as open tracks in §11.

### 10.5 `reflect` is the forced-MUST-HAVE beat — its artifact is the loop's only *backward* channel (iteration 29)

**T1, closed.** The question was: *what must the ideal `reflect` produce, and is that output forced
non-optional?* Answer: `reflect`'s output — the **reflect-output** artifact of §9 (**ADR** + **post-mortem**)
— is a **forced MUST-HAVE**, gated by the **machinery-degrading** amplifier (§10.4). The proof runs the
artifact's *absence* in the two directions `reflect` feeds, and both break as the **same** failure.

- **Within the loop — the *agent* crossing.** A composite fails acceptance with **green leaves** (§10): the
  parts kept their promises, so the fault is in the **composition**, not any leaf. Root-cause is therefore
  *"recover the composition hypothesis `(∧Lᵢ)⟹P` and find which assumption it lost"* — that hypothesis is
  the **sole** object `analyze` has (green leaves say where the fault *isn't*, never where it *is*).
  Unwritten, it was **intent-hidden** at birth (#1) and **perished** at the design-moment (#7), so `analyze`
  has **no input** — not a *slower* root-cause but a **starved** one (the symptom fits a dozen lost bets and
  nothing on hand separates them). `reflect` can't run its analyze half; it **collapses into `check`** ("we
  know it broke," not *why*).
- **Into the next loop — the *time* crossing.** The same failure-class returns. With no durable post-mortem
  the loop meets it as novel and re-pays the whole discovery cost (re-trigger → re-analyze — *if it even
  can* → re-decide): it **re-derives instead of remembering**. And the Ouroboros **evolve** edge (§7/§8),
  which re-targets `define` from accumulated lessons, has reflect-output as its **only** feed — unfed, the
  loop **cannot raise its own floor**. The recurrence is not bad luck but **structural**: a circle, not a
  spiral.
- **Same failure, not a coincidence — one stone, two faces.** §9/#7 forces artifacts because a loop's
  information must cross **time** (perishable) *and* **agent** (distributed) — §3 spells #7 as exactly those
  two faces. The two directions *are* those faces: the **ADR** is the agent-face carrier (design-moment →
  analyze-moment), the **post-mortem** the time-face carrier (this iteration → next). Deleting reflect's
  artifact re-opens **precisely the two gaps stone #7 says are always open unless an artifact bridges them**
  — one transient-output failure, refracted through the two boundaries of one stone.
- **Why forced *hardest* — the backward-feed proof (the §9 boundary-distance law at its extreme).** Every
  forward beat can hand its output off **live** to the next beat in the same iteration, so its artifact
  merely *insures* against later crossings. `reflect` is the **only backward-feeding beat**: its consumers
  (a later root-causer; a future `define`) are across a #7 boundary *by construction*, so its artifact is
  the **sole channel**, not insurance — omit it and the output reaches **no one**. *Backward-feeding ⟹ every
  consumer is across a #7 boundary ⟹ the artifact is mandatory.* This is the very asymmetry that makes
  `reflect` the loop's only *learning* beat: what loops backward is exactly what must be made durable.
- **Classification (via §10.4).** The harm is not one bad local artifact; it **disables the loop's own
  correcting machinery** — `analyze` can't root-cause a composite, `evolve` can't raise the floor. That is
  amplifier #3 (**machinery-degrading**, "disables the very thing that would have caught it") to the letter:
  skipping the artifact silently demotes `define→do→check→reflect` to **`define→do→check`** — a loop that can
  **detect** failure but neither **explain** it (dir 1) nor **prevent its recurrence** (dir 2). One skipped
  artifact costs not one lesson but the **beat**. Non-compensatory ⇒ `decide`'s **accept** is deleted ⇒
  **hard gate**. *(Secondary amplifier on the agent side: the **capture window is irreversible** — the
  hypothesis perishes at the design-moment (#7), so unlike a re-runnable test the chance to persist it never
  returns.)* §10.3's `reflect` row already gated this **wholesale on the secure axis** ("`decide` may **not**
  waive | a repeat of the same class"); T1 generalizes that instance to `reflect`-as-such.

### 10.6 `observe` is the forced sensor — telemetry detects the a-posteriori residue no test can reach (iteration 30)

**T4, closed.** T4 pressed the **T1 coupling** and it held with a twist. `analyze` (root-cause) is a
**comparison** — *intended vs actual* — the same shape §12 gives `verify` ("can't verify against
nothing"). T1 forced the *intended* operand (the ADR/bet, §10.5); T4 forces the **actual** operand — the
**run-time telemetry** `observe` emits — and telemetry turns out to do **two jobs**, so its absence bites
**one beat further upstream** than the ADR's.

- **The failure class `observe` owns has no test, by construction.** `verify` (build-time, stone **#4**)
  checks the composition hypothesis against the realities *enumerated at build*; anything it can catch
  fails *before* ship. `observe` (run-time, stone **#6**) exists for the **a-posteriori residue** —
  premise-B's unmodelled realities (§10.1), the Goodhart / reality-contingent / intent-drift gaps (§11)
  that `verify` **provably cannot** reach. So for the failure `observe` is the sensor *for*, there is **no
  build-time test**: if one existed it would have failed at build and never shipped.
- **Without telemetry the loop is blind, not merely un-diagnostic.** Worked example: an unhandled network
  timeout renders a blank page. `verify` is green (it never modelled the timeout — an adverse reality that
  should have tripped `degrade`, §6, but didn't). Who knows it broke? The **end user** — but *the user
  knowing ≠ the loop knowing.* Their pain is a signal trapped in a head (stone #7 again: perishable +
  distributed, no artifact); it reaches the loop only if they **report** it — lossy ("it's broken"),
  delayed, *usually never* (they churn). So the fallback sensor for `observe`'s whole class is **the
  users' suffering**: detection becomes *probabilistic* (silent churn), *non-diagnostic* (no WHY), and it
  crosses the agent boundary with nothing written. **Telemetry is the loop building its own `observe`
  instead of outsourcing detection to whoever gets hurt.**
- **Two jobs ⇒ two beats blinded.** Telemetry is (a) `observe`'s **input**, so it is what lets the
  run-time `check` fire at all → **THAT** it broke; and (b) `analyze`'s **actual operand** → **WHY** it
  broke. The ADR starved *one* beat (`analyze`); missing telemetry blinds `observe` **and** starves
  `analyze` — same amplifier (**machinery-degrading**, §10.4, which names "un-instrumented call (no
  telemetry)"), one step deeper: *you cannot diagnose a failure you never detected, and you cannot detect
  the residue without the sensor.*
- **Classify by the stone, not the station.** `verify` and `observe` are **both** the `check` beat; filed
  by *where they run* they look interchangeable, which is the trap ("a check will catch it"). Filed by the
  **stone each defends** they are non-substitutable — `verify`/#4 (*did we build what we specified?*) is
  structurally **blind** to `observe`/#6 (*did reality match what we modelled?*). This is T4's second
  claim, and it is the antidote to the substitution slip.
- **The coupling, pressed to the floor — senses vs memory.** ADR and telemetry are not two separate
  "floors"; they are the **two operands of one comparison** in `analyze` (intended · actual), and that one
  diff feeds *both* re-target (this loop) and evolve (next loop). So: **T1 forced the loop's *memory*
  (reflect-output); T4 forces the loop's *senses* (observe/telemetry).** §11 already says the loop exists
  *only* because of an irreducible a-posteriori residue (else it collapses to a single forward pass); to
  handle that residue it needs an organ to **sense** it and one to **remember** it, and *sense ⊳ diagnose
  ⊳ remember* — telemetry is upstream of the ADR. Remove either organ and the loop slides back toward an
  open forward pass: **blind** (no T4) or **amnesiac** (no T1). This closes the `observe`/#6 "thin climax":
  `observe` is the sense-organ for the very residue that makes the loop a loop.
- **What is forced vs. what is graded (the gate's shape).** The **forced MUST-HAVE** is that `observe`
  **owns a real sensor of its own** — the loop may not outsource detection to the user; an *empty*
  `observe` is machinery-degrading. But *how much* to instrument is a **graded target** (more coverage =
  higher confidence, diminishing returns) — an instance of the T2 proxy-graded-not-gated pattern — with
  **hard gates only at non-compensatory seams** (a path whose *silent* failure is irreversible,
  adversary-amplified, or itself machinery-degrading, §10.4). So `observe`-instrumentation is **not**
  wholesale-hard like `secure` (§10.3): the *existence* of the sensor is the forced floor; its *coverage*
  is graded, gated only where blindness is non-local. [Deferred deep-dive: **T11**, §11.]

### 10.7 The inward base case — ceremony is reducible where the stone is absent (iteration 32)

**Backported from the design doc's Ch 6.4.** The fractal (§5) nests *inward* — each element is its own
`define → do → check → reflect`. Ch 6.4 forced the cost question: *is that full ceremony always
MUST-HAVE?* Derived answer: **no.** A beat is a **response to a stone** (§3); where the stone is absent
for a node, the beat it forces adds **zero information**, and running it is pure cost — so the inner loop
**collapses toward bare `do`.** This *generalizes* the loop's known collapse (§11/§12: "degrades toward a
single forward pass") from the `reflect`/`observe` pair to **all four beats**:

- `specify` collapses when the target is already unambiguous & singular (no #1) · `scope` when the whole
  fits budget uncut (no #2) · `design` when the work is atomic — one step, no parts (no #3).
- `verify` collapses when the step is provably correct / cheap-to-redo (no #4) · `observe` when reality is
  fully modelled — no residue (no #6).
- `analyze` collapses when it converges first-try — no gap (no #4) · `decide` when exactly one exit is
  possible (no #2).
- The residue is **bare `do` = `implement`**, the base act that defends no stone (T7) — the **inward leaf**.

**Two base cases, one per fractal axis (duals).** *Outward* depth already terminates in §10 (split stops
at a leaf `check` can judge without splitting). *Inward* ceremony stops here (run a beat only while its
stone bites). The fractal hits bedrock on both.

**The collapse is itself a `decide`.** Ceremony is **insurance**: weigh its cost against
`P(undetected error) × cost(error)`, and skip the premium when the covered loss is small or improbable —
the same *tightest-sufficient* move as §10.2 (pay just enough to admit the required realities → *run just
enough loop to cover the residual risk*). A **graded** target (§10.4) is precisely one whose premium is
negotiable.

**Two overrides delete `accept` / forbid collapse** (both already derived):

1. **Hard gate (§10.4)** — a *non-local* violation (adversary-amplified · irreversible ·
   machinery-degrading). The adversary removes the "low-stakes / cheap-to-redo" premise, so `secure` work
   (§10.3) can't be reduced. Self-referential gates: skipping `observe` (§10.6) or the written
   `reflect`-artifact (§10.5) is *itself* machinery-degrading — beats about the loop's **own machinery**,
   non-waivable at any cost.
2. **Non-convergence (§4).** A step judged trivial that keeps failing falsifies the judgement "no stone
   bites here" → a hidden stone is present → **re-expand**. Non-convergence-as-signal now also polices the
   reducibility bet.

**Net — ceremony is proportional, not fixed:** pay it where a stone bites, buy it down where none does,
*except at the gates,* where a single miss is uncompensable and the premium is not yours to negotiate.
This supplies **T2** its general frame (**graded ⇒ collapsible ceremony · gated ⇒ non-waivable**); the
fine-grained *which-seam-is-gated* classification stays the open residue (T2 / T11).

### 10.8 The change-axis machinery — regression (memory-ratchet) & rollback (reversibility net) (iteration 33)

**T3, closed.** Stone #5 (change) bites the over-time loop in **two** time-faces, forcing two dual organs —
the #5 counterpart of the #6 pair `degrade`/`recover` (§6).

- **Face 1 — change re-opens closed holes.** Every later `do` (#4) can silently re-introduce a fixed
  failure-class *F*. Run §10.5 on this face: the fix's lesson perishes (#7) unless persisted, and a *prose*
  post-mortem is a **passive** memory that degrades to "re-derive, not remember" under continuous change. To
  fire **automatically on every future iteration** it must be persisted not as prose but as a **re-runnable
  check** — the post-mortem's WHY compiled into `verify`. That is a **regression test**: *the executable
  time-face of the §10.5 reflect-artifact* — the forced **`reflect → verify` bridge**, not a new element (cf.
  the `decompose → design` fold). It **accumulates monotonically** (each *F* adds a guard, none dropped): the
  ratchet that makes fixes *stick*, turning the Ouroboros from a **circle into a spiral** (§10.5). **Gate:**
  the ratchet's *existence* is a **hard gate** — deleting the loop's memory-of-fixes is **machinery-degrading**
  (§10.4), inheriting §10.5's gate exactly (**not** irreversibility); its *coverage* is a **graded** proxy
  (Goodhartable → T2), hard only at non-compensatory seams (the §10.6 shape).
- **Face 2 — change lands on a live system.** A bad deploy/migration degrades a *currently-working* system,
  and the fault is *in the new artifact itself*, so the #6 in-place responses miss (redundancy just runs more
  copies of the bad version; degrade just serves less of the broken thing). The only restoring move is
  **backward in version-space — rollback**: forced by #5 (change lands live) + #6/#4 (harm is a-posteriori,
  §10.6) + #7 (a live system's value is *perishable* — breakage accrues cost every moment, and the
  forward-fix is too slow to stop the bleed).

**Rollback ⟺ the irreversibility amplifier are dual.** §10.4 *defines* that amplifier as "damage escapes
recover/**rollback**," so **irreversibility ≡ the region beyond rollback's reach.** Hence:
- **Reversible** (rollback reaches it) ⇒ a bad outcome is recoverable ⇒ `decide` keeps its **accept**
  discretion ⇒ **graded** (the §10.7 insurance: rollback makes `cost(error)` small ⇒ negotiable premium).
- **Irreversible** (rollback's reach ends — destructive migration · secret exposure · sent message ·
  irreversible payment) ⇒ the insurance has lapsed ⇒ **accept** deleted ⇒ **hard gate**, discharged as a
  *pre-execution* control (backup · reversible-migration check · staged rollout · confirmation).

So **rollback itself is a *graded* repertoire response; the hard gate falls at rollback's *limit*.** The
§10.4 irreversibility amplifier gets its concrete home here.

**The inversion (the sharpest result).** The two organs point opposite ways along the same time axis and
gate via *different* amplifiers: **rollback keeps *code changes* reversible** (gate at its irreversible
*limit*); **regression keeps *lessons* irreversible** (gate on the ratchet's *existence*,
machinery-degrading). You want bad changes not to stick and good fixes not to un-stick — which **corrects
T3's own guess** that both halves gate "via irreversibility": only rollback's does.

**They manufacture `resilient`'s "over time" clause (§2).** The 2×2: contexts/#6 → withstand `degrade`,
recover `recover`; over-time/#5 → recover **rollback**, stays-recovered **regression**. Without regression
the envelope is *momentary* — it leaks every time change re-opens an old hole; regression is what makes it
*hold over time*. **Stations:** regression fires in **BUILD/verify** (the integrate gate); rollback fires in
**OPERATE** (run-time). *(Optional corollary — reversibility-as-design-investment: since rollback's reach
**is** the graded region, the ideal loop **widens the reversible envelope** — expand-contract migrations ·
flags · immutable deploys — to shrink the irreversible-gate residue: the change-axis "tightest-sufficient"
(§10.2) / "fails cheap" (§10.1).)*

**T9 (resilience-repertoire compact form), folded in.** The four responses have a 2-part structure:
**escalate = the one *structural up-exit*** (it leaves the loop → parent / §4 human terminal; forced by
"loop can't converge"), while **degrade · recover · roll back = *in-place*** — three axes of graceful
degradation distinguished by *what they trade for liveness*: degrade trades *completeness* (#6), recover
trades *spares/redundancy* (#6), roll back trades *newness* (#5). degrade/recover are the **#6 context
pair**; rollback (+ regression, at build-time) the **#5 time pair**.

### 10.9 Observability coverage — the silent-failure gate & telemetry's every-seam emission (iteration 33)

**T11, closed** (§10.6 deferred this deep-dive to here; three candidate promotions are parked as forks in
§11). §10.6 fixed the *shape* — `observe` must own a sensor (existence forced, machinery-degrading), while
*how much* to instrument is graded, gated only at non-compensatory seams. The depth, in three parts:

- **(a) The gate rule is §10.4 with one substitution — "silent failure" for "violation."** The object
  classified is not "the path fails" but "the path fails *and emits no telemetry*." A seam's instrumentation
  is a **hard gate iff its silent (un-observed) failure is non-local**, via the three amplifiers under that
  substitution: **irreversible-seam** (the unseen loss *compounds while unseen* — detection-latency *bounds*
  it; the sensor is the only lever between the first unit of loss and an unbounded one), **adversarial-seam**
  (a security-relevant signal — auth · privileged action · trust-boundary — **inherits** `secure`'s wholesale
  every-seam wall (§10.3): the blind spot *is* the attack surface), **machinery-seam** (a path carrying the
  loop's *own* control signal — sensor health · gate-firing · escalation trigger — whose silent failure
  **blinds the loop to its own blindness**). *Test:* "failed + emitted nothing → irreversible /
  adversary-amplified / self-blinding?" **Else graded** — coverage ∝ `P(silent failure) × cost`, collapsible
  to zero where #6 is absent (§10.7: nothing to detect on a fully-modelled, reversible, local path).
- **(b) Emission character is forced by the carried fact's temporal type.** The ADR (§10.5) carries a
  **static point-fact** (the design bet, true/false at *one* moment; #7 forces capture *then*, but **one
  write suffices permanently**) → **one-shot, single-locus**. Telemetry carries a **dynamic envelope-fact** —
  "does reality keep matching the model?" — which #5/#6 **regenerate on every execution** and whose location
  is **unknown a-priori** (that is what "a-posteriori" means) → **continuous, every-seam**. So each
  un-instrumented path is a *standing* blind spot, re-exposed every run — giving observe-coverage `secure`'s
  **every-seam form** (§10.3), but for a *different reason*: not a directed optimiser *hunting* the hole, but
  the residue *landing* on the path you didn't model. The **opponent** splits the verdict — across the
  majority it is a **blind sampler** (#5/#6 → `resilient`-shaped → **graded**, point-gated only where rule (a)
  makes it non-local); at the security seams of (a) it is **directed** (#8) and collapses to `secure`'s
  **wholesale** wall. "Instrument once" is *category-incoherent*: the fact to be sensed did not exist at
  instrument-time.
- **(c) Coverage-% is a Goodhartable statistical-leaf proxy** for the true target — "can we actually *detect
  the residue* when it surfaces?" The two come apart: 100 % "coverage," still blind — the signal is *wrong* (a
  log that says "entered function," not "output correct-for-intent"), *unmonitored* (emitted, but nothing
  alerts on it — a log no one reads is #7 again), or *drowned* (alert fatigue). So **gate the *per-seam
  binary* signal** ("does named seam *S* emit detector-grade signal σ?" — a deterministic, binary fact about
  a named path, from rule (a)) and **grade the *aggregate* — never gate the roll-up** (gating "≥ 90 %
  coverage" diverts effort to the *cheap* paths and starves the residue-bearing ones rule (a) says to gate).
  This is the concrete resolution of **T2**'s long-open "deterministic-gate vs must-stay-graded-proxy" seam,
  for observability: **gate the per-seam binary, grade the aggregate.**

### 10.10 The lifecycle is a projection; a plan is a schedule bet (iteration 33)

**T7 + T8, closed.** Two results — what §7 *is*, and what `plan` *is*.

- **`implement` is the base act; §7 is a projection (T7).** Every §6 element earns its seat by neutralising
  one stone (specify←#1 · scope←#2 · design←#3 · verify/analyze←#4 · observe←#6 · decide←#2 · version←#5).
  `implement` is the **sole exception** — its "forced by" column reads *"(the build itself)."* This is **not**
  a self-test violation: the stones make *governing* an act hard and force the scaffolding beats built
  *around* it; `implement` **is that act** — the **operand the loop controls** (the plant, not the
  controller), which rests on no difficulty because it *is* the thing made difficult (§10.7's inward leaf).
  So the §3 self-test's first direction (*element on no stone ⇒ a missing stone*) gets **one licensed
  exception — the base act** — which makes the test *sound* rather than flag a false positive. The §7
  lifecycle is then the §6 elements **projected onto wall-clock at product scale**, in execution order — a
  *view*, not new primitives, with **four node-kinds**: *control-elements* (discover/define/design/verify →
  §6), the *base act* (BUILD → `implement`), a *seam* (`release`, the build→operate hand-off — the base
  **transition**, whose governance is the derived #5 machinery of §10.8, → T3), a *phase-loop* (OPERATE →
  observe + repertoire), and the *Ouroboros* (evolve → reflect@product). Only control-elements are
  stone-defended primitives; reading nine stages as nine primitives double-counts.
- **A plan is a schedule bet (T8).** §2's `predictable` conflates three things. Boundedness (§4) buys only
  **cost-predictability** (the loop terminates within a bound); **outcome**-predictability is bought by tight
  contracts (§10.2); **schedule/timing** — "call *when* it ships" — is an **aggregate over the time axis**
  (the *envelope* family's axis), **not** the §2 *point*-property, so it needs its own mechanism. That
  mechanism is a **schedule bet**, the time-axis twin of the design bet (§10.1): `plan` decomposes the
  deliverable *over time* into time-boxed tasks + milestone contracts and asserts **`(∧ task i lands in slot
  tᵢ) ⟹ ship S by D`** — the `(∧Lᵢ) ⟹ P` shape, new axis. Two identities fall out: **an estimate is the stub
  of a task** (shape/duration kept, work deleted), and **critical-path / capacity feasibility is
  stub-composition on the time axis** — a-priori, one-sided (infeasible → re-plan · or internally-consistent,
  never confirming delivery). It factors risk into **premise A** (each estimate real → checked per-task at
  completion, verify-like; #4) and **premise B** (the schedule holds across the whole space of futures →
  residue at OPERATE velocity/slip, observe-like; #5/#6); failure ⇒ **re-plan** (re-target). So `plan` is
  **`scope`+`specify` projected onto the time axis** — no new stone ⇒ **no new element** (exactly as
  design-as-a-bet revealed the *character* of #3's `design` without minting a primitive). The **forecast** is
  this bet's premise B (`predictable`'s a-priori face, the twin of `specify` for `reliable`); the
  **commitment** is the written schedule bet as a #7 artifact crossing the agent boundary so others can plan
  around it. **Gate:** its *existence as a written baseline* is a **hard gate** (no baseline ⇒ a slip is
  *undetectable* — "on-time" was never recorded — blinding the loop's own schedule-check ⇒
  machinery-degrading, the §10.5 argument); its *content* (the dates) is a **graded** statistical-leaf proxy
  (hard-gating a forecast invites Goodhart — cut scope/quality to "hit the date"; T2). **plan : predictable
  :: ADR : reliable.**

**The convergent law (found independently by tracks T3, T11, T7/T8).** Across the **ADR** (`reliable`,
§10.5), **telemetry** (`observe`, §10.6/§10.9), the **regression ratchet** (`resilient`, §10.8), and the
**plan** (`predictable`, above), the *same* shape recurs: the forced artifact's **existence is a hard gate**
(its absence is machinery-degrading — it blinds the loop's own `analyze`/`check`), while its **fidelity /
coverage / content is a graded, Goodhartable proxy**. The intended-operand that `analyze` compares against
must **exist** (non-waivable) but need only be **as accurate as the residual risk warrants** (negotiable).
**plan : predictable :: ADR : reliable :: regression : resilient :: telemetry : observe.** (Promoted to §12.)

