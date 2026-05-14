/**
 * LLM curation — draft Hugh-voice pairing prose at curation time.
 * Called from scripts/draft-pairings.ts, not at runtime.
 *
 * Provider switch via LLM_PROVIDER env var:
 *   - "anthropic" (default) → Anthropic native, claude-sonnet-4-6, prompt caching on
 *   - "opencode-go"          → OpenCode Go gateway, minimax-m2.7, Anthropic-compat
 * Both keys can coexist in .env; LLM_PROVIDER picks which one is used.
 */

import Anthropic from '@anthropic-ai/sdk';
import { RULES, type Rule } from './rules.ts';
import type { Tier } from './tier.ts';
import { VOICE, serializeRules } from './prompt.ts';

type Provider = 'anthropic' | 'opencode-go';

function getProvider(): Provider {
  const p = process.env.LLM_PROVIDER;
  if (p === 'opencode-go') return 'opencode-go';
  return 'anthropic';
}

const MODEL_BY_PROVIDER: Record<Provider, string> = {
  anthropic: 'claude-sonnet-4-6',
  'opencode-go': 'minimax-m2.7',
};

let client: Anthropic | null = null;
let cachedProvider: Provider | null = null;
function getClient(): { client: Anthropic; provider: Provider } {
  const provider = getProvider();
  if (!client || cachedProvider !== provider) {
    if (provider === 'opencode-go') {
      const apiKey = process.env.OPENCODE_API_KEY;
      if (!apiKey) {
        throw new Error('OPENCODE_API_KEY is not set (LLM_PROVIDER=opencode-go)');
      }
      client = new Anthropic({
        apiKey,
        baseURL: 'https://opencode.ai/zen/go',
      });
    } else {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY is not set in environment');
      }
      client = new Anthropic({ apiKey });
    }
    cachedProvider = provider;
  }
  return { client, provider };
}

export function activeProvider(): Provider {
  return getProvider();
}

const CURATION_INSTRUCTION = `You will be given ONE wine, ONE dish, and the pairing rules that activated for that pair. Produce ONE pairing note in voice.

Output ONLY the sentence (or two, if the second sharpens). No preamble. No surrounding quotes. No rule names or rule ids in the text. No "this wine" / "this dish" — write declaratively about the pairing mechanism.`;

const SYSTEM_TEXT = `${VOICE}\n\n${CURATION_INSTRUCTION}\n\n${serializeRules(RULES)}`;

const TIER_LABEL: Record<Tier, string> = {
  decisive: 'Decisive match',
  'worth-trying': 'Worth trying',
  risky: 'Risky bridge',
  skip: 'Skip',
};

interface WineLike {
  name: string;
  vintage?: number;
  color: string;
  tagline?: string;
  sensoryProfile: { sweetness: number; acidity: number; tannin: number; body: number };
  flavouring?: { primary: string[]; secondary: string[]; tertiary: string[] };
}

interface DishLike {
  name: string;
  description: string;
  protein: string[];
  cookingMethod: string[];
  flavorProfile: string[];
  intensity: number;
  weight: string;
}

export interface DraftArgs {
  wine: WineLike;
  dish: DishLike;
  activations: Rule[];
  tier: Tier;
}

function describeWine(w: WineLike): string {
  const lines = [
    `WINE:`,
    `  name: ${w.name}${w.vintage ? ` ${w.vintage}` : ''}`,
    `  color: ${w.color}`,
    `  sensory: sweetness ${w.sensoryProfile.sweetness}/5, acidity ${w.sensoryProfile.acidity}/5, tannin ${w.sensoryProfile.tannin}/5, body ${w.sensoryProfile.body}/5`,
  ];
  if (w.flavouring) {
    if (w.flavouring.primary.length) lines.push(`  primary notes: ${w.flavouring.primary.join(', ')}`);
    if (w.flavouring.secondary.length) lines.push(`  secondary notes: ${w.flavouring.secondary.join(', ')}`);
    if (w.flavouring.tertiary.length) lines.push(`  tertiary notes: ${w.flavouring.tertiary.join(', ')}`);
  }
  if (w.tagline) lines.push(`  tagline (style cue): ${w.tagline}`);
  return lines.join('\n');
}

function describeDish(d: DishLike): string {
  const lines = [
    `DISH:`,
    `  name: ${d.name}`,
    `  description: ${d.description}`,
    `  protein: ${d.protein.join(', ')}`,
  ];
  if (d.cookingMethod.length) lines.push(`  cooking: ${d.cookingMethod.join(', ')}`);
  if (d.flavorProfile.length) lines.push(`  flavor profile: ${d.flavorProfile.join(', ')}`);
  lines.push(`  intensity: ${d.intensity}/5`);
  lines.push(`  weight: ${d.weight}`);
  return lines.join('\n');
}

function describeActivations(rules: Rule[]): string {
  return [
    `RULES ACTIVATED (these drove the pairing — your reasoning, not your wording):`,
    ...rules.map((r) => `  - ${r.name} (${r.mode}): ${r.description}`),
  ].join('\n');
}

function buildUserMessage({ wine, dish, activations, tier }: DraftArgs): string {
  return `${describeWine(wine)}\n\n${describeDish(dish)}\n\n${describeActivations(activations)}\n\nTier verdict: ${TIER_LABEL[tier]}.\n\nWrite the pairing note now. One sentence. No quotes. No preamble.`;
}

export async function draftPairingProse(args: DraftArgs): Promise<string> {
  const { client, provider } = getClient();
  const system =
    provider === 'anthropic'
      ? [{ type: 'text' as const, text: SYSTEM_TEXT, cache_control: { type: 'ephemeral' as const } }]
      : SYSTEM_TEXT;

  // MiniMax models on OpenCode emit reasoning as `thinking` blocks before the
  // final `text` — they need a larger budget to leave room for the answer.
  const maxTokens = provider === 'opencode-go' ? 2000 : 300;

  const response = await client.messages.create({
    model: MODEL_BY_PROVIDER[provider],
    max_tokens: maxTokens,
    temperature: 0.6,
    system,
    messages: [{ role: 'user', content: buildUserMessage(args) }],
  });

  const block = response.content.find((b) => b.type === 'text');
  if (!block || block.type !== 'text') {
    throw new Error(
      `No text content in response (stop_reason: ${response.stop_reason}, blocks: ${response.content.map((b) => b.type).join(',')})`,
    );
  }
  return block.text.trim().replace(/^["']|["']$/g, '').trim();
}

// ---------- Entity drafting (wines, grapes, regions, dishes) ----------------
//
// Used by scripts/draft-entities.ts to expand the corpus from name lists.
// Each function asks the LLM to emit a single JSON object matching the
// entity's content-collection schema. The orchestrator validates against the
// real Zod schema at write time.

const ENTITY_VOICE_INSTRUCTION = `${VOICE}

You will draft entries for the Paircraft entity graph (wines, grapes, regions, dishes). Each draft must match the schema you are given EXACTLY. Output ONLY raw JSON — no markdown fences, no preamble, no commentary.

Sensory and intensity scales are integers 0-5 unless specified otherwise. Slugs are lowercase-kebab-case, no spaces, no diacritics. Tagline ≤ 140 chars. Hugh-voice everywhere: opinionated, declarative, no hedging.`;

async function callJson<T>(userMessage: string): Promise<T> {
  const { client, provider } = getClient();
  const system =
    provider === 'anthropic'
      ? [{ type: 'text' as const, text: ENTITY_VOICE_INSTRUCTION, cache_control: { type: 'ephemeral' as const } }]
      : ENTITY_VOICE_INSTRUCTION;
  const maxTokens = provider === 'opencode-go' ? 4000 : 1500;

  const response = await client.messages.create({
    model: MODEL_BY_PROVIDER[provider],
    max_tokens: maxTokens,
    temperature: 0.4,
    system,
    messages: [{ role: 'user', content: userMessage }],
  });

  const block = response.content.find((b) => b.type === 'text');
  if (!block || block.type !== 'text') {
    throw new Error(
      `No text content (stop_reason: ${response.stop_reason}, blocks: ${response.content.map((b) => b.type).join(',')})`,
    );
  }

  let raw = block.text.trim();
  // Strip ```json ... ``` or ``` ... ``` fences if present.
  raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();

  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    throw new Error(`Failed to parse JSON response. Raw:\n${raw}\n\nParse error: ${(err as Error).message}`);
  }
}

export interface GrapeDraft {
  slug: string;
  name: string;
  aliases: string[];
  color: 'red' | 'white';
  origin: string;
  tagline: string;
  signatureRegions: string[];
  body: string;
}

export async function draftGrape(name: string, availableRegions: string[]): Promise<GrapeDraft> {
  const regionsList = availableRegions.length ? availableRegions.join(', ') : '(none yet)';
  return callJson<GrapeDraft>(
    `Draft a grape entry for: ${name}

Available region slugs (use ONLY these for signatureRegions; empty array if none fit): ${regionsList}

Schema:
{
  "slug": string,                // kebab-case, lowercase, no diacritics. e.g. "cabernet-sauvignon"
  "name": string,                // canonical spelling, may include diacritics. e.g. "Cabernet Sauvignon"
  "aliases": string[],           // common synonyms. e.g. ["Côt", "Auxerrois"] for Malbec
  "color": "red" | "white",
  "origin": string,              // birthplace, one short phrase. e.g. "Cahors, southwest France"
  "tagline": string,             // ≤ 140 chars, opinionated, pocket-guide voice
  "signatureRegions": string[],  // region slugs from the list above
  "body": string                 // 2 short paragraphs, pocket-guide voice. First: history/identity. Second: signature in the glass + ideal food context. ~140-180 words total. Use \\n\\n between paragraphs.
}

Output ONLY the JSON object.`,
  );
}

export interface RegionDraft {
  slug: string;
  name: string;
  country: string;
  climate: string;
  signatureGrapes: string[];
  tagline: string;
  body: string;
}

export async function draftRegion(input: string, availableGrapes: string[]): Promise<RegionDraft> {
  const grapesList = availableGrapes.length ? availableGrapes.join(', ') : '(none yet)';
  return callJson<RegionDraft>(
    `Draft a region entry for: ${input}

Available grape slugs (use ONLY these for signatureGrapes; empty array if none fit): ${grapesList}

Schema:
{
  "slug": string,              // kebab-case, lowercase, no diacritics
  "name": string,              // canonical spelling. e.g. "Rías Baixas"
  "country": string,           // e.g. "Spain"
  "climate": string,           // one sentence describing climate + key terroir factor
  "signatureGrapes": string[], // grape slugs from the list above
  "tagline": string,           // ≤ 140 chars, opinionated, pocket-guide voice
  "body": string               // 2 short paragraphs, pocket-guide voice. First: what defines the region (terroir, history). Second: stylistic signature + which producers/sub-zones matter. ~140-180 words total. Use \\n\\n between paragraphs.
}

Output ONLY the JSON object.`,
  );
}

export interface WineDraft {
  slug: string;
  name: string;
  vintage?: number;
  tagline: string;
  summary: string;
  color: 'red' | 'white' | 'rose' | 'orange' | 'sparkling';
  region: string;
  grapes: Array<{ grape: string; percentage?: number }>;
  sensoryProfile: { sweetness: number; acidity: number; tannin: number; body: number };
  flavouring: { primary: string[]; secondary: string[]; tertiary: string[] };
  tanninProfile?: { softness: number; astringency: number; complexity: number; structure: number };
}

export async function draftWine(
  input: string,
  availableGrapes: string[],
  availableRegions: string[],
): Promise<WineDraft> {
  const grapesList = availableGrapes.length ? availableGrapes.join(', ') : '(none yet)';
  const regionsList = availableRegions.length ? availableRegions.join(', ') : '(none yet)';
  return callJson<WineDraft>(
    `Draft a wine entry for: ${input}

Available grape slugs (pick from these; the wine MUST reference grapes that exist): ${grapesList}
Available region slugs (pick exactly one): ${regionsList}

Schema:
{
  "slug": string,         // kebab-case. Include vintage if relevant. e.g. "catena-malbec-2021"
  "name": string,         // producer + cuvée, no vintage. e.g. "Catena Malbec"
  "vintage": number,      // 4-digit year, OMIT field entirely if non-vintage
  "tagline": string,      // ≤ 140 chars, pocket-guide. One opinion + 2-3 sensory anchors. e.g. "Mendoza incarnate — violets, plum, and altitude in a glass."
  "summary": string,      // 2-3 sentences. What this wine is at its core + drinking advice.
  "color": "red" | "white" | "rose" | "orange" | "sparkling",
  "region": string,       // one region slug from the list above
  "grapes": [{ "grape": string, "percentage": number }],  // grape slugs from list; percentages sum to 100 if known
  "sensoryProfile": { "sweetness": 0-5, "acidity": 0-5, "tannin": 0-5, "body": 0-5 },
                          // sweetness: 0 bone-dry, 5 dessert. tannin: 0 none (whites), 5 grippy young Nebbiolo.
  "flavouring": {
    "primary": string[],    // fruit/floral from the grape. e.g. ["black plum", "violet"]
    "secondary": string[],  // from winemaking: oak, lees, malo. e.g. ["vanilla", "toast"]
    "tertiary": string[]    // bottle age: leather, forest floor, dried fruit. [] if too young.
  },
  "tanninProfile": { "softness": 0-5, "astringency": 0-5, "complexity": 0-5, "structure": 0-5 }
                          // OMIT entirely for whites/rosé/sparkling (no tannin).
}

If the wine is well-known, draw on its actual character. If the vintage is too obscure for confident vintage-specific notes, write to the producer's house style. Be honest, opinionated, Hugh-voice. Output ONLY the JSON object.`,
  );
}

export interface DishDraft {
  slug: string;
  name: string;
  description: string;
  protein: string[];
  cookingMethod: string[];
  flavorProfile: string[];
  intensity: number;
  weight: 'light' | 'medium' | 'heavy';
}

export async function draftDish(input: string): Promise<DishDraft> {
  return callJson<DishDraft>(
    `Draft a dish entry for: ${input}

Schema:
{
  "slug": string,            // kebab-case. e.g. "ribeye-grilled"
  "name": string,            // canonical English name. e.g. "Grilled ribeye"
  "description": string,     // ONE sentence, pocket-guide voice. Concrete sensory anchors, no marketing. e.g. "A thick cut over open flame — charred crust, pink centre, finishing salt."
  "protein": string[],       // from: beef, pork, lamb, game, poultry, fish, shellfish, cured-meat, cheese-aged, cheese-fresh, cheese-blue, vegetable, legume, mushroom, egg, none
  "cookingMethod": string[], // from: raw, cured, grilled, roasted, braised, fried, steamed, baked, smoked, seared, poached, boiled, simmered, sauteed
  "flavorProfile": string[], // from: fatty, lean, acidic, sweet, spicy, smoky, umami, bitter, salty, creamy, earthy, herbal, citrusy, briny
  "intensity": 0-5,          // 0 plain steamed vegetable, 5 reduction-sauce duck
  "weight": "light" | "medium" | "heavy"
}

Pick ONLY values from the controlled vocabularies. Be specific and concrete in the description. Output ONLY the JSON object.`,
  );
}

// ---------- Enrichment helpers for CSV import ------------------------------
//
// Used by scripts/import-csv.ts. Structural data comes from the CSV; the LLM
// only fills the creative gaps: Hugh-voice copy for wines, description plus
// enum mapping for dishes.

export interface WineCopyInput {
  name: string;
  style: string;
  region: string;
  country: string;
  grapeVarieties: string;
  primaryNotes: string;
  pedagogicalRole: string;
}

export interface WineCopy {
  tagline: string;
  summary: string;
}

export async function draftWineCopy(input: WineCopyInput): Promise<WineCopy> {
  return callJson<WineCopy>(
    `Draft pocket-guide copy for this wine. You have full structural data already — only write the tagline and summary in Hugh-Johnson voice.

WINE:
  name: ${input.name}
  style: ${input.style}
  region: ${input.region}, ${input.country}
  grape varieties: ${input.grapeVarieties}
  primary notes: ${input.primaryNotes}
  pedagogical role: ${input.pedagogicalRole}

Schema:
{
  "tagline": string,  // ≤ 140 chars. One opinion + 2-3 sensory anchors. Hugh-voice. e.g. "Mendoza incarnate — violets, plum, and altitude in a glass."
  "summary": string   // 2-3 sentences. What this wine is at its core + drinking advice + why it matters pedagogically (subtly, not as a teaching note). Hugh-voice.
}

Output ONLY the JSON object.`,
  );
}

export interface DishCopyInput {
  name: string;
  category: string;
  mainIngredients: string;
  cookingMethods: string;
  sensoryAxes: { fat: string; salt: string; sweetness: string; acidity: string; umami: string; bitterness: string; spiceHeat: string };
  texture: string;
  intensityWord: string;
  pairingLogic: string;
}

export interface DishCopy {
  description: string;
  protein: string[];
  cookingMethod: string[];
  flavorProfile: string[];
  weight: 'light' | 'medium' | 'heavy';
}

export async function draftDishCopy(input: DishCopyInput): Promise<DishCopy> {
  const axes = input.sensoryAxes;
  return callJson<DishCopy>(
    `Draft pocket-guide copy and controlled-vocabulary mapping for this dish. Structural intensity comes from the CSV; you decide weight + enum arrays + the one-sentence description.

DISH:
  name: ${input.name}
  category: ${input.category}
  main ingredients: ${input.mainIngredients}
  cooking methods: ${input.cookingMethods}
  texture: ${input.texture}
  intensity (overall): ${input.intensityWord}
  sensory axes: fat=${axes.fat}, salt=${axes.salt}, sweetness=${axes.sweetness}, acidity=${axes.acidity}, umami=${axes.umami}, bitterness=${axes.bitterness}, spice=${axes.spiceHeat}
  pairing logic (context): ${input.pairingLogic}

Schema:
{
  "description": string,    // ONE sentence, pocket-guide voice. Concrete sensory anchors, no marketing. e.g. "A thick cut over open flame — charred crust, pink centre, finishing salt."
  "protein": string[],      // from: beef, pork, lamb, game, poultry, fish, shellfish, cured-meat, cheese-aged, cheese-fresh, cheese-blue, vegetable, legume, mushroom, egg, none
  "cookingMethod": string[],// from: raw, cured, grilled, roasted, braised, fried, steamed, baked, smoked, seared, poached, boiled, simmered, sauteed
  "flavorProfile": string[],// from: fatty, lean, acidic, sweet, spicy, smoky, umami, bitter, salty, creamy, earthy, herbal, citrusy, briny
  "weight": "light" | "medium" | "heavy"  // body weight on the palate: ceviche=light, grilled steak=heavy
}

Pick ONLY values from the controlled vocabularies. Map the axes carefully — high fat → "fatty"; high acidity → "acidic"; high umami → "umami"; high salt → "salty"; spice>none → "spicy"; smoky cooking → "smoky"; creamy texture → "creamy". Output ONLY the JSON object.`,
  );
}
