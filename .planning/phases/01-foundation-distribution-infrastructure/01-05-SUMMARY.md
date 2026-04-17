---
phase: 1
plan: "01-05"
subsystem: "skills/grep-portability"
tags: [posix, grep, cross-platform, skill-migration]
dependency_graph:
  requires: []
  provides: [PLAT-02]
  affects: [skills/scan/SKILL.md, skills/verify/SKILL.md]
tech_stack:
  added: []
  patterns: [POSIX ERE, [[:space:]] character class, POSIX word-boundary equivalent]
key_files:
  created: []
  modified:
    - skills/scan/SKILL.md
    - skills/verify/SKILL.md
decisions:
  - "Used ([^a-zA-Z]|$) as POSIX ERE equivalent for GNU \\b word boundary on scan line 147"
  - "Preserved prefers-reduced-motion as grep -rn (literal-safe, no metaclasses)"
metrics:
  duration: "~5 minutes"
  completed: "2026-04-17T04:18:26Z"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 2
---

# Phase 1 Plan 05: POSIX ERE Migration for Residual GNU grep Extensions — Summary

Six `grep -rn` calls in `skills/scan/SKILL.md` and `skills/verify/SKILL.md` used GNU BRE extensions (`\s*`, `\b`) without the `-E` flag, causing silent false-negatives on macOS BSD grep where those sequences match literal text rather than whitespace/word-boundaries.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Migrate scan/SKILL.md lines 147, 150, 154 to POSIX ERE | 2519ab7 | skills/scan/SKILL.md |
| 2 | Migrate verify/SKILL.md lines 42, 44, 49 to POSIX ERE | 4dedd40 | skills/verify/SKILL.md |

## Lines Migrated

### skills/scan/SKILL.md

| Line | Check | Before | After |
|------|-------|--------|-------|
| 147 | BAN-08 | `grep -rn "transition:\s*all\b"` | `grep -rnE "transition:[[:space:]]*all([^a-zA-Z]\|$)"` |
| 150 | BAN-07 | `grep -rn ":focus\s*{"` | `grep -rnE ":focus[[:space:]]*\{"` |
| 154 | SLOP-04 | `grep -rn "backdrop-filter:\s*blur"` | `grep -rnE "backdrop-filter:[[:space:]]*blur"` |

### skills/verify/SKILL.md

| Line | Check | Before | After |
|------|-------|--------|-------|
| 42 | border-left | `grep -rn "border-left:\s*[2-9]"` | `grep -rnE "border-left:[[:space:]]*[2-9]"` |
| 44 | transition | `grep -rn "transition:\s*all"` | `grep -rnE "transition:[[:space:]]*all"` |
| 49 | backdrop-filter | `grep -rn "backdrop-filter:\s*blur"` | `grep -rnE "backdrop-filter:[[:space:]]*blur"` |

## POSIX Word-Boundary Replacement

The single GNU `\b` word boundary (scan line 147) was replaced with the POSIX ERE bracket-expression `([^a-zA-Z]|$)`:

- `\b` in GNU ERE: zero-width assertion at word/non-word transition
- `([^a-zA-Z]|$)`: consumes one character that is not a letter, or matches end-of-line
- Semantic preservation: ensures `transition: all` does not match `transition: allow` or similar false positives
- Trade-off: consumes the trailing non-letter character (e.g., a space or semicolon); for `| head -10` audit use this is acceptable

## Verification Results

```
Check 1: No grep -rn[^E] with \s or \b in either file  — PASS
Check 2: No \| alternation without -E in either file    — PASS
Check 3: Sanity match (transition:[[:space:]]*all)      — PASS (match produced)
Check 4: grep -rnE count: scan=3, verify=3              — PASS (3 new each)
```

## Deviations from Plan

None — plan executed exactly as written. Six surgical edits applied, two lines explicitly preserved as literal-safe (`prefers-reduced-motion` in both files).

## Self-Check: PASSED

- skills/scan/SKILL.md — modified, 3 grep -rnE with [[:space:]] confirmed
- skills/verify/SKILL.md — modified, 3 grep -rnE with [[:space:]] confirmed
- Commit 2519ab7 — confirmed in git log
- Commit 4dedd40 — confirmed in git log
