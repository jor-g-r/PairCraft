# Next session
_Updated: 2026-11-13 13:15 -04 · Branch: main · Tool: Claude Code, claude-opus-5-5_

## Goal
Keep Paircraft a shippable search-first pocket guide.

## Changes
- The verification contract and this handoff are on `main` since `7c7817c` (2026-11-11): `AGENTS.md` with a `Project profile`, `scripts/verify`, and `.gitignore` for `.env.local` and `.harness/`. No source file changed.
- This file now reflects the state after that merge.

## State
- measured: `./scripts/verify full` on `main` = `7c7817c` -> `pass=3 fail=0 unmeasured=0` in 29 s, 2026-11-13.
- measured: the owner reviewed production at 390 and 1440 px, light and dark, and found it unchanged, 2026-11-13.
- measured: production search for "Malbec" returns 5 results at 390 and 1440 px and opens `/wine/catena-malbec`, with no console errors and no horizontal overflow, 2026-11-13.
- measured: Vercel status of `7c7817c` on GitHub was `success`, 2026-11-11.

## Blocked on
Nothing.

## Next action
None pending in this repo. The next task comes from the owner; re-measure first.

## Gotchas
- Re-measure before trusting this file: `git status -sb` and `./scripts/verify quick`.
- A push to `main` deploys to production: only with the owner's explicit GO. Local hooks block it otherwise.
- Before starting a dev server, check that nothing else holds port 4321.
- `.impeccable/live` injects a script into `src/layouts/Base.astro`; never commit while it is injected.
