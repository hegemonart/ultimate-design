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

1. Figma desktop app running with Dev Mode enabled
2. Remote Figma MCP registered: `claude mcp add figma --transport http https://mcp.figma.com/v1/sse`
3. `.design/DESIGN-CONTEXT.md` exists (run `discover` first)
4. `figma: available` in `.design/STATE.md` `<connections>` block

## Required Reading

Read `.design/STATE.md` and `.design/DESIGN-CONTEXT.md` before dispatching the agent.

## Dispatch

<agent>design-figma-writer</agent>

Pass through all flags and arguments from the invocation to the agent.
