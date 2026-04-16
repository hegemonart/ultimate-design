# Sub-Skills Map — What Each Skill Brings

Detailed reference for routing. Use this when picking which skill to invoke.

## Group A — Build & Craft (impeccable family)

| Skill | Unique contribution | When to invoke |
|---|---|---|
| `impeccable` | Full shape→build flow. 7 domain refs (typography, color, spatial, motion, interaction, responsive, ux-writing). Context gathering protocol. BAN list (border-left on cards, gradient text). Bold direction mandate. Three modes: `craft` / `teach` / `extract`. | Most building tasks. Starts every project. |
| `impeccable-shape` | Structured UX discovery interview → design brief, before any code. | New feature planning. |
| `impeccable-audit` | Tech quality scoring across a11y/perf/theming/responsive with P0–P3 severity. | Quality gate before shipping. |
| `impeccable-critique` | UX critique: hierarchy, cognitive load, emotional resonance, personas. Scored output. | "What's wrong with this design?" |
| `impeccable-polish` | Alignment, spacing, consistency, micro-details. Final shipping pass. | Pre-ship. |
| `impeccable-typeset` | Fonts, hierarchy, sizing, weight, readability. | "Typography feels off." |
| `impeccable-layout` | Layout, spacing, visual rhythm. Fixes monotonous grids. | "Layout feels boring / flat." |
| `impeccable-colorize` | Add strategic color where it's too monochromatic. | "Feels dull." |
| `impeccable-animate` | Purposeful motion, micro-interactions. Pair with emil for review. | "Feels static." |
| `impeccable-bolder` | Amplify too-safe designs. | "Too conservative." |
| `impeccable-quieter` | Tone down overstimulating designs. | "Too loud / chaotic." |
| `impeccable-delight` | Add moments of joy. | "Make it memorable." |
| `impeccable-distill` | Strip to essence. | "Simplify / declutter." |
| `impeccable-clarify` | Improve unclear microcopy. | "Confusing text." |
| `impeccable-optimize` | UI performance: loading, rendering, images, bundle. | "Slow / janky." |
| `impeccable-harden` | Error states, empty states, onboarding, i18n, edge cases. | "Production-ready." |
| `impeccable-adapt` | Cross-device responsiveness. | "Breaks on mobile." |
| `impeccable-overdrive` | Push past conventional limits: shaders, spring physics, scroll reveals. | "Make it exceptional." |

## Group B — Animation & Interaction Craft

| Skill | Unique contribution |
|---|---|
| `emil-design-eng` | The 4-question animation decision framework. Custom easing curves. "Never scale(0)." `@starting-style`. `clip-path` techniques. Sonner principles. Framer Motion GPU gotcha. Mandatory Before/After review-table format. |

**Pair pattern:** `impeccable-animate` for choosing WHERE to add motion → `emil-design-eng` for HOW to execute each specific animation.

## Group C — Anthropic Design Skills

| Skill | Unique contribution |
|---|---|
| `anthropic-skills:ui-designer` | Component lookup table (10 components × visual rules). 7 core dimensions. Density targets (cozy/default/compact/dense). Visual QA checklist. 13 specific anti-patterns. Code-review protocol for UI (count font-size pairs, flag magic numbers off-grid). |
| `anthropic-skills:ux-designer` | Mode table (Design/Audit/Decision/Diagnosis/Reference/Flow). "Why Before What" mandate. Heuristics as active tools (Nielsen, Fitts, Hick, Gestalt). Platform-first decisions (iOS/Android/Web). IA 5-step process. Flow mapping. AI UI patterns. Trade-off format. |
| `anthropic-skills:design-systems` | Three-layer token model. Naming pattern `[category].[variant].[property].[state]`. System-vs-Local-vs-Pattern decision tree. Variant-vs-new-component rule. Component anatomy standard. Figma→Agent spec-frame pattern. 30-min audit checklist. Three failure modes. |
| `anthropic-skills:design-storytelling` | 6-step narrative spine for design presentations. Room-control patterns. Apple/YC principles. Design→business translation table. Talking-points format. Presentation format table. |
| `anthropic-skills:copywriter` | Four modes. Voice reference table by product category. UX rules (verb-first, error = [what]+[fix], empty state formula). Hero formula. Marketing anti-patterns. Linear task title formula. Tone calibration process. Always provides copy, not advice. |
| `anthropic-skills:theme-factory` | 10 preset themes (Ocean Depths, Sunset Boulevard, Forest Canopy, Modern Minimalist, Golden Hour, Arctic Frost, Desert Rose, Tech Innovation, Botanical Garden, Midnight Galaxy). For slides/docs/artifacts. |
| `anthropic-skills:interactive-prototype` | Build prototypes in Flutter / Next.js / React+Tailwind / Vite / Swift / React Native. |
| `anthropic-skills:canvas-design` | Poster/art/static visual pieces (png/pdf). Design philosophy-driven. |
| `anthropic-skills:web-artifacts-builder` | Complex Claude.ai HTML artifacts with React+Tailwind+shadcn. |
| `anthropic-skills:brand-guidelines` | Applies Anthropic's official brand (for internal artifacts). |

## Group D — Design Plugin Skills (design:*)

| Skill | Unique contribution |
|---|---|
| `design:design-critique` | Structured feedback on usability/hierarchy/consistency. |
| `design:accessibility-review` | WCAG 2.1 AA audit. |
| `design:design-handoff` | Developer handoff spec sheet: layout, tokens, props, states, interaction. |
| `design:ux-copy` | Microcopy review/rewrite. |
| `design:user-research` | Interview guides, usability tests, survey design. |
| `design:research-synthesis` | Themes/insights from interviews/surveys/tickets. |
| `design:design-system` | Audit, document, extend your design system. |

## Group E — UI/UX Pro Max

| Skill | Unique contribution |
|---|---|
| `ui-ux-pro-max:ui-ux-pro-max` | 99 UX guidelines across 10 priority tiers. 161 color palettes, 57 font pairings, 50+ styles, 161 product types with reasoning. 25 chart types across 10 stacks. CLI search (`python3 scripts/search.py`). Persistence pattern (`design-system/MASTER.md` + page overrides). |

## Group F — Product Management (design-adjacent)

| Skill | Use when |
|---|---|
| `product-management:product-brainstorming` | Idea exploration before design. |
| `product-management:synthesize-research` | Raw interview/ticket data → insights. |
| `product-management:write-spec` | Vague idea → PRD. Often a Phase 2 output. |
| `superpowers:brainstorming` | Creative exploration before any design work (Phase 0). |

## Group G — Brand Voice

| Skill | Use when |
|---|---|
| `brand-voice:discover-brand` | Find brand materials across connected platforms. |
| `brand-voice:generate-guidelines` | Build a brand voice guide from sources. |
| `brand-voice:enforce-voice` | Apply brand guidelines to content. |

## Sequencing Patterns

### Pattern 1 — New Feature from Scratch
```
superpowers:brainstorming                   # explore
  → impeccable (teach)                      # write .impeccable.md
    → impeccable-shape                      # UX brief
      → refero search                       # references
        → impeccable (craft)                # build
          → anthropic-skills:copywriter     # real copy
            → emil-design-eng              # animation details
              → impeccable-audit           # quality gate
                → impeccable-polish         # final pass
                  → design:design-handoff   # cross-team handoff
                    → anthropic-skills:design-storytelling  # present
```

### Pattern 2 — Fixing an Existing UI
```
impeccable-audit                            # what's broken (tech)
  + design:design-critique                  # what's broken (UX)
  + design:accessibility-review             # what's broken (a11y)
→ merge findings, priority-rank via reference/priority-matrix.md
→ apply fixes with specific impeccable-* commands
→ impeccable-polish                         # finalize
```

### Pattern 3 — Design System Work
```
anthropic-skills:design-systems             # architecture & tokens
  + design:design-system                    # audit existing
  + ui-ux-pro-max:ui-ux-pro-max            # pattern recommendations
→ impeccable extract (mode)                  # pull components in
→ design:design-handoff                     # document for engineering
```

### Pattern 4 — Copy-Only Task
```
refero search for brand-voice references
→ anthropic-skills:copywriter                # primary
  → impeccable-clarify                       # additional polish if needed
```

### Pattern 5 — Presentation
```
(assume design work is done)
→ anthropic-skills:design-storytelling       # narrative spine
  → anthropic-skills:pptx                    # if .pptx required
  → anthropic-skills:theme-factory           # theme preset
```

## How to invoke

Always via the Skill tool:
```
Skill("impeccable", "craft my landing page")
Skill("emil-design-eng", "review this drawer animation")
Skill("anthropic-skills:ui-designer", "what density should this admin panel use")
```

Pass the Phase 1 reference pack + Phase 2 context forward — don't make the sub-skill re-discover.
