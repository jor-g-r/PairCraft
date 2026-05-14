import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const wines = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/wines' }),
  schema: z.object({
    name: z.string(),
    vintage: z.number().int().min(1800).max(2100).optional(),
    tagline: z.string().max(140),
    summary: z.string(),
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
  }),
});

const grapes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/grapes' }),
  schema: z.object({
    name: z.string(),
    aliases: z.array(z.string()).default([]),
    color: z.enum(['red', 'white']),
    origin: z.string(),
    tagline: z.string().max(140),
    signatureRegions: z.array(reference('regions')).default([]),
  }),
});

const regions = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/regions' }),
  schema: z.object({
    name: z.string(),
    country: z.string(),
    climate: z.string(),
    signatureGrapes: z.array(reference('grapes')).default([]),
    tagline: z.string().max(140),
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
    description: z.string(),
    protein: z.array(z.enum(PROTEIN)).min(1),
    cookingMethod: z.array(z.enum(COOKING_METHOD)).default([]),
    flavorProfile: z.array(z.enum(FLAVOR_PROFILE)).default([]),
    intensity: z.number().int().min(0).max(5),
    weight: z.enum(['light', 'medium', 'heavy']),
  }),
});

const pairings = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/pairings' }),
  schema: z.object({
    wine: reference('wines'),
    dish: reference('dishes'),
    explanation: z.string(),
  }),
});

export const collections = { wines, grapes, regions, dishes, pairings };
