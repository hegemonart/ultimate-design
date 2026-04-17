# Agents — Authoring Contract

This directory contains the specialized agents that pipeline stages spawn to do focused work. Read this file before writing a new agent — it is the complete authoring contract. You do not need to read GSD source code.

## Overview

Pipeline stages are **thin orchestrators**. They read `.design/STATE.md`, decide which work to delegate, spawn one or more agents via the `Task` tool, collect results, and write updated state. The agents do the actual work: extracting design tokens, mapping patterns, writing plans, verifying artifacts.

This separation provides three concrete benefits:

- **Context isolation** — each agent starts fresh with only what it needs, keeping token budgets tight and results deterministic.
- **Reusability** — the same `design-verifier` agent can be called from the `design` stage and the `verify` stage without modification.
- **Testability** — agents can be invoked directly against fixture inputs without running the full pipeline.

Agents live in `agents/` as individual markdown files. Each file contains YAML frontmatter (metadata consumed by the Claude Code `Task` tool) and a prose body (instructions the agent follows when invoked).

---

## Naming Convention

Filenames use kebab-case with the `design-` prefix to scope them within this plugin:

```
agents/design-planner.md
agents/design-verifier.md
agents/design-token-extractor.md
agents/design-pattern-mapper.md
```

The `design-` prefix prevents name collisions with agents from other Claude Code plugins. The remainder of the name describes the agent's role. Use nouns or noun phrases, not verbs: `design-planner`, not `design-plan`.

---

## Frontmatter Schema

Every agent file begins with a YAML frontmatter block. All fields except `model` are required.

| Field | Type | Accepted values | Purpose |
|-------|------|-----------------|---------|
| `name` | kebab-case string | unique within plugin | Identifier passed to the `Task` tool — must match the filename without `.md` |
| `description` | string | free-form | One sentence: what the agent does + when it is spawned |
| `tools` | comma-separated list | `Read`, `Write`, `Edit`, `Bash`, `Grep`, `Glob`, `Task`, `WebFetch`, `TodoWrite`, `mcp__*` | Claude tools the agent may use — list only what is needed |
| `color` | enum | `yellow`, `green`, `blue`, `red` | Terminal display color for the agent's output |
| `model` | enum (optional) | `inherit`, `sonnet`, `haiku` | Omit to use the project's configured profile default. Use `inherit` to bypass the profile and use the highest available model (quality-tier work) |

Example frontmatter block:

```yaml
---
name: design-token-extractor
description: Extracts design tokens (colors, typography, spacing) from scanned source files. Spawned by the scan stage.
tools: Read, Grep, Glob
color: blue
---
```

---

## Required Reading Pattern

When an agent must read specific files before acting, the orchestrating stage embeds a `<required_reading>` block in the prompt it passes to `Task`. The block is part of the **prompt string**, not the agent file.

```markdown
<required_reading>
@.design/STATE.md
@reference/typography.md
</required_reading>
```

**Invariant:** when a `<required_reading>` block is present in the prompt, the agent MUST `Read` every listed file before taking any other action. Paths starting with `@` are repo-relative (or absolute) file paths — pass them directly to the `Read` tool.

Agents do not hard-code their required reading. Required reading is supplied by the stage at call time, so the same agent can be given different context for different invocations.

---

## Completion Markers

Every agent terminates its response with a completion marker — a specific `##` heading that the orchestrating stage checks to confirm the agent finished successfully.

**GSD-style markers (used by research/planning/execution/verification agents):**

| Agent type | Completion marker |
|-----------|-------------------|
| Research agent | `## RESEARCH COMPLETE` |
| Planning agent | `## PLANNING COMPLETE` |
| Execution agent | `## EXECUTION COMPLETE` |
| Verification agent | `## VERIFICATION COMPLETE` |

**Design-pipeline-specific markers (proposed — confirm in Phase 2 when the first stage agent is written):**

| Stage | Proposed marker |
|-------|-----------------|
| scan | `## SCAN COMPLETE` |
| discover | `## DISCOVER COMPLETE` |
| plan | `## PLAN COMPLETE` |
| design | `## DESIGN COMPLETE` |
| verify | `## VERIFY COMPLETE` |

If the agent encounters an error or cannot complete, it still emits the completion marker but appends a failure note and writes a `<blocker>` entry to `.design/STATE.md`. The orchestrator detects failure by inspecting STATE.md, not by the absence of a marker.

---

## How stages invoke agents

Stages spawn agents using the Claude Code `Task` tool:

```
Task("design-planner", prompt_string)
```

The first argument is the agent's `name` field (must match exactly). The second argument is a **fully self-contained prompt string** — no session state, no previous tool call results, nothing from the orchestrator's context passes through automatically. Everything the agent needs must be in the prompt.

This means: if the agent needs to know the current pipeline stage, the target component, or the path to an artifact, the stage must embed that information in the prompt.

---

## What to include in an agent prompt

Use this checklist when writing the prompt string a stage passes to `Task`:

- **Task specification** — what the agent must do, stated as a concrete imperative ("Extract all color tokens from the files listed in STATE.md `<source_roots>` and write them to `.design/DESIGN-TOKENS.md`.")
- **Context block** — paths to relevant artifacts, the current pipeline position, prior stage outputs the agent should be aware of
- **Required reading block** — `<required_reading>` listing files the agent must read before acting
- **Acceptance criteria** — how the orchestrator (and the agent itself) will know the task succeeded; specific, checkable conditions
- **Output format** — structured output required: which file to write, what sections to include, what the completion marker is
- **Constraints** — what the agent must NOT do ("do not modify files outside `.design/`", "do not run shell commands")

---

## Worked Example

### Example agent file — `agents/design-example.md`

```markdown
---
name: design-example
description: Reference agent showing the required structure. Never actually invoked in production.
tools: Read, Write, Grep
color: blue
---

# design-example

This agent demonstrates the authoring contract. Replace the role description and behavior below with real work when building a production agent.

## Task

Read the input artifact specified in the prompt, validate it against the acceptance criteria, produce the output artifact, and emit a completion marker.

## Required Reading

The orchestrating stage supplies a `<required_reading>` block in the prompt. Read every listed file before acting — this is mandatory.

## Output Format

Write results to the path specified in the prompt. Terminate the response with the completion marker the prompt specifies (e.g., `## VERIFY COMPLETE`). If an error occurs, still emit the marker but prepend a brief failure description and write a `<blocker>` entry to `.design/STATE.md`.
```

### Example prompt a stage would pass to this agent

```
Task("design-example", """
<required_reading>
@.design/STATE.md
@reference/STATE-TEMPLATE.md
</required_reading>

Read STATE.md and confirm the <position> section contains valid fields (stage, wave, task_progress).
Write the validation result to .design/example-output.md as a markdown table: field | value | valid.

Acceptance criteria:
- .design/example-output.md exists after this call
- The file contains a table with the three position fields
- Each field has a "valid" or "invalid" status

Output format: markdown table, then a one-line summary, then `## VERIFY COMPLETE`.
Constraints: do not modify any file other than .design/example-output.md.
""")
```

---

*Cross-reference: [Claude Code Task tool documentation](https://docs.anthropic.com/en/docs/claude-code/sub-agents) for deeper detail on agent invocation, tool permissions, and model selection. This README is the authoring contract — the documentation covers the runtime.*
