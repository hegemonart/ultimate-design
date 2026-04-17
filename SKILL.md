---
name: ultimate-design
description: "Master design pipeline for Claude Code. Runs a 4-stage workflow: Discover → Plan → Design → Verify. Use when starting any design work, or to check pipeline status and advance to the next stage. Invoke without arguments for automatic routing, or with a stage name to jump directly: discover, plan, design, verify."
argument-hint: "[discover|plan|design|verify|status]"
user-invocable: true
---

# Ultimate Design — Pipeline Router

You are the entry point for a 4-stage design pipeline modeled on GSD:

```
Discover → Plan → Design → Verify
```

Each stage produces artifacts in `.design/` inside the current project. Read the pipeline state and route accordingly.

## Stage Definitions

| Stage | Skill | Reads | Writes |
|---|---|---|---|
| **Discover** | `ultimate-design:discover` | Project files, user answers | `.design/DESIGN-CONTEXT.md` |
| **Plan** | `ultimate-design:plan` | DESIGN-CONTEXT.md | `.design/DESIGN-PLAN.md` |
| **Design** | `ultimate-design:design` | DESIGN-PLAN.md | `.design/DESIGN-SUMMARY.md` |
| **Verify** | `ultimate-design:verify` | DESIGN-SUMMARY.md + DESIGN-CONTEXT.md | `.design/DESIGN-VERIFICATION.md` |

## Routing Logic

When invoked without arguments (or with `status`), check `.design/` and auto-route:

```
1. No .design/ directory → "No design session started. Run /ultimate-design:discover to begin."
2. DESIGN-CONTEXT.md missing → Route to discover
3. DESIGN-CONTEXT.md exists, DESIGN-PLAN.md missing → Route to plan
4. DESIGN-PLAN.md exists, DESIGN-SUMMARY.md missing → Route to design
5. DESIGN-SUMMARY.md exists, DESIGN-VERIFICATION.md missing → Route to verify
6. DESIGN-VERIFICATION.md exists → Show summary + offer to start new session
```

## Status Display

Before routing, show a status block:

```
━━━ Ultimate Design Pipeline ━━━
[✓] Discover   → .design/DESIGN-CONTEXT.md
[✓] Plan       → .design/DESIGN-PLAN.md
[→] Design     ← current stage
[ ] Verify
```

Use `[✓]` for complete, `[→]` for current, `[ ]` for pending, `[!]` for gaps/errors.

## Jump Mode

If `$ARGUMENTS` is one of `discover`, `plan`, `design`, `verify` — invoke the corresponding skill directly via the Skill tool without checking pipeline state first:

```
/ultimate-design discover → Skill("ultimate-design:discover")
/ultimate-design plan     → Skill("ultimate-design:plan")
/ultimate-design design   → Skill("ultimate-design:design")
/ultimate-design verify   → Skill("ultimate-design:verify")
```

## Do Not

- Do not perform any design work yourself — route to the stage skill.
- Do not skip stages unless the user explicitly passes a stage argument.
- Do not create or modify `.design/` files — the stage skills own their artifacts.
