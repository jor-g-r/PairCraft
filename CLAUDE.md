# Paircraft — Project Context

Wine and food pairings with short, opinionated explanations — pocket guide style, inspired by Hugh Johnson's *Pocket Wine Book*.

**Live:** https://pair-craft.vercel.app/ (auto-deploys on push to `main` — currently hosts the v1 chat-style MVP, which is being replaced)
**Status (2026-05-13):** v2 pivot approved. Canonical plan is now `paircraft-mvp-v2.md` (NOT the original `paircraft-mvp.md`). Shape: navigable entity-graph (Wine/Grape/Region/Dish), tier-only pairing scoring, hand-reviewed demo subset for profesor + Teo by Day 21 (2026-06-02). Week 1 starts: Astro Content Collections schemas + rules-as-data + pure tier engine.

---

## Strategic context (full plan elsewhere)

This is the v1 product of "Wedge B" — AI tools for hospitality/F&B in LATAM, leveraging the founder's CUHELAV (hospitality school) background. Strategy/operational docs live outside this repo:

- `/Users/user/LocalDocuments/sideprojects/Bootstrap/paircraft-mvp-v2.md` — **CANONICAL operational plan (since 2026-05-13)**. Entity-graph model, MVP-demo-first for profesor + Teo, tier-only scoring. Supersedes v1.
- `/Users/user/LocalDocuments/sideprojects/Bootstrap/paircraft-mvp.md` — v1 plan, preserved for traceability. §14 (CUHELAV affiliate) and §15 (Hugh Johnson voice + IP) are inherited unchanged by v2.
- `/Users/user/LocalDocuments/sideprojects/Bootstrap/Paircraft-—-Product-&-System-Description.txt` — original 12-month vision (symmetric food/wine model; superseded).
- `/Users/user/LocalDocuments/sideprojects/Bootstrap/README.md` — financial framing ($200/mo floor → $2000/mo aspiration, Pieter-Levels-style portfolio).
- `/Users/user/LocalDocuments/sideprojects/Bootstrap/offer-candidates.md` — portfolio context.

Always read `paircraft-mvp-v2.md` first if context is needed beyond what's here.

---

## Locked product decisions (don't relitigate without explicit signal)

- **Navigable entity graph, not chat UX.** v1 entities = Wine / Grape / Region / Dish. Each has a Content Collection, a URL, a page template. The chat-style "type a wine → 9 pairings out" surface from v1 is **removed**. FlavorNote / Method / Sauce / etc. live as tags, not entities (v0.2 promotion only if signal warrants).
- **Tri-modal rules layer (signature IP, preserved).** 13 rules from `src/lib/rules.ts`, tagged by mode:
  - `by Harmony` — matching/balancing (e.g., rich wine + rich food)
  - `by Contrast` — opposing axis (e.g., acid cuts fat, tannin meets protein)
  - `by Enhancement` — bridging notes (shared flavors, terroir, aromatic complement)
  - In v2 these become data (a `rules` collection with `strength: strong|moderate|mild`), consumed by the pure-function tier engine.
- **Pairing scoring = tier-only.** `Decisive match` / `Worth trying` / `Risky bridge` / `Skip` plus Hugh-voice prose. **No numeric score, no itemized `+25 / +18 / −6` breakdown** in v1. Numbers deferred to Day 36+ pending profesor + Teo feedback.
- **Voice anchor:** Hugh Johnson pocket-guide. Opinionated. One-sentence pairing explanations. "Drink this with that" — confidence > caveats. Test: would Hugh Johnson put this in a 200-page pocket guide, or save it for the encyclopedia? If encyclopedia-shaped, defer.
- **LLM is a curation-time layer, not a runtime engine.** Anthropic SDK drafts entity copy and pairing prose; user reviews; output is committed to Content Collections. Per-query LLM cost approaches zero. Free-text dish parsing is the one runtime LLM use (and only on the dish-input affordance).
- **Data layer: Astro Content Collections** (YAML/MDX, Zod schemas, cross-references). Supabase deferred to v0.2.
- **Product language: English at launch.** Spanish reserved as v0.2 i18n.
- **Auth: none in v1.** Demo is unlisted/password-gated. Public launch (Day 60) introduces hybrid signup wall at magic moment.
- **Mobile-first PWA.** Native wrap via Capacitor reserved for v0.2/v0.3.
- **Pricing:** $9/month or $79/year (provisional). Activates at Day 60, not at MVP-demo.

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

## Current state (v2, Week 1 — May 12-18)

Per `paircraft-mvp-v2.md` §6. Day 21 demo target: **2026-06-02**.

**Inherited from v1 scaffolding, still useful:**
- `src/lib/rules.ts` ✅ — 13 tri-modal rules. About to be **migrated to a `rules` Content Collection** with `strength` field per rule.
- `src/lib/prompt.ts` ✅ — voice-anchored cacheable prompt blocks. Will be reused at curation time for LLM-drafted entity copy.
- `src/lib/anthropic.ts` ✅ — Anthropic SDK wrapper. Same model (`claude-sonnet-4-6`), same Zod validation. Will be called from curation scripts, not from per-request actions.
- `src/styles/global.css` ✅ — Playfair + Open Sans + theme tokens. Editorial pass extends this in Week 3.
- `astro.config.mjs` env schema ✅ — `ANTHROPIC_API_KEY` via `astro:env`, already working in prod.

**To be replaced/removed (v1 chat MVP surface):**
- `src/actions/index.ts` — the `pair` action goes away; replaced by `parseDish` (free-text dish → tag extraction) later.
- `src/pages/index.astro` — chat form replaced by catalog home page (curated wine grid + entry points by Grape/Region/Dish).

**To be created in Week 1:**
- `src/content/config.ts` — Zod schemas for `wines`, `grapes`, `regions`, `dishes`, `rules` collections with cross-references via `reference()`.
- `src/lib/tier.ts` — pure-function tier engine (rule activations → `Decisive match | Worth trying | Risky bridge | Skip`). No weights, no numbers. Unit-tested.
- One debug page rendering a schema-validated wine entity to verify the data layer end-to-end.

**Week 1 end-of-week deliverable:** schemas live + tier function unit-tested + one wine renders from Content Collection in a debug route. NO entity pages yet (those are Week 2).

---

## Pending offline tasks (don't block Week 2)

From `paircraft-mvp.md §12`:

- §12.2 — Buy domain. Deferred by user to next month (June 2026). Order: `paircraft.com` → `.app` → `.ai` → `.co`.
- §12.3 — Fill 5 named B2C buyers in `paircraft-mvp.md §7 Pool B`. Deadline: 2026-05-18 (Week 2 close).
- §14.7 — Name 3 CUHELAV alumni for the Founder's Cut affiliate experiment. Deadline: 2026-05-25. Top candidate already in doc: Teo (De la Capellanía).
- §15.6 — Informal trademark search "Paircraft" in USPTO TESS + EUIPO + INPI/IMPI (CO/MX). Deadline: 2026-05-25. Free, ~30 min.

These are user-execution tasks; Claude doesn't need to drive them.
