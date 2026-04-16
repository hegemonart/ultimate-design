# Anti-Pattern Catalog — What Makes AI-Generated UI Look Like AI-Generated UI

Merged from impeccable, emil-design-eng, anthropic-skills:ui-designer, anthropic-skills:ux-designer, ui-ux-pro-max. This is the master "don't do this" list.

## The AI-Slop Test

Before shipping any artifact, ask: **"If I told someone 'AI made this,' would they believe me immediately?"** If yes, you haven't escaped the training-set monoculture. Redo.

## Absolute Bans (match-and-refuse)

These are never acceptable — rewrite rather than soften.

1. **`border-left`/`border-right` > 1px** on cards, alerts, callouts. Looks AI-generated regardless of color or variable used. Use different element structure.
2. **Gradient text** (`background-clip: text` + gradient background). Solid color only; emphasis via weight/size.
3. **Emoji as UI icons.** SVG only.
4. **Pure black (`#000`) dark mode.** Use oklch 12–18%.
5. **Disabling zoom** via `user-scalable=no` viewport meta. Accessibility failure.
6. **`outline: none` without replacement.** Breaks keyboard nav.
7. **`scale(0)` animation entry** (Emil). Start `scale(0.95)` + opacity — nothing in the real world appears from nothing.
8. **`transition: all`.** Specify exact properties.
9. **`ease-in` for UI.** Feels sluggish. Use ease-out for entrances.
10. **Animating keyboard-initiated actions** (command palette, shortcuts used 100+/day). No animation at all. Ever.

## Reflex Fonts to Reject

When writing font stacks, if your first instinct is any of these — stop. The training set converged here; pick something else.

**Serif reflex-list:** Fraunces, Newsreader, Lora, Crimson (Pro/Text), Playfair Display, Cormorant (Garamond), Instrument Serif.

**Sans reflex-list:** Inter, DM Sans, Outfit, Plus Jakarta Sans, Space Grotesk, Instrument Sans, Syne.

**Mono reflex-list:** IBM Plex Mono, Space Mono, JetBrains Mono (for display use).

**Process:** write 3 brand-voice words that are concrete (not "modern"), then browse a catalog imagining the font as a physical object (typewriter ribbon, shop sign, coat label, children's book). Pick one that makes sense for that object.

## Visual Anti-Patterns (Interface)

### Color
- Purple → blue gradients on white backgrounds (the AI-default)
- Cyan accents on dark backgrounds
- Rainbow badges (different semantic for every status)
- Gray on colored backgrounds (readability failure, not "subtle")
- Pure gray neutrals (add 0.005–0.015 chroma toward brand hue — "pure gray is dead")
- Red + green as the only meaning carrier (colorblind fail)
- Text over image without scrim
- Alpha-heavy transparency everywhere — usually a sign of an incomplete palette

### Typography
- Body text < 12px
- > 8 font-size/weight combinations on a single page
- Tiny letter-spacing tweaks nobody notices
- `all-caps body text`
- Fluid `clamp()` on dashboard/app UI (only for marketing headings)
- Line-length > 80ch

### Layout
- Card-in-card nesting (if you have one card inside another, remove one)
- Sparkline as decoration (no data, just lines)
- Identical hero-metric templates across every dashboard
- Evenly distributed grids with no focal point
- "Icon with rounded corners above every heading" stock pattern
- Full-width buttons on every CTA
- Forms with placeholder-only labels, no visible label above

### Shadow / Elevation
- Generic drop shadows on rounded rectangles (the AI-default)
- 3+ shadow depths when 2 tiers would be clearer
- Shadow AND border AND background on the same element
- Inner shadow + outer shadow simultaneously

### Imagery / Decoration
- Glassmorphism everywhere (blurred translucent cards on gradient bg)
- 3D isometric illustrations with pastel colors (Figma-community template vibe)
- "Tech mesh" backgrounds with gradients + grain
- Generic stock illustrations instead of custom

## Motion Anti-Patterns (Emil's list + impeccable)

- `transition: all 300ms` → specify the property
- `ease-in` on hover/dropdown → use ease-out
- Bounce / elastic easings (tacky 2015 skeuomorphic residue)
- Same duration entering and exiting (exits should be ~75% of enter)
- Animating `width`/`height` (not GPU-accelerated) instead of `transform`
- No `prefers-reduced-motion` media query anywhere
- Popover with `transform-origin: center` (should originate from trigger)
- Button with no `:active` press feedback
- Toast that re-plays entrance every state change
- 1–2s decorative pulses that keep retriggering

## UX / Interaction Anti-Patterns

### Navigation
- Hamburger menu as PRIMARY navigation on desktop (>1024px)
- FAB (floating action button) on iOS (it's Material Design, not HIG)
- Custom back button that overrides native swipe gesture
- Bottom nav with > 5 items
- Breaking browser back/forward

### Forms
- Validation on every keystroke (except password strength)
- Errors collected only at the top instead of near field
- Overwhelming all fields upfront (no progressive disclosure for long forms)
- Native `<select>` for > 10 options without typeahead
- Multi-column forms on mobile

### Feedback
- Instant (0ms) state transitions — feels broken
- Spinner with no context ("Loading..." — loading *what*?)
- Success toast that blocks the next click
- Destructive action with no undo and no "are you sure"
- Confirm dialog for reversible action (annoyance; use undo instead)

### AI UI
- Magic box with no confidence shown
- Auto-apply with no undo
- Hallucination presented as fact, no indication of uncertainty
- No escape from the AI-path back to manual
- Invisible AI (user doesn't know what's AI and what isn't)

## Copy Anti-Patterns (Copywriter)

### UX Copy
- Placeholder text as the label (disappears on focus; accessibility failure)
- "Click here" / "Read more" / "Learn more" links (verb-first + specific)
- "OK" / "Submit" / "Yes" buttons (verbs describing the outcome, e.g. "Save changes," "Create account," "Delete message")
- Errors that blame the user ("You entered an invalid email")
- "Oops!" / "Uh oh!" / any forced cheer in errors
- Empty state that only says "No items" — missed onboarding moment

### Marketing
- "Simple, powerful, flexible" as a hero headline (the AI-default triplet)
- Three-word headline with no verb or subject
- Feature list as the hero (tell me what I can DO, not what it IS)
- "We're passionate about..." intros
- Superlatives without evidence ("world-class," "best-in-class")
- 3+ adjectives stacked ("beautiful, seamless, intuitive")

## Density / Sizing Anti-Patterns

- Dev gray `#888` for "secondary text" (fails 4.5:1 against white)
- Touch target < 44×44pt iOS or 48×48dp Android (primary button or close button especially)
- Line height 1.0–1.2 on body (too tight)
- Container width `1200px` fixed (breaks fluid designs at 1300+ monitors)
- Padding like `13px` (off-grid; use 12 or 16)

## Quick "Does This Have AI-Slop" Self-Check

Before submitting:
- [ ] Did I default to Inter, DM Sans, Space Grotesk, or Plus Jakarta Sans?
- [ ] Does my accent involve purple → blue gradient, cyan-on-dark, or teal?
- [ ] Do I have card-in-card anywhere?
- [ ] Is every shadow a rounded-rectangle drop shadow?
- [ ] Could my hero headline be "Simple, powerful, {noun}"?
- [ ] Is there a sparkline decorating something with no data?
- [ ] Is my empty state just "No items found"?

If YES to any → rewrite that element.
