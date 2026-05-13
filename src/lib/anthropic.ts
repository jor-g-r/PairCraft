import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { ANTHROPIC_API_KEY } from 'astro:env/server';
import { SYSTEM_PROMPT, buildUserMessage, type WineInput } from './prompt.ts';

const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 2500;
const TEMPERATURE = 0.5;

const PairingSchema = z.object({
  food: z.string().min(1),
  explanation: z.string().min(1),
  rule_ids: z.array(z.string()).min(1).max(3),
});

const PairingResultSchema = z.object({
  wine: z.object({
    name: z.string().min(1),
    summary: z.string().min(1),
  }),
  pairings: z.object({
    harmony: z.array(PairingSchema).length(3),
    contrast: z.array(PairingSchema).length(3),
    enhancement: z.array(PairingSchema).length(3),
  }),
});

export type PairingResult = z.infer<typeof PairingResultSchema>;
export type Pairing = z.infer<typeof PairingSchema>;

let cachedClient: Anthropic | null = null;
function getClient(): Anthropic {
  if (cachedClient) return cachedClient;
  cachedClient = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  return cachedClient;
}

function extractJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fence) return JSON.parse(fence[1]);
    throw new Error('Output is not valid JSON');
  }
}

async function callClaude(userMessage: string): Promise<string> {
  const client = getClient();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    temperature: TEMPERATURE,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  console.log('[paircraft] usage:', response.usage);

  for (const block of response.content) {
    if (block.type === 'text') return block.text;
  }
  throw new Error('No text content in Claude response');
}

export async function generatePairings(input: WineInput): Promise<PairingResult> {
  const baseMessage = buildUserMessage(input);
  const messages = [
    baseMessage,
    `${baseMessage}\n\nYour previous output failed validation. Return ONLY the JSON object — no prose, no code fences.`,
  ];

  let lastError: unknown;
  for (let attempt = 0; attempt < messages.length; attempt++) {
    try {
      const raw = await callClaude(messages[attempt]);
      const parsed = extractJson(raw);
      return PairingResultSchema.parse(parsed);
    } catch (err) {
      lastError = err;
      console.warn(`[paircraft] generation attempt ${attempt + 1} failed:`, err);
    }
  }

  throw new Error(
    `Pairing generation failed after ${messages.length} attempts: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`,
  );
}
