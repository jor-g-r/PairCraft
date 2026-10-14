import { describe, expect, test } from 'bun:test';
import { DishSearchInput, exactDishMatch, filterDishesByOccasion, validatedDishIds } from './dish-search';

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
    expect(DishSearchInput.parse({ query: 'queso azul', occasion: 'snack' }).occasion).toBe('snack');
    expect(DishSearchInput.safeParse({ query: 'queso azul', occasion: 'board' }).success).toBe(false);
  });
  test('accepts no-match and a single supported dish', () => {
    expect(validatedDishIds({ dishIds: [] }, dishes)).toEqual([]);
    expect(validatedDishIds({ dishIds: ['ceviche'] }, dishes)).toEqual(['ceviche']);
  });
  test('keeps meal and snack suggestions in their selected occasion', () => {
    const foods = [
      { id: 'ceviche', occasion: ['meal', 'snack'] as const },
      { id: 'risotto', occasion: ['meal'] as const },
      { id: 'aged-manchego', occasion: ['snack'] as const },
    ];
    expect(filterDishesByOccasion(foods, 'meal').map(({ id }) => id)).toEqual(['ceviche', 'risotto']);
    expect(filterDishesByOccasion(foods, 'snack').map(({ id }) => id)).toEqual(['ceviche', 'aged-manchego']);
  });
  test('rejects hallucinated ids and malformed model output', () => {
    expect(() => validatedDishIds({ dishIds: ['https://bad.example'] }, dishes)).toThrow();
    expect(() => validatedDishIds({ dishIds: ['ceviche'], score: 99 }, dishes)).toThrow();
    expect(() => validatedDishIds({ dishIds: ['ceviche', 'ceviche', 'ceviche', 'ceviche'] }, dishes)).toThrow();
  });
});
