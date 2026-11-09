import { countryEs, type Locale } from './i18n';

export type SearchType = 'wine' | 'grape' | 'region' | 'dish';

/** One row of the home search index. Spanish fields fall back to English. */
export interface SearchEntry {
  id: string;
  type: SearchType;
  name: string;
  nameEs?: string;
  meta?: string;
  metaEs?: string;
  /** Wine colour, only on wine rows (the dropdown draws a glass). */
  color?: string;
}

/** A row resolved to the visitor's language, ready to render. */
export interface SearchHit {
  id: string;
  type: SearchType;
  name: string;
  meta?: string;
  color?: string;
}

interface Named {
  name: string;
  nameEs?: string;
}

export interface SearchSources {
  wines: { id: string; data: Named & { color: string; region: { id: string } } }[];
  grapes: { id: string; data: Named }[];
  regions: { id: string; data: Named & { country: string } }[];
  dishes: { id: string; data: Named }[];
}

export function buildSearchIndex({ wines, grapes, regions, dishes }: SearchSources): SearchEntry[] {
  const regionById = new Map(regions.map((region) => [region.id, region.data]));
  return [
    ...wines.map((wine) => {
      const region = regionById.get(wine.data.region.id);
      return {
        id: wine.id,
        type: 'wine' as const,
        name: wine.data.name,
        nameEs: wine.data.nameEs,
        meta: region?.name,
        metaEs: region?.nameEs,
        color: wine.data.color,
      };
    }),
    ...grapes.map((grape) => ({ id: grape.id, type: 'grape' as const, name: grape.data.name, nameEs: grape.data.nameEs })),
    ...regions.map((region) => ({
      id: region.id,
      type: 'region' as const,
      name: region.data.name,
      nameEs: region.data.nameEs,
      meta: region.data.country,
      metaEs: countryEs(region.data.country),
    })),
    ...dishes.map((dish) => ({ id: dish.id, type: 'dish' as const, name: dish.data.name, nameEs: dish.data.nameEs })),
  ];
}

export function normalizeSearch(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function localizeEntry(entry: SearchEntry, locale: Locale): SearchHit {
  const es = locale === 'es';
  return {
    id: entry.id,
    type: entry.type,
    name: (es && entry.nameEs) || entry.name,
    meta: (es && entry.metaEs) || entry.meta,
    color: entry.color,
  };
}

const TYPE_RANK: Record<SearchType, number> = { wine: 0, grape: 1, dish: 2, region: 3 };

// Both languages match, so "Tuscany" still finds Toscana with the site in Spanish;
// the visitor's own language ranks first and is what the dropdown shows.
function score(entry: SearchEntry, locale: Locale, q: string): number {
  const [own, other] = (locale === 'es' ? [entry.nameEs || entry.name, entry.name] : [entry.name, entry.nameEs ?? '']).map(normalizeSearch);
  if (own.startsWith(q)) return 0;
  if (other.startsWith(q)) return 1;
  if (own.includes(q)) return 2;
  if (other.includes(q)) return 3;
  if ([entry.meta, entry.metaEs].some((meta) => meta && normalizeSearch(meta).includes(q))) return 4;
  return -1;
}

export function searchEntries(entries: SearchEntry[], query: string, locale: Locale, limit = 8): SearchHit[] {
  const q = normalizeSearch(query.trim());
  if (!q) return [];
  return entries
    .map((entry) => ({ hit: localizeEntry(entry, locale), score: score(entry, locale, q) }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => a.score - b.score || TYPE_RANK[a.hit.type] - TYPE_RANK[b.hit.type] || a.hit.name.localeCompare(b.hit.name))
    .slice(0, limit)
    .map(({ hit }) => hit);
}
