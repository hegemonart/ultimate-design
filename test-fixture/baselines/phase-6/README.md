# Phase 6 Regression Baseline

Captured: 2026-04-18
Re-locked: 2026-04-18 (post Phases 7–11 merges)
Plugin version at re-lock: 1.0.5
Last validated phase: Phase 11 (Self-Improvement)

## Re-lock note (2026-04-18)

The phase-6 baseline was re-locked after Phases 7, 8, 9, 10, and 11 merged to main
with new agents, skills, and connections. This baseline now tracks current shipped
state through Phase 11 so the regression-baseline test detects future drift rather
than producing noise from legitimate phase additions.

## Contents

- agent-list.txt — expected agent filenames (sorted)
- skill-list.txt — expected skill directory names (sorted)
- connection-list.txt — expected connection doc filenames (sorted)
- plugin-version.txt — plugin version at capture time
- agent-frontmatter-snapshot.json — frontmatter of all agents at capture time

## Re-lock procedure

Re-locking this baseline is a MANUAL, CONFIRMED operation. To re-lock:

1. Run the pipeline on test-fixture/ and verify outputs are correct.
2. Delete test-fixture/baselines/phase-6/ entirely.
3. Re-run: node scripts/lock-baseline.cjs phase-6
   (script created in Phase 12 plan 12-02, task 01)
4. Commit with message: "chore(tests): re-lock phase-6 regression baseline"
5. All team members must explicitly acknowledge the re-lock in the PR.

Never re-lock a baseline to fix a failing test without first confirming the NEW
output is correct. A passing test against a wrong baseline is worse than a failing test.
