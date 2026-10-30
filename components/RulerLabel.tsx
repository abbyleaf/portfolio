"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ruler-hint-seen";
const SHOW_AFTER_MS = 1500;
const SHOW_FOR_MS = 4500;

/** Fired on `window` while the hint is showing, so the strip can nudge its marker. */
export const RULER_HINT_EVENT = "ruler-hint";

/**
 * The left label of a ruler. With `hint`, a first-time visitor sees it read
 * "Click to jump" for a few seconds while the marker nudges, to show that the
 * strip is a way to move around the page. It plays once per browser and not at all
 * under reduced motion.
 */
export function RulerLabel({ label, hint }: { label: string; hint?: boolean }) {
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    if (!hint) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (window.localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // Storage is blocked: skip the hint rather than repeat it on every visit.
      return;
    }

    const announce = (on: boolean) =>
      window.dispatchEvent(new CustomEvent(RULER_HINT_EVENT, { detail: on }));
    const start = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, "1");
      } catch {}
      setShowing(true);
      announce(true);
    }, SHOW_AFTER_MS);
    const stop = window.setTimeout(() => {
      setShowing(false);
      announce(false);
    }, SHOW_AFTER_MS + SHOW_FOR_MS);

    return () => {
      window.clearTimeout(start);
      window.clearTimeout(stop);
      announce(false);
    };
  }, [hint]);

  return <span className="shrink-0">{showing ? "Click to jump" : label}</span>;
}
