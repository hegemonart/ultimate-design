# The Five-Phase Workflow

End-to-end pipeline for any design task. Phases 1–2 are mandatory for any ambitious output. Phases 3–5 scope to the ask.

---

## Phase 1 — Discover (Always First)

**Goal:** Replace generic AI defaults with concrete, specific references.

### Steps

1. **Pull references via refero MCP.** Run ≥2 queries: one structural ("checkout flow", "admin table", "empty state for messaging app"), one aesthetic ("editorial dark fintech", "brutalist portfolio", "retro-futuristic dashboard"). See `refero.md` for exact usage.
2. **Scan `~/.claude/libs/awesome-design-md/`** for brand archetypes that match the ask. The folder is organized by real company (claude, linear, stripe, vercel, cursor, etc.). Pull 1–2 closest matches as DESIGN.md reference points.
3. **Sample the existing codebase** only for constraints (framework, component library, existing tokens). Never for aesthetic direction.
4. **Write down 3 concrete brand-voice words.** Not "modern" or "elegant." Try "warm and mechanical and opinionated," "calm and clinical and careful," "fast and dense and unimpressed."

### Outputs of Phase 1

- A reference pack (3–7 URLs/images) saved as a comment in the design doc or pasted into the thread
- 3 brand-voice words
- 1–2 DESIGN.md archetypes from the library

### Exit criteria

You cannot start Phase 2 until you have the reference pack. Do not proceed with "I'll imagine what this should look like."

---

## Phase 2 — Define (Lock Context)

**Goal:** Produce a context block that will persist across sessions.

### Steps

1. **Check for existing context.** Read `.impeccable.md` and `DESIGN.md` from project root.
2. **If missing or stale:** invoke `Skill(impeccable)` in **teach mode** to run a structured discovery interview. Writes `.impeccable.md`.
3. **Author `DESIGN.md`** using `design-md-template.md` — the AI-readable design system spec (VoltAgent pattern).
4. **Declare the direction.** One paragraph naming:
   - Primary tone (extreme word — brutalist, editorial, etc.)
   - Typography pair (display + body; NOT from the reflex-reject list in `anti-patterns.md`)
   - Palette strategy (OKLCH with tinted neutrals; dominant + accent, not rainbow)
   - Motion philosophy (how much, which curves, which frequencies animate — see `anthropic-skills:ux-designer` for platform conventions)

### Outputs of Phase 2

- `.impeccable.md` in project root (persisted)
- `DESIGN.md` in project root (persisted)
- One-paragraph design direction, shared with user for approval

### Exit criteria

User explicitly OK'd the direction. This is the one moment where you *stop and ask* — proceeding on wrong tone wastes the most time downstream.

---

## Phase 3 — Design (Produce Artifact)

**Goal:** Make the thing.

### Routing

Use the routing table in SKILL.md to pick the right sub-skill and invoke it via the Skill tool. Pass forward the Phase 1 reference pack and Phase 2 context block so the sub-skill doesn't re-discover.

### Multi-sub-skill tasks

If the task spans multiple sub-skills (common), sequence them:

**Example — new feature page:**
1. `Skill(impeccable-shape)` — UX plan before code (discovery interview → brief)
2. `Skill(impeccable)` craft mode — implementation
3. `Skill(anthropic-skills:copywriter)` — replace all placeholder copy with real copy
4. `Skill(emil-design-eng)` — review animation/interaction details with Before/After table

**Example — existing UI fix:**
1. `Skill(impeccable-audit)` — technical quality score
2. `Skill(design:design-critique)` — UX critique
3. Merge the two reports; decide fix order by priority matrix
4. Apply fixes via the specific impeccable command skills (`impeccable-typeset`, `impeccable-layout`, etc.)

### Outputs of Phase 3

- The artifact (code, mock, spec, copy, deck, prototype).
- A list of what was built vs. what was deferred.

---

## Phase 4 — Deliver (Polish & Handoff)

**Goal:** Make it ship-ready.

### Steps

1. **Polish pass** — `Skill(impeccable-polish)`. Alignment, spacing rhythm, consistency.
2. **Audit pass** — `Skill(impeccable-audit)`. Tech quality score, flags P0/P1 blockers.
3. **Accessibility pass** — `Skill(design:accessibility-review)`. WCAG 2.1 AA audit.
4. **Handoff** (if cross-team) — `Skill(design:design-handoff)`. Produces spec sheet with layout, tokens, states, props.
5. **Design system sync** — if the artifact introduces reusable pieces, run `Skill(impeccable)` extract mode to pull them into the design system, then `Skill(anthropic-skills:design-systems)` for token alignment.

### Run the pre-delivery checklist

See `checklists.md`. At minimum:
- [ ] Pulled ≥3 real references (Phase 1) and cited them
- [ ] Context in `.impeccable.md` matches what was built
- [ ] All colors/tokens reference semantic tokens, no raw hex in components
- [ ] All interactive states defined (default/hover/focus/active/disabled/loading/error)
- [ ] `prefers-reduced-motion` respected
- [ ] Touch targets ≥ 44×44pt / 48×48dp
- [ ] No items on the absolute-ban list in `anti-patterns.md`

### Outputs of Phase 4

- Polished, audited artifact
- Handoff spec (if applicable)
- Design-system PR (if extraction happened)

---

## Phase 5 — Defend (Present & Critique)

**Goal:** Communicate what was built and why, so the right feedback happens.

### For presentations / reviews

1. `Skill(anthropic-skills:design-storytelling)` — use the 6-step narrative spine (Orient → Show Shape → State Decision → Why before What → Anticipate & Defuse → Close with Ask).
2. **Never open with exploration.** You present a decision, not options. Presenting options invites the stakeholder to decide (wrong outcome).
3. **Translate design language to business language** — see design-storytelling skill's table.
4. **Close with a specific ask** — not "thoughts?"

### For design critiques (you're reviewing someone else's work, or your own)

1. Use the `| Before | After | Why |` markdown table format. No prose lists. See `review-format.md`.
2. Cover: visual hierarchy, typography, color/contrast, spacing rhythm, component states, motion, accessibility. (The 7 dimensions from `anthropic-skills:ui-designer`.)
3. Score with the 10-category priority matrix if comparing multiple pieces. See `priority-matrix.md`.

### Outputs of Phase 5

- Either a narrated presentation (Figma/deck/doc-brief) with a specific ask, or
- A Before/After critique table + priority-ranked fix list

---

## When To Short-Circuit

Not every task needs all 5 phases. Minimum required:

| Task | Min phases |
|---|---|
| "Audit this screen" | 1, 4 |
| "Write error messages for this form" | 1, 3 (`copywriter`) |
| "What font should I use?" | 1, 2 (context), 3 (`impeccable-typeset`) |
| "Build a landing page" | ALL 5 |
| "Fix the animation on this button" | 1 (reference similar apps), 3 (`emil-design-eng`), 5 (Before/After table) |
| "Set up the design system" | 1, 2, 3 (`anthropic-skills:design-systems`), 4 (token docs) |
| "Present this design to leadership" | 5 only (if Phases 1–4 already done) |

## The Non-Negotiable

Every design task — even a one-word microcopy tweak — passes through Phase 1 (Discover) in at least a lightweight form. For microcopy: look at how Linear, Stripe, Phantom, Vercel write the equivalent string. That's the reference pack. Then write the copy. The cost is 30 seconds of `refero` usage to avoid 30 minutes of generic output.
