## 9. The mechanism of Done

This is the first deep zoom — *inside a single beat.* Chapter 4 said a "done" is a graded threshold,
not a yes/no; Chapter 6 said every element carries its own target. This chapter shows **how that target
is actually set, inherited, and checked** — and why the mechanism is the same regardless of what
software you are building.

### Origination → propagation → termination

- **Origination (the root).** The top-level "done" has no parent to inherit from. It is **elicited from
  hidden intent by `specify`** (stone #1). This is the one *contingent seed* of the whole tree — it
  cannot be derived, only drawn out.
- **Propagation (internal nodes).** `design` decomposes a parent target *P* into child targets
  {L₁ … Lₙ}, one per part, each cast on the same **four-axis schema** — *scope · reliable · resilient ·
  predictable* — that the top-level target used. The schema is scale-invariant, so every node's target
  has the same shape. In short: `Done(part) = Done(parent), projected onto this part's slice.`
- **Termination (the leaf).** Decomposition stops where a target can be checked *without further
  decomposition* — where `check` yields a genuine yes/no. There are two kinds of leaf:
  - a **deterministic** leaf (logic → an assertion or unit test — passes or fails), and
  - a **statistical** leaf (an irreducible proxy → a threshold on a sampled value: "done with
    confidence ≥ c"). The statistical leaf is where uncertainty and change (stones #5, #6) keep the
    check from ever being perfectly deterministic.

### Decomposition is a bet — the composition hypothesis

To split *P* into parts {Lᵢ} is to *assert* a conjecture:

> **(L₁ ∧ L₂ ∧ … ∧ Lₙ) ⟹ P** — "if every part is done, the whole is done."

This is **not a deduction**; it is a **hypothesis** that `design` makes. Where *P* is qualitative
("feels trustworthy," "is intuitive"), the hypothesis rests on human judgement. So decomposition and
proxy-construction are the *same act*: the conjunction of leaf-targets is a **constructed proxy** for
the parent target, and it inherits every proxy pathology — it can be gamed (Goodhart's law: "all units
pass" is a proxy for "the feature works," and the gap between them is where the bug lives).

**Failure routing.** A composite is done only if (a) its leaves pass *and* (b) the composition
hypothesis holds. If a composite **fails acceptance while all its leaves are green**, the parts kept
their promises but the whole did not — so the **composition hypothesis is falsified**. `analyze`
root-causes to *that hypothesis*, and `decide` **re-targets `design`** to re-decompose — *not* the
leaves. This is "non-convergence points at the target" (Chapter 4), now localised precisely to the
decomposition. To trace such a failure back, the hypothesis must be *written down* — which is why the
design artifact exists (Chapter 10).

**Universal form, contingent content.** The *form* — the four-axis schema, elicit-root → decompose →
bottom-out, the composition-hypothesis structure, the failure-routing rule — is universal, forced by
the stones. The *content* — the specific thresholds, which proxies, which decomposition to bet on — is
contingent. Only the root is elicited; every internal target is derived. This is why "done" generalises
across any software.

> ▸ **Chart — "Done propagation"** · *L3 · inside a beat.* Intent is elicited into a root target;
> `design` decomposes it (each edge a composition hypothesis); leaves bottom out into deterministic or
> statistical checks; a rejected qualitative composite falsifies the hypothesis and routes back to
> `design`.

```pipeline-graph
{
  "title": "Done propagation",
  "level": "L3 · inside a beat",
  "summary": "The root target is elicited from intent; design decomposes it into sub-targets (each edge a composition hypothesis); leaves bottom out into binary checks; a green-leaves-but-rejected composite falsifies the hypothesis and re-targets design.",
  "zoomOut": "The unit loop, fully staffed",
  "zoomIn": ["Design as a bet — stub-composition"],
  "nodes": [
    {"id":"intent","label":"hidden intent","group":"stone","x":0,"y":0},
    {"id":"specify","label":"specify · elicit","group":"element","x":0,"y":95},
    {"id":"root","label":"root target P","group":"beat","x":260,"y":95},
    {"id":"design","label":"design · decompose","group":"element","x":260,"y":195},
    {"id":"cA","label":"sub-target A","group":"beat","x":110,"y":300},
    {"id":"cB","label":"sub-target B · qualitative","group":"beat","x":440,"y":300},
    {"id":"accept","label":"human accept","group":"terminal","x":700,"y":300},
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
    {"source":"cB","target":"accept","dashed":true,"label":"qualitative → human"},
    {"source":"accept","target":"design","dashed":true,"label":"falsified → re-decompose ↺"}
  ]
}
```

### 9.1 Design as a bet — stub-composition

If the composition hypothesis is design's central artifact, then **design is not "draw the structure"
— it is "state and defend a bet"**: a decomposition into components, the **interface contracts** between
them, and the conjecture that they compose to *P*. The valuable property of a bet is that it can be
**refuted cheaply, before the build.**

- **Stub-composition** is how. Replace each component with a **stub** — its interface contract with the
  behaviour deleted (right shape, computes nothing) — and check that the stubs *wire together*. This is
  the `check` beat of the design sub-loop (the fractal again), executed at design time. It is the
  earliest, cheapest place to test the bet.
- **It discharges the arrow, suspends the premises.** A green stub-composition proves only the **⟹** —
  that the contracts are mutually coherent (what A emits is what B accepts, across the graph). It is
  one-sided: it can **fail cheap** (kill a bad decomposition) or **survive**, but it never *confirms*.
- **It factors risk; it does not remove it.** After a green stub-check, provably *zero* design risk
  lives in the wiring, and all of it has been relocated into two named, attackable premises:
  - **Premise A — the leaves are real** (each stub behaves like the real component). Discharged at
    **build time** by `verify` (a unit test on the real leaf) → the *deterministic* leaf.
  - **Premise B — the contract holds across its *whole* range of inputs.** Only *sampled* at build
    (property tests); the residue is caught at **run time** by `observe` (telemetry) → the *statistical*
    leaf.
- **Why it reaches neither premise.** A stub is a proxy for a component that does not exist yet, and
  both premises are claims about *behaviour* — the one thing a stub deletes. So neither becomes a fact
  until the real thing is built and run. That is the single reason design-time checking cannot close
  them; it can only *name* and *route* them.

> ▸ **Chart — "Design as a bet — stub-composition"** · *L3 · inside design.* Design states the bet; a
> design-time stub-composition either fails cheap (→ re-decompose) or survives — discharging the wiring
> and suspending Premise A (→ verify) and Premise B (→ observe).

```pipeline-graph
{
  "title": "Design as a bet — stub-composition",
  "level": "L3 · inside design",
  "summary": "Design states a bet (contracts + composition hypothesis); a cheap design-time stub-composition discharges the wiring and factors the remaining risk into Premise A (leaves real → verify) and Premise B (whole input range → observe).",
  "zoomOut": "Done propagation",
  "zoomIn": ["The premise-B lever"],
  "nodes": [
    {"id":"design","label":"design · state the bet","group":"element","x":0,"y":120},
    {"id":"contracts","label":"interface contracts","group":"property","x":250,"y":40},
    {"id":"hyp","label":"composition hyp (∧Lᵢ)⟹P","group":"beat","x":250,"y":200},
    {"id":"stub","label":"stub-composition (design-time check)","group":"element","x":540,"y":120},
    {"id":"fail","label":"fail → re-decompose","group":"terminal","x":540,"y":280},
    {"id":"survive","label":"survive (conditional)","group":"beat","x":830,"y":120},
    {"id":"wiring","label":"⟹ wiring · discharged","group":"property","x":1090,"y":20},
    {"id":"premA","label":"Premise A · leaves real","group":"beat","x":1090,"y":120},
    {"id":"premB","label":"Premise B · whole input range","group":"beat","x":1090,"y":230},
    {"id":"verify","label":"verify → deterministic leaf","group":"element","x":1400,"y":120},
    {"id":"observe","label":"observe → statistical leaf","group":"element","x":1400,"y":230}
  ],
  "edges": [
    {"source":"design","target":"contracts","member":true},
    {"source":"design","target":"hyp","member":true},
    {"source":"hyp","target":"stub","label":"stub it"},
    {"source":"stub","target":"fail","dashed":true,"label":"fails cheap ↺"},
    {"source":"fail","target":"design","dashed":true,"label":"re-decompose"},
    {"source":"stub","target":"survive","label":"green"},
    {"source":"survive","target":"wiring","label":"discharges ⟹"},
    {"source":"survive","target":"premA","dashed":true,"label":"suspends"},
    {"source":"survive","target":"premB","dashed":true,"label":"suspends"},
    {"source":"premA","target":"verify","label":"build-time"},
    {"source":"premB","target":"observe","label":"run-time"}
  ]
}
```

### 9.2 The premise-B lever — the two quality bars of a good bet

Premise B — "the contract holds across its whole range of inputs" — is **not a fixed cost.** Its *size*
is something `design` **chooses**, by how tightly it draws each interface contract. This is the second
quality bar.

- **A tight contract manufactures `predictable` at the seam.** Premise B's residue *is* the
  unpredictability at an interface (the unforeseen input combinations). Tightening dials that residue
  down through the leaf-kinds: **loose** → a range too big to exhaust (a *statistical* leaf, sampled at
  `observe`, residue > 0); **tight** → a range small enough to exhaust (a *deterministic* leaf at
  `verify`, residue → 0); **type-encoded** → illegal values can't even be *constructed* (discharged at
  compile time, never reaching run time).
- **The contract governs the *what*, not the *how*.** It constrains a part's observable inputs and
  outputs while leaving its interior free — which is exactly why a stub can stand in for it, and why
  Premises A and B were separable in the first place. This is encapsulation, derived from first
  principles.
- **There is a floor — so the bar is *tightest-sufficient*, not *tightest*.** Tighten past the **set of
  realities the part must actually serve** and the contract rejects a *valid* input the real need
  sends → the part returns the wrong thing (or nothing) on a legitimate case → **`reliable` breaks**
  (and on the adverse-but-valid cases, `resilient` breaks). The contract's range must equal the
  required set of realities — no wider (needless residue), no narrower (excluded reality).

**So all three point/envelope input-properties re-appear at every seam.** The contract's *floor* (which
realities must cross) is `reliable` (expected) + `resilient` (adverse); the *downward pressure* (how
foreseeably they cross) is `predictable`. The optimum contract is **maximum predictability, subject to
admitting the whole required set of realities.** A good design bet therefore meets two bars: (1) it
**fails cheap** (§9.1), and (2) it carries **tightest-sufficient contracts** (§9.2).

> ▸ **Chart — "The premise-B lever"** · *L3 · inside a contract.* Contract-tightness is a dial:
> tightening buys `predictable` and moves residue from statistical → deterministic → compile-time, but
> the floor is the required set of realities (`reliable` + `resilient`). One step past the floor and
> the contract rejects a valid input.

```pipeline-graph
{
  "title": "The premise-B lever",
  "level": "L3 · inside a contract",
  "summary": "Contract-tightness is a dial that shrinks Premise B (buying predictability, moving residue statistical → deterministic → compile-time), but the floor is the required set of realities. The bar is tightest-sufficient, not tightest.",
  "zoomOut": "Design as a bet — stub-composition",
  "nodes": [
    {"id":"loose","label":"loose contract","group":"property","x":0,"y":0},
    {"id":"tsuff","label":"tightest-sufficient · THE BAR","group":"beat","x":330,"y":0},
    {"id":"over","label":"over-tight","group":"terminal","x":660,"y":0},
    {"id":"stat","label":"statistical leaf → observe (residue > 0)","group":"element","x":0,"y":140},
    {"id":"det","label":"deterministic / compile-time leaf → verify (residue → 0)","group":"element","x":330,"y":140},
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

The three input-properties re-appear at every seam as a **floor** (which realities *must* cross).
`secure` re-appears too, as the **complement on the output side**: not "admit the whole required input
set" but "**forbid the whole illegal output set**" — a wall, dual to the floor. So every seam's target
is **four**-axed.

The consequence is sharp: a design can be insecure *no matter how correctly each leaf is built.* The
classic example: store a credential in a repository's `.env` file and add it to `.gitignore`. Every
leaf is green — the reader works, and git really does exclude the file — yet the whole leaks the instant
an un-modelled exit opens (a full-disk backup syncing the working tree to the cloud). The forbidden
output (a secret readable at rest, off-box) is *reachable*, so the security composition hypothesis is
falsified **with green leaves** → root-cause to the *decomposition* → re-target `design` (move the
secret to the keychain).

**Why security is forced at every seam, harder than the other three.** A directed adversary enters at
the *least-defended* seam, so the security of the whole is the **weakest link**, not the average. One
undefended stage is not a local weakness — it is the whole envelope's hole, because the attacker *finds*
it and pivots. So `secure` cannot be defended "mostly": it holds at every seam or it does not hold. This
is why `secure` is a **hard gate wholesale** (Chapter 11).

---

