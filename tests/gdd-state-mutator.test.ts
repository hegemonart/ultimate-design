// tests/gdd-state-mutator.test.ts — mutator + serializer coverage.
//
// Plan 20-01 acceptance:
//   * Adding a decision appends to the <decisions> block without touching
//     anything else.
//   * Updating position.task_progress preserves all other blocks verbatim.
//   * Removing a decision removes only that line.
//   * Canonical emission when a block was mutated; raw verbatim when not.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { apply, serialize } from '../scripts/lib/gdd-state/mutator.ts';
import { parse } from '../scripts/lib/gdd-state/parser.ts';
import type { ParsedState } from '../scripts/lib/gdd-state/types.ts';
import { REPO_ROOT } from './helpers.ts';

const FIXTURES: string = join(REPO_ROOT, 'tests', 'fixtures', 'state');

function readFixture(name: string): string {
  return readFileSync(join(FIXTURES, name), 'utf8');
}

test('mutator.apply: identity fn returns byte-identical input', () => {
  const raw = readFixture('mid-pipeline.md');
  const out = apply(raw, (s) => s);
  assert.equal(out, raw);
});

test('mutator.apply: adding a decision appends to <decisions> block', () => {
  const raw = readFixture('mid-pipeline.md');
  const out = apply(raw, (s): ParsedState => {
    s.decisions.push({
      id: 'D-99',
      text: 'Added-by-test decision',
      status: 'locked',
    });
    return s;
  });

  // D-99 appears exactly once.
  const matches = out.match(/D-99:/g) ?? [];
  assert.equal(matches.length, 1, 'D-99 must appear exactly once');

  // Appears after D-03 (last pre-existing decision).
  const d03 = out.indexOf('D-03:');
  const d99 = out.indexOf('D-99:');
  assert.ok(d03 > 0 && d99 > d03, 'D-99 must appear after D-03');

  // <decisions> block still present and balanced.
  const openCount = (out.match(/<decisions>/g) ?? []).length;
  const closeCount = (out.match(/<\/decisions>/g) ?? []).length;
  assert.equal(openCount, 1);
  assert.equal(closeCount, 1);

  // Other blocks untouched — compare fragments.
  assert.ok(out.includes('M-01: Hero CTA renders'), 'must_haves untouched');
  assert.ok(out.includes('M-03: Form validation errors'), 'must_haves untouched');
  assert.ok(out.includes('figma: available'), 'connections untouched');
  assert.ok(
    out.includes('[design] [2026-04-23]: Waiting on design-tokens.json'),
    'blockers untouched',
  );
});

test('mutator.apply: updating position.task_progress preserves other blocks verbatim', () => {
  const raw = readFixture('mid-pipeline.md');
  const out = apply(raw, (s): ParsedState => {
    s.position.task_progress = '5/7';
    return s;
  });

  // The only delta should be within the <position> block. Extract each
  // file's pre-/post-position region and compare.
  const positionBlock = /<position>[\s\S]*?<\/position>/;
  const rawPos = raw.match(positionBlock)?.[0];
  const outPos = out.match(positionBlock)?.[0];
  assert.ok(rawPos && outPos);
  assert.notEqual(rawPos, outPos, 'position block differs');
  assert.ok(outPos!.includes('task_progress: 5/7'));

  // Compare rest-of-file (stripping the position blocks):
  const rawRest = raw.replace(positionBlock, '');
  const outRest = out.replace(positionBlock, '');
  assert.equal(outRest, rawRest, 'non-position content unchanged');
});

test('mutator.apply: removing a decision strips only that line', () => {
  const raw = readFixture('mid-pipeline.md');
  const out = apply(raw, (s): ParsedState => {
    s.decisions = s.decisions.filter((d) => d.id !== 'D-02');
    return s;
  });

  assert.ok(!out.includes('D-02:'), 'D-02 must be removed');
  assert.ok(out.includes('D-01:'), 'D-01 preserved');
  assert.ok(out.includes('D-03:'), 'D-03 preserved');
});

test('mutator.apply: mutating one block re-emits canonical form for that block only', () => {
  const raw = readFixture('mid-pipeline.md');
  const out = apply(raw, (s): ParsedState => {
    // Flip the first must-have to pass. The <must_haves> block was
    // canonical already (no comments), so semantic-equal check passes
    // only when the array matches byte-for-byte. Changing one status
    // forces canonical re-emit for must_haves; other blocks keep raw.
    if (s.must_haves[0] !== undefined) s.must_haves[0].status = 'fail';
    return s;
  });
  assert.match(out, /M-01: Hero CTA renders at accessible contrast ratio >= 4\.5:1 \| status: fail/);
  assert.ok(out.includes('figma: available'), 'connections block intact');
  assert.ok(out.includes('pending: 4'), 'todos block intact');
});

test('mutator.apply: frontmatter field mutation emitted in canonical order', () => {
  const raw = readFixture('mid-pipeline.md');
  const out = apply(raw, (s): ParsedState => {
    s.frontmatter.last_checkpoint = '2026-04-24T19:45:00Z';
    return s;
  });
  // last_checkpoint updated and still in fixed-order position.
  const fmMatch = out.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(fmMatch);
  const fmText = fmMatch![1]!;
  assert.match(fmText, /last_checkpoint: 2026-04-24T19:45:00Z/);
  // Extra key (model_profile) preserved.
  assert.match(fmText, /model_profile: balanced/);
});

test('mutator.serialize: empty raw_bodies emits canonical form', () => {
  const raw = readFixture('mid-pipeline.md');
  const { state } = parse(raw);
  const out = serialize(state); // no raw_bodies, no line_ending
  // Canonical doesn't preserve comments; round-trip parse should still work.
  const { state: reparsed } = parse(out);
  assert.deepEqual(reparsed.decisions, state.decisions);
  assert.deepEqual(reparsed.must_haves, state.must_haves);
  assert.deepEqual(reparsed.blockers, state.blockers);
  assert.deepEqual(reparsed.timestamps, state.timestamps);
  assert.equal(reparsed.position.task_progress, state.position.task_progress);
  assert.equal(reparsed.frontmatter.stage, state.frontmatter.stage);
});

test('mutator.apply: adding a blocker appends to the block in order', () => {
  const raw = readFixture('mid-pipeline.md');
  const out = apply(raw, (s): ParsedState => {
    s.blockers.push({
      stage: 'design',
      date: '2026-04-25',
      text: 'New blocker for this run',
    });
    return s;
  });
  assert.match(out, /\[design\] \[2026-04-25\]: New blocker for this run/);
  // Count blockers — should now be 3.
  const { state } = parse(out);
  assert.equal(state.blockers.length, 3);
});
