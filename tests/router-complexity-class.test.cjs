'use strict';

// tests/router-complexity-class.test.cjs — Phase 25 Plan 25-09 surface test.
//
// Asserts the router-skill extension landed in 25-02 (commit a239171):
//   * skills/router/SKILL.md JSON example carries `"complexity_class"` next
//     to `"path"` (D-05 — path field unchanged for back-compat; class field
//     additive).
//   * The Path Selection Heuristic table documents all four bucket labels
//     (`S`, `M`, `L`, `XL`).
//   * The canonical mapping rows are present: /gdd:scan→M, /gdd:help→S,
//     /gdd:plan (standalone)→L, /gdd:next (autonomous)→XL.
//
// The router itself is a deterministic skill (no model call) and its
// behavior is purely documented in the SKILL.md; the budget-enforcer
// consumer side is exercised by tests/budget-enforcer-resilience.test.ts
// and tests/hooks-ts-rewrite.test.ts. This file verifies the documented
// contract on the router-side surface — the source of truth other tests
// and downstream consumers point back at.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.join(__dirname, '..');
const ROUTER_SKILL = path.join(REPO_ROOT, 'skills', 'router', 'SKILL.md');

function readRouter() {
  return fs.readFileSync(ROUTER_SKILL, 'utf8');
}

test('25-09 router: skills/router/SKILL.md exists', () => {
  assert.ok(fs.existsSync(ROUTER_SKILL), `expected ${ROUTER_SKILL} to exist`);
});

test('25-09 router: JSON example contains "complexity_class" alongside "path"', () => {
  const md = readRouter();
  assert.ok(
    /"complexity_class"\s*:\s*"[SMLXLsmlxl]+"/.test(md),
    'router JSON example must include a "complexity_class" key with an S|M|L|XL value',
  );
  assert.ok(
    /"path"\s*:\s*"(fast|quick|full)"/.test(md),
    'router JSON example must still include the legacy "path" key for back-compat (D-05)',
  );
});

test('25-09 router: Path Selection Heuristic table contains all four bucket labels', () => {
  const md = readRouter();
  // Table rows look like:  | `S` | `fast` (short-circuited) | …
  // Look for each bucket label as a backtick-quoted token in the table region.
  assert.match(md, /`S`/, 'router heuristic table must reference the S bucket');
  assert.match(md, /`M`/, 'router heuristic table must reference the M bucket');
  assert.match(md, /`L`/, 'router heuristic table must reference the L bucket');
  assert.match(md, /`XL`/, 'router heuristic table must reference the XL bucket');
});

test('25-09 router: enum is documented as S | M | L | XL', () => {
  const md = readRouter();
  assert.match(
    md,
    /complexity_class[^.\n]*?S\s*\|\s*M\s*\|\s*L\s*\|\s*XL/,
    'complexity_class enum must be documented as the literal "S | M | L | XL" union',
  );
});

test('25-09 router: canonical mapping S→fast, M→fast, L→quick, XL→full is documented', () => {
  const md = readRouter();
  // The mapping table rows look like:  | `S` | `fast` (short-circuited) | …
  // Match each row in the canonical-mapping table by anchoring on the
  // bucket→path pair anywhere in the document.
  assert.match(md, /\|\s*`S`\s*\|\s*`fast`/, 'S must map to fast (short-circuited)');
  assert.match(md, /\|\s*`M`\s*\|\s*`fast`/, 'M must map to fast');
  assert.match(md, /\|\s*`L`\s*\|\s*`quick`/, 'L must map to quick');
  assert.match(md, /\|\s*`XL`\s*\|\s*`full`/, 'XL must map to full');
});

test('25-09 router: bucket assignment lists /gdd:help in S', () => {
  const md = readRouter();
  // Find the row that mentions /gdd:help and confirm it tags as S.
  const helpLine = md.split('\n').find((l) => l.includes('/gdd:help'));
  assert.ok(helpLine, 'router heuristic table must reference /gdd:help');
  assert.match(helpLine, /`S`/, '/gdd:help must be assigned complexity_class S');
});

test('25-09 router: bucket assignment lists /gdd:scan in M', () => {
  const md = readRouter();
  const scanLine = md.split('\n').find((l) => l.includes('/gdd:scan'));
  assert.ok(scanLine, 'router heuristic table must reference /gdd:scan');
  assert.match(scanLine, /`M`/, '/gdd:scan must be assigned complexity_class M');
});

test('25-09 router: bucket assignment lists /gdd:plan in L', () => {
  const md = readRouter();
  // The L-row mentions standalone /gdd:plan / /gdd:verify / /gdd:explore /
  // /gdd:discover. Match the line that calls out /gdd:plan in the L bucket.
  const planLine = md
    .split('\n')
    .find((l) => /standalone[^|]*\/gdd:plan/.test(l) || (/\/gdd:plan/.test(l) && /`L`/.test(l)));
  assert.ok(planLine, 'router heuristic table must reference standalone /gdd:plan');
  assert.match(planLine, /`L`/, 'standalone /gdd:plan must be assigned complexity_class L');
});

test('25-09 router: bucket assignment lists /gdd:next in XL', () => {
  const md = readRouter();
  const nextLine = md.split('\n').find((l) => l.includes('/gdd:next'));
  assert.ok(nextLine, 'router heuristic table must reference /gdd:next');
  assert.match(nextLine, /`XL`/, '/gdd:next must be assigned complexity_class XL');
});

test('25-09 router: S-class short-circuit is documented', () => {
  const md = readRouter();
  // D-04 / D-05: S-class short-circuits the router itself + skips
  // cache-manager + skips telemetry write. Document-level assertion that
  // the short-circuit semantics are captured (downstream consumers and
  // budget-enforcer rely on this convention being recorded on the skill).
  assert.match(
    md,
    /short-circuit/i,
    'router SKILL.md must document the S-class short-circuit behavior',
  );
});
