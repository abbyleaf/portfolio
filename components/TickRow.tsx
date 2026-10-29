"use client";

import { useEffect, useRef } from "react";

const TICK_COUNT = 33;
const REACH = 90;
const BOOST = 14;

type TickRowProps = {
  isTop: boolean;
};

/**
 * The ticks of a Ruler strip. They swell towards the cursor like a magnifier,
 * a marker slides along the strip as the page scrolls, and clicking jumps to that
 * point in the page. The strip is decorative for assistive tech; the header nav
 * is the accessible way to move around.
 */
export function TickRow({ isTop }: TickRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const ticks = Array.from(row.querySelectorAll<HTMLElement>("[data-tick]"));
    const reset = () => ticks.forEach((tick) => (tick.style.height = ""));

    let frame = 0;
    const place = () => {
      frame = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / max));
      if (markerRef.current) markerRef.current.style.left = `calc(${progress * 100}% - ${progress * 2}px)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(place);
    };
    const onMove = (event: PointerEvent) => {
      for (const tick of ticks) {
        const rect = tick.getBoundingClientRect();
        const distance = Math.abs(event.clientX - (rect.left + rect.width / 2));
        const base = Number(tick.dataset.base);
        const boost = Math.max(0, 1 - distance / REACH) * BOOST;
        tick.style.height = `${base + boost}px`;
      }
    };

    const onClick = (event: MouseEvent) => {
      const rect = row.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: ratio * max, behavior: reduce ? "auto" : "smooth" });
    };

    place();
    window.addEventListener("scroll", onScroll, { passive: true });
    row.addEventListener("pointermove", onMove);
    row.addEventListener("pointerleave", reset);
    row.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      row.removeEventListener("pointermove", onMove);
      row.removeEventListener("pointerleave", reset);
      row.removeEventListener("click", onClick);
      if (frame) cancelAnimationFrame(frame);
      reset();
    };
  }, []);

  return (
    <div
      ref={rowRef}
      aria-hidden="true"
      className={`relative mx-item-52 flex min-w-0 flex-1 justify-center gap-item-m self-stretch overflow-hidden ${
        isTop ? "items-end" : "items-start"
      } cursor-crosshair`}
    >
      {Array.from({ length: TICK_COUNT }, (_, i) => {
        const long = i % 4 === 0;
        return (
          <span
            key={i}
            data-tick=""
            data-base={long ? 12 : 6}
            className={`w-px shrink-0 bg-grey-900 ${long ? "h-item-12" : "h-item-6"}`}
          />
        );
      })}
      <span
        ref={markerRef}
        className="absolute inset-y-0 left-0 w-item-2 bg-surface-accent-cool/60"
      />
    </div>
  );
}
