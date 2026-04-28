'use strict';

// scripts/lib/quality-gate-detect.cjs — quality-gate detection chain.
//
// Phase 25 Plan 25-09: promotes the doc-only auto-detection logic from
// skills/quality-gate/SKILL.md (Step 1, D-06) into a small testable
// JS module. Pure function, no I/O, no clock.
//
// The 3-tier resolution order (D-06):
//
//   Tier 1 — Authoritative config:
//     If the (already-loaded) `.design/config.json#quality_gate.commands`
//     array is non-empty, return it verbatim. Skip all later tiers.
//
//   Tier 2 — Auto-detect from package.json#scripts:
//     If the (already-loaded) package.json#scripts object exists and is
//     non-empty, intersect its keys with the canonical allowlist and
//     emit `npm run <script>` for each match. The allowlist (case-
//     sensitive, exact match):
//
//       lint
//       typecheck   (or `tsc` as a substitute when `typecheck` is absent)
//       test
//       chromatic
//       test:visual
//
//     Hard exclusions (never included even if present):
//
//       test:e2e          (too slow for a Stage 4.5 gate)
//       test:integration  (only excluded when a separate `test` exists)
//
//   Tier 3 — Skip with notice:
//     Returns an empty array. Caller emits a `quality_gate_skipped`
//     event and writes a `<run/>` with status="skipped".
//
// Mirrors the table in skills/quality-gate/SKILL.md verbatim. When the
// SKILL.md prose changes, change this module in lockstep — the SKILL is
// the design intent, this is the executable encoding consumers can test
// against.

/**
 * Allowlisted script names (case-sensitive, exact match unless noted).
 * Order matters: it determines the canonical command-list ordering, which
 * in turn drives the deterministic `commands_run` field in events.jsonl
 * and the STATE.md <run/> entry.
 */
const ALLOWLIST = Object.freeze([
  'lint',
  'typecheck',
  'test',
  'chromatic',
  'test:visual',
]);

/**
 * Hard exclusions. Even when present in package.json#scripts, these are
 * never run by the quality gate — they are too slow / orthogonal to the
 * gate's purpose. Excluding `test:integration` only matters when a
 * separate `test` script exists; we encode that invariant in detect().
 */
const ALWAYS_EXCLUDED = Object.freeze(['test:e2e']);

/**
 * Detection chain.
 *
 * @param {object}  inputs
 * @param {string[]|null|undefined} inputs.configCommands
 *        Value of `.design/config.json#quality_gate.commands`. `null` or
 *        empty array means "no config-side override; fall through to
 *        auto-detect". The caller is responsible for reading the file.
 * @param {Record<string, string>|null|undefined} inputs.scripts
 *        Value of `package.json#scripts`. `null` means "no package.json".
 * @returns {{commands: string[], tier: 1|2|3, reason?: string}}
 *        Detection result. `tier` is the tier that produced the
 *        commands (1 / 2 / 3 — see top of file). `reason` is populated
 *        on tier 3 only ("no commands resolved").
 */
function detect(inputs) {
  const configCommands = inputs && inputs.configCommands;
  const scripts = inputs && inputs.scripts;

  // --- Tier 1: authoritative config wins. ---
  if (Array.isArray(configCommands) && configCommands.length > 0) {
    return { commands: configCommands.slice(), tier: 1 };
  }

  // --- Tier 2: auto-detect from package.json#scripts. ---
  if (scripts && typeof scripts === 'object') {
    const detected = autoDetect(scripts);
    if (detected.length > 0) {
      return { commands: detected, tier: 2 };
    }
  }

  // --- Tier 3: nothing resolved → skip with notice. ---
  return { commands: [], tier: 3, reason: 'no commands resolved' };
}

/**
 * Apply the allowlist to a `scripts` map. Pure.
 */
function autoDetect(scripts) {
  const out = [];
  for (const name of ALLOWLIST) {
    if (name === 'typecheck') {
      // `typecheck` preferred; fall through to `tsc` only if absent.
      if (Object.prototype.hasOwnProperty.call(scripts, 'typecheck')) {
        out.push('npm run typecheck');
      } else if (Object.prototype.hasOwnProperty.call(scripts, 'tsc')) {
        out.push('npm run tsc');
      }
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(scripts, name) && !ALWAYS_EXCLUDED.includes(name)) {
      out.push(`npm run ${name}`);
    }
  }
  return out;
}

module.exports = {
  ALLOWLIST,
  ALWAYS_EXCLUDED,
  detect,
  autoDetect,
};
