'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { REPO_ROOT } = require('./helpers.cjs');

/**
 * Drift detector for test-fixture/baselines/phase-<N>/ snapshots.
 *
 * Extends Plan 12-02's regression-baseline.test.cjs (which locks phase-6) to
 * phases 7+. For each phase baseline dir, scan for known manifest files and
 * diff them against current repo state. If a baseline names an artifact that
 * no longer exists, fail with: "Baseline drift detected for phase-<N>. Re-lock
 * via <procedure> or investigate regression."
 *
 * NON-GOALS (explicit): does NOT diff DESIGN-*.md outputs, does NOT re-run
 * real mappers or stages. Purely structural: agent/skill/connection inventory
 * and frontmatter integrity across phases 7+.
 */

const BASELINES_ROOT = path.join(REPO_ROOT, 'test-fixture', 'baselines');

function listTrackedBasenames(prefix) {
  const out = execSync(`git ls-files ${prefix}`, { cwd: REPO_ROOT, encoding: 'utf8' });
  return out.trim().split('\n').filter(Boolean).map(f => path.basename(f));
}

function listTrackedSubdirs(prefix) {
  const out = execSync(`git ls-files ${prefix}`, { cwd: REPO_ROOT, encoding: 'utf8' });
  const seen = new Set();
  for (const line of out.trim().split('\n').filter(Boolean)) {
    const rel = line.slice(prefix.length).replace(/^\//, '');
    const first = rel.split('/')[0];
    if (first) seen.add(first);
  }
  return [...seen].sort();
}

function readLines(p) {
  return fs.readFileSync(p, 'utf8').trim().split('\n').map(l => l.trim()).filter(Boolean).sort();
}

const RELOCK_MSG = 'Re-lock via regenerating the baseline manifest for this phase, or investigate regression.';

// Enumerate phase-* baseline dirs. Skip phase-6 (covered by 12-02).
const phaseDirs = fs.existsSync(BASELINES_ROOT)
  ? fs.readdirSync(BASELINES_ROOT).filter(d => /^phase-/.test(d)).sort()
  : [];

test('regression-baseline-drift: test-fixture/baselines/ root exists', () => {
  assert.ok(fs.existsSync(BASELINES_ROOT),
    'test-fixture/baselines/ must exist');
  assert.ok(phaseDirs.length > 0,
    'at least one phase-* baseline directory must exist');
});

for (const phaseDir of phaseDirs) {
  if (phaseDir === 'phase-6') continue; // handled by tests/regression-baseline.test.cjs (Plan 12-02)

  const dirPath = path.join(BASELINES_ROOT, phaseDir);

  test(`regression-baseline-drift: ${phaseDir} directory exists and contains manifest`, () => {
    assert.ok(fs.existsSync(dirPath), `${phaseDir} dir must exist`);
    const entries = fs.readdirSync(dirPath);
    assert.ok(entries.length > 0,
      `${phaseDir} must not be empty — add BASELINE.md / baseline-manifest.md / README.md`);
  });

  // Optional per-manifest checks — absent manifests skip silently.
  const agentListPath = path.join(dirPath, 'agent-list.txt');
  if (fs.existsSync(agentListPath)) {
    test(`regression-baseline-drift: ${phaseDir} agent-list.txt matches current agents/`, () => {
      const expected = readLines(agentListPath);
      const actual = listTrackedBasenames('agents/')
        .filter(f => f.startsWith('design-') && f.endsWith('.md'))
        .sort();
      // Drift semantics: current set must be a SUPERSET of the baseline
      // (phases may add agents but must not remove what was locked).
      for (const a of expected) {
        assert.ok(actual.includes(a),
          `Baseline drift detected for ${phaseDir}. Agent "${a}" was present at baseline but is missing from agents/. ${RELOCK_MSG}`
        );
      }
    });
  }

  const skillListPath = path.join(dirPath, 'skill-list.txt');
  if (fs.existsSync(skillListPath)) {
    test(`regression-baseline-drift: ${phaseDir} skill-list.txt matches current skills/`, () => {
      const expected = readLines(skillListPath);
      const actual = listTrackedSubdirs('skills/');
      for (const s of expected) {
        assert.ok(actual.includes(s),
          `Baseline drift detected for ${phaseDir}. Skill dir "${s}" was present at baseline but is missing from skills/. ${RELOCK_MSG}`
        );
      }
    });
  }

  const connectionListPath = path.join(dirPath, 'connection-list.txt');
  if (fs.existsSync(connectionListPath)) {
    test(`regression-baseline-drift: ${phaseDir} connection-list.txt matches current connections/`, () => {
      const expected = readLines(connectionListPath);
      const actual = fs.readdirSync(path.join(REPO_ROOT, 'connections'))
        .filter(f => f.endsWith('.md'))
        .sort();
      for (const c of expected) {
        assert.ok(actual.includes(c),
          `Baseline drift detected for ${phaseDir}. Connection "${c}" was present at baseline but is missing from connections/. ${RELOCK_MSG}`
        );
      }
    });
  }

  const pluginVersionPath = path.join(dirPath, 'plugin-version.txt');
  if (fs.existsSync(pluginVersionPath)) {
    test(`regression-baseline-drift: ${phaseDir} plugin version >= baseline`, () => {
      const expected = fs.readFileSync(pluginVersionPath, 'utf8').trim();
      const pluginJson = JSON.parse(
        fs.readFileSync(path.join(REPO_ROOT, '.claude-plugin', 'plugin.json'), 'utf8')
      );
      const parse = v => v.split('.').map(Number);
      const [bMaj, bMin, bPat] = parse(expected);
      const [cMaj, cMin, cPat] = parse(pluginJson.version);
      const gte = cMaj > bMaj ||
        (cMaj === bMaj && cMin > bMin) ||
        (cMaj === bMaj && cMin === bMin && cPat >= bPat);
      assert.ok(gte,
        `Baseline drift detected for ${phaseDir}. Plugin version ${pluginJson.version} is LOWER than baseline ${expected}. ${RELOCK_MSG}`
      );
    });
  }

  const snapshotPath = path.join(dirPath, 'agent-frontmatter-snapshot.json');
  if (fs.existsSync(snapshotPath)) {
    test(`regression-baseline-drift: ${phaseDir} agent-frontmatter-snapshot — agents still exist with required fields`, () => {
      const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
      const REQUIRED = ['name', 'description', 'tools', 'color'];
      for (const agentFile of Object.keys(snapshot)) {
        const agentPath = path.join(REPO_ROOT, 'agents', agentFile);
        assert.ok(fs.existsSync(agentPath),
          `Baseline drift detected for ${phaseDir}. Agent "agents/${agentFile}" was present at baseline but no longer exists. ${RELOCK_MSG}`);
        const content = fs.readFileSync(agentPath, 'utf8').replace(/\r\n/g, '\n');
        const m = content.match(/^---\n([\s\S]*?)\n---/);
        assert.ok(m, `agents/${agentFile} has no YAML frontmatter`);
        for (const field of REQUIRED) {
          assert.ok(m[1].includes(field + ':'),
            `Baseline drift detected for ${phaseDir}. agents/${agentFile} missing required frontmatter field "${field}". ${RELOCK_MSG}`);
        }
      }
    });
  }
}
