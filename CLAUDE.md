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
- `proxy.ts` — coming-soon gate for the live site (switch: `content/site.ts`, see "Coming-soon mode")
- `lib/` — shared helpers (`lib/case-studies.ts` decides whether a case study is visible)
- `mdx-components.tsx` — maps MDX elements and custom components to `components/`
- `public/` — static assets
  - `public/icons/` — favicons: `favicon-light.svg` and `favicon-dark.svg` (chosen by the browser's colour scheme), `favicon.ico` and `apple-icon.png`, wired in `app/layout.tsx`. `proxy.ts` leaves `/icons/` reachable in coming-soon mode.

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

## Draft case studies

Case studies are hidden or shown by **content and an environment variable, never by branch**. The code is identical on `test`, `staging` and `main`, so branches never differ just to hide work.

- Every `content/case-studies/*.mdx` has `status: draft` or `status: published` in its frontmatter.
- `published` studies always show their real link and page, on every branch.
- `draft` studies show their real link and page only when the env var `SHOW_DRAFTS` is `"true"`. Otherwise the card shows the "Coming soon" design with no link and `/case-studies/<slug>` returns 404.
- `SHOW_DRAFTS=true` is set in Vercel for the `test` branch only. `staging` and `main` leave it unset, so drafts stay hidden there.
- A study with no MDX file is always "Coming soon".
- Never hide or reveal a study by editing a card, deleting a link or changing branches. To publish one, change its frontmatter to `status: published`. To hide one, set it back to `draft`.
- Cards read this through `lib/case-studies.ts` and `components/CaseStudyList.tsx`. Do not set `comingSoon` in `content/home.ts` or `content/work.ts`: it is derived.
- To see drafts locally, run `SHOW_DRAFTS=true npm run dev`, or put `SHOW_DRAFTS=true` in `.env.local` (git-ignored).

## Case study pages

A full case study is one MDX file in `content/case-studies/`; `components/CaseStudyLayout.tsx` draws the page around it. Files with only `title` and `status` stay plain stubs.

- Frontmatter drives the page chrome: `title`, `status`, `number`, `badges`, `category`, `summary`, `hero`, `platform`, `timeline`, `role`, `team`, `contribution`, `responsibilities`, `toc` (each `id` must match a `<Section id>`) and `next` (slug of the following study). The type is `CaseStudyMeta` in `lib/case-studies.ts`.
- The body uses the blocks in `components/CaseStudyBlocks.tsx`, mapped in `mdx-components.tsx`: `Section`, `Subhead`, `Figure` (set `scroll` for wide diagrams), `Pair`, `Stats`/`Stat`, `Quote`/`Mark`, `ServiceCompare`, `Showcase`, `MapFigure` (a framed map; pass `video` for the looping clip, kept in `public/videos/case-studies/<slug>/`, and `still` for the picture shown until then). Do not import them in the MDX.
- Pictures go in `public/images/case-studies/<slug>/`, exported from Figma at 2x. Every `Figure` needs real `alt` text.
- Link a study only through `isCaseStudyVisible` (draft rules above), including the next-study links and the footer.
- Dev only: after changing `@theme` tokens or the media blocks in `app/globals.css`, restart `npm run dev` (clear `.next`), or the page keeps the old values.

## Coming-soon mode

While the portfolio is unfinished, the live site (abigailyeap.com) can show only `app/coming-soon/page.tsx`. It is a switch in code, **never a branch difference**: `test`, `staging` and `main` hold identical code.

- The switch is `comingSoonOnLiveSite` in `content/site.ts`. `true` means the live site shows the coming-soon page. `false` means it shows the full site.
- `proxy.ts` applies it only when Vercel's `VERCEL_ENV` is `production`, so `test` and `staging` always keep the full site.
- While on, every page on the live site shows the coming-soon page, and `/images`, `/videos`, `/resume.pdf` and `/_next/image` return 404.
- When the user says **"activate coming soon"**, set `comingSoonOnLiveSite` to `true`. When they say **"deactivate coming soon"**, set it to `false`. Commit and push to `test` like any change, then tell the user it goes live only after "push to production". If they asked for it to go live now, follow the "Push to production" steps below, and in the changes list say whether the live site is going to coming soon or back to the full site.
- Never delete `proxy.ts` or edit pages to turn it on or off.
- `COMING_SOON=true` forces it on anywhere, e.g. `COMING_SOON=true npm run dev` to preview it locally. The page is also always reachable at `/coming-soon`.
- The page uses no images, so nothing unfinished is exposed. Keep it that way, and keep it in the portfolio style (tokens, stickers, rulers) like every other page.

## Deployment workflow

Branches and links:
- `test` → test.abigailyeap.com (all work happens here)
- `staging` → staging.abigailyeap.com (for checking before release)
- `main` → abigailyeap.com (production; protected on GitHub, pull requests only)
- `old-site` is an archive of the previous HTML site. Never modify, merge, or delete it.

Default behaviour:
- Always work on the `test` branch. At the start of every session, check the current branch and switch to `test` if needed.
- "Commit and push" means commit and push to `test` only.
- Never push to, merge into, or open pull requests against `staging` or `main` unless the user says "push to staging" or "push to production".

"Push to staging":
1. Run build and lint. Stop and tell the user if either fails.
2. Show a short list of what changed since `staging` was last updated, and wait for the user's OK. List any case studies whose `status` changed from `draft` to `published`, so the user can confirm before they go public.
3. Merge `test` into `staging`, push `staging`, then switch back to `test`.

"Push to production":
1. Run build and lint. Stop and tell the user if either fails.
2. If `test` has changes that `staging` doesn't, ask the user whether to release everything on `test`, or only what's already on `staging`.
3. Show a short list of what will change on the live site, and wait for the user's OK. List any case studies whose `status` changed from `draft` to `published`, so the user can confirm before they go public.
4. Open a pull request from the chosen branch into `main` with `gh`, and merge it with a merge commit (`gh pr merge --merge`, never squash).
5. Pull `main`, merge `main` into `staging` and `test` so all three branches match, push both, then switch back to `test`.
6. Tell the user it's done. abigailyeap.com and staging.abigailyeap.com both update within a couple of minutes.
