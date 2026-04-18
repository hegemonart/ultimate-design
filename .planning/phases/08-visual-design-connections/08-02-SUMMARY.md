---
phase: 08-visual-design-connections
plan: "02"
subsystem: connections
tags:
  - storybook
  - component-inventory
  - a11y
  - stories-tsx
  - http-probe
dependency_graph:
  requires:
    - connections/refero.md (template for structure)
  provides:
    - connections/storybook.md
    - storybook probe in skills/verify/SKILL.md
    - .stories.tsx stub logic in skills/design/SKILL.md
    - Step 0B in agents/design-context-builder.md
    - a11y integration block in agents/design-verifier.md
  affects:
    - discover stage (authoritative component inventory via index.json)
    - verify stage (per-story a11y loop)
    - design stage (.stories.tsx stub emission)
tech_stack:
  added: []
  patterns:
    - HTTP probe (curl GET /index.json) instead of MCP/ToolSearch
    - Two-phase probe (B1 project detection + B2 server detection)
    - Three-value status (available/unavailable/not_configured)
    - CSF Component Story Format (.stories.tsx stubs)
    - axe-core a11y via storybook test --ci
key_files:
  created:
    - connections/storybook.md
  modified:
    - skills/verify/SKILL.md
    - skills/design/SKILL.md
    - agents/design-context-builder.md
    - agents/design-verifier.md
decisions:
  - HTTP-probe-over-MCP: Storybook has no dedicated MCP; probe is two-phase HTTP curl to localhost:6006
  - project-detection-only-for-stories: .stories.tsx stub uses B1 (project detection) only; dev server not required
  - title-grouping-for-inventory: group index.json entries by title field to get component list; each title = one component
  - no-parameters-caveat: Storybook 8 index.json excludes parameters; a11y config lives in .storybook/preview.ts
metrics:
  duration_seconds: 258
  completed: "2026-04-18"
  tasks_completed: 3
  tasks_total: 3
  files_created: 1
  files_modified: 4
---

# Phase 8 Plan 02: Storybook Connection Spec and Component Inventory Wiring Summary

Storybook HTTP connection spec created and wired into three SKILL.md files and two agents. Storybook now serves as the authoritative component inventory (replacing grep), per-story a11y output feeds the verify stage, and the design stage auto-scaffolds `.stories.tsx` stubs alongside newly created components when Storybook is detected in the project.

---

## Files Created

### `connections/storybook.md`

Full connection specification following the 9-section structure from `connections/refero.md`. Key content:

- **Two-phase HTTP probe:** B1 (project detection via `ls .storybook/` or `grep '"storybook"' package.json`) then B2 (HTTP GET `localhost:6006/index.json`, with `stories.json` fallback for Storybook 7 compat)
- **index.json format documented:** Storybook 8 flat map of `storyId → {id, title, name, importPath, type, tags}` with full field table
- **Critical caveat:** Storybook 8 `index.json` does NOT include `parameters` — a11y config lives in `.storybook/preview.ts`
- **Title-grouping pattern:** group entries by `title` field to get component list (each unique title = one component, entries under it = declared states)
- **Three-value status:** `available` / `unavailable` / `not_configured`
- **Fallback chain** for all three stages (discover, verify, design)
- **CSF `.stories.tsx` stub template** with `parameters.a11y.test = 'error'`
- **STATE.md integration** section describing `<connections>` block format
- **Six caveats:** no-parameters, title-grouping, docs-type filtering, first-time init, Chromatic dependency, stories.json version split

---

## Files Modified

### `skills/verify/SKILL.md`

Two blocks inserted after the State Integration section (alongside the Preview probe block already present from plan 08-01):

1. **`### Probe Storybook connection`** — B1 project detection + B2 dev server detection (index.json then stories.json fallback); writes status to `STATE.md <connections>`
2. **`### Storybook A11y Loop (when storybook: available)`** — runs `npx storybook test --ci 2>&1 | tee .design/storybook-a11y-report.txt`; passes report to design-verifier as additional a11y evidence; three conditional branches (available / unavailable / not_configured)

### `skills/design/SKILL.md`

One block inserted after the Pre-execution — Project-local conventions section:

- **`### .stories.tsx Stub (when storybook project detected)`** — B1-only check (server not required); when `storybook_project: true`, emits CSF stub alongside every new component file; references `connections/storybook.md` for full template; title adjusted to directory structure

### `agents/design-context-builder.md`

Two changes:

1. **`connections/storybook.md` added to Required Reading** (both in frontmatter `required_reading` field and in the Required Reading prose section)
2. **Step 0B — Storybook Component Inventory** inserted after Step 0 (Figma Pre-population), before Step 1 (Auto-Detect Design System State):
   - Skip condition: `storybook` is `not_configured` or `unavailable`
   - Fetches `index.json` (with `stories.json` fallback)
   - Filters to `type === "story"` entries
   - Groups by `title` to build authoritative component inventory
   - Records states per component (Primary, Disabled, etc.)
   - Documents parameters caveat inline
   - Fallback: if fetch errors, updates STATE.md to `storybook: unavailable` and continues with grep inventory

### `agents/design-verifier.md`

Two changes:

1. **`connections/storybook.md` added to Required Reading**
2. **`### Storybook A11y Integration (when storybook: available)`** block inserted after Chromatic Delta Narration section:
   - Skip condition: `storybook` is `not_configured` or `unavailable`
   - Reads `.design/storybook-a11y-report.txt` if present
   - Maps failures to component names via `title` field
   - Records violations as `A11Y-STORY [rule-name]: <ComponentName> (<story-state>) — <description>`
   - Flags components with 3+ violations as HIGH PRIORITY
   - Distinguishes VIOLATIONS (must fix) from INCOMPLETE (manual check)
   - Fallback note when report file absent

---

## Storybook Probe Steps Embedded Per File

| File | Probe Type | Steps |
|------|-----------|-------|
| `skills/verify/SKILL.md` | Full B1+B2 | Project detection → index.json → stories.json fallback → write STATE.md |
| `skills/design/SKILL.md` | B1 only | Project detection → storybook_project flag → stub emission decision |
| `agents/design-context-builder.md` | Uses STATE.md result | Reads `storybook:` status from STATE.md; re-fetches index.json directly |

---

## index.json Grouping Logic (design-context-builder)

```
entries → filter type === "story" → group by title
  → for each unique title:
       collect all name values (story variants)
       record importPath (stories file)
  → emit as: Component: <title> / States: <name1>, <name2>, ...
```

## A11y Report Reading Logic (design-verifier)

```
read .design/storybook-a11y-report.txt
  → for each test failure:
       extract axe-core rule name
       match story → component via title field
       record A11Y-STORY entry in DESIGN-VERIFICATION.md
  → count violations per component
       3+ violations → HIGH PRIORITY flag
  → classify VIOLATIONS vs INCOMPLETE
```

---

## Deviations from Plan

None — plan executed exactly as written.

The only observation: `agents/design-verifier.md` had already been modified by plan 08-03 (Chromatic Delta Narration section and `connections/chromatic.md` in Required Reading were present). The Storybook additions were inserted cleanly alongside those changes with no conflicts.

---

## Known Stubs

None. All Storybook integration points are fully documented behavioral instructions to the agents/stages that will execute them. No hardcoded empty values or placeholder text in the created/modified files.

---

## Threat Flags

No new security-relevant surface introduced. The two threats in the plan's threat model are both accepted:
- `T-08-02-01`: `.design/storybook-a11y-report.txt` stays local (`.design/` is gitignored per project convention)
- `T-08-02-02`: `localhost:6006` is local dev server only; no cross-origin surface

---

## Self-Check: PASSED

All files confirmed present:
- FOUND: connections/storybook.md
- FOUND: skills/verify/SKILL.md
- FOUND: skills/design/SKILL.md
- FOUND: agents/design-context-builder.md
- FOUND: agents/design-verifier.md

All commits confirmed:
- 9948f85: feat(08-02): create Storybook HTTP connection spec
- 3bc7cd4: feat(08-02): wire Storybook probe into verify and design SKILL.md files
- d51c94b: feat(08-02): wire Storybook into design-context-builder and design-verifier agents
