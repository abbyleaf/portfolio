"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

type ZoomImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  quality?: 75 | 90;
  className?: string;
};

/*
 * The lightbox follows the artylope.com case study pages: a plain paper-coloured backdrop,
 * a single close button (no shadow), with the full-size original shown instead of the
 * resized copy. Zoom still works by scroll wheel, pinch or double-click. Colours come from
 * the theme tokens in app/globals.css.
 */
const lightboxVars: { [name: `--yarl__${string}`]: string } = {
  "--yarl__container_background_color": "var(--color-surface-primary)",
  "--yarl__color_button": "var(--color-text-primary)",
  "--yarl__color_button_active": "var(--color-text-accent-cool)",
  "--yarl__color_button_disabled": "var(--color-text-disabled)",
  "--yarl__slide_title_color": "var(--color-text-primary)",
  "--yarl__button_filter": "none",
  // The close icon is a 14-unit cross in a 24-unit box, so this box makes the cross 16px wide.
  "--yarl__icon_size": "calc(var(--spacing-item-16) * 24 / 14)",
};

/** A picture that opens full size in a lightbox when clicked, tapped or activated by keyboard. */
export function ZoomImage({ src, alt, width, height, sizes, quality, className }: ZoomImageProps) {
  const [open, setOpen] = useState(false);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View larger: ${alt}`}
        className="block w-full cursor-zoom-in"
      >
        <Image
          src={src}
          alt=""
          width={width}
          height={height}
          sizes={sizes}
          quality={quality}
          className={className}
        />
      </button>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src, alt, width, height }]}
        plugins={[Zoom]}
        carousel={{ finite: true }}
        controller={{ closeOnBackdropClick: true }}
        animation={reducedMotion ? { fade: 0, swipe: 0, zoom: 0 } : undefined}
        styles={{
          root: lightboxVars,
          container: { padding: "var(--spacing-item-32)" },
        }}
        render={{ buttonPrev: () => null, buttonNext: () => null, buttonZoom: () => null }}
      />
    </>
  );
}
