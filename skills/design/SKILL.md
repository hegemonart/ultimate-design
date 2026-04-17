---
name: design
description: "Stage 3 of the Ultimate Design pipeline. Reads DESIGN-PLAN.md and executes each task in wave order by routing to the appropriate design sub-skill (impeccable, design:*, anthropic-skills:*, emil-design-eng). Produces DESIGN-SUMMARY.md. Add --wave N to run a specific wave only."
argument-hint: "[--wave N]"
user-invocable: true
---

# Ultimate Design — Design

**Stage 3 of 4.** Reads `.design/DESIGN-PLAN.md`, executes tasks, writes `.design/DESIGN-SUMMARY.md`.

You are the execution stage. Your job is to work through every task in the plan in wave order, invoking the specified sub-skill for each, and recording what was actually done.

## Prerequisites

Read both:
- `.design/DESIGN-PLAN.md` — your task list and must-haves
- `.design/DESIGN-CONTEXT.md` — brand, decisions, constraints

If DESIGN-PLAN.md doesn't exist, tell the user:
> "No plan found. Run `/ultimate-design:plan` first."

Also read all files listed in DESIGN-CONTEXT.md's `<canonical_refs>`.

## Wave Filtering

If `$ARGUMENTS` contains `--wave N`, only execute tasks from that wave. Otherwise run all waves sequentially.

## Execution Protocol

For each wave:

### 1. Announce the wave

```
━━━ Wave [N] — [N tasks] ━━━
[01] impeccable-audit
[02] impeccable-typeset
[03] design:accessibility-review
Running...
```

### 2. For each task in the wave

Execute in this order:

**a. Read first**
Read every file listed in the task's `read_first` before invoking the sub-skill.

**b. Context injection**
Before invoking the sub-skill, synthesize a context block from DESIGN-CONTEXT.md:
- Brand tone words
- Relevant decisions (only D-XX entries relevant to this task type)
- Anti-patterns to avoid
- References to draw from

**c. Invoke the sub-skill**
Use the Skill tool: `Skill("[skill-name]")` passing the context and the task's Action instruction as arguments.

If the target skill is not installed (not listed in available skills), log:
```
⚠ Task [NN] — [skill-name] not installed. Skipping. Add to your Claude Code setup to enable this task.
```
Do not abort the whole wave — continue with remaining tasks.

**d. Record outcome**
After each task, write to the summary (append format) what was done, what files changed, and whether acceptance criteria passed.

### 3. Between waves

After Wave 1 completes, show the user a mid-point summary and ask for a quick go/no-go before starting Wave 2:

```
━━━ Wave 1 complete ━━━
Completed: [N] tasks
Issues: [any failures or skipped tasks]

Ready to run Wave 2 ([N tasks])? (yes / adjust plan first)
━━━━━━━━━━━━━━━━━━━━━
```

If `--auto` in the original invocation (passed through from discover/plan), skip this checkpoint.

## What "invoking a sub-skill" means

The sub-skills (impeccable, design:critique, etc.) are invoked via the Skill tool. Pass them both:
1. The task's Action instruction verbatim
2. The context block derived from DESIGN-CONTEXT.md

Example for an audit task:
> "Audit the current dashboard page for issues. Brand: editorial chaos, pharmaceutical precision. Anti-patterns to avoid: glassmorphism, pure-black dark mode, Inter/Space Grotesk defaults. Produce a Before/After table."

The sub-skill executes its own logic. You track what it does and record it.

## Deviation Handling

If a sub-skill produces output that conflicts with DESIGN-CONTEXT.md decisions:
- Flag the conflict in the summary
- Do not silently override context decisions
- Ask the user whether to accept the deviation or redo the task

## Output: DESIGN-SUMMARY.md

Write `.design/DESIGN-SUMMARY.md` as tasks complete:

```markdown
---
project: [name]
created: [ISO 8601]
status: complete | partial
waves_run: [N]
---

## Wave 1

### Task 01 — [Task Name]
Sub-skill: `[skill]`
Status: ✓ complete | ✗ skipped ([reason]) | ⚠ deviation ([details])

**What was done:**
[2–4 sentences describing the actual output]

**Files changed:**
- [path/to/file]

**Acceptance criteria:**
- [✓] [criterion 1]
- [✓] [criterion 2]
- [✗] [criterion 3 — not met: reason]

---

### Task 02 — [Task Name]
[same structure]

---

## Wave 2

[same structure]

---

## Deviations

[Any cases where the output differed from the plan, with rationale]

---

## Files Modified

[Complete list of all files changed across all tasks]
```

## After Completion

```
━━━ Design stage complete ━━━
Saved: .design/DESIGN-SUMMARY.md
Tasks: [N complete] / [M total]
Deviations: [N]

Next: /ultimate-design:verify
  → Checks must-haves and asks you to validate the visual results.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Do not move to verify automatically — the user may want to review changes first.
