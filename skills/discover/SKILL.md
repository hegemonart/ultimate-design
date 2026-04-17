---
name: discover
description: "Stage 1.5 of 4 — thin orchestrator that spawns design-context-builder (auto-detect + interview) and design-context-checker (6-dimension validator) to produce DESIGN-CONTEXT.md."
argument-hint: "[--auto]"
user-invocable: true
---

# Ultimate Design — Discover

**Stage 1.5 of 4.** Produces `.design/DESIGN-CONTEXT.md`.

---

## State Integration

1. Read `.design/STATE.md`.
   - If missing: create minimal skeleton from `reference/STATE-TEMPLATE.md` with stage=discover, status=in_progress, task_progress=0/1, and log warning: "STATE.md not found — created fresh. If this is a resumed session, run /ultimate-design:scan first."
   - If present and stage==discover and status==in_progress: RESUME — continue existing interview; do not reset.
   - Otherwise: normal transition — set frontmatter stage=discover, <position> stage=discover, status=in_progress, task_progress=0/1.
2. Update <connections> by probing MCP availability.
3. Update last_checkpoint. Write STATE.md.

## Step 1 — Spawn design-context-builder

Task("design-context-builder", """
<required_reading>
@.design/STATE.md
@reference/audit-scoring.md
@reference/anti-patterns.md
</required_reading>

You are the design-context-builder agent. Auto-detect existing design system
state via grep/glob before asking questions. Interview the user ONLY for areas
where auto-detect returned no confident answer. Write .design/DESIGN-CONTEXT.md.

Context:
  auto_mode: <true|false>

Output file: .design/DESIGN-CONTEXT.md
Emit `## CONTEXT COMPLETE` when done.
""")

Wait for `## CONTEXT COMPLETE`. Update STATE.md task_progress = 0.5.

## Step 2 — Spawn design-context-checker

Task("design-context-checker", """
<required_reading>
@.design/STATE.md
@.design/DESIGN-CONTEXT.md
</required_reading>

You are the design-context-checker agent. Validate DESIGN-CONTEXT.md across
6 dimensions. Return APPROVED or BLOCKED with per-dimension verdicts.

Emit `## CONTEXT CHECK COMPLETE` when done.
""")

Wait for `## CONTEXT CHECK COMPLETE`.

## Step 3 — Handle checker verdict

If APPROVED: proceed to state update.
If BLOCKED: present dimensions that BLOCKED to user, offer fix-and-retry loop
(re-spawn builder with specific fix instructions). Do not proceed to planning.

---

## State Update (exit)

1. Set <position> status=completed, task_progress=1/1.
2. Set <timestamps> discover_completed_at=<ISO 8601 now>.
3. Update last_checkpoint. Write STATE.md.

---

## After Writing

```
━━━ Discovery complete ━━━
Saved: .design/DESIGN-CONTEXT.md

Baseline score: [N]/100 ([grade])
Key issues: [top issue 1], [top issue 2], [top issue 3]

Next: /ultimate-design:plan
  → Decomposes your context into executable design tasks.
━━━━━━━━━━━━━━━━━━━━━━━━━
```

Do not proceed to planning automatically unless `--auto` was passed.

## DISCOVER COMPLETE
