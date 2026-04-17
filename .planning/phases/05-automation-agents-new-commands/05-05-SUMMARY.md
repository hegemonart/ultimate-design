---
phase: 05-automation-agents-new-commands
plan: "05"
subsystem: compare-command
tags: [compare, delta, drift-detection, skill, router]
dependency_graph:
  requires: [05-04, skills/verify/SKILL.md, skills/scan/SKILL.md]
  provides: [skills/compare/SKILL.md, SKILL.md-compare-routing]
  affects: [SKILL.md, Phase-6-VAL-02-router-surface]
tech_stack:
  added: []
  patterns: [delta-computation, drift-detection, standalone-skill, pre-flight-abort]
key_files:
  created:
    - skills/compare/SKILL.md
  modified:
    - SKILL.md
decisions:
  - "compare scoped strictly to delta between DESIGN.md (baseline) and DESIGN-VERIFICATION.md (result) — no snapshot mechanism (V2-06 deferred)"
  - "Drift detection reads DESIGN-PLAN.md Type fields to build coverage map; regressed categories not covered by any task are flagged as DRIFT"
  - "Both DESIGN-CONTEXT.md and DESIGN-PLAN.md are optional with graceful degradation — abort only on missing required files (DESIGN.md, DESIGN-VERIFICATION.md)"
  - "COMPARE-REPORT prefix keeps output distinct from pipeline DESIGN-*.md namespace — no artifact collision"
metrics:
  duration: "101 seconds"
  completed_date: "2026-04-17"
  tasks_completed: 2
  files_changed: 2
requirements_satisfied: [COMP-01, COMP-02, COMP-03, COMP-04, COMP-05]
---

# Phase 05 Plan 05: Compare Command — Baseline vs Result Delta Summary

**One-liner:** Standalone compare command computing per-category score delta, anti-pattern delta, must-have pass/fail change, and design drift detection from DESIGN-PLAN.md task coverage, writing `.design/COMPARE-REPORT.md`.

## What Was Built

Two files created/modified to deliver the compare command (COMP-01 through COMP-05) and complete the Phase 5 router surface for Phase 6 VAL-02 validation:

1. **`skills/compare/SKILL.md`** (new, 279 lines) — standalone delta skill with:
   - Pre-flight abort if `DESIGN-VERIFICATION.md` missing (Pitfall 3 compliance)
   - Pre-flight abort if `DESIGN.md` (baseline) missing
   - Step 1: Category score parsing from both artifacts
   - Step 2: Per-category score delta computation (COMP-03) — improvement / no_change / regression classification
   - Step 3: Anti-pattern delta (resolved / new / unchanged) (COMP-03)
   - Step 4: Must-have pass/fail change from DESIGN-CONTEXT.md (COMP-03)
   - Step 5: Design drift detection — flags regressions not covered by DESIGN-PLAN.md task Types (COMP-04)
   - Step 6: Writes `.design/COMPARE-REPORT.md` (COMP-05) with structured report
   - Hard constraints: MUST NOT write to any pipeline artifact, MUST NOT require snapshot system

2. **`SKILL.md`** (updated) — root router extended with compare as third and final Phase 5 command:
   - `argument-hint` extended to `[scan|discover|plan|design|verify|status|style|darkmode|compare]`
   - Command Reference table row added for `compare`
   - Jump Mode entry added: `/ultimate-design compare → Skill("ultimate-design:compare")`
   - `style` and `darkmode` entries preserved from plans 05-03 and 05-04

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create skills/compare/SKILL.md with delta + drift logic | a608054 | skills/compare/SKILL.md |
| 2 | Add compare routing to root SKILL.md — complete Phase 5 router surface | 75dbcd4 | SKILL.md |

## Deviations from Plan

None — plan executed exactly as written.

## Verification Results

All plan verification checks passed:

1. `test -f skills/compare/SKILL.md` → PASS
2. COMPARE-REPORT.md references in compare SKILL.md → 9 matches
3. DRIFT references → 4 matches (logic + output)
4. DESIGN-PLAN.md references → 12 matches (drift coverage check + graceful-miss note)
5. Root SKILL.md argument-hint includes all Phase 5 commands → PASS
6. Jump Mode has `/ultimate-design style`, `/ultimate-design darkmode`, `/ultimate-design compare` → PASS

## Self-Check: PASSED

- FOUND: skills/compare/SKILL.md
- FOUND: SKILL.md (updated)
- FOUND: 05-05-SUMMARY.md
- Commit a608054 verified
- Commit 75dbcd4 verified
