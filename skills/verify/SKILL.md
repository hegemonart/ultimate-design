---
name: verify
description: "Stage 4 of the Ultimate Design pipeline. Validates design output against DESIGN-CONTEXT.md must-haves, walks the user through visual checks, identifies gaps, and produces DESIGN-VERIFICATION.md. If gaps are found, outputs a gap plan for targeted re-execution."
argument-hint: ""
user-invocable: true
---

# Ultimate Design — Verify

**Stage 4 of 4.** Reads `.design/DESIGN-SUMMARY.md` + `.design/DESIGN-CONTEXT.md`, writes `.design/DESIGN-VERIFICATION.md`.

You are the verification stage. Your job is not to re-do design work — it is to check whether what was built actually achieves what Discovery defined. You check must-haves systematically, then walk the user through a visual UAT.

## Prerequisites

Read in this order:
1. `.design/DESIGN-CONTEXT.md` — source of truth for goals and must-haves
2. `.design/DESIGN-PLAN.md` — what was planned (for deviation context)
3. `.design/DESIGN-SUMMARY.md` — what was actually done

If DESIGN-SUMMARY.md doesn't exist:
> "No design summary found. Run `/ultimate-design:design` first."

## Phase 1 — Automated Must-Have Check

Work through each must-have from DESIGN-CONTEXT.md `<must_haves>`.

For each must-have, determine verification type:

| Must-have type | How to verify |
|---|---|
| File exists | Check if file is present |
| Code contains pattern | Grep for specific string/token |
| Contrast ratio | Read color values from CSS/tokens and calculate |
| Design decision applied | Check if the D-XX decision from CONTEXT.md is reflected in code |
| Acceptance criteria from plan | Cross-reference with DESIGN-SUMMARY.md results |

Mark each:
- `✓ PASS` — verifiable and confirmed
- `✗ FAIL` — verifiable and not met
- `? HUMAN` — requires visual inspection (cannot verify from code alone)

Report after the automated check:

```
━━━ Automated checks ━━━
✓ 4 / 7 must-haves verified automatically
✗ 1 failed (gap found)
? 2 require your eyes

Moving to visual UAT...
━━━━━━━━━━━━━━━━━━━━━━━
```

## Phase 2 — Visual UAT

For each `? HUMAN` must-have plus key brand/tone goals from DESIGN-CONTEXT.md, present one check at a time.

Format:

```
━━━ Visual Check [N/M] ━━━
Goal: [the must-have or brand goal being checked]
What to look for: [concrete description of what pass looks like]

Does this pass? (yes / no [describe issue] / skip)
━━━━━━━━━━━━━━━━━━━━━━━━━
```

Example checks based on DESIGN-CONTEXT.md content:
- "The brand tone [word1] · [word2] · [word3] is legible at first glance — does it read that way?"
- "Reference R-01 ([name]) influenced the [component]. Can you see the connection?"
- "No anti-pattern '[X]' should be present — confirm it's absent"

Record each response. For `no` responses, capture the user's issue description verbatim.

## Phase 3 — Gap Analysis

If any must-haves failed (auto or visual):

1. Classify each gap:
   - `BLOCKER` — core goal not met, design work is incomplete
   - `MAJOR` — significant deviation from intent, should be fixed
   - `MINOR` — small issue, can be addressed in a follow-up
   - `COSMETIC` — polish item only

2. For BLOCKER + MAJOR gaps, generate a gap plan:

```markdown
## Gap Plan

### Gap 01 — [Gap description]
Severity: BLOCKER
Root cause: [Why this didn't pass]
Fix: Invoke `[sub-skill]` with instruction: "[concrete fix instruction]"
Expected outcome: [What pass looks like]
```

3. Ask the user:

```
━━━ Gaps found ━━━
BLOCKER: [N]
MAJOR: [N]
MINOR: [N]

Options:
  1. Fix now — I'll re-run the gap plan immediately
  2. Save and exit — gap plan is in DESIGN-VERIFICATION.md, fix later
  3. Accept as-is — mark verified with known gaps

Your choice:
━━━━━━━━━━━━━━━━━
```

If "Fix now": re-invoke the design stage for gap tasks only (treat gap plan as a mini-PLAN.md and execute). Then re-run verification after fixes.

## Output: DESIGN-VERIFICATION.md

Write `.design/DESIGN-VERIFICATION.md`:

```markdown
---
project: [name]
verified: [ISO 8601]
status: passed | passed-with-gaps | failed
must_haves_total: N
must_haves_passed: N
---

## Results

| # | Must-Have | Method | Result |
|---|---|---|---|
| M-01 | [must-have text] | auto | ✓ PASS |
| M-02 | [must-have text] | visual | ✓ PASS |
| M-03 | [must-have text] | auto | ✗ FAIL |

## Visual UAT

| Check | User Response | Verdict |
|---|---|---|
| [brand tone] | "yes, reads correctly" | ✓ PASS |
| [anti-pattern check] | "I see a bit of glassmorphism on the card" | ✗ FAIL |

## Gap Plan

[generated gap plan if any gaps found, empty section if all passed]

## Session Summary

Design direction: [Tone words from CONTEXT.md]
Completed tasks: [N from SUMMARY.md]
Must-haves passed: [N/M]
Status: [passed | passed-with-gaps | failed]

Deferred to next session:
- [anything from DESIGN-CONTEXT.md <deferred> that still applies]
```

## After Writing

**If status = passed:**
```
━━━ ✓ Verification passed ━━━
All must-haves confirmed. Design session complete.

Artifacts in .design/:
  DESIGN-CONTEXT.md
  DESIGN-PLAN.md
  DESIGN-SUMMARY.md
  DESIGN-VERIFICATION.md

Start a new session: /ultimate-design:discover
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**If status = passed-with-gaps:**
```
━━━ ✓ Verified with known gaps ━━━
Minor gaps accepted. See DESIGN-VERIFICATION.md gap plan.
Resume: /ultimate-design:design --wave [gap-wave]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**If status = failed:**
```
━━━ ✗ Verification failed ━━━
[N] blockers found. Gap plan ready in DESIGN-VERIFICATION.md.
Fix: /ultimate-design:design (re-runs gap plan)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
