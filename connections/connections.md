# Connections — Index and Capability Matrix

This directory contains connection specifications for external tools and MCPs that the ultimate-design pipeline integrates with. Each connection has its own spec file. This file is the index.

---

## Active Connections

| Connection | Status | Spec File | Notes |
|-----------|--------|-----------|-------|
| Figma | Planned (Phase 2) | `connections/figma.md` (future) | Uses `mcp__claude_ai_Figma__*` or `mcp__figma__*` |
| Refero | Active | `connections/refero.md` | Uses `mcp__refero__*` tools |

---

## Capability Matrix

Each cell describes what the connection contributes at that pipeline stage, or `—` if it is not used.

| Connection | scan | discover | plan | design | verify |
|-----------|------|----------|------|--------|--------|
| Figma | tokens | decisions | — | — | — |
| Refero | — | references | — | — | — |
| Storybook (future) | — | — | — | — | components |
| Linear (future) | — | — | — | — | tickets |
| GitHub (future) | — | — | commits | — | PRs |

**Column definitions:**

- **scan** — what the connection provides when the scan stage runs (design tokens, source metadata)
- **discover** — what the connection provides during discovery (visual references, design decisions)
- **plan** — what the connection contributes to planning artifacts
- **design** — what the connection provides during design execution
- **verify** — what the connection checks or surfaces during verification

---

## Connection Detection Pattern

At stage entry, each stage probes connection availability and records the result in `.design/STATE.md` under the `<connections>` section:

```
<connections>
  figma: available | unavailable | not_configured
  refero: available | unavailable | not_configured
</connections>
```

**Status values:**

| Status | Meaning |
|--------|---------|
| `available` | MCP tool call returned the expected response |
| `unavailable` | MCP tool is present in the session but errored (auth failure, offline, rate-limited) |
| `not_configured` | MCP tool is not in the session's tool list |

**Probe pattern:** stages invoke connection-specific MCP tools at entry (not a shell check — a tool invocation). The call result determines status. If the call succeeds: `available`. If the tool exists but errors: `unavailable`. If the tool is absent from the tool list: `not_configured`.

**Graceful degradation required:** stages MUST continue when a connection is `unavailable` or `not_configured`. Skip connection-dependent steps. If a missing connection prevents a `must_have` from being satisfied, append a `<blocker>` to `.design/STATE.md` and continue.

---

## Extensibility Guide

To add a new connection to the pipeline:

1. **Create the spec file.** Write `connections/<connection-name>.md` following the structure of `connections/refero.md`: what the tool does, when to use it, available MCP tools, search/invocation strategy, fallbacks, anti-patterns.

2. **Register in this file.** Add a row to the Active Connections table above (status, spec file path, MCP tool prefix).

3. **Update the Capability Matrix.** Add a row for the new connection. Mark the stages it feeds with a short capability noun; use `—` for stages it does not affect.

4. **Declare the MCP.** If the connection uses an MCP server, ensure the server is declared in `.claude-plugin/plugin.json` or documented as a user-supplied MCP in the spec file.

5. **Wire into stage skills (Phase 2+ work).** Update the relevant stage `SKILL.md` files to probe the connection at entry and write its status to `.design/STATE.md <connections>`.

6. **Update relevant agents (Phase 2+ work).** If agents will use the connection's tools, list the MCP tools in the agent's `tools` frontmatter field.

---

## Notes

- `connections/` is infrastructure scaffolding introduced in Phase 1. Stage integration (wiring detection and graceful degradation into each stage) is Phase 2 work.
- Future connections (Storybook, Linear, GitHub) are placeholder rows in the matrix. Actual spec files and stage wiring are added when those phases land.
- The capability matrix columns map to the five pipeline stages: `scan | discover | plan | design | verify`.
