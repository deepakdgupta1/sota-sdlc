## 3. The bedrock: why the work is hard

<sup>[↪ Why](#r-bedrock-01)</sup>

**What it is.** First principles, literally: the unavoidable truths about reality that make software
engineering hard. We call them **stones**. Every stage, tool, and artifact in the SDLC is a *response*
to one or more stones — never a convention. There are **eight** first-order stones (facts about the
*problem*), plus **two** second-order stones (facts about the *solver* — about who staffs the loop) that
activate only when the work is delegated or fully autonomous. The eight first-order stones are
**pairwise-irreducible**: none is a special case of another.

> **What kind of claim this is.** The bedrock is a **derived, pressure-tested hazard taxonomy with an
> explicit admission criterion** — not a proof of exhaustiveness. A pressure earns a seat when it is a
> brute fact about reality (not a contingent choice), it forces a response the existing stones do not
> already force, and it survives the three-direction self-test below. That criterion is what makes the
> taxonomy useful and falsifiable: a candidate eleventh stone is *admitted* by meeting it, not excluded
> by a closed count. What is **not** established is that exactly eight first-order stones and exactly
> two second-order seats are the only possibilities — the bundling rule is a **self-test heuristic, not
> an identity criterion**, because the relation between pressures and responses is many-to-many. Read
> the counts as the current, well-tested state of the taxonomy; read the criterion as the thing that
> would settle any dispute about them.

**Why this matters.** The stones are the model's foundation and its test. If a needed element rests on
*no* stone, the model has a spurious part. If a stone has *no* element defending it, the model has a
gap. This "self-test" is how the model grows — and it has fired **in reverse three times**, each time a
needed response was found resting on no stone: the security defenses exposed stone #8; the loop's own
checker, resting on an unguaranteed *independence*, exposed stone #9; and the loop's own executor,
resting on an unguaranteed *faithfulness*, exposed stone #10. A **third direction** of the self-test
checks for double-counting: a shared forced response is evidence for bundling two descriptions, while
distinct responses are evidence for separate stones. This **bundling rule** is a heuristic because one
stone can force several responses and several stones can share one. On that basis, "distributed" and
"perishable" sit under #7, while "change" and "uncertain" remain #5 and #6.

### The eight first-order stones

<sup>[↪ Why](#r-bedrock-02)</sup>

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

<sup>[↪ Why](#r-bedrock-03)</sup>

The first eight stones are facts about the *problem*. The last two are different in kind — they are
facts about the **solver**, specifically about *who staffs the loop* once the work is delegated to other
minds (human or agent). They form a small **second-order tier**, and they share three traits: each is
**relational** (you cannot even state it with a single mind), each is **conditional** (it collapses back
to nothing when one aligned mind does everything), and each erodes **reliable** by hollowing a genuine
`check` into a bare `declare`. The tier has **two seats**, because the loop makes two silent assumptions
about the minds it delegates to — that the checker is **independent**, and that the doer is
**faithful**. *Two* is the count the admission criterion currently yields, not a proven ceiling: two
further candidates (a delegate's **capability** and its **liveness**) remain outside this tier under
the current admission judgment. Capability mismatch is a contingent property of the selected delegate
and task, handled through `design`, `verify`, and escalation under #3 and #4. It leaves a distinct need
for capability selection, tool access, and routing. Liveness failure is a contingent interruption of
the selected execution, handled through bounded work, recovery, and durable artifacts under #2, #5,
and #7. It leaves a distinct need for timeouts, checkpoints, and resumption. These residues are design
obligations, not evidence that either candidate is an irreducible brute fact. A case that meets the
admission criterion would change this judgment. <sup>[↪ Why](#r-bedrock-03)</sup>

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

10. **Incentive-divergence.** A persistent delegated party, such as a vendor, team, or contractor,
    can pursue its own payoff even when it knows the intended result. This differs from hidden intent
    (#1), accidental error (#4), and an adversary whose objective is harm (#8). Outcome-linked
    incentives and an accountable principal address this branch. <sup>[↪ Why](#r-bedrock-04)</sup>

    For non-persistent inference, the model assumes no continuing payoff that a task-level incentive
    can shape. This branch requires **capability containment, proxy-resistant evaluation, and
    independent evidence**. Bound the available tools, permissions, and effects; evaluate the intended
    outcome beyond an easily optimized score; and obtain evidence outside the executor's own report.
    This does not assert a separate utility or willful intent for an inference call.
    <sup>[↪ Why](#r-bedrock-06)</sup>

A delegated loop can report success despite a shared blind spot or an output that satisfies a proxy
instead of the intended result. Independent evidence limits reliance on that report. The doer's
safeguards depend on the delegate: incentives for persistent parties, containment and evaluation for
non-persistent inference. An accountable principal owns the result in either case. Chapter 12 treats
both branches in full.

> ▸ **Chart — "The bedrock — ten forces"** <sup>[↪ Why](#r-bedrock-01)</sup> · *L1 · the forces.* Each stone on the left; the element
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
    {"id":"alignment","label":"persistent party: incentives","group":"terminal","x":520,"y":730},
    {"id":"containment","label":"inference: containment · evaluation · evidence","group":"terminal","x":520,"y":810}
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
    {"source":"incentives","target":"alignment","label":"persistent party","dashed":true},
    {"source":"incentives","target":"containment","label":"non-persistent inference","dashed":true}
  ]
}
```

---
