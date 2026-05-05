# Paircraft

Wine and food pairings with short, opinionated explanations — pocket guide style, inspired by Hugh Johnson's *Pocket Wine Book*.

## Stack

- [Astro](https://astro.build/) — mobile-first PWA
- [Tailwind CSS v4](https://tailwindcss.com/) — CSS-first config
- [@vite-pwa/astro](https://vite-pwa-org.netlify.app/frameworks/astro.html) — manifest + service worker
- [Bun](https://bun.sh/) — runtime and package manager

## Dev

```bash
bun install
bun run dev
```

Production build: `bun run build`. Preview: `bun run preview`.

## Deploy

Vercel via GitHub integration (zero-config). PR to `main` → preview. Push to `main` → production.
