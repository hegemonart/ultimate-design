'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { REPO_ROOT, readFrontmatter, countLines } = require('./helpers.cjs');

const AGENTS_DIR = path.join(REPO_ROOT, 'agents');

const TIER_LIMITS = {
  XL: 500,
  LARGE: 350,
  DEFAULT: 250,
};

const agentFiles = fs.readdirSync(AGENTS_DIR)
  .filter(f => f.startsWith('design-') && f.endsWith('.md'))
  .sort();

for (const agentFile of agentFiles) {
  const filePath = path.join(AGENTS_DIR, agentFile);

  test(`agent-size-budget: ${agentFile} within line-count budget`, () => {
    const fm = readFrontmatter(filePath);
    const tier = (fm.size_budget || 'DEFAULT').toUpperCase();
    const limit = TIER_LIMITS[tier];

    assert.ok(
      limit !== undefined,
      `agents/${agentFile}: unknown size_budget tier "${tier}". Valid values: XL, LARGE, DEFAULT`
    );

    const lineCount = countLines(filePath);
    assert.ok(
      lineCount <= limit,
      `agents/${agentFile}: ${lineCount} lines exceeds ${tier} budget of ${limit} lines.\n` +
      `To raise: add size_budget: XL to frontmatter AND include rationale in the PR description.`
    );
  });
}
