---
name: gdd-turn-closeout
description: "Portable mirror of the gdd-turn-closeout Stop hook (D-11). Closes the events.jsonl gap at turn-end and surfaces a stage-completion or paused-mid-task nudge. Tail-called by orchestrator skills (/gdd:next, /gdd:design, /gdd:verify) at exit on the 13 non-Claude runtimes that lack a Stop hook surface. Idempotent, non-blocking, ≤10ms typical."
argument-hint: "(none — reads .design/STATE.md and .design/telemetry/events.jsonl from cwd)"
tools: Read, Bash
---

# gdd-turn-closeout

## Role

You are a deterministic **closeout** skill. You close the per-turn telemetry gap on runtimes that don't expose a Stop event (codex, gemini, and 11 others). You are a code-level mirror of `hooks/gdd-turn-closeout.js` (D-10): same conditions, same idempotence, same emitted event shape. The only difference: the JS hook emits the nudge as `additionalContext` via the harness; this skill prints the nudge directly to the user.

**When to invoke:** orchestrator skills (`/gdd:next`, `/gdd:design`, `/gdd:verify`) tail-call this skill as their final step before returning, so the user sees a closing nudge that matches what Claude Code users see via the Stop hook. Adoption is incremental — each orchestrator can wire the tail-call independently; the skill exists as a stable, callable surface today.

## Invocation Contract

- **Input**: none. Operates on `.design/STATE.md` and `.design/telemetry/events.jsonl` in the current working directory.
- **Output**: at most one printed line — the nudge — or silent return.
- **Latency budget**: ≤10ms typical (matches D-10). Read **only** STATE.md and the tail of events.jsonl; never load the full event stream.
- **Idempotence**: if the most recent event line is already a `turn_end` for the current `(stage, task_progress)` tuple, skip the append but still print the nudge.
- **Non-blocking**: any I/O failure → silent return. This skill must never gate the user.

## Algorithm

Execute these steps **in order** and stop at the first early-return.

### Step 1 — Try to read STATE.md

Read `.design/STATE.md`. If the file is missing or unreadable: **return silently** (no print, no append). Mirrors the JS hook's "missing STATE.md" branch.

### Step 2 — Parse the `<position>` block

Lightweight-parse only the `<position>…</position>` block (the rest of STATE.md is irrelevant here). Extract `stage`, `status`, `task_progress`. A regex pass (`/<position>([\s\S]*?)<\/position>/` then per-line `key: value`) is sufficient — do **not** invoke the full STATE parser (cost overhead).

If `status != "in_progress"`: **return silently**. The pipeline is either initialized, completed, or blocked — no turn-end gap to close.

### Step 3 — Tail the last event line

Read **only the last 8 KiB** of `.design/telemetry/events.jsonl` (a single event line is ≪64 KiB). Treat all of these as "stale by definition":
- The file is missing.
- The file is empty.
- The last line fails to parse as JSON.
- The last line's `timestamp` is missing or unparseable.

Otherwise compute `now - last_event.timestamp`. If the gap is **<60 seconds**, the user is actively mid-turn — **return silently** (the next real event will close the gap naturally).

A reasonable Bash one-liner for the tail when running this skill in a runtime that lacks a Read-tail primitive: `tail -n 1 .design/telemetry/events.jsonl 2>/dev/null`.

### Step 4 — Idempotence check, then append

If the last event is already shaped `{type: "turn_end", stage: <same>, payload: {task_progress: <same>}}` for the **exact** `(stage, task_progress)` tuple from Step 2: **skip the append** but proceed to Step 5.

Otherwise append a single JSONL line to `.design/telemetry/events.jsonl`:

```json
{"type":"turn_end","timestamp":"<ISO 8601 now>","sessionId":"<session-id-or-'turn-closeout'>","stage":"<stage>","payload":{"task_progress":"<N/M>"},"_meta":{"source":"gdd-turn-closeout-skill"}}
```

Create `.design/telemetry/` if missing. The append must be a single `appendFile`-equivalent call (the writer assumes append-atomicity per Plan 20-06).

### Step 5 — Print the nudge

Match `task_progress` against `^(\d+)/(\d+)$`:

- **Numerator equals denominator and denominator > 0** (e.g. `5/5`, stage-complete):

  > Stage `<stage>` complete — run `/gdd:next` or `/gdd:reflect`

- **Otherwise** (mid-task, e.g. `3/7`, `0/0`, malformed):

  > Stage `<stage>` paused mid-task — resume with `/gdd:resume`

Print exactly one of these two lines. No additional commentary, no explanations of what the skill did — the nudge is the user-facing surface.

## Failure Modes

Every step above has an explicit silent-return on failure. The skill must remain non-blocking under all conditions:

| Condition | Behavior |
|-----------|----------|
| `.design/STATE.md` missing or unreadable | Silent return |
| `<position>` block absent or malformed | Silent return |
| `status != "in_progress"` | Silent return |
| `.design/telemetry/events.jsonl` missing | Treat as stale → fall through to append + nudge |
| Last event line unparseable | Treat as stale → fall through |
| Last event timestamp <60s old | Silent return |
| Append fails (permission, disk full) | Print the nudge anyway; do not surface the I/O error |
| Any uncaught throw at any step | Silent return |

## Equivalence with the JS hook

This skill and `hooks/gdd-turn-closeout.js` MUST stay code-level equivalent. Specifically:

- Same four early-return branches (no STATE / not in_progress / fresh event / no-op).
- Same staleness threshold: **60 seconds**.
- Same idempotence guard: `(type=turn_end, stage, payload.task_progress)` triple.
- Same emitted event shape (only `_meta.source` differs: `gdd-turn-closeout` vs `gdd-turn-closeout-skill`, so reflector telemetry can distinguish hook-driven vs skill-driven turn-ends).
- Same nudge wording for both `N/N` and mid-task cases.

If you change one, change the other in the same plan. Plan 25-09's `tests/turn-closeout-hook.test.cjs` covers the JS hook; the parallel coverage for this skill rides on Plan 25-09's Phase 25 baseline.

## Non-Goals

- **Not a state writer.** This skill never edits STATE.md. The events.jsonl append is the only side effect.
- **Not a stage transition.** A `turn_end` event is a within-stage observation, not a state-machine move; downstream tools that gate on stage transitions ignore it.
- **Not a Stop-event harness.** Cross-runtime Stop-event support at the harness level is explicit out-of-scope for Phase 25 (see CONTEXT.md OOS section).

## Integration Point

The canonical tail-call sites (per D-11) are `/gdd:next`, `/gdd:design`, `/gdd:verify`. Each orchestrator's final step, immediately before returning to the user, should be:

> Invoke skill `gdd-turn-closeout`.

Tail-call wiring is intentionally not part of v1.25 (Plan 25-04 ships only the callable surface). Each orchestrator can adopt the wiring independently in a follow-up.
