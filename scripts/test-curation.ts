#!/usr/bin/env bun
/**
 * Test prose drafting for ONE (wine, dish) pair.
 * Prints to stdout — does NOT write to src/content/pairings/.
 * Use this to validate a provider/model before committing prose to git.
 *
 * Usage: bun run scripts/test-curation.ts <wine-id> <dish-id>
 * Example: bun run scripts/test-curation.ts pazo-albarino-2022 oysters-raw
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { computeTier } from '../src/lib/tier.ts';
import { draftPairingProse, activeProvider } from '../src/lib/curation.ts';

const ROOT = path.resolve(import.meta.dir, '..');

async function loadEntry(collection: string, id: string) {
  const p = path.join(ROOT, 'src/content', collection, `${id}.yaml`);
  const content = await readFile(p, 'utf-8');
  return parseYaml(content);
}

async function main() {
  const [wineId, dishId] = process.argv.slice(2);
  if (!wineId || !dishId) {
    console.error('Usage: bun run scripts/test-curation.ts <wine-id> <dish-id>');
    process.exit(1);
  }

  const [wine, dish] = await Promise.all([
    loadEntry('wines', wineId),
    loadEntry('dishes', dishId),
  ]);

  const tierResult = computeTier(wine, dish);

  console.log(`\nprovider: ${activeProvider()}`);
  console.log(`wine:     ${wineId}`);
  console.log(`dish:     ${dishId}`);
  console.log(`tier:     ${tierResult.tier}`);
  console.log(`rules:    ${tierResult.activations.map((r) => r.name).join(', ') || '(none)'}\n`);

  if (tierResult.tier === 'skip') {
    console.log('(skip — no prose drafted)');
    return;
  }

  const prose = await draftPairingProse({
    wine,
    dish,
    activations: tierResult.activations,
    tier: tierResult.tier,
  });

  console.log('---');
  console.log(prose);
  console.log('---\n');
}

main().catch((err) => {
  console.error('\n✗ failed:');
  console.error(err);
  process.exit(1);
});
