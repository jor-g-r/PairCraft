import type { ImageMetadata } from 'astro';

interface RegionSourceMeta {
  alt?: string;
  creditLine?: string;
}

export interface RegionImage {
  slug: string;
  image: ImageMetadata;
  alt?: string;
  creditLine?: string;
}

// Provenance (alt text, CC credit lines) is read from the sibling
// .source.json files so the photos' metadata stays single-sourced.
const images = import.meta.glob<{ default: ImageMetadata }>('../assets/regions/*.webp', { eager: true });
const sources = import.meta.glob<{ default: RegionSourceMeta }>('../assets/regions/*.source.json', { eager: true });

const bySlug = new Map<string, RegionImage>();

for (const [path, mod] of Object.entries(images)) {
  const slug = path.split('/').pop()?.replace(/\.webp$/, '') ?? '';
  if (!slug) continue;
  const meta = sources[path.replace(/\.webp$/, '.source.json')]?.default;
  bySlug.set(slug, { slug, image: mod.default, alt: meta?.alt, creditLine: meta?.creditLine });
}

export function regionImage(slug: string | null | undefined): RegionImage | undefined {
  return slug ? bySlug.get(slug) : undefined;
}
