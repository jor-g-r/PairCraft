import { describe, expect, test } from 'bun:test';
import { DishSearchInput, exactDishMatch, validatedDishIds } from './dish-search';

const dishes = [
  { id: 'salmon-grilled', name: 'Grilled salmon', nameEs: 'Salmón a la parrilla' },
  { id: 'ceviche', name: 'Ceviche' },
];

describe('dish routing boundaries', () => {
  test('matches bilingual names without accents but never equates a changed sauce', () => {
    expect(exactDishMatch('  SALMON A LA PARRILLA ', dishes)).toEqual(['salmon-grilled']);
    expect(exactDishMatch('Grilled salmon', dishes)).toEqual(['salmon-grilled']);
    expect(exactDishMatch('Grilled salmon with sweet teriyaki glaze', dishes)).toEqual([]);
  });
  test('rejects empty and oversized descriptions before a provider call', () => {
    expect(DishSearchInput.safeParse({ query: '  ' }).success).toBe(false);
    expect(DishSearchInput.safeParse({ query: 'a'.repeat(301) }).success).toBe(false);
    expect(DishSearchInput.parse({ query: ' ceviche ' }).query).toBe('ceviche');
  });
  test('accepts no-match and a single supported dish', () => {
    expect(validatedDishIds({ dishIds: [] }, dishes)).toEqual([]);
    expect(validatedDishIds({ dishIds: ['ceviche'] }, dishes)).toEqual(['ceviche']);
  });
  test('rejects hallucinated ids and malformed model output', () => {
    expect(() => validatedDishIds({ dishIds: ['https://bad.example'] }, dishes)).toThrow();
    expect(() => validatedDishIds({ dishIds: ['ceviche'], score: 99 }, dishes)).toThrow();
    expect(() => validatedDishIds({ dishIds: ['ceviche', 'ceviche', 'ceviche', 'ceviche'] }, dishes)).toThrow();
  });
});
