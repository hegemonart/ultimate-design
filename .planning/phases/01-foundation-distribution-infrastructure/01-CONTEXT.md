# Phase 1: Foundation + Distribution + Infrastructure - Context

**Gathered:** 2026-04-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Clean up the plugin repo for user distribution (gitignore dev artifacts, remove them from tracking). Make all bash patterns cross-platform (POSIX `-E`, `.gitattributes`, bootstrap path normalization, non-src fallbacks). Introduce an explicit state machine (`.design/STATE.md`) that every pipeline stage reads and writes. Scaffold the `agents/` and `connections/` directories with authoring-guide READMEs that Phase 2+ will use.

This phase lays the foundation but does NOT build any agents or rewrite any pipeline stages — that's Phase 2+.

</domain>

<decisions>
## Implementation Decisions

### Distribution cleanup

- `.gitignore` additions: `.planning/`, `.claude/memory/`, `.claude/settings.local.json`
- Untracking strategy: `git rm --cached -r` (keeps history, stops tracking forward) — no history rewrite
- History-rewrite (filter-repo) explicitly rejected: history documents how the plugin was built and is safe to keep
- README.md gets a "Distribution" section documenting what ships vs what is development-only

### Cross-platform bash

- Grep pattern migration: `grep -E "a|b|c"` replaces `grep "a\|b\|c"` across all skills
- `.gitattributes` enforces LF for `*.md`, `*.sh`, and `*.json` files
- Bootstrap script path normalization: convert Windows paths to forward-slash style before string operations
- Apply same grep fixes in scan/SKILL.md AND verify/SKILL.md in one pass (they share duplicated patterns — fixing only one creates divergence)

### SCAN-04 fallback path priority

- Check order: `src/` → `app/` → `pages/` → `lib/`
- Rationale: `src/` covers Vite/CRA/traditional; `app/` covers Next.js 13+ and Remix; `pages/` covers Next.js pages router and SvelteKit; `lib/` is misc fallback
- Log matched path in DESIGN.md under `source_roots:` for transparency — reviewer can see what was audited

### State machine (`.design/STATE.md`)

- Format: **markdown with XML tags** (matches existing DESIGN-CONTEXT.md pattern — consistent artifact format across pipeline)
- Location: `.design/STATE.md` (pipeline runtime state) — completely separate from `.planning/STATE.md` (GSD development state)
- Sections: `<position>` (stage, wave, task_progress), `<decisions>` (locked from discover), `<must_haves>` (status tracking), `<connections>` (active MCPs for this run), `<blockers>`, `<timestamps>` (last_checkpoint, started_at)
- Write contract: every stage reads STATE.md at entry, updates at completion; resume detects mid-wave state and continues from last checkpoint
- Initialization: scan creates it if missing with a minimal skeleton; discover fills `<decisions>` and `<must_haves>`

### `agents/` directory README scope

- Rich — this is authoring documentation for 14 future agents
- Sections: frontmatter schema (name, description, tools, color, model), required_reading pattern, completion markers (analog to GSD's `## RESEARCH COMPLETE`, `## PLANNING COMPLETE`), how stages invoke agents (Task tool), and a worked example with placeholder agent
- Reference GSD's agent patterns directly — they're proven

### `connections/` directory

- `connections.md` index lists active (Figma, Refero) and future (Storybook, Linear, GitHub) connections
- Capability matrix: rows = connections, columns = stages (scan/discover/plan/design/verify/style/darkmode/compare), cells = what's used
- Extensibility guide: how to add a new connection — file format, detection pattern, where to wire it into stages
- `refero.md` moves from `reference/refero.md` → `connections/refero.md` (git mv to preserve blame)

### Claude's Discretion

- Exact wording of README files
- Specific grep pattern rewrites per file (will be derived from existing patterns)
- `.gitattributes` additional extensions beyond `*.md`, `*.sh`, `*.json`
- Order of plan execution within the phase (plans are mostly independent)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets

- `scripts/bootstrap.sh` — already has partial Windows path handling (`CLAUDE_PLUGIN_DATA`, `CLAUDE_PLUGIN_ROOT` resolution); needs extending, not rewriting
- `reference/refero.md` (112 lines) — full content preserved, just moves location
- `hooks/hooks.json` — already wires SessionStart to bootstrap; stays as-is
- `.gitignore` — exists with `.design/` + `.DS_Store`; additions only

### Established Patterns

- XML-tagged artifact sections: `<domain>`, `<decisions>`, `<must_haves>`, `<canonical_refs>` already used in DESIGN-CONTEXT.md — `.design/STATE.md` extends this pattern
- Zero-dependency skills: all design knowledge embedded in `reference/` — agents + connections must follow same zero-dependency rule
- Artifact naming: pipeline owns `DESIGN-*.md` namespace; utilities use distinct prefixes (DARKMODE-AUDIT.md, COMPARE-REPORT.md)

### Integration Points

- `SKILL.md` (root router) — will need a new status line section for "Pipeline State" once STATE.md exists (cosmetic, could defer)
- `scan/SKILL.md` — adds STATE.md creation after DESIGN.md
- `discover/SKILL.md`, `plan/SKILL.md`, `design/SKILL.md`, `verify/SKILL.md` — each gets STATE.md read-at-entry, write-at-exit contract (deferred to Phase 2 — stage rewrites)
- `.claude-plugin/plugin.json` — no changes this phase; version bump happens in Phase 6

### Grep Patterns to Migrate

- All occurrences of `\|` in skills/*/SKILL.md (to be replaced with `-E` flag + `|`)
- Duplicated patterns in scan/SKILL.md Step 5 AND verify/SKILL.md Phase 1 — must fix together

</code_context>

<specifics>
## Specific Ideas

- Follow GSD's STATE.md structure directly (the markdown-with-frontmatter + Current Position / Performance / Decisions / Blockers / Session Continuity sections) — but translate frontmatter to XML tags for consistency with our pipeline
- `agents/README.md` should read like a mini-spec — future sessions will use it as the authoring contract, not just a pointer
- Keep this phase lean: it's scaffolding, not feature work. No agents built here, no stage rewrites. Phase 2 owns the next step.

</specifics>

<deferred>
## Deferred Ideas

- Root SKILL.md status line for pipeline state — cosmetic, defer to Phase 2 or later
- Pipeline STATE.md ↔ GSD STATE.md cross-reference — if useful, add in Phase 6 polish
- Extension beyond `.md`/`.sh`/`.json` in `.gitattributes` — add as needed in later phases
- Agent completion marker registry as a standalone file — defer to Phase 2 when we have real markers to register

</deferred>

---

*Phase: 01-foundation-distribution-infrastructure*
*Context gathered: 2026-04-17*
