## 10. What each loop leaves behind: the artifacts

**What it is.** An **artifact** is the persistent, explicit carrier of a loop's target, result, or
lesson. Specs, code, tests, telemetry, decision records, post-mortems, version history, runbooks — each
is the durable residue of a beat.

**Why they exist.** Stone #7 (knowledge is distributed and perishable) forces every loop to hand its
information across **two boundaries**: *time* (the knowledge perishes — defeated by **persistence**) and
*agent* (the knowledge is trapped in one head — defeated by an **explicit, external form**). An artifact
is exactly the thing that crosses both. Shared understanding is the *output*; distribution is the
*fact*; the artifact manufactures the shared, durable copy that a head cannot. Artifacts are not process
hygiene — they are *logically forced* the moment a loop's information must cross a boundary it cannot
cross in a head.

**One artifact per beat**, plus two for the cross-cutting machinery:

| Beat / cross-cut | Artifact | Crosses *time* (persist) | Crosses *agent* (make explicit) |
|---|---|---|---|
| **define** (specify · scope · design) | **spec / target doc** — including design's interface contracts + composition hypothesis, written to be executable as stubs | outlives the moment it was framed | a different builder can build from it |
| **do** (implement) | **code** | persists as the running system | a different maintainer can read it |
| **check** (verify · observe) | **tests + telemetry** — tests are `verify`'s build-time carrier; telemetry is `observe`'s run-time sensor | a repeatable, re-runnable check | someone else can run and interpret it |
| **reflect** (analyze · decide) | **decision record (ADR) + post-mortem** | the post-mortem carries the lesson to the *next* iteration | the ADR carries the *why* to a *later* root-causer |
| **repeat over time** | **version history** | *is itself* the durable time-axis | bisect / blame across contributors |
| **resilience repertoire** | **runbooks** | know-how outlives the on-call who learned it | whoever is paged next, not just the first responder |

### The boundary-distance law

How *durable* an artifact is *forced* to be scales with the **distance between its producer and its
consumer**:

- **Forward beats hand off *live*.** A spec is consumed by the code in the same iteration; the code by
  the test right after. Producer and consumer are adjacent, so the written artifact merely **insures**
  the output against boundaries it *might* cross later. Skip it and a future re-reader is inconvenienced.
- **`reflect` feeds *backward*, so its artifact is the *sole channel*.** Its only consumers are a
  *later* agent doing root-cause (the **ADR** — the agent boundary) and a *future* iteration's `define`
  (the **post-mortem** — the time boundary). Both are across a stone-#7 boundary *by construction*. Skip
  it and the output reaches **no one**: the composite failure becomes untraceable (`analyze` is starved,
  so `reflect` collapses into "we know it broke, not why"), and the same failure class recurs forever
  (the Ouroboros evolve edge is unfed, so the loop cannot raise its own floor). This is why the
  reflect-artifact is a **hard gate** (Chapter 11), not documentation hygiene: it is the only *backward*
  channel the loop has, and it is what makes `reflect` the loop's one *learning* beat.

> ▸ **Chart — "The artifacts"** · *L2 · persistence overlay.* Each beat produces its carrier (left →
> middle); each carrier crosses the *time* and/or *agent* boundary (middle → right).

```pipeline-graph
{
  "title": "The artifacts",
  "level": "L2 · persistence overlay",
  "summary": "Stone #7's per-beat carriers. Every loop's information must cross the time boundary (perishable → persist) and the agent boundary (distributed → make explicit); an artifact is the thing that crosses both.",
  "zoomOut": "The unit loop, fully staffed",
  "zoomIn": ["The change axis — regression & rollback"],
  "nodes": [
    {"id":"define","label":"define","group":"beat","x":0,"y":0},
    {"id":"do","label":"do","group":"beat","x":0,"y":90},
    {"id":"check","label":"check","group":"beat","x":0,"y":180},
    {"id":"reflect","label":"reflect","group":"beat","x":0,"y":270},
    {"id":"overtime","label":"repeat over time","group":"element","x":0,"y":360},
    {"id":"repertoire","label":"resilience repertoire","group":"repertoire","x":0,"y":450},
    {"id":"a_spec","label":"spec / target doc","group":"property","x":300,"y":0},
    {"id":"a_code","label":"code","group":"property","x":300,"y":90},
    {"id":"a_tests","label":"tests + telemetry","group":"property","x":300,"y":180},
    {"id":"a_post","label":"ADR + post-mortem","group":"property","x":300,"y":270},
    {"id":"a_version","label":"version history","group":"property","x":300,"y":360},
    {"id":"a_runbook","label":"runbooks","group":"property","x":300,"y":450},
    {"id":"b_time","label":"TIME → persist","group":"stone","x":620,"y":135},
    {"id":"b_agent","label":"AGENT → make explicit","group":"stone","x":620,"y":315}
  ],
  "edges": [
    {"source":"define","target":"a_spec","label":"produces"},
    {"source":"do","target":"a_code","label":"produces"},
    {"source":"check","target":"a_tests","label":"produces"},
    {"source":"reflect","target":"a_post","label":"produces"},
    {"source":"overtime","target":"a_version","label":"produces"},
    {"source":"repertoire","target":"a_runbook","label":"produces"},
    {"source":"a_version","target":"b_time","dashed":true,"label":"crosses"},
    {"source":"a_spec","target":"b_agent","dashed":true,"label":"crosses"},
    {"source":"a_runbook","target":"b_time","dashed":true},
    {"source":"a_post","target":"b_agent","dashed":true,"label":"ADR · sole channel (backward)"},
    {"source":"a_post","target":"b_time","dashed":true,"label":"post-mortem · sole channel (backward)"}
  ]
}
```

### 10.1 The change axis: the regression ratchet and the rollback net

Stone #5 — *reality keeps changing* — bites the over-time loop on **two faces**, and each face forces
its own organ. Together they are the change-axis counterpart of the #6 pair (`degrade` / `recover`,
Chapter 8).

**Face 1 — change re-opens closed holes → the regression ratchet.** Every later change can silently
re-introduce a failure the loop already paid to fix. Run the boundary-distance law on that fact: the
fix's lesson must reach *every future iteration*, and a prose post-mortem is a **passive** memory —
under continuous change it degrades to "re-derive, not remember." To fire automatically on every
future pass, the lesson must be persisted **as a re-runnable check**: the post-mortem's *why* compiled
into `verify`. That is what a **regression test** is — the *executable time-face of the
reflect-artifact*, the forced bridge from `reflect` into `verify` — not a new element. And it
**accumulates monotonically**: each fixed failure-class adds a guard, none is dropped. That ratchet is
what makes fixes *stick* — the thing that turns the Ouroboros from a circle into a spiral. Its
**existence is a hard gate** (deleting the loop's memory-of-fixes is machinery-degrading, Chapter 11);
its **coverage is graded** (a Goodhartable proxy, like all coverage).

**Face 2 — change lands on a live system → the rollback net.** A bad deploy or migration degrades a
*currently-working* system, and the fault is in the new artifact itself — so the in-place #6 responses
miss: redundancy just runs more copies of the bad version; degrading just serves less of the broken
thing. The only restoring move is *backward in version-space*: **roll back** to the last known-good.
It is forced jointly by change (#5 — the harm lands live), the a-posteriori residue (#6/#4 — build-time
checks provably missed it), and perishability (#7 — a live system bleeds value every minute it is
broken; the forward-fix is too slow to stop the bleed).

**Rollback and the irreversibility amplifier are duals.** Chapter 11 *defines* the irreversible
amplifier as damage that "escapes recover / roll back" — so **irreversibility is exactly the region
beyond rollback's reach.** That duality closes cleanly:

- Where rollback **reaches**, a bad outcome is recoverable, so `decide` keeps its discretion — the
  change is a **graded** bet, because rollback has made `cost(error)` small (§6.4's insurance premium,
  made cheap).
- Where rollback's reach **ends** — a destructive migration, a leaked secret, a sent message, an
  irreversible payment — the insurance has lapsed, `accept` is deleted, and the check becomes a
  **hard gate discharged *before* execution**: a backup, a reversible-migration check, a staged
  rollout, a confirmation.

So rollback itself is a graded response, and **the hard gate falls at its limit**.

**The inversion worth memorising.** The two organs point opposite ways along the same axis:
**rollback keeps *changes* reversible; regression keeps *lessons* irreversible.** You want bad changes
not to stick and good fixes not to un-stick. They also gate through *different* amplifiers — rollback's
gate sits at its **limit** (irreversibility); regression's gate sits on its **existence** (machinery).
A practical corollary: since rollback's reach *is* the graded region, the ideal loop **invests in
widening the reversible envelope** — expand-contract migrations, feature flags, immutable deploys —
because every seam brought inside the envelope converts a pre-execution gate back into a cheap,
graded bet.

**Where they fire.** Regression fires at **build time** — the verify/integrate gate just before
`release`; rollback fires at **run time** — in OPERATE, just after it. The pair straddles the release
seam (Chapter 7), which is exactly why "release governance" is not a new element: it *is* this
machinery. And together the two organs buy `resilient` its **"over time"** clause: `degrade`/`recover`
buy the *context* clause, while without the ratchet the envelope is only momentary — it leaks every
time change re-opens an old hole.

> ▸ **Chart — "The change axis — regression & rollback"** · *L3 · the time axis.* Stone #5's two
> faces force two dual organs: the post-mortem compiled into an auto-firing, monotonically-accumulating
> `verify` check (existence gated, coverage graded), and the backward move in version-space whose
> reach defines the graded region (the gate falls at its limit).

```pipeline-graph
{
  "title": "The change axis — regression & rollback",
  "level": "L3 · the time axis",
  "summary": "Stone #5 bites twice: change re-opens closed holes (→ the regression ratchet — the executable reflect-artifact; existence hard, coverage graded) and change lands on a live system (→ the rollback net — graded, with the hard gate at its irreversible limit).",
  "zoomOut": "The artifacts",
  "zoomIn": ["Hard gate or graded target?", "The convergent law"],
  "nodes": [
    {"id":"change","label":"stone #5 — reality keeps changing","group":"stone","x":430,"y":0},
    {"id":"face1","label":"face 1 · change re-opens closed holes","group":"beat","x":110,"y":110},
    {"id":"face2","label":"face 2 · change lands on a live system","group":"beat","x":760,"y":110},
    {"id":"postmortem","label":"post-mortem (passive prose lesson)","group":"property","x":-60,"y":220},
    {"id":"regression","label":"REGRESSION — the lesson compiled into verify","group":"element","x":250,"y":220},
    {"id":"ratchet","label":"monotonic ratchet — fixes stick (circle → spiral)","group":"property","x":110,"y":330},
    {"id":"gate1","label":"existence = hard gate · coverage = graded","group":"terminal","x":390,"y":330},
    {"id":"rollback","label":"ROLLBACK — backward in version-space","group":"element","x":760,"y":220},
    {"id":"limit","label":"its limit = the irreversible region (amplifier #2)","group":"stone","x":1090,"y":220},
    {"id":"gate2","label":"inside reach: graded bet · at the limit: pre-execution hard gate","group":"terminal","x":900,"y":330},
    {"id":"resilient","label":"resilient — the over-time clause","group":"property","x":560,"y":430}
  ],
  "edges": [
    {"source":"change","target":"face1","member":true},
    {"source":"change","target":"face2","member":true},
    {"source":"face1","target":"regression"},
    {"source":"postmortem","target":"regression","label":"compiled — the reflect → verify bridge"},
    {"source":"regression","target":"ratchet","label":"accumulates"},
    {"source":"regression","target":"gate1","dashed":true},
    {"source":"face2","target":"rollback"},
    {"source":"rollback","target":"limit","member":true,"label":"reach ends"},
    {"source":"rollback","target":"gate2","dashed":true},
    {"source":"ratchet","target":"resilient","label":"lessons stay irreversible"},
    {"source":"rollback","target":"resilient","label":"changes stay reversible"}
  ]
}
```

> **⟐ Under autonomy.** Both organs are exactly what a cost-optimising executor is tempted to skip: a
> "fix" landed without a regression guard un-sticks the lesson the moment the next change arrives, and
> an action taken beyond rollback's reach without a pre-execution gate is a bet no one priced. An
> autonomous pipeline should treat **rollback's reach as its permission boundary** — inside it, act and
> iterate; beyond it, the gate (backup · staged rollout · confirmation) is not optional ceremony, it is
> the machinery that keeps a wrong-but-confident action recoverable.

---

