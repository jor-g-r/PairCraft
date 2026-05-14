import type { CollectionEntry } from 'astro:content';
import { RULES, type Rule } from './rules.ts';

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
