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

## Step 7 — Append D-XX + `<prototyping>` outcome to STATE.md

Two coupled writes to `.design/STATE.md`. Both must succeed together so the
sketch resolution is discoverable from both `<decisions>` (read by all
downstream stages) and `<prototyping>` (read by planner-specific context via
the decision-injector).

Compute `D-XX` as the highest existing `D-NN` in `<decisions>` plus 1
(scan `<decisions>` for `D-\d+:` entries and take `max + 1`, zero-padded
to two digits — e.g. existing `D-07` → new entry is `D-08`). Use the same
`D-XX` value in both writes below.

**Write 1 — append a numbered decision under `<decisions>`:**
```
D-XX: sketch/<slug> — winner: variant-N — <one-line rationale> (locked)
  Source: .design/sketches/<slug>/WINNER.md
```

**Write 2 — append a `<sketch>` child element under `<prototyping>`:**
```
<sketch slug="<slug>" cycle="<cycle>" decision="D-XX" status="resolved"/>
```

`<cycle>` is the current cycle id from `.design/STATE.md` frontmatter
(`cycle:` field; empty string is valid for Wave A single-cycle projects).

If a `<prototyping>` block does not yet exist in STATE.md, materialize it
between `<must_haves>` and `<connections>` per the STATE template, then
append the `<sketch …/>` line as its first child. The block is omitted on
fresh files and only appears once the first sketch / spike / skipped entry
lands.

If MCP `gdd_state` tools are available, prefer the typed mutators (these
wrap `scripts/lib/gdd-state/mutator.ts` and emit byte-identical output to
manual edits):
```
- mcp__gdd_state__add_decision({id: "D-XX", text: "sketch/<slug> — winner: variant-N — <rationale>", status: "locked"})
- mcp__gdd_state__add_prototyping({type: "sketch", slug: "<slug>", cycle: "<cycle>", decision: "D-XX", status: "resolved"})
```

Without MCP, edit `.design/STATE.md` directly with `Read` + `Write`,
inserting the two lines into the correct blocks.

## Step 8 — Update sketches SUMMARY.md

Append entry to `.design/sketches/SUMMARY.md` (create if missing):
```markdown
- <slug> (YYYY-MM-DD) — winner: variant-N — area: <area> — D-XX — <one-line rationale>
```

## After writing

```
━━━ Sketch wrapped ━━━
Slug: <slug>
Winner: variant-N
Area: <area>
Decision recorded: D-XX
Prototyping entry: <sketch slug="<slug>" cycle="<cycle>" decision="D-XX" status="resolved"/>
Project skill: ./.claude/skills/design-<area>-conventions.md
━━━━━━━━━━━━━━━━━━━━━
```

## Do Not

- Do not modify other sketch variants or rejected directions.
- Do not write to `src/` — conventions are design-layer only.

## SKETCH-WRAP-UP COMPLETE
