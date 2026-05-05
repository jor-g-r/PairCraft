# Paircraft — Project Context

Wine and food pairings with short, opinionated explanations — pocket guide style, inspired by Hugh Johnson's *Pocket Wine Book*.

**Live:** https://pair-craft.vercel.app/ (auto-deploys on push to `main`)
**Status (2026-05-05):** Week 1 of 90-day MVP complete. Ready for Week 2.

---

## Strategic context (full plan elsewhere)

This is the v1 product of "Wedge B" — AI tools for hospitality/F&B in LATAM, leveraging the founder's CUHELAV (hospitality school) background. Strategy/operational docs live outside this repo:

- `/Users/user/LocalDocuments/sideprojects/Bootstrap/paircraft-mvp.md` — **canonical operational plan**: scope, weekly cadence, kill criteria, distribution, all resolved Q1-Q5 decisions.
- `/Users/user/LocalDocuments/sideprojects/Bootstrap/Paircraft-—-Product-&-System-Description.txt` — original 12-month vision (symmetric food/wine model; superseded by tri-modal wine-primary decision).
- `/Users/user/LocalDocuments/sideprojects/Bootstrap/README.md` — financial framing ($200/mo floor → $2000/mo aspiration, Pieter-Levels-style portfolio).
- `/Users/user/LocalDocuments/sideprojects/Bootstrap/offer-candidates.md` — portfolio context.

Always read `paircraft-mvp.md` first if context is needed beyond what's here.

---

## Locked product decisions (don't relitigate without explicit signal)

- **Wine is the primary structured entity.** Wines are hand-curated (target: 50-100 in v1). Food is a tag taxonomy (`protein` × `flavor_profile` × `intensity`), NOT entities. The original .txt's symmetric food/wine model is superseded.
- **Tri-modal pairing output (signature IP).** Every query returns **3 pairings per mode × 3 modes = 9 total**. Modes:
  - `by Harmony` — matching/balancing (e.g., rich wine + rich food)
  - `by Contrast` — opposing axis (e.g., acid cuts fat, tannin meets protein)
  - `by Enhancement` — bridging notes (shared flavors, terroir, aromatic complement)
  - Rules in the engine MUST be tagged by mode.
- **Voice anchor:** Hugh Johnson pocket-guide. Opinionated. One-sentence pairing explanations. "Drink this with that" — confidence > caveats. Test: would Hugh Johnson put this in a 200-page pocket guide, or save it for the encyclopedia? If encyclopedia-shaped, defer.
- **Two food modes share one engine:** `snacks-default` (curated category list — quesos, charcutería, etc.) and `restaurant/dish mode` (free-text dish → tag extraction → match).
- **Wine schema (Path C: model now, render later):** in addition to structural attrs, store `flavouring.{primary, secondary, tertiary}[]` and `tannin_profile.{softness, astringency, complexity, structure}`. v0.1 stores them but only renders the top section + tri-modal pairing grid. Wireframe shows v0.2-v0.3 visual horizon.
- **Product language: English at launch.** Spanish reserved as v0.2 i18n if Pool B (mostly LATAM) feedback warrants. Wedge B is geographic, not language-bound.
- **Auth (v0.1): none.** Fully public, IP-based rate limit (5 queries/day per IP) + hard monthly LLM-spend cap. Hybrid signup wall comes in v0.2 weeks 5-6, gate placed at data-revealed "magic moment" query.
- **Mobile-first PWA.** Native wrap via Capacitor reserved for v0.2/v0.3 if revenue signal justifies. NOT an App-Store-day-1 product.
- **Pricing:** $9/month or $79/year (provisional, reset after 10 paying users). Free tier = 5 queries/day anonymous.

## Visual identity (locked)

- **Headings/wine names:** Playfair Display Variable (`font-display`)
- **Body:** Open Sans Variable (`font-sans`)
- Self-hosted via `@fontsource-variable/*`. Theme tokens in `src/styles/global.css`.
- Mobile-first responsive. Reference wireframe: Merlot detail page (grape illustration + name + tagline + Sweet/Sour slider + 4 property cards + tri-modal pairing grid + Flavouring/Tannins detail). v0.1 ships only top section + tri-modal grid; rest is v0.2.

---

## Stack

- **Astro 6** with TypeScript strict
- **Tailwind v4** (CSS-first via `@tailwindcss/vite`, `@theme` tokens in `src/styles/global.css`)
- **@vite-pwa/astro** — manifest + service worker (autoUpdate)
- **@astrojs/vercel** — adapter for on-demand server endpoints (Astro Actions / API routes)
- **@anthropic-ai/sdk** — Claude SDK for the pairing engine
- **@fontsource-variable/playfair-display** + **@fontsource-variable/open-sans**
- **Bun** runtime + package manager

## Conventions

- **Bun, not npm/pnpm/yarn.** `bun install`, `bun add`, `bunx`. If Vercel auto-detects npm, override Build Command to `bun install && bun run build`.
- **Mobile-first design.** Test on iPhone Safari + Android Chrome before considering UI work "done".
- **Tailwind utilities first.** Custom CSS only when truly necessary.
- **Comments only when the *why* is non-obvious.** Don't narrate what code does.
- **Commit style:** present-tense imperative. Reference `paircraft-mvp.md §X` for traceability when relevant.
- **No backwards-compat shims** unless we have real users on a prior version (we don't yet).

---

## Repo + Deploy

- **Repo:** `git@github.com:jor-g-r/PairCraft.git` (private)
- **Branch:** `main` only for now. PRs not required (solo dev). Direct push.
- **CI/CD:** Vercel via GitHub integration. Push to `main` → production.

---

## What's next — Week 2 (2026-05-12 → 2026-05-18)

Per `paircraft-mvp.md` §10:

1. **Rules layer drafted** — 10-15 rules in TypeScript (`src/lib/rules.ts`), each tagged with `mode: 'harmony' | 'contrast' | 'enhancement'`. Pure-data shape; the LLM uses them as context, doesn't replace them.
2. **First Astro Action** (`src/actions/index.ts`) — takes a wine identifier (or text input), invokes Claude with rules layer + wine attributes as context, returns 9 structured pairing recommendations.
3. **Tri-modal grid render** — replace the placeholder homepage with a basic input → 9-cell result page using Playfair for headings + the tri-modal section labels.

Open architectural decision for Week 2: **one Claude call returning 9 results structured, vs. three parallel calls (one per mode)**. Trade-offs: latency vs. cost vs. coherence vs. prompt simplicity. Decide at start of Week 2.

API key needed: `ANTHROPIC_API_KEY` from console.anthropic.com → `.env` (local) and Vercel env vars (production). Server-side only — never expose to client.

---

## Pending offline tasks (don't block Week 2)

From `paircraft-mvp.md §12`:

- §12.2 — Buy domain. Deferred by user to next month (June 2026). Order: `paircraft.com` → `.app` → `.ai` → `.co`.
- §12.3 — Fill 5 named B2C buyers in `paircraft-mvp.md §7 Pool B`. Deadline: 2026-05-18 (Week 2 close).

These are user-execution tasks; Claude doesn't need to drive them.
