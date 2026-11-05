import Image from "next/image";
import type { ReactNode } from "react";

import { LoopVideo } from "./LoopVideo";

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
  title: string;
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
        className="flex scroll-mt-item-20 flex-col gap-item-28"
      >
        <header className="flex flex-col gap-item-20">
          <div className="flex flex-col gap-item-12">
            <p className={eyebrowClass}>{eyebrow}</p>
            <h2 id={id ? `${id}-title` : undefined} className={titleClass}>
              {title}
            </h2>
          </div>
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
  sizes = "(min-width: 50rem) 780px, 100vw",
}: FigureProps) {
  const image = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className="h-auto w-full"
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
 * A looping screen recording on a panel, with its caption as real text. The clip is an app
 * screen that runs off the bottom edge of the panel. Pause and replay buttons show on hover.
 */
export function VideoFigure({ video, alt, size, label }: VideoFigureProps) {
  return (
    <figure className="group/clip relative flex min-w-0 flex-col border-(length:--stroke-rule) border-border-canvas-subtle bg-surface-panel">
      <figcaption className="px-item-16 py-item-16 font-mono text-mono-m uppercase text-text-muted">
        {label}
      </figcaption>
      <LoopVideo
        src={video}
        label={alt}
        size={size}
        controls
        className="mx-auto h-auto w-item-210"
      />
    </figure>
  );
}

/** Two pictures side by side, stacked on narrow screens. */
export function Pair({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 items-start gap-item-20 max-md:grid-cols-1">
      {children}
    </div>
  );
}

/** Metric cards in a row. */
export function Stats({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-item-20 max-md:grid-cols-1">
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
    <blockquote className="flex flex-col gap-item-28 border-l-(length:--stroke-sticker) border-blue-300 pl-item-36 font-sans text-paragraph-quote text-text-muted">
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
          <Image
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
