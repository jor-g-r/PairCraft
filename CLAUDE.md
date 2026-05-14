# Paircraft — Project Context

Wine and food pairings with short, opinionated explanations — pocket guide style, inspired by Hugh Johnson's *Pocket Wine Book*.

**Live:** https://pair-craft.vercel.app/ (auto-deploys on push to `main` — currently hosts the v1 chat-style MVP, which is being replaced)
**Status (2026-05-13, EOD):** Weeks 1-3 of v2 plan all entregadas in one session. Day-21 demo is shippable from current `main`. Canonical plan is `paircraft-mvp-v2.md` (v1 superseded). Awaiting user track: Anthropic credit top-up + corpus expansion to ~10 wines via `bun run scripts/draft-pairings.ts`.

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

## Current state (end of 2026-05-13 — Weeks 1-3 closed)

Day 21 demo target: **2026-06-02**. Code-side, everything required for that demo is on `main`. The remaining work is user-track (curation expansion + offline tasks).

**What's live in prod (`pair-craft.vercel.app`):**
- Home `/` — catalog hub: wine cards + chips por grape/region/dish. Sticky "Paircraft" wordmark linked home from every page.
- `/wine/<slug>`, `/grape/<slug>`, `/region/<slug>`, `/dish/<slug>` — entity pages with cross-navigation, tri-modal pairing groups, Hugh-voice prose rendered in italic Playfair.
- Tier badges as chips (filled black for Decisive, light for Worth trying, outlined for Risky, hidden for Skip on wine pages, surfaced as "Better choices elsewhere" on dish pages).
- `robots.txt` Disallow + meta `noindex, nofollow` site-wide. `/debug` removed from prod.

**Engine + infra:**
- `src/content.config.ts` — 5 collections: `wines`, `grapes`, `regions`, `dishes`, `pairings`. References via `reference()`.
- `src/lib/rules.ts` — 13 tri-modal rules with `{ mode, strength, predicate }`. `terroir-bridge` predicate is always-false in v1 (no dish-region affinity field yet — re-activates in v0.2).
- `src/lib/tier.ts` — pure-function tier engine. 6/6 unit tests pass (`bun test src/lib/tier.test.ts`).
- `src/lib/prompt.ts` — `VOICE` + `serializeRules()` exported, reused by curation.ts.
- `src/lib/curation.ts` — `draftPairingProse()`. Uses `process.env.ANTHROPIC_API_KEY` (script context).
- `scripts/draft-pairings.ts` — idempotent orchestrator. Walks (wine × dish) combos, skips existing files and tier=skip, writes YAML to `src/content/pairings/`. **Verified structurally; blocked at last run on `credit_balance_too_low`** — needs API top-up before next run.

**Seed corpus (intentionally small for demo, expansion is user-track):**
- 2 wines (Catena Malbec 2021, Pazo de Señoráns Albariño 2022)
- 2 grapes (Malbec, Albariño)
- 2 regions (Mendoza, Rías Baixas)
- 4 dishes (Grilled ribeye, Oysters, Aged manchego, Fried calamari)
- 7 hand-drafted Hugh-voice pairings (Skip combos have no entry — Malbec × Oysters)

**Engine note worth flagging on next iteration:** Catena Malbec lands as Decisive against all non-Skip dishes (~3/3). The tier rubric over-fires Decisive when 2 strong rules activate. Three candidate fixes (deferred to post-Day-21 feedback): raise threshold to 3 strong, require multi-mode coverage, or add anti-rules. Don't tune blindly — wait for Teo + profesora feedback.

## Tomorrow's possible starting points

Pick based on energy + intent. None of these are blockers for shipping the demo.

1. **Curation expansion (user track).** Top up Anthropic credit at console.anthropic.com (your personal account — NOT the agency, per memory `agency-vs-personal-resources`). Then: seed 7-8 more wine/grape/region YAMLs in `src/content/`, run `bun run scripts/draft-pairings.ts`, review the generated prose files, commit the ones that pass Hugh-voice check.
2. **Demo dry-run.** Walk the site end-to-end as if you were profesora. Note anything that breaks the pocket-guide register. Bring observations to Claude for tweaks.
3. **Pre-feedback rubric prep.** Draft the 3-question feedback script for Teo + profesora (per `paircraft-mvp-v2.md §6` Day-21 plan). What you'd ask, what answers would shift target B2B vs B2C.
4. **Offline pending (v1 §12, deadlines drifting):** name 5 B2C Pool B contacts, name 3 CUHELAV alumni for Founder's Cut, informal trademark search "Paircraft".

---

## Pending offline tasks (don't block Week 2)

From `paircraft-mvp.md §12`:

- §12.2 — Buy domain. Deferred by user to next month (June 2026). Order: `paircraft.com` → `.app` → `.ai` → `.co`.
- §12.3 — Fill 5 named B2C buyers in `paircraft-mvp.md §7 Pool B`. Deadline: 2026-05-18 (Week 2 close).
- §14.7 — Name 3 CUHELAV alumni for the Founder's Cut affiliate experiment. Deadline: 2026-05-25. Top candidate already in doc: Teo (De la Capellanía).
- §15.6 — Informal trademark search "Paircraft" in USPTO TESS + EUIPO + INPI/IMPI (CO/MX). Deadline: 2026-05-25. Free, ~30 min.

These are user-execution tasks; Claude doesn't need to drive them.
