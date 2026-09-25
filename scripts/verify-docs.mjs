#!/usr/bin/env node
/**
 * verify-docs.mjs — the documentation gate for this repository.
 *
 * No third-party dependencies: Node built-ins only.
 * Exits 0 when the active tree presents exactly one normative snapshot whose every
 * contested unit resolves to a rationale entry, and non-zero with one line per violation.
 *
 * Run from the repository root:  node scripts/verify-docs.mjs
 */
import {readFileSync, existsSync, readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';

const MANIFEST = 'docs/snapshot.parts.json';
const LEDGER = 'docs/RATIONALE.md';
const SNAPSHOT_DIR = 'docs/snapshot';
const TAG = 'docs-history-2026-07-30';
const EXPECTED_SNAPSHOT_CHARTS = 21;

/** Documents retained only in tagged history. */
const RETIRED = [
  'HANDOFF.md',
  'ROADMAP.md',
  'sdlc-evolution-ideas.md',
  'REVIEW-ASSESSMENT-2026-07.md',
  'sdlc-design/',
  'sdlc-design.parts.json',
  'sdlc-design.html',
  'sdlc-canvas/',
  'sdlc-canvas.parts.json',
  'docs/agent-architecture/',
  'docs/ai_agent_evaluation_metrics_kpis_2026.md',
];

const errors = [];
const warnings = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/** Strip fenced regions so example blocks inside `~~~` are not mistaken for real content. */
function stripTildeFences(text) {
  const out = [];
  let inTilde = false;
  for (const line of text.split('\n')) {
    if (/^~~~/.test(line)) { inTilde = !inTilde; out.push(''); continue; }
    out.push(inTilde ? '' : line);
  }
  return out.join('\n');
}

/* ---------- 1 · manifest integrity ---------- */

if (!existsSync(MANIFEST)) fail(MANIFEST, 'manifest is missing');
let manifest = {parts: []};
try {
  manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
} catch (e) {
  fail(MANIFEST, `manifest is not valid JSON — ${e.message}`);
}
if (manifest.rationale !== LEDGER) fail(MANIFEST, `rationale must point to ${LEDGER}`);

const parts = manifest.parts || [];
for (const p of parts) if (!existsSync(p)) fail(MANIFEST, `manifest part does not exist on disk: ${p}`);
if (parts.includes(LEDGER)) fail(MANIFEST, `${LEDGER} must load on demand, not as a chapter`);

const chapterFiles = existsSync(SNAPSHOT_DIR)
  ? readdirSync(SNAPSHOT_DIR).filter(f => f.endsWith('.md')).sort()
  : [];
for (const f of chapterFiles) {
  if (!parts.includes(`${SNAPSHOT_DIR}/${f}`)) fail(MANIFEST, `chapter is not listed in the manifest: ${f}`);
}
if (chapterFiles.length !== 14) fail(SNAPSHOT_DIR, `expected 14 chapters, found ${chapterFiles.length}`);

/* ---------- 2 · gather the ledger's entries ---------- */

const ledgerText = existsSync(LEDGER) ? readFileSync(LEDGER, 'utf8') : '';
const entryIds = new Set();
for (const m of ledgerText.matchAll(/<a id="(r-[a-z]+-\d+)"><\/a>/g)) {
  if (entryIds.has(m[1])) fail(LEDGER, `duplicate rationale entry id: ${m[1]}`);
  entryIds.add(m[1]);
}
if (!entryIds.size) fail(LEDGER, 'no rationale entries found (expected `<a id="r-…"></a>` anchors)');

/**
 * Link hygiene, applied to every live document.
 *  - a `file://` *link* (or any absolute `file:///` URL) is always a defect; the bare
 *    scheme in prose — "never open this via `file://`" — is not.
 *  - a pseudo-line link rots on the first insertion.
 *  - retired paths may appear only in tagged historical references.
 */
function checkHygiene(file, body) {
  if (/\]\(\s*file:\/\//.test(body) || /file:\/\/\//.test(body)) {
    fail(file, 'contains a file:// link — machine-specific and dead for every other reader');
  }
  for (const m of body.matchAll(/\(([A-Za-z0-9_./-]*\.md):(\d+)\)/g)) {
    fail(file, `pseudo-line link \`${m[1]}:${m[2]}\` — cite a section or row identifier instead`);
  }
  const activeBody = body.replace(/docs-history-2026-(?:07-30|09-24):[A-Za-z0-9_./-]+(?:#[a-z0-9-]+)?/g, '');
  for (const r of RETIRED) {
    const lit = r.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(lit).test(activeBody)) {
      fail(file, `cites retired document \`${r}\` outside tagged history`);
    }
  }
}

/* ---------- 3 · every reference resolves; every entry is referenced ---------- */

const referenced = new Set();
const docFiles = [
  ...parts.filter(p => existsSync(p)),
  ...[LEDGER, 'README.md'].filter(existsSync),
];

for (const file of docFiles) {
  const raw = readFileSync(file, 'utf8');
  const body = stripTildeFences(raw);

  for (const m of body.matchAll(/\(#(r-[a-z]+-\d+)\)/g)) {
    referenced.add(m[1]);
    if (!entryIds.has(m[1])) fail(file, `references a rationale id with no ledger entry: ${m[1]}`);
  }
  for (const m of body.matchAll(/RATIONALE\.md#(r-[a-z]+-\d+)/g)) {
    referenced.add(m[1]);
    if (!entryIds.has(m[1])) fail(file, `references a rationale id with no ledger entry: ${m[1]}`);
  }

  checkHygiene(file, body);
}

for (const id of entryIds) {
  if (!referenced.has(id)) fail(LEDGER, `orphaned rationale entry — nothing references ${id}`);
}

/* ---------- 4 · rationale coverage of every normative unit ---------- */

const WHY = /↪ Why]\(#(r-[a-z]+-\d+)\)/;

for (const f of chapterFiles) {
  const path = `${SNAPSHOT_DIR}/${f}`;
  const lines = stripTildeFences(readFileSync(path, 'utf8')).split('\n');

  const coveredWithin = (from, to) => lines.slice(from, to).some(l => WHY.test(l));

  /* headings: a Why link must appear before the next heading */
  const headingIdx = [];
  lines.forEach((l, i) => { if (/^#{2,3} /.test(l)) headingIdx.push(i); });
  headingIdx.forEach((i, n) => {
    const end = n + 1 < headingIdx.length ? headingIdx[n + 1] : lines.length;
    if (!coveredWithin(i, end)) fail(path, `heading has no rationale link: "${lines[i].trim()}"`);
  });

  /* diagrams: every chart callout carries its own link */
  lines.forEach((l, i) => {
    if (/^> ▸ \*\*Chart — /.test(l) && !WHY.test(l)) {
      fail(path, `chart callout has no rationale link (line ${i + 1})`);
    }
  });

  /* tables: covered by a link between the table and its nearest preceding heading */
  lines.forEach((l, i) => {
    if (!/^\|/.test(l) || /^\|/.test(lines[i - 1] || '')) return;
    let j = i - 1;
    while (j >= 0 && !/^#{2,3} /.test(lines[j])) j--;
    if (j < 0 || !coveredWithin(j, i)) fail(path, `table at line ${i + 1} has no rationale link in its section`);
  });
}

/* ---------- 5 · every pipeline-graph block is valid JSON ---------- */

function countCharts(dir, label, expected) {
  let n = 0;
  for (const f of readdirSync(dir).filter(x => x.endsWith('.md'))) {
    const path = `${dir}/${f}`;
    const text = stripTildeFences(readFileSync(path, 'utf8'));
    for (const m of text.matchAll(/^```pipeline-graph\n([\s\S]*?)^```/gm)) {
      n++;
      try {
        const spec = JSON.parse(m[1]);
        const ids = new Set((spec.nodes || []).map(x => x.id));
        for (const e of spec.edges || []) {
          if (!ids.has(e.source)) fail(path, `chart "${spec.title}" has an edge from unknown node "${e.source}"`);
          if (!ids.has(e.target)) fail(path, `chart "${spec.title}" has an edge to unknown node "${e.target}"`);
        }
      } catch (e) {
        fail(path, `invalid pipeline-graph JSON — ${e.message}`);
      }
    }
  }
  if (n !== expected) fail(label, `expected ${expected} pipeline-graph blocks, found ${n}`);
}
if (existsSync(SNAPSHOT_DIR)) countCharts(SNAPSHOT_DIR, SNAPSHOT_DIR, EXPECTED_SNAPSHOT_CHARTS);

/* ---------- 7 · historical traces resolve inside the tag ---------- */

let tagPresent = true;
try {
  execFileSync('git', ['rev-parse', '--verify', `${TAG}^{tag}`], {stdio: 'ignore'});
} catch {
  tagPresent = false;
  warn(TAG, 'tag not present — trace resolution skipped (expected on a clone fetched without tags)');
}

if (tagPresent) {
  const headingCache = new Map();
  const headingsOf = path => {
    if (!headingCache.has(path)) {
      try {
        const text = execFileSync('git', ['show', `${TAG}:${path}`], {encoding: 'utf8', maxBuffer: 1 << 26});
        headingCache.set(path, text.split('\n').filter(l => /^#{1,6} /.test(l)).map(l => slug(l.replace(/^#+ /, ''))));
      } catch {
        headingCache.set(path, null);
      }
    }
    return headingCache.get(path);
  };

  const traceRe = new RegExp(`${TAG}:([A-Za-z0-9_./-]+\\.md)(?:#([a-z0-9-]+))?`, 'g');
  for (const file of docFiles) {
    const body = stripTildeFences(readFileSync(file, 'utf8'));
    for (const m of body.matchAll(traceRe)) {
      const [, path, frag] = m;
      const heads = headingsOf(path);
      if (heads === null) { fail(file, `trace path does not exist in ${TAG}: ${path}`); continue; }
      if (frag && !heads.some(h => h.startsWith(frag))) {
        fail(file, `trace heading not found in ${TAG}:${path} — #${frag}`);
      }
    }
  }
}

/* ---------- report ---------- */

for (const w of warnings) console.log(`  warn  ${w}`);
if (errors.length) {
  console.error(`\n✗ verify-docs: ${errors.length} problem${errors.length === 1 ? '' : 's'}\n`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log(
  `✓ verify-docs: ${chapterFiles.length} chapters · ${entryIds.size} rationale entries · ` +
  `${EXPECTED_SNAPSHOT_CHARTS} charts valid`
);
