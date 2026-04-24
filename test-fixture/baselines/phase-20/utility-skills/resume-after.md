---
name: gdd-resume
description: "Restore session context from .design/HANDOFF.md and route to where work left off."
argument-hint: ""
tools: Read, Write, Bash, Glob, mcp__gdd_state__get, mcp__gdd_state__set_status, mcp__gdd_state__resolve_blocker, mcp__gdd_state__checkpoint
---

# /gdd:resume

Inverse of `/gdd:pause`. Reads the handoff file, prints a clear "you were here" summary, and routes to the next command.

## Steps

1. Try to read `.design/HANDOFF.md`. If missing, call `mcp__gdd_state__get` and infer position from the `stage` and `cycle` fields.
2. Call `mcp__gdd_state__get` and inspect `status`. If it does **not** start with `paused:`, print "No pause to resume" and exit — the prior session was not paused via `/gdd:pause`, so there is nothing to restore.
3. Parse the prior status from the `paused:<prior>` prefix. Call `mcp__gdd_state__set_status` with `status: <prior>` to restore the pre-pause state.
4. Optionally call `mcp__gdd_state__resolve_blocker` to clear the pause-related blocker (match by text containing "paused"). Skip if no such blocker exists.
5. Call `mcp__gdd_state__checkpoint` to stamp `last_checkpoint` via MCP.
6. Print a summary in this exact shape:
   ```
   Last paused: <timestamp>
   You were: <in-progress description>
   Next step: <next>
   Active sketch: <path or none>
   Open todos: <N>
   ```
7. **Staleness check** — compare mtime of `.design/` artifacts vs `src/` (via Glob + Bash `stat` when available). If `src/` has commits/changes newer than the last pipeline artifact, warn: "Source has changed since last pipeline run — consider re-running explore or verify."
8. **Route recommendation** based on stage:
   - `brief` → "Run `@get-design-done brief`"
   - `explore` → "Run `@get-design-done explore`"
   - `plan` → "Run `@get-design-done plan`"
   - `design` → "Run `@get-design-done design` to continue"
   - `verify` → "Run `@get-design-done verify`"
9. Do not auto-execute the next command — just recommend.

## Do Not

- Do not delete HANDOFF.md (leave it; next `/gdd:pause` overwrites it).
- Do not mutate STATE.md directly — all STATE.md writes go through the `gdd-state` MCP tools above.
- Do not call `mcp__gdd_state__transition_stage` — resume restores prior status without moving the pipeline.

## RESUME COMPLETE
