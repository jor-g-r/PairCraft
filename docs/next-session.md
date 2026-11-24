# Next session
_Updated: 2026-11-23 22:53 -04 · Branch: docs/handoff-manifest · Tool: Claude Code, claude-opus-5-5_

## Goal
Keep Paircraft a shippable search-first pocket guide. The 404 page and the static manifest are both deployed and closed by the owner.

## Changes
- `src/pages/404.astro` is in production since 832a6b3; the owner approved it on the production URLs.
- The manifest is a static `public/manifest.webmanifest`; `@vite-pwa/astro` and its unused service worker are gone (fc9df3d). Pushed to `main` and deployed with 6510949. Why: `docs/decisions/2026-11-23-manifest-only-pwa.md`.
- This file replaces a handoff that still asked for that push. Its own commits are on `docs/handoff-manifest`; `git log origin/main..docs/handoff-manifest` says whether they have been published.

## State
- measured: `origin/main` = 6510949; GitHub status `Vercel: success`, 2026-11-23 20:09 -04.
- measured: `./scripts/verify full` on 6510949 and again on 47295a8 (handoff only) -> `RESULT mode=full pass=3 fail=0 unmeasured=0 manual_pending=2`, 2026-11-23.
- measured: no `sw.js`, `workbox-*` or `registerSW.js` in `dist/` or `.vercel/output/`; no reference to them or to `@vite-pwa/astro` in versioned code or `bun.lock`.
- measured: built `manifest.webmanifest` is valid JSON and identical to `public/`; `about` and `404.html` link it.
- measured: in the clone that wrote this file, no stashes and nothing unpushed except the commits of `docs/handoff-manifest`; every other local branch is integrated in `origin/main`.
- inherited: dev serves the manifest as `application/manifest+json`, and it is JSON-identical to the one the plugin generated. The evidence copy (`.harness/evidence/sw/`) is in the clone that did the work, not in every clone.
- reported by the owner: "Add to Home Screen" in production on iPhone Safari and Android Chrome, name and icon checked and approved, 2026-11-23.

## Blocked on
Nothing.

## Next action
When the owner gives the next task: `git fetch && git status -sb`, then its brief, on a branch from `docs/handoff-manifest` so these commits go out with that task's push (with the owner's GO) and the handoff does not spend a deploy.

## Gotchas
- Re-measure before trusting this file: `git fetch`, `git status -sb` and `./scripts/verify quick`. Commits can reach `origin/main` from another clone: on 2026-11-23 a clean, "up to date" status was 6 commits behind until the fetch.
- After pulling fc9df3d, `bun install` leaves `@vite-pwa/astro` and `workbox-*` in `node_modules`. Nothing imports them.
- A push to `main` deploys to production: only with the owner's explicit GO. The local `pre-push` hook blocks it otherwise.
- Before starting a dev server, check that nothing else holds port 4321.
- Dev renders the 404 per request, so on `/wine/<missing>` the Wines nav link shows active in dev; the built `404.html` is prerendered as `/404` and highlights nothing.
- `.impeccable/live` injects a script into `src/layouts/Base.astro`; never commit while it is injected.
