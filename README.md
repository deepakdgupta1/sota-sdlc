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

**Read the snapshot** in a browser — it renders 21 interactive charts inline:

```bash
python3 -m http.server 4321
```

Then open `http://localhost:4321/sdlc-design.html` for the snapshot, or `http://localhost:4321/` for the
canvas. `file://` will not work — both viewers fetch their markdown over http.

**Before committing** documentation changes:

```bash
node scripts/verify-docs.mjs
```

Editing, the diagram data model, and known caveats are documented in **Appendix D** of the snapshot.
Precedence between the four documents is declared in the snapshot's front matter and nowhere else.

Three earlier documents — the handoff, the idea catalogue, and the July-2026 review assessment — were
absorbed into the four above on 2026-07-30 and remain complete in Git history:

```bash
git show docs-history-2026-07-30:HANDOFF.md
```
