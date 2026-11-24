# Next session
_Updated: 2026-11-23 22:45 -04 · Branch: docs/handoff-manifest · Tool: Claude Code, claude-opus-5-5_

## Goal
Keep Paircraft a shippable search-first pocket guide. The 404 page is closed; the static manifest is deployed and waits for the owner's review.

## Changes
- `src/pages/404.astro` is in production since 832a6b3; the owner approved it on the production URLs.
- The manifest is a static `public/manifest.webmanifest`; `@vite-pwa/astro` and its unused service worker are gone (fc9df3d). Pushed to `main` and deployed with 6510949. Why: `docs/decisions/2026-11-23-manifest-only-pwa.md`.
- This file: replaces a handoff that still asked for that push. Local commit, not pushed.

## State
- measured: `origin/main` = 6510949; GitHub status `Vercel: success`, 2026-11-23 20:09 -04.
- measured: `./scripts/verify full` on 6510949 -> `pass=3 fail=0 unmeasured=0 manual_pending=2`, 2026-11-23.
- measured: no `sw.js`, `workbox-*` or `registerSW.js` in `dist/` or `.vercel/output/`; no reference to them or to `@vite-pwa/astro` in versioned code or `bun.lock`.
- measured: built `manifest.webmanifest` is valid JSON and identical to `public/`; `about` and `404.html` link it.
- measured: no unpushed commits or stashes in this clone before this file's commit; all local branches are integrated in `origin/main`.
- inherited: dev serves the manifest as `application/manifest+json`, and it is JSON-identical to the one the plugin generated. The evidence copy (`.harness/evidence/sw/`) is in the clone that did the work, not in every clone.
- not measured: the manifest in production, on a real device.

## Blocked on
The owner's review of the installed app in production: "Add to Home Screen" on iPhone Safari and Android Chrome, checking name and icon. Nothing in the repo records it yet.

## Next action
Record the owner's review here. This commit has no push of its own: it goes out with the next task, with the owner's GO, so the handoff does not spend a deploy.

## Gotchas
- Re-measure before trusting this file: `git fetch`, `git status -sb` and `./scripts/verify quick`. Work happens in more than one clone, so without the fetch a clean status can be days behind.
- After pulling fc9df3d, `bun install` leaves `@vite-pwa/astro` and `workbox-*` in `node_modules`. Nothing imports them.
- A push to `main` deploys to production: only with the owner's explicit GO. The local `pre-push` hook blocks it otherwise.
- Before starting a dev server, check that nothing else holds port 4321.
- Dev renders the 404 per request, so on `/wine/<missing>` the Wines nav link shows active in dev; the built `404.html` is prerendered as `/404` and highlights nothing.
- `.impeccable/live` injects a script into `src/layouts/Base.astro`; never commit while it is injected.
