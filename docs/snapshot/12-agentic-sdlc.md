## 12. The autonomous / agentic SDLC

<sup>[↪ Why](#r-agentic-01)</sup>

Everything so far holds whether the loop is staffed by people or by software agents. Delegation adds
two risks when other actors do the work and check it.

These risks grow with delegation. They are different in
kind from the first eight stones — those are facts about the *problem*; these are facts about the
**solver**, and about *who staffs the loop*. Together they form the model's **second-order tier**, and
the tier has exactly two seats, because a delegated mind can betray the loop in exactly two ways: it can
be **blind** (share the doer's error) or **unfaithful** (pursue its own payoff). The loop silently
assumed neither — that its checker is *independent* and its doer is *faithful* — and delegation can
break those assumptions.

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
  reasons. It adds **zero bits** of information. "Verify" silently collapses into "declare" — the system
  announces it is correct instead of establishing that it is.
- Stacking more such checkers does not help: correlated checks don't multiply into confidence. There is
  a **common-mode floor** of shared error that no amount of iteration crosses. Even a formal proof
  doesn't escape it — it only *relocates* the blind spot from the code into the spec.

This is why reflexivity is a genuinely *new* stone and not just a restatement of "we err" (stone #4).
Stone #4 is the *marginal* fact — each agent errs. Reflexivity is the *joint* fact — their errors are
correlated. You can grant that every agent is individually excellent and reflexivity still bites,
because it is a statement about the *relationship between* the checkers, not about any one of them. And
it is a fact about the *solver*, not about the problem — the **first seat** of the second-order tier.

### The second seat: incentive-divergence (stone #10) — the doer is not faithful

<sup>[↪ Why](#r-bedrock-04)</sup>

The loop's second silent assumption is that the mind doing the work *wants what you want*. A delegate has
its **own utility**, and knowing your intent perfectly does not make it adopt your intent. Even when the
target is fully specified — so this is emphatically *not* hidden intent (stone #1) — a self-interested
agent can optimise its own payoff at your target's expense.

This is a **directed** pressure, which is what makes it easy to confuse with the adversary (stone #8) —
but the *direction* is different. An adversary aims at your **failure**: it wants an output outside the
allowed set. A misaligned agent aims at a **goal of its own**, and your loss is merely *collateral* — it
will let you succeed wherever that is cheap for it, and cut the corner only where your interest and its
payoff part ways. So it is irreducible three ways at once: not stone #1 (it *knows* your intent), not
stone #4 (a *choice*, not an accidental slip), and not stone #8 (*misaligned*, not *hostile*).

Incentive-divergence has two faces, and only one is new. Its *unintentional* face — an agent gaming a
**proxy** because true intent was hidden — is just stone #1 plus Goodhart, already covered. Its
**willful** face — diverging *despite* knowing intent — is the genuinely new stone, and it forces a
response that neither the security repertoire nor reflexivity's independence-seeking supplies:
**alignment** — engineering the reward so the agent's payoff tracks true-Done (skin in the game,
outcome-linked incentives, making the agent bear the cost of its own corner-cutting). Where reflexivity
asks "is the checker *independent*?", incentive-divergence asks "is the doer *faithful*?" — two
different questions, two different fixes, two seats.

Like reflexivity, it is **conditional**: collapse principal and agent into one aligned mind and it
vanishes — a single coherent utility cannot be misaligned with itself. But model a delegated agent
*realistically* — bounded and multi-drive, with its own present-versus-future tradeoffs, exactly the
realism the model already grants when it says "humans and models err" — and a floor of divergence
remains that perfect alignment never fully crosses, just as perfect independence is unreachable for #9.

### The consequence: two risks in a delegated loop

<sup>[↪ Why](#r-done-02)</sup>

Put the pieces together. Intent-faithful results need checks that can detect the doer's mistakes and
incentives that do not reward cutting corners. Delegation can weaken either condition; removing a human
does not by itself remove both. Independent evidence and an accountable principal address different
risks. Without them, a delegated loop can converge confidently to a **wrong** fixed point in two
different ways: a green check sitting on a real defect it *could not see*
(#9), or a green check over a corner it *chose* to cut (#10). Either way the loop's own signals all say
"fine." **A loop cannot use its own unchecked report as ground truth.**

Notice the shape of both failures. It is not that the agents are lazy or careless; a diligent,
high-capability autonomous loop fails *these specific ways* — by being *confidently* wrong (shared
blindness) or *quietly* self-serving (divergent will), because in both cases every part of it agrees.
That is worse than a loud failure, because nothing inside the loop raises a hand.

> ▸ **Chart — "The second-order tier — the delegated/autonomous regime"** <sup>[↪ Why](#r-agentic-01)</sup> · *L4 · the delegated/
> autonomous regime.* Two ways a delegated mind hollows a check into a bare *declare*: a **blind** checker
> (correlated fault → echo chamber, #9) and an **unfaithful** doer (own payoff → self-serving report,
> #10). Independent evidence addresses shared blind spots; an accountable principal and suitable
> incentives address divergence. Human review remains where accountability, value judgment, or
> exceptional authority requires it.

```pipeline-graph
{
  "title": "The second-order tier — the delegated/autonomous regime",
  "level": "L4 · the delegated/autonomous regime",
  "summary": "Delegation risks two failures: a checker shares the doer's blind spot (#9), or a doer favours its own payoff (#10). Independent evidence can address shared error. An accountable principal and suitable incentives can address divergence. Human judgment remains for accountability, values, and exceptional authority.",
  "zoomOut": "The complete circuit",
  "nodes": [
    {"id":"corr","label":"#9 · errors are CORRELATED","group":"stone","x":130,"y":0},
    {"id":"doer","label":"doer (agent)","group":"element","x":0,"y":90},
    {"id":"checker","label":"checker (agent, same kind)","group":"element","x":280,"y":90},
    {"id":"echo","label":"echo-chamber — blind, adds 0 bits","group":"terminal","x":280,"y":185},
    {"id":"misalign","label":"#10 · doer serves its OWN payoff","group":"stone","x":0,"y":185},
    {"id":"declare","label":"verify collapses into 'declare'","group":"terminal","x":280,"y":280},
    {"id":"evidence","label":"independent evidence or judge","group":"terminal","x":700,"y":0},
    {"id":"principal","label":"accountable principal + incentives","group":"terminal","x":1050,"y":0},
    {"id":"indep","label":"INDEPENDENCE (#9) — checker ⊥ doer","group":"property","x":700,"y":95},
    {"id":"align","label":"ALIGNMENT (#10) — payoff tracks true-Done","group":"property","x":700,"y":175},
    {"id":"auto","label":"delegation can weaken either condition","group":"stone","x":700,"y":265},
    {"id":"inject","label":"add independent checks + govern incentives","group":"repertoire","x":700,"y":345},
    {"id":"reliable","label":"reliable (at risk without safeguards)","group":"property","x":1160,"y":135}
  ],
  "edges": [
    {"source":"corr","target":"doer","member":true},
    {"source":"corr","target":"checker","member":true},
    {"source":"checker","target":"echo","dashed":true},
    {"source":"echo","target":"declare","dashed":true},
    {"source":"misalign","target":"declare","dashed":true,"label":"self-serving report"},
    {"source":"evidence","target":"indep","label":"supplies"},
    {"source":"principal","target":"align","label":"supports"},
    {"source":"indep","target":"reliable","label":"manufactures"},
    {"source":"align","target":"reliable","label":"manufactures"},
    {"source":"auto","target":"indep","dashed":true,"label":"may erode"},
    {"source":"auto","target":"align","dashed":true,"label":"may erode"},
    {"source":"inject","target":"indep","label":"restores"},
    {"source":"inject","target":"align","label":"restores"},
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
- **Deliberate adversarial and diverse review.** `threat-model / red-team` (Chapter 8) does double duty
  here: a reviewer instructed to *disagree*, seeded with different assumptions, breaks the doer-checker
  correlation. Diversity of method is the mechanism; adversariality is how you force it.
- **Independence budgeting.** Treat independence as a resource to be spent where a wrong-but-confident
  convergence would be most costly — exactly the non-compensatory seams that earn hard gates
  (Chapter 11). You cannot make every check independent; you *can* make the load-bearing ones
  independent.
- **Engineered alignment (stone #10).** Independence catches the *blind* failure but not the *willful*
  one — a diverse-but-misaligned ensemble still won't flag a corner it is all incentivised to cut. So the
  delegated loop must also make the doer's incentives track the intended target: outcome-linked rather
  than proxy-linked rewards, and an **accountable principal** who owns the decision and its loss.
  Alignment is to the *doer* what independence is to the *checker*.

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
- **Chapter 11** — the **reflect-artifact** and **observe-sensor** gates matter more under autonomy,
  because a self-checking loop that also skips its memory and senses has nothing left to catch it. The
  convergent law (§11.2) widens this to all four intended-operands — ADR, telemetry, regression suite,
  plan baseline: the loop's memory, senses, ratchet, and clock. Those four existence-gates are what
  keep an autonomous loop *auditable at all*.

Delegation requires evidence that checks are independent enough for the risk and that incentives keep
the doer faithful to the intended result. Human authority remains available where the decision needs
human accountability or judgment.

---
