# The Ideal SDLC — A First-Principles Design

> **What this document is.** A clean, human-readable snapshot of the software-development
> lifecycle (SDLC) we have derived from first principles — *what an ideal SDLC must contain, and
> why every piece is logically forced into existence rather than adopted by convention.* It covers
> both the **human-run** lifecycle and the **autonomous / agentic** one (Chapter 12).
>
> This is the **design**, presented for comprehension. Its companion, the
> [canvas](index.html), is the **working derivation**
> — the terse, evolving state file with the full audit trail of *how* we arrived here (the Socratic
> Q&A, the iteration log, the open research tracks). When the two disagree, the canvas is the source
> of truth for *reasoning*; this document is the source of truth for *understanding*.
>
> **This snapshot is frozen as of 2026-07-30** (`asOf` in `docs/snapshot.parts.json`). It is
> historical truth as of that date, not a promise of perpetual factual freshness. A substantive
> change advances the date and updates the affected rationale entries in the same commit.

### The four sources of truth

<sup>[↪ Why](#r-method-01)</sup>

This repository has exactly four. Nothing else is normative — and precedence is declared here and
nowhere else, so that a disagreement between any two of them has one settled answer.

| Document | Role | Wins on |
|---|---|---|
| [canvas](index.html) — `sdlc-canvas/` | the Socratic derivation, the audit trail, and the open-tracks register | **reasoning** |
| this snapshot — `docs/snapshot/` | the normative statement of the model | **presentation** |
| [rationale ledger](#rationale-ledger) — `docs/RATIONALE.md` | why each contested decision has its current shape, with dated external evidence | **justification** |
| roadmap — `ROADMAP.md` | phases and gates, the Tier D and Tier E registers, traceability, open questions | **forward work** |

**Method.** Model changes are derived in the canvas first, then this snapshot is regenerated from
it. The canvas's `▶ RESUME INSTRUCTIONS` section states the method and is authoritative on it.
Appendix D covers how to run and edit these documents.

---

## How to read this document

<sup>[↪ Why](#r-method-01)</sup>

The document is a **zoom lens**. It starts at the widest possible view — the entire machine in one
picture — and then descends, chapter by chapter, into finer and finer detail. Each chapter answers
three questions in order:

1. **What is it?** — a plain description of the piece.
2. **Why does it exist?** — the brute fact about reality (a "stone") that *forces* it. Nothing here
   is a matter of taste; each element is a forced response to something reality makes unavoidable.
3. **How does it work?** — the mechanics, in ordinary language.

Wherever autonomy changes the picture, a callout marked **⟐ Under autonomy** flags it, and
**Chapter 12** gathers those threads into one place.

### The chart ladder

<sup>[↪ Why](#r-method-01)</sup>

Every chapter carries at least one **interactive chart**. The charts are a single cohesive set,
ordered from the coarsest view to the finest, and cross-linked so you can *zoom out* to the parent
view or *zoom in* to the detail. In the accompanying viewer they render **inline**, exactly where
the prose discusses them, and a floating ladder on the right lets you jump between granularity
levels.

| Level | Chart | Shows | Chapter |
|---|---|---|---|
| **L0** | The complete circuit | The whole machine: forces → loop → behaviours → properties | [Ch. 1](#1-the-system-at-a-glance) |
| **L1** | The four properties | The destination — what a good SDLC produces | [Ch. 2](#2-the-destination-four-properties) |
| **L1** | The bedrock — ten forces | The brute facts that make the work hard | [Ch. 3](#3-the-bedrock-why-the-work-is-hard) |
| **L2** | The unit loop, fully staffed | The atom — one feedback loop, and its elements | [Ch. 4](#4-the-atom-the-unit-control-loop) |
| **L2** | The fractal — one shape, every scale | How the loop repeats up and down, and where it stops | [Ch. 6](#6-the-fractal-one-shape-at-every-scale) |
| **L2** | Feature A — rate limiting, every element opened | The fractal made concrete on a graded feature | [Ch. 6](#6-the-fractal-one-shape-at-every-scale) |
| **L3** | Feature A — the reflect beat, opened inward | The fractal driven inward into one beat | [Ch. 6](#6-the-fractal-one-shape-at-every-scale) |
| **L2** | Feature B — password reset, every element opened | The same shape where security forbids skipping | [Ch. 6](#6-the-fractal-one-shape-at-every-scale) |
| **L3** | Feature B — design & verify against an adversary | The two elements a directed adversary re-shapes | [Ch. 6](#6-the-fractal-one-shape-at-every-scale) |
| **L3** | When the loop collapses — is the ceremony a must? | Which ceremony is reducible, and the two overrides | [Ch. 6](#6-the-fractal-one-shape-at-every-scale) |
| **L2** | The lifecycle (process flow) | The familiar lifecycle, as a projection of the loop | [Ch. 7](#7-the-lifecycle-the-process-flow) |
| **L3** | The schedule bet | How `plan` bets a date — and which half of the bet is gated | [Ch. 7](#7-the-lifecycle-the-process-flow) |
| **L2** | The two repertoires | Cross-cutting responses: resilience vs. security | [Ch. 8](#8-the-two-repertoires-resilience-and-security) |
| **L3** | Done propagation | How a target is set, inherited, and checked | [Ch. 9](#9-the-mechanism-of-done) |
| **L3** | Design as a bet — stub-composition | How design states and cheaply tests its bet | [Ch. 9](#9-the-mechanism-of-done) |
| **L3** | The premise-B lever | How one interface contract is tuned | [Ch. 9](#9-the-mechanism-of-done) |
| **L2** | The artifacts | What each loop leaves behind, and why | [Ch. 10](#10-what-each-loop-leaves-behind-the-artifacts) |
| **L3** | The change axis — regression & rollback | Stone #5's two organs: fixes stick, changes stay reversible | [Ch. 10](#10-what-each-loop-leaves-behind-the-artifacts) |
| **L3** | Hard gate or graded target? | Which checks are non-negotiable | [Ch. 11](#11-hard-gates-versus-graded-targets) |
| **L3** | The convergent law | One law, four instances: existence gated, fidelity graded | [Ch. 11](#11-hard-gates-versus-graded-targets) |
| **L4** | The second-order tier — the delegated/autonomous regime | Why an autonomous loop can neither judge nor trust itself | [Ch. 12](#12-the-autonomous-agentic-sdlc) |

> **The one-sentence thesis.** A reliable, predictable, resilient, and secure SDLC is not a
> checklist of practices — it is the **emergent behaviour of a single bounded feedback loop**, forced
> into a specific shape by a handful of unavoidable facts about reality, and repeated at every scale.

---

