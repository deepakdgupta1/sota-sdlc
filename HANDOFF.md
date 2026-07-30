# Handoff — SDLC First-Principles project

_A living, Socratic, first-principles derivation of what makes a software-development
lifecycle **reliable, predictable, resilient, and secure** — captured as a set of source-of-truth
markdown files and a local dark-themed website that renders them live._

Written for a **fresh Claude session** picking this up cold. Read this, then read the
source-of-truth files.

---

## 1. Read these first, in order

1. **The canvas — `sdlc-canvas/` (8 part files, listed in order in `sdlc-canvas.parts.json`)** —
   the **source of truth**. Split by scope for maintainability, it holds the whole derived model,
   an **`▶ RESUME INSTRUCTIONS`** section (the method — obey it; in `00-framing.md`), a
   `§11 Current frontier` (where to resume; `04-frontier.md`), an iteration log
   (`06-iteration-log.md`), and the machine-readable diagram data (`07-interactive-diagrams.md`).
   It is designed to be resumed from *by itself*.
2. **This file** (`HANDOFF.md`) — project map + how to run the website.
3. Memory: `/Users/deepg/.claude/projects/-Users-deepg-Desktop-agent/memory/` →
   `socratic-first-principles-living-doc.md` (how the user likes to learn/architect).

## 2. File map

| path | role |
|---|---|
| `sdlc-canvas/` (8 parts) + `sdlc-canvas.parts.json` | **source of truth for *reasoning*** — the canvas, split by scope into 8 maintainable part files (framing · model · mechanism-of-Done · frontier · laws · iteration log · interactive-diagram data); the manifest lists them in order. Model, resume instructions, open-tracks register (§11), log, embedded diagram data |
| `sdlc-design/` (14 parts) + `sdlc-design.parts.json` | **source of truth for *understanding*** — the clean design snapshot, split into **one file per chapter** (front-matter, ch1–12, appendices): what/why/how prose, 21 inline charts, glossary, roadmap in Appendix C. Regenerated from the canvas when the model advances; at **full iteration-35 parity** (fold-in done as canvas iter 36 — ten-stone bedrock, the second-order tier, #10 in the L0/bedrock/L4 charts) |
| `index.html` | the canvas viewer — fetches the manifest, concatenates the parts, renders live, and hoists diagram blocks into one tabbed editable panel |
| `sdlc-design.html` | the design viewer — same manifest-and-concatenate fetch; charts inline in context, zoom-in/out chips, floating chart ladder |
| `ROADMAP.md` | **source of truth for *what's next*** — the phased plan (Phase 0 model repairs → 1 safety kernel → 2 calibration → 3 advanced autonomy), the new **Tier E** (model repairs) and **Tier D** (control plane) registers, traceability for every prior A/B/C/T item, and the open-questions register Q1–Q10. Supersedes the priority table in `sdlc-evolution-ideas.md` |
| `REVIEW-ASSESSMENT-2026-07.md` | the adjudication of the July-2026 external review: 14 dispositions with justification (**1 agree · 8 partial · 4 disagree · 1 withdrawn**), 12 accepted findings, **4** errors found in our *own* docs (R1–R4; **R5 was reclassified at rev 2 as an evidence upgrade, not an error**), and a verification log for every external citation. **At rev 3.** Rev 2 verified the reviewer's round-2 response — D1/D10/D12 → PARTIAL, **D11 withdrawn**, D14 repaired, **R3's CVE mechanism retracted as our own fabrication**. Rev 3 audited the file against *itself* — **D3 → AGREE**, D2's count corrected, D9's scope sentence corrected from the primary text, the **EU AI Act status moved from forecast to in-force law**, and the **LiteLLM "cost is handled" claim falsified**. §6 and §7 carry the rev-2 and rev-3 scorecards; **read both before citing any figure from this file** |
| `sdlc-evolution-ideas.md` | the **idea catalogue** (Tiers A/B/C, 24 entries + 5 open structural questions). Its priority table is superseded — read `ROADMAP.md` for priorities; the errata block at its foot lists its own factual corrections |
| `.claude/launch.json` | preview server configs — **`canvas`** on port 4321, **`design`** on port 4330; either serves the whole folder, so both pages are reachable from either port. *(Created 2026-07-29. This row described the file for some time while it did not exist — the config was reconstructed from the ports documented in §3.)* |
| `HANDOFF.md` | this file |

## 3. Run the website (localhost only)

The page **must be served over http** (it `fetch()`es the markdown; `file://` is blocked).

- **In Claude Code:** `preview_start` with name **`canvas`** (already in `.claude/launch.json`),
  then open the preview. It runs `python3 -m http.server 4321` at the repo root. Use name
  **`design`** (port 4330) for the design-doc viewer — or just open `/sdlc-design.html` on
  either port.
- **Manually:** from the repo root, `python3 -m http.server 4321` → open
  `http://localhost:4321` (canvas) or `http://localhost:4321/sdlc-design.html` (design doc).

## 4. What the website does

- **Hot-linked content.** Fetches the manifest (`sdlc-canvas.parts.json` or
  `sdlc-design.parts.json`), then every part file it lists, and concatenates them in order — all
  with `cache:no-store` — on load, and **polls every 3.5 s** (the *Auto-sync* toggle in the
  header). Edit any part file and the site updates within a few seconds; the *Refresh* button
  forces a reload. Auto-sync pauses while you're renaming a node or in fullscreen so it never
  clobbers an in-progress edit.
- **Rendering.** Markdown via `marked`; auto-built sidebar TOC + scrollspy, top progress bar,
  section reveal-on-scroll, dark "glass" styling.
- **Interactive diagrams.** Any fenced ` ```pipeline-graph ` block in the markdown is *hoisted*
  out of the prose and rendered as a live **Cytoscape** canvas in the "Interactive model
  canvas" panel (one tab per diagram).

### Diagram controls (per canvas)
- **Navigate:** drag background to pan · scroll to zoom · drag a node to move it.
- **Edit:** double-click a node to **rename** · double-click empty space to **add** a node ·
  select + **Delete** to remove · **Connect** mode = click source then target to add an edge.
- **Toolbar:** `＋ Node` · `⇢ Connect` · `✕ Delete` · `⊹ Fit` · `✦ Tidy` (auto-layout) ·
  `⟲ Reset` (reload from the markdown) · `⤓ Export` (copy JSON to clipboard) ·
  `⛶ Pop out` (toggle **full-screen** canvas — same editable instance; `Esc` exits).

### Persisting diagram edits back to the markdown
In-browser edits are client-side/ephemeral. To make them permanent: click **⤓ Export** on a
diagram → it copies a ` ```pipeline-graph ` block to the clipboard → paste it over the matching
block in its **part file**. For the canvas, every diagram lives in
`sdlc-canvas/07-interactive-diagrams.md` (the **"## Interactive diagrams"** section); for the
design doc, each chart sits inline in its chapter file under `sdlc-design/`. This keeps "visuals
regenerable from the file," which is the doc's stated philosophy.

## 5. Diagram data model (to add or change a diagram)

Add a fenced block to the markdown:

~~~
```pipeline-graph
{
  "title": "My diagram",
  "nodes": [ {"id":"a","label":"A","group":"beat","x":0,"y":0} ],
  "edges": [ {"source":"a","target":"b","dashed":true,"label":"…","member":true} ]
}
```
~~~

- `group` → colour: **beat** (purple) · **element** (teal) · **stone** (coral) ·
  **repertoire** (amber) · **property** (pink) · **terminal** (gray).
- `edge.dashed` = pink dashed feedback edge · `edge.member` = faint structural link (no arrow) ·
  `edge.label` = small caption.
- `x`/`y` are preset positions (nodes stay draggable).

## 6. The model in one breath (so you have the gist)

**Eight bedrock stones** (brute facts: intent-hidden · finite · complex · we-err · change ·
uncertain · **distributed & perishable** · **adversarial actors**; **+ two conditional second-order stones on
a formalized tier — #9 `reflexivity` (independence, the autonomous multi-agent case) and #10
`incentive-divergence` (alignment, the delegated case)**) **force** a single control loop
**`define → do → check → reflect ↺`**, where `reflect` = **analyze** (frame + root-cause) then
**decide** (*accept* a known issue · *re-target* · *escalate*). The loop is **staffed by
verb-named elements** (specify, scope, design, implement, verify, observe, analyze, decide) —
and **every element is itself the same loop** (the down-fractal), so beats are
scale-invariant while elements get finer. The loop's **behaviours** produce **four emergent apex
properties** in two families — **point** (at one context): reliable (loop *converges*) · predictable
(loop *bounded*); **envelope** (over context-hardness × time): resilient (loop *nests & escalates*, vs
**random** hardness #5/#6) · **secure** (loop *preempts* — red-teams its own inputs, vs a **directed**
adversary #8). An **evolve** feedback re-targets the whole thing (the Ouroboros). Stone #7 forces
**artifacts** — the persistent, explicit carriers of a loop's target/result/lesson across the *time*
and *agent* boundaries. A rule is a **hard gate** (non-waivable) iff a single violation is **non-local**
(adversary-amplified · irreversible · machinery-degrading); else it is a **graded target** (§10.4).

The later layer (iters 29–33): `reflect`'s artifact is the loop's only *backward* channel (forced hard
gate, §10.5); `observe` must own a real sensor — telemetry = detector + `analyze`'s actual operand
(§10.6); ceremony is **proportional insurance** — a beat collapses toward bare `do` where its stone is
absent, except at gates (§10.7); stone #5 forces the **regression ratchet** (lessons compiled into
auto-firing checks; existence-gated) and **rollback** (graded, with the hard gate at its irreversible
*limit*) (§10.8); observability **gates the per-seam binary on silent failure and grades the aggregate**
(§10.9); the lifecycle is a **projection** — `implement` = base act, `release` = seam — and **a plan is
a schedule bet** (existence-gated baseline, graded dates) (§10.10). Capstone — the **convergent law**:
every forced artifact is **existence-hard, fidelity-graded** — *plan : predictable :: ADR : reliable ::
regression : resilient :: telemetry : observe* (§12). Full derivation is in the canvas.

## 7. Method — DO NOT BREAK IT

This is a **Socratic + first-principles + handholding** teaching journey. **Ask, let the user
reason, then reflect/sharpen their answer and slot it into the model.** Do **not** lecture or
hand over answers unless the user explicitly asks. After each meaningful step, **update the
canvas** — it, not the chat, is the source of truth. The canvas's `▶ RESUME
INSTRUCTIONS` section is authoritative; follow it.

## 8. Where we are / what's next

**Purpose reminder (important — set iteration 28).** This canvas derives the **ideal MUST-HAVE**
SDLC: what *any* such lifecycle is logically forced to contain. It is **not** a map of the user's
current setup — auditing a concrete stack against the ideal was **descoped** on purpose, so the ideal
stays uncontaminated by what a given setup already has or lacks. (The general residue of that dropped
thread survives as open tracks T2/T3/T4.)

**State (iteration 35, 2026-07-10) — the ideal MUST-HAVE derivation is substantively complete; the
bedrock pressure-test (T6) is now closed.**

- **Apex:** four properties in two families (reliable · predictable · resilient · secure);
  behaviour→property map complete (converges · bounded · nests-&-escalates · preempts).
- **Bedrock (iter 35):** **8 first-order stones + 2 conditional second-order** — **#9 reflexivity**
  (autonomous case) and **#10 incentive-divergence** (delegated case), on a **formalized second-order
  tier** (*order = arity of the stone's referent*: first-order = solver×world, monadic — so #4 "we err"
  stays first-order; second-order = solver×solver/self, relational — #9, #10). The tier has exactly two
  seats — independence (#9) · alignment (#10). The §3 self-test now has **three directions** (add: two
  faces bundle iff they share one forced response, else split — the *bundling rule*), with one licensed
  exception (`implement`/`release` — base act & seam). The 8 first-order stones are pairwise-irreducible.
- **Mechanism layer, all derived (canvas §10.1–§10.10):** design-as-a-bet · premise-B lever ·
  secure-at-every-seam · hard-gate calculus (3 amplifiers) · `reflect` forced (§10.5) · `observe`
  forced (§10.6) · inward base case (§10.7) · change-axis regression + rollback (§10.8) ·
  observability silent-failure gate (§10.9) · lifecycle-projection + plan-as-schedule-bet (§10.10).
- **Capstone:** the **convergent law** — every forced artifact is *existence-hard, fidelity-graded*
  (plan : predictable :: ADR : reliable :: regression : resilient :: telemetry : observe).
- **Docs:** the design doc (`sdlc-design/`) is at **full iteration-35 parity** — the T6 fold-in landed as
  canvas **iteration 36** (a documentation-parity pass): ten-stone bedrock, a "second-order tier" section
  (#9 first seat · #10 second seat), Ch 12 reworked to both seats, the L0/bedrock/L4 charts + glossary +
  stones-matrix + Appendix C all updated; all 21 charts validate. This file (`HANDOFF.md`) is current too.
  Janitorial **T10** (diagram fixes) is closed. **Track history T1–T11 — corrected 2026-07-29 against the
  canvas register ([`04-frontier.md`](sdlc-canvas/04-frontier.md) §11):** **ten closed** (T1 · T3 · T4 · T5 ·
  T6 · T7 · T8 · T9 · T10 · T11 — T11 closed with three promotion-forks parked), **one open** (**T2**, the
  fully-general cross-domain gate-vs-graded seam rule). The **descoped concrete-setup audit is not a
  T-numbered track** — it was removed by decision at iteration 28 and sits under *Descoped*, so it cannot be
  counted as a T-track residue. *The previous line here said "nine closed, two residues," which undercounted
  the closures by one and filed an open track and a descoped item together as if they were the same kind of
  thing.*

**Roadmap — read [`ROADMAP.md`](ROADMAP.md) first (2026-07-29, rev 3).** It is now the authoritative forward
plan and it *subsumes* the canvas §11 ordering below. The July-2026 external review was independently
adjudicated in [`REVIEW-ASSESSMENT-2026-07.md`](REVIEW-ASSESSMENT-2026-07.md), then **re-adjudicated at
rev 2** against the reviewer's round-2 response — which overturned four of our citations and one of our
own corrections (see that file's §6) — and then **audited against itself at rev 3** (that file's §7).

**Rev 3 changed one thing in the architecture and several in the evidence.** The architectural change:
**rollback's reach is an effect envelope, not the sandbox boundary** — an isolated agent can still call an
API, write to a database, rotate a key, send a message or trigger a deploy, none of which is undone by
destroying the workspace. D4 is rescoped to compute containment; **D3 + D6 + D8 collectively bound rollback**,
with D8's rollback-reach register made normative (`ROADMAP.md` §4.1). The evidence changes: the **EU AI Act
Digital Omnibus is in force as Regulation (EU) 2026/1744** and *replaced* Article 4 (Article 50 applies from
2 Aug 2026, not now); the **C3b conformance check was executed and found no cost ceiling** on the local
LiteLLM proxy — the presumed control nobody had read; and **"the ontology is sound" was retracted** in favour
of *viable and repairable*, because six documented defects fail our own Phase-0 gate. Bedrock and the
four-phase structure are unaffected. Its surviving findings reshaped the queue into four gated phases:

- **Phase 0 — repair the model** (Track M · new **Tier E**, 13 items). Cheap, and it unblocks everything:
  three Phase-1 components cannot be specified over the model as it stands. Headline items — **E12** retract
  the "*exactly* eight stones / *exactly* two seats" completeness claim (the bundling rule is a self-test
  heuristic, not an identity criterion — the one charge of overclaiming that fully lands; every stone
  *stays*, only the claim of proven exhaustiveness goes); **E1** split a work unit's *boundary* from its
  *acceptance vector* (§9's "four axes" and §9.3's "four axes" are different quadruples); **E2** add
  **Premise C** — the contract set, even if perfectly honoured, delivers *P* (without it "green stubs
  discharge the ⟹" is circular); **E3** gate the *reachability of a forbidden output*, grade *posture*
  ("all of `secure` is hard wholesale" is not machine-evaluable); **E4** resolve §6.4's collapse rule
  against §11.2's convergent law — they contradict at collapsed nodes.
- **Phase 1 — safety kernel** (Track F · new **Tier D**, 10 components, **[spec]** here / built downstream):
  mission-contract + evidence schema · durable orchestrator · capability broker · ephemeral execution ·
  signed evidence graph · external policy gate · audit + event-sourced replay + kill switch · progressive
  delivery · versioned-configuration governance · the **governed exception channel** (the `escalate` spec).
- **Phase 2 — calibrate on real repositories** (shadow → bounded T0/T1). *This is the descoped
  concrete-setup audit, finally run — against our own stack.*
- **Phase 3 — advanced autonomy** (multi-agent · selective formal methods · self-assembly · cost).

**The canvas frontier is resolved *by* Phase 0, not before it:** T11(a) → **forced** (append-only audit is
load-bearing for D7 regardless of adversary); T11(b) → E7 (demotes "emission character ≙ temporal type"
from law to analogy); T11(c) → E3(c) (unknown blast radius ⇒ non-local until bounded); T2's residue →
E3(a)'s invariant/posture split.

**Resume move:** open **Q6** and **Q7** (`ROADMAP.md` §8) with the user Socratically — they genuinely fork
and they block D10 and D5/D7. Then run Phase 0 in dependency order (**E12 → E1 → E3 → E4 → E2 → E6 → E9 →
E13 → E5 → E7 → E8 → E10 → E11**), deriving in the canvas and regenerating `sdlc-design/` per the
maintenance rule. **T6 is settled — do not re-litigate the fold-in;** E12 corrects the *epistemic status*
of the stone count, not its content.

## 9. Notes & caveats

- **CDN dependencies:** `marked@12` and `cytoscape@3.30.2` load from jsDelivr, and the font
  from Google Fonts — the site needs internet even though it's hosted on localhost. Vendor
  them locally if you need it fully offline.
- **Harmless console warnings:** a custom wheel-sensitivity note and `label` width/height
  deprecation (Cytoscape 3.30 — still functional; version is pinned). Not errors.
- **Pop-out fullscreen** uses the Fullscreen API — works in a normal browser tab on a user
  gesture; a sandboxed preview iframe may block it.
- **Never** open `index.html` via `file://` — the markdown fetch will fail (the page shows a
  hint telling you to serve over http).
