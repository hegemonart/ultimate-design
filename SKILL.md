---
name: ultimate-design
description: "Master design skill. Orchestrates impeccable, emil-design-eng, anthropic-skills (ui-designer, ux-designer, design-systems, design-storytelling, copywriter, theme-factory, interactive-prototype), design:* (critique, accessibility-review, handoff, ux-copy, research-synthesis, user-research, design-system), and ui-ux-pro-max into one end-to-end workflow: discover references via refero MCP → define context → design with the right sub-skill → deliver → defend. Use this skill whenever any design work starts — new pages/components, visual decisions, audits, critiques, design systems, UX copy, handoffs, presentations, user research — OR when picking which design sub-skill to use is itself the question. Combines the best frameworks and anti-patterns from all design skills in one place."
user-invocable: true
---

# Ultimate Design — Orchestration Skill

**Purpose:** One entry point to the full design toolkit installed on this machine. This skill does three things:

1. **Orchestrates sub-skills** — routes the request to the right installed skill (impeccable, emil-design-eng, anthropic-skills:*, design:*, ui-ux-pro-max) instead of reimplementing their work.
2. **Unifies the workflow** — Discover → Define → Design → Deliver → Defend. One pipeline that every design task flows through.
3. **Grounds work in real references** — always uses `refero` MCP and the `~/.claude/libs/awesome-design-md/` library to pull concrete visual references before designing. No generic "AI slop" defaults.

## The Five-Phase Workflow

Every design task, no matter how small, passes through these phases. Skip a phase only if the sub-skill you're routing to already covers it (e.g. `impeccable-audit` doesn't need "Design").

| Phase | Goal | Required outputs | Primary sub-skills |
|---|---|---|---|
| **1. Discover** | Gather references, prior art, brand signal | 3–7 concrete visual references + 3 brand-voice words | `refero` MCP, awesome-design-md library, Figma MCP |
| **2. Define** | Lock down audience, goals, constraints, tone | Context block (see `reference/context-template.md`) + design direction | `impeccable` (teach), `anthropic-skills:ux-designer`, `superpowers:brainstorming` |
| **3. Design** | Produce the artifact (code, mock, spec, copy, deck) | Working artifact + rationale | domain-specific skill (see routing table below) |
| **4. Deliver** | Ship-ready polish + handoff artifacts | Polish pass + handoff spec (if cross-team) | `impeccable-polish`, `design:design-handoff`, `anthropic-skills:design-systems` |
| **5. Defend** | Present, critique, validate | Critique table or presentation deck | `anthropic-skills:design-storytelling`, `impeccable-critique`, `design:design-critique` |

**Detailed workflow:** see `reference/workflow.md` (mandatory read before running a full design task).

## Routing Map — Which Sub-Skill For Which Ask

When the user's ask falls clearly in one bucket, **invoke the sub-skill directly via the Skill tool** rather than doing the work yourself. This skill's job is orchestration, not duplication.

| User ask | Primary skill | Supplement with |
|---|---|---|
| "Build/create/generate [page, component, landing, dashboard]" | `impeccable` (craft mode) | `refero` references, `anthropic-skills:ui-designer` for component specs |
| "Set up design context for this project" | `impeccable` (teach mode) | writes `.impeccable.md` and `DESIGN.md` |
| "Review/audit/polish this UI" | `impeccable-audit` → `impeccable-polish` | `emil-design-eng` for animation details |
| "UX critique / design review / what do you think of this screen" | `design:design-critique` | `impeccable-critique`, `emil-design-eng` |
| "Check accessibility / a11y / WCAG" | `design:accessibility-review` | priority 1 in `reference/priority-matrix.md` |
| "Design system: tokens, components, audit" | `anthropic-skills:design-systems` | `design:design-system`, `ui-ux-pro-max:ui-ux-pro-max` |
| "Typography / fonts / type hierarchy" | `impeccable-typeset` | `reference/typography.md` shortcuts |
| "Color palette / theme / dark mode" | `impeccable-colorize` | `anthropic-skills:theme-factory` for presets |
| "Animate / motion / transitions / interaction details" | `emil-design-eng` | `impeccable-animate` |
| "UX copy / error messages / empty states / CTAs" | `anthropic-skills:copywriter` | `design:ux-copy`, `impeccable-clarify` |
| "Layout / spacing / responsive" | `impeccable-layout` / `impeccable-adapt` | |
| "Simplify / strip back / declutter" | `impeccable-distill` / `impeccable-quieter` | |
| "Make it bolder / more memorable / delightful" | `impeccable-bolder` / `impeccable-delight` / `impeccable-overdrive` | |
| "Harden for production / edge cases / i18n" | `impeccable-harden` | |
| "Developer handoff / spec sheet" | `design:design-handoff` | `anthropic-skills:design-systems` for tokens |
| "UX design decision / patterns / flows / navigation / heuristics" | `anthropic-skills:ux-designer` | |
| "Visual UI decision / component lookup / density / tokens" | `anthropic-skills:ui-designer` | |
| "Interactive prototype (Flutter, Next, React, Vite, Swift, RN)" | `anthropic-skills:interactive-prototype` | |
| "Artifact / poster / social / canvas art" | `anthropic-skills:canvas-design` | |
| "Slides / deck / presentation" | `anthropic-skills:pptx`, `anthropic-skills:design-storytelling` | `ui-ux-pro-max` slides module |
| "User research plan / interviews / usability test" | `design:user-research` | |
| "Synthesize research / themes from interviews" | `design:research-synthesis` / `product-management:synthesize-research` | |
| "Brainstorm / explore a new feature or idea" | `superpowers:brainstorming` | then return here for Define |

When the ask is ambiguous or spans multiple skills, stay in this skill and run the five-phase workflow.

## When To Invoke THIS Skill Directly

Use the orchestration logic in this SKILL.md (rather than jumping to a sub-skill) when:

- **Starting from scratch** — "build me X" with no brief. You need Discover + Define before designing.
- **Cross-skill task** — e.g. "design the onboarding and write all the copy and hand it to engineering" (needs `impeccable-craft` + `anthropic-skills:copywriter` + `design:design-handoff`).
- **Audit-then-fix pipeline** — audit → critique → fix plan → execute across several sub-skills.
- **"Which skill should I use?"** — routing itself is the question.
- **End-to-end project kickoff** — first time on this codebase; need `.impeccable.md`, tokens, reference pack, style direction all at once.

## Absolute Rules (Apply Everywhere)

Inherited from impeccable + emil + ui-ux-pro-max + anthropic-skills, de-duplicated:

1. **Never design without references.** Before writing a single line of CSS/JSX, pull 3–7 concrete visual references via `refero` MCP (see `reference/refero.md`). Generic output comes from generic inputs.
2. **Context before code.** Required: target audience, use case, brand personality (3 concrete words — not "modern" or "elegant"). If unknown, run `impeccable` in teach mode FIRST. Never infer brand from the codebase — code tells you what was built, not how it should feel.
3. **Bold direction, not safe defaults.** Commit to an extreme tone: brutally minimal, maximalist chaos, retro-futuristic, editorial, luxury, industrial, playful, brutalist, art deco. "Bold maximalism and refined minimalism both work. The key is intentionality, not intensity."
4. **The AI-Slop Test.** Before shipping any artifact, ask: *"If someone said 'AI made this,' would it be believable immediately?"* If yes, redo. Full anti-pattern catalog: `reference/anti-patterns.md`.
5. **Never animate keyboard-initiated or 100+/day actions.** (Emil's rule.) Animation decision order: `reference/motion.md`.
6. **Reviews use `| Before | After | Why |` markdown tables.** Never prose bullets for reviews. (Emil's rule, adopted as default.)
7. **Accessibility is priority 1**, always. 4.5:1 body contrast, 44×44pt touch targets, 3px `:focus-visible` ring, `prefers-reduced-motion`, no color-only meaning. See `reference/priority-matrix.md`.
8. **Persist design decisions.** Write `.impeccable.md` (impeccable context) and `DESIGN.md` (VoltAgent pattern) to the project root after Define. These become the loaded context for every future design session in this repo.

## Phase-Start Commands (Quick Reference)

When a user gives you an ambiguous design request like *"make the homepage better,"* run this sequence:

```
# Phase 1: Discover
→ refero search for references (reference/refero.md)
→ check ~/.claude/libs/awesome-design-md/ for brand archetype match

# Phase 2: Define
→ if no .impeccable.md in project: Skill(impeccable) with "teach"
→ else read .impeccable.md and confirm with user

# Phase 3: Design
→ route to the right sub-skill from the routing table

# Phase 4: Deliver
→ Skill(impeccable-audit) for tech quality
→ Skill(impeccable-polish) for final pass

# Phase 5: Defend
→ if presenting: Skill(anthropic-skills:design-storytelling)
→ if reviewing: emit the Before/After table (reference/review-format.md)
```

## Reference Files (read when relevant)

| File | Read when |
|---|---|
| `reference/workflow.md` | Running a multi-phase design task |
| `reference/refero.md` | Pulling visual references (EVERY design task) |
| `reference/sub-skills.md` | Detailed routing decisions & what each skill brings |
| `reference/priority-matrix.md` | Auditing, reviewing, or ranking issues |
| `reference/anti-patterns.md` | Before shipping anything, or to diagnose "why does this look bad" |
| `reference/context-template.md` | Starting a new project; filling `.impeccable.md` |
| `reference/design-md-template.md` | Authoring `DESIGN.md` for the project |
| `reference/review-format.md` | Writing any design critique or review |
| `reference/checklists.md` | Pre-delivery / pre-ship verification |

## Do Not

- Do not reimplement what a sub-skill already does. Invoke it.
- Do not skip Phase 1 (Discover) — references aren't optional.
- Do not default to Inter / Space Grotesk / purple-blue gradient / glassmorphism / card-in-card / pure black dark mode. See `reference/anti-patterns.md`.
- Do not use emoji as UI icons. SVG only.
- Do not present a design without stating the direction, the trade-off, and the ask (see `anthropic-skills:design-storytelling`).
- Do not skip the `.impeccable.md` + `DESIGN.md` persistence step — the next session will be guessing without them.
