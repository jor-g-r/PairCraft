# Ship the web app manifest without a service worker until offline is designed
- Status: accepted
- Date: 2026-11-23 · Decided by: the owner (proposal by the agent)

## Context
- measured: no page ever registered a service worker. The served HTML has no reference to `registerSW.js`, and `git log -S` finds no registration code in `src/` since the first scaffold.
- measured: `@vite-pwa/astro` 1.2.0 only writes `sw.js` to the client directory when `output === 'server'`. Paircraft uses the default static output with per-route `prerender = false`, so `sw.js` landed in `dist/server/` and never reached `.vercel/output/static/`.
- inferred: even if served, the generated worker bound every navigation to `/`, which is server-rendered and not precached, so Workbox would have failed at install.
- The home depends on the `pc_market` cookie, so any offline design must not serve a cached `/` blindly.

## Decision
`public/manifest.webmanifest` is a static file with the same content the plugin generated. There is no service worker and no `@vite-pwa/astro`. The site stays installable from the manifest; nothing works offline.

## Alternatives discarded
- Make the service worker work now: a worker is the hardest web change to undo (it stays in each browser until replaced), and offline needs a navigation design for the cookie-gated home first.
- Leave the dead config: it generated an unused worker and told readers the site had one.

## Consequences
- No browser has a Paircraft worker, so no clean-up worker is needed.
- Adding offline later starts from a clean base: choose the navigation strategy (network first with an offline page), register the worker in `Base.astro`, and check that `sw.js` is in the static output.
- Enforced by: prose (this record and the Stack line in `AGENTS.md`).
