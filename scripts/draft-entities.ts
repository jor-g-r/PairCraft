#!/usr/bin/env bun
/**
 * Draft entity entries (regions, grapes, wines, dishes) from name lists.
 * Reads scripts/seed/<type>.txt, one entry per line.
 *
 * Order matters — references must exist before they're referenced:
 *   regions → grapes → wines → dishes
 *
 * Idempotent. Existing files are never overwritten — delete them to re-roll.
 * Lines starting with `#` and blank lines in seed files are ignored.
 *
 * Run: bun run scripts/draft-entities.ts
 */

import { readdir, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { stringify as stringifyYaml } from 'yaml';
import {
  draftGrape,
  draftRegion,
  draftWine,
  draftDish,
  type GrapeDraft,
  type RegionDraft,
  type WineDraft,
  type DishDraft,
} from '../src/lib/curation.ts';

const ROOT = path.resolve(import.meta.dir, '..');
const SEED_DIR = path.join(ROOT, 'scripts/seed');
const CONTENT_DIR = path.join(ROOT, 'src/content');

async function readSeed(name: string): Promise<string[]> {
  const p = path.join(SEED_DIR, `${name}.txt`);
  try {
    const raw = await readFile(p, 'utf-8');
    return raw
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'));
  } catch {
    return [];
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

async function fileExists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

function naiveSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function buildMdx(frontmatter: Record<string, unknown>, body: string): string {
  const fm = stringifyYaml(frontmatter).trimEnd();
  return `---\n${fm}\n---\n\n${body.trim()}\n`;
}

async function processRegions(): Promise<{ drafted: number; skipped: number }> {
  const inputs = await readSeed('regions');
  if (!inputs.length) return { drafted: 0, skipped: 0 };
  console.log(`\n# regions (${inputs.length})`);

  const dir = path.join(CONTENT_DIR, 'regions');
  await mkdir(dir, { recursive: true });
  const existingSlugs = await listSlugs('regions', 'mdx');
  const availableGrapes = await listSlugs('grapes', 'mdx');

  let drafted = 0;
  let skipped = 0;
  for (const input of inputs) {
    const guess = naiveSlug(input.split(',')[0] ?? input);
    if (existingSlugs.includes(guess)) {
      console.log(`  exists  ${guess}`);
      skipped++;
      continue;
    }
    console.log(`  draft   ${input}`);
    const region: RegionDraft = await draftRegion(input, availableGrapes);
    const outPath = path.join(dir, `${region.slug}.mdx`);
    if (await fileExists(outPath)) {
      console.log(`          → ${region.slug}.mdx already exists, skipping write`);
      skipped++;
      continue;
    }
    const { slug, body, ...frontmatter } = region;
    await writeFile(outPath, buildMdx(frontmatter, body), 'utf-8');
    console.log(`          → ${region.slug}.mdx`);
    drafted++;
  }
  return { drafted, skipped };
}

async function processGrapes(): Promise<{ drafted: number; skipped: number }> {
  const inputs = await readSeed('grapes');
  if (!inputs.length) return { drafted: 0, skipped: 0 };
  console.log(`\n# grapes (${inputs.length})`);

  const dir = path.join(CONTENT_DIR, 'grapes');
  await mkdir(dir, { recursive: true });
  const existingSlugs = await listSlugs('grapes', 'mdx');
  const availableRegions = await listSlugs('regions', 'mdx');

  let drafted = 0;
  let skipped = 0;
  for (const input of inputs) {
    const guess = naiveSlug(input);
    if (existingSlugs.includes(guess)) {
      console.log(`  exists  ${guess}`);
      skipped++;
      continue;
    }
    console.log(`  draft   ${input}`);
    const grape: GrapeDraft = await draftGrape(input, availableRegions);
    const outPath = path.join(dir, `${grape.slug}.mdx`);
    if (await fileExists(outPath)) {
      console.log(`          → ${grape.slug}.mdx already exists, skipping write`);
      skipped++;
      continue;
    }
    const { slug, body, ...frontmatter } = grape;
    await writeFile(outPath, buildMdx(frontmatter, body), 'utf-8');
    console.log(`          → ${grape.slug}.mdx`);
    drafted++;
  }
  return { drafted, skipped };
}

async function processWines(): Promise<{ drafted: number; skipped: number }> {
  const inputs = await readSeed('wines');
  if (!inputs.length) return { drafted: 0, skipped: 0 };
  console.log(`\n# wines (${inputs.length})`);

  const dir = path.join(CONTENT_DIR, 'wines');
  await mkdir(dir, { recursive: true });
  const existingSlugs = await listSlugs('wines', 'yaml');
  const availableGrapes = await listSlugs('grapes', 'mdx');
  const availableRegions = await listSlugs('regions', 'mdx');

  let drafted = 0;
  let skipped = 0;
  for (const input of inputs) {
    const guess = naiveSlug(input);
    if (existingSlugs.includes(guess)) {
      console.log(`  exists  ${guess}`);
      skipped++;
      continue;
    }
    console.log(`  draft   ${input}`);
    const wine: WineDraft = await draftWine(input, availableGrapes, availableRegions);
    const outPath = path.join(dir, `${wine.slug}.yaml`);
    if (await fileExists(outPath)) {
      console.log(`          → ${wine.slug}.yaml already exists, skipping write`);
      skipped++;
      continue;
    }
    const { slug, ...payload } = wine;
    await writeFile(outPath, stringifyYaml(payload), 'utf-8');
    console.log(`          → ${wine.slug}.yaml`);
    drafted++;
  }
  return { drafted, skipped };
}

async function processDishes(): Promise<{ drafted: number; skipped: number }> {
  const inputs = await readSeed('dishes');
  if (!inputs.length) return { drafted: 0, skipped: 0 };
  console.log(`\n# dishes (${inputs.length})`);

  const dir = path.join(CONTENT_DIR, 'dishes');
  await mkdir(dir, { recursive: true });
  const existingSlugs = await listSlugs('dishes', 'yaml');

  let drafted = 0;
  let skipped = 0;
  for (const input of inputs) {
    const guess = naiveSlug(input);
    if (existingSlugs.includes(guess)) {
      console.log(`  exists  ${guess}`);
      skipped++;
      continue;
    }
    console.log(`  draft   ${input}`);
    const dish: DishDraft = await draftDish(input);
    const outPath = path.join(dir, `${dish.slug}.yaml`);
    if (await fileExists(outPath)) {
      console.log(`          → ${dish.slug}.yaml already exists, skipping write`);
      skipped++;
      continue;
    }
    const { slug, ...payload } = dish;
    await writeFile(outPath, stringifyYaml(payload), 'utf-8');
    console.log(`          → ${dish.slug}.yaml`);
    drafted++;
  }
  return { drafted, skipped };
}

async function main() {
  const regions = await processRegions();
  const grapes = await processGrapes();
  const wines = await processWines();
  const dishes = await processDishes();

  const totalDrafted = regions.drafted + grapes.drafted + wines.drafted + dishes.drafted;
  const totalSkipped = regions.skipped + grapes.skipped + wines.skipped + dishes.skipped;
  console.log(`\n${totalDrafted} drafted · ${totalSkipped} skipped`);
  console.log('Review YAMLs/MDX in src/content/ before committing.');
}

main().catch((err) => {
  console.error('\n✗ failed:');
  console.error(err);
  process.exit(1);
});
