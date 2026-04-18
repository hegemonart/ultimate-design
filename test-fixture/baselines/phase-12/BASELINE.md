# Phase 12 Regression Baseline

Locked: 2026-04-18
Version: v1.0.6

## What this baseline locks

- `tests/` directory contents at Phase 12 completion (see `test-list.txt`)
- `package.json` version = 1.0.6
- `.github/workflows/ci.yml` matrix (Node 22/24 × Linux/macOS/Windows)
- `reference/DEPRECATIONS.md` entries (4 deprecations registered)

## Files in this baseline

- `test-list.txt` — sorted list of every `tests/*.test.cjs` file that must still ship
- `plugin-version.txt` — `1.0.6`
- `BASELINE.md` — this file

## Re-lock procedure

Same as phase-6 baseline (see `test-fixture/baselines/phase-6/README.md`). In short:
1. Run `npm test` and confirm green on current main.
2. Regenerate `test-list.txt` via `ls tests/*.test.cjs | sort > test-list.txt`.
3. Bump `plugin-version.txt` to match `package.json`.
4. Commit with message `baseline(phase-12): re-lock at v<new-version>` and a rationale.
