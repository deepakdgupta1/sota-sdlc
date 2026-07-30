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

**Every entry here is accepted.** There is no status field. Unresolved work lives in `ROADMAP.md`;
rejected ideas appear only where they explain why a surviving piece has its shape. The **Tier E model
repairs are not applied to this snapshot** (Appendix C says so plainly), so no entry below should be read
as having repaired them.

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

### <a id="r-bedrock-01"></a>R-BEDROCK-01 · The bedrock is a pressure-tested taxonomy, not a proof

- **Decision.** The bedrock is a **derived, pressure-tested hazard taxonomy with an explicit admission
  criterion**. A pressure earns a seat when it is a brute fact (not a contingent choice), it forces a
  response the existing stones do not already force, and it survives the three-direction self-test.
  Claims of *proven* exhaustiveness — "exactly eight first-order stones", "exactly two second-order
  seats" — are **retracted**. Every stone stands.
- **Why.** The document itself grants that the pressure→response relation is many-to-many, so the
  bundling rule cannot function as an identity criterion; it is a **self-test heuristic**. A count
  derived from a heuristic is a well-tested judgment, not a theorem. Stating it as a theorem is the one
  overclaim that discredits the whole model on contact with a serious reviewer — and stating it as a
  criterion instead makes the taxonomy *falsifiable*, which is stronger, not weaker: a candidate
  eleventh stone is now admitted by meeting the criterion rather than excluded by a closed count.
- **Governs.** `docs/snapshot/03-bedrock.md`, `docs/snapshot/13-appendices.md#appendix-b-the-stones-to-responses-matrix`.
- **Trace.** `ROADMAP.md` §3 · E12 · `sdlc-canvas/01-bedrock-atom-fractal.md`.
- **Superseded.** "The bundling rule establishes exactly eight first-order stones." Retracted 2026-07-30.
  This does **not** reopen canvas track T6, which closed the pressure-test; it corrects the *epistemic
  status* of the count, not its content.

### <a id="r-bedrock-02"></a>R-BEDROCK-02 · The bundling rule, and why #7 is one stone but #5/#6 are two

- **Decision.** Two faces of a pressure are **one** stone only if they share a *single* forced response.
  "Distributed" and "perishable" therefore fold into stone #7 — both are answered by *artifacts* —
  while "change" (#5) and "uncertain" (#6) stay siblings, because they are answered by different
  machinery.
- **Why.** Without a bundling test the taxonomy double-counts: any pressure can be described at two
  granularities, and a model that admits both descriptions inflates without adding predictive power.
  The shared-response test is the cheapest available discriminator that is about the *model's own
  obligations* rather than about wording.
- **Governs.** `docs/snapshot/03-bedrock.md`.
- **Trace.** `sdlc-canvas/01-bedrock-atom-fractal.md` — the bundling rule (T6).
- **See also.** [R-BEDROCK-01](#r-bedrock-01) — the rule is a heuristic, so it cannot close the count.

### <a id="r-bedrock-03"></a>R-BEDROCK-03 · The second-order tier, and the two folds it rests on

- **Decision.** Stones #9 and #10 sit on a formalized **second-order tier**, where *order = the arity of
  the stone's referent*: first-order stones are monadic (solver × world — so "we err" (#4) stays
  first-order), second-order stones are relational (solver × solver, or solver × self). The tier has
  **two seats** — independence (#9) and alignment (#10) — because the loop makes two silent assumptions
  about the minds it delegates to: that the checker is independent, and that the doer is faithful.
- **Why.** The partition is not cosmetic: it *predicts* the class's shape. Second-order stones are
  relational, **conditional** (they collapse to nothing when one aligned mind does everything), and they
  erode a point-property by breaking a staffing assumption rather than by making the problem harder.
- **Governs.** `docs/snapshot/03-bedrock.md`, `docs/snapshot/12-agentic-sdlc.md`.
- **Trace.** `sdlc-canvas/01-bedrock-atom-fractal.md` · `sdlc-canvas/05-laws-and-insights.md`.
- **Superseded.** Two candidate third seats were **judged** to fold rather than open: a delegate's
  **capability** folds to #4 (monadic), its **liveness** to #7. Both are judgments under the admission
  criterion, **not** passing assertions, and their residue is *not yet recorded* — capability's forced
  responses (routing, decomposition, tool acquisition, capability selection, escalation) are not #4's
  verify-and-analyze, and liveness's (budgets, timeouts, checkpointing, durable execution) are not #7's
  artifact. Whether the folds are adequately argued is **Q10** in `ROADMAP.md` §8 — open.

### <a id="r-bedrock-04"></a>R-BEDROCK-04 · Stone #10, incentive-divergence, is admitted

- **Decision.** A tenth stone — **incentive-divergence**, the *willful* face of a delegated doer serving
  its own payoff — is admitted as conditional and second-order, taking the alignment seat beside #9.
- **Why.** It is irreducible to what was already there: not #1 (a known-but-unwanted objective is not a
  hidden intent), not #4 (a *choice* is not a mistake), and not #9 (an echo-chamber checker is
  epistemically blind, whereas a self-serving doer is conatively misaligned — they force different
  responses, so by the bundling rule they are siblings). It closed the bedrock pressure-test, canvas
  track T6, at iteration 35.
- **Governs.** `docs/snapshot/03-bedrock.md`, `docs/snapshot/12-agentic-sdlc.md`,
  `docs/snapshot/01-system-at-a-glance.md`.
- **Trace.** `sdlc-canvas/01-bedrock-atom-fractal.md` · `sdlc-canvas/06-iteration-log.md` iteration 35.

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
  toward bare `do`** wherever its stone is absent — except at a gate, which never collapses.
- **Why.** Ceremony is insurance against a specific hazard. Where the hazard is absent the premium buys
  nothing, and a model that demanded full ceremony everywhere would be self-refuting: it would spend the
  finite resources that stone #2 says are scarce. The collapse rule is what makes the ideal *affordable*
  without making it optional where it matters.
- **Governs.** `docs/snapshot/06-fractal.md`.
- **Trace.** `sdlc-canvas/03-mechanism-of-done.md` §10.7 — the inward base case.
- **Open.** The granularity at which the existence-gate attaches is **not** settled here; §6.4's collapse
  rule and §11.2's convergent law disagree at collapsed nodes. That is E4 in `ROADMAP.md` §3, gated on Q7.

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

### <a id="r-done-01"></a>R-DONE-01 · Design is a bet, and stub-composition tests it cheaply

- **Decision.** A design is a **bet** with stated premises; stub-composition is the cheap early test of
  the bet's wiring, and the premise-B lever tunes how much an interface contract promises.
- **Why.** A design's failure mode is not "wrong code" but "wrong decomposition", discovered late. Making
  the premises explicit converts a late structural failure into an early, checkable one.
- **Governs.** `docs/snapshot/09-mechanism-of-done.md`.
- **Trace.** `sdlc-canvas/03-mechanism-of-done.md` §10–§10.2.
- **Open.** Whether the contract set, even if perfectly honoured, delivers the property is a **third**
  premise not yet stated — E2 in `ROADMAP.md` §3. Until it lands, "green stubs discharge the
  implication" is circular as written.

### <a id="r-done-02"></a>R-DONE-02 · A formal proof relocates the blind spot; it does not remove it

- **Decision.** Formal proof is a check modality that **relocates** the reflexivity blind spot from the
  code into the specification. It does not escape it, and it does not make a check non-Goodhartable.
- **Why.** Two independent arguments converge. Internally, stacking correlated checkers cannot multiply
  into confidence — there is a common-mode floor of shared error that iteration never crosses, and a
  proof shares the specification's error. Externally, models have been observed **Goodharting a formal
  verifier**: exploiting weak formal specifications instead of implementing the intended solution.
- **Governs.** `docs/snapshot/12-agentic-sdlc.md`, `docs/snapshot/09-mechanism-of-done.md`.
- **Evidence.** arXiv 2605.30914, *Automating Formal Verification with RL and Recursive Inference*
  (Max Tan, 29 May 2026) — reports "specification hacking", where "models exploit weak formal
  specifications instead of implementing the intended solutions" (Dafny 9.7%→31.1%, Lean 46.2%→69.2%).
  Accessed 2026-07-29. *The paper was originally cited here under an inaccurate title; the label was
  wrong, the content does support the claim.*
- **Trace.** `docs-history-2026-07-30:REVIEW-ASSESSMENT-2026-07.md#4-verification-log` row 12 ·
  `docs-history-2026-07-30:sdlc-evolution-ideas.md#a3-formal-verification`.
- **Superseded.** "A formal proof is non-Goodhartable, and drives premise B to zero." Retracted: it
  contradicted this snapshot's own text, which already said a proof only relocates the blind spot.
- **Open.** Extending the leaf taxonomy from {deterministic, statistical} to include formal, simulated,
  human-experiential and runtime-assured modalities — each with its own residue and Goodhart surface —
  is E13 in `ROADMAP.md` §3, not applied here.

### <a id="r-gate-01"></a>R-GATE-01 · A rule is a hard gate iff one violation is non-local

- **Decision.** A rule is a **hard gate** (non-waivable) iff a *single* violation is **non-local** —
  adversary-amplified, irreversible, or machinery-degrading. Otherwise it is a **graded target**.
  Gates are non-compensatory: strength elsewhere cannot buy a pass.
- **Why.** Grading assumes violations average out, which holds only when each one is local and
  recoverable. Each of the three amplifiers breaks that assumption in a different way — an adversary
  chooses the seam, irreversibility removes the retry, and machinery damage disables the loop that
  would have caught the next fault. Where averaging fails, a threshold is the only honest instrument.
- **Governs.** `docs/snapshot/11-hard-gates-vs-graded.md`, `docs/snapshot/09-mechanism-of-done.md`.
- **Trace.** `sdlc-canvas/03-mechanism-of-done.md` §10.4.
- **Open.** Two repairs are pending and both are visible in the current text. `secure` is stated as
  "hard, wholesale", which is not machine-evaluable and taken literally blocks every release; and
  exogenous (legal or contractual) authority is not yet placed. Those are E3(a) and E3(b) in
  `ROADMAP.md` §3, the latter gated on Q6 and Q9.

### <a id="r-gate-02"></a>R-GATE-02 · Gate the per-seam binary, grade the aggregate

- **Decision.** For observability, the **per-seam binary** — can this seam fail silently? — is gated,
  while **aggregate coverage and fidelity** are graded.
- **Why.** A silent failure defeats the sensor's whole purpose, and one silent seam is not compensated
  by richer telemetry elsewhere, so it is non-local. Coverage depth, by contrast, does average out.
  Splitting the two settles the apparent conflict between "observability is graded" and "silent failure
  is unacceptable" without weakening either.
- **Governs.** `docs/snapshot/11-hard-gates-vs-graded.md`.
- **Trace.** `sdlc-canvas/03-mechanism-of-done.md` §10.9 (canvas track T11).
- **Open.** The fully general, cross-domain gate-versus-graded classification rule is canvas track
  **T2**, still open — the observability case is settled, the general case is not.

### <a id="r-gate-03"></a>R-GATE-03 · The convergent law — existence-hard, fidelity-graded

- **Decision.** Every forced artifact obeys one law: **its existence is gated, its fidelity is graded.**
  `plan : predictable :: ADR : reliable :: regression : resilient :: telemetry : observe`.
- **Why.** The four instances were derived independently and landed on the same shape, which is what
  promotes a pattern to a law. It also explains why the model resists both failure modes at once:
  demanding perfect artifacts would be unaffordable ceremony, while allowing an artifact to be *absent*
  would silently delete the property it carries.
- **Governs.** `docs/snapshot/11-hard-gates-vs-graded.md`, `docs/snapshot/10-artifacts.md`.
- **Trace.** `sdlc-canvas/05-laws-and-insights.md` §12.

### <a id="r-artifact-01"></a>R-ARTIFACT-01 · Stone #7 forces artifacts, and distance sets their cost

- **Decision.** Artifacts are the forced, persistent carriers of a loop's target, result and lesson
  across the **time** and **agent** boundaries. The **boundary-distance law** says the further a fact
  must travel, the more explicit it must be made.
- **Why.** Knowledge is scattered and perishable (#7). A fact that stays in one head at one moment is
  unavailable to the next loop, so the response cannot be a practice — it must be a *thing* that
  outlives the beat that produced it.
- **Governs.** `docs/snapshot/10-artifacts.md`.
- **Trace.** `sdlc-canvas/02-elements-flow-circuit-artifacts.md` §9.
- **Open.** Whether the agent context window is a *third* boundary — an **attention** boundary, where a
  fact is explicit and even in memory but cannot be attended to — is Q4 in `ROADMAP.md` §8.

### <a id="r-artifact-02"></a>R-ARTIFACT-02 · Stone #5's two organs: the regression ratchet and rollback

- **Decision.** Change (#5) forces two distinct organs: a **regression ratchet** (lessons compiled into
  auto-firing checks, existence-gated) and **rollback** (graded, with a hard gate at its irreversible
  limit).
- **Why.** A lesson that is not compiled into a check decays to folklore, and a change that cannot be
  undone converts an ordinary mistake into a non-local one. The two answer opposite halves of the same
  stone: the ratchet makes fixes stick, rollback keeps changes reversible.
- **Governs.** `docs/snapshot/10-artifacts.md`.
- **Trace.** `sdlc-canvas/03-mechanism-of-done.md` §10.8 (canvas track T3).
- **Open.** "No regression test is ever dropped" overstates it. The **lesson** and its rationale are
  preserved irreversibly; the **test instance** must be governed, so obsolete, redundant and misleading
  tests can retire. That correction is E8 in `ROADMAP.md` §3, not yet applied here.

### <a id="r-agentic-01"></a>R-AGENTIC-01 · The second-order tier prices autonomy; it does not forbid it

- **Decision.** Delegating the loop to self-checking, self-interested agents activates stones #9 and
  #10, which erode `reliable`. The response is to **price** autonomy — to require independence and
  alignment machinery proportional to what is being risked — not to prohibit it.
- **Why.** Both stones are *conditional*: they are dormant when one aligned mind does everything, and
  they activate exactly as delegation increases. A prohibition would forgo the capability; an unpriced
  permission would hollow `check` into `declare`. Pricing is the only response that tracks the
  conditionality of the stones that force it.
- **Governs.** `docs/snapshot/12-agentic-sdlc.md`, `docs/snapshot/02-destination-four-properties.md`.
- **Trace.** `sdlc-canvas/01-bedrock-atom-fractal.md` · `sdlc-canvas/05-laws-and-insights.md`.
- **Open.** Chapter 12 currently contradicts itself on what the independent terminal must be: it states
  the terminal need only be *uncorrelated*, but elsewhere derives both properties as coming "only from
  an outside terminal" and calls the human hatch the loop's "only" independent and aligned terminal.
  Repairing that, and reserving "human" for accountability and exceptional authority, is E5 in
  `ROADMAP.md` §3 — **not** applied here. Read the chapter knowing it disagrees with itself.

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

### <a id="r-evidence-01"></a>R-EVIDENCE-01 · EU AI Act status, and why this snapshot carries none of it

- **Decision.** No legal-status prose appears in the snapshot. The regulatory position is recorded here,
  dated, and treated as an input to `ROADMAP.md` priorities rather than as part of the model.
- **Why.** Legal status decays faster than anything else in this repository, and it decayed twice inside
  a single month of editing. A model whose text asserts what a statute currently requires becomes wrong
  without anyone touching it. The durable claims — that exogenous authority can create a
  non-compensatory gate — belong to the gate calculus; the dates belong in a dated ledger entry.
- **Evidence.** Regulation (EU) 2026/1744 (the Digital Omnibus on AI) — published in the *Official
  Journal* 24 Jul 2026, **in force 27 Jul 2026** (a three-day vacatio legis, taken as a matter of
  urgency because the date it amends falls on 2 August). It **replaces** Article 4 with a softened duty
  to *support* AI literacy, expressly not to guarantee any level of it, applicable from 27 Jul 2026.
  **Article 50 applies from 2 Aug 2026**, with a transitional to 2 Dec 2026 for Article 50(2)
  machine-readable marking of generative systems already on the market. Annex III high-risk moves to
  2 Dec 2027; Annex I to 2 Aug 2028. Penalties under Article 99 are unchanged (€35M/7% for prohibited
  practices; €15M/3% other obligations; €7.5M/1% for supplying incorrect information). OJ identifier
  `L_202601744`. Accessed 2026-07-29. **Caveat: the primary text has not been read** — EUR-Lex returned
  an empty body to direct fetch on both the ELI and OJ-HTML routes, and all four points were confirmed
  against three independent legal analyses in agreement. A conformance decision should not be taken on
  this entry until the primary text is read.
- **Trace.** `docs-history-2026-07-30:REVIEW-ASSESSMENT-2026-07.md#4-verification-log` rows 1–4 ·
  `docs-history-2026-07-30:REVIEW-ASSESSMENT-2026-07.md#3-errors-in-our-own-documents-that-the-review-did-not-catch` R1–R2.
- **Superseded.** Three earlier claims, each wrong: that the Act "classifies most enterprise autonomous
  agents as high-risk" (general code generation maps to neither Annex I nor Annex III; standard coding
  assistants are limited-risk); that the Omnibus was still *pending*; and that Articles 4 and 50 were
  left untouched by it and were "biting now". A nuance both earlier documents missed and worth keeping:
  using AI to **evaluate developer productivity, rank engineers, or allocate work algorithmically**
  *does* fall under Annex III (employment) — a real trap for a software factory that measures its
  engineers.

### <a id="r-evidence-02"></a>R-EVIDENCE-02 · CVE-2026-25253, per NVD, and the mechanism we invented

- **Decision.** CVE-2026-25253 **is** a code vulnerability, and it is **not** evidence for the sandbox
  component. The ephemeral hermetic execution plane rests on containment and defence-in-depth — and on
  the general fact that isolation layers carry their own vulnerabilities — not on this CVE.
- **Why.** The mechanism matters for routing: a client-side URL-handling flaw argues for input
  validation and egress control at the agent's own boundary, not for stronger workload isolation. Citing
  it for the sandbox would have justified the right component with the wrong argument.
- **Evidence.** NVD (authoritative over vendor posts and reconstruction) —
  `nvd.nist.gov/vuln/detail/CVE-2026-25253`: OpenClaw before `2026.1.29` "obtains a `gatewayUrl` value
  from a query string and automatically makes a WebSocket connection **without prompting**, sending a
  token value". CVSS 8.8. Accessed 2026-07-29.
- **Trace.** `docs-history-2026-07-30:REVIEW-ASSESSMENT-2026-07.md#4-verification-log` row 13 ·
  `docs-history-2026-07-30:REVIEW-ASSESSMENT-2026-07.md#3-errors-in-our-own-documents-that-the-review-did-not-catch` R3.
- **Superseded.** Two claims, in sequence, and the second was worse than the first: originally "a
  malicious skill package, not a code vulnerability"; then, correcting it, "a Docker sandbox escape via a
  crafted skill package, patched in v2.3.1". The second mechanism was **invented**, unsourced, and had
  already propagated into a P1 justification before it was caught. The lesson is recorded as a rule: NVD
  is authoritative for a CVE's mechanism, and a plausible reconstruction is not a source. "First agentic
  CVE" is also dropped, absent a defensible definition.

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
  invariants", and it prices proof at **seL4 ≈ 22 person-years** and **CompCert ≈ 6 person-years /
  100,000 proof lines**. Accessed 2026-07-29.
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
