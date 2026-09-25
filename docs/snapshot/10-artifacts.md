## 10. What each loop leaves behind: the artifacts

<sup>[↪ Why](#r-artifact-01)</sup>

**What it is.** An **artifact** is an explicit carrier of a work unit's target, result, or lesson that
must reach a later or different consumer. Specs, code, tests, telemetry, decision records,
post-mortems, version history, and runbooks are common carriers. Nested loops can share one artifact
when it preserves the evidence they need. <sup>[↪ Why](#r-gate-04)</sup>

**Why they exist.** Stone #7 (knowledge is distributed and perishable) creates two possible handoffs:
*time* requires persistence, and *agent* requires an explicit form another person or agent can use.
An artifact is required when a target, result, or lesson must cross either boundary. The needed part
must also be findable and surfaced to its consumer; storing it alone does not complete the handoff.

The main carrier categories follow the beats and two cross-cutting needs. These are roles, not a
requirement to create a separate file for each beat or nested loop:

| Beat / cross-cut | Artifact | Crosses *time* (persist) | Crosses *agent* (make explicit) |
|---|---|---|---|
| **define** (specify · scope · design) | **spec / target doc** — including design's interface contracts + composition hypothesis, written to be executable as stubs | outlives the moment it was framed | a different builder can build from it |
| **do** (implement) | **code** | persists as the running system | a different maintainer can read it |
| **check** (verify · observe) | **tests + telemetry** — tests are `verify`'s build-time carrier; telemetry is `observe`'s run-time sensor | a repeatable, re-runnable check | someone else can run and interpret it |
| **reflect** (analyze · decide) | **decision record (ADR) + post-mortem** | the post-mortem carries the lesson to the *next* iteration | the ADR carries the *why* to a *later* root-causer |
| **repeat over time** | **version history** | *is itself* the durable time-axis | bisect / blame across contributors |
| **resilience repertoire** | **runbooks** | know-how outlives the on-call who learned it | whoever is paged next, not just the first responder |

### The boundary-distance law

<sup>[↪ Why](#r-artifact-01)</sup>

How *durable* an artifact is *forced* to be scales with the **distance between its producer and its
consumer**:

- **Forward beats can hand off *live*.** Producer and consumer may be adjacent in one iteration. Keep
  the target or result explicit when the accountable unit needs it for acceptance or a later consumer
  must use it. The same artifact may carry evidence for several inner loops.
- **`reflect` feeds *backward*.** A later root-causer needs the reason for a decision; a future
  iteration needs the failure and its lesson. Without a carrier, those consumers must rediscover the
  reasoning, and the loop cannot reliably learn from the failure. Required reflect evidence has an
  existence gate at the accountable work unit, while a named seam can gate earlier (Chapter 11).
  <sup>[↪ Why](#r-loop-02) · [↪ Why](#r-gate-04)</sup>

> ▸ **Chart — "The artifacts"** <sup>[↪ Why](#r-artifact-01) · [↪ Why](#r-gate-04)</sup> · *L2 · persistence
> overlay.* The diagram maps carrier roles to beats. An accountable work unit may share a carrier across
> nested loops; the needed information crosses whichever time or agent boundary the work requires.

```pipeline-graph
{
  "title": "The artifacts",
  "level": "L2 · persistence overlay",
  "summary": "Stone #7 requires explicit, retrievable carriers when information must cross time or agent boundaries. These are carrier roles; nested loops in an accountable work unit may share an artifact.",
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
    {"source":"define","target":"a_spec","label":"carrier role"},
    {"source":"do","target":"a_code","label":"carrier role"},
    {"source":"check","target":"a_tests","label":"carrier role"},
    {"source":"reflect","target":"a_post","label":"carrier role"},
    {"source":"overtime","target":"a_version","label":"carrier role"},
    {"source":"repertoire","target":"a_runbook","label":"carrier role"},
    {"source":"a_version","target":"b_time","dashed":true,"label":"crosses"},
    {"source":"a_spec","target":"b_agent","dashed":true,"label":"crosses"},
    {"source":"a_runbook","target":"b_time","dashed":true},
    {"source":"a_post","target":"b_agent","dashed":true,"label":"decision rationale for later agent"},
    {"source":"a_post","target":"b_time","dashed":true,"label":"lesson for later iteration"}
  ]
}
```

### 10.1 The change axis: the regression ratchet and the rollback net

<sup>[↪ Why](#r-artifact-02)</sup>

Stone #5 — *reality keeps changing* — bites the over-time loop on **two faces**, and each face forces
its own organ. Together they are the change-axis counterpart of the #6 pair (`degrade` / `recover`,
Chapter 8).

**Face 1 — change re-opens closed holes → the regression ratchet.** Every later change can silently
re-introduce a failure the loop already paid to fix. Run the boundary-distance law on that fact: the
fix's lesson must reach *every future iteration*, and a prose post-mortem is a **passive** memory —
under continuous change it degrades to "re-derive, not remember." While a failure class remains
relevant, a re-runnable check carries its lesson into `verify`. That is the role of a regression test,
the executable bridge from `reflect` into `verify`.

**Preserve the lesson and its rationale; govern the test instance.** The durable record retains the
failure, why it mattered, and the reason for its guard. A test may be replaced or retired when it is
obsolete, redundant, or misleading. Record the retirement reason and link the replacement guard, or
explain why the failure class no longer applies. Retiring a test does not erase the lesson or authorize
loss of a still-required guard. The retained knowledge grows; the number of tests need not. Required
regression evidence has an existence gate at the accountable work unit; coverage remains graded
(Chapter 11). <sup>[↪ Why](#r-artifact-03)</sup>

**Face 2 — change lands on a live system → the rollback net.** A bad deploy or migration degrades a
*currently-working* system, and the fault is in the new artifact itself — so the in-place #6 responses
miss: redundancy just runs more copies of the bad version; degrading just serves less of the broken
thing. When a forward fix cannot arrive in time, a restoring move is *backward in version-space*:
**roll back** to the last known-good. This response matters when change lands live (#5), build-time
checks missed the fault, and the cost of waiting for a forward fix exceeds the cost of reverting.

**Rollback limits one harm amplifier.** Chapter 11 includes damage that escapes recovery or rollback
in the irreversibility amplifier. Rollback can reduce that risk for effects it actually reverses:

- Where rollback **reaches**, the reversible effect can be a **graded** bet if no other gate applies.
  A directed adversary, non-local harm, or outside authority can still require a hard gate before
  execution. <sup>[↪ Why](#r-gate-01)</sup>
- Where rollback's reach **ends** — a destructive migration, a leaked secret, a sent message, an
  irreversible payment — assess the loss. If it is non-local or outside authority requires a control,
  use a **pre-execution gate**: for example, a backup, reversible-migration check, staged rollout, or
  confirmation suited to the effect.

Rollback is a graded response within its reach. Its limit is one reason for a hard gate, not the
complete permission boundary.

**The inversion worth memorising.** The two organs point opposite ways along the same axis:
**rollback keeps *changes* reversible; regression keeps *lessons* irreversible.** You want bad changes
not to stick and good fixes not to un-stick. Their gates answer different failures: an effect beyond
rollback's reach raises irreversibility risk; missing required regression evidence disables the
learning machinery. Widen the reversible envelope with measures such as expand-contract migrations,
feature flags, and immutable deploys. This can remove the irreversibility gate for a given effect, but
it does not remove other applicable gates. <sup>[↪ Why](#r-gate-01)</sup>

**Where they fire.** Regression fires at **build time** — the verify/integrate gate just before
`release`; rollback fires at **run time** — in OPERATE, just after it. The pair straddles the release
seam (Chapter 7), which is exactly why "release governance" is not a new element: it *is* this
machinery. And together the two organs buy `resilient` its **"over time"** clause: `degrade`/`recover`
buy the *context* clause, while without the ratchet the envelope is only momentary — it leaks every
time change re-opens an old hole.

> ▸ **Chart — "The change axis — regression & rollback"** <sup>[↪ Why](#r-artifact-02)</sup> · *L3 · the time axis.* Stone #5's two
> faces force two dual organs: retained lessons with governed regression checks
> (existence gated, coverage graded), and the backward move in version-space whose
> reach reduces irreversibility risk without removing other gates.

```pipeline-graph
{
  "title": "The change axis — regression & rollback",
  "level": "L3 · the time axis",
  "summary": "Change can reintroduce fixed failures or damage a live system. Regression preserves lessons while test instances are governed; required evidence is gated and coverage graded. Rollback reverses effects within its reach; non-local irreversible effects need a pre-execution gate, and other gates may still apply inside that reach.",
  "zoomOut": "The artifacts",
  "zoomIn": ["Hard gate or graded target?", "The convergent law"],
  "nodes": [
    {"id":"change","label":"stone #5 — reality keeps changing","group":"stone","x":430,"y":0},
    {"id":"face1","label":"face 1 · change re-opens closed holes","group":"beat","x":110,"y":110},
    {"id":"face2","label":"face 2 · change lands on a live system","group":"beat","x":760,"y":110},
    {"id":"postmortem","label":"post-mortem (passive prose lesson)","group":"property","x":-60,"y":220},
    {"id":"regression","label":"REGRESSION — the lesson compiled into verify","group":"element","x":250,"y":220},
    {"id":"ratchet","label":"retain lessons · govern test instances","group":"property","x":110,"y":330},
    {"id":"gate1","label":"existence = hard gate · coverage = graded","group":"terminal","x":390,"y":330},
    {"id":"rollback","label":"ROLLBACK — backward in version-space","group":"element","x":760,"y":220},
    {"id":"limit","label":"beyond reach: irreversibility risk","group":"stone","x":1090,"y":220},
    {"id":"gate2","label":"inside: check other gates · beyond: assess harm","group":"terminal","x":900,"y":330},
    {"id":"resilient","label":"resilient — the over-time clause","group":"property","x":560,"y":430}
  ],
  "edges": [
    {"source":"change","target":"face1","member":true},
    {"source":"change","target":"face2","member":true},
    {"source":"face1","target":"regression"},
    {"source":"postmortem","target":"regression","label":"compiled — the reflect → verify bridge"},
    {"source":"regression","target":"ratchet","label":"preserves learning"},
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
> an action taken beyond rollback's reach without assessing its harm risks an irreversible loss. An
> autonomous pipeline should check **rollback's reach and the other gate sources** before acting.
> Inside that reach, act and iterate only when no non-local or outside-authority gate applies. Beyond
> it, gate non-local harm and honor outside authority before execution. <sup>[↪ Why](#r-gate-01)</sup>

---
