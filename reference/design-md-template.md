# `DESIGN.md` Template

Based on [Google Stitch's DESIGN.md](https://stitch.withgoogle.com/docs/design-md/overview/) concept and the [VoltAgent awesome-design-md](https://github.com/VoltAgent/awesome-design-md) pattern. This is the **AI-readable design system document** — a plain-markdown spec any AI agent reads to generate UI consistent with your brand.

## Split of concerns

| File | Who reads it | What it defines |
|------|-------------|-----------------|
| `AGENTS.md` | Coding agents | How to build the project (frameworks, conventions) |
| `DESIGN.md` | Design agents | How the project should look and feel |
| `.impeccable.md` | Design skills | Context, audience, brand personality, direction |

All three live at project root. Don't merge them.

## Library of real examples

`~/.claude/libs/awesome-design-md/design-md/` contains 68 brand archetypes:

- **AI/LLM:** claude, cohere, elevenlabs, minimax, mistral.ai, ollama, opencode.ai, replicate, runwayml, together.ai, voltagent, x.ai
- **Dev tools:** cursor, expo, lovable, raycast, superhuman, vercel, warp
- **Consumer:** airbnb, pinterest, revolut, spotify, stripe, uber
- **Enterprise:** airtable, coinbase, hashicorp, intercom, linear.app, notion, sentry, supabase
- **Physical goods:** apple, bmw, ferrari, lamborghini, nvidia, renault, spacex, tesla
- **Tools:** cal, clay, clickhouse, composio, figma, framer, ibm, kraken, miro, mongodb, posthog, sanity, resend, webflow, wise, zapier

Each folder has a README.md pointing to the hosted DESIGN.md at getdesign.md. **When starting a project, find the 1–2 closest matches and copy-adapt their DESIGN.md.**

## Template (project root `DESIGN.md`)

```markdown
# [Product Name] — Design System

One-line product description and North Star brand.

## Brand Voice

Three concrete words: [word1] · [word2] · [word3]
Tone direction: [extreme descriptor]
Reference products: [Linear + Stripe + Claude] (combine patterns)

## Color System

Use OKLCH throughout. Tinted neutrals (chroma ~0.01 toward brand hue).

### Primitives
- `--brand-50` — oklch(97% 0.03 [hue])
- `--brand-100` — oklch(93% 0.06 [hue])
- ...through --brand-900

### Semantic (mode-aware)
- `--color-bg-base` — light: oklch(98% 0 0); dark: oklch(14% 0.01 [hue])
- `--color-bg-elevated` — light: oklch(100% 0 0); dark: oklch(18% 0.01 [hue])
- `--color-fg-primary` — 7:1 on bg-base (AAA)
- `--color-fg-secondary` — 4.5:1 on bg-base (AA)
- `--color-border-subtle` — 1.5–2:1 on bg-base
- `--color-action-primary` / -hover / -active
- `--color-danger` / -bg / -fg
- `--color-success` / -bg / -fg

### Dark mode
Never pure black. Layer surfaces by lightness, not shadow. Reduce body weight 350 vs 400.

## Typography

### Families
- **Display:** [Family] — [why]
- **Body:** [Family] — [why]
- **Mono:** [Family] (if used)

Load with subsetting and font-display: swap. Use size-adjust for layout-stable fallbacks.

### Scale (fixed rem for app, clamp() for marketing)
- xs  .75rem / 1rem       | captions
- sm  .875rem / 1.25rem   | secondary UI
- base 1rem / 1.5rem       | body
- lg  1.125rem / 1.5rem   | small headings
- xl  1.25rem / 1.75rem   | medium headings
- 2xl 1.5rem / 2rem       | section headings
- 3xl 2rem / 2.5rem        | page heading
- 4xl 2.5rem / 3rem        | hero
- 5xl 3.5rem / 4rem        | marketing hero

Measure cap: 65–75ch body.
Line-height: +0.05 on light-on-dark.

## Spacing

4pt base. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96.
Semantic: xs=4, sm=8, md=16, lg=24, xl=32, 2xl=48, 3xl=64, 4xl=96.
Vertical rhythm = body line-height (24px multiples).

## Radius
- `--radius-sm` 4px (inputs, chips)
- `--radius-md` 8px (buttons, small cards)
- `--radius-lg` 12px (cards, modals)
- `--radius-xl` 16px (feature surfaces)
- `--radius-full` 9999px (pills, avatars)

## Elevation
Two tiers total:
- `--shadow-1` — cards (0 1px 2px rgba(0,0,0,.06))
- `--shadow-2` — modals, popovers (0 8px 24px rgba(0,0,0,.12))
Dark mode: replace shadow with bg lightness step.

## Motion

### Easing tokens
- `--ease-out-quart` cubic-bezier(0.25, 1, 0.5, 1)       — default UI
- `--ease-out-expo`  cubic-bezier(0.16, 1, 0.3, 1)       — entrances
- `--ease-drawer`    cubic-bezier(0.32, 0.72, 0, 1)      — iOS-like

### Duration tokens
- --dur-instant 100ms
- --dur-fast 150ms  | hover, focus
- --dur-default 200ms | default state change
- --dur-slow 300ms  | layout shift, dropdowns
- --dur-modal 400ms | modal/sheet open
- Exits = 75% of enter duration

### Rules
- Only animate transform & opacity
- Never animate keyboard-initiated actions
- Always respect prefers-reduced-motion
- Use @starting-style for entrance (replaces mount hacks)

## Component Principles

### Buttons
- One primary per section; verb-first label
- `:active { transform: scale(0.97) }`
- Disabled = bg-muted + fg-secondary (don't grey out)
- Loading = spinner + keep label visible

### Cards
- Shadow OR border, never both
- Never nest cards in cards
- Clear anatomy: media → title → meta → action

### Forms
- Labels above, not inside
- Error under field, aria-describedby
- Validate on blur (not keystroke)
- Single column on mobile

### Modals
- Trap focus (use `inert` on siblings)
- ESC to close
- Click outside to close (non-destructive)
- Return focus to trigger
- Use native `<dialog>.showModal()`

### Navigation
- Web: sticky top; command palette on ⌘K
- iOS: NavigationStack; tab bar ≤ 5
- Android: predictive back; Material 3 rules

## Density

Default: 8pt base (comfortable).
Compact: 4pt (pro dashboards).
Dense mobile: 3pt iOS-specific.

## Iconography
- SVG only. Never emoji.
- 20px or 24px grid; 1.5–2px stroke.
- Use outlined family; filled only for active state.

## States Required
Every interactive component must define:
default / hover / focus-visible / active / disabled / loading / error / success

## Anti-Patterns (this project)
- [list project-specific bans here]
- Never Inter / DM Sans / Space Grotesk
- Never purple→blue gradient
- Never card-in-card
- Never pure black dark mode
```

## How it gets used

1. **You write DESIGN.md** at Phase 2 completion
2. **Every design sub-skill reads it** as the source of truth for tokens, fonts, colors, motion
3. **When the user says "make it look like X"** — you update DESIGN.md first, then regenerate against the new spec
4. **Agents reference tokens, not raw values** — always `var(--color-action-primary)`, never `#6B46C1`

## Pitfalls

- **Don't leave placeholder values.** "TBD" in DESIGN.md causes downstream hallucination. Fill every field or delete the section.
- **Don't duplicate `.impeccable.md` content.** DESIGN.md = tokens + rules. `.impeccable.md` = strategy + voice + JTBD.
- **Don't let DESIGN.md rot.** Update it when tokens change. The staleness of Figma-vs-code is the #1 design system failure mode.
