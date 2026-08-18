import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const wines = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/wines' }),
  schema: z.object({
    name: z.string(),
    nameEs: z.string().optional(),
    vintage: z.number().int().min(1800).max(2100).optional(),
    tagline: z.string().max(140),
    taglineEs: z.string().max(140).optional(),
    summary: z.string(),
    summaryEs: z.string().optional(),
    color: z.enum(['red', 'white', 'rose', 'orange', 'sparkling']),
    region: reference('regions'),
    grapes: z
      .array(
        z.object({
          grape: reference('grapes'),
          percentage: z.number().min(0).max(100).optional(),
        }),
      )
      .min(1),
    sensoryProfile: z.object({
      sweetness: z.number().int().min(0).max(5),
      acidity: z.number().int().min(0).max(5),
      tannin: z.number().int().min(0).max(5),
      body: z.number().int().min(0).max(5),
      // Optional axes preserved from CSV import; not yet consumed by rules engine.
      oak: z.number().int().min(0).max(5).optional(),
      alcohol: z.number().int().min(0).max(5).optional(),
      intensity: z.number().int().min(0).max(5).optional(),
    }),
    flavouring: z
      .object({
        primary: z.array(z.string()).default([]),
        secondary: z.array(z.string()).default([]),
        tertiary: z.array(z.string()).default([]),
      })
      .optional(),
    tanninProfile: z
      .object({
        softness: z.number().int().min(0).max(5),
        astringency: z.number().int().min(0).max(5),
        complexity: z.number().int().min(0).max(5),
        structure: z.number().int().min(0).max(5),
      })
      .optional(),
    // Strategic fields preserved from editorial corpus. All optional so legacy
    // wines (catena-malbec-2021, pazo-albarino-2022) keep validating.
    style: z.string().optional(),
    styleEs: z.string().optional(),
    pedagogicalRole: z.string().optional(),
    pedagogicalRoleEs: z.string().optional(),
    availability: z
      .object({
        note: z.string(),
        noteEs: z.string().optional(),
        sourceUrl: z.string().url().optional(),
      })
      .optional(),
    recommendedPairings: z.array(z.string()).default([]),
    recommendedPairingsEs: z.array(z.string()).default([]),
    // Markets (ISO-3166 alpha-2) where this wine is stocked. Defaults to ['CO']
    // so the launch corpus is Colombia-available without per-file edits; the
    // home feed gates on the visitor's market against this list.
    markets: z.array(z.string()).default(['CO']),
    notesForDemo: z.string().optional(),
  }),
});

const grapes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/grapes' }),
  schema: z.object({
    name: z.string(),
    nameEs: z.string().optional(),
    aliases: z.array(z.string()).default([]),
    color: z.enum(['red', 'white']),
    origin: z.string(),
    tagline: z.string().max(140),
    taglineEs: z.string().max(140).optional(),
    bodyEs: z.string().optional(),
    signatureRegions: z.array(reference('regions')).default([]),
  }),
});

const regions = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/regions' }),
  schema: z.object({
    name: z.string(),
    nameEs: z.string().optional(),
    country: z.string(),
    climate: z.string(),
    signatureGrapes: z.array(reference('grapes')).default([]),
    tagline: z.string().max(140),
    taglineEs: z.string().max(140).optional(),
    bodyEs: z.string().optional(),
  }),
});

const PROTEIN = [
  'beef',
  'pork',
  'lamb',
  'game',
  'poultry',
  'fish',
  'shellfish',
  'cured-meat',
  'cheese-aged',
  'cheese-fresh',
  'cheese-blue',
  'vegetable',
  'legume',
  'mushroom',
  'egg',
  'none',
] as const;

const COOKING_METHOD = [
  'raw',
  'cured',
  'grilled',
  'roasted',
  'braised',
  'fried',
  'steamed',
  'baked',
  'smoked',
  'seared',
  'poached',
  'boiled',
  'simmered',
  'sauteed',
] as const;

const FLAVOR_PROFILE = [
  'fatty',
  'lean',
  'acidic',
  'sweet',
  'spicy',
  'smoky',
  'umami',
  'bitter',
  'salty',
  'creamy',
  'earthy',
  'herbal',
  'citrusy',
  'briny',
] as const;

const dishes = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/dishes' }),
  schema: z.object({
    name: z.string(),
    nameEs: z.string().optional(),
    description: z.string(),
    descriptionEs: z.string().optional(),
    protein: z.array(z.enum(PROTEIN)).min(1),
    cookingMethod: z.array(z.enum(COOKING_METHOD)).default([]),
    flavorProfile: z.array(z.enum(FLAVOR_PROFILE)).default([]),
    intensity: z.number().int().min(0).max(5),
    weight: z.enum(['light', 'medium', 'heavy']),
    // Strategic editorial fields from CSV corpus. All optional so legacy
    // dishes (ribeye-grilled, oysters-raw, etc.) keep validating.
    category: z.string().optional(),
    categoryEs: z.string().optional(),
    cuisineContext: z.string().optional(),
    cuisineContextEs: z.string().optional(),
    pairingLogic: z.string().optional(),
    pairingLogicEs: z.string().optional(),
    recommendedWineStyles: z.array(z.string()).default([]),
    recommendedWineStylesEs: z.array(z.string()).default([]),
    notesForDemo: z.string().optional(),
  }),
});

const pairings = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/pairings' }),
  schema: z.object({
    wine: reference('wines'),
    dish: reference('dishes'),
    explanation: z.string(),
    explanationEs: z.string().optional(),
  }),
});

// A market = a country where Paircraft serves a localized feed. The visitor's
// market gates the wine grid; `dominantGrapes` is the grape-level fallback shown
// when no curated bottles exist for that market yet.
const markets = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/markets' }),
  schema: z.object({
    code: z.string(),
    name: z.string(),
    nameEs: z.string().optional(),
    tagline: z.string().max(140).optional(),
    taglineEs: z.string().max(140).optional(),
    bodyEs: z.string().optional(),
    dominantGrapes: z.array(reference('grapes')).default([]),
    dominantOrigins: z.array(z.string()).default([]),
    retailers: z
      .array(z.object({ name: z.string(), url: z.string().url().optional() }))
      .default([]),
  }),
});

export const collections = { wines, grapes, regions, dishes, pairings, markets };
