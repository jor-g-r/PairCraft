#!/usr/bin/env bun
/**
 * Translate remaining MDX collections.
 */

import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import Anthropic from '@anthropic-ai/sdk';

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) { console.error('Missing ANTHROPIC_API_KEY'); process.exit(1); }

const client = new Anthropic({ apiKey: API_KEY });
const MODEL = 'claude-sonnet-4-6';
const MAX_T = 2000;
const TEMP = 0.3;

const SYSTEM =
  'You are an expert EN→ES translator for wine & gastronomy content. ' +
  'Maintain the editorial tone, cultural references, and Hugh-Johnson-pocket-guide style. ' +
  'Reply ONLY with the translated text, no explanations, no markdown fences.';

async function translate(text: string): Promise<string> {
  if (!text || !text.trim()) return '';
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_T,
    temperature: TEMP,
    system: SYSTEM,
    messages: [{ role: 'user', content: `Translate this to Spanish. Keep it concise and natural.\n\n${text}` }],
  });
  for (const block of res.content) {
    if (block.type === 'text') return block.text.trim();
  }
  throw new Error('No text in Claude response');
}

function loadMdx(file: string) {
  const raw = fs.readFileSync(file, 'utf-8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: raw };
  return { frontmatter: YAML.parse(match[1]), body: match[2] };
}
function saveMdx(file: string, frontmatter: unknown, body: string) {
  const yamlBlock = YAML.stringify(frontmatter, { indent: 2, lineWidth: 0 });
  fs.writeFileSync(file, `---\n${yamlBlock}---\n${body}`);
}

async function translateMdxCollection(dir: string, label: string) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
  for (const f of files) {
    const filePath = path.join(dir, f);
    const { frontmatter, body } = loadMdx(filePath);
    if (frontmatter.taglineEs) continue; // already translated

    let changed = false;
    if (frontmatter.tagline) {
      console.log(`[${label}] ${f} tagline`);
      frontmatter.taglineEs = await translate(frontmatter.tagline);
      changed = true;
    }
    if (body.trim() && !frontmatter.bodyEs) {
      console.log(`[${label}] ${f} body`);
      frontmatter.bodyEs = await translate(body.trim());
      changed = true;
    }
    if (changed) saveMdx(filePath, frontmatter, body);
  }
}

async function main() {
  await translateMdxCollection('src/content/regions', 'region');
  await translateMdxCollection('src/content/markets', 'market');
  console.log('Done!');
}

main().catch((err) => { console.error(err); process.exit(1); });
