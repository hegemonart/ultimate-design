---
name: gdd-sketch-wrap-up
description: "Walk through sketches, pick winner + rationale, group by design area, write project skills to ./.claude/skills/design-<area>-conventions.md."
argument-hint: "[slug]"
tools: Read, Write, Glob, AskUserQuestion
---

# Get Design Done — Sketch Wrap-Up

**Role:** Close an open sketch — elicit the winner + rationale from the user, group the decision by design area, and codify it as a project-local skill at `./.claude/skills/design-<area>-conventions.md` so future gdd sessions auto-load the decision.

## Step 1 — Find sketches

- Glob `.design/sketches/*/`.
- If `[slug]` provided → use it directly.
- If multiple pending (no `WINNER.md`) → AskUserQuestion: "Which sketch are you wrapping up?"
- If none → print: "No open sketches. Run `/gdd:sketch` first." and exit.

## Step 2 — Walk variants

Read the sketch's `README.md`. For each `variant-N.html`:
- Show the variant's one-line description from README.
- AskUserQuestion: "Is variant-N a keeper, maybe, or rejected?"

## Step 3 — Elicit winner rationale

AskUserQuestion:
1. "Which variant is the winner?"
2. "What makes variant-N the winning direction? (grounds the decision for future sessions)"
3. "Any token implications? (e.g., spacing scale clamp, color adjustment, font-weight shift)"

## Step 4 — Group by design area

AskUserQuestion: "Which design area does this winner inform?"
Options: typography / color / layout / motion / component / interaction

## Step 5 — Write project skill

Append to `./.claude/skills/design-<area>-conventions.md` (create if missing):

```markdown
# Design <Area> Conventions (Project-Local)

Auto-loaded in gdd sessions. Captures decisions codified from `/gdd:sketch-wrap-up`.

## Decision from sketch: <slug> (YYYY-MM-DD)
**Winner**: variant-N (<direction label>)
**Rationale**: <user rationale>
**Token implications**: <implications, or "none">
```

## Step 6 — Write WINNER.md

Write `.design/sketches/<slug>/WINNER.md`:
```markdown
# Winner: variant-N

**Slug**: <slug>
**Area**: <area>
**Rationale**: <user rationale>
**Captured**: YYYY-MM-DD
**Project skill written to**: ./.claude/skills/design-<area>-conventions.md
```

## Step 7 — Update sketches SUMMARY.md

Append entry to `.design/sketches/SUMMARY.md` (create if missing):
```markdown
- <slug> (YYYY-MM-DD) — winner: variant-N — area: <area> — <one-line rationale>
```

## After writing

```
━━━ Sketch wrapped ━━━
Slug: <slug>
Winner: variant-N
Area: <area>
Project skill: ./.claude/skills/design-<area>-conventions.md
━━━━━━━━━━━━━━━━━━━━━
```

## Do Not

- Do not modify other sketch variants or rejected directions.
- Do not write to `src/` — conventions are design-layer only.

## SKETCH-WRAP-UP COMPLETE
