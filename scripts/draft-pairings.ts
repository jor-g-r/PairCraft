#!/usr/bin/env bun
/**
 * Draft Hugh-voice prose for each (wine, dish) pairing where tier != skip.
 * Idempotent — skips files that already exist in src/content/pairings/.
 *
 * Run: bun run scripts/draft-pairings.ts
 *      (loads .env automatically; ANTHROPIC_API_KEY required)
 *
 * After running, review each generated YAML in src/content/pairings/ and
 * commit only the ones whose prose feels right. git is the review boundary.
 */

import { readdir, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { computeTier } from '../src/lib/tier.ts';
import { draftPairingProse } from '../src/lib/curation.ts';

const ROOT = path.resolve(import.meta.dir, '..');
const WINES_DIR = path.join(ROOT, 'src/content/wines');
const DISHES_DIR = path.join(ROOT, 'src/content/dishes');
const PAIRINGS_DIR = path.join(ROOT, 'src/content/pairings');

interface Entry<T> {
  id: string;
  data: T;
}

async function loadCollection<T>(dir: string): Promise<Entry<T>[]> {
  const files = await readdir(dir);
  return Promise.all(
    files
      .filter((f) => f.endsWith('.yaml'))
      .map(async (f) => {
        const content = await readFile(path.join(dir, f), 'utf-8');
        return { id: f.replace(/\.yaml$/, ''), data: parseYaml(content) as T };
      }),
  );
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const [wines, dishes] = await Promise.all([
    loadCollection<any>(WINES_DIR),
    loadCollection<any>(DISHES_DIR),
  ]);

  await mkdir(PAIRINGS_DIR, { recursive: true });

  let drafted = 0;
  let skippedTier = 0;
  let existed = 0;

  for (const wine of wines) {
    for (const dish of dishes) {
      const id = `${wine.id}__${dish.id}`;
      const outPath = path.join(PAIRINGS_DIR, `${id}.yaml`);

      if (await fileExists(outPath)) {
        console.log(`  exists  ${id}`);
        existed++;
        continue;
      }

      const tierResult = computeTier(wine.data, dish.data);

      if (tierResult.tier === 'skip') {
        console.log(`  skip    ${id} (no rules activated)`);
        skippedTier++;
        continue;
      }

      const ruleCount = tierResult.activations.length;
      console.log(`  draft   ${id}  (${tierResult.tier}, ${ruleCount} rule${ruleCount === 1 ? '' : 's'})`);

      const explanation = await draftPairingProse({
        wine: wine.data,
        dish: dish.data,
        activations: tierResult.activations,
        tier: tierResult.tier,
      });

      const output = {
        wine: wine.id,
        dish: dish.id,
        explanation,
      };

      await writeFile(outPath, stringifyYaml(output), 'utf-8');
      drafted++;
    }
  }

  console.log(`\n${drafted} drafted · ${existed} already existed · ${skippedTier} skipped (no rules)`);
}

main().catch((err) => {
  console.error('\n✗ failed:');
  console.error(err);
  process.exit(1);
});
