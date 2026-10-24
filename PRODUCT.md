# Paircraft

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Wine drinkers at home, in a restaurant or wine shop deciding what to eat with a bottle. Paircraft serves two distinct occasions: a meal and a snack/bite. Wine → food remains the primary journey; snack pairing is a first-class use case, not a subcategory mixed indiscriminately into the meal feed. The next demo audience remains Teo and the CUHELAV profesora; B2B versus B2C positioning awaits their feedback.

## Product Purpose

A pocket guide linking wines, food, grapes and regions. Success is finding something concrete to eat with a wine—whether a meal or a bite—and understanding why in one short sentence.

## Operating Context

Mobile-first, especially at home: the user may have a bottle and want to know what in the pantry works, or what to buy. Browse a local-market wine feed, choose meal or snack, see distinct pairing recommendations and follow a food entity. A board is a composition of individually described foods, not a single averaged dish. Grape pages may feature one market-available bottle as an example; paid sponsorship is a future commercial hypothesis and must be clearly disclosed if introduced.

## Capabilities and Constraints

Astro Content Collections hold curated entities and prose. Food records carry an occasion (`meal` / `snack`), a format (`dish` / `bite` / `board`) and, for a board, explicit component references. A board is not tier-scored as an averaged dish; its components are explored individually. Pairing tiers may be calculated internally, but user-facing recommendations require a curated wine–food pairing record and explanation. A missing record is an editorial veto: where the engine allows a combination the editor would not defend (dry or tannic wines with blue cheese, structured reds with fresh cheese, light, sparkling or sweet wines with grilled beef, or a pairing whose own prose argues against it), no record is kept and the engine tier never surfaces. `/wine-style` uses body, sweetness, acidity and tannin to find similar catalogue wines available in the visitor’s market; pairings shown belong to those named examples and are not a verdict on the unlisted bottle. Runtime AI only routes free-text foods to curated foods within the selected meal/snack occasion; it does not invent wine recommendations or scores. Jorge approved the dedicated /pair route on 2026-09-25, superseding the earlier demo-dependent deferral for this feature. Tier tuning remains gated on demo feedback. No accounts or payments in this iteration.

## Brand Commitments

Paircraft identity; concise, opinionated pocket-guide voice. Editorial frame informed by Kinfolk and The Modern House, with wine-reference clarity from Wine Folly; the product retains its own content, visual system and mark. Playfair Display (names, prose) and Open Sans (controls, facts) are the self-hosted type pair since 2026-10-23; Alegreya remains in the wordmark. The founder's dashboard comp (2026-10-23) is the authority for catalog surfaces. EN/ES with honest per-field fallback. Theme toggle, top navigation and per-theme wine-red accents are confirmed.

## Evidence on Hand

The committed corpus is the source of wine facts and pairing prose. The supplied stock photo is Matthias Oberholzer's Unsplash image zmH_rmAxOgE. Missing sensory data must not be invented. No demo feedback or customer testimonials exist yet.

## Product Principles

- Bottle first, occasion next, food next.
- Explain a recommendation briefly.
- Keep meal pairings and snack pairings distinct while allowing the same food in both when its use warrants it.
- Evaluate each component of a board on its own; never present a blended board profile as a precise verdict.
- Keep origin distinct from retail availability.
- Let every entity lead to a useful next step.
- Use real corpus data; expose gaps honestly.
