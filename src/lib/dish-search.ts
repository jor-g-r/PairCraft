import { z } from 'zod';

export const DishSearchInput = z.object({
  query: z.string().trim().min(3).max(300),
  occasion: z.enum(['meal', 'snack']).default('meal'),
}).strict();
export const DishMatchOutput = z.object({ dishIds: z.array(z.string()).max(1) }).strict();
export interface SearchableDish { id: string; name: string; nameEs?: string; }
export type Occasion = 'meal' | 'snack';

export function filterDishesByOccasion<T extends { occasion: readonly Occasion[] }>(dishes: T[], occasion: Occasion): T[] {
  return dishes.filter((dish) => dish.occasion.includes(occasion));
}

export function normalizeDish(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function exactDishMatch(query: string, dishes: SearchableDish[]): string[] {
  const normalized = normalizeDish(query);
  return dishes.filter((dish) => [dish.id, dish.name, dish.nameEs].some((name) => name && normalizeDish(name) === normalized)).map((dish) => dish.id);
}

// Joining words the query may carry that no dish name needs to contain.
const STOPWORDS = new Set(['a', 'al', 'an', 'and', 'con', 'de', 'del', 'el', 'en', 'in', 'la', 'las', 'los', 'of', 'on', 'the', 'with', 'y']);

/** The word itself, and without a plural ending, so "mushrooms" finds "mushroom". */
function wordForms(word: string): string[] {
  const forms = [word];
  if (word.length > 3 && word.endsWith('es')) forms.push(word.slice(0, -2));
  if (word.length > 3 && word.endsWith('s')) forms.push(word.slice(0, -1));
  return forms;
}

/**
 * Dishes whose names, in either language, have a word starting with each word of the query.
 * Every word must be found, so a description that adds a sauce or method we lack matches nothing.
 */
export function wordDishMatch(query: string, dishes: SearchableDish[]): string[] {
  const words = normalizeDish(query).split(' ').filter((word) => word && !STOPWORDS.has(word));
  if (!words.length) return [];
  return dishes.filter((dish) => {
    const dishWords = [dish.id, dish.name, dish.nameEs].flatMap((name) => (name ? normalizeDish(name).split(' ') : []));
    return words.every((word) => wordForms(word).some((form) => dishWords.some((dishWord) => dishWord.startsWith(form))));
  }).map((dish) => dish.id);
}

export function validatedDishIds(output: unknown, dishes: SearchableDish[]): string[] {
  const { dishIds } = DishMatchOutput.parse(output);
  const allowed = new Set(dishes.map((dish) => dish.id));
  if (dishIds.some((id) => !allowed.has(id))) throw new Error('Unknown dish returned');
  return [...new Set(dishIds)];
}
