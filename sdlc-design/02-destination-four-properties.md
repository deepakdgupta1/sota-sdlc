## 2. The destination: four properties

Before building anything, name what "good" means — because you cannot check work against nothing.
A good SDLC produces **four distinct properties**, in **two families**. They are distinct because
each guards against a *different* way the work can fail, and you can have any one without the others.

### The two families

**Point-properties** are measured at a *single* point — one task, in one context.

- **Reliable** — *faithful to intent.* The output is correct: nothing missing, nothing invented. It
  guards against "it gave me the wrong thing." Produced by a loop that **converges** — iterates until
  the result actually matches the need.
- **Predictable** — *foreseeable.* Low variance; you can call the output and the timing in advance
  and plan around them. It guards against "I couldn't foresee it / couldn't plan around it." Produced
  by a loop that is **bounded** — it takes a knowable number of tries and then stops.

> **"Predictable" has three faces, bought by three different mechanisms.** Boundedness buys only the
> **cost** face — this piece of work stops within a known number of tries. The **outcome** face — you
> can call *what* comes out of a seam — is bought by tight interface contracts (§9.2). And the
> **schedule** face — you can call *when* the whole thing ships — is not a point-property at all but
> an aggregate over the time axis, bought by its own mechanism: the **schedule bet** (§7.1).

**Envelope-properties** are measured along a third axis — **how hard the context is × time.** They
are the envelope that keeps the point-properties alive across the *whole range* of contexts, not just
the easy one. The range has two very different sources of hardness, and each forces its own envelope:

- **Resilient** — *withstands and recovers from **random** hardship.* Reality changes and reality is
  uncertain; together they *sample* the space of contexts blindly and will eventually hand you a hard
  one. Resilience is the envelope against that blind sampler. It guards against "it collapsed on a
  hard context and couldn't recover." Produced by a loop that **nests and escalates** — smaller loops
  hand up to larger ones, and a repertoire of responses (retry, fail over, degrade, roll back) keeps
  the function alive.
- **Secure** — *withstands a **directed** adversary hunting the worst case.* An attacker is not blind
  variance; it is a *directed optimiser* that deliberately searches for the one input that breaks you.
  Security is the envelope against that searcher. It guards against "an attacker drove it to do
  something outside its allowed set" — leak a secret, cause downtime, forge or intercept a message.
  Produced by a loop that **preempts** — it red-teams its *own* inputs for forbidden outputs and
  forecloses them before the adversary arrives.

### Why security is a fourth seat, not a corner of resilience

It is tempting to file security under "resilience on the hardest context." That is wrong, and the
distinction is load-bearing. The machinery that manufactures resilience — redundancy, retries,
graceful degradation — is *statistical*: it assumes hardship arrives at random and rare events are
rare. Against a directed opponent that machinery can *backfire*: a retry loop is a gift to a
denial-of-service attack, because the attacker aims straight at the expensive path. Resilience
answers a blind sampler; security answers a hunter. Same *shape* (an envelope over context-hardness),
different *opponent* — so security takes a fourth seat beside resilience, with its own repertoire
(Chapter 8).

### They are genuinely independent

Each property is independent of its family sibling — you can hold one and fail the other:

- **Reliable ⟂ Predictable.** *Correct-but-unforeseeable*: a system that always eventually returns
  the right answer but at wildly varying, un-callable times (reliable, not predictable).
  *Foreseeable-but-wrong*: a system that returns a confidently wrong answer at a perfectly
  predictable moment (predictable, not reliable).
- **Secure ⟂ Resilient.** *Resilient-but-insecure*: auto-failover and self-healing under random load,
  sitting behind an open authentication bypass. *Secure-but-fragile*: hardened and authorised on every
  request, but with no redundancy, so a single random outage kills it.

Because each combination exists, none of the four reduces to another. All four must be produced on
purpose.

> ▸ **Chart — "The four properties"** · *L1 · the destination.* A zoom into the top band of the
> complete circuit: the two families, the behaviour that produces each property, and the two
> independence relations (⟂).

```pipeline-graph
{
  "title": "The four properties",
  "level": "L1 · the destination",
  "summary": "Two point-properties (measured at one task) and two envelope-properties (measured across contexts × time); each is produced by a distinct loop behaviour and is independent of its sibling.",
  "zoomOut": "The complete circuit",
  "zoomIn": ["The unit loop, fully staffed"],
  "nodes": [
    {"id":"point","label":"POINT — one task, one context","group":"terminal","x":120,"y":0},
    {"id":"envelope","label":"ENVELOPE — across contexts × time","group":"terminal","x":700,"y":0},
    {"id":"reliable","label":"reliable — faithful to intent","group":"property","x":0,"y":110},
    {"id":"predictable","label":"predictable — foreseeable, low variance","group":"property","x":300,"y":110},
    {"id":"resilient","label":"resilient — survives RANDOM hardness","group":"property","x":600,"y":110},
    {"id":"secure","label":"secure — survives a DIRECTED adversary","group":"property","x":920,"y":110},
    {"id":"converges","label":"loop converges","group":"beat","x":0,"y":235},
    {"id":"bounded","label":"loop is bounded","group":"beat","x":300,"y":235},
    {"id":"nests","label":"loop nests & escalates","group":"beat","x":600,"y":235},
    {"id":"preempts","label":"loop preempts (self red-teams)","group":"beat","x":920,"y":235}
  ],
  "edges": [
    {"source":"point","target":"reliable","member":true},
    {"source":"point","target":"predictable","member":true},
    {"source":"envelope","target":"resilient","member":true},
    {"source":"envelope","target":"secure","member":true},
    {"source":"converges","target":"reliable","label":"produces"},
    {"source":"bounded","target":"predictable","label":"produces"},
    {"source":"nests","target":"resilient","label":"produces"},
    {"source":"preempts","target":"secure","label":"produces"},
    {"source":"reliable","target":"predictable","dashed":true,"label":"⟂ independent"},
    {"source":"resilient","target":"secure","dashed":true,"label":"⟂ independent"}
  ]
}
```

> **⟐ Under autonomy.** Of the four, **reliable** is the one autonomy most directly threatens.
> Reliability is manufactured by a loop that *converges* — but convergence quietly assumes two things about
> who staffs it: that the checker is **independent** of the doer, and that the doer is **faithful** to the
> target. Delegation can break either — a checker that shares the doer's blind spot (stone #9), or an
> executor that serves its own payoff (stone #10) — and both let the loop *declare* success instead of
> establishing it: a green check over a real defect. These are the two **second-order** stones; see
> Chapter 12.

---

