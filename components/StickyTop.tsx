"use client";

import { useEffect, useState, type ReactNode } from "react";

const SHRINK_AT = 48;
const GROW_AT = 12;

/**
 * Pins the header and top ruler to the viewport. The bars are fixed, so a
 * placeholder the size of the full-height bars keeps the page from jumping when
 * the header shrinks. Children read the state through `group-data-scrolled/bar`.
 */
export function StickyTop({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled((current) => (current ? y > GROW_AT : y > SHRINK_AT));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative shrink-0">
      <div aria-hidden="true" className="invisible">
        <div className="h-item-72" />
        <div className="h-item-30" />
      </div>
      <div
        data-scrolled={scrolled ? "" : undefined}
        className="group/bar fixed inset-x-0 top-0 z-30"
      >
        {children}
      </div>
    </div>
  );
}
