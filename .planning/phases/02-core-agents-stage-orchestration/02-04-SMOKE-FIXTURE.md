# Phase 2 Smoke Test — Fixture and Runbook

## Fixture Location

`test-fixture/` (relative to repo root — D:/AI/ultimate-design/test-fixture/)

Chosen approach: freshly-created directory inside the repo. Pros: reproducible, version-controlled, no dependency on user filesystem, small enough to run in < 5 minutes.

## Fixture Contents

| File | What it seeds |
|------|---------------|
| `package.json` | Minimal project config — name, no dependencies |
| `src/index.css` | Root CSS with design tokens (--color-primary, --color-secondary, --space-*, --text-*); also seeds AI-slop palette (#6366f1, #8b5cf6, #06b6d4) as custom props and `font-family: "Inter"` on body |
| `src/App.css` | **BAN-01 violation**: `.card { border-left: 4px solid var(--color-primary); }` (verify must catch); **AI-slop palette**: hero uses `#6366f1` / `#8b5cf6` / `#06b6d4` directly; **hardcoded deviation**: `.footer { color: #ff0000; }` bypassing --color-primary token; `transition: all` on .cta-button |
| `src/App.jsx` | **AI-slop copy**: hero headline "Unlock your potential with our seamless, cutting-edge solution" + "supercharge", "synergistic", "best-in-class", "AI-Powered Insights"; **hardcoded inline style**: `style={{ color: '#ff0000' }}` on footer element |
| `README.md` | One-paragraph description of fixture purpose and seeded violations |

## Seeded Violations (verify should catch these)

1. **BAN-01** — `border-left: 4px solid var(--color-primary)` on `.card` in `src/App.css`
   - Expected: flagged as BLOCKER or MAJOR gap by design-verifier
   - Grep pattern: `border-left:\s*[2-9]` or `border-left:` in CSS files

2. **AI-slop palette** — `#6366f1`, `#8b5cf6`, `#06b6d4` used directly in `src/App.css`
   - Expected: flagged as SLOP signal (MINOR) by design-verifier
   - Grep pattern: `#6366f1|#8b5cf6|#06b6d4`

3. **Default Inter font** — `font-family: "Inter"` in `src/index.css` body rule
   - Expected: flagged as SLOP signal (MINOR) by design-verifier
   - Grep pattern: `font-family.*Inter`

4. **Hardcoded color** — `#ff0000` in `src/App.css` footer and `style={{ color: '#ff0000' }}` in `src/App.jsx`
   - Expected: flagged as deviation from --color-primary token (MINOR or MAJOR)

5. **Transition all** — `transition: all 0.2s ease` on `.cta-button` in `src/App.css`
   - Expected: flagged as animation/motion issue (MINOR)

6. **AI-slop copy** — "seamless", "cutting-edge", "supercharge", "synergistic", "best-in-class" in `src/App.jsx`
   - Expected: flagged by copy audit (MINOR)

## Smoke Test Runbook

Run these in order. Start from the `test-fixture/` directory:

```bash
cd D:/AI/ultimate-design/test-fixture
```

### Step 1 — Scan

```
/ultimate-design:scan
```

**Expect:**
- `.design/STATE.md` created from `reference/STATE-TEMPLATE.md` (scan populates it)
- `.design/DESIGN.md` created with design system map
- No errors
- Stage emits `## SCAN COMPLETE`

**Verify STATE.md fields:**
```bash
grep "stage:" test-fixture/.design/STATE.md
grep "scan_completed_at:" test-fixture/.design/STATE.md
```

### Step 2 — Discover

```
/ultimate-design:discover
```

**Expect:**
- Reads `.design/STATE.md` at entry (stage transitions from scan → discover)
- Discovery interview proceeds (existing v2.1.0 flow — 7 areas: Scope, Audience, Goals, Brand, References, Constraints, Gray Areas)
- `.design/DESIGN-CONTEXT.md` created with all sections filled
- STATE.md updated: `stage=discover`, `discover_completed_at` timestamp set, `status=completed`
- Stage emits `## DISCOVER COMPLETE`

**Verify:**
```bash
grep "discover_completed_at:" test-fixture/.design/STATE.md
grep "## DISCOVER COMPLETE" test-fixture/.design/STATE.md  # (marker in SKILL.md output, not STATE.md itself)
```

### Step 3 — Plan

```
/ultimate-design:plan --auto
```

**Expect:**
- design-phase-researcher spawned if complexity threshold met (> 3 domain scopes or > 6 decisions)
- design-planner agent spawned (visible in output or logs)
- design-plan-checker agent spawned after planner returns
- `.design/DESIGN-PLAN.md` created with wave-ordered tasks (Type/Scope/Touches/Parallel/Acceptance fields)
- STATE.md updated: `stage=plan`, `plan_completed_at` timestamp set, `status=completed`
- Stage emits `## PLAN COMPLETE`

**Verify:**
```bash
cat test-fixture/.design/DESIGN-PLAN.md | head -30
grep "plan_completed_at:" test-fixture/.design/STATE.md
```

### Step 4 — Design

```
/ultimate-design:design
```

**Expect:**
- design-executor agent spawned per task in DESIGN-PLAN.md (visible in output)
- `.design/tasks/task-NN.md` files created per plan task
- git log shows `feat(design-NN):` atomic commit per task
- STATE.md updated: `stage=design`, `design_completed_at` timestamp set, `status=completed`
- Stage emits `## DESIGN COMPLETE`

**Verify:**
```bash
ls test-fixture/.design/tasks/
git log --oneline | grep "feat(design-"
grep "design_completed_at:" test-fixture/.design/STATE.md
```

### Step 5 — Verify

```
/ultimate-design:verify
```

**Expect:**
- design-verifier agent spawned (visible in output)
- BAN-01 violation (`border-left` on `.card`) caught as BLOCKER or MAJOR gap
- AI-slop palette (#6366f1 / #8b5cf6 / #06b6d4) flagged as SLOP signals
- Hardcoded color (#ff0000) flagged as deviation
- `.design/DESIGN-VERIFICATION.md` written with all 5 phases (audit, must-haves, gaps, actions, verdict)
- If gaps found: 3-option menu presented — select [2] to save and exit
- STATE.md updated: `stage=verify`, `verify_completed_at` timestamp set, `status=completed`
- Stage emits `## VERIFY COMPLETE`

**Verify:**
```bash
grep -i "border-left\|BAN-01" test-fixture/.design/DESIGN-VERIFICATION.md
grep "verify_completed_at:" test-fixture/.design/STATE.md
cat test-fixture/.design/DESIGN-VERIFICATION.md | tail -20
```

### Step 6 — Fill in Results

Update the **Results** section below with observed values.

### Step 7 — Cleanup (for re-runs)

```bash
rm -rf D:/AI/ultimate-design/test-fixture/.design
```

This resets the fixture to its pre-pipeline state. The fixture source files are unchanged (violations remain seeded).

## No-Regression Baseline (vs v2.1.0)

The pipeline must produce these artifacts with equivalent structure. "Equivalent" means same sections/format — content will naturally differ since fixture != any v2.1.0 test project.

| Artifact | v2.1.0 | v3 (Phase 2) | Notes |
|----------|--------|--------------|-------|
| `.design/STATE.md` | not present | NEW — required | Verify structure matches `reference/STATE-TEMPLATE.md` |
| `.design/DESIGN-CONTEXT.md` | present | present | Same sections (domain, audience, goals, brand, references, decisions, constraints, baseline_audit, must_haves, deferred) |
| `.design/DESIGN-PLAN.md` | present | present | Same task format (Type, Scope, Touches, Parallel, Acceptance fields) |
| `.design/tasks/task-NN.md` | present | present | Same format — per 02-02 must-haves |
| `feat(design-NN):` commits | present | present | Same atomic-commit convention |
| `.design/DESIGN-VERIFICATION.md` | present | present | Same 5-phase report (audit, must-haves, gaps, actions, verdict) |

Regressions to watch for:
- Discover stage crashes or loops without producing DESIGN-CONTEXT.md
- Plan stage produces tasks without Type/Scope/Acceptance fields
- Design stage skips commits or batches multiple tasks per commit
- Verify stage fails to catch BAN-01 (the explicit seeded violation)
- STATE.md not updated between stages

## Pass Criteria

All of the following must be true:

- [ ] `## SCAN COMPLETE` marker emitted
- [ ] `## DISCOVER COMPLETE` marker emitted
- [ ] `## PLAN COMPLETE` marker emitted
- [ ] `## DESIGN COMPLETE` marker emitted
- [ ] `## VERIFY COMPLETE` marker emitted
- [ ] STATE.md has `scan_completed_at` timestamp (non-tilde)
- [ ] STATE.md has `discover_completed_at` timestamp (non-tilde)
- [ ] STATE.md has `plan_completed_at` timestamp (non-tilde)
- [ ] STATE.md has `design_completed_at` timestamp (non-tilde)
- [ ] STATE.md has `verify_completed_at` timestamp (non-tilde)
- [ ] BAN-01 violation (`border-left` on `.card`) caught by verify
- [ ] AI-slop palette signals (#6366f1 / #8b5cf6 / #06b6d4) caught by verify
- [ ] Hardcoded color (#ff0000) caught by verify
- [ ] At least 1 `feat(design-NN):` atomic commit created during design stage
- [ ] No fatal errors (crashes, unhandled exceptions, aborts) in any stage
- [ ] Pipeline total runtime < 10 minutes

## Fail Criteria (report back)

- Any stage fails to emit its completion marker
- STATE.md is not updated between stages (timestamps remain `~`)
- Any stage crashes or aborts with an unhandled error
- BAN-01 violation is NOT caught by verify stage (regression)
- Commits not made atomically per task during design stage
- DESIGN-CONTEXT.md sections are missing or malformed

## Results

*(Fill in during Task 3 / smoke test execution)*

- Stage markers observed:
  - [ ] `## SCAN COMPLETE`
  - [ ] `## DISCOVER COMPLETE`
  - [ ] `## PLAN COMPLETE`
  - [ ] `## DESIGN COMPLETE`
  - [ ] `## VERIFY COMPLETE`
- STATE.md fields updated correctly: [ ]
- BAN-01 violation caught by verify: [ ]
- AI-slop palette caught by verify: [ ]
- Hardcoded color caught by verify: [ ]
- Atomic `feat(design-NN):` commits created: [ ]
- No fatal errors: [ ]
- Pipeline total runtime: __ minutes
- DESIGN-CONTEXT.md structure equivalent to v2.1.0: [ ]
- DESIGN-PLAN.md task format preserved: [ ]
- Any errors encountered: _(none / describe)_
- Any regressions vs v2.1.0: _(none / describe)_
- Overall result: PASS / FAIL
