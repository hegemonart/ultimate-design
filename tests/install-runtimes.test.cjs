'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const {
  RUNTIMES,
  getRuntime,
  listRuntimes,
  listRuntimeIds,
  REPO,
  MARKETPLACE_NAME,
  PLUGIN_NAME,
} = require('../scripts/lib/install/runtimes.cjs');

test('runtimes: 14 entries shipped', () => {
  assert.equal(RUNTIMES.length, 14);
});

test('runtimes: each entry has the required keys', () => {
  for (const r of RUNTIMES) {
    assert.equal(typeof r.id, 'string', `${r.id}: id missing`);
    assert.equal(typeof r.displayName, 'string', `${r.id}: displayName missing`);
    assert.equal(typeof r.configDirEnv, 'string', `${r.id}: configDirEnv missing`);
    assert.equal(typeof r.configDirFallback, 'string', `${r.id}: configDirFallback missing`);
    assert.ok(['claude-marketplace', 'agents-md'].includes(r.kind), `${r.id}: bad kind`);
    assert.ok(Array.isArray(r.files), `${r.id}: files must be array`);
  }
});

test('runtimes: ids unique', () => {
  const seen = new Set();
  for (const r of RUNTIMES) {
    assert.ok(!seen.has(r.id), `duplicate id: ${r.id}`);
    seen.add(r.id);
  }
});

test('runtimes: claude entry uses claude-marketplace kind', () => {
  const claude = getRuntime('claude');
  assert.equal(claude.kind, 'claude-marketplace');
  assert.deepEqual(claude.marketplaceEntry, {
    name: MARKETPLACE_NAME,
    pluginName: PLUGIN_NAME,
    repo: REPO,
  });
});

test('runtimes: gemini drops GEMINI.md', () => {
  const gemini = getRuntime('gemini');
  assert.equal(gemini.kind, 'agents-md');
  assert.deepEqual(gemini.files, ['GEMINI.md']);
});

test('runtimes: agents-md runtimes drop AGENTS.md', () => {
  const ids = ['opencode', 'kilo', 'codex', 'copilot', 'cursor', 'windsurf', 'antigravity', 'augment', 'trae', 'qwen', 'codebuddy', 'cline'];
  for (const id of ids) {
    const r = getRuntime(id);
    assert.equal(r.kind, 'agents-md', `${id}: should be agents-md`);
    assert.deepEqual(r.files, ['AGENTS.md'], `${id}: should drop AGENTS.md`);
  }
});

test('runtimes: getRuntime throws for unknown id', () => {
  assert.throws(() => getRuntime('does-not-exist'), /Unknown runtime/);
});

test('runtimes: listRuntimes returns the same length as listRuntimeIds', () => {
  assert.equal(listRuntimes().length, listRuntimeIds().length);
});

test('runtimes: matches Phase 24 baseline file', () => {
  const fs = require('node:fs');
  const baselinePath = path.join(__dirname, '..', 'test-fixture', 'baselines', 'phase-24', 'runtimes.txt');
  const baselineIds = fs.readFileSync(baselinePath, 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
  const sortedIds = [...listRuntimeIds()].sort();
  assert.deepEqual(sortedIds, baselineIds);
});
