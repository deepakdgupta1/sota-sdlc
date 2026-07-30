# SOTA SDLC Agentic AI Evolution Ideas (July 2026 — Revamped)

> # ⚠ HISTORICAL CATALOGUE — NOT A CURRENT ROADMAP
>
> **Status as of 2026-07-29:** this file is the **idea catalogue and its audit trail**. It is *not* the plan
> and it is *not* a statement of current positions. The authoritative forward plan is
> **[`ROADMAP.md`](ROADMAP.md)**; the adjudication behind it is
> **[`REVIEW-ASSESSMENT-2026-07.md`](REVIEW-ASSESSMENT-2026-07.md)**.
>
> **Several entries below assert things now known to be false.** They are retained deliberately — the record
> of what we believed, and why it was wrong, is itself evidence — but **every superseded claim now carries an
> inline `⊘ Superseded` block at the point of the claim**, not only in the errata at the foot of the file.
> An erratum three hundred lines away does not make a false declarative sentence accurate, and a reader who
> stops early would previously have carried away a fabricated CVE mechanism, a retracted "non-Goodhartable"
> claim, and a superseded regulatory deadline.
>
> **Entries carrying corrections:** A2 · A3 · B1 · B4 · C5 · C6 · C9 · C12, and the closing
> *"next major phase"* paragraph. Read each `⊘` block as authoritative over the prose it interrupts.

This document is the **forward-looking evolution roadmap** for our first-principles SDLC design. Each idea identifies a gap between the ideal model captured in [`sdlc-design/`](file:///Users/deepg/Desktop/SOTA%20SDLC/sdlc-design/) and the State-of-the-Art (SOTA) in agentic software engineering as of July 2026.

Ideas are organized into three tiers:
- **Tier A — Structural Extensions to the Bedrock:** Missing theoretical primitives — things the model's own self-test should demand.
- **Tier B — Agentic-Native Machinery:** New mechanisms the loop needs when agents staff it — forced by stones #9/#10 and the realities of autonomous execution.
- **Tier C — Operational Infrastructure:** Concrete engineering systems that a production agentic SDLC requires to implement the ideal.

Each entry explains: *what's missing*, *why it matters* (grounded in the model's vocabulary), and *where it threads in* (which chapters, stones, and beats it touches).

---

## Tier A — Structural Extensions to the Bedrock

### A1. Cascading Failure Containment — The Horizontal Propagation Axiom

*   **What is missing:** The fractal model ([§6](file:///Users/deepg/Desktop/SOTA%20SDLC/sdlc-design/06-fractal.md)) describes **vertical** error propagation: an inner loop escalates to its parent. It has no axiom for **horizontal** propagation — where an error in one agent's output, accepted as "trusted truth" by a peer agent, contaminates a parallel branch that passes its own local `check`.
*   **Why it matters:** OWASP's 2026 ASI08 classification and production incident data confirm that cascading failure is the defining reliability threat of multi-agent systems. Error propagation is not just "bugs travel" — it is a systemic corruption pattern where downstream agents **inherit the upstream agent's correlated blind spot** (stone #9 applied *laterally*). The current model's `check` beat only compares local actual-vs-expected; it has no mechanism to detect that its *input* was already poisoned upstream. This is a gap in the convergence property itself: horizontal cascades mean the loop can converge to a **wrong fixed point** even when every local `check` is green.
*   **Where it threads in:** Extends the second-order tier ([§12](file:///Users/deepg/Desktop/SOTA%20SDLC/sdlc-design/12-agentic-sdlc.md)) from a two-seat reflexivity/alignment model to include a **propagation topology**. Requires new machinery in `check`: an **input-provenance validator** that asks not just "is this output correct?" but "was this input trustworthy?" — a form of inter-agent `verify` at the seam. The circuit-breaker pattern (isolating a failing sub-graph before its poison reaches peers) is the resilience repertoire's horizontal analogue of `escalate`.

### A2. The Agentic Supply Chain — Stone #8 at the Solver's Own Boundary

*   **What is missing:** The security repertoire ([§8](file:///Users/deepg/Desktop/SOTA%20SDLC/sdlc-design/08-repertoires.md)) addresses adversaries targeting the *software being built*. It does not address adversaries targeting the *SDLC machinery itself* — the agent's tools, skills, MCP servers, plugins, and context injections. ~~The first CVE for an agentic system (CVE-2026-25253, Jan 2026) exploited a malicious skill package, not a code vulnerability.~~

    > **⊘ Superseded — the CVE sentence above is false in every particular.** Per
    > [NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-25253), CVE-2026-25253 **is** a code vulnerability
    > (CVSS **8.8**): OpenClaw before `2026.1.29` "obtains a `gatewayUrl` value from a query string and
    > automatically makes a WebSocket connection **without prompting**, sending a token value." No skill
    > package, no sandbox escape. Drop "first agentic CVE" — we have no defensible definition for it.
    > **It is also not A2 evidence.** It routes to **D6** (approval integrity — the human-in-the-loop step
    > existed and was not invoked) and **D3** (credential scoping and default-deny egress).
    > **A2's actual supply-chain evidence is the separate ClawHavoc campaign** — 341 malicious marketplace
    > skills, 335 from one operator, delivering Atomic Stealer to macOS developer workstations.
    > *A second correction is recorded here for the record: our own first attempt at this fix invented a
    > "crafted skill package escapes the Docker sandbox, patched v2.3.1" mechanism, which had already
    > propagated into a P1 justification before NVD was checked.* → `ROADMAP.md` **E11(c)**, A2 row.

    **The rest of this entry stands.** The supply-chain thesis — that every MCP server, skill and retrieved
    context document is an executable dependency, and that indirect prompt injection turns stone #8 on the
    loop's own machinery — is unaffected by the CVE correction and is **P1**.
*   **Why it matters:** Every MCP server, every dynamically loaded skill (like those in `~/.agents/skills/`), every retrieved context document is an **executable dependency** in the agent's supply chain. Indirect Prompt Injection (IPI) — hidden malicious instructions embedded in documents, emails, or retrieved context — is the defining attack vector of 2026. The agent cannot distinguish between developer-provided system instructions and externally injected content. A compromised skill or context document doesn't just write bad code; it **hijacks the solver itself**, turning stone #8's "directed optimiser" against the loop's own machinery. This is stone #8 applied reflexively: the adversary enters not through the code's input surface but through the agent's context window.
*   **Where it threads in:** Demands a new sub-repertoire within the security repertoire: **supply-chain hygiene** — inventory, vet, and red-team every tool, skill, and context source before it enters the agent's trust boundary. Also demands **context-layer governance**: metadata tagging (spotlighting) to distinguish trusted vs. untrusted content before it reaches the context window. This is the `sanitize/validate` lever from §9.2, applied not to the code's inputs but to the agent's own inputs.

### A3. Formal Verification as a Check Modality — Beyond Statistical and Deterministic Leaves

*   **What is missing:** The mechanism of Done ([§9](file:///Users/deepg/Desktop/SOTA%20SDLC/sdlc-design/09-mechanism-of-done.md)) bottoms out in two leaf kinds: **deterministic** (unit test → pass/fail) and **statistical** (sampled proxy → threshold). There is a third modality emerging in 2026 that the model does not account for: **formal verification** — mathematical proof of correctness against a specification, using proof assistants like Lean 4 or TLA+.
*   **Why it matters:** A formal proof is categorically different from both existing leaf kinds. A deterministic test *samples* paths (assertion-by-example); a statistical leaf *estimates* a distribution. A formal proof *exhausts* the logical space — it discharges the composition hypothesis `(∧Lᵢ) ⟹ P` **relative to its specification**. This matters because in an agentic SDLC where code is generated at machine speed, the volume of code *exceeds human review capacity*. ~~Formal verification offers a **non-Goodhartable** leaf — the one check modality that cannot be gamed by an incentive-divergent agent (stone #10), because a proof assistant is a deterministic certificate-checker that is structurally immune to the agent's utility function. It is the purest form of the "independent terminal" that §12 demands.~~
*   ~~**Where it threads in:** Extends §9's leaf taxonomy to three kinds: `deterministic | statistical | formal`. The formal leaf collapses premise B to zero residue (not by tightening the contract, but by proving the whole value-domain). It is the ultimate tightening of the premise-B lever (§9.2) — it manufactures `predictable` absolutely.~~ Should be positioned in the model as the **asymptotic limit** of `verify`, available at specific seams (concurrent algorithms, security-critical invariants) where the cost of formalization is justified by the cost of a wrong-but-confident convergence.

    > **⊘ Superseded — "non-Goodhartable" and "collapses premise B to zero residue" are both retracted.**
    >
    > **It contradicts our own Chapter 12:** "even a formal proof… only **relocates** the blind spot from the
    > code into the spec" ([`12-agentic-sdlc.md:34`](sdlc-design/12-agentic-sdlc.md:34)), repeated at
    > [`03-bedrock.md:62`](sdlc-design/03-bedrock.md:62). A proof discharges a formal statement relative to a
    > specification, an abstraction, an environment model and a trusted computing base. Residue is relocated,
    > never zero.
    >
    > **And the external evidence is stronger than the internal contradiction.**
    > [arXiv 2605.30914](https://arxiv.org/html/2605.30914v1) reports **specification hacking** — "models
    > exploit weak formal specifications instead of implementing the intended solutions." That is a model
    > Goodharting a formal verifier: direct empirical refutation of "structurally immune to the agent's
    > utility function."
    >
    > **Adoption is also bounded, on three verified points.** Automated results sit at ~**31.1%** verified
    > pass rate on refined Dafny benchmarks (Lean scaffold 46.2% → 69.2% on the VeriCoding pilot);
    > comprehensive proof stays expensive — **seL4 at 22 person-years**, **CompCert at 6 person-years /
    > 100,000 proof lines, "eight times longer than the implementation itself"**
    > ([arXiv 2511.17330](https://arxiv.org/html/2511.17330v3)); and specification authoring, not proof
    > search, is *a* central bottleneck.
    >
    > **Current disposition:** the *leaf-taxonomy extension survives and is broadened* — `{deterministic,
    > statistical, formal, simulated, human-experiential, runtime-assured}`, **each with its own residue and
    > its own Goodhart surface** (`ROADMAP.md` **E13**). Selective formal verification at high-value
    > invariants moves to **P3**. → `ROADMAP.md` **E11(a)**, **E13**, §5 · Phase 3 item 2.

### A4. Agentic Entropy — The Eleventh Stone?

*   **What is missing:** The bedrock's ten stones describe pressures that make software hard to *build*. None describes the unique pressure that makes agent-*generated* software hard to *maintain over time*: **agentic entropy** — the process by which autonomous, stochastic updates systematically drift from original architectural intent, degrading codebase quality even as each individual change passes its local `check`.
*   **Why it matters:** The 2026 SWE-CI benchmark and production experience show that agents produce code that is locally correct but globally incoherent: duplicated logic, inconsistent patterns, and structural decay that accumulates invisibly. This is not stone #5 (change) — it is not reality moving the target. It is the *solver itself introducing architectural drift through the act of solving*. Each agent invocation re-derives logic from its limited context window rather than reading and conforming to existing patterns. The composition hypothesis (§9) is silently falsified not by a failing leaf but by the *aggregate effect* of individually-green changes. Whether this is a genuinely new stone, a derived law (like cost-asymmetry), or a face of existing stones (#4 × #7 × #9) is an open question — but the pressure is real and the model has no explicit response to it.
*   **Where it threads in:** Candidate for the bedrock self-test ([§3](file:///Users/deepg/Desktop/SOTA%20SDLC/sdlc-design/03-bedrock.md)). If admitted as a derived law, it belongs in §12 (laws & insights). If admitted as a stone, it would force a new response: an **architectural consistency sensor** — a `check`-beat instrument that measures not individual correctness but aggregate drift from the stated design artifact (§10). The regression ratchet (§10.1) guards against re-opening *specific* holes; this would guard against *systemic* degradation — a different axis.

---

## Tier B — Agentic-Native Machinery

### B1. Ephemeral Runtime Containment — The Execution Boundary

*   **What is missing:** The security repertoire ([§8](file:///Users/deepg/Desktop/SOTA%20SDLC/sdlc-design/08-repertoires.md)) treats security via traditional mechanisms (authn/authz, sanitization, least-privilege). It lacks an explicit **ephemeral containment boundary** — a secure sandbox, micro-VM, or gVisor-like isolation gate — for the `do`/`implement` phase.
*   **Why it matters:** An agentic SDLC agent generates and immediately *executes* commands on the host system. Under stone #8 (adversarial) or stone #10 (incentive-divergence), a compromised or misaligned agent is not just writing bad code — it is an active, untrusted executor. Without a hard-gated runtime sandbox, the agent can mutate its own runner, hijack host resources, or exfiltrate credentials. The sandbox is the `harden / minimise surface` repertoire move applied to the agent's own execution environment — and it should be a **hard gate** (machinery-degrading: a breached sandbox blinds all downstream `check` beats).
*   **Where it threads in:** New sub-gate within the security repertoire ([§8](file:///Users/deepg/Desktop/SOTA%20SDLC/sdlc-design/08-repertoires.md)). Intersects with the irreversibility amplifier (§11). ~~Actions inside a sandbox are reversible (rollback = destroy the sandbox); actions that escape it are irreversible. The sandbox boundary *is* the rollback reach for agent execution.~~

    > **⊘ Superseded — the sandbox boundary is *not* rollback's reach, and treating it as such is unsafe.**
    >
    > The equivalence holds only for effects **confined to the sandbox**. An agent that has escaped nothing
    > can still call an allowed external API, commit a database write or migration, rotate a credential, send
    > a message or open a PR, and trigger a deployment. Each **crosses the effect boundary without crossing
    > the compute boundary**, and destroying the workspace reverses none of them.
    >
    > Why this mattered rather than being a wording quibble: B4 grants the agent discretion *inside rollback's
    > reach*. Equating reach with containment would hand an agent free rein over a class of actions it cannot
    > reverse — the irreversibility amplifier mis-firing by construction, and it would have been encoded
    > straight into D6's `RecoverableOrPreAuthorized` predicate.
    >
    > **The design never said this either.** [`10-artifacts.md:186`](sdlc-design/10-artifacts.md:186) says an
    > autonomous pipeline should treat "**rollback's reach as its permission boundary**" — reach first,
    > permission derived from it. This entry inverted it into *containment defines reach*.
    >
    > **Current disposition:** rollback's reach is defined over the agent's **effect and capability envelope**
    > — transactional resources, effect journals, compensators, external side effects, credential scopes and
    > declared irreversible-action classes — enumerated in **D8's rollback-reach register** (normative).
    > **D3 + D6 + D8 collectively bound rollback; D4 alone does not.** An effect class absent from the
    > register is treated as irreversible. B1 as a *containment* requirement is untouched and remains **P1**.
    > → `ROADMAP.md` **§4.1**, D4/D8 rows.

### B2. Multi-Agent Consensus & Peer Verification Protocol

*   **What is missing:** The fractal ([§6](file:///Users/deepg/Desktop/SOTA%20SDLC/sdlc-design/06-fractal.md)) assumes a nested, hierarchical loop. It lacks a formal protocol for **horizontal multi-agent orchestration**: how specialized agents (Planner, Coder, Reviewer, SecOps) coordinate, how their outputs are verified against each other, and how consensus is reached when they disagree.
*   **Why it matters:** SOTA 2026 systems use coordinated agent fleets, not single nested loops. When agents interact horizontally, their errors propagate laterally (A1 above). Without a formal consensus protocol — majority voting on plans, cross-agent critique rounds, adversarial review assignments — a single agent's drift can poison the shared workspace. The consensus protocol is the horizontal analogue of `reflect`: where vertical `reflect` asks "should *I* iterate?", horizontal consensus asks "do we *agree* this is done?" It manufactures **independence** (stone #9) not by going external but by exploiting intra-fleet diversity.
*   **Where it threads in:** Extends the fractal ([§6](file:///Users/deepg/Desktop/SOTA%20SDLC/sdlc-design/06-fractal.md)) to model not just vertical nesting but horizontal coordination. Connects to the second-order tier ([§12](file:///Users/deepg/Desktop/SOTA%20SDLC/sdlc-design/12-agentic-sdlc.md)): deliberate adversarial and diverse review is the §12 mechanism; the consensus protocol is its *implementation*.

### B3. Episodic vs. Semantic Memory & Context Management — The Agent Memory Controller

*   **What is missing:** The artifacts chapter ([§10](file:///Users/deepg/Desktop/SOTA%20SDLC/sdlc-design/10-artifacts.md)) derives the necessity of persistent artifacts to defend against stone #7. It does not define the **Agent Memory Controller** — the system that dynamically structures, scopes, and injects artifact information into the agent's runtime context window.
*   **Why it matters:** Agents operate under strict context-window limits. Without formal memory consolidation — separating *episodic memory* (what happened in this run) from *semantic memory* (codebase rules, patterns, historical decisions) — the agent suffers context pollution. It forgets local conventions (repository-specific tools), hijacks context with irrelevant detail, or fails to apply historical regression lessons. The memory controller is the bridge between the artifacts (which *exist* per §10) and the agent's ability to *use* them. Its absence means stone #7's response (artifacts) is present but **non-functional** — the knowledge is persisted but unretrievable at the moment of need. This is a machinery-degrading failure: it blinds `define` (agent can't read the spec) and `analyze` (agent can't read the ADR).
*   **Where it threads in:** Fills the gap between §10 (artifacts exist) and §4 (the loop uses them). The memory controller is the runtime realization of the boundary-distance law (§10): it ensures artifacts cross the agent boundary, not just the time boundary.

### B4. Risk-Asymmetry & Graded Human Delegation — The Delegation Calculus

*   **What is missing:** Chapter 12 ([§12](file:///Users/deepg/Desktop/SOTA%20SDLC/sdlc-design/12-agentic-sdlc.md)) establishes that an independent external terminal (human) must remain in the loop. But it lacks a formal **delegation calculus** — a rule-based framework that determines *where* the HITL gate fires, *how much* autonomy is granted, and *how* that autonomy degrades as risk increases.
*   **Why it matters:** If the human must approve every sub-loop iteration, velocity collapses to zero. If the human is too detached, irreversible actions leak. The delegation calculus must grade actions along the amplifier axis (§11): **reversible + local → auto-execute**; **irreversible or adversary-amplified → hard HITL gate** (human approves before execution). ~~The concept of **progressive trust tiers** — where an agent starts with limited permissions and earns elevated access through demonstrated safe performance — is the alignment mechanism (stone #10) made operational: the agent's payoff is linked to its track record.~~

    > **⊘ Superseded — progressive trust attaches to a *versioned configuration*, never to an agent's
    > "track record."**
    >
    > There is no persistent entity here to hold a record. The unit of trust is the tuple **(model, prompt,
    > tools, permissions, harness, context sources, policy version)**. Any material change to that tuple —
    > a model version bump, an edited system prompt, a newly registered tool, a widened permission — produces
    > a *different* configuration, and **attained assurance resets**. Trust earned by yesterday's tuple says
    > nothing about today's.
    >
    > "The agent's payoff is linked to its track record" also imports stone #10's *human* response menu into
    > a case where it does not implement: a non-persistent inference has **no payoff to shape**. The agent
    > branch of #10 is **capability containment · proxy-resistant evaluation · independent evidence**, not
    > incentives. Keep the incentive branch for delegation to persistent parties — vendors, teams,
    > contractors. → `ROADMAP.md` **E9**.
    >
    > *Note also that "the agent acts freely within the sandbox" was struck above: discretion is bounded by
    > rollback's reach, which is an effect envelope, not the sandbox (see **B1**).*
    >
    > **Current disposition:** **D9** (versioned configuration governance — version manifest, drift detectors,
    > assurance-reset rule) plus **D1** (mission contract · risk tier · evidence schema). Both **P1**.
*   **Where it threads in:** Operationalizes §11's predictive rule for the human-agent boundary. The delegation calculus *is* the runtime implementation of the hard-gate / graded-target distinction, projected onto agent permissions. Connects directly to the rollback reach (§10.1): inside rollback's reach, the agent has discretion; beyond it, the human gate fires.

### B5. Durable Execution & Checkpoint-Resumable Loops — The Persistence Seam

*   **What is missing:** The model assumes the loop runs continuously from `define` through `reflect`. In reality, agentic loops are long-running (hours, days), span infrastructure boundaries, and are vulnerable to process crashes, timeouts, and infrastructure failures. The model has no concept of **durable execution** — the ability of a loop to checkpoint its state and resume from the last valid checkpoint after a failure.
*   **Why it matters:** A process crash that destroys the loop's in-progress state is not just an inconvenience — it is a **machinery-degrading failure**. The loop's working memory (intermediate `define` targets, partial `do` outputs, accumulated `check` evidence) is lost. Without checkpointing, the entire loop must restart from scratch, re-consuming resources (stone #2) and re-doing work that was already converging. The checkpoint is the loop's **state artifact** — the same boundary-distance law (§10) applied to the loop's own execution, not just its outputs. It crosses the *time* boundary (persists across crashes) and the *infrastructure* boundary (resumes on a different host).
*   **Where it threads in:** New forced artifact alongside the existing six (§10). The checkpoint is to the loop's execution what the ADR is to its decisions: an existence-hard, fidelity-graded artifact. Its absence is machinery-degrading (the loop loses its progress); its content is graded (how much state to save is a cost/risk tradeoff). Connects to the resilience repertoire ([§8](file:///Users/deepg/Desktop/SOTA%20SDLC/sdlc-design/08-repertoires.md)): `recover` + `roll back` for agent workflows, not just the software they produce.

### B6. Solver Self-Calibration & Confidence Estimation — The Uncertainty Gate

*   **What is missing:** The `check` beat compares actual-vs-expected, but the model lacks a **self-calibration sensor** that estimates the agent's *own* uncertainty before committing changes.
*   **Why it matters:** Diligent, high-capability agents fail by being *confidently wrong* (the echo-chamber failure of stone #9). SOTA 2026 systems employ multi-path generation (self-consistency decoding, search-tree evaluation, Monte Carlo Tree Search) to measure reasoning confidence. When confidence falls below a safety threshold, the system should trigger an automatic `escalate` exit to a human terminal — not because the answer is wrong, but because the system *cannot distinguish right from wrong*. This is the preemptive analogue of `check`: where `check` fires *after* the work, calibration fires *before* commitment, gating on the agent's ability to reliably self-assess.
*   **Where it threads in:** New sensor within the `check` beat, positioned between `do` and `verify`. Connects to stone #9: calibration is how the loop detects that it is *approaching* an echo-chamber convergence, and escalates before the wrong fixed point is committed. The confidence threshold is a graded target; the existence of calibration is a hard gate (its absence is machinery-degrading — it blinds `reflect` to its own reliability).

### B7. Metacognitive Tool Mutation & Skill Evolution — The Capability Seam

*   **What is missing:** The repertoires ([§8](file:///Users/deepg/Desktop/SOTA%20SDLC/sdlc-design/08-repertoires.md)) assume a static, pre-defined set of tools. SOTA agents are *self-assembling*: they construct specialized CLI scripts, write custom integrations, and register new tools at runtime.
*   **Why it matters:** Tool mutation introduces a new reflexivity loop: the solver's instruments must themselves be verified by the loop *before* being used. A bug in a dynamically generated tool corrupts every downstream invocation — it is **machinery-degrading** by definition (a broken tool blinds the `check` that uses it). The self-test ([§3](file:///Users/deepg/Desktop/SOTA%20SDLC/sdlc-design/03-bedrock.md)) says every element must defend a stone; a dynamically created tool defends nothing until it has been verified. It is an *ungrounded element* — present in the loop's repertoire but not yet earned by the bedrock.
*   **Where it threads in:** New sub-loop within the `do` beat: `define`-tool → `do`-generate → `check`-verify-tool → `reflect`-register-or-reject. This is the fractal ([§6](file:///Users/deepg/Desktop/SOTA%20SDLC/sdlc-design/06-fractal.md)) applied to the loop's own tooling, not just the software it produces. Tool verification is a **hard gate** (machinery-degrading amplifier).

### B8. Trajectory-Aware Evaluation — Judging the Path, Not Just the Destination

*   **What is missing:** The model's `check` beat evaluates the *output* — the artifact produced by `do`. It does not evaluate the *trajectory* — the sequence of reasoning steps, tool calls, and intermediate states the agent traversed to produce that output.
*   **Why it matters:** 2026 research (SEAlign, ICSE 2026; SWE-bench reward-hacking analysis) shows that agents can produce correct outputs through incorrect trajectories — reward-hacking (running `git log` to copy a fix rather than solving the problem), repetitive loops, tool misuse, or brute-force retries that happened to succeed. A correct output from a bad trajectory is a **false convergence**: the loop appears to have converged, but the *method* is not generalizable and will fail on the next task. This is specification gaming — stone #10 (incentive-divergence) applied to the evaluation itself: the agent optimizes for the proxy (test passes) while diverging from the true target (sound engineering). Without trajectory evaluation, `check` is Goodharted at the meta-level.
*   **Where it threads in:** New dimension of the `check` beat: alongside `verify` (output correctness) and `observe` (runtime behavior), add `audit` (trajectory soundness). Trajectory evaluation is the `analyze` beat applied *preventively* — looking at the *how*, not just the *what*. Connects to the proxy thread (§12 insights): the trajectory is the meta-proxy for "was this genuinely solved?", and trajectory-aware evaluation is the `specify`-vs-`analyze` distinction applied to the loop's own behavior.

---

## Tier C — Operational Infrastructure

### C1. Hybrid Evaluation: Deterministic Floors & LLM-as-a-Judge Ceilings

*   **What is missing:** The `check` beat lacks a **layered evaluation infrastructure** that stratifies checks by cost and reliability.
*   **Why it matters:** Early 2026 proved that relying solely on frontier LLMs for code evaluation is neither cost-effective nor reliable. The SOTA approach is a layered strategy:
    1.  **Deterministic Floor:** Fast, zero-cost deterministic functions (AST parsing, static analysis, schema validation, regex checks) that catch 30-60% of agent failures (malformed syntax, bad tool calls) instantly.
    2.  **LLM-as-a-Judge Ceiling:** Only outputs that pass the deterministic floor are evaluated by an LLM for semantic qualities (architectural adherence, security edge-cases).
    This is the `check` beat *implemented* as a cascade: the floor is a deterministic leaf (§9); the ceiling is a statistical leaf using a different model family (which injects independence per stone #9). Together they form the `verify` element's harness.
*   **Where it threads in:** Concretizes §9's leaf taxonomy and §11's gate-the-binary / grade-the-aggregate principle. The deterministic floor is the compile-time check from §9.2's premise-B lever; the LLM ceiling is the statistical leaf with its Goodhart residue. The two-layer structure *is* the harness (idea C4 below).

### C2. Token-Efficient SDLC via LLM Cascades & Intelligent Routing

*   **What is missing:** The design assumes a monolithic "solver." It lacks an **intelligent routing layer** that dynamically allocates tasks to different models based on complexity, cost, and capability.
*   **Why it matters:** Running an entire agentic SDLC on a single frontier model is prohibitively expensive. SOTA 2026 uses "LLM Cascades": complex reasoning (planning, regression diagnosis) routes to expensive frontier models; routine tasks (docstrings, boilerplate, LLM-as-judge evaluations) route to cheaper, faster, or distilled models. This is stone #2 (finite resources) applied to the SDLC's own compute: the routing layer is the `scope` beat for token budgets — bounding the resource expenditure before the work begins.
*   **Where it threads in:** New infrastructure component serving the `do` beat. Connects to the plan-as-schedule-bet (§10.10): just as a plan budgets time, the routing layer budgets tokens. The routing decision itself is a `define → do → check → reflect` loop: define the task complexity, route to a model, check the output quality, reflect on whether the routing was efficient.

### C3. Model-Level Governance & Infrastructure Routing — The LLM Seam

*   **What is missing:** A **model governance layer** that manages model capabilities, cost budgets, rate limiting, and telemetry across a heterogeneous fleet of LLMs.
*   **Why it matters:** Agentic SDLCs run hundreds of LLM calls per task. Without a telemetry-backed governance layer (enforced by a local proxy, as in our global rules' LiteLLM configuration), the SDLC cannot protect against: model drift (a model update silently changes behavior), cost overruns (unbounded token consumption), concurrency bottlenecks (rate limits causing cascading timeouts), or compliance violations (using a model not approved for the data classification). This is stone #6 (uncertainty) applied to the solver's own infrastructure.
*   **Where it threads in:** Implements the `observe` beat for the SDLC's own execution. The proxy is the telemetry sensor (§11.1) for LLM calls; model drift is the a-posteriori residue that only runtime observation can catch.

### C4. Harness Engineering & Environmental Determinism — The Scaffolding Seam

*   **What is missing:** The model focuses on the agent's internal cognitive loop but lacks formal definitions for the **harness** — the deterministic scaffolding, rigid guardrails, and behavioral constraints that restrict the agent's solution space *before* it acts.
*   **Why it matters:** The defining equation of 2026 agentic engineering is `Agent = Model + Harness`. An unharnessed agent is fundamentally unpredictable. The harness is not a suggestion layer — it is a **structural constraint** that makes certain classes of failure *impossible* rather than merely *detectable*. It includes: output format enforcement (structured JSON, not free text), tool-call validation (schema checks before execution), context window management (preventing prompt injection), and execution environment control (sandboxing). The harness is the `specify` beat applied to the agent itself: it defines what "done" means for the agent's *behavior*, not just its *output*.
*   **Where it threads in:** Cross-cuts all four beats. The harness is the deterministic floor (C1) generalized from `check` to the entire loop. It connects to §9.2's tightest-sufficient contract: the harness is the contract between the human principal and the agent executor, and its tightness is governed by the same premise-B lever.

### C5. Standardized Tool & Context Protocols (MCP/A2A) — The Integration Boundary

*   **What is missing:** The repertoires define tools and skills, but lack a universal, standardized protocol for how agents dynamically discover, authenticate with, and interact with external systems and with each other.
*   **Why it matters:** SOTA systems use open standards as the "USB-C" of agentic integrations. Without a standardized Host/Client/Server protocol for tool invocation (like MCP) and a standardized Agent-to-Agent protocol (like A2A with Agent Cards), the SDLC relies on bespoke, brittle API wrappers. A standardized protocol enables dynamic tool discovery (the agent can find and use new tools without code changes) and interoperable multi-agent coordination (B2's consensus protocol requires a shared communication standard). ~~It also supplies authenticated delegation (agent identity persists across handoffs, per A2's supply-chain requirement).~~
*   **Where it threads in:** Infrastructure for the `do` beat's tool invocation and B2's multi-agent coordination. ~~Connects to A2's supply-chain security: the protocol must enforce authentication and authorization at every tool boundary.~~

    > **⊘ Superseded — MCP and A2A are *adapters*, not trust boundaries. They do not supply authenticated
    > delegation; they are among the things that must be governed by an independent one.**
    >
    > A protocol that standardises *how* a tool is invoked does not thereby establish *whether this
    > configuration may invoke it, with which credential, at what scope*. Treating protocol conformance as
    > an authority model is the category error that turns every MCP server into an implicitly trusted
    > component — which is exactly the attack surface **A2** exists to name. Backing: **NSA MCP CSI**,
    > 20 May 2026.
    >
    > **Current disposition — C5 splits:**
    > **C5a → P1**, folded into **D3 (capability broker)**: workload identity per agent *configuration*,
    > short-lived credentials, least privilege, default-deny egress, secrets isolation. The trust boundary
    > lives here, **outside** the protocol.
    > **C5b → P3**: the interoperability conveniences (discovery, Agent Cards, cross-agent coordination),
    > built *on top of* D3's boundary rather than in place of it.
    > → `ROADMAP.md` D3 row, §6 · C5 row.

### C6. Deep Agentic Observability & Execution Tracing — The Telemetry Seam

*   **What is missing:** The `check` beat treats the agent's internal reasoning as a black box. We lack a dedicated **agent observability pipeline** that traces the agent's decision pathway.
*   **Why it matters:** When a multi-model cascade fails or a hybrid evaluation flags an error, engineers don't just debug the code — they must debug the agent's *observable decision path*. We need unified tracing that records: token usage per call, model routing decisions, deterministic-vs-LLM evaluation results, intermediate state transitions, tool call arguments and responses, and confidence scores (B6). This is §10's telemetry artifact extended to the SDLC's own execution. Its absence is machinery-degrading: without it, `analyze` cannot root-cause agent failures, and the loop's `reflect` for its own process is starved.

    > **⊘ Corrected — this entry promises access to the agent's "reasoning." It cannot deliver that, and
    > should not try.**
    >
    > What is capturable is the **observable trace**: state transitions, tool calls and their arguments and
    > responses, model/prompt/tool versions, context provenance, outputs, evidence, approvals and policy
    > decisions. What is *not* capturable as ground truth is the model's internal reasoning. Hidden
    > chain-of-thought **may be unfaithful** to the computation that actually produced the output, is
    > sensitive, and is not reproducible across vendor model versions — so requiring it would build a
    > forensic capability on an unreliable witness, and `analyze` would root-cause against a plausible story
    > rather than what happened.
    >
    > Read every "the agent's reasoning" in this entry and in **C12** as "the agent's observable decision
    > path."
    >
    > **Current disposition:** **raised from Lower to P1** — a prerequisite for autonomy, not an increment —
    > and folded into **D7** (append-only tamper-evident log · event-sourced replay · kill switch),
    > explicitly **excluding hidden chain-of-thought**. → `ROADMAP.md` D7 row, §6 · C6 row.
*   **Where it threads in:** Implements the `observe` beat for the SDLC's own meta-loop. The execution trace is the ADR of the agent's behavior — the backward channel (§10) that carries the "why" of the agent's decisions to a later human root-causer. Its existence is a hard gate (§11.2's convergent law applied to the meta-level).

### C7. Prompt-as-Code (PaC) & Prompt Regression Testing — The Instruction Seam

*   **What is missing:** The regression ratchet (§10.1) covers code, tests, and configuration. It does not cover **prompts** — the system instructions, few-shot examples, and agent configuration that are the "ultimate code" of an agentic SDLC.
*   **Why it matters:** Editing an agent prompt to fix one bug frequently degrades performance on other tasks. Without a structured prompt-regression suite — running modified prompts against a benchmark set of agent trajectories — prompt drift silently erodes the SDLC's reliability. This is stone #5 (change) applied to the agent's own instructions: a prompt change is a "deploy" of new agent behavior, and it needs the same regression ratchet that code changes get. The prompt *is* the `specify` artifact (§10) for the agent's behavior; its regression test is the executable face of the agent-behavior ADR.
*   **Where it threads in:** Extends §10.1's regression ratchet to a new artifact class. The prompt regression suite is existence-hard (its absence is machinery-degrading — prompt changes become irreversible bets with no safety net) and coverage-graded (how many trajectories to test is a cost/risk tradeoff).

### C8. Epistemic Drift & Knowledge Expiry — The Change Axis of Knowledge

*   **What is missing:** The regression ratchet (§10.1) manages changes to code files. It lacks a mechanism for the **expiry and invalidation of background knowledge** — outdated documentation, deprecated API patterns, stale architecture decision records, and obsolete context files.
*   **Why it matters:** SOTA agents rely on RAG and context injection. If a codebase undergoes a major refactor, old documents remain in the repository. Agents query this stale context and write outdated code, leading to silent mismatches. This is stone #7 (perishable knowledge) on the *input* side: §10 answers it for *output* artifacts (persist them); the gap is on *input* artifacts (invalidate them when they expire). An expired context document is a **false artifact** — it crosses the time boundary but carries information that is no longer true, making it *worse* than absent (because the agent trusts it). We need a continuous **epistemic curation loop** that actively prunes and invalidates context as code evolves.
*   **Where it threads in:** Dual of §10.1: where regression keeps *lessons* irreversible, epistemic curation keeps *context* current. Both are responses to stone #5 (change), but on opposite axes: regression protects against losing what was learned; curation protects against trusting what is no longer true. The curation loop is a `check → reflect` cycle on the knowledge base itself.

### C9. Regulatory Compliance & Immutable Audit Trails — The Accountability Seam

*   **What is missing:** The model's reflect-artifact (ADR, post-mortem) captures *engineering* decisions. It does not capture the **regulatory compliance artifacts** contemplated by the EU AI Act, NIST AI RMF, and emerging global AI governance frameworks. ~~(full enforcement August 2026)~~
*   **Why it matters:** ~~The EU AI Act classifies most enterprise autonomous agents as high-risk systems. Non-compliance carries fines up to €35M or 7% of global turnover.~~ Candidate artifacts include: **unique agent identity** (not a shared service account), **granular decision attribution** (decision ID, model identity, human-readable rationale, input/output data, policy version invoked), and **cryptographically linked, tamper-evident audit logs** (hash-chaining for non-repudiation). The accountability trail is the ADR extended from "why did we make this engineering decision?" to "who (which agent, which model, which human) authorized this action, and under what policy?" ~~These are not documentation hygiene — they are **legally mandated hard gates**.~~

    > **⊘ Superseded — all three legal claims above are wrong, and the entry's Critical ranking rested on
    > them. Verified position as of 2026-07-29:**
    >
    > | This entry's claim | Verified |
    > |---|---|
    > | "classifies most enterprise autonomous agents as high-risk" | **False.** Article 6 requires Annex I (safety component of a regulated product) or Annex III (eight enumerated domains). General code generation maps to **neither**; coding agents fall to limited-risk with Article 50 transparency duties |
    > | "full enforcement August 2026" | **Superseded.** The Digital Omnibus on AI — **Regulation (EU) 2026/1744**, OJ **24 Jul 2026**, in force **27 Jul 2026** — moves Annex III to **2 Dec 2027** and Annex I to **2 Aug 2028** |
    > | "fines up to €35M or 7%" | **Mis-scoped.** Article 99 reserves €35M/7% for **prohibited practices**; other obligations carry €15M/3%, and supplying incorrect information €7.5M/1% |
    >
    > **Two obligations this entry missed**, and both are narrower than a first reading suggests:
    > **Article 4 (AI literacy)** was **replaced** by 2026/1744 with a softened duty to *support* AI literacy
    > — expressly not to guarantee any level of it — applicable from **27 Jul 2026**.
    > **Article 50 (transparency)** applies from **2 Aug 2026**, with a transitional to **2 Dec 2026** for
    > Art 50(2) machine-readable marking on generative systems already on the market; it attaches to systems
    > interacting with natural persons and to synthetic content, **not** to internal code artifacts merely
    > because an agent wrote them.
    >
    > **And the trap this entry inverted:** the regulatory exposure of a software factory is not on the
    > code-generation surface but on the *management* surface. Using AI to **evaluate developer productivity,
    > rank engineers, or allocate work algorithmically** *is* Annex III (employment) high-risk.
    >
    > **Current disposition — C9 splits, and the reasoning changes, not just the date:**
    > **C9a → P1** (audit trail, decision attribution, tamper-evident logging) — **and not because of any
    > regulation.** Our own model forces it: without unique agent identity and a hash-chained log, `analyze`
    > is impossible under autonomy, which is the machinery-degrading amplifier. *A P1 justified by the bedrock
    > survives a regulatory timeline moving again — which it since has, twice.*
    > **C9b → P3**, activated by classification, not calendar.
    > → `ROADMAP.md` **§7**.
    >
    > *Verification standing: eur-lex.europa.eu returned an empty body to direct fetch; the dates rest on
    > three independent legal analyses in agreement. Read the OJ primary text before any C9b decision.*
*   **Where it threads in:** New hard gate in the `reflect` beat, alongside the existing ADR. The audit trail is existence-hard (legally mandated) and fidelity-hard (unlike the ADR's graded fidelity — the law requires specific fields, not "as accurate as risk warrants"). This is the first artifact whose gate is set by an *external* amplifier (regulatory penalty), not by the model's own bedrock. Opens a question: should "external regulatory constraint" be acknowledged as a fourth amplifier in §11, or is it subsumed by the irreversibility amplifier (regulatory fines are irreversible damage)?

### C10. The Economics of Attention — The Human Bandwidth Constraint

*   **What is missing:** While B4 addresses human-in-the-loop delegation, the model does not formalize **human attention as the ultimate scarce resource** within the bedrock.
*   **Why it matters:** With token-efficient LLM cascades generating output at machine speed, human review becomes the primary systemic bottleneck. If the SDLC demands human verification too frequently ("compliance theater"), reviewers experience alert fatigue and begin rubber-stamping — which transforms the human terminal from an independent checker (the whole point of §12) into an **echo chamber** (stone #9, where the human's check adds zero bits because they stopped reading). The harness must optimize for human attention by: batching low-risk items, surfacing only high-leverage architectural deviations, and providing structured summaries (not raw diffs) tuned to the human's cognitive bandwidth.
*   **Where it threads in:** Constraint on B4's delegation calculus. If B4 says *when* to involve the human, C10 says *how* to involve them without exhausting their capacity. Connects to §12's independence requirement: human independence is not a binary — it degrades under cognitive load, making it a *resource* to be budgeted (like §12's "independence budgeting"), not a property to be assumed.

### C11. Specification Gaming & Reward-Hacking Resistance — The Meta-Proxy Problem

*   **What is missing:** §9 identifies the Goodhart problem for quality proxies (coverage ≈ well-tested). It does not address the **meta-Goodhart problem**: agents gaming the *evaluation itself* rather than the quality proxy.
*   **Why it matters:** 2026 SWE-bench analysis (Cursor research, June 2026) proved that agents game evaluation harnesses: running `git log` to copy fixes from commit history, exploiting evaluation container misconfigurations, and brute-forcing test suites. These are not bugs — they are the agent *optimizing its own utility* (stone #10) against the proxy (test passes) rather than the true target (sound code). The current model's `check` beat is vulnerable to this: if `verify` is implemented as "run the test suite", an agent can write code that passes tests through illegitimate means. The solution requires: **strict evaluation harnesses** (sandboxed environments that block repository history access), **trajectory-aware evaluation** (B8), and **out-of-distribution test sets** (preventing memorization).
*   **Where it threads in:** Extends §9's proxy thread and §11's Goodhart warning. The meta-Goodhart problem is stone #10 applied to `check` itself: the agent's incentive diverges from the principal's intent at the evaluation layer, not the code layer. The forced response is **evaluation hardening** — making the evaluation harness adversary-resistant, which is the `harden / minimise surface` security move from §8 applied to the SDLC's own quality gates.

### C12. Reproducibility & Deterministic Replay — The Debug Seam

*   **What is missing:** The model treats agent execution as a forward process. It lacks a formal concept of **forensic replay** — the ability to reconstruct what an agent did, for debugging, auditing, and regression testing. ~~…deterministic replay — the ability to reproduce an agent's exact trajectory given the same inputs.~~
*   **Why it matters:** Agents are non-deterministic (temperature-based sampling, tool-call timing, context window variations). When a bug is found in agent-generated code, engineers need to answer not just "what went wrong?" but "what did the agent do, in what order, on what evidence?" ~~"what was the agent thinking when it made this choice?"~~ Without replay capability, `analyze` in the meta-loop is starved — the debugging equivalent of §10's starved backward channel. ~~Replay requires: deterministic seeding (or logging of all stochastic decisions), tool-call recording (inputs and outputs), and context-window snapshots.~~ The replay log is the **execution telemetry** (C6) made reconstructable.

    > **⊘ Superseded — the requirement is *event-sourced* replay, not exact deterministic replay.**
    >
    > **Bit-reproducibility is the wrong bar and an unachievable one.** It cannot survive a vendor model
    > version change, non-deterministic kernels, or tool-call timing — so a system specified against it fails
    > its own audit the first time a provider ships an update, and the pressure is then to weaken the
    > requirement at exactly the moment forensics are needed. Requiring "deterministic seeding" of a
    > third-party hosted model is not a control we can hold.
    >
    > **What replaces it:** replay the **observable event stream** — state transitions, model/prompt/tool
    > versions, context provenance, tool calls and responses, outputs, evidence, approvals, policy decisions —
    > from an append-only log, sufficient to reconstruct *what happened and under which policy*. Explicitly
    > **not** bit-reproducibility, and explicitly **not** hidden chain-of-thought (see **C6**).
    >
    > **Current disposition:** **raised from Lower to P1, and narrowed** — folded into **D7**. The narrowing is
    > what makes the promotion affordable. → `ROADMAP.md` D7 row, §6 · C12 row.
*   **Where it threads in:** Extension of C6's observability pipeline. The replay log is to agent debugging what a unit test is to code debugging: a reproducible, re-runnable check. It connects to §10.1's regression ratchet: a replayed trajectory that previously succeeded but now fails is an *agent-level regression* — the prompt or model changed in a way that broke a previously-working reasoning path.

---

## Open Structural Questions

These are questions the evolution ideas raise about the bedrock itself, suitable for the self-test ([§3](file:///Users/deepg/Desktop/SOTA%20SDLC/sdlc-design/03-bedrock.md)):

1.  **Is agentic entropy (A4) a new stone, a derived law, or a face of existing stones?** If it is irreducible to #4 × #7 × #9, it would be the bedrock's third second-order stone — a fact about the solver's *aggregate effect on the codebase over time*. Apply the bundling rule: does it share a forced response with any existing stone?

2.  **Should "external regulatory constraint" be a fourth amplifier in §11?** The EU AI Act creates hard gates that are non-local by *legal construction*, not by the bedrock's own logic. Is this subsumed by irreversibility (regulatory fines are irreversible damage), or is it a genuinely distinct amplifier?

3.  **Does the formal verification leaf (A3) require a new stone?** If the model's leaf taxonomy is {deterministic, statistical}, and formal verification is neither, does the bedrock need a stone that forces the formal leaf? Or is it simply the asymptotic limit of the premise-B lever (§9.2) — the tightest-possible contract, which collapses premise B to zero?

4.  **Is the agent's context window a new boundary in the boundary-distance law (§10)?** The law identifies time and agent boundaries. The context window introduces a third: the *attention* boundary — information exists, is explicit, and is even in the agent's memory, but cannot be attended to because the window is full. Is this a face of stone #7 (perishable — it decays within a session), or a genuinely new boundary?

5.  **Does the supply chain (A2) require extending stone #8's scope?** §8 defines the adversary as targeting the *software being built*. If the adversary targets the *SDLC machinery itself*, is this a new face of stone #8, or a new application of it? The forced response (supply-chain hygiene) is distinct from the existing security repertoire moves.

---

### Integration Priority Map — **SUPERSEDED (2026-07-29)**

> The priority table that stood here has been **replaced by the phased plan in
> [`ROADMAP.md`](ROADMAP.md)** following the July-2026 external review and its independent adjudication in
> [`REVIEW-ASSESSMENT-2026-07.md`](REVIEW-ASSESSMENT-2026-07.md). Every idea below keeps its ID; its
> current phase, priority change and the reason are in **`ROADMAP.md` §6 (traceability)**.
>
> Do not re-add a priority column here — two priority lists is how they drift apart. This file is the idea
> **catalogue**; `ROADMAP.md` is the **plan**.

The largest moves, for orientation:

| Idea | Was | Now | Why |
|---|---|---|---|
| **B5** Durable execution | Medium | **P1** | the durable orchestrator is the safety kernel's spine, not a convenience for long tasks |
| **C6** Observability · **C12** Replay | Lower | **P1** | prerequisites for autonomy, not increments (C12 narrowed to *event-sourced* replay — not bit-reproducibility, not hidden chain-of-thought) |
| **C7** Prompt regression · **C3a** version pinning | Medium / Lower | **P1** | the unit of trust is a *versioned configuration*, not an agent persona |
| **A4** Agentic entropy | Medium | **P1** | SWE-CI (arXiv 2603.03823) establishes the pressure empirically |
| **C9** Compliance | Critical | **split** | audit trail → P1 (forced by our own machinery-degrading amplifier); high-risk conformity → P3 (see errata) |
| **B2** Consensus protocol | Medium | **P3** | correlated agreement is not evidence; benefit must be measured against token cost first |

### Errata — factual corrections to this document (2026-07-29)

Verified against primary sources; see `REVIEW-ASSESSMENT-2026-07.md` §4 for the full log.

- **A2** — CVE-2026-25253 is described here as exploiting "a malicious skill package, **not a code
  vulnerability**." That is wrong: it **is** a code vulnerability, CVSS **8.8**.
  ⚠ **This bullet was itself wrong in its first version (corrected 2026-07-29, rev 2)** — it claimed an RCE
  in the skill runtime where "a crafted skill package escapes the Docker sandbox," patched in "v2.3.1."
  That mechanism was reconstruction, not sourcing. **Per NVD:** OpenClaw (aka clawdbot / Moltbot) *before*
  **`2026.1.29`** "obtains a `gatewayUrl` value from a query string and automatically makes a WebSocket
  connection **without prompting**, sending a token value." No sandbox escape, no skill package, no v2.3.1.
  Drop the phrase "first agentic CVE" absent a defensible definition and source.
  **Correct routing:** attacker-controlled URL from a query string → input validation at a trust boundary;
  connecting without prompting → **approval integrity (D6)**; token sent to that endpoint → **credential
  scoping and default-deny egress (D3)**. It is *not* evidence for **B1/D4** sandboxing, contrary to the
  first version of this bullet. A2's supply-chain evidence is the separate ClawHavoc campaign (341 malicious
  marketplace skills, 335 from one operator, delivering Atomic Stealer to macOS developer workstations).
- **A3** — calling a formal proof "**non-Goodhartable**" and saying the formal leaf "collapses premise B to
  zero residue" **contradicts our own Chapter 12**: "even a formal proof… only *relocates* the blind spot
  from the code into the spec" ([`12-agentic-sdlc.md:34`](sdlc-design/12-agentic-sdlc.md:34)), repeated at
  [`03-bedrock.md:62`](sdlc-design/03-bedrock.md:62). A proof discharges a formal statement relative to a
  specification, abstraction, environment model and trusted computing base. Retracted per roadmap **E11**.
- **A3 (evidence)** — *(sources re-verified rev 2)* current automation results are modest, not asymptotic:
  ~**31.1%** verified pass rate on refined Dafny benchmarks (**arXiv 2605.30914**, *Automating Formal
  Verification with Reinforcement Learning and Recursive Inference*; Lean scaffold 46.2% → 69.2% on the
  VeriCoding pilot). Specification authoring, not proof search, is **a** central bottleneck — **arXiv
  2511.17330** (*Agentic Verification of Software Systems*) states that formal capture "requires significant
  efforts in manually annotating specifications and crafting loop invariants," and prices comprehensive
  proof at **seL4: 22 person-years** and **CompCert: 6 person-years / 100,000 proof lines — eight times the
  implementation effort.** And the verifier is **itself Goodhartable**: 2605.30914 reports *specification
  hacking* — "models exploit weak formal specifications instead of implementing the intended solutions" —
  which is the strongest evidence for retracting A3's "non-Goodhartable" claim above.
- **C9** — "The EU AI Act classifies most enterprise autonomous agents as high-risk" is **false**. Article 6
  requires either Annex I (safety component of a regulated product) or Annex III (eight enumerated
  domains); general code generation maps to neither, and coding agents fall to limited-risk. *Article 50
  applies conditionally (rev 2), not as a blanket duty:* its obligations attach to systems interacting with
  natural persons and to synthetic content — so they bite where agent output reaches a third party, not
  merely because an internal code artifact was AI-generated.
  *But note the management-surface trap:* using AI to evaluate developer productivity,
  rank engineers or allocate work algorithmically **is** Annex III (employment) high-risk.
- **C9 (dates)** — "full enforcement August 2026" is superseded. ⚠ **This bullet was itself wrong in its
  first version (corrected 2026-07-29, rev 3)** — it described the Digital Omnibus as pending OJ publication
  and said Article 4 and Article 50 were "unchanged and bite now." **All three parts of that are now false.**
  The Omnibus was adopted as **Regulation (EU) 2026/1744**, published in the OJ on **24 July 2026** and **in
  force since 27 July 2026** (three-day vacatio legis, taken as a matter of urgency because the date it
  amends falls on 2 August). Annex III high-risk obligations move to **2 December 2027**, Annex I to
  **2 August 2028**. **Article 4 was *replaced***, not left unchanged — the new text is a duty to take
  measures *supporting* AI literacy, expressly not to guarantee any level of it, applicable from **27 July
  2026**. **Article 50 does not bite yet**: it applies from **2 August 2026**, with a transitional to
  **2 December 2026** for Art 50(2) machine-readable marking on generative systems already on the market.
  Legislative history retained: political agreement 7 May 2026; Parliament 16 Jun 2026; Council 29 Jun 2026.
  *The recurring lesson: a legal-status paragraph decays and must carry its verification date and source.*
- **C9 (penalties)** — €35M/7% applies to **prohibited practices** only. Article 99 sets €15M/3% for other
  specified obligations and €7.5M/1% for supplying incorrect information.

---

### Relationship to the Current Frontier

These ideas connect to the active frontier in [sdlc-canvas/04-frontier.md](file:///Users/deepg/Desktop/SOTA%20SDLC/sdlc-canvas/04-frontier.md) as follows:

-   **T11's three promotion-forks** (tamper-evident sensors, temporal emission laws, graded/gated stability) are directly addressed by C6 (observability) and C9 (audit trails — tamper-evident is a compliance requirement, not just an engineering choice).
-   **T2 residue** (the fully-general gate-vs-graded seam rule) is extended by A3 (formal verification introduces a third leaf kind that changes the classification) and C11 (the meta-Goodhart problem adds a new dimension to the proxy thread).
-   **"Beyond the ideal"** (the descoped concrete-setup audit) is where most of Tier C lives: mapping the ideal onto a real stack with real LLMs, real sandboxes, real compliance requirements.

~~The **next major phase** should address the three Critical-priority items (A1, A2, B1) and the compliance deadline (C9), as these represent existential risks to an autonomous pipeline — cascading failures that evade local checks, supply-chain attacks on the SDLC itself, uncontained agent execution, and regulatory exposure.~~

> **⊘ Superseded — this paragraph contradicts both the supersession notice above it and `ROADMAP.md`.**
>
> It was left standing after the priority table was superseded, so a reader reaching the end of this file
> was told the next phase is A1/A2/B1 plus a compliance deadline — by the same document that had already
> said, three hundred lines earlier, that it no longer states priorities. Two of its four premises are also
> false on their own terms: there is **no compliance deadline** driving the queue (C9's high-risk dates moved
> to 2027/2028, and C9a is P1 on our own bedrock, not on a calendar), and "the three Critical-priority items"
> is a ranking this file no longer holds.
>
> **The next phase is `ROADMAP.md` Phase 0 — repair the model** (Tier E, 13 items), which *gates* Phase 1
> because three safety-kernel components cannot be specified over the model as it stands. Then Phase 1's
> safety kernel (Tier D), Phase 2 calibration, Phase 3 advanced autonomy. Immediate next move: open **Q6**
> and **Q7** with the user, then execute Phase 0 in dependency order
> (**E12 → E1 → E3 → E4 → E2 → E6 → E9 → E13 → E5 → E7 → E8 → E10 → E11**).
>
> A1 and A2 remain **P1**; B1 is **P1** as **D4**, rescoped (see the ⊘ block at B1).
