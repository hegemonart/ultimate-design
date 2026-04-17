---
name: plan
description: "Stage 2 of the Ultimate Design pipeline. Reads DESIGN-CONTEXT.md and produces DESIGN-PLAN.md — a wave-based task breakdown that routes each design chunk to the right sub-skill. Use --auto to skip confirmation. Use --research to run a deeper pre-planning reference pass first. Use --parallel to enable parallel execution hints in the plan (consumed by design --parallel)."
argument-hint: "[--auto] [--research] [--parallel]"
user-invocable: true
---

# Ultimate Design — Plan

**Stage 2 of 4.** Reads `.design/DESIGN-CONTEXT.md`, writes `.design/DESIGN-PLAN.md`.

You are the planning stage. Your job is to read the locked decisions from Discovery and decompose the design work into a concrete, wave-ordered task plan — without doing any design work yourself.

## Prerequisites

Read `.design/DESIGN-CONTEXT.md` first. If it doesn't exist, tell the user:
> "No discovery context found. Run `/ultimate-design:discover` first."

Read all files listed in `<canonical_refs>` before continuing.

Also read from plugin root:
- `${CLAUDE_PLUGIN_ROOT}/reference/sub-skills.md` — routing rules per task type
- `${CLAUDE_PLUGIN_ROOT}/reference/priority-matrix.md` — issue severity reference

## Optional: Research Pass

If `$ARGUMENTS` contains `--research`:
Before planning, do a brief research pass:
- Search `~/.claude/libs/awesome-design-md/` for any DESIGN.md matching the project's brand archetype from `<brand>` in DESIGN-CONTEXT.md
- Note any patterns, tokens, or layout approaches that match the direction
- Store findings as a `<research>` block in DESIGN-PLAN.md

## Planning Logic

### Step 1 — Scope breakdown

From `<domain>` and `<goals>` in DESIGN-CONTEXT.md, identify all discrete design tasks. A task is a piece of work that can be handed to one sub-skill invocation.

Group tasks by type:

| Task type | Sub-skill |
|---|---|
| Audit existing UI for issues | `impeccable-audit` |
| Build/generate new component or page | `impeccable` (craft mode) |
| Typography fixes | `impeccable-typeset` |
| Color/palette work | `impeccable-colorize` |
| Layout & spacing | `impeccable-layout` |
| Animation & interactions | `emil-design-eng` |
| Accessibility check | `design:accessibility-review` |
| Design system tokens/components | `anthropic-skills:design-systems` |
| UX copy / microcopy | `anthropic-skills:copywriter` |
| Design critique / review | `design:design-critique` |
| Developer handoff spec | `design:design-handoff` |
| Production hardening | `impeccable-harden` |
| Final polish pass | `impeccable-polish` |
| Simplify / reduce | `impeccable-distill` |

### Step 2 — Wave assignment and parallelism analysis

Assign tasks to execution waves:

- **Wave 1:** Tasks with no dependencies on other tasks in this plan.
- **Wave 2:** Tasks that depend on Wave 1 output (e.g., polish requires build; handoff requires final design).
- **Wave 3+:** Only if genuinely sequential.

Default: most design sessions are 2 waves — audit/generate in Wave 1, polish/handoff in Wave 2.

**Per-task parallelism:** For each task, determine whether it can safely run in parallel with other Wave 1 tasks. A task is `parallel: true` if and only if its `touches:` set does not overlap with any other Wave 1 task's `touches:` set. If there is a file overlap, set `parallel: false` and note the conflict reason.

If `$ARGUMENTS` contains `--parallel`, add this analysis to the plan header and per-task fields. If not, omit `parallel:` and `touches:` fields (they're only needed when design runs with `--parallel`).

### Step 3 — Must-haves

Copy `<must_haves>` from DESIGN-CONTEXT.md into the plan. These are what Verify checks against.

Add plan-specific must-haves: observable outcomes per task (not "ran the command", but "the button hover state is distinct from the idle state").

### Step 4 — Present plan for approval

Before writing the file, show the user a summary:

```
━━━ Design Plan ━━━

Wave 1 (parallel):
  [01] impeccable-audit → [scope: what it audits]
  [02] impeccable-typeset → [scope: what typography it fixes]
  [03] design:accessibility-review → [scope: what it checks]

Wave 2 (after Wave 1):
  [04] impeccable-polish → [scope: final polish pass]
  [05] design:design-handoff → [scope: handoff spec for eng]

Must-haves:
  • [M-01: observable outcome]
  • [M-02: ...]

Does this scope look right? Add, remove, or adjust tasks before I write the plan.
━━━━━━━━━━━━━━━━━━━━━
```

Adjust based on feedback. If `--auto` was passed, skip approval and write directly.

## Output: DESIGN-PLAN.md

Write `.design/DESIGN-PLAN.md`:

```markdown
---
project: [name]
created: [ISO 8601]
waves: [N]
context: .design/DESIGN-CONTEXT.md
parallel_ready: true | false   # only present when planned with --parallel
---

## Wave 1

### Task 01 — [Task Name]
Sub-skill: `[skill-name]`
Scope: [What exactly this task covers — specific components, files, aspects]
Touches: [comma-separated list of files/dirs this task will modify — e.g. src/components/Button.tsx, src/styles/tokens.css]
Parallel: true | false         # only present when planned with --parallel; false if touches overlaps another Wave 1 task
Conflict: [only if Parallel: false — name the other task(s) that share the same files]
Read first:
  - .design/DESIGN-CONTEXT.md (decisions + brand)
  - [canonical_refs from context]
  - [any specific component files relevant to this task]
Action: [Concrete instruction for the sub-skill invocation]
Acceptance criteria:
  - [Verifiable design outcome, not process]
  - [Second verifiable outcome]

### Task 02 — [Task Name]
[same structure]

---

## Wave 2

### Task 03 — [Task Name]
Depends on: Task 01, Task 02
[same structure]

---

## Must-Haves (checked during Verify)

- M-01: [Observable outcome]
- M-02: [...]

---

## Deferred

[Tasks discussed but descoped from this plan]
```

## After Writing

```
━━━ Plan complete ━━━
Saved: .design/DESIGN-PLAN.md
Tasks: [N] across [W] wave(s)

Next: /ultimate-design:design
  → Executes each task by routing to the appropriate design sub-skill.
━━━━━━━━━━━━━━━━━━━━
```

Do not start design work automatically unless the user explicitly says "go" or `--auto` was passed.
