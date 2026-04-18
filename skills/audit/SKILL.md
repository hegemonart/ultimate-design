---
name: gdd-audit
description: "Run design audit — wraps design-verifier + design-auditor. --retroactive audits the full cycle scope."
argument-hint: "[--retroactive] [--quick]"
tools: Read, Write, Task
---

# /gdd:audit

Wraps the existing `design-auditor`, `design-verifier`, and `design-integration-checker` agents — no new auditor logic here. Parses flags, spawns the right combination, prints summary.

## Modes

### Default
Spawn `design-auditor` (6-pillar scoring 1–4) in parallel with `design-integration-checker`. After both finish, read `.design/DESIGN-AUDIT.md` and `.design/DESIGN-INTEGRATION.md` and print a consolidated summary (scores + top 3 findings each).

### `--retroactive`
Spawn `design-verifier` with cycle-span scope. Verifier reads all tasks completed in the current cycle (from STATE.md `<completed_tasks>` list for the active `cycle:` ID) and uses `DESIGN-PLAN.md` goals as the reference baseline for what "should have been done." Output: `.design/DESIGN-VERIFICATION.md` with per-task pass/fail.

### `--quick`
Run only `design-auditor` (skip `design-integration-checker`). Faster health check when integration isn't the concern.

## Steps

1. Parse args for `--retroactive` and `--quick`.
2. Verify `.design/STATE.md` exists; abort if not (suggest `/gdd:new-project`).
3. Spawn the appropriate agents (Task tool). Default and `--retroactive` spawn two agents; `--quick` spawns one.
4. Wait for completion, then read each output file and print a summary:
   - Auditor scores per pillar
   - Integration check pass/fail
   - Verifier pass/fail per task (retroactive mode)
5. Recommend next action based on findings (e.g., "Score 2/4 on typography — run `/gdd:discuss typography` to gather decisions").

## Do Not

- Do not modify source files.
- Do not rerun stages; this is a read-only audit.

## AUDIT COMPLETE
