import Image from "next/image";
import { Children, type ReactNode } from "react";

import { LoopVideo } from "./LoopVideo";
import { ZoomImage } from "./ZoomImage";

/*
 * Building blocks for case study MDX (see mdx-components.tsx). Case study text and picture
 * choices live in content/case-studies/*.mdx; these only draw them.
 */

const eyebrowClass =
  "font-sans text-heading-inter-sm uppercase text-text-sub-headers";
const bodyClass = "font-sans text-paragraph-md text-text-muted";
const titleClass =
  "font-heading font-wonk text-heading-fraunces-xl text-text-primary";

type SectionProps = {
  /** Anchor for the contents rail; matches an entry in the frontmatter `toc`. */
  id?: string;
  eyebrow: string;
  /** Left out when the eyebrow is the only heading (the eyebrow then becomes the h2). */
  title?: string;
  /** The paragraph under the title. */
  intro?: string;
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
            <div className="flex flex-col gap-item-12">
              <p className={eyebrowClass}>{eyebrow}</p>
              <h2 id={id ? `${id}-title` : undefined} className={titleClass}>
                {title}
              </h2>
            </div>
          ) : (
            <h2 id={id ? `${id}-title` : undefined} className={eyebrowClass}>
              {eyebrow}
            </h2>
          )}
          {intro && <p className={bodyClass}>{intro}</p>}
        </header>
        {children}
      </section>
    </>
  );
}

/** A heading inside a section that opens a new point, with the text that follows it. */
export function Subhead({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-item-20">
      <h3 className={titleClass}>{title}</h3>
      {/* Paragraphs written inside a block are plain HTML, so this sets their text style. */}
      <div className={`${bodyClass} flex flex-col gap-item-20`}>{children}</div>
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
  /** Caption drawn as real text in the panel's top-left corner. */
  label: string;
};

/**
 * A looping screen recording on a panel, with its caption as real text. The panel is 600px high; the clip is an app
 * screen that fills the height under the caption and runs off the bottom edge. Pause and replay buttons show on hover.
 */
export function VideoFigure({ video, alt, size, label }: VideoFigureProps) {
  return (
    <figure className="group/clip relative flex h-item-600 min-w-0 flex-col border-(length:--stroke-rule) border-border-canvas-subtle bg-surface-panel">
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
  /** For a screenshot: rounded corners, the soft image shadow and a canvas-coloured panel. */
  framed?: boolean;
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
  framed,
}: ImageFigureProps) {
  return (
    <figure
      className={`flex min-w-0 flex-col border-(length:--stroke-rule) border-border-canvas-subtle ${bleed || framed ? "bg-surface-canvas" : "bg-surface-panel"}`}
    >
      <figcaption
        className={`px-item-20 py-item-20 font-mono text-mono-l uppercase ${selected ? "text-text-accent-cool" : "text-text-sub-headers"}`}
      >
        {label}
      </figcaption>
      <div className={bleed ? undefined : "p-item-20 pt-0"}>
        <ZoomImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 80rem) 740px, 100vw"
          quality={90}
          className={`h-auto w-full ${framed ? "rounded-image shadow-image" : ""}`}
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
}: {
  video: string;
  alt: string;
  size: { width: number; height: number };
  label: string;
}) {
  return (
    <figure className="flex min-w-0 flex-col border-(length:--stroke-rule) border-border-canvas-subtle bg-surface-canvas">
      <figcaption className="px-item-20 py-item-20 font-mono text-mono-l uppercase text-text-sub-headers">
        {label}
      </figcaption>
      <div className="p-item-20 pt-0">
        <div className="group/clip relative">
          <LoopVideo
            src={video}
            label={alt}
            size={size}
            controls
            className="h-auto w-full rounded-image shadow-image"
          />
        </div>
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
      <div className="h-item-300 overflow-clip border-(length:--stroke-rule) border-border-canvas-subtle">
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
  alt,
  width,
  height,
  title,
  children,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-end gap-item-32 max-md:flex-col max-md:items-stretch">
      <div className="h-item-400 w-width-440 max-w-full shrink-0 overflow-clip border-(length:--stroke-rule) border-border-canvas-subtle bg-surface-panel max-md:w-full">
        <ZoomImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 50rem) 440px, 100vw"
          quality={90}
          className="h-item-400 w-full object-cover"
        />
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
          <div className="relative aspect-38/41 w-full overflow-hidden border-(length:--stroke-rule) border-border-canvas-subtle bg-surface-canvas max-md:aspect-auto max-md:h-item-410">
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
export function Pair({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 }) {
  return (
    <div
      className={`grid items-start gap-item-20 max-md:grid-cols-1 ${cols === 3 ? "grid-cols-3" : "grid-cols-2"}`}
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
}: {
  value: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-item-24 border-(length:--stroke-rule) border-border-subtle bg-surface-canvas p-item-24">
      <div className="flex flex-col">
        <p className="font-heading font-wonk text-heading-fraunces-metric italic text-text-primary">
          {value}
        </p>
        <p className="font-sans text-paragraph-quote font-medium text-text-body">
          {label}
        </p>
      </div>
      <div className={bodyClass}>{children}</div>
    </div>
  );
}

/** A pulled-out finding, with a blue rule down the left. */
export function Quote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="flex flex-col gap-item-28 border-l-(length:--stroke-sticker) border-blue-300 pl-item-36 font-sans text-paragraph-blockquote text-text-muted">
      {children}
    </blockquote>
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
              className="group/clip relative flex w-item-210 items-center justify-center border-(length:--stroke-rule) border-border-canvas-subtle bg-surface-panel py-item-18"
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
