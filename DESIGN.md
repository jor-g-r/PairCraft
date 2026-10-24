---
name: Paircraft
description: A wine-first pocket guide with photo-led catalog heroes, Playfair names, light Open Sans facts and restrained wine-red emphasis.
colors:
  accent: "#961623"
  paper: "#e9e9e7"
  surface: "#ffffff"
  ink: "#171717"
  muted: "#4a4a4a"
  rule: "#d1d1ce"
  on-accent: "#ffffff"
  chrome: "#ffffff"
  on-photo: "#ffffff"
  hero-accent: "#bd0000"
  accent-dark: "#961623"
  paper-dark: "#0e0e0e"
  surface-dark: "#1e1e1e"
  ink-dark: "#fafafa"
  muted-dark: "#bdbdbd"
  rule-dark: "#3a3a3a"
  chrome-dark: "#1e1e1e"
  wine-gold: "#e8d97e"
  wine-rose: "#e8a4a8"
  wine-orange: "#cf7e2a"
typography:
  hero:
    fontFamily: '"Playfair Display Variable", ui-serif, Georgia, serif'
    fontSize: "2.5rem"
    fontWeight: 400
    lineHeight: 1.2
  display:
    fontFamily: '"Playfair Display Variable", ui-serif, Georgia, serif'
    fontSize: "clamp(2.5rem, 7vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: '"Playfair Display Variable", ui-serif, Georgia, serif'
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  headline-sm:
    fontFamily: '"Playfair Display Variable", ui-serif, Georgia, serif'
    fontSize: "3.75rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  section:
    fontFamily: '"Playfair Display Variable", ui-serif, Georgia, serif'
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: "2rem"
  section-sm:
    fontFamily: '"Playfair Display Variable", ui-serif, Georgia, serif'
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: "2.25rem"
  title:
    fontFamily: '"Playfair Display Variable", ui-serif, Georgia, serif'
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: "1.75rem"
  pairing-prose:
    fontFamily: '"Playfair Display Variable", ui-serif, Georgia, serif'
    fontStyle: italic
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.375
  body:
    fontFamily: '"Open Sans Variable", ui-sans-serif, system-ui, sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: '"Open Sans Variable", ui-sans-serif, system-ui, sans-serif'
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: "1.25rem"
  tier:
    fontFamily: '"Open Sans Variable", ui-sans-serif, system-ui, sans-serif'
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: "1rem"
    letterSpacing: "0.025em"
rounded:
  lg: "0.5rem"
  xl: "0.75rem"
  full: "calc(infinity * 1px)"
  oval: "50%"
spacing:
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.25rem"
  "6": "1.5rem"
  "8": "2rem"
  "10": "2.5rem"
  "12": "3rem"
  "16": "4rem"
  "20": "5rem"
components:
  catalog-hero:
    backgroundColor: "#000000"
    textColor: "{colors.on-photo}"
    rounded: "0"
    padding: "2.45rem 1.15rem 1.3rem"
  hero-field:
    textColor: "{colors.on-photo}"
    rounded: "5px"
    padding: "0 0.75rem 0 2.45rem"
    height: "2.6rem"
  type-pill:
    textColor: "{colors.ink}"
    typography: "{typography.tier}"
    rounded: "{rounded.full}"
    padding: "0 0.875rem"
    height: "1.6rem"
  type-pill-selected:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.full}"
  wine-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "0"
    padding: "1.25rem 1.15rem 1.15rem"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0.625rem 1.25rem"
  editorial-link:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "0.75rem 1rem"
  navigation:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.muted}"
  tier-decisive:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.tier}"
    rounded: "{rounded.full}"
    padding: "0.125rem 0.625rem"
  wine-card:
    textColor: "{colors.ink}"
    padding: "1.5rem 0"
  property:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.oval}"
    padding: "1.25rem 1rem"
  property-featured:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.xl}"
    padding: "1.25rem 1rem"
  theme-toggle:
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
  sensory-track:
    backgroundColor: "{colors.rule}"
    height: "1px"
  section-heading:
    textColor: "{colors.ink}"
    typography: "{typography.section}"
  photo-band:
    rounded: "{rounded.xl}"
---

# Design System: Paircraft

## Overview

**Creative North Star: "The Wine Pocket Guide"**

Paircraft reads like a concise, opinionated pocket guide: Playfair Display carries wine identity and editorial prose; Open Sans (mostly Light) carries controls and facts; Alegreya survives only in the wordmark. The 2026-10-23 dashboard comp (the founder's Figma file, mobile-first) sets the catalog language: a square-cornered photograph darkened to 35% brightness carries a centered Playfair headline with one red word, white outline fields, and outline pills below it. Dark is the reference theme. Light ("stone", chosen 2026-10-23 from three previews: paper, stone, veil) mirrors it: a `#e9e9e7` stone ground with white header, tiles and insets on it, the same dark photo heroes, and the same `#961623` red. Editorial modularity takes cues from Kinfolk and The Modern House; Wine Folly informs wine-reference clarity and bottle prominence without borrowing its assets or layout wholesale.

Density follows the task. Catalogs use scannable ruled rows, while wine pages give identity and an occasion choice room to breathe before sensory detail. Meal and snack remain distinct through wine, dish and free-text food lookup. `/wine-style` is a compact profile finder: body and color anchor the search; other recorded axes refine it; close matches link to exact catalogue examples and their reviewed pairings. EN/ES text and incomplete records must fit without invented copy or measurements.

**Key Characteristics:**
- Wine-red actions and verdicts on neutral, theme-aware ground.
- Photo-led catalog heroes (`CatalogHero.astro`) on home, `/wines`, `/dishes` and `/pair`.
- Playfair identity and editorial prose; light Open Sans controls and facts.
- Ruled lists, oval properties, thin independent sensory tracks.
- Editorial scene photographs with recorded provenance; never the specific bottle.
- Mobile-first reading with explicit navigation and honest missing-data states.

Recorded from the current working-tree implementation on 2026-10-14 and updated for the 2026-10-23 dashboard comp; not from a production deployment or a real-device audit. Evidence: `src/styles/global.css`, `src/layouts/Base.astro`, `src/components/`, `/wine-style`, wine and food occasion flows, entity templates, `src/lib/region-images.ts`, and scene imagery with `*.source.json` provenance sidecars. `PRODUCT.md` and `.impeccable/surfaces/paircraft.md` establish product direction; source code establishes implemented values. The sidecar's illustrative tonal ramps are panel aids, not additional application colors.

## Colors

One wine-red accent carries emphasis; the rest is neutral except the small, literal wine-color fills in SVG glass illustrations. Frontmatter owns palette values. Unsuffixed semantic entries describe light mode; `-dark` entries are the corresponding dark overrides of the same CSS variables, not new runtime variable names.

### Primary

- **Wine red — `accent` / `accent-dark`:** primary actions, Decisive match badges, the featured serving panel, selected language segment and selected filter pills. Since 2026-10-23 both themes use the comp's `#961623` (light previously used `#7b2d2f`).
- **White on wine red — `on-accent`:** remains white in both themes. Use this role for accent-filled controls; the legacy `white` utility changes to charcoal in dark mode.

### Neutral

| Semantic role | Light token | Dark token | Application |
| --- | --- | --- | --- |
| Page ground | `paper` | `paper-dark` | Body, header, fields |
| Inset surface | `surface` | `surface-dark` | Oval properties, availability panel, theme-button hover |
| Main text | `ink` | `ink-dark` | Headings, controls, track markers, focus outlines |
| Supporting text | `muted` | `muted-dark` | Descriptions, metadata, placeholders |
| Hairline | `rule` | `rule-dark` | Row separators, field borders, heading rules |

Since 2026-10-23 surfaces are lighter than the page ground in both themes: dark has page `#0e0e0e` under `#1e1e1e` header (`chrome`), tiles and insets; light has page `#e9e9e7` under white. Tiles take their elevation from `--tile-shadow` (`.tile-shadow`), soft in light and denser in dark. `on-photo` is a white that the dark theme never remaps; use it for anything set on a darkened photograph, because the legacy `white` utility turns charcoal in dark mode. `hero-accent` (`#bd0000`) is the red word in a hero headline; the comp's `#b50000` was nudged to reach 3:1 on the darkened photograph. Existing entity templates also use Tailwind neutrals: `global.css` remaps `white` and `neutral-50` through `neutral-900` in dark mode. Worth trying retains the `neutral-100`/`neutral-900` pairing; Risky bridge retains a `neutral-300` outline and `neutral-700` text. These utility mappings are distinct from the semantic palette; prefer semantic roles for new surfaces.

The `wine-gold`, `wine-rose` and `wine-orange` entries are categorical SVG liquid fills, not secondary action palettes. Red wine uses the accent; sparkling wine uses the gold fill in a flute. Outlines inherit text color.

**The One Accent Rule.** Use wine red for decisive emphasis and selected states; use neutral text and rules for ordinary navigation and reading.

## Typography

**Display Font:** self-hosted Playfair Display Variable (upright and italic), with ui-serif / Georgia / serif fallbacks.

**Body Font:** self-hosted Open Sans Variable (upright and italic, 300–800), with ui-sans-serif / system-ui / sans-serif fallbacks. Controls and labels share this family; there is no separate mono face.

**Wordmark:** Alegreya Variable (`font-brand`), only for "Paircraft" in the header.

**Hero type** (measured from the comp at 375px): headline Playfair 400 at 2.5rem / 1.2, rising to 3.5rem at `sm` and 4.25rem at `lg`; intro Open Sans Light 0.875rem; secondary hero text, labels and the "Type" label Open Sans Light 0.75rem; pills uppercase Light 0.6875rem. Search and select stay at 1rem so iOS does not zoom on focus (the comp shows ~0.75rem), and the style-finder link stays at 0.75rem (the comp shows ~0.5rem).

The serif carries wine identity and opinion; the sans carries operation and evidence. This is an observed Tailwind size ladder plus a fluid wine title, not a newly imposed modular ratio.

### Hierarchy

- **Display:** `display` is the fluid wine-detail title. A recorded vintage is appended at regular weight; no vintage is supplied when absent.
- **Headline:** `headline` becomes `headline-sm` at the small breakpoint. Used for catalog, dish, pairing-input and About titles; balanced wrapping and tight tracking are shared.
- **Section:** `section` becomes `section-sm` at the small breakpoint and carries a trailing horizontal rule. Pairing-mode headings instead use italic Alegreya (1.5rem) without that rule.
- **Title:** `title` covers property values and dish names in pairing rows. Catalog wine titles are larger (1.5rem), semibold, with tight line-height (1.25).
- **Editorial prose:** `pairing-prose` is italic in `DishPairing.astro`. Wine taglines use italic Alegreya (1.25rem, rising to 1.5rem at the small breakpoint) with relaxed line-height (1.625).
- **Body:** `body` describes relaxed reading copy. Ordinary unmodified body text uses line-height (1.5); pairing descriptions use smaller Source Sans 3 (0.875rem) with relaxed line-height. Long copy commonly stops at the prose measure (65ch).
- **Label:** `label` describes actions. Fields remain at readable base size (1rem); metadata and tier chips use smaller text (0.75rem). Property terms are functional uppercase labels (0.75rem, tracking 0.05em), not decorative section kickers.

**The Two Voices Rule.** Set names and concise editorial judgments in Playfair Display; set controls, supporting descriptions and factual labels in Open Sans.

## Layout

- **Shared frame:** centered maximum width (64rem), mobile side padding (1.25rem), increasing to (2rem) at `sm`. Main vertical padding is (2rem), increasing to (3.5rem) at `md`. Pairing-input and dish pages narrow the frame to (48rem); wine identity and sensory sections also cap at (48rem).
- **Breakpoints:** `sm` (40rem), `md` (48rem), `lg` (64rem). These are Tailwind's existing breakpoints, not device classifications.
- **Rhythm:** a quarter-rem base with frequent (0.5–1.5rem) internal gaps, (2rem) content introductions, and (3–5rem) section separation. The footer begins after (6rem) of separation.
- **Header:** sticky, opaque, bordered and two-row at all breakpoints. Brand and theme/language controls occupy the first row; four navigation links occupy the second. Mobile navigation distributes links across the width; from `sm` it aligns left with (2rem) gaps. Header stacking level is (30); page scroll padding is (9rem).
- **Wine detail:** a spec-sheet intro chosen in a live Impeccable round (2026-10-23): left-aligned glass, Playfair 400 name (clamp 2.35–4rem), italic Playfair tagline, origin/grape links, and the two occasions as equal uppercase halves of one `surface` bar. Below, "On the sheet" lists serve-at, body, tannin and finish (or primary notes) as ruled `.spec-list` rows, followed by independent sweetness and acidity tracks; beside it from `md` (below on phones) sits `WhereToBuy.astro`.
- **Pairing feeds:** chosen as "tiles" in a live Impeccable round (2026-10-23). Meal and snack selectors are outline pills (the selected one filled red) that persist as links. Every pairing is a `surface` tile (`DishPairing.astro`, `.tile-shadow`): tier chip, Playfair 400 dish name, italic Playfair sentence; snack and board lists run three tiles across at `lg`, and a board component without curated prose is a tile reading "Better with another wine". Meal recommendations retain tri-modal ruled groups, but each pairing appears once, under its dominant mode (the mode with the most rule weight, `dominantMode` in `src/lib/tier.ts`); on desktop the grid has one column per non-empty group, and a single group keeps a reading measure. Pairing rows show tier, food name and the explanation only; the food description lives on the food page. Dish pages mirror the wine page since 2026-10-23 (picked in a live Impeccable round): Playfair 400 name, Light description, a `.spec-list` of category, weight and intensity, food tags as `.tag-pill`s, the pairing logic in a `surface` tile, quick hints as ink-outlined pills, and the wines as tiles grouped by dominant mode (tier chip, wine name, sentence; the wine's tagline lives on the wine page). Boards hide the cuisine-context line and show their components as tiles; "Better choices elsewhere" is a row of muted pills. Snack recommendations are a single food-first list ordered by qualitative tier, avoiding duplicate bites across rule modes. A guided board appears only when at least one component has curated pairing prose; every component retains its own tier and explanation. A component without a curated pairing reads "Better with another wine" and links to its food page, which lists only the wines that do work; it is never averaged.
- **Catalog heroes:** home, `/wines`, `/dishes` and `/pair` open with `CatalogHero.astro`: a square photo card (2:3 on phones, at least 32–36rem tall from `sm`), the photograph under a 65% black overlay, a centered headline with one `hero-accent` word, a search slot, and a foot row (market selector on home and `/wines`, "Find a pairing" on `/dishes`, the style-finder link on `/pair`). Filter pills follow under a small Light label: Type (All / Red / White / Rosé / Sparkling, only the types the feed carries) on home and `/wines`, Occasion on `/dishes`. On phones the Type row scrolls sideways rather than wrapping. `/pair` puts the meal/snack pills, the field and the submit inside the card; familiar foods follow as outline pills.
- **Catalogs and finders:** `/wines` leads with name search and the market selector inside its hero; Type pills replace the colour select, and the style filter lives in a native disclosure. Wine results use one / two / three columns at base / `sm` / `lg`. Dish results use one column then two at `sm`, with a separate occasion selector. `/wine-style` (picked as "sheet" in a live Impeccable round, 2026-10-23) sets its five descriptors as ruled rows under an ink rule: Light label left, the value as a borderless right-aligned Playfair `.sheet-select`; colour and body are required. Ranked examples follow as `WineCard` tiles, without a numeric fit score; results open with a one-line summary of the chosen descriptors, and each example carries its best reviewed meal and snack pairing. A grape page features the first bottle stocked in the visitor's market, ordered by the grape's own colour, then single-variety bottles, then the most widely stocked. Empty results remain explanatory text with an available next action.
- **About:** a photo spread chosen in a live Impeccable round (2026-10-23). On phones the 4:5 table photograph bleeds to the screen edges under the header, darkened by a bottom-up gradient, with the headline and its red word set on it; the lead, body and call to action follow, and the three pairing modes are a swipeable row of `surface` tiles. From `md` the photo sits sticky on the left and the text column on the right, with the modes stacked. The photograph is not bottle or regional evidence and no longer appears on home.
- **Editorial photo bands:** `/dishes` and `/pair` no longer close with a band; their hero carries the photograph (`dishes-hero`, `pair-table`). The `dishes-table` asset is retained but unused. Region pages carry a 21:9 region band after the header; wine pages close the "In the glass" section with a 21:9 "From <region>" band; grape pages carry a 3:1 strip labeled "From <region>", sourced from the first signature region with an image. The home's catalog divider is a plain hairline, not a labeled kicker. Since 2026-10-23 grape and region pages open with `EntityCover.astro` instead of a band or strip (picked in a live Impeccable round on the grape page and applied to regions): the region photograph fills a square-cornered cover (at least 20rem, 24rem from `md`) under a bottom-up black gradient, with the Playfair 400 name and italic tagline set on it and any required licence credit at the top right. Below come a `.spec-list` (grape: colour, origin, aliases; region: country), the region's climate in a `surface` tile, the body text at a reading measure, related grapes or regions as outline pills, and the wines as `WineCard` tiles. The grape page's market-picked featured bottle is a `surface` tile with a 4:3 bottle slot, another future sponsored surface.

`/wines` writes filter state to the query string, and the wine page's explicit “All wines” links (`data-catalog-return`) restore the last catalog query: the catalog saves its query to session storage (`pc_catalog_query`), and a page-load handler rewrites those links on every navigation. Wine-card titles open the wine record; two distinct text links enter meal or snack pairings directly.

## Elevation & Depth

Most content stays flat: hairlines, whitespace, typography and inset surfaces separate material. Oval property panels have no shadows. The sticky header is opaque rather than blurred. Home search is the narrow exception: its input has Tailwind's small ambient shadow, and its dropdown has the larger floating shadow. Exact shadow values live in the sidecar; this exception does not turn catalog or pairing rows into raised cards.

**The Flat Reading Rule.** Separate reading content with rules and tonal surfaces; reserve floating depth for the existing search affordance and its results overlay.

Motion is modest: action opacity and link colors use the default transition (150ms); the language indicator slides (200ms, ease-out). Astro supplies client navigation transitions. The reveal selector declares an opacity/transform transition (600ms), but both initial and visible states already show content with no displacement: no actual fade-up is currently implemented. Its reduced-motion rule removes that transition. Do not describe this as site-wide reduced-motion coverage.

## Shapes

Fields, the featured property and editorial images use the gently rounded `xl` radius. Actions, theme/language controls and badges use the `full` pill shape. Nonfeatured wine properties use true `oval` corners with a minimum height (8rem); they are a signature reading device, not a general card template. Legacy grape fallback cards use the smaller `lg` radius. Catalog and pairing rows remain rectangular and unboxed, separated by single-pixel rules. Sensory tracks are single-pixel lines with circular markers (0.625rem).

## Components

### Buttons and editorial links

The primary action is a compact wine-red pill: use the frontmatter's `button-primary` padding and colors, minimum height (2.75rem), semibold label and centered content. Hover reduces opacity to (0.9); disabled submission uses opacity (0.6) and a wait cursor. The secondary action is an underlined editorial link with the same minimum height, neutral rule-colored decoration and current-color decoration on hover. Native disclosures use text summaries, not additional primary buttons.

Global keyboard focus uses an ink outline (2px) offset by (4px). Preserve semantic buttons/anchors, associated field labels, visible focus and the skip-to-content link. Do not substitute a hover effect for focus.

### Inputs and feedback

The common field is full width, paper-filled, rule-bordered (1px) and softly rounded. Text and caret use ink; placeholders use muted. Catalog selects share this treatment and draw their own muted chevron (`select.field`, no native arrow); catalog search fields (/wines, /dishes) carry the home search's magnifier and a placeholder. Every `<summary>` replaces the native marker with a currentColor chevron that turns 180° when open (transition only without reduced motion). `/pair` uses a four-row, vertically resizable textarea with a visible label and a (3–300 character) constraint. Submission marks the form busy, disables and relabels the button, and announces status. Exact and related matches have distinct headings; related matches carry the qualification about sauce and cooking method. Successful results receive heading focus. Empty and failed requests use status copy, while familiar-dish links remain available. These are links into curated dishes, not generated wine verdicts.

### Navigation and preferences

The top navigation is Wines (`/wines`), Dishes (`/dishes`), Find a pairing (`/pair`) and About (`/about`). Active links use ink, an ink bottom rule (2px) and `aria-current="page"`; inactive links are muted and turn ink on hover. Wine/dish detail routes activate their parent catalog link. Labels are smaller on mobile (0.75rem) and increase at `sm` (0.875rem); each link has a minimum height (2.75rem).

The circular theme button uses a moon SVG and an accessible “Dark theme” label; `aria-pressed` expresses dark mode. The manual preference persists as `pc_theme` in a one-year cookie and local storage. Cookie wins over local storage; system preference is used when there is no explicit light/dark choice. An early head script applies the root `dark` class and browser theme color, and client navigation synchronizes the incoming document. A manual choice continues to win over subsequent system changes.

The EN/ES segmented pill has a wine-red sliding selection and white selected text, with pressed states on the two buttons. Its individual buttons are at least 2.75rem square, inside a padded border. `pc_lang` persists to cookie and local storage; switching reloads. Editorial fields fall back to English individually. Preserve room for longer Spanish labels.

### Tier chips

Decisive match is filled wine red with white text; Worth trying is neutral-filled; Risky bridge is outlined; Skip is muted text. All retain explicit text labels, small medium-weight type, pill geometry and no-wrap behavior. These are qualitative pairing verdicts, not numerical scores. Wine pairing groups omit Skip; dish pages collect such bottles under “Better choices elsewhere.”

### Catalog and pairing rows

`WineCard.astro` is the one wine card on home, `/wines` and `/wine-style`, chosen in a live Impeccable round on 2026-10-23 ("cellar tiles"): a square `surface` tile with the hero's soft shadow, an SVG glass (2.6rem), a Playfair 400 name (1.4rem) whose link stretches over the tile, a Light origin line, a Light tagline, an optional slot (on `/wine-style`, the bottle's best reviewed meal and snack pairing with tier chips), and two equal uppercase occasion halves split by a hairline ("For a meal" / "Para comer", "For a snack" / "Para picar") that fill wine red on hover. `.wine-tiles` lays them out one / two / three per row at base / `sm` / `lg`. Dish catalog rows use the same ruled reading model; pairing rows use slightly tighter vertical padding (1.25rem), a tier chip, food title and optional italic explanation; the food description lives on the food page. A wine-to-food link carries `?wine=<id>` so the food page can show a contextual return link when it finds that wine. `WineStyle` keeps candidate cards tied to specific catalogue wines and routes to that example's exact pairing feed.

### Editorial photo bands

`PhotoBand.astro` was retired on 2026-10-23. Photographs now live inside the surfaces that use them: `CatalogHero.astro` (home, `/wines`, `/dishes`, `/pair`), `EntityCover.astro` (grape and region pages), the About spread, and the wine page's "In the glass" cover, where the region photograph under a bottom-up gradient (85% to 15% black, picked in a live Impeccable round) carries the heading, the summary and a "From <region>" link to the region page. All are square-cornered with the soft photo shadow; licence credits sit small at the top right. `src/lib/region-images.ts` still resolves a region slug to its WebP and provenance sidecar, the single source of truth for alt text and credits.

Below that cover the wine page lists the teaching note, a `.spec-list` of colour and style, flavour notes as up to three columns (small uppercase label, Playfair 1.5rem notes), the optional tannin tracks, and quick hints as ink-outlined pills.

### Wine properties and sensory tracks

`PropertyCard.astro` and the oval panels were retired on 2026-10-23; the four properties are `.spec-list` rows (label left in Light Open Sans, value right in Playfair, a small Light line for °F or "Style guide").

`WhereToBuy.astro` is the bottle / where-to-buy module and the planned ad surface: a `surface` tile with a 4:3 bottle slot (the glass stands in), "Where to find it", the markets the bottle is sold in, and a full-width red CTA to the retailer listing, with the retailer named from the markets' retailer list ("View at Éxito"). If a placement is ever sold, the brand's cleared bottle photograph and a visible "Sponsored" label go in the slot; sponsorship never changes tiers or prose. It replaces the old bottom availability panel, which showed internal scout notes.

`SensoryDial.astro` is a read-only display, despite its name: visible label and value out of five, a fine rule, an ink fill and a dot. It is not an interactive range input. Sweetness and acidity are **independent values**; never put “sweet” and “sour” at opposite ends of one axis. The schema permits values from zero through five. Optional tannin axes reuse this presentation only when recorded. Sensory measurements are not pairing scores.

**The Recorded Facts Rule.** Show recorded values, label style-level guidance, and preserve explicit omissions instead of filling the reference layout with invented facts.

- Serving temperature uses a recorded range when supplied, otherwise a style-derived range explicitly labeled “Style guide”; Fahrenheit is calculated from that same range.
- Body and tannin words derive from their recorded sensory values. Missing finish reads “Not yet recorded.” No missing value is rendered as a measured zero.
- Optional flavour-note categories, tannin detail, editorial notes and availability are conditional. Missing pairing prose is omitted, even if the engine provides a verdict. Missing translations fall back per field.
- Origin links describe production geography; availability notes and market filters describe retail presence. Do not interchange them.
- Keep SVG glasses schematic. The table photograph's recorded credit is Matthias Oberholzer / Unsplash (`src/assets/wine-at-table.source.json`); do not present it as an image of the selected bottle or its origin. This documentation does not assert corpus size, coverage or sensory values for any bottle.
- Region and band photographs are scene imagery — places, cellars, laid tables — and their alt texts say so; they are never presented as the specific bottle, vintage or estate. Every asset carries a `*.source.json` provenance sidecar (author, source, license, transformation); alt text and captions read from it rather than from hand-written attributes.
- Attribution follows the license: CC BY-SA images render a visible caption credit ("Foto: \<author\> / Wikimedia Commons, CC BY-SA \<version\>"); Unsplash and CC0 need no visible credit, only the sidecar record. The Mendoza band's provenance is unrecorded (flagged in its sidecar); confirm before any public launch.

### Ruled headings

The shared section heading pairs semibold Alegreya with a flexible trailing rule, separated by a gap (1.25rem). The rule is structural, not a decorative underline beneath every heading. Keep actual headings for content hierarchy.

**Retired, not canonized:** `Eyebrow.astro` was deleted rather than promoted into a heading tier; dish detail's former eyebrow labels are now italic Alegreya (1.5rem) section headings like the pairing-mode headings; dish, grape and region facts lines (category · weight · intensity, grape colour · origin, country) sit below the h1, never above it, and the home's decorative "or browse" kicker is a plain hairline divider. The reveal comment still promises a fade-up absent from its CSS states; that remains unrepaired. Functional property terms and origin-filter labels are not decorative kickers.

## Do's and Don'ts

### Do:
- **Do** use semantic colors so page ground, text, rules and accent-filled controls remain coherent in both themes.
- **Do** preserve Playfair names and editorial prose alongside Open Sans controls and facts; keep Alegreya to the wordmark.
- **Do** set type on darkened photographs with `on-photo`, never the remapped `white` utility.
- **Do** keep wine properties as ruled spec rows and display sweetness and acidity independently.
- **Do** use ruled, linked rows and native disclosures for readable pairing lists.
- **Do** label style guidance, show missing finish honestly, and omit unrecorded optional detail.
- **Do** retain visible keyboard focus, explicit state labels and room for English and Spanish.

### Don't:
- **Don't** turn sensory scales into pairing scores or replace qualitative tiers with invented percentages.
- **Don't** invent finish, tannin axes, temperature records, pairing prose or retail availability to fill a layout.
- **Don't** use the dark-remapped white utility for text that must stay white on the accent.
- **Don't** make literal wine-color illustration fills into competing interface accents.
- **Don't** propagate legacy decorative eyebrows as a new heading style.
- **Don't** promise a fade-up animation that the current implementation does not provide.
