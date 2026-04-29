'use strict';
// tests/tier-resolver.test.cjs — Plan 26-02 Task 1.
//
// Covers `scripts/lib/tier-resolver.cjs`:
//   (a) all 4 canonical runtimes resolve correctly for all 3 tiers
//   (b) missing-tier returns null + emits `tier_resolution_failed`
//   (c) missing-runtime returns null + emits event
//   (d) fallback to runtime-default works + emits `tier_resolution_fallback`
//   (e) never throws on garbage input

const test = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, rmSync, readFileSync, existsSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');

const { resolve, reset, VALID_TIERS } = require('../scripts/lib/tier-resolver.cjs');

/**
 * Pre-parsed fixture mirroring 26-01's `parseRuntimeModels()` output
 * shape. Editorial picks (D-02) for the four canonical runtimes; the
 * `default` row is what the resolver falls back to per D-04 branch 2.
 */
const FIXTURE = Object.freeze({
  runtimes: {
    claude: {
      tier_to_model: {
        opus: 'claude-opus-4-7',
        sonnet: 'claude-sonnet-4-6',
        haiku: 'claude-haiku-4-5',
      },
    },
    codex: {
      tier_to_model: {
        opus: 'gpt-5',
        sonnet: 'gpt-5-mini',
        haiku: 'gpt-5-nano',
      },
    },
    gemini: {
      tier_to_model: {
        opus: 'gemini-2.5-pro',
        sonnet: 'gemini-2.5-flash',
        haiku: 'gemini-2.5-flash-lite',
      },
    },
    qwen: {
      tier_to_model: {
        opus: 'qwen3-max',
        sonnet: 'qwen3-plus',
        haiku: 'qwen3-flash',
      },
    },
    // Runtime listed but tier-map is partial — exercises the
    // tier_missing_for_runtime fallback branch.
    cursor: {
      tier_to_model: {
        opus: 'cursor-opus-equivalent',
        // sonnet + haiku missing on purpose
      },
    },
  },
  default: {
    tier_to_model: {
      opus: 'claude-opus-4-7',
      sonnet: 'claude-sonnet-4-6',
      haiku: 'claude-haiku-4-5',
    },
  },
});

/**
 * Run a function in a fresh temp cwd with GDD_EVENTS_PATH pointing at
 * a temp events.jsonl. Returns the parsed event lines after fn runs.
 */
function withEventsCapture(fn) {
  const dir = mkdtempSync(join(tmpdir(), 'gdd-tier-resolver-'));
  const eventsPath = join(dir, 'events.jsonl');
  const savedPath = process.env.GDD_EVENTS_PATH;
  const savedSession = process.env.GDD_SESSION_ID;
  process.env.GDD_EVENTS_PATH = eventsPath;
  process.env.GDD_SESSION_ID = 'test-session';
  try {
    fn();
    if (!existsSync(eventsPath)) return { events: [], dir };
    const events = readFileSync(eventsPath, 'utf8')
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((l) => JSON.parse(l));
    return { events, dir };
  } finally {
    if (savedPath === undefined) delete process.env.GDD_EVENTS_PATH;
    else process.env.GDD_EVENTS_PATH = savedPath;
    if (savedSession === undefined) delete process.env.GDD_SESSION_ID;
    else process.env.GDD_SESSION_ID = savedSession;
    try { rmSync(dir, { recursive: true, force: true }); } catch { /* swallow */ }
    reset();
  }
}

// ---------------------------------------------------------------------
// Scenario (a) — all 4 canonical runtimes × all 3 tiers
// ---------------------------------------------------------------------

const CANONICAL = ['claude', 'codex', 'gemini', 'qwen'];

for (const runtime of CANONICAL) {
  for (const tier of VALID_TIERS) {
    test(`(a) resolve('${runtime}', '${tier}') → expected canonical model`, () => {
      const expected = FIXTURE.runtimes[runtime].tier_to_model[tier];
      const got = resolve(runtime, tier, { models: FIXTURE, silent: true });
      assert.equal(got, expected);
    });
  }
}

test('(a) canonical resolutions emit no events on the happy path', () => {
  const { events } = withEventsCapture(() => {
    for (const runtime of CANONICAL) {
      for (const tier of VALID_TIERS) {
        resolve(runtime, tier, { models: FIXTURE });
      }
    }
  });
  assert.equal(events.length, 0, `unexpected events: ${JSON.stringify(events)}`);
});

// ---------------------------------------------------------------------
// Scenario (b) — missing-tier (runtime present, tier-row absent)
// ---------------------------------------------------------------------

test('(b) missing-tier with no default → null + tier_resolution_failed', () => {
  const noDefault = {
    runtimes: {
      claude: { tier_to_model: { opus: 'claude-opus-4-7' } },
    },
    // no `default` key
  };
  const { events } = withEventsCapture(() => {
    const got = resolve('claude', 'sonnet', { models: noDefault });
    assert.equal(got, null);
  });
  assert.equal(events.length, 1);
  assert.equal(events[0].type, 'tier_resolution_failed');
  assert.equal(events[0].payload.runtime, 'claude');
  assert.equal(events[0].payload.tier, 'sonnet');
  assert.equal(events[0].payload.reason, 'tier_missing_no_default');
});

// ---------------------------------------------------------------------
// Scenario (c) — missing-runtime (id not in map, no default)
// ---------------------------------------------------------------------

test('(c) missing-runtime with no default → null + tier_resolution_failed', () => {
  const noDefault = { runtimes: { claude: FIXTURE.runtimes.claude } };
  const { events } = withEventsCapture(() => {
    const got = resolve('does-not-exist', 'opus', { models: noDefault });
    assert.equal(got, null);
  });
  assert.equal(events.length, 1);
  assert.equal(events[0].type, 'tier_resolution_failed');
  assert.equal(events[0].payload.runtime, 'does-not-exist');
  assert.equal(events[0].payload.reason, 'runtime_not_in_map');
});

// ---------------------------------------------------------------------
// Scenario (d) — fallback to runtime-default
// ---------------------------------------------------------------------

test('(d) missing-runtime WITH default → returns default model + tier_resolution_fallback', () => {
  const { events } = withEventsCapture(() => {
    const got = resolve('windsurf', 'sonnet', { models: FIXTURE });
    assert.equal(got, 'claude-sonnet-4-6');
  });
  assert.equal(events.length, 1);
  assert.equal(events[0].type, 'tier_resolution_fallback');
  assert.equal(events[0].payload.runtime, 'windsurf');
  assert.equal(events[0].payload.tier, 'sonnet');
  assert.equal(events[0].payload.model, 'claude-sonnet-4-6');
  assert.equal(events[0].payload.reason, 'runtime_not_in_map');
});

test('(d) runtime present but tier missing WITH default → fallback', () => {
  // cursor in FIXTURE has only opus; sonnet/haiku missing → fallback fires
  const { events } = withEventsCapture(() => {
    const got = resolve('cursor', 'haiku', { models: FIXTURE });
    assert.equal(got, 'claude-haiku-4-5');
  });
  assert.equal(events.length, 1);
  assert.equal(events[0].type, 'tier_resolution_fallback');
  assert.equal(events[0].payload.reason, 'tier_missing_for_runtime');
});

test('(d) runtime present, tier present → no fallback even when default exists', () => {
  const { events } = withEventsCapture(() => {
    // cursor.opus IS defined ('cursor-opus-equivalent'); should NOT fall back
    const got = resolve('cursor', 'opus', { models: FIXTURE });
    assert.equal(got, 'cursor-opus-equivalent');
  });
  assert.equal(events.length, 0);
});

// ---------------------------------------------------------------------
// Scenario (e) — never throws on garbage input
// ---------------------------------------------------------------------

test('(e) garbage runtime: undefined → null + failed event', () => {
  const { events } = withEventsCapture(() => {
    assert.doesNotThrow(() => {
      const got = resolve(undefined, 'opus', { models: FIXTURE });
      assert.equal(got, null);
    });
  });
  assert.equal(events.length, 1);
  assert.equal(events[0].type, 'tier_resolution_failed');
  assert.equal(events[0].payload.reason, 'invalid_runtime');
});

test('(e) garbage tier: not in enum → null + failed event', () => {
  const { events } = withEventsCapture(() => {
    const got = resolve('claude', 'megaopus', { models: FIXTURE });
    assert.equal(got, null);
  });
  assert.equal(events.length, 1);
  assert.equal(events[0].payload.reason, 'invalid_tier');
});

test('(e) garbage models: null/undefined → null + failed event (silent path safe)', () => {
  // No events.jsonl wrapper here — just verify no throw and null return.
  assert.doesNotThrow(() => {
    const got = resolve('claude', 'opus', { models: null, silent: true });
    assert.equal(got, null);
  });
});

test('(e) garbage everything: numeric runtime, object tier, string models → null no throw', () => {
  assert.doesNotThrow(() => {
    const got = resolve(42, { foo: 'bar' }, { models: 'not-an-object', silent: true });
    assert.equal(got, null);
  });
});

test('(e) empty string runtime → invalid_runtime', () => {
  const { events } = withEventsCapture(() => {
    const got = resolve('', 'opus', { models: FIXTURE });
    assert.equal(got, null);
  });
  assert.equal(events[0].payload.reason, 'invalid_runtime');
});

test('(e) empty models map → fallback path runs, fails because nothing matches', () => {
  const { events } = withEventsCapture(() => {
    const got = resolve('claude', 'opus', { models: { runtimes: {} } });
    assert.equal(got, null);
  });
  assert.equal(events[0].type, 'tier_resolution_failed');
});

test('(e) silent=true suppresses all events', () => {
  const { events } = withEventsCapture(() => {
    resolve('does-not-exist', 'megaopus', { models: FIXTURE, silent: true });
    resolve('windsurf', 'sonnet', { models: FIXTURE, silent: true });
    resolve('claude', 'opus', { models: FIXTURE, silent: true });
  });
  assert.equal(events.length, 0);
});

// ---------------------------------------------------------------------
// Bonus — VALID_TIERS contract
// ---------------------------------------------------------------------

test('VALID_TIERS exports the canonical opus/sonnet/haiku trio', () => {
  assert.deepEqual([...VALID_TIERS].sort(), ['haiku', 'opus', 'sonnet']);
});
