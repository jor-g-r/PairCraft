import { describe, expect, test } from 'bun:test';
import { buildSearchIndex, searchEntries } from './home-search';

const index = buildSearchIndex({
  wines: [
    { id: 'piccini-chianti-riserva', data: { name: 'Piccini Chianti Riserva', color: 'red', region: { id: 'tuscany' } } },
    { id: 'castillo-de-molina-sauvignon-blanc', data: { name: 'Castillo de Molina Sauvignon Blanc Reserva', color: 'white', region: { id: 'central-valley' } } },
  ],
  grapes: [
    { id: 'sangiovese', data: { name: 'Sangiovese' } },
    { id: 'white-blend', data: { name: 'White Blend', nameEs: 'Mezcla blanca' } },
  ],
  regions: [
    { id: 'tuscany', data: { name: 'Tuscany', nameEs: 'Toscana', country: 'Italy' } },
    { id: 'central-valley', data: { name: 'Central Valley', nameEs: 'Valle Central', country: 'Chile' } },
    { id: 'rioja', data: { name: 'Rioja', country: 'Spain' } },
  ],
  dishes: [
    { id: 'aceitunas', data: { name: 'Marinated olives', nameEs: 'Aceitunas aliñadas' } },
    { id: 'fried-calamari', data: { name: 'Fried calamari', nameEs: 'Calamares fritos' } },
    { id: 'oysters-raw', data: { name: 'Oysters on the half-shell', nameEs: 'Ostras en media concha' } },
    { id: 'queso-azul', data: { name: 'Blue cheese', nameEs: 'Queso azul' } },
    { id: 'empanadas-de-carne', data: { name: 'Beef empanadas', nameEs: 'Empanadas de carne' } },
    { id: 'ceviche', data: { name: 'Ceviche' } },
  ],
});

const names = (query: string, locale: 'en' | 'es') => searchEntries(index, query, locale).map(({ name }) => name);

describe('home search in Spanish', () => {
  test('finds entities by their Spanish names', () => {
    expect(names('aceitunas', 'es')).toEqual(['Aceitunas aliñadas']);
    expect(names('calamares', 'es')).toEqual(['Calamares fritos']);
    expect(names('ostras', 'es')).toEqual(['Ostras en media concha']);
    expect(names('queso azul', 'es')).toEqual(['Queso azul']);
    expect(names('valle central', 'es')).toEqual(['Valle Central', 'Castillo de Molina Sauvignon Blanc Reserva']);
  });

  test('shows Spanish names and Spanish meta, with English fallback', () => {
    expect(names('empanadas', 'es')).toEqual(['Empanadas de carne']);
    expect(names('ceviche', 'es')).toEqual(['Ceviche']);
    expect(searchEntries(index, 'toscana', 'es')).toEqual([
      // A name match outranks the wine that only matches through its region.
      { id: 'tuscany', type: 'region', name: 'Toscana', meta: 'Italia', color: undefined },
      { id: 'piccini-chianti-riserva', type: 'wine', name: 'Piccini Chianti Riserva', meta: 'Toscana', color: 'red' },
    ]);
    expect(names('españa', 'es')).toEqual(['Rioja']);
  });

  test('ignores accents and still accepts the English name', () => {
    expect(names('ACEITUNAS ALINADAS', 'es')).toEqual(['Aceitunas aliñadas']);
    expect(names('tuscany', 'es')).toEqual(['Toscana', 'Piccini Chianti Riserva']);
  });

  test('ranks a match in the visitor’s language above one in the other language', () => {
    const mixed = buildSearchIndex({
      wines: [],
      regions: [],
      grapes: [{ id: 'grape', data: { name: 'Rosa', nameEs: 'Uva' } }],
      dishes: [{ id: 'dish', data: { name: 'Rose petals', nameEs: 'Rosa' } }],
    });
    // Grapes normally rank above dishes; the language match outweighs that.
    expect(searchEntries(mixed, 'rosa', 'es').map(({ id }) => id)).toEqual(['dish', 'grape']);
    expect(searchEntries(mixed, 'rosa', 'en').map(({ id }) => id)).toEqual(['grape', 'dish']);
  });
});

describe('home search in English', () => {
  test('keeps English names and meta', () => {
    expect(names('empanadas', 'en')).toEqual(['Beef empanadas']);
    expect(searchEntries(index, 'tuscany', 'en').map(({ name, meta }) => [name, meta])).toEqual([
      ['Tuscany', 'Italy'],
      ['Piccini Chianti Riserva', 'Tuscany'],
    ]);
  });

  test('matches a Spanish name but displays the English one', () => {
    expect(names('queso azul', 'en')).toEqual(['Blue cheese']);
  });

  test('returns nothing for blank queries and caps the list', () => {
    expect(searchEntries(index, '   ', 'en')).toEqual([]);
    expect(searchEntries(index, 'a', 'es', 3)).toHaveLength(3);
  });
});
