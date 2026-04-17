# Architecture Research: v3 Plugin Expansion

**Researched:** 2026-04-17
**Confidence:** HIGH — based on direct inspection of all existing skill files, artifact schemas, and PROJECT.md requirements

---

## New Command Placement

All three new commands follow the same structural pattern as the existing five skills: a `skills/<name>/SKILL.md` file registered as a sub-skill, routed from the root `SKILL.md`.

### skills/style/SKILL.md

**Classification:** Pipeline-adjacent utility (not a pipeline stage)

`style` is a developer handoff tool — it reads completed design work and emits annotated specs per component. It was in v1 as `design:design-handoff` which confirms it lives outside the pipeline stage sequence but depends on pipeline artifacts.

Placement: `skills/style/SKILL.md`

Root SKILL.md routing addition:
```
| `style [component]` | `ultimate-design:style` | Generate component design spec for developer handoff |
```

Jump mode routing in root SKILL.md:
```
/ultimate-design style        → Skill("ultimate-design:style")
/ultimate-design style Button → Skill("ultimate-design:style", "Button")
```

The status display does NOT include `style` in the pipeline progress bar — it is an on-demand utility runnable at any point after `design` has produced output. It does not block or gate any other stage.

### skills/darkmode/SKILL.md

**Classification:** Specialized scan mode (extends scan, not a pipeline stage)

`darkmode` is a focused audit that answers "how well does this project implement dark mode?" It is conceptually a depth-first scan of one dimension that `scan` covers shallowly (DESIGN.md records `dark mode: Yes/No/Partial` and BAN-05 pure-black check, but does not do a full dark mode quality pass).

Placement: `skills/darkmode/SKILL.md`

Root SKILL.md routing addition:
```
| `darkmode` | `ultimate-design:darkmode` | Deep audit of dark mode implementation quality |
```

The status display does NOT include `darkmode` in the pipeline progress bar — it is a standalone diagnostic runnable independently or as a pre-pipeline supplement.

### skills/compare/SKILL.md

**Classification:** Historical delta utility (reads DESIGN.md snapshots, produces diff report)

`compare` reads two DESIGN.md snapshots and produces a structured diff showing score progression and system evolution. It is entirely read-only and produces no artifact that any other stage consumes.

Placement: `skills/compare/SKILL.md`

Root SKILL.md routing addition:
```
| `compare [v1] [v2]` | `ultimate-design:compare` | Diff two DESIGN.md snapshots to track design progress |
```

### Root SKILL.md Updates Required

The `argument-hint` frontmatter field and Command Reference table must be extended. The routing logic and status display sections are unchanged (new commands are not pipeline stages). The "Do Not" section gains no new rules — existing rules cover the new commands correctly.

Updated `argument-hint`:
```
"[scan|discover|plan|design|verify|style|darkmode|compare|status]"
```

---

## Artifact Flows

### style artifacts

**Reads:**
- `.design/DESIGN-SUMMARY.md` — what design changes were actually made (source of truth for implemented tokens/values)
- `.design/DESIGN-CONTEXT.md` — brand decisions, must-haves, canonical refs (to know intent behind choices)
- `.design/DESIGN-PLAN.md` — task acceptance criteria (to know what each component change was meant to achieve)
- Direct source files — the actual component file(s) matching `$ARGUMENTS` target

**Produces:**
- `.design/DESIGN-STYLE-[ComponentName].md` — one file per target component

The component-scoped output filename (not a flat `DESIGN-STYLE.md`) is correct because `style` is inherently invoked per-component: `/ultimate-design style Button`, `/ultimate-design style Card`. A flat file would be overwritten on each call and lose prior specs. The pattern `.design/DESIGN-STYLE-[ComponentName].md` follows the existing `DESIGN-` prefix convention and remains co-located with other pipeline artifacts.

**Output format:** A spec sheet for a developer who did not participate in the design process — includes current token values, why each choice was made, what not to change, and responsive/state variations. Not a generic style guide — a targeted handoff doc tied to specific DESIGN-CONTEXT.md decisions.

**No artifact consumed by other stages.** `style` is terminal — nothing reads its output in the pipeline.

### darkmode artifacts

**Reads:**
- `DESIGN.md` — existing design system snapshot (current dark mode status, token layer presence, color palette)
- `${CLAUDE_PLUGIN_ROOT}/reference/anti-patterns.md` — BAN-05 (pure black), SLOP-01..08 color checks
- `${CLAUDE_PLUGIN_ROOT}/reference/accessibility.md` — contrast requirements in dark context
- `${CLAUDE_PLUGIN_ROOT}/reference/audit-scoring.md` — Color and Accessibility scoring for dark-specific scoring
- Source CSS/token files directly (via bash grep)

**Produces:**
- `.design/DESIGN-DARKMODE.md` — dark mode audit report

Does NOT write to `DESIGN.md` or `DESIGN-DEBT.md` — it is read-only relative to those files. If issues are found, it outputs a prioritized fix list inside `DESIGN-DARKMODE.md` in the same P0–P3 / XS–XL format as `DESIGN-DEBT.md`, so findings can be manually merged into the debt backlog if desired.

**Format of DESIGN-DARKMODE.md:**
```
---
generated: [ISO 8601]
tool: ultimate-design darkmode
dark_mode_present: true | false | partial
score: [N]/10
---
```
Sections: Implementation Detection, Token Audit (semantic roles under dark), Contrast Audit, Anti-Pattern Findings, Fix Recommendations (P0–P3).

### compare artifacts

**Reads:**
- Two DESIGN.md snapshots — either explicit file paths passed as arguments, or implicitly the current `DESIGN.md` vs. a versioned copy

**File naming convention for versioned snapshots:**
```
DESIGN.md           ← always the live/current snapshot
DESIGN-v1.md        ← archived snapshot at a point in time
DESIGN-v2.0.0.md    ← snapshot tagged to a release
DESIGN-2026-01-15.md ← snapshot tagged to a date
```

Users create versioned snapshots manually by copying `DESIGN.md` before starting a new pipeline run: `cp DESIGN.md DESIGN-v1.md`. `compare` should detect and list available snapshots if called without arguments:

```
/ultimate-design compare              → lists available snapshots, prompts user to pick two
/ultimate-design compare v1 v2.0.0   → diffs DESIGN-v1.md vs DESIGN-v2.0.0.md
/ultimate-design compare              → if only two total, diffs them automatically
```

**Produces:**
- `.design/DESIGN-COMPARE-[label].md` — diff report (label derived from the two inputs, e.g., `v1-v2`)

**Output format:** Score delta table (all 7 categories before/after), color system changes (palette additions/removals, token layer changes), typography changes, anti-pattern status changes, narrative summary of what improved vs. what regressed.

**No artifact consumed by other stages.** `compare` is terminal.

---

## Reuse Opportunities

### darkmode reuses scan's grep infrastructure

`scan/SKILL.md` Steps 2–5 contain all the bash grep patterns needed for dark mode detection. `darkmode` does not need to invent new patterns — it specializes the existing patterns with dark-mode-specific focus:

| scan pattern | darkmode specialization |
|---|---|
| All hex colors grep | Filter to dark-context selectors: `.dark *`, `[data-theme="dark"] *`, `prefers-color-scheme: dark` |
| BAN-05 pure black check | Promote from one check to the primary audit section |
| CSS custom property grep | Focus on `--color-*` properties defined inside dark selectors vs. root |
| Token layer detection | Specifically check for dual-mode semantic tokens (e.g., `--bg-surface` defined in both `:root` and `.dark`) |

The `darkmode` SKILL.md should reference the same grep patterns from `reference/anti-patterns.md` rather than duplicating them. The reuse is via the reference file, not via calling `scan`.

Do NOT call `scan` from `darkmode` or route to it. The two skills are peers: `scan` is a full-project overview, `darkmode` is a focused depth pass on one dimension. Calling `scan` to implement `darkmode` would re-run 7 steps when only 2 are relevant, and would produce an unwanted DESIGN.md side effect.

### style reuses design's task execution knowledge

The `design/SKILL.md` task types (`typography`, `color`, `component`, `tokens`) define what was done to each component. `style` should read DESIGN-SUMMARY.md task outputs and synthesize them into a developer-readable spec — the execution framework is not reused, but the artifact schema is. No code reuse, but the data model alignment is important.

### compare reuses scan's DESIGN.md schema

`compare` can only work reliably if both snapshots follow the same frontmatter + section schema that `scan` produces. This means `compare` is tightly coupled to `scan`'s output format. Any changes to the DESIGN.md schema in scan must be reflected in compare's diff logic. This is a soft dependency, not a hard runtime dependency, but it is a maintenance coupling.

### All three reuse reference files

All new commands read from `reference/` files directly (same pattern as existing skills):
- `darkmode` → `reference/anti-patterns.md`, `reference/accessibility.md`, `reference/audit-scoring.md`
- `style` → `reference/typography.md`, `reference/heuristics.md` (H-08 for minimalism/visual hierarchy in specs)
- `compare` → `reference/audit-scoring.md` (to interpret score deltas correctly)

No new reference files are required for v3. The existing reference system is sufficient.

---

## Build Order

### Phase dependencies

```
Existing skills (scan, discover, plan, design, verify) — no changes required to build new commands
     |
     +-- style            [no blocker — can build first]
     |
     +-- darkmode         [no blocker — can build independently]
     |
     +-- compare          [soft dependency on DESIGN.md schema stability]
     |
     +-- root SKILL.md    [must update AFTER all three skills exist]
```

### Parallel vs. sequential

**Can build in parallel (no interdependencies):**
- `skills/style/SKILL.md` — reads existing artifacts, produces new artifact type
- `skills/darkmode/SKILL.md` — reads existing artifacts + source code, produces new artifact type

**Must wait:**
- `skills/compare/SKILL.md` — should be built after confirming DESIGN.md schema is stable (if scan is being modified in v3 polish, wait for scan polish to land before finalizing compare's diff logic)
- Root `SKILL.md` updates — must happen after all three skill files exist (the routing table references them)

### Within each command, build order

For `style`:
1. Define output schema for `DESIGN-STYLE-[Component].md` first
2. Write SKILL.md against that schema
3. Verify the artifact is readable without pipeline context (standalone use case)

For `darkmode`:
1. Audit what `scan` currently captures for dark mode (done — it's shallow: one BAN check + `dark mode: Yes/No/Partial` field)
2. Write the expanded grep patterns for dark-context detection
3. Write SKILL.md referencing `reference/anti-patterns.md` for pattern source
4. Define DESIGN-DARKMODE.md schema

For `compare`:
1. Confirm DESIGN.md schema is finalized (after any scan polish)
2. Define argument parsing logic (how snapshots are identified)
3. Write SKILL.md diff logic
4. Define DESIGN-COMPARE-[label].md schema

### Recommended build sequence

```
Pass 1 (parallel): style + darkmode SKILL.md files
Pass 2 (after scan polish lands): compare SKILL.md
Pass 3 (after all three): root SKILL.md routing update + plugin validate
```

---

## Risks

### Risk 1: compare tightly couples to DESIGN.md schema

**What could go wrong:** v3 includes scan polish items (bash grep hardening, false-positive reduction). If these changes alter the DESIGN.md output format (new sections, removed sections, changed field names), compare's diff logic breaks silently — it will still run but produce incorrect or incomplete diffs.

**Mitigation:** Write compare last in the build sequence, after scan polish is complete. Explicitly document the DESIGN.md schema as a stable interface in scan/SKILL.md. Alternatively, make compare diff on section headers and score tables only (more resilient than full-text diff).

### Risk 2: style without a DESIGN-SUMMARY.md produces empty or meaningless output

**What could go wrong:** Users may invoke `/ultimate-design style Button` before running the pipeline — they just want to see the current component spec, not post-design changes. With no DESIGN-SUMMARY.md, `style` has no design decisions to report.

**Mitigation:** `style` must handle two modes explicitly: (a) post-pipeline mode — reads DESIGN-SUMMARY.md for applied decisions, (b) pre-pipeline / scan-only mode — reads DESIGN.md baseline and source file directly to produce a "current state" spec. The fallback must be specified in the SKILL.md, not left to inference.

### Risk 3: darkmode invoked before scan produces conflicting data

**What could go wrong:** `darkmode` and `scan` both produce dark-mode-related observations. If a user runs `scan` (which puts `dark mode: Partial` in DESIGN.md) then runs `darkmode` (which puts a score and detailed findings in DESIGN-DARKMODE.md), there are now two sources of truth about dark mode status. If the user then re-runs `scan`, DESIGN.md is overwritten with a fresh shallow assessment, but DESIGN-DARKMODE.md still has the old detailed findings.

**Mitigation:** `darkmode` output file is always stamped with a `generated:` ISO timestamp in frontmatter. The root SKILL.md status display should not surface DESIGN-DARKMODE.md in the pipeline status — it is a one-off diagnostic, not a living artifact. Document clearly that DESIGN-DARKMODE.md becomes stale after codebase changes and should be re-run.

### Risk 4: DESIGN-STYLE-[ComponentName].md naming collision on case-sensitive filesystems

**What could go wrong:** On Linux (case-sensitive), `DESIGN-STYLE-button.md` and `DESIGN-STYLE-Button.md` are different files. If users pass component names inconsistently, they accumulate multiple spec files for the same component.

**Mitigation:** Normalize component name in the filename: always PascalCase the first character, strip spaces. Document this in the SKILL.md argument-hint.

### Risk 5: plugin validate failure if SKILL.md frontmatter is invalid

**What could go wrong:** The `claude plugin validate .` constraint is a hard requirement. The plugin validator checks frontmatter schema. If any new SKILL.md has an invalid field, the build fails.

**Mitigation:** Model new skill frontmatter exactly on an existing skill (e.g., `scan/SKILL.md`). The frontmatter fields `name`, `description`, `argument-hint`, `user-invocable` are all confirmed valid from existing skills. Do not add any experimental fields.

### Risk 6: root SKILL.md routing table grows unwieldy

**What could go wrong:** Adding three new jump-mode entries to a routing section that currently has five entries increases cognitive load when reading the root SKILL.md. The status display section also risks becoming cluttered if the distinction between pipeline stages and utility commands is unclear.

**Mitigation:** Separate the Command Reference table into two subsections — "Pipeline stages" (scan, discover, plan, design, verify) and "Utilities" (style, darkmode, compare). The pipeline progress bar in status display stays identical — utilities do not appear there. Jump mode routing section can keep a flat list since it is mechanical, not conceptual.
