import { describe, expect, test } from 'bun:test';
import type { CollectionEntry } from 'astro:content';
import { computeTier } from './tier.ts';

type Wine = CollectionEntry<'wines'>['data'];
type Dish = CollectionEntry<'dishes'>['data'];

function wine(overrides: Partial<Wine> = {}): Wine {
  return {
    name: 'Test Wine',
    tagline: 'A wine.',
    summary: '.',
    color: 'red',
    region: { collection: 'regions', id: 'placeholder' },
    grapes: [{ grape: { collection: 'grapes', id: 'placeholder' } }],
    sensoryProfile: { sweetness: 0, acidity: 3, tannin: 3, body: 3 },
    ...overrides,
  } as Wine;
}

function dish(overrides: Partial<Dish> = {}): Dish {
  return {
    name: 'Test Dish',
    description: '.',
    protein: ['beef'],
    cookingMethod: [],
    flavorProfile: [],
    intensity: 3,
    weight: 'medium',
    ...overrides,
  } as Dish;
}

describe('computeTier', () => {
  test('bold red + grilled beef → decisive (3+ strong activations)', () => {
    const w = wine({
      color: 'red',
      sensoryProfile: { sweetness: 0, acidity: 3, tannin: 5, body: 5 },
      flavouring: { primary: ['black fruit'], secondary: ['oak', 'vanilla'], tertiary: [] },
    });
    const d = dish({
      protein: ['beef'],
      cookingMethod: ['grilled'],
      flavorProfile: ['fatty'],
      intensity: 4,
      weight: 'heavy',
    });
    const result = computeTier(w, d);
    expect(result.tier).toBe('decisive');
    const ids = result.activations.map((r) => r.id);
    expect(ids).toContain('tannin-meets-protein');
    expect(ids).toContain('intensity-match');
    expect(ids).toContain('acidity-cuts-fat');
    expect(ids).toContain('oak-meets-smoke');
  });

  test('sparkling + fried light bite → decisive', () => {
    const w = wine({
      color: 'sparkling',
      sensoryProfile: { sweetness: 1, acidity: 5, tannin: 0, body: 2 },
    });
    const d = dish({
      protein: ['poultry'],
      cookingMethod: ['fried'],
      flavorProfile: ['fatty'],
      intensity: 3,
      weight: 'light',
    });
    const result = computeTier(w, d);
    expect(result.tier).toBe('decisive');
    expect(result.activations.map((r) => r.id)).toContain('bubbles-cut-richness');
  });

  test('light citrusy white + delicate fish → decisive (1 strong + 1 moderate)', () => {
    const w = wine({
      color: 'white',
      sensoryProfile: { sweetness: 0, acidity: 4, tannin: 0, body: 1 },
      flavouring: { primary: ['citrus', 'green apple'], secondary: [], tertiary: [] },
    });
    const d = dish({
      protein: ['fish'],
      cookingMethod: ['poached'],
      flavorProfile: ['lean', 'citrusy'],
      intensity: 2,
      weight: 'light',
    });
    const result = computeTier(w, d);
    expect(result.tier).toBe('decisive');
  });

  test('bold tannic red + delicate fish → skip', () => {
    const w = wine({
      color: 'red',
      sensoryProfile: { sweetness: 0, acidity: 2, tannin: 5, body: 5 },
    });
    const d = dish({
      protein: ['fish'],
      cookingMethod: ['poached'],
      flavorProfile: ['lean'],
      intensity: 2,
      weight: 'light',
    });
    const result = computeTier(w, d);
    expect(result.tier).toBe('skip');
    expect(result.activations).toHaveLength(0);
  });

  test('mid-body red + medium dish with only intensity match → worth-trying', () => {
    const w = wine({
      color: 'red',
      sensoryProfile: { sweetness: 0, acidity: 2, tannin: 2, body: 3 },
    });
    const d = dish({
      protein: ['poultry'],
      cookingMethod: ['roasted'],
      flavorProfile: [],
      intensity: 3,
      weight: 'medium',
    });
    const result = computeTier(w, d);
    expect(result.tier).toBe('worth-trying');
    expect(result.activations.map((r) => r.id)).toEqual(['intensity-match']);
  });

  test('mineral white + shellfish → decisive (mineral-meets-brine fires)', () => {
    const w = wine({
      color: 'white',
      sensoryProfile: { sweetness: 0, acidity: 4, tannin: 0, body: 2 },
      flavouring: { primary: ['citrus'], secondary: ['saline', 'wet stone'], tertiary: [] },
    });
    const d = dish({
      protein: ['shellfish'],
      cookingMethod: ['raw'],
      flavorProfile: ['briny'],
      intensity: 2,
      weight: 'light',
    });
    const result = computeTier(w, d);
    expect(result.tier).toBe('decisive');
    expect(result.activations.map((r) => r.id)).toContain('mineral-meets-brine');
  });
});
