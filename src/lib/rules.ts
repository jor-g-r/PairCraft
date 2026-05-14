/**
 * Pairing rules — the substrate of the tier engine.
 * Each rule has a mode, a strength, and a predicate. The tier function
 * collects activations and maps the count to a qualitative tier.
 * The prompt builder (curation-time only) also reads name/description
 * to give the LLM voice context.
 */

import type { CollectionEntry } from 'astro:content';

export type Mode = 'harmony' | 'contrast' | 'enhancement';
export type Strength = 'strong' | 'moderate' | 'mild';

type Wine = CollectionEntry<'wines'>['data'];
type Dish = CollectionEntry<'dishes'>['data'];

export interface Rule {
  id: string;
  mode: Mode;
  strength: Strength;
  name: string;
  description: string;
  predicate: (wine: Wine, dish: Dish) => boolean;
}

const WEIGHT_TO_BODY: Record<Dish['weight'], number> = {
  light: 1,
  medium: 3,
  heavy: 5,
};

const RED_MEATS = ['beef', 'lamb', 'game'] as const;
const SEAFOOD = ['fish', 'shellfish'] as const;
const OAK_MARKERS = ['oak', 'vanilla', 'toast', 'cedar', 'smoke', 'coconut'];
const EARTH_MARKERS = ['earthy', 'mushroom', 'forest', 'truffle', 'leather', 'tobacco'];
const MINERAL_MARKERS = ['mineral', 'saline', 'sea', 'flint', 'chalk', 'wet stone'];
const FRUIT_DOMINANT_MIN = 1;

function flavouringIncludes(wine: Wine, markers: readonly string[]): boolean {
  const f = wine.flavouring;
  if (!f) return false;
  const pool = [...f.primary, ...f.secondary, ...f.tertiary].map((s) => s.toLowerCase());
  return pool.some((tag) => markers.some((m) => tag.includes(m)));
}

export const RULES: Rule[] = [
  {
    id: 'intensity-match',
    mode: 'harmony',
    strength: 'strong',
    name: 'Intensity match',
    description:
      'Match the weight of the wine to the weight of the dish — rich with rich, light with light. A delicate fish needs a delicate wine; a braise needs structure to stand beside it.',
    predicate: (wine, dish) =>
      Math.abs(wine.sensoryProfile.body - WEIGHT_TO_BODY[dish.weight]) <= 1,
  },
  {
    id: 'sweetness-balance',
    mode: 'harmony',
    strength: 'strong',
    name: 'Sweetness balance',
    description:
      'The wine should be at least as sweet as the dish, otherwise the wine reads as sour or thin against the food sugar. With dessert, the wine wins on sweetness; with savory dishes that carry a glaze or ripe fruit component, lean to off-dry.',
    predicate: (wine, dish) =>
      dish.flavorProfile.includes('sweet') && wine.sensoryProfile.sweetness >= 2,
  },
  {
    id: 'acid-meets-acid',
    mode: 'harmony',
    strength: 'moderate',
    name: 'Acid meets acid',
    description:
      'Acidic wines hold up to acidic dishes — vinaigrettes, citrus, tomato sauces, ceviches. A low-acid wine against high-acid food tastes flat and bullied; matching acidity keeps both alive.',
    predicate: (wine, dish) =>
      dish.flavorProfile.includes('acidic') && wine.sensoryProfile.acidity >= 3,
  },
  {
    id: 'oak-meets-smoke',
    mode: 'harmony',
    strength: 'moderate',
    name: 'Oak meets smoke',
    description:
      'Oaked wines (toasted barrel, vanilla, char) harmonize with grilled, smoked, charred, or roasted preparations. The wood-influenced flavors echo the cooking method and feel of one piece with the dish.',
    predicate: (wine, dish) => {
      const wineOaked = flavouringIncludes(wine, OAK_MARKERS);
      const dishCharred = dish.cookingMethod.some((m) =>
        ['grilled', 'smoked', 'roasted', 'seared'].includes(m),
      );
      return wineOaked && dishCharred;
    },
  },
  {
    id: 'acidity-cuts-fat',
    mode: 'contrast',
    strength: 'strong',
    name: 'Acidity cuts fat',
    description:
      'High-acid wines refresh the palate against fatty, oily, or rich foods. The acid resets the palate between bites; the fat softens the acid.',
    predicate: (wine, dish) =>
      wine.sensoryProfile.acidity >= 3 &&
      (dish.flavorProfile.includes('fatty') || dish.flavorProfile.includes('creamy')),
  },
  {
    id: 'tannin-meets-protein',
    mode: 'contrast',
    strength: 'strong',
    name: 'Tannin meets protein',
    description:
      'Tannins (drying, astringent compounds in red wines) bind with protein and fat in red meat. The protein softens what would otherwise feel harsh; the tannin cleans the palate of fat.',
    predicate: (wine, dish) =>
      wine.sensoryProfile.tannin >= 3 &&
      dish.protein.some((p) => (RED_MEATS as readonly string[]).includes(p)),
  },
  {
    id: 'sweetness-cuts-spice',
    mode: 'contrast',
    strength: 'strong',
    name: 'Sweetness cuts spice',
    description:
      'Residual sugar in off-dry or sweet wines cools the heat of chile and capsaicin-driven dishes. Dry wines amplify spice; a touch of sweetness mutes it.',
    predicate: (wine, dish) =>
      wine.sensoryProfile.sweetness >= 2 && dish.flavorProfile.includes('spicy'),
  },
  {
    id: 'bubbles-cut-richness',
    mode: 'contrast',
    strength: 'strong',
    name: 'Bubbles cut richness',
    description:
      'Sparkling wines combine acid with carbonation, scrubbing the palate against fried, oily, or fatty foods. The bubbles lift the fat physically; the acid resets the taste buds.',
    predicate: (wine, dish) =>
      wine.color === 'sparkling' &&
      (dish.flavorProfile.includes('fatty') || dish.cookingMethod.includes('fried')),
  },
  {
    id: 'salt-amplifies-fruit',
    mode: 'contrast',
    strength: 'moderate',
    name: 'Salt amplifies fruit',
    description:
      'Salty foods make a wine fruit notes pop — the contrast brightens both. Classic in sweet-and-salty pairings like Sauternes with Roquefort, or fino sherry with anchovies and olives.',
    predicate: (wine, dish) => {
      const wineFruity = (wine.flavouring?.primary.length ?? 0) >= FRUIT_DOMINANT_MIN;
      return wineFruity && dish.flavorProfile.includes('salty');
    },
  },
  {
    // No reliable signal in v1 schema (dishes have no region affinity field).
    // Predicate always false; rule preserved for content/voice consistency
    // and re-activation in v0.2 when dishes gain a regional dimension.
    id: 'terroir-bridge',
    mode: 'enhancement',
    strength: 'strong',
    name: 'Terroir bridge',
    description:
      'Wines and dishes from the same region share resonant notes shaped by common soil, climate, and culinary tradition. Lean into local pairings when geography aligns.',
    predicate: () => false,
  },
  {
    id: 'shared-aromatic',
    mode: 'enhancement',
    strength: 'moderate',
    name: 'Shared aromatic',
    description:
      'Match wine aromatics to dish aromatics — berry with berry, citrus with citrus, herbal with herbal, floral with floral. Shared notes resonate across the palate and amplify each other.',
    predicate: (wine, dish) => {
      const f = wine.flavouring;
      if (!f) return false;
      const winePool = [...f.primary, ...f.secondary].map((s) => s.toLowerCase());
      return dish.flavorProfile.some((tag) =>
        winePool.some((w) => w.includes(tag) || tag.includes(w)),
      );
    },
  },
  {
    id: 'earth-meets-earth',
    mode: 'enhancement',
    strength: 'moderate',
    name: 'Earth meets earth',
    description:
      'Earthy wines (mushroom, forest floor, truffle, leather) bridge with earthy foods (mushrooms, truffles, root vegetables, lentils, aged cheeses). The shared savory backbone ties the pairing together.',
    predicate: (wine, dish) => {
      const wineEarthy = flavouringIncludes(wine, EARTH_MARKERS);
      const dishEarthy =
        dish.flavorProfile.includes('earthy') ||
        dish.protein.includes('mushroom') ||
        dish.protein.includes('cheese-aged');
      return wineEarthy && dishEarthy;
    },
  },
  {
    id: 'mineral-meets-brine',
    mode: 'enhancement',
    strength: 'strong',
    name: 'Mineral meets brine',
    description:
      'Minerally and saline wines (Muscadet, Chablis, Manzanilla, Albariño) bridge with seafood and briny foods (oysters, anchovies, capers, sea vegetables). Salt-tinged wines belong with sea-tinged food.',
    predicate: (wine, dish) => {
      const wineMineral = flavouringIncludes(wine, MINERAL_MARKERS);
      const dishBriny =
        dish.flavorProfile.includes('briny') ||
        dish.protein.some((p) => (SEAFOOD as readonly string[]).includes(p));
      return wineMineral && dishBriny;
    },
  },
];

export const RULES_BY_MODE: Record<Mode, Rule[]> = {
  harmony: RULES.filter((r) => r.mode === 'harmony'),
  contrast: RULES.filter((r) => r.mode === 'contrast'),
  enhancement: RULES.filter((r) => r.mode === 'enhancement'),
};
