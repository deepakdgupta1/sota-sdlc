#!/usr/bin/env node
/** Mutate a scratch clone and confirm the doc checker rejects every defect it claims to catch. */
import {copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync} from 'node:fs';
import {execFileSync, spawnSync} from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECKER = 'scripts/check-doc-structure.mjs';
const FRONT = 'docs/snapshot/00-front-matter.md';
const PROPERTIES = 'docs/snapshot/02-destination-four-properties.md';
const BEDROCK = 'docs/snapshot/03-bedrock.md';
const LEDGER = 'docs/RATIONALE.md';
const LADDER_LAW_ROW = '| **L3** | The convergent law | Required evidence gated, fidelity graded | [Ch. 11](#11-hard-gates-versus-graded-targets) |';
const GITHUB_SLUG_LINK = '\n[section](docs/snapshot/09-mechanism-of-done.md#91-design-as-a-bet--stub-composition)\n';
const VIEWER_SLUG_LINK = '\n[section](docs/snapshot/09-mechanism-of-done.md#9-1-design-as-a-bet-stub-composition)\n';

// A `fails` probe must be rejected with that message, and any other probe must pass. A `gap` probe marks
// behavior the checker lacks. The suite fails once the checker meets a gap probe, so the commit that adds
// the check also removes the flag.
const PROBES = [
  {name: 'unmodified tree is accepted'},
  {name: 'chart ladder anchor that does not exist', file: FRONT, from: '(#3-the-bedrock-why-the-work-is-hard)', to: '(#3-bedrock-typo)', fails: 'broken local anchor: #3-bedrock-typo'},
  {name: 'rationale ID that no entry defines', file: PROPERTIES, from: '(#r-apex-01)', to: '(#r-apex-99)', fails: 'unknown rationale ID: r-apex-99'},
  {name: 'rationale entry no chapter links', file: LEDGER, from: 'see\n[R-METHOD-04](#r-method-04)', to: 'see\nR-METHOD-04', fails: 'unused rationale ID: r-method-04'},
  {name: 'two charts with one title', file: 'docs/snapshot/08-repertoires.md', from: '"title": "The two repertoires"', to: '"title": "The four properties"', fails: 'duplicate chart title: The four properties'},
  {name: 'chart edge to a node that does not exist', file: 'docs/snapshot/10-artifacts.md', from: '"target":"a_spec","label":"carrier role"', to: '"target":"a_spec_typo","label":"carrier role"', fails: 'has an edge to an unknown node'},
  {name: 'file URL in prose', file: 'docs/snapshot/01-system-at-a-glance.md', from: '## 1. The system at a glance', to: '## 1. The system at a glance\n\nSee file:///Users/x/y.md', fails: 'contains a file:/// URL'},
  {name: 'history path that does not exist', file: LEDGER, from: 'sdlc-canvas/00-framing.md#2-the-destination-four-properties-the-apex`\n  — historical', to: 'sdlc-canvas/00-framing-typo.md#2-the-destination-four-properties-the-apex`\n  — historical', fails: 'missing historical source'},
  {name: 'chapter missing from the manifest', file: 'docs/snapshot.parts.json', from: '    "docs/snapshot/05-elements.md",\n', to: '', fails: 'chapter not listed: docs/snapshot/05-elements.md'},
  {name: 'second root Markdown file', add: ['CONTRIBUTING.md', '# Contributing\n'], fails: 'README.md must be the only root Markdown file'},
  {name: 'chart node in a group the viewer does not style', file: BEDROCK, from: '"label":"1 · intent is hidden","group":"stone"', to: '"label":"1 · intent is hidden","group":"stoen"', fails: 'in unstyled group stoen'},
  {name: 'viewer that styles no chart groups', file: 'index.html', from: 'node[group=', to: 'node[grp=', fails: 'viewer styles no chart node groups'},
  {name: 'ladder row with the wrong level', file: FRONT, from: '| **L1** | The four properties |', to: '| **L3** | The four properties |', fails: 'ladder row The four properties says L3'},
  {name: 'ladder row linking the wrong chapter', file: FRONT, from: "acceptance properties | [Ch. 2](#2-the-destination-four-properties) |", to: "acceptance properties | [Ch. 3](#3-the-bedrock-why-the-work-is-hard) |", fails: 'ladder row The four properties should link [Ch. 2](#2-the-destination-four-properties)'},
  {name: 'ladder row naming a chart that does not exist', file: FRONT, from: '| **L0** | The complete circuit |', to: '| **L0** | The complete circuit board |', fails: 'ladder row names an unknown chart: The complete circuit board'},
  {name: 'chart missing from the ladder', file: FRONT, from: '| **L1** | The bedrock — ten forces | The current hazard taxonomy | [Ch. 3](#3-the-bedrock-why-the-work-is-hard) |\n', to: '', fails: 'chart ladder is missing The bedrock — ten forces'},
  {name: 'chart listed twice in the ladder', file: FRONT, from: LADDER_LAW_ROW, to: `${LADDER_LAW_ROW}\n${LADDER_LAW_ROW}`, fails: 'chart ladder lists The convergent law twice'},
  {name: 'chart ladder removed', file: FRONT, from: '| **L', to: '| L', fails: 'chart ladder table is missing'},
  {name: 'ledger scope naming a file that does not exist', file: LEDGER, from: '`docs/snapshot/01-system-at-a-glance.md`.\n- **Trace.**', to: '`docs/snapshot/99-missing.md`.\n- **Trace.**', fails: 'references a missing path: docs/snapshot/99-missing.md'},
  {name: 'ledger scope naming a heading that does not exist', file: LEDGER, from: '13-appendices.md#appendix-b--the-stones-to-responses-matrix`', to: '13-appendices.md#appendix-z-nothing`', fails: 'references a missing heading: docs/snapshot/13-appendices.md#appendix-z-nothing'},
  {name: 'section reference to a section that does not exist', file: PROPERTIES, from: '(§9.2)', to: '(§9.9)', fails: 'references missing section §9.9'},
  {name: 'chapter reference to a chapter that does not exist', file: PROPERTIES, from: '(Chapter 8)', to: '(Chapter 18)', fails: 'references missing chapter 18'},
  {name: 'historical section number that does not exist', file: LEDGER, from: 'sdlc-canvas/03-mechanism-of-done.md` §10.5.', to: 'sdlc-canvas/03-mechanism-of-done.md` §10.95.', fails: 'missing historical locator: §10.95', gap: true},
  {name: 'stone count that disagrees with the stone table', file: BEDROCK, from: '### The eight first-order stones', to: '### The nine first-order stones', fails: 'says nine first-order stones but the stone table has 8', gap: true},
  {name: 'chapter linking a ledger entry that omits it from its scope', file: LEDGER, from: '- **Applies to.** `docs/snapshot/07-lifecycle.md`, `docs/snapshot/13-appendices.md`.\n- **Evidence.** Historical schedule bet', to: '- **Applies to.** `docs/snapshot/13-appendices.md`.\n- **Evidence.** Historical schedule bet', fails: 'does not declare docs/snapshot/07-lifecycle.md', gap: true},
  {name: 'README link written with the GitHub anchor', file: 'README.md', from: '\n## Read and serve', to: `${GITHUB_SLUG_LINK}\n## Read and serve`},
  {name: 'README link written with the viewer anchor', file: 'README.md', from: '\n## Read and serve', to: `${VIEWER_SLUG_LINK}\n## Read and serve`, fails: 'broken local anchor'},
  {name: 'checker run from a subdirectory', cwd: 'docs'},
  {name: 'missing history tag names the fetch command', dropTag: 'docs-history-2026-09-24', fails: 'git fetch origin tag docs-history-2026-09-24', gap: true},
];

function prepare(scratch) {
  execFileSync('git', ['clone', '--quiet', '--no-hardlinks', root, scratch]);
  const listed = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {cwd: root, encoding: 'utf8'});
  for (const file of listed.split('\0').filter(Boolean)) {
    mkdirSync(path.dirname(path.join(scratch, file)), {recursive: true});
    try { copyFileSync(path.join(root, file), path.join(scratch, file)); }
    catch (error) {
      if (error.code !== 'ENOENT') throw error;
      rmSync(path.join(scratch, file), {force: true});
    }
  }
}

function mutate(scratch, probe) {
  if (probe.file) {
    const file = path.join(scratch, probe.file);
    const original = readFileSync(file, 'utf8');
    if (!original.includes(probe.from)) throw new Error(`stale probe "${probe.name}": ${probe.file} no longer contains the text it mutates`);
    writeFileSync(file, original.replaceAll(probe.from, () => probe.to));
    return () => writeFileSync(file, original);
  }
  if (probe.add) {
    const file = path.join(scratch, probe.add[0]);
    writeFileSync(file, probe.add[1]);
    return () => unlinkSync(file);
  }
  if (probe.dropTag) {
    const target = execFileSync('git', ['rev-parse', `refs/tags/${probe.dropTag}`], {cwd: scratch, encoding: 'utf8'}).trim();
    execFileSync('git', ['tag', '-d', probe.dropTag], {cwd: scratch, stdio: 'ignore'});
    return () => execFileSync('git', ['update-ref', `refs/tags/${probe.dropTag}`, target], {cwd: scratch});
  }
  return () => {};
}

const behavesAsExpected = (probe, result) => probe.fails ? result.status === 1 && result.stderr.includes(probe.fails) : result.status === 0;
const only = process.argv[2];
const selected = only ? PROBES.filter(probe => probe.name.includes(only)) : PROBES;
const scratch = mkdtempSync(path.join(os.tmpdir(), 'doc-checker-'));
let failed = 0;
let gaps = 0;
try {
  prepare(scratch);
  for (const probe of selected) {
    const undo = mutate(scratch, probe);
    const result = spawnSync(process.execPath, [path.join(scratch, CHECKER)], {cwd: path.join(scratch, probe.cwd ?? ''), encoding: 'utf8'});
    undo();
    const matches = behavesAsExpected(probe, result);
    const detail = (result.stderr || result.stdout).split('\n').find(line => line.trim()) ?? '';
    if (probe.gap && !matches) { gaps++; console.log(`gap   ${probe.name}\n      checker exit ${result.status}: ${detail}`); }
    else if (probe.gap) { failed++; console.log(`FAIL  ${probe.name}\n      the gap is closed, so remove its \`gap\` flag`); }
    else if (matches) console.log(`ok    ${probe.name}`);
    else { failed++; console.log(`FAIL  ${probe.name}\n      expected ${probe.fails ? `a rejection containing "${probe.fails}"` : 'a pass'}, got exit ${result.status}: ${detail}`); }
  }
} finally {
  rmSync(scratch, {recursive: true, force: true});
}
console.log(`\n${selected.length} probes · ${selected.length - gaps - failed} ok · ${gaps} known gaps · ${failed} failed`);
process.exit(failed ? 1 : 0);
