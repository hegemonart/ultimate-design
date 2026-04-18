'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { REPO_ROOT } = require('./helpers.cjs');

function parseSemver(v) {
  const m = v.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!m) throw new Error(`Invalid semver: ${v}`);
  return { major: +m[1], minor: +m[2], patch: +m[3] };
}

function isExactPatchBump(from, to) {
  const a = parseSemver(from);
  const b = parseSemver(to);
  return a.major === b.major &&
         a.minor === b.minor &&
         b.patch === a.patch + 1;
}

// Version sequence per roadmap: v1.0.0 → v1.0.1 → ... → v1.0.7 → v1.0.7.3 (off-cadence)
// Phase 12 did not ship a manifest bump in this worktree; 1.0.6 included for
// sequence continuity but the tree jumps 1.0.5 → 1.0.7 at Phase 13 closeout.
// Phase 13.3 ships off-cadence as v1.0.7.3 (4-segment); does not shift Phase 14 → v1.0.8.
const EXPECTED_SEQUENCE = [
  '1.0.0', '1.0.1', '1.0.2', '1.0.3', '1.0.4', '1.0.5', '1.0.6', '1.0.7', '1.0.7.3'
];

// Strict +0.0.1 patch-bump check applies only to the 3-segment sequence; off-cadence
// 4-segment patches are validated separately by their inclusion in EXPECTED_SEQUENCE.
const STRICT_PATCH_SEQUENCE = EXPECTED_SEQUENCE.filter(v => /^\d+\.\d+\.\d+$/.test(v));

test('semver-compare: consecutive versions in sequence are exact patch bumps', () => {
  for (let i = 1; i < STRICT_PATCH_SEQUENCE.length; i++) {
    const from = STRICT_PATCH_SEQUENCE[i - 1];
    const to = STRICT_PATCH_SEQUENCE[i];
    assert.ok(
      isExactPatchBump(from, to),
      `Version jump from ${from} to ${to} is not an exact patch bump (+0.0.1)`
    );
  }
});

test('semver-compare: plugin.json version is in expected sequence', () => {
  const pluginJson = JSON.parse(
    fs.readFileSync(path.join(REPO_ROOT, '.claude-plugin', 'plugin.json'), 'utf8')
  );
  assert.ok(
    EXPECTED_SEQUENCE.includes(pluginJson.version),
    `plugin.json version "${pluginJson.version}" is not in expected sequence: ${EXPECTED_SEQUENCE.join(' → ')}`
  );
});

test('semver-compare: plugin.json and marketplace.json versions match', () => {
  const pluginJson = JSON.parse(
    fs.readFileSync(path.join(REPO_ROOT, '.claude-plugin', 'plugin.json'), 'utf8')
  );
  const marketplaceJson = JSON.parse(
    fs.readFileSync(path.join(REPO_ROOT, '.claude-plugin', 'marketplace.json'), 'utf8')
  );
  // marketplace.json stores version under metadata.version
  const marketplaceVersion = marketplaceJson.metadata
    ? marketplaceJson.metadata.version
    : marketplaceJson.version;
  assert.equal(
    pluginJson.version,
    marketplaceVersion,
    `plugin.json (${pluginJson.version}) and marketplace.json (${marketplaceVersion}) versions must match`
  );
});
