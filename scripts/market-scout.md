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
   - Corpus cross-check tells you which existing wines to tag with this market
     and gives retail URLs for `availability.sourceUrl`.
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

### VE — Venezuela (pending)

No national supermarket e-commerce at CO's scale. Likely path: specialist
licorerías (e.g. Licores Mundiales, El Mundo del Licor — verify first) via
step 2 probes; expect more agent-browser, less API. Corpus was verified
manually by Jorge 2026-06-18 — the scout would add retailers + URLs.

### CL / AR (pending)

Both have strong VTEX presence (Cencosud: jumbo.cl; Coto/others in AR — verify
with step 1 searches, don't assume). Domestic-market wine catalogs will be
much deeper than CO's import shelf; expect higher candidate counts and tune
selection accordingly.
