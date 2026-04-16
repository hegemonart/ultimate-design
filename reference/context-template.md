# `.impeccable.md` Context Template

Write this to project root at the end of Phase 2. All design skills read it on load to avoid re-asking.

## Template

```markdown
# Design Context

## Product
- **Name:** [product name]
- **One-line description:** [what it does, who it's for]
- **Stage:** [pre-launch / MVP / scaling / mature]

## Audience
- **Primary user:** [role, context of use, frequency]
- **Device split:** [e.g. 70% mobile iOS, 25% web, 5% Android]
- **Technical literacy:** [novice / average / expert]
- **Emotional state when using:** [calm / stressed / excited / time-pressured]

## Jobs To Be Done
1. [JTBD — verb + outcome, not feature]
2. ...
3. ...

## Brand Personality
Three concrete words (NOT "modern" / "elegant" / "professional"):
- [word 1]
- [word 2]
- [word 3]

One North-Star reference product (name + one-line why):
- [product] — [why it captures what we want]

Three things our brand is NOT:
- Not [anti-archetype 1]
- Not [anti-archetype 2]
- Not [anti-archetype 3]

## Design Direction

### Tone
One extreme descriptor: [brutalist / editorial / playful / industrial / luxury / retro-futuristic / art deco / Swiss minimal / maximalist / hand-crafted]

### Typography
- **Display:** [family, weights, source] — chosen because [concrete reason tied to brand words]
- **Body:** [family, weights, source] — chosen because [concrete reason]
- **Mono (if any):** [family]

### Palette
Use OKLCH. Include tinted neutrals (0.005–0.015 chroma toward brand hue).

- **Primary:** [oklch(...) / hex], 5 shades
- **Neutrals:** 9–11 scale, tinted toward [warm / cool / pure]
- **Semantic:** success / warning / danger / info (2–3 shades each)
- **Surface:** 3 elevations (base, elevated, overlay)
- **Dark mode:** never pure black; use oklch 12–18% for bg

### Spatial Scale
4pt base: 4/8/12/16/24/32/48/64/96 (semantic tokens: xs/sm/md/lg/xl/2xl/3xl)

### Motion Philosophy
- **Duration range:** e.g. 150–300ms for UI, up to 500ms for layout changes
- **Primary easing:** [custom cubic-bezier]
- **Animation frequency:** [restrained / moderate / generous]
- **What NEVER animates:** [list any 100+/day actions]

## Technical Constraints
- **Framework:** [React / Vue / Svelte / SwiftUI / ...]
- **Component library:** [shadcn/ui / Radix / custom / none]
- **Design tokens:** [CSS vars / Style Dictionary / Tailwind / ...]
- **Accessibility target:** WCAG 2.1 AA (always default)
- **Performance budget:** [FCP, LCP, TBT targets if any]
- **Browser/device support:** [list]

## References (Phase 1 pack)
Links from refero + awesome-design-md:
1. [URL / brand name] — [what we take from it]
2. [URL / brand name] — [what we take from it]
3. ...

## Forbidden List (project-specific)
- [Add absolute bans here — e.g., "never use the brand purple at saturation > 70%"]
- [e.g., "never use bouncing or elastic easing — we're a fintech"]

## Last Updated
[date] — by [session / user]
```

## How to fill it in

1. **Don't guess.** If a field is unknown, leave `[TBD]` and ask the user before Phase 3.
2. **Use the words the user used.** "Warm" ≠ "friendly" ≠ "approachable" — each has different design implications.
3. **Make the forbidden list specific.** Generic "avoid AI-slop" is useless. "Never the Inter font family because our last brand exploration rejected it" is actionable.
4. **Reference the reference pack.** The URLs aren't nice-to-have — they're the source of truth for "does this match our direction."

## When to update

- When a Phase 2 Define session produces new decisions
- When `Skill(impeccable)` teach mode finishes
- When the user says "actually, we want it to feel more like X" — update direction + North Star
- After a critique reveals the direction was wrong

## Relationship with DESIGN.md

`.impeccable.md` = **internal thinking document** (strategy, voice, JTBD, constraints, forbidden list)
`DESIGN.md` = **AI-readable system spec** (tokens, components, layout rules — per VoltAgent pattern)

Both live at project root. Both persist across sessions. See `design-md-template.md`.
