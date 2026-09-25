## 4. The atom: the unit control loop

<sup>[↪ Why](#r-loop-01)</sup>

**What it is.** Everything in the SDLC reduces to a single feedback loop, repeated:

> **`set a target → do the work → check the result → reflect → (re-aim and repeat)`**

**Why it exists.** It is the minimal machine that answers the stones together. Because intent is
hidden and we err (stones #1, #4), you cannot get it right in one shot — you need a *check* and a way
to *try again*. Because resources are finite (stone #2), you cannot try forever — the loop must be
*bounded*. Because reality changes and is uncertain (stones #5, #6), the loop must keep running after
you ship. The loop is not one choice among many; it is what these facts jointly force.

**How it works — the four beats.**

- **Define (set the target).** State what "done" means for this piece of work. This is not a yes/no
  flag — it is a **threshold on a quality range** (see Chapter 9). Defining is itself composite: `scope`
  sets the boundary (how much / which items), and `specify` sets correctness (what's right), across the
  whole set of realities the work must serve.
- **Do (build).** Execute — produce the artifact the target described. This beat is pure construction;
  all the judgement lives in the beats around it. <sup>[↪ Why](#r-loop-05)</sup>
- **Check (measure).** Compare the result against the target. `check` is **graded, not binary**: it
  measures *how well* on a quality range — using a real metric where one exists, or a **proxy** (a
  stand-in measurement, like test coverage for "well-tested") where the true quality can't be measured
  directly — and asks whether the measurement clears the threshold. It happens at **build time**
  (`verify`) and at **run time** (`observe`), and those two are not interchangeable (Chapter 5).
  <sup>[↪ Why](#r-loop-03)</sup>
- **Reflect (close the loop).** The thinking beat. It **analyzes** — frames the problem ("the loop
  can't converge") and root-causes it — and then **decides** among three exits:
  - **accept** the gap as a known issue (stop here — the bounded, predictable exit);
  - **re-target** — redefine the target and iterate (the converging, reliable exit);
  - **escalate** — hand the problem up when bounded tries are exhausted (the nesting, resilient exit).

**Two properties of the loop that carry a lot of weight:**

- **Non-convergence is information, not just failure.** If honest tries keep missing, suspect the
  *target* (the spec), not only the build. A loop that won't converge is often pointing at a wrong
  definition of done — so `reflect` escalates *up*, toward re-defining, rather than grinding *down* on
  the build. <sup>[↪ Why](#r-loop-02)</sup>
- **The loop is bounded, which constrains cost.** A cap on attempts and a budget keep this work unit's
  expenditure finite. `decide`'s *accept* exit is one way to stop; an exhausted budget can instead
  escalate. Output contracts and an aggregate schedule bet address outcome and delivery timing
  separately. <sup>[↪ Why](#r-apex-04)</sup>

**The escape hatch.** Escalation moves to an independent judge or an accountable authority outside the
current loop. A human takes the decision when it requires human accountability, value judgment, or
exceptional authority. Under delegation, an independent check can also come from evidence or a method
whose errors differ from the doer's (Chapter 12).
<sup>[↪ Why](#r-agentic-01)</sup>

> ▸ **Chart — "The unit loop, fully staffed"** <sup>[↪ Why](#r-loop-01)</sup> <sup>[↪ Why](#r-element-01)</sup> <sup>[↪ Why](#r-repertoire-01)</sup> · *L2 · the atom.* The four beats across the top; the
> elements that staff each beat below them; the cross-cutting repertoire along the bottom; the dashed
> `re-target` edge closing the loop. Chapter 5 walks the elements one by one.

```pipeline-graph
{
  "title": "The unit loop, fully staffed",
  "level": "L2 · the atom",
  "summary": "One feedback loop — define, do, check, reflect — with the elements that staff each beat, the three exits of decide, and the cross-cutting repertoire.",
  "zoomOut": "The complete circuit",
  "zoomIn": ["The fractal — one shape, every scale", "Done propagation", "The two repertoires", "The artifacts"],
  "nodes": [
    {"id":"define","label":"define","group":"beat","x":0,"y":0},
    {"id":"do","label":"do","group":"beat","x":210,"y":0},
    {"id":"check","label":"check","group":"beat","x":420,"y":0},
    {"id":"reflect","label":"reflect","group":"beat","x":630,"y":0},
    {"id":"specify","label":"specify","group":"element","x":0,"y":95},
    {"id":"scope","label":"scope","group":"element","x":0,"y":165},
    {"id":"design","label":"design","group":"element","x":0,"y":235},
    {"id":"implement","label":"implement","group":"element","x":210,"y":95},
    {"id":"verify","label":"verify (build)","group":"element","x":420,"y":95},
    {"id":"observe","label":"observe (run)","group":"element","x":420,"y":165},
    {"id":"analyze","label":"analyze","group":"element","x":630,"y":95},
    {"id":"decide","label":"decide","group":"element","x":630,"y":165},
    {"id":"accept","label":"accept · known issue","group":"terminal","x":630,"y":240},
    {"id":"escalate","label":"escalate","group":"repertoire","x":0,"y":350},
    {"id":"degrade","label":"degrade","group":"repertoire","x":210,"y":350},
    {"id":"recover","label":"recover","group":"repertoire","x":420,"y":350},
    {"id":"rollback","label":"roll back","group":"repertoire","x":630,"y":350}
  ],
  "edges": [
    {"source":"define","target":"do"},
    {"source":"do","target":"check"},
    {"source":"check","target":"reflect"},
    {"source":"reflect","target":"define","dashed":true,"label":"re-target ↺"},
    {"source":"decide","target":"accept","label":"accept"},
    {"source":"define","target":"specify","member":true},
    {"source":"define","target":"scope","member":true},
    {"source":"define","target":"design","member":true},
    {"source":"do","target":"implement","member":true},
    {"source":"check","target":"verify","member":true},
    {"source":"check","target":"observe","member":true},
    {"source":"reflect","target":"analyze","member":true},
    {"source":"reflect","target":"decide","member":true}
  ]
}
```

> **⟐ Under autonomy.** The dashed `reflect` escalation in the fractal chart must lead beyond the
> executor's own judgment. It may reach an independent check or accountable authority. A human remains
> responsible where the decision needs human accountability, values, or exceptional authority.
> <sup>[↪ Why](#r-agentic-01)</sup>

---
