"use client";

import { useEffect, useRef } from "react";

const DURATION = 1400;

/** Splits "2,000+" into its text before the number, the number and its decimals, and the text after. */
function parse(value: string) {
  const match = value.match(/^(\D*?)(\d[\d,]*(?:\.(\d+))?)(.*)$/);
  if (!match) return null;
  const [, before, digits, decimals = "", after] = match;
  return {
    before,
    number: Number(digits.replace(/,/g, "")),
    decimals: decimals.length,
    after,
  };
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * A number that counts up from zero the first time it scrolls into view. The finished value is
 * always in the page (in the markup, for screen readers, and as an invisible spacer that keeps
 * the box from changing size while the digits run). With reduced motion it just shows the number.
 * The digits are written straight to the element, so React never re-renders while they run.
 */
export function CountUp({ value }: { value: string }) {
  const visible = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = visible.current;
    const parts = parse(value);
    if (!node || !parts || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const format = (n: number) =>
      `${parts.before}${n.toLocaleString("en-US", {
        minimumFractionDigits: parts.decimals,
        maximumFractionDigits: parts.decimals,
      })}${parts.after}`;

    node.textContent = format(0);
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / DURATION, 1);
          node.textContent = t < 1 ? format(parts.number * easeOutCubic(t)) : value;
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      node.textContent = value;
    };
  }, [value]);

  return (
    <span className="relative inline-block tabular-nums" aria-label={value}>
      <span aria-hidden="true" className="invisible">
        {value}
      </span>
      <span ref={visible} aria-hidden="true" className="absolute inset-0">
        {value}
      </span>
    </span>
  );
}
