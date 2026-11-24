import Image from "next/image";
import { Children, type ReactNode } from "react";

import { CountUp } from "./CountUp";
import { LoopVideo } from "./LoopVideo";
import { TimedCaption, type TimedCaptionStep } from "./TimedCaption";
import { ZoomImage } from "./ZoomImage";

/*
 * Building blocks for case study MDX (see mdx-components.tsx). Case study text and picture
 * choices live in content/case-studies/*.mdx; these only draw them.
 */

const eyebrowClass =
  "font-sans text-heading-inter-label uppercase text-text-sub-headers";
const bodyClass = "font-sans text-paragraph-md text-text-muted";
const sectionTitleClass =
  "font-heading font-wonk text-heading-fraunces-section text-text-primary";

type SectionProps = {
  /** Anchor for the contents rail; matches an entry in the frontmatter `toc`. */
  id?: string;
  eyebrow: string;
  /** Left out when the eyebrow is the only heading (the eyebrow then becomes the h2). */
  title?: string;
  /** The paragraph under the title; pass an array for several paragraphs. */
  intro?: ReactNode | ReactNode[];
  children?: ReactNode;
};

/** A titled part of the case study, set off from the one before by a hairline rule. */
export function Section({ id, eyebrow, title, intro, children }: SectionProps) {
  return (
    <>
      <div aria-hidden="true" className="py-item-56">
        <hr className="border-0 border-t-(length:--stroke-hairline) border-border-subtle" />
      </div>
      <section
        id={id}
        aria-labelledby={id ? `${id}-title` : undefined}
        data-ruler-section={eyebrow}
        // Paragraphs written straight into a section in the MDX are plain HTML, so they get the body style here.
        className="flex scroll-mt-item-20 flex-col gap-item-28 [&>p]:font-sans [&>p]:text-paragraph-md [&>p]:text-text-muted [&>p>strong]:font-semibold [&>p>strong]:text-text-muted"
      >
        <header className="flex flex-col gap-item-20">
          {title ? (
            <div className="flex flex-col gap-item-20">
              <p className={eyebrowClass}>{eyebrow}</p>
              <h2 id={id ? `${id}-title` : undefined} className={sectionTitleClass}>
                {title}
              </h2>
            </div>
          ) : (
            <h2 id={id ? `${id}-title` : undefined} className={eyebrowClass}>
              {eyebrow}
            </h2>
          )}
          {intro &&
            (Array.isArray(intro) ? intro : [intro]).map((text, i) => (
              <p key={i} className={bodyClass}>
                {text}
              </p>
            ))}
        </header>
        {children}
      </section>
    </>
  );
}

/** A heading inside a section that opens a new point, with the text that follows it. */
export function Subhead({
  title,
  small,
  label,
  children,
}: {
  title: string;
  /** Draws the title as a small uppercase label, like a section's eyebrow, instead of a heading style. */
  label?: boolean;
  /** The smaller 20px heading style (h4) for a point inside a section that already has subheads; still an h3 for the outline. */
  small?: boolean;
  children?: ReactNode;
}) {
  return (
    // A subhead always follows a picture or video block, so the extra 28px above the section's
    // 28px gap leaves 56px between them.
    <div className={`mt-item-28 flex flex-col ${small ? "gap-item-16" : "gap-item-20"}`}>
      <h3
        className={
          label
            ? eyebrowClass
            : small
              ? "font-heading font-wonk text-heading-fraunces-md font-normal text-text-primary"
              : sectionTitleClass
        }
      >
        {title}
      </h3>
      {/* Paragraphs written inside a block are plain HTML, so this sets their text style. */}
      <div className={`${bodyClass} flex flex-col ${small ? "gap-item-16" : "gap-item-20"}`}>{children}</div>
    </div>
  );
}

type FigureProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Mono label above the picture. */
  label?: string;
  /** Wide diagrams keep their size on narrow screens and scroll sideways instead. */
  scroll?: boolean;
  /** Keeps the picture at its own width (never enlarged) and centres it, for illustrations. */
  natural?: boolean;
  /** Set to false for a picture that should not open in the lightbox. */
  zoom?: boolean;
  sizes?: string;
};

/** A picture from the design file, with an optional label above it. */
export function Figure({
  src,
  alt,
  width,
  height,
  label,
  scroll,
  natural,
  zoom = true,
  sizes = "(min-width: 50rem) 780px, 100vw",
}: FigureProps) {
  const image = zoom ? (
    <ZoomImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className="h-auto w-full"
    />
  ) : (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      // SVGs are not optimised by next/image; files in a `locked` folder must skip the optimiser.
      unoptimized={src.endsWith(".svg") || src.includes("/locked/")}
      // Stops the picture being dragged out of the page (it does not hide the file from anyone who looks).
      draggable={false}
      className="h-auto w-full select-none"
    />
  );
  return (
    <figure className="flex min-w-0 flex-col gap-item-12">
      {label && (
        <figcaption className="font-mono text-mono-m uppercase text-text-muted">
          {label}
        </figcaption>
      )}
      {scroll ? (
        <div
          role="region"
          tabIndex={0}
          aria-label="Diagram, scrolls sideways"
          className="overflow-x-auto"
        >
          <div className="min-w-width-640">{image}</div>
        </div>
      ) : natural ? (
        <div className="mx-auto w-full" style={{ maxWidth: width }}>
          {image}
        </div>
      ) : (
        image
      )}
    </figure>
  );
}

type VideoFigureProps = {
  video: string;
  /** Describes the clip for screen readers. */
  alt: string;
  /** The clip's pixel size. */
  size: { width: number; height: number };
  /** Caption drawn as real text in the panel's top-left corner. Leave out for a picture that carries its own labels: it then gets 20px of padding all round. */
  label?: string;
};

/**
 * A looping screen recording on a panel, with its caption as real text. The panel is 600px high; the clip is an app
 * screen that fills the height under the caption and runs off the bottom edge. Pause and replay buttons show on hover.
 */
export function VideoFigure({ video, alt, size, label }: VideoFigureProps) {
  return (
    <figure className="group/clip relative flex h-item-600 min-w-0 flex-col border-(length:--stroke-hairline) border-border-canvas-subtle bg-surface-canvas">
      <figcaption className="px-item-20 py-item-20 font-mono text-mono-l uppercase text-text-sub-headers">
        {label}
      </figcaption>
      <div className="flex min-h-0 w-full max-w-item-320 flex-1 justify-center self-center">
        <LoopVideo
          src={video}
          label={alt}
          size={size}
          controls
          className="h-full w-auto max-w-full"
        />
      </div>
    </figure>
  );
}

type ImageFigureProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Caption drawn as real text in the panel's top-left corner. */
  label: string;
  /** Marks the option that was chosen: the caption turns blue. */
  selected?: boolean;
  /**
   * For a picture that carries its own canvas-coloured background: it runs edge to edge
   * under the caption, on the canvas colour, instead of floating inside the panel padding.
   */
  bleed?: boolean;
  /** With `bleed`: keeps 20px of canvas on the left, right and bottom of the picture. */
  inset?: boolean;
  /** For a screenshot: rounded corners, the soft image shadow and a canvas-coloured panel. */
  framed?: boolean;
  /** 16px of padding all round instead of 20px. */
  compact?: boolean;
  /** With `framed`: 4px corners instead of 8px. */
  small?: boolean;
  /**
   * Panel colour. `info` is cool grey for a neutral figure, `problem` amber for something that
   * went wrong, `solution` cool grey with a blue caption for the fix, `dark` near-black for a dark
   * screenshot. Left out, the panel is canvas.
   */
  tone?: "info" | "problem" | "solution" | "dark";
  /** No padding under the picture, for one that is cropped to run off the bottom of the panel. With `framed`, only the top corners are rounded. */
  flush?: boolean;
};

const panelTone = {
  info: { panel: "border-border-info bg-surface-info", label: "text-text-muted" },
  problem: { panel: "border-border-warning bg-surface-warning", label: "text-text-warning" },
  solution: { panel: "border-border-info bg-surface-info", label: "text-text-info" },
  dark: { panel: "border-border-canvas-subtle bg-surface-dark", label: "text-text-on-inverted" },
};

/**
 * A wide diagram (a transparent image) on a panel, with its caption as real text. The
 * diagram scales down with the panel and never overflows it. Pictures with their own canvas
 * background use `bleed`, which runs them edge to edge on a canvas-coloured panel.
 */
export function ImageFigure({
  src,
  alt,
  width,
  height,
  label,
  selected,
  bleed,
  inset,
  framed,
  compact,
  small,
  tone,
  flush,
}: ImageFigureProps) {
  return (
    <figure
      className={`flex min-w-0 flex-col border-(length:--stroke-hairline) ${tone ? panelTone[tone].panel : "border-border-canvas-subtle bg-surface-canvas"}`}
    >
      {label !== undefined && (
        <figcaption
          className={`${compact ? "p-item-16" : "p-item-20"} font-mono text-mono-l uppercase ${tone ? panelTone[tone].label : selected ? "text-text-accent-cool" : "text-text-sub-headers"}`}
        >
          {label}
        </figcaption>
      )}
      <div
        className={
          bleed
            ? inset
              ? "px-item-20 pb-item-20"
              : undefined
            : label === undefined
              ? compact
                ? "p-item-16"
                : "p-item-20"
              : flush
                ? // The shadow is clipped at the panel's bottom edge; the 8px of padding on top leaves room for it.
                  `${compact ? "px-item-16" : "px-item-20"} -mt-item-8 overflow-clip pt-item-8`
                : `${compact ? "p-item-16" : "p-item-20"} pt-0`
        }
      >
        <ZoomImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 80rem) 740px, 100vw"
          quality={90}
          className={`h-auto w-full ${framed ? `${flush ? (small ? "rounded-t-image-sm" : "rounded-t-image") : small ? "rounded-image-sm" : "rounded-image"} shadow-image` : ""}`}
        />
      </div>
    </figure>
  );
}

/**
 * A wide screen recording on a canvas panel, with its caption as real text. The clip loops, has
 * rounded corners and the image shadow, and shows pause and replay buttons on hover.
 */
export function VideoPanel({
  video,
  alt,
  size,
  label,
  small,
  controls = true,
  cover,
  compact,
  captions,
  tone,
}: {
  video: string;
  alt: string;
  size: { width: number; height: number };
  label: string;
  /** Changes the caption as the clip plays: each step shows from its `at` second. The first step replaces `label`. */
  captions?: TimedCaptionStep[];
  /** Tighter 4px corners, for a clip shown in a narrow panel. */
  small?: boolean;
  /** Pause and replay buttons on hover; turn off for a very short clip. */
  controls?: boolean;
  /** Crops the clip to fill `size` (its box) instead of showing it whole, to line up with neighbouring panels. */
  cover?: boolean;
  /** 16px of padding all round instead of 20px. */
  compact?: boolean;
  /** Panel colour, as on ImageFigure. Left out, the panel is canvas. */
  tone?: "info" | "problem" | "solution" | "dark";
}) {
  return (
    <figure
      className={`group/clip relative flex min-w-0 flex-col border-(length:--stroke-hairline) ${tone ? panelTone[tone].panel : "border-border-canvas-subtle bg-surface-canvas"}`}
    >
      {captions ? (
        <TimedCaption
          steps={captions}
          className={`${compact ? "p-item-16" : "p-item-20"} font-mono text-mono-l uppercase ${tone ? panelTone[tone].label : "text-text-sub-headers"}`}
        />
      ) : (
        <figcaption className={`${compact ? "p-item-16" : "p-item-20"} font-mono text-mono-l uppercase ${tone ? panelTone[tone].label : "text-text-sub-headers"}`}>
          {label}
        </figcaption>
      )}
      <div className={`${compact ? "p-item-16" : "p-item-20"} pt-0`}>
        <LoopVideo
          src={video}
          label={alt}
          size={size}
          controls={controls}
          className={`h-auto w-full shadow-image ${cover ? "object-cover" : ""} ${small ? "rounded-image-sm" : "rounded-image"}`}
        />
      </div>
    </figure>
  );
}

/** A picture with a mono caption underneath, inside a 300px-high frame (cropped to fill). */
export function Shot({
  src,
  alt,
  width,
  height,
  label,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  label: string;
}) {
  return (
    <figure className="flex min-w-0 flex-col gap-item-8">
      <div className="h-item-300 overflow-clip border-(length:--stroke-hairline) border-border-canvas-subtle">
        <ZoomImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 80rem) 380px, 100vw"
          quality={90}
          className="h-item-300 w-full object-cover"
        />
      </div>
      <figcaption className="font-mono text-mono-l uppercase text-text-sub-headers">
        {label}
      </figcaption>
    </figure>
  );
}

/**
 * A picture on a panel (cropped to a 440 by 400 box) with a short titled note beside it, level
 * with the panel's bottom edge. Stacks below 768px.
 */
export function ImageText({
  src,
  video,
  alt,
  width,
  height,
  title,
  children,
}: {
  /** A picture, or a looping `video` in its place (then `width` and `height` are the clip's size). */
  src?: string;
  video?: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-end gap-item-32 max-md:flex-col max-md:items-stretch">
      <div className="group/clip relative h-item-400 w-width-440 max-w-full shrink-0 overflow-clip border-(length:--stroke-hairline) border-border-canvas-subtle bg-surface-canvas max-md:w-full">
        {video ? (
          <LoopVideo
            src={video}
            label={alt}
            size={{ width, height }}
            controls
            className="h-item-400 w-full object-cover"
          />
        ) : (
          <ZoomImage
            src={src ?? ""}
            alt={alt}
            width={width}
            height={height}
            sizes="(min-width: 50rem) 440px, 100vw"
            quality={90}
            className="h-item-400 w-full object-cover"
          />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-item-8">
        <h3 className="font-heading font-wonk text-heading-fraunces-md font-normal text-text-primary">
          {title}
        </h3>
        <div className={bodyClass}>{children}</div>
      </div>
    </div>
  );
}

type ScreenCompareProps = {
  items: { label: string; src: string; alt: string }[];
};

/**
 * Two phone screens side by side, each on a panel under its own caption. The phone
 * hangs off the bottom of the panel, so only the top of the screen shows. Stacks below 768px.
 */
export function ScreenCompare({ items }: ScreenCompareProps) {
  return (
    <div className="grid grid-cols-2 gap-item-20 pb-item-28 max-md:grid-cols-1">
      {items.map(({ label, src, alt }) => (
        // Two rows each, shared with the neighbour, so panels line up even when a caption wraps.
        <figure key={src} className="row-span-2 grid min-w-0 grid-rows-subgrid gap-y-item-12">
          <figcaption className="font-mono text-mono-m uppercase text-text-sub-headers">
            {label}
          </figcaption>
          <div className="relative aspect-38/41 w-full overflow-hidden border-(length:--stroke-hairline) border-border-canvas-subtle bg-surface-canvas max-md:aspect-auto max-md:h-item-410">
            <Image
              src={src}
              alt={alt}
              width={960}
              height={1959}
              sizes="(min-width: 50rem) 320px, 100vw"
              className="absolute top-item-28 left-1/2 h-auto w-5/6 max-w-item-320 -translate-x-1/2"
            />
          </div>
        </figure>
      ))}
    </div>
  );
}

/** Two pictures side by side (or three with `cols={3}`), stacked on narrow screens. */
export function Pair({
  children,
  cols = 2,
  tight,
}: {
  children: ReactNode;
  cols?: 2 | 3;
  /** A 16px gap between the pictures instead of 20px. */
  tight?: boolean;
}) {
  return (
    <div
      className={`grid items-start ${tight ? "gap-item-16" : "gap-item-20"} max-md:grid-cols-1 ${cols === 3 ? "grid-cols-3" : "grid-cols-2"}`}
    >
      {children}
    </div>
  );
}

/** Metric cards in a row: two across, or three when there are three cards. */
export function Stats({ children }: { children: ReactNode }) {
  return (
    <div
      className={`grid gap-item-20 max-md:grid-cols-1 ${Children.count(children) === 3 ? "grid-cols-3" : "grid-cols-2"}`}
    >
      {children}
    </div>
  );
}

export function Stat({
  value,
  label,
  children,
  spaced,
  smallLabel,
}: {
  value: string;
  label: string;
  children?: ReactNode;
  /** 16px between the number and its label. */
  spaced?: boolean;
  /** A 16px label instead of 20px. */
  smallLabel?: boolean;
}) {
  return (
    <div className="flex flex-col gap-item-24 border-(length:--stroke-rule) border-border-subtle bg-surface-canvas p-item-24">
      <div className={`flex flex-col ${spaced ? "gap-item-16" : ""}`}>
        <p className="font-heading font-wonk text-heading-fraunces-metric italic text-text-primary">
          <CountUp value={value} />
        </p>
        <p className={`font-sans font-medium text-text-body ${smallLabel ? "text-paragraph-md" : "text-paragraph-quote"}`}>
          {label}
        </p>
      </div>
      {children && <div className={bodyClass}>{children}</div>}
    </div>
  );
}

/**
 * A pulled-out finding, with a blue rule down the left. With `author` it is a spoken quote on a
 * canvas panel: a blue quotation mark above the words and the speaker's name below.
 */
export function Quote({ children, author }: { children: ReactNode; author?: string }) {
  if (author) {
    return (
      <blockquote className="flex flex-col gap-item-12 border-l-(length:--stroke-sticker) border-blue-300 bg-surface-canvas py-item-20 pl-item-36 font-sans text-paragraph-blockquote text-text-muted">
        <Image src="/images/case-studies/ui/quote.svg" alt="" width={16} height={16} aria-hidden="true" className="size-item-16 self-start" />
        {children}
        <cite className="font-bold not-italic">{author}</cite>
      </blockquote>
    );
  }
  return (
    <blockquote className="flex flex-col gap-item-28 border-l-(length:--stroke-sticker) border-blue-300 pl-item-36 font-sans text-paragraph-blockquote text-text-muted">
      {children}
    </blockquote>
  );
}

/** A note that sits in the flow of the text on a canvas panel, with a small icon beside its heading. */
export function Callout({
  icon,
  title,
  children,
}: {
  /** Path of an SVG in public/images/case-studies/ui. */
  icon: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="flex gap-item-12 border-(length:--stroke-hairline) border-border-canvas-subtle bg-surface-canvas p-item-20">
      <Image src={icon} alt="" width={24} height={24} aria-hidden="true" className="size-item-24 shrink-0 self-start" />
      <div className="flex min-w-0 flex-col gap-item-8">
        <p className="font-sans text-paragraph-md font-bold text-text-body">{title}</p>
        <div className={bodyClass}>{children}</div>
      </div>
    </aside>
  );
}

/** A titled set of white cards, two to a row, each with an icon, an italic name and a short note. */
export function Insights({ title, children }: { title: string; children: ReactNode }) {
  return (
    // The section's 28px gap plus 32px here leaves 60px between the intro and the heading.
    <div className="mt-item-32 flex flex-col gap-item-20">
      <h3 className={eyebrowClass}>{title}</h3>
      <div className="grid grid-cols-2 gap-item-20 max-md:grid-cols-1">{children}</div>
    </div>
  );
}

export function Insight({
  icon,
  title,
  children,
}: {
  /** Path of an SVG in public/images/case-studies/ui. */
  icon: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-item-20 border-(length:--stroke-hairline) border-border-subtle bg-surface-raised p-item-24">
      <Image src={icon} alt="" width={24} height={24} aria-hidden="true" className="size-item-24 self-start" />
      <div className="flex flex-col gap-item-8">
        <h4 className="font-heading font-wonk text-heading-fraunces-lg font-normal italic text-text-body">
          {title}
        </h4>
        {/* Text written in the MDX arrives as a paragraph with the body style, so the card's 14px is set on it. */}
        <div className="font-sans text-label-sm text-text-muted [&>p]:text-label-sm">{children}</div>
      </div>
    </div>
  );
}

/** Bold italic azure emphasis, used inside a Quote. */
export function Mark({ children }: { children: ReactNode }) {
  return (
    <strong className="font-semibold italic text-text-accent-cool">
      {children}
    </strong>
  );
}

type Service = {
  title: string;
  image: { src: string; alt: string; width: number; height: number };
  rows: [label: string, value: string][];
};

/** The two travel services side by side: a map of how each runs and a short fact table. */
export function ServiceCompare({ services }: { services: Service[] }) {
  return (
    <div className="grid grid-cols-2 gap-item-20 max-md:grid-cols-1">
      {services.map(({ title, image, rows }) => (
        <div
          key={title}
          className="flex min-w-0 flex-col gap-item-20 border-(length:--stroke-hairline) border-border-canvas-subtle bg-surface-canvas px-item-20 py-item-24"
        >
          <h3 className="font-heading font-wonk text-heading-fraunces-md font-normal text-text-primary">
            {title}
          </h3>
          <ZoomImage
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 48rem) 400px, 100vw"
            className="h-auto w-full"
          />
          <dl className="flex flex-col">
            {rows.map(([label, value], index) => (
              <div
                key={label}
                className={`grid grid-cols-[1fr_3fr] items-center gap-x-item-16 py-item-16 first:pt-0 last:pb-0 ${
                  index < rows.length - 1
                    ? "border-b-(length:--stroke-hairline) border-border-subtle"
                    : ""
                }`}
              >
                <dt className="font-mono text-mono-m uppercase text-text-muted">
                  {label}
                </dt>
                <dd className="font-sans text-label-sm text-text-primary">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

type ShowcaseProps = {
  /**
   * Two phone screens, side by side. Each is the phone alone: an image with a transparent
   * background (`src`) or a looping clip (`video`). The panel behind it is drawn here.
   */
  screens: ({ src: string; alt: string } | { video: string; alt: string })[];
  title: string;
  children: ReactNode;
};

/** Two phone screens with a short explanation beside them. */
export function Showcase({ screens, title, children }: ShowcaseProps) {
  return (
    // The text stacks below the screens once it would be narrower than 244px: two 210px
    // panels, two 20px gaps and 244px of text is 704px (--container-showcase).
    <div className="@container">
      <div className="flex flex-col items-start gap-item-20 @showcase:flex-row @showcase:items-end">
        <div className="flex shrink-0 flex-wrap gap-item-20">
          {screens.map((screen) => (
            <div
              key={"video" in screen ? screen.video : screen.src}
              className="group/clip relative flex w-item-210 items-center justify-center border-(length:--stroke-hairline) border-border-canvas-subtle bg-surface-canvas py-item-18"
            >
              {"video" in screen ? (
                <LoopVideo
                  src={screen.video}
                  label={screen.alt}
                  size={{ width: 1052, height: 2160 }}
                  controls
                group={title}
                  className="h-auto w-item-156"
                />
              ) : (
                <Image
                  src={screen.src}
                  alt={screen.alt}
                  width={312}
                  height={637}
                  sizes="156px"
                  className="h-auto w-item-156"
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex min-w-0 flex-col gap-item-12 pb-item-28 @showcase:flex-1 @showcase:pb-item-8 @showcase:pl-item-14">
          <h3 className="font-heading font-wonk text-heading-fraunces-md font-normal text-text-primary">
            {title}
          </h3>
          <div className={`${bodyClass} flex flex-col gap-item-12`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
