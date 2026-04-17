---
phase: 03-quality-gate-agents-pipeline-polish
plan: "03"
subsystem: agents + plan-stage-orchestration
tags: [brownfield-protection, pattern-mapping, assumptions-analysis, plan-stage, quality-gate]
dependency_graph:
  requires: [02-01-SUMMARY.md, 02-04-SUMMARY.md]
  provides: [AGENT-09, AGENT-10, plan-stage-pattern-mapping]
  affects: [skills/plan/SKILL.md, agents/design-planner.md]
tech_stack:
  added: []
  patterns: [agent-authoring-contract, design-concern-classification, confidence-rubric, completion-markers]
key_files:
  created:
    - agents/design-pattern-mapper.md
    - agents/design-assumptions-analyzer.md
  modified:
    - skills/plan/SKILL.md
    - agents/design-planner.md
decisions:
  - "design-pattern-mapper classifies by design concern (color-system, spacing-system, typography-system, component-styling) — never by code-architecture vocabulary (no controller/service/middleware)"
  - "design-assumptions-analyzer runs optionally from plan stage (not discuss-phase like GSD version) — positioned after DESIGN-PATTERNS.md is available"
  - "DESIGN-PATTERNS.md added to design-planner required_reading so planner cannot conflict with existing patterns"
  - "Stale design-planner.md constraint removed — 'Reference design-pattern-mapper as an input (that agent exists in Phase 3, not yet available)' was incorrect post-implementation"
  - "Step 1.5 pattern mapping is mandatory (always runs); Step 1.6 assumptions analysis is optional (skipped in --auto mode, same flag as research)"
metrics:
  duration: "2 min"
  completed: "2026-04-17"
  tasks_completed: 3
  files_created: 2
  files_modified: 2
---

# Phase 03 Plan 03: Brownfield Quality-Gate Agents (AGENT-09 + AGENT-10) Summary

**One-liner:** Two pre-planning quality-gate agents — `design-pattern-mapper` (extracts existing color/spacing/typography/component patterns with POSIX grep commands) and `design-assumptions-analyzer` (surfaces hidden design assumptions with HIGH/MEDIUM/LOW confidence rubric + evidence citations) — wired into `plan/SKILL.md` as Steps 1.5 and 1.6 before `design-planner`.

---

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create design-pattern-mapper (AGENT-09) | 5d6ec89 | agents/design-pattern-mapper.md |
| 2 | Create design-assumptions-analyzer (AGENT-10) | c39f4dd | agents/design-assumptions-analyzer.md |
| 3 | Update plan/SKILL.md — insert Steps 1.5 + 1.6 | 76eaa3b | skills/plan/SKILL.md, agents/design-planner.md |

---

## What Was Built

### agents/design-pattern-mapper.md (AGENT-09)

Brownfield pattern extraction agent that:
- Runs mandatory before design-planner (Step 1.5)
- Greps codebase for four design concerns: color-system (CSS custom properties, oklch/hex values), spacing-system (padding/margin/gap in px/rem), typography-system (font-size/weight/family), component-styling (CSS Modules vs Tailwind vs styled-components vs inline)
- Writes `.design/DESIGN-PATTERNS.md` with four output sections: Existing Color Patterns (table with semantic role + preserve flag), Existing Spacing Scale (table with 8pt grid deviation), Existing Component Conventions (table with styling approach), Planning Recommendations (what planner must not override; what can safely change)
- Explicitly prohibits code-architecture vocabulary — no controller/service/middleware classification
- Completion marker: `## MAPPING COMPLETE`

### agents/design-assumptions-analyzer.md (AGENT-10)

Assumption-surfacing agent that:
- Runs optionally from plan stage (Step 1.6) — skipped in --auto mode
- Receives DESIGN-PATTERNS.md in required_reading (richer context than GSD version which runs from discuss-phase)
- Three analysis categories: unstated brand signals (color/type personality, copy tone), inferred technical constraints (CSS-in-JS availability, SSR constraints, browserslist targets), gray-area candidates (split font strategies, partial dark mode implementations)
- Confidence rubric: HIGH (multiple file citations from different codebase areas), MEDIUM (single strong citation), LOW (pattern inference)
- Every assumption requires at least one `file:line` evidence citation
- Cap of 8 assumptions total (surface highest-impact only)
- Completion marker: `## ANALYSIS COMPLETE`

### skills/plan/SKILL.md update

Replaced `# TODO(phase-3): spawn design-pattern-mapper here before design-planner (AGENT-09 — Phase 3)` (old line 54) with:
- **Step 1.5** — Pattern Mapping (mandatory): `Task("design-pattern-mapper", ...)` + wait for `## MAPPING COMPLETE`
- **Step 1.6** — Assumptions Analysis (optional): `Task("design-assumptions-analyzer", ...)` + wait for `## ANALYSIS COMPLETE`

design-planner's `<required_reading>` updated to include `@.design/DESIGN-PATTERNS.md` (unconditional) and `[@.design/DESIGN-ASSUMPTIONS.md — only include if assumptions analysis ran]`.

Scope boundary respected: Step 3 (design-plan-checker), State Update, After Completion sections untouched — those belong to 03-05.

---

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed stale constraint from design-planner.md**
- **Found during:** Task 3
- **Issue:** `agents/design-planner.md` line 261 contained `"- Reference design-pattern-mapper as an input (that agent exists in Phase 3, not yet available)"` — this constraint was written when pattern-mapper was deferred. Post-implementation it would incorrectly tell design-planner to ignore DESIGN-PATTERNS.md even though it now receives it in required_reading.
- **Fix:** Removed the stale constraint line from design-planner.md Constraints section.
- **Files modified:** agents/design-planner.md
- **Commit:** 76eaa3b (bundled with Task 3 commit)

---

## Self-Check

**Files exist:**
- agents/design-pattern-mapper.md: FOUND
- agents/design-assumptions-analyzer.md: FOUND

**Completion markers:**
- `## MAPPING COMPLETE` in design-pattern-mapper.md: FOUND
- `## ANALYSIS COMPLETE` in design-assumptions-analyzer.md: FOUND

**plan/SKILL.md integration:**
- `Task("design-pattern-mapper"` in SKILL.md: FOUND
- `Task("design-assumptions-analyzer"` in SKILL.md: FOUND
- `TODO(phase-3)` in SKILL.md: NOT FOUND (correctly removed)

## Self-Check: PASSED
