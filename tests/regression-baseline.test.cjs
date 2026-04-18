'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { REPO_ROOT } = require('./helpers.cjs');

const BASELINE_DIR = path.join(REPO_ROOT, 'test-fixture', 'baselines', 'phase-6');

function readBaseline(filename) {
  return fs.readFileSync(path.join(BASELINE_DIR, filename), 'utf8').trim();
}

function readBaselineLines(filename) {
  return readBaseline(filename).split('\n').map(l => l.trim()).filter(Boolean).sort();
}

test('baseline: agent-list matches agents/ directory', () => {
  const expected = readBaselineLines('agent-list.txt');
  const actual = fs.readdirSync(path.join(REPO_ROOT, 'agents'))
    .filter(f => f.startsWith('design-') && f.endsWith('.md'))
    .sort();
  assert.deepEqual(actual, expected,
    `Agent list drift detected. Expected:\n${expected.join('\n')}\nActual:\n${actual.join('\n')}\n\nIf intentional, re-lock the baseline per test-fixture/baselines/phase-6/README.md`
  );
});

test('baseline: skill-list matches skills/ directory', () => {
  const expected = readBaselineLines('skill-list.txt');
  const actual = fs.readdirSync(path.join(REPO_ROOT, 'skills'))
    .filter(name => {
      const fullPath = path.join(REPO_ROOT, 'skills', name);
      return fs.statSync(fullPath).isDirectory();
    })
    .sort();
  assert.deepEqual(actual, expected,
    `Skill list drift detected. Re-lock if intentional.`
  );
});

test('baseline: connection-list matches connections/ directory', () => {
  const expected = readBaselineLines('connection-list.txt');
  const actual = fs.readdirSync(path.join(REPO_ROOT, 'connections'))
    .filter(f => f.endsWith('.md'))
    .sort();
  assert.deepEqual(actual, expected,
    `Connection list drift detected. Re-lock if intentional.`
  );
});

test('baseline: plugin version matches plugin-version.txt', () => {
  const expected = readBaseline('plugin-version.txt');
  const pluginJson = JSON.parse(
    fs.readFileSync(path.join(REPO_ROOT, '.claude-plugin', 'plugin.json'), 'utf8')
  );
  // Allow version to be >= baseline (phases bump version; regression baseline
  // captures the MINIMUM version, not the exact current version).
  // Parse semver parts and confirm current >= baseline.
  const parse = v => v.split('.').map(Number);
  const [bMaj, bMin, bPat] = parse(expected);
  const [cMaj, cMin, cPat] = parse(pluginJson.version);
  const current_gte_baseline =
    cMaj > bMaj ||
    (cMaj === bMaj && cMin > bMin) ||
    (cMaj === bMaj && cMin === bMin && cPat >= bPat);
  assert.ok(current_gte_baseline,
    `Plugin version ${pluginJson.version} is LOWER than baseline ${expected}. Version must not regress.`
  );
});

test('baseline: agent frontmatter snapshot — no agent has lost required fields', () => {
  const snapshot = JSON.parse(readBaseline('agent-frontmatter-snapshot.json'));
  const REQUIRED_FIELDS = ['name', 'description', 'tools', 'color'];

  for (const [agentFile, baselineFields] of Object.entries(snapshot)) {
    const agentPath = path.join(REPO_ROOT, 'agents', agentFile);
    assert.ok(
      fs.existsSync(agentPath),
      `Agent file missing: agents/${agentFile} (was present at baseline)`
    );

    const content = fs.readFileSync(agentPath, 'utf8').replace(/\r\n/g, '\n');
    const m = content.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(m, `agents/${agentFile}: no YAML frontmatter found`);

    for (const field of REQUIRED_FIELDS) {
      assert.ok(
        m[1].includes(field + ':'),
        `agents/${agentFile}: required frontmatter field "${field}" is missing`
      );
    }
  }
});
