# Next session
_Updated: 2026-11-23 16:07 -04 · Branch: feat/404-integrated · Tool: Claude Code, claude-opus-5-5_

## Goal
Keep Paircraft a shippable search-first pocket guide. This session: a custom not-found page that leads back into the guide.

## Changes
- `src/pages/404.astro` (4aa778b, on top of `origin/main` 0cd8c10): Base layout, Playfair headline with one red word ("This page isn't on the list." / "Esta página no está en la carta."), a "Back to the guide" action to `/`, and four ruled links (Wines, Dishes, Find a pairing, Find by wine style), EN/ES. Follows the `/wine-style` sheet pattern; no new image.

## State
- measured: `./scripts/verify full` on `feat/404-integrated` -> `pass=3 fail=0 unmeasured=0 manual_pending=2`, 2026-11-23.
- measured: build `.vercel/output/config.json` ends with `^/.*$ -> /404.html, status 404`; `404.html` sends `noindex, nofollow` and highlights no nav link.
- measured: dev `curl` on `/ruta-que-no-existe`, `/wine/no-existe`, `/dish/no-existe` -> 404 with the new title; no horizontal overflow at 390 and 1440 px.
- measured: pushed with the owner's GO, `origin/main` 0cd8c10..832a6b3; GitHub commit status `Vercel: success`, "Deployment has completed", 2026-11-23T20:06:17Z.
- measured: local `main` diverged from `origin/main` (an older squash of the harness adoption plus pre-integration commits, also kept on `feat/404-page`). Do not push local `main`.
- inferred, pre-existing: `sw.js` builds to `dist/server/`, not `.vercel/output/static/`, so `/sw.js` likely 404s in production and the service worker never registers. Not touched.
- manual_pending: owner's real-device check (iPhone Safari, Android Chrome).

## Blocked on
The owner: real-device check of the 404 in production (iPhone Safari, Android Chrome).

## Next action
Align local `main` with `origin/main` once the owner agrees (`feat/404-page` keeps the superseded commits).

## Gotchas
- Re-measure before trusting this file: `git status -sb` and `./scripts/verify quick`.
- A push to `main` deploys to production: only with the owner's explicit GO. Local hooks block it otherwise.
- Before starting a dev server, check that nothing else holds port 4321.
- Dev renders the 404 per request, so on `/wine/<missing>` the Wines nav link shows active in dev; the built `404.html` is prerendered as `/404` and highlights nothing.
- `.impeccable/live` injects a script into `src/layouts/Base.astro`; never commit while it is injected.
