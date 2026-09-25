## 1. The system at a glance

<sup>[↪ Why](#r-apex-01)</sup>

**What it is.** The current reference model, compressed into one causal chain. Read it bottom-to-top:

> **admitted pressures** &nbsp;→&nbsp; **a control loop** &nbsp;→&nbsp; **four loop behaviours**
> &nbsp;→&nbsp; **four emergent properties** &nbsp;→&nbsp; **an evolve feedback that re-aims the whole thing.**

**Why it exists.** The model treats **reliable, predictable, resilient, and secure** as outcomes of
feedback, not features a team can install separately. The loop sets a target, compares results with
evidence, responds to failure, and carries learning forward. Its controls answer the current hazard
taxonomy and the work unit's acceptance needs. Another admitted pressure could change the model's
shape. <sup>[↪ Why](#r-bedrock-01)</sup>

**How it works.** The chain has four links, each detailed in a later chapter:

1. **The bedrock** (Chapter 3) — eight pressures in the problem and two conditional pressures in
   the solver that make software work hard:
   intent is hidden, resources are finite, systems exceed one mind, we make mistakes, reality
   changes, reality is uncertain, knowledge is scattered and perishable, adversaries hunt weakness,
   and the two second-order stones — reflexivity (#9, where a checker shares the doer's blind spot) and
   incentive-divergence (#10, where a persistent party pursues its own payoff; non-persistent inference
   instead requires containment and evaluation). <sup>[↪ Why](#r-bedrock-01)</sup>
2. **The loop** (Chapter 4) — this model uses a recurring atom: `define → do → check → reflect`,
   repeated within the work unit's bounds until accepted or escalated. <sup>[↪ Why](#r-loop-01)</sup>
3. **The behaviours** (Chapter 2) — the way the loop runs produces four behaviours: it **converges**,
   it stays **bounded**, it **nests and escalates**, and it **preempts** (searches its own inputs for
   trouble before trouble finds them). Bounded attempts and a budget constrain cost; outcome and
   schedule need additional mechanisms (Chapter 2). <sup>[↪ Why](#r-apex-04)</sup>
4. **The properties** (Chapter 2) — those four behaviours *are* what we experience as reliable,
   predictable, resilient, and secure. A final **evolve** edge feeds what we learn back into the
   target, turning the loop into a spiral — the "Ouroboros." <sup>[↪ Why](#r-loop-01)</sup>

> ▸ **Chart — "The complete circuit"** <sup>[↪ Why](#r-apex-01)</sup> · *L0 · the current model.* The
> chart summarizes its pressures, loop, behaviors, and properties. Later charts zoom into these parts.

```pipeline-graph
{
  "title": "The complete circuit",
  "level": "L0 · the whole system",
  "summary": "The current model in one frame: admitted pressures motivate a feedback loop whose behaviors support four top-level properties and an evolve edge.",
  "zoomIn": ["The four properties", "The bedrock — ten forces", "The unit loop, fully staffed"],
  "nodes": [
    {"id":"evolve","label":"evolve (Ouroboros)","group":"terminal","x":360,"y":0},
    {"id":"reliable","label":"reliable","group":"property","x":100,"y":100},
    {"id":"predictable","label":"predictable","group":"property","x":360,"y":100},
    {"id":"resilient","label":"resilient","group":"property","x":620,"y":100},
    {"id":"secure","label":"secure","group":"property","x":880,"y":100},
    {"id":"converges","label":"converges","group":"beat","x":100,"y":215},
    {"id":"bounded","label":"bounded","group":"beat","x":360,"y":215},
    {"id":"nests","label":"nests & escalate","group":"beat","x":620,"y":215},
    {"id":"preempts","label":"preempts","group":"beat","x":880,"y":215},
    {"id":"loop","label":"the loop (define → do → check → reflect ↺)","group":"beat","x":360,"y":320},
    {"id":"intent","label":"intent hidden","group":"stone","x":-40,"y":440},
    {"id":"finite","label":"finite","group":"stone","x":120,"y":440},
    {"id":"complex","label":"complex","group":"stone","x":270,"y":440},
    {"id":"err","label":"we err","group":"stone","x":420,"y":440},
    {"id":"change","label":"change","group":"stone","x":560,"y":440},
    {"id":"uncertain","label":"uncertain","group":"stone","x":710,"y":440},
    {"id":"distributed","label":"distributed & perishable","group":"stone","x":880,"y":440},
    {"id":"adversarial","label":"adversarial actors","group":"stone","x":1060,"y":440},
    {"id":"reflexivity","label":"reflexivity (#9 · delegated only)","group":"stone","x":-200,"y":40},
    {"id":"incentives","label":"incentive-divergence (#10 · delegated only)","group":"stone","x":-200,"y":560}
  ],
  "edges": [
    {"source":"intent","target":"loop","member":true},
    {"source":"finite","target":"loop","member":true},
    {"source":"complex","target":"loop","member":true},
    {"source":"err","target":"loop","member":true},
    {"source":"change","target":"loop","member":true},
    {"source":"uncertain","target":"loop","member":true},
    {"source":"distributed","target":"loop","member":true},
    {"source":"adversarial","target":"loop","member":true},
    {"source":"loop","target":"converges"},
    {"source":"loop","target":"bounded"},
    {"source":"loop","target":"nests"},
    {"source":"loop","target":"preempts"},
    {"source":"converges","target":"reliable"},
    {"source":"bounded","target":"predictable","label":"cost face"},
    {"source":"nests","target":"resilient"},
    {"source":"preempts","target":"secure"},
    {"source":"reliable","target":"evolve"},
    {"source":"predictable","target":"evolve"},
    {"source":"resilient","target":"evolve"},
    {"source":"secure","target":"evolve"},
    {"source":"evolve","target":"loop","dashed":true,"label":"re-target"},
    {"source":"reflexivity","target":"reliable","dashed":true,"label":"may erode if delegated (#9)"},
    {"source":"incentives","target":"reliable","dashed":true,"label":"may erode if delegated (#10)"}
  ]
}
```

> **⟐ Under autonomy.** Notice the two coral nodes on the left — *reflexivity* (#9) and
> *incentive-divergence* (#10), the **second-order tier** — each with a dashed edge reaching up to
> **reliable**. Delegation can correlate checks and produce results that miss intent. Persistent parties
> need suitable incentives; non-persistent inference needs containment, proxy-resistant evaluation,
> and independent evidence. An accountable principal owns the result. Chapter 12
> explains both edges. <sup>[↪ Why](#r-agentic-01)</sup>

---
