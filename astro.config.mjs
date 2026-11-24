// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://pair-craft.vercel.app',
  integrations: [mdx()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});