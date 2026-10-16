---
name: Paircraft
description: A wine-first pocket guide with editorial type, ruled lists, and restrained wine-red emphasis.
colors:
  accent: "#7b2d2f"
  paper: "#ffffff"
  surface: "#f9f9f9"
  ink: "#171717"
  muted: "#525252"
  rule: "#d9d9d9"
  on-accent: "#ffffff"
  accent-dark: "#961623"
  paper-dark: "#1e1e1e"
  surface-dark: "#111111"
  ink-dark: "#fafafa"
  muted-dark: "#bdbdbd"
  rule-dark: "#515151"
  wine-gold: "#e8d97e"
  wine-rose: "#e8a4a8"
  wine-orange: "#cf7e2a"
typography:
  display:
    fontFamily: '"Alegreya Variable", ui-serif, Georgia, serif'
    fontSize: "clamp(2.5rem, 7vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: '"Alegreya Variable", ui-serif, Georgia, serif'
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  headline-sm:
    fontFamily: '"Alegreya Variable", ui-serif, Georgia, serif'
    fontSize: "3.75rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  section:
    fontFamily: '"Alegreya Variable", ui-serif, Georgia, serif'
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: "2rem"
  section-sm:
    fontFamily: '"Alegreya Variable", ui-serif, Georgia, serif'
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: "2.25rem"
  title:
    fontFamily: '"Alegreya Variable", ui-serif, Georgia, serif'
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: "1.75rem"
  pairing-prose:
    fontFamily: '"Alegreya Variable", ui-serif, Georgia, serif'
    fontStyle: italic
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.375
  body:
    fontFamily: '"Source Sans 3 Variable", ui-sans-serif, system-ui, sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: '"Source Sans 3 Variable", ui-sans-serif, system-ui, sans-serif'
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: "1.25rem"
  tier:
    fontFamily: '"Source Sans 3 Variable", ui-sans-serif, system-ui, sans-serif'
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

Paircraft reads like a concise, opinionated pocket guide: Alegreya carries wine identity and editorial prose; Source Sans 3 carries controls and facts. Generous white or charcoal ground, restrained wine-red emphasis, ruled lists, and scene photography keep the guide distinct from a generic wine catalogue. Editorial modularity takes cues from Kinfolk and The Modern House; Wine Folly informs wine-reference clarity and bottle prominence without borrowing its assets or layout wholesale.

Density follows the task. Catalogs use scannable ruled rows, while wine pages give identity and an occasion choice room to breathe before sensory detail. Meal and snack remain distinct through wine, dish and free-text food lookup. `/wine-style` is a compact profile finder: body and color anchor the search; other recorded axes refine it; close matches link to exact catalogue examples and their reviewed pairings. EN/ES text and incomplete records must fit without invented copy or measurements.

**Key Characteristics:**
- Wine-red actions and verdicts on neutral, theme-aware ground.
- Alegreya identity and editorial prose; Source Sans 3 controls and facts.
- Ruled lists, oval properties, thin independent sensory tracks.
- Editorial scene photographs with recorded provenance; never the specific bottle.
- Mobile-first reading with explicit navigation and honest missing-data states.

Recorded from the current working-tree implementation on 2026-10-14, not from a production deployment or a real-device audit. Evidence: `src/styles/global.css`, `src/layouts/Base.astro`, `src/components/`, `/wine-style`, wine and food occasion flows, entity templates, `src/lib/region-images.ts`, and scene imagery with `*.source.json` provenance sidecars. `PRODUCT.md` and `.impeccable/surfaces/paircraft.md` establish product direction; source code establishes implemented values. The sidecar's illustrative tonal ramps are panel aids, not additional application colors.

## Colors

One wine-red accent carries emphasis; the rest is neutral except the small, literal wine-color fills in SVG glass illustrations. Frontmatter owns palette values. Unsuffixed semantic entries describe light mode; `-dark` entries are the corresponding dark overrides of the same CSS variables, not new runtime variable names.

### Primary

- **Wine red — `accent` / `accent-dark`:** primary actions, Decisive match badges, the featured serving panel, selected language segment and active origin filter. The dark value is an explicit approved choice, not an automatic inversion.
- **White on wine red — `on-accent`:** remains white in both themes. Use this role for accent-filled controls; the legacy `white` utility changes to charcoal in dark mode.

### Neutral

| Semantic role | Light token | Dark token | Application |
| --- | --- | --- | --- |
| Page ground | `paper` | `paper-dark` | Body, header, fields |
| Inset surface | `surface` | `surface-dark` | Oval properties, availability panel, theme-button hover |
| Main text | `ink` | `ink-dark` | Headings, controls, track markers, focus outlines |
| Supporting text | `muted` | `muted-dark` | Descriptions, metadata, placeholders |
| Hairline | `rule` | `rule-dark` | Row separators, field borders, heading rules |

Dark surfaces are darker than the page ground. Preserve that direction rather than treating every panel as a lighter raised card. Existing entity templates also use Tailwind neutrals: `global.css` remaps `white` and `neutral-50` through `neutral-900` in dark mode. Worth trying retains the `neutral-100`/`neutral-900` pairing; Risky bridge retains a `neutral-300` outline and `neutral-700` text. These utility mappings are distinct from the semantic palette; prefer semantic roles for new surfaces.

The `wine-gold`, `wine-rose` and `wine-orange` entries are categorical SVG liquid fills, not secondary action palettes. Red wine uses the accent; sparkling wine uses the gold fill in a flute. Outlines inherit text color.

**The One Accent Rule.** Use wine red for decisive emphasis and selected states; use neutral text and rules for ordinary navigation and reading.

## Typography

**Display Font:** self-hosted Alegreya Variable, with ui-serif / Georgia / serif fallbacks.

**Body Font:** self-hosted Source Sans 3 Variable, with ui-sans-serif / system-ui / sans-serif fallbacks. Controls and labels share this family; there is no separate mono face.

The serif carries wine identity and opinion; the sans carries operation and evidence. This is an observed Tailwind size ladder plus a fluid wine title, not a newly imposed modular ratio.

### Hierarchy

- **Display:** `display` is the fluid wine-detail title. A recorded vintage is appended at regular weight; no vintage is supplied when absent.
- **Headline:** `headline` becomes `headline-sm` at the small breakpoint. Used for catalog, dish, pairing-input and About titles; balanced wrapping and tight tracking are shared.
- **Section:** `section` becomes `section-sm` at the small breakpoint and carries a trailing horizontal rule. Pairing-mode headings instead use italic Alegreya (1.5rem) without that rule.
- **Title:** `title` covers property values and dish names in pairing rows. Catalog wine titles are larger (1.5rem), semibold, with tight line-height (1.25).
- **Editorial prose:** `pairing-prose` is italic in `DishPairing.astro`. Wine taglines use italic Alegreya (1.25rem, rising to 1.5rem at the small breakpoint) with relaxed line-height (1.625).
- **Body:** `body` describes relaxed reading copy. Ordinary unmodified body text uses line-height (1.5); pairing descriptions use smaller Source Sans 3 (0.875rem) with relaxed line-height. Long copy commonly stops at the prose measure (65ch).
- **Label:** `label` describes actions. Fields remain at readable base size (1rem); metadata and tier chips use smaller text (0.75rem). Property terms are functional uppercase labels (0.75rem, tracking 0.05em), not decorative section kickers.

**The Two Voices Rule.** Set names and concise editorial judgments in Alegreya; set controls, supporting descriptions and factual labels in Source Sans 3.

## Layout

- **Shared frame:** centered maximum width (64rem), mobile side padding (1.25rem), increasing to (2rem) at `sm`. Main vertical padding is (2rem), increasing to (3.5rem) at `md`. Pairing-input and dish pages narrow the frame to (48rem); wine identity and sensory sections also cap at (48rem).
- **Breakpoints:** `sm` (40rem), `md` (48rem), `lg` (64rem). These are Tailwind's existing breakpoints, not device classifications.
- **Rhythm:** a quarter-rem base with frequent (0.5–1.5rem) internal gaps, (2rem) content introductions, and (3–5rem) section separation. The footer begins after (6rem) of separation.
- **Header:** sticky, opaque, bordered and two-row at all breakpoints. Brand and theme/language controls occupy the first row; four navigation links occupy the second. Mobile navigation distributes links across the width; from `sm` it aligns left with (2rem) gaps. Header stacking level is (30); page scroll padding is (9rem).
- **Wine detail:** centered identity, tagline, origin/grape links and two direct occasion actions. Sweetness and acidity stack on mobile and sit side by side at `sm`. The property definition list stays **2×2 on mobile**, with (1rem) gaps, becoming four columns at `md`. Serving temperature, body, tannin and finish keep this order.
- **Pairing feeds:** meal and snack selectors are persistent links. Meal recommendations retain tri-modal ruled groups, but each pairing appears once, under its dominant mode (the mode with the most rule weight, `dominantMode` in `src/lib/tier.ts`); on desktop the grid has one column per non-empty group, and a single group keeps a reading measure. Pairing rows show tier, food name and the explanation only; the food description lives on the food page. Snack recommendations are a single food-first list ordered by qualitative tier, avoiding duplicate bites across rule modes. A guided board appears only when at least one component has curated pairing prose; every component retains its own tier and explanation. A component without a curated pairing reads "Better with another wine" and links to its food page, which lists only the wines that do work; it is never averaged.
- **Catalogs and finders:** `/wines` leads with full-width name search and a visible market selector; color/style filters live in a native disclosure so common search results appear before optional controls. Wine results use one / two / three columns at base / `sm` / `lg`. Dish results use one column then two at `sm`, with a separate occasion selector. `/wine-style` uses a compact multi-field form and ranked examples, without showing a numeric fit score; results open with a one-line summary of the chosen descriptors, and each example carries its best reviewed meal and snack pairing. A grape page features the first bottle stocked in the visitor's market, ordered by the grape's own colour, then single-variety bottles, then the most widely stocked. Empty results remain explanatory text with an available next action.
- **About:** one column becoming two at `md`, with a portrait editorial image (4:5). The same table photograph is a small supporting image on home, hidden below `sm`. It is not bottle or regional evidence.
- **Editorial photo bands:** `/dishes` and `/pair` each close with one lazy 21:9 band (`dishes-table`, `pair-table`), so the occasion choice sits directly under the instruction it answers; the `/wines` catalogue stays search-first without a decorative cellar image. Region pages carry a 21:9 region band after the header; wine pages close the "In the glass" section with a 21:9 "From <region>" band; grape pages carry a 3:1 strip labeled "From <region>", sourced from the first signature region with an image. The home's catalog divider is a plain hairline, not a labeled kicker.

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

`WineCard.astro` is the one wine card on home, `/wines` and `/wine-style`: a top rule, vertical padding (1.5rem), a small SVG glass (2.25rem), Alegreya title, optional origin, italic tagline, an optional slot (on `/wine-style`, the bottle's best reviewed meal and snack pairing with tier chips) and two direct occasion links ("For a meal" / "Para comer", "For a snack" / "Para picar"; the same two labels everywhere an occasion is chosen). The title underlines on hover. Dish catalog rows use the same ruled reading model; pairing rows use slightly tighter vertical padding (1.25rem), a tier chip, food title and optional italic explanation; the food description lives on the food page. A wine-to-food link carries `?wine=<id>` so the food page can show a contextual return link when it finds that wine. `WineStyle` keeps candidate cards tied to specific catalogue wines and routes to that example's exact pairing feed.

### Editorial photo bands

`PhotoBand.astro` renders one `<Image>` from `src/assets/` inside a `<figure>`: the full-width band crops 21:9 and the grape strip crops 3:1, both at the `xl` radius, widths (640/1024/1600), `sizes` "(min-width: 1024px) 1024px, 100vw", lazy by default; no current band is eager. Dark mode dims and desaturates slightly (`brightness-[0.87]`, `saturate-[0.94]`). The caption is a small muted `figcaption` below the image: an optional label span (bilingual via `data-es-value`) plus a license credit where the license requires one. `src/lib/region-images.ts` resolves a region slug to its WebP and provenance sidecar; the sidecars are the single source of truth for alt text and credits.

### Wine properties and sensory tracks

`PropertyCard.astro` is a definition-list pair with centered content. The serving panel is **accent-filled in the implemented build**, not the dark neutral described in the surface brief; body, tannin and finish use surface-filled ovals. The accent-filled variant is the documented current pattern, not a silently corrected reference.

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
- **Do** preserve Alegreya names and editorial prose alongside Source Sans 3 controls and facts.
- **Do** keep wine properties in a mobile 2×2 grid and display sweetness and acidity independently.
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
