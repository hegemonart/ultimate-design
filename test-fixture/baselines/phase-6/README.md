# Phase 6 Regression Baseline

Captured: 2026-04-18
Plugin version: 1.0.0
Last validated phase: Phase 6 (Validation + Version Bump)

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
