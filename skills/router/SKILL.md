---
name: gdd-router
description: "Routes a /gdd command to fast|quick|full path and returns {path, model_tier_overrides, estimated_cost_usd, cache_hits}. Deterministic — no model call. Invoked once at command entry before any Agent spawn. Read by hooks/budget-enforcer.js."
argument-hint: "<intent-string> [<target-artifacts-csv>]"
tools: Read, Bash, Grep
---

# gdd-router

## Role

You are a deterministic routing skill. You do not spawn agents. You read `.design/budget.json`, `reference/model-prices.md`, `.design/cache-manifest.json` (if present), and the agent frontmatter list, then emit a single JSON object describing the planned spawn graph. The budget-enforcer hook (`hooks/budget-enforcer.js`) consumes your output on every `Agent` tool call.

## Invocation Contract

- **Input**: `intent-string` (e.g., `"run discover stage on greenfield project"`) + optional comma-separated list of target artifacts (files this command will touch).
- **Output**: a single JSON object to stdout — nothing else on the line, no prose wrapper:
  ```json
  {
    "path": "fast",
    "model_tier_overrides": {"design-verifier": "haiku"},
    "estimated_cost_usd": 0.034,
    "cache_hits": ["design-context-builder:abc123"]
  }
  ```
- `path` enum: `fast` (single Haiku + no checkers), `quick` (Sonnet mappers + Haiku verify), `full` (Opus planners + full quality gates).
- `model_tier_overrides` merges agent frontmatter `default-tier` with `.design/budget.json.tier_overrides` — budget.json wins per D-04.
- `estimated_cost_usd` is the sum of per-spawn estimates using the D-06 formula and `reference/model-prices.md`.
- `cache_hits` is a list of `{agent}:{input-hash}` strings that exist in `.design/cache-manifest.json` and are within TTL; emitting a hit lets the hook short-circuit that spawn per D-05.

## Path Selection Heuristic

| Signal | path |
|--------|------|
| Command is `/gdd:scan`, `/gdd:stats`, `/gdd:health`, `/gdd:help` | `fast` |
| Command spawns exactly one agent (no orchestration) | `fast` |
| Command spawns parallel mappers but no planners/auditors (`/gdd:discover` in `--auto` mode) | `quick` |
| Command spawns planners, auditors, verifiers, or integration-checkers (`/gdd:plan`, `/gdd:verify`, `/gdd:audit`) | `full` |
| `--dry-run` flag present on any command | downgrade one tier (fast↔quick↔full) |

## Cost Estimation Algorithm

```
total = 0
for each agent in planned spawn graph:
  tier = resolve_tier(agent)   # budget.json tier_overrides > agent frontmatter default-tier
  (in_tok, out_tok) = token_range_from_size_budget(agent.size_budget)  # from reference/model-prices.md
  (in_rate, out_rate) = price_from_tier(tier)
  total += (in_tok / 1e6) * in_rate + (out_tok / 1e6) * out_rate
return total
```

## Cache-Hit Detection

Delegate to `skills/cache-manager/SKILL.md` (Plan 10.1-02). The router lists candidate `{agent}:{input-hash}` tuples; the cache-manager confirms freshness against TTL from `budget.json.cache_ttl_seconds`.

## Integration Point

Every `/gdd:*` SKILL.md's first substantive step is: spawn the router via `Task` or inline invocation; receive the JSON blob; pass it to downstream agents as context so the budget-enforcer hook has the router decision available in tool_input metadata when the first Agent spawn fires.

## Failure Modes

If `.design/budget.json` is missing, assume defaults from `reference/config-schema.md` per D-12. If `reference/model-prices.md` is missing, emit `estimated_cost_usd: null` and log a warning — do not block.

## Non-Goals

The router does not: (a) make a model call, (b) write files, (c) enforce budget caps (that's the hook's job), (d) learn from history (Phase 11 reflector territory per D-07).
