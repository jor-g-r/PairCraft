/**
 * Pairing rules — context the LLM reads, not executable logic.
 * Each rule is tagged with a mode. The model can cite rule ids in its output
 * to explain which rule(s) drove a given pairing.
 */

export type Mode = 'harmony' | 'contrast' | 'enhancement';

export interface Rule {
  id: string;
  mode: Mode;
  name: string;
  description: string;
}

export const RULES: Rule[] = [
  {
    id: 'intensity-match',
    mode: 'harmony',
    name: 'Intensity match',
    description:
      'Match the weight of the wine to the weight of the dish — rich with rich, light with light. A delicate fish needs a delicate wine; a braise needs structure to stand beside it.',
  },
  {
    id: 'sweetness-balance',
    mode: 'harmony',
    name: 'Sweetness balance',
    description:
      'The wine should be at least as sweet as the dish, otherwise the wine reads as sour or thin against the food sugar. With dessert, the wine wins on sweetness; with savory dishes that carry a glaze or ripe fruit component, lean to off-dry.',
  },
  {
    id: 'acid-meets-acid',
    mode: 'harmony',
    name: 'Acid meets acid',
    description:
      'Acidic wines hold up to acidic dishes — vinaigrettes, citrus, tomato sauces, ceviches. A low-acid wine against high-acid food tastes flat and bullied; matching acidity keeps both alive.',
  },
  {
    id: 'oak-meets-smoke',
    mode: 'harmony',
    name: 'Oak meets smoke',
    description:
      'Oaked wines (toasted barrel, vanilla, char) harmonize with grilled, smoked, charred, or roasted preparations. The wood-influenced flavors echo the cooking method and feel of one piece with the dish.',
  },
  {
    id: 'acidity-cuts-fat',
    mode: 'contrast',
    name: 'Acidity cuts fat',
    description:
      'High-acid wines refresh the palate against fatty, oily, or rich foods. The acid resets the palate between bites; the fat softens the acid.',
  },
  {
    id: 'tannin-meets-protein',
    mode: 'contrast',
    name: 'Tannin meets protein',
    description:
      'Tannins (drying, astringent compounds in red wines) bind with protein and fat in red meat. The protein softens what would otherwise feel harsh; the tannin cleans the palate of fat.',
  },
  {
    id: 'sweetness-cuts-spice',
    mode: 'contrast',
    name: 'Sweetness cuts spice',
    description:
      'Residual sugar in off-dry or sweet wines cools the heat of chile and capsaicin-driven dishes. Dry wines amplify spice; a touch of sweetness mutes it.',
  },
  {
    id: 'bubbles-cut-richness',
    mode: 'contrast',
    name: 'Bubbles cut richness',
    description:
      'Sparkling wines combine acid with carbonation, scrubbing the palate against fried, oily, or fatty foods. The bubbles lift the fat physically; the acid resets the taste buds.',
  },
  {
    id: 'salt-amplifies-fruit',
    mode: 'contrast',
    name: 'Salt amplifies fruit',
    description:
      'Salty foods make a wine fruit notes pop — the contrast brightens both. Classic in sweet-and-salty pairings like Sauternes with Roquefort, or fino sherry with anchovies and olives.',
  },
  {
    id: 'terroir-bridge',
    mode: 'enhancement',
    name: 'Terroir bridge',
    description:
      'Wines and dishes from the same region share resonant notes shaped by common soil, climate, and culinary tradition. Lean into local pairings when geography aligns.',
  },
  {
    id: 'shared-aromatic',
    mode: 'enhancement',
    name: 'Shared aromatic',
    description:
      'Match wine aromatics to dish aromatics — berry with berry, citrus with citrus, herbal with herbal, floral with floral. Shared notes resonate across the palate and amplify each other.',
  },
  {
    id: 'earth-meets-earth',
    mode: 'enhancement',
    name: 'Earth meets earth',
    description:
      'Earthy wines (mushroom, forest floor, truffle, leather) bridge with earthy foods (mushrooms, truffles, root vegetables, lentils, aged cheeses). The shared savory backbone ties the pairing together.',
  },
  {
    id: 'mineral-meets-brine',
    mode: 'enhancement',
    name: 'Mineral meets brine',
    description:
      'Minerally and saline wines (Muscadet, Chablis, Manzanilla, Albariño) bridge with seafood and briny foods (oysters, anchovies, capers, sea vegetables). Salt-tinged wines belong with sea-tinged food.',
  },
];

export const RULES_BY_MODE: Record<Mode, Rule[]> = {
  harmony: RULES.filter((r) => r.mode === 'harmony'),
  contrast: RULES.filter((r) => r.mode === 'contrast'),
  enhancement: RULES.filter((r) => r.mode === 'enhancement'),
};
