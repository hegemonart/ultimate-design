# Stack Research: Claude Code Plugin Dev

**Project:** ultimate-design v3
**Researched:** 2026-04-17
**Basis:** Direct inspection of working v2.1.0 codebase + plugin manifests. Web tools unavailable. All findings are HIGH confidence unless marked otherwise.

---

## Recommended Stack

### Plugin Manifest Layer

**plugin.json** — the authoritative plugin descriptor, lives in `.claude-plugin/plugin.json`.

Required fields confirmed in production:
```json
{
  "name": "ultimate-design",
  "version": "2.1.0",
  "description": "...",
  "author": { "name": "...", "url": "..." },
  "homepage": "...",
  "repository": "...",
  "license": "MIT",
  "keywords": [...],
  "skills": ["./", "./skills/"],
  "hooks": "./hooks/hooks.json"
}
```

`skills` is an array of paths. `"./"` means the root SKILL.md is a skill. `"./skills/"` means every subdirectory under `skills/` is its own skill (each must have a SKILL.md). This is the exact multi-skill layout currently working in v2.

**marketplace.json** — separate file in `.claude-plugin/`, used for marketplace submission. Do not conflate with `plugin.json`. The two files serve different purposes and have different schemas.

Confidence: HIGH (read from working production files).

---

### Skill Authoring Layer

**SKILL.md** — every skill is a single markdown file with a YAML frontmatter block followed by natural-language instructions for Claude.

Frontmatter fields confirmed in production:
```yaml
---
name: scan                          # kebab-case, unique within plugin
description: "..."                  # appears in skill picker, be specific
argument-hint: "[--quick] [--full]" # shows in autocomplete
user-invocable: true                # whether user can call directly
---
```

The body is instructions to Claude. The model reads and executes them. No templating engine, no DSL — it is prose that Claude interprets at runtime. Write it as if instructing a capable engineer who has no project context.

`$ARGUMENTS` is the variable that receives user-provided arguments after the skill name. Reference it as `$ARGUMENTS` (bash-style) directly in prose.

`$CLAUDE_PLUGIN_ROOT` is injected as an environment variable pointing to the plugin's install root. Use it for all reference file paths: `${CLAUDE_PLUGIN_ROOT}/reference/typography.md`. This is what makes the reference/ system portable.

Skill invocation from another skill: `Skill("ultimate-design:scan")` syntax, passing remaining args through.

Confidence: HIGH (confirmed in all five stage skills and root SKILL.md).

---

### Hooks Layer

**hooks/hooks.json** — declarative hook configuration. Confirmed format:
```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash \"${CLAUDE_PLUGIN_ROOT}/scripts/bootstrap.sh\""
          }
        ]
      }
    ]
  }
}
```

The outer `hooks` key maps to an object. Event name keys (`SessionStart`, etc.) map to arrays of hook-group objects. Each group has a `hooks` array. Each hook has `type` and `command`. The double-nesting (`hooks.SessionStart[].hooks[]`) is the actual schema — not a typo.

Environment variables available in hook commands: `CLAUDE_PLUGIN_ROOT`, `CLAUDE_PLUGIN_DATA`. `CLAUDE_PLUGIN_DATA` is a writable persistent data directory for the plugin (survives sessions, survives plugin updates). Use it for marker files and cached state.

The `plugin.json` `hooks` field points to this file: `"hooks": "./hooks/hooks.json"`.

Confidence: HIGH (read from production hooks.json + bootstrap.sh that uses these variables correctly).

---

### Reference File System

Reference files in `reference/` are plain markdown. They are NOT processed by any loader — they are read by Claude at skill execution time via `Read` tool calls. The pattern is:

```
Read `${CLAUDE_PLUGIN_ROOT}/reference/typography.md` for comparison criteria.
```

This is the correct authoring pattern. Reference files should be:
- Self-contained (no cross-references to other reference files except when explicit)
- Loaded only when relevant (each skill lists which reference files it needs)
- Opinionated and specific: thresholds, formulas, code patterns — not general advice

The reference/ directory is the knowledge base. Skills are the execution layer that reads from it. Keep them separate. New knowledge → reference/. New workflow → skill.

Confidence: HIGH (pattern confirmed across all five skills and all ten reference files).

---

### Artifact Format

All pipeline artifacts go into `.design/` (gitignored, project-specific, not part of the plugin). The convention:

- `.design/DESIGN-CONTEXT.md` — XML-tagged sections
- `.design/DESIGN-PLAN.md` — YAML frontmatter + structured markdown
- `.design/DESIGN-SUMMARY.md` — merged from per-task files
- `.design/DESIGN-VERIFICATION.md` — scoring + gap plan
- `.design/tasks/task-NN.md` — per-task output files for parallel execution
- `DESIGN.md` (project root) — scan output, living design system snapshot

**XML tagging pattern:** Use named XML tags (`<domain>`, `<decisions>`, `<must_haves>`, `<baseline_audit>`) inside markdown artifact files. This lets downstream skills extract only the section they need without parsing the entire file. The tags are Claude-interpreted, not processed by any parser.

**YAML frontmatter** on artifacts: use for machine-readable metadata (`status`, `baseline_score`, `generated`, `parallel_ready`). Downstream skills read frontmatter values to make routing decisions.

Confidence: HIGH (confirmed in discover, plan, design, verify skills and their artifact specs).

---

### Parallel Agent Pattern

The confirmed working pattern for parallel execution (from design/SKILL.md):

1. Each Wave 1 task gets `Parallel: true | false` and a `Touches:` list of files
2. Two tasks that share files in their `Touches:` set get `Parallel: false` (sequential tail)
3. All parallel-batch agents are spawned in ONE response message using `isolation: "worktree"`
4. Agent prompts must be fully self-contained — no session memory, all context inlined
5. Per-task output goes to `.design/tasks/task-NN.md` (not DESIGN-SUMMARY.md)
6. Orchestrator merges task files after all agents complete
7. Worktree branches are merged back; conflicts are handled before Wave 2

The agent prompt template is the critical piece. It must include: task spec, design context, locked decisions, full paths to all reference files, files to modify, acceptance criteria, and output format. Nothing can be assumed from session state.

Confidence: HIGH (read from design/SKILL.md parallel mode section).

---

### Validation Tooling

```bash
# During development — load plugin locally without install
claude --plugin-dir ./ultimate-design

# Reload after editing
/reload-plugins

# Validate before shipping
claude plugin validate .
```

`claude plugin validate .` is the gate. It must pass clean. Run it after every structural change (adding a skill, changing hooks.json, modifying plugin.json).

What validate checks (inferred from plugin structure): plugin.json schema validity, all `skills` paths exist and contain SKILL.md, hooks.json format, frontmatter completeness on each SKILL.md. The exact validation rules are MEDIUM confidence (inferred, not read from official docs).

Confidence: HIGH for "validate must pass", MEDIUM for "what specifically it checks".

---

### Bootstrap Script Pattern

`scripts/bootstrap.sh` is the SessionStart hook implementation. Key patterns from the working version:

```bash
set -u   # use -u not -e — hook failures should not block startup
```

**Idempotency via manifest comparison:**
```bash
MANIFEST="${PLUGIN_ROOT}/scripts/bootstrap-manifest.txt"
MARKER="${PLUGIN_DATA}/bootstrap-manifest.txt"
if diff -q "${MANIFEST}" "${MARKER}" >/dev/null 2>&1; then exit 0; fi
```
Run expensive work only when the manifest changes, not on every session.

**No `set -e`** — use `|| log "... (continuing)"` pattern instead. A bootstrap hook that exits nonzero will block Claude Code startup. Fail gracefully, log to stderr.

**Environment variables:** always use `${CLAUDE_PLUGIN_DATA:-$HOME/.claude/plugins/data/PLUGIN_NAME}` defaults in case Claude Code version doesn't inject them.

Confidence: HIGH (read from production bootstrap.sh that works).

---

## Cross-Platform Bash Patterns

This is the highest-risk area for v3. The existing skills have bash patterns written for Unix and known to break on Windows. These are the safe patterns.

### Find files (replace `find` with portable alternatives)

**Avoid:** `find . -name "*.tsx" | wc -l` — works on Unix, path separator and quoting issues on Windows Git Bash.

**Use instead (grep-based, more portable):**
```bash
grep -rl --include="*.tsx" "" src/ 2>/dev/null | wc -l
```

Or use `git ls-files` when inside a git repo:
```bash
git ls-files "*.tsx" "*.jsx" "*.vue" 2>/dev/null | wc -l
```
`git ls-files` respects `.gitignore`, works on Windows, and avoids `node_modules` automatically.

**For directory listing with counts:**
```bash
# Instead of: find src/ -name "*.tsx" | xargs dirname | sort | uniq -c
git ls-files "*.tsx" "*.jsx" | grep -oE "^[^/]+/[^/]+" | sort | uniq -c | sort -rn | head -20
```

### Grep patterns — Windows-safe

**Current patterns in scan/SKILL.md are Unix-only.** Key issues:

1. Multiple `--include` flags work on GNU grep but not on Git Bash's bundled grep on some Windows versions. Consolidate:
   ```bash
   # Fragile (multiple --include):
   grep -roh "pattern" src/ --include="*.css" --include="*.scss" --include="*.tsx"
   
   # More portable (single grep after find-via-git):
   git ls-files "*.css" "*.scss" "*.tsx" | xargs grep -oh "pattern" 2>/dev/null
   ```

2. `sort -rn` and `uniq -c` work on Git Bash but `sort -V` (version sort) does not. Avoid `-V`.

3. `wc -l` trailing space on some systems — pipe through `tr -d ' '` if comparing numerically.

4. Path separators: `${CLAUDE_PLUGIN_ROOT}` may contain backslashes on Windows. Always quote variables: `"${CLAUDE_PLUGIN_ROOT}/reference/file.md"` not `${CLAUDE_PLUGIN_ROOT}/reference/file.md`.

5. `2>/dev/null` is safe on Git Bash. Use it to suppress missing directory errors.

6. Never use `/dev/null` as NUL — but this is already correct in bootstrap.sh.

### Safe fallback pattern for directory detection

```bash
# Instead of assuming src/ exists:
SRC_DIR=""
for d in src app lib pages components; do
  if [ -d "$d" ]; then SRC_DIR="$d"; break; fi
done
if [ -z "$SRC_DIR" ]; then
  echo "No standard source directory found. Manual audit required." >&2
  exit 0
fi
```

This directly addresses the open `discover/SKILL.md` issue: bash commands assume `src/` exists.

### Tailwind-only detection (no CSS files)

```bash
# Check if project is Tailwind-only (no explicit CSS source files):
CSS_COUNT=$(git ls-files "*.css" "*.scss" "*.less" 2>/dev/null | grep -v node_modules | wc -l | tr -d ' ')
TAILWIND_CONFIG=$(git ls-files "tailwind.config.*" 2>/dev/null | head -1)

if [ "$CSS_COUNT" -lt 2 ] && [ -n "$TAILWIND_CONFIG" ]; then
  echo "Tailwind-only project detected — skipping CSS grep, using config analysis only."
fi
```

Confidence: HIGH for "these patterns are portable", MEDIUM for exact portability edge cases on all Windows git configurations.

---

## Skill Authoring Patterns

### The self-contained prompt principle

A skill must work with zero session memory. Everything the skill needs must be either:
1. Embedded in the skill body (thresholds, procedures, decision trees), or
2. In a reference file the skill explicitly reads at the start

The v1 mistake (routing to sub-skills with no embedded knowledge) is documented in `design_philosophy.md`. Do not repeat it.

**For new commands (style, darkmode, compare):** each gets its own SKILL.md in `skills/`. Each SKILL.md must begin with a "Prerequisites / read first" section listing every reference file it needs.

### Reference file loading pattern

Every skill starts with explicit Read calls. The canonical pattern (from all existing skills):

```
## Prerequisites

Read in this order:
1. `.design/DESIGN-CONTEXT.md` — [what to extract]
2. `${CLAUDE_PLUGIN_ROOT}/reference/[file].md` — [what to use it for]
3. [project files in scope]
```

Order matters: context files before reference files before project files.

### Argument routing in root SKILL.md

The root skill (root `SKILL.md`) is a router. Pattern:

```
If `$ARGUMENTS` is a stage name — invoke it directly, no state check:
  /ultimate-design scan     → Skill("ultimate-design:scan")
```

For new commands (style, darkmode, compare), add them to this routing table. Each new command is:
- A new skill in `skills/[command]/SKILL.md`
- A new row in the root skill's routing table
- A new keyword in plugin.json `keywords` array

### Artifact pipeline flow

```
scan → DESIGN.md + .design/DESIGN-DEBT.md (root output)
discover → .design/DESIGN-CONTEXT.md
plan → .design/DESIGN-PLAN.md
design → .design/tasks/task-NN.md → .design/DESIGN-SUMMARY.md
verify → .design/DESIGN-VERIFICATION.md
```

New commands follow the same pattern. `compare` likely reads two DESIGN.md snapshots and writes `.design/DESIGN-COMPARISON.md`. `darkmode` reads DESIGN.md and writes `.design/DESIGN-DARKMODE.md`. `style` writes `.design/DESIGN-STYLE.md` or per-component handoff files.

Artifact XML-tagging: every artifact that feeds a downstream skill must tag its key sections. `compare` is terminal (nothing reads it downstream), so tagging is optional. `darkmode` output should be tagged if it feeds into `design` as a sub-plan.

### Parallel agent prompt requirements

When spawning agents for parallel execution, the prompt must include all of:
- Task identity (number, type, scope)
- Action field verbatim from DESIGN-PLAN.md
- Design context summary (brand, tone, NOT, relevant D-XX decisions)
- Full absolute paths to all reference files
- Full list of files to modify
- Acceptance criteria
- Output file path and exact format
- Explicit instruction: "Do NOT write to DESIGN-SUMMARY.md"

Anything omitted from the prompt will be inferred or hallucinated. The agent has no other context.

---

## Testing and Validation

### Validation workflow (before any PR/push)

```bash
# 1. Validate plugin structure
claude plugin validate .

# 2. Smoke test locally with a real project
claude --plugin-dir ./ultimate-design
# In session: /ultimate-design scan --quick
# In session: /ultimate-design discover --auto

# 3. Check bash patterns on Windows
# Run the grep commands in scripts/bootstrap.sh and in each skill's bash blocks
# from a Git Bash shell, NOT WSL or PowerShell
bash scripts/bootstrap.sh   # should exit 0, log nothing

# 4. Reference file loading test
# After /reload-plugins, invoke a skill and verify it reads reference files correctly
# Look for: "Read ${CLAUDE_PLUGIN_ROOT}/reference/typography.md" in tool calls
```

### Per-skill validation checklist

For each SKILL.md change:
- [ ] Frontmatter is valid YAML (name, description present, no syntax errors)
- [ ] `user-invocable` is set correctly (true for all stage skills)
- [ ] All `${CLAUDE_PLUGIN_ROOT}/reference/` paths point to files that exist
- [ ] All bash blocks use portable patterns (see cross-platform section)
- [ ] Artifact paths use `.design/` prefix (not project root)
- [ ] Accept that `claude plugin validate .` passes

### Reference file validation

- [ ] No hardcoded absolute paths (only paths relative to document or via `${CLAUDE_PLUGIN_ROOT}`)
- [ ] Thresholds are specific numbers, not ranges described vaguely
- [ ] Grep patterns in reference files are tested against a real project
- [ ] New reference file is listed in `<canonical_refs>` of any skill that needs it

### Artifact compatibility testing

When modifying an artifact format (adding/removing sections, changing XML tag names):
- Check every downstream skill that reads the artifact
- The `<must_haves>` tag in DESIGN-CONTEXT.md is read by verify/SKILL.md — any rename breaks verify
- The `<baseline_audit>` tag is read by verify/SKILL.md for score delta — any rename breaks the delta calculation

For v3 new commands, test the full pipeline with a real project after adding the command to the root router.

### Idempotency test for bootstrap

```bash
# Run twice — second run should output nothing and exit 0
bash scripts/bootstrap.sh
bash scripts/bootstrap.sh
echo $?  # should be 0
```

Confidence: HIGH for the validation commands and checklist structure. MEDIUM for what `claude plugin validate .` specifically checks internally.

---

## What to Avoid

### 1. Sub-skill dependencies with no embedded knowledge

The v1 failure mode. A skill that just says "run impeccable" with no embedded thresholds is not a skill — it's a routing stub that fails when the dependency is absent. All knowledge must be embedded in reference files and loaded explicitly.

### 2. Hardcoded `src/` directory assumptions

All bash grep patterns in existing skills assume `src/` exists. This breaks on Next.js `app/` router projects, monorepos, and projects with `lib/` or `packages/` layouts. Use the safe fallback detection pattern from the cross-platform section.

### 3. `set -e` in hook scripts

Hook scripts that exit nonzero block Claude Code startup. Use `set -u` only (catches undefined variables). Handle errors with `|| log "... (continuing)"`. Never let a network failure (git clone failing) prevent the session from starting.

### 4. Mutable session state assumptions in parallel agents

Agents spawned with `isolation: "worktree"` have no access to the parent session's state, open files, or conversation history. Every parallel agent prompt must be written as if the agent has never seen the project. Do not pass context by reference ("as discussed") — pass it by value (inline the actual content).

### 5. Multiple `--include` flags in grep (Windows portability)

`grep -r --include="*.css" --include="*.scss"` works on GNU grep but is fragile on Windows Git Bash. Prefer `git ls-files "*.css" "*.scss" | xargs grep` instead.

### 6. Conflating plugin.json with marketplace.json

They are different files with different schemas. `plugin.json` is what Claude Code reads to install the plugin. `marketplace.json` is what the marketplace registry uses for discovery. Only `plugin.json` matters for functionality. The README currently references v1 marketplace commands that may be outdated — the `plugin.json` is the source of truth.

### 7. Putting runtime artifacts in the plugin directory

`.design/` is correctly gitignored and lives in the user's project, not in the plugin. Never write to `${CLAUDE_PLUGIN_ROOT}` from skill execution. Only bootstrap.sh writes to `${CLAUDE_PLUGIN_DATA}`. Reference files are read-only from skills.

### 8. Generic advice in reference files

Reference files that say "use good contrast" instead of "≥ 4.5:1 for normal text" produce vague skill output. Every threshold must be a number. Every pattern must be a concrete grep command or code example. This is the core quality gate per `design_philosophy.md`.

### 9. Missing `2>/dev/null` on bash commands in skills

Skills run bash commands against the user's project. Many patterns fail silently if the directory doesn't exist. Suppress stderr with `2>/dev/null` and handle "no output" as a meaningful result, not an error.

### 10. oklch without fallback

New `color` task execution guide work must handle oklch color space (currently absent from design/SKILL.md). oklch is not supported by all browsers in all versions. The reference guide should include: oklch usage pattern + `@supports` fallback or hex fallback for older targets.

---

## Confidence Levels

| Area | Confidence | Basis |
|---|---|---|
| plugin.json schema | HIGH | Read from working production file |
| SKILL.md frontmatter fields | HIGH | Confirmed across 6 SKILL.md files |
| hooks.json format | HIGH | Read from production hooks.json |
| `$CLAUDE_PLUGIN_ROOT` variable | HIGH | Used correctly in bootstrap.sh |
| `$CLAUDE_PLUGIN_DATA` variable | HIGH | Used in bootstrap.sh with fallback default |
| `claude plugin validate .` exact checks | MEDIUM | Command confirmed, internals inferred |
| `claude --plugin-dir` local dev | HIGH | Documented in README |
| `Skill()` invocation syntax | HIGH | Used in root SKILL.md |
| `isolation: "worktree"` for parallel agents | HIGH | Documented in design/SKILL.md |
| Cross-platform grep portability | MEDIUM | Patterns are known portable; exhaustive Windows edge case coverage not verified |
| `git ls-files` as find replacement | HIGH | Standard git command, works on all platforms with git |
| Hook failure behavior (nonzero blocks startup) | HIGH | README explicitly warns + bootstrap.sh uses `set -u` not `set -e` |
| Claude Code version requirements | LOW | README mentions "Claude Code 2.1.110+ with cross-marketplace resolution" but this may be outdated |
| oklch browser support specifics | MEDIUM | Known to be a real concern, exact support matrix not verified |
