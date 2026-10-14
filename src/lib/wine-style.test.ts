import { describe, expect, test } from 'bun:test';
import { rankWineStyleExamples, type WineStyleCandidate } from './wine-style';

const wines: WineStyleCandidate[] = [
  {
    id: 'crisp-white',
    data: {
      name: 'Crisp white',
      color: 'white',
      markets: ['CO'],
      sensoryProfile: { sweetness: 0, acidity: 5, tannin: 0, body: 1 },
    },
  },
  {
    id: 'sweet-white',
    data: {
      name: 'Sweet white',
      color: 'white',
      markets: ['CO'],
      sensoryProfile: { sweetness: 5, acidity: 3, tannin: 0, body: 2 },
    },
  },
  {
    id: 'crisp-white-abroad',
    data: {
      name: 'Crisp white abroad',
      color: 'white',
      markets: ['FR'],
      sensoryProfile: { sweetness: 0, acidity: 5, tannin: 0, body: 1 },
    },
  },
  {
    id: 'light-red',
    data: {
      name: 'Light red',
      color: 'red',
      markets: ['CO'],
      sensoryProfile: { sweetness: 0, acidity: 3, tannin: 1, body: 2 },
    },
  },
];

describe('rankWineStyleExamples', () => {
  test('ranks wines by selected structure, filters by color and market', () => {
    expect(rankWineStyleExamples({ color: 'white', body: 'light', sweetness: 'dry', acidity: 'high' }, wines, 'CO'))
      .toEqual(['crisp-white', 'sweet-white']);
  });

  test('uses only the chosen market and respects the result limit', () => {
    expect(rankWineStyleExamples({ color: 'white', body: 'light', acidity: 'high' }, wines, 'FR', 1))
      .toEqual(['crisp-white-abroad']);
  });
});
