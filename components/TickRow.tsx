"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** Up to one tick per 33px of strip (1px line + 32px gap), spread evenly across it. */
const TICK_PITCH = 33;
const TICK_GAP = 32;
const MIN_TICKS = 6;
/** Strip width a numeral takes up beside its tick. */
const NUMERAL_ROOM = 20;
const DEFAULT_TICKS = 33;
const REACH = 90;
const BOOST = 14;
/** Clicks this close to a section mark (as a share of the strip) land on it. */
const SNAP = 0.025;
/** Matches `scroll-padding-top` in globals.css, so a jump lands below the pinned bars. */
const SCROLL_OFFSET = 96;

type Section = {
  label: string;
  ratio: number;
  mark: number;
  tick: HTMLElement;
  /** Whether the strip had room to draw this section's numbered mark. */
  drawn: boolean;
};

type TickRowProps = {
  isTop: boolean;
};

/**
 * The ticks of a Ruler strip. They swell towards the cursor like a magnifier,
 * a marker slides along the strip as the page scrolls, and clicking jumps to that
 * point in the page. Elements tagged `data-ruler-section` get a capped tick, and
 * a label names where a click would land. The strip is decorative for assistive
 * tech; the header nav is the accessible way to move around.
 */
export function TickRow({ isTop }: TickRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);
  const [tickCount, setTickCount] = useState(DEFAULT_TICKS);
  // Pages stay mounted (hidden) after a client-side navigation, so re-measure on every route.
  const pathname = usePathname();

  // Fit as many ticks as the strip holds, so none are cut off when it narrows.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const fit = () => {
      const fits = Math.floor((row.clientWidth + TICK_GAP) / TICK_PITCH);
      setTickCount(Math.max(MIN_TICKS, fits));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(row);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    const hint = hintRef.current;
    if (!row || !hint) return;
    const ticks = Array.from(row.querySelectorAll<HTMLElement>("[data-tick]"));
    const reset = () => ticks.forEach((tick) => (tick.style.height = ""));
    const scrollRange = () =>
      Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    let sections: Section[] = [];
    let marks: HTMLElement[] = [];
    let hidden: HTMLElement[] = [];
    const measure = () => {
      const max = scrollRange();
      const rowRect = row.getBoundingClientRect();
      sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-ruler-section]"),
      )
        // Earlier pages kept hidden by the router are not part of this page.
        .filter((el) => el.getClientRects().length > 0)
        .map((el) => ({
          label: el.dataset.rulerSection ?? "",
          ratio: Math.min(
            1,
            Math.max(0, (el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET) / max),
          ),
          mark: 0,
          tick: ticks[0],
          drawn: false,
        }))
        .sort((a, b) => a.ratio - b.ratio);

      // Each section mark replaces the ruler tick nearest to its place in the page,
      // so it sits on the same grid as the other lines.
      hidden.forEach((tick) => (tick.style.visibility = ""));
      hidden = [];
      const taken = new Set<HTMLElement>();
      for (const section of sections) {
        let best = Infinity;
        for (const tick of ticks) {
          if (taken.has(tick)) continue;
          const rect = tick.getBoundingClientRect();
          const mark = (rect.left + rect.width / 2 - rowRect.left) / rowRect.width;
          if (Math.abs(mark - section.ratio) < best) {
            best = Math.abs(mark - section.ratio);
            section.mark = mark;
            section.tick = tick;
          }
        }
        taken.add(section.tick);
        section.tick.style.visibility = "hidden";
        hidden.push(section.tick);
      }

      marks.forEach((mark) => mark.remove());
      // Like the numerals on a printed ruler: a taller tick from the same edge as
      // the others, with its index beside it.
      // Each numeral goes to the right of its tick, or to the left when the right is
      // taken. A section with no free side gets no mark, and its tick stays plain.
      const xs = sections.map((section) => section.mark * rowRect.width);
      const placed: [number, number][] = [];
      const fits = (from: number, to: number) =>
        from >= 0 &&
        to <= rowRect.width &&
        !placed.some(([a, b]) => from < b && to > a) &&
        !xs.some((x) => x > from && x < to);
      marks = [];
      sections.forEach((section, index) => {
        const x = xs[index];
        const side = fits(x, x + NUMERAL_ROOM)
          ? "right"
          : fits(x - NUMERAL_ROOM, x)
            ? "left"
            : null;
        if (!side) {
          section.tick.style.visibility = "";
          return;
        }
        placed.push(side === "right" ? [x, x + NUMERAL_ROOM] : [x - NUMERAL_ROOM, x]);
        section.drawn = true;

        const mark = document.createElement("span");
        mark.className = `pointer-events-none absolute h-item-12 w-px bg-grey-900 ${
          isTop ? "bottom-0" : "top-0"
        }`;
        mark.style.left = `calc(${section.mark * 100}% - 0.5px)`;
        row.append(mark);

        const numeral = document.createElement("span");
        numeral.textContent = String(marks.length + 1).padStart(2, "0");
        numeral.className = `absolute bg-surface-canvas font-mono text-stamp-xs leading-none text-text-primary ${
          isTop ? "top-0" : "bottom-0"
        } ${side === "right" ? "left-px pl-item-4" : "right-px pr-item-4"}`;
        mark.append(numeral);
        marks.push(mark);
      });
    };

    // The section a click at `ratio` lands in, snapping to a nearby section start.
    const target = (ratio: number) => {
      const near = sections.find(
        (section) => section.drawn && Math.abs(section.mark - ratio) <= SNAP,
      );
      if (near) return near;
      const within = sections.filter((section) => section.ratio <= ratio);
      return { label: within.at(-1)?.label ?? sections[0]?.label ?? "", ratio };
    };
    const ratioAt = (clientX: number) => {
      const rect = row.getBoundingClientRect();
      return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    };

    let frame = 0;
    const place = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollRange()));
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

      if (event.pointerType !== "mouse") return;
      const { label } = target(ratioAt(event.clientX));
      if (!label) return;
      const rect = row.getBoundingClientRect();
      hint.textContent = `Jump to ${label}`;
      hint.dataset.visible = "";
      // Keep the label inside the strip's width so it never runs off the page edge.
      const half = hint.offsetWidth / 2;
      const x = Math.min(rect.width - half, Math.max(half, event.clientX - rect.left));
      hint.style.left = `${x}px`;
    };
    const onLeave = () => {
      reset();
      delete hint.dataset.visible;
    };
    const onClick = (event: MouseEvent) => {
      const { ratio } = target(ratioAt(event.clientX));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: ratio * scrollRange(), behavior: reduce ? "auto" : "smooth" });
    };

    measure();
    place();
    const observer = new ResizeObserver(() => {
      measure();
      place();
    });
    observer.observe(document.documentElement);
    window.addEventListener("scroll", onScroll, { passive: true });
    row.addEventListener("pointermove", onMove);
    row.addEventListener("pointerleave", onLeave);
    row.addEventListener("click", onClick);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      row.removeEventListener("pointermove", onMove);
      row.removeEventListener("pointerleave", onLeave);
      row.removeEventListener("click", onClick);
      if (frame) cancelAnimationFrame(frame);
      marks.forEach((mark) => mark.remove());
      hidden.forEach((tick) => (tick.style.visibility = ""));
      reset();
    };
  }, [isTop, tickCount, pathname]);

  return (
    <div
      ref={rowRef}
      aria-hidden="true"
      className={`relative mx-item-16 max-lg:mx-item-12 max-md:mx-item-8 max-xs:mx-item-4 flex min-w-0 flex-1 justify-between self-stretch overflow-x-clip ${
        isTop ? "items-end" : "items-start"
      } cursor-pointer`}
    >
      {Array.from({ length: tickCount }, (_, i) => {
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
        className="pointer-events-none absolute inset-y-0 left-0 w-item-2 bg-surface-accent-cool/60"
      />
      <span
        ref={hintRef}
        className={`pointer-events-none absolute z-10 hidden -translate-x-1/2 whitespace-nowrap bg-surface-inverted px-item-8 py-item-4 font-mono text-stamp-xs uppercase text-text-on-inverted data-visible:block ${
          isTop ? "top-full mt-item-6" : "bottom-full mb-item-6"
        }`}
      />
    </div>
  );
}
