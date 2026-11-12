# Paircraft

Wine and food pairings with short, opinionated explanations — pocket guide style, inspired by Hugh Johnson's *Pocket Wine Book*.

- **Live:** https://pair-craft.vercel.app/ — Vercel deploys every push to `main`.
- **Authorities:** `PRODUCT.md` (product rules, editorial vetoes) and `DESIGN.md` (what ships visually) win over this file on their topics. Git history holds what shipped when.

## Project profile

- Type: web: Astro 6 (TypeScript strict), Tailwind 4, Bun; Vercel adapter, home is the only SSR page
- Workdir: repo root
- Requires: Bun (lockfile `bun.lock`); env names: `ANTHROPIC_API_KEY`, `OPENCODE_API_KEY`, `LLM_PROVIDER`, `CHROME_BIN` (local scripts only; the deploy needs none)
- Setup: `bun install` [verified 2026-11-11]
- Run: `bun run dev` → http://localhost:4321 [documented]
- Verify: `./scripts/verify quick|full` [verified 2026-11-11]: quick = `bun run check` + `bun run test` (about 20 s); full adds `bun run build`
- Publish: merge or push to `main` deploys to production; needs explicit GO

### Manual checks
- [ ] Changed routes at 390 px and 1440 px, light and dark, from `http://localhost:4321/<route>`
- [ ] UI work: iPhone Safari and Android Chrome before calling it done

### Evidence
- The `RESULT` line of `./scripts/verify full`; for UI, the URLs checked; for a deploy, the commit status on GitHub (Vercel), without calling production.

| Task | Read first |
| --- | --- |
| Product rules, vetoes, voice | `PRODUCT.md` |
| Visual change | `DESIGN.md`, `.impeccable/surfaces/paircraft.md` |
| Add a market or refresh retailers | `scripts/market-scout.md` |

## Locked product decisions (don't relitigate without an explicit signal)

- **Navigable entity graph, not chat UX.** Entities: Wine / Grape / Region / Dish, each with a Content Collection, a URL and a page template. Flavour notes, methods and sauces are tags, not entities.
- **Tri-modal rules layer (signature IP).** Rules in `src/lib/rules.ts` are tagged by mode — `by Harmony` (matching/balancing), `by Contrast` (opposing axis: acid cuts fat, tannin meets protein), `by Enhancement` (bridging notes) — with `strength: strong|moderate|mild`, consumed by the pure-function tier engine.
- **Pairing scoring is tier-only:** `Decisive match` / `Worth trying` / `Risky bridge` / `Skip`, plus Hugh-voice prose. No numeric score or itemized breakdown until demo feedback says otherwise.
- **Voice anchor:** Hugh Johnson's pocket guide. Opinionated, one-sentence explanations, confidence over caveats. If it is encyclopedia-shaped, defer it.
- **Models are a curation-time layer, not a runtime engine.** Scripts draft entity copy and pairing prose, a human reviews it, and the output is committed to Content Collections. No runtime code calls a model.
- **Only reviewed pairings are shown.** A missing record for an engine-allowed combination is an editorial veto, not a gap (`PRODUCT.md`; vetoed ids in `scripts/seed/pairing-vetoes.txt`).
- **Data layer: Astro Content Collections** (YAML/MDX, Zod schemas, cross-references). Supabase is deferred.
- **Bilingual EN/ES.** Client-side toggle (`LangToggle.astro`) and optional `*Es` fields in every collection, with per-field EN fallback. Pairings are drafted in both languages.
- **No auth.** The site stays closed to search engines until the demo: `robots.txt` disallows all but LinkedInBot (link previews), and every page sends `noindex, nofollow`.
- **Mobile-first PWA.** A native wrap is deferred.
- **Market tags are conservative.** Only cuvée-level retailer matches or domestic production justify a `wine.markets` tag, never producer-only matches. Empty feeds are allowed (grape fallback). See `scripts/market-scout.md`.
- **Tier engine tuning waits for demo feedback.** The engine over-fires `Decisive` (two strong rules are enough); the editorial veto removes indefensible combinations without touching it. Don't tune blindly.

## Visual identity (locked)

- Headings and wine names: Playfair Display Variable (`font-display`). Body: Open Sans Variable (`font-sans`, mostly Light 300). Wordmark only: Alegreya Variable (`font-brand`). Self-hosted via `@fontsource-variable/*`; theme tokens in `src/styles/global.css`.
- `DESIGN.md` is the record of what ships and the authority for visual decisions. Visual and branding work is the owner's creative call: don't plan it for them.
- Photos are scene imagery, never the specific bottle. Every asset has a `*.source.json` provenance sidecar, the single source of truth for alt text and credits. An asset without recorded provenance must not reach a public launch.

## Stack

- Astro 6 with TypeScript strict; Tailwind v4 via `@tailwindcss/vite`, `@theme` tokens in `src/styles/global.css`
- `@vite-pwa/astro` (manifest and service worker, autoUpdate); `@astrojs/vercel` adapter for the SSR home and API routes
- `@anthropic-ai/sdk`, used only by the local curation and translation scripts in `scripts/` (no runtime code calls a model)
- Bun as runtime and package manager
- Agents: any tool that reads `AGENTS.md`. Keep project instructions here: a `CLAUDE.md` in the repo or above it would make Claude Code ignore this file.

## Conventions

- **Bun, not npm/pnpm/yarn:** `bun install`, `bun add`, `bunx`. If Vercel auto-detects npm, override the Build Command to `bun install && bun run build`.
- Mobile-first. Tailwind utilities first; custom CSS only when truly necessary.
- Comments only when the *why* is non-obvious. Don't narrate what code does.
- Commit style: present-tense imperative.
- No backwards-compat shims until there are real users on a prior version.
- This repo is public: no local paths, strategy, unpublished prices or people's names in versioned files.

## Repo and deploy

- Repo: `git@github.com:jor-g-r/PairCraft.git` (public). No CI besides Vercel.
- Vercel via the GitHub integration: push to `main` → production. Check a deploy by the commit status on GitHub, not by calling production.

## Engine and data

- `src/content.config.ts` — 6 collections: `wines`, `grapes`, `regions`, `dishes`, `pairings`, `markets`. `wines.markets` holds ISO codes of where a bottle is *sold* (default `['CO']`), distinct from origin `region.country`. Markets carry `code`, `name`, `tagline`, `dominantOrigins`, `dominantGrapes`, `retailers[]`. Food entries classify `occasion` (meal/snack) and `format` (dish/bite/board); board `components` reference independent food records, and boards get no aggregate tier.
- Home is market-gated: cookie `pc_market` > Vercel `x-vercel-ip-country` header > default `CO`. A visible `<select>` overrides it (sets the cookie, reloads). Markets with no curated bottles fall back to dominant-grape cards.
- `src/lib/rules.ts` — tri-modal rules `{ mode, strength, predicate }`; `terroir-bridge` is always false for now. `src/lib/tier.ts` — pure-function tier engine with unit tests.
- `src/lib/prompt.ts` + `src/lib/curation.ts` — curation prompts. `LLM_PROVIDER` switches between `anthropic` (default; best Hugh voice) and `opencode-go`.
- Scripts, all idempotent: `draft-pairings.ts` (wine×food, EN + ES, skips boards and vetoed ids), `draft-entities.ts` (from `scripts/seed/*.txt`, order regions→grapes→wines→dishes), `import-csv.ts`, `test-curation.ts` (prints one pairing without writing), `backfill-region-grapes.ts`, and `translate-*.ts`. New wines go through the owner and `import-csv.ts`; nothing auto-imports.
- `scripts/scout-retailers.ts` + playbook `scripts/market-scout.md`: retailer discovery → platform probe (VTEX, WooCommerce, Shopify; always query the category tree, never free text: "vino tinto" matches bedspreads) → catalog scrape → artifacts in `scripts/seed/scout/`. `--cached` re-ranks without re-scraping. Output is review material.
- `/api/pair`: an exact dish name (id, `name` or `nameEs`, accent- and case-insensitive) returns `kind: 'exact'`; otherwise the dishes of the chosen occasion whose name, in either language, holds every word of the query return as `kind: 'related'`, possibly empty. `src/lib/pair-route.test.ts` fails if the route touches the network. The `/pair` 429 branch and `pair.busy` stay for platform rate limits.
- Before bringing a model call back to `/api/pair`: put the production key in a spend-limited Anthropic workspace first (the Default Workspace takes no spend limit). A per-IP Vercel WAF rule on `POST /api/pair` also counts exact matches, because the page always posts. Don't add an in-memory limiter: per-instance counters give no ceiling.

## Dev tooling

- Run the dev server detached: `screen -dmS paircraft-dev bash -c 'cd "$(git rev-parse --show-toplevel)" && bun run dev --host 127.0.0.1 > /tmp/paircraft-dev.log 2>&1'`. Plain background processes get SIGTERM'd when the agent's shell call ends, and a stale server can 500 every `/_image` request with `MissingSharp` (restart it).
- `agent-browser` CLI for screenshots and DOM checks (dark mode: `set media dark`; mobile: `set viewport 390 844`). When reporting local work, include the direct `http://localhost:4321/<route>` URLs.
- Impeccable design tooling: `.agents/skills/impeccable/`, `.impeccable/design.json`, `.impeccable/surfaces/paircraft.md` (direction contract), live-mode config in `.impeccable/live/config.json` (injects into `src/layouts/Base.astro`; never commit while it is injected). If a browser Accept never arrives, accept from the terminal with `impeccable live-accept --id <session> --variant <n> --page-url <route>`, then the carbonize cleanup, `live-complete` and `live-server stop`.
