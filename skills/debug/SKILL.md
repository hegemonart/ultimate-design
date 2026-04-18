---
name: gdd-debug
description: "Symptom-driven design investigation with persistent state. Writes findings to .design/DEBUG.md."
argument-hint: "[<symptom description>]"
tools: Read, Write, Grep, Glob, AskUserQuestion, Task
---

# /gdd:debug

Systematic, checkpoint-driven design debugger. Loads philosophy from `reference/debugger-philosophy.md` and writes every investigation step to `.design/DEBUG.md` so killed sessions can resume.

## Steps

1. **Load philosophy**: Read `reference/debugger-philosophy.md` and keep its five principles in mind for the entire session.
2. **Symptom**: If no symptom argument was passed, ask (AskUserQuestion): "What design symptom are you investigating? (observable only — 'cards look crowded', not 'padding is wrong')"
3. **Resume check**: Read `.design/DEBUG.md` if it exists. If there is an open session with no `### Fix Proposal` block, ask: "Resume existing session '<symptom>' or start a new one?"
4. **Ground truth load**: Read `.design/DESIGN-PLAN.md` (goals), `.design/STATE.md` `<decisions>` block (D-XX items), and any relevant source files pointed at by the symptom.
5. **Optional rendered-output check**: Use ToolSearch to see if Playwright/Preview MCP tools are available. If yes, capture rendered state. If no, fall back to code-only analysis.
6. **Investigation loop** — for each step:
   - Form one hypothesis (one variable).
   - Investigate (read files, grep, measure).
   - Append to `.design/DEBUG.md`:
     ```markdown
     ## <symptom> — <date>
     ### Hypothesis <N>
     ### Investigation
     ### Finding
     ```
   - Ask (AskUserQuestion): "Continue investigating? (yes / found it / dead end)"
7. **When found**: Write `### Fix Proposal` block with a concrete patch description. Ask: "Create a todo with `/gdd:todo add`, or execute the fix now?"

## Do Not

- Do not change multiple variables at once.
- Do not modify global tokens to fix a single component without explicit user approval.
- Do not close the DEBUG.md session without a finding (mark as "dead end" if abandoned).

## DEBUG COMPLETE
