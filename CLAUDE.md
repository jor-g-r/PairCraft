# Paircraft — Project Context

Wine and food pairings with short, opinionated explanations — pocket guide style, inspired by Hugh Johnson's *Pocket Wine Book*.

**Live:** https://pair-craft.vercel.app/ (auto-deploys on push to `main` — hosts the v2 entity-graph product; the v1 chat MVP is gone)
**Status (2026-07-05):** **On deliberate pause since 2026-06-18** (last commit). Everything is committed, pushed, and live: full Medellín corpus (11 wines, 126 pairings), search-first home, visual system, and the market-gated feed (CO/VE/CL/AR). The **Day-21 demo for Teo + profesora has NOT happened** — original target 2026-06-02 lapsed, not cancelled; it remains the next milestone and the gate for tier-engine tuning. Canonical plan is `paircraft-mvp-v2.md` (v1 superseded).

---

## Strategic context (full plan elsewhere)

This is the v1 product of "Wedge B" — AI tools for hospitality/F&B in LATAM, leveraging the founder's CUHELAV (hospitality school) background. Strategy/operational docs live outside this repo:

- `/Users/user/LocalDocuments/sideprojects/Bootstrap/paircraft-mvp-v2.md` — **CANONICAL operational plan (since 2026-05-13)**. Entity-graph model, MVP-demo-first for profesor + Teo, tier-only scoring. Supersedes v1.
- `/Users/user/LocalDocuments/sideprojects/Bootstrap/paircraft-mvp.md` — v1 plan, preserved for traceability. §14 (CUHELAV affiliate) and §15 (Hugh Johnson voice + IP) are inherited unchanged by v2.
- `/Users/user/LocalDocuments/sideprojects/Bootstrap/paircraft-capacitor-spec.md` — **native-app wrap spec (2026-07-05, DRAFT).** Capacitor over React Native (decision record inside), Android-first sequencing, scenarios + precautions (Apple 4.2, Ventura/Xcode blocker for iOS, store-vs-demo-gating conflict, payments stay on web). Execution gated on the Day-21 demo; v0.2/v0.3 horizon.
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
- **Mobile-first PWA.** Native wrap via Capacitor reserved for v0.2/v0.3 — spec'd 2026-07-05 (`Bootstrap/paircraft-capacitor-spec.md`); React Native evaluated and rejected there.
- **Pricing:** $9/month or $79/year (provisional). Activates at Day 60, not at MVP-demo.

## Visual identity (locked)

- **Headings/wine names:** Playfair Display Variable (`font-display`)
- **Body:** Open Sans Variable (`font-sans`)
- Self-hosted via `@fontsource-variable/*`. Theme tokens in `src/styles/global.css`.
- Shipped foundations (2026-05-14): accent color token, view transitions, scroll reveals, editorial hero photography on home. Visual/branding work is the founder's personal creative outlet — don't plan it for them.
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

## Current state (2026-07-05 — on deliberate pause since 2026-06-18)

Working tree clean, `main` in sync with origin, prod deployed and responding. Two work bursts happened after the last status note: **2026-05-14** (corpus commit + search-first home + visual system) and **2026-06-18** (market-gated feed). Nothing code-side blocks the demo — the open items are user-track.

**Milestone check:** the Day-21 demo (target **2026-06-02**) **did not happen** — lapsed, not cancelled. It is still the next milestone. Consequence: no Teo/profesora feedback exists yet, so tier-engine tuning and the numeric-score decision (Day 36+) remain deliberately blocked.

**What's live in prod (`pair-craft.vercel.app`):**
- Home `/` — **search-first and market-gated**. Typeahead search (global scope, cyclic keyboard nav, a11y-polished), origin pills, filterable wine grid. The grid shows only wines stocked in the visitor's **market**, resolved as: cookie `pc_market` > Vercel `x-vercel-ip-country` header > default `CO`. A visible `<select>` lets the visitor override (sets the cookie, reloads). Markets with no curated bottles fall back to dominant-grape cards. Home is the **only SSR page** (`export const prerender = false`); the rest of the site stays static.
- `/wine/<slug>`, `/grape/<slug>`, `/region/<slug>`, `/dish/<slug>` — entity pages with cross-navigation, tri-modal pairing groups, Hugh-voice prose in italic Playfair. Wine pages surface flavour notes (primary/secondary/tertiary) and the strategic editorial fields; dish pages likewise.
- Visual system shipped 2026-05-14: accent token, view transitions, scroll reveals, Catena editorial hero photo on home, `Eyebrow` and `WineGlass` components, site-wide footer with editorial quote + creator credit. Tier badges as chips (filled black Decisive / light Worth trying / outlined Risky / Skip hidden on wine pages, "Better choices elsewhere" on dish pages).
- Still demo-gated: `robots.txt` `Disallow: /` + meta `noindex, nofollow` site-wide. No `/debug` in prod.

**Engine + infra:**
- `src/content.config.ts` — **6 collections:** `wines`, `grapes`, `regions`, `dishes`, `pairings`, `markets`. Wines carry `markets: z.array(z.string()).default(['CO'])` (ISO country codes = where the bottle is *sold*; distinct from origin `region.country`). Markets (`src/content/markets/*.mdx`) carry `code`, `name`, `tagline`, `dominantOrigins`, `dominantGrapes`, `retailers[]`. Strategic editorial fields on wines/dishes as documented before (all optional).
- `src/lib/rules.ts` — 13 tri-modal rules with `{ mode, strength, predicate }`. Unchanged since May; `terroir-bridge` still always-false in v1 (re-activates in v0.2).
- `src/lib/tier.ts` — pure-function tier engine. 6/6 unit tests pass (`bun test src/lib/tier.test.ts`). Unchanged since May.
- `src/lib/prompt.ts` + `src/lib/curation.ts` — unchanged. `LLM_PROVIDER` env switch (`anthropic` default, `opencode-go` alternate; Anthropic wins on Hugh-voice quality).
- Scripts: `draft-pairings.ts` (idempotent wine×dish orchestrator), `draft-entities.ts` (idempotent entity drafter from `scripts/seed/*.txt`, dep order regions→grapes→wines→dishes), `import-csv.ts` (one-shot Medellín CSV importer), `test-curation.ts` (print one pairing's prose without writing), and `backfill-region-grapes.ts` — idempotent, recomputes `signatureGrapes` per region from the wine corpus. **Already run: regions are backfilled** (commit 8b5c1f3).
- `scripts/scout-retailers.ts` + **playbook `scripts/market-scout.md`** (added 2026-07-05) — market-scout pipeline for adding/refreshing a country: web-search retailer discovery → platform probe (supports VTEX, WooCommerce, Shopify; VTEX dominates LATAM; always query the category tree, never free-text — "vino tinto" matches bedspreads) → catalog scrape → `scripts/seed/scout/` artifacts: per-retailer JSONs, candidates CSV ranked by multi-retailer presence (3+ = market staple), corpus availability cross-check with **two match levels** (cuvée vs producer-only; only cuvée justifies a `wine.markets` tag). `--cached` re-ranks without re-scraping. Prices in local currency per market. Output is review material — new wines still go through Jorge + `import-csv.ts`; never auto-imports.

**Corpus (stable since 2026-06-18):**
- **11 wines, 11 grapes, 11 regions, 12 dishes, 126 pairings, 4 markets (CO, VE, CL, AR).**
- Wines: Catena Malbec, 1865 Cab Sauv, Castillo de Molina Sauv Blanc, Enate Chardonnay, Leyda Pinot Noir, Mionetto Prosecco, Pazo Barrantes Albariño, Ramón Bilbao Crianza, Piccini Chianti Riserva, Gato Negro Blanco Dulce, Garzón Marselan Reserva. No vintages in slugs (producer/cuvée archetype, not bottlings). LATAM retail anchors in `availability.sourceUrl`.
- Dishes: 4 legacy (ribeye-grilled, oysters-raw, aged-manchego, fried-calamari) + 8 Medellín (lomo-a-la-parrilla, cerdo-asado, salmon-a-la-parrilla, ceviche, pasta-con-salsa-de-tomate, risotto-de-hongos, pollo-con-mole, tabla-de-quesos).
- 126 pairings LLM-drafted (Claude Sonnet 4.6, Hugh-voice); 6 tier=skip combos correctly have no file.
- **Market tags are deliberately conservative.** All wines are in CO (schema default). VE list **verified by Jorge 2026-06-18** (6 bottles: Catena, 1865, Castillo de Molina, Gato Negro, Leyda, Ramón Bilbao). CL/AR tag domestic bottles (grown there ⇒ high confidence; AR feed thin by design — only Catena) **plus scout-verified cuvées: Garzón Marselan earned CL 2026-07-05** (exact listing at La Vinoteca). Pending Jorge eyeball: Mionetto+CL (La Vinoteca lists "Mionetto Prosecco" without "brut" — likely ours). The other Europeans (Enate, Pazo Barrantes, Piccini) stay CO-only; scout found them nowhere else (Piccini producer-only in CO chains). Rule: **only cuvée-level scout matches justify tags, never producer-only** (see playbook §5).
- **Retailers (all scouted 2026-07-05):** CO 6 (Carulla, Dislicores, Vinos El Kiosco, Éxito, Jumbo, Olímpica — **all 11 corpus wines confirmed in CO retail**; 3 Dislicores-only: Leyda, Pazo Barrantes, Enate), CL 3 (La Vinoteca, Descorcha, VentaVinos — specialists only; every CL supermarket site is custom/bot-blocked, so supermarket value brands are a known blind spot), AR 4 (Jumbo, Día, ChangoMás, Winery — Jumbo/Disco/Vea share one Cencosud catalog; Carrefour/Coto blocked). VE keeps `retailers: []` — no fabricated names; playbook run pending. Evidence + URLs live in `scripts/seed/scout/<mkt>-corpus-availability.json`. The future "Recommended Wines" ads slot keys off `markets.retailers`.
- Market-selection policy (2026-06-18): LATAM-first; a market earns its place only with real curatable data OR a real user living there. Netherlands was a throwaway VPN-test market, added and removed the same day.

**Engine note (still open, still gated on demo feedback):** Tier engine over-fires Decisive — most wines land Decisive against most non-Skip dishes (e.g. 1865 Cab decisive on 11/12 dishes) because 2 strong rules firing is enough. Candidate fixes: raise threshold to 3 strong, require multi-mode coverage, or add anti-rules. **Don't tune blindly — wait for Teo + profesora feedback from the demo.**

## Reactivation starting points

The pause is deliberate; when work resumes, these are the live threads in rough priority order:

1. **Do the Day-21 demo** (overdue since 2026-06-02). It's shippable from `main` as-is. Prep = draft the 3-question feedback script for Teo + profesora (`paircraft-mvp-v2.md §6`) + a dry-run walk of the site in demo register.
2. **Post-demo: tier-engine tuning** with real feedback (see engine note above). This also unblocks the Day-36+ numeric-score decision.
3. **Run the market-scout playbook for VE** (`scripts/market-scout.md`; CO/CL/AR done 2026-07-05 — 13 retailers total, ~7100 unique candidates across three markets). VE needs manual/browser work (thin retail e-commerce). Corpus-expansion review material: `scripts/seed/scout/{co,cl,ar}-candidates.csv`. Also pending Jorge: Mionetto+CL tag eyeball (playbook §CL).
4. **Offline tasks** (see below — domain purchase deadline already lapsed).

---

## Offline tasks (user-track; statuses as of 2026-07-05)

From `paircraft-mvp.md §12/§14/§15`:

- §15.6 — Informal trademark search "Paircraft" (USPTO TESS + EUIPO + INPI/IMPI). **DONE** (confirmed 2026-07-05; outcome not recorded — note here if anything surfaced).
- §12.2 — Buy domain. **Pending; June 2026 target lapsed.** Order: `paircraft.com` → `.app` → `.ai` → `.co`.
- §12.3 — Fill 5 named B2C buyers in `paircraft-mvp.md §7 Pool B`. **Pending; deadline 2026-05-18 lapsed.**
- §14.7 — Name 3 CUHELAV alumni for the Founder's Cut affiliate experiment. **Pending; deadline 2026-05-25 lapsed.** Top candidate already in doc: Teo (De la Capellanía).

These are user-execution tasks; Claude doesn't need to drive them, but should surface the lapsed ones when the project reactivates.
