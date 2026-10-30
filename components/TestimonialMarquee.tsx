"use client";

import { useEffect, useRef } from "react";
import type { Testimonial } from "@/content/home";
import { Polaroid } from "./Polaroid";

/** Seconds for the strip to drift past one full set of polaroids. */
const LOOP_SECONDS = 70;
/** How long the drift stays still after the visitor scrolls or drags. */
const RESUME_DELAY_MS = 2500;

function Row({
  testimonials,
  hidden,
}: {
  testimonials: Testimonial[];
  hidden?: boolean;
}) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className={`flex shrink-0 gap-item-40 pr-item-40 ${
        hidden ? "motion-reduce:hidden" : ""
      }`}
    >
      {testimonials.map((testimonial) => (
        <li key={testimonial.name} className="shrink-0 px-item-14 py-item-10">
          <Polaroid {...testimonial} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Polaroids drift sideways like the marquee strips, and the row can also be
 * scrolled by wheel, trackpad, touch, drag or arrow keys. The drift holds still
 * while a polaroid is hovered or focused, and for a moment after the visitor
 * scrolls. Three copies of the set let the row wrap in either direction.
 * With reduced motion it is a plain scrollable row.
 */
export function TestimonialMarquee({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setWidth = () => el.scrollWidth / 3;
    let position = 0;
    let lastSet = 0;
    let holdUntil = 0;
    let dragging = false;
    let visible = true;
    let frame = 0;
    let last = performance.now();

    if (!query.matches) {
      el.scrollLeft = setWidth();
    }
    position = lastSet = el.scrollLeft;

    // A scroll we did not cause (wheel, touch, keys, drag) holds the drift.
    const onScroll = () => {
      if (Math.abs(el.scrollLeft - lastSet) > 2) {
        holdUntil = performance.now() + RESUME_DELAY_MS;
        position = lastSet = el.scrollLeft;
      }
    };

    let dragStartX = 0;
    let dragStartScroll = 0;
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      dragging = true;
      dragStartX = event.clientX;
      dragStartScroll = el.scrollLeft;
      el.style.userSelect = "none";
      el.style.cursor = "grabbing";
    };
    const onPointerMove = (event: PointerEvent) => {
      if (dragging) el.scrollLeft = dragStartScroll - (event.clientX - dragStartX);
    };
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      el.style.userSelect = "";
      el.style.cursor = "";
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(el);

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const delta = Math.min(now - last, 100);
      last = now;
      if (query.matches) return;

      const set = setWidth();
      const holding =
        !visible ||
        dragging ||
        now < holdUntil ||
        el.querySelector("figure:hover") !== null ||
        el.contains(document.activeElement);

      if (!holding) {
        position += (set / LOOP_SECONDS) * (delta / 1000);
        el.scrollLeft = position;
      } else {
        position = el.scrollLeft;
      }

      // Hop a whole set back into the middle copy so the row never runs out.
      if (el.scrollLeft < set * 0.5) {
        el.scrollLeft += set;
        position += set;
      } else if (el.scrollLeft > set * 1.5) {
        el.scrollLeft -= set;
        position -= set;
      }
      lastSet = el.scrollLeft;
    };
    frame = requestAnimationFrame(tick);

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, []);

  return (
    <div
      ref={scrollerRef}
      role="region"
      aria-label="Testimonials"
      tabIndex={0}
      className="scrollbar-none w-full cursor-grab overflow-x-auto pb-item-40"
    >
      <div className="flex w-max">
        <Row testimonials={testimonials} />
        <Row testimonials={testimonials} hidden />
        <Row testimonials={testimonials} hidden />
      </div>
    </div>
  );
}
