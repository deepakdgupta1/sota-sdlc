## 6. The elements — the loop, fully staffed

The elements are not a checklist; they are the **anatomy of the loop**, each forced by a
stone. **Plane distinction:** the left column lists the scale-invariant *beats*; the middle
column lists the *elements* — the **outermost** SDLC loop's concrete staffing of each beat.
`analyze`/`decide` are the elements that instantiate the `reflect` beat *at the outermost
level*; they are not the beat itself (which recurs, staffed differently, at every deeper
level).

| loop beat | element | forced by (stone) |
|---|---|---|
| **define** (set target) | specify | intent is hidden |
| **define** | scope (& prioritise) | unbounded vs finite |
| **define** | design (carves the decomposition) | complexity > one step |
| **do** | implement | (the build itself) |
| **check** | verify (build-time) | humans & models err |
| **check** | observe (run-time) | reality is uncertain |
| **reflect** | analyze — frame + root-cause the gap | humans & models err |
| **reflect** | decide — accept (known issue) or re-target | unbounded vs finite |
| **repeat over time** | version · integrate (CI/CD) · regression-test | reality keeps changing |

> **`decompose` folded into `design` (iteration 18).** Both once rested on stone #3; but
> `design`'s output *is* the decomposition, the fractal re-applies the loop to each part it
> carves, and `reflect → re-target(design)` (shift-left) carries any implement→design
> complexity feedback. A separate `decompose` did no work the loop wasn't already doing and
> owned no artifact — so it was vestigial. `do` is now execution-only.

**Cross-cutting — the resilience repertoire (not beats).** Invoked from `reflect` at any
element and any scale; realised mostly at run-time. Each is forced by a resilience stone, and
together they manufacture the **resilient** property:

| response | what it does | concrete example | forced by |
|---|---|---|---|
| **escalate** | hand up when bounded tries are exhausted; ends at a human | retries for one email domain keep failing → page on-call | loop can't converge |
| **degrade** | fail partial, not total (error handling / graceful degradation) | email provider down → queue the request + "arriving shortly" instead of a 500 | reality is uncertain |
| **recover** | spares · replicas · retries so the function survives a failure (redundancy) | second email provider takes over when the primary fails | reality is uncertain |
| **roll back** | revert to the last known-good state | new reset-email template spikes bounces → redeploy the previous one | reality keeps changing |

> **Compact form (T9, §10.8).** One **structural up-exit** — `escalate` (leaves the loop → parent / human
> terminal) — versus three **in-place** trades for liveness: `degrade` (completeness), `recover`
> (spares/redundancy), `roll back` (newness). `degrade`/`recover` are the **#6 context pair**; **`roll back`
> + `regression`** (build-time) are the **#5 time pair** (§10.8). And `regression-test` (elements table
> above) is the forced **`reflect → verify` bridge** — the *executable* time-face of the §10.5
> reflect-artifact — not a standalone element.

**Cross-cutting — the security repertoire (not beats), forced by stone #8 (adversarial actors).**
Where the resilience repertoire withstands *random* adverse reality (#5/#6), the security repertoire
withstands a *directed* adversary who hunts the worst case. Also invoked at every element and scale,
spanning design → build → run-time:

| response | what it does | concrete example | forced by |
|---|---|---|---|
| **authenticate / authorize** | prove identity + gate every action by least-privilege | signed-in ≠ allowed; check permission per request | adversary impersonates / escalates |
| **sanitize / validate** | narrow every boundary contract; never trust external data (the premise-B **narrow-lever** aimed at an attacker) | parameterized queries (SQLi) · output-encode (XSS) · CSRF tokens | adversary injects via untrusted input |
| **minimise surface / harden** | least exposure; secrets in a vault; no info-leak in errors | secrets from Keychain; generic error messages | adversary probes any exposed weakness |
| **threat-model / red-team** | search for your *own* worst case *before* the adversary does | pen-test; abuse-case review at design | adversary is a directed optimiser |

> **The seam with §10.2:** `sanitize/validate` *is* the premise-B **narrow-lever** — but here its
> floor is set by an *attacker*, not by natural variance, which is *why* "never trust external data"
> is a **hard gate** and not merely advisory.

> **Double duty with stone #9 (§3):** `threat-model / red-team` is also the response to **reflexivity** —
> an *independent, adversarial* checker deliberately not sharing the builder's assumptions is exactly what
> breaks the doer↔checker correlation. Same response, two sources: #8 (external attacker) and #9 (internal
> shared blind spot). This is why an autonomous pipeline must inject independence deliberately (diverse /
> adversarial reviewers, a human terminal) — it has no free escape-hatch to fall back on.

## 7. The process flow (with nested loops)

```
discover → define → design → plan
   → BUILD     [feature loop:  do  ⇄  check vs graded 'done'  →  reflect  ↺ re-target ]
   → verify    (stage gate against 'done')
   → release
   → OPERATE   [runtime loop:  observe  ⇄  recover / degrade / roll back / escalate   ↺ watch ]
   ⟲ PRODUCT LOOP:  operate → learn → evolve target → back to discover   (the Ouroboros)

solid = forward flow (the lifecycle)   ·   dashed = loops / feedback (at every scale)
```

> **§7 is a *projection* (§10.10), not new primitives.** These stages are the §6 elements laid on wall-clock
> at product scale — a *view*. `plan` = `scope`+`specify` on the time axis (a **schedule bet**, §10.10);
> `implement`/BUILD = the **base act**; `release` = the build→operate **seam** (its #5 governance = §10.8 /
> T3); OPERATE = a **phase-loop** (observe + repertoire, now incl. `roll back`); evolve = the **Ouroboros**.
> Only the control-elements are stone-defended primitives — reading nine stages as nine primitives
> double-counts.

## 8. The complete circuit (synthesis)

The four properties are **emergent**, not installed — manufactured by a system of bounded,
nested feedback loops, themselves built from elements forced by brute facts.

```
        ┌────────────── evolve  (feedback) ◄──────────────────────────┐
        ▼                                                             │
  reliable     predictable      resilient        secure   ◄── 4 properties (emergent)
     ▲              ▲               ▲                ▲
 converges       bounded     nests+escalate     preempts   ◄── loop behaviours
     └──────────────────── THE LOOP ─────────────────┘
              (set target → do → check → reflect ↺)
                          ▲  force
   bedrock:  intent-hidden · finite · complex · we-err · change · uncertain · distributed · adversarial
             · [2nd-order, delegated/autonomous only → erode reliable: #9 reflexivity · #10 incentive-divergence]

   point-properties: reliable · predictable   |   envelope-properties: resilient (vs random #5/#6) · secure (vs directed #8)
```

## 9. The artifacts — what each loop leaves behind

Stone #7 (**knowledge is distributed & perishable**) forces every loop to hand its information
across **two boundaries**: *time* (perishable → defeated by **persistence**) and *agent*
(distributed → defeated by an **explicit, external** form). An **artifact** is exactly the
**persistent, explicit carrier** of a loop's target / result / lesson across those two
boundaries — shared understanding is the *output*, distribution is the *fact*, and the artifact
manufactures the shared, durable copy a head cannot.

There is **one artifact per beat**, plus **two for the cross-cutting machinery** (the over-time
loop and the resilience repertoire):

| beat / cross-cut | elements it carries | artifact | crosses *time* (persist) | crosses *agent* (make explicit) |
|---|---|---|---|---|
| **define** | specify · scope · design | **spec / target doc** ("definition of done") — incl. `design`'s **interface contracts + composition hypothesis**, executable-as-stubs (§10.1) | outlives the moment it was framed | a different builder can build from it |
| **do** | implement | **code** | persists as the running system | a different maintainer can read it |
| **check** | verify · observe | **tests + telemetry** — *tests* = `verify`'s build-time carrier (#4); *telemetry* = `observe`'s run-time sensor (#6), the loop's own detector (§10.6, may **not** be outsourced to the user) | a repeatable, re-runnable check | someone else can run & interpret it |
| **reflect** | analyze · decide | **reflect-output** = **ADR** (the written composition hypothesis, §10.1) + **post-mortem** (the failure lesson) — *one category, one carrier per boundary-face* (§10.5) | **post-mortem** carries the lesson to the *next iteration* | **ADR** carries the *why* to a *later root-causer* |
| **repeat over time** | version · integrate · regression | **version history** | *is itself* the durable time-axis | bisect / blame across contributors |
| **resilience repertoire** | escalate · degrade · recover · roll back | **runbooks** | know-how outlives the on-call who learned it | whoever's paged next, not just the first responder |

- **The loop-level hand-off is the same two crossings at fine grain:** whenever one loop passes
  its target/result to the next (or to a parent/child loop), it is persisting + making explicit
  — an artifact in miniature.
- **Why per-beat, not per-element:** a beat is the smallest unit whose output must survive a
  boundary. `design` shares the `define` beat's spec/target doc rather than owning a *separate*
  one — but its **load-bearing content within that artifact is the interface contracts + the
  composition hypothesis** (§10.1, R2); that is *not* the same as owning no artifact. (A standalone
  `decompose`, by contrast, added no content the loop wasn't already carrying, so it was folded
  away — see §11.)
- **Forced-durability scales with boundary-distance — and `reflect` is the extreme case (§10.5).** A
  forward beat's output is consumed by the *next beat in the same iteration* (spec→code→test): producer
  and consumer are **adjacent**, so the hand-off can be *live* and the written artifact merely **insures**
  the output against boundaries it might cross later. `reflect` alone feeds **backward** — its only
  consumers are a *later agent* doing root-cause (the **ADR**, the *agent* face) and a *future
  iteration*'s `define` (the **post-mortem**, the *time* face), both across a stone-#7 boundary **by
  construction**. So for `reflect` the artifact is not insurance but the **sole channel**: omit a forward
  artifact and a future re-reader is inconvenienced; omit `reflect`'s and the output reaches *no one*.
  **General law: the durability an artifact is *forced* to carry scales with the producer→consumer
  boundary-distance** — adjacent ⇒ optional-but-insuring; backward / cross-iteration ⇒
  mandatory-as-sole-channel. (This is the law the artifacts diagram should show — janitorial **T10**, §11.)
- **This is the flush of stone #7:** artifacts are not convention or process hygiene; they are
  *logically forced* the moment a loop's information must cross a boundary it cannot cross in a
  head.

