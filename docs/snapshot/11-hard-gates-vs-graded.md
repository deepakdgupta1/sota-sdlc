## 11. Hard gates versus graded targets

<sup>[↪ Why](#r-gate-01)</sup>

**What it is.** Most targets are **graded**: `check` measures how well the work did on a quality range,
and `decide` can accept a known gap. A **hard gate** removes that local *accept* exit: the work unit
cannot waive a violation or trade it against quality elsewhere. Only the authority that imposed an
external gate can change that gate.

**Why some checks earn a gate.** There are two independent sources. The model requires a gate when one
violation has **non-local** effects. A law, contract, or other authority outside the work unit can also
impose a gate, even when the local effects are bounded. External authority is a source of obligation,
not a fourth harm amplifier. Three amplifiers establish the model-derived case:

1. **Adversarial (stone #8).** A directed optimiser searches for a reachable forbidden output at a
   relevant seam. Gate that reachability result; grade defence depth and posture (§9.3).
2. **Irreversible.** The damage escapes `recover` and `roll back` — data loss; a *leaked* secret cannot
   be un-leaked. The run-time repertoire can't undo it after the fact.
3. **Machinery-degrading.** The violation blinds the loop's own `check`/`observe`, or couples parts so
   one corrupts another: a swallowed error (no signal), an un-instrumented call (no telemetry), a test
   retrofitted after the code (can't actually falsify), a mutation that couples shared state. This is
   non-local *by construction* — it disables the very thing that would have caught it.

**The classification rule.** First, ask whether an outside authority imposes the constraint. Then ask
whether one violation is non-local: adversary-amplified, irreversible, or machinery-degrading. Either
answer can require a hard gate. If the blast radius is unknown, classify it as non-local until evidence
bounds it. When no authority imposes a gate and the violation is demonstrably local and recoverable,
keep a graded target. Gate a per-seam binary, such as forbidden-output reachability; grade aggregate
coverage, defence depth, and posture. A graded proxy turned into a gate, such as an 80% coverage bar,
invites gaming. The gate decision follows its source and the effect of one violation, not its perceived
importance.

> ▸ **Chart — "Hard gate or graded target?"** <sup>[↪ Why](#r-gate-01)</sup> · *L3 · gating overlay.* Outside authority
> or a non-local violation can require a gate. Unknown blast radius is provisionally non-local.

```pipeline-graph
{
  "title": "Hard gate or graded target?",
  "level": "L3 · gating overlay",
  "summary": "A gate can come from outside authority or from a non-local violation. Three amplifiers make harm non-local; unknown blast radius is provisionally non-local. Bounded local gaps remain graded unless outside authority imposes a gate.",
  "zoomOut": "The unit loop, fully staffed",
  "zoomIn": ["The convergent law"],
  "nodes": [
    {"id":"leaf","label":"candidate constraint","group":"beat","x":320,"y":0},
    {"id":"q","label":"one violation NON-LOCAL?","group":"terminal","x":240,"y":100},
    {"id":"authority","label":"outside authority imposes gate?","group":"terminal","x":700,"y":100},
    {"id":"adv","label":"adversary-amplified (#8)","group":"stone","x":0,"y":220},
    {"id":"irr","label":"irreversible (escapes recover/rollback)","group":"stone","x":250,"y":220},
    {"id":"mach","label":"machinery-degrading (blinds check/observe)","group":"stone","x":500,"y":220},
    {"id":"unknown","label":"blast radius unknown → non-local for now","group":"stone","x":800,"y":220},
    {"id":"gate","label":"HARD GATE — no local accept","group":"property","x":300,"y":360},
    {"id":"grade","label":"GRADED TARGET — keep discretion","group":"element","x":700,"y":360}
  ],
  "edges": [
    {"source":"leaf","target":"q"},
    {"source":"leaf","target":"authority"},
    {"source":"authority","target":"gate","label":"imposed"},
    {"source":"q","target":"adv","dashed":true,"label":"yes, via"},
    {"source":"q","target":"irr","dashed":true,"label":"yes, via"},
    {"source":"q","target":"mach","dashed":true,"label":"yes, via"},
    {"source":"q","target":"unknown","dashed":true,"label":"unbounded"},
    {"source":"adv","target":"gate"},
    {"source":"irr","target":"gate"},
    {"source":"mach","target":"gate"},
    {"source":"unknown","target":"gate","label":"provisional"},
    {"source":"q","target":"grade","label":"bounded local"}
  ]
}
```

### 11.1 How much observability is enough? — the silent-failure gate

<sup>[↪ Why](#r-gate-02)</sup> <sup>[↪ Why `observe` is forced](#r-loop-03)</sup>

Chapter 5 forced `observe` to **own a sensor at all** (the loop may not outsource detection to
whoever gets hurt). But *how much* to instrument is a separate question, and it has a precise answer:
**run the predictive rule above with one substitution — classify not "this path fails" but "this path
fails *and emits nothing*."** A seam's instrumentation is a hard gate when its silent failure is
non-local or outside authority requires evidence. Non-local harm follows the same three amplifiers:

- **Irreversible seams.** An unseen loss *compounds while unseen* — detection latency is the only
  thing bounding it, so the sensor is the sole lever between the first unit of loss and an unbounded
  one.
- **Adversarial seams.** A security-relevant signal — authentication, privileged action, a trust
  boundary — inherits `secure`'s every-seam wall (§9.3): the blind spot *is* the attack surface.
- **Machinery seams.** A path carrying the loop's *own* control signal — sensor health, gate firings,
  escalation triggers. Its silent failure blinds the loop *to its own blindness*.

Where neither non-local risk nor outside authority requires a gate, coverage stays **graded** in
proportion to `P(silent failure) × cost`. It can collapse to zero on a fully-modelled, reversible,
local path (§6.4's collapse rule, applied to instrumentation).

**Telemetry follows the detection requirement.** An ADR records a design decision; telemetry tests
whether current behavior still matches the model. That requires observation over time, but does not
force continuous emission on every path. Each named seam gate defines the signal and detection latency
it needs. Sampling and aggregation are acceptable only when they preserve that requirement. Other
paths use coverage proportional to risk, including zero where the collapse rule applies.

Debug records support diagnosis. Their policy specifies sampling, redaction, collection and storage
cost limits, and retention. Audit records preserve the evidence needed to reconstruct accountable
actions and decisions. Their policy specifies required events, provenance, integrity protection,
access, redaction, and retention. A sampled debug log does not substitute for a required audit event.
Redaction must preserve the evidence the gate needs. If a cost limit or retention policy would remove
required evidence, the gate is unmet until the conflict is resolved; dropping records cannot silently
waive it.

**Gate the per-seam binary; never gate the aggregate.** A coverage percentage is a Goodhartable proxy
for the true target — "can we actually *detect the residue* when it surfaces?" — and the two come
apart three ways: the signal can be *wrong* (a log that says "entered function," not "output correct
for intent"), *unmonitored* (emitted, but nothing alerts — a log nobody reads is stone #7 again), or
*drowned* (alert fatigue). Worse, gating "≥ 90% coverage" diverts effort to the *cheap* paths and
starves exactly the residue-bearing seams the rule says to gate. So gates attach to **named seams** —
"does seam *S* provide its required signal within its detection bound?" The check tests that contract,
including monitoring and loss detection; it does not promise detection of every unknown failure.
The roll-up stays a graded target.

### 11.2 The convergent law — existence is gated, fidelity is graded

<sup>[↪ Why](#r-gate-03)</sup>

Four derivations in this document were run independently, and they all landed on the **same shape**.
These are artifact classes; an accountable work unit needs the ones its target and risks require:

| Artifact | Serves | Its absence… | Its fidelity… |
|---|---|---|---|
| **ADR / post-mortem** (Ch. 10) | `reliable` — the loop can explain and not repeat | starves `analyze`, unfeeds evolve → **hard gate** | accuracy/depth — graded |
| **Telemetry** (§11.1) | `observe` — the loop's senses | blinds the loop, outsources detection to the user → **hard gate** | coverage — graded, gated per-seam |
| **Regression suite** (§10.1) | `resilient` — fixes stick over time | deletes the loop's memory-of-fixes → **hard gate** | coverage — graded |
| **Plan baseline** (§7.1) | `predictable` — a slip is detectable | makes "late" undetectable → **hard gate** | the dates — a graded forecast |

The law applies **at the accountable work unit**, not at every nested loop. For each artifact that
the work unit needs, existence is gated and fidelity is graded. A shared artifact can satisfy the gate
for several inner loops when it preserves their required evidence and identifies the accountable unit.
The unit must retain an intended operand that `analyze` can compare with the result; if none exists,
the correcting loop is blind. Fidelity follows residual risk because gating a quality proxy invites
gaming (§11.1's coverage argument, §7.1's date argument). A named seam gate still applies at its seam,
even if an inner loop collapses (§6.4). <sup>[↪ Why](#r-gate-04)</sup>

> **plan : predictable  ::  ADR : reliable  ::  regression : resilient  ::  telemetry : observe.**

Required evidence must exist at the accountable work unit; its quality is priced by risk.

> ▸ **Chart — "The convergent law"** <sup>[↪ Why](#r-gate-03)</sup> · *L3 · one law, four instances.* Four independently-derived
> artifacts, one shape at an accountable work unit: existence feeds the hard-gate band (absence is machinery-degrading); fidelity
> feeds the graded band (a Goodhartable proxy, priced by residual risk).

```pipeline-graph
{
  "title": "The convergent law",
  "level": "L3 · one law, four instances",
  "summary": "At an accountable work unit, each required artifact must exist. The ADR (reliable), telemetry (observe), regression suite (resilient), and plan baseline (predictable) illustrate the rule. Their accuracy, coverage, and content remain graded. Inner loops may share evidence; named seam gates remain at the seam.",
  "zoomOut": "Hard gate or graded target?",
  "zoomIn": ["The second-order tier — the delegated/autonomous regime"],
  "nodes": [
    {"id":"exist","label":"REQUIRED EVIDENCE at accountable unit — hard gate","group":"property","x":460,"y":0},
    {"id":"adr","label":"ADR + post-mortem → reliable","group":"element","x":0,"y":150},
    {"id":"telemetry","label":"telemetry → observe (the senses)","group":"element","x":320,"y":150},
    {"id":"regression","label":"regression suite → resilient","group":"element","x":640,"y":150},
    {"id":"plan","label":"plan baseline → predictable","group":"element","x":960,"y":150},
    {"id":"fidelity","label":"FIDELITY / COVERAGE / CONTENT — graded, Goodhartable proxy","group":"stone","x":460,"y":300}
  ],
  "edges": [
    {"source":"adr","target":"exist","label":"must exist"},
    {"source":"telemetry","target":"exist","label":"must exist"},
    {"source":"regression","target":"exist","label":"must exist"},
    {"source":"plan","target":"exist","label":"must exist"},
    {"source":"adr","target":"fidelity","dashed":true,"label":"accuracy"},
    {"source":"telemetry","target":"fidelity","dashed":true,"label":"coverage (per-seam gates, §11.1)"},
    {"source":"regression","target":"fidelity","dashed":true,"label":"coverage"},
    {"source":"plan","target":"fidelity","dashed":true,"label":"the dates"}
  ]
}
```

> **⟐ Under autonomy.** Two of the hard gates the ideal SDLC insists on — a *written* reflect-artifact
> (Chapter 10) and a real `observe` sensor of the loop's own (Chapter 5) — are gates precisely because
> skipping them is *machinery-degrading*. An autonomous pipeline that skips them doesn't just lose a
> document or a dashboard; it silently demotes `define → do → check → reflect` to `define → do → check`
> — a loop that can *detect* failure but neither *explain* it nor *prevent its recurrence.* The
> convergent law (§11.2) widens this to all four intended-operands — ADR, telemetry, regression suite,
> plan baseline: a cost-optimising executor will be tempted to collapse exactly these four
> existence-gates, and each one is machinery, not ceremony.

---
