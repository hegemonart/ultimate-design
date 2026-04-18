# Figma Writer — Connection Specification

This file is the connection specification for the figma-writer capability within the get-design-done pipeline. The figma-writer is a proposal→confirm write agent (`design-figma-writer`) that wraps the `mcp__figma__use_figma` remote MCP to write design decisions back to Figma. It is distinct from the Figma Desktop MCP read connection documented in `connections/figma.md`. See `connections/connections.md` for the full connection index and capability matrix.

---

## Setup

**Prerequisites:**

- Figma desktop app installed and running (required for read operations via `mcp__figma-desktop__*`)
- Dev Mode enabled in the Figma desktop app
- Remote Figma MCP registered for write operations

**Register remote MCP (Claude Code):**

```
claude mcp add figma --transport http https://mcp.figma.com/v1/sse
```

After running this command, restart the Claude Code session. The remote MCP server authenticates via OAuth at `mcp.figma.com`. On first use, Claude Code will prompt you to complete the OAuth flow.

**Verification:**

After session restart, run:

```
ToolSearch({ query: "select:mcp__figma__use_figma", max_results: 1 })
```

Expect a non-empty result listing `mcp__figma__use_figma`. If empty, the remote MCP is not registered — run the registration command above and restart.

---

## Tools

All write operations use the `mcp__figma__` prefix (remote MCP). Read operations use the `mcp__figma-desktop__` prefix (desktop MCP).

| Tool | Full name | Returns | Pipeline use |
|------|-----------|---------|--------------|
| `use_figma` | `mcp__figma__use_figma` | operation result | all write operations (annotate, tokenize, mappings) |

**Important distinction:** `mcp__figma-desktop__*` tools are used for reads only (get_metadata, get_variable_defs). `mcp__figma__use_figma` is the remote MCP used exclusively for writes. The desktop MCP does NOT expose `use_figma` — it is remote-only. Do not attempt to call `mcp__figma-desktop__use_figma` — that tool does not exist.

---

## Three Modes

The figma-writer operates in one of three modes per invocation:

| Mode | Description | Source data | Figma target |
|------|-------------|-------------|--------------|
| `annotate` | Write design decision annotations onto Figma layer comments | D-XX decisions from DESIGN-CONTEXT.md | Layer comments on affected frames/components |
| `tokenize` | Replace hard-coded color/spacing/type literals with Figma variable references | Color/spacing/typography values from DESIGN-CONTEXT.md; existing variables from `get_variable_defs` | Variable bindings on layer fill/stroke/spacing properties |
| `mappings` | Write Code Connect mappings linking component instances to code file paths | Component names and file paths from DESIGN-CONTEXT.md | Code Connect entries on Figma component nodes |

All three modes follow the proposal→confirm UX: the agent builds a numbered operation list and presents it to the user before executing any write. The user must confirm before `use_figma` is called.

---

## Which Stages Use This Connection

| Stage | Agent/Skill | Tool used | Purpose |
|-------|-------------|-----------|---------|
| figma-write | `agents/design-figma-writer.md` | `mcp__figma__use_figma` | Write design decisions back to Figma in three modes (annotate/tokenize/mappings) |
| design | `skills/design/SKILL.md` | (dispatch only) | Offer to spawn design-figma-writer after design-executor completes, when figma_writer: available |

---

## Availability Probe (ToolSearch-only)

The figma-writer probe is ToolSearch-only — no live call at probe time. This matches the Refero connection pattern (opt-in tool, no live call needed to confirm availability).

```
ToolSearch({ query: "select:mcp__figma__use_figma", max_results: 1 })
→ Empty result      → figma_writer: not_configured  (skip figma-write entirely; log to STATE.md)
→ Non-empty result  → figma_writer: available
```

Write `figma_writer:` status to `.design/STATE.md` `<connections>` immediately after probing.

Note: The status key is `figma_writer:` (with underscore). This is distinct from `figma:` (desktop MCP status) and `figma_write:` is not used — the canonical key is `figma_writer:`.

---

## Fallback Behavior

When `figma_writer` is `not_configured`, the pipeline degrades gracefully — no error is raised.

**figma-write stage:**
- `figma_writer: not_configured` → skip with note: "Figma write skipped — remote MCP not installed. Register with: claude mcp add figma --transport http https://mcp.figma.com/v1/sse"

**design stage:**
- `figma_writer: not_configured` or absent → skip the figma-write dispatch offer entirely (no prompt, no output)
- `figma_writer: available` → offer opt-in prompt after design-executor completes

**Special case — desktop MCP present but remote absent:**
If `figma: available` (desktop MCP) but `figma_writer: not_configured` (remote MCP absent), the figma-write capability is still not available. Desktop MCP cannot perform writes. Do not offer figma-write dispatch in this state.

---

## STATE.md Integration

The scan stage writes the initial `figma_writer:` status. Subsequent stages read from STATE.md without re-probing.

Example `<connections>` block after probing:

```xml
<connections>
figma: available
figma_writer: available
refero: not_configured
</connections>
```

**Status key:** `figma_writer:` (underscore separator)

**Status values:**

| Value | Meaning |
|-------|---------|
| `available` | ToolSearch returned non-empty for `mcp__figma__use_figma` |
| `not_configured` | ToolSearch returned empty — remote MCP not registered |

Note: There is no `unavailable` state for figma_writer — the ToolSearch-only probe cannot detect auth failures. Auth issues surface at execution time when `use_figma` is first called.

---

## Caveats and Pitfalls

1. **`mcp__figma__use_figma` is the remote MCP only.** It is registered as server `figma` via `claude mcp add`. It is NOT the same as the desktop MCP (`mcp__figma-desktop__*`). Running ToolSearch for `figma-desktop` will NOT find `use_figma`. Always use `select:mcp__figma__use_figma` as the probe query.

2. **All writes require user confirmation.** The proposal→confirm UX in design-figma-writer ensures the user reviews all operations before any write is executed. There is no auto-approve mode.

3. **Use `--dry-run` to inspect the proposal without risk.** Pass `--dry-run` to emit the full operation list without calling `use_figma`. Safe to run on production Figma files.

4. **Use `--confirm-shared` for team library components.** Before any write, the agent detects shared team library components via `get_metadata`. If shared components are in the operation list and `--confirm-shared` was not passed, the agent halts and requires the flag. This prevents accidental modification of team-wide design tokens.

5. **Operations execute sequentially, not atomically.** If one operation fails mid-sequence, the agent logs the error and continues with remaining operations. The Figma file may be left in a partially-updated state. The summary lists all failures for manual follow-up.
