# Features Research: Design Pipeline Commands

**Project:** ultimate-design v3
**Researched:** 2026-04-17
**Scope:** Three new commands — `style`, `darkmode`, `compare` — plus polish for existing pipeline
**Context:** Claude Code plugin, text-based pipeline, zero external dependencies, self-contained reference system

---

## style command — Handoff Specs

### What "design handoff" means in the ecosystem

Figma's Inspect panel, Zeplin, Avocode, and CSS-in-JS extract all output the same core content:
exact visual values (spacing, color, type) + interaction specs (states, behavior rules) + developer
context (token names, component variants). The output is structured for a developer who has never
seen the design file. Style Dictionary and Theo are the dominant token-to-code tools and define
what token formats look like in practice. Storybook's ArgsTable and CSF autodocs define what
component documentation looks like for code-native audiences.

The key insight for this pipeline: handoff from AI-driven design means the "Figma file" IS the
codebase. The spec is reverse-engineered from code, not exported from a tool. This is the
opposite of the Figma-first workflow and shapes what the command must do.

---

### Table Stakes

These are the features that any developer picking up the spec expects. Missing any = spec is
not usable as a handoff document.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Token inventory | Developer cannot implement without knowing the token names and values | Low | Extract from CSS custom properties, Tailwind config, or JS tokens |
| Color palette with roles | "What is this color, when do I use it?" — without semantic roles, every dev invents their own mapping | Low | Must show: name, value, semantic role (primary/danger/surface), usage examples |
| Type scale spec | Font family, size, weight, line-height, letter-spacing per role (body, heading, label, etc.) | Low | Maps to the existing typography.md reference — already has the rubric |
| Spacing system | The grid / 8pt values actually in use. Developers default to arbitrary px without this | Low | Extract from actual spacing values found in codebase |
| Component state inventory | Every interactive component must show all 8 states (default, hover, focus-visible, active, disabled, loading, error, success) | Medium | The checklists.md already mandates this — the spec just surfaces it |
| Contrast values | Per-component: foreground on background. Both light and dark if dark mode exists | Low | Calculated, not eyeballed — must show ratio (e.g. 5.2:1 PASS) |
| Border radius / shadow scale | Elevation model (how many depths, shadow values per depth) | Low | Developers need these to match new components to existing system |
| Breakpoints | The actual breakpoints in use, not the framework defaults | Low | Must be codebase-derived, not "Tailwind uses 640/768/1024/1280" |
| Component usage guidance | When to use this component vs. a similar one (e.g. Button vs. IconButton vs. LinkButton) | Medium | This is the "do / don't" content every design system doc has |

### Differentiators

These features exist in sophisticated handoff tools but are not universal. For this pipeline
they represent meaningful competitive advantage because they align with the plugin's philosophy
of measurable specificity.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| AI-slop audit inline | Show which tokens/components triggered BAN/SLOP patterns during design — gives developer context for why values look non-default | Low | Leverage existing anti-patterns.md grep patterns, report in handoff |
| Token semantic health score | Rate the token layer: are colors semantic (--color-primary) or primitive (#6366f1 hardcoded)? Missing tokens = debt. | Low | Score 0–100 based on raw-hex-in-components ratio |
| "What changed from baseline" callout | Compare current token values against DESIGN.md snapshot — shows developer exactly what the design pass changed | Medium | Requires DESIGN.md to exist; feeds naturally into the compare command |
| Copy spec inline | Button labels, error messages, empty state copy — many handoff docs omit this entirely | Low | Extract from codebase; flag copy anti-pattern violations (from existing anti-patterns.md) |
| Recommended implementation order | Tokens first → base components → composed components → page-level. Dependency graph for implementation. | Medium | Avoids the "I'll just hardcode it for now" trap |
| oklch / modern color space doc | Show oklch values alongside hex, explain why oklch (perceptual uniformity, P3 gamut). Most tools only output hex. | Low | Maps to oklch guidance already needed in design/SKILL.md |

### Anti-features

These are features common in Figma handoff tools that would be wrong for this pipeline.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Pixel-perfect redline dimensions | This is code, not Figma. Absolute pixel positions are meaningless in responsive components. | Output spacing tokens and grid values, not x/y/width/height |
| CSS snippets for every element | Produces bloated output developers ignore. They read code — they don't need AI to write `color: #6366f1` | Produce token names and semantic role; developer writes their own CSS |
| Figma component links | Not applicable — this pipeline is code-native | Show file paths and component names in the codebase |
| Auto-generated Storybook stories | Out of scope for a handoff spec; requires running a build environment | Flag "component should have story" as a P3 recommendation |
| Visual screenshots of components | This is a text-based CLI pipeline with no rendering capability | Describe component states in prose; link to preview URL if dev server exists |
| Exhaustive change log | Every CSS property that changed — produces enormous noise | Show only: new tokens added, token values changed, components added/modified, anti-patterns fixed |

---

## darkmode command — Dark Mode Audit

### What dark mode audit tools check in the ecosystem

Polypane's dark mode tester, Storybook's backgrounds addon, Chrome DevTools "Emulate CSS prefers-color-scheme", and Figma's "View as dark mode" all check the same core concerns:
(1) contrast in dark context, (2) color inversion artifacts (colors that worked in light but fail
in dark), (3) system preference detection. The real differentiation in serious dark mode audits is
checking for oklch/HSL semantic color architecture vs "just invert everything."

For this plugin specifically: scan already checks BAN-05 (pure black dark mode). The darkmode
command needs to go substantially deeper and produce a targeted remediation plan, not just a
checklist of passes/fails.

---

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| `prefers-color-scheme` detection check | Baseline. Does the app respond to OS dark mode preference at all? | Low | Grep for `prefers-color-scheme: dark` in CSS, or `useColorScheme`, or `data-theme` attribute toggling |
| Dark mode color contrast audit | All existing contrast checks from reference/accessibility.md re-run in dark mode context | Low | Requires extracting dark mode color values — grep for `:root[data-theme="dark"]` or `.dark` or `@media (prefers-color-scheme: dark)` blocks |
| Pure black background detection | BAN-05 already exists — darkmode command enforces it as a primary check | Low | Already have grep pattern; promote to first check |
| Semantic color token check | Colors that are theme-switched should use semantic tokens, not hardcoded hex | Low | Grep for hardcoded hex in dark mode overrides — raw hex in dark mode blocks = systematic problem |
| Color inversion artifact detection | Colors that work in light mode but fail in dark: inverted shadows, reversed border colors, light-on-light collisions | Medium | Check: border colors (do they flip?), shadow colors (black shadows on dark bg = invisible), icon fill colors |
| Image/media dark mode check | Logos and icons that are dark SVGs become invisible on dark backgrounds | Medium | Detect dark-colored SVGs and flag: `fill="#000"`, `fill="#1a1a1a"`, etc. |
| State visibility in dark | Hover states, focus rings, disabled states — do these still read in dark? | Medium | Check that focus ring color has 3:1 contrast against dark backgrounds |
| `color-scheme: dark` meta property | Missing `color-scheme` on `<html>` means browser UI (scrollbars, form inputs) stays light | Low | Grep `color-scheme` in CSS and meta tags |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| SLOP-03 detection (cyan accent on dark) | The AI default dark mode tell — SLOP-03 already exists, darkmode command should give it extra prominence and explain why it's a tell | Low | Already in anti-patterns.md; surface prominently with fix recommendation |
| oklch dark mode correctness | In oklch, dark mode surfaces should be 12–18% lightness with 0.005–0.015 chroma toward brand hue. Check if dark backgrounds use this pattern or just hex darks. | Medium | No current reference file coverage for this — new content needed in reference |
| Chroma desaturation check | Colors used in light mode should be desaturated in dark (oklch chroma reduced ~30%). Saturated colors on dark backgrounds cause visual vibration. | Medium | Measurable but requires extracting light vs dark versions of same token |
| Dark mode score (0–10) | Give a numeric score for dark mode quality using the same weighted approach as audit-scoring.md | Low | Consistent with pipeline philosophy; enables before/after comparison |
| "Light mode first, dark mode patched" detection | Pattern where dark mode is an afterthought: few dark mode overrides, or `filter: invert(1)` on entire app | Low | Count dark mode override selectors vs total color uses; very low ratio = patched |
| Dark mode consistency gaps | Identify components that have dark mode defined vs. those that don't — generates a targeted fix list | Medium | Grep all component files; check which have dark mode modifier selectors |

### Anti-features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| "Enable dark mode for you" | This plugin audits and specs; it does not implement. Implementing dark mode is a full design task for the existing pipeline. | Output a DESIGN-DARK.md brief that can feed into discover → plan → design for dark mode implementation |
| Screenshot comparison of light vs dark | No rendering capability | Describe color pair mismatches in text with exact values |
| Automated color palette generation | Generating a dark palette from scratch is discover/design stage work, not audit work | Flag what's wrong + the oklch correction formula; let the design stage implement |
| Browser/OS simulation | Cannot run a browser from within a Claude Code plugin | Inspect the CSS/source directly; note that some issues require visual confirmation |

---

## compare command — Snapshot Diff

### What snapshot diff tools produce in the ecosystem

Chromatic captures visual regression by comparing screenshots at pixel level. Percy and
Happo do the same. These are visual tools — screenshots before/after. For this pipeline,
which is entirely text-based, "snapshot" means the DESIGN.md artifact (the design system
snapshot produced by the scan command) and potentially the audit scores from DESIGN-CONTEXT.md
and DESIGN-VERIFICATION.md.

The closest text-based analog is a dependency audit diff (`npm audit` comparing two package-lock
versions) or a performance budget report (Lighthouse score comparison). These produce: what
changed, whether it improved or regressed, and what the delta is in concrete numbers.

For this pipeline specifically: DESIGN.md is a structured markdown document. Compare must
produce a meaningful diff that a developer can read and act on — not a raw `git diff`.

---

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Score delta | "Did we get better?" — baseline score vs. current score with directional indicator (▲ +12 pts) | Low | Requires two DESIGN-VERIFICATION.md files or two audit scores |
| Token changes | New tokens added, tokens removed, token values changed | Low | DESIGN.md captures the token inventory — diff the inventory tables |
| Anti-pattern delta | How many BAN/SLOP violations were fixed or introduced | Low | DESIGN.md includes anti-pattern findings; diff the violation count per category |
| Category score breakdown | Per-category score change (Accessibility: 6→8, Typography: 5→7) | Low | Most useful for understanding where work happened |
| Must-have completion | Which must-haves from DESIGN-CONTEXT.md were satisfied vs. outstanding | Low | DESIGN-VERIFICATION.md tracks must-have status |
| New issues introduced | Regressions — new violations that weren't in the baseline | Medium | Any increase in BAN/SLOP counts is a regression |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Design progress grade | Letter grade before/after (C → B) with one-sentence narrative of what drove the improvement | Low | Consistent with audit-scoring.md grade table; readable at a glance |
| "What this design pass achieved" narrative | 2–3 bullet points summarizing the substantive changes in human terms (not raw diff) | Low | This is what a design review conclusion looks like |
| Regression detection with severity | Not just "something changed" but "this is a P0 regression" vs "this is a P3 style drift" | Medium | Map violations to severity using existing priority-matrix.md categories |
| Time-series tracking (multi-snapshot) | Compare across 3+ snapshots: v1 baseline → v2 post-design → v3 current | Medium | Requires naming convention for snapshots; produces trend line |
| Specific component-level diff | "Button component: focus ring changed from blue to brand color" — not just file-level | Medium | Requires structured component sections in DESIGN.md |
| "Design drift" detection | When no explicit design pass ran but score degraded — detects accidental regressions from feature development | Medium | Compare dates on DESIGN.md snapshots; flag if score drops between planned design passes |

### Anti-features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Pixel-level screenshot diff | No rendering capability — this is not Chromatic | Text-based structural diff of DESIGN.md artifacts |
| Full git diff output | Raw git diff of CSS files is not actionable for design review | Synthesized semantic diff: "14 colors changed, 3 new tokens added, 2 BAN violations fixed" |
| Automated PR comments | Out of scope — this is a CLI plugin, not a CI integration | Produce DESIGN-DIFF.md that can be manually attached to a PR |
| "Approve" / "Reject" verdict | Diff is informational — decisions are human | Surface regressions as warnings; do not block workflow |
| Diffing files Claude didn't touch | Only diff design-relevant artifacts: DESIGN.md, token files, CSS custom properties | Do not diff test files, documentation, config files |

---

## Polish Features (existing pipeline)

These come from `.claude/memory/polish_backlog.md` and `.planning/PROJECT.md`. Categorized
by impact relative to v3 roadmap priorities.

### Most impactful improvements

These block real-world usage or produce unreliable results. Fix before new commands.

| Item | Skill | Impact | Why It Matters |
|------|-------|--------|----------------|
| Windows path hardening in grep patterns | scan/SKILL.md | HIGH | The primary use case for Windows users is broken silently — wrong file paths in grep → false clean audits |
| Non-src layout fallbacks (app/, lib/, pages/) | discover/SKILL.md | HIGH | Next.js App Router, Remix, SvelteKit all use non-src layouts; these users get broken baseline audits |
| Tailwind-only project handling in auto mode | discover/SKILL.md | HIGH | Tailwind-only projects (no explicit CSS files) are now the majority of new projects; no CSS files found → audit skips all color/spacing checks |
| oklch coverage in design/SKILL.md color guide | design/SKILL.md | MEDIUM-HIGH | BAN-05 and SLOP-03 both reference oklch but the execution guide teaches hex/rgb only — contradiction |
| Component task execution guide | design/SKILL.md | MEDIUM-HIGH | Component tasks have no guide, so parallel agents improvise — this produces the most inconsistent output in the pipeline |
| DESIGN-DEBT.md dependency ordering logic | scan/SKILL.md | MEDIUM | "Hand-wavy" ordering → developers can't trust the debt roadmap's recommended fix sequence |

### Nice-to-haves

These improve quality but don't block correct operation.

| Item | Skill | Impact | Why It Deferred |
|------|-------|--------|-----------------|
| `--full` mode per-file component analysis spec | scan/SKILL.md | MEDIUM | --full mode exists and works; it's just less detailed than it could be |
| NNG heuristics ? VISUAL flagging | verify/SKILL.md | MEDIUM | Currently developers don't know which NNG scores are inferred vs. visually confirmed — confusing but not wrong |
| Phase 1 re-audit referencing scan logic | verify/SKILL.md | LOW | Duplication is inelegant but functional |
| Task Action inline examples for parallel mode | plan/SKILL.md | MEDIUM | Parallel agents improvise without examples — some tasks are fine, complex ones drift |
| Concrete gray areas checklist in discover | discover/SKILL.md | MEDIUM | Currently described but not enumerated — forces agents to re-derive the same list each time |
| Decision authority escalation path in design | design/SKILL.md | MEDIUM | Current guidance says "note the choice" — escalation criteria are unclear |
| Pick-by-brand-archetype guide in typography.md | reference/typography.md | LOW | Long font list is hard to navigate — archetype guide would make it faster |
| Variable fonts guidance | reference/typography.md | LOW | Variable fonts are common but not yet covered |
| Spring physics in motion.md | reference/motion.md | LOW | React Spring / Framer Motion users have no reference |
| Scroll-triggered animation guidance | reference/motion.md | LOW | Common pattern not covered |
| Visual Hierarchy grep patterns in audit-scoring.md | reference/audit-scoring.md | MEDIUM | Hardest category to auto-score; more patterns would increase audit reliability |
| `--research` mode for plan | plan/SKILL.md | LOW | Removed in v2; complex projects would benefit but adds real complexity to implement well |

---

## Confidence Levels

| Area | Confidence | Source | Notes |
|------|------------|--------|-------|
| style command table stakes | HIGH | Direct extrapolation from existing checklists.md "handoff check" + industry standard Figma/Zeplin output patterns well-established | The checklists.md already lists exactly what handoff requires — token names, state coverage, dark mode, breakpoints |
| style command differentiators | MEDIUM | Extrapolated from plugin philosophy (measurable specificity, AI-slop detection) applied to handoff domain | The AI-slop-inline and token-health-score features are specific to this pipeline's angle |
| darkmode table stakes | HIGH | Derived from existing anti-patterns.md (BAN-05, SLOP-03), accessibility.md contrast requirements, and standard `prefers-color-scheme` patterns | These are well-defined WCAG and CSS spec behaviors |
| darkmode differentiators | MEDIUM | oklch dark mode correctness and chroma desaturation are grounded in color science but specific thresholds need reference file additions | The 12–18% lightness range for dark surfaces is established; chroma desaturation ratio is directional |
| compare table stakes | HIGH | Directly derived from what DESIGN.md and DESIGN-VERIFICATION.md contain — the pipeline produces exactly the data needed for diff | Score delta, token changes, category breakdown are all computable from existing artifacts |
| compare differentiators | MEDIUM | Design drift detection and multi-snapshot time series are patterns from performance monitoring tools (Lighthouse CI) applied to design | Implementation is feasible; specific naming conventions for snapshots need to be designed |
| polish impact ranking | HIGH | Sourced directly from polish_backlog.md with impact prioritized by user-reported failure modes | Windows path issue and Tailwind-only handling are known blockers, not hypothetical |

---

## Sources

- `.claude/memory/polish_backlog.md` — canonical rough edges list
- `.claude/memory/project_context.md` — architecture decisions and rationale
- `.planning/PROJECT.md` — active requirements and out-of-scope constraints
- `reference/anti-patterns.md` — BAN/SLOP patterns (BAN-05 pure black, SLOP-03 cyan-on-dark)
- `reference/accessibility.md` — WCAG 2.1 AA contrast thresholds
- `reference/audit-scoring.md` — 7-category weighted scoring model
- `reference/checklists.md` — handoff check section (direct source for style table stakes)
- `reference/priority-matrix.md` — severity classification framework
- `reference/review-format.md` — before/after table format
- `reference/typography.md` — type scale and specification reference
- `.claude/memory/design_philosophy.md` — "real data not vibes" principle guides anti-feature decisions
