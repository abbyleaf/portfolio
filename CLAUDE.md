@AGENTS.md

# Portfolio site

Personal portfolio: editorial, sticker-and-stamp, craft-forward. Next.js App Router, Tailwind v4, MDX case studies.

## Commands

- `npm run dev` — dev server (Turbopack)
- `npm run build` — production build
- `npm run lint` — ESLint

## File layout

- `app/` — routes and layouts only
- `app/globals.css` — Tailwind import and the single `@theme` block (all design tokens)
- `components/` — React components (layout, stickers, stamps, MDX building blocks)
- `content/case-studies/*.mdx` — case study content, one file per study
- `mdx-components.tsx` — maps MDX elements and custom components to `components/`
- `public/` — static assets

## Design tokens

Source: the Figma file "Case Studies" (`4RCJgEA6vqGzYE5reqImGC`). Tokens are defined **once**, in the `@theme` block in `app/globals.css`. Nothing else defines colours, type or spacing.

**Rule: components use token utilities (`bg-surface-canvas`, `text-text-body`, `shadow-sticker`), never hardcoded hex, rgb or arbitrary values (`bg-[#f0ebe5]`).** If a value is missing, add a token to `@theme` first, then use it. Do not name a token after its hex.

### Reading the tokens

The values live in `app/globals.css`; read them there, not here. Naming follows Figma with `/` turned into `-`, so Tailwind utilities double up (`text-text-body`, `bg-surface-canvas`).

- **Colour:** palette tokens (`grey-900`, `red-200`, ...) hold raw values. Semantic tokens (`surface-*`, `text-*`, `border-*`) reference them. Prefer semantic tokens in components.
- **Opacity:** use Tailwind opacity modifiers on colour tokens, never alpha tokens. `border-subtle` is the one semantic alias for ink at 14%; for any other tint, use a modifier such as `bg-grey-10/10`.
- **Type:** `text-*` size tokens carry size, line-height, tracking and weight (`text-heading-fraunces-xl`). Pair with `font-heading`, `font-sans` or `font-mono`. Italic display text adds `italic`.
- **Spacing:** use the `item-*` tokens (`p-item-16`, `gap-item-9`), not Tailwind's default numeric scale.
- **Shape:** `rounded-pill`, `shadow-sticker` (hard offset, no blur), `shadow-image`. Strokes are `--stroke-hairline` (1px) and `--stroke-sticker` (3px); use them as `border-(length:--stroke-sticker)`.
- **Contrast:** `text-accent-cool` is `azure-55` (#2e66ed): 4.7:1 on `surface-primary`, 4.2:1 on `surface-canvas`, so use it only for large text or on `surface-primary`. Avoid `text-muted` on `surface-accent-warm` (4.3:1). On `surface-accent-cool` (`azure-55`), `text-on-inverted` is 4.2:1, so use it only for large or bold text, and use white for body-size text (5.0:1).
- Never use pure black (`#000`). Do not use the unmerged near-duplicate colours (`red-37`, `grey-93-2`) until they are resolved in Figma.

## Aesthetic

Editorial, sticker-and-stamp, craft-forward. It must not read as a generic portfolio template.

- **Paper and print.** Warm off-white canvas, visible grid and rules, grain or paper texture, ink-dark text. No pure `#000` or cool greys.
- **Die-cut stickers.** Thick outlines, slight rotation (a few degrees, varied per element), hard offset shadow with no blur. Rotation values belong in tokens or a small shared set, not scattered magic numbers.
- **Stamps.** Space Mono or uppercase Inter labels in bordered badges for metadata (year, role, tools).
- **Playful motion.** Peel, wiggle or stamp-down on hover or entry. Every animation must respect `prefers-reduced-motion`. Motion adds delight and never carries information.
- **Guardrails against template look.** No hero-plus-three-card-grid layouts. No stock gradients, glassmorphism or generic drop shadows with blur. No centred-everything stacks. No interchangeable placeholder icons. Vary layout between case studies, and make the grid asymmetric on purpose.

## Technical rules

- **Fonts:** `next/font` only (`next/font/google` for Fraunces, Inter and Space Mono). Use `variable` and `display: 'swap'`, expose each as a CSS variable, and map them in `@theme`. No `<link>` tags or CSS `@import` for fonts.
- **Images:** `next/image` only, never a raw `<img>`. Always set `alt`, plus `width` and `height` or `fill` with a sized parent. Give `fill` images a `sizes` prop. In this version `priority` is replaced by `preload` (`onLoadingComplete` is deprecated). Check `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`.
- **Case study content:** lives in `content/case-studies/*.mdx` and never in layout or component code. Layout code renders it. Use `@next/mdx` with `mdx-components.tsx` (required for App Router). Load a study with `await import(`@/content/case-studies/${slug}.mdx`)` in a dynamic route with `generateStaticParams`, calling `notFound()` for unknown slugs. Do not export `dynamicParams`: it is incompatible with `cacheComponents`, which this project enables.
- **Frontmatter:** `@next/mdx` does not parse it by default. Add `remark-frontmatter` and `remark-mdx-frontmatter`. With Turbopack, remark and rehype plugins must be passed by string name with serialisable options. See `node_modules/next/dist/docs/01-app/02-guides/mdx.md`.
- **Next.js config:** the project uses `next.config.ts`. Add `pageExtensions` for `md` and `mdx` when setting up MDX.

## Accessibility

- Text and UI contrast meets WCAG AA. Check text on the pastel accent surfaces and stickers, not just on the canvas.
- Meaningful images have descriptive `alt`. Decorative stickers and stamps use `alt=""` or `aria-hidden`.
- Visible focus states on everything interactive. Rotated or overlapping stickers must not hide the focus ring or break tab order.
- Use semantic headings in order. MDX content maps to real `h1`–`h3`, `figure` and `figcaption`.
- Honour `prefers-reduced-motion`.
