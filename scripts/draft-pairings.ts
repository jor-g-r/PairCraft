#!/usr/bin/env bun
/**
 * Draft Hugh-voice prose (EN + ES) for each (wine, food) pairing where tier != skip.
 * Idempotent — skips files that already have both languages; a file missing
 * `explanationEs` only gets its translation added. Boards are never drafted
 * (their components are paired individually), and every id listed in
 * scripts/seed/pairing-vetoes.txt is skipped: a vetoed pairing has no record
 * on purpose, and absence alone would otherwise invite a re-draft.
 *
 * Run: bun run scripts/draft-pairings.ts
 *      (loads .env automatically; ANTHROPIC_API_KEY required)
 *
 * After running, review each generated YAML in src/content/pairings/ and
 * commit only the ones whose prose feels right. git is the review boundary.
 * A draft whose own prose argues against the pairing belongs in the veto list,
 * not in the corpus.
 */

import { readdir, readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { computeTier } from '../src/lib/tier.ts';
import { draftPairingProse, translatePairingProse } from '../src/lib/curation.ts';

const ROOT = path.resolve(import.meta.dir, '..');
const WINES_DIR = path.join(ROOT, 'src/content/wines');
const DISHES_DIR = path.join(ROOT, 'src/content/dishes');
const PAIRINGS_DIR = path.join(ROOT, 'src/content/pairings');
const VETOES_PATH = path.join(ROOT, 'scripts/seed/pairing-vetoes.txt');

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

async function loadVetoes(): Promise<Set<string>> {
  const text = await readFile(VETOES_PATH, 'utf-8');
  return new Set(text.split('\n').map((line) => line.trim()).filter((line) => line && !line.startsWith('#')));
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
  const [wines, dishes, vetoes] = await Promise.all([
    loadCollection<any>(WINES_DIR),
    loadCollection<any>(DISHES_DIR),
    loadVetoes(),
  ]);

  await mkdir(PAIRINGS_DIR, { recursive: true });

  let drafted = 0;
  let translated = 0;
  let skippedTier = 0;
  let vetoed = 0;
  let existed = 0;

  for (const wine of wines) {
    for (const dish of dishes) {
      if (dish.data.format === 'board') continue;

      const id = `${wine.id}__${dish.id}`;
      const outPath = path.join(PAIRINGS_DIR, `${id}.yaml`);

      if (vetoes.has(id)) {
        console.log(`  veto    ${id}`);
        vetoed++;
        continue;
      }

      if (await fileExists(outPath)) {
        const existing = parseYaml(await readFile(outPath, 'utf-8'));
        if (existing.explanationEs) {
          existed++;
          continue;
        }
        console.log(`  es      ${id}`);
        existing.explanationEs = await translatePairingProse(existing.explanation, dish.data.nameEs);
        await writeFile(outPath, stringifyYaml(existing), 'utf-8');
        translated++;
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
      const explanationEs = await translatePairingProse(explanation, dish.data.nameEs);

      await writeFile(outPath, stringifyYaml({ wine: wine.id, dish: dish.id, explanation, explanationEs }), 'utf-8');
      drafted++;
    }
  }

  console.log(
    `\n${drafted} drafted · ${translated} translated · ${existed} already complete · ${vetoed} vetoed · ${skippedTier} skipped (no rules)`,
  );
}

main().catch((err) => {
  console.error('\n✗ failed:');
  console.error(err);
  process.exit(1);
});
