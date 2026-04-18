# Changelog

## [1.0.5] — 2026-04-18

### Added — Phase 11: Self-Improvement
- `design-reflector` agent — post-cycle reflection from learnings + telemetry + agent-metrics
- `/gdd:reflect` command — on-demand reflection with `--dry-run` and `--cycle` flags
- `/gdd:apply-reflections` command — user-review + selective apply for all proposal types
- Frontmatter feedback loop — reflector proposes `typical-duration-seconds`, `default-tier`, `parallel-safe`, `reads-only` updates from measured data
- Budget-config feedback loop — reflector proposes `.design/budget.json` cap adjustments from telemetry
- Reference-update proposer — N≥3 pattern detection across learnings files → `reference/` additions
- Discussant question-quality logging — answer quality recorded to `.design/learnings/question-quality.jsonl`
- Discussant question-quality analysis — low-value questions flagged and pruning proposed after ≥3 cycles
- Global skills layer — `~/.claude/gdd/global-skills/` for cross-project conventions
- Global skills auto-loading in explore, plan, design stages
- Phase 11 regression baseline locked in `test-fixture/baselines/phase-11/`

### Changed
- `/gdd:audit` now spawns `design-reflector` at cycle end when learnings data exists
- `agents/design-discussant.md` logs answer quality after each Q&A exchange
- Plugin version: 1.0.4.1 → 1.0.5

## [1.0.2] — Phase 8: Visual + Design-Side Connections + Knowledge Graph

### Added

- **Preview (Playwright) connection** — `connections/preview.md`; live page screenshots for `? VISUAL` verification gaps via `mcp__Claude_Preview__*` tools
- **Storybook connection** — `connections/storybook.md`; HTTP probe for component inventory, a11y per story, `.stories.tsx` stub generation during design stage
- **Chromatic connection** — `connections/chromatic.md`; CLI-based visual regression delta narration and change-risk scoping using `--trace-changed=expanded`
- **Figma Writer agent** — `agents/design-figma-writer.md`; write design decisions back to Figma (annotate, tokenize, Code Connect mappings) via remote MCP `use_figma`; proposal→confirm UX with `--dry-run` and `--confirm-shared` guards
- **Graphify knowledge graph connection** — `connections/graphify.md`; queryable component↔token↔decision graph via `gsd-tools graphify`
- **`/gdd:figma-write` command** — `skills/figma-write/SKILL.md`; standalone Figma write command
- **`/gdd:graphify` command** — `skills/graphify/SKILL.md`; build/query/status/diff subcommands
- **Connections capability matrix expanded** — `connections/connections.md` updated to 7 active connections
- **Agent pre-search consultation** — `design-integration-checker` and `design-planner` consult the knowledge graph before grep searches when Graphify is available

### Changed

- `connections/connections.md` — Active Connections table expanded from 2 to 7; Capability Matrix updated; placeholder rows removed
- `agents/design-verifier.md` — Phase 4B visual evidence block added; Chromatic delta narration block added
- `agents/design-planner.md` — Chromatic change-risk scoping block added; Graphify component-count annotation block added
- `agents/design-context-builder.md` — Storybook component inventory block added
- `SKILL.md` — argument-hint and Command Reference updated with `figma-write` and `graphify`
- Root `SKILL.md` — `figma-write` and `graphify` entries added

---

## [1.0.1] — 2026-04-18

### Added — Phase 7: GSD Parity + Exploration
- Reshaped pipeline to 5-stage canonical shape (brief → explore → plan → design → verify)
- `/gdd:` namespace for all commands
- design-discussant agent + `/gdd:discuss` + `/gdd:list-assumptions`
- 5 specialist mapper agents (token, component-taxonomy, visual-hierarchy, a11y, motion)
- Wave-native parallelism decision engine
- Sketch (multi-variant HTML) and Spike (feasibility) explorations — `/gdd:sketch`, `/gdd:sketch-wrap-up`, `/gdd:spike`, `/gdd:spike-wrap-up`
- Project-local skills layer (`./.claude/skills/design-*-conventions.md`) auto-loaded by explore/plan/design
- Lifecycle commands: `new-project`, `new-cycle`, `complete-cycle`
- Ergonomics: `progress`, `health`, `todo`, `stats`, `next`, `help`
- Capture layer: `note`, `plant-seed`, `add-backlog`, `review-backlog`
- Safety: `pause`/`resume`, `undo`, `pr-branch`, `ship`
- Settings + maintenance (`update`, `reapply-patches`)
- Debug workflow + debugger philosophy
- Agent hygiene: frontmatter extensions, size budgets, injection scanner

### Changed
- Plugin version: 1.0.0 → 1.0.1

## [1.0.0] — 2026-04-17
- Initial release as `get-design-done`.
