# Market scout playbook — retailer + wine data per country

Repeatable method to gather a market's wine retail data when adding a country
(or refreshing an existing one). Curation-time only — nothing here runs at
request time. Executor: Claude session + `scripts/scout-retailers.ts`.

**Outputs per run** (all under `scripts/seed/scout/`, reviewed by hand):

| Artifact | Feeds |
|---|---|
| `<mkt>-<retailer>.json` (raw normalized rows) | debugging, re-ranking via `--cached` |
| `<mkt>-candidates.csv` (deduped, ranked by presence) | wine selection → `import-csv.ts` flow |
| `<mkt>-corpus-availability.json` | `wine.markets` tags + `availability.sourceUrl` |
| Retailer list with verified URLs | `src/content/markets/<mkt>.mdx` `retailers` |

## The method

1. **Discover retailers (web search).** Two queries: "principales supermercados
   <país> <año> participación mercado" and "comprar vino online <país> tiendas
   especializadas". Target 3-5 supermarkets **plus 1-2 wine specialists** —
   specialists have deeper catalogs and stabler URLs than generalists.
   Selection criteria: has an online catalog, actually sells wine, nationally
   (or regionally-for-our-users) relevant.

2. **Detect each site's platform.** Probe cheapest-first:
   - **VTEX** (dominates LATAM retail): `GET https://<domain>/api/catalog_system/pub/products/search?ft=vino&_from=0&_to=0`
     → JSON array (HTTP 200/206) means yes. A 308 to `/io/...` is still VTEX
     (follow redirects). Éxito, Carulla, Jumbo, Olímpica, Dislicores all VTEX.
   - **WooCommerce**: homepage HTML contains `woocommerce` → try
     `GET /wp-json/wc/store/v1/products?search=vino&per_page=3` (public, no auth).
   - **Shopify**: `GET /products.json?limit=3`.
   - **Fallback**: `agent-browser` skill against the site's search/category pages.
     Needed when the API is blocked (e.g. Euro Supermercados: VTEX markers but
     API returns 422) or the site is fully custom.

3. **Map the wine category tree.** Free-text search is NOISY — "vino tinto"
   matches bedspreads and cycling jerseys ("vinotinto" the color). Always query
   by category:
   - VTEX: `GET /api/catalog_system/pub/category/tree/3`, walk it for
     vino/licores branches, note the URL paths per wine type.
   - WooCommerce: `GET /wp-json/wc/store/v1/products/categories?per_page=100`,
     filter names by vino/tinto/blanco/espumoso. Watch for stores that attach
     products only to a parent "Vino" category (El Kiosco does this).

4. **Configure + run the scout.** Add the country's sources to `MARKETS` in
   `scripts/scout-retailers.ts` (category paths from step 3; `mixto` for stores
   that lump wine types together — type is then inferred from product names).
   Then `bun run scripts/scout-retailers.ts <MKT>`. Re-rank without re-scraping:
   `--cached`.

5. **Review the artifacts.**
   - `presence` in candidates.csv = how many retailers carry the wine. 3+ =
     genuine market staple; strong signal for corpus candidacy.
   - Corpus cross-check reports two match levels: **cuvée** (producer + our
     grapes/style, and no extra grapes — "Cabernet y Malbec" blends don't pass
     as Malbec) vs **producer-only** (brand ships to the market, different
     bottling). Only cuvée-level hits justify a `wine.markets` tag; even then,
     eyeball the matched name — same producer + same grape can still be a
     different line (Angélica Zapata Malbec ≠ Catena Malbec; DV Catena ≠
     Catena Clásica).
   - Update `src/content/markets/<mkt>.mdx` `retailers` with verified names+URLs.

6. **Human selection gate (do not skip).** New wines go through Jorge's review
   and then the normal `import-csv.ts` → `draft-pairings.ts` flow. Every new
   wine costs ~12 pairings of Hugh-voice curation — the bottleneck is
   editorial, not extraction. The scout produces candidates, never corpus.

## Politeness rules

- Honest User-Agent (`paircraft-scout/0.1` + contact email), ~300ms between
  requests, 50-item pages, category-scoped queries only. One-shot per market,
  not a recurring crawler. This is public catalog data used for editorial
  research, not redistribution.

## Per-country log

### CO — Colombia (run 2026-07-05)

- **Landscape:** D1 leads national sales (~81% household penetration) but is
  hard-discount: house-brand wine, no online catalog → excluded. Ara likewise.
  Alkosto is electronics-led. Euro (Medellín regional) is VTEX but the catalog
  API is blocked (422) → agent-browser fallback if ever needed.
- **Scouted:** Éxito (1877 SKUs), Carulla (1889), Jumbo (688), Olímpica (972),
  Dislicores (396), Vinos El Kiosco (1037, WooCommerce). Total 6859 rows →
  **2594 unique candidates**.
- **Corpus check: 11/11 wines confirmed** in CO retail. 8 wines in 4-5 chains;
  Leyda Pinot Noir, Pazo Barrantes Albariño, Enate Chardonnay only at
  Dislicores (specialist-only tail — consistent with their pedagogical role).
- **Quirks:** Éxito/Carulla share Grupo Éxito's category tree (`vinos-y-licores/
  vinos/...`). Olímpica's espumoso category slug has mojibake (`champav±a`) —
  taken verbatim from their tree API, works. El Kiosco attaches everything to
  parent category "Vino" (970 products); subcategories are empty.

### VE — Venezuela (run 2026-07-05)

- **Landscape:** no scrapeable supermarket e-comm (Gama en Línea and Sigo
  Costazul are custom SPAs); the two biggest licorerías are bot-blocked
  (Licores Mundiales 403, Prodelsur 406). The scrapeable slice is specialist
  e-shops — dollarized prices, delivery-first, Caracas-centric.
- **Scouted:** Licoteca (WooCommerce, 266 — "Vinos" 235 + subcats), El Catador
  (Shopify, 664 — surprisingly deep fine-wine catalog; product_type vocab is
  per-store: "Champagne"/"Tinto", which forced widening the Shopify type
  filter to color words), Curda 24 (WooCommerce, 17 — small but real). Total
  947 rows → **788 candidates** (prices USD).
- **Corpus check:** Jorge's 6 manual VE tags (2026-06-18) stand — the scout
  sees 3 e-shops, not the full market, so absence here is NOT counter-
  evidence. Scout-earned cuvée tags: **Moët Brut Impérial (Licoteca $45 +
  El Catador), Protos Roble (both), Enate Chardonnay (Licoteca)**. Rejected
  by the eyeball rule: Norton "Reserva" Malbec (tier above our Norton Malbec
  — same call as DV Catena in AR). Ramón Bilbao Crianza corroborated
  (magnum Ed. Limitada listing — fuzzy but the tag rests on Jorge anyway).

### CL — Chile (run 2026-07-05)

- **Landscape:** Walmart (Líder) ~44%, Cencosud (Jumbo, Santa Isabel) ~33%,
  SMU (Unimarc) ~16%, Tottus ~7%. **Every supermarket site is custom-platform
  or bot-blocked** (Líder/Santa Isabel custom SPA, Unimarc 403, Tottus 503,
  jumbo.cl SPA shell) — wine data comes from specialists, which in wine-country
  Chile carry the deeper catalogs anyway.
- **Scouted:** La Vinoteca (VTEX, 277 — still wines organized by *Cepa/grape*,
  queried at the parent with name-inferred types), Descorcha (Shopify, 527),
  VentaVinos (Shopify, 84). Total 888 rows → **544 candidates** (prices CLP).
- **Corpus check:** cuvée-level: Garzón Reserva Marselan (La Vinoteca → earned
  the CL tag), Leyda Pinot Noir, 1865 Old Vines Cab (already CL-tagged).
  Producer-only: Mionetto Prosecco sin "brut" (Jorge: eyeball for CL tag),
  Castillo de Molina (Cabernet, not our SB). **Known blind spot:** supermarket
  value brands (Gato Negro) don't surface in specialist catalogs — their CL
  tags rest on domestic-production confidence, not scout evidence.

### ES — Spain (run 2026-07-05 — retailers only, catalogs blocked)

- **Landscape:** specialists dominate online wine (Vinissimus ~16k refs,
  Bodeboca, Decántalo) alongside Carrefour ES and El Corte Inglés.
- **Platforms:** ALL blocked or custom — Bodeboca/Decántalo/Carrefour/El Corte
  Inglés return 403 (Datadome/Akamai-class bot protection), Vinissimus is a
  custom stack with no public product JSON. **No catalog scrape**; retailer
  URLs verified live and recorded in `es.mdx`. Agent-browser is the path if
  candidate depth is ever needed.
- **Tags:** Ramón Bilbao, Enate, Pazo Barrantes carry ES on domestic-production
  confidence (the CL/AR rule) — no scout evidence needed or available.

### FR — France (run 2026-07-05 — retailers only, catalogs blocked)

- **Landscape:** cavistes rule online (Nicolas ~500 stores, Vinatis,
  Millésima for fine wine); supermarkets carry volume but weak e-comm APIs.
- **Platforms:** Vinatis 403; Nicolas and Millésima custom stacks. No scrape.
  Retailer URLs verified live, recorded in `fr.mdx`.
- **Corpus:** zero French wines → **feed deliberately empty** (grape-card
  fallback, the VE pattern). First French bottles are an editorial decision;
  don't force them through a scout that can't run.

### AE — United Arab Emirates / Dubai (run 2026-07-05 — retailers only)

- **Landscape:** alcohol retail is a **licensed duopoly**: MMI (21 Dubai
  outlets) and African + Eastern (largest Gulf importer), both with real
  e-commerce (2-hour delivery). Residents need a license; tourists don't.
  "Dubai" is modeled as country code AE — Vercel geo resolves countries.
- **Platforms:** MMI is a Next.js SPA (catch-all HTML on every route, no
  public data routes, no exposed buildId); A+E bot-protected. No scrape;
  retailer URLs verified live, recorded in `ae.mdx`.
- **Tags:** none — import-only market, so domestic logic can't apply and
  there's no scout evidence. Feed shows grape fallback until curated.
- **Why it's here despite the data gap:** Jorge's diversification call +
  the CUHELAV angle (LATAM hospitality alumni staff Dubai hotels).

### AR — Argentina (run 2026-07-05)

- **Landscape:** Coto ~18%, Cencosud 17.5%, Carrefour (leader, in sale
  process). **Jumbo/Disco/Vea return byte-identical catalogs** (one Cencosud
  backend) — scrape Jumbo only or presence inflates 3×. Carrefour AR
  (Cloudflare 403) and Coto (custom) blocked. Espacio Vino and Vinoteca Ligier
  (Magento) not scrapeable without browser work.
- **Scouted:** Jumbo (VTEX, 4502), Día (VTEX, 266), ChangoMás (VTEX, 1547),
  Winery (WooCommerce `allProducts` mode — its categories are per-bodega, so
  the wine-category filter found nothing; full walk got 287). Total 6602 rows
  → **4111 candidates** (prices ARS). Domestic catalogs run deep, as expected.
- **Corpus check:** Catena Malbec cuvée-confirmed at all 4 (incl. "Catena
  Malbec Argentino" at Winery; supermarket hits are the DV Catena line —
  same house, different label, hence the eyeball rule in §5). Gato Negro and
  Garzón are producer-only at Jumbo (other bottlings). Everything European in
  the corpus is absent — the protectionist shelf ar.mdx describes is real.
