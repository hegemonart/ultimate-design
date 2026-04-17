# Pitfalls Research: Plugin Polish & Expansion

**Project:** ultimate-design v3 (polish + style/darkmode/compare commands)
**Researched:** 2026-04-17
**Scope:** Cross-platform bash, skill regression, plugin validation, artifact compatibility, scope creep, hidden backlog complexity

---

## Cross-Platform Bash

### Pitfall 1: `grep` flag incompatibility between GNU grep (Linux/CI) and macOS/Windows Git Bash

**What goes wrong:** The scan and verify SKILL.md files use `-oh` (output only, no filename), `-rln` (recursive, list filenames, no line numbers), and patterns like `\|` (GNU alternation) extensively. On macOS, the system grep is BSD grep — `\|` for alternation requires `-E` or the pattern silently matches nothing. On Windows Git Bash, the grep binary varies by Git for Windows version. The multi-directory invocations (`grep ... src/ styles/ app/`) silently produce empty output when a directory doesn't exist rather than erroring.

**Why it happens:** Skills were written and tested on a single platform. The `2>/dev/null` suppressor that hides "no such file" errors also hides platform-incompatibility errors. Grep returns 0 or 1 (match/no match) — a pattern that matches nothing looks identical to a clean codebase.

**Consequences:** scan reports zero violations on a project that has many. verify gives a falsely clean score. The user sees an A grade on a broken codebase and trusts it.

**Warning signs:**
- Any grep command using `\|` alternation without `-E`
- Directory arguments that may not exist on target projects (`src/`, `styles/`)
- `2>/dev/null` silencing stderr on the same line as a pattern that has never been cross-platform tested
- The `grep -roh "oklch([^)]*)\|hsl([^)]*)"` pattern in scan Step 2 — `\|` works on GNU grep only

**Prevention:**
- Use `-E` (extended regex) flag on every grep that uses `|` alternation — `grep -rEoh "oklch\([^)]*\)|hsl\([^)]*\)"` works on both GNU and BSD
- Test-substitute multiple directories as fallbacks using subshells: `{ grep ... src/ 2>/dev/null; grep ... app/ 2>/dev/null; } | sort | uniq`
- Never use `\|` in POSIX BRE context; always use `-E` and `|`
- Add a "platform smoke test" comment block to scan SKILL.md showing expected output format for each command

**Phase:** Polish — scan/SKILL.md (P0 before any other polish work; broken grep = broken scoring = broken everything downstream)

---

### Pitfall 2: Windows path separators in bootstrap.sh

**What goes wrong:** `bootstrap.sh` uses `$(dirname "$0")` and constructs `PLUGIN_ROOT` with forward slashes. On Windows Git Bash this works for most operations, but `git -C "${target}"` and `diff -q "${MANIFEST}" "${MARKER}"` can receive mixed-separator paths when `CLAUDE_PLUGIN_ROOT` is set by the Claude runtime using Windows-style backslashes. The `set -u` at the top of bootstrap.sh means any unset variable causes immediate exit — if `CLAUDE_PLUGIN_DATA` is not set by the runtime, the script falls back to `$HOME/.claude/plugins/data/ultimate-design` which on Windows Git Bash resolves correctly, but only if `$HOME` is set (it may not be in all shell environments).

**Why it happens:** bootstrap.sh was written with Unix assumptions. The `git commit` failure logged in the session memory (gsd-tools.cjs commit command fails with multi-word messages) suggests the Windows shell environment already has quoting and argument-passing issues.

**Consequences:** Bootstrap silently fails, `awesome-design-md` is not cloned, and any skill functionality that references it produces unexpected output. Because the marker file is never written, bootstrap re-runs every session, slowing startup.

**Warning signs:**
- `CLAUDE_PLUGIN_ROOT` contains backslashes when echoed inside the script
- `diff` returns non-zero on a file that hasn't changed
- The marker file is never created despite successful-seeming output

**Prevention:**
- Normalize path at top of bootstrap: `PLUGIN_ROOT="${PLUGIN_ROOT//\\//}"` (replace backslashes with forward slashes)
- Add an explicit `$HOME` guard: `HOME="${HOME:-/c/Users/$(whoami)}"` before using it
- Test bootstrap on Windows by running `bash scripts/bootstrap.sh` directly from Git Bash before committing any changes
- The `set -u` is good but add `set -e` or explicit error handling so failures surface rather than silently continuing

**Phase:** Polish — scripts/bootstrap.sh (address before v3 ships; failure is silent and session-persistent)

---

### Pitfall 3: `find` command differences on Windows

**What goes wrong:** scan SKILL.md Step 6 uses `find src/ app/ -name "*.tsx" -o -name "*.jsx" -o -name "*.vue"` — the `-o` without parentheses creates operator precedence issues on some find implementations, and the multi-path form (`find path1 path2 ...`) is not supported by Windows' native `find.exe`. Git Bash ships its own find, but if a user's PATH resolves Windows find first, the output is garbage (Windows find is a string search tool, not a filesystem search).

**Warning signs:** find outputs lines that look like `FILE NOT FOUND` or reports 0 files on a populated project.

**Prevention:**
- Always parenthesize compound `-o` expressions: `find src/ app/ \( -name "*.tsx" -o -name "*.jsx" \)`
- Add a guard at the top of scan's bash sections: `which find | grep -v /c/Windows` (fail fast if wrong find)
- Alternatively replace multi-path find with a loop: `for dir in src app; do [ -d "$dir" ] && find "$dir" ...; done`

**Phase:** Polish — scan/SKILL.md Step 6 (component inventory)

---

### Pitfall 4: Line ending contamination in SKILL.md parsed content

**What goes wrong:** On Windows with Git's `autocrlf=true`, SKILL.md files checked out have `\r\n` line endings. When Claude reads these files via `${CLAUDE_PLUGIN_ROOT}/reference/...` path references and the content is embedded in bash heredocs or compared with expected strings, the `\r` creates invisible mismatches. This is unlikely to break skill execution (Claude processes the markdown as text), but it breaks `claude plugin validate .` if the validator reads frontmatter with strict YAML parsing that chokes on `\r`.

**Warning signs:** `claude plugin validate .` fails with a YAML parse error despite frontmatter looking correct in a text editor.

**Prevention:**
- Add `.gitattributes` at repo root: `*.md text eol=lf` and `*.json text eol=lf`
- Run `git add --renormalize .` after adding the attribute
- Verify with `file SKILL.md` — should show "ASCII text" not "ASCII text, with CRLF line terminators"

**Phase:** Polish — repository hygiene (do this first, before touching any skill content)

---

## Skill Regression

### Pitfall 5: Fixing scan grep patterns breaks verify (duplication without a shared source)

**What goes wrong:** The grep commands in scan/SKILL.md Step 5 (Anti-Pattern Audit) and verify/SKILL.md Phase 1 (Re-Audit) are duplicated verbatim. When scan's patterns are fixed for cross-platform compatibility (adding `-E`, normalizing alternation), the verify skill retains the old broken patterns. The verify score then differs from what scan would produce on the same codebase — the "before/after delta" that is the core value proposition of the pipeline becomes unreliable.

**Why it happens:** The backlog explicitly notes "Phase 1 re-audit uses same bash commands as scan — could import or reference scan logic rather than duplicating." The duplication is a known debt item that becomes a regression vector the moment either file is edited independently.

**Consequences:** A "design improvement" session that fixes BAN violations shows zero improvement in verify because verify's grep pattern is different from scan's and catches different things. The delta metric is wrong.

**Warning signs:**
- Editing grep patterns in scan/SKILL.md without a corresponding search for the same pattern in verify/SKILL.md
- Verify scoring an `outline: none` violation that scan didn't catch (or vice versa)
- The verify Phase 1 script uses `src/` hardcoded while scan's version was updated to check `src/ app/ lib/`

**Prevention:**
- After any grep pattern change in scan, immediately grep for the same pattern string in verify and update it
- Create a regression check list: before merging any SKILL.md change, run `diff <(grep "grep -r" skills/scan/SKILL.md) <(grep "grep -r" skills/verify/SKILL.md)` and explain every difference
- Long-term: extract shared grep patterns into a `reference/grep-patterns.md` file that both skills reference (this is an architectural fix, but the reference file approach is already established)

**Phase:** Polish — scan/SKILL.md and verify/SKILL.md must be edited together, never in isolation

---

### Pitfall 6: Adding a new command breaks the root SKILL.md router

**What goes wrong:** The root SKILL.md router explicitly lists every valid command in its `argument-hint`, `Command Reference` table, and `Jump Mode` section. Adding `style`, `darkmode`, or `compare` without updating all three locations means the router silently falls through to "no DESIGN.md → suggest scan" instead of routing to the new skill.

**Why it happens:** The router is a manually maintained dispatch table. There is no validation that the listed commands match the skills that actually exist.

**Consequences:**
- `/ultimate-design style` routes to scan suggestion instead of the style skill
- Status display shows the wrong pipeline state
- New commands work if invoked directly (`/ultimate-design:style`) but not through the router

**Warning signs:**
- New SKILL.md file created under `skills/` but root SKILL.md `argument-hint` still reads `[scan|discover|plan|design|verify|status]`
- Jump Mode section has no entry for the new command

**Prevention:**
- Treat root SKILL.md as the integration test for new commands — update it as part of the same task that creates the new SKILL.md, not as a separate cleanup task
- Add a validation step to the "add new command" checklist: search root SKILL.md for every place the command list appears and update all of them atomically
- The `argument-hint` must match the actual skills registered in `plugin.json`'s `skills` paths

**Phase:** New commands — each new command task must include a root SKILL.md update subtask

---

### Pitfall 7: New commands produce artifacts that confuse the pipeline router's state detection

**What goes wrong:** The router infers pipeline state by checking for specific artifact files (DESIGN-CONTEXT.md, DESIGN-PLAN.md, DESIGN-SUMMARY.md, DESIGN-VERIFICATION.md). New standalone commands like `style`, `darkmode`, and `compare` produce their own artifacts. If those artifact filenames collide with pipeline stage artifacts, or if the router doesn't know to ignore them, the state machine routes incorrectly.

**Example:** `darkmode` produces a `DESIGN.md` update (or a `DARK-DESIGN.md`). If it writes to `DESIGN.md` at project root, the router interprets this as "scan has run, proceed to discover" even on a project that hasn't been scanned.

**Warning signs:**
- Running `/ultimate-design` (no args) after running `style` shows wrong pipeline state
- Router suggests "run discover" when you just ran `darkmode`

**Prevention:**
- New commands must write artifacts with distinct, prefixed names: `style` → `.design/STYLE-SPEC.md`, `darkmode` → `.design/DARKMODE-AUDIT.md`, `compare` → `.design/COMPARE-REPORT.md`
- None of these names appear in the router's state detection logic (already true for the current router)
- Establish a convention now: `DESIGN-*.md` namespace is reserved for pipeline stages; new commands use unique non-`DESIGN-` prefixes
- Document this convention in `reference/review-format.md` or a new `reference/artifact-schema.md`

**Phase:** New commands — artifact naming must be decided before any new SKILL.md is written

---

## Plugin Validation

### Pitfall 8: `claude plugin validate` fails silently on frontmatter issues

**What goes wrong:** Each SKILL.md has a YAML frontmatter block (`name`, `description`, `argument-hint`, `user-invocable`). Validation checks that these fields are present and correctly typed. Common failures:
- `description` value contains an unescaped colon (YAML interprets it as a key-value separator)
- `argument-hint` contains square brackets that need quoting: `[scan|discover]` is valid YAML unquoted, but `[--quick] [--full]` with spaces inside brackets may parse as a YAML sequence
- A new SKILL.md is created but not reachable from the `skills` paths in `plugin.json` (`"./", "./skills/"`) — validate may pass but the skill is never loadable

**Warning signs:**
- `claude plugin validate .` passes but the new command is not listed when asking Claude what skills are available
- Description field is truncated at the colon

**Prevention:**
- Always double-quote `description` and `argument-hint` values in frontmatter
- Run `python3 -c "import yaml; yaml.safe_load(open('SKILL.md').read().split('---')[1])"` as a quick frontmatter sanity check (no Python dependency on the plugin, just a dev-time check)
- New command SKILL.md files must go into `./skills/<command>/SKILL.md` — this is the path pattern already registered in `plugin.json`. A file at `./skills/style.md` (flat) would not be found.
- After adding a new skill directory, verify it appears in `claude plugin validate .` output before doing any content work

**Phase:** New commands — validate after creating the file skeleton, before filling content

---

### Pitfall 9: `plugin.json` version not bumped breaks marketplace expectations

**What goes wrong:** The `plugin.json` still reads `"version": "2.1.0"`. If v3 ships without bumping the version, users who have the plugin installed will not receive an update prompt. The `marketplace.json` still references v1 metadata and a completely different description ("Master design orchestration skill" referencing sub-skills that no longer exist) — this is a latent mismatch that could confuse the install flow.

**Warning signs:**
- `marketplace.json` describes v1 routing behavior ("routes to impeccable, emil-design-eng, anthropic-skills")
- `plugin.json` version is unchanged after new commands ship

**Prevention:**
- Bump `plugin.json` version as part of the validation task (the last task in v3)
- Update `marketplace.json` description to match current v2/v3 architecture
- These two files must be kept in sync — treat them as a pair

**Phase:** Validation — final task before tagging v3.0.0

---

### Pitfall 10: `hooks.json` bash command fails on Windows and breaks plugin load

**What goes wrong:** The hooks.json SessionStart hook runs `bash "${CLAUDE_PLUGIN_ROOT}/scripts/bootstrap.sh"`. On Windows, if `bash` is not in PATH (the user hasn't installed Git Bash or WSL), this fails. But more subtly: even with Git Bash installed, `CLAUDE_PLUGIN_ROOT` may contain a Windows-style path (`D:\AI\ultimate-design`) that bash cannot interpret. The hook failure may prevent the plugin from loading or simply log a silent error.

The `git commit` failure noted in the session memory (multi-word message issue) is a symptom of the same environment: the shell quoting behavior in the Claude runtime's subprocess differs from interactive Git Bash.

**Warning signs:**
- bootstrap.sh does not produce its marker file after plugin install
- `[ultimate-design bootstrap]` lines never appear in session startup output

**Prevention:**
- Add a `|| true` at the end of the hook command so bootstrap failure does not block plugin load: `bash "${CLAUDE_PLUGIN_ROOT}/scripts/bootstrap.sh" || true`
- This is already somewhat handled by the `|| log "... (continuing)"` inside bootstrap, but the outer hook invocation itself should not hard-fail
- Test by temporarily corrupting bootstrap.sh and verifying the plugin still loads

**Phase:** Polish — scripts/bootstrap.sh (before v3 ships)

---

## Artifact Compatibility

### Pitfall 11: New commands consuming DESIGN.md without validating its format version

**What goes wrong:** The `compare` command's purpose is to diff DESIGN.md snapshots over time. The `darkmode` command reads the existing DESIGN.md to understand the current color system. Both commands assume DESIGN.md was produced by the current scan skill. But DESIGN.md has no schema version in its frontmatter — a DESIGN.md produced by the old v1 scanner has completely different section headers (v1 used "Design System Audit" format; v2 uses "Design System Snapshot" with a weighted score table).

**Consequences:** `compare` tries to extract the score table from a v1 DESIGN.md, fails silently, and produces a meaningless diff. `darkmode` reads the wrong section for color data.

**Warning signs:**
- DESIGN.md frontmatter has no `tool: ultimate-design scan` field (v1 files won't have this)
- Score table section is missing or has different column names

**Prevention:**
- Add a frontmatter field to DESIGN.md output: `schema: 2` (scan skill writes this; new commands check for it)
- New commands that read DESIGN.md must include a format guard at the top: if `schema` field is absent or < 2, warn the user and offer to re-scan
- The `compare` command specifically must handle the case where two snapshots have different schemas

**Phase:** New commands — design the DESIGN.md format guard before writing any new SKILL.md

---

### Pitfall 12: Parallel agents writing to `.design/tasks/` collide on file naming

**What goes wrong:** In `--parallel` mode, design/SKILL.md spawns multiple agents that each write `.design/tasks/task-NN.md`. The task number `NN` is determined by the plan order. If two parallel agents simultaneously attempt to write `task-01.md` because both are assigned task number 01 in their respective plan sections, one overwrites the other. More subtly: agents writing to `DESIGN-SUMMARY.md` in the final wave may race if a user accidentally uses `--parallel` on wave 2 tasks.

**Why it happens:** The plan explicitly marks `Parallel: true/false` per task, and only Wave 1 runs in parallel. But the naming conflict only matters if plan generation assigns the same task number to two tasks — which can happen if a new command's parallel mode reuses the `task-NN` naming convention.

**Warning signs:**
- `task-01.md` exists but its content references a different task than expected
- DESIGN-SUMMARY.md is shorter than expected (truncated by a race-condition overwrite)

**Prevention:**
- New commands that support parallel mode must use a distinct task file prefix: `style` command → `.design/tasks/style-NN.md`, not `task-NN.md`
- The design skill's existing `Touches:` conflict detection prevents this for the main pipeline, but new commands are outside that system
- Document the namespace convention: `task-NN.md` is owned by the design skill; all other commands use `<command>-NN.md`

**Phase:** New commands — any command implementing parallel execution must establish its own task file namespace

---

### Pitfall 13: The `compare` command assumes DESIGN.md is at project root, but scan writes it there while the pipeline writes to `.design/`

**What goes wrong:** scan writes `DESIGN.md` at the project root. All pipeline stage artifacts (DESIGN-CONTEXT.md, DESIGN-PLAN.md, etc.) go into `.design/`. The `compare` command is supposed to "diff DESIGN.md snapshots over time" — but what exactly is it diffing? If a user re-runs scan, DESIGN.md is overwritten in place. There is no built-in snapshot/versioning mechanism.

**Consequences:** compare has no snapshots to compare unless it creates them, but nothing in the current pipeline creates them. The command either does nothing useful or has to create its own snapshot mechanism, which is significantly more complex than "diff two files."

**Warning signs:** This is a design gap, not a runtime error — it will surface during SKILL.md authoring when you try to specify what inputs compare reads.

**Prevention:**
- Define compare's inputs before writing the SKILL.md: does it compare (a) current DESIGN.md vs a committed version from git history? (b) DESIGN.md vs DESIGN-VERIFICATION.md scores? (c) user-provided snapshot vs current state?
- The simplest viable version: compare reads current DESIGN.md scores vs the scores recorded in DESIGN-VERIFICATION.md (these exist in the normal pipeline flow). This requires no separate snapshot mechanism.
- Avoid designing compare to require a snapshot store — that's a new architectural feature, not a new command

**Phase:** New commands — resolve compare's input model in planning before any implementation

---

## Scope Creep During Polish

### Pitfall 14: Each polish item touching a reference file triggers "while I'm here" expansion

**What goes wrong:** The backlog lists adding a "pick-by-brand-archetype quick guide" to typography.md. The natural instinct while editing typography.md is to also add the variable fonts section, reorganize the font pairing list, update the modular scale table, and add Google Fonts URLs. Each addition is individually justified, but together they make the edit 10x larger and introduce new content that hasn't been validated against the design philosophy.

**Why it happens:** Reference files are rich and interconnected. Improving one section reveals adjacent gaps. Polish phases have no hard boundary on what "done" means for a reference file.

**Warning signs:**
- A reference file edit touches more than 2 distinct sections
- New content is added that was not on the backlog
- The edit takes longer than 30 minutes for what was listed as a "quick win"

**Prevention:**
- Write an acceptance criterion for each backlog item before starting: "typography.md: add brand-archetype guide (≤ 1 new section, ≤ 20 lines). Done = a new user can pick a font in < 2 minutes without reading the whole file."
- Use the SKILL.md philosophy as the scope gate: does this addition give specific, measurable guidance? If it's general advice, it doesn't belong.
- Treat reference file polish as atomic commits: one backlog item = one commit. This forces scope discipline.

**Phase:** Polish — reference files (apply to every reference file change)

---

### Pitfall 15: Polish phase expanding into new feature development

**What goes wrong:** The backlog item "Component inventory false-positive rate reduced (beyond grep -rln primitives)" has no clear stopping point. Improving grep patterns leads naturally to "what if we used AST-based analysis?" which leads to "what if we added a Node.js script?" which breaks the zero-dependency constraint.

The project constraint is explicit: zero external dependencies. A sophisticated component detection approach that requires a Node.js dependency, a separate AST tool, or any install step violates the core value proposition.

**Warning signs:**
- A polish task requires a new file type that doesn't currently exist in the repo (a `.js` script, a config file, a package.json)
- The word "we could add a tool that..." appears in the implementation notes
- The fix requires the user to install something

**Prevention:**
- Every polish task answer must be satisfiable with: (a) a change to SKILL.md instructions, (b) a change to reference file content, or (c) a change to bootstrap.sh. If none of these work, the item is a feature, not polish.
- The "component false-positive rate" item specifically: the fix is better grep patterns and better LLM instructions for interpreting grep output — not a new tool.

**Phase:** All polish tasks — apply the three-bucket test before starting any polish item

---

### Pitfall 16: `--research` mode resurrection without clear scope boundary

**What goes wrong:** The backlog item "plan/SKILL.md: --research mode re-evaluated" is open-ended. Research mode was removed in v2 for a reason (likely complexity or dependency on external tools). Re-adding it without a clear scope definition will expand plan/SKILL.md significantly and potentially re-introduce the dependency problem research mode had in v1.

**Warning signs:**
- The --research discussion leads to "we could use WebSearch to pull competitor benchmarks"
- The mode requires a new reference file or a new external call

**Prevention:**
- Resolve the scope question in planning before touching plan/SKILL.md: define what research mode does in ≤ 3 sentences, what inputs it takes, what it outputs, and what it does NOT do
- If the answer requires external tools or MCP calls, treat it as a future milestone item, not v3 polish
- If the answer is "it reads awesome-design-md and pulls archetype patterns," that's scoped and viable

**Phase:** Polish — plan/SKILL.md (requires a decision gate before implementation)

---

## Hidden Complexity in Backlog Items

### Item: "Concrete gray areas checklist embedded in discover/SKILL.md"

**Looks like:** 30-minute edit — add a checklist section to discover SKILL.md.

**Actually:** Defining the gray area checklist requires knowing which gray areas are universally applicable vs project-specific. Font-change risk depends on whether there's a brand guideline. Token-layer introduction risk depends on the team's engineering capacity. These are not checkboxes — they are conditional decision trees. Writing them as a concrete checklist without the conditions produces false confidence. The effort is 2–4 hours if done correctly.

**Hidden complexity:** The "one focused question per area" philosophy in design_philosophy.md means the gray area checklist must not itself become a 10-question interrogation. Deciding which gray areas to surface as a single focused question for each is the hard problem.

**Mitigation:** Limit the checklist to 3 universal gray areas (font-change risk, token-layer introduction risk, component rebuild vs restyle are the three already named in the backlog). Write each as a single yes/no question with a branch: "If yes, resolve before planning." No more than 6 lines per gray area.

---

### Item: "DESIGN-DEBT.md dependency ordering uses concrete logic"

**Looks like:** Clarify the description in scan SKILL.md Step 8.

**Actually:** Dependency ordering in a design system is a partial order problem. The correct order is: accessibility blockers → token layer → typography scale → color semantics → component fixes → motion polish. But this ordering has exceptions (if there's no token layer, color fixes go before token layer, not after). Writing concrete logic means writing a decision tree with multiple conditionals, not a simple ordered list. Effort: 1–2 hours.

**Hidden complexity:** The effort/severity matrix already exists in Step 8. The missing piece is the cross-item dependency logic: "fix X before Y because Y's implementation depends on X having been done." This requires 4–6 explicit dependency rules in the form "if [condition], fix [A] before [B]."

**Mitigation:** Write exactly 5–7 explicit dependency rules as a table (Prerequisite → Dependent → Condition). Do not attempt a general algorithm — the 5–7 most common cases cover 90% of real projects.

---

### Item: "NNG heuristics that require visual inspection flagged as `? VISUAL`"

**Looks like:** Find 2–3 heuristics in verify/SKILL.md and add a flag to them.

**Actually:** H-02 (match between system and real world), H-06 (recognition vs recall), and H-07 (flexibility/efficiency) all require running the application. But H-04 (consistency and standards) also partially requires visual inspection. H-08 (aesthetic and minimalist design) is entirely visual. Correctly identifying every heuristic that needs `? VISUAL` vs every one that can be inferred from code requires reading all 10 heuristic definitions in reference/heuristics.md and making a judgment call for each. Effort: 1 hour.

**Hidden complexity:** The flag needs a protocol, not just a label. `? VISUAL` means "skip automated scoring; score this during the visual UAT walk in verify Phase 3." The verify SKILL.md Phase 3 UAT section needs to explicitly reference all `? VISUAL` flagged heuristics. This is two edits, not one.

**Mitigation:** Do both edits atomically: (1) add `? VISUAL` flags to verify/SKILL.md heuristic scoring section, (2) add a "Visual-only heuristics" subsection to Phase 3 UAT that lists them by ID. Test: can a new user find all visual-only heuristics in under 30 seconds?

---

### Item: "`style` command — component-level design specs / developer handoff"

**Looks like:** New command, similar complexity to scan.

**Actually:** This command existed in v1 as "design:design-handoff" and was removed. The reason it was removed is not documented. Possible reasons: (1) it required sub-skills that no longer exist, (2) its output format had no clear consumer, (3) it was too broad. Before writing the SKILL.md, determine what "developer handoff" means in this pipeline's context — is it a Figma-ready spec? A CSS custom property sheet? A component API document? Each answer produces a completely different skill.

**Hidden complexity:** Developer handoff typically requires knowledge of what the developer's stack and toolchain is (React? Vue? Web Components?), which is not captured in the current DESIGN-CONTEXT.md format. The skill may need to add a new discovery question to discover/SKILL.md or read a new artifact field.

**Mitigation:** Define the output format first, in concrete terms (show an example of what the output document looks like). Only then write the SKILL.md. If the output requires new inputs from discover, scope that discover change into the same task.

---

### Item: "`darkmode` command — dedicated dark mode scan mode"

**Looks like:** New command, scoped subset of scan.

**Actually:** Dark mode audit is significantly harder than a color scan because dark mode correctness requires understanding color relationships (foreground/background pairs at each surface level), not just detecting individual color values. The BAN-05 rule (pure black) is easy to grep for, but "colors that are semantically correct in dark mode" requires understanding the token layer. A project using `hsl()` values with fixed lightness looks identical to one using semantic tokens — only the token layer tells you if dark mode will work correctly.

**Hidden complexity:** The `darkmode` skill needs to distinguish three categories: (1) projects with no dark mode at all, (2) projects with dark mode via CSS `prefers-color-scheme` media queries, (3) projects with dark mode via a token layer and class switching. The audit approach differs fundamentally across these three. This is 3x the complexity of a simple scan.

**Mitigation:** Scope darkmode to output a structured findings list, not a fix plan. Phase 1: detect which of the three categories applies. Phase 2: run category-specific grep checks. Phase 3: produce a `DARKMODE-AUDIT.md` with findings and recommended approach. Do not attempt to execute dark mode fixes — that belongs in design skill's color task type.

---

### Item: "`compare` command — diff DESIGN.md snapshots over time"

**Looks like:** Simple diff of two files.

**Actually:** As noted in Pitfall 13, there are no snapshots. The command needs to define what two things it is comparing. The simplest viable version (compare baseline audit score from DESIGN-CONTEXT.md vs final score from DESIGN-VERIFICATION.md) already exists implicitly — verify/SKILL.md already shows score delta if both files exist. If compare is just a better presentation of that delta, it may not be a full new command.

**Hidden complexity:** If compare reads git history to find old DESIGN.md versions (`git show HEAD~1:DESIGN.md`), it introduces a git dependency that may behave differently on Windows (path separators in git show, line endings in git output). If it requires the user to manually save snapshots, the UX is awkward.

**Mitigation:** Define compare as "show the score delta between scan baseline and verify result, with category-by-category breakdown and trend arrows." This is a presentation command that reads two existing artifacts — no snapshot mechanism needed. Scope it tightly: if both DESIGN.md (with baseline score in frontmatter) and DESIGN-VERIFICATION.md exist, produce the comparison. Otherwise: explain what's missing and how to generate it.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Polish scan/SKILL.md grep patterns | Cross-platform breakage (Pitfall 1, 3) | Fix grep flags first; run on Windows before committing |
| Polish verify/SKILL.md | Regression from scan divergence (Pitfall 5) | Edit scan and verify together, diff their grep commands before commit |
| Polish discover/SKILL.md | Gray area checklist scope creep (Pitfall 14, hidden complexity) | Limit to 3 universal gray areas, 6 lines each |
| Polish plan/SKILL.md | Research mode re-scope explosion (Pitfall 16) | Gate on written definition before touching the file |
| Polish reference files | While-I'm-here expansion (Pitfall 14) | One backlog item = one commit; pre-write acceptance criteria |
| New command: style | Unclear output format drives SKILL.md thrash (hidden complexity) | Define example output document first |
| New command: darkmode | 3-category complexity underestimated (hidden complexity) | Scope to audit-only, not fix |
| New command: compare | No snapshot mechanism exists (Pitfall 13) | Define as delta presentation between existing artifacts |
| All new commands | Root SKILL.md router not updated (Pitfall 6) | Router update is part of the command task, not a follow-up |
| All new commands | Artifact naming collision (Pitfall 7, 12) | Establish naming convention before writing any new SKILL.md |
| Plugin validation | Version/marketplace mismatch (Pitfall 9) | plugin.json + marketplace.json updated as pair in final task |
| bootstrap.sh on Windows | Path separators, silent failure (Pitfall 2, 10) | Normalize paths; add `|| true` to hook invocation |

---

*Sources: Direct analysis of ultimate-design codebase (scan/SKILL.md, verify/SKILL.md, discover/SKILL.md, plan/SKILL.md, design/SKILL.md, hooks/hooks.json, scripts/bootstrap.sh, .claude-plugin/plugin.json), polish_backlog.md, design_philosophy.md, PROJECT.md. Confidence: HIGH for structural/code-based pitfalls, MEDIUM for plugin validation specifics (based on known Claude Code plugin format requirements as of training cutoff).*
