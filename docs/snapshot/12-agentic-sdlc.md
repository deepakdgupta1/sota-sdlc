## 12. The autonomous / agentic SDLC

<sup>[↪ Why](#r-agentic-01)</sup>

The same work-unit loop can be staffed by people or software agents. Delegation adds two risks when
other actors do the work and check it.

These risks grow with delegation. They are different in
kind from the first eight stones — those are facts about the *problem*; these are facts about the
**solver**, and about *who staffs the loop*. Together they form the model's **second-order tier**, and
the current tier has two seats: a checker can share the doer's error, and a doer's result can depart
from the intended target. This is the count admitted by the current pressure test, not a proven
ceiling. <sup>[↪ Why](#r-bedrock-01)</sup>
Persistent parties may pursue their own payoff; non-persistent inference needs containment and
evaluation. The loop assumes that its checker is *independent* and its doer is *faithful*.
Delegation can break either assumption.

### The first seat: reflexivity (stone #9) — the checker is not independent

<sup>[↪ Why](#r-bedrock-03)</sup>

An independent check uses evidence or a method whose errors are not strongly correlated with the
doer's. A different person can supply such a check, as can a test or reviewer with different failure
modes. Stacking checks helps only when they add information. This matters to **reliable**, the property
that the result meets the intended target. **Resilient** concerns continued operation and recovery
under changing conditions.

Reflexivity is the risk that an agent-staffed `check` or `reflect` shares the doer's error. Using the
same model, assumptions, or evidence can make their errors **correlated**. A check is worth the new
information it adds beyond the doer's own belief:

- A checker that shares the doer's blind spot is an **echo chamber**. It agrees for the same wrong
  reasons. It adds little independent information. "Verify" can collapse into "declare" — the system
  announces it is correct without establishing that it is.
- Stacking more such checkers does not help: correlated checks don't multiply into confidence. There is
  a **common-mode floor** of shared error that no amount of iteration crosses. Even a formal proof
  doesn't escape it — it only *relocates* the blind spot from the code into the spec.

This is why the current taxonomy keeps reflexivity separate from "we err" (stone #4).
Stone #4 is the *marginal* fact — each agent errs. Reflexivity is the *joint* fact — their errors are
correlated. You can grant that every agent is individually excellent and reflexivity still bites,
because it is a statement about the *relationship between* the checkers, not about any one of them. And
it is a fact about the *solver*, not about the problem — the **first seat** of the second-order tier.

### The second seat: incentive-divergence (stone #10) — the doer is not faithful

<sup>[↪ Why](#r-bedrock-04)</sup>

The incentive branch concerns a persistent party, such as a vendor, team, or contractor. Such a party
can pursue its own payoff even when it knows the intended result. Knowing the target does not make
the target the party's objective.

This is a **directed** pressure, which is what makes it easy to confuse with the adversary (stone #8) —
but the *direction* is different. An adversary aims at your **failure**: it wants an output outside the
allowed set. A misaligned agent aims at a **goal of its own**, and your loss is merely *collateral* — it
will let you succeed wherever that is cheap for it, and cut the corner only where your interest and its
payoff part ways. So it is irreducible three ways at once: not stone #1 (it *knows* your intent), not
stone #4 (a *choice*, not an accidental slip), and not stone #8 (*misaligned*, not *hostile*).

For persistent parties, alignment means outcome-linked incentives and accountability for consequences.
An independent checker alone cannot change a party's payoff. The incentive claim is conditional on
having a party with continuing interests to influence.

**Non-persistent inference requires a different response.** The model assumes no continuing payoff
that task-level rewards can shape for an inference call. Its output can still satisfy a proxy while
missing the intended result, without a claim that the call has its own utility or willful intent.
The response has three parts:

- **Capability containment.** Bound tool access, delegated permissions, and external effects to the
  authorized task. Approval and execution isolation are distinct controls; a workspace sandbox alone
  does not constrain effects through external tools or services.
- **Proxy-resistant evaluation.** Check outcomes against the intended result with checks that can
  expose shortcuts through the measured score. Passing one proxy is insufficient evidence of success.
- **Independent evidence.** Verify results using observations or checks outside the executor's own
  report. The accountable principal owns acceptance and the consequences of delegated actions.

These controls reduce risk; they do not establish perfect alignment or eliminate shared blind spots.
<sup>[↪ Why](#r-bedrock-06)</sup>

An agent turn may assemble context, call a model, dispatch tools, feed observations back, and stop when
the assistant returns a final response or reaches a limit. Those iterations can staff any beat of a
work unit. A final response closes the turn; acceptance still requires the work unit's target, a bounded
attempt, an outcome check with evidence suited to the risk, and `reflect`'s accept, re-target, or
escalate decision. Authorization gates a tool call; isolation constrains its execution where it
applies. Neither establishes that the result met the target. <sup>[↪ Why](#r-agentic-01)</sup>

### The consequence: two risks in a delegated loop

<sup>[↪ Why](#r-agentic-01)</sup>

Intent-faithful results need checks that can detect mistakes and safeguards suited to the delegate.
Persistent parties need suitable incentives; non-persistent inference needs containment, evaluation,
and independent evidence. Removing a human does not by itself remove either risk. A loop may report
success over a shared blind spot or a result that serves a payoff or proxy instead of the intended
outcome. **A loop cannot use its own unchecked report as ground truth.**

> ▸ **Chart — "The second-order tier — the delegated/autonomous regime"** <sup>[↪ Why](#r-agentic-01)</sup> · *L4 · the delegated/
> autonomous regime.* Shared blind spots and divergence from the intended result can produce false
> success reports. Independent evidence addresses shared error. Persistent parties need suitable
> incentives; non-persistent inference needs containment and proxy-resistant evaluation as well as
> independent evidence. Human review remains where accountability, value judgment, or
> exceptional authority requires it.

```pipeline-graph
{
  "title": "The second-order tier — the delegated/autonomous regime",
  "level": "L4 · the delegated/autonomous regime",
  "summary": "Delegation can produce shared checking errors or results that serve a payoff or proxy instead of the intended outcome. Persistent parties need incentives; non-persistent inference needs capability containment, proxy-resistant evaluation, and independent evidence. An accountable principal owns the result. Human judgment remains for accountability, values, and exceptional authority.",
  "zoomOut": "The complete circuit",
  "nodes": [
    {"id":"corr","label":"#9 · errors are CORRELATED","group":"stone","x":130,"y":0},
    {"id":"doer","label":"doer (agent)","group":"element","x":0,"y":90},
    {"id":"checker","label":"checker (agent, same kind)","group":"element","x":280,"y":90},
    {"id":"echo","label":"echo chamber — little independent information","group":"terminal","x":280,"y":185},
    {"id":"misalign","label":"#10 · payoff or proxy replaces intent","group":"stone","x":0,"y":185},
    {"id":"declare","label":"verify collapses into 'declare'","group":"terminal","x":280,"y":280},
    {"id":"evidence","label":"independent evidence or judge","group":"terminal","x":700,"y":0},
    {"id":"principal","label":"accountable principal","group":"terminal","x":1160,"y":0},
    {"id":"indep","label":"INDEPENDENCE (#9) — checker ⊥ doer","group":"property","x":700,"y":95},
    {"id":"align","label":"persistent parties: suitable incentives","group":"property","x":700,"y":175},
    {"id":"contain","label":"inference: containment · evaluation · evidence","group":"property","x":700,"y":265},
    {"id":"auto","label":"delegation can weaken safeguards","group":"stone","x":700,"y":355},
    {"id":"inject","label":"provide safeguards for each delegate","group":"repertoire","x":700,"y":445},
    {"id":"reliable","label":"reliable (at risk without safeguards)","group":"property","x":1250,"y":175}
  ],
  "edges": [
    {"source":"corr","target":"doer","member":true},
    {"source":"corr","target":"checker","member":true},
    {"source":"checker","target":"echo","dashed":true},
    {"source":"echo","target":"declare","dashed":true},
    {"source":"misalign","target":"declare","dashed":true,"label":"unchecked success report"},
    {"source":"evidence","target":"indep","label":"supplies"},
    {"source":"principal","target":"align","label":"supports"},
    {"source":"principal","target":"contain","label":"governs"},
    {"source":"evidence","target":"contain","label":"supplies"},
    {"source":"indep","target":"reliable","label":"supports"},
    {"source":"align","target":"reliable","label":"supports"},
    {"source":"contain","target":"reliable","label":"protects"},
    {"source":"auto","target":"indep","dashed":true,"label":"may erode"},
    {"source":"auto","target":"align","dashed":true,"label":"may erode"},
    {"source":"auto","target":"contain","dashed":true,"label":"may erode"},
    {"source":"inject","target":"indep","label":"can improve"},
    {"source":"inject","target":"align","label":"can improve"},
    {"source":"inject","target":"contain","label":"provides"},
    {"source":"declare","target":"reliable","dashed":true,"label":"erodes"}
  ]
}
```

### What the ideal autonomous SDLC must therefore add

<sup>[↪ Why](#r-agentic-01)</sup>

The second-order tier does not forbid autonomy. A delegated loop cannot assume its check is independent
or its doer is faithful, so it must provide evidence and governance for both conditions:

- **An independent check.** Keep evidence or a judge with different failure modes in the escalation
  path. That can be a human or a check whose errors are demonstrably less correlated with the doer's.
  Reserve a human decision for accountability, value judgment, or exceptional authority where the
  delegated system cannot make that decision.
- **Deliberate adversarial and diverse review.** `threat-model / red-team` (Chapter 8) can expose
  assumptions that the doer missed. A prompt to disagree does not establish independence; use a
  different method, evidence source, or reviewer with demonstrably different failure modes before
  claiming reduced doer-checker correlation. <sup>[↪ Why](#r-agentic-01)</sup>
- **Independence budgeting.** Treat independence as a resource to be spent where a wrong-but-confident
  convergence would be most costly — exactly the non-compensatory seams that earn hard gates
  (Chapter 11). Prioritize independent-enough evidence at the load-bearing checks, then state the
  correlation risk that remains.
- **Safeguards for the delegate (stone #10).** Persistent parties need outcome-linked incentives.
  Non-persistent inference needs capability containment, proxy-resistant evaluation, and independent
  evidence. An accountable principal owns acceptance and consequences in both cases.

### How this threads back through the document

<sup>[↪ Why](#r-agentic-01)</sup>

The autonomy callouts scattered through the earlier chapters are all facets of these two stones:

- **Chapter 2** — the second-order tier erodes **reliable** specifically, because reliability is the
  property that depends on convergence — and convergence assumes both independence and faithfulness.
- **Chapter 4** — escalation reaches an independent check or an accountable authority. A human remains
  the terminal for decisions that require human accountability, values, or exceptional authority.
- **Chapter 8** — the security repertoire's **red-team** move is also the independence-injection move
  (#9); its authn/authz and least-privilege moves *contain* a misaligned agent (#10) even though they do
  not, by themselves, align it.
- **Chapter 11** — required reflect evidence and an `observe` sensor matter under autonomy because
  an unchecked completion report cannot supply memory or sensing. The convergent law (§11.2) covers
  each required intended operand — decision rationale, telemetry, regression evidence, and plan
  baseline — at the accountable work unit. Named seam gates still apply where harm demands them.
  <sup>[↪ Why](#r-gate-04)</sup>

Delegation requires evidence that checks are independent enough for the risk and that the doer's
safeguards fit the delegate. Human authority remains available where the decision needs
human accountability or judgment.

---
