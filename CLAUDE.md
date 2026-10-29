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

**Rule: components use token utilities (`bg-surface-canvas`, `text-body`, `shadow-sticker`), never hardcoded hex, rgb or arbitrary values (`bg-[#f0ebe5]`).** If a value is missing, add a token to `@theme` first, then use it. Do not name a token after its hex.

### Colour

| Token | Value |
| --- | --- |
| surface/canvas | `#f0ebe5` |
| surface/primary | `#faf8f5` |
| surface/raised | `#ffffff` |
| surface/inverted | `#1f1d1a` |
| surface/accent-warm | `#f2d0d1` |
| surface/light-accent-warm | `#f5e3e3` |
| surface/light-accent-cool | `#e0e8fb` |
| text/primary | `#1f1d1a` |
| text/body | `#3a3833` |
| text/muted | `#63615a` |
| text/sub-headers | `#85837c` |
| text/on-inverted | `#f0ebe5` |
| text/accent-warm | `#5f3031` |
| text/accent-cool | `#2e66ed` |
| border/strong | `#1f1d1a` |
| border/subtle | `#1b1a17` at 14% |
| border/canvas-subtle | `#dfdfdf` |
| palette: green/500 | `#56b388` |
| palette: red/300 | `#eaa4a6` |
| palette: red/200 | `#f2d0d1` |
| palette: grey/900, 800 | `#1f1d1a`, `#3a3833` |

Alpha variants of the ink colour (`#1b1a17` at 10% and 14%) are tokens too.

### Type

Fonts: Fraunces (headings), Inter (body, UI labels), Space Mono (captions, stamps, metadata).

| Token | Spec |
| --- | --- |
| heading/fraunces/xl | Fraunces Regular 32 / line-height 100% |
| heading/inter/xs | Inter Medium 12 / 100%, tracking 0.88px |
| paragraph/md | Inter Regular 16 / 24 |
| label/sm | Inter Regular 14 / 19.6 |
| label/upper | Inter Medium 11, uppercase, tracking 0.44px |
| mono/l | Space Mono Regular 14 / 20 |
| mono/m | Space Mono Regular 12 / 12, tracking 0.72px |

The Figma file also has a 10px size with 1.2px tracking, for tiny stamp text.

### Shape, stroke, shadow, spacing

- Sticker shadow: hard offset, `6px 7px 0 0 #1b1a17`, no blur. Token `shadow-sticker`.
- Radius: pill `999px`. Other corners stay square or near-square unless a token says otherwise.
- Stroke weights: 1 (hairline), 3 (sticker outline).
- Spacing: Figma only defines item spacing 6, 9 and 10. This is too sparse to be a scale. Use Tailwind's default spacing scale until a real spacing scale is added to `@theme`.

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
- **Case study content:** lives in `content/case-studies/*.mdx` and never in layout or component code. Layout code renders it. Use `@next/mdx` with `mdx-components.tsx` (required for App Router). Load a study with `await import(`@/content/case-studies/${slug}.mdx`)` in a dynamic route with `generateStaticParams` and `dynamicParams = false`.
- **Frontmatter:** `@next/mdx` does not parse it by default. Add `remark-frontmatter` and `remark-mdx-frontmatter`. With Turbopack, remark and rehype plugins must be passed by string name with serialisable options. See `node_modules/next/dist/docs/01-app/02-guides/mdx.md`.
- **Next.js config:** the project uses `next.config.ts`. Add `pageExtensions` for `md` and `mdx` when setting up MDX.

## Accessibility

- Text and UI contrast meets WCAG AA. Check text on the pastel accent surfaces and stickers, not just on the canvas.
- Meaningful images have descriptive `alt`. Decorative stickers and stamps use `alt=""` or `aria-hidden`.
- Visible focus states on everything interactive. Rotated or overlapping stickers must not hide the focus ring or break tab order.
- Use semantic headings in order. MDX content maps to real `h1`–`h3`, `figure` and `figcaption`.
- Honour `prefers-reduced-motion`.
