import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { DishSearchInput, exactDishMatch, filterDishesByOccasion } from '../../lib/dish-search';

export const prerender = false;

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

export const POST: APIRoute = async ({ request, url }) => {
  const origin = request.headers.get('origin');
  if (origin && origin !== url.origin) return json({ error: 'origin' }, 403);
  if (!request.headers.get('content-type')?.includes('application/json')) return json({ error: 'invalid' }, 415);
  // Bound bytes while reading, before JSON parsing or any paid request.
  const reader = request.body?.getReader();
  if (!reader) return json({ error: 'invalid' }, 400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  let input;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) { await reader.cancel(); return json({ error: 'invalid' }, 413); }
      chunks.push(value);
    }
    const body = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
    input = DishSearchInput.parse(JSON.parse(new TextDecoder().decode(body)));
  } catch { return json({ error: 'invalid' }, 400); }

  const dishes = filterDishesByOccasion(
    (await getCollection('dishes')).map(({ id, data }) => ({ id, ...data })),
    input.occasion,
  );
  // The paid model fallback is off (2026-11-08): the MVP is a search engine, so only an exact
  // dish name matches. Anything else gets the empty answer /pair shows as "no close match".
  const exact = exactDishMatch(input.query, dishes);
  return json(exact.length ? { dishIds: exact, kind: 'exact' } : { dishIds: [], kind: 'related' });
};
