# Independent assessment of the July-2026 external review

**Date:** 2026-07-29 · **Assessed against:** `sdlc-design/` (iter-35 parity), `sdlc-canvas/`,
`sdlc-evolution-ideas.md`, `HANDOFF.md` · **Reviewed document:** *SOTA SDLC Review — July 2026*

This file is **deliverable 1** of the review-response exercise. It records, with evidence, which of the
review's observations do **not** survive independent checking, which do, and which factual errors the
review missed in *our own* documents. The forward plan derived from the surviving findings is in
[`ROADMAP.md`](ROADMAP.md).

**Rev 2 · 2026-07-29 — this file has been corrected against the reviewer's round-2 response**, which was
itself checked against primary sources before anything here was changed. Five verdicts move: **D1** and
**D12** DISAGREE → PARTIAL, **D10** DISAGREE → PARTIAL, **D11** withdrawn, **D14** accounting repaired.
Two errors were *ours*: **§3 · R3** asserted a CVE mechanism that NVD contradicts, and the headline's
"four bad citations" was an overclaim. All changes are marked *rev 2* inline and reflected in §4. The
round-2 response is the better document wherever the two disagree, and its most valuable catch is an error
this file *introduced* while correcting another.

**Rev 3 · 2026-07-29 — corrected again after a round-3 audit of *this* file.** Seven changes, all verified
against primary sources before being applied: the **EU AI Act status is now fact, not forecast** (the Digital
Omnibus was published as **Regulation (EU) 2026/1744** and is **in force** — and it *replaced* Article 4, which
this file said was untouched); **D2's arithmetic** ("five of seven subsumed") contradicted its own table and is
now three; **D3 moves DISAGREE-in-framing → AGREE with implementation clarification**; **D9's own scope
sentence repeated the error it diagnoses** (it listed deployment inside SP 800-218A's scope); the **LiteLLM
claim is narrowed to what the running proxy actually enforces** (no cost ceiling exists, and none *can* as
configured); **"OpenAI retracted SWE-Bench Pro" is shorthand for retracting a recommendation**; and **§5's "the
ontology is sound" is retracted** as stronger than this file's own findings support. §4 gains source URLs, and
a **reproducibility gap is recorded rather than papered over**: the reviewed artifact was never stored or
hashed. The pattern across rev 2 and rev 3 is the same one rev 2 named — *the derivation holds; the sourcing
and self-audit discipline is what keeps failing.*

**Method.** Every line-level claim was checked against the cited line in the cited file. Every external
citation load-bearing for a priority decision was fetched or searched and is logged in §4. No claim in
this file rests on recollection; where verification was not possible it is marked *unverified*.

**Method limit, stated up front (rev 3).** That standard was applied to the *sources*, not to this file's
*own* prose. Three of the rev-3 corrections below (D2's count, D3's verdict, D9's scope sentence) are internal
inconsistencies that a re-read of this file against itself would have caught, and did not. Two of them —
D2 and D3 — turn on characterising a reviewed document that **this repository never preserved** (see §4 ·
*Reviewed-artifact provenance*). An adjudication that cannot be re-run against its subject is not evidence.

**Headline.** The review's central architectural finding — that the repository specifies *how to reason*
but not *the machinery that prevents an agent from bypassing that reasoning* — is correct, important, and
drives the whole roadmap. Around that core, roughly a third of its specific criticisms either attack
positions the design does not hold, mis-locate a real defect, or re-raise questions the repository had
already opened. *Rev 2 — the citation charge is materially smaller than first stated:* it reduces to **one**
clear scope mis-citation (NIST SP 800-218A, D9) plus **one** inaccurate descriptive link label (D10). The
original "four of its external citations do not say what it says they say" was itself an overclaim — two of
the four survive verification, and a third was *our* error, not the review's.

*Rev 3 — the residual charge is smaller again.* After D3 moves to **AGREE**, the fourteen dispositions stand
at **1 agree · 8 partial · 4 disagree · 1 withdrawn**. Only **four** of the review's observations are flatly
wrong (D6, D7, D9, D13), and three of those four are misplacements rather than false claims. "Roughly a third"
was describing the flat disagreements; it should not be read as a verdict on the review as a whole, which this
file adopts as its primary input.

---

## 1. Disagreements

Verdict key — **DISAGREE**: the observation is wrong. **PARTIAL**: the conclusion is right, the stated
reason or location is wrong, and the difference changes what we should build. **AGREE, with implementation
clarification** *(rev 3)*: the observation is right; what we add is *where* the mechanism attaches, not a
correction to it. **WITHDRAWN** *(rev 2)*: the disagreement itself did not survive verification and is
retracted.

**A standing caveat on D2 and D3** *(rev 3)*. Both originally rested on characterising what the review
"proposes" or "treats as missing" beyond the sentences quoted here. The reviewed document is not preserved
in this repository (§4), so those characterisations are **not re-checkable**. Where the quoted text does not
itself carry the claim, rev 3 narrows the disagreement to what the quotation supports.

---

### D1 · "Humans are treated too optimistically / as ground truth" — **PARTIAL** *(rev 2; was DISAGREE)*

> Review §5: *"The conclusion that removing the human drives independence and alignment toward zero is
> not [sound]… A human supplies value judgment, accountability, exception authority and potentially a
> different failure mode — not truth."*

The design already holds exactly this position, in the section the review cites.
[`12-agentic-sdlc.md:140`](sdlc-design/12-agentic-sdlc.md:140) requires

> "a human, **or a check whose errors are demonstrably *uncorrelated* with the doer's** (different model
> family, different training, different method). **The point is not 'a human because humans are better';
> it is 'a terminal whose blind spots differ from the doer's.'**"

The claim the review attacks is not in the document. "An autonomous loop cannot be its own ground truth"
([`12-agentic-sdlc.md:79`](sdlc-design/12-agentic-sdlc.md:79)) is a statement about **self-reference**,
not about human superiority — and the design explicitly prices human fallibility: independence is
"**never total** (even a formal proof only relocates the blind spot into the spec)"
([`03-bedrock.md:62`](sdlc-design/03-bedrock.md:62)).

The review's own supporting bullets — humans make correlated mistakes, fatigue, rubber-stamp — are
**stone #9 applied to humans**, which is the design's thesis, not a refutation of it. Independent
evidence sharpens this: the METR maintainer study the review cites found only **~68% of human golden
patches accepted** on re-review — and the review cites the study for the agent-side finding while omitting
the human-side one.

*Rev 2 — the reviewer's narrowing is accepted, and it corrects this paragraph.* The re-reviewers were
**recruited** maintainers, not necessarily the engineers who originally merged those patches, so the figure
measures **noise in a review pipeline**, not a 32% defect rate in merged human work. "By the same
maintainers" was wrong and is withdrawn. The human oracle is *noisy* — that is all the study shows here,
and it is all the argument needs.

**What is genuinely wrong — and *rev 2* concedes it is not "much smaller":** the shorthand is not confined
to three peripheral places. It is in Chapter 12 itself — the chapter cited above as the refutation — and it
appears as *derivation*, not as loose wording:

- [`12:73`](sdlc-design/12-agentic-sdlc.md:73) — both properties "come **only from an outside terminal**…
  and removing **the human** drives both toward zero." The sentence slides from *outside* to *human*
  mid-clause. If the terminal need only be uncorrelated, removing the human entails neither → 0.
- [`12:161`](sdlc-design/12-agentic-sdlc.md:161) — the human escape hatch is "the loop's **only**
  *independent and aligned* terminal." Flatly inconsistent with `12:138–141`.
- [`12:109`](sdlc-design/12-agentic-sdlc.md:109) — the L4 chart carries the node `remove the human → both
  → 0`, so the claim is encoded in the derivation *graphic*, not merely in prose.

Plus the three already noted: [`04-atom:41`](sdlc-design/04-atom-unit-control-loop.md:41) ("ends at a
**human** — the loop's one *independent* terminal"), the fractal chart's `escape hatch` node, and
[`08-repertoires:15`](sdlc-design/08-repertoires.md:15).

So "the claim the review attacks is not in the document" was too strong: a weaker version of it **is** in
the document, and the misreading was *invited by our own text*. Verdict **PARTIAL**, and **E5** is upgraded
from terminology polish to a substantive repair of Chapter 12 and its chart. What still stands: the design
does not hold that humans are epistemically superior — `12:138–141` says the opposite explicitly — so the
review's diagnosis of *why* remains wrong even though the inconsistency it sensed is real.

---

### D2 · "The three amplifiers do not exhaust hard-gate sources" — **PARTIAL**; the seven conditions decompose into three kinds

> Review §4: *"Safety, statutory and contractual obligations, data sensitivity, systemic dependencies,
> unknown blast radius and ethical prohibitions may independently require a gate."*

*Rev 3 — the count below was wrong, and it was wrong against this section's own table.* The earlier text
said "**five** of the seven are already subsumed" and then printed a table two of whose five rows say the
opposite ("authority, not amplification"). **Three** are subsumed. The seven decompose cleanly into three
kinds, which is the actual finding:

**(i) Outcome-space — already subsumed by the existing three amplifiers**, in the design's own words:

| Proposed addition | Already covered by |
|---|---|
| Safety (physical harm) | **irreversible** — the paradigm case |
| Data sensitivity | **adversarial** + **irreversible** — the design's own example is "a *leaked* secret cannot be un-leaked" ([`11:14`](sdlc-design/11-hard-gates-vs-graded.md:14)) |
| Systemic dependency | **machinery-degrading** — verbatim: "couples parts so one corrupts another" ([`11:17`](sdlc-design/11-hard-gates-vs-graded.md:17)) |

**(ii) Authority-space — not subsumed, and not an amplifier either: statutory · contractual · ethical.**
The three amplifiers all answer one question: *why is this violation non-compensatory in **outcome**
space?* A legal, contractual or ethical prohibition answers a different question: *who holds the right to
accept this risk at all?* Treating it as amplifier #4 would make the list heterogeneous and break the §11
predictive rule, which tests a property of the *violation*.

**(iii) Epistemic — unknown blast radius.** Neither outcome nor authority: a condition that makes the
classification *undecidable*.

Three · three · one. That decomposition is what survives, and it is what **E3** encodes.

**The accusation is narrowed *(rev 3)*.** The heading previously read "the proposed fix is a category
error." The sentence quoted above says these conditions *"may independently require a gate"* — it does not
propose a fourth amplifier. Whether the review proposed one elsewhere **cannot be checked**, because the
reviewed document was never preserved (§4). So the category distinction stands **on its own merits, as our
refinement**, and is no longer charged against the review. What is fairly said is narrower: the review names
seven conditions without distinguishing their kinds, and the kinds determine the machinery.

For (ii), the shape is a **second, orthogonal gate source** — *exogenous authority* — which deletes
`decide`'s accept right regardless of the outcome calculus. This is not a new question: it is
[`sdlc-evolution-ideas.md`](sdlc-evolution-ideas.md) **Open Structural Question 2**, already posed.

For (iii), the fix is a default rule (unknown ⇒ non-local until bounded), which is verbatim **canvas T11
fork (c)**: *"is graded/gated stable if '#6-absent' is unknowable a-priori?"*

→ roadmap item **E3**. Net: the review is right that something is missing; what it is missing splits three
ways, and both of the non-subsumed gaps were already open questions in the repository.

---

### D3 · "There must be a governed exception mechanism… otherwise the rule will be bypassed outside the system" — **AGREE, with implementation clarification** *(rev 3; was PARTIAL)*

**Rev 3 — this item was filed as a disagreement on the strength of a claim it never quoted.** The review
asks for a *governed exception mechanism*. It does not say that mechanism must be a new `accept` exit, and
no quotation in this section ever showed that it did. The rev-1/rev-2 text nonetheless asserted that
"adopting the review's framing means redefining 'hard gate'… which collapses the §11 non-compensability
calculus" — a consequence derived from a position attributed to the review rather than read from it. With
the reviewed document unpreserved (§4), that attribution is unverifiable and is withdrawn.

**The observation is correct and is adopted.** A non-waivable rule with no governed way past it *will* be
bypassed outside the system during a real incident. Nothing in the design contradicts this.

**The clarification we add is about location, not correctness.** The channel already has a structural home:
`decide` has **three** exits — accept · re-target · **escalate**
([`04-atom:27`](sdlc-design/04-atom-unit-control-loop.md:27)) — and a hard gate deletes **only `accept`**
([`11:5`](sdlc-design/11-hard-gates-vs-graded.md:5)). `escalate` survives every gate. So a hard gate never
means "no path forward"; it means *the path forward leaves this loop and goes to a higher authority* —
structurally, a governed exception. What is genuinely missing is not the exit but its **governance
contract**: a named accountable risk owner, compensating controls, scope and expiry, evidence and rationale,
separation of duties, a tamper-evident record, and automatic re-evaluation.

The distinction still earns its keep — siting the mechanism at `escalate` rather than at a ceremonious
`accept` is what keeps the §11 calculus intact — but it is a **design choice we are making**, not an error we
are correcting in the review.

→ roadmap items **D10** (specify the channel) + **E3**. The review's list of seven exception properties is
adopted wholesale, as the contents of `escalate`. **Q6** asks the remaining live question: whether a governed
exception at `escalate` is genuinely distinct from a ceremonious `accept`. If Q6 answers *not distinct*, this
clarification dissolves and the review's framing is simply right.

---

### D4 · "Stub composition cannot discharge wiring risk" — **PARTIAL**; there is a sharper defect the review missed

> Review §3: *"The claim that a green stub check leaves 'provably zero design risk' in wiring is false"*
> — followed by eight things stubs do not prove.

The design's claim is narrower than the review represents. "Wiring" is defined at
[`09:101`](sdlc-design/09-mechanism-of-done.md:101) as "the contracts are mutually coherent (what A emits
is what B accepts, across the graph)," and the section is already explicit that stub-composition "**never
*confirms***" ([`09:102`](sdlc-design/09-mechanism-of-done.md:102)) and "reaches **neither** premise"
([`09:110`](sdlc-design/09-mechanism-of-done.md:110)). Most of the review's eight items are not
counter-examples to a wiring claim — concurrency, backpressure, latency, version skew are **Premise B**
residue, already routed to `observe`; semantic compatibility of a component is **Premise A**, already
routed to `verify`.

**The real defect is incompleteness, not falsity — and it is worse than the review says.** The factoring
has Premise A (leaves are real) and Premise B (contracts hold over their whole range) but no

> **Premise C — the contract set, even if perfectly honoured, actually delivers *P*.**

Without Premise C, "green stubs discharge the ⟹" is **circular**: it holds only if *P* is *defined* as the
conjunction of the contracts, which is the very bet under test. Premise C is where the review's own
strongest examples actually live — temporal ordering, distributed consistency, failure-propagation
semantics are not wiring failures and not range failures; they are **contract-set inadequacy**.

Stating Premise C fixes the derivation in the design's own vocabulary and yields an actionable check
(does any *P*-required behaviour appear in no contract?). "Stubs don't prove eight things" does not.
→ roadmap item **E2**.

**Separately, and correctly:** the review is right that green leaves + failed acceptance does not uniquely
indict `design`. The design's *logic* is valid modus tollens — but its premise is not. It treats "the leaf
**check** passed" as "the leaf **target** is true" ([`09:36`](sdlc-design/09-mechanism-of-done.md:36)),
which stone #9 exists precisely to deny. This is an internal inconsistency, and the design already owns
the vocabulary to fix it. → roadmap item **E6**.

---

### D5 · "The universal Done schema contradicts itself" — **PARTIAL**; the diagnosis inverts the fix

There is a real defect, but it is a **naming collision**, and the review identifies the wrong quadruple
as anomalous.

| Location | The "four axes" |
|---|---|
| [`09:16`](sdlc-design/09-mechanism-of-done.md:16) (propagation) | scope · reliable · resilient · predictable |
| [`09:219`](sdlc-design/09-mechanism-of-done.md:219) (§9.3, at a seam) | "the three input-properties" (reliable · resilient · predictable) **+ secure** |
| [`02-destination:4`](sdlc-design/02-destination-four-properties.md:4) (apex) | reliable · predictable · resilient · **secure** |

The anomalous one is **§9's**, which substitutes `scope` for `secure`. The review reads this as "scope has
silently disappeared, or the schema now has five dimensions" — the arithmetic is right, the resolution
backwards. `scope` is not a lost fifth *quality* axis; it is a **boundary**, categorically different from a
threshold on a quality range. Which is what the review itself argues two paragraphs later when it proposes
separating "a boundary: scope, exclusions, authority and budget" from "an acceptance vector."

So the fix is the review's recommendation reached by correcting its own diagnosis: a work unit carries a
**boundary** (scope · exclusions · authority · budget) *and* an **acceptance vector** whose four apex axes
are the Chapter 2 four. → roadmap item **E1**.

---

### D6 · "The four apex properties are not an exhaustive enterprise product-quality model" — **DISAGREE** as a defect

The design never claims they are. [`02-destination:4`](sdlc-design/02-destination-four-properties.md:4):
"A good **SDLC** produces four distinct properties." Those are properties of the **lifecycle's output
behaviour** — reliable is produced by a loop that *converges*, predictable by one that is *bounded*, and so
on. They are not an ISO/IEC 25010 taxonomy, and performance, accessibility, maintainability and privacy are
**target content** — what `specify` elicits and `design` decomposes — not axes of the controller.

Filing them as missing axes confuses the controller with the plant, a distinction the design makes
explicitly ([`13-appendices:44`](sdlc-design/13-appendices.md:44): "`implement`… the operand the loop
controls — the plant, not the controller").

**Real residue, worth fixing:** the design never says *where* such a quality lives. A reader cannot
currently tell whether "p99 latency < 200 ms" is a `reliable` target, a `predictable` target, or `specify`
content. That is a genuine gap — a missing mapping rule, not a missing axis. → roadmap item **E10**.

---

### D7 · "'Reliable' is used non-standardly" — filed under "not sound" · **DISAGREE on placement**

The design covers availability, continuity and correctness-under-failure — under **`resilient`**
([`02-destination:28`](sdlc-design/02-destination-four-properties.md:28)) — and defends the split with a
real argument (statistical machinery that beats random hardship *backfires* against a directed opponent:
"a retry loop is a gift to a denial-of-service attack"). Nothing is missing from the coverage; one word is
overloaded relative to SRE usage.

That is a communication defect, not a derivation defect, and listing it under "Where the derivation is not
sound" inflates the assessment. Fix is a glossary note (`reliable` ≈ intent-faithfulness; `resilient` ≈
operational reliability / availability). → roadmap item **E5**.

---

### D8 · "The convergent law is too broad — unbounded ceremony" — **PARTIAL**; right conclusion, wrong location, and §6.4 went unread

The review argues that requiring an ADR, plan, telemetry and regression artifact "for every microscopic
loop turns the fractal into unbounded ceremony," and that evidence should be risk-tiered.

The design already has a collapse rule that answers this: **§6.4** — *"Is all this ceremony a must? —
reducibility and the base case"* ([`06-fractal:351`](sdlc-design/06-fractal.md:351)) — under which "a loop
may **collapse toward bare `do`** exactly as its stones fall away"
([`06-fractal:355`](sdlc-design/06-fractal.md:355)), priced explicitly as "`P(undetected error) ×
cost(error)` — insurance against a risk" ([`06-fractal:414`](sdlc-design/06-fractal.md:414)). The review
does not engage §6.4 at all, which is the section that both raises and half-answers its objection.

*Rev 2, self-correction neither party caught:* the earlier version of this paragraph placed "ceremony is
proportional insurance — a beat collapses toward bare `do` where its stone is absent" in **quotation marks**
against `06-fractal:355`. That string appears nowhere in Chapter 6 — it paraphrases §6.4 and borrows the
canvas's wording at [`05-laws-and-insights:166`](sdlc-canvas/05-laws-and-insights.md:166). The substance
held; the quotation marks did not, which in a document about citation precision is worth recording.

**But the objection lands anyway, and harder than stated** — as an *internal* contradiction:

- §6.4's table permits `verify` to collapse when "the step is provably correct / cheap to redo"
  ([`06-fractal:363`](sdlc-design/06-fractal.md:363));
- §6.4's own overrides say dropping the reflect-artifact or the observe-sensor is machinery-degrading
  "**non-waivable regardless of local cost**" ([`06-fractal:424`](sdlc-design/06-fractal.md:424));
- §11.2 widens that to all four artifacts ([`11:110`](sdlc-design/11-hard-gates-vs-graded.md:110)).

If `verify` collapses there is no check, hence no `reflect`, hence no ADR — so the collapse rule and the
convergent law are **mutually inconsistent at collapsed nodes**. The fix is not "make evidence risk-tiered"
(§6.4 already is) but to define the **granularity at which the existence-gate attaches** — the accountable
work unit, not every fractal node. → roadmap item **E4**.

---

### D9 · "This is precisely where current guidance has converged… NIST SP 800-218A" — **DISAGREE on the citation**

The architectural gap the review names is real and is the backbone of the roadmap. The anchor cited for it
is wrong.

**NIST SP 800-218A** is *"Secure Software Development Practices for Generative AI and Dual-Use Foundation
Models: An SSDF Community Profile"* (July 2024). Its §1.2 states its scope verbatim:

> "This Profile's scope is **AI model development**, which includes data sourcing for, designing, training,
> fine-tuning, and evaluating AI models, as well as incorporating and integrating AI models into other
> software. Consistent with SSDF version 1.1 and EO 14110, **practices for the deployment and operation of
> AI systems with AI models are out of scope**."

It is not guidance on operating AI agents as *developers* inside a conventional SDLC.

*Rev 3 — this paragraph previously listed "deployment" as **in** SP 800-218A's scope, which is the exact
error the item exists to diagnose.* The verdict was right and the supporting sentence was wrong: NIST puts
deployment and operation explicitly out of scope. The correction strengthens D9 rather than weakening it —
the gap between "practices for producing a model" and "controls for an agent that writes and ships code" is
wider than the original text conceded.

Using it as the anchor for "where guidance has converged" on agent sandboxing, least privilege and
risk-thresholded human review is a scope mis-citation. The apt anchors are **NIST SSDF SP 800-218**
itself, the **NIST AI RMF (AI 100-1)** with its **Generative AI Profile (AI 600-1)**, **SLSA / in-toto**
for provenance, and — for the specific agentic controls the review lists — the **OWASP Top 10 for Agentic
Applications 2026** and the **NSA MCP CSI**, both of which the review already cites correctly.

This is not pedantry: a P0 control justified by a framework that does not govern it is a compliance
argument we lose the first time it is tested.

*(Checked and found correct, contrary to my initial suspicion: the review's "NSA's May 2026 guidance" is
accurate — the CSI was released 20 May 2026; the `media.defense.gov/2026/Jun/02/` path is a posting date,
not a publication date.)*

---

### D10 · The formal-methods citations — **PARTIAL** *(rev 2; was "DISAGREE on sourcing")*

> Review §6: *"Current agentic verification research shows real progress, but also that specification
> construction remains the central bottleneck and comprehensive proofs remain expensive. See `Agentic
> Verification` (arxiv 2511.17330) and `formal-verification limitations for agentic software` (arxiv
> 2605.30914)."*

*Rev 3 — the two citations in that quotation were reproduced here as markdown links whose targets were the
bare strings `arxiv 2511.17330` and `arxiv 2605.30914`, i.e. broken in a file whose subject is citation
precision.* They are now shown as the review wrote them, with the resolved sources recorded once, here:
[arXiv 2511.17330](https://arxiv.org/html/2511.17330v3) · [arXiv 2605.30914](https://arxiv.org/html/2605.30914v1).

**Rev 2 — the original verdict here was wrong, and the way it was wrong matters.** The first version of
this item claimed "neither source supports the sentence it is attached to." On re-checking the *full texts*
rather than the abstracts, both sources do support it:

- **arXiv 2511.17330** is titled *"Agentic Verification of Software Systems"* — so the review's link label
  was **correct**, and calling the paper "*AutoRocq*" (its system's name) was the looser description. More
  importantly its introduction states that "capturing program behaviors formally requires significant
  efforts in manually annotating specifications and crafting loop invariants," and prices comprehensive
  proof directly: **seL4 at 22 person-years**, and **CompCert at 6 person-years / 100,000 lines of Rocq —
  "eight times longer than the implementation itself."** That is both halves of the disputed sentence.
  The original error came from judging the paper on its **abstract**, which carries neither figure.
- **arXiv 2605.30914** is indeed *"Automating Formal Verification with Reinforcement Learning and Recursive
  Inference"* (Max Tan, 29 May 2026), so the review's descriptive label — "formal-verification limitations
  for agentic software" — **is** inaccurate, and the reviewer concedes it. But the paper's *content* is
  supportive: it reports **specification hacking**, "models exploit weak formal specifications instead of
  implementing the intended solutions." Numbers: Dafny verified pass rate **9.7% → 31.1%** after filtering
  underspecified tasks, Lean scaffold **46.2% → 69.2%** on the VeriCoding pilot set.

**What survives of D10:** only the inaccurate link label for 2605.30914, and a softening of "*the* central
bottleneck" to "*a* central bottleneck." Both citations stay. The correct characterisation of 2605.30914 is
narrower than the review's, though: it treats specification hacking as a **data-quality contaminant it
filters out** before continuing, and its thesis is optimistic about automation — so cite it for the
*phenomenon*, not as a paper about limits.

**And the phenomenon is worth more to us than the review realised.** Specification hacking *is* a model
Goodharting a formal verifier — which makes it the **primary external evidence for retracting A3's
"non-Goodhartable" claim** (§3 · R4), stronger than the internal contradiction with `12:34` that R4
currently rests on. → **E11**, and **P3/A3** now bounded on all three verified points.

---

### D11 · "249 of 731 SWE-Bench Pro tasks — 34.1% — were broken" — **WITHDRAWN** *(rev 2; was DISAGREE)*

**The objection was factually wrong.** OpenAI published the raw counts, not only percentages: its datapoint
analysis pipeline flagged **200 (27.4%)** broken tasks, while the human annotation campaign identified
**249 (34.1%)** of the 731-task public split. `249` was **not** back-computed, and the claim that it was is
retracted in full.

*Verification note:* openai.com returns HTTP 403 to direct fetch; the sentence was confirmed via search
snippets quoting it verbatim plus multiple independent write-ups of the audit, and the arithmetic is
internally consistent (249/731 = 34.06%; 200/731 = 27.36%). Logged this way rather than as a clean primary
fetch, per this file's own standard.

**What survives:** only the second half of the original item — the review omits the same audit's headline
capability result, pass rates on that split moving **23.3% → 80.3% in eight months**, which is material
context for any roadmap deciding how fast to widen autonomy and cuts against the review's conservative
framing. The substantive use of the finding (the oracle itself requires verification) was always correct.

The irony is the point: this item was flagged under "assumptions that compound," and it was the *objection*
that carried the unverified assumption.

---

### D12 · The missing-hazards list — **PARTIAL** *(rev 2; was DISAGREE)* — 1 of 7 lands, and it is already ours

> Review §1: *"Missing or underrepresented hazards include capability limits, authority misuse,
> liveness/resource exhaustion, provenance/information integrity, systemic dependency propagation,
> accountability, and safety constraints."*

| Proposed hazard | Assessment |
|---|---|
| Capability limits | **Considered, but the fold is asserted rather than argued** *(rev 2)*. The canvas states the second-order tier has exactly two seats *because* "**capability folds to #4**" ([`05-laws-and-insights:160`](sdlc-canvas/05-laws-and-insights.md:160)) — one line, no derivation |
| Liveness / resource exhaustion | **Same** — "**liveness to #7**" (same line). *The assignment is arguable — I would have said #2, finite resources — and that is a fair criticism of an argument we made, not of an omission* |
| Authority misuse | #10 (delegated doer) or #8 (external actor), by who misuses it |
| Provenance / information integrity | #7 × #8 composite; the agentic face is already **A2** |
| Accountability | **Category error.** A response, not a brute fact. The §3 self-test rejects responses as stones |
| Safety constraints | **Category error.** A constraint is target content; the hazard behind it is irreversible harm (#6/#8 × irreversibility) |
| **Systemic dependency propagation** | **Lands — and is our own A1**, ranked *Critical*, backed by OWASP **ASI08 Cascading Failures** (verified) |

The review's strongest hazard candidate is the one the repository raised first. Presenting capability and
liveness as unconsidered, when the canvas names and assigns them in the sentence that justifies the
two-seat tier, means the strongest part of §1 was written without reading §3's derivation.

**Rev 2 — why this drops to PARTIAL, and the residue is larger than the reviewer states.** *Mentioned is
not dispositioned*: two clauses in one sentence are not a derivation, and the reviewer's counter-argument
runs on the design's **own** rule. The bundling rule says two faces bundle into one stone **iff they share
a single forced response**; distinct responses ⇒ **sibling** stones
([`05-laws-and-insights:149`](sdlc-canvas/05-laws-and-insights.md:149)). By that test:

- **Capability ≠ error.** A solver can operate flawlessly and still lack the capacity to solve the task.
  #4's forced response is verify-and-analyze; capability's are **routing, decomposition, tool acquisition,
  capability selection and escalation**. Distinct responses argue *against* the fold.
- **Liveness ≠ perishable knowledge.** #7's forced response is the *artifact*; resource exhaustion and
  non-completion force **budgets, timeouts, checkpointing and durable execution** — which is why this file's
  own first draft said the assignment "would have been #2."

And the roadmap corroborates the reviewer's practical point: it raises **B5 durable execution** to the
safety kernel's spine (D2) and treats capability routing as load-bearing — machinery that a genuinely
folded-away pressure would not need.

**The residue, stated precisely.** Once **E12** lands and "exactly two seats" is a *judgment* rather than a
proof, these two folds cannot rest on assertion; they must be recorded as criterion-based judgments with
their residue. That work item did not exist and is now **ROADMAP Q10** — scoped deliberately: T6 is closed
by prior decision, so Q10 asks whether the folds are adequately *argued*, not for a re-derivation of the
count, and opening it is the user's call. **A1 remains ours** and should not have been presented as newly
discovered — the reviewer concedes this.

---

### D13 · "The right destination is not 'an AI that owns the whole lifecycle'" — **DISAGREE that this is a correction**

Chapter 12 already says the second-order tier "**does not forbid autonomy — it *prices* it**"
([`12:134`](sdlc-design/12-agentic-sdlc.md:134)) and already requires a non-removable external terminal,
deliberate adversarial diversity, independence *budgeting*, and engineered alignment. That is
"highly autonomous execution inside an externally governed envelope."

The review's formulation — *"Agents may create and operate rapidly; only external policy and accountable
authorities may define what they are allowed to risk"* — is a better **operationalisation** and I adopt it
as the roadmap's governing principle. But it is the design's conclusion restated, not a reversal, and
framing it as the corrected destination overstates the delta and invites us to re-derive settled ground.

---

### D14 · The priority reordering — **PARTIAL**

> Review: *"model governance, observability, knowledge freshness, attention economics and forensic replay
> are marked 'lower'… even though they are structural prerequisites for autonomy."*

*Rev 2 — the accounting below was broken and is repaired.* The first version named "three of five as
mis-ranked" including **C3**, then listed C3 again among "two that are not," and never dispositioned the
fifth item (**knowledge freshness / C8**) at all. Corrected, item by item, all five of the review's:

| Review's item | Ours | Disposition |
|---|---|---|
| Observability | **C6** | **Mis-ranked — raise.** Prerequisite, not increment → P1/D7 |
| Forensic replay | **C12** | **Mis-ranked — raise**, narrowed to event-sourced → P1/D7 |
| Model governance | **C3** | **Split, not promoted** — C3a pinning/drift → P1; C3b routing/cost → P3 |
| Attention economics | **C10** | **Not a prerequisite.** It binds once humans review at volume; a safe T0/T1 pipeline runs with a small human load. Rises to **P2** (calibration track), not the safety kernel |
| Knowledge freshness | **C8** | **Rises** — stale context is worse than absent context, because the agent trusts it → **P2** ([`ROADMAP.md` §6, row *C8 Epistemic drift*](ROADMAP.md)) |

So: **two** cleanly mis-ranked (C6, C12), **one** split (C3), **two** that rise but not to the safety kernel
(C10, C8). The roadmap's traceability table had all five right; this section's prose did not. *(Minor: the
round-2 response cites C8 at `ROADMAP.md:254`, which is the C3 row. **Rev 3:** our own correction — "C8 is at
`:259`" — has since rotted too; `:259` is now the A3 row. Both are why §4 bans line anchors for anything
expected to outlive one edit. C8 is in §6's traceability table, row *C8 Epistemic drift*.)*

On the C3 split specifically: it was ranked *Lower* with the rationale "handled by existing LiteLLM proxy
setup" (the global rules mandate a local LiteLLM proxy on `127.0.0.1:4000`, which the review had no
visibility into). What is **not** handled is **model + prompt + tool version pinning and drift detection**,
and that half is P0-grade.

**Rev 2 conceded the principle:** *satisfied by existing infrastructure* is not *specified and verified*. An
assumed control that nothing tests is a stone-#9 exposure dressed as a completed one — so C3b carries a
**P1 conformance obligation** (state what the proxy is presumed to guarantee; verify it against the running
proxy) even though its build work stays P3.

**Rev 3 discharged part of that obligation, and it falsified the claim above.** The running configuration
(`~/.litellm-proxy/config.yaml`, the one the launchd job actually loads) was read on 2026-07-29:

| Presumed guarantee | Actual state |
|---|---|
| Model allow-list | **✓ present** — five GLM deployments, no wildcard |
| Rate limiting | **✓ present** — `rpm: 20` per deployment, enforced pre-call via `enforce_model_rate_limits` |
| Concurrency control | **✓ present** — `max_parallel_requests: 3` per deployment; `global_max_parallel_requests: 5`; a separate semaphore proxy in front |
| Routing policy | **± partial** — `simple-shuffle` with a cooldown circuit breaker and `allowed_fails: 1`; **fallbacks deliberately disabled** and no complexity-based routing, so C2's cascade does not exist |
| **Cost ceiling / budget** | **✗ absent — and not merely unconfigured.** There is no `max_budget`, and `store_model_in_db: False` with no `database_url`, so LiteLLM's spend tracking cannot run. **No cost ceiling is enforceable in this deployment as configured.** |

So "routing, cost and rate-limiting genuinely is handled" was **wrong on cost** and loose on routing. Rate
limiting and concurrency are real and better than assumed; the cost half of C3b is unbuilt.

**Two consequences, both larger than the correction.** First, the roadmap's P1 conformance obligation is
vindicated exactly as written — the one presumed control that nobody had checked is the one that was absent.
Second, and worse for the evidence graph: the *presumed* configuration and the *running* configuration are
different files. A second, non-running `litellm.config.yaml` exists outside this repository and **does**
carry a `max_budget` key — which is how "cost is handled" became believable. Governed factory evidence cannot
rest on an unversioned personal config discovered by filesystem search. → the proxy configuration must be
**versioned into the evidence graph (D5) and conformance-tested (D6)**, not referenced as ambient
infrastructure.

---

## 2. What I independently agree with

Recorded compactly because these drive [`ROADMAP.md`](ROADMAP.md); the reasoning is in the roadmap items.

1. **The control-plane gap is the real finding.** The repository derives *how to reason* and stops before
   the machinery that makes bypassing that reasoning impossible. Deterministic orchestration, external
   policy evaluation, workload identity and capability brokerage, ephemeral execution, a signed evidence
   graph, append-only audit, kill switch, progressive delivery — none is present, and none is derivable
   from the ontology because the ontology deliberately descoped concrete systems
   ([`HANDOFF.md:139`](HANDOFF.md:139)). → **Tier D**.
2. **"Security is a hard gate wholesale" is not implementable as written.** The weakest-link argument
   ([`09:234`](sdlc-design/09-mechanism-of-done.md:234)) establishes that security does not *average* —
   correct — but not that every security-relevant constraint is non-waivable. A medium-severity CVE in a
   dev dependency is security-relevant and routinely risk-accepted; under the rule as written, nothing
   ships. The refinement is available in the design's own §9.3 vocabulary: gate the **reachability of a
   forbidden output** (an invariant, binary, per-seam); grade **defence depth and posture**. → **E3**.
3. **Progressive trust must attach to a versioned configuration**, not an agent persona — model, prompt,
   tools, permissions, harness, environment — and any material change resets attained assurance. This is a
   direct and correct fix to **B4**. → **D9**.
4. **Stone #10's response menu is human-shaped and does not implement for agents.** "Skin in the game" and
   "outcome-linked incentives" ([`03-bedrock.md:75`](sdlc-design/03-bedrock.md:75)) presuppose a persistent
   utility to penalise. The stone is sound — delegation to vendors, contractors and teams is exactly its
   domain — but a stateless inference has no payoff to shape. The agent branch is **capability containment,
   proxy-resistant evaluation and independent evidence**, not incentives. → **E9**.
5. **Evidence requirements must scale with blast radius, irreversibility, adversarial exposure, data
   sensitivity, novelty, evaluator correlation and containment** — and must be **non-compensatory** across
   dimensions (strong unit tests cannot offset a failed authorization check). The T0–T4 authority tiering
   is adopted with modifications. → **D1**, **D6**.
6. **The creator of a change must not be able to manufacture or waive all the evidence required to approve
   it.** This is separation of duties applied to the evidence graph, and it is the operational form of
   stone #9. → **D5**, **D6**.
7. **Forensic replay should be event-sourced, not bit-reproducible.** Do not require hidden
   chain-of-thought: it may be unfaithful, is sensitive, and cannot be reproduced across vendor model
   versions. This is a correct and useful narrowing of our **C12**. → **D7**.
8. **Regression suites need a governed lifecycle.** [`10-artifacts:98`](sdlc-design/10-artifacts.md:98)
   says the ratchet "accumulates monotonically: each fixed failure-class adds a guard, **none is
   dropped**." Tests do become obsolete, redundant and misleading. Preserve the *lesson* and its rationale
   irreversibly; govern the *test instance*. → **E8**.
9. **Telemetry cannot be literally continuous at every seam.** §11.1's "forced to be **continuous and
   every-seam**" ([`11:84`](sdlc-design/11-hard-gates-vs-graded.md:84)) is contradicted twelve lines above
   by "collapsible to zero on a fully-modelled, reversible, local path." Sampling, redaction, cost limits,
   retention, and a separation between debugging and audit records are all genuinely absent. → **E7**,
   **D7**.
10. **Verification modality taxonomy is incomplete** — {deterministic, statistical} omits formal proof,
    simulation, human experiential evaluation, and runtime assurance monitors. Correct; and the correction
    must be bounded as in D10, not as our A3 currently states it. → **E11**, **A3**.
11. **Multi-agent consensus, self-confidence and benchmark pass rates must not be promoted to production
    authority.** Verified: OpenAI **retracted its recommendation** that the research community use
    SWE-Bench Pro, after auditing it and finding ~30% of tasks broken — *rev 3: OpenAI neither owns nor
    "retracted" the benchmark itself, which is Scale AI's; the earlier shorthand "OpenAI retracted
    SWE-Bench Pro" misstates who did what to what*; benchmark-to-mergeable gap ≈ 24.2 pp; Anthropic reports
    substantially higher token cost and fewer naturally parallel subtasks in coding. This is a direct
    constraint on our **B2**. → **P2/B2**.
12. **The EU AI Act correction is right** (see §3 · R1/R2).

---

## 3. Errors in *our own* documents that the review did not catch

Assessed independently. These compound in the same way and are corrected in the roadmap.

**R1 · `sdlc-evolution-ideas.md` C9: "The EU AI Act classifies most enterprise autonomous agents as
high-risk."** Wrong — and the review is right to say so, though it did not spell out the consequence.
Article 6 offers two routes: Annex I (safety component of a regulated product, third-party conformity
assessment) and Annex III (eight enumerated domains — biometrics, critical infrastructure, education,
employment, essential services, law enforcement, migration, justice). **General code generation maps to
neither**; standard coding assistants fall to limited-risk. *Rev 2 — Article 50 must be stated
conditionally, not as a blanket duty:* its obligations attach to systems interacting with natural persons
and to synthetic content, so they bite where agent output reaches a third party — **not** merely because an
internal code artifact was AI-generated. Labelling every internal artifact is not what Article 50 requires.
*Rev 3 — conditional in time as well as in scope:* Article 50 applies from **2 August 2026**, with a
transitional to **2 December 2026** for Art 50(2) marking on generative systems already on the market (R2).
*Nuance both documents miss:* using AI to **evaluate developer productivity, rank engineers, or allocate
work algorithmically** *does* fall under Annex III (employment) — a real trap for a software factory that
measures its engineers.

**R2 · C9: "full enforcement August 2026" and "fines up to €35M or 7%."** Superseded and mis-scoped.

*Rev 3 — the Omnibus is no longer pending, and this paragraph's own "unchanged" claim was wrong.* The
Digital Omnibus on AI was adopted as **Regulation (EU) 2026/1744**, **published in the Official Journal on
24 July 2026** and **in force since 27 July 2026** — a three-day vacatio legis taken "as a matter of
urgency" because the date it amends falls on 2 August. The status is therefore **fact, not forecast**, and
every "expected, not yet in force" hedge in this repository is stale. Legislative history retained for the
record: political agreement 7 May 2026; Parliament 16 June 2026 (423–57–174); Council 29 June 2026.

| Provision | Position as of 29 July 2026 |
|---|---|
| Annex III high-risk (stand-alone) | **2 December 2027** — moved, now settled law |
| Annex I high-risk (safety components) | **2 August 2028** — moved, now settled law |
| **Article 4 (AI literacy)** | **Replaced, not untouched.** 2026/1744 substitutes a softened Article 4 — a duty to *support* the development of AI literacy, expressly *not* to guarantee any level of it — applicable **from 27 July 2026**, with no deferral. The original Article 4 applied from 2 Feb 2025 |
| **Article 50 (transparency)** | General application **2 August 2026** — four days after this document's date, so **not yet applicable**. Providers of generative systems already on the market before that date have until **2 December 2026** for Article 50(2) machine-readable marking (the grace period was cut from six months to three) |
| Penalties (Art 99) | Unchanged, and the review is correct: €35M/7% for **prohibited practices**; €15M/3% other obligations; €7.5M/1% for supplying incorrect information |

**What this changes for us, and what it does not.** The **C9a/C9b split is unaffected** — C9a was justified
by our own machinery-degrading amplifier, not by a regulatory date, which is precisely the property that let
it survive a timeline moving twice. What *is* corrected is the claim that Article 4 and Article 50 "bite
now": Article 4 binds in an amended and weaker form, and Article 50 does not bind until 2 August 2026.

*Verification note (rev 3):* eur-lex.europa.eu returned an empty body to direct fetch on both the ELI and
OJ-HTML routes. Publication date, entry-into-force date, the Article 4 replacement and the Article 50
transitional were confirmed against **three independent legal analyses that agree on all four points**, plus
the OJ document identifier `L_202601744`. Logged this way rather than as a clean primary fetch, per this
file's own standard — the same standard applied to the openai.com 403 at item 7. **The primary text has not
been read**; a P1 conformance decision should not be taken on this row until it has.

**R3 · A2: "CVE-2026-25253 exploited a malicious skill package, not a code vulnerability."** The original
claim was wrong — **and so was rev 1's correction of it.** This is the most important entry in this file,
because it is the one place where correcting an error *introduced* a new one, and the new one had already
propagated into a P1 justification before it was caught.

**What NVD actually says:** *"OpenClaw (aka clawdbot or Moltbot) before 2026.1.29 obtains a `gatewayUrl`
value from a query string and automatically makes a WebSocket connection without prompting, sending a token
value."* CVSS **8.8 HIGH**, fixed in **2026.1.29**.

**What rev 1 of this file asserted, and what was wrong with it:**

| Rev 1 claim | Status |
|---|---|
| It is a code vulnerability, CVSS 8.8 | **✓ correct** — so A2's original "not a code vulnerability" is still wrong |
| "An RCE in the skill runtime in which a crafted skill package **escapes the Docker sandbox**" | **✗ invented.** No sandbox escape, no skill package in the CVE record |
| "Patched in **v2.3.1**" | **✗ wrong.** Fixed before **2026.1.29** |
| "The first agentic CVE" | **✗ unsupported.** Drop it, or define it defensibly and cite the definition |

**Correct routing, which is not B1/D4:**

- **Attacker-controlled URL from a query string** → input validation at a trust boundary.
- **Connects without prompting** → **approval integrity** (D6): the human-in-the-loop step that existed was
  simply not invoked.
- **Sends a token to that endpoint** → **credential scoping and default-deny egress** (D3).
- **ClawHavoc** (341 malicious skills, 335 from one operator, delivering Atomic Stealer to macOS developer
  workstations) is a **separate** supply-chain event and remains **A2**'s evidence.

**The compounding, recorded.** Rev 1's fabricated mechanism was used to make **B1 the "primary owner of the
CVE evidence"** ([`ROADMAP.md` §6, row *B1 Sandbox*](ROADMAP.md) — *rev 3: cited as `ROADMAP.md:244` until
that anchor rotted onto the C3b bullet*) and to justify D4's framing. Both are corrected; D4 still stands,
but on containment and defence-in-depth grounds rather than on this CVE. The general lesson — a sandbox is a
*component with its own CVEs*, not an axiom — is true and worth keeping; this CVE just is not the evidence
for it. **NVD is authoritative for a CVE's mechanism, over any plausible reconstruction.**

**R4 · A3 contradicts Chapter 12.** A3 calls formal proof "**non-Goodhartable**" and says the formal leaf
"collapses premise B to zero residue." Chapter 12 says the opposite in the design's own voice: "Even a
formal proof doesn't escape it — it only **relocates** the blind spot from the code into the spec"
([`12:34`](sdlc-design/12-agentic-sdlc.md:34)), repeated in [`03-bedrock:62`](sdlc-design/03-bedrock.md:62)
and the glossary's *Independence* entry. The review flagged A3 as overcorrecting; the stronger objection is
that it contradicts the model it claims to extend.

**R5 · A4 has stronger empirical support than it claims, and its cited benchmark is real.** *(Rev 2 —
mis-filed: this is an **evidence upgrade**, not an error the review missed, and it does not belong under a
heading about errors. Kept in place so existing references resolve, reclassified here.)* SWE-CI
(arXiv 2603.03823) is a 100-task repository-level benchmark over histories averaging 233 days and 71
consecutive commits; across 20 models from 8 providers it finds current LLMs "**still struggle to sustain
code quality over extended evolution, particularly in controlling regressions**." That is direct support
for agentic entropy as a *real pressure* — which raises A4's practical priority even while its
stone-or-law classification stays open.

---

## 4. Verification log

Every external claim that carries a priority decision. `✓` = confirmed · `✗` = contradicted ·
`±` = partially confirmed / materially qualified. **`Checked`** records the round in which the row was last
verified against its source — a row carried forward unexamined says so, rather than borrowing the
freshness of the rows around it.

| # | Claim | Source (URL) | Checked | Result |
|---|---|---|---|---|
| 1 | EU AI Act Annex III → 2 Dec 2027; Annex I → 2 Aug 2028 (Digital Omnibus) | Reg. (EU) 2026/1744 — [`eur-lex.europa.eu/eli/reg/2026/1744/oj`](https://eur-lex.europa.eu/eli/reg/2026/1744/oj) | **rev 3** | **✓** dates correct — **and no longer pending**: published OJ **24 Jul 2026**, in force **27 Jul 2026**. Every "expected, not yet in force" hedge is stale (R2). *EUR-Lex returned an empty body to direct fetch; confirmed via three independent legal analyses in agreement. Primary text unread* |
| 2 | Art 99: €35M/7% for prohibited practices; €15M/3% other; €7.5M/1% misinformation | Reg. 2024/1689 Art 99 — [`eur-lex.europa.eu/eli/reg/2024/1689/oj`](https://eur-lex.europa.eu/eli/reg/2024/1689/oj) | rev 1 | **✓** review correct · *carried forward, not re-checked* |
| 3 | Coding agents generally **not** Annex III high-risk | Art 6 / Annex III / EC draft classification guidelines — [`digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai`](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai) | rev 1 | **✓** review correct; our C9 wrong (R1) · *carried forward* |
| 4 | Art 4 AI literacy + Art 50 transparency **unchanged** by the Omnibus | Reg. (EU) 2026/1744 — [`eur-lex.europa.eu/eli/reg/2026/1744/oj`](https://eur-lex.europa.eu/eli/reg/2026/1744/oj) | **rev 3** | **✗ *(was ✓)* — this row was wrong and it was ours.** Article 4 is **replaced** by a softened duty to *support* AI literacy (no guaranteed level), applicable from **27 Jul 2026**. Article 50 is not "unchanged and biting now": it applies from **2 Aug 2026**, with a transitional to **2 Dec 2026** for Art 50(2) marking on generative systems already on the market. The smug "neither document mentions this" compounded the error (R2) |
| 5 | OWASP Agentic Top 10 2026 exists; **ASI08 = Cascading Failures** | OWASP GenAI Security Project, announced 9 Dec 2025 — [`genai.owasp.org`](https://genai.owasp.org/) | rev 1 | **✓** our A1 citation correct · *carried forward* |
| 6 | METR maintainer study: 296 PRs, ~half of test-passing PRs not mergeable, 24.2 pp gap | [`metr.org/notes/2026-03-10-many-swe-bench-passing-prs-would-not-be-merged-into-main/`](https://metr.org/notes/2026-03-10-many-swe-bench-passing-prs-would-not-be-merged-into-main/) | rev 2 | **✓** — 4 maintainers, 3 repos, 95 tasks; **plus** ~68% of human golden patches re-accepted (review omitted). *Rev 2:* the re-reviewers were **recruited** maintainers, not necessarily the original mergers — the figure is review-pipeline noise, **not** a 32% defect rate |
| 7 | OpenAI audit: "249 of 731 — 34.1% broken"; OpenAI "retracted SWE-Bench Pro" | [`openai.com/index/separating-signal-from-noise-coding-evaluations/`](https://openai.com/index/separating-signal-from-noise-coding-evaluations/) | **rev 3** | **± *(counts ✓; the retraction verb ✗)*** counts **are** published: pipeline **200 (27.4%)**, human campaign **249 (34.1%)** of 731; pass rate 23.3% → 80.3% in 8 months. **But OpenAI retracted its *recommendation* that the community use the benchmark — it does not own SWE-Bench Pro (Scale AI does) and did not withdraw it.** "OpenAI retracted SWE-Bench Pro" is our shorthand and is corrected. *openai.com 403s to direct fetch; confirmed via verbatim quotation in search results and multiple independent write-ups* |
| 8 | METR uplift update revises the 19%-slower result | [`metr.org`](https://metr.org/), 24 Feb 2026 | rev 1 | **✓** ≈18% *speedup* for original cohort (CI −38%…+9%); severe recruitment/task-selection bias; authors call the central estimate "likely a bad proxy" · *carried forward* |
| 9 | NIST SP 800-218A is the converged guidance for agentic SDLC controls | [`nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218A.pdf`](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218A.pdf) §1.2, p. 2 | **rev 3** | **✗** — **primary text read this round.** §1.2: scope is "AI model development… as well as incorporating and integrating AI models into other software," and "practices for the **deployment and operation** of AI systems with AI models **are out of scope**." Our own D9 prose had listed deployment as in-scope; corrected there (D9) |
| 10 | NSA MCP security CSI, May 2026 | NSA AISC, 20 May 2026 — [`media.defense.gov`](https://media.defense.gov/) | rev 1 | **✓** review correct (my initial suspicion of a date error was wrong) · *carried forward* |
| 11 | arXiv 2511.17330 supports "specification construction is the central bottleneck" | [`arxiv.org/html/2511.17330v3`](https://arxiv.org/html/2511.17330v3) (full text, not abstract) | rev 2 | **✓ *(rev 2 — was ✗)*** titled *"Agentic Verification of Software Systems"*; its intro states formal capture "requires significant efforts in manually annotating specifications and crafting loop invariants," and prices proof at **seL4 22 person-years**, **CompCert 6 person-years / 100k lines**. The ✗ came from reading only the abstract. Soften "*the* central" → "*a* central" (D10) |
| 12 | arXiv 2605.30914 is on "formal-verification limitations for agentic software" | [`arxiv.org/html/2605.30914v1`](https://arxiv.org/html/2605.30914v1) | rev 2 | **± *(rev 2 — was ✗)*** the **label** is inaccurate (it is *"Automating Formal Verification with RL and Recursive Inference"*, Max Tan, 29 May 2026), but the **content supports the claim**: it reports **specification hacking** — "models exploit weak formal specifications instead of implementing the intended solutions." Dafny 9.7%→31.1%; Lean 46.2%→69.2% (D10) |
| 13 | CVE-2026-25253 was a malicious skill package, *not* a code vulnerability | **NVD** (authoritative) — [`nvd.nist.gov/vuln/detail/CVE-2026-25253`](https://nvd.nist.gov/vuln/detail/CVE-2026-25253) | rev 2 | **± *(rev 2 — was ✗)*** it **is** a code vulnerability (CVSS 8.8), so the original claim is wrong — **but** per NVD it is `gatewayUrl`-from-query-string → unprompted WebSocket sending a token, fixed before **2026.1.29**. Rev 1's "Docker sandbox escape via crafted skill, patched v2.3.1" was **not sourced and is retracted** (R3) |
| 14 | SWE-CI benchmark supports agentic entropy | [`arxiv.org/html/2603.03823v4`](https://arxiv.org/html/2603.03823v4) | rev 2 | **✓** 100 tasks, 233-day/71-commit histories, 20 models; quality decay over evolution confirmed (R5). Note it is a benchmark **preprint** — it evidences the *pressure*, not a new stone (Q1 stays open) |
| 15 | *(new, rev 3)* "Routing, cost and rate-limiting are handled by the existing LiteLLM proxy" | `~/.litellm-proxy/config.yaml` — the config the launchd job loads (local, unversioned) | **rev 3** | **±** allow-list ✓ · RPM ✓ · concurrency ✓ · routing ± (no fallbacks, no complexity routing) · **cost ceiling ✗ — absent and unenforceable as configured** (`store_model_in_db: False`, no `database_url`, so spend tracking cannot run). See D14 |

**Not verified** (not load-bearing for any priority decision, recorded for honesty): METR task-horizon
extrapolations; Anthropic multi-agent token-cost figures; DORA 2025 amplifier framing; the repository's
"Cursor research, June 2026" reward-hacking citation in C11; SEAlign / ICSE 2026 in B8.

### Reviewed-artifact provenance — **a gap, not a record** *(rev 3)*

This file opens by claiming "every line-level claim was checked against the cited line in the cited file."
For *our* files that is true and re-runnable. For the **subject of the review it adjudicates, it is not
checkable at all.**

*SOTA SDLC Review — July 2026* and the round-2 response exist nowhere in this repository. No copy, no URL,
no content hash, no author, no receipt date. Every sentence in §1 that characterises what the review
"treats as missing," "proposes," or "does not engage" is therefore an assertion no future reader — including
a future session of mine — can verify or refute. Rev 3 found two places where that licence was used to
manufacture a disagreement (**D2**'s fourth amplifier, **D3**'s ceremonious `accept`); there is no way to
know whether it happened elsewhere, and that is precisely the problem.

**This is a live defect in the evidence graph, not a filing inconvenience.** D5 requires a signed chain from
requirement to artifact. This file is an *input* to Phase 0 priorities and its principal source is
unretained — the exact failure mode the roadmap exists to prevent, committed in the document arguing for it.

**Required before this file is cited as factory evidence.** For the reviewed artifact: verbatim copy stored
in-repo (or its URL plus a SHA-256 of the exact bytes assessed), author or provenance, receipt date, and the
revision of *our* documents it was assessed against. For each external citation: direct URL, access date,
and the specific section relied on — §4 now carries URL and round; **access dates and quoted sections are
still missing for rows carried from rev 1 and rev 2**.

**On internal line anchors.** Citations of the form `ROADMAP.md:259` are anchors into a living file and rot
on the first insertion. Two had already rotted when rev 3 checked them: `ROADMAP.md:259` was cited for C8
but now lands on the A3 row (C8 is `:276`), and `ROADMAP.md:244` was cited as the B1 row but now lands
mid-paragraph in the C3b bullet (B1 is `:261`). Both are repaired below and in `ROADMAP.md`. **Cite a
section and a row identifier, not a line number**, for anything expected to outlive one edit.

**Rev 2 · what re-verification changed.** Items 7, 11, 12 and 13 were re-checked against primary sources
after the round-2 response challenged them, and **all four moved** — three away from ✗. The pattern in the
misses is worth recording, because it is mechanical and therefore preventable:

1. **Item 11** — judged a paper on its **abstract**. The supporting claim was in the introduction.
2. **Item 12** — inferred content from a **wrong title**. A mislabelled citation is not an unsupportive one.
3. **Item 13** — asserted a CVE mechanism from **plausible reconstruction** rather than the NVD record, and
   the fabrication then justified a P1 priority.
4. **Item 7** — asserted a figure was derived without checking whether the source published it.

Net effect on this file's headline: "four of its citations do not say what it says they say" survives as
**one** (item 9, NIST SP 800-218A) plus one inaccurate label (item 12). Item 13 was our error, not the
review's.

---

## 5. Bottom line

The review should be adopted as the **primary input** to the next phase, with the fourteen corrections
above applied. Its architectural finding is correct and is the most valuable thing anyone has said about
this repository: **the core ontology appears viable and repairable without new bedrock, and the factory is
absent.**

**Rev 3 — the earlier wording, "the ontology is sound," is retracted as an overclaim against this file's own
findings.** *Sound* is a strong word, and in a document whose Phase-0 gate is "no known internal
contradiction in the gate calculus or Done schema," it is a word with a test attached. This file documents
six defects that fail that test:

| Defect | Where |
|---|---|
| The composition argument is circular without Premise C | D4 → E2 |
| Two incompatible readings of the Done schema's own four axes | D5 → E1 |
| §6.4's collapse rule contradicts §11.2's convergent law at collapsed nodes | D8 → E4 |
| The "exactly eight stones / exactly two seats" completeness claim is overclaimed | §5 below → E12 |
| Chapter 12 derives the human terminal in three places while §138–141 disowns it | D1 → E5 |
| Failure routing treats a green *check* as a true *leaf* | D4 → E6 |

An ontology with a circular composition argument and a self-contradicting gate calculus is not *sound*; it
is **viable and repairable** — which is the genuinely favourable finding, and the one the evidence carries.
The distinction is not pedantry: "sound" would mean Phase 0 is optional, and Phase 0 is the phase this
roadmap says gates everything else. Claiming soundness before the repairs land contradicts our own gate.

Its recurring methodological flaw is that it audits the **design document** without reading the
**canvas**, and audits chapters in isolation without following their own cross-references. That is how §1
presents capability and liveness as unconsidered when the canvas assigns them in the sentence justifying
the two-seat tier; and how §4 warns of unbounded ceremony without engaging §6.4. *Rev 2 removed one example
from this list:* §5's human-as-ground-truth objection had a real target after all, because Chapter 12 states
the claim it attacks in its own §73, §161 and L4 chart even while §138–141 disowns it (see D1). Reading the
cross-references would not have saved that one — the contradiction is ours. ***Rev 3 removes a second:*** the
exception-mechanism example is withdrawn with D3. The review asked for a governed exception mechanism and was
right to; siting it at `escalate` is our clarification, not its oversight. Two of the four illustrations of
the review's "recurring flaw" turned out to be ours.

The correct disposition, therefore, is **not** the review's "preserve the repository as a conceptual
constitution after retracting its unjustified completeness claims." Only one completeness claim needs
genuine retraction (the "exactly eight / exactly two" derivation from the bundling rule, which the review
refutes correctly and which the canvas itself already treats as a self-test heuristic rather than a proof).
The rest are **repairs inside the existing vocabulary** — Premise C, the boundary/acceptance split, the
invariant/posture split, gate-attachment granularity — each of which makes the model stronger without
weakening its derivational discipline. That distinction is the difference between a roadmap that builds on
this work and one that restarts it.

---

## 6. Rev 2 · after the round-2 response

The reviewer's round-2 response was adjudicated the same way this file adjudicated the original review:
every disputed line read in place, every disputed source fetched. **All fourteen of its dispositions stand**
— the nine it accepts, the three it narrows (D1, D12, D14), and the two it rejects (D10, D11).

| Verdict here | Rev 1 | Rev 2 | Why |
|---|---|---|---|
| D1 | DISAGREE | **PARTIAL** | Ch 12 contradicts itself at §73 / §161 / L4 chart |
| D10 | DISAGREE on sourcing | **PARTIAL** | both papers do support the sentence; only one label was wrong |
| D11 | DISAGREE | **WITHDRAWN** | OpenAI published `200 (27.4%)` and `249 (34.1%)` |
| D12 | DISAGREE | **PARTIAL** | the folds are asserted, not argued → Q10 |
| D14 | PARTIAL | **PARTIAL, accounting repaired** | C3 was double-counted, C8 never dispositioned |
| R3 | "sandbox escape" | **retracted** | NVD contradicts the mechanism; it was reconstruction, not sourcing |
| R5 | filed as our error | **reclassified** | it is an evidence upgrade |

**What did *not* change, and this is the load-bearing part.** Every architectural call survives untouched
and the reviewer concedes each: hard gate → `escalate` rather than a ceremonious `accept`; **Premise C**;
the boundary / acceptance-vector split; the §6.4 ↔ §11.2 contradiction and the accountable-work-unit fix;
the outcome / authority / epistemic decomposition of gate sources; controller versus plant; and **E12** as
the single genuine retraction. The round-2 response independently agrees the model needs repairs inside its
own vocabulary rather than rebuilding, and endorses the four-phase structure of
[`ROADMAP.md`](ROADMAP.md).

**The asymmetry is the honest summary.** What round 2 overturned was **citation work** — in four places,
one of which (R3) was fabricated rather than merely mis-read, and which had already propagated into a P1
justification. The derivation held; the sourcing discipline did not. Two process rules follow, and they are
cheap:

1. **Read the introduction, not the abstract**, before declaring that a paper does not support a claim.
2. **For a CVE, NVD is the source.** A mechanism that sounds right is not a mechanism that was checked.

One item the round-2 response also gets slightly wrong, recorded for symmetry: it cites C8's resolution at
`ROADMAP.md:254`, which is the C3 row. *(Rev 3: our correction "C8 is at `:259`" has itself rotted — see
D14.)* Immaterial to its argument, which stands.

---

## 7. Rev 3 · after auditing this file against itself

Round 3 checked no new external review. It audited **this file**, and the results are worse than rev 2's in
one specific way: rev 2's failures were *sourcing* failures against outside material, while three of rev 3's
are contradictions **visible inside this document without leaving it**.

| Item | Rev 2 | Rev 3 | Why |
|---|---|---|---|
| D2 count | "five of seven subsumed" | **three of seven** | The prose contradicted its own table, which marks two of its five rows "not amplification" |
| D2 accusation | "the proposed fix is a category error" | **narrowed** | The quoted sentence proposes no fourth amplifier; the rest of the review is unpreserved and uncheckable |
| D3 | PARTIAL (framing wrong) | **AGREE, with implementation clarification** | The "collapses the gate calculus" consequence was derived from a position never quoted or evidenced |
| D9 scope sentence | listed deployment in scope | **corrected from the primary text** | SP 800-218A §1.2 puts deployment and operation expressly out of scope — the verdict was right, its supporting sentence repeated the error |
| D14 · LiteLLM | "routing, cost and rate-limiting genuinely is [handled]" | **cost ✗** | The running config has no budget and, with no DB, can enforce none. Routing/RPM/concurrency verified present |
| §2 · item 11 | "OpenAI retracted SWE-Bench Pro" | **retracted its *recommendation*** | OpenAI neither owns nor withdrew the benchmark (Scale AI's) |
| §3 · R2 | Omnibus "expected, not yet in force" | **in force** | Reg. (EU) 2026/1744, OJ 24 Jul 2026, in force 27 Jul 2026 |
| §4 · row 4 | "Art 4 + Art 50 unchanged" ✓ | **✗** | Article 4 was **replaced**; Article 50 applies 2 Aug 2026 with a 2 Dec 2026 transition — neither "untouched" nor "biting now" |
| §5 | "the ontology is sound" | **"viable and repairable"** | Six documented defects fail this file's own Phase-0 gate |
| §4 | sources named | **URLs + round; provenance gap recorded** | The reviewed artifact was never stored or hashed; two internal line anchors had rotted |

**What did *not* change, again.** No architectural call moved. Premise C, the boundary/acceptance split, the
invariant/posture split, gate-attachment granularity, the outcome/authority/epistemic decomposition,
controller-versus-plant, and **E12** as the single genuine retraction all stand, as does the four-phase
structure of [`ROADMAP.md`](ROADMAP.md). The C9a/C9b split survives the legal correction intact — because
C9a was justified by our own amplifier rather than by a date, which is exactly the property it was given for.

**The pattern, stated so it can be designed against.** Rev 2 concluded "the derivation held; the sourcing
discipline did not." Rev 3 narrows that further: **the derivation holds; what fails is every claim about
something outside the derivation** — an external paper, a CVE record, a statute, a running proxy, a reviewer's
intent. Each rev-3 error is an *assertion about a thing not in front of us*, made confidently and never
re-checked. Three process rules follow, and they replace exhortation with a mechanical test:

1. **A claim about an artifact you cannot produce is not a finding.** Preserve or hash the artifact, or narrow
   the claim to what you quoted. (D2, D3)
2. **Re-read your own document against itself before publishing a correction round.** D2's count and D9's
   scope sentence needed no external access — only a second pass. (D2, D9)
3. **A control is "handled" only when its configuration has been read this round.** Not when the environment
   is presumed to provide it. (D14)

Rule 3 is the one with teeth, because it is the failure this whole exercise is about: an assumed control that
nothing tests is precisely what Tier D exists to make impossible, and it was sitting in our own toolchain.
