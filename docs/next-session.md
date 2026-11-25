# Next session
_Updated: 2026-11-24 22:09 -04 · Branch: deps/astro-7 · Tool: Claude Code, claude-opus-5-5_

## Goal
Get Paircraft ready for its first test with real users. Phase 0, the dependency update, is done locally; the owner's QA and the Linux build are pending.

## Changes
- b48ff16: Astro 7.4.13, `@astrojs/vercel` 11.0.22, `@astrojs/mdx` 8.1.6, sharp 0.35.5; `compressHTML: true`; lockfile re-resolved with a three-day minimum age.
- 6c98a5c: `docs/decisions/2026-11-24-astro-7.md`, and `AGENTS.md` with the new dev server commands.
- `git log origin/main..deps/astro-7` says whether this has been published.
- `docs/private/` (ignored, only in the clone that wrote it) holds the roadmap, the access hypothesis and the test script.

## State
- measured: `./scripts/verify full` on 6c98a5c -> `RESULT mode=full pass=3 fail=0 unmeasured=0 manual_pending=2`, 2026-11-24 22:08 -04.
- measured: `bun audit` from 16 findings (1 critical, 4 high) to 1 high, `path-to-regexp` through `@vercel/routing-utils`; not in the built function.
- measured against aea04e2: the visible text of the 75 pages is identical; 52 full-page captures of the static build and 44 viewport captures in dev are identical (dev toolbar excluded); the 60 images are identical without cache; the interaction script gives the same results at 390 and 1440 px.
- measured: one response changed on purpose of the framework. A `text/plain` POST without `Origin` to `/api/pair` goes from 403 to 415; from another origin it is still 403.
- unmeasured: the function built on Linux by Vercel, with `/_image` and the home running there. Only a preview or production shows it.
- inherited: `home-hero` and Mendoza are Unsplash by the owner's statement; Unsplash+ is not ruled out.

## Blocked on
The owner: QA, and a GO to push the branch for a Vercel preview.

## Next action
If `git log origin/main..deps/astro-7` is empty, phase 0 is published: go to phase A of `docs/private/roadmap.md`, with its brief. Otherwise, with the owner's GO: `git push origin deps/astro-7`, check the Vercel commit status on GitHub and review the preview before any push to `main`.

## Gotchas
- Re-measure before trusting this file: `git fetch`, `git status -sb` and `./scripts/verify quick`. Run `bun install --frozen-lockfile` after switching between this branch and `main`.
- Stop the dev server with `bunx astro dev stop`; ending its `screen` leaves it running.
- Removing an entry from `bun.lock` by hand makes Bun discard the whole file and re-resolve it.
- Images look unchanged after an update because of `node_modules/.astro`; move it away to measure.
- No test covers the origin check of `/api/pair`.
- A push to `main` deploys to production: only with the owner's explicit GO.
