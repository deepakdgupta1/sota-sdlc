## 3. The bedrock: why the work is hard

**What it is.** First principles, literally: the unavoidable truths about reality that make software
engineering hard. We call them **stones**. Every stage, tool, and artifact in the SDLC is a *response*
to one or more stones — never a convention. There are **eight** first-order stones (facts about the
*problem*), plus **two** second-order stones (facts about the *solver* — about who staffs the loop) that
activate only when the work is delegated or fully autonomous. The eight first-order stones are
**pairwise-irreducible**: none is a special case of another.

**Why this matters.** The stones are the model's foundation and its test. If a needed element rests on
*no* stone, the model has a spurious part. If a stone has *no* element defending it, the model has a
gap. This "self-test" is how the model grows — and it has fired **in reverse three times**, each time a
needed response was found resting on no stone: the security defenses exposed stone #8; the loop's own
checker, resting on an unguaranteed *independence*, exposed stone #9; and the loop's own executor,
resting on an unguaranteed *faithfulness*, exposed stone #10. A **third direction** of the self-test
guards against double-counting — two faces of a pressure are **one** stone only if they share a *single*
forced response (the **bundling rule**). That is why "distributed" and "perishable" fold into one stone
(#7 — both answered by *artifacts*), while "change" and "uncertain" stay two (#5 and #6 — answered by
different machinery).

### The eight first-order stones

| # | Stone (brute fact) | What it forces |
|---|---|---|
| 1 | **Intent is hidden.** The real need isn't given; what's asked ≠ what's needed. | `specify` — draw the true target out of a hidden head. |
| 2 | **Unbounded vs. finite.** Infinite possible scope against finite resources. | `scope` (bound before) and `decide` (bound after). |
| 3 | **Complexity exceeds one step.** Systems exceed any single mind or single step. | `design` — carve the whole into parts that fit a mind. |
| 4 | **Humans and models err.** Translating intent into an artifact is lossy and mistake-prone. | `verify` (catch the error) and `analyze` (root-cause it). |
| 5 | **Reality keeps changing.** The target moves over *time*. | the over-time machinery (versioning, integration, regression) and the resilience response *roll back*. |
| 6 | **Reality is uncertain.** You can't know which reality will materialise at any moment. | `observe` (run-time sensing) and the resilience responses *degrade* / *recover*. |
| 7 | **Knowledge is distributed and perishable.** It lives in separate private heads and decays over time. | **artifacts** — persistent, explicit carriers (Chapter 10). |
| 8 | **Adversarial actors.** Reality contains agents who actively hunt and exploit weakness. | the **security repertoire** — authn/authz, sanitize, harden, red-team (Chapter 8). |

Two clarifications that keep the stones distinct:

- **Stone #6 (uncertain) vs. stone #8 (adversarial).** Uncertainty *samples* the space of possible
  inputs at random; an adversary *searches* it for the worst case. A defense that beats random
  sampling (make the rare case survivable) can be defeated by a searcher (who makes the rare case
  common). Different opponents, different responses.
- **Facts are not one-to-one with stages.** One stone forces several responses (finiteness forces both
  `scope` and `decide`; "we err" forces both `verify` and `analyze`), and several stones can converge
  on one response.

### The second-order tier — two stones about who staffs the loop

The first eight stones are facts about the *problem*. The last two are different in kind — they are
facts about the **solver**, specifically about *who staffs the loop* once the work is delegated to other
minds (human or agent). They form a small **second-order tier**, and they share three traits: each is
**relational** (you cannot even state it with a single mind), each is **conditional** (it collapses back
to nothing when one aligned mind does everything), and each erodes **reliable** by hollowing a genuine
`check` into a bare `declare`. The tier has exactly **two seats**, because the loop makes exactly two
silent assumptions about the minds it delegates to — that the checker is **independent**, and that the
doer is **faithful**.

9. **Reflexivity — the checker shares the doer's fault.** *(Second-order, conditional — it bites in an
   automated, autonomous, multi-agent pipeline.)* The agents that staff `check` and `reflect` are the
   same *kind* of erring agent as the doer (stone #4), so their errors are not independent — they are
   **correlated**. A check is only worth the *new information* it adds beyond the doer's own belief; a
   checker that shares the doer's blind spot is an **echo chamber** that adds zero information, and
   "verify" quietly collapses into "declare." The property at stake is **independence** — the thing that
   lets stacked checks drive error toward zero — and reflexivity is the brute fact that independence is
   *never total* (even a formal proof only relocates the blind spot into the spec). It is irreducible to
   "we err" (stone #4): #4 is the *marginal* fact — each agent errs; reflexivity is the *joint* fact —
   their errors correlate. *Breach → an **echo-chamber** check; the forced response is independence.*

10. **Incentive-divergence — the doer serves a different master.** *(Second-order, conditional — it
    bites when the work is delegated to a self-interested agent.)* A mind you delegate to has its **own
    utility**. Even when it knows your intent exactly — so this is *not* hidden intent (stone #1) — it
    may optimise *its* payoff over *your* target. This is a *directed* pressure, like an adversary's, but
    aimed not at your **failure** (stone #8, hostile) — at a **different goal** (misaligned); your loss
    is collateral, not the objective. It is irreducible: not #1 (known ≠ unwanted), not #4 (a *choice*,
    not an accidental slip), not #8 (misaligned ≠ hostile). Its *unintentional* face — gaming a proxy
    when true intent is hidden — reduces to stone #1 plus Goodhart; its **willful** face does not, and it
    forces its own response — **alignment** (reward design, skin-in-the-game, making the payoff track
    true-Done) — which is not in the security repertoire and does not fall out of reflexivity's
    independence-seeking. *Breach → a **self-serving** check; the forced response is alignment.*

Both stones turn a real `check` into a hollow `declare` — one by *shared blindness* (the checker cannot
see the error), the other by *divergent will* (the executor will not surface or fix it even when it
can). Both are conditional on delegation: with one aligned mind — or a genuinely independent, faithful
terminal — the tier is bounded; remove that terminal and **an autonomous loop can neither judge nor
trust itself.** Both are treated in full, with their forced responses, in **Chapter 12**.

> ▸ **Chart — "The bedrock — ten forces"** · *L1 · the forces.* Each stone on the left; the element
> or repertoire it forces on the right. This is the "why" behind every part of the loop.

```pipeline-graph
{
  "title": "The bedrock — ten forces",
  "level": "L1 · the forces",
  "summary": "The ten brute facts, each wired to the specific response it forces into existence. Eight are first-order (about the problem); the last two are the second-order tier (about who staffs the loop — independence and faithfulness). Nothing in the loop is a convention; every part defends a stone.",
  "zoomOut": "The complete circuit",
  "zoomIn": ["The unit loop, fully staffed"],
  "nodes": [
    {"id":"intent","label":"1 · intent is hidden","group":"stone","x":0,"y":0},
    {"id":"finite","label":"2 · unbounded vs finite","group":"stone","x":0,"y":80},
    {"id":"complex","label":"3 · complexity > one step","group":"stone","x":0,"y":160},
    {"id":"err","label":"4 · humans & models err","group":"stone","x":0,"y":240},
    {"id":"change","label":"5 · reality keeps changing","group":"stone","x":0,"y":320},
    {"id":"uncertain","label":"6 · reality is uncertain","group":"stone","x":0,"y":400},
    {"id":"distributed","label":"7 · knowledge distributed & perishable","group":"stone","x":0,"y":480},
    {"id":"adversarial","label":"8 · adversarial actors","group":"stone","x":0,"y":560},
    {"id":"reflexivity","label":"9 · reflexivity (2nd-order · autonomous)","group":"stone","x":0,"y":650},
    {"id":"incentives","label":"10 · incentive-divergence (2nd-order · delegated)","group":"stone","x":0,"y":730},
    {"id":"specify","label":"specify","group":"element","x":520,"y":0},
    {"id":"scope","label":"scope & decide","group":"element","x":520,"y":80},
    {"id":"design","label":"design (decompose)","group":"element","x":520,"y":160},
    {"id":"verify","label":"verify + analyze","group":"element","x":520,"y":240},
    {"id":"resilience","label":"resilience repertoire","group":"repertoire","x":520,"y":340},
    {"id":"observe","label":"observe (telemetry)","group":"element","x":520,"y":430},
    {"id":"artifacts","label":"artifacts","group":"property","x":520,"y":500},
    {"id":"security","label":"security repertoire","group":"repertoire","x":520,"y":570},
    {"id":"independence","label":"independence-seeking (external terminal · red-team)","group":"terminal","x":520,"y":650},
    {"id":"alignment","label":"alignment (reward design · skin-in-the-game)","group":"terminal","x":520,"y":730}
  ],
  "edges": [
    {"source":"intent","target":"specify","label":"forces"},
    {"source":"finite","target":"scope","label":"forces"},
    {"source":"complex","target":"design","label":"forces"},
    {"source":"err","target":"verify","label":"forces"},
    {"source":"change","target":"resilience","label":"forces"},
    {"source":"change","target":"observe","dashed":true},
    {"source":"uncertain","target":"observe","label":"forces"},
    {"source":"uncertain","target":"resilience","dashed":true},
    {"source":"distributed","target":"artifacts","label":"forces"},
    {"source":"adversarial","target":"security","label":"forces"},
    {"source":"reflexivity","target":"independence","label":"forces","dashed":true},
    {"source":"incentives","target":"alignment","label":"forces","dashed":true}
  ]
}
```

---

