export interface PhotoSource {
  author?: string;
  license?: string;
  source?: string;
  creditLine?: string;
}

/**
 * The quiet, unlinked credit shown on a photograph. A sidecar's own creditLine
 * (required by CC BY-SA) wins; Unsplash photos credit the author when recorded.
 * Photos without recorded provenance get no credit rather than a guessed one.
 */
export function photoCredit(photo: PhotoSource | undefined): string | undefined {
  if (!photo) return undefined;
  if (photo.creditLine) return photo.creditLine;
  if (!/unsplash/i.test(`${photo.license ?? ''} ${photo.source ?? ''}`)) return undefined;
  const author = photo.author?.replace(/\s*\(.*\)\s*$/, '').trim();
  return author && !/^(unknown|unrecorded)$/i.test(author) ? `${author} / Unsplash` : 'Unsplash';
}
