#!/usr/bin/env bun
/**
 * Market scout — pulls wine catalogs from a market's retailers via their
 * public storefront APIs, normalizes rows, and emits review artifacts:
 *
 *   scripts/seed/scout/<mkt>-<retailer>.json    normalized rows per retailer
 *   scripts/seed/scout/<mkt>-candidates.csv     cross-retailer dedupe, ranked
 *                                               by presence (3+ = market staple)
 *   scripts/seed/scout/<mkt>-corpus-availability.json
 *                                               which corpus wines each stocks
 *
 * Curation-time tool only (playbook: scripts/market-scout.md). Output is
 * reviewed by hand before any corpus import — this FEEDS import-csv.ts,
 * it does not replace it. Nothing here runs at request time.
 *
 * Run: bun run scripts/scout-retailers.ts CO
 */

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

const ROOT = path.resolve(import.meta.dir, '..');
const OUT_DIR = path.join(ROOT, 'scripts/seed/scout');
const WINES_DIR = path.join(ROOT, 'src/content/wines');
const UA = 'paircraft-scout/0.1 (curation-time editorial research; contact jorge@mileagedesign.com)';
const DELAY_MS = 300;

type WineType = 'tinto' | 'blanco' | 'rosado' | 'espumoso' | 'mixto' | 'otro';

interface Row {
  retailer: string;
  name: string;
  brand: string;
  type: WineType;
  price: number | null; // local currency of the market (COP/CLP/ARS)
  available: boolean;
  url: string;
}

interface VtexSource {
  platform: 'vtex';
  name: string;
  slug: string;
  home: string;
  categories: { type: WineType; path: string }[];
}

interface WooSource {
  platform: 'woocommerce';
  name: string;
  slug: string;
  home: string;
  // Wine-only stores whose categories are per-bodega (Winery) need a full
  // catalog walk; mixed stores (El Kiosco) filter by wine categories.
  allProducts?: boolean;
}

// Shopify: pages /products.json (public), keeps only wine product_types.
interface ShopifySource {
  platform: 'shopify';
  name: string;
  slug: string;
  home: string;
}

type Source = VtexSource | WooSource | ShopifySource;

// Category paths discovered via /api/catalog_system/pub/category/tree/3 per
// store (see playbook §3). `mixto` = store lumps all wine types together;
// the type is then inferred from the product name.
const MARKETS: Record<string, Source[]> = {
  CO: [
    {
      platform: 'vtex', name: 'Éxito', slug: 'exito', home: 'https://www.exito.com',
      categories: [
        { type: 'tinto', path: 'vinos-y-licores/vinos/vino-tinto' },
        { type: 'blanco', path: 'vinos-y-licores/vinos/vino-blanco' },
        { type: 'rosado', path: 'vinos-y-licores/vinos/vino-rosado' },
        { type: 'espumoso', path: 'vinos-y-licores/vinos/vino-espumoso-y-champana' },
      ],
    },
    {
      platform: 'vtex', name: 'Carulla', slug: 'carulla', home: 'https://www.carulla.com',
      categories: [
        { type: 'tinto', path: 'vinos-y-licores/vinos/vino-tinto' },
        { type: 'blanco', path: 'vinos-y-licores/vinos/vino-blanco' },
        { type: 'rosado', path: 'vinos-y-licores/vinos/vino-rosado' },
        { type: 'espumoso', path: 'vinos-y-licores/vinos/vino-espumoso-y-champana' },
      ],
    },
    {
      platform: 'vtex', name: 'Jumbo', slug: 'jumbo', home: 'https://www.jumbocolombia.com',
      categories: [
        { type: 'mixto', path: 'supermercado/vinos-y-licores/vino' },
        { type: 'espumoso', path: 'supermercado/vinos-y-licores/champanas-y-espumoso' },
      ],
    },
    {
      platform: 'vtex', name: 'Olímpica', slug: 'olimpica', home: 'https://www.olimpica.com',
      categories: [
        { type: 'mixto', path: 'supermercado/licores/vino' },
        { type: 'espumoso', path: 'supermercado/licores/vino-espumoso-y-champav±a' },
      ],
    },
    {
      platform: 'vtex', name: 'Dislicores', slug: 'dislicores', home: 'https://www.dislicores.com',
      categories: [
        { type: 'tinto', path: 'vinos/tinto' },
        { type: 'blanco', path: 'vinos/blanco' },
        { type: 'rosado', path: 'vinos/rosado' },
        { type: 'espumoso', path: 'vinos/espumoso' },
        { type: 'espumoso', path: 'vinos/champana' },
      ],
    },
    {
      platform: 'woocommerce', name: 'Vinos El Kiosco', slug: 'el-kiosco', home: 'https://www.vinoselkiosco.com',
    },
  ],
  // CL supermarkets (Líder, Jumbo.cl, Santa Isabel, Unimarc, Tottus) are all
  // custom platforms or bot-blocked — wine data comes from specialists, which
  // in wine-country Chile carry the deeper catalogs anyway. See playbook §CL.
  CL: [
    {
      platform: 'vtex', name: 'La Vinoteca', slug: 'lavinoteca', home: 'https://www.lavinoteca.cl',
      categories: [
        // Still wines are organized by grape (Cepa); querying the parent
        // returns all of them, type inferred from the varietal in the name.
        { type: 'mixto', path: 'home/cepa' },
        { type: 'espumoso', path: 'home/vina/espumantes' },
      ],
    },
    { platform: 'shopify', name: 'Descorcha', slug: 'descorcha', home: 'https://descorcha.com' },
    { platform: 'shopify', name: 'VentaVinos', slug: 'ventavinos', home: 'https://www.ventavinos.cl' },
  ],
  // Jumbo/Disco/Vea share one Cencosud catalog (identical product IDs) —
  // scraping Jumbo covers all three banners; counting them separately would
  // inflate presence. Carrefour AR (Cloudflare) and Coto (custom) blocked.
  AR: [
    {
      platform: 'vtex', name: 'Jumbo', slug: 'jumbo', home: 'https://www.jumbo.com.ar',
      categories: [
        { type: 'tinto', path: 'bebidas/vinos/vinos-tintos' },
        { type: 'blanco', path: 'bebidas/vinos/vinos-blancos' },
        { type: 'rosado', path: 'bebidas/vinos/vinos-rosados' },
        { type: 'espumoso', path: 'bebidas/vinos/vinos-frizantes' },
        { type: 'espumoso', path: 'bebidas/espumantes' },
      ],
    },
    {
      platform: 'vtex', name: 'Día', slug: 'dia', home: 'https://diaonline.supermercadosdia.com.ar',
      categories: [
        { type: 'tinto', path: 'bebidas/bodega/vino-tinto' },
        { type: 'blanco', path: 'bebidas/bodega/vino-blanco' },
        { type: 'rosado', path: 'bebidas/bodega/vino-rosado' },
        { type: 'espumoso', path: 'bebidas/bodega/espumantes' },
      ],
    },
    {
      platform: 'vtex', name: 'ChangoMás', slug: 'changomas', home: 'https://www.masonline.com.ar',
      categories: [
        { type: 'tinto', path: 'vinos-y-espumantes/vino-tinto' },
        { type: 'blanco', path: 'vinos-y-espumantes/vino-blanco' },
        { type: 'rosado', path: 'vinos-y-espumantes/vino-rosado' },
        { type: 'espumoso', path: 'vinos-y-espumantes/espumantes' },
      ],
    },
    { platform: 'woocommerce', name: 'Winery', slug: 'winery', home: 'https://tiendadevinos.ar', allProducts: true },
  ],
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url, { headers: { accept: 'application/json', 'user-agent': UA } });
  if (!res.ok && res.status !== 206) throw new Error(`HTTP ${res.status} ${url}`);
  return res.json();
}

function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function inferType(name: string): WineType {
  const n = normalizeText(name);
  if (/(espum|champa|prosecco|lambrusco|\bcava\b|\bbrut\b|asti|frizzante|frizante|\bsidra\b)/.test(n)) return 'espumoso';
  if (/(rosad|\brose\b)/.test(n)) return 'rosado';
  if (/(sangria|oporto|jerez|vermouth|vermut|cocina|manzanilla|aperitivo|vinagre)/.test(n)) return 'otro';
  if (/(blanco|sauvignon blanc|chardonnay|albarin|riesling|verdejo|moscato|moscatel|torrontes|gewurz|pinot gri|viognier|semillon|chenin)/.test(n)) return 'blanco';
  if (/(tinto|malbec|cabernet|carmener|merlot|syrah|shiraz|pinot noir|tempranillo|rioja|chianti|bonarda|tannat|zinfandel|garnacha|sangiovese|carignan|cinsault|petit verdot)/.test(n)) return 'tinto';
  return 'otro';
}

/* eslint-disable @typescript-eslint/no-explicit-any */
async function scrapeVtex(src: VtexSource): Promise<Row[]> {
  const rows: Row[] = [];
  for (const cat of src.categories) {
    let count = 0;
    for (let from = 0; from < 2500; from += 50) {
      const url = `${src.home}/api/catalog_system/pub/products/search/${encodeURI(cat.path)}?_from=${from}&_to=${from + 49}`;
      let data: any;
      try {
        data = await getJson(url);
      } catch (e) {
        console.warn(`  ! ${src.name} ${cat.path}: ${(e as Error).message}`);
        break;
      }
      if (!Array.isArray(data) || data.length === 0) break;
      for (const p of data) {
        const offer = p.items?.[0]?.sellers?.[0]?.commertialOffer;
        const name = String(p.productName ?? '').trim();
        if (!name) continue;
        rows.push({
          retailer: src.name,
          name,
          brand: String(p.brand ?? '').trim(),
          type: cat.type === 'mixto' ? inferType(name) : cat.type,
          price: typeof offer?.Price === 'number' && offer.Price > 0 ? Math.round(offer.Price) : null,
          available: (offer?.AvailableQuantity ?? 0) > 0,
          url: p.linkText ? `${src.home}/${p.linkText}/p` : src.home,
        });
        count++;
      }
      if (data.length < 50) break;
      await sleep(DELAY_MS);
    }
    console.log(`  ${src.name} / ${cat.path}: ${count} products`);
    await sleep(DELAY_MS);
  }
  return rows;
}

async function scrapeWoo(src: WooSource): Promise<Row[]> {
  const wineCats = src.allProducts
    ? [{ id: null, name: 'all' }]
    : ((await getJson(`${src.home}/wp-json/wc/store/v1/products/categories?per_page=100`)) as any[]).filter((c) =>
        /vino|tinto|blanco|rosado|espum|champa/i.test(String(c.name)),
      );
  const rows: Row[] = [];
  const seen = new Set<number>();
  for (const cat of wineCats) {
    let count = 0;
    for (let page = 1; page <= 25; page++) {
      const catParam = cat.id === null ? '' : `category=${cat.id}&`;
      const url = `${src.home}/wp-json/wc/store/v1/products?${catParam}per_page=100&page=${page}`;
      let data: any;
      try {
        data = await getJson(url);
      } catch (e) {
        console.warn(`  ! ${src.name} ${cat.name}: ${(e as Error).message}`);
        break;
      }
      if (!Array.isArray(data) || data.length === 0) break;
      for (const p of data) {
        if (seen.has(p.id)) continue;
        seen.add(p.id);
        const name = String(p.name ?? '').trim();
        if (!name) continue;
        const minor = Number(p.prices?.currency_minor_unit ?? 0);
        const raw = Number(p.prices?.price ?? NaN);
        rows.push({
          retailer: src.name,
          name,
          brand: '',
          type: inferType(`${cat.name} ${name}`),
          price: Number.isFinite(raw) ? Math.round(raw / 10 ** minor) : null,
          available: p.is_in_stock !== false,
          url: String(p.permalink ?? src.home),
        });
        count++;
      }
      if (data.length < 100) break;
      await sleep(DELAY_MS);
    }
    console.log(`  ${src.name} / ${cat.name}: ${count} products`);
    await sleep(DELAY_MS);
  }
  return rows;
}

async function scrapeShopify(src: ShopifySource): Promise<Row[]> {
  const rows: Row[] = [];
  let kept = 0;
  for (let page = 1; page <= 40; page++) {
    const url = `${src.home}/products.json?limit=250&page=${page}`;
    let data: any;
    try {
      data = await getJson(url);
    } catch (e) {
      console.warn(`  ! ${src.name} page ${page}: ${(e as Error).message}`);
      break;
    }
    const products = data?.products;
    if (!Array.isArray(products) || products.length === 0) break;
    for (const p of products) {
      const productType = String(p.product_type ?? '');
      // Shopify stores mix wine with beer/spirits/accessories — keep wine only.
      if (!/vino|espum|champa/i.test(productType)) continue;
      const name = String(p.title ?? '').trim();
      if (!name) continue;
      const variant = p.variants?.[0];
      const raw = Number(variant?.price ?? NaN);
      rows.push({
        retailer: src.name,
        name,
        brand: String(p.vendor ?? '').trim(),
        type: inferType(`${productType} ${name}`),
        price: Number.isFinite(raw) ? Math.round(raw) : null,
        available: variant?.available !== false,
        url: p.handle ? `${src.home}/products/${p.handle}` : src.home,
      });
      kept++;
    }
    if (products.length < 250) break;
    await sleep(DELAY_MS);
  }
  console.log(`  ${src.name} / products.json: ${kept} wine products kept`);
  return rows;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// Tokens too generic to identify a producer — grape names, wine types, sizes.
const GENERIC = new Set([
  'vino', 'tinto', 'blanco', 'rosado', 'espumoso', 'champana', 'champagne', 'brut', 'dulce', 'seco',
  'semiseco', 'reserva', 'riserva', 'crianza', 'gran', 'premium', 'edicion', 'especial', 'seleccion',
  'malbec', 'cabernet', 'sauvignon', 'blanc', 'chardonnay', 'pinot', 'noir', 'albarino', 'marselan',
  'prosecco', 'chianti', 'merlot', 'syrah', 'shiraz', 'tempranillo', 'carmenere', 'bonarda', 'tannat',
  'botella', 'ml', 'cc', 'lt', 'litro', 'x750', 'x375', 'argentino', 'chileno', 'espanol', 'italiano',
  'de', 'del', 'la', 'el', 'los', 'las', 'y', 'en', 'con',
]);

// A pure number is noise when it's a bottle size or a vintage year — but some
// brands ARE numbers (San Pedro "1865"), so those must survive.
const SIZES = new Set([187, 375, 500, 700, 750, 1000, 1125, 1500, 3000]);
function isNoiseNumber(t: string): boolean {
  if (/^\d+(ml|cc|l|g)$/.test(t)) return true;
  if (!/^\d+$/.test(t)) return false;
  const n = Number(t);
  return SIZES.has(n) || (n >= 1990 && n <= 2035);
}

function significantTokens(name: string): string[] {
  return normalizeText(name)
    .split(' ')
    .filter((t) => t && !GENERIC.has(t) && !isNoiseNumber(t));
}

function signature(name: string): string {
  return significantTokens(name).slice(0, 6).sort().join(' ');
}

function csvField(v: string | number | null): string {
  const s = v === null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Words that distinguish a specific cuvée from its producer. A producer-only
// hit ("Leyda Lot 5 Chardonnay" for leyda-pinot-noir) proves the brand ships
// to the market, NOT that our wine does — never tag markets from producer-
// level matches. Grapes and style words behave differently: an EXTRA grape in
// the listing disqualifies (a Cabernet-Malbec blend is not our Malbec), while
// extra style words are harmless.
const GRAPES = new Set([
  'malbec', 'cabernet', 'sauvignon', 'blanc', 'chardonnay', 'pinot', 'noir', 'albarino', 'marselan',
  'prosecco', 'chianti', 'merlot', 'syrah', 'shiraz', 'tempranillo', 'carmenere', 'bonarda', 'tannat',
  'verdejo', 'torrontes', 'riesling', 'viognier', 'semillon', 'moscato', 'moscatel', 'garnacha',
  'sangiovese', 'carignan', 'cinsault', 'chenin',
]);
const STYLES = new Set(['tinto', 'blanco', 'rosado', 'espumoso', 'brut', 'dulce', 'riserva', 'reserva', 'crianza']);

interface CorpusWine {
  slug: string;
  name: string;
  producerTokens: string[];
  grapeTokens: string[];
  styleTokens: string[];
}

async function loadCorpusWines(): Promise<CorpusWine[]> {
  const files = (await readdir(WINES_DIR)).filter((f) => f.endsWith('.yaml'));
  const wines: CorpusWine[] = [];
  for (const f of files) {
    const doc = parseYaml(await readFile(path.join(WINES_DIR, f), 'utf8')) as { name?: string };
    const name = doc?.name ?? f;
    const raw = normalizeText(name).split(' ').filter(Boolean);
    wines.push({
      slug: f.replace(/\.yaml$/, ''),
      name,
      producerTokens: significantTokens(name),
      grapeTokens: raw.filter((t) => GRAPES.has(t)),
      styleTokens: raw.filter((t) => STYLES.has(t)),
    });
  }
  return wines;
}

const marketCode = (process.argv[2] ?? '').toUpperCase();
const sources = MARKETS[marketCode];
if (!sources) {
  console.error(`Unknown market "${marketCode}". Configured: ${Object.keys(MARKETS).join(', ')}`);
  process.exit(1);
}

// --cached: rebuild candidates + availability from the saved per-retailer
// JSONs instead of re-scraping. Lets you iterate on ranking/matching logic
// without re-hitting the stores.
const useCache = process.argv.includes('--cached');

await mkdir(OUT_DIR, { recursive: true });
const allRows: Row[] = [];

for (const src of sources) {
  const outFile = path.join(OUT_DIR, `${marketCode.toLowerCase()}-${src.slug}.json`);
  if (useCache) {
    try {
      // priceCop → price: reads caches written before the field went generic.
      const rows = (JSON.parse(await readFile(outFile, 'utf8')) as (Row & { priceCop?: number | null })[]).map(
        (r) => ({ ...r, price: r.price ?? r.priceCop ?? null }),
      );
      allRows.push(...rows);
      console.log(`→ ${src.name}: ${rows.length} rows (cached)`);
      continue;
    } catch {
      console.warn(`→ ${src.name}: no cache, scraping live`);
    }
  }
  console.log(`\n→ ${src.name} (${src.platform})`);
  const rows =
    src.platform === 'vtex' ? await scrapeVtex(src)
    : src.platform === 'woocommerce' ? await scrapeWoo(src)
    : await scrapeShopify(src);
  allRows.push(...rows);
  await writeFile(outFile, JSON.stringify(rows, null, 2));
  console.log(`  saved ${rows.length} rows → ${path.relative(ROOT, outFile)}`);
}

// --- Cross-retailer dedupe + presence ranking.
interface Candidate {
  sig: string;
  name: string;
  brand: string;
  type: WineType;
  retailers: Map<string, Row>;
}
const bySig = new Map<string, Candidate>();
for (const row of allRows) {
  if (row.type === 'otro') continue;
  const sig = signature(row.name);
  if (!sig) continue;
  let c = bySig.get(sig);
  if (!c) {
    c = { sig, name: row.name, brand: row.brand, type: row.type, retailers: new Map() };
    bySig.set(sig, c);
  }
  if (!c.retailers.has(row.retailer)) c.retailers.set(row.retailer, row);
  if (row.brand && !c.brand) c.brand = row.brand;
}

const candidates = [...bySig.values()].sort(
  (a, b) => b.retailers.size - a.retailers.size || a.type.localeCompare(b.type) || a.name.localeCompare(b.name),
);

const header = 'presence,retailers,type,name,brand,min_price,max_price,sample_url';
const csvLines = candidates.map((c) => {
  const rows = [...c.retailers.values()];
  const prices = rows.map((r) => r.price).filter((p): p is number => p !== null);
  return [
    c.retailers.size,
    [...c.retailers.keys()].join('; '),
    c.type,
    c.name,
    c.brand,
    prices.length ? Math.min(...prices) : null,
    prices.length ? Math.max(...prices) : null,
    rows[0]?.url ?? '',
  ].map(csvField).join(',');
});
const csvFile = path.join(OUT_DIR, `${marketCode.toLowerCase()}-candidates.csv`);
await writeFile(csvFile, [header, ...csvLines].join('\n') + '\n');

// --- Corpus cross-check: which of our wines does each retailer stock?
// Two levels: 'cuvee' (producer + all descriptors → this wine) vs 'producer'
// (brand present, different bottling → market-tag NO, brand-signal yes).
type MatchLevel = 'cuvee' | 'producer';
const corpus = await loadCorpusWines();
const availability: Record<
  string,
  { name: string; foundAt: { retailer: string; level: MatchLevel; name: string; price: number | null; url: string }[] }
> = {};
for (const wine of corpus) {
  if (wine.producerTokens.length === 0) continue;
  const byRetailer = new Map<string, { row: Row; level: MatchLevel }>();
  for (const row of allRows) {
    const rowTokens = new Set(normalizeText(row.name).split(' ').filter(Boolean));
    if (!wine.producerTokens.every((t) => rowTokens.has(t))) continue;
    const rowGrapes = [...rowTokens].filter((t) => GRAPES.has(t));
    const isCuvee =
      wine.grapeTokens.every((t) => rowTokens.has(t)) &&
      wine.styleTokens.every((t) => rowTokens.has(t)) &&
      rowGrapes.every((t) => wine.grapeTokens.includes(t));
    const level: MatchLevel = isCuvee ? 'cuvee' : 'producer';
    const prev = byRetailer.get(row.retailer);
    if (!prev || (prev.level === 'producer' && level === 'cuvee')) byRetailer.set(row.retailer, { row, level });
  }
  availability[wine.slug] = {
    name: wine.name,
    foundAt: [...byRetailer.values()].map(({ row, level }) => ({
      retailer: row.retailer, level, name: row.name, price: row.price, url: row.url,
    })),
  };
}
const availFile = path.join(OUT_DIR, `${marketCode.toLowerCase()}-corpus-availability.json`);
await writeFile(availFile, JSON.stringify(availability, null, 2));

console.log(`\n${allRows.length} rows total → ${candidates.length} unique candidates`);
console.log(`candidates: ${path.relative(ROOT, csvFile)}`);
console.log(`corpus availability: ${path.relative(ROOT, availFile)}`);
console.log('\nCorpus wines in this market (✓ cuvée · ~ producer-only):');
for (const [slug, info] of Object.entries(availability)) {
  const cuvee = info.foundAt.filter((f) => f.level === 'cuvee').map((f) => f.retailer);
  const prod = info.foundAt.filter((f) => f.level === 'producer').map((f) => f.retailer);
  const mark = cuvee.length ? '✓' : prod.length ? '~' : '✗';
  const parts = [cuvee.length ? cuvee.join(', ') : '', prod.length ? `(producer-only: ${prod.join(', ')})` : ''].filter(Boolean);
  console.log(`  ${mark} ${slug}${parts.length ? ' — ' + parts.join(' ') : ''}`);
}
