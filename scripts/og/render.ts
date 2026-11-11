// Renders the link preview card (public/og.png, 1200x630) that LinkedIn and
// other sites show when someone shares a Paircraft URL.
// Run from the repo root: bun scripts/og/render.ts
// Uses the site's own fonts (node_modules/@fontsource-variable), the brand mark
// (public/favicon.svg) and the home headline, so edit card.html to change the look.
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dir, '../..');
const chrome = process.env.CHROME_BIN ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const out = join(root, 'public/og.png');

// The mark's second path is dark (#282828); on the dark card it takes the
// light ink, the same swap the header makes in dark mode.
const mark = readFileSync(join(root, 'public/favicon.svg'), 'utf8').replace('fill="#282828"', 'fill="#fafafa"');
const fonts = pathToFileURL(join(root, 'node_modules/@fontsource-variable')).href;
const html = readFileSync(join(import.meta.dir, 'card.html'), 'utf8')
  .replaceAll('{{FONTS}}', fonts)
  .replaceAll('{{MARK}}', mark);

const page = join(mkdtempSync(join(tmpdir(), 'paircraft-og-')), 'card.html');
writeFileSync(page, html);

const run = Bun.spawnSync([
  chrome,
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  '--window-size=1200,630',
  '--virtual-time-budget=3000',
  `--screenshot=${out}`,
  pathToFileURL(page).href,
]);
if (run.exitCode !== 0) {
  console.error(run.stderr.toString());
  process.exit(run.exitCode ?? 1);
}
console.log(`Wrote ${out}`);
