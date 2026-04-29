// scripts/lib/tier-resolver.cjs
//
// Plan 26-02 — tier→model resolver with fallback chain.
//
// `resolve(runtime, tier, opts?) → model-string | null`
//
// Translates the tier vocabulary frontmatter speaks (`opus`, `sonnet`,
// `haiku`) into the concrete model name a specific runtime understands
// (e.g. `gpt-5`, `gemini-2.5-pro`, `qwen3-max`). Source-of-truth for the
// mapping is `reference/runtime-models.md` (Phase 26 plan 26-01); this
// module reads the parsed form via 26-01's parser helper.
//
// Fallback chain (D-04):
//   1. runtime-specific entry      → use directly (no event).
//   2. runtime-default entry       → use, emit `tier_resolution_fallback`.
//   3. neither available           → return null, emit `tier_resolution_failed`.
//
// Never throws. null is a valid output the caller (router, budget-
// enforcer) must handle gracefully. Garbage input (undefined runtime,
// bogus tier) returns null + failure event — same as missing data.
//
// `.cjs` to match Phase 22 primitives and let .ts hooks require it
// under --experimental-strip-types without ESM-interop friction.
//
// Pure module — no top-level side effects beyond reading the parsed
// runtime-models document on first call. The parsed form is cached per-
// process; callers that need a fresh read between cycles call `reset()`.
//
// Test-injection contract: callers may pass `opts.models` to bypass the
// on-disk lookup entirely. Used by `tests/tier-resolver.test.cjs` to
// exercise the fallback branches deterministically.

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const VALID_TIERS = Object.freeze(['opus', 'sonnet', 'haiku']);

const DEFAULT_EVENTS_PATH = path.join('.design', 'telemetry', 'events.jsonl');

/**
 * Cached parsed-models data. `null` until first lazy load (or after
 * `reset()`). The shape is `{ runtimes: { <id>: { tier_to_model: {…} } } }`
 * with an optional `default` key — see the runtime-models JSON schema
 * shipped by plan 26-01.
 */
let _cachedModels = null;

/**
 * Lazy soft-import of the 26-01 parser. The parser file may not exist
 * yet during parallel-wave development; in that case `loadParser()`
 * returns null and the resolver degrades gracefully (every resolution
 * yields the failure branch).
 *
 * NOTE: 26-01 ships `scripts/lib/install/parse-runtime-models.cjs`. If
 * that file moves, update the resolve() path here.
 */
function loadParser() {
  // TODO(26-01): once 26-01 lands, this soft-import becomes a hard
  // require. Verify at integration time.
  try {
    const modPath = path.join(__dirname, 'install', 'parse-runtime-models.cjs');
    if (!fs.existsSync(modPath)) return null;
    // require.cache key is the resolved path; using require directly is
    // fine because we're not hot-reloading on every call.
    return require(modPath);
  } catch {
    return null;
  }
}

/**
 * Lazy load + cache the parsed runtime-models map. Returns null when
 * the parser or source markdown is unavailable.
 *
 * The parser API contract (per 26-01): `parseRuntimeModels(opts?) →
 *   { runtimes: { [id]: { tier_to_model: {opus, sonnet, haiku}, … } },
 *     default?: { tier_to_model: {…} } }`.
 */
function loadModels() {
  if (_cachedModels !== null) return _cachedModels;
  const parser = loadParser();
  if (parser === null) return null;
  try {
    // The parser may export either `parseRuntimeModels` (function) or a
    // default-object with that key — accept both for forward compat.
    const fn = typeof parser.parseRuntimeModels === 'function'
      ? parser.parseRuntimeModels
      : (typeof parser === 'function' ? parser : null);
    if (fn === null) return null;
    const out = fn();
    if (out && typeof out === 'object') {
      _cachedModels = out;
      return out;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Reset the parsed-models cache. Tests use this after writing fixture
 * runtime-models.md to a temp cwd; production callers rarely need it.
 */
function reset() {
  _cachedModels = null;
}

/**
 * Append a single event line to the on-disk events.jsonl. Honors
 * `GDD_EVENTS_PATH` for test isolation (matches the TypeScript
 * EventWriter's env-var contract). Never throws — diagnostic on
 * stderr only.
 *
 * We don't require the .ts EventWriter from .cjs (would need
 * --experimental-strip-types at every consumer); instead we write the
 * same JSONL line shape directly. The envelope matches BaseEvent so
 * downstream consumers don't care which producer wrote the line.
 */
function emitEvent(type, payload) {
  const line = JSON.stringify({
    type,
    timestamp: new Date().toISOString(),
    sessionId: process.env.GDD_SESSION_ID || 'tier-resolver',
    payload,
    _meta: {
      pid: process.pid,
      host: 'tier-resolver',
      source: 'tier-resolver',
    },
  });
  const envPath = process.env.GDD_EVENTS_PATH;
  const target = envPath && envPath.length > 0
    ? envPath
    : path.join(process.cwd(), DEFAULT_EVENTS_PATH);
  try {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.appendFileSync(target, line + '\n', { encoding: 'utf8' });
  } catch (err) {
    // Don't let event-emission failure cascade into resolver failure;
    // the resolver's job is to return a model (or null), not to
    // guarantee telemetry. A diagnostic on stderr is enough — the
    // event-stream has its own resilience story (Phase 20-14).
    try {
      process.stderr.write(
        `[tier-resolver] event emit failed: ${err && err.message ? err.message : String(err)}\n`,
      );
    } catch {
      /* swallow */
    }
  }
}

/**
 * Lookup a tier in a runtime entry. Returns the model string when
 * present; null when absent or malformed.
 */
function lookupTier(entry, tier) {
  if (!entry || typeof entry !== 'object') return null;
  const map = entry.tier_to_model;
  if (!map || typeof map !== 'object') return null;
  const v = map[tier];
  return typeof v === 'string' && v.length > 0 ? v : null;
}

/**
 * Resolve a `(runtime, tier)` pair to a concrete model string. Returns
 * null when neither the runtime-specific entry nor the runtime-default
 * fallback supplies a value for the tier; emits a structured event in
 * both the fallback and failure branches.
 *
 * @param {string | null | undefined} runtime
 *   Runtime ID (e.g. 'claude', 'codex'). Garbage input returns null +
 *   failure event.
 * @param {string | null | undefined} tier
 *   Tier name. Must be one of `opus`/`sonnet`/`haiku`. Anything else
 *   returns null + failure event.
 * @param {object} [opts]
 * @param {object} [opts.models]
 *   Pre-parsed models map. When supplied, bypasses the on-disk lookup
 *   entirely (tests use this). Shape:
 *   `{ runtimes: { [id]: { tier_to_model } }, default?: { tier_to_model } }`.
 * @param {boolean} [opts.silent]
 *   When true, suppresses event emission on the fallback / failure
 *   paths. Used by callers that batch-resolve and prefer to roll up
 *   their own diagnostics. Default false.
 * @returns {string | null}
 */
function resolve(runtime, tier, opts) {
  const models = (opts && opts.models) || loadModels();
  const silent = !!(opts && opts.silent);

  // Validate inputs FIRST so the failure event payload carries the
  // garbage values verbatim — useful for telemetry diagnosis.
  const runtimeOk = typeof runtime === 'string' && runtime.length > 0;
  const tierOk = typeof tier === 'string' && VALID_TIERS.indexOf(tier) >= 0;

  if (!runtimeOk || !tierOk || !models || typeof models !== 'object') {
    if (!silent) {
      emitEvent('tier_resolution_failed', {
        runtime: runtimeOk ? runtime : (runtime === undefined ? null : runtime),
        tier: tierOk ? tier : (tier === undefined ? null : tier),
        reason: !runtimeOk
          ? 'invalid_runtime'
          : !tierOk
            ? 'invalid_tier'
            : 'models_unavailable',
      });
    }
    return null;
  }

  const runtimes = models.runtimes && typeof models.runtimes === 'object'
    ? models.runtimes
    : {};
  const entry = runtimes[runtime];

  // Branch 1: runtime-specific hit.
  const direct = lookupTier(entry, tier);
  if (direct !== null) return direct;

  // Branch 2: runtime-default fallback.
  // Per D-04 the `default` key in runtime-models.md represents "the
  // closest published equivalent" — used when a runtime exists in the
  // 14-runtime list but its tier-map row hasn't been filled in yet.
  const fallbackEntry = models.default;
  const fallbackModel = lookupTier(fallbackEntry, tier);
  if (fallbackModel !== null) {
    if (!silent) {
      emitEvent('tier_resolution_fallback', {
        runtime,
        tier,
        model: fallbackModel,
        reason: entry === undefined ? 'runtime_not_in_map' : 'tier_missing_for_runtime',
      });
    }
    return fallbackModel;
  }

  // Branch 3: nothing usable.
  if (!silent) {
    emitEvent('tier_resolution_failed', {
      runtime,
      tier,
      reason: entry === undefined ? 'runtime_not_in_map' : 'tier_missing_no_default',
    });
  }
  return null;
}

module.exports = {
  resolve,
  reset,
  VALID_TIERS,
  // internals surfaced for tests only — stable API = `resolve` + `reset`.
  _internal: { lookupTier, emitEvent, loadParser, loadModels },
};
