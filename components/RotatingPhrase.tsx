"use client";

import { useEffect, useState } from "react";

type RotatingPhraseProps = {
  phrases: string[];
  className?: string;
};

type Phase = "hold" | "delete" | "type";

const HOLD_MS = 2200;
const DELETE_MS = 30;
const TYPE_MS = 65;
const PAUSE_MS = 350;

/**
 * Types each phrase out, holds it, deletes it and moves on to the next. The
 * first phrase is rendered in full on the server so it matches the design with
 * no JavaScript, and it stays put when the visitor prefers reduced motion.
 */
export function RotatingPhrase({ phrases, className }: RotatingPhraseProps) {
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(phrases[0].length);
  const [phase, setPhase] = useState<Phase>("hold");
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAnimate(!query.matches && phrases.length > 1);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [phrases.length]);

  useEffect(() => {
    if (!animate) return;
    let delay: number;
    let next: () => void;

    if (phase === "hold") {
      delay = HOLD_MS;
      next = () => setPhase("delete");
    } else if (phase === "delete") {
      if (length > 0) {
        delay = DELETE_MS;
        next = () => setLength((n) => n - 1);
      } else {
        delay = PAUSE_MS;
        next = () => {
          setIndex((i) => (i + 1) % phrases.length);
          setPhase("type");
        };
      }
    } else {
      const target = phrases[index].length;
      if (length < target) {
        delay = TYPE_MS;
        next = () => setLength((n) => n + 1);
      } else {
        delay = 0;
        next = () => setPhase("hold");
      }
    }

    const timer = window.setTimeout(next, delay);
    return () => window.clearTimeout(timer);
  }, [animate, phase, length, index, phrases]);

  return (
    <em className={className}>
      {/* Screen readers get every phrase once instead of each keystroke. */}
      <span className="sr-only">{phrases.join(", ")}</span>
      <span aria-hidden="true">
        {phrases[index].slice(0, length)}
        <span className="ml-item-4 inline-block h-item-56 w-item-4 translate-y-item-8 max-lg:h-item-40 max-md:h-item-m max-lg:translate-y-item-6 bg-text-primary motion-safe:animate-caret motion-reduce:hidden" />
      </span>
    </em>
  );
}
