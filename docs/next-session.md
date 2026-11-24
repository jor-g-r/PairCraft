# Next session
_Updated: 2026-11-24 16:30 -04 · Branch: docs/public-cleanup · Tool: Claude Code, claude-opus-5-5_

## Goal
Get Paircraft ready for its first demo. Photo provenance is deployed and closed by the owner; access and plans wait for demo evidence.

## Changes
- d78bcde: `PRODUCT.md` says what the code does (no runtime model call); people are named by role; monetisation and market strategy notes left the public files.
- 6229c7c: `docs/private/` is ignored. It holds the access hypothesis and the demo script, only in the clone that wrote them: not versioned, not backed up.
- b56349b: earlier handoff. c6bd238 (photo provenance) is already on `main`.
- `git log origin/main..docs/public-cleanup` says whether these commits have been published.

## State
- measured: `./scripts/verify full` on d78bcde -> `RESULT mode=full pass=3 fail=0 unmeasured=0 manual_pending=2`, 2026-11-24 16:30 -04. The static output is identical to the build of eccc0f0, so nothing visible changed.
- measured: the only names left in versioned files are the author credits in the footer and About, photographers, and retailer data.
- measured: `origin/main` = c6bd238, GitHub status `Vercel: success`, 2026-11-24 12:31 -04.
- reported by the owner: photo credits reviewed in production and approved, 2026-11-24; devices not listed.
- inherited: the owner's statement that `home-hero` and Mendoza are Unsplash. Unsplash+ is not ruled out, and Mendoza's location is unverified.
- not removed: Git history still holds everything taken out, and it is public.

## Blocked on
Nothing. Before a public launch: the Unsplash pages of `home-hero` and Mendoza.

## Next action
When the owner is ready, prepare the demo with `docs/private/demo-script.md`. For any other task: `git fetch && git status -sb`, then its brief, on a branch from `docs/public-cleanup` so these commits go out with that task's push (with the owner's GO).

## Gotchas
- Re-measure before trusting this file: `git fetch`, `git status -sb` and `./scripts/verify quick`. Commits can reach `origin/main` from another clone; local `main` is behind it.
- A push to `main` deploys to production: only with the owner's explicit GO.
- `git grep -E '\bword\b'` finds nothing on this Mac and looks clean. Use `git grep -w` with a known match as control.
- `photoCredit()` shows a credit as soon as `license` or `source` contains "Unsplash": put unverified leads in `note`.
- The deny list blocks `rm -rf`: copy to a fresh path instead of clearing one.
- Before starting a dev server, check that nothing else holds port 4321.
