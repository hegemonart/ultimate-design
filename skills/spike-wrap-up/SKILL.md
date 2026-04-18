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

(Increment D-XX from the highest existing number.)

## Step 6 — Update spikes SUMMARY.md

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
FINDINGS.md written.
━━━━━━━━━━━━━━━━━━━━
```

## Do Not

- Do not delete the `scratch/` directory — it's a record of what was tried.
- Do not promote scratch code to `src/` automatically — require a follow-up plan task.

## SPIKE-WRAP-UP COMPLETE
