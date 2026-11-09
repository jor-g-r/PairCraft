import { afterAll, describe, expect, mock, spyOn, test } from 'bun:test';

// /api/pair must answer from the catalog alone: no paid model call, no network, no API key.
mock.module('astro:content', () => ({
  getCollection: async () => [
    { id: 'ribeye-grilled', data: { name: 'Grilled ribeye', nameEs: 'Ribeye a la parrilla', occasion: ['meal'] } },
    { id: 'queso-azul', data: { name: 'Blue cheese', nameEs: 'Queso azul', occasion: ['snack'] } },
  ],
}));
const blockedFetch = (async () => { throw new Error('network call from /api/pair'); }) as unknown as typeof fetch;
const fetchSpy = spyOn(globalThis, 'fetch').mockImplementation(blockedFetch);
const { POST } = await import('../pages/api/pair');
afterAll(() => fetchSpy.mockRestore());

const ask = async (query: string, occasion = 'meal') => {
  const request = new Request('http://localhost/api/pair', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, occasion }),
  });
  const response = await POST({ request, url: new URL(request.url) } as never) as Response;
  return { status: response.status, body: await response.json() };
};

describe('/api/pair without a paid fallback', () => {
  test('an exact name in either language still matches', async () => {
    expect(await ask('grilled ribeye')).toEqual({ status: 200, body: { dishIds: ['ribeye-grilled'], kind: 'exact' } });
    expect(await ask('QUESO AZUL', 'snack')).toEqual({ status: 200, body: { dishIds: ['queso-azul'], kind: 'exact' } });
  });
  test('a free-text description gets the empty answer and never leaves the server', async () => {
    delete process.env.ANTHROPIC_API_KEY;
    expect(await ask('grilled salmon with lemon and herbs')).toEqual({ status: 200, body: { dishIds: [], kind: 'related' } });
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
