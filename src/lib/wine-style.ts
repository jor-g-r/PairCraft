import type { CollectionEntry } from 'astro:content';

type Wine = CollectionEntry<'wines'>['data'];

export type WineStyleBody = 'light' | 'medium' | 'full';
export type WineStyleBand = 'low' | 'medium' | 'high';
export type WineStyleSweetness = 'dry' | 'off-dry' | 'sweet';
export type WineStyleTannin = 'soft' | 'medium' | 'firm';

export interface WineStyleRequest {
  color: Wine['color'];
  body: WineStyleBody;
  sweetness?: WineStyleSweetness;
  acidity?: WineStyleBand;
  tannin?: WineStyleTannin;
}

export interface WineStyleCandidate {
  id: string;
  data: Pick<Wine, 'name' | 'color' | 'markets' | 'sensoryProfile'>;
}

const BODY_ORDER: Record<WineStyleBody, number> = { light: 0, medium: 1, full: 2 };
const BAND_ORDER: Record<WineStyleBand, number> = { low: 0, medium: 1, high: 2 };
const SWEETNESS_ORDER: Record<WineStyleSweetness, number> = { dry: 0, 'off-dry': 1, sweet: 2 };
const TANNIN_ORDER: Record<WineStyleTannin, number> = { soft: 0, medium: 1, firm: 2 };

function bodyBand(value: number): WineStyleBody {
  return value <= 2 ? 'light' : value === 3 ? 'medium' : 'full';
}

function profileBand(value: number): WineStyleBand {
  return value <= 2 ? 'low' : value === 3 ? 'medium' : 'high';
}

function sweetnessBand(value: number): WineStyleSweetness {
  return value <= 1 ? 'dry' : value <= 3 ? 'off-dry' : 'sweet';
}

function tanninBand(value: number): WineStyleTannin {
  return value <= 1 ? 'soft' : value <= 3 ? 'medium' : 'firm';
}

function distance(actual: number, expected: number): number {
  return Math.abs(actual - expected);
}

export function rankWineStyleExamples(
  request: WineStyleRequest,
  wines: WineStyleCandidate[],
  market: string,
  limit = 3,
): string[] {
  return wines
    .filter(({ data }) => data.color === request.color && data.markets.includes(market))
    .map((wine) => {
      const profile = wine.data.sensoryProfile;
      const bodyDistance = distance(BODY_ORDER[bodyBand(profile.body)], BODY_ORDER[request.body]);
      const acidityDistance = request.acidity
        ? distance(BAND_ORDER[profileBand(profile.acidity)], BAND_ORDER[request.acidity])
        : 0;
      const sweetnessDistance = request.sweetness
        ? distance(SWEETNESS_ORDER[sweetnessBand(profile.sweetness)], SWEETNESS_ORDER[request.sweetness])
        : 0;
      const tanninDistance = request.tannin
        ? distance(TANNIN_ORDER[tanninBand(profile.tannin)], TANNIN_ORDER[request.tannin])
        : 0;

      return {
        id: wine.id,
        name: wine.data.name,
        distance: bodyDistance * 2 + acidityDistance * 2 + sweetnessDistance + tanninDistance,
      };
    })
    .sort((a, b) => a.distance - b.distance || a.name.localeCompare(b.name))
    .slice(0, Math.max(0, limit))
    .map(({ id }) => id);
}
