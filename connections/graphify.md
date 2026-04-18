# Graphify — Connection Specification

This file is the connection specification for Graphify within the get-design-done pipeline. Graphify builds a queryable knowledge graph over the codebase — mapping component↔token↔decision relationships via Tree-sitter static analysis and LLM semantic extraction. See `connections/connections.md` for the full connection index and capability matrix.

---

## Setup

**Prerequisites:**
- Python 3.9+ available on PATH
- GSD framework with `graphify.enabled = true` in `.planning/config.json`

**Install:**
```
pip install graphifyy
graphify install        # installs skill files into ~/.claude/skills/graphify/
```

**Enable in GSD config:**
```
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" config-set graphify.enabled true
```

**Build the graph (initial):**
```
graphify .              # run in project root; produces graphify-out/graph.json
# or via GSD tools:
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" graphify build
```

**Recommended: auto-rebuild after commits:**
```
graphify hook install
```

**Verification:**
After building, run:
```
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" graphify status
```
Expect: `{ enabled: true, graph_path: "...", node_count: N, edge_count: N, stale: false }`

**Note:** Graphify is an optional external dependency. It requires Python and takes 1-5 minutes to build on a large codebase. Do NOT add to plugin bootstrap — users opt in manually.

---

## Graph Schema

### Node Types

| Node type | Source | ID pattern |
|-----------|--------|-----------|
| component | `.stories.tsx` / `src/components/*.tsx` | `component:<name>` |
| token:color | CSS custom properties / Figma variables | `token:color/<name>` |
| token:spacing | CSS custom properties | `token:spacing/<name>` |
| token:typography | CSS custom properties | `token:typography/<name>` |
| token:motion | CSS animation variables | `token:motion/<name>` |
| page/route | `src/app/` or `src/pages/` | `page:<path>` |
| decision | DESIGN-CONTEXT.md D-XX entries | `decision:D-<nn>` |
| must-have | DESIGN-CONTEXT.md M-XX entries | `must-have:M-<nn>` |
| debt-item | DESIGN-DEBT.md entries | `debt:<id>` |
| anti-pattern | DESIGN-CONTEXT.md anti-patterns | `antipattern:<name>` |
| a11y-finding | DESIGN-VERIFICATION.md violations | `a11y:<rule-name>` |
| figma-variable | Figma `get_variable_defs` output | `figma-var:<name>` |

### Edge Types

| Edge | From | To | Meaning |
|------|------|-----|---------|
| `uses` | component | token | Component references this token |
| `renders` | page | component | Page renders this component |
| `violates` | debt-item | decision | Debt item contradicts this decision |
| `derives-from` | a11y-finding | component | A11y finding originates in this component |
| `maps-to` | figma-variable | token | Figma variable corresponds to CSS token |
| `detected-at` | anti-pattern | component | Anti-pattern found in this component |

### graph.json structure

```json
{
  "nodes": [
    { "id": "component:Button", "label": "Button", "type": "component",
      "description": "Primary interactive element", "source": "src/components/Button.tsx" }
  ],
  "edges": [
    { "source": "component:Button", "target": "token:color/primary/500",
      "label": "uses", "confidence": "EXTRACTED", "confidence_score": 0.95 }
  ]
}
```

Edge confidence tiers: EXTRACTED (found in source), INFERRED (semantic inference), AMBIGUOUS (flagged for review).

---

## Which Stages Use This Connection

| Stage | Agent | Usage | Purpose |
|-------|-------|-------|---------|
| plan | `agents/design-planner.md` | Pre-scope token query | Count affected components before scoping a token change task |
| verify | `agents/design-integration-checker.md` | Pre-search D-XX query | Find components and tokens connected to each decision before grep |

Graphify is NOT called during scan, discover, or design. It is a read-only pre-search oracle for planner and verifier agents.

---

## Availability Probe

Unlike MCP connections, Graphify has no ToolSearch check. The probe is file-existence + config-flag based.

**Graphify probe sequence (execute at agent entry, before using graph):**

Step G1 — Config check:
```
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" graphify status
→ Error or { enabled: false }  → graphify: not_configured  (skip all graph steps)
→ { enabled: true }            → proceed to Step G2
```

Step G2 — Graph file check:
```
Check if graphify-out/graph.json exists in project root
→ Absent                       → graphify: unavailable  (graph not built yet)
→ Present                      → graphify: available
```

Write graphify status to `.design/STATE.md` `<connections>`.

**Note:** Agents check `.design/STATE.md` `<connections>` FIRST before running the probe. If a prior stage already wrote `graphify: available`, skip the probe and use the cached status.

---

## Pre-Search Consultation Pattern

This is the canonical pre-search pattern for agents. Copy inline — SKILL.md and agent files have no include mechanism.

**For decision-based queries (design-integration-checker):**

Step 1: Query graph for decision node and its neighbors
```
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" graphify query "decision:D-<nn>" --budget 1500
→ Returns: connected components + tokens as JSON
→ Use returned component IDs as grep seed list (reduces false-negative "not found")
```

Step 2: Grep each returned component for the decision pattern
(then continue to standard grep behavior if graph returned nothing)

**For token-based queries (design-planner):**

Step 1: Query graph for token node and its neighbors
```
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" graphify query "<token-name>" --budget 1500
→ Returns: all components that reference this token
→ Annotate planned task with "N components affected" before scoping
```

Step 2: Include component list in the task description
(then continue standard planning behavior)

**Budget note:** Use `--budget 1500` for pre-search queries. High confidence_score edges (>= 0.8) are more reliable; AMBIGUOUS edges are hints only.

---

## Fallback

| Status | Behavior |
|--------|----------|
| `graphify: available` | Agents query graph before grep; annotate results with graph context |
| `graphify: unavailable` | Agents skip graph steps; log "graphify query skipped — graph not built" in output; fall back to grep |
| `graphify: not_configured` | Same as unavailable; no user-visible error (opt-in feature) |

The graph is a performance optimization and accuracy enhancer. It is never a hard requirement. All agents MUST produce valid output via grep alone.

---

## Anti-Patterns

- **Do NOT use graphify to replace grep.** The graph is a seed list, not a complete index. Always grep after querying the graph.
- **Do NOT embed graph.json contents in agent context.** Query specific nodes via gsd-tools; never read graph.json directly.
- **Do NOT query the graph during scan or design stages.** The graph is read-only and only useful when decisions already exist (plan, verify).
- **Do NOT block on graph build time.** If `graphify build` takes >30 seconds mid-session, log "graphify build deferred — run /gdd:graphify build manually" and continue without graph.
- **Do NOT assume graph covers .design/ artifacts.** Graphify analyzes source code (src/, components/). DESIGN-CONTEXT.md and DESIGN-PLAN.md are not graph nodes unless explicitly indexed.

---

## /gdd:graphify Commands

| Subcommand | GSD tools call | Purpose |
|------------|----------------|---------|
| `build` | `gsd-tools graphify build` | Build or rebuild the knowledge graph |
| `query <term>` | `gsd-tools graphify query "<term>" --budget 2000` | Query the graph for a node and its neighbors |
| `status` | `gsd-tools graphify status` | Check graph age, node count, enabled status |
| `diff` | `gsd-tools graphify diff` | Show topology changes since last build |

If `graphify.enabled = false` in `.planning/config.json`, the skill prompts:
"Graphify is not enabled. Enable with: gsd-tools config-set graphify.enabled true — then run /gdd:graphify build."
