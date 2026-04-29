// scripts/lib/runtime-detect.cjs
//
// Plan 26-02 — runtime detection from env-vars.
//
// Identifies which AI-coding-CLI host process the current Node script is
// running inside, by reading the same `*_CONFIG_DIR` / `*_HOME` env-vars
// the Phase 24 installer uses to decide where to drop runtime files.
//
// The env-var → runtime-ID mapping is owned by Phase 24's
// `scripts/lib/install/runtimes.cjs`. This module imports `RUNTIMES` from
// there and derives the lookup table — DO NOT duplicate the mapping
// (D-05). Adding a new runtime to runtimes.cjs automatically extends
// detection here.
//
// Lookup order is the runtimes.cjs declaration order. When a host
// happens to set multiple env-vars (e.g. a parent CLI spawns a child CLI
// and inherits env), the first-declared runtime wins. Phase 24's order
// puts Claude Code first, then OpenCode, Gemini, Kilo, Codex, …; that's
// also the order this module returns for ambiguous hosts.
//
// Pure module — no top-level side effects. Reads `process.env` only when
// `detect()` is called. Returns null when no recognized env-var is set
// (e.g. running tests in CI matrix, or a bare Node script invoked outside
// any of the 14 runtime hosts).
//
// `.cjs` extension matches existing Phase 22 primitives and lets both
// `.cjs` callers and `.ts` callers (under --experimental-strip-types)
// require it without ESM-interop friction.

'use strict';

const { RUNTIMES } = require('./install/runtimes.cjs');

/**
 * Build the env-var → runtime-ID lookup map at module load. Frozen so
 * accidental mutation by callers can't drift the map away from the
 * Phase 24 source of truth.
 *
 * Shape: `[{ env: 'CLAUDE_CONFIG_DIR', id: 'claude' }, …]` — array of
 * pairs to preserve declaration order from RUNTIMES (Map / Object key
 * order is guaranteed by spec but the array form documents intent).
 */
const ENV_TO_RUNTIME = Object.freeze(
  RUNTIMES.map((r) => Object.freeze({ env: r.configDirEnv, id: r.id })),
);

/**
 * Detect which runtime host the current process is running inside, by
 * scanning `process.env` for the runtime-ID env-vars in declaration
 * order and returning the first match.
 *
 * The env-var must be a non-empty string to count as set — runtime
 * harnesses that export an empty value (`CLAUDE_CONFIG_DIR=`) are
 * treated as unset, since the empty string is not a usable config-dir
 * path and likely indicates "exported but not assigned".
 *
 * @returns {string | null} runtime-ID (e.g. 'claude', 'codex') or null
 *   when no recognized env-var is set in the current environment.
 *
 * @example
 *   process.env.CLAUDE_CONFIG_DIR = process.env.HOME + '/.claude';
 *   detect(); // → 'claude'
 *
 * @example
 *   // No runtime env-var set:
 *   detect(); // → null
 */
function detect() {
  const env = process.env;
  for (const { env: name, id } of ENV_TO_RUNTIME) {
    const v = env[name];
    if (typeof v === 'string' && v.length > 0) {
      return id;
    }
  }
  return null;
}

/**
 * Return the env-var → runtime-ID map as a plain array of pairs. Useful
 * for diagnostic logging and tests that want to verify the mapping
 * matches Phase 24 without depending on `runtimes.cjs` internals.
 *
 * The returned array is a fresh copy; mutating it has no effect on
 * future `detect()` calls.
 *
 * @returns {Array<{env: string, id: string}>}
 */
function envVarMap() {
  return ENV_TO_RUNTIME.map((p) => ({ env: p.env, id: p.id }));
}

module.exports = {
  detect,
  envVarMap,
};
