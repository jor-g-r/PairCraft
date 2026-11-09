import { describe, expect, test } from 'bun:test';
import { DishSearchInput, exactDishMatch, filterDishesByOccasion, validatedDishIds, wordDishMatch } from './dish-search';

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
  test('finds a dish by one of its words, in either language, but never by a changed sauce', () => {
    const meals = [
      ...dishes,
      { id: 'ribeye-grilled', name: 'Grilled ribeye', nameEs: 'Ribeye a la parrilla' },
      { id: 'pollo-con-mole', name: 'Chicken mole', nameEs: 'Pollo con mole / salsa especiada con cacao' },
      { id: 'risotto-de-hongos', name: 'Mushroom risotto', nameEs: 'Risotto de hongos' },
    ];
    expect(wordDishMatch('chicken', meals)).toEqual(['pollo-con-mole']);
    expect(wordDishMatch(' POLLO ', meals)).toEqual(['pollo-con-mole']);
    expect(wordDishMatch('pollo con mole', meals)).toEqual(['pollo-con-mole']);
    expect(wordDishMatch('mushrooms', meals)).toEqual(['risotto-de-hongos']);
    expect(wordDishMatch('salmón', meals)).toEqual(['salmon-grilled']);
    expect(wordDishMatch('grilled', meals)).toEqual(['salmon-grilled', 'ribeye-grilled']);
    expect(wordDishMatch('Grilled salmon with sweet teriyaki glaze', meals)).toEqual([]);
    expect(wordDishMatch('con la de', meals)).toEqual([]);
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
