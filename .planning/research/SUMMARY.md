# Research Summary: ultimate-design v3

**Synthesized:** 2026-04-17
**Source files:** STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md
**Confidence:** HIGH overall -- all findings grounded in direct codebase inspection of working v2.1.0

---

## Executive Summary

ultimate-design v3 has two distinct workstreams: (1) hardening the existing five-stage pipeline to work correctly across platforms and project layouts, and (2) adding three utility commands (style, darkmode, compare) that sit alongside but outside the pipeline. The v2 pipeline is architecturally sound -- the SKILL.md / reference file / artifact pattern is well-established and all new work follows it exactly. The risk is not architectural novelty but accumulated technical debt: cross-platform bash patterns in scan and verify produce silently wrong results on macOS and Windows, and several high-impact polish items (Tailwind-only support, non-src layouts) block real-world users right now.

The three new commands are lower complexity than they first appear, provided scope is tightly constrained. style is a terminal spec generator that reads pipeline artifacts and existing source files. darkmode is a focused grep audit that categorizes dark mode implementation quality -- it does not fix, it reports. compare is a delta presentation between two existing artifacts (DESIGN.md baseline score and DESIGN-VERIFICATION.md result) -- it requires no snapshot storage mechanism. The critical failure mode for each is scope creep: each has a simple viable version and a this-is-now-a-new-architecture version. Simple versions ship in v3; complex versions are post-v3.

The highest-risk single decision in v3 is the artifact naming convention for new commands. PITFALLS research is unambiguous: the DESIGN-*.md namespace must be reserved for pipeline stages; new commands use distinct prefixes (DARKMODE-AUDIT.md, STYLE-SPEC-[Component].md, COMPARE-REPORT.md). This decision must be made before any new SKILL.md is authored, because changing artifact names after the fact breaks every downstream reference.

---

## Key Findings (Top 7 Across All Dimensions)

**1. Silent grep false-negatives are the most dangerous existing bug.**
All grep patterns using \| alternation (GNU-only) match nothing on macOS BSD grep and some Windows Git Bash versions. The 2>/dev/null suppressor hides the failure. Result: an A grade on a broken codebase. This is live in production for every non-Linux user today.

**2. The three new commands are utilities, not pipeline stages -- that distinction is load-bearing.**
style, darkmode, and compare must not appear in the pipeline progress bar, must not gate or block stages, and must produce artifacts with distinct non-DESIGN- prefixes. The root SKILL.md router state machine reads artifact presence to determine pipeline position; naming collisions corrupt it silently.

**3. Polish must precede new commands -- three HIGH-impact items block real user segments right now.**
Non-src layout detection (Next.js App Router, Remix, SvelteKit) and Tailwind-only project handling are not edge cases -- they are now the majority of new projects. Users hitting these get broken baseline audits with no recourse.

**4. Scan and verify share duplicated grep patterns with no shared source.**
Any fix to scan grep patterns that does not simultaneously apply to verify makes the before/after delta metric wrong. The delta is the core value proposition. This must be treated as a co-edit constraint throughout the polish phase.

**5. Each new command has a simple viable version and a complex version -- scope gates are critical.**
compare needs no snapshot mechanism (delta between existing artifacts). darkmode is an audit only, not a fix. style has two modes (post-pipeline and scan-only) that must both be specified before authoring. Failure to scope tightly before writing produces SKILL.md thrash.

**6. Root SKILL.md router updates must be atomic with new command creation.**
The router dispatch table has three locations that must all be updated: argument-hint frontmatter, Command Reference table, and Jump Mode section. Missing any one causes the new command to silently fall through to the scan-not-found suggestion.

**7. No new reference files or architectural changes are required for v3.**
All three new commands read from existing reference/ files. No new tools, no new dependencies, no schema changes to existing pipeline artifacts (except adding schema: 2 to DESIGN.md frontmatter as a format guard for compare). v3 is additive within the existing architecture.

---

## Recommended Stack / Patterns

No new stack decisions. v3 uses the confirmed-working v2 patterns throughout:

| Layer | Pattern | Notes |
|-------|---------|-------|
| New skills | skills/name/SKILL.md | Must be in subdirectory -- flat placement not found by plugin.json |
| Reference files | Read-only, explicitly loaded at skill start | No new reference files required for new commands |
| Artifacts | .design/ directory, distinct prefix per command | Pipeline owns DESIGN-*.md; utilities use distinct prefixes |
| Bash patterns | git ls-files + grep -E | Replace all \| alternation across all SKILL.md files |
| Plugin validation | claude plugin validate . after every structural change | Gate before any content work on new skills |
| Bootstrap | set -u, fallback log, true on hook invocation | No set -e; hook failure must not block session start |
| Parallel agents | isolation worktree, fully self-contained prompts | New commands using parallel mode must use own task file namespace |

---

## Phase Order Implications

### Phase 1 -- Repository Hygiene + Platform Foundation

Fix the preconditions that make all other work reliable. Must come first because every subsequent phase touches bash patterns and SKILL.md files.

- Add .gitattributes (*.md text eol=lf, *.json text eol=lf) and renormalize
- Normalize bootstrap.sh Windows path handling; ensure hook failure never blocks plugin load
- Fix all \| alternation to -E with | across scan/SKILL.md and verify/SKILL.md simultaneously
- Establish and document the artifact naming convention before any SKILL.md authoring

Delivers: Reliable foundations; all platform users get correct results.
Pitfalls avoided: 1, 2, 3, 4, 10.

### Phase 2 -- Pipeline Polish (HIGH-impact backlog items only)

Fix what blocks real-world user segments. Nice-to-haves deferred to post-v3.

- scan + verify: non-src layout detection (Next.js App Router, Remix, SvelteKit) -- edit together, never in isolation
- discover: Tailwind-only project handling (no CSS source files -- skip CSS grep, use config analysis)
- discover: embed 3 universal gray area questions as concrete checklist (font-change risk, token-layer intro, rebuild vs restyle)
- design: oklch coverage in color guide (resolve contradiction with BAN-05/SLOP-03)
- design: component task execution guide (reduce parallel agent improvisation)
- scan: DESIGN-DEBT.md dependency ordering with explicit 5-7 rules table

Delivers: Correct results for majority of real projects.
Pitfalls avoided: 5, 14, 15, 16.
Research flag: No deep research needed. Apply the three-bucket test (SKILL.md / reference file / bootstrap.sh -- if none of these handle it, it is a feature not polish).

### Phase 3 -- New Commands: style + darkmode (parallel build)

Both can be built in parallel. Both require Phase 1 and Phase 2 complete.

style:
1. Define STYLE-SPEC-[Component].md output schema with concrete example first
2. Write SKILL.md with two explicit modes: post-pipeline (reads DESIGN-SUMMARY.md) and scan-only (reads DESIGN.md + source file directly)
3. Reference files: typography.md, heuristics.md (H-08)
4. Update root SKILL.md routing atomically

darkmode:
1. Write expanded grep patterns for dark-context selectors (.dark *, data-theme=dark, prefers-color-scheme)
2. SKILL.md structure: Phase 1 detect category (none / media-query / semantic-token), Phase 2 category-specific checks, Phase 3 produce findings
3. Output: DARKMODE-AUDIT.md with dark_mode_present, score/10, findings, P0-P3 fix list
4. Update root SKILL.md routing atomically

Pitfalls avoided: 6, 7, 12; hidden complexity underestimation for both commands.

### Phase 4 -- New Command: compare (after Phase 2 scan polish lands)

Must wait because compare couples to DESIGN.md schema stability.

1. Add schema: 2 field to scan/SKILL.md DESIGN.md output
2. Scope: delta between DESIGN.md baseline score + DESIGN-VERIFICATION.md final score (no snapshot mechanism)
3. Add argument handling for explicit snapshot diffs when user provides paths
4. Produces: COMPARE-REPORT-[label].md with 7-category table, token changes, anti-pattern delta, narrative summary
5. Update root SKILL.md routing atomically

Pitfalls avoided: 11, 13; hidden complexity for compare.

### Phase 5 -- Validation + Version Bump

Final integration. Only after all commands exist and plugin validate passes clean.

- claude plugin validate . must pass clean
- Smoke test all 5 pipeline stages + 3 new utilities on a real project (Windows Git Bash)
- Bump plugin.json version to 3.0.0
- Update marketplace.json description to current architecture
- Bootstrap idempotency test (run twice, second run exits 0 with no output)

Pitfalls avoided: 9.

---

## Critical Pitfalls to Avoid

Ranked by consequence severity:

| Rank | Pitfall | Consequence | Fix |
|------|---------|-------------|-----|
| 1 | \| alternation in grep (GNU-only) | False clean audits on macOS/Windows | -E flag on every grep with alternation; test on Windows before commit |
| 2 | Scan/verify grep divergence | Before/after delta metric wrong | Always edit scan and verify together; diff their grep commands before any commit |
| 3 | Artifact naming collision with DESIGN- prefix | Router state machine corrupted silently | Establish naming convention in Phase 1; utilities never use DESIGN- prefix |
| 4 | Root SKILL.md router not updated atomically | New command silently falls through to scan suggestion | Router update is part of the command task, never a follow-up |
| 5 | compare with no snapshot mechanism | Command is useless without two things to compare | Scope compare to delta between existing DESIGN.md + DESIGN-VERIFICATION.md |
| 6 | style invoked before pipeline runs | Empty or meaningless output with no error | Two explicit modes (post-pipeline, scan-only) specified before authoring |
| 7 | Scope creep in polish phase | Phase runs 3x longer, introduces unvalidated content | Written acceptance criterion before touching any file; one backlog item = one commit |

---

## Open Questions (Need Resolution Before Planning)

1. Artifact naming convention -- Confirm exact filenames for new command outputs before any SKILL.md is written. Proposed: DARKMODE-AUDIT.md, STYLE-SPEC-[Component].md, COMPARE-REPORT-[label].md. Verify against current root SKILL.md state detection logic.

2. compare input model -- Is v3 scope limited to delta between scan baseline score and verify final score? Or is multi-snapshot comparison required? If multi-snapshot: the naming convention and creation mechanism must be specced before the phase begins.

3. style two-mode requirement -- Define the full fallback chain: what happens when DESIGN-SUMMARY.md exists / when only DESIGN.md exists / when neither exists. All three cases must be handled explicitly in the SKILL.md.

4. oklch content phase assignment -- Fixing the BAN-05/SLOP-03 contradiction in design/SKILL.md belongs in Phase 2 (before it affects darkmode users). Confirm this is Phase 2 scope, not deferred to Phase 3.

5. Nice-to-have backlog scope gate -- Explicitly decide which of the ~10 nice-to-have polish items (variable fonts, spring physics, visual hierarchy grep patterns, --research mode) are committed for v3 vs. explicitly post-v3. No ambiguity = no scope creep.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Plugin structure (plugin.json, hooks.json, SKILL.md schema) | HIGH | Read from working production files |
| Cross-platform bash failure modes | HIGH | Issues confirmed in production files; patterns are known |
| New command feature scope | HIGH | Derived from existing reference files and polish_backlog.md |
| New command architecture placement | HIGH | Confirmed from v2 patterns and PROJECT.md requirements |
| Pitfall identification (structural) | HIGH | Read directly from code |
| Pitfall identification (validator internals) | MEDIUM | Validator exact checks are inferred, not confirmed |
| Phase ordering | HIGH | Dependency analysis from confirmed codebase structure |
| compare simplest viable scope | MEDIUM | Research recommends scoped version; actual requirement may be broader |
| oklch dark mode thresholds | MEDIUM | 12-18% lightness range established; chroma desaturation ratio is directional |