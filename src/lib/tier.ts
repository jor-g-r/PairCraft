import type { CollectionEntry } from 'astro:content';
import { RULES, type Mode, type Rule } from './rules.ts';

export type Tier = 'decisive' | 'worth-trying' | 'risky' | 'skip';

export const TIER_LABEL: Record<Tier, string> = {
  decisive: 'Decisive match',
  'worth-trying': 'Worth trying',
  risky: 'Risky bridge',
  skip: 'Skip',
};

export interface TierResult {
  tier: Tier;
  activations: Rule[];
}

type Wine = CollectionEntry<'wines'>['data'];
type Dish = CollectionEntry<'dishes'>['data'];

export function computeTier(wine: Wine, dish: Dish): TierResult {
  const activations = RULES.filter((r) => {
    try {
      return r.predicate(wine, dish);
    } catch {
      return false;
    }
  });

  const strongCount = activations.filter((r) => r.strength === 'strong').length;
  const otherCount = activations.length - strongCount;

  let tier: Tier;
  if (strongCount >= 2) tier = 'decisive';
  else if (strongCount === 1 && otherCount >= 1) tier = 'decisive';
  else if (strongCount === 1) tier = 'worth-trying';
  else if (otherCount >= 2) tier = 'worth-trying';
  else if (otherCount === 1) tier = 'risky';
  else tier = 'skip';

  return { tier, activations };
}

export const STRENGTH_WEIGHT = { strong: 3, moderate: 2, mild: 1 } as const;
const MODE_ORDER: Mode[] = ['harmony', 'contrast', 'enhancement'];

// A pairing is listed once, under the mode with the most rule evidence, so
// tri-modal groups never repeat the same dish and explanation.
export function dominantMode(activations: Rule[]): Mode | undefined {
  const weight = new Map<Mode, number>();
  for (const rule of activations) weight.set(rule.mode, (weight.get(rule.mode) ?? 0) + STRENGTH_WEIGHT[rule.strength]);
  return MODE_ORDER.filter((mode) => weight.has(mode)).sort((a, b) => weight.get(b)! - weight.get(a)!)[0];
}
