## 7. The lifecycle: the process flow

**What it is.** The familiar left-to-right lifecycle — discover, define, design, plan, build, verify,
release, operate — is not a separate model. It is the **projection** of the loop onto the timeline of a
single release: the beats laid out in order, with the feedback edges drawn back in.

**Why it looks like a pipeline but behaves like a loop.** The solid arrows are the *forward flow* — the
lifecycle as usually drawn. The dashed arrows are the *loops and feedback*, present at every scale:

- The **build** step is itself a loop: `do ⇄ check against a graded 'done' → reflect → re-target`.
- **verify** feeds back to **design** — the *shift-left* edge: catching a defect late is exponentially
  more expensive than catching it early, so verification is a cross-cutting layer, not a step bolted on
  after build.
- **operate** is a run-time loop: `observe ⇄ recover / degrade / roll back / escalate`.
- The whole thing closes: **operate → learn → evolve the target → back to discover.** This is the
  **Ouroboros** — the product loop that turns a one-shot lifecycle into a spiral that improves its own
  target over time.

**How to read it.** The lifecycle is the most *concrete* and recognisable view, which is why it comes
after the abstract ones: by now you can see that each box is a beat, each dashed line is the loop
reasserting itself, and the Ouroboros is the evolve edge from Chapter 1.

**Not every box is the same kind of thing.** Reading nine stages as nine primitives double-counts.
The projection is made of **four node-kinds**, and only the first is a stone-defended primitive:

- **Control-elements** — discover/define, design, verify, and OPERATE's `observe`: the Chapter 5
  roster, laid on the clock.
- **The base act** — BUILD (`implement`). It defends no stone because it *is* the thing the stones
  make hard: the **operand the loop controls** — the plant, not the controller. This is the one
  *licensed exception* to Chapter 3's self-test, and naming the licence is what keeps that test sound
  instead of flagging a false positive.
- **A seam** — `release`, the hand-off from build-time to run-time. Not a new element: it is the
  *transition* that the change-axis machinery governs (§10.1). **Regression** fires just before it
  (at the verify/integrate gate); **rollback** stands just after it (the operate-side net). "Release
  governance" is that pair, not a fresh primitive.
- **A phase-loop and the Ouroboros** — OPERATE (observe plus the two repertoires, including
  `roll back`) and evolve (`reflect` at product scale).

One box is still unaccounted for by that list — **plan** — and it earns its seat a different way.

> ▸ **Chart — "The lifecycle (process flow)"** · *L2 · lifecycle.* The forward flow in solid arrows;
> the build loop, the operate loop, the shift-left edge, and the Ouroboros in dashed arrows.

```pipeline-graph
{
  "title": "The lifecycle (process flow)",
  "level": "L2 · lifecycle",
  "summary": "The everyday lifecycle as a projection of the loop: forward flow in solid arrows, the build loop / operate loop (incl. roll back) / shift-left / Ouroboros in dashed feedback edges. Four node-kinds: control-elements, the base act (BUILD), the release seam, phase-loops.",
  "zoomOut": "The fractal — one shape, every scale",
  "zoomIn": ["The schedule bet", "The change axis — regression & rollback"],
  "nodes": [
    {"id":"discover","label":"discover","group":"element","x":0,"y":0},
    {"id":"define","label":"define","group":"element","x":140,"y":0},
    {"id":"design","label":"design","group":"element","x":280,"y":0},
    {"id":"plan","label":"plan","group":"element","x":420,"y":0},
    {"id":"build","label":"BUILD","group":"beat","x":560,"y":0},
    {"id":"verify","label":"verify","group":"element","x":700,"y":0},
    {"id":"release","label":"release","group":"element","x":840,"y":0},
    {"id":"operate","label":"OPERATE","group":"beat","x":980,"y":0},
    {"id":"rollback","label":"roll back","group":"repertoire","x":700,"y":135},
    {"id":"recover","label":"recover","group":"repertoire","x":840,"y":135},
    {"id":"degrade","label":"degrade","group":"repertoire","x":980,"y":135},
    {"id":"escalate","label":"escalate","group":"repertoire","x":1120,"y":135},
    {"id":"evolve","label":"evolve (Ouroboros)","group":"terminal","x":460,"y":165}
  ],
  "edges": [
    {"source":"discover","target":"define"},
    {"source":"define","target":"design"},
    {"source":"design","target":"plan"},
    {"source":"plan","target":"build"},
    {"source":"build","target":"verify"},
    {"source":"verify","target":"release"},
    {"source":"release","target":"operate"},
    {"source":"verify","target":"design","dashed":true,"label":"shift-left ↺"},
    {"source":"operate","target":"rollback","dashed":true},
    {"source":"operate","target":"recover","dashed":true},
    {"source":"operate","target":"degrade","dashed":true},
    {"source":"operate","target":"escalate","dashed":true},
    {"source":"operate","target":"evolve","dashed":true,"label":"learn"},
    {"source":"evolve","target":"discover","dashed":true,"label":"evolve target ↺"}
  ]
}
```

### 7.1 A plan is a schedule bet

The lifecycle chart has one box with no Chapter 5 element behind it: **plan**. It is not a missing
element and not a new stone — it is `scope` + `specify` **projected onto the time axis**, exactly as
the lifecycle itself is the elements projected onto wall-clock. And once you see that, the whole of
Chapter 9's machinery re-runs on the calendar.

Chapter 2 noted that "predictable" has three faces, and that boundedness and tight contracts buy only
two of them. The third — *call when it ships* — is an **aggregate over the time axis**: no single
loop's boundedness adds up to a delivery date by itself. The mechanism that buys it has the same shape
as design's bet (§9.1), on a new axis. `plan` decomposes the deliverable *over time* — time-boxed
tasks, milestone contracts — and asserts:

> **(task₁ lands in slot t₁ ∧ … ∧ taskₙ lands in slot tₙ) ⟹ ship S by date D**

— the same `(∧Lᵢ) ⟹ P` conjecture, cast on the calendar. Two identities fall out immediately:

- **An estimate is the stub of a task** — the shape and duration kept, the work deleted.
- **Critical-path / capacity feasibility is stub-composition on the time axis** — an a-priori,
  one-sided check. It can prove a schedule *infeasible* (fails cheap → re-plan) or internally
  consistent; it can never confirm delivery.

The two suspended premises follow the same routes as design's: **Premise A** — *each estimate is
real* — is discharged per-task at completion (verify-like, stone #4); **Premise B** — *the schedule
holds across the whole space of futures* — leaves a residue only run-time velocity/slip tracking can
catch (observe-like, stones #5/#6). A falsified schedule routes to **re-plan**, exactly as a falsified
composition routes back to `design`.

**Which half of the plan is gated.** The split anticipates the convergent law (§11.2):

- The **written baseline's existence is a hard gate.** If "on time" was never recorded, a slip is
  *undetectable* — the loop's own schedule-check is blind, which is the machinery-degrading amplifier
  (Chapter 11), the same argument that gates the ADR.
- The **dates themselves are a graded forecast.** Hard-gating a forecast invites Goodhart: scope and
  quality get quietly cut to "hit the date." Content stays negotiable; existence does not.

**Plan is to predictable what the ADR is to reliable** — the intended-operand the loop must write down
so its own later comparison has something to compare against.

> ▸ **Chart — "The schedule bet"** · *L3 · inside plan.* `plan` states the bet (task stubs +
> the conjecture); a critical-path stub-composition fails cheap (→ re-plan) or survives, suspending
> Premise A (per-task, verify-like) and Premise B (whole-future, observe-like). The baseline's
> existence is gated; the dates stay a graded forecast.

```pipeline-graph
{
  "title": "The schedule bet",
  "level": "L3 · inside plan",
  "summary": "plan = scope+specify projected onto the time axis: estimates are task stubs, critical-path feasibility is stub-composition on time, and the bet factors into Premise A (per-task) and Premise B (whole-future). Baseline existence is a hard gate; the dates are a graded forecast.",
  "zoomOut": "The lifecycle (process flow)",
  "zoomIn": ["The convergent law"],
  "nodes": [
    {"id":"plan","label":"plan · scope+specify on the time axis","group":"element","x":0,"y":120},
    {"id":"tasks","label":"time-boxed tasks · estimate = the stub of a task","group":"property","x":310,"y":30},
    {"id":"hyp","label":"bet: (∧ taskᵢ in slot tᵢ) ⟹ ship by D","group":"beat","x":310,"y":200},
    {"id":"cpath","label":"critical-path check = stub-composition on time","group":"element","x":660,"y":120},
    {"id":"replan","label":"infeasible → re-plan","group":"terminal","x":660,"y":280},
    {"id":"premA","label":"Premise A · each estimate real → checked per task (verify-like)","group":"beat","x":1020,"y":50},
    {"id":"premB","label":"Premise B · holds across futures → velocity/slip at OPERATE (observe-like)","group":"beat","x":1020,"y":200},
    {"id":"baseline","label":"written baseline · existence = HARD GATE","group":"property","x":310,"y":330},
    {"id":"dates","label":"the dates · a graded, Goodhartable forecast","group":"stone","x":660,"y":400}
  ],
  "edges": [
    {"source":"plan","target":"tasks","member":true},
    {"source":"plan","target":"hyp","member":true},
    {"source":"hyp","target":"cpath","label":"stub it"},
    {"source":"cpath","target":"replan","dashed":true,"label":"fails cheap ↺"},
    {"source":"replan","target":"plan","dashed":true,"label":"re-plan"},
    {"source":"cpath","target":"premA","dashed":true,"label":"suspends"},
    {"source":"cpath","target":"premB","dashed":true,"label":"suspends"},
    {"source":"plan","target":"baseline","member":true,"label":"its #7 artifact"},
    {"source":"baseline","target":"dates","member":true,"label":"content"}
  ]
}
```

---

