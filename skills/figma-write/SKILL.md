---
name: get-design-done:figma-write
description: Write design decisions from DESIGN-CONTEXT.md back into the active Figma file. Three modes: annotate (layer comments), tokenize (variable bindings), mappings (Code Connect). Operates in proposal→confirm mode. Pass --dry-run to preview without writing.
---

# get-design-done:figma-write

Dispatches the `design-figma-writer` agent to write design decisions back to the open Figma file.

## Usage

```
/get-design-done figma-write <mode> [--dry-run] [--confirm-shared]
```

Modes:
- `annotate` — add design decision comments to Figma layers
- `tokenize` — bind hard-coded color/spacing/type values to Figma variables
- `mappings` — write Code Connect component↔code file mappings

Flags:
- `--dry-run` — emit the proposal without executing any Figma writes
- `--confirm-shared` — authorize writes to shared team library components

## Prerequisites

1. Remote Figma MCP registered (writes are remote-only). Preferred: `claude plugin install figma@claude-plugins-official`. Manual: `claude mcp add --transport http figma https://mcp.figma.com/mcp`.
2. `.design/DESIGN-CONTEXT.md` exists (run `discover` first)
3. `.design/STATE.md` `<connections>` shows `figma: available (…, writes=true)`. If `writes=false` (desktop-only variant), writes are not supported — the agent will STOP with an instruction to install the remote MCP.

## Required Reading

Read `.design/STATE.md` and `.design/DESIGN-CONTEXT.md` before dispatching the agent.

## Dispatch

<agent>design-figma-writer</agent>

Pass through all flags and arguments from the invocation to the agent.
