# Multi-Runtime Models — Operations Guide

Phase 26 (v1.26.0) ships a tier→model adapter layer that makes `default-tier: opus|sonnet|haiku` frontmatter actually do something on the 13 non-Claude runtimes the multi-runtime installer (v1.24.0) covers. This document is the ops guide for runtime adapter authors and pipeline maintainers.

---

## What this layer does

Three layers gain runtime-awareness, all additively:

1. **Frontmatter** — agents may carry `reasoning-class: high|medium|low` next to the legacy `default-tier: opus|sonnet|haiku`. Both are accepted; if both are present, equivalence is enforced.
2. **Router output** — `skills/router/SKILL.md` emits `resolved_models: { agent: concrete-model-id }` next to the legacy `model_tier_overrides: { agent: tier-name }`. Tier names stay runtime-neutral; concrete model IDs are runtime-specific.
3. **Cost telemetry** — `events.jsonl` cost rows tag `runtime`. Per-runtime price tables live under `reference/prices/<runtime>.md`. Aggregation rolls up per-runtime AND per-tier so reflector class-specific cost analysis can compare apples-to-apples across runtimes.

The single source of truth for the `(runtime, tier) → model` mapping is `reference/runtime-models.md`.

---

## How to add a new runtime tier-map

If you are an adapter author for a new AI coding CLI not yet listed in `reference/runtime-models.md`, follow these steps:

### 1. Add the runtime to the installer matrix

Edit `scripts/lib/install/runtimes.cjs` and append a new entry to the `RUNTIMES` array. See the existing entries for the field shape (`id`, `displayName`, `configDirEnv`, `configDirFallback`, `kind`, `files`). Also append the runtime ID to the alphabetised baseline at `test-fixture/baselines/phase-24/runtimes.txt`.

This step is shared with Phase 24's installer scope. The same env-var → runtime-ID mapping powers `runtime-detect.cjs` (D-05) — single source of truth.

### 2. Add the runtime entry to `reference/runtime-models.md`

The file is a markdown document with fenced ```json blocks; each block (after the schema-version header) is one runtime. The schema:

```jsonc
{
  "id": "<runtime-id>",                         // must match runtimes.cjs
  "tier_to_model": {
    "opus":   { "model": "<concrete-model-id>" },
    "sonnet": { "model": "<concrete-model-id>" },
    "haiku":  { "model": "<concrete-model-id>" }
  },
  "reasoning_class_to_model": {
    "high":   { "model": "<concrete-model-id>" },
    "medium": { "model": "<concrete-model-id>" },
    "low":    { "model": "<concrete-model-id>" }
  },
  "provenance": [
    {
      "source_url": "<https://… runtime adapter docs URL>",
      "retrieved_at": "<ISO 8601 timestamp>",
      "last_validated_cycle": "<YYYY-MM-DD-vX.Y>",
      "note": "<optional human-readable context>"
    }
  ],
  "single_tier": false                          // optional; true if the runtime exposes only one model
}
```

Equivalence convention (D-10): keep `tier_to_model.opus` and `reasoning_class_to_model.high` pointing at the same model; ditto `sonnet`/`medium` and `haiku`/`low`. The frontmatter validator enforces this convention on consumers — keep it consistent in the source of truth too.

If a runtime exposes only one model tier (e.g. a single-model session), map that model to all three tiers and set `"single_tier": true` on the row. Downstream consumers may surface the annotation as a UX hint.

### 3. Validate locally

```bash
node --test tests/parse-runtime-models.test.cjs
node --test tests/runtime-models-schema.test.cjs
```

The parser at `scripts/lib/install/parse-runtime-models.cjs` does strict pure-JS validation against the schema at `reference/schemas/runtime-models.schema.json`. No `ajv` dependency at the parser layer — install-time validation catches typos before runtime.

### 4. Open a PR

Add per-runtime price data under `reference/prices/<runtime>.md` (see existing `claude.md`/`codex.md`/`gemini.md`/`qwen.md` for the canonical table format). If pricing is not yet confirmed, the runtime ships with a stub-only price table — `budget-enforcer.cjs` falls back to the claude row and emits a `cost_lookup_fallback` event.

---

## Equivalence table

The frontmatter validator (`scripts/validate-frontmatter.ts`) enforces this equivalence between `default-tier` and `reasoning-class` (D-10, D-11):

| `default-tier` | `reasoning-class` | Canonical use |
| -------------- | ----------------- | ------------- |
| `opus`         | `high`            | Highest-stakes work — verifiers, planners, deep analysis |
| `sonnet`       | `medium`          | Default agent tier — most pipeline work |
| `haiku`        | `low`             | Cheap classifiers, signal scoring, simple rewrites |

Both fields are optional. If neither is present, the agent inherits its tier from `.design/budget.json#tier_overrides` or falls back to the global pipeline default. If both are present and disagree, validation fails — pick one or align them.

---

## How `tier-resolver.cjs` fallback chain works

`scripts/lib/tier-resolver.cjs#resolve(runtime, tier, opts?) → model-string | null`

Translates a frontmatter tier name (`opus`/`sonnet`/`haiku`) into the concrete model the active runtime understands. Fallback chain per D-04:

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. runtime entry has the tier                                    │
│    → use directly, no event emission                             │
└─────────────────────────────────────────────────────────────────┘
                                ▼ miss
┌─────────────────────────────────────────────────────────────────┐
│ 2. runtime row missing OR tier missing on the row                │
│    → fall back to claude row                                     │
│    → emit `tier_resolution_fallback` event                       │
└─────────────────────────────────────────────────────────────────┘
                                ▼ miss
┌─────────────────────────────────────────────────────────────────┐
│ 3. claude row also missing the tier                              │
│    → return null                                                 │
│    → emit `tier_resolution_failed` event                         │
└─────────────────────────────────────────────────────────────────┘
```

`null` is a valid output the consumer must handle gracefully. Router and budget-enforcer treat it as a signal to skip the runtime-specific lookup and use the legacy `model_tier_overrides` tier-name path. The pipeline degrades; it never crashes.

`runtime-detect.cjs#detect()` reads the same `*_CONFIG_DIR` / `*_HOME` env-var chain Phase 24's installer uses (D-05). Returns null when no recognized env-var is set — the consumer treats this as the "running tests in CI matrix or bare Node script" case and skips runtime-specific behavior.

---

## How cost telemetry rolls up

Every spawn writes a `cost_recorded` event to `events.jsonl` with both runtime and tier tags:

```json
{
  "type": "cost_recorded",
  "payload": {
    "runtime": "codex",
    "agent": "design-verifier",
    "model_id": "gpt-5-mini",
    "tier": "sonnet",
    "tokens_in": 1234,
    "tokens_out": 567,
    "cost_usd": 0.0012
  }
}
```

The cost-aggregator (Phase 22) reads these rows and produces two roll-ups:

- **Per-runtime** — total spend across all agents/tiers for each runtime in the cycle. Lets you compare "what did this cycle cost in CC vs. Codex vs. Gemini?".
- **Per-tier** — total spend for each tier across runtimes. Lets you compare "what did opus-tier work cost vs. sonnet-tier vs. haiku-tier?", normalized across runtime price differences.

The reflector reads the joint per-`(agent, tier, runtime)` view and emits a `runtime_arbitrage_signal` event when one runtime's spend exceeds another's by >50% on the same `(agent, tier)` (D-09). 50% is a starting heuristic — bandit-style learning over arbitrage outcomes is downstream work.

---

## Per-runtime overrides (future hook)

`.design/budget.json#runtime_overrides.<runtime>.tier_to_model` is the documented future hook for per-project, per-runtime tier→model overrides. If a project wants its codex spawns to map `sonnet` → `gpt-5-codex` instead of the default `gpt-5-mini`, this is where it goes:

```jsonc
{
  "runtime_overrides": {
    "codex": {
      "tier_to_model": {
        "sonnet": "gpt-5-codex"
      }
    }
  }
}
```

As of v1.26.0 this hook is **documented but not yet wired into `tier-resolver.cjs`** — the resolver currently reads only `reference/runtime-models.md`. Wiring this override into the fallback chain (preferred over the runtime entry, then runtime entry, then claude row, then null) is a bounded follow-up. File an issue tagged `phase-26.x` if you need it sooner than the next milestone.

---

## Quick reference

| Question | Where to look |
| -------- | ------------- |
| "What model does `sonnet` map to under codex?" | `reference/runtime-models.md` (`id: "codex"` block) |
| "How is a missing tier handled?" | `scripts/lib/tier-resolver.cjs` (D-04 fallback chain) |
| "Where do per-runtime prices live?" | `reference/prices/<runtime>.md` |
| "How does the installer wire models.json?" | `scripts/lib/install/installer.cjs` + Phase 26 D-06 |
| "Where is the runtime auto-detected from env-vars?" | `scripts/lib/runtime-detect.cjs` (uses `runtimes.cjs` mapping) |
| "Can I use `reasoning-class` instead of `default-tier`?" | Yes (additive). See equivalence table above. |
| "What event signals a tier fallback?" | `tier_resolution_fallback` (warning), `tier_resolution_failed` (error) |
| "What event signals a cost lookup fallback?" | `cost_lookup_fallback`, `cost_lookup_failed` |

---

## Carry-forward from prior phases

- **Phase 24** — Runtime matrix (`scripts/lib/install/runtimes.cjs`) + per-runtime config-dir lookup chain. `runtime-detect.cjs` and the installer wiring reuse this verbatim.
- **Phase 22** — Event stream surfaces tier-resolution and cost-lookup decisions through the existing `appendEvent()` API.
- **Phase 23** — JSON output contracts make `resolved_models` machine-readable for downstream tooling.
- **Phase 25** — Additive-superset discipline (existing field unchanged, new field next to it). Phase 26 follows the same shape: existing `model_tier_overrides` unchanged, new `resolved_models` next to it.
