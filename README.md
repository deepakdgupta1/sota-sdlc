# SOTA SDLC — a first-principles derivation

*A signpost only. This file is **not** normative and holds no content of its own — everything lives in the
four documents below.*

An ideal software-development lifecycle derived from first principles: what any lifecycle must contain to
be **reliable, predictable, resilient, and secure**, and why each piece is logically forced rather than
adopted by convention.

| Document | Role | Wins on |
|---|---|---|
| [`sdlc-canvas/`](sdlc-canvas/00-framing.md) | the Socratic derivation, audit trail, and open-tracks register | reasoning |
| [`docs/snapshot/`](docs/snapshot/00-front-matter.md) | the normative model, frozen **as of 2026-07-30** | presentation |
| [`docs/RATIONALE.md`](docs/RATIONALE.md) | why each contested decision has its shape, with dated evidence | justification |
| [`ROADMAP.md`](ROADMAP.md) | phases, gates, Tier D/E registers, traceability, open questions | forward work |

**Read the model** in a browser. From the repository root, start a local server:

```bash
python3 -m http.server 4321
```

Open `http://localhost:4321/sdlc-design.html`. The viewer fetches the Markdown, so opening the HTML
file directly will not load the model.

**Edit the model** in `docs/snapshot/`. The chapter order is in `docs/snapshot.parts.json`; the
explanation for each linked decision is in `docs/RATIONALE.md`. Charts are fenced `pipeline-graph`
JSON blocks beside the prose they illustrate. Copy a working block from a chapter when adding a
chart. The viewer lets you move and edit nodes; use **Export** and replace the source block to keep
the edit. Browser edits alone are temporary.

**Before committing** documentation changes:

```bash
node scripts/verify-docs.mjs
```

The checker validates chart JSON and edge references as well as document links and rationale IDs.

Three earlier documents — the handoff, the idea catalogue, and the July-2026 review assessment — were
absorbed into the four above on 2026-07-30 and remain complete in Git history
([R-METHOD-05](docs/RATIONALE.md#r-method-05)):

```bash
git show docs-history-2026-07-30:HANDOFF.md
```
