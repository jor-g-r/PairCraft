# Paircraft UX expansion

Mode: Operate on catalogs and /pair; Read on entity pages and About.
Authority: Jorge's approved plan and Merlot light/dark reference PDFs, 2026-09-25.

## Direction contract

THESIS: A bottle opens two distinct occasions: a meal and a snack. A board is a composition of named foods, never one averaged pairing.

OWN-WORLD: Since 2026-10-23, the founder's dashboard comp: a #0e0e0e ground (light: #e9e9e7 stone) with #1e1e1e (light: white) square tiles, darkened square photographs carrying a centered or bottom-set Playfair Display headline with one red word, Open Sans Light facts, white or ink outline pills, and one #961623 red. Alegreya survives only in the wordmark.

STORY: Find a known bottle or describe an unlisted bottle's structure, select meal or snack, then explore a reviewed pairing. Style matches lead to named market-available guide examples and never claim a verdict for the unknown bottle. On grape pages, a market-available bottle may serve as one editorial example; paid sponsorship is not active and must be disclosed if introduced.

FIRST VIEWPORT: Wine cards link separately to meal and snack feeds. Wine detail keeps both occasions one tap away and renders only curated pairings. The food catalog and free-text lookup begin with occasion choice; a snack board opens its named components. The style finder accepts recorded profile descriptors and shows nearest in-market guide wines, with pairings kept visibly attached to each example. Grape pages introduce one local-market bottle example as editorial content, with no invented bottle photography or sponsorship claims.

FORM: Extend Paircraft's editorial pocket-guide identity using typographic hierarchy, modular storytelling and bottle-reference clarity informed by Jorge's Kinfolk, The Modern House and Wine Folly references. Existing Paircraft mark, palette, mobile-first navigation, EN/ES and persisted light/dark preference remain. Seed key: none. The concept roll was not taken for this surface (the dealt hand in `.impeccable/questions/roll.json` was never chosen from); the approved Merlot light/dark reference (2026-09-25) and Jorge's editorial references govern instead.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Finish review (2026-10-16)

- Reviewer: a fresh subagent following `reference/degraded/finish-reviewer.md` (this harness ships no `impeccable-finish-reviewer` agent). Code-led build; no comp and no QUALITY BAR card recorded. Evidence: 21 captures in `.impeccable/review/2026-10-16/` (390×844 and 1280×800, Spanish, Colombia market, light plus two dark).
- Round 0, recapture: one desktop capture was scrolled; recaptured.
- Round 1, fix: eight material findings (home cards without occasion links, inconsistent occasion labels, /wine-style examples without pairings, grape example picked by collection order, missing seed-key record, facts lines above the h1, browser-default controls on /wines, DESIGN.md drift). Verdict pass 1: seven resolved, one partial, one regression. Verdict pass 2: both resolved, one new regression (occasion missing on /wine-style example rows).
- Final reviewer disposition: **fix**, for that one regression. It was then fixed in-thread with the reviewer's stated smallest fix (occasion inline on each row) and verified by DOM check and recapture, without a third review round (two-round budget).
- Open polish, not material: the cuisine-context line under the board h1; dish-page pairing rows (stacked italics, right-aligned chip); the /pair textarea's native resize grip; no trailing rule on "Arma una tabla de quesos". Ceiling notes, not owed: motion on the meal/snack switch, the board as a visual composition, scene photography on bite and board pages.
- FINISH line: finish review done; verdict recorded above; DESIGN.md corrected 2026-10-16; raster provenance still open: the Mendoza band's source is unrecorded until Jorge confirms or replaces it.
- Polish closeout (2026-10-23): the four open polish items are resolved. The board h1 no longer carries the cuisine-context line; dish-page wine rows show tier, name and explanation only, with the chip above the name; /pair's textarea has no resize grip; "Build a cheese board" and the board's "On this board" use the ruled section heading, which also removes the board page's double rule. "View 1 more pairing" is now singular.

## Dashboard redesign (2026-10-23)

- Authority: the founder's mobile-first Figma comp of the home (PNG export plus three hero photographs), measured and rebuilt comp-led in spirit (the comp-led state machine assumes generated comps; this one was a supplied design). Deviations kept on purpose: 1rem search and select text (iOS focus zoom), 0.75rem style-finder link (comp ~0.5rem), `#bd0000` red word for 3:1 on the darkened photo (comp `#b50000`), a sideways-scrolling Type row on phones (five pills with Rosé).
- Live Impeccable rounds, each three variants on a different axis, the founder choosing: wine list → cellar tiles; /pair → photo card; About → photo spread; wine intro → spec sheet with the bottle module; wine pairings → tiles; dish page → mirror of the wine page; grape page → region cover (applied to regions); wine lower half → photo first; /wine-style → ruled sheet. Light theme chosen from three previews (paper, stone, veil): stone.
- Monetisation context: wine and grape pages carry a bottle slot meant for future brand placements; sponsorship buys visibility, never tiers or prose, and needs a visible label and an alcohol-advertising check per market.
- Emulated QA (iPhone 14, Pixel 7): no overflow on 10 routes. Real-device QA and provenance for the home, /wines and /dishes heroes and the Mendoza band remain open.

