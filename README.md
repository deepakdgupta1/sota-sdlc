# Current SDLC reference model

The [model](docs/snapshot/00-front-matter.md) describes accountable software-development work: its
acceptance properties, hazards, feedback loop, evidence, and delegated execution. The chapters in
[`docs/snapshot/`](docs/snapshot/) are the current design. [`docs/RATIONALE.md`](docs/RATIONALE.md)
explains the decisions linked from those chapters. The model's scope and assumptions are in its
[front matter](docs/snapshot/00-front-matter.md#scope-assumptions-and-admission).

## Read and serve

Read the model in the interactive viewer, the supported reader. Serve the repository root:

```bash
python3 -m http.server 4321
```

Open `http://localhost:4321/`. The viewer fetches Markdown, so opening `index.html` as a local file
will not load the model. It joins the chapters into one page, so links between chapters work. Select
a **↪ Why** link to open its rationale entry; a URL ending in that entry's `#r-*` ID opens the same
panel.

The chapters also read as plain Markdown, but each file then stands alone. Links to other chapters
and **↪ Why** links do nothing there.

## Change the model

Edit the relevant chapter in `docs/snapshot/`; `docs/snapshot.parts.json` sets reading order. Update
the linked rationale entry in the **same commit** as any design change. Add a new stable rationale ID
only for an independent decision. Supporting prose, tables, and charts inherit the governing entry.

Charts are fenced `pipeline-graph` JSON blocks beside their explanations. Copy an existing block to
add a chart. Viewer edits are temporary: use **Export** and replace the source block to retain them.

Before committing, run:

```bash
node scripts/check-doc-structure.mjs
```

The checker verifies structure and link targets. Review whether the model's claims and their
rationale are sound separately.

## Change the checker

After editing `scripts/check-doc-structure.mjs`, run:

```bash
node scripts/check-doc-structure.test.mjs
```

It applies each known defect to a scratch clone and confirms the checker rejects it. Add a probe
beside any new check.

## Retrieve history

Earlier derivations, audits, plans, and parallel document sets remain in Git under the annotated
`docs-history-2026-07-30` and `docs-history-2026-09-24` tags. For example:

```bash
git show docs-history-2026-07-30:sdlc-canvas/00-framing.md
git show docs-history-2026-09-24:docs/agent-architecture/00_meta/agent_registry.md
```

The checker reads both tags. A clone made with `--no-tags` or `--depth` lacks them, and the checker's
error names the `git fetch` command that restores each.

Completed plans remain in Git history rather than the active documentation tree.
