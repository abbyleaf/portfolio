"use client";

import Image from "next/image";
import { useState } from "react";

type CompareSliderProps = {
  before: string;
  after: string;
  /** Describes both pictures: what changed from before to after. */
  alt: string;
  width: number;
  height: number;
};

/**
 * Two pictures of the same screen with a draggable divider: the left of the line shows
 * "Before", the right "After". It is a real range input laid over the pictures, so it works
 * with a finger, a mouse and the arrow keys, and screen readers announce it as a slider.
 */
export function CompareSlider({ before, after, alt, width, height }: CompareSliderProps) {
  const [position, setPosition] = useState(50);
  // Pictures behind the password are served as they are (see ZoomImage).
  const unoptimized = after.includes("/locked/");

  return (
    <figure className="flex min-w-0 flex-col border-(length:--stroke-hairline) border-border-info bg-surface-info">
      <div className="px-item-20 pt-item-20">
        <div className="relative has-[input:focus-visible]:outline-(length:--stroke-sticker) has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-azure-55">
          <Image
            src={after}
            alt=""
            width={width}
            height={height}
            sizes="(min-width: 80rem) 740px, 100vw"
            quality={90}
            unoptimized={unoptimized}
            className="block h-auto w-full rounded-image"
          />
          <Image
            src={before}
            alt=""
            width={width}
            height={height}
            sizes="(min-width: 80rem) 740px, 100vw"
            quality={90}
            unoptimized={unoptimized}
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            className="absolute inset-0 block h-full w-full rounded-image"
          />
          <div
            aria-hidden="true"
            style={{ left: `${position}%` }}
            className="pointer-events-none absolute inset-y-0 w-item-2 -translate-x-1/2 bg-surface-info"
          />
          <div
            aria-hidden="true"
            style={{ left: `${position}%` }}
            className="pointer-events-none absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center rounded-pill border-(length:--stroke-rule) border-surface-info bg-grey-900 px-item-12 py-item-2"
          >
            <svg width="40" height="24" viewBox="0 0 40 24" fill="none" className="text-surface-primary">
              <path
                d="M1.42 11.91 5.2 15.71c.14.14.21.3.21.49 0 .19-.07.35-.22.5-.14.14-.31.21-.5.21-.19 0-.35-.07-.5-.22L.41 12.92a1.4 1.4 0 0 1 0-2.01l3.79-3.79c.14-.14.3-.2.49-.2.19 0 .36.07.51.22.15.14.22.31.21.49 0 .19-.07.36-.21.5l-3.78 3.78Z"
                fill="currentColor"
              />
              <path
                d="m34.81 8.13 3.76 3.78-3.76 3.78c-.14.15-.21.31-.21.5 0 .18.07.34.21.49.15.14.31.22.5.22.19 0 .36-.07.5-.21l3.77-3.77a1.4 1.4 0 0 0 0-2.01l-3.77-3.77a.7.7 0 0 0-.5-.2c-.19.01-.36.08-.5.23-.14.14-.21.31-.21.5 0 .18.07.34.21.48Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={position}
            onChange={(event) => setPosition(Number(event.target.value))}
            aria-label={`Compare before and after. ${alt}`}
            aria-valuetext={`${position}% before`}
            className="absolute inset-0 m-0 h-full w-full cursor-ew-resize appearance-none opacity-0"
          />
        </div>
      </div>
      <figcaption className="grid grid-cols-[1fr_auto_1fr] items-center gap-item-12 px-item-20 py-item-16">
        <span className="font-heading font-wonk text-label-sm font-semibold italic text-text-info">Before</span>
        <span className="font-mono text-stamp-xs uppercase text-text-muted max-sm:hidden">
          Drag slider left &amp; right
        </span>
        <span className="col-start-3 justify-self-end font-heading font-wonk text-label-sm font-semibold italic text-text-info">
          After
        </span>
      </figcaption>
    </figure>
  );
}
