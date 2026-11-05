"use client";

import { useEffect, useState, type MouseEvent } from "react";

type TocItem = { id: string; label: string };

/** A section counts as current once its top passes this far below the viewport top. */
const READ_LINE = 160;

/**
 * Scrolls to a section so it lands where a native #anchor jump would (below the pinned
 * bars), but smoothly like a click on the ruler. Reduced motion jumps instead.
 */
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - padding - margin,
    behavior: reduce ? "auto" : "smooth",
  });
}

/**
 * "On this page" rail. It lines up with the left edge of the ruler (same gutters, same
 * 1400px cap) on wide screens, stays in view while scrolling, and marks the section being
 * read. Render it inside the full-width `main`, not the centred text column; the
 * `study-column` utility keeps the text clear of it.
 */
export function CaseStudyToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  const onLinkClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    // Let new-tab and modified clicks behave like normal links.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    scrollToSection(id);
    window.history.pushState(null, "", `#${id}`);
  };

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
    <div className="pointer-events-none absolute inset-x-0 inset-y-item-60 px-item-64 max-xl:px-item-40 max-toc:hidden">
      <div className="relative mx-auto h-full w-full max-w-width-1400">
        <div className="pointer-events-auto absolute inset-y-0 left-0 w-item-200">
          <nav aria-label="On this page" className="sticky top-item-120">
            <ul className="flex flex-col">
              {items.map(({ id, label }) => {
                const current = id === active;
                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      onClick={(event) => onLinkClick(event, id)}
                      aria-current={current ? "location" : undefined}
                      className={`block px-item-12 py-item-8 font-sans text-label-sm ${
                        current
                          ? "border-l-(length:--stroke-rule) border-azure-55 font-medium text-text-accent-cool"
                          : "border-l-(length:--stroke-hairline) border-grey-100 text-text-sub-headers hover:text-text-primary"
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
      </div>
    </div>
  );
}
