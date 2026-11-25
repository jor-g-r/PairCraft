// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://pair-craft.vercel.app',
  // Astro 7 defaults to 'jsx', which drops the space between inline elements split across lines.
  compressHTML: true,
  integrations: [mdx()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});