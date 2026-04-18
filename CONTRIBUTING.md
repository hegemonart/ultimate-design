# Contributing to get-design-done

Thanks for your interest. This document covers the contribution workflow, focusing on the test-suite contract introduced in Phase 12 (v1.0.6).

## Test-suite contract

**From v1.0.6 forward, every PR MUST pass `npm test` before merging to `main`.** No exceptions for "it's just a docs change" — the test suite includes markdown-structural tests (stale-ref detection, deprecation-redirect, required-reading consistency, command-count sync) that legitimately fire on docs PRs.

### Running tests locally

```bash
npm test
```

The runner is Node's built-in `node:test`. Node 22 or 24 is required. CI covers Node 22 + 24 on Linux, macOS, and Windows.

### What to do when a test fails

1. **Read the failure message.** Every test in this suite includes a descriptive assertion message with the offending file, field, or line.
2. **Fix the underlying issue, not the test.** If an agent exceeds its line-count tier, either compress the agent OR raise its `size_budget` with a rationale in the PR description — do not soften the tier cap. If a required-reading reference is dangling, fix the path — do not remove the check.
3. **If the test itself is broken**, open a PR touching only `tests/` with a clear description of why the test was wrong.

### Size-budget tiers

`tests/agent-size-budget.test.cjs` enforces line-count caps per tier:

| Tier | Line cap |
|------|----------|
| `DEFAULT` (no declaration) | 250 |
| `LARGE` | 350 |
| `XL` | 500 |
| `XXL` | 700 |

To raise an agent's tier: add `size_budget: <TIER>` to its frontmatter AND explain why in the PR description. The justification must stand on its own (this agent genuinely needs the extra lines because X), not "test was failing."

### Baselines

Each phase locks a structural baseline under `test-fixture/baselines/phase-<N>/`. When your PR legitimately changes the baseline (e.g., you added a new agent), re-lock per the procedure in `test-fixture/baselines/phase-6/README.md`. The re-lock is itself a separate commit and requires a rationale.

## Version bump workflow

Version bumps happen at **phase closeout** only. A solo-commit version bump outside of a phase is not a supported workflow.

At phase closeout:
1. Bump `package.json` `version`.
2. Refresh `.claude-plugin/plugin.json` + `.claude-plugin/marketplace.json` (version, description, keywords as needed).
3. Prepend a `CHANGELOG.md` entry listing every material change.
4. Update `README.md` if the user-facing surface changed.
5. Lock the phase's regression baseline in `test-fixture/baselines/phase-<N>/` (if structural state changed).

## Hooks and safety

`hooks/gdd-read-injection-scanner.js` runs on every `Read` tool use and warns on known prompt-injection patterns. `hooks/context-exhaustion.js` runs on every tool use and records a paused checkpoint when context is high. Both are CI-safe; neither blocks legitimate work.

## Questions

File an issue in the repo — issue triage uses the same CI guarantees as PRs.
