# Next session
_Updated: 2026-11-11 21:51 -04 · Branch: chore/adopt-harness · Tool: Claude Code, claude-opus-5-5_

## Goal
Keep Paircraft a shippable search-first pocket guide. This branch adopts a verification contract and a handoff without changing behaviour.

## Changes
- `AGENTS.md` keeps the stable rules and adds a `Project profile`; dated history and plans left the repo.
- `scripts/verify`: `quick` runs `bun run check` and `bun run test`; `full` adds `bun run build`.
- `.gitignore` adds `.env.local` and `.harness/` (verify logs).

## State
- measured: `./scripts/verify quick` -> `pass=2 fail=0 unmeasured=0` in 18 s; `./scripts/verify full` -> `pass=3 fail=0` in 36 s (2026-11-11, on `main` = `a17cf58`).
- measured: a copy of `verify` with a failing check exits 1, and one that needs a missing tool exits 2.
- inferred: production is unchanged by this branch; no source file is touched.

## Blocked on
The owner's review of the branch, and a GO to merge into `main`, which deploys.

## Next action
After the merge: run `./scripts/verify full` on `main` and check the Vercel status of the merge commit on GitHub.

## Gotchas
- Re-measure before trusting this file: `git status -sb` and `./scripts/verify quick`.
- Before starting a dev server, check that nothing else holds port 4321.
- `.impeccable/live` injects a script into `src/layouts/Base.astro`; never commit while it is injected.
