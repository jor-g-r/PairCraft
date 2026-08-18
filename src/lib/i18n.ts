export type Locale = 'en' | 'es';

export const DEFAULT_LOCALE: Locale = 'en';

export const UI_STRINGS: Record<string, Record<Locale, string>> = {
  // Layout
  'site.tagline': { en: 'Drink this with that.', es: 'Bebe esto con aquello.' },
  'site.builtBy': { en: 'Built by', es: 'Hecho por' },

  // Home
  'home.searchLabel': {
    en: 'Search wines, grapes, dishes, or regions',
    es: 'Busca vinos, uvas, platos o regiones',
  },
  'home.searchPlaceholder': {
    en: 'Type a wine, dish, or grape. We do the rest.',
    es: 'Escribe un vino, plato u uva. Nosotros hacemos el resto.',
  },
  'home.try': { en: 'Try:', es: 'Prueba:' },
  'home.orBrowse': { en: 'or browse', es: 'o explora' },
  'home.marketLabel': { en: 'Showing wines available in', es: 'Mostrando vinos disponibles en' },
  'home.origin': { en: 'Origin', es: 'Origen' },
  'home.filterOrigin': { en: 'Filter by origin', es: 'Filtrar por origen' },
  'home.all': { en: 'All', es: 'Todos' },
  'home.noWinesOrigin': { en: 'No wines from this origin yet.', es: 'Aún no hay vinos de este origen.' },
  'home.noBottles': { en: 'No bottles curated for', es: 'Aún no hay botellas curadas para' },
  'home.noBottlesFallback': {
    en: "yet — start from a grape that's widely poured here:",
    es: 'aún — empieza por una uva que se sirve mucho aquí:',
  },
  'home.searchTypeWine': { en: 'wine', es: 'vino' },
  'home.searchTypeGrape': { en: 'grape', es: 'uva' },
  'home.searchTypeDish': { en: 'dish', es: 'plato' },
  'home.searchTypeRegion': { en: 'region', es: 'región' },

  // Wine page
  'wine.sensoryProfile': { en: 'Sensory profile', es: 'Perfil sensorial' },
  'wine.sweetness': { en: 'Sweetness', es: 'Dulzura' },
  'wine.acidity': { en: 'Acidity', es: 'Acidez' },
  'wine.tannin': { en: 'Tannin', es: 'Tanino' },
  'wine.body': { en: 'Body', es: 'Cuerpo' },
  'wine.primaryNotes': { en: 'Primary notes', es: 'Notas primarias' },
  'wine.secondaryNotes': { en: 'Secondary notes', es: 'Notas secundarias' },
  'wine.tertiaryNotes': { en: 'Tertiary notes', es: 'Notas terciarias' },
  'wine.teachingNote': { en: 'Teaching note', es: 'Nota didáctica' },
  'wine.whereToFind': { en: 'Where to find it', es: 'Dónde encontrarlo' },
  'wine.viewListing': { en: 'View listing', es: 'Ver ficha' },
  'wine.colour': { en: 'Colour', es: 'Color' },
  'wine.grapes': { en: 'Grapes', es: 'Uvas' },
  'wine.quickHints': { en: 'Quick hints', es: 'Consejos rápidos' },
  'wine.pairings': { en: 'Pairings', es: 'Maridajes' },
  'wine.noDishes': { en: 'No matching dishes seeded yet.', es: 'Aún no hay platos emparejados.' },
  'wine.outOf5': { en: 'out of 5', es: 'de 5' },
  'wine.landscape': { en: 'landscape', es: 'paisaje' },

  // Grape page
  'grape.grape': { en: 'grape', es: 'uva' },
  'grape.alsoCalled': { en: 'Also called:', es: 'También llamada:' },
  'grape.signatureRegions': { en: 'Signature regions', es: 'Regiones emblemáticas' },
  'grape.wines': { en: 'Wines', es: 'Vinos' },
  'grape.noWines': { en: 'No wines yet.', es: 'Aún no hay vinos.' },

  // Region page
  'region.signatureGrapes': { en: 'Signature grapes', es: 'Uvas emblemáticas' },
  'region.wines': { en: 'Wines', es: 'Vinos' },
  'region.noWines': { en: 'No wines yet.', es: 'Aún no hay vinos.' },

  // Dish page
  'dish.intensity': { en: 'intensity', es: 'intensidad' },
  'dish.pairingLogic': { en: 'The pairing logic', es: 'La lógica del maridaje' },
  'dish.quickHints': { en: 'Quick hints', es: 'Consejos rápidos' },
  'dish.winesForDish': { en: 'Wines for this dish', es: 'Vinos para este plato' },
  'dish.noWines': { en: 'No wines pair well yet.', es: 'Aún no hay vinos que mariden bien.' },
  'dish.betterChoices': { en: 'Better choices elsewhere', es: 'Mejores opciones en otros lados' },

  // Tier labels
  'tier.decisive': { en: 'Decisive match', es: 'Maridaje decisivo' },
  'tier.worth-trying': { en: 'Worth trying', es: 'Vale la pena probar' },
  'tier.risky': { en: 'Risky bridge', es: 'Puente arriesgado' },
  'tier.skip': { en: 'Skip', es: 'Evitar' },

  // Mode labels
  'mode.harmony': { en: 'by Harmony', es: 'por Armonía' },
  'mode.contrast': { en: 'by Contrast', es: 'por Contraste' },
  'mode.enhancement': { en: 'by Enhancement', es: 'por Realce' },
};

export function t(key: string, locale: Locale = DEFAULT_LOCALE): string {
  return UI_STRINGS[key]?.[locale] ?? UI_STRINGS[key]?.[DEFAULT_LOCALE] ?? key;
}
