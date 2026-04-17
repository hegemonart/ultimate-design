---
name: design
description: "Stage 3 of the Ultimate Design pipeline. Reads DESIGN-PLAN.md and executes each task in wave order by routing to the appropriate design sub-skill. Produces DESIGN-SUMMARY.md. --parallel spawns Wave 1 tasks as isolated agents running concurrently (requires plan created with --parallel). --wave N runs a single wave only."
argument-hint: "[--parallel] [--wave N]"
user-invocable: true
---

# Ultimate Design — Design

**Stage 3 of 4.** Reads `.design/DESIGN-PLAN.md`, executes tasks, writes `.design/DESIGN-SUMMARY.md`.

## Prerequisites

Read both before anything else:
- `.design/DESIGN-PLAN.md` — task list, waves, must-haves
- `.design/DESIGN-CONTEXT.md` — brand, decisions, constraints, canonical_refs

If DESIGN-PLAN.md doesn't exist:
> "No plan found. Run `/ultimate-design:plan` first."

If `--parallel` is passed but DESIGN-PLAN.md header has `parallel_ready: false` or is missing that field:
> "Plan was not created with --parallel. Re-run `/ultimate-design:plan --parallel` to enable parallel execution metadata."

Also read every file listed in `<canonical_refs>` from DESIGN-CONTEXT.md.

Create `.design/tasks/` directory for per-task output files.

---

## Execution Mode Decision

```
$ARGUMENTS contains --parallel?
  YES → Parallel mode (Wave 1 tasks with Parallel: true run concurrently via Agent)
  NO  → Sequential mode (all tasks run one by one via Skill tool)

$ARGUMENTS contains --wave N?
  YES → Only run tasks from Wave N, then stop
  NO  → Run all waves in order
```

---

## Sequential Mode (default)

For each wave, in order:

### 1. Announce the wave

```
━━━ Wave [N] — [N tasks] — sequential ━━━
[01] impeccable-audit
[02] impeccable-typeset
Running...
```

### 2. For each task

**a.** Read every file in the task's `Read first:` list.

**b.** Build context block from DESIGN-CONTEXT.md:
```
Brand: [tone words]
Decisions: [only D-XX entries relevant to this task type]
Anti-patterns: [from <brand> anti-pattern field]
References: [R-XX entries]
```

**c.** Invoke via Skill tool: `Skill("[sub-skill-name]", "[Action instruction] + [context block]")`

If the sub-skill is not installed, log:
```
⚠ Task [NN] — [skill-name] not installed. Skipping.
```
Continue with remaining tasks — do not abort the wave.

**d.** After each task, append to `.design/tasks/task-NN.md`:
```markdown
---
task: NN
skill: [skill-name]
status: complete | skipped | deviation
---
[What was done, files changed, acceptance criteria results]
```

### 3. Between waves

After Wave 1, show mid-point summary and ask go/no-go before Wave 2:

```
━━━ Wave 1 complete ━━━
Done: [N] / Skipped: [N] / Deviations: [N]

Ready for Wave 2? (yes / adjust first)
━━━━━━━━━━━━━━━━━━━━━
```

Skip this checkpoint if `--auto` was passed at any earlier pipeline stage (check for presence of `.design/auto-mode` marker file).

---

## Parallel Mode (--parallel)

Only applies to Wave 1. Wave 2+ always runs sequentially after Wave 1 completes.

### Step 1 — Pre-flight conflict check

Read every Wave 1 task's `Parallel:` and `Touches:` fields from DESIGN-PLAN.md.

Partition Wave 1 tasks:

| Partition | Condition | Execution |
|---|---|---|
| **Parallel batch** | `Parallel: true` | Spawn as concurrent agents |
| **Sequential tail** | `Parallel: false` (file conflict) | Run after parallel batch finishes |

Report the partition to the user before spawning:

```
━━━ Wave 1 — parallel mode ━━━
Parallel batch (3 tasks — spawning concurrently):
  [01] impeccable-audit       touches: src/components/
  [02] design:accessibility-review  touches: src/styles/tokens.css
  [03] anthropic-skills:copywriter  touches: src/copy/

Sequential tail (1 task — file conflict with Task 01):
  [04] impeccable-typeset     touches: src/components/ ← conflicts with Task 01

Spawning agents...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 2 — Spawn parallel agents

For each task in the parallel batch, spawn a single Agent call. Send ALL parallel-batch agents in one message (one Agent tool call per task, all in the same response) so they run concurrently.

**Each agent prompt must be fully self-contained** — agents have no memory of this session. Include everything the agent needs:

```
You are executing a single design task as part of the Ultimate Design pipeline.

== TASK ==
Task: [NN] — [Task Name]
Sub-skill to invoke: [skill-name]
Scope: [task scope]
Action: [verbatim Action field from plan]

== DESIGN CONTEXT ==
Brand tone: [word] · [word] · [word]
Anti-pattern: [what NOT to do]
Key decisions:
  D-01: [decision]
  D-02: [decision]
References: [R-01, R-02]

== FILES TO READ FIRST ==
[list from task Read first field — full paths]

== ACCEPTANCE CRITERIA ==
[list from task]

== OUTPUT REQUIRED ==
When done, write your results to: .design/tasks/task-[NN].md

Use this exact format:
---
task: NN
skill: [skill-name]
status: complete | skipped | deviation
---

## What was done
[2–4 sentences]

## Files changed
- [path]

## Acceptance criteria
- [✓/✗] [criterion]

## Deviations (if any)
[description or "none"]

Do not write to DESIGN-SUMMARY.md — the orchestrator merges all task files after you complete.
Invoke the sub-skill now using the Skill tool, then write the output file.
```

Use `isolation: "worktree"` on each Agent call so agents work in separate git worktrees and cannot conflict on file writes.

### Step 3 — Wait for all agents

All parallel agents run concurrently. Wait for all to complete before continuing.

After completion, read each `.design/tasks/task-NN.md` and show a merge summary:

```
━━━ Parallel batch complete ━━━
[✓] Task 01 — impeccable-audit
[✓] Task 02 — design:accessibility-review
[⚠] Task 03 — anthropic-skills:copywriter (deviation — see task file)

Merging worktrees...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 4 — Merge worktrees

After all parallel agents finish, merge their worktree branches back into the main working directory. For each agent that used `isolation: "worktree"`, the worktree branch is returned in the Agent result.

Merge strategy:
- Each agent worked on non-overlapping files (guaranteed by the conflict check)
- Accept all changes from all branches
- If a merge conflict appears anyway (agent touched an unexpected file), flag it and ask the user to resolve before continuing

### Step 5 — Run sequential tail

After the parallel batch is merged, run any `Parallel: false` tasks sequentially using the standard Skill tool approach (same as Sequential Mode).

### Step 6 — Wave 1 summary + Wave 2 checkpoint

Same as Sequential Mode — show summary and ask go/no-go before Wave 2. Wave 2 always runs sequentially regardless of `--parallel` flag.

---

## Output: DESIGN-SUMMARY.md

After all waves complete, merge all `.design/tasks/task-NN.md` files into `.design/DESIGN-SUMMARY.md`:

```markdown
---
project: [name]
created: [ISO 8601]
status: complete | partial
mode: sequential | parallel
waves_run: [N]
---

## Wave 1

### Task 01 — [Task Name]
Sub-skill: `[skill]`
Status: ✓ complete | ✗ skipped ([reason]) | ⚠ deviation ([details])

**What was done:**
[from task file]

**Files changed:**
- [path]

**Acceptance criteria:**
- [✓/✗] [criterion]

---

[repeat for each task]

---

## Deviations

[Aggregated list of all deviations across tasks]

---

## Files Modified

[Complete deduped list of all files changed]
```

---

## After Completion

```
━━━ Design stage complete ━━━
Saved: .design/DESIGN-SUMMARY.md
Mode: [sequential | parallel]
Tasks: [N complete] / [M total]
Deviations: [N]

Next: /ultimate-design:verify
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
