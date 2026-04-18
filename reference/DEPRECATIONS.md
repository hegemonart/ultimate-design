# Deprecated Namespaces and Names

The following references are deprecated and MUST NOT appear in shipped files.
CI fails the build if any occurrence is detected by `scripts/detect-stale-refs.cjs`.

This file is the authoritative source — the detector reads deprecated tokens from
here at runtime. To deprecate something new, add an entry below.

## Stale command namespaces

- `/design:*` — replaced by `/gdd:*` in Phase 1

## Stale agent names

- `design-context-builder` — replaced by the Phase 3 agent split (design-context-reader + design-context-summarizer)
- `design-pattern-mapper` (as a single blob) — replaced by concern-classifier split in Phase 3

## Stale stage names

- `scan/SKILL.md` — the legacy `scan` stage was folded into `/gdd:explore` in Phase 7
- `discover/SKILL.md` — the legacy `discover` stage was folded into `/gdd:explore` in Phase 7
