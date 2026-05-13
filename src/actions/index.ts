import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import { generatePairings } from '../lib/anthropic.ts';

export const server = {
  pair: defineAction({
    accept: 'form',
    input: z.object({
      wineText: z.string().trim().min(2).max(500),
    }),
    handler: async ({ wineText }) => {
      try {
        return await generatePairings({ freeText: wineText });
      } catch (err) {
        console.error('[paircraft] action.pair failed:', err);
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Could not generate pairings. Try again.',
        });
      }
    },
  }),
};
