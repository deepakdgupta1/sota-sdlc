## 9. The mechanism of Done

<sup>[↪ Why](#r-done-01)</sup>

This is the first deep zoom — *inside a single beat.* Chapter 4 described graded acceptance; Chapter
6 gave each element a target. This chapter shows **how a work unit's target is set, inherited, and
checked** within the current model.

### Origination → propagation → termination

<sup>[↪ Why](#r-unit-01)</sup>

- **Origination (the root).** An accountable work unit has a **boundary** (scope, exclusions, delegated
  authority, and budget) and an **acceptance vector** (targets for `reliable`, `predictable`, `resilient`,
  and `secure`, plus named qualities relevant to the work). `specify` elicits the outcome from intent;
  `scope` records its boundary. Name performance, accessibility, maintainability, privacy, or other
  relevant qualities as criteria with applicable contexts and thresholds. Map each criterion to the
  apex property whose failure it represents (Chapter 2). The root has no parent target to inherit.
  <sup>[↪ Why](#r-apex-03)</sup>
- **Propagation (internal nodes).** `design` decomposes parent target *P* into child targets
  {L₁ … Lₙ}. Each child inherits the boundary constraints and acceptance criteria that apply to its
  part. The projection may add a local check or omit an irrelevant quality; it may not silently relax a
  parent constraint. In short: `Done(part)` is the applicable projection of `Done(parent)`.
- **Termination (the leaf).** Decomposition stops where a target can be checked *without further
  decomposition*. The chosen check modality supplies the acceptance rule. No modality proves that the
  target itself captures the intended outcome. <sup>[↪ Why](#r-done-02)</sup>

| Check modality | Acceptance evidence | Residue and Goodhart surface |
|---|---|---|
| Deterministic | An assertion or test passes for specified cases. | Unchecked cases and a test oracle that encodes the wrong behavior. |
| Statistical | A sampled measure meets a threshold with stated confidence. | Sampling error, distribution shift, and a proxy optimized instead of the outcome. |
| Formal | A proof establishes a property against a formal specification. | Specification or model error; a verifier can be satisfied by a weak specification. |
| Simulated | Runs in a model meet the target across chosen scenarios. | Missing real-world conditions and optimization for the simulator. |
| Human-experiential | People in the intended context judge the experience against stated criteria. | Panel bias, limited contexts, and optimization for the review rather than actual use. |
| Runtime-assured | Live signals and controls keep the outcome within a monitored envelope. | Sensor gaps, delayed intervention, and optimization for the monitored signal. |

One target can use several modalities. State what each check covers and what evidence remains necessary
at the parent acceptance point. <sup>[↪ Why](#r-done-02)</sup>

### Decomposition is a bet — the composition hypothesis

<sup>[↪ Why](#r-done-01)</sup>

To split *P* into parts {Lᵢ} is to *assert* a conjecture:

> **(L₁ ∧ L₂ ∧ … ∧ Lₙ) ⟹ P** — "if every part is done, the whole is done."

This is **not a deduction**; it is a **hypothesis** that `design` makes. Where *P* is qualitative
("feels trustworthy," "is intuitive"), the hypothesis rests on human judgement. So decomposition and
proxy-construction are the *same act*: the conjunction of leaf-targets is a **constructed proxy** for
the parent target, and it inherits every proxy pathology — it can be gamed (Goodhart's law: "all units
pass" is a proxy for "the feature works," and the gap between them is where the bug lives).

**Failure routing.** A composite is done only if its leaves are truly done and the composition
hypothesis holds in the relevant environment. A green check says that a leaf's **oracle passed**;
it does not establish that the leaf met its real target. If parent acceptance fails while all leaf
checks are green, the conjunction of the composition hypothesis, the leaf oracles, and the environment
model is false. `analyze` compares the failed parent outcome with those three assumptions before
`decide` routes the repair. A bad composition or inadequate contracts return to `design`; a weak leaf
oracle returns to `verify` and the affected leaf; an incorrect environment model returns to `observe`
or `specify` for new evidence or a revised target. Record the hypothesis and the evidence so the
diagnosis can distinguish these cases. <sup>[↪ Why](#r-done-03)</sup>

**Shared form, work-unit content.** Elicitation, boundary and acceptance projection, decomposition,
checking, and revision recur at different scales. The actual exclusions, authority, budget, qualities,
thresholds, and proxies depend on the work unit. The root is elicited; internal targets are projected
and refined against it.

> ▸ **Chart — "Done propagation"** <sup>[↪ Why](#r-unit-01)</sup> · *L3 · inside a beat.* Intent becomes a bounded root target;
> `design` decomposes it (each edge a composition hypothesis); the diagram shows deterministic and
> statistical leaves as examples; rejected parent acceptance routes through `analyze` to the failed
> assumption.

```pipeline-graph
{
  "title": "Done propagation",
  "level": "L3 · inside a beat",
  "summary": "The root work unit has a boundary and acceptance vector elicited from intent; design projects applicable constraints into sub-targets; leaves bottom out into checks; rejected acceptance routes back through analysis.",
  "zoomOut": "The unit loop, fully staffed",
  "zoomIn": ["Design as a bet — stub-composition"],
  "nodes": [
    {"id":"intent","label":"hidden intent","group":"stone","x":0,"y":0},
    {"id":"specify","label":"specify · elicit","group":"element","x":0,"y":95},
    {"id":"root","label":"P · boundary + acceptance vector","group":"beat","x":260,"y":95},
    {"id":"design","label":"design · decompose","group":"element","x":260,"y":195},
    {"id":"cA","label":"sub-target A","group":"beat","x":110,"y":300},
    {"id":"cB","label":"sub-target B · qualitative","group":"beat","x":440,"y":300},
    {"id":"accept","label":"parent acceptance fails","group":"terminal","x":700,"y":300},
    {"id":"analyze","label":"analyze failed assumption","group":"element","x":940,"y":300},
    {"id":"verify","label":"repair leaf oracle / verify","group":"element","x":1180,"y":360},
    {"id":"environment","label":"revise environment model","group":"element","x":1180,"y":260},
    {"id":"leaf1","label":"leaf · deterministic","group":"property","x":-20,"y":410},
    {"id":"leaf2","label":"leaf · deterministic","group":"property","x":200,"y":410},
    {"id":"leaf3","label":"leaf · statistical proxy","group":"property","x":440,"y":410}
  ],
  "edges": [
    {"source":"intent","target":"specify","member":true,"label":"elicit"},
    {"source":"specify","target":"root","label":"sets P"},
    {"source":"root","target":"design","label":"decompose"},
    {"source":"design","target":"cA","label":"hyp: (∧Lᵢ)⟹P"},
    {"source":"design","target":"cB","label":"hyp: (∧Lᵢ)⟹P"},
    {"source":"cA","target":"leaf1"},
    {"source":"cA","target":"leaf2"},
    {"source":"cB","target":"leaf3"},
    {"source":"cB","target":"accept","dashed":true,"label":"parent check"},
    {"source":"accept","target":"analyze","dashed":true,"label":"green leaves"},
    {"source":"analyze","target":"design","dashed":true,"label":"composition / contracts"},
    {"source":"analyze","target":"verify","dashed":true,"label":"weak oracle"},
    {"source":"analyze","target":"environment","dashed":true,"label":"wrong environment"}
  ]
}
```

### 9.1 Design as a bet — stub-composition

<sup>[↪ Why](#r-done-01)</sup>

If the composition hypothesis is design's central artifact, then **design is not "draw the structure"
— it is "state and defend a bet"**: a decomposition into components, the **interface contracts** between
them, and the conjecture that they compose to *P*. The valuable property of a bet is that it can be
**refuted cheaply, before the build.**

- **Stub-composition** is how. Replace each component with a **stub** — its interface contract with the
  behaviour deleted (right shape, computes nothing) — and check that the stubs *wire together*. This is
  the `check` beat of the design sub-loop (the fractal again), executed at design time. It is the
  earliest, cheapest place to test the bet.
- **It checks wiring, not the implication.** A green stub-composition shows that the declared contracts
  connect. It does not prove that the contracts are adequate for *P*. The check can refute a bad
  decomposition cheaply, but a pass leaves the design bet conditional.
- **It separates three remaining premises:**
  - **Premise A — the leaves are real** (each stub behaves like the real component). Gather evidence
    at **build time** with `verify` on the real leaf; a unit test can check specified cases, but does
    not prove the full behavior.
  - **Premise B — the contract holds across its *whole* range of inputs.** Property tests sample it
    at build time; `observe` can catch remaining failures at run time. This is one use of a
    *statistical* or *runtime-assured* leaf, not an exhaustive way to check B.
  - **Premise C — the contract set, even if perfectly honoured, delivers *P*.** Review the design
    against the parent acceptance vector, then seek integration and acceptance evidence on the composed
    system. Neither compatible wiring nor green leaf checks establish this premise.
- **Why stubs leave the premises open.** Stubs omit real component behaviour, so they cannot settle A
  or B. Contract compatibility also says nothing about whether the selected contracts express the
  intended whole; that is C. A green stub-check narrows the question to these premises.

> ▸ **Chart — "Design as a bet — stub-composition"** <sup>[↪ Why](#r-done-01)</sup> · *L3 · inside design.* Design states the bet; a
> design-time stub-composition either fails cheap (→ re-decompose) or survives — showing compatible wiring
> while leaving Premise A (→ verify), Premise B (→ input-range evidence at verify and observe), and
> Premise C (→ design review and integration acceptance) open.

```pipeline-graph
{
  "title": "Design as a bet — stub-composition",
  "level": "L3 · inside design",
  "summary": "Design states a bet (contracts + composition hypothesis); stub-composition checks contract compatibility but leaves three premises: A (real leaves → verify), B (input range → verify and observe), and C (contracts deliver P → design review and integration acceptance).",
  "zoomOut": "Done propagation",
  "zoomIn": ["The premise-B lever"],
  "nodes": [
    {"id":"design","label":"design · state the bet","group":"element","x":0,"y":120},
    {"id":"contracts","label":"interface contracts","group":"property","x":250,"y":40},
    {"id":"hyp","label":"composition hyp (∧Lᵢ)⟹P","group":"beat","x":250,"y":200},
    {"id":"stub","label":"stub-composition (design-time check)","group":"element","x":540,"y":120},
    {"id":"fail","label":"fail → re-decompose","group":"terminal","x":540,"y":280},
    {"id":"survive","label":"survive (conditional)","group":"beat","x":830,"y":120},
    {"id":"wiring","label":"compatible wiring only","group":"property","x":1090,"y":20},
    {"id":"premA","label":"Premise A · leaves real","group":"beat","x":1090,"y":120},
    {"id":"premB","label":"Premise B · whole input range","group":"beat","x":1090,"y":230},
    {"id":"premC","label":"Premise C · contracts deliver P","group":"beat","x":1090,"y":340},
    {"id":"verify","label":"verify → leaf evidence","group":"element","x":1400,"y":120},
    {"id":"observe","label":"verify / observe → range evidence","group":"element","x":1400,"y":230},
    {"id":"acceptance","label":"design review + integration acceptance","group":"element","x":1400,"y":340}
  ],
  "edges": [
    {"source":"design","target":"contracts","member":true},
    {"source":"design","target":"hyp","member":true},
    {"source":"hyp","target":"stub","label":"stub it"},
    {"source":"stub","target":"fail","dashed":true,"label":"fails cheap ↺"},
    {"source":"fail","target":"design","dashed":true,"label":"re-decompose"},
    {"source":"stub","target":"survive","label":"green"},
    {"source":"survive","target":"wiring","label":"shows compatibility"},
    {"source":"survive","target":"premA","dashed":true,"label":"suspends"},
    {"source":"survive","target":"premB","dashed":true,"label":"suspends"},
    {"source":"survive","target":"premC","dashed":true,"label":"suspends"},
    {"source":"premA","target":"verify","label":"build-time"},
    {"source":"premB","target":"observe","label":"build / run-time"},
    {"source":"premC","target":"acceptance","label":"whole-system evidence"}
  ]
}
```

### 9.2 The premise-B lever — contract tightness

<sup>[↪ Why](#r-done-04)</sup>

Premise B — "the contract holds across its whole range of inputs" — is **not a fixed cost.** Its *size*
is something `design` **chooses**, by how tightly it draws each interface contract. This is the second
quality bar.

- **A tight contract improves `predictable` at the seam.** A broad input domain leaves more
  combinations to sample and monitor. For a specified input-range check, tightening can move from
  **loose** → too broad to exhaust (sample at `verify` or monitor at `observe`) to **tight** → small
  enough to exhaust at `verify`. Within a typed internal domain, **type encoding** can make invalid
  values unrepresentable; external inputs still need parsing and validation. Exhaustion removes the
  input-range residue only for the specified domain, not the possibility of a wrong contract.
- **The contract governs the *what*, not the *how*.** It constrains a part's observable inputs and
  outputs while leaving its interior free — which is exactly why a stub can stand in for it, and why
  Premises A and B were separable in the first place. This is encapsulation, derived from first
  principles.
- **There is a floor — so the bar is *tightest-sufficient*, not *tightest*.** Tighten past the **set of
  realities the part must actually serve** and the contract rejects a *valid* input the real need
  sends → the part returns the wrong thing (or nothing) on a legitimate case → **`reliable` breaks**
  (and on the adverse-but-valid cases, `resilient` breaks). The contract's range must equal the
  required set of realities as closely as practicable — no needless breadth, no excluded required case.

**So all three point/envelope input-properties re-appear at every seam.** The contract's *floor* (which
realities must cross) is `reliable` (expected) + `resilient` (adverse); the *downward pressure* (how
foreseeably they cross) is `predictable`. The optimum contract is **maximum predictability, subject to
admitting the whole required set of realities.** A good design bet therefore meets three bars: it
**fails cheap** (§9.1), it carries **tightest-sufficient contracts** (§9.2), and the contract set can
deliver the parent acceptance vector (Premise C).

> ▸ **Chart — "The premise-B lever"** <sup>[↪ Why](#r-done-04)</sup> · *L3 · inside a contract.* Tightening
> can move an input-range check from sampled to exhaustive, or exclude invalid internal values by
> type. The floor is the required set of realities (`reliable` + `resilient`); checks still depend on
> the contract being right.

```pipeline-graph
{
  "title": "The premise-B lever",
  "level": "L3 · inside a contract",
  "summary": "Tightening a specified input domain can move checks from sampled to exhaustive; internal types can exclude invalid values. Admit every required reality, validate external inputs, and retain checks for specification and composition error.",
  "zoomOut": "Design as a bet — stub-composition",
  "nodes": [
    {"id":"loose","label":"loose contract","group":"property","x":0,"y":0},
    {"id":"tsuff","label":"tightest-sufficient · THE BAR","group":"beat","x":330,"y":0},
    {"id":"over","label":"over-tight","group":"terminal","x":660,"y":0},
    {"id":"stat","label":"sample / monitor broad input domain","group":"element","x":0,"y":140},
    {"id":"det","label":"exhaust specified domain / encode internal type","group":"element","x":330,"y":140},
    {"id":"unrel","label":"rejects a required reality → UNRELIABLE","group":"stone","x":660,"y":140},
    {"id":"floor","label":"FLOOR = required set of realities (reliable + resilient)","group":"stone","x":330,"y":260},
    {"id":"pred","label":"tightening buys predictable · premise B ↓","group":"property","x":330,"y":-120}
  ],
  "edges": [
    {"source":"loose","target":"tsuff","member":true,"label":"tighten →"},
    {"source":"tsuff","target":"over","member":true,"dashed":true,"label":"one step too far"},
    {"source":"loose","target":"stat","label":"sampled"},
    {"source":"tsuff","target":"det","label":"exhausted / unrepresentable"},
    {"source":"over","target":"unrel","dashed":true},
    {"source":"tsuff","target":"pred","dashed":true,"label":"max predictability…"},
    {"source":"tsuff","target":"floor","member":true,"label":"…subject to the floor"},
    {"source":"over","target":"floor","dashed":true,"label":"breaches floor"}
  ]
}
```

### 9.3 Security recurses at every seam — the forbidden-output wall

<sup>[↪ Why](#r-gate-01)</sup>

The relevant input requirements re-appear at each seam as a **floor** (which realities *must* cross).
`secure` adds an output constraint: forbid outputs that the work unit's acceptance vector excludes.
The parent boundary and acceptance vector identify which constraints apply to each seam.

The consequence is sharp: a design can be insecure *no matter how correctly each leaf is built.* The
classic example: store a credential in a repository's `.env` file and add it to `.gitignore`. Every
leaf check is green — the reader works, and git really does exclude the file — yet the whole leaks the instant
an un-modelled exit opens (a full-disk backup syncing the working tree to the cloud). The forbidden
output (a secret readable at rest, off-box) is *reachable*. Here `analyze` finds that the design omitted
the backup path, so `decide` returns to `design` to move the secret to the keychain. Green checks alone
would not establish that the leaves met the parent target.

**Why the security check recurs.** A directed adversary can search for the least-defended relevant
seam. At each named seam, gate the binary question: **is a forbidden output reachable under the stated
threat model?** A reachable forbidden output blocks acceptance. Defence depth, coverage, and posture
remain graded targets. This gives `secure` a checkable gate without treating the whole property as one
unmeasurable pass/fail assertion (Chapter 11).

---
