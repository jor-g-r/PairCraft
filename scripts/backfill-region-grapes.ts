#!/usr/bin/env bun
/**
 * Backfill `signatureGrapes` in each region MDX from the wines that
 * reference it. Closes the dep-order gap left by import-csv.ts, which
 * processes regions before grapes (so signatureGrapes lands empty).
 *
 * Strategy: walk wines, build a region→grapeSet map, then for each
 * region MDX replace the signatureGrapes block in its frontmatter with
 * the deterministic computed list (sorted, deduped). Idempotent.
 *
 * Run: bun run scripts/backfill-region-grapes.ts
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

const ROOT = path.resolve(import.meta.dir, '..');
const WINES_DIR = path.join(ROOT, 'src/content/wines');
const REGIONS_DIR = path.join(ROOT, 'src/content/regions');

interface WineYaml {
  region: string;
  grapes: Array<{ grape: string; percentage?: number }>;
}

async function loadWineRegionGrapeMap(): Promise<Map<string, Set<string>>> {
  const files = await readdir(WINES_DIR);
  const map = new Map<string, Set<string>>();
  for (const file of files) {
    if (!file.endsWith('.yaml')) continue;
    const raw = await readFile(path.join(WINES_DIR, file), 'utf-8');
    const data = parseYaml(raw) as WineYaml;
    if (!data.region || !data.grapes) continue;
    if (!map.has(data.region)) map.set(data.region, new Set());
    const grapeSet = map.get(data.region)!;
    for (const { grape } of data.grapes) {
      if (grape) grapeSet.add(grape);
    }
  }
  return map;
}

function splitMdx(content: string): { frontmatter: string; body: string } {
  // Frontmatter delimited by --- at start and a second --- on its own line.
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error('No frontmatter found');
  return { frontmatter: match[1], body: match[2] };
}

async function main() {
  const regionGrapes = await loadWineRegionGrapeMap();
  const regionFiles = (await readdir(REGIONS_DIR)).filter((f) => f.endsWith('.mdx'));

  let updated = 0;
  let unchanged = 0;
  let noWines = 0;

  for (const file of regionFiles) {
    const slug = file.replace(/\.mdx$/, '');
    const filePath = path.join(REGIONS_DIR, file);
    const content = await readFile(filePath, 'utf-8');
    const { frontmatter, body } = splitMdx(content);
    const fm = parseYaml(frontmatter) as Record<string, unknown>;

    const wineGrapeSet = regionGrapes.get(slug);
    if (!wineGrapeSet || wineGrapeSet.size === 0) {
      console.log(`  ${slug.padEnd(20)} — no wines reference this region, skipping`);
      noWines++;
      continue;
    }

    const computed = Array.from(wineGrapeSet).sort();
    const existing = Array.isArray(fm.signatureGrapes) ? (fm.signatureGrapes as string[]).slice().sort() : [];

    const sameAsExisting =
      existing.length === computed.length && existing.every((g, i) => g === computed[i]);

    if (sameAsExisting) {
      console.log(`  ${slug.padEnd(20)} — already matches [${computed.join(', ')}]`);
      unchanged++;
      continue;
    }

    fm.signatureGrapes = computed;
    const newFrontmatter = stringifyYaml(fm).trimEnd();
    const newContent = `---\n${newFrontmatter}\n---\n\n${body.trimStart()}`;
    await writeFile(filePath, newContent, 'utf-8');
    console.log(`  ${slug.padEnd(20)} — updated to [${computed.join(', ')}]`);
    updated++;
  }

  console.log(`\n${updated} updated · ${unchanged} unchanged · ${noWines} no wines`);
}

main().catch((err) => {
  console.error('\n✗ failed:');
  console.error(err);
  process.exit(1);
});
