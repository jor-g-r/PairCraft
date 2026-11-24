# Next session
_Updated: 2026-11-24 12:56 -04 · Branch: docs/handoff-photo-provenance · Tool: Claude Code, claude-opus-5-5_

## Goal
Keep Paircraft a shippable search-first pocket guide. The photo provenance task is deployed and closed by the owner.

## Changes
- 07a1586: `wines-hero` and `dishes-hero` carry their Unsplash page, author and license, and show the credit.
- eccc0f0: `home-hero` and `regions/mendoza` are recorded as Unsplash by the owner's statement, with no photo page or author; they credit plain "Unsplash". `DESIGN.md` says the same.
- Pushed to `main` and deployed with c6bd238.
- This file replaces a handoff that still asked for that push. `git log origin/main..docs/handoff-photo-provenance` says whether its own commit has been published.

## State
- measured: `origin/main` = c6bd238; GitHub status `Vercel: success`, 2026-11-24 12:31 -04.
- measured: `./scripts/verify full` on eccc0f0 -> `RESULT mode=full pass=3 fail=0 unmeasured=0 manual_pending=2`, 2026-11-24 11:43 -04. c6bd238 only adds the handoff.
- measured: credits render in dev on `/`, `/wines`, `/dishes`, `/region/mendoza`, `/grape/malbec` and `/wine/catena-malbec`. Captures in `.harness/evidence/photo-provenance/`, only in the clone that did the work.
- reported by the owner: reviewed in production and approved, 2026-11-24. The request named iPhone Safari and Android Chrome; the answer did not list devices.
- inherited: the owner's statement that `home-hero` and Mendoza are Unsplash. Unsplash+ is not ruled out, and Mendoza's location is unverified.

## Blocked on
Nothing. Before a public launch: the Unsplash pages of `home-hero` and Mendoza.

## Next action
When the owner gives the next task: `git fetch && git status -sb`, then its brief, on a branch from `docs/handoff-photo-provenance` so this commit goes out with that task's push (with the owner's GO) and the handoff does not spend a deploy.

## Gotchas
- Re-measure before trusting this file: `git fetch`, `git status -sb` and `./scripts/verify quick`. Commits can reach `origin/main` from another clone; local `main` is behind it.
- A push to `main` deploys to production: only with the owner's explicit GO. The local `pre-push` hook blocks it otherwise.
- Unsplash answers 401 to scripted requests for search pages. Find the two missing pages by hand, then fill `author`, `source` and `license`.
- `photoCredit()` shows a credit as soon as `license` or `source` contains "Unsplash": put unverified leads in `note`.
- Screenshots at 390 px taken after 1440 px in the same browser session reuse the larger cached image. Use a fresh session per width.
- Before starting a dev server, check that nothing else holds port 4321.
