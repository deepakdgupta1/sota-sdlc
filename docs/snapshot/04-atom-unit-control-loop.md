## 4. The atom: the unit control loop

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
  all the judgement lives in the beats around it.
- **Check (measure).** Compare the result against the target. `check` is **graded, not binary**: it
  measures *how well* on a quality range — using a real metric where one exists, or a **proxy** (a
  stand-in measurement, like test coverage for "well-tested") where the true quality can't be measured
  directly — and asks whether the measurement clears the threshold. It happens at **build time**
  (`verify`) and at **run time** (`observe`), and those two are not interchangeable (Chapter 5).
- **Reflect (close the loop).** The thinking beat. It **analyzes** — frames the problem ("the loop
  can't converge") and root-causes it — and then **decides** among three exits:
  - **accept** the gap as a known issue (stop here — the bounded, predictable exit);
  - **re-target** — redefine the target and iterate (the converging, reliable exit);
  - **escalate** — hand the problem up when bounded tries are exhausted (the nesting, resilient exit).

**Two properties of the loop that carry a lot of weight:**

- **Non-convergence is information, not just failure.** If honest tries keep missing, suspect the
  *target* (the spec), not only the build. A loop that won't converge is often pointing at a wrong
  definition of done — so `reflect` escalates *up*, toward re-defining, rather than grinding *down* on
  the build.
- **The loop is bounded, and boundedness is where predictability comes from.** "A few tries, then
  stop" is what makes cost and timing foreseeable. `decide`'s *accept* exit is the stop.

**The escape hatch.** Escalation ultimately ends at a **human** — the loop's one *independent*
terminal, the place where a genuinely outside judgement can enter. This is normally a convenience. It
becomes structurally load-bearing under autonomy (Chapter 12): remove the human and the loop loses its
only independent ground.

> ▸ **Chart — "The unit loop, fully staffed"** · *L2 · the atom.* The four beats across the top; the
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

> **⟐ Under autonomy.** The dashed line from `reflect` to the human escape hatch (implicit here,
> explicit in the fractal chart) is the loop's independent terminal. An autonomous pipeline that lets
> an executor staff `escalate`/`decide` too has *cut that line* — and with it the loop's only outside
> check. This is the single most important structural change autonomy makes.

---

