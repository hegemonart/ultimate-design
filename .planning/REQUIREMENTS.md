# Requirements: ultimate-design v3

**Defined:** 2026-04-17
**Core Value:** Any developer can run the full pipeline on a real project and receive measurable, specific design improvement — not generic AI advice.

## v1 Requirements

### Platform Foundation

- [ ] **PLAT-01**: All bash grep patterns use POSIX-compatible syntax (`-E` with `|`) instead of GNU-only `\|`
- [ ] **PLAT-02**: `grep` calls across all skills include `-E` flag and work on macOS, Windows Git Bash, and Linux
- [ ] **PLAT-03**: `.gitattributes` enforces LF line endings for all `*.md` and `*.sh` files
- [ ] **PLAT-04**: Bootstrap script path normalization works on Windows (no hardcoded Unix paths)

### Scan Polish

- [ ] **SCAN-01**: Component inventory detection replaced with a more accurate pattern (reduce false positives from `grep -rln`)
- [ ] **SCAN-02**: `--full` mode per-file component analysis is fully specified with concrete output format
- [ ] **SCAN-03**: DESIGN-DEBT.md dependency ordering uses concrete logic (priority score = severity weight × effort weight, tiebreak by file count)
- [ ] **SCAN-04**: Fallback paths handle non-standard layouts (app/, lib/, pages/, src/) without breaking

### Discover Polish

- [ ] **DISC-01**: Baseline audit bash commands fall back gracefully when `src/` does not exist (checks app/, lib/, pages/ in order)
- [ ] **DISC-02**: Auto mode detects Tailwind-only projects (no CSS files) and adjusts audit commands accordingly
- [ ] **DISC-03**: Gray areas checklist is concrete and embedded: font-change risk, token-layer introduction risk, component rebuild vs restyle decision

### Plan Polish

- [ ] **PLAN-01**: Task Action field includes inline examples for parallel-mode agents (self-contained prompt templates)
- [ ] **PLAN-02**: `--research` mode is documented — either re-added with defined scope or explicitly removed with rationale

### Design Polish

- [ ] **DSGN-01**: Component task execution guide added (matching depth of typography, color, accessibility, motion guides)
- [ ] **DSGN-02**: Decision authority section defines clear escalation path: proceed autonomously / flag and proceed / stop and ask
- [ ] **DSGN-03**: Color task execution guide covers oklch color space (12–18% L for dark mode, chroma desaturation rules)

### Verify Polish

- [ ] **VRFY-01**: NNG heuristics that require visual inspection are flagged `? VISUAL` with clear explanation of why
- [ ] **VRFY-02**: Phase 1 re-audit references shared grep patterns rather than duplicating scan logic verbatim

### Reference File Polish

- [ ] **REF-01**: `reference/audit-scoring.md` — additional grep patterns for Visual Hierarchy auto-scoring
- [ ] **REF-02**: `reference/typography.md` — pick-by-brand-archetype quick guide (3–5 archetypes with recommended pairings)
- [ ] **REF-03**: `reference/typography.md` — variable fonts section added (axis guidance, fallback strategy)
- [ ] **REF-04**: `reference/motion.md` — spring physics patterns for React Spring and Framer Motion
- [ ] **REF-05**: `reference/motion.md` — scroll-triggered animation guidance (threshold, once vs repeat, performance)

### style Command

- [ ] **STYL-01**: `style` command exists at `skills/style/SKILL.md` and is routed from root `SKILL.md`
- [ ] **STYL-02**: `style` produces `.design/DESIGN-STYLE-[ComponentName].md` per component (not a flat file)
- [ ] **STYL-03**: Post-pipeline mode: reads `DESIGN-SUMMARY.md` to build spec from applied design decisions
- [ ] **STYL-04**: Pre-pipeline fallback mode: reads `DESIGN.md` + source file directly for current-state spec
- [ ] **STYL-05**: Output includes: spacing tokens, color tokens, typography scale, component states, AI-slop detection flag, token semantic health score (raw-hex-in-components ratio)

### darkmode Command

- [ ] **DARK-01**: `darkmode` command exists at `skills/darkmode/SKILL.md` and is routed from root `SKILL.md`
- [ ] **DARK-02**: Detects dark mode implementation architecture (CSS custom properties, Tailwind `dark:`, JS class toggle) before auditing
- [ ] **DARK-03**: Audits contrast of all text/background pairs in dark context (WCAG 4.5:1 body, 3:1 large)
- [ ] **DARK-04**: Checks semantic token dark mode overrides exist for all color tokens used in light mode
- [ ] **DARK-05**: Detects dark-specific anti-patterns: images/SVGs without dark variant, pure-black backgrounds (BAN-05 in dark context), forced-colors media query absence
- [ ] **DARK-06**: Checks `color-scheme` meta property and `prefers-color-scheme` media query presence
- [ ] **DARK-07**: Produces `.design/DARKMODE-AUDIT.md` (separate from DESIGN.md — read-only, no score writeback)

### compare Command

- [ ] **COMP-01**: `compare` command exists at `skills/compare/SKILL.md` and is routed from root `SKILL.md`
- [ ] **COMP-02**: Scoped to delta between existing `DESIGN.md` baseline score and current `DESIGN-VERIFICATION.md` scores (no snapshot mechanism required)
- [ ] **COMP-03**: Outputs: score delta per category, anti-pattern delta (resolved vs new), must-have pass/fail change
- [ ] **COMP-04**: Flags design drift: score regression in a category not covered by any explicit design task in `DESIGN-PLAN.md`
- [ ] **COMP-05**: Produces `.design/COMPARE-REPORT.md`

### Validation

- [ ] **VAL-01**: `claude plugin validate .` passes clean after all v3 changes
- [ ] **VAL-02**: Root `SKILL.md` argument-hint, Command Reference table, and Jump Mode section all updated for style/darkmode/compare
- [ ] **VAL-03**: Plugin version bumped to 3.0.0 in all manifest files (`plugin.json`, `marketplace.json`)

## v2 Requirements

### Future commands

- **V2-01**: `--research` mode for plan stage (complex projects) — deferred pending scope definition
- **V2-02**: Dark mode score writeback to DESIGN.md — deferred (two-sources-of-truth risk)
- **V2-03**: Multi-snapshot compare (DESIGN.md snapshot naming convention) — deferred; v3 uses simpler baseline-vs-verification approach
- **V2-04**: `darkmode` fix execution (not just audit) — deferred; fixes belong in design skill's color task

### Reference expansions

- **V2-05**: oklch exact chroma desaturation ratios (verified against browser rendering) — needs empirical validation
- **V2-06**: Brand archetype expansion beyond 5 archetypes

## Out of Scope

| Feature | Reason |
|---------|--------|
| CI/CD integration | Plugin is an audit tool, not a pipeline runner |
| Real-time UI rendering | Text-based pipeline, no visual tool |
| Figma file reading | Optional refero MCP is sufficient |
| Code generation / auto-fix | Audit and spec only — implementation belongs to design skill |
| Mobile app | CLI plugin only |
| External skill dependencies | Zero-dependency constraint is a hard requirement |
| Chromatic / Storybook integration | Out of scope for v3; competitive positioning deferred |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| PLAT-01 | Phase 1 | Pending |
| PLAT-02 | Phase 1 | Pending |
| PLAT-03 | Phase 1 | Pending |
| PLAT-04 | Phase 1 | Pending |
| SCAN-01 | Phase 2 | Pending |
| SCAN-02 | Phase 2 | Pending |
| SCAN-03 | Phase 2 | Pending |
| SCAN-04 | Phase 1 | Pending |
| DISC-01 | Phase 2 | Pending |
| DISC-02 | Phase 2 | Pending |
| DISC-03 | Phase 2 | Pending |
| PLAN-01 | Phase 2 | Pending |
| PLAN-02 | Phase 2 | Pending |
| DSGN-01 | Phase 2 | Pending |
| DSGN-02 | Phase 2 | Pending |
| DSGN-03 | Phase 2 | Pending |
| VRFY-01 | Phase 2 | Pending |
| VRFY-02 | Phase 2 | Pending |
| REF-01 | Phase 2 | Pending |
| REF-02 | Phase 2 | Pending |
| REF-03 | Phase 2 | Pending |
| REF-04 | Phase 2 | Pending |
| REF-05 | Phase 2 | Pending |
| STYL-01 | Phase 3 | Pending |
| STYL-02 | Phase 3 | Pending |
| STYL-03 | Phase 3 | Pending |
| STYL-04 | Phase 3 | Pending |
| STYL-05 | Phase 3 | Pending |
| DARK-01 | Phase 3 | Pending |
| DARK-02 | Phase 3 | Pending |
| DARK-03 | Phase 3 | Pending |
| DARK-04 | Phase 3 | Pending |
| DARK-05 | Phase 3 | Pending |
| DARK-06 | Phase 3 | Pending |
| DARK-07 | Phase 3 | Pending |
| COMP-01 | Phase 4 | Pending |
| COMP-02 | Phase 4 | Pending |
| COMP-03 | Phase 4 | Pending |
| COMP-04 | Phase 4 | Pending |
| COMP-05 | Phase 4 | Pending |
| VAL-01 | Phase 5 | Pending |
| VAL-02 | Phase 5 | Pending |
| VAL-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 43 total
- Mapped to phases: 43
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-17*
*Last updated: 2026-04-17 after initial definition*
