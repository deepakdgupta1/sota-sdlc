## 3. The bedrock — brute facts that force everything

First principles = the unavoidable truths about reality that make the work hard. Stages and
tools are *responses* to these. **Facts are not 1:1 with stages** — one fact drives several
responses (finiteness → scope *and* decide; "we err" → verify *and* analyze).

1. **Intent is hidden** — the real need isn't given; what's asked ≠ what's needed.
2. **Unbounded vs finite** — infinite possible scope against finite resources.
3. **Complexity > one step** — systems exceed any single mind / single step.
4. **Humans & models err** — translating intent → artifact is lossy and mistake-prone.
5. **Reality keeps changing** — the target moves over *time*. *(resilience engine #1)*
6. **Reality is uncertain / varied** — you can't know which reality will materialise at any
   moment. *(resilience engine #2)*
7. **Knowledge is distributed & perishable** — it lives in separate private stores (no direct
   transfer between minds / context windows) *and* decays over time (memory fades, context
   clears). Two faces — *distributed* (agent crossing) + *perishable* (time crossing).
   *(forces artifacts; flushed by the artifacts derivation, iteration 16)*
8. **Adversarial actors** — reality contains agents who *actively search for and exploit* weakness.
   Not accidental (that's #4, *our* error) and not neutral variance (that's #6, which *samples* the
   value-domain at random): an adversary is a **directed optimiser** that *hunts* the worst case —
   the exact premise-B residue (§10.2) your sampling missed. *(forces the security repertoire, §6;
   admitted iteration 23 when the security Hard Gates — SQLi · XSS · CSRF · credential theft — were
   found resting on no stone.)*
9. **Reflexivity — the checker shares the doer's fault** *(second-order · conditional — autonomous
   multi-agent pipelines only)* — the agents that staff `check`/`reflect` are the same kind of erring
   agent as the doer (#4), so their errors are **correlated**, not independent: a checker sharing the
   doer's blind spot is an **echo-chamber** that adds **zero information** (`verify` collapses into
   *declare*). Independence — the property that lets stacked checks drive error → 0 (→ `reliable`) — is
   **never total**; a **common-mode floor** remains that no iteration crosses (even formal proof only
   *relocates* the shared blind spot to the spec). **Irreducible to #4:** #4 is the *marginal* fact
   (each errs); reflexivity is the *joint* fact (errors correlate). **Unlike #1–#8 (facts about the
   problem/reality), this is a fact about the *solver*** — a **second-order** stone — and it **only bites
   in the automated, autonomous, multi-agent pipeline:** with a human-in-the-loop the §4/§5
   **escape-hatch** is a partially-independent terminal and reflexivity stays bounded; remove the human
   (an executor staffing `escalate`/`decide` too) and independence at the terminal → 0, so **an autonomous
   loop cannot be its own ground truth.** *(Admitted iteration 31, T5 — the first second-order stone.)*
10. **Incentive-divergence — the doer serves a different master** *(second-order · conditional —
   delegated / self-interested-agent case only)* — a mind you delegate to has its **own utility**, so
   even with intent **fully known** (no #1) it may optimise *its* payoff over *your* target. This is a
   **directed** pressure like #8, but aimed **not at your failure (#8, hostile) — at a different goal
   (misaligned)**; your loss is collateral, not the objective. **Irreducible:** ≠ #1 (known ≠ unwanted),
   ≠ #4 (a *choice*, not an accidental slip), ≠ #8 (misaligned ≠ hostile). It **cleaves**: the
   *unintentional* face — proxy-gaming when true intent is hidden — reduces to **#1 + Goodhart** (the §12
   proxy law), no new stone; the **willful** face — divergent utility *despite* known intent — does not.
   It forces its own machinery — **alignment** (reward design · skin-in-the-game · make the payoff track
   true-Done) — which is **not** in #8's wall-building repertoire and does **not** fall out of #9's
   independence-seeking (so by the bundling rule they are *siblings*, not one stone). **Conditional:**
   collapses when principal = agent (one coherent utility cannot misalign with itself) — but model the
   delegate *realistically*, as the canvas already models #4 ("we err") and #9 ("we correlate"), and a
   bounded multi-drive agent carries a present-vs-future-self misalignment floor > 0, so perfect
   alignment is as unreachable as perfect independence. **The conative sibling of #9 — the second seat of
   the second-order tier.** *(Admitted iteration 35, T6 — the willful face; the fork turned on the brute
   gate and the user resolved it to admit.)*

> **Self-test the model uses (three directions).** If a needed element rests on *no* stone, a stone is
> missing; if a stone has *no* element defending it, there is a gap; **and if one stone shows two faces,
> they bundle into a single stone iff they share one forced response — else they split into siblings**
> (the **bundling rule**, T6). The model passes for **first-order stones 1–8** (unconditional) and admits
> **two conditional second-order stones — #9 (reflexivity) and #10 (incentive-divergence)** — for the
> delegated/autonomous case, which force **independence-seeking** (#9) and **alignment** (#10) in
> `check`/`reflect` (the non-removable external/human terminal · adversarial review — §6 `red-team`,
> doing double duty with #8). **The reverse direction has now fired three times:** the security gates
> rested on *no* stone → they exposed #8; the loop's own checker rested on *unguaranteed independence* →
> #9; the loop's own executor rested on *unguaranteed faithfulness* → #10.
>
> **Licensed exception — the base act (§10.10).** The first direction exempts **`implement`** (and its
> seam-analogue **`release`**): it is not a *response* to a stone but the **operand the loop controls** — the
> plant, not the controller. A control loop must have something to control, and that something rests on no
> difficulty (it *is* the thing made difficult, §10.7's inward leaf). The exception makes the self-test
> *sound* rather than flag a false positive.

**Admission criterion — what makes something a stone (made explicit, T6).** A candidate clears **three
gates**: **brute** (an unavoidable feature of the situation, not a policy you chose — a *floor > 0* you
cannot design away); **generative** (some element / repertoire-response / apex-property exists *solely*
as its answer — the reverse self-test); and **irreducible** (its forced machinery does **not** fall out
of another stone's — try to *derive* its response from an existing stone; if you can, it is a theorem,
not an axiom). Two **descriptors** then *classify* an admitted stone (they do not gate it): **class** —
*first-order* (referent = the task/world) vs *second-order* (referent = the solving configuration); and
**modality** — *unconditional* (#1–8) vs *conditional* (#9, #10 — bite only in a named regime). This is
how #8, #9, and now #10 were each admitted; cost-asymmetry (below) fails the brute gate and stays a §12
law, which shows the criterion has teeth.

**Reducibility (T6-i) — the 8 first-order stones are pairwise irreducible.** Running the scan (C reduces
to D iff C's forced machinery is entailed by D's), the four tempting pairs each part on **distinct forced
machinery**: **#1 vs #6** — both are "you don't know," but #1 is a gap about *intent*, closed **a-priori
by elicitation** (`specify`), while #6 is a gap about *world-state*, closed **only a-posteriori by
sampling** (`observe`); you can elicit neither which reality will occur nor observe your way to a hidden
intent. **#2 vs #3** — under the §12 *infinite-resources test* they move oppositely: scope-cut (#2)
**vanishes** given infinite resources, decompose (#3) **survives** (complexity is cognitive/structural,
not budgetary). **#5 vs #7** — a *moved world* (#5) **invalidates** a once-correct artifact (→
rollback/regression); *decayed memory* (#7) **deletes** it (→ persist); one erodes an artifact's
validity, the other its existence. **#5 vs #6** — variance **across time** (sequential drift → version/
rollback) vs **across possibility at one moment** (co-possible realities → redundancy/degrade). No
first-order stone reduces; all 8 survive.

**The bundling rule (the self-test's third direction, T6).** Two faces of a pressure **bundle into one
stone iff they share a single forced response**; if they force **distinct** responses they are **sibling
stones**. This principle-justifies the standing asymmetry: **#7 is one stone** (distributed + perishable
are both defeated by the *one* response — `artifact` = persist + make-explicit), whereas **#5 and #6 are
two** (change → rollback/regression on the *time* axis; uncertain → redundancy/observe on the
*possibility* axis — distinct machinery). It also discriminates **#9 and #10 as siblings**, not two faces
of one second-order stone (independence-seeking vs alignment are distinct responses).

**First-order vs second-order (T6-iii) — order = the arity of the stone's referent.** **First-order
(#1–8):** a property of *(solver × world)* — *monadic* in the solver, true of **one agent solving in
isolation**. This is exactly why **#4 ("we err") stays first-order** though it is "about the solver": #4
is the *marginal* fact (*each* agent errs, true of a lone agent). **Second-order:** a property of
*(solver × solver)* or *(solver × its own process)* — *relational*; it **cannot even be stated with one
aligned agent**. #9 is a doer↔checker *correlation* — which is *why* it is irreducible to #4 (marginal-
monadic vs joint-relational). The partition **predicts the class's shape**: second-order stones are
**relational** (≥2 roles), **conditional** (collapse when the configuration degenerates), and erode a
*point-property* by breaking a **silent assumption the loop makes about who staffs it**. The loop makes
**two** such assumptions — the checker is **independent** and the doer is **faithful** — so the
tier has **two seats**: **#9 reflexivity** (epistemic; breach → *echo-chamber* `declare`) and
**#10 incentive-divergence** (conative; breach → *self-serving* `declare`).

> **E12 · the epistemic status of the counts (2026-07-30).** "Exactly two seats" is retracted as a
> *proof* and restated as the current output of the **admission criterion**: the bundling rule is a
> self-test heuristic, not an identity criterion, because the pressure→response relation is
> many-to-many (`03:40`). Every stone stands; only the exhaustiveness claim goes. The bedrock is a
> **derived, pressure-tested hazard taxonomy with an explicit admission criterion** — which is what it
> has always actually been, and what makes it falsifiable rather than merely asserted.
>
> Consequently the two folds — **capability → #4** (monadic) and **liveness → #7** — are
> **criterion-based judgments, not passing assertions**, and their residue is **not yet recorded**:
> capability's forced responses (routing, decomposition, tool acquisition, capability selection,
> escalation) are not #4's verify-and-analyze, and liveness's (budgets, timeouts, checkpointing,
> durable execution) are not #7's *artifact*. Whether the folds are adequately argued is **Q10**
> (`ROADMAP.md` §8) — open, and the user's call whether to take up. **This records the judgment; it
> does not reopen T6.** The stone count is not being re-derived.

## 4. The atom — the unit control loop

Everything reduces to one feedback loop:

```
set target  →  do  →  check  →  reflect  →  (re-target ↺)
```

- It is **bounded**: a few tries, then stop — because each turn costs.
- **`check` is graded, not binary:** it measures *how well* on a quality range (via an
  objective metric, or a **proxy** when the true quality isn't directly measurable) and
  compares that to a **target threshold** → *done = measured ≥ threshold*.
- **`reflect` (was "correct"/"understand")** is the loop-closing beat. It **analyzes**
  (frames the issue — e.g. "loop can't converge" — and root-causes it), then **decides**:
  *accept* the gap as a known issue, or *re-target* (re-iterate by re-defining the target).
  Escalation is the third, cross-cutting exit. Investigation + judgement, not a mechanical fix.
- **Non-convergence is information**, not just failure: after honest tries, suspect the
  **target** (the spec), not only the build → escalate *up*.
- **The responses are cross-cutting, not a beat:** escalate · degrade · recover · roll back
  are a **repertoire** invoked from `reflect` at *any* element and *any* scale (mostly at
  run-time). They are forced by the two resilience stones (#5 change, #6 uncertainty) and are
  exactly what manufactures the **resilient** property.
- **The loop nests *down* as well as up:** every element (specify, design, implement, …) is
  *itself* a define → do → check → reflect loop with its own graded target and its own
  metric/proxy.
- **Escape hatch:** escalation ultimately ends at a human — the loop's one *independent* terminal. Stone
  #9 (§3) makes this load-bearing: **remove the human (full autonomy) and the checker's independence → 0**,
  so an autonomous loop cannot be its own ground truth.
- **"Definition of done"** = the target the `check` compares against — *a threshold on a
  quality range, not a yes/no*. It is *composite*:
  - **scope** sets the boundary (*how much / which items*),
  - **specify** sets correctness (*what's right*), across the **set of potential
    realities** → which is how one act sets targets for all three properties:
    expected reality → reliability, adverse realities → resilience, all enumerated up
    front → predictability.

**Loop behaviour → property:** converges → reliable · bounded → predictable · nests &
escalates → resilient · **preempts** (adversarially self-searches) → **secure**.

## 5. The fractal — the loop nests at every scale

The same shape repeats **in both directions**. *Outward* across scope — **design** (forced by
complexity) carves the whole into parts, and each part becomes its own loop, which *is* the
nesting; and *inward* into every element — addressing a single
element (e.g. specify) is itself a full define → do → check → reflect loop with its own
graded target and metric/proxy. **Two planes, then:** the *beats* (define → do → check →
reflect) are scale-invariant — the same four recur at every level; the *elements* (specify …
decide) are the **outermost** loop's staffing of those beats, re-instantiated by finer
activities at each level down. A stuck inner loop escalates to the loop above; the
outermost escape hatch is a human. *(Under full autonomy that independent terminal is gone — stone #9, §3.)*

```
action ⊂ feature ⊂ stage ⊂ release ⊂ product       ← outward (scope)
every beat ⊃ its own define → do → check → reflect → inward (each element)
```

**The inward nesting has a base case (§10.7).** A node whose forcing stone (§3) is absent collapses to
bare `do` — no `check`, no `reflect` (a keystroke can't be *wrong* in a way worth a loop). So the fractal
bottoms out on **both** axes: *outward* at a leaf `check` can judge without splitting (§10), *inward* at a
stone-free node. The only overrides that forbid the inward collapse are the **hard gates** (§10.4 — a
non-local violation) and **non-convergence** (a step judged trivial that keeps failing reveals a hidden
stone → re-expand).

