#!/usr/bin/env node
/** Check document structure, not the truth or completeness of the model's decisions. */
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Every path below is relative to the repository root, whichever directory runs the checker.
process.chdir(path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));

const MANIFEST = 'docs/snapshot.parts.json';
const SNAPSHOT = 'docs/snapshot';
const LEDGER = 'docs/RATIONALE.md';
const TAGS = ['docs-history-2026-07-30', 'docs-history-2026-09-24'];
const RETIRED = [
  'HANDOFF.md', 'ROADMAP.md', 'sdlc-evolution-ideas.md',
  'REVIEW-ASSESSMENT-2026-07.md', 'sdlc-design/', 'sdlc-design.parts.json',
  'sdlc-design.html', 'sdlc-canvas/', 'sdlc-canvas.parts.json',
  'docs/agent-architecture/', 'docs/ai_agent_evaluation_metrics_kpis_2026.md',
];
const errors = [];
const fail = (file, message) => errors.push(`${file}: ${message}`);
const slug = text => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const headingSlug = text => slug(text.replace(/<[^>]*>|[`*_]/g, ''));
const githubSlug = text => text.replace(/<[^>]*>|[`*]/g, '').toLowerCase().replace(/[^\p{L}\p{N}\p{M} _-]/gu, '').replace(/ /g, '-');
const read = file => existsSync(file) && statSync(file).isFile() ? readFileSync(file, 'utf8') : '';
const chartBlocks = /^```pipeline-graph\s*\n([\s\S]*?)^```\s*$/gm;

function scanFences(markdown) {
  let fence = null;
  const lines = markdown.split('\n').map(line => {
    const marker = line.match(/^\s*(```|~~~)/)?.[1];
    if (marker && (!fence || marker === fence)) { fence = fence ? null : marker; return ''; }
    return fence ? '' : line;
  });
  return {prose: lines.join('\n'), unclosed: fence !== null};
}
const withoutFences = markdown => scanFences(markdown).prose;

function anchors(markdown, toSlug = headingSlug) {
  const found = new Set();
  for (const line of withoutFences(markdown).split('\n')) {
    const heading = line.match(/^#{1,6} (.+)$/);
    if (heading) found.add(toSlug(heading[1]));
    for (const match of line.matchAll(/<[a-z][^>]*\sid="([^"]+)"[^>]*>/g)) found.add(match[1]);
  }
  return found;
}

let manifest = {};
try { manifest = JSON.parse(readFileSync(MANIFEST, 'utf8')); }
catch (error) { fail(MANIFEST, `missing or invalid manifest: ${error.message}`); }
if (manifest.rationale !== LEDGER) fail(MANIFEST, `rationale must point to ${LEDGER}`);
const parts = Array.isArray(manifest.parts) ? manifest.parts : [];
if (!Array.isArray(manifest.parts)) fail(MANIFEST, 'parts must be an array');
const chapterFiles = existsSync(SNAPSHOT) ? readdirSync(SNAPSHOT).filter(f => f.endsWith('.md')).sort() : [];
const expectedParts = chapterFiles.map(file => `${SNAPSHOT}/${file}`);
if (!chapterFiles.length) fail(SNAPSHOT, 'no model chapters found');
for (const [index, file] of chapterFiles.entries()) {
  const number = file.match(/^(\d+)-[a-z0-9-]+\.md$/);
  if (!number || Number(number[1]) !== index) fail(SNAPSHOT, `chapter filename is out of sequence: ${file}`);
}
const seenParts = new Set();
for (const part of parts) {
  if (typeof part !== 'string' || !part.startsWith(`${SNAPSHOT}/`) || path.posix.normalize(part) !== part) {
    fail(MANIFEST, `invalid chapter path: ${String(part)}`);
    continue;
  }
  if (seenParts.has(part)) fail(MANIFEST, `duplicate chapter: ${part}`);
  seenParts.add(part);
  if (!existsSync(part) || !statSync(part).isFile()) fail(MANIFEST, `missing chapter: ${part}`);
  if (!expectedParts.includes(part)) fail(MANIFEST, `unlisted chapter path: ${part}`);
}
for (const chapter of expectedParts) if (!seenParts.has(chapter)) fail(MANIFEST, `chapter not listed: ${chapter}`);
for (const chapter of expectedParts) if (!read(chapter).trim()) fail(chapter, 'chapter is empty');
if (parts.length === expectedParts.length && parts.some((part, index) => part !== expectedParts[index])) {
  fail(MANIFEST, 'chapter order differs from numbered filenames');
}
const rootMarkdown = readdirSync('.').filter(file => file.endsWith('.md')).sort();
if (rootMarkdown.join(',') !== 'README.md') fail('.', `README.md must be the only root Markdown file (found: ${rootMarkdown.join(', ') || 'none'})`);
if (!existsSync('index.html')) fail('index.html', 'model viewer is missing');
const styledGroups = new Set([...read('index.html').matchAll(/node\[group="([^"]+)"\]/g)].map(match => match[1]));
if (existsSync('index.html') && !styledGroups.size) fail('index.html', 'viewer styles no chart node groups');
if (!existsSync(LEDGER)) fail(LEDGER, 'rationale ledger is missing');
for (const retired of RETIRED) if (existsSync(retired)) fail(retired, 'retired path is still active');

const ledger = read(LEDGER);
const entryIds = new Set();
for (const line of withoutFences(ledger).split('\n').filter(line => line.startsWith('### '))) {
  const marker = line.match(/^### <a id="(r-[a-z]+-\d+)"><\/a>(R-[A-Z]+-\d+) · .+$/);
  if (!marker || marker[1] !== marker[2].toLowerCase()) { fail(LEDGER, `malformed decision marker: ${line}`); continue; }
  if (entryIds.has(marker[1])) fail(LEDGER, `duplicate rationale ID: ${marker[1]}`);
  entryIds.add(marker[1]);
}
if (!entryIds.size) fail(LEDGER, 'no rationale decisions found');
if ([...withoutFences(ledger).matchAll(/<a id="[^"]+"><\/a>/g)].length !== entryIds.size) {
  fail(LEDGER, 'every decision anchor must use one canonical H3 marker');
}
const scopes = new Map();
for (const entry of withoutFences(ledger).split(/^(?=### )/m)) {
  const id = entry.match(/^### <a id="(r-[a-z]+-\d+)">/)?.[1];
  const scope = [...entry.matchAll(/^- \*\*(?:Governs|Applies to)\.\*\*([\s\S]*?)(?=^- \*\*|(?![\s\S]))/gm)].map(match => match[1]).join('\n');
  if (id) scopes.set(id, new Set(scope.match(new RegExp(`${SNAPSHOT}/[\\w.-]+\\.md`, 'g')) ?? []));
}

const documents = [...expectedParts.filter(existsSync), LEDGER, 'README.md'].filter(file => read(file));
const content = new Map(documents.map(file => [file, read(file)]));
for (const [file, markdown] of content) if (scanFences(markdown).unclosed) fail(file, 'unclosed code fence');
const fileAnchors = new Map([...content].map(([file, markdown]) => [file, anchors(markdown)]));
// GitHub renders the README and the ledger one file at a time with its own heading anchors. The viewer
// joins the chapters into one page and slugs headings differently, so chapter links keep fileAnchors.
const githubAnchors = new Map([...content].map(([file, markdown]) => [file, anchors(markdown, githubSlug)]));
const snapshotAnchors = new Set(expectedParts.flatMap(file => [...(fileAnchors.get(file) || [])]));
const chartsByKey = new Map();
const chartRefs = [];
let chartCount = 0;
for (const file of expectedParts.filter(existsSync)) {
  const markdown = read(file);
  const starts = [...markdown.matchAll(/^```pipeline-graph\s*$/gm)].length;
  const blocks = [...markdown.matchAll(chartBlocks)];
  if (starts !== blocks.length) fail(file, 'unclosed pipeline-graph block');
  for (const block of blocks) {
    chartCount++;
    let chart;
    try { chart = JSON.parse(block[1]); }
    catch (error) { fail(file, `invalid chart JSON: ${error.message}`); continue; }
    if (typeof chart.title !== 'string' || !chart.title.trim()) { fail(file, 'chart title is missing'); continue; }
    const chartKey = slug(chart.title);
    if (chartsByKey.has(chartKey)) fail(file, `duplicate chart title: ${chart.title}`);
    chartsByKey.set(chartKey, {file, title: chart.title, level: chart.level});
    snapshotAnchors.add(`chart-${chartKey}`);
    if (!Array.isArray(chart.nodes) || !Array.isArray(chart.edges)) { fail(file, `chart ${chart.title} needs nodes and edges arrays`); continue; }
    const nodeIds = new Set();
    for (const node of chart.nodes) {
      if (typeof node?.id !== 'string' || !node.id || nodeIds.has(node.id)) fail(file, `chart ${chart.title} has a missing or duplicate node ID`);
      else nodeIds.add(node.id);
      if (typeof node?.label !== 'string' || !Number.isFinite(node.x) || !Number.isFinite(node.y)) fail(file, `chart ${chart.title} has an invalid node`);
      if (styledGroups.size && node?.group !== undefined && !styledGroups.has(node.group)) fail(file, `chart ${chart.title} has a node in unstyled group ${node.group}`);
    }
    for (const edge of chart.edges) {
      if (!nodeIds.has(edge?.source) || !nodeIds.has(edge?.target)) fail(file, `chart ${chart.title} has an edge to an unknown node`);
    }
    if (chart.zoomOut) chartRefs.push([file, chart.title, chart.zoomOut]);
    if (chart.zoomIn !== undefined && !Array.isArray(chart.zoomIn)) fail(file, `chart ${chart.title} has invalid zoomIn data`);
    for (const target of Array.isArray(chart.zoomIn) ? chart.zoomIn : []) chartRefs.push([file, chart.title, target]);
  }
}
for (const [file, title, target] of chartRefs) {
  if (typeof target !== 'string' || !chartsByKey.has(slug(target))) fail(file, `chart ${title} links to unknown chart ${String(target)}`);
}

const ladderRow = /^\| \*\*(L\d+)\*\* \| (.+?) \| .+ \| (\[Ch\. \d+\]\(#[^)]+\)) \|$/;
const chapterAnchor = file => headingSlug(withoutFences(read(file)).match(/^## (.+)$/m)?.[1] ?? '');
const listedCharts = new Set();
let ladderRows = 0;
for (const file of expectedParts) {
  for (const line of withoutFences(read(file)).split('\n')) {
    const row = line.match(ladderRow);
    if (!row) continue;
    ladderRows++;
    const [, level, title, link] = row;
    const key = slug(title);
    const chart = chartsByKey.get(key);
    if (!chart) { fail(file, `ladder row names an unknown chart: ${title}`); continue; }
    if (listedCharts.has(key)) fail(file, `chart ladder lists ${title} twice`);
    listedCharts.add(key);
    const chartLevel = String(chart.level).match(/^L\d+/)?.[0];
    if (level !== chartLevel) fail(file, `ladder row ${title} says ${level} but its chart is ${chartLevel ?? 'unlabelled'}`);
    const expectedLink = `[Ch. ${expectedParts.indexOf(chart.file)}](#${chapterAnchor(chart.file)})`;
    if (link !== expectedLink) fail(file, `ladder row ${title} should link ${expectedLink}`);
  }
}
if (!ladderRows) fail(SNAPSHOT, 'chart ladder table is missing');
for (const [key, chart] of chartsByKey) if (!listedCharts.has(key)) fail(chart.file, `chart ladder is missing ${chart.title}`);

const sectionNumbers = markdown => [...withoutFences(markdown).matchAll(/^#{2,6} (\d+(?:\.\d+)*)\.? /gm)].map(match => match[1]);
const snapshotSections = new Set(expectedParts.flatMap(file => sectionNumbers(read(file))));
// Prose and chart text with markup removed and each paragraph on one line, so a hard wrap or emphasis cannot hide a phrase.
const plainText = markdown => [withoutFences(markdown), ...[...markdown.matchAll(chartBlocks)].map(block => block[1])]
  .join('\n\n').split(/\n\s*\n/).map(paragraph => paragraph.replace(/[*_`]/g, '').replace(/\s+/g, ' ')).join('\n\n');
const plain = new Map([...content].map(([file, markdown]) => [file, plainText(markdown)]));
const SECTION_REF = '§(\\d+(?:\\.\\d+)*)(?:[–-](\\d+(?:\\.\\d+)*))?';
for (const [file, text] of plain) {
  if (file === LEDGER) continue; // its chapter and section numbers may cite retired documents; the history check below owns them
  for (const [, list] of text.matchAll(/\b(?:Chapters?|Ch\.) (\d+(?:(?:, | and |[–-])\d+)*)/gi)) {
    for (const number of list.match(/\d+/g)) if (!snapshotSections.has(number)) fail(file, `references missing chapter ${number}`);
  }
  for (const [, first, last] of text.matchAll(new RegExp(SECTION_REF, 'g'))) {
    for (const number of [first, last].filter(Boolean)) if (!snapshotSections.has(number)) fail(file, `references missing section §${number}`);
  }
}

const rootNames = readdirSync('.').filter(name => !name.startsWith('.')).map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const repoPath = new RegExp(`\`((?:${rootNames.join('|')})(?:/[A-Za-z0-9_.-]*)*)(?:#([a-z0-9-]+))?\``, 'g');
for (const [file, markdown] of content) {
  for (const [, target, fragment] of withoutFences(markdown).matchAll(repoPath)) {
    if (!existsSync(target)) fail(file, `references a missing path: ${target}`);
    else if (fragment && !githubAnchors.get(target)?.has(fragment)) fail(file, `references a missing heading: ${target}#${fragment}`);
  }
}

const COUNT_WORDS = {two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12};
const countPattern = (before, after) => new RegExp(`${before}\\b(${Object.keys(COUNT_WORDS).join('|')})\\b${after}`, 'gi');
const bedrock = withoutFences(expectedParts.map(read).find(markdown => /^### The \w+ first-order stones$/m.test(markdown)) ?? '');
const firstOrder = [...bedrock.matchAll(/^\| \d+ \| \*\*/gm)].length;
const secondOrder = [...bedrock.matchAll(/^\d+\. \*\*/gm)].length;
const stonesFound = firstOrder > 0 && secondOrder > 0;
if (!stonesFound) fail(SNAPSHOT, 'stone table or second-order list not found');
const stonesTotal = firstOrder + secondOrder;
// Chapters only: the ledger quotes retired counts on purpose. Nouns that name no single tier accept any tier's count.
const stoneClaims = !stonesFound ? [] : [
  [countPattern('', ' first-order stones'), [firstOrder], 'the stone table has'],
  [countPattern('\\bfirst ', ' stones'), [firstOrder], 'the stone table has'],
  [countPattern('', ' (?:conditional )?second-order (?:stones|seats)'), [secondOrder], 'the second-order list has'],
  [countPattern('', ' seats'), [secondOrder], 'the second-order list has'],
  [countPattern('', ' forces'), [stonesTotal], 'the stones number'],
  [countPattern('(?<!first )', ' (?:stones|pressures)'), [firstOrder, secondOrder, stonesTotal], 'the stones number'],
];
for (const file of expectedParts) {
  for (const [pattern, expected, counted] of stoneClaims) {
    for (const [phrase, word] of (plain.get(file) ?? '').matchAll(pattern)) {
      if (!expected.includes(COUNT_WORDS[word.toLowerCase()])) fail(file, `says ${phrase} but ${counted} ${expected.join(' or ')}`);
    }
  }
}

const referenced = new Set();
const linkPattern = /\]\((<[^>]+>|[^)\s]+)(?:\s+"[^"]*")?\)/g;
for (const [file, markdown] of content) {
  const prose = withoutFences(markdown);
  const activeProse = prose.replace(/docs-history-2026-(?:07-30|09-24):[A-Za-z0-9_./-]+(?:#[a-z0-9-]+)?/g, '');
  for (const retired of RETIRED) {
    if (activeProse.includes(retired)) fail(file, `references retired active path: ${retired}`);
  }
  if (/file:\/\/\//.test(prose)) fail(file, 'contains a file:/// URL');
  for (const match of prose.matchAll(/\]\(\s*file:\/\//g)) fail(file, `contains a file:// link at offset ${match.index}`);
  for (const match of prose.matchAll(/\]\([^)]*\.md:\d+(?:\)|#)/g)) fail(file, `contains a pseudo-line link at offset ${match.index}`);
  if (file.startsWith(`${SNAPSHOT}/`)) {
    const markers = [...prose.matchAll(/\[↪ Why[^\]]*\]\(#(r-[a-z]+-\d+)\)/g)];
    if ((prose.match(/↪ Why/g) || []).length !== markers.length) fail(file, 'malformed ↪ Why marker');
    for (const [, id] of markers) {
      if (entryIds.has(id) && !scopes.get(id)?.has(file)) fail(file, `links ${id} but its ledger entry does not declare ${file}`);
    }
  }
  for (const match of prose.replace(/`[^`\n]*`/g, '').matchAll(linkPattern)) {
    let target = match[1].replace(/^<|>$/g, '');
    try { target = decodeURIComponent(target); }
    catch { fail(file, `invalid link encoding: ${target}`); continue; }
    if (/^file:\/\//i.test(target)) { fail(file, `file:// link: ${target}`); continue; }
    if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('//')) continue;
    const [pathname, fragment] = target.split('#', 2);
    const destination = !pathname ? file : pathname.startsWith('/') ? pathname.slice(1) : path.posix.normalize(path.posix.join(path.posix.dirname(file), pathname));
    if (!existsSync(destination)) { fail(file, `broken local link: ${target}`); continue; }
    if (!fragment) continue;
    if (fragment.startsWith('r-')) referenced.add(fragment);
    let known = githubAnchors.get(destination);
    if (file.startsWith(`${SNAPSHOT}/`)) known = pathname ? fileAnchors.get(destination) : snapshotAnchors;
    if (fragment.startsWith('r-') && !pathname) {
      if (!entryIds.has(fragment)) fail(file, `unknown rationale ID: ${fragment}`);
    } else if (!known?.has(fragment)) fail(file, `broken local anchor: ${target}`);
  }
}
for (const id of entryIds) if (!referenced.has(id)) fail(LEDGER, `unused rationale ID: ${id}`);

const missingTags = new Set();
for (const tag of TAGS) {
  try { execFileSync('git', ['rev-parse', '--verify', `${tag}^{tag}`], {stdio: 'ignore'}); }
  catch { fail(tag, `annotated history tag is missing; run: git fetch origin tag ${tag}`); missingTags.add(tag); }
}
const historyCache = new Map();
function historicalText(tag, source) {
  const key = `${tag}:${source}`;
  if (!historyCache.has(key)) {
    try { historyCache.set(key, readFileSyncFromTag(tag, source)); }
    catch { historyCache.set(key, null); }
  }
  return historyCache.get(key);
}
function checkHistoricalSource(file, tag, source, fragment) {
  const cited = {tag, source, sections: null};
  if (missingTags.has(tag)) return cited;
  const text = historicalText(tag, source);
  if (text === null) { fail(file, `missing historical source: ${tag}:${source}`); return cited; }
  if (fragment && ![...anchors(text)].some(anchor => anchor.startsWith(fragment))) fail(file, `missing historical heading: ${tag}:${source}#${fragment}`);
  return {...cited, sections: new Set(sectionNumbers(text))};
}
function checkLocators(file, cited, numbers) {
  for (const number of numbers) {
    if (!cited) fail(file, `section sign §${number} follows no historical source`);
    else if (cited.sections && !cited.sections.has(number)) fail(file, `missing historical locator: §${number} in ${cited.tag}:${cited.source}`);
  }
}
const historyToken = new RegExp(`(${TAGS.join('|')}):([A-Za-z0-9_./-]+\\.md)(?:#([a-z0-9-]+))?|${SECTION_REF}`, 'g');
for (const [file, markdown] of content) {
  let cited = null;
  for (const line of withoutFences(markdown).split('\n')) {
    if (/^#{1,6} /.test(line)) cited = null;
    for (const [, tag, source, fragment, ...numbers] of line.matchAll(historyToken)) {
      if (tag) cited = checkHistoricalSource(file, tag, source, fragment);
      else if (file === LEDGER) checkLocators(file, cited, numbers.filter(Boolean));
    }
  }
}

function readFileSyncFromTag(tag, source) {
  return execFileSync('git', ['show', `${tag}:${source}`], {encoding: 'utf8', maxBuffer: 1 << 26});
}

if (errors.length) {
  for (const error of errors) console.error(`✗ ${error}`);
  process.exit(1);
}
console.log(`✓ doc structure: ${chapterFiles.length} chapters · ${entryIds.size} rationale IDs · ${chartCount} charts`);
