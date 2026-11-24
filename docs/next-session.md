# Next session
_Updated: 2026-11-23 20:07 -04 · Branch: chore/manifest-only · Tool: Claude Code, claude-opus-5-5_

## Goal
Keep Paircraft a shippable search-first pocket guide. This session: a custom 404 page (shipped), then the service worker that never worked.

## Changes
- `src/pages/404.astro` is in production since 832a6b3 (GitHub status `Vercel: success`); the owner approved it on the production URLs.
- `chore/manifest-only` (fc9df3d): the manifest is a static `public/manifest.webmanifest` with the same content; `@vite-pwa/astro` and its unused service worker are gone; `AGENTS.md`, `README.md` and `.gitignore` updated. Why: `docs/decisions/2026-11-23-manifest-only-pwa.md`.

## State
- measured: `./scripts/verify full` on `chore/manifest-only` -> `pass=3 fail=0 unmeasured=0 manual_pending=2`, 2026-11-23.
- measured: built `manifest.webmanifest` is JSON-identical to the one before the change (copy in `.harness/evidence/sw/`); no `sw.js`, `workbox-*` or `registerSW.js` in `dist/` or `.vercel/output/`; `/about` and `404.html` still link the manifest.
- measured: dev serves `/manifest.webmanifest` as `application/manifest+json`, identical; `/`, `/wines` 200, a missing route 404.
- measured: `bun.lock` drops 287 entries; the only added line is `signal-exit@3.0.7` hoisted (already used by `execa`); no remaining package changed version.
- measured: `origin/main` = 832a6b3; the branch carries fc9df3d plus handoff and decision commits on it. Nothing pushed.

## Blocked on
The owner's GO to push `chore/manifest-only` to `main` (push deploys to production).

## Next action
With the GO: `HARNESS_PUBLISH=1 git push origin chore/manifest-only:main`, then check the Vercel commit status on GitHub.

## Gotchas
- Re-measure before trusting this file: `git status -sb` and `./scripts/verify quick`.
- A push to `main` deploys to production: only with the owner's explicit GO. The local `pre-push` hook blocks it otherwise.
- Before starting a dev server, check that nothing else holds port 4321.
- Dev renders the 404 per request, so on `/wine/<missing>` the Wines nav link shows active in dev; the built `404.html` is prerendered as `/404` and highlights nothing.
- `.impeccable/live` injects a script into `src/layouts/Base.astro`; never commit while it is injected.
