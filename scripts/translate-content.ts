#!/usr/bin/env bun
/**
 * Mass-translation script for Paircraft content.
 *
 * Reads every content file, calls Claude to translate editorial text fields,
 * and writes the Spanish version back as `*Es` fields (YAML) or `bodyEs`
 * frontmatter (MDX).
 *
 * Usage: ANTHROPIC_API_KEY=xxx bun run scripts/translate-content.ts
 */

import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import Anthropic from '@anthropic-ai/sdk';

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error('Missing ANTHROPIC_API_KEY env variable');
  process.exit(1);
}

const client = new Anthropic({ apiKey: API_KEY });
const MODEL = 'claude-sonnet-4-6';
const MAX_T = 1500;
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

async function translateBatch(texts: string[]): Promise<string[]> {
  const payload = texts
    .map((t, i) => `---${i}---\n${t || ''}`)
    .join('\n\n');
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: Math.max(MAX_T, texts.length * 200),
    temperature: TEMP,
    system:
      SYSTEM +
      ' You receive multiple segments separated by ---N--- markers. ' +
      'Return each translated segment with the SAME ---N--- marker, in the SAME order. ' +
      'If a segment is empty, return it empty.',
    messages: [
      {
        role: 'user',
        content: `Translate every segment below to Spanish. Keep markers intact.\n\n${payload}`,
      },
    ],
  });
  let raw = '';
  for (const block of res.content) {
    if (block.type === 'text') raw = block.text;
  }
  const out: string[] = [];
  for (let i = 0; i < texts.length; i++) {
    const m = raw.match(new RegExp(`---${i}---\\s*\\n?([\\s\\S]*?)(?=---${i + 1}---|$)`));
    out.push(m ? m[1].trim() : '');
  }
  return out;
}

/* ── YAML helpers ── */
function loadYaml(file: string) {
  return YAML.parse(fs.readFileSync(file, 'utf-8'));
}
function saveYaml(file: string, data: unknown) {
  fs.writeFileSync(file, YAML.stringify(data, { indent: 2, lineWidth: 0 }));
}

/* ── MDX helpers ── */
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

/* ── Wines ── */
async function translateWines() {
  const dir = 'src/content/wines';
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.yaml'));
  for (const f of files) {
    const filePath = path.join(dir, f);
    const data = loadYaml(filePath);
    const fields: string[] = [];
    const keys: string[] = [];

    if (data.tagline && !data.taglineEs) {
      fields.push(data.tagline); keys.push('taglineEs');
    }
    if (data.summary && !data.summaryEs) {
      fields.push(data.summary); keys.push('summaryEs');
    }
    if (data.style && !data.styleEs) {
      fields.push(data.style); keys.push('styleEs');
    }
    if (data.pedagogicalRole && !data.pedagogicalRoleEs) {
      fields.push(data.pedagogicalRole); keys.push('pedagogicalRoleEs');
    }
    if (data.availability?.note && !data.availability.noteEs) {
      fields.push(data.availability.note); keys.push('availability.noteEs');
    }

    if (fields.length === 0) continue;
    console.log(`[wine] ${f} — ${fields.length} fields`);
    const tr = await translateBatch(fields);
    keys.forEach((k, i) => {
      if (k.startsWith('availability.')) {
        data.availability ??= {};
        data.availability.noteEs = tr[i];
      } else {
        data[k] = tr[i];
      }
    });
    saveYaml(filePath, data);
  }
}

/* ── Dishes ── */
async function translateDishes() {
  const dir = 'src/content/dishes';
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.yaml'));
  for (const f of files) {
    const filePath = path.join(dir, f);
    const data = loadYaml(filePath);
    const fields: string[] = [];
    const keys: string[] = [];

    if (data.description && !data.descriptionEs) {
      fields.push(data.description); keys.push('descriptionEs');
    }
    if (data.cuisineContext && !data.cuisineContextEs) {
      fields.push(data.cuisineContext); keys.push('cuisineContextEs');
    }
    if (data.pairingLogic && !data.pairingLogicEs) {
      fields.push(data.pairingLogic); keys.push('pairingLogicEs');
    }

    if (fields.length === 0) continue;
    console.log(`[dish] ${f} — ${fields.length} fields`);
    const tr = await translateBatch(fields);
    keys.forEach((k, i) => (data[k] = tr[i]));
    saveYaml(filePath, data);
  }
}

/* ── Pairings ── */
async function translatePairings() {
  const dir = 'src/content/pairings';
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.yaml'));
  for (const f of files) {
    const filePath = path.join(dir, f);
    const data = loadYaml(filePath);
    if (!data.explanation || data.explanationEs) continue;
    console.log(`[pairing] ${f}`);
    data.explanationEs = await translate(data.explanation);
    saveYaml(filePath, data);
  }
}

/* ── Grapes / Regions / Markets (MDX) ── */
async function translateMdxCollection(dir: string, label: string) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
  for (const f of files) {
    const filePath = path.join(dir, f);
    const { frontmatter, body } = loadMdx(filePath);
    const fields: string[] = [];
    const keys: string[] = [];

    if (frontmatter.tagline && !frontmatter.taglineEs) {
      fields.push(frontmatter.tagline); keys.push('taglineEs');
    }
    if (body.trim() && !frontmatter.bodyEs) {
      fields.push(body.trim()); keys.push('bodyEs');
    }

    if (fields.length === 0) continue;
    console.log(`[${label}] ${f} — ${fields.length} fields`);
    const tr = await translateBatch(fields);
    keys.forEach((k, i) => {
      if (k === 'bodyEs') frontmatter.bodyEs = tr[i];
      else frontmatter[k] = tr[i];
    });
    saveMdx(filePath, frontmatter, body);
  }
}

async function main() {
  console.log('Starting mass translation...');
  await translateWines();
  await translateDishes();
  await translatePairings();
  await translateMdxCollection('src/content/grapes', 'grape');
  await translateMdxCollection('src/content/regions', 'region');
  await translateMdxCollection('src/content/markets', 'market');
  console.log('Done!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
