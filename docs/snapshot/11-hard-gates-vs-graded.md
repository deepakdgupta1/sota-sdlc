## 11. Hard gates versus graded targets

<sup>[↪ Why](#r-gate-01)</sup>

**What it is.** Most targets are **graded**: `check` measures how well the work did on a quality range,
and `decide` retains discretion — it can *accept* a known gap. A **hard gate** is a leaf where the
*accept* exit is **deleted**: a single violation blocks, full stop, no amount of quality elsewhere buys
it back.

**Why some checks earn a gate and most don't.** The rule is precise: a leaf becomes a hard gate **iff a
single violation is *non-local*** — no amount of green elsewhere can compensate. Three amplifiers make a
violation non-local:

1. **Adversarial (stone #8).** A directed optimiser turns *any* hole into a whole compromise. This
   amplification is *guaranteed*, which is why **all of `secure` is hard, wholesale** (§9.3).
2. **Irreversible.** The damage escapes `recover` and `roll back` — data loss; a *leaked* secret cannot
   be un-leaked. The run-time repertoire can't undo it after the fact.
3. **Machinery-degrading.** The violation blinds the loop's own `check`/`observe`, or couples parts so
   one corrupts another: a swallowed error (no signal), an un-instrumented call (no telemetry), a test
   retrofitted after the code (can't actually falsify), a mutation that couples shared state. This is
   non-local *by construction* — it disables the very thing that would have caught it.

**The predictive rule.** To classify *any* candidate constraint, ask one question: **"Is a single
violation non-local — adversary-amplified, irreversible, or does it blind the loop?"** *Yes* → hard gate
(delete `accept`). *No* → graded target (keep `decide`'s discretion). Two corollaries fall out: a
*graded proxy* wrongly declared a gate (say, an 80%-coverage bar — a statistical-leaf proxy) invites
gaming; and a hard gate with *no* amplifier behind it is mis-typed. Non-compensability — not
"importance" — is what makes a rule a gate.

> ▸ **Chart — "Hard gate or graded target?"** <sup>[↪ Why](#r-gate-01)</sup> · *L3 · gating overlay.* One decision node: is a single
> violation non-local? Three amplifiers route to *hard gate*; their absence routes to *graded target*.

```pipeline-graph
{
  "title": "Hard gate or graded target?",
  "level": "L3 · gating overlay",
  "summary": "A leaf becomes a non-waivable hard gate iff a single violation is non-local — via one of three amplifiers (adversarial, irreversible, machinery-degrading). Otherwise it stays a graded target.",
  "zoomOut": "The unit loop, fully staffed",
  "zoomIn": ["The convergent law"],
  "nodes": [
    {"id":"leaf","label":"a candidate constraint (leaf check)","group":"beat","x":320,"y":0},
    {"id":"q","label":"is a single violation NON-LOCAL?","group":"terminal","x":320,"y":100},
    {"id":"adv","label":"adversary-amplified (#8)","group":"stone","x":0,"y":220},
    {"id":"irr","label":"irreversible (escapes recover/rollback)","group":"stone","x":300,"y":220},
    {"id":"mach","label":"machinery-degrading (blinds check/observe)","group":"stone","x":640,"y":220},
    {"id":"gate","label":"HARD GATE — delete 'accept'","group":"property","x":180,"y":340},
    {"id":"grade","label":"GRADED TARGET — keep discretion","group":"element","x":560,"y":340}
  ],
  "edges": [
    {"source":"leaf","target":"q"},
    {"source":"q","target":"adv","dashed":true,"label":"yes, via"},
    {"source":"q","target":"irr","dashed":true,"label":"yes, via"},
    {"source":"q","target":"mach","dashed":true,"label":"yes, via"},
    {"source":"adv","target":"gate"},
    {"source":"irr","target":"gate"},
    {"source":"mach","target":"gate"},
    {"source":"q","target":"grade","label":"no amplifier"}
  ]
}
```

### 11.1 How much observability is enough? — the silent-failure gate

<sup>[↪ Why](#r-gate-02)</sup> <sup>[↪ Why `observe` is forced](#r-loop-03)</sup>

Chapter 5 forced `observe` to **own a sensor at all** (the loop may not outsource detection to
whoever gets hurt). But *how much* to instrument is a separate question, and it has a precise answer:
**run the predictive rule above with one substitution — classify not "this path fails" but "this path
fails *and emits nothing*."** A seam's instrumentation is a hard gate **iff its *silent* failure is
non-local**, through the same three amplifiers:

- **Irreversible seams.** An unseen loss *compounds while unseen* — detection latency is the only
  thing bounding it, so the sensor is the sole lever between the first unit of loss and an unbounded
  one.
- **Adversarial seams.** A security-relevant signal — authentication, privileged action, a trust
  boundary — inherits `secure`'s every-seam wall (§9.3): the blind spot *is* the attack surface.
- **Machinery seams.** A path carrying the loop's *own* control signal — sensor health, gate firings,
  escalation triggers. Its silent failure blinds the loop *to its own blindness*.

Everything else stays **graded**: coverage in proportion to `P(silent failure) × cost`, collapsible to
zero on a fully-modelled, reversible, local path (§6.4's collapse rule, applied to instrumentation).

**Why telemetry never stops emitting while the ADR is written once.** The emission character of each
forced artifact follows the *temporal type of the fact it carries*. The ADR carries a **static
point-fact** — the design bet, true or false at one moment; capture it once and it holds forever. What
telemetry carries is a **dynamic envelope-fact** — "does reality *still* match the model?" — which
change and uncertainty (#5/#6) regenerate on every execution, at locations unknowable in advance
(that is what *a-posteriori* means). So telemetry is forced to be **continuous and every-seam**: each
un-instrumented path is a *standing* blind spot, re-exposed on every run. It wears `secure`'s
every-seam *form* for a different *reason* — no hunter, just residue landing wherever you didn't
model — which is why it stays graded across most seams and collapses to `secure`'s wholesale wall only
at the adversarial ones.

**Gate the per-seam binary; never gate the aggregate.** A coverage percentage is a Goodhartable proxy
for the true target — "can we actually *detect the residue* when it surfaces?" — and the two come
apart three ways: the signal can be *wrong* (a log that says "entered function," not "output correct
for intent"), *unmonitored* (emitted, but nothing alerts — a log nobody reads is stone #7 again), or
*drowned* (alert fatigue). Worse, gating "≥ 90% coverage" diverts effort to the *cheap* paths and
starves exactly the residue-bearing seams the rule says to gate. So gates attach to **named seams** —
"does seam *S* emit detector-grade signal σ?", a binary, deterministic fact — while the roll-up stays
a graded target.

### 11.2 The convergent law — existence is gated, fidelity is graded

<sup>[↪ Why](#r-gate-03)</sup>

Four derivations in this document were run independently, and they all landed on the **same shape**:

| Artifact | Serves | Its absence… | Its fidelity… |
|---|---|---|---|
| **ADR / post-mortem** (Ch. 10) | `reliable` — the loop can explain and not repeat | starves `analyze`, unfeeds evolve → **hard gate** | accuracy/depth — graded |
| **Telemetry** (§11.1) | `observe` — the loop's senses | blinds the loop, outsources detection to the user → **hard gate** | coverage — graded, gated per-seam |
| **Regression suite** (§10.1) | `resilient` — fixes stick over time | deletes the loop's memory-of-fixes → **hard gate** | coverage — graded |
| **Plan baseline** (§7.1) | `predictable` — a slip is detectable | makes "late" undetectable → **hard gate** | the dates — a graded forecast |

The law: **every forced artifact is existence-hard and fidelity-graded.** The intended-operand that
`analyze` must later compare against has to **exist** — its absence doesn't lose one datum, it
disables the loop's own correcting machinery, which is the machinery-degrading amplifier every time —
but it need only be **as accurate as the residual risk warrants**, because fidelity is a Goodhartable
proxy and hard-gating a proxy invites gaming (§11.1's coverage argument, §7.1's date argument).

> **plan : predictable  ::  ADR : reliable  ::  regression : resilient  ::  telemetry : observe.**

This is the cleanest one-line compression of Chapters 7–11: *what the loop must write down is
non-negotiable; how well it writes it down is priced by risk.*

> ▸ **Chart — "The convergent law"** <sup>[↪ Why](#r-gate-03)</sup> · *L3 · one law, four instances.* Four independently-derived
> artifacts, one shape: existence feeds the hard-gate band (absence is machinery-degrading); fidelity
> feeds the graded band (a Goodhartable proxy, priced by residual risk).

```pipeline-graph
{
  "title": "The convergent law",
  "level": "L3 · one law, four instances",
  "summary": "Every forced artifact is existence-hard, fidelity-graded: the ADR (reliable), telemetry (observe), the regression suite (resilient), and the plan baseline (predictable) must exist — absence is machinery-degrading — while their accuracy/coverage/content stays a graded, Goodhartable proxy.",
  "zoomOut": "Hard gate or graded target?",
  "zoomIn": ["The second-order tier — the delegated/autonomous regime"],
  "nodes": [
    {"id":"exist","label":"EXISTENCE — hard gate · absence blinds the loop's own machinery","group":"property","x":460,"y":0},
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

