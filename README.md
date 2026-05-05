# Paircraft

Maridaje vino-comida con explicaciones cortas y opinionadas, al estilo *Guía del Vino* de Hugh Johnson.

## Stack

- [Astro](https://astro.build/) — mobile-first PWA
- [Tailwind CSS v4](https://tailwindcss.com/) — CSS-first config
- [@vite-pwa/astro](https://vite-pwa-org.netlify.app/frameworks/astro.html) — manifest + service worker
- [Bun](https://bun.sh/) — runtime y package manager

## Dev

```bash
bun install
bun run dev
```

Build de producción: `bun run build`. Preview: `bun run preview`.

## Deploy

Vercel via GitHub integration (zero-config). PR a `main` → preview. Push a `main` → producción.
