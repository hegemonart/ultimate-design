---
name: discover
description: "Stage 1 of the Ultimate Design pipeline. Runs a structured discovery interview that covers audience, goals, brand, constraints, and visual references — then produces DESIGN-CONTEXT.md with locked decisions and must-haves. Also surfaces the initial design direction for user sign-off (the 'defend' sub-step). Use --auto to let Claude pick defaults without questions."
argument-hint: "[--auto]"
user-invocable: true
---

# Ultimate Design — Discover

**Stage 1 of 4.** Produces `.design/DESIGN-CONTEXT.md`.

You are running the Discovery stage. Your job is to gather enough context to commission a design plan. This stage compresses Discover + Define + Design Direction + initial Defend into one structured interview, then locks everything into an artifact downstream agents can read without asking questions again.

## Inputs

Before asking anything, read all of these if they exist:

| File | What to extract |
|---|---|
| `.design/DESIGN-CONTEXT.md` | Existing decisions — resume from here if partial |
| `.impeccable.md` | Brand context, tone words, established direction |
| `DESIGN.md` | VoltAgent-format design system snapshot |
| `README.md` or `package.json` | Stack, framework, project name |
| Any `*.figma`, `*.fig`, or design token files | Visual constraints |

If DESIGN-CONTEXT.md already exists and looks complete, ask: "Discovery context already exists. Resume to add more context, or overwrite and start fresh?"

## Discovery Interview

Work through the following areas. Ask each area as a single focused question — not a list of 10 sub-questions. Adapt based on what you already extracted from files.

Skip any area where the answer is already clear from files.

### Area 1 — Scope
> What exactly are we designing? (new page, existing component audit, design system tokens, copy, full flow, etc.)

Clarify if needed: is this a new thing, a redesign, an audit, or a handoff?

### Area 2 — Audience
> Who is the primary user of this interface? Describe them in one sentence including their skill level and context of use.

### Area 3 — Goals
> What does success look like? Name 1–3 observable outcomes (e.g., "users can complete checkout in under 2 minutes", "the dashboard reads as authoritative, not playful").

### Area 4 — Brand Direction
> Pick 3 concrete words that describe how this should feel — and tell me one thing it must NOT look like.

Reject generic words: "modern", "clean", "elegant", "professional". Push for specific: "brutalist", "archival", "pharmaceutical", "soviet-constructivist", "editorial chaos".

### Area 5 — References
> Name 2–3 sites, apps, or visual references you want to draw from. Could be direct competitors, aesthetic references, or "vibes" from totally different industries.

If refero MCP is available, run: `refero_search_screens` for each reference to pull concrete screenshots. Log results as R-01, R-02, etc.

If no refero: check `~/.claude/libs/awesome-design-md/` for brand archetype match. List whatever is found.

### Area 6 — Constraints
> Any hard constraints? (framework, existing design tokens, accessibility requirements, device targets, deadline)

### Area 7 — Anti-Patterns
> Is there anything that already exists in the codebase that you want to explicitly avoid or fix?

Read `reference/anti-patterns.md` from the plugin root (`${CLAUDE_PLUGIN_ROOT}/reference/anti-patterns.md`) and prompt the user to flag any patterns they want banned.

## Auto Mode

If `$ARGUMENTS` contains `--auto`:
- Skip the interview
- Extract all answers from project files
- Apply sensible defaults for anything not found:
  - Scope: "General design audit and polish"
  - Audience: inferred from README/package.json
  - Brand: "Clear, functional, intentional — not generic SaaS"
  - References: Pull 2 from awesome-design-md matching project type
  - Constraints: Infer from package.json (framework, Tailwind, etc.)
- Proceed directly to Design Direction

## Design Direction

After all areas are answered, synthesize a **Design Direction Statement** and present it to the user for sign-off:

```
━━━ Design Direction ━━━

Direction: [one-sentence characterization of the design intent]

Tone: [word 1] · [word 2] · [word 3]

Key decisions:
  • [D-01: specific visual decision]
  • [D-02: specific visual decision]
  • [D-03: specific visual decision]

References:
  • [R-01: title — why relevant]
  • [R-02: ...]

NOT: [anti-pattern or reference to explicitly avoid]

Does this direction feel right? Any adjustments before we plan?
━━━━━━━━━━━━━━━━━━━━━━━━
```

Refine based on feedback. When the user confirms, write the artifact.

## Output: DESIGN-CONTEXT.md

Create `.design/` directory if it doesn't exist. Write `.design/DESIGN-CONTEXT.md`:

```markdown
---
project: [name]
created: [ISO 8601]
status: complete
---

<domain>
[What's in scope for this design work. One paragraph.]
</domain>

<audience>
Primary: [one sentence]
Context: [where/how they use the interface]
</audience>

<goals>
G-01: [Observable success outcome]
G-02: [...]
</goals>

<brand>
Tone: [word] · [word] · [word]
Anti-pattern: [what NOT to look or feel like]
Signals: [any existing brand tokens, colors, fonts already established]
</brand>

<references>
R-01: [Title] — [source/URL if available] — [why relevant]
R-02: [...]
</references>

<decisions>
D-01: [Category: Typography] [Concrete decision] — [rationale]
D-02: [Category: Color] [...]
D-03: [Category: Layout] [...]
</decisions>

<constraints>
C-01: [Framework/stack]
C-02: [Accessibility level, e.g. WCAG 2.1 AA]
C-03: [Other hard constraints]
</constraints>

<canonical_refs>
[Full paths to files downstream agents must read before working]
- .impeccable.md
- DESIGN.md
- [any relevant component files identified during discovery]
</canonical_refs>

<must_haves>
[Observable design outcomes that must be true after the Design stage.
Written as user-verifiable statements, not implementation details.]
- [The page loads with no layout shift above the fold]
- [Color contrast passes WCAG AA on all text]
- [The brand tone is immediately legible without reading copy]
</must_haves>

<deferred>
[Good ideas surfaced during discovery but out of scope for this design pass]
</deferred>
```

## After Writing

Tell the user:

```
━━━ Discovery complete ━━━
Saved: .design/DESIGN-CONTEXT.md

Next: /ultimate-design:plan
  → Reads your context and scopes the design work into executable tasks.
━━━━━━━━━━━━━━━━━━━━━━━━━
```

Do not proceed to planning automatically unless `--auto` was passed.
