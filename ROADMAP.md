# Roadmap — from ideal ontology to software factory

**Revision:** 2026-07-29 · **rev 3** — round-3 audit corrections applied: **§4.1 rollback's reach is an
effect envelope, not the sandbox boundary** (D4 rescoped, D8's register made normative); **§7 the Digital
Omnibus is in force as Regulation (EU) 2026/1744 and *replaced* Article 4**, while Article 50 does not apply
until 2 Aug 2026; **C3b's P1 conformance check executed — no cost ceiling exists**; the SWE-Bench Pro
retraction restated (a recommendation, not the benchmark). *Prior:* **rev 2** — round-2 review corrections
(E5, E11, E12, D4, A2, A3, C3b, Phase 2 evidence, three traceability rows, new Q10) · **Supersedes:** the
Integration Priority Map in
[`sdlc-evolution-ideas.md`](sdlc-evolution-ideas.md) · **Extends:** Appendix C's road ahead
([`13-appendices.md:133`](sdlc-design/13-appendices.md:133)) and the canvas open-tracks register
([`04-frontier.md`](sdlc-canvas/04-frontier.md))

This is the **authoritative forward plan**. It merges three previously separate queues:

1. the twelve-plus-four **evolution ideas** (Tiers A/B/C) in `sdlc-evolution-ideas.md`;
2. the canvas **derivation frontier** (T11's three promotion forks, T2's residue, the descoped audit);
3. the surviving findings of the July-2026 external review, as adjudicated in
   [`REVIEW-ASSESSMENT-2026-07.md`](REVIEW-ASSESSMENT-2026-07.md).

Nothing in the existing queues is deleted. Every prior item ID (A1–A4, B1–B8, C1–C12, T2, T11) keeps its
identity and appears in the traceability table in **§6**, with its new phase and the reason for any move.

---

## 0 · Governing principle

The review's best formulation, adopted verbatim as this roadmap's constraint:

> **Agents may create and operate rapidly; only external policy and accountable authorities may define
> what they are allowed to risk.**

This is not a departure from Chapter 12 — it is its operational form. Ch 12 already holds that the
second-order tier "does not forbid autonomy — it **prices** it"
([`12-agentic-sdlc.md:134`](sdlc-design/12-agentic-sdlc.md:134)). What the repository lacks is the
machinery that **collects** that price whether or not the agent cooperates. Independence and alignment
asserted in prose are not independence and alignment; they become real only when a system outside the
agent's reach enforces them.

**Two corollaries that shape every phase below.**

- **Autonomy of *work* can go very high; autonomy of *policy* must not.** Permissions, risk acceptance,
  evaluator selection, and self-modification stay outside the agent's authority.
- **The creator of a change must not be able to manufacture or waive all the evidence required to approve
  it.** This is separation of duties applied to the evidence graph — and it is stone #9 made operational.

---

## 1 · Scope discipline: what this repository produces

This repository derives and specifies; it does not host the factory. Keeping that boundary explicit is
what stops the roadmap from silently conflating "write the capability-broker contract" with "build the
capability broker."

| Track | What it produces here | Where it is built |
|---|---|---|
| **Track M — model repairs** (Tier E) | edits to `sdlc-canvas/` then `sdlc-design/` | here, end to end |
| **Track F — factory** (Tier D) | executable schemas, policy contracts, trust-boundary specs, decision tables | specified here · **implemented in a separate build repository** |
| **Track C — canvas frontier** (T11, T2) | continued Socratic derivation | here, end to end |

Track F items are marked **[spec]** where this repository's deliverable is a specification and the
implementation is downstream. A spec is done when a competent engineer could build it without asking us a
question — not when it reads well.

**Method note.** Track M and Track C must obey the canvas's `▶ RESUME INSTRUCTIONS` and the derivation
discipline in [`HANDOFF.md:127`](HANDOFF.md:127): derive in the canvas, then regenerate the design doc.
Track F is different in kind — it is the concrete-systems work that `HANDOFF.md:139` deliberately
descoped, so it does **not** enter the canvas as bedrock derivation. It gets its own artifacts, and the
canvas's ideal stays uncontaminated. That was the right call in iteration 28 and it stays the right call.

---

## 2 · Phases and their gates

Phases are gated, not scheduled. A phase opens when its entry condition holds, and the gate is
**non-compensatory** — every condition must clear, in the same spirit as §11's hard gates. Dates are
deliberately absent: this is a decision queue, and a schedule bet ([`07-lifecycle.md`](sdlc-design/07-lifecycle.md) §7.1)
over work whose scope is still being derived would be a bet with no premise.

```
Phase 0 — Repair the model            (Track M · cheap · unblocks everything)
   │  gate: no known internal contradiction in the gate calculus or Done schema
Phase 1 — Safety kernel               (Track F · before any agent write reaches a shared branch)
   │  gate: an agent cannot manufacture or waive its own approval evidence
Phase 2 — Calibrate on real repositories  (shadow → bounded T0/T1 autonomy)
   │  gate: pre-declared evidence thresholds met on our own repositories
Phase 3 — Advanced autonomy           (multi-agent · formal methods · self-assembly · cost)
```

### Why Phase 0 comes first, and is not ceremony

Three Phase 1 components cannot be specified over the model as it currently stands:

- A **policy engine** (D6) evaluates *evidence sufficiency against a target schema*. The target schema
  currently has two incompatible readings of its own four axes (see **E1**) — the policy would encode the
  collision.
- An **evidence-sufficiency rule** needs security expressible as testable invariants. "All of `secure` is
  hard, wholesale" ([`11-hard-gates-vs-graded.md:13`](sdlc-design/11-hard-gates-vs-graded.md:13)) is not
  machine-evaluable and, taken literally, blocks every release (see **E3**).
- An **artifact-existence gate** (D5/D7) must know *at what granularity* it attaches. §6.4 and §11.2
  currently disagree at collapsed nodes (see **E4**).

Phase 0 is roughly a week of derivation and editing. Building Phase 1 on the unrepaired model would bake
each defect into executable policy, which is precisely the compounding this exercise exists to prevent.

---

## 3 · Tier E — model repairs (Phase 0)

New tier. Each item is a correction to the derivation or its expression, ordered by what Phase 1 needs
first. All are in the model's own vocabulary; none requires new bedrock.

| ID | Repair | Where | Why now |
|---|---|---|---|
| **E1** | Split a work unit into a **boundary** (scope · exclusions · authority · budget) and an **acceptance vector** (the Ch 2 apex four + named target qualities). Retire the phrase "four-axis schema" for the propagation rule. | `09` §Propagation, `05-laws-and-insights` | D1/D6 encode this schema |
| **E2** | Add **Premise C** — *the contract set, even if perfectly honoured, delivers P*. Without it, "green stubs discharge the ⟹" is circular. Route C to design review / integration evidence, as A routes to `verify` and B to `observe`. | `09` §9.1, glossary | D5 evidence classes derive from the premise split |
| **E3** | Refine the gate calculus: **(a)** gate the *reachability of a forbidden output* (binary, per-seam); grade *defence depth and posture*. **(b)** admit **exogenous authority** as a second, orthogonal gate **source** — not a fourth amplifier (see Q9). **(c)** default rule: unknown blast radius ⇒ classify non-local until bounded. | `09` §9.3, `11` | D6 policy is unwritable without (a); D10 without (b) |
| **E4** | Define the **granularity at which the existence-gate attaches** — the accountable work unit, not every fractal node. Resolve §6.4's collapse rule against §11.2's convergent law. | `06` §6.4, `11` §11.2 | D5/D7 must know what evidence is mandatory where |
| **E5** | Terminology — **and not merely cosmetic (rev 2).** `12:140` already says the terminal need only be *uncorrelated*, but `12:73` derives both properties as coming "only from an outside terminal… and removing **the human** drives both toward zero"; `12:161` calls the human hatch the loop's "**only**" independent and aligned terminal; and the L4 chart encodes `remove the human → both → 0` as a derivation step. Chapter 12 contradicts itself. Fix the chapter, the chart, and the shorthand elsewhere; reserve "human" for accountability, value judgment and exceptional authority. Gloss `reliable` ≈ intent-faithfulness, `resilient` ≈ operational reliability/availability. | `12` §73 / §161 / L4 chart, `04`, `06`, `08`, glossary | the misreading was **invited by our own text**, not merely possible |
| **E6** | Failure routing under stone #9: a green *check* is not a true *leaf*. Green leaves + failed acceptance falsifies the conjunction of {composition hypothesis, leaf oracles, environment model} — `analyze` must discriminate before re-targeting `design`. | `09` §Failure routing | D5 evaluator-independence rules depend on it |
| **E7** | Telemetry: retire "continuous and every-seam" as a forced property (it contradicts §11.1's own collapse clause twelve lines earlier). Add sampling, redaction, cost limits, retention, and a **debug-record vs audit-record** separation. | `11` §11.1 | D7 splits exactly along that seam |
| **E8** | Regression lifecycle: preserve the **lesson** and its rationale irreversibly; govern the **test instance** (retire obsolete, redundant, misleading tests). Retract "none is dropped" (`10:98`). | `10` §10.1 | prevents a P2 ratchet that decays into noise |
| **E9** | Stone #10's **agent branch**: for non-persistent inference there is no payoff to shape, so the response is **capability containment · proxy-resistant evaluation · independent evidence**, not incentives. Keep the incentive branch for delegation to persistent parties (vendors, teams, contractors). | `03` #10, `12` §second seat | B4/D9 progressive trust rests on it |
| **E10** | State **where non-apex qualities live** — performance, accessibility, maintainability, privacy are `specify` content and acceptance-vector entries, not new axes. Give the mapping rule. | `02`, `09` | removes the review's strongest remaining ambiguity |
| **E11** | Factual and internal-consistency corrections **(substantially rewritten in rev 2 — the first version of this item was itself wrong):** **(a) A3 contradicts `12:34`** — formal proof relocates the blind spot, it does not eliminate it, so "non-Goodhartable" and "premise B → zero" are retracted; the *primary* evidence is now external, not merely our internal contradiction: arXiv 2605.30914 reports **specification hacking**, "models exploit weak formal specifications instead of implementing the intended solutions" — a model Goodharting a formal verifier. **(b)** EU AI Act timeline and classification (see §7), with Article 50 stated conditionally. **Rev 3 — this sub-item's own correction was stale within weeks and is itself corrected:** the Omnibus is now **Regulation (EU) 2026/1744**, in force **27 Jul 2026**, and it **replaced Article 4** rather than leaving it untouched; Article 50 applies from **2 Aug 2026** (transitional to 2 Dec 2026), so it was not "biting now" when we wrote that it was. *The lesson is not the dates — it is that a legal-status paragraph decays and must carry its verification date and source, which §7 now does.* **(c) CVE-2026-25253, per NVD:** OpenClaw before `2026.1.29` "obtains a `gatewayUrl` value from a query string and automatically makes a WebSocket connection **without prompting**, sending a token value" (CVSS 8.8). A2's "not a code vulnerability" is therefore wrong — but it is **not** a sandbox escape, **not** a crafted-skill package, and **not** patched in "v2.3.1"; that mechanism was our own invention. Drop "first agentic CVE" absent a defensible definition. **(d)** **One** formal-methods citation was mislabelled, not two: 2511.17330 *is* titled "Agentic Verification of Software Systems" and does support the sentence attached to it (seL4 22 person-years; CompCert 6 person-years / 100,000 proof lines). | `sdlc-evolution-ideas.md` A3/A2/C9 · `REVIEW-ASSESSMENT-2026-07.md` §3–§4 | wrong facts anchoring Critical priorities — including **our own** first correction |
| **E12** | **The one genuine retraction.** The bundling rule ("two pressures are one stone iff they share a response") is a **self-test heuristic, not an identity criterion**, because the document itself grants the relation is many-to-many (`03:40`). It therefore cannot establish *exactly* eight first-order stones or *exactly* two second-order seats. Restate the bedrock as a **derived, pressure-tested hazard taxonomy with an explicit admission criterion** — which is what it actually is, and what makes it useful. Keep every stone; drop the claim of proven exhaustiveness. **Consequent sub-item (rev 2):** once the count is a judgment rather than a proof, the two one-line folds that justify the second-order tier — "capability folds to #4, liveness to #7" (`05-laws-and-insights:160`) — must be **stated as criterion-based judgments with their residue recorded**, not asserted in passing. See **Q10**. This records the judgment; it does not re-open T6. | `03`, `13` Appendix A, `05-laws-and-insights` | an overclaimed foundation is the one thing that discredits the whole model on contact with an enterprise reviewer |
| **E13** | Extend the leaf/modality taxonomy from {deterministic, statistical} to **{deterministic, statistical, formal, simulated, human-experiential, runtime-assured}**, each with its own residue and its own Goodhart surface. | `09` §Termination, glossary | A3 and B6 both need the slot |

**E12 is the item to get right.** It is the only place where the review's charge of overclaiming fully
lands, and the fix costs the model nothing of substance: eight pairwise-irreducible stones that survived a
documented pressure-test with a stated admission criterion is a *stronger* claim than "exactly eight,
proven" — because it is defensible. The distinction between a taxonomy and a proof is the difference
between a model an enterprise adopts and one it dismisses in the first review meeting.

---

## 4 · Tier D — the control plane (Phase 1: safety kernel)

New tier. This is the review's central finding, expressed as ten specifiable components. Each absorbs one
or more existing B/C items, named in the last column so nothing is orphaned.

**Entry condition:** Phase 0 complete.
**Exit condition (the phase gate, non-compensatory — all must hold):**

1. Every agent write to a shared branch carries a signed evidence chain from requirement to artifact.
2. No single agent identity can both produce a change and satisfy every evidence requirement gating it.
3. Every hard gate is machine-evaluated **outside** the model, over signed evidence.
4. Every irreversible action is either pre-authorised by a named human or blocked.
5. A kill switch halts all agent execution and revokes credentials in one action, exercised in a drill.
6. Every action, decision, policy version and approval is reconstructable from an append-only log.

| ID | Component | Deliverable here | Absorbs |
|---|---|---|---|
| **D1** | **Mission contract · risk tier · evidence schema** — executable definitions of a work unit's boundary and acceptance vector (per E1), its risk tier, and the evidence each tier requires. | JSON Schema + decision tables **[spec]** | B4 |
| **D2** | **Deterministic durable orchestrator** — a state machine that owns the loop's transitions: idempotency, leases, concurrency control, retries, isolated workspaces, resumable checkpoints. The loop's execution becomes an artifact, not a process. | state-machine spec + invariants **[spec]** | **B5** (raised from Medium) |
| **D3** | **Capability broker** — workload identity per agent *configuration* (not per persona), short-lived credentials, least privilege, default-deny egress, secrets isolation. MCP and A2A are **adapters, not trust boundaries**. | authority model + broker contract **[spec]** | C5 (trust-boundary half) |
| **D4** | **Ephemeral hermetic execution plane** — isolated workspace, hermetic build, resource quotas, vetted tools. Treat the sandbox as a component with its own CVEs, not an axiom. **Rev 3: D4 bounds *compute*, not *effects* — the sandbox boundary is *not* rollback's reach (see §4.1).** **Rev 2:** CVE-2026-25253 is *not* evidence for this component (see E11) — D4 stands on containment and defence-in-depth grounds, and on the general fact that isolation layers carry their own vulnerabilities, not on that CVE. | isolation requirements + escape-test suite **[spec]** | **B1** |
| **D5** | **Signed evidence graph** — requirement → design decision → diff → deterministic checks → property/integration/system checks → security checks → build → SBOM → provenance attestation → deployment → runtime evidence → lesson. Plus **evaluator independence rules** and periodic independence testing. Anchor provenance on SLSA / in-toto. | graph schema + independence policy **[spec]** | A1 (input provenance), C1 |
| **D6** | **External policy gate** — deterministic evaluation of a non-compensatory predicate over signed evidence: `AUTO(a) = WithinDelegatedAuthority ∧ HardInvariantsPass ∧ Evidence ⪰ Required ∧ RecoverableOrPreAuthorized ∧ ObservableAndInterruptible`. No weighted confidence score anywhere in the predicate. | policy language + evaluation semantics **[spec]** | C4 |
| **D7** | **Audit · replay · kill switch** — append-only tamper-evident log; **event-sourced** forensic replay (observable state transitions, model/prompt/tool versions, context provenance, tool calls, outputs, evidence, approvals, policy decisions) — explicitly **not** bit-reproducibility and **not** hidden chain-of-thought; incident command; one-action halt-and-revoke. | log schema + replay contract + drill procedure **[spec]** | **C6** (raised), **C12** (raised, narrowed), C9 audit half |
| **D8** | **Progressive delivery controller** — staging, canary with automated analysis, feature flags, rollback, roll-forward, compensation. This is §10.1's "widen the reversible envelope" built as a system: every seam brought inside converts a pre-execution gate into a graded bet. **Rev 3: the rollback-reach register is promoted from a deliverable to *the authoritative definition* of rollback's reach** (§4.1) — D4 no longer defines it. | controller spec + **rollback-reach register (normative)** **[spec]** | — |
| **D9** | **Versioned configuration governance** — the unit of trust is the tuple *(model, prompt, tools, permissions, harness, context sources, policy version)*. Pin it, detect drift, and **reset attained assurance on any material change**. Progressive trust attaches here, never to an agent persona. | version manifest + drift detectors + assurance-reset rule **[spec]** | **C3a** (raised), **C7** (raised), B4 |
| **D10** | **Governed exception channel** — the specification of `escalate` as the sole path past a hard gate (see §5, Q6): named accountable risk owner · compensating controls · scope and expiry · evidence and rationale · separation of duties · tamper-evident record · automatic re-evaluation. Without this, a non-waivable rule gets bypassed *outside* the system during a real incident. | exception record schema + authority matrix **[spec]** | E3(b) |

### 4.1 · Rollback's reach is an effect envelope, not a compute boundary *(rev 3 — corrected)*

**What this roadmap said, and why it was wrong.** D4 asserted that "the sandbox boundary *is* rollback's
reach for agent execution," citing [`10-artifacts.md:186`](sdlc-design/10-artifacts.md:186). That
equivalence holds only for effects **confined to the sandbox**, and the citation does not support it: the
design says an autonomous pipeline "should treat **rollback's reach as its permission boundary**" — reach
first, permission derived from it. D4 inverted that into *containment defines reach*, which is the opposite
claim and a much stronger one.

**Why the inversion is unsafe.** A perfectly isolated agent, having escaped nothing, can still:

- call an allowed external API whose effect persists after the workspace is destroyed;
- commit a database write, a schema change or a migration;
- rotate or revoke a credential;
- send a message, open a pull request, page a human, or notify a third party;
- trigger a deployment or a downstream pipeline.

Every one of these **crosses the effect boundary without crossing the compute boundary**. Destroying the
sandbox reverses none of them. An architecture that equates the two grants an agent discretion — "inside
rollback's reach, act freely" (B4) — over a class of actions it cannot in fact reverse. That is the
irreversibility amplifier mis-fired by construction, and it would have been encoded directly into D6's
`RecoverableOrPreAuthorized` predicate.

**The corrected definition.** Rollback's reach is defined over the agent's **effect and capability
envelope**, enumerated in D8's rollback-reach register and composed from four sources:

| Source | Contribution to reach |
|---|---|
| **D3 · capability broker** | what the configuration is *able* to touch at all — credential scope, egress allow-list, least privilege. Reach cannot exceed granted capability |
| **D4 · execution plane** | the compute-confined subset — workspace state, hermetic build outputs. Necessary, and the *smallest* of the four contributions |
| **D6 · policy gate** | which effects are pre-authorised, and which irreversible-action classes are blocked outright |
| **D8 · delivery controller** | transactional resources, effect journals and compensators — the machinery that *widens* reach by making an effect undoable after the fact |

**D3 + D6 + D8 collectively bound rollback; D4 alone does not.** The register must enumerate, per effect
class: the transactional resource or compensator that reverses it, or an explicit declaration that it is
**irreversible** — in which case D6 blocks it absent named human pre-authorisation. An effect class absent
from the register is treated as irreversible, by the same default rule E3(c) applies to unknown blast radius.

**Consequences elsewhere.** B4's "inside rollback's reach, the agent has discretion" stays correct — it was
always stated over reach, not over the sandbox — but it now resolves against the register rather than
against containment. B1's identical equivalence in
[`sdlc-evolution-ideas.md`](sdlc-evolution-ideas.md) is corrected in place. D4 is not weakened as a
component; it is scoped to the job it can actually do.

**Also Phase 1 (Track M/A-side, derivation not infrastructure):**

- **A1 · Cascading-failure containment** — the horizontal propagation axiom. `check` must ask *"was my
  input trustworthy?"*, not only *"is my output correct?"*. Circuit-breaking a failing sub-graph is the
  horizontal analogue of `escalate`. Backing confirmed: OWASP **ASI08 Cascading Failures**.
- **A2 · Agentic supply chain** — stone #8 turned on the SDLC's own machinery: inventory, vet and red-team
  every tool, skill, MCP server and context source; tag trusted vs untrusted content before it reaches the
  context window. Evidence corrected per E11 — the ClawHavoc campaign (341 malicious skills, 335 from one
  operator) is A2's supply-chain evidence. **Rev 2 — CVE-2026-25253 is a separate event and routes
  elsewhere:** an attacker-controlled URL taken from a query string (input validation at a trust boundary),
  a connection opened *without prompting* (**approval integrity → D6**), and a token transmitted to that
  endpoint (**credential scoping and default-deny egress → D3**). It is neither supply-chain evidence nor
  sandbox evidence, and the earlier routing of it to D4/B1 was wrong.
- **A4 · Agentic entropy** — **raised from Medium** on new evidence: SWE-CI (arXiv 2603.03823; 100 tasks
  over histories averaging 233 days / 71 commits, 20 models) finds current models "still struggle to
  sustain code quality over extended evolution, particularly in controlling regressions." The *pressure*
  is now empirically established even though its classification (stone · derived law · face of #4×#7×#9)
  stays open as Q1.
- **C1 · Hybrid evaluation** — the deterministic floor before any LLM judge. Cheap, immediate, and it is
  where D5's evidence classes bottom out.

---

## 5 · Phases 2 and 3

### Phase 2 — Calibrate on real repositories

**Entry:** Phase 1 gate cleared. **Purpose:** find out what is actually true here, rather than what a
benchmark implies.

The evidence forbids skipping this. Verified: benchmark pass rates exceed maintainer merge judgment by
**≈24.2 pp**, and roughly half of test-passing SWE-bench Verified PRs would not be merged; **OpenAI
retracted its recommendation** that the research community use SWE-Bench Pro, after its datapoint pipeline
flagged **200 (27.4%)** and its human annotation campaign identified **249 (34.1%)** of the 731 public tasks
as broken — *rev 2: those counts are published, not derived; **rev 3: OpenAI neither owns nor withdrew the
benchmark — it is Scale AI's, and what OpenAI retracted was its own earlier recommendation to adopt it.***
The same maintainer study saw only **~68% of human golden patches re-accepted** by its **recruited**
maintainers, who were not necessarily the engineers who originally merged them. Read that last figure as
noise in a review pipeline, **not** as a 32% defect rate in merged human work. It still means the *oracle*
needs calibration as much as the agent does.

1. **Shadow mode** — agents propose; humans and the existing pipeline decide. Nothing merges on agent
   authority.
2. **Bounded autonomy on T0/T1** (read-only analysis; reversible sandbox changes, docs, tests, isolated
   refactors) with audit and sampling.
3. **Repository-specific measurement** — mergeability, escaped defects, security findings, change-failure
   rate, rollback success, MTTR, cost, **human-attention minutes**. Thresholds pre-declared *before*
   looking at results.
4. **Adversarial test suite** — prompt injection, malicious dependency and tool, evaluator tampering,
   secret exfiltration, poisoned memory, concurrent-workspace corruption, sandbox escape.
5. **B3 · memory controller** + **C8 · epistemic drift** — retrieval and expiry become binding exactly when
   agents work at volume against a live repository. An expired context document is worse than an absent
   one, because the agent trusts it.
6. **B8 · trajectory evaluation** and **C11 · reward-hacking resistance** — audit the path, not only the
   destination; harden the harness against history-mining and container misconfiguration.
7. **B6 · self-calibration** — with a hard constraint: confidence may **trigger** an `escalate`; it may
   never **grant** autonomy. It is not a term in D6's predicate.
8. **C10 · attention economics** — batching, high-leverage surfacing, structured summaries. Binding here,
   not in Phase 1: a T0/T1 pipeline runs with a small human load, and treating attention as a Phase 1
   prerequisite would spend safety-kernel budget on a constraint that is not yet active.
9. **B7 · tool and skill mutation** — permitted only in quarantine, with a separate signed promotion
   pipeline. A dynamically created tool defends no stone until verified.
10. **Supply-chain controls** — SBOM, signed builds, SLSA / in-toto attestations wired into D5.

### Phase 3 — Advanced autonomy

**Entry:** Phase 2 thresholds met and stable across at least two repositories.

1. **B2 · multi-agent workflows** — only where measured benefit exceeds coordination and token cost, and
   with consensus explicitly **denied production authority**. Correlated agreement is not evidence
   (stone #9); Anthropic's own reporting notes substantially higher token use and few naturally parallel
   subtasks in coding.
2. **A3 · selective formal verification** at high-value invariants — authorization, protocol state
   machines, concurrency, migrations, cryptographic usage, safety interlocks. Bounded honestly on three
   verified points (*rev 2 — all three now sourced*): automated results sit at **~31% verified pass rate**
   on refined Dafny benchmarks (arXiv 2605.30914); comprehensive proof stays expensive — **seL4 at 22
   person-years**, **CompCert at 6 person-years / 100,000 proof lines, "eight times longer than the
   implementation itself"** (arXiv 2511.17330), which also names manual specification and loop-invariant
   authoring as the adoption barrier; and the verifier is **itself Goodhartable** — the same RL work
   reports *specification hacking*, "models exploit weak formal specifications instead of implementing the
   intended solutions." A proof is valid only relative to its spec, abstraction and trusted computing base.
3. **C2 · LLM cascades** and **C3b · routing/cost governance** — after correctness, governance and
   observability. *Rev 2* imposed a **P1** conformance obligation regardless of the P3 build slot: state the
   requirement the proxy is presumed to meet and verify it against the running proxy, because **satisfied by
   existing infrastructure is not specified and verified**. ***Rev 3 — that obligation was executed on
   2026-07-29, and it found the presumption false.*** Against the config the launchd job actually loads:
   model allow-list **✓**, RPM enforcement **✓**, concurrency limits **✓**, routing **± partial** (cooldown
   circuit breaker; fallbacks deliberately disabled, no complexity-based routing — so **C2's cascade does not
   exist today**), and **cost ceiling ✗ — absent, and unenforceable as configured** (`store_model_in_db:
   False`, no `database_url`, so spend tracking cannot run). "Cost is handled" was wrong. Two follow-ons:
   **(a)** a cost ceiling is now C3b build work, not an assumed control; **(b)** the proxy configuration is an
   unversioned file outside this repository, and a *second, non-running* copy carrying a `max_budget` key is
   what made the presumption believable — so the configuration must be **versioned into the evidence graph
   (D5) and conformance-tested (D6)**, not cited as ambient infrastructure. Full result:
   [`REVIEW-ASSESSMENT-2026-07.md`](REVIEW-ASSESSMENT-2026-07.md) §1 · D14 and §4 · row 15.
4. **C5b · MCP/A2A interoperability** conveniences, on top of D3's trust boundary.
5. **T2 expansion** — widen T2-tier autonomy only against pre-declared, stable evidence thresholds.
6. **C9b · regulatory conformity** — activated by classification, not by calendar (see §7).

---

## 6 · Traceability — every prior item

`=` unchanged · `↑` raised · `↓` lowered · `⇄` split · `✎` corrected

| ID | Was | Now | Δ | Note |
|---|---|---|---|---|
| A1 Cascading failure | Critical | **P1** | = | OWASP ASI08 confirmed |
| A2 Supply chain | Critical | **P1** | ✎ | ClawHavoc is A2's evidence; CVE-2026-25253 routes to **D3/D6**, not here — *corrected rev 2* (E11) |
| A3 Formal verification | Medium | **P3** + `E11`/`E13` | ⇄ ✎ | claim retracted now; adoption later |
| A4 Agentic entropy | Medium | **P1** | ↑ | SWE-CI gives the pressure empirical backing |
| B1 Sandbox | Critical | **P1 → D4** | ✎ | stands on containment / defence-in-depth; **not** justified by CVE-2026-25253 (*rev 2*, E11); **and the sandbox boundary is not rollback's reach** — *corrected rev 3*, see §4.1 |
| B2 Consensus protocol | Medium | **P3** | ↓ | authority denied; benefit must be measured first |
| B3 Memory controller | High | **P2** | = | binds under real-repository volume |
| B4 Delegation calculus | High | **P1 → D1/D9** | ✎ | trust attaches to a versioned config, not a persona |
| B5 Durable execution | Medium | **P1 → D2** | ↑↑ | the orchestrator *is* the safety kernel's spine |
| B6 Self-calibration | Medium | **P2** | ✎ | may trigger escalate; may never grant autonomy |
| B7 Tool mutation | Lower | **P2** | ↑ | quarantine + signed promotion only |
| B8 Trajectory eval | High | **P2** | = | needs D7's traces to exist first |
| C1 Hybrid evaluation | High | **P1** | = | deterministic floor under D5 |
| C2 LLM cascades | Lower | **P3** | = | cost work after correctness |
| C3 Model governance | Lower | **⇄ C3a P1 / C3b P3** | ⇄ ↑ ✎ | pinning + drift is P0-grade; **P1 conformance check now run (rev 3)** — allow-list/RPM/concurrency verified present, **cost ceiling absent and unenforceable**; C2's cascade does not exist. See §5 · Phase 3 item 3 |
| C4 Harness | High | **P1 → D6** | = | the harness *is* the external policy gate |
| C5 MCP / A2A | Lower | **⇄ C5a P1 / C5b P3** | ⇄ ↑ | adapters are not trust boundaries (NSA CSI, 20 May 2026) |
| C6 Observability | Lower | **P1 → D7** | ↑↑ | prerequisite, not increment — review correct |
| C7 Prompt regression | Medium | **P1 → D9** | ↑ | a prompt change is a deploy of new agent behaviour |
| C8 Epistemic drift | Lower | **P2** | ↑ | stale context is worse than missing context |
| C9 Compliance & audit | Critical | **⇄ C9a P1 / C9b P3** | ⇄ ✎ | see §7 — the single largest reprioritisation |
| C10 Attention economics | Lower | **P2** | ↑ | rises, but is not an autonomy prerequisite |
| C11 Reward hacking | Medium | **P2** | = | pairs with B8 |
| C12 Replay | Lower | **P1 → D7** | ↑ ✎ | event-sourced, not bit-reproducible; no hidden CoT |
| T11 forks (a)(b)(c) | canvas frontier | **P0** | ✎ | (a) → D7 tamper-evidence · (b) → E7 · (c) → E3(c) |
| T2 residue | canvas frontier | **P0** | ✎ | absorbed by E3(a)'s invariant/posture split |
| Descoped audit | "next project" | **P2** | ✎ | Phase 2 *is* the audit, run against our own stack |

**On T11 and T2.** Both canvas tracks are resolved *by* Phase 0 rather than before it, and the direction of
resolution is worth recording: T11(a) — does an adversarially-targeted sensor force a distinct
tamper-evidence MUST-HAVE, or inherit `secure`'s wall? — is answered **forced**, because an append-only
audit log is load-bearing for D7 independently of any adversary; its absence is machinery-degrading in the
§11 sense. T11(c) is answered by E3(c)'s default rule. T11(b) is answered by E7, which demotes
"emission character ≙ temporal type" from law to analogy — the collapse clause in §11.1 already
contradicts the strong reading.

---

## 7 · The C9 reprioritisation, stated plainly

C9 was ranked **Critical** on three claims. Two are false and one is misdated.

| C9's claim | Verified position |
|---|---|
| "The EU AI Act classifies most enterprise autonomous agents as high-risk" | **False.** Article 6 offers Annex I (safety component of a regulated product) or Annex III (eight enumerated domains). General code generation maps to neither; coding agents fall to limited-risk with Article 50 transparency duties |
| "Full enforcement August 2026" | **Superseded, and now settled law.** The Digital Omnibus on AI was adopted as **Regulation (EU) 2026/1744**, published in the OJ on **24 July 2026** and **in force since 27 July 2026** (three-day vacatio legis, taken as a matter of urgency). Annex III moves to **2 Dec 2027**, Annex I to **2 Aug 2028** |
| "Fines up to €35M or 7%" | **Mis-scoped.** Article 99 reserves €35M/7% for **prohibited practices**; other obligations carry €15M/3%, incorrect information €7.5M/1% |

**Therefore C9 splits, and the split changes the reasoning, not just the date:**

- **C9a — audit trail, decision attribution, tamper-evident logging → P1.** Unconditional, and *not*
  because of any regulation. Our own model forces it: unique agent identity, granular decision attribution
  and a hash-chained log are what make `analyze` possible at all under autonomy — their absence is
  machinery-degrading, which is amplifier #3. A P1 justified by the bedrock is a P1 that survives a
  regulatory timeline moving again.
- **C9b — high-risk conformity obligations → P3, activated by classification, not calendar.** Reassess if
  and when the factory touches an Annex III domain.

**Two obligations neither document noticed — and *rev 3* corrects how this roadmap stated both. Neither is
"untouched," and only one of them binds today:**

- **Article 4 (AI literacy)** — **replaced, not untouched.** Regulation (EU) 2026/1744 substitutes a
  softened Article 4: a duty to take measures *supporting* the development of AI literacy among staff and
  those operating AI systems on your behalf, expressly **not** a duty to guarantee any level of it. The
  original applied from 2 Feb 2025; the replacement applies from **27 July 2026**, with no deferral. So the
  obligation is live but weaker than this roadmap previously asserted — an *obligation of means*, not of
  result.
- **Article 50 (transparency)** — unchanged in substance, but it **does not bite yet**. General application
  is **2 August 2026**; providers of generative systems already on the market before that date have until
  **2 December 2026** for the Article 50(2) machine-readable marking duty (the grace period was cut from six
  months to three). It remains conditional in scope as well as in time: it attaches to systems interacting
  with natural persons and to synthetic content, not to internal code artifacts merely because an agent
  wrote them.

**What this does *not* disturb.** The **C9a/C9b split stands unchanged.** C9a was justified by our own
machinery-degrading amplifier rather than by any regulatory date — which is exactly why it survives a legal
timeline that has now moved twice while this document was being written. That is the split doing its job,
not a lucky escape.

*Verification standing:* eur-lex.europa.eu returned an empty body to direct fetch; the facts above rest on
three independent legal analyses in agreement, not on the primary text. Before any **C9b** conformity
decision, read the OJ text. See `REVIEW-ASSESSMENT-2026-07.md` §4, rows 1 and 4.

**And one trap worth naming.** Using AI to **evaluate developer productivity, rank engineers, or allocate
work algorithmically** *is* Annex III (employment) high-risk. A software factory that instruments its
engineers can walk into high-risk classification through the *management* surface while the code-generation
surface stays limited-risk. Phase 2's "human-attention minutes" metric sits uncomfortably close to this
line and should be designed as an aggregate process measure, never a per-individual performance signal.

---

## 8 · Open questions register

Q1–Q5 are carried unchanged from `sdlc-evolution-ideas.md`. Q6–Q9 are new, from this exercise. **Q10** is
new at rev 2, from the round-2 review.

| # | Question | Owner |
|---|---|---|
| Q1 | Is agentic entropy (A4) a new stone, a derived law, or a face of #4 × #7 × #9? Apply the bundling rule — with E12's caveat that the rule is heuristic. | Track C |
| Q2 | Is "external regulatory constraint" a fourth amplifier, or subsumed? | **Candidate resolution below** |
| Q3 | Does the formal-verification leaf require a new stone, or is it the limit of the premise-B lever? | Track C · see E13 |
| Q4 | Is the context window a third boundary in the boundary-distance law — an *attention* boundary? | Track C · relates to B3 |
| Q5 | Does the agentic supply chain extend stone #8's scope, or apply it reflexively? | Track C · relates to A2 |
| **Q6** | Is a governed exception at `escalate` genuinely distinct from a ceremonious `accept`? If not, E3(b) and D10 need rework — and "non-waivable" needs a weaker word. | Track M · **blocks D10** |
| **Q7** | Is the existence-gate's attachment granularity (E4) *derivable* from the bedrock, or is it a contingent policy choice? If contingent, say so — the model should not smuggle a policy in as a law. | Track M · **blocks D5/D7** |
| **Q8** | Does Premise C (E2) decompose further, or is it the irreducible residue of stone #1 at a seam — hidden intent reappearing as specification inadequacy? | Track C |
| **Q9** | Is exogenous authority a genuinely new gate source, or **inherited `define` from a parent loop**? | Track M |
| **Q10** | Are "capability folds to #4" and "liveness folds to #7" (`05-laws-and-insights:160`) sound *judgments*? The design's own bundling rule says distinct forced responses ⇒ **sibling** stones — and capability's responses (routing, decomposition, tool acquisition, capability selection, escalation) are not #4's verify-and-analyze; liveness's (budgets, timeouts, checkpointing, durable execution) are not #7's *artifact*. Record the judgment and its residue per **E12**. **Scope: T6 is closed by prior decision — this asks whether the two folds are adequately *argued*, not for a re-derivation of the count.** | Track C · **the user's call whether to open** |

**Candidate resolution for Q2 / Q9, offered for the user's judgement rather than assumed.**

The fractal says every loop sits inside a larger loop
([`06-fractal.md:6`](sdlc-design/06-fractal.md:6)). A statutory or contractual obligation is then not a
new kind of pressure at all — it is the **parent loop's `specify` output**, arriving as an inherited
target from a scope the organisation does not own. On that reading:

- **Stone #1 (intent is hidden) at the scope above** is the pressure; the regulator's true intent is
  hidden exactly as any principal's is, which is why legal interpretation is `specify` work.
- The gate is **not a fourth amplifier** — the three amplifiers keep answering their single question about
  outcome-space non-compensability, and the list stays homogeneous.
- What is genuinely new is only that this loop **cannot re-target** an inherited target: `decide` loses
  `re-target` as well as `accept`, keeping only `escalate` — to a principal outside the organisation.

If that holds, it resolves Q2 and Q9 together, preserves the three-amplifier list, explains why compliance
*feels* like a different kind of gate without needing new bedrock, and predicts something checkable: the
distinguishing mark of an exogenous gate is a **missing `re-target` exit**, not a missing `accept` exit.
It also needs the bundling rule's *heuristic* status (E12) to be honest about, since the forced response
here — escalation to an external principal — is not obviously distinct from `escalate` generally.

---

## 9 · What this roadmap deliberately does not do

Stated so a later session does not mistake absence for oversight.

- **It does not re-derive the bedrock.** Ten stones stand. E12 corrects the *epistemic status* of the
  count, not the content, and T6 stays closed — do not re-litigate the fold-in. The one adjacent thread is
  **Q10**, which asks only that the capability/liveness folds be *argued* rather than asserted; opening even
  that is the user's call, not a task this roadmap assumes.
- **It does not accept the review's "conceptual constitution" disposition.** Only one completeness claim
  needs retraction (E12). The rest are repairs inside the existing vocabulary, which is a materially
  different and much cheaper outcome than rebuilding alongside a second architecture.
- **It does not schedule.** Phases are gated on evidence. A date here would be a schedule bet with no
  premise (§7.1) and the first thing the model itself would reject.
- **It does not build the factory in this repository.** Track F produces specifications; the build is a
  separate repository, and the canvas's ideal stays uncontaminated — the iteration-28 descoping decision
  holds.
- **It does not treat any benchmark, any consensus of agents, or any self-reported confidence as
  authority.** After OpenAI's retraction of its SWE-Bench Pro recommendation and the 24.2 pp mergeability
  gap, benchmark standing is an input to calibration, never to permission.

- **It does not treat any control as present because the environment is presumed to supply it.** The C3b
  check (§5 · Phase 3 item 3) found the one presumed control nobody had read — a cost ceiling — absent. Every "already
  handled by existing infrastructure" claim in this repository is a **P1 conformance obligation** until its
  configuration has been read and versioned.

---

## 10 · Resume here

**Immediate next move:** open **Q6** and **Q7** with the user Socratically — they block D10 and D5/D7
respectively, and both are genuine forks rather than editorial choices. Then execute Phase 0 in dependency
order: **E12 → E1 → E3 → E4 → E2 → E6 → E9 → E13 → E5 → E7 → E8 → E10 → E11**, deriving in the canvas and
regenerating `sdlc-design/` per the maintenance rule
([`13-appendices.md:155`](sdlc-design/13-appendices.md:155)).

**Progress convention.** Mark each item `[ ]` → `[~]` → `[x]` in this file as it moves, and log the
iteration in [`sdlc-canvas/06-iteration-log.md`](sdlc-canvas/06-iteration-log.md). This file is the
roadmap's source of truth; `sdlc-evolution-ideas.md` remains the idea *catalogue* and its priority table
now points here.
