## 5. The loop, fully staffed: the elements

<sup>[↪ Why](#r-element-01)</sup>

**What it is.** The **elements** are the concrete jobs that staff the loop's beats in the *outermost*
SDLC loop. They are not a checklist bolted on by habit; they are the **anatomy of the loop**, each one
assigned a distinct job. The control elements answer specific stones; `implement` is the base act
they govern. Every element is a *verb*, because each names an action.

**Why there are exactly these.** Run the self-test from Chapter 3 on the control elements: each must
answer a stone with work no other element already does. `implement` is the one licensed exception:
the work those controls govern. Adding another control that repeats an existing output is ceremony.

| Beat | Element | Forced by | What it does |
|---|---|---|---|
| **define** | **specify** | intent is hidden (#1) | Draws the real target out of a hidden need — the one *elicited* input the model has. |
| **define** | **scope** | unbounded vs. finite (#2) | Sets the boundary: how much, which items, in this pass. |
| **define** | **design** | complexity > one step (#3) | Carves the whole into parts and states how they compose — the decomposition *is* design's output. |
| **do** | **implement** | (the build itself) | Executes. The base act; it defends no stone of its own — it is simply the work. |
| **check** | **verify** | humans & models err (#4) | Build-time check: did we build what we specified? |
| **check** | **observe** | reality is uncertain (#6) | Run-time check: did reality match what we modelled? The loop's own sensor (telemetry). <sup>[↪ Why](#r-loop-03)</sup> |
| **reflect** | **analyze** | humans & models err (#4) | Frames and root-causes the gap. |
| **reflect** | **decide** | unbounded vs. finite (#2) | Chooses: accept a known issue, re-target, or escalate. |
| **repeat over time** | **version · integrate · regression-test** | reality keeps changing (#5) | Keeps the loop running as the target moves. `regression-test` is not a standalone element — it is the forced **`reflect` → `verify` bridge**: a fixed failure's lesson compiled into an auto-firing check (§10.1). <sup>[↪ Why](#r-artifact-02)</sup> |

### Two planes: beats vs. elements

<sup>[↪ Why](#r-loop-06)</sup>

There is a subtle but important distinction. The **beats** (`define → do → check → reflect`) are
*scale-invariant* — the same four recur at every level of the system. The **elements** (specify … decide)
are the *outermost* loop's particular staffing of those beats. `analyze` and `decide`, for instance,
are how the `reflect` beat is staffed at the top level; deeper down, `reflect` is staffed by finer
activities. Keep the two planes separate and the fractal (Chapter 6) makes sense; conflate them and it
looks like a contradiction.

### Why there is no separate "decompose"

<sup>[↪ Why](#r-element-01)</sup>

An earlier version of the model had a distinct `decompose` element. It was removed because it did no
work `design` wasn't already doing: `design`'s output *is* the decomposition, the loop re-applies
itself to each part that design carves, and the feedback edge (`reflect → re-target(design)`) already
carries any "this decomposition was wrong" signal back. A `decompose` element defended the same stone
as `design` (#3) and owned no artifact of its own — so it was vestigial, and folding it away left `do`
as pure execution. This is the self-test doing maintenance: *two elements on one stone, one of them
derivable, is a smell.*

*(This chapter reuses the **"The unit loop, fully staffed"** chart from Chapter 4 — the middle band is
the element roster.)*

---
