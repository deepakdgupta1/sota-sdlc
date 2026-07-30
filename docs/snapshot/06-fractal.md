## 6. The fractal: one shape at every scale

<sup>[↪ Why](#r-loop-04)</sup>

**What it is.** The loop is not a top-level ceremony with different machinery underneath. It is a
**fractal**: the same `define → do → check → reflect` shape repeats **in both directions** —

- **Outward, across scope.** An action sits inside a feature, inside a stage, inside a release, inside
  a product. `design` carves the whole into parts, and *each part becomes its own loop* — emergent, not
  staffed by a separate element.
- **Inward, into every element.** Addressing a single element — `specify`, `verify`, `decide` — is
  *itself* a full `define → do → check → reflect` loop, with its own target and its own check.

**Why it must be a fractal.** Complexity (stone #3) forces decomposition, and a decomposed part is just
a smaller instance of the same problem — so it needs the same machine. A second mechanism at each level
would multiply the stones' responses without cause. One shape, reused, is the minimal answer.

**The honest objection to the abstract version.** Chapter 4's chart shows the shape in the abstract, and
relabelling four blank boxes `define/do/check/reflect` *asserts* the inward claim without ever
*instantiating* it. The rest of this chapter earns it: §6.1 states the move once as a recipe; §6.2 and
§6.3 run that recipe end-to-end on two real features — every element opened, every box filled — and §6.4
answers the sharp question their concreteness invites: **is all of this mandatory, or does the ceremony
collapse when it would cost more than it saves?**

> ▸ **Chart — "The fractal — one shape, every scale"** <sup>[↪ Why](#r-loop-04)</sup> · *L2 · scaling.* The scope nesting (top); any
> scope expanding into the four beats (middle); any beat or element expanding into its own four-beat loop
> (bottom). Escalation runs upward to a human; a dashed exit runs to *bedrock* — a leaf so certain it
> collapses to bare `do` (the base case, §6.4).

```pipeline-graph
{
  "title": "The fractal — one shape, every scale",
  "level": "L2 · scaling",
  "summary": "The same loop nested outward across scope (action ⊂ … ⊂ product) and inward into every element; escalation runs upward to a human, and a certain-enough leaf collapses to bare do (the base case, §6.4).",
  "zoomOut": "The unit loop, fully staffed",
  "zoomIn": ["Feature A — rate limiting, every element opened", "When the loop collapses — is the ceremony a must?", "The lifecycle (process flow)"],
  "nodes": [
    {"id":"s_action","label":"action","group":"element","x":0,"y":0},
    {"id":"s_feature","label":"feature","group":"element","x":150,"y":0},
    {"id":"s_stage","label":"stage","group":"element","x":300,"y":0},
    {"id":"s_release","label":"release","group":"element","x":450,"y":0},
    {"id":"s_product","label":"product","group":"element","x":600,"y":0},
    {"id":"b_define","label":"define","group":"beat","x":150,"y":140},
    {"id":"b_do","label":"do","group":"beat","x":330,"y":140},
    {"id":"b_check","label":"check","group":"beat","x":510,"y":140},
    {"id":"b_reflect","label":"reflect","group":"beat","x":690,"y":140},
    {"id":"human","label":"human (escape hatch)","group":"terminal","x":900,"y":140},
    {"id":"c_define","label":"define","group":"beat","x":150,"y":290},
    {"id":"c_do","label":"do","group":"beat","x":330,"y":290},
    {"id":"c_check","label":"check","group":"beat","x":510,"y":290},
    {"id":"c_reflect","label":"reflect","group":"beat","x":690,"y":290},
    {"id":"bedrock","label":"bedrock — bare `do` (base case, §6.4)","group":"terminal","x":470,"y":420}
  ],
  "edges": [
    {"source":"s_action","target":"s_feature","member":true,"label":"⊂"},
    {"source":"s_feature","target":"s_stage","member":true,"label":"⊂"},
    {"source":"s_stage","target":"s_release","member":true,"label":"⊂"},
    {"source":"s_release","target":"s_product","member":true,"label":"⊂"},
    {"source":"s_feature","target":"b_define","member":true,"label":"any scope = a loop"},
    {"source":"b_define","target":"b_do"},
    {"source":"b_do","target":"b_check"},
    {"source":"b_check","target":"b_reflect"},
    {"source":"b_reflect","target":"b_define","dashed":true,"label":"re-target ↺"},
    {"source":"b_reflect","target":"human","dashed":true,"label":"escalate → human"},
    {"source":"b_reflect","target":"c_define","member":true,"label":"any beat/element = a loop ↓"},
    {"source":"c_define","target":"c_do"},
    {"source":"c_do","target":"c_check"},
    {"source":"c_check","target":"c_reflect"},
    {"source":"c_reflect","target":"c_define","dashed":true,"label":"re-target ↺"},
    {"source":"c_reflect","target":"b_reflect","dashed":true,"label":"escalate ↑"},
    {"source":"c_reflect","target":"bedrock","dashed":true,"label":"or collapses to →"}
  ]
}
```

---

### 6.1 The move, stated once — and where it stops

<sup>[↪ Why](#r-loop-04)</sup>

Addressing any element is a loop because the element has its own hidden target, its own way to be wrong,
and its own finite budget — the same stones, one scale down. Two facts make the inner loop more than a
slogan:

- **Its inner `check` is a real, distinct question.** Not "did the feature work?" but "is *this
  element's own output* good enough?" — and for several elements that question is *meta*: `verify` asks
  whether the evidence even covers the risk; `design` asks whether the decomposition wires up at all
  (§9.1).
- **Its inner `escalate` is the parent's escalate.** When an element's own loop exhausts its tries, it
  hands *up* — and the thing it hands to is the beat above it. The `escalate ↑` arrow in every chart is
  not re-invented per level; it is an inner loop surfacing. The fractal closes on itself.

Here is the whole recipe — the generic inner loop of each element, instantiated once and reused for both
examples below:

| Element (beat) | Its inner loop | What its inner `check` asks | What its inner `escalate` means |
|---|---|---|---|
| `specify` (define) | elicitation | does the draft cover every reality, unambiguously? | the *need* itself is unclear — ask a human |
| `scope` (define) | boundary-drawing | is the slice coherent and within budget? | can't fit a coherent slice — need more budget |
| `design` (define) | decomposition (§9.1) | do the stubs wire up — is the bet refuted cheaply? | no clean decomposition — the spec may be wrong |
| `implement` (do) | write–run–fix (TDD) | does the unit pass its own test? | can't pass — the interface/design is wrong |
| `verify` (check) | meta-check | does the evidence actually cover the risky paths? | can't build a trustworthy check — use a proxy / human |
| `observe` (check) | instrumentation | is the run-time signal faithful, not blind? | reality has a mode we can't see |
| `analyze` (reflect) | diagnosis | does the hypothesis reproduce / explain the evidence? | can't root-cause with what I can see |
| `decide` (reflect) | deliberation | does the chosen exit survive a pre-mortem? | beyond my budget / authority |

The recursion does not run forever. It **bottoms out** at `implement`'s leaf — a step so atomic and
certain that its `check` and `reflect` carry no information (a keystroke cannot be "wrong" in a way worth
a loop). That base case — and when a loop may collapse *early* — is §6.4.

---

### 6.2 Example 1 — Feature A: rate limiting (a graded feature)

<sup>[↪ Why](#r-loop-04)</sup>

**The feature.** Protect a public API so no client can exhaust it, while legitimate bursts still
succeed. The outer loop, concretely: `define` = "≤600 req/min per key, bursts still pass, over-limit →
`429` + `Retry-After`"; `do` = a token-bucket over Redis counters; `check` = a load test plus production
telemetry (0.2% of *legitimate* traffic is being throttled); `reflect` = the loop won't converge — the
false-positive rate is too high.

Now open every element. The chart shows the skeleton and names each element's inner loop; the table that
follows *is* the full expansion — every row is a complete `define → do → check → reflect`.

> ▸ **Chart — "Feature A — rate limiting, every element opened"** <sup>[↪ Why](#r-loop-04)</sup> · *L2 · concrete.* The four beats,
> staffed by the eight elements with their real jobs. Each element is itself a loop (detailed in the
> table); `reflect`'s two elements are opened fully in the next chart.

```pipeline-graph
{
  "title": "Feature A — rate limiting, every element opened",
  "level": "L2 · concrete",
  "summary": "The rate-limiting feature as one define→do→check→reflect loop, staffed by eight elements with their real jobs; each element is itself a loop (see the table), and reflect's two elements open fully in the next chart.",
  "zoomOut": "The fractal — one shape, every scale",
  "zoomIn": ["Feature A — the reflect beat, opened inward", "Feature B — password reset, every element opened"],
  "nodes": [
    {"id":"define","label":"define — the limit target","group":"beat","x":0,"y":0},
    {"id":"do","label":"do — build the limiter","group":"beat","x":300,"y":0},
    {"id":"check","label":"check — measure it","group":"beat","x":600,"y":0},
    {"id":"reflect","label":"reflect — it won't converge","group":"beat","x":900,"y":0},
    {"id":"specify","label":"specify · elicit 429 + burst rule","group":"element","x":-20,"y":100},
    {"id":"scope","label":"scope · 3 hot write routes","group":"element","x":-20,"y":175},
    {"id":"design","label":"design · 4 parts + fail-open","group":"element","x":-20,"y":250},
    {"id":"implement","label":"implement · token-bucket (TDD)","group":"element","x":300,"y":100},
    {"id":"verify","label":"verify · load + window-edge test","group":"element","x":600,"y":100},
    {"id":"observe","label":"observe · throttle telemetry","group":"element","x":600,"y":175},
    {"id":"analyze","label":"analyze · diagnose the misfires","group":"element","x":900,"y":100},
    {"id":"decide","label":"decide · deliberate the exit","group":"element","x":900,"y":175},
    {"id":"human","label":"human — escape hatch","group":"terminal","x":1180,"y":40}
  ],
  "edges": [
    {"source":"define","target":"do"},
    {"source":"do","target":"check"},
    {"source":"check","target":"reflect"},
    {"source":"reflect","target":"define","dashed":true,"label":"re-target ↺"},
    {"source":"reflect","target":"human","dashed":true,"label":"escalate → human"},
    {"source":"define","target":"specify","member":true},
    {"source":"define","target":"scope","member":true},
    {"source":"define","target":"design","member":true},
    {"source":"do","target":"implement","member":true},
    {"source":"check","target":"verify","member":true},
    {"source":"check","target":"observe","member":true},
    {"source":"reflect","target":"analyze","member":true},
    {"source":"reflect","target":"decide","member":true}
  ]
}
```

| Element | inner `define` | inner `do` | inner `check` | inner `reflect` — exits |
|---|---|---|---|---|
| `specify` | a complete, testable limit rule | draft "≤600/min per key; bursts ≤20/2s pass; over → `429` + `Retry-After`" | review vs realities: shared NAT, auth vs anon, retries — is "client" an IP or a key? | ambiguity → re-target to "per API key"; else accept; escalate to the PO |
| `scope` | the coherent slice that fits budget | limit the 3 hottest write routes; defer per-IP anon + distributed quota | is the slice coherent and the abuse surface covered? | too thin → redraw; accept; escalate for budget |
| `design` | parts + contracts that compose to the target | {policy store · Redis counters · middleware · `429` responder}; fail-open on Redis-down | stub-composition (§9.1): do the stubs wire? is Redis-down covered? | seam gap → re-decompose; survive → suspend Premise A/B; escalate |
| `implement` | the unit contract: "21st in window → `429`" | write the token-bucket | run the unit test | fail → fix; pass → accept; escalate if it can't pass — *this is where recursion bottoms out* |
| `verify` | evidence that we built the spec | unit + integration + load test | does the evidence cover the **window edge**? — *initially no* | blind spot → add an edge test; accept; escalate |
| `observe` | a run-time signal reality matched the model | emit `throttled_total{key,outcome}`, false-positive rate on legit traffic | is the "legit vs abuse" label trustworthy? | signal lies → re-instrument; accept; escalate |
| `analyze` | an explanation for *every* false throttle | hypothesis: fixed-window edge bursts | 429s vs time-in-window → 2× at the edges | cause found → hand to `decide`; else new hypothesis; escalate |
| `decide` | pick the exit fitting ≤2 tries, min cost | weigh {accept + document · switch → sliding-window · escalate for per-user infra} | pre-mortem sliding-window: +8% memory — acceptable | commit re-target(`design`); reconsider; **escalate ↑ = the outer loop's escalate** |

**Two rows repay a second look.** `verify`'s inner `check` is a *check on the check*: the first load
test passed, but never exercised the **window edge** — so "verified" was a proxy that missed the real
risk (Goodhart, §9). That untested edge is exactly what `observe` later catches in production and what
`analyze` then root-causes. And because `reflect` is where the loop's thinking lives, it is worth seeing
fully opened:

> ▸ **Chart — "Feature A — the reflect beat, opened inward"** <sup>[↪ Why](#r-loop-02)</sup> · *L3 · inside reflect.* `analyze` runs a
> diagnosis loop (hypothesise → test against the evidence → refine); `decide` runs a deliberation loop
> (frame the exits → pick → pre-mortem → commit). `decide`'s inner `escalate` *is* the outer loop's
> `escalate` — the arrow you can trace to close the fractal.

```pipeline-graph
{
  "title": "Feature A — the reflect beat, opened inward",
  "level": "L3 · inside reflect",
  "summary": "reflect's two elements as full loops: analyze runs a diagnosis loop (hypothesise → test against evidence → refine), decide runs a deliberation loop (frame exits → pick → pre-mortem → commit); decide's inner escalate is the outer loop's escalate.",
  "zoomOut": "Feature A — rate limiting, every element opened",
  "zoomIn": ["When the loop collapses — is the ceremony a must?"],
  "nodes": [
    {"id":"analyze","label":"analyze (a diagnosis loop)","group":"element","x":0,"y":0},
    {"id":"a_def","label":"define · explain all misfires","group":"beat","x":250,"y":0},
    {"id":"a_do","label":"do · hyp: window-edge bursts","group":"beat","x":520,"y":0},
    {"id":"a_chk","label":"check · 2× at the edge","group":"beat","x":790,"y":0},
    {"id":"a_ref","label":"reflect · cause found / new hyp","group":"beat","x":1060,"y":0},
    {"id":"decide","label":"decide (a deliberation loop)","group":"element","x":0,"y":175},
    {"id":"d_def","label":"define · pick exit, ≤2 tries","group":"beat","x":250,"y":175},
    {"id":"d_do","label":"do · weigh 3 exits","group":"beat","x":520,"y":175},
    {"id":"d_chk","label":"check · pre-mortem: +8% mem","group":"beat","x":790,"y":175},
    {"id":"d_ref","label":"reflect · commit / escalate ↑","group":"beat","x":1060,"y":175},
    {"id":"accept","label":"accept · known issue","group":"terminal","x":520,"y":310},
    {"id":"op_ref","label":"↑ the outer loop's reflect","group":"beat","x":1320,"y":60},
    {"id":"human","label":"human (escape hatch)","group":"terminal","x":1320,"y":175}
  ],
  "edges": [
    {"source":"analyze","target":"a_def","member":true,"label":"⟳"},
    {"source":"a_def","target":"a_do"},
    {"source":"a_do","target":"a_chk"},
    {"source":"a_chk","target":"a_ref"},
    {"source":"a_ref","target":"a_def","dashed":true,"label":"re-target"},
    {"source":"a_ref","target":"decide","label":"cause → decide"},
    {"source":"decide","target":"d_def","member":true,"label":"⟳"},
    {"source":"d_def","target":"d_do"},
    {"source":"d_do","target":"d_chk"},
    {"source":"d_chk","target":"d_ref"},
    {"source":"d_ref","target":"d_def","dashed":true,"label":"reconsider"},
    {"source":"d_do","target":"accept","label":"accept"},
    {"source":"d_ref","target":"op_ref","dashed":true,"label":"escalate ↑ = outer escalate"},
    {"source":"op_ref","target":"human","dashed":true,"label":"→ escape hatch"}
  ]
}
```

---

### 6.3 Example 2 — Feature B: password reset (a hard-gated feature)

<sup>[↪ Why](#r-gate-01)</sup>

**The feature.** Let a user who has forgotten their password regain access — *securely*. The outer loop:
`define` = "email → a 30-min single-use token → set a new password, without revealing whether the email
is registered, invalidating other sessions on completion"; `do` = the flow; `check` = tests, a security
review, and telemetry (completion sits at a low 68%); `reflect` = why so low?

The *same eight elements*, the *same recipe* — but a directed adversary (stone #8) changes what the inner
checks must ask and, decisively, removes `decide`'s freedom to skip them.

> ▸ **Chart — "Feature B — password reset, every element opened"** <sup>[↪ Why](#r-gate-01)</sup> · *L2 · concrete.* The identical
> skeleton to Feature A — the fractal is feature-independent — with each element's job specialised for a
> security target.

```pipeline-graph
{
  "title": "Feature B — password reset, every element opened",
  "level": "L2 · concrete",
  "summary": "The identical skeleton to Feature A — the fractal is feature-independent — with each element specialised for a secure-reset target against a directed adversary.",
  "zoomOut": "The fractal — one shape, every scale",
  "zoomIn": ["Feature B — design & verify against an adversary"],
  "nodes": [
    {"id":"define","label":"define — secure-reset target","group":"beat","x":0,"y":0},
    {"id":"do","label":"do — build the flow","group":"beat","x":300,"y":0},
    {"id":"check","label":"check — measure + attack it","group":"beat","x":600,"y":0},
    {"id":"reflect","label":"reflect — completion is low","group":"beat","x":900,"y":0},
    {"id":"specify","label":"specify · non-enumeration + TTL","group":"element","x":-20,"y":100},
    {"id":"scope","label":"scope · email reset, 30-min token","group":"element","x":-20,"y":175},
    {"id":"design","label":"design · 5 parts + constant-time","group":"element","x":-20,"y":250},
    {"id":"implement","label":"implement · CSPRNG token (TDD)","group":"element","x":300,"y":100},
    {"id":"verify","label":"verify · abuse tests + review","group":"element","x":600,"y":100},
    {"id":"observe","label":"observe · reuse + deliverability","group":"element","x":600,"y":175},
    {"id":"analyze","label":"analyze · diagnose low completion","group":"element","x":900,"y":100},
    {"id":"decide","label":"decide · deliberate the exit","group":"element","x":900,"y":175},
    {"id":"human","label":"human — escape hatch","group":"terminal","x":1180,"y":40}
  ],
  "edges": [
    {"source":"define","target":"do"},
    {"source":"do","target":"check"},
    {"source":"check","target":"reflect"},
    {"source":"reflect","target":"define","dashed":true,"label":"re-target ↺"},
    {"source":"reflect","target":"human","dashed":true,"label":"escalate → human"},
    {"source":"define","target":"specify","member":true},
    {"source":"define","target":"scope","member":true},
    {"source":"define","target":"design","member":true},
    {"source":"do","target":"implement","member":true},
    {"source":"check","target":"verify","member":true},
    {"source":"check","target":"observe","member":true},
    {"source":"reflect","target":"analyze","member":true},
    {"source":"reflect","target":"decide","member":true}
  ]
}
```

| Element | inner `define` | inner `do` | inner `check` | inner `reflect` — exits |
|---|---|---|---|---|
| `specify` | a complete, *secure* reset spec | draft "email → 30-min single-use token → set password; **must not reveal if the email exists**; invalidate other sessions on completion" | review vs realities: spam, token interception, concurrent / attacker-initiated resets; log out on request or on completion? | ambiguity → "invalidate on completion" (avoids DoS-by-reset); accept; escalate to security. Non-enumeration is a `secure` target → hard gate (§9.3) |
| `scope` | a coherent *secure* slice | email reset, 30-min tokens; defer SMS / 2FA-recovery / admin reset | coherent and secure? — this flags a hard gate | redraw; accept; escalate |
| `design` | parts + contracts composing to *secure* reset | {request · token issue+store (hashed, TTL) · ESP delivery · verify+set · session-invalidation}; **equal response *and* timing** whether the email exists | stub + **security** composition: is a forbidden output (an enumeration signal, incl. timing) reachable at any seam? (§9.3) | timing leak → re-decompose to constant-time; survive; escalate — green leaves can still falsify the *security* hypothesis |
| `implement` | CSPRNG token; hashing; endpoint contracts | write it | unit tests | fail → fix; pass → accept; escalate — bottoms out at code |
| `verify` | evidence we built it *securely* — cover the abuse paths | reused-token, expired-token, enumeration-timing tests + security review | did we test the **timing side-channel** and token reuse? — *blind spot: timing untested* | add the timing test; **`accept` is deleted** — `secure` is a hard gate (§11); escalate |
| `observe` | run-time attack + delivery signals | reset-request / completion rate, token-reuse attempts, bounce/spam via ESP webhooks | is deliverability observable and are reuse-attempts captured? | blind → add webhooks; skipping this sensor is *machinery-degrading* → hard gate; escalate |
| `analyze` | explain the low (68%) completion | hypothesis: reset emails land in spam | seed-inbox + ESP spam-score → DKIM ok, domain reputation low | cause found → `decide`; else new hypothesis; escalate |
| `decide` | pick the exit fitting budget | weigh {accept + "check spam / resend" UI · warm a dedicated sending subdomain · escalate for budget} | pre-mortem: the UI helps now but isn't the fix; the subdomain needs a 2-week warm-up | **split**: accept-now (UI) **and** escalate-the-fix (subdomain) — one `reflect`, two exits |

**Where Feature B diverges from A is inside `design` and `verify`** — so open those two. `design`'s inner
check is no longer "do the parts wire up?" but "is a *forbidden output* reachable at any seam?"; and
`verify`'s inner `reflect`, on finding the untested timing channel, **cannot take the `accept` exit** —
`secure` is a hard gate wholesale (§9.3, §11).

> ▸ **Chart — "Feature B — design & verify against an adversary"** <sup>[↪ Why](#r-apex-02)</sup> · *L3 · inside two elements.*
> `design`'s inner `check` is a security composition test against the forbidden-output wall (§9.3);
> `verify`'s inner `reflect` finds the untested timing channel, but its `accept` exit is deleted because
> `secure` is a hard gate (§11).

```pipeline-graph
{
  "title": "Feature B — design & verify against an adversary",
  "level": "L3 · inside two elements",
  "summary": "design's inner check is a security composition test — is a forbidden output (an enumeration signal, incl. a timing difference) reachable at any seam (§9.3)? verify's inner reflect finds the untested timing channel, but its accept exit is deleted because secure is a hard gate (§11).",
  "zoomOut": "Feature B — password reset, every element opened",
  "zoomIn": ["Hard gate or graded target?"],
  "nodes": [
    {"id":"wall","label":"forbidden-output wall (§9.3)","group":"property","x":580,"y":-120},
    {"id":"design","label":"design (a decomposition loop)","group":"element","x":0,"y":0},
    {"id":"de_def","label":"define · parts compose to secure reset","group":"beat","x":270,"y":0},
    {"id":"de_do","label":"do · hash token; equal-time responses","group":"beat","x":580,"y":0},
    {"id":"de_chk","label":"check · stub + is enumeration reachable?","group":"beat","x":890,"y":0},
    {"id":"de_ref","label":"reflect · timing leaks → re-decompose","group":"beat","x":1200,"y":0},
    {"id":"verify","label":"verify (a meta-check loop)","group":"element","x":0,"y":180},
    {"id":"ve_def","label":"define · evidence covers the abuse paths","group":"beat","x":270,"y":180},
    {"id":"ve_do","label":"do · reuse / expiry / timing tests","group":"beat","x":580,"y":180},
    {"id":"ve_chk","label":"check · did we test the timing channel?","group":"beat","x":890,"y":180},
    {"id":"ve_ref","label":"reflect · gap found — accept DELETED","group":"beat","x":1200,"y":180},
    {"id":"gate","label":"hard gate (§11): secure = non-waivable","group":"property","x":1200,"y":320}
  ],
  "edges": [
    {"source":"design","target":"de_def","member":true,"label":"⟳"},
    {"source":"de_def","target":"de_do"},
    {"source":"de_do","target":"de_chk"},
    {"source":"de_chk","target":"de_ref"},
    {"source":"de_ref","target":"de_def","dashed":true,"label":"re-decompose"},
    {"source":"de_chk","target":"wall","dashed":true,"label":"tests the wall"},
    {"source":"verify","target":"ve_def","member":true,"label":"⟳"},
    {"source":"ve_def","target":"ve_do"},
    {"source":"ve_do","target":"ve_chk"},
    {"source":"ve_chk","target":"ve_ref"},
    {"source":"ve_ref","target":"ve_def","dashed":true,"label":"add timing test"},
    {"source":"ve_ref","target":"gate","dashed":true,"label":"no 'accept' exit"}
  ]
}
```

> **⟐ Under autonomy.** Feature A and Feature B run the identical machine; the only difference is which
> inner `accept` exits still exist. An autonomous executor optimising for cost will try to *collapse* the
> expensive inner loops — the timing test, the reuse sensor — precisely the ones with no immediate
> payoff. Those are exactly the ones §11 marks non-waivable. Reducibility (next) is safe for a graded
> feature and lethal at a gate.

---

### 6.4 Is all this ceremony a must? — reducibility and the base case

<sup>[↪ Why](#r-loop-04)</sup>

**No — and the model says precisely when.** The full four-beat loop is a *response to stones*; where a
stone does not bite for a given piece of work, the beat it forces yields no information, and running it
is pure cost. So a loop may **collapse toward bare `do`** exactly as its stones fall away:

| Beat · element | Forced by | Its inner loop collapses to bare `do` when… | …but never if (override) |
|---|---|---|---|
| define · `specify` | hidden intent (#1) | the target is already unambiguous and singular | — |
| define · `scope` | finite (#2) | the whole fits the budget uncut | — |
| define · `design` | complexity (#3) | the work is atomic — one step, no parts | — |
| do · `implement` | — (the base act) | *never* — it **is** the work | — |
| check · `verify` | we err (#4) | the step is provably correct / cheap to redo | a **hard gate**: the violation is non-local (§11) |
| check · `observe` | uncertainty (#6) | reality is fully modelled — no residue | skipping the sensor is *machinery-degrading* → gate |
| reflect · `analyze` | we err (#4) | it converged on the first try — no gap | **non-convergence**: a hidden stone → re-expand |
| reflect · `decide` | finite (#2) | exactly one exit is possible | dropping the written `reflect`-artifact is machinery-degrading → gate |

Two independent base cases bound the recursion, on the model's two axes:

- **Outward (how deep to decompose)** is already settled in Chapter 9: decomposition **terminates** at a
  leaf that `check` can judge without splitting further. Don't carve a part finer than you can check.
- **Inward (how much ceremony per node)** is this section: run a beat only while its stone is present. A
  certain, atomic, cheap-to-redo step is the inward leaf — bare `do`, no `check`, no `reflect`.

> ▸ **Chart — "When the loop collapses — is the ceremony a must?"** <sup>[↪ Why](#r-loop-04)</sup> · *L3 · reducibility.* Per node: if
> the forcing stone is absent, collapse to bare `do` — *unless* a violation would be non-local (a hard
> gate, §11), or a "trivial" step keeps failing (a hidden stone — re-expand). Outward depth stops
> separately, at a checkable leaf (§9).

```pipeline-graph
{
  "title": "When the loop collapses — is the ceremony a must?",
  "level": "L3 · reducibility",
  "summary": "Per node: if the forcing stone is absent, collapse toward bare do — unless a single violation would be non-local (a hard gate, §11), or a trivial-looking step keeps failing (a hidden stone — re-expand). Outward depth stops separately at a checkable leaf (§9).",
  "zoomOut": "The fractal — one shape, every scale",
  "zoomIn": ["Hard gate or graded target?", "Done propagation"],
  "nodes": [
    {"id":"term","label":"outward: depth stops at a checkable leaf (§9)","group":"property","x":360,"y":-120},
    {"id":"node0","label":"then, per node: its target","group":"beat","x":360,"y":0},
    {"id":"q1","label":"is the forcing stone ABSENT here?","group":"terminal","x":360,"y":110},
    {"id":"collapse","label":"collapse → bare `do`","group":"element","x":110,"y":235},
    {"id":"keep","label":"keep the full loop","group":"beat","x":680,"y":235},
    {"id":"but","label":"before skipping: is a violation NON-LOCAL? (§11)","group":"terminal","x":110,"y":350},
    {"id":"gate","label":"HARD GATE — accept deleted, can't skip","group":"property","x":-80,"y":470},
    {"id":"ok","label":"safe: proportional skip","group":"element","x":300,"y":470},
    {"id":"nonconv","label":"a 'trivial' step keeps failing","group":"stone","x":680,"y":350},
    {"id":"reexpand","label":"hidden stone → re-expand","group":"beat","x":680,"y":470}
  ],
  "edges": [
    {"source":"term","target":"node0","dashed":true,"label":"then"},
    {"source":"node0","target":"q1"},
    {"source":"q1","target":"collapse","dashed":true,"label":"yes — certain / atomic / converges"},
    {"source":"q1","target":"keep","label":"no — a stone bites"},
    {"source":"collapse","target":"but","label":"check first"},
    {"source":"but","target":"gate","dashed":true,"label":"yes"},
    {"source":"but","target":"ok","label":"no"},
    {"source":"keep","target":"nonconv","dashed":true,"label":"and watch"},
    {"source":"nonconv","target":"reexpand"}
  ]
}
```

**The decision to collapse is itself a `decide`.** You are weighing the cost of the ceremony against
`P(undetected error) × cost(error)` — insurance against a risk. Skip the premium when the covered loss is
small or improbable; this is the same shape as §9.2's *tightest-sufficient* contract: pay just enough to
admit the required realities, no more. Feature A collapses freely — the token-bucket `implement` bottoms
out in a single unit test, and `scope` barely loops.

**But two overrides delete the `accept` exit and forbid collapse** (both from §11):

1. **A hard gate** — a violation that is *non-local* (adversary-amplified, irreversible, or
   machinery-degrading). This is why Feature B cannot be reduced the way A can: the adversary removes the
   "low-stakes, cheap-to-redo" premise that justified skipping. Skipping `observe` or the written
   `reflect`-artifact is *itself* machinery-degrading — so those beats are gates about the loop's own
   machinery, non-waivable regardless of local cost.
2. **Non-convergence.** If a step you judged trivial keeps failing, your judgement that "no stone bites
   here" was wrong — a hidden stone is present. Re-expand. Non-convergence is information (Chapter 4), now
   pointing at your own reducibility bet.

So the honest answer to "is all this ceremony a must?" is: **the ceremony is proportional, not fixed —
pay it where a stone bites and buy it down where none does — except at the gates, where a single miss is
uncompensable and the price of the ceremony is not yours to negotiate.**

---

