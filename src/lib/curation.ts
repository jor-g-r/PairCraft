/**
 * LLM curation — draft Hugh-voice pairing prose at curation time.
 * Called from scripts/draft-pairings.ts, not at runtime.
 *
 * Uses process.env.ANTHROPIC_API_KEY (Bun loads .env automatically).
 * The system block is cacheable so multi-pairing runs amortize cost.
 */

import Anthropic from '@anthropic-ai/sdk';
import { RULES, type Rule } from './rules.ts';
import type { Tier } from './tier.ts';
import { VOICE, serializeRules } from './prompt.ts';

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment');
    }
    client = new Anthropic({ apiKey });
  }
  return client;
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
  const response = await getClient().messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    temperature: 0.6,
    system: [
      {
        type: 'text',
        text: SYSTEM_TEXT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: buildUserMessage(args) }],
  });

  const block = response.content.find((b) => b.type === 'text');
  if (!block || block.type !== 'text') {
    throw new Error('No text content in response');
  }
  return block.text.trim().replace(/^["']|["']$/g, '').trim();
}
