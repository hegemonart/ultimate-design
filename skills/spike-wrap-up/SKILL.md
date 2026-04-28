---
name: gdd-spike-wrap-up
description: "Close a spike — capture findings, write decision to STATE.md, update SUMMARY.md."
argument-hint: "[slug]"
tools: Read, Write, Glob, AskUserQuestion
---

# Get Design Done — Spike Wrap-Up

**Role:** Close an open spike — capture the verdict, write findings, record a D-XX decision in STATE.md so `plan` sees it when creating tasks.

## Step 1 — Find spike

- Glob `.design/spikes/*/`.
- If `[slug]` provided → use it directly.
- If multiple pending (no `FINDINGS.md`) → AskUserQuestion: "Which spike are you wrapping up?"
- If none → print: "No open spikes. Run `/gdd:spike` first." and exit.

## Step 2 — Re-surface hypothesis

Read `.design/spikes/<slug>/HYPOTHESIS.md`. Show the hypothesis + success/failure criteria to the user.

## Step 3 — Elicit findings

AskUserQuestion:
1. "Did it meet success criteria? (yes / no / partial)"
2. "What was learned? (1–3 sentences)"
3. "Recommendation? (adopt / reject / needs more investigation)"

## Step 4 — Write FINDINGS.md

Write `.design/spikes/<slug>/FINDINGS.md`:
```markdown
# Findings: <slug>

**Verdict**: yes / no / partial
**Recommendation**: adopt / reject / needs more investigation
**Completed**: YYYY-MM-DD HH:MM

## What was learned
<1–3 sentences>

## Next steps
<1–2 bullets>
```

## Step 5 — Record decision in STATE.md

Append a `D-XX` entry under `<decisions>` in `.design/STATE.md`:
```
D-XX: spike/<slug> — <verdict> — <recommendation>
  Rationale: <one line>
  Source: .design/spikes/<slug>/FINDINGS.md
```

(Increment D-XX from the highest existing number — scan `<decisions>` for
`D-\d+:` entries and take `max + 1`, zero-padded to two digits.)

If MCP `gdd_state` tools are available, prefer the typed mutator:
```
- mcp__gdd_state__add_decision({id: "D-XX", text: "spike/<slug> — <verdict> — <recommendation> — <one-line rationale>", status: "locked"})
```

## Step 6 — Append `<prototyping>` outcome to STATE.md

Coupled with the Step 5 decision write — both must succeed together so the
spike resolution is discoverable from both `<decisions>` (read by all
downstream stages) and `<prototyping>` (read by planner-specific context via
the decision-injector). Use the **same `D-XX`** as Step 5.

Append a `<spike>` child element under `<prototyping>` in `.design/STATE.md`:
```
<spike slug="<slug>" cycle="<cycle>" decision="D-XX" verdict="yes|no|partial" status="resolved"/>
```

`<cycle>` is the current cycle id from `.design/STATE.md` frontmatter
(`cycle:` field; empty string is valid for Wave A single-cycle projects).
`verdict` is the answer from Step 3 (`yes` / `no` / `partial`).

If a `<prototyping>` block does not yet exist in STATE.md, materialize it
between `<must_haves>` and `<connections>` per the STATE template, then
append the `<spike …/>` line as its first child. The block is omitted on
fresh files and only appears once the first sketch / spike / skipped entry
lands.

If MCP `gdd_state` tools are available, prefer the typed mutator (it wraps
`scripts/lib/gdd-state/mutator.ts` and emits byte-identical output to manual
edits):
```
- mcp__gdd_state__add_prototyping({type: "spike", slug: "<slug>", cycle: "<cycle>", decision: "D-XX", verdict: "<verdict>", status: "resolved"})
```

Without MCP, edit `.design/STATE.md` directly with `Read` + `Write`,
inserting the line into the `<prototyping>` block.

## Step 7 — Update spikes SUMMARY.md

Append entry to `.design/spikes/SUMMARY.md` (create if missing):
```markdown
- <slug> (YYYY-MM-DD) — verdict: <yes|no|partial> — recommendation: <adopt|reject|more> — D-XX
```

## After writing

```
━━━ Spike wrapped ━━━
Slug: <slug>
Verdict: <verdict>
Decision recorded: D-XX
Prototyping entry: <spike slug="<slug>" cycle="<cycle>" decision="D-XX" verdict="<verdict>" status="resolved"/>
FINDINGS.md written.
━━━━━━━━━━━━━━━━━━━━
```

## Do Not

- Do not delete the `scratch/` directory — it's a record of what was tried.
- Do not promote scratch code to `src/` automatically — require a follow-up plan task.

## SPIKE-WRAP-UP COMPLETE
