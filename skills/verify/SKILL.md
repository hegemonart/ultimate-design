---
name: verify
description: "Stage 4 of 4 — spawns design-verifier, interprets pass/gap result, handles gap-response loop with inline fix (Phase 5 will add AGENT-12 remediation agent). Thin orchestrator."
argument-hint: "[--auto]"
user-invocable: true
---

# Ultimate Design — Verify

**Stage 4 of 4.** Thin orchestrator. All verification intelligence lives in agents/design-verifier.md.

---

## State Integration

1. Read `.design/STATE.md`.
   - If missing: create minimal skeleton from `reference/STATE-TEMPLATE.md` with `stage=verify`, `status=in_progress`; log warning to user: "No STATE.md found — creating minimal skeleton."
   - If present and `stage==verify` and `status==in_progress`: RESUME — if `.design/DESIGN-VERIFICATION.md` exists, pick up from the gap-response loop (skip re-spawning the verifier, go to Step 2). Otherwise re-spawn verifier from Step 1.
   - Otherwise: normal transition — set `stage=verify`, `status=in_progress`, `task_progress=0/1`.
2. Update `<connections>`, `last_checkpoint`. Write STATE.md.

Abort only if no `.design/` directory exists (user has not run prior stages). Output: "No .design/ directory found. Run /ultimate-design:discover first."

---

## Flag Parsing

- `--auto` → `auto_mode=true` (no interactive prompts; skip visual UAT interactive steps; on gaps: save-and-exit rather than prompt for fix)

---

## Step 1 — Spawn Verifier

Initialize iteration counter to 0 (used for fix loop limit in Step 3).

```
Task("design-verifier", """
<required_reading>
@.design/STATE.md
@.design/DESIGN-PLAN.md
@.design/DESIGN-CONTEXT.md
@.design/tasks/
@reference/audit-scoring.md
@reference/heuristics.md
@reference/review-format.md
@reference/accessibility.md
</required_reading>

You are the design-verifier agent. Run the 5-phase verification against completed design work.

Context:
  auto_mode: <true|false>
  re_verify: false

Write .design/DESIGN-VERIFICATION.md. If gaps found, emit `## GAPS FOUND` followed by structured gap list, then `## VERIFICATION COMPLETE`. If no gaps, just emit `## VERIFICATION COMPLETE`.
""")
```

Wait for `## VERIFICATION COMPLETE` in the agent response. Once detected, update STATE.md `task_progress=1/1`.

---

## Step 2 — Interpret Result

Check agent response for `## GAPS FOUND` marker appearing before `## VERIFICATION COMPLETE`:

### If NO gaps (PASS):

- Update STATE.md `<must_haves>`: set each M-XX `status=pass`.
- Go to **State Update (exit)** with status=completed.

### If GAPS FOUND:

- Parse the gap list from the agent response (all entries between `## GAPS FOUND` and `## VERIFICATION COMPLETE`).
- Count gaps by severity (BLOCKER, MAJOR, MINOR, COSMETIC).
- If `auto_mode=true`: preserve DESIGN-VERIFICATION.md, update STATE.md `status=blocked`, append `<blockers>` entry: "[verify] [ISO date]: N blockers found — see .design/DESIGN-VERIFICATION.md". Exit with message:
  ```
  Verification failed — N gaps found (X blockers, Y majors, Z minors, W cosmetics).
  Report: .design/DESIGN-VERIFICATION.md
  Fix gaps and re-run: /ultimate-design:verify
  ```
- If `auto_mode=false`: present gap summary and menu (go to Step 3).

---

## Step 3 — Gap Response Loop

Present to the user:

```
━━━ Verification found N gaps ━━━
  BLOCKER: X
  MAJOR:   Y
  MINOR:   Z
  COSMETIC:W

Options:
  [1] Fix now   — inline fix for addressable gaps, then re-verify
  [2] Save and exit — work preserved; fix in a later session
  [3] Accept as-is  — mark verify complete despite gaps (not recommended for blockers)

Choose:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### If user chose [2] Save and exit:

- Preserve DESIGN-VERIFICATION.md.
- Update STATE.md: `<position> status=blocked`.
- Append `<blockers>`: "[verify] [ISO date]: N gaps outstanding — see .design/DESIGN-VERIFICATION.md".
- Write STATE.md.
- Exit:
  ```
  Gaps saved. Resume with: /ultimate-design:verify
  Report: .design/DESIGN-VERIFICATION.md
  ```

### If user chose [3] Accept as-is:

- Update STATE.md `<must_haves>`: set `status=fail` for each unmet must-have, but proceed to exit.
- Append `<blockers>`: "[verify] [ISO date]: accepted with N unresolved gaps".
- Go to **State Update (exit)** with status=completed.

### If user chose [1] Fix now:

Check fix iteration counter. If counter >= 3:
```
Maximum fix iterations (3) reached. Saving current state and exiting.
Outstanding gaps remain — see .design/DESIGN-VERIFICATION.md.
```
Treat as Save and exit (option 2 above).

Otherwise: increment iteration counter and run the inline fix flow below.

# TODO(phase-5): replace inline fix logic below with AGENT-12 spawn once it exists in Phase 5
# --- BEGIN preserved v2.1.0 inline fix logic ---
#
# Treat the gap plan as a mini DESIGN-PLAN.md. Execute each BLOCKER/MAJOR gap task
# sequentially using the Design stage's task execution approach:
#
# 1. For each gap classified BLOCKER or MAJOR in the gap list:
#    a. Read the gap entry fields: Phase, Description, Expected, Actual, Location, Suggested fix.
#    b. Apply the targeted fix to the file/location specified in the gap's Location field.
#    c. Confirm the fix — re-grep or re-read the changed file to confirm the specific issue is gone.
#    d. Log the fix applied (gap ID + what was changed).
# 2. For MINOR and COSMETIC gaps: apply only if user confirms "fix all" or if gap has trivial scope.
# 3. After all targeted fixes, report: "Fixes applied: N. Re-running verification..."
#
# --- END preserved v2.1.0 inline fix logic ---

After inline fixes complete, re-spawn design-verifier with `re_verify=true` and loop to Step 2:

```
Task("design-verifier", """
<required_reading>
@.design/STATE.md
@.design/DESIGN-PLAN.md
@.design/DESIGN-CONTEXT.md
@.design/tasks/
@reference/audit-scoring.md
@reference/heuristics.md
@reference/review-format.md
@reference/accessibility.md
</required_reading>

You are the design-verifier agent. This is a re-verification run after inline fixes.

Context:
  auto_mode: <true|false>
  re_verify: true

Focus verification on previously-failed must-haves first. Run full 5-phase pass.
Write updated .design/DESIGN-VERIFICATION.md. Emit ## GAPS FOUND (if any), then ## VERIFICATION COMPLETE.
""")
```

---

## State Update (exit)

1. `<position> status=completed` (or `blocked` for save-and-exit).
2. `<timestamps> verify_completed_at=<ISO date now>`.
3. Update `last_checkpoint`. Write STATE.md.

---

## After Completion

Print summary:

```
━━━ Verify complete ━━━
Status: PASS | FAIL | ACCEPTED-WITH-GAPS
Gaps:   X blockers, Y majors, Z minors, W cosmetics
Report: .design/DESIGN-VERIFICATION.md

Next: [if pass] pipeline complete — run /ultimate-design:discover for next session
      [if fail] fix gaps and re-run /ultimate-design:verify
━━━━━━━━━━━━━━━━━━━━━
```

## VERIFY COMPLETE
