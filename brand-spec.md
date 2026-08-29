# Kali / Yixiu brand specification for homepage depth exploration

## Scope

This specification is derived from the current production codebase and is limited to the public acquisition homepage. It does not redefine the application workspace or any legal/help pages.

## Core assets

- Brand mark: the current public site uses a typographic `K` inside a deep-ink rounded square. No standalone logo file exists in the repository, so the direction demos preserve this exact mark instead of inventing a new logo.
- Product UI: the existing homepage workspace preview in `src/pages/[lang]/index.astro` is the authoritative digital-product surface for this exploration.
- Product image: `public/yixiu-assets/digital-human.png` is the existing project-owned digital-human asset used by the homepage preview.
- Social preview: `public/og.png` remains unchanged; this exploration does not alter social metadata or branding.

## Color system

- Ink: `#172822`
- Deep green: `#16785e`
- Mint: `#92ecc8`
- Soft mint: `#e9faf3`
- Cream: `#f7f8f3`
- White: `#ffffff`
- Hairline: `#dce9e4`

The exploration may derive darker or lighter values from these colors for spatial depth, but it must not introduce purple-tech gradients or unrelated neon accents.

## Typography

- Display: the current site uses Georgia as its editorial serif. Preserve the serif/sans contrast in the exploration.
- Body and controls: Inter with system fallbacks.
- Tone: calm, capable, editorial, and internationally legible.

## Must preserve

- Existing homepage copy, information architecture, product categories, and CTA intent.
- Existing mint/ink recognition.
- A readable, restrained interface that does not turn depth into decorative glassmorphism.
- The real product workflow: discover, write, produce, publish.

## Avoid

- Invented product screenshots, customer logos, statistics, or testimonials.
- Generic purple AI gradients, excessive blurred glass, emoji icons, or every section becoming a floating card.
- Replacing the current brand mark without a supplied official logo asset.
