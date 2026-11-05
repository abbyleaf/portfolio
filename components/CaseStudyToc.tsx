"use client";

import { useEffect, useState } from "react";

type TocItem = { id: string; label: string };

/** A section counts as current once its top passes this far below the viewport top. */
const READ_LINE = 160;

/**
 * "On this page" rail. It sits in the page's left margin (64px in, like the header) on
 * wide screens, stays in view while scrolling, and marks the section being read. Render
 * it inside the full-width `main`, not the centred text column.
 */
export function CaseStudyToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = items[0]?.id;
      for (const { id } of items) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= READ_LINE) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <div className="absolute inset-y-item-60 left-item-64 w-item-200 max-toc:hidden">
      <nav aria-label="On this page" className="sticky top-item-120">
        <ul className="flex flex-col">
          {items.map(({ id, label }) => {
            const current = id === active;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={current ? "location" : undefined}
                  className={`block px-item-12 py-item-8 font-sans text-label-sm ${
                    current
                      ? "border-l-(length:--stroke-rule) border-azure-55 font-medium text-text-accent-cool"
                      : "border-l-(length:--stroke-hairline) border-border-rail text-grey-44 hover:text-text-primary"
                  }`}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
