# Model Prices — Static Price Table

**Source of truth for `est_cost_usd` calculations** in the router (`skills/router/SKILL.md`) and budget-enforcer hook (`hooks/budget-enforcer.js`). Anthropic-only pricing. Update the table here when prices change — downstream calculators read this file.

## Pricing (USD per 1M tokens)

| Model | Tier | input_per_1m | output_per_1m | cached_input_per_1m |
|-------|------|--------------|---------------|----------------------|
| claude-haiku-4-5 | haiku | 1.00 | 5.00 | 0.10 |
| claude-sonnet-4-7 | sonnet | 3.00 | 15.00 | 0.30 |
| claude-opus-4-7 | opus | 15.00 | 75.00 | 1.50 |

## size_budget → conservative token ranges

Agent frontmatter carries `size_budget: S|M|L|XL`. The router uses these conservative token ranges to compute a pre-spawn `est_cost_usd` without a live model call:

| size_budget | input_tokens (conservative max) | output_tokens (conservative max) |
|-------------|----------------------------------|-----------------------------------|
| S | 4000 | 1000 |
| M | 10000 | 2500 |
| L | 25000 | 6000 |
| XL | 60000 | 15000 |

## Estimator formula

```
est_cost_usd =
  (input_tokens / 1_000_000) * input_per_1m
  + (output_tokens / 1_000_000) * output_per_1m
```

When `cache_hit: true` (see D-08), the hook re-runs the formula with `cached_input_per_1m` in place of `input_per_1m` for the input portion.

## Update protocol

1. Pricing change: update the table above; commit as `chore(reference): update Anthropic pricing YYYY-MM-DD`.
2. size_budget revision: requires a Phase 11 reflector proposal under `[FRONTMATTER]` scope; do not hand-edit agent ranges.
