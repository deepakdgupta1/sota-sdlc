#!/usr/bin/env node
/**
 * Mutate a scratch clone and confirm the doc checker rejects every defect it claims to catch.
 * Pass a substring to run only the probes whose name contains it.
 */
import {copyFileSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, renameSync, rmSync, unlinkSync, writeFileSync} from 'node:fs';
import {execFileSync, spawnSync} from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
// Hooks and `git rebase --exec` export GIT_DIR, which would point the scratch clone's git calls at this repo.
const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')));
const git = (args, options = {}) => execFileSync('git', args, {env, encoding: 'utf8', ...options});
const CHECKER = 'scripts/check-doc-structure.mjs';
const FRONT = 'docs/snapshot/00-front-matter.md';
const PROPERTIES = 'docs/snapshot/02-destination-four-properties.md';
const BEDROCK = 'docs/snapshot/03-bedrock.md';
const LEDGER = 'docs/RATIONALE.md';
const LADDER_LAW_ROW = '| **L3** | The convergent law | Required evidence gated, fidelity graded | [Ch. 11](#11-hard-gates-versus-graded-targets) |';
const GITHUB_SLUG_LINK = '\n[section](docs/snapshot/09-mechanism-of-done.md#91-design-as-a-bet--stub-composition)\n';
const VIEWER_SLUG_LINK = '\n[section](docs/snapshot/09-mechanism-of-done.md#9-1-design-as-a-bet-stub-composition)\n';

// A `fails` probe must be rejected with that message, and any other probe must pass. No output may contain `absent`.
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
  {name: 'code fence that is never closed', file: 'docs/snapshot/12-agentic-sdlc.md', from: '## 12. The autonomous / agentic SDLC', to: '## 12. The autonomous / agentic SDLC\n\n```bash\nnever closed', fails: 'unclosed code fence'},
  {name: 'chart node in a group the viewer does not style', file: BEDROCK, from: '"label":"1 · intent is hidden","group":"stone"', to: '"label":"1 · intent is hidden","group":"stoen"', fails: 'in unstyled group stoen'},
  {name: 'viewer selector written with single quotes', file: 'index.html', from: 'node[group="stone"]', to: "node[group='stone']"},
  {name: 'chart node with an empty group', file: BEDROCK, from: '"label":"1 · intent is hidden","group":"stone"', to: '"label":"1 · intent is hidden","group":""'},
  {name: 'chart node with a numeric group', file: BEDROCK, from: '"label":"1 · intent is hidden","group":"stone"', to: '"label":"1 · intent is hidden","group":7', fails: 'in unstyled group 7'},
  {name: 'viewer that styles no chart groups', file: 'index.html', from: 'node[group=', to: 'node[grp=', fails: 'viewer styles no chart node groups'},
  {name: 'ladder row with the wrong level', file: FRONT, from: '| **L1** | The four properties |', to: '| **L3** | The four properties |', fails: 'ladder row The four properties says L3'},
  {name: 'ladder row linking the wrong chapter', file: FRONT, from: "acceptance properties | [Ch. 2](#2-the-destination-four-properties) |", to: "acceptance properties | [Ch. 3](#3-the-bedrock-why-the-work-is-hard) |", fails: 'ladder row The four properties should link [Ch. 2](#2-the-destination-four-properties)'},
  {name: 'ladder row naming a chart that does not exist', file: FRONT, from: '| **L0** | The complete circuit |', to: '| **L0** | The complete circuit board |', fails: 'ladder row names an unknown chart: The complete circuit board'},
  {name: 'chart missing from the ladder', file: FRONT, from: '| **L1** | The bedrock — ten forces | The current hazard taxonomy | [Ch. 3](#3-the-bedrock-why-the-work-is-hard) |\n', to: '', fails: 'chart ladder is missing The bedrock — ten forces'},
  {name: 'chart listed twice in the ladder', file: FRONT, from: LADDER_LAW_ROW, to: `${LADDER_LAW_ROW}\n${LADDER_LAW_ROW}`, fails: 'chart ladder lists The convergent law twice'},
  {name: 'chart ladder removed', file: FRONT, from: '| **L', to: '| L', fails: 'chart ladder table is missing'},
  {name: 'ladder row without a chapter link', file: FRONT, from: '| **L3** | The schedule bet | Why the baseline is gated and the dates are graded | [Ch. 7](#7-the-lifecycle-the-process-flow) |', to: '| **L3** | The schedule bet | Why the baseline is gated and the dates are graded | Ch. 7 |', fails: 'malformed ladder row'},
  {name: 'ladder row for a chart that does not exist and has no link', file: FRONT, from: LADDER_LAW_ROW, to: `${LADDER_LAW_ROW}\n| **L2** | Ghost chart | Not a real chart | Ch. 10 |`, fails: 'malformed ladder row'},
  {name: 'ladder row with trailing spaces', file: FRONT, from: LADDER_LAW_ROW, to: `${LADDER_LAW_ROW}  `},
  {name: 'paragraph after a ledger scope line', file: LEDGER, from: '- **Governs.** `docs/snapshot/03-bedrock.md`, `docs/snapshot/13-appendices.md`.', to: '- **Governs.** `docs/snapshot/13-appendices.md`.\n\nSee also `docs/snapshot/03-bedrock.md`.', fails: 'does not declare docs/snapshot/03-bedrock.md'},
  {name: 'ledger scope naming a file that does not exist', file: LEDGER, from: '`docs/snapshot/00-front-matter.md`, `docs/snapshot/13-appendices.md`.\n- **Trace.**', to: '`docs/snapshot/00-front-matter.md`, `docs/snapshot/13-appendices.md`, `docs/snapshot/99-missing.md`.\n- **Trace.**', fails: 'references a missing path: docs/snapshot/99-missing.md'},
  {name: 'ledger scope naming a heading that does not exist', file: LEDGER, from: '13-appendices.md#appendix-b--the-stones-to-responses-matrix`', to: '13-appendices.md#appendix-z-nothing`', fails: 'references a missing heading: docs/snapshot/13-appendices.md#appendix-z-nothing'},
  {name: 'backticked heading link with an uppercase fragment', file: LEDGER, from: '13-appendices.md#appendix-b--the-stones-to-responses-matrix`', to: '13-appendices.md#Appendix_B`', fails: 'references a missing heading: docs/snapshot/13-appendices.md#Appendix_B'},
  {name: 'backticked path that climbs out of a directory and back', file: 'README.md', from: '\n## Read and serve', to: '\nSee `docs/snapshot/../RATIONALE.md` and `docs/snapshot/../RATIONALE.md#r-apex-01`.\n\n## Read and serve'},
  {name: 'backticked path that climbs out of the repository', file: 'README.md', from: '\n## Read and serve', to: '\nSee `docs/../../elsewhere.md`.\n\n## Read and serve', fails: 'references a missing path'},
  {name: 'backticked path with a leading ./', file: 'README.md', from: '\n## Read and serve', to: '\nSee `./docs/snapshot/99-gone.md`.\n\n## Read and serve', fails: 'references a missing path: docs/snapshot/99-gone.md'},
  {name: 'section reference to a section that does not exist', file: PROPERTIES, from: '(§9.2)', to: '(§9.9)', fails: 'references missing section §9.9'},
  {name: 'chapter reference to a chapter that does not exist', file: PROPERTIES, from: '(Chapter 8)', to: '(Chapter 18)', fails: 'references missing chapter 18'},
  {name: 'historical section number that does not exist', file: LEDGER, from: 'sdlc-canvas/03-mechanism-of-done.md` §10.5.', to: 'sdlc-canvas/03-mechanism-of-done.md` §10.95.', fails: 'missing historical locator: §10.95'},
  {name: 'historical range ending at a section that does not exist', file: LEDGER, from: '§7–8', to: '§7–88', fails: 'missing historical locator: §88'},
  {name: 'section sign that follows no historical source', file: LEDGER, from: '`docs-history-2026-07-30:sdlc-canvas/03-mechanism-of-done.md` §10.5.', to: '§10.5.', fails: 'section sign §10.5 follows no historical source'},
  {name: 'historical heading that does not exist', file: LEDGER, from: '00-framing.md#2-the-destination-four-properties-the-apex', to: '00-framing.md#2-the-destination-four-properties-the-typo', fails: 'missing historical heading'},
  {name: 'stone count that disagrees with the stone table', file: BEDROCK, from: '### The eight first-order stones', to: '### The nine first-order stones', fails: 'says nine first-order stones but the stone table has 8'},
  {name: 'second-order count that disagrees with the tier list', file: BEDROCK, from: '**two** conditional second-order stones', to: '**three** conditional second-order stones', fails: 'says three conditional second-order stones but the second-order list has 2'},
  {name: 'force count that disagrees with the stones', file: BEDROCK, from: '**Chart — "The bedrock — ten forces"**', to: '**Chart — "The bedrock — eleven forces"**', fails: 'says eleven forces but the stones number 10'},
  {name: 'first-N stones claim in another chapter', file: 'docs/snapshot/12-agentic-sdlc.md', from: 'kind from the first eight stones', to: 'kind from the first seven stones', fails: 'says first seven stones but the stone table has 8', absent: 'says seven stones'},
  {name: 'chapter reference wrapped across a line break', file: 'docs/snapshot/09-mechanism-of-done.md', from: 'Chapter 4 described graded acceptance; Chapter\n6 gave each element', to: 'Chapter 4 described graded acceptance; Chapter\n66 gave each element', fails: 'references missing chapter 66'},
  {name: 'plural chapter reference to a chapter that does not exist', file: PROPERTIES, from: '(Chapter 8)', to: '(Chapters 8 and 88)', fails: 'references missing chapter 88'},
  {name: 'section range ending at a section that does not exist', file: PROPERTIES, from: '(§9.2)', to: '(§9.2–9.99)', fails: 'references missing section §9.99'},
  {name: 'section reference inside a chart label', file: 'docs/snapshot/06-fractal.md', from: '"label":"forbidden-output wall (§9.3)"', to: '"label":"forbidden-output wall (§9.33)"', fails: 'references missing section §9.33'},
  {name: 'ledger chapter reference to a chapter that does not exist', file: LEDGER, from: '**Reading an entry.**', to: 'Chapter 14 of the retired canvas. **Reading an entry.**', fails: 'references missing chapter 14'},
  {name: 'ledger section sign that cites a retired document', file: LEDGER, from: '**Reading an entry.**', to: '`docs-history-2026-07-30:sdlc-canvas/03-mechanism-of-done.md` §10.5. **Reading an entry.**'},
  {name: 'stone count wrapped across a line break', file: BEDROCK, from: '**eight** first-order stones (about the *problem*)', to: '**nine** first-order\nstones (about the *problem*)', fails: 'says nine first-order stones but the stone table has 8'},
  {name: 'stone count with markup on the noun', file: BEDROCK, from: '**Chart — "The bedrock — ten forces"**', to: '**Chart — "The bedrock — eleven *forces*"**', fails: 'says eleven forces but the stones number 10'},
  {name: 'pressures count that disagrees with the stones', file: 'docs/snapshot/01-system-at-a-glance.md', from: 'eight pressures in the problem', to: 'nine pressures in the problem', fails: 'says nine pressures but the stones number 8 or 2 or 10'},
  {name: 'seats count that disagrees with the second-order list', file: BEDROCK, from: 'The tier has **two seats**', to: 'The tier has **three seats**', fails: 'says three seats but the second-order list has 2'},
  {name: 'the word one before forces is not a count', file: 'docs/snapshot/01-system-at-a-glance.md', from: '## 1. The system at a glance', to: '## 1. The system at a glance\n\nOne forces the other.'},
  {name: 'stone table heading renamed', file: BEDROCK, from: '### The eight first-order stones', to: '### The first-order stones', fails: 'stone table or second-order list not found'},
  {name: 'chapter linking a ledger entry that omits it from its scope', file: LEDGER, from: '- **Applies to.** `docs/snapshot/07-lifecycle.md`, `docs/snapshot/13-appendices.md`.\n- **Evidence.** Historical schedule bet', to: '- **Applies to.** `docs/snapshot/13-appendices.md`.\n- **Evidence.** Historical schedule bet', fails: 'does not declare docs/snapshot/07-lifecycle.md'},
  {name: 'ledger entry whose scope line is not recognised', file: LEDGER, from: '- **Governs.** `docs/snapshot/03-bedrock.md`, `docs/snapshot/13-appendices.md`.', to: '- **Covers.** `docs/snapshot/03-bedrock.md`, `docs/snapshot/13-appendices.md`.', fails: 'does not declare docs/snapshot/03-bedrock.md'},
  {name: 'README link written with the GitHub anchor', file: 'README.md', from: '\n## Read and serve', to: `${GITHUB_SLUG_LINK}\n## Read and serve`},
  {name: 'README link written with the viewer anchor', file: 'README.md', from: '\n## Read and serve', to: `${VIEWER_SLUG_LINK}\n## Read and serve`, fails: 'broken local anchor'},
  {name: 'README heading padded with spaces', file: 'README.md', from: '\n## Read and serve', to: '\n##   Padded out   \n\n[link](#padded-out)\n\n## Read and serve'},
  {name: 'README heading containing an HTML tag', file: 'README.md', from: '\n## Read and serve', to: '\n## Press <kbd>Enter</kbd> to run\n\n[link](#press-enter-to-run)\n\n## Read and serve'},
  {name: 'README link whose file name has the wrong case', file: 'README.md', from: '(docs/RATIONALE.md)', to: '(docs/Rationale.md)', fails: 'broken local link: docs/Rationale.md'},
  {name: 'README link whose directory name has the wrong case', file: 'README.md', from: '(docs/RATIONALE.md)', to: '(Docs/RATIONALE.md)', fails: 'broken local link: Docs/RATIONALE.md'},
  {name: 'backticked path whose first name has the wrong case', file: 'README.md', from: '\n## Read and serve', to: '\nSee `Docs/RATIONALE.md`.\n\n## Read and serve', fails: 'references a missing path: Docs/RATIONALE.md'},
  {name: 'backticked root file whose extension has the wrong case', file: 'README.md', from: '\n## Read and serve', to: '\nSee `README.MD`.\n\n## Read and serve', fails: 'references a missing path: README.MD'},
  {name: 'backticked path with the wrong case', file: 'README.md', from: '\n## Read and serve', to: '\nSee `docs/Rationale.md`.\n\n## Read and serve', fails: 'references a missing path: docs/Rationale.md'},
  {name: 'checker run from a subdirectory', cwd: 'docs'},
  {name: 'missing history tag names the fetch command', dropTag: 'docs-history-2026-09-24', fails: 'git fetch origin tag docs-history-2026-09-24', absent: 'missing historical source'},
  {name: 'history tags checked outside a git repository', hideGit: true, fails: 'not a git repository', absent: 'git fetch origin tag'},
  {name: 'history tags checked with git missing from PATH', env: {PATH: ''}, fails: 'ENOENT', absent: 'git fetch origin tag'},
];

function prepare(scratch) {
  git(['clone', '--quiet', '--no-hardlinks', root, scratch]);
  const listed = git(['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {cwd: root});
  for (const file of listed.split('\0').filter(Boolean)) {
    mkdirSync(path.dirname(path.join(scratch, file)), {recursive: true});
    try { copyFileSync(path.join(root, file), path.join(scratch, file)); }
    catch (error) {
      if (error.code !== 'ENOENT') throw error;
      // A tracked file deleted in the working tree must not survive from the clone's HEAD.
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
  if (probe.hideGit) {
    const repository = path.join(scratch, '.git');
    const hidden = path.join(scratch, '.git-hidden');
    renameSync(repository, hidden);
    return () => renameSync(hidden, repository);
  }
  if (probe.dropTag) {
    const target = git(['rev-parse', `refs/tags/${probe.dropTag}`], {cwd: scratch}).trim();
    git(['tag', '-d', probe.dropTag], {cwd: scratch, stdio: 'ignore'});
    return () => git(['update-ref', `refs/tags/${probe.dropTag}`, target], {cwd: scratch});
  }
  return () => {};
}

// The checker writes one "✗ " line per finding. Any other stderr line is a crash or stray output, whatever it says.
function problemWith(probe, result) {
  const lines = result.stderr.split('\n').filter(Boolean);
  const stray = lines.find(line => !line.startsWith('✗ '));
  if (stray) return `stderr holds a line that is not a finding: ${stray}`;
  if (probe.absent && lines.some(line => line.includes(probe.absent))) return `output must not contain "${probe.absent}"`;
  if (!probe.fails) return result.status === 0 ? null : 'expected a pass';
  return result.status === 1 && lines.some(line => line.includes(probe.fails)) ? null : `expected a rejection containing "${probe.fails}"`;
}
const only = process.argv[2];
const selected = only ? PROBES.filter(probe => probe.name.includes(only)) : PROBES;
if (!selected.length) { console.error(`no probe name contains "${only}"`); process.exit(2); }
const scratch = mkdtempSync(path.join(os.tmpdir(), 'doc-checker-'));
let failed = 0;
try {
  prepare(scratch);
  for (const probe of selected) {
    const undo = mutate(scratch, probe);
    const result = spawnSync(process.execPath, [path.join(scratch, CHECKER)], {cwd: path.join(scratch, probe.cwd ?? ''), encoding: 'utf8', env: {...env, ...probe.env, GIT_CEILING_DIRECTORIES: realpathSync(path.dirname(scratch))}});
    undo();
    const problem = problemWith(probe, result);
    const detail = `${result.stderr}\n${result.stdout}`.split('\n').find(line => /^[✓✗]/.test(line)) ?? '';
    if (!problem) console.log(`ok    ${probe.name}`);
    else { failed++; console.log(`FAIL  ${probe.name}\n      ${problem}, got exit ${result.status}: ${detail}`); }
  }
} finally {
  rmSync(scratch, {recursive: true, force: true});
}
console.log(`\n${selected.length} probes · ${selected.length - failed} ok · ${failed} failed`);
process.exit(failed ? 1 : 0);
