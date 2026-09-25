# Current SDLC reference model

> **What this document is.** A reference model for accountable software-development work. It relates
> the current hazard taxonomy to a bounded feedback loop, its responses and evidence, and four
> top-level acceptance properties. People or software agents may staff the loop. The model supports
> design and review; it does not prove that this taxonomy is exhaustive or prescribe one toolchain or
> ceremony for every work unit.

### Scope, assumptions, and admission

<sup>[↪ Why](#r-method-02) · [↪ Why](#r-unit-01) · [↪ Why](#r-bedrock-01)</sup>

- **Scope.** The model covers software work from target definition through operation and learning,
  including delegated execution. It describes what to decide, check, retain, and escalate. Auditing a
  particular organization or stack against the model is a separate exercise.
- **Assumptions.** An accountable work unit can declare its boundary, acceptance vector, and decision
  authority. The unit chooses evidence and controls for its context and risk; an outside authority may
  impose additional gates. Inner loops can share evidence and collapse when their separate ceremony
  adds no required information.
- **Admission.** A candidate hazard enters the bedrock only if it is a brute fact rather than a
  contingent design choice, requires a response the admitted hazards do not already explain, and
  survives the three-direction self-test in Chapter 3. The present counts are pressure-tested
  judgments, not a closed inventory.

## How to read this document

<sup>[↪ Why](#r-method-01)</sup>

The document is a **zoom lens**. It starts at the widest possible view — the entire machine in one
picture — and then descends, chapter by chapter, into finer and finer detail. Each chapter answers
three questions in order:

1. **What is it?** — a plain description of the piece.
2. **Why does it exist?** — the pressure or acceptance need it addresses, and the reason this model
   assigns it a distinct role.
3. **How does it work?** — the mechanics, in ordinary language.

Wherever autonomy changes the picture, a callout marked **⟐ Under autonomy** flags it, and
**Chapter 12** gathers those threads into one place.

### The chart ladder

<sup>[↪ Why](#r-method-01)</sup>

The charts move from the coarsest view to finer detail and link to related views. The viewer renders
them inline with the prose and provides a ladder for moving between levels.

| Level | Chart | Shows | Chapter |
|---|---|---|---|
| **L0** | The complete circuit | Current pressures → loop → behaviours → properties | [Ch. 1](#1-the-system-at-a-glance) |
| **L1** | The four properties | The model's top-level acceptance properties | [Ch. 2](#2-the-destination-four-properties) |
| **L1** | The bedrock — ten forces | The current hazard taxonomy | [Ch. 3](#3-the-bedrock-why-the-work-is-hard) |
| **L2** | The unit loop, fully staffed | The atom — one feedback loop, and its elements | [Ch. 4](#4-the-atom-the-unit-control-loop) |
| **L2** | The fractal — one shape, every scale | How the loop repeats up and down, and where it stops | [Ch. 6](#6-the-fractal-one-shape-at-every-scale) |
| **L2** | Feature A — rate limiting, every element opened | The fractal made concrete on a graded feature | [Ch. 6](#6-the-fractal-one-shape-at-every-scale) |
| **L3** | Feature A — the reflect beat, opened inward | The fractal driven inward into one beat | [Ch. 6](#6-the-fractal-one-shape-at-every-scale) |
| **L2** | Feature B — password reset, every element opened | The same shape where security forbids skipping | [Ch. 6](#6-the-fractal-one-shape-at-every-scale) |
| **L3** | Feature B — design & verify against an adversary | The two elements a directed adversary re-shapes | [Ch. 6](#6-the-fractal-one-shape-at-every-scale) |
| **L3** | When the loop collapses — is the ceremony a must? | Which ceremony is reducible, and the two overrides | [Ch. 6](#6-the-fractal-one-shape-at-every-scale) |
| **L2** | The lifecycle (process flow) | The familiar lifecycle, as a projection of the loop | [Ch. 7](#7-the-lifecycle-the-process-flow) |
| **L3** | The schedule bet | Why the baseline is gated and the dates are graded | [Ch. 7](#7-the-lifecycle-the-process-flow) |
| **L2** | The two repertoires | Cross-cutting responses: resilience vs. security | [Ch. 8](#8-the-two-repertoires-resilience-and-security) |
| **L3** | Done propagation | How a target is set, inherited, and checked | [Ch. 9](#9-the-mechanism-of-done) |
| **L3** | Design as a bet — stub-composition | How design states and cheaply tests its bet | [Ch. 9](#9-the-mechanism-of-done) |
| **L3** | The premise-B lever | How one interface contract is tuned | [Ch. 9](#9-the-mechanism-of-done) |
| **L2** | The artifacts | Carrier roles and time/agent handoffs | [Ch. 10](#10-what-each-loop-leaves-behind-the-artifacts) |
| **L3** | The change axis — regression & rollback | Retain lessons and limit live-change harm | [Ch. 10](#10-what-each-loop-leaves-behind-the-artifacts) |
| **L3** | Hard gate or graded target? | Which checks are non-negotiable | [Ch. 11](#11-hard-gates-versus-graded-targets) |
| **L3** | The convergent law | Required evidence gated, fidelity graded | [Ch. 11](#11-hard-gates-versus-graded-targets) |
| **L4** | The second-order tier — the delegated/autonomous regime | Delegation risks and their safeguards | [Ch. 12](#12-the-autonomous-agentic-sdlc) |

> **The model's thesis.** Reliable, predictable, resilient, and secure outcomes depend on feedback
> that checks a bounded target against evidence, responds to failure, and carries learning forward.
> The loop can recur at several scales; the needed controls depend on the work unit's risks.
> <sup>[↪ Why](#r-loop-01) · [↪ Why](#r-apex-01)</sup>

---
