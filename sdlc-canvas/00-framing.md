# SDLC First-Principles Canvas — Living State Document

> **What this is:** the evolving, self-contained state of a Socratic, first-principles
> derivation of *what constitutes a reliable, predictable, resilient, and secure software-engineering
> SDLC, and why every piece is logically required.* It is written so the whole journey can
> be resumed from this file alone, with a fresh/cleared context.

- **Last updated:** iteration 36 (**documentation-parity pass — synced the design doc to the iter-35 model; no derivation advanced**): folded the closed T6 into `sdlc-design-document.md` — Ch 3 bedrock reworked (ten stones; the three-direction self-test with the **bundling rule**; a new **"second-order tier"** section with #9 as the first seat and **#10 incentive-divergence** as the second; bedrock chart → **"ten forces"**), Ch 12 restructured to both seats (+ the **alignment** machinery + a broadened L4 **"second-order tier"** chart), the L0 circuit chart + Ch 2 autonomy callout gain the #10 node/edge, and the glossary, stones-matrix (row 10), and Appendix C (parity + road-ahead) updated. All 21 design-doc charts validate; both viewers render clean. **Design doc + `HANDOFF.md` now at full iter-35 parity.** *(Prior: iter 35 — **T6 folded into the canvas → the bedrock pressure-test CLOSED**: admitted conditional second-order **stone #10 (incentive-divergence)** + formalized the second-order tier (order = arity of referent; two seats — independence #9 · alignment #10); 8 first-order stones pairwise-irreducible + the bundling rule; cost-asymmetry rejected → §12. **Bedrock is now 8 first-order + 2 second-order.** iter 34 — doc-parity pass to iter 33, **T10 closed**; iter 33 — parallel fold-in closed **T3/T7/T8/T11** + folded T9 (§10.8/§10.9/§10.10, the existence-hard/fidelity-graded law); iter 32 — §10.7. Full trail: §13.)*
- **Status:** canvas = **ideal MUST-HAVE** derivation (concrete-setup audit descoped, iteration 28). Apex **four properties** (reliable · predictable · resilient · secure); behaviour→property map complete (**preempts→secure**); `secure` recurses every seam (§10.3); hard gate = non-compensatory leaf, 3 amplifiers (§10.4); **`reflect` = forced-MUST-HAVE beat / only *backward* channel (§10.5)**; **`observe` = forced sensor; telemetry = detector + analyze-operand, graded-with-gates (§10.6)**; bedrock **8 first-order stones + two conditional 2nd-order (reflexivity #9 · incentive-divergence #10, §3), on a formalized second-order tier**; artifacts (§9, + boundary-distance law); Done / design-as-a-bet / two bars (§10–§10.2). **All open work: §11 Open-tracks register.** Active: **T3/T6/T7/T8/T11 closed** (iter 33 → §10.8/§10.9/§10.10; **iter 35 → §3 stone #10 + the second-order tier**) + the *existence-hard / fidelity-graded* convergent law (§12); T9/T10 folded/closed. Next: **T11's three promotion-forks · T2's general-seam residue** (roadmap heads §11). Docs: design doc + `HANDOFF.md` **synced to full iter-35 parity** (design-doc parity pass, iter 36 → ten-stone bedrock, second-order tier, the two updated charts).

---

## ▶ RESUME INSTRUCTIONS (read first on a fresh context)

You are the assistant resuming a Socratic teaching journey with the user. Do this:

1. Read this entire document — it is the complete derived model and the current frontier.
2. **Method (do not break it):** Socratic + first-principles + handholding. *Ask, let the
   user reason, then reflect/sharpen their answer and slot it into the model.* Do not
   lecture or hand over answers unless the user explicitly asks ("what's the answer?").
   Maintain an evolving visual when it helps; visuals are regenerable from this file, so
   they are disposable.
3. Go to **§11 Current frontier** and continue from the **pending question** there.
4. After each meaningful step, **update this document** (the model sections + §11 frontier + §13 log).
   This file — not the chat history — is the source of truth.

---

## 1. The core question

From first principles: what are the irreducible pieces of an SDLC that make it
**reliable, predictable, resilient, and secure**, and *why is each piece logically required* (i.e.
forced into existence, not adopted by convention)?

## 2. The destination — four properties (the apex)

Four *distinct* properties in **two families**, each guarding a different failure.

**Point-properties — measured at a single point** (one task, one context). **reliable** and
**predictable** are **independent axes** (proven by two thought experiments: Setup A =
correct-but-unforeseeable = reliable-not-predictable; Setup B = foreseeable-but-wrong =
predictable-not-reliable).

**Envelope-properties — measured along the third axis** (**context-hardness × time**); each is
the envelope that keeps the point-properties alive across the *range* of contexts. §2 first named
a single envelope (*resilient*); **stone #8 splits the hardness axis by its source**, and the two
halves force **two sibling envelopes**:
- **natural / random hardness** — reality *changes* (#5) and is *uncertain* (#6); it **samples**
  the context-space blindly. Envelope against it → **resilient**.
- **directed / adversarial hardness** — an adversary (#8) **searches** the context-space for the
  worst case. Envelope against it → **secure**.

*Same shape, different opponent.* Both are envelopes over context-hardness — one against a blind
sampler, one against a directed optimiser — so **`secure` takes a fourth seat *beside* `resilient`,
not a slot *under* it.** It is **not** "resilience on the hardest context": the statistical
machinery that manufactures resilience (redundancy · retries · graceful degrade) *fails* against a
directed opponent (retries just feed a DoS — §12), so a distinct **security repertoire** (§6) is
required. And neither point-property is a peer of the two envelopes. **secure ⊥ resilient** the same
way §2 proves reliable ⊥ predictable — two setups: *resilient-but-insecure* (auto-failover + self-heal
under random load, behind an open auth bypass) and *secure-but-fragile* (hardened + authz-per-request,
but no redundancy, so a random outage kills it). Both exist → a fourth independent seat.

| property | family | plain meaning | guards against | measured | produced by (see §6) |
|---|---|---|---|---|---|
| **reliable** | point | faithful to intent; correct output, nothing missing or invented | "it gave the wrong thing" | at a point (one task, one context) | a loop that **converges** |
| **predictable** | point | foreseeable; low variance; you can call the output & timing in advance | "I couldn't foresee / plan around it" | at a point | a loop that is **bounded** |
| **resilient** | envelope · vs **random** | withstands **and recovers** across the range of contexts and over time; the envelope against *natural* hardness (#5 change, #6 uncertain) | "it collapsed on a hard context and couldn't recover" | along the context-hardness / time axis | loops that **nest & escalate** — the **resilience repertoire** |
| **secure** | envelope · vs **directed** | withstands a *directed* adversary hunting the worst case; the envelope against *adversarial* hardness (#8) | an attacker drove it to emit an output **outside its allowed set** — leaked secret · downtime (DoS) · forged / intercepted message | along the context-hardness axis, the **adversarial slice** | a loop that **preempts** — red-teams its own inputs for forbidden outputs, then forecloses them (the **security repertoire**, §6) |

> **Second-order erosion caveat (stones #9 · #10, §3 — the delegated / autonomous case).** `reliable` is
> manufactured by a loop that **converges**, which silently assumes two things about *who staffs the loop*:
> the checker is **independent** of the doer, and the doer is **faithful** to the target. Delegation breaks
> them — the two **second-order** stones: **#9 reflexivity** (correlated blind spots → an *echo-chamber*
> check) and **#10 incentive-divergence** (a self-interested executor → a *self-serving* check). Either way
> `check` hollows into a bare `declare` and the loop can converge to a **confident wrong fixed point** — a
> green check over a real defect — so `reliable` is the property the second-order tier most directly erodes.

> **Schedule caveat (stone #5, §10.10 — the time axis).** Boundedness (§4) buys `predictable` only its
> *cost* face (the loop terminates within a bound); *outcome* is bought by tight contracts (§10.2); but
> *schedule/timing* — "call *when* it ships" — is an **aggregate over the time axis**, not this
> point-property. It is manufactured by a **schedule bet** (`plan` = `scope`+`specify` projected onto time —
> estimate = the stub of a task; critical-path = stub-composition on time, §10.10), whose written baseline is
> existence-hard / content-graded (**plan : predictable :: ADR : reliable**).

