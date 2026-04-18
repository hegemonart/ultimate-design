# Get Design Done

Agent-orchestrated design pipeline for Claude Code. One entry point that routes design work through a 5-stage workflow — **Scan → Discover → Plan → Design → Verify** — using 14 specialized agents, Figma + Refero MCP connections, and 3 standalone audit commands.

## Install

### 1. Add the marketplace

```bash
claude plugin marketplace add hegemonart/get-design-done
```

### 2. Install the plugin

```bash
claude plugin install get-design-done@get-design-done
```

This installs the pipeline skill and triggers the bootstrap hook, which provisions the companion library `~/.claude/libs/awesome-design-md` on first run.

## Usage

Run in any project directory:

```
@get-design-done scan          — Map existing design system → DESIGN.md + debt roadmap
@get-design-done discover      — Discovery interview + baseline audit → DESIGN-CONTEXT.md
@get-design-done plan          — Decompose into tasks → DESIGN-PLAN.md
@get-design-done design        — Execute tasks → DESIGN-SUMMARY.md
@get-design-done verify        — Score + audit → DESIGN-VERIFICATION.md
```

Invoke without arguments for pipeline status and auto-routing to the next stage.

### Standalone commands (work without running the pipeline first)

```
@get-design-done style Button  — Generate component handoff doc → .design/DESIGN-STYLE-Button.md
@get-design-done darkmode      — Audit dark mode architecture + contrast → .design/DARKMODE-AUDIT.md
@get-design-done compare       — Delta between baseline and verification result → .design/COMPARE-REPORT.md
```

## Commands

All commands are invoked as `/gdd:<name>`.

**Pipeline stages**: `brief`, `explore`, `plan`, `design`, `verify`, `audit`

**Lifecycle**: `new-project`, `new-cycle`, `complete-cycle`

**Ergonomics**: `progress`, `health`, `todo`, `stats`, `next`, `help`

**Capture**: `note`, `plant-seed`, `add-backlog`, `review-backlog`

**Exploration**: `sketch`, `sketch-wrap-up`, `spike`, `spike-wrap-up`, `map`

**Execution**: `do`, `fast`, `quick`, `ship`, `undo`, `pr-branch`, `debug`

**Session**: `pause`, `resume`, `list-assumptions`, `discuss`

**Standalone**: `style`, `darkmode`, `compare`

**Settings**: `settings`, `update`, `reapply-patches`

See the root `SKILL.md` for one-line descriptions of each command.

## Pipeline overview

Each stage is orchestrated by a thin skill that spawns specialized agents:

| Stage | Agents spawned | Output |
|-------|----------------|--------|
| scan | — (direct analysis) | DESIGN.md, DESIGN-DEBT.md |
| discover | design-context-builder, design-context-checker | DESIGN-CONTEXT.md |
| plan | design-phase-researcher, design-planner, design-plan-checker | DESIGN-PLAN.md |
| design | design-executor (per task) | DESIGN-SUMMARY.md |
| verify | design-verifier, design-auditor, design-integration-checker, design-fixer | DESIGN-VERIFICATION.md |

All pipeline artifacts are written to `.design/` inside your project.

## Connections (optional)

The pipeline integrates with seven external tools and MCPs. All connections are optional — the pipeline degrades gracefully when any connection is unavailable.

| Connection | Type | Purpose |
|-----------|------|---------|
| Figma Desktop | MCP (`mcp__figma-desktop__*`) | Token extraction, design context pre-population |
| Figma Writer | MCP (`mcp__figma__use_figma`) | Write decisions back to Figma (annotate, tokenize, Code Connect) |
| Refero | MCP (`mcp__refero__*`) | Reference design search during discovery |
| Preview (Playwright) | MCP (`mcp__Claude_Preview__*`) | Live page screenshots for visual verification |
| Storybook | HTTP (`localhost:6006`) | Component inventory, a11y per story, story stubs |
| Chromatic | CLI (`npx chromatic`) | Visual regression delta narration and change-risk scoping |
| Graphify | CLI (`graphify`) | Knowledge graph: component↔token↔decision relationships |

See [`connections/connections.md`](./connections/connections.md) for the full index, capability matrix, and probe patterns.

### Figma MCP

When the official Figma Desktop MCP is active, `scan` reads Figma variables and `discover` pre-populates design decisions from your Figma file. Falls back to code-only analysis when not available. See [`connections/figma.md`](./connections/figma.md) for setup.

### Refero MCP

When Refero is active, `discover` pulls visual references to ground design decisions. Requires an API token:

```json
{
  "mcpServers": {
    "refero": {
      "type": "http",
      "url": "https://mcp.refero.design/mcp",
      "headers": { "Authorization": "Bearer YOUR_REFERO_TOKEN" }
    }
  }
}
```

Falls back to `~/.claude/libs/awesome-design-md/` when unavailable. See [`connections/refero.md`](./connections/refero.md) for setup.

## Bootstrap hook

On `SessionStart`, the plugin provisions the companion library if missing:

| Resource | Location | Source |
|----------|----------|--------|
| awesome-design-md | `~/.claude/libs/awesome-design-md/` | [`VoltAgent/awesome-design-md`](https://github.com/VoltAgent/awesome-design-md) |

Idempotent — skips work if already present, runs `git pull --ff-only` on subsequent sessions.

## Self-Improvement

After each design cycle, `get-design-done` reflects on what happened and proposes concrete improvements — no vague retros, no auto-applied changes.

### How it works
1. Run `/gdd:audit` at cycle end → automatically triggers `design-reflector`
2. Or run `/gdd:reflect` on demand at any time
3. Reflector reads `.design/learnings/`, telemetry, and agent-metrics to produce `.design/reflections/<cycle-slug>.md`
4. Review proposals with `/gdd:apply-reflections` — diff, accept, skip, or edit each one

### What gets proposed
- **Frontmatter updates** — agent duration estimates and tier assignments from measured data
- **Reference additions** — anti-patterns and heuristics that appeared ≥3 cycles
- **Budget adjustments** — cost caps tuned from actual spend patterns
- **Question pruning** — discussant questions that consistently get low-value answers
- **Global skill promotion** — project findings promoted to `~/.claude/gdd/global-skills/` for cross-project use

### Nothing auto-applies
Every proposal requires explicit user review via `/gdd:apply-reflections`. The discipline mirrors figma-writer's proposal→confirm pattern — the plugin proposes, you decide.

### Global skills
Cross-project conventions live in `~/.claude/gdd/global-skills/`. Once you accept a `[GLOBAL-SKILL]` proposal, that convention auto-loads in every future gdd session across all projects.

## Distribution

**Ships with the plugin:**
- `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` — manifest
- `SKILL.md` — root pipeline router
- `skills/` — stage skills (scan, discover, plan, design, verify, style, darkmode, compare)
- `agents/` — 14 specialized agent specs
- `connections/` — Figma + Refero connection specs
- `reference/` — curated design reference material
- `hooks/`, `scripts/bootstrap.sh`

**Dev-only (gitignored, not distributed):**
- `.planning/` — GSD planning artifacts
- `.claude/memory/` — session-level memory
- `.claude/settings.local.json`

## Develop locally

```bash
claude --plugin-dir ./get-design-done
/reload-plugins
claude plugin validate .
```

## Uninstall

```bash
claude plugin uninstall get-design-done@get-design-done
```

## License

MIT.
