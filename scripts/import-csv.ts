#!/usr/bin/env bun
/**
 * One-shot CSV importer for the Medellín editorial corpus.
 *
 * Reads scripts/seed/csv/paircraft_{wines,dishes}_medellin.csv and writes:
 *   - src/content/wines/<slug>.yaml       (structural from CSV + LLM tagline/summary)
 *   - src/content/dishes/<slug>.yaml      (structural from CSV + LLM description/enums)
 *   - src/content/regions/<slug>.mdx      (auto-derived, LLM-drafted)
 *   - src/content/grapes/<slug>.mdx       (auto-derived, LLM-drafted)
 *
 * Order: regions → grapes → wines → dishes (so cross-refs exist when needed).
 *
 * Idempotent. Existing files are NEVER overwritten — delete to re-roll.
 * Legacy YAMLs (catena-malbec-2021, pazo-albarino-2022) are left untouched;
 * user decides when to migrate or remove them.
 *
 * Run: bun run scripts/import-csv.ts
 */

import { readFile, writeFile, mkdir, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { stringify as stringifyYaml } from 'yaml';
import {
  draftGrape,
  draftRegion,
  draftWineCopy,
  draftDishCopy,
} from '../src/lib/curation.ts';

const ROOT = path.resolve(import.meta.dir, '..');
const CSV_DIR = path.join(ROOT, 'scripts/seed/csv');
const CONTENT_DIR = path.join(ROOT, 'src/content');

// ---------- CSV parsing (RFC 4180 subset; handles quoted fields) -----------

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i += 2;
      } else if (c === '"') {
        inQuotes = false;
        i++;
      } else {
        field += c;
        i++;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
        i++;
      } else if (c === ',') {
        row.push(field);
        field = '';
        i++;
      } else if (c === '\n') {
        row.push(field);
        field = '';
        rows.push(row);
        row = [];
        i++;
      } else if (c === '\r') {
        i++;
      } else {
        field += c;
        i++;
      }
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length && r.some((f) => f.length));
}

function csvToObjects(text: string): Record<string, string>[] {
  const rows = parseCsv(text);
  const header = rows[0];
  if (!header) return [];
  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    header.forEach((h, idx) => {
      obj[h] = (row[idx] ?? '').trim();
    });
    return obj;
  });
}

// ---------- Categorical → 0-5 mapping -------------------------------------

const NUMERIC_BY_LABEL: Record<string, number> = {
  none: 0,
  none_low: 0,
  dry: 0,
  brut: 0,
  low: 1,
  light: 1,
  low_medium: 2,
  medium_low: 2,
  light_medium: 2,
  medium: 3,
  medium_plus: 4,
  high: 5,
  full: 5,
  sweet: 5,
};

function toAxisValue(label: string, fallback = 3): number {
  const k = label.toLowerCase().trim();
  if (k in NUMERIC_BY_LABEL) return NUMERIC_BY_LABEL[k];
  if (k === 'variable' || k === '') return fallback;
  console.warn(`  ⚠ unknown axis label "${label}" — defaulting to ${fallback}`);
  return fallback;
}

// ---------- Slug normalization --------------------------------------------

function normalizeSlug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function splitList(s: string): string[] {
  return s
    .split(';')
    .map((x) => x.trim())
    .filter((x) => x.length);
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function listSlugs(collection: string, ext: string): Promise<string[]> {
  const dir = path.join(CONTENT_DIR, collection);
  try {
    const files = await readdir(dir);
    return files.filter((f) => f.endsWith(`.${ext}`)).map((f) => f.replace(new RegExp(`\\.${ext}$`), ''));
  } catch {
    return [];
  }
}

function buildMdx(frontmatter: Record<string, unknown>, body: string): string {
  const fm = stringifyYaml(frontmatter).trimEnd();
  return `---\n${fm}\n---\n\n${body.trim()}\n`;
}

// ---------- Grape and region derivation ------------------------------------

function deriveGrapesFromWines(wines: Record<string, string>[]): Map<string, string> {
  // Returns map<slug, canonicalName>. Strips qualifiers like "dominant blend".
  const map = new Map<string, string>();
  for (const w of wines) {
    const raw = w.grape_varieties;
    if (!raw) continue;
    // Heuristics: "Sangiovese dominant blend" → "Sangiovese"; "White blend" → "White blend".
    let canonical = raw.replace(/\s+dominant blend$/i, '').trim();
    if (/^white blend$/i.test(canonical)) canonical = 'White blend';
    if (/^red blend$/i.test(canonical)) canonical = 'Red blend';
    const slug = normalizeSlug(canonical);
    if (slug) map.set(slug, canonical);
  }
  return map;
}

function deriveRegionsFromWines(wines: Record<string, string>[]): Map<string, { name: string; country: string }> {
  // CSV "region" sometimes has the form "Maipo Valley / Chile" — take the part before "/".
  const map = new Map<string, { name: string; country: string }>();
  for (const w of wines) {
    const rawRegion = (w.region ?? '').split('/')[0].trim();
    const country = (w.country ?? '').trim();
    if (!rawRegion) continue;
    const slug = normalizeSlug(rawRegion);
    if (slug && !map.has(slug)) map.set(slug, { name: rawRegion, country });
  }
  return map;
}

// ---------- Process: regions ----------------------------------------------

async function processRegions(regions: Map<string, { name: string; country: string }>) {
  const dir = path.join(CONTENT_DIR, 'regions');
  await mkdir(dir, { recursive: true });
  const existing = await listSlugs('regions', 'mdx');
  console.log(`\n# regions (${regions.size} unique from wines CSV)`);
  let drafted = 0;
  let skipped = 0;
  // No grapes yet — pass empty list, accept signatureGrapes: [].
  for (const [slug, { name, country }] of regions) {
    if (existing.includes(slug)) {
      console.log(`  exists  ${slug}`);
      skipped++;
      continue;
    }
    console.log(`  draft   ${name}, ${country}`);
    const draft = await draftRegion(`${name}, ${country}`, []);
    const outPath = path.join(dir, `${slug}.mdx`);
    if (await fileExists(outPath)) {
      skipped++;
      continue;
    }
    // Force LLM-emitted slug to match our derived slug for consistency.
    const { slug: _llmSlug, body, ...frontmatter } = draft;
    await writeFile(outPath, buildMdx(frontmatter, body), 'utf-8');
    console.log(`          → ${slug}.mdx`);
    drafted++;
  }
  return { drafted, skipped };
}

// ---------- Process: grapes ------------------------------------------------

async function processGrapes(grapes: Map<string, string>, availableRegions: string[]) {
  const dir = path.join(CONTENT_DIR, 'grapes');
  await mkdir(dir, { recursive: true });
  const existing = await listSlugs('grapes', 'mdx');
  console.log(`\n# grapes (${grapes.size} unique from wines CSV)`);
  let drafted = 0;
  let skipped = 0;
  for (const [slug, name] of grapes) {
    if (existing.includes(slug)) {
      console.log(`  exists  ${slug}`);
      skipped++;
      continue;
    }
    console.log(`  draft   ${name}`);
    const draft = await draftGrape(name, availableRegions);
    const outPath = path.join(dir, `${slug}.mdx`);
    if (await fileExists(outPath)) {
      skipped++;
      continue;
    }
    const { slug: _llmSlug, body, ...frontmatter } = draft;
    await writeFile(outPath, buildMdx(frontmatter, body), 'utf-8');
    console.log(`          → ${slug}.mdx`);
    drafted++;
  }
  return { drafted, skipped };
}

// ---------- Process: wines (the meat — preserves all CSV structure) -------

async function processWines(
  wines: Record<string, string>[],
  availableGrapes: string[],
  availableRegions: string[],
) {
  const dir = path.join(CONTENT_DIR, 'wines');
  await mkdir(dir, { recursive: true });
  const existing = await listSlugs('wines', 'yaml');
  console.log(`\n# wines (${wines.length} rows in CSV)`);
  let drafted = 0;
  let skipped = 0;
  let warnings = 0;

  for (const row of wines) {
    const slug = row.slug;
    if (!slug) continue;
    if (existing.includes(slug)) {
      console.log(`  exists  ${slug}`);
      skipped++;
      continue;
    }
    console.log(`  draft   ${slug}`);

    // Determine grape slugs from grape_varieties string.
    let canonicalGrape = row.grape_varieties.replace(/\s+dominant blend$/i, '').trim();
    if (/^white blend$/i.test(canonicalGrape)) canonicalGrape = 'White blend';
    if (/^red blend$/i.test(canonicalGrape)) canonicalGrape = 'Red blend';
    const grapeSlug = normalizeSlug(canonicalGrape);
    if (!availableGrapes.includes(grapeSlug)) {
      console.warn(`  ⚠ grape slug "${grapeSlug}" not in available set — will fail Astro validation`);
      warnings++;
    }

    const regionSlug = normalizeSlug((row.region ?? '').split('/')[0].trim());
    if (!availableRegions.includes(regionSlug)) {
      console.warn(`  ⚠ region slug "${regionSlug}" not in available set — will fail Astro validation`);
      warnings++;
    }

    const wineColor = row.wine_color === 'sparkling_white' ? 'sparkling' : row.wine_color;
    const isRed = wineColor === 'red';

    const sensoryProfile: Record<string, number> = {
      sweetness: toAxisValue(row.sweetness, 0),
      acidity: toAxisValue(row.acidity, 3),
      tannin: isRed ? toAxisValue(row.tannin, 3) : toAxisValue(row.tannin, 0),
      body: toAxisValue(row.body, 3),
    };
    // Optional axes (oak/alcohol/intensity preserved if present).
    if (row.oak) sensoryProfile.oak = toAxisValue(row.oak, 0);
    if (row.alcohol) sensoryProfile.alcohol = toAxisValue(row.alcohol, 3);
    if (row.intensity) sensoryProfile.intensity = toAxisValue(row.intensity, 3);

    const copy = await draftWineCopy({
      name: row.name,
      style: row.style ?? '',
      region: row.region ?? '',
      country: row.country ?? '',
      grapeVarieties: row.grape_varieties ?? '',
      primaryNotes: row.primary_notes ?? '',
      pedagogicalRole: row.pedagogical_role ?? '',
    });

    const payload: Record<string, unknown> = {
      name: row.name,
      tagline: copy.tagline,
      summary: copy.summary,
      color: wineColor,
      region: regionSlug,
      grapes: [{ grape: grapeSlug, percentage: 100 }],
      sensoryProfile,
      flavouring: {
        primary: splitList(row.primary_notes),
        secondary: [],
        tertiary: [],
      },
      style: row.style,
      pedagogicalRole: row.pedagogical_role,
      availability: row.availability_note
        ? {
            note: row.availability_note,
            ...(row.source_url ? { sourceUrl: row.source_url } : {}),
          }
        : undefined,
      recommendedPairings: splitList(row.recommended_pairings),
    };
    // Strip undefined to keep YAML clean.
    for (const k of Object.keys(payload)) {
      if (payload[k] === undefined) delete payload[k];
    }

    const outPath = path.join(dir, `${slug}.yaml`);
    if (await fileExists(outPath)) {
      skipped++;
      continue;
    }
    await writeFile(outPath, stringifyYaml(payload), 'utf-8');
    console.log(`          → ${slug}.yaml`);
    drafted++;
  }
  return { drafted, skipped, warnings };
}

// ---------- Process: dishes -----------------------------------------------

async function processDishes(dishes: Record<string, string>[]) {
  const dir = path.join(CONTENT_DIR, 'dishes');
  await mkdir(dir, { recursive: true });
  const existing = await listSlugs('dishes', 'yaml');
  console.log(`\n# dishes (${dishes.length} rows in CSV)`);
  let drafted = 0;
  let skipped = 0;

  for (const row of dishes) {
    const slug = row.slug;
    if (!slug) continue;
    if (existing.includes(slug)) {
      console.log(`  exists  ${slug}`);
      skipped++;
      continue;
    }
    console.log(`  draft   ${slug}`);

    const copy = await draftDishCopy({
      name: row.name,
      category: row.category ?? '',
      mainIngredients: row.main_ingredients ?? '',
      cookingMethods: row.cooking_methods ?? '',
      sensoryAxes: {
        fat: row.fat ?? '',
        salt: row.salt ?? '',
        sweetness: row.sweetness ?? '',
        acidity: row.acidity ?? '',
        umami: row.umami ?? '',
        bitterness: row.bitterness ?? '',
        spiceHeat: row.spice_heat ?? '',
      },
      texture: row.texture ?? '',
      intensityWord: row.intensity ?? '',
      pairingLogic: row.pairing_logic ?? '',
    });

    const intensity = toAxisValue(row.intensity, 3);

    const payload: Record<string, unknown> = {
      name: row.name,
      description: copy.description,
      protein: copy.protein,
      cookingMethod: copy.cookingMethod,
      flavorProfile: copy.flavorProfile,
      intensity,
      weight: copy.weight,
      category: row.category,
      cuisineContext: row.cuisine_context,
      pairingLogic: row.pairing_logic,
      recommendedWineStyles: splitList(row.recommended_wine_styles),
      notesForDemo: row.notes_for_demo,
    };
    for (const k of Object.keys(payload)) {
      if (payload[k] === undefined || payload[k] === '') delete payload[k];
    }

    const outPath = path.join(dir, `${slug}.yaml`);
    if (await fileExists(outPath)) {
      skipped++;
      continue;
    }
    await writeFile(outPath, stringifyYaml(payload), 'utf-8');
    console.log(`          → ${slug}.yaml`);
    drafted++;
  }
  return { drafted, skipped };
}

// ---------- Main ----------------------------------------------------------

async function main() {
  const winesCsv = await readFile(path.join(CSV_DIR, 'paircraft_wines_medellin.csv'), 'utf-8');
  const dishesCsv = await readFile(path.join(CSV_DIR, 'paircraft_dishes_medellin.csv'), 'utf-8');

  const wines = csvToObjects(winesCsv);
  const dishes = csvToObjects(dishesCsv);

  console.log(`Parsed ${wines.length} wines + ${dishes.length} dishes from CSV.`);

  const grapes = deriveGrapesFromWines(wines);
  const regions = deriveRegionsFromWines(wines);

  // Order: regions → grapes → wines → dishes
  const rResult = await processRegions(regions);
  const availableRegions = await listSlugs('regions', 'mdx');
  const gResult = await processGrapes(grapes, availableRegions);
  const availableGrapes = await listSlugs('grapes', 'mdx');
  const wResult = await processWines(wines, availableGrapes, availableRegions);
  const dResult = await processDishes(dishes);

  const totalDrafted =
    rResult.drafted + gResult.drafted + wResult.drafted + dResult.drafted;
  const totalSkipped =
    rResult.skipped + gResult.skipped + wResult.skipped + dResult.skipped;

  console.log(`\n${totalDrafted} drafted · ${totalSkipped} skipped`);
  if (wResult.warnings) {
    console.log(`⚠ ${wResult.warnings} cross-ref warnings — check Astro build before deploying.`);
  }
  console.log('\nNext: review YAMLs/MDX in src/content/, then run');
  console.log('      bun run scripts/draft-pairings.ts');
  console.log('to generate pairing prose for all new (wine × dish) combos.');
}

main().catch((err) => {
  console.error('\n✗ failed:');
  console.error(err);
  process.exit(1);
});
