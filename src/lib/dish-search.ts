import { z } from 'zod';

export const DishSearchInput = z.object({ query: z.string().trim().min(3).max(300) }).strict();
export const DishMatchOutput = z.object({ dishIds: z.array(z.string()).max(1) }).strict();
export interface SearchableDish { id: string; name: string; nameEs?: string; }

export function normalizeDish(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function exactDishMatch(query: string, dishes: SearchableDish[]): string[] {
  const normalized = normalizeDish(query);
  return dishes.filter((dish) => [dish.id, dish.name, dish.nameEs].some((name) => name && normalizeDish(name) === normalized)).map((dish) => dish.id);
}

export function validatedDishIds(output: unknown, dishes: SearchableDish[]): string[] {
  const { dishIds } = DishMatchOutput.parse(output);
  const allowed = new Set(dishes.map((dish) => dish.id));
  if (dishIds.some((id) => !allowed.has(id))) throw new Error('Unknown dish returned');
  return [...new Set(dishIds)];
}
