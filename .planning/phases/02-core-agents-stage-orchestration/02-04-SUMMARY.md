---
phase: 02-core-agents-stage-orchestration
plan: 04
subsystem: pipeline-orchestration
tags: [state-machine, discover-stage, smoke-test, fixture, pipeline-integration]

requires:
  - phase: 02-core-agents-stage-orchestration
    provides: "design-planner, design-executor, design-verifier, design-phase-researcher, design-plan-checker agents + plan/design/verify SKILL.md orchestrators (02-01, 02-02, 02-03)"
  - phase: 01-foundation-distribution-infrastructure
    provides: "reference/STATE-TEMPLATE.md, agents/README.md authoring contract, scan/SKILL.md baseline"

provides:
  - "discover/SKILL.md minimal STATE.md wrapper — reads at entry, writes at exit, ## DISCOVER COMPLETE marker"
  - "TODO(phase-3) marker at agent-insertion point for design-context-builder + design-context-checker"
  - "test-fixture/ smoke-test project seeded with BAN-01 + AI-slop palette + hardcoded color"
  - "02-04-SMOKE-FIXTURE.md runbook with 5-stage smoke test instructions + pass/fail criteria"

affects:
  - phase-03 (will replace inline interview with design-context-builder + design-context-checker agents)
  - phase-06 (cross-stage STATE.md integration validated end-to-end)

tech-stack:
  added: []
  patterns:
    - "Minimal wrapper pattern: add STATE.md read/write to existing stage logic without rewriting it"
    - "Graceful STATE.md fallback: discover creates skeleton from template if scan was skipped"
    - "TODO(phase-N) comments as deferred-agent insertion markers — documented spawn points"

key-files:
  created:
    - "test-fixture/package.json"
    - "test-fixture/src/App.jsx"
    - "test-fixture/src/App.css"
    - "test-fixture/src/index.css"
    - "test-fixture/README.md"
    - ".planning/phases/02-core-agents-stage-orchestration/02-04-SMOKE-FIXTURE.md"
  modified:
    - "skills/discover/SKILL.md"

key-decisions:
  - "discover/SKILL.md is Phase 2's minimal wrapper only — full orchestrator rewrite deferred to Phase 3 (03-01-PLAN) when AGENT-06/07 land"
  - "## DISCOVER COMPLETE locked as completion marker — consistent with PLAN COMPLETE, DESIGN COMPLETE, VERIFY COMPLETE"
  - "Graceful fallback: discover creates STATE.md skeleton if absent (not only scan) — covers sessions where user skips scan"
  - "TODO(phase-3) marker references design-context-builder (AGENT-06) + design-context-checker (AGENT-07) by name at exact spawn point"
  - "test-fixture/ ships in-repo (not external) — reproducible, version-controlled, no filesystem dependency"

patterns-established:
  - "Completion marker naming: ## {STAGE} COMPLETE — all 4 stages now use this pattern"
  - "STATE.md graceful fallback: discover + design both create skeleton from STATE-TEMPLATE.md if absent"
  - "Fixture seeding: BAN-01 (border-left) + AI-slop palette (#6366f1/#8b5cf6/#06b6d4) + default Inter as canonical test violations"

requirements-completed: [STAGE-01]

duration: 3min
completed: 2026-04-17
---

# Phase 2 Plan 04: STAGE-01 Discover Wrapper + Phase 2 Smoke Test Summary

**Minimal STATE.md wrapper wired into discover/SKILL.md with graceful fallback, ## DISCOVER COMPLETE marker, and TODO(phase-3) deferred-agent markers; smoke-test fixture created with canonical BAN-01 + AI-slop violations for end-to-end pipeline validation.**

## Performance

- **Duration:** 3 minutes
- **Started:** 2026-04-17T10:43:34Z
- **Completed:** 2026-04-17T10:46:XX Z
- **Tasks:** 2 auto + 1 checkpoint (auto-approved in auto mode)
- **Files modified:** 1 (discover/SKILL.md)
- **Files created:** 6 (test-fixture/* x5, 02-04-SMOKE-FIXTURE.md)

## Accomplishments

- Wired STATE.md read-at-entry + write-at-exit into discover/SKILL.md with graceful fallback (creates skeleton from STATE-TEMPLATE.md if absent, logs warning), RESUME logic if stage==discover and status==in_progress
- Locked `## DISCOVER COMPLETE` as the discover stage's completion marker, consistent with all other Phase 2 stage markers
- Preserved 100% of existing v2.1.0 interview logic verbatim (Steps 0-3, Auto Mode, DESIGN-CONTEXT.md output format unchanged)
- Added TODO(phase-3) comment at the exact agent-insertion point where design-context-builder (AGENT-06) + design-context-checker (AGENT-07) will be spawned in Phase 3
- Created test-fixture/ with minimal React+CSS project seeded with 5 catchable violations (BAN-01 border-left, AI-slop #6366f1/#8b5cf6/#06b6d4, default Inter, hardcoded #ff0000, transition:all, slop copy)
- Wrote 02-04-SMOKE-FIXTURE.md: 233-line runbook with fixture contents table, seeded-violation list, 5-stage smoke test instructions, no-regression baseline vs v2.1.0, pass/fail criteria checklist, and results section

## Task Commits

1. **Task 1: Minimal STATE.md wrapper for discover/SKILL.md** — `fc9ef15` (feat)
2. **Task 2: Smoke-test fixture files** — `7906131` (feat)
2. **Task 2: Smoke-test runbook** — `c8111d1` (feat)
3. **Task 3: Smoke test checkpoint** — auto-approved in auto mode (human verification pending)

## Files Created/Modified

- `skills/discover/SKILL.md` — Added State Integration section (entry read + graceful fallback), State Update (exit) section (discover_completed_at write), ## DISCOVER COMPLETE marker, TODO(phase-3) comment. Updated frontmatter description. All existing interview logic preserved verbatim.
- `test-fixture/package.json` — Minimal project config, no deps
- `test-fixture/src/App.jsx` — React component with AI-slop copy + hardcoded #ff0000 inline style
- `test-fixture/src/App.css` — BAN-01 border-left on .card, AI-slop #6366f1/#8b5cf6/#06b6d4 palette, hardcoded #ff0000 footer, transition:all on button
- `test-fixture/src/index.css` — Root CSS tokens + AI-slop palette as custom props + font-family: "Inter" on body
- `test-fixture/README.md` — One-paragraph fixture description + violation summary
- `.planning/phases/02-core-agents-stage-orchestration/02-04-SMOKE-FIXTURE.md` — Full smoke-test runbook (233 lines)

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

### Phase 2 Deferral Documented

**design-context-builder (AGENT-06) and design-context-checker (AGENT-07)** are explicitly deferred to Phase 3 (Plan 03-01). The TODO(phase-3) marker in discover/SKILL.md marks the exact insertion point. The marker reads: "replace the inline interview below with spawned agent calls to design-context-builder (AGENT-06) and design-context-checker (AGENT-07) — these agents land in Phase 3 (Plan 03-01)."

## Phase 2 Overall Status

All 4 plans complete:
- **02-01** — design-planner, design-phase-researcher, design-plan-checker agents + plan/SKILL.md orchestrator (STAGE-02)
- **02-02** — design-executor agent (AGENT-02) + design/SKILL.md orchestrator (STAGE-03)
- **02-03** — design-verifier agent (AGENT-03) + verify/SKILL.md orchestrator (STAGE-04)
- **02-04** — discover/SKILL.md STATE.md wrapper (STAGE-01) + smoke-test fixture + runbook

Completion markers locked for all 4 stages:
- `## DISCOVER COMPLETE` (discover/SKILL.md)
- `## PLAN COMPLETE` (plan/SKILL.md)
- `## DESIGN COMPLETE` (design/SKILL.md)
- `## VERIFY COMPLETE` (verify/SKILL.md)

**Smoke test status:** Runbook created at 02-04-SMOKE-FIXTURE.md. Human verification pending — execute the 5-stage runbook on test-fixture/ to confirm all pass criteria. Fixture is seeded and ready.

## Self-Check: PASSED

Verified:
- `skills/discover/SKILL.md` exists and contains `## DISCOVER COMPLETE`, `STATE.md`, `TODO(phase-3)`, `discover_completed_at`
- `test-fixture/src/App.jsx` exists
- `test-fixture/src/App.css` exists with `border-left`
- `.planning/phases/02-core-agents-stage-orchestration/02-04-SMOKE-FIXTURE.md` exists with 233 lines (>= 50)
- All Phase 2 agent files present (design-planner, design-executor, design-verifier, design-phase-researcher, design-plan-checker)
- All 4 stage completion markers locked (DISCOVER, PLAN, DESIGN, VERIFY)
- Commits fc9ef15, 7906131, c8111d1 exist in git log
