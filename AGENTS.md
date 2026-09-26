# Paircraft — Project Context

Wine and food pairings with short, opinionated explanations — pocket guide style, inspired by Hugh Johnson's *Pocket Wine Book*.

**Live:** https://pair-craft.vercel.app/ (auto-deploys on push to `main` — hosts the v2 entity-graph product; the v1 chat MVP is gone)
**Status (2026-09-25):** Live: search-first home, visual system, market-gated feed across **7 markets** (CO/VE/CL/AR + ES/FR/AE), market-scout pipeline (CO/CL/AR/VE catalogs scraped; ~7900 candidates on file). Corpus at **21 wines / 240 pairings** (scout-driven expansion 2026-07-05, commit `7231b51`; +2 wines in commit `f5f3dc8`). **Bilingual EN/ES shipped 2026-08-17** (commit `f5f3dc8`: `LangToggle` + `*Es` fields; entities 100% translated, pairings 72/240 — rest falls back to EN). Paircraft logo + favicon 2026-08-20 (commits `4542f3a`/`8ea098e`). **Design-system burst 2026-09-25** (commits `c0ccb20`→`b6c616d`): impeccable design tooling + `PRODUCT.md`/`DESIGN.md`, light/dark tokens + top nav, `/wines` `/dishes` `/about` `/pair` routes, entity pages rebuilt from the approved Merlot wireframe, plus the **phase-2 imagery pass** — 18 scene photos (15 regions + 3 catalog bands) as WebP with `*.source.json` provenance sidecars, `PhotoBand` + `region-images.ts`, `Eyebrow` retired. The imagery phase is **shipped but NOT closed**: open on Jorge's visual review (live session parked), device QA, finish review + verdict, and the Mendoza provenance confirmation (see Reactivation §1). The **Day-21 demo for Teo + profesora has NOT happened** — original target 2026-06-02 lapsed, not cancelled; it remains the next milestone and the gate for tier-engine tuning. Canonical plan is `paircraft-mvp-v2.md` (v1 superseded).

**Dev agent stack:** OpenCode + Codex (since ~Sep 2026; Claude Code retired from this repo). This file is `AGENTS.md` — renamed from the former `CLAUDE.md` (2026-09-14) because OpenCode treats `AGENTS.md` as primary and Codex only reads `AGENTS.md`. The curation-time LLM remains the Anthropic SDK (see Stack).

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
- **Product language: bilingual EN/ES since 2026-08-17** (originally locked as "English at launch, Spanish reserved for v0.2" — shipped early in commit `f5f3dc8`). Client-side toggle (`LangToggle.astro` pill in header) + optional `*Es` fields across all 6 collections. Per-field EN fallback where ES is missing — **168 of 240 pairings still lack `explanationEs`** (open i18n task).
- **Auth: none in v1.** Demo is unlisted/password-gated. Public launch (Day 60) introduces hybrid signup wall at magic moment.
- **Mobile-first PWA.** Native wrap via Capacitor reserved for v0.2/v0.3 — spec'd 2026-07-05 (`Bootstrap/paircraft-capacitor-spec.md`); React Native evaluated and rejected there.
- **Pricing:** $9/month or $79/year (provisional). Activates at Day 60, not at MVP-demo.

## Visual identity (locked)

- **Headings/wine names:** Playfair Display Variable (`font-display`)
- **Body:** Open Sans Variable (`font-sans`)
- Self-hosted via `@fontsource-variable/*`. Theme tokens in `src/styles/global.css`.
- Shipped foundations (2026-05-14): accent color token, view transitions, scroll reveals, editorial hero photography on home. Visual/branding work is the founder's personal creative outlet — don't plan it for them. Paircraft logo in navbar + favicon shipped 2026-08-20 (commits `4542f3a`/`8ea098e`).
- Mobile-first responsive. Reference wireframe: Merlot detail page (grape illustration + name + tagline + Sweet/Sour slider + 4 property cards + tri-modal pairing grid + Flavouring/Tannins detail). v0.1 ships only top section + tri-modal grid; rest is v0.2. **Superseded 2026-09-25:** the wireframe-aligned rebuild (commit `40628bc`) shipped the property grid + sensory tracks + tri-modal groups on real entity pages; `DESIGN.md` is the record of what shipped and the authority for visual decisions.

---

## Stack

- **Astro 6** with TypeScript strict
- **Tailwind v4** (CSS-first via `@tailwindcss/vite`, `@theme` tokens in `src/styles/global.css`)
- **@vite-pwa/astro** — manifest + service worker (autoUpdate)
- **@astrojs/vercel** — adapter for on-demand server endpoints (Astro Actions / API routes)
- **@anthropic-ai/sdk** — Claude SDK for the pairing engine
- **@fontsource-variable/playfair-display** + **@fontsource-variable/open-sans**
- **Bun** runtime + package manager
- **Dev agent stack: OpenCode + Codex** (Claude Code retired ~Sep 2026). Project memory file: this `AGENTS.md` (rename of `CLAUDE.md`, 2026-09-14).

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

## Current state (2026-09-25)

Working tree clean, `main` in sync with origin (HEAD `b6c616d`), prod deployed and responding (imagery verified live 2026-09-25: bands + CC credits render in prod). Work bursts to date: **2026-05-14** (corpus commit + search-first home + visual system), **2026-06-18** (market-gated feed), **2026-07-05** (scout-driven corpus expansion + ES/FR/AE markets), **2026-08-17** (EN/ES i18n + 2 wines, commit `f5f3dc8`), **2026-08-20** (logo/favicon, commits `4542f3a`/`8ea098e`), **2026-09-25 burst A — design system** (impeccable skill + `PRODUCT.md`/`DESIGN.md` + `.impeccable/surfaces/paircraft.md` direction contract; light/dark semantic tokens + sticky two-row top nav + EN/ES UI strings, commit `8d3f8e0`; `/wines` `/dishes` `/about` `/pair` routes + dish-search API, commit `d63dd7d`; entity pages rebuilt from Jorge's approved Merlot light/dark wireframes, commit `40628bc`), **2026-09-25 burst B — phase-2 imagery** (commit `b6c616d`; see Reactivation §1 for what remains open). Nothing code-side blocks the demo — the open items are phase-2 closeout + user-track.

**Milestone check:** the Day-21 demo (target **2026-06-02**) **did not happen** — lapsed, not cancelled. It is still the next milestone. Consequence: no Teo/profesora feedback exists yet, so tier-engine tuning and the numeric-score decision (Day 36+) remain deliberately blocked.

**What's live in prod (`pair-craft.vercel.app`):**
- Home `/` — **search-first and market-gated**. Typeahead search (global scope, cyclic keyboard nav, a11y-polished), origin pills, filterable wine grid. The grid shows only wines stocked in the visitor's **market**, resolved as: cookie `pc_market` > Vercel `x-vercel-ip-country` header > default `CO`. A visible `<select>` lets the visitor override (sets the cookie, reloads). Markets with no curated bottles fall back to dominant-grape cards. Home is the **only SSR page** (`export const prerender = false`); the rest of the site stays static.
- `/wine/<slug>`, `/grape/<slug>`, `/region/<slug>`, `/dish/<slug>` — entity pages with cross-navigation, tri-modal pairing groups, Hugh-voice prose in italic Playfair. Wine pages surface flavour notes (primary/secondary/tertiary) and the strategic editorial fields; dish pages likewise.
- Visual system shipped 2026-05-14: accent token, view transitions, scroll reveals, Catena editorial hero photo on home, `WineGlass` component (`Eyebrow` later retired 2026-09-25, commit `b6c616d` — craft-floor bans kickers), site-wide footer with editorial quote + creator credit. Tier badges as chips (filled black Decisive / light Worth trying / outlined Risky / Skip hidden on wine pages, "Better choices elsewhere" on dish pages).
- Bilingual EN/ES since 2026-08-17: `LangToggle.astro` pill in header; client-side i18n engine (`data-i18n` / `data-es-value` / `data-lang-content` attributes); `*Es` fields across all 6 collections; per-field EN fallback where ES is missing.
- Paircraft logo in navbar + favicon since 2026-08-20.
- **2026-09-25 burst A:** `/wines` `/dishes` (ruled catalog rows + origin filters; `/wines` persists filter state to the query string + `pc_catalog_query` session storage for catalog-return links), `/about`, and `/pair` — the free-text dish input whose runtime-LLM routes to curated dishes only (never generated verdicts). Entity pages rebuilt from the approved wireframe: oval property panels, thin sensory tracks, tri-modal pairing groups, tier chips. `DESIGN.md` is the source of truth for all current surfaces.
- **2026-09-25 burst B — imagery (commit `b6c616d`):** editorial scene photographs on every surface — 15 region bands, a "From <region>" band closing wine pages' "In the glass" section, a "From <region>" strip on grape pages, and eager catalog bands on `/wines` (cellar) `/dishes` (table) `/pair` (set table). Every asset carries a `*.source.json` provenance sidecar; CC BY-SA credits render in captions (ribera-del-duero, somontano, pays-doc); dish-page eyebrows became italic Playfair section headings; home's "or browse" kicker became a plain hairline. Photos are scene imagery, never the specific bottle.
- Still demo-gated: `robots.txt` `Disallow: /` + meta `noindex, nofollow` site-wide. No `/debug` in prod.

**Engine + infra:**
- `src/content.config.ts` — **6 collections:** `wines`, `grapes`, `regions`, `dishes`, `pairings`, `markets`. Wines carry `markets: z.array(z.string()).default(['CO'])` (ISO country codes = where the bottle is *sold*; distinct from origin `region.country`). Markets (`src/content/markets/*.mdx`) carry `code`, `name`, `tagline`, `dominantOrigins`, `dominantGrapes`, `retailers[]`. Strategic editorial fields on wines/dishes as documented before (all optional).
- `src/lib/rules.ts` — 13 tri-modal rules with `{ mode, strength, predicate }`. Unchanged since May; `terroir-bridge` still always-false in v1 (re-activates in v0.2).
- `src/lib/tier.ts` — pure-function tier engine. 6/6 unit tests pass (`bun test src/lib/tier.test.ts`). Unchanged since May.
- `src/lib/prompt.ts` + `src/lib/curation.ts` — unchanged. `LLM_PROVIDER` env switch (`anthropic` default, `opencode-go` alternate; Anthropic wins on Hugh-voice quality).
- Scripts: `draft-pairings.ts` (idempotent wine×dish orchestrator), `draft-entities.ts` (idempotent entity drafter from `scripts/seed/*.txt`, dep order regions→grapes→wines→dishes), `import-csv.ts` (one-shot Medellín CSV importer), `test-curation.ts` (print one pairing's prose without writing), and `backfill-region-grapes.ts` — idempotent, recomputes `signatureGrapes` per region from the wine corpus. **Already run: regions are backfilled** (commit 8b5c1f3). Translation scripts (2026-08-17): `translate-content.ts`, `translate-mdx.ts`, `translate-mdx-remaining.ts`. Caveat: `draft-pairings.ts` writes `explanation` only, no `explanationEs` — newly drafted pairings are EN-only until a translation pass runs.
- `scripts/scout-retailers.ts` + **playbook `scripts/market-scout.md`** (added 2026-07-05) — market-scout pipeline for adding/refreshing a country: web-search retailer discovery → platform probe (supports VTEX, WooCommerce, Shopify; VTEX dominates LATAM; always query the category tree, never free-text — "vino tinto" matches bedspreads) → catalog scrape → `scripts/seed/scout/` artifacts: per-retailer JSONs, candidates CSV ranked by multi-retailer presence (3+ = market staple), corpus availability cross-check with **two match levels** (cuvée vs producer-only; only cuvée justifies a `wine.markets` tag). `--cached` re-ranks without re-scraping. Prices in local currency per market. Output is review material — new wines still go through Jorge + `import-csv.ts`; never auto-imports.
- **Imagery layer (2026-09-25, commit `b6c616d`):** `src/lib/region-images.ts` (import.meta.glob over `src/assets/regions/*.webp` + `*.source.json`; sidecars are the single source of truth for alt text and credits), `src/components/PhotoBand.astro` (21:9 band / 3:1 grape strip, lazy default / eager on the 3 catalog bands, dark-mode `brightness-[0.87] saturate-[0.94]`, figcaption = label span + CC credit where the license requires). 18 assets: 15 regions + `wines-cellar` / `dishes-table` / `pair-table`. **Mendoza band provenance unrecorded** (flagged in its sidecar) — confirm with Jorge before any public launch.
- **Impeccable design tooling (2026-09-25):** `.agents/skills/impeccable/` skill + `PRODUCT.md` + `DESIGN.md` + `.impeccable/design.json` + `.impeccable/surfaces/paircraft.md` (direction contract). Live-mode config committed at `.impeccable/live/config.json` (injection target `src/layouts/Base.astro`; no CSP in the project). `.impeccable/review/` (gitignored, on-disk only) holds 26 phase-2 screenshots (light/dark × desktop/mobile) + 5 from the burst-A session.
- **Dev-server ops (learned 2026-09-25):** run the dev server detached via `screen -dmS paircraft-dev bash -c 'cd /Users/user/LocalDocuments/sideprojects/paircraft && bun run dev --host 127.0.0.1 > /tmp/paircraft-dev.log 2>&1'` — plain backgrounded processes get SIGTERM'd when the agent's shell call ends, and a stale server instance can 500 every `/_image` request with `MissingSharp` (restart fixes; `sharp` is installed). `agent-browser` CLI is available for screenshots/DOM verification (dark mode via `set media dark`, mobile via `set viewport 390 844`).

**Corpus (as of 2026-09-25, unchanged since 2026-09-14):**
- **21 wines, 15 grapes, 15 regions, 12 dishes, 240 pairings, 7 markets** (CO, VE, CL, AR + ES, FR, AE added 2026-07-05).
- **Corpus expansion 2026-07-05 (scout-driven, 8 wines):** Santa Carolina Reservado Carmenère (CL), Norton Malbec, Trapiche Broquel Torrontés, Chandon Extra Brut, Alamos Malbec Rosé (AR ×4), Moët & Chandon Brut Impérial, JP Chenet Merlot (FR ×2), Protos Roble (ES). Selection criteria: multi-retailer presence in CO (3-5 chains each, Éxito URLs in `availability.sourceUrl`) + corpus gaps (first rosado, first Champagne, first Carmenère/Torrontés/Merlot, second Spanish region). New grapes: carmenere, torrontes, merlot, pinot-meunier. New regions: salta, champagne, pays-doc, ribera-del-duero. 92 new pairings drafted (10 combos correctly skip). Feed effects: AR 1→5, FR 0→2, ES 3→4, CL 5→6, CO 11→19 wines.
- **+2 wines 2026-08-17 (commit `f5f3dc8`, selection rationale not recorded):** Catena Angélica Zapata Malbec (`angelica-zapata-malbec`), Casillero del Diablo Reserva Cabernet Sauvignon (`casillero-del-diablo-reserva-cabernet-sauvignon`) — 11 pairings each (5 with ES). Corpus: 19→21 wines, 218→240 pairings.
- Wines: Catena Malbec, 1865 Cab Sauv, Castillo de Molina Sauv Blanc, Enate Chardonnay, Leyda Pinot Noir, Mionetto Prosecco, Pazo Barrantes Albariño, Ramón Bilbao Crianza, Piccini Chianti Riserva, Gato Negro Blanco Dulce, Garzón Marselan Reserva. No vintages in slugs (producer/cuvée archetype, not bottlings). LATAM retail anchors in `availability.sourceUrl`.
- Dishes: 4 legacy (ribeye-grilled, oysters-raw, aged-manchego, fried-calamari) + 8 Medellín (lomo-a-la-parrilla, cerdo-asado, salmon-a-la-parrilla, ceviche, pasta-con-salsa-de-tomate, risotto-de-hongos, pollo-con-mole, tabla-de-quesos).
- Pairings: 126 from the original 11-wine corpus + 92 from the 2026-07-05 expansion + 22 from the 2026-08-17 additions = **240 on file** (all LLM-drafted, Claude Sonnet 4.6, Hugh-voice; 6 tier=skip combos correctly have no file). **ES coverage: 72/240 have `explanationEs`; the other 168 fall back to EN** — completing this is the open i18n task.
- **Market tags are deliberately conservative.** All wines are in CO (schema default). VE list **verified by Jorge 2026-06-18** (6 bottles: Catena, 1865, Castillo de Molina, Gato Negro, Leyda, Ramón Bilbao) **+ 3 scout-earned VE tags 2026-07-05: Moët, Protos Roble, Enate Chardonnay** (cuvée-level listings at Licoteca/El Catador; Norton "Reserva" rejected — tier mismatch). CL/AR/ES tag domestic bottles (grown there ⇒ high confidence; AR feed thin by design — only Catena; **ES tags added 2026-07-05: Ramón Bilbao, Enate, Pazo Barrantes**) **plus scout-verified cuvées: Garzón Marselan earned CL 2026-07-05** (exact listing at La Vinoteca). Mionetto+CL **confirmed by Jorge 2026-07-06** (La Vinoteca base listing = Treviso Brut). Piccini stays CO-only (producer-only in CO chains). FR/AE have zero tagged wines → grape-fallback feeds by design. Rule: **only cuvée-level scout matches or domestic production justify tags, never producer-only** (see playbook §5).
- **Retailers (all verified 2026-07-05):** CO 6 (Carulla, Dislicores, Vinos El Kiosco, Éxito, Jumbo, Olímpica — **all 11 corpus wines confirmed in CO retail**; 3 Dislicores-only: Leyda, Pazo Barrantes, Enate), CL 3 (La Vinoteca, Descorcha, VentaVinos — specialists only; every CL supermarket site is custom/bot-blocked, so supermarket value brands are a known blind spot), AR 4 (Jumbo, Día, ChangoMás, Winery — Jumbo/Disco/Vea share one Cencosud catalog; Carrefour/Coto blocked), **VE 3 (Licoteca, El Catador, Curda 24 — specialist e-shops, scouted 2026-07-05; Licores Mundiales/Prodelsur bot-blocked, Gama/Sigo custom SPAs; Jorge's 6 manual VE wine tags stand — scout absence ≠ counter-evidence)**, **ES 5 / FR 3 / AE 2 (retailers verified live, catalogs NOT scraped — all bot-protected or custom stacks; agent-browser is the documented path if depth is needed, playbook §ES/§FR/§AE)**. Scout evidence + URLs live in `scripts/seed/scout/<mkt>-corpus-availability.json` (CO/CL/AR/VE). The future "Recommended Wines" ads slot keys off `markets.retailers`.
- Market-selection policy: originally LATAM-first (2026-06-18; a market earns its place only with real curatable data OR a real user living there — Netherlands was a throwaway VPN-test market, added and removed same day). **Loosened by Jorge 2026-07-05: ES/FR/AE added as strategic global markets.** The honesty bar stays: verified retailers only, tags only with evidence or domestic logic, feeds allowed to be empty (FR/AE run on grape fallback).

**Engine note (still open, still gated on demo feedback):** Tier engine over-fires Decisive — most wines land Decisive against most non-Skip dishes (e.g. 1865 Cab decisive on 11/12 dishes) because 2 strong rules firing is enough. Candidate fixes: raise threshold to 3 strong, require multi-mode coverage, or add anti-rules. **Don't tune blindly — wait for Teo + profesora feedback from the demo.**

## Reactivation starting points

These are the live threads in rough priority order (as of 2026-09-25):

1. **Close the phase-2 imagery pass** — implementation shipped in commit `b6c616d` (2026-09-25, verified: build/check/tests/`impeccable detect` green, 26 screenshots captured, DOM verification green — bands load, CC credits render, no mobile overflow). What remains, in order:
   - **Jorge's visual review** (he has not yet looked at the shipped imagery): 26 screenshots sit in `.impeccable/review/` (local-only, gitignored — `<surface>-{light,dark}-{desktop,mobile}.png`), or he directs changes live: boot `.agents/skills/impeccable/scripts/impeccable live`, open the app URL (`http://127.0.0.1:4321/`), then loop `.agents/skills/impeccable/scripts/impeccable live-poll` (foreground, default long timeout; handle generate/steer/accept per `.agents/skills/impeccable/reference/live.md`). Stop with `impeccable live-server stop`. Note: the 2026-09-25 live session was booted, polled ~30 min with no events, and parked cleanly at Jorge's request (injection removed, no wrappers left behind); `impeccable live-resume` is the recovery path if a session ever hangs mid-flight.
   - **Device QA:** iPhone Safari + Android Chrome (project convention before UI work is "done").
   - **Surface-brief FINISH owed items** (`.impeccable/surfaces/paircraft.md`): the finish review + verdict never ran. DESIGN.md documentation and raster provenance are done; the review/verdict is what's left of that contract.
   - **Mendoza band provenance** unrecorded (flagged in `src/assets/regions/mendoza.source.json`) — confirm with Jorge or swap the asset before any public launch.
   - Cosmetic leftover: i18n key `home.orBrowse` is now unused (harmless; remove if touched otherwise).
2. **Do the Day-21 demo** (overdue since 2026-06-02) — **still pending as of 2026-09-25**. It's shippable from `main` as-is. The 3-question feedback script is DRAFTED: `Bootstrap/paircraft-demo-feedback-script.md` (B2B-vs-B2C question, tier-credibility question, open what's-missing question + observational note). Remaining prep: Jorge schedules with profesor + Teo; optional agent dry-run of the site in demo register before they see it. Post-demo: re-anchor Day-35/Day-60 dates (both lapsed).
3. **Complete the ES translation of pairings** — 168 of 240 lack `explanationEs` (entities are 100% done). Run a translation pass over `src/content/pairings/*.yaml` in the same Hugh-voice register (see `scripts/translate-*.ts` for the pattern). Independent of the demo; can be done anytime.
4. **Post-demo: tier-engine tuning** with real feedback (see engine note above). This also unblocks the Day-36+ numeric-score decision.
5. **Market-scout playbook: all 4 LATAM markets done** (`scripts/market-scout.md`; CO/CL/AR/VE scraped 2026-07-05 — 16 retailers, ~7900 unique candidates in `scripts/seed/scout/*-candidates.csv`). ES/FR/AE retailer-verified but catalogs bot-blocked → agent-browser if depth ever needed. French corpus wines remain an editorial decision (FR feed shows Moët + JP Chenet).
6. **Offline tasks** (see below — domain purchase deadline already lapsed).

---

## Offline tasks (user-track; statuses as of 2026-09-25)

From `paircraft-mvp.md §12/§14/§15`:

- §15.6 — Informal trademark search "Paircraft" (USPTO TESS + EUIPO + INPI/IMPI). **DONE** (confirmed 2026-07-05; outcome not recorded — note here if anything surfaced).
- §12.2 — Buy domain. **Pending; June 2026 target lapsed.** Order: `paircraft.com` → `.app` → `.ai` → `.co`.
- §12.3 — Fill 5 named B2C buyers in `paircraft-mvp.md §7 Pool B`. **Pending; deadline 2026-05-18 lapsed.**
- §14.7 — Name 3 CUHELAV alumni for the Founder's Cut affiliate experiment. **Pending; deadline 2026-05-25 lapsed.** Top candidate already in doc: Teo (De la Capellanía).

These are user-execution tasks; the agent doesn't need to drive them, but should surface the lapsed ones when the project reactivates.
