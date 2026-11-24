# Next session
_Updated: 2026-11-24 11:44 -04 · Branch: fix/photo-provenance · Tool: Claude Code, claude-opus-5-5_

## Goal
Keep Paircraft a shippable search-first pocket guide. This task: record where the four photos without provenance came from.

## Changes
- 07a1586: `wines-hero` and `dishes-hero` carry their Unsplash page, author and license; both pages now show the credit.
- eccc0f0: `home-hero` and `regions/mendoza` are recorded as Unsplash by the owner's statement, with no photo page or author; they credit plain "Unsplash". `DESIGN.md` says the same.
- The three handoff commits from `docs/handoff-manifest` are on this branch. `git log origin/main..fix/photo-provenance` says whether all of it has been published.

## State
- measured: `./scripts/verify full` on eccc0f0 -> `RESULT mode=full pass=3 fail=0 unmeasured=0 manual_pending=2`, 2026-11-24 11:43 -04.
- measured: `origin/main` = 6510949, GitHub status success, 2026-11-24 11:43 -04. No open issues or pull requests.
- measured: credits render on `/`, `/wines`, `/dishes`, `/region/mendoza`, `/grape/malbec` and `/wine/catena-malbec` in dev; no overflow at 390 and 1440 px on the first four. Captures in `.harness/evidence/photo-provenance/`, only in the clone that did the work.
- measured: both resolved originals kept their download URL (macOS `kMDItemWhereFroms`) and match the shipped photos; author and license read on the Unsplash pages.
- inherited: the owner's statement that `home-hero` and Mendoza are Unsplash. Unsplash+ is not ruled out, and Mendoza's location is unverified.
- not reported as of this update: the owner's QA of the credits, desktop and real devices.

## Blocked on
The owner: QA of the six routes above, then a GO for the push, which deploys.

## Next action
If `git log origin/main..fix/photo-provenance` is empty, this is published: ask for the next task. Otherwise, with the QA and the GO: `HARNESS_PUBLISH=1 git push origin fix/photo-provenance:main`, then check the Vercel commit status on GitHub.

## Gotchas
- Re-measure before trusting this file: `git fetch`, `git status -sb` and `./scripts/verify quick`. Commits can reach `origin/main` from another clone.
- Unsplash answers 401 to scripted requests for search pages. Find the two missing pages by hand, then fill `author`, `source` and `license`.
- `photoCredit()` shows a credit as soon as `license` or `source` contains "Unsplash": put unverified leads in `note`.
- Screenshots at 390 px taken after 1440 px in the same browser session reuse the larger cached image and differ pixel by pixel. Use a fresh session per width.
- Before starting a dev server, check that nothing else holds port 4321.
- `.impeccable/live` injects a script into `src/layouts/Base.astro`; never commit while it is injected.
