# Next session
_Updated: 2026-11-24 22:17 -04 · Branch: deps/astro-7 · Tool: Claude Code, claude-opus-5-5_

## Goal
Get Paircraft ready for its first test with real users. Phase 0, the dependency update, was approved by the owner on the Vercel preview.

## Changes
- b48ff16: Astro 7.4.13, `@astrojs/vercel` 11.0.22, `@astrojs/mdx` 8.1.6, sharp 0.35.5; `compressHTML: true`; lockfile re-resolved with a three-day minimum age.
- 6c98a5c: `docs/decisions/2026-11-24-astro-7.md`, and `AGENTS.md` with the new dev server commands.
- `git log origin/main..deps/astro-7` says whether this is on `main`; the Vercel commit status on GitHub says whether it deployed.
- `docs/private/` (ignored, only in the clone that wrote it, not backed up) holds the roadmap, the access hypothesis and the test script.

## State
- measured: `./scripts/verify full` on 6c98a5c -> `RESULT mode=full pass=3 fail=0 unmeasured=0 manual_pending=2`, 2026-11-24 22:08 -04. Later commits only touch this file.
- measured: `bun audit` from 16 findings (1 critical, 4 high) to 1 high, `path-to-regexp` through `@vercel/routing-utils`; not in the built function.
- measured against aea04e2: same visible text in the 75 pages, same captures, images and interaction at 390 and 1440 px. Evidence in `.harness/evidence/deps-astro-7/`, only in the clone that did the work.
- measured: the branch built on Vercel (`success` on 4b0507d, 2026-11-24 22:11 -04). The preview asks for a Vercel sign-in, so no agent has seen its pages.
- reported by the owner: preview QA approved, 2026-11-24; devices not listed.
- inherited: `home-hero` and Mendoza are Unsplash by the owner's statement; Unsplash+ is not ruled out.

## Blocked on
Nothing. Before a public launch: the Unsplash pages of `home-hero` and Mendoza. For the user test: the owner recruits people who do not know the product.

## Next action
Phase A of `docs/private/roadmap.md`: backend architecture with users, design only, starting with capabilities and data model. Open it with its full brief and wait for the owner's GO. Branch from `deps/astro-7`.

## Gotchas
- Re-measure before trusting this file: `git fetch`, `git status -sb` and `./scripts/verify quick`. Local `main` is behind `origin/main`.
- Run `bun install --frozen-lockfile` after switching to or from a branch older than b48ff16.
- Stop the dev server with `bunx astro dev stop`; ending its `screen` leaves it running.
- Removing an entry from `bun.lock` by hand makes Bun discard the whole file and re-resolve it.
- Images look unchanged after an update because of `node_modules/.astro`; move it away to measure.
- Astro does not check the origin of JSON posts. `/api/pair` does it itself, and no test covers it.
- A push to `main` deploys to production: only with the owner's explicit GO.
