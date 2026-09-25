#!/usr/bin/env node
/** Check document structure, not the truth or completeness of the model's decisions. */
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import path from 'node:path';

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
const read = file => existsSync(file) && statSync(file).isFile() ? readFileSync(file, 'utf8') : '';

function withoutFences(markdown) {
  let fence = null;
  return markdown.split('\n').map(line => {
    const marker = line.match(/^\s*(```|~~~)/)?.[1];
    if (marker && (!fence || marker === fence)) { fence = fence ? null : marker; return ''; }
    return fence ? '' : line;
  }).join('\n');
}

function anchors(markdown) {
  const found = new Set();
  for (const line of withoutFences(markdown).split('\n')) {
    const heading = line.match(/^#{1,6} (.+)$/);
    if (heading) found.add(slug(heading[1].replace(/<[^>]*>|[`*_]/g, '')));
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

const documents = [...expectedParts.filter(existsSync), LEDGER, 'README.md'].filter(file => read(file));
const content = new Map(documents.map(file => [file, read(file)]));
const fileAnchors = new Map([...content].map(([file, markdown]) => [file, anchors(markdown)]));
const snapshotAnchors = new Set(expectedParts.flatMap(file => [...(fileAnchors.get(file) || [])]));
const chartTitles = new Set();
const chartRefs = [];
let chartCount = 0;
for (const file of expectedParts.filter(existsSync)) {
  const markdown = read(file);
  const starts = [...markdown.matchAll(/^```pipeline-graph\s*$/gm)].length;
  const blocks = [...markdown.matchAll(/^```pipeline-graph\s*\n([\s\S]*?)^```\s*$/gm)];
  if (starts !== blocks.length) fail(file, 'unclosed pipeline-graph block');
  for (const block of blocks) {
    chartCount++;
    let chart;
    try { chart = JSON.parse(block[1]); }
    catch (error) { fail(file, `invalid chart JSON: ${error.message}`); continue; }
    if (typeof chart.title !== 'string' || !chart.title.trim()) { fail(file, 'chart title is missing'); continue; }
    const chartKey = slug(chart.title);
    if (chartTitles.has(chartKey)) fail(file, `duplicate chart title: ${chart.title}`);
    chartTitles.add(chartKey);
    snapshotAnchors.add(`chart-${chartKey}`);
    if (!Array.isArray(chart.nodes) || !Array.isArray(chart.edges)) { fail(file, `chart ${chart.title} needs nodes and edges arrays`); continue; }
    const nodeIds = new Set();
    for (const node of chart.nodes) {
      if (typeof node?.id !== 'string' || !node.id || nodeIds.has(node.id)) fail(file, `chart ${chart.title} has a missing or duplicate node ID`);
      else nodeIds.add(node.id);
      if (typeof node?.label !== 'string' || !Number.isFinite(node.x) || !Number.isFinite(node.y)) fail(file, `chart ${chart.title} has an invalid node`);
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
  if (typeof target !== 'string' || !chartTitles.has(slug(target))) fail(file, `chart ${title} links to unknown chart ${String(target)}`);
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
    const known = !pathname && file.startsWith(`${SNAPSHOT}/`) ? snapshotAnchors : fileAnchors.get(destination);
    if (fragment.startsWith('r-') && !pathname) {
      if (!entryIds.has(fragment)) fail(file, `unknown rationale ID: ${fragment}`);
    } else if (!known?.has(fragment)) fail(file, `broken local anchor: ${target}`);
  }
}
for (const id of entryIds) if (!referenced.has(id)) fail(LEDGER, `unused rationale ID: ${id}`);

for (const tag of TAGS) {
  try { execFileSync('git', ['rev-parse', '--verify', `${tag}^{tag}`], {stdio: 'ignore'}); }
  catch { fail(tag, 'annotated history tag is missing'); continue; }
  const cache = new Map();
  const traces = new RegExp(`${tag}:([A-Za-z0-9_./-]+\\.md)(?:#([a-z0-9-]+))?`, 'g');
  for (const [file, markdown] of content) {
    for (const match of withoutFences(markdown).matchAll(traces)) {
      const [, source, fragment] = match;
      if (!cache.has(source)) {
        try { cache.set(source, readFileSyncFromTag(tag, source)); }
        catch { cache.set(source, null); }
      }
      const text = cache.get(source);
      if (text === null) { fail(file, `missing historical source: ${tag}:${source}`); continue; }
      if (fragment && ![...anchors(text)].some(anchor => anchor.startsWith(fragment))) fail(file, `missing historical heading: ${tag}:${source}#${fragment}`);
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
