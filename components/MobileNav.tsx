"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

type NavLink = { label: string; href: string };

type MobileNavProps = {
  links: NavLink[];
  resume: NavLink;
};

/** Hamburger below md; the list drops down under the header and covers the page. */
export function MobileNav({ links, resume }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="flex size-item-40 items-center justify-center text-text-primary"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-item-24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
        >
          {open ? (
            <path d="M5 5l14 14M19 5L5 19" />
          ) : (
            <path d="M4 8h16M4 16h16" />
          )}
        </svg>
      </button>
      <nav
        id={panelId}
        aria-label="Primary"
        hidden={!open}
        className="absolute inset-x-0 top-full z-20 flex flex-col border-b-(length:--stroke-hairline) border-border-canvas-subtle bg-surface-primary px-item-24 pb-item-24"
      >
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={() => setOpen(false)}
            className="border-b-(length:--stroke-hairline) border-border-subtle py-item-16 font-mono text-mono-m uppercase text-text-primary"
          >
            {link.label}
          </Link>
        ))}
        <a
          href={resume.href}
          onClick={() => setOpen(false)}
          className="mt-item-24 flex h-item-40 items-center justify-center bg-surface-inverted font-sans text-label-link text-text-on-inverted"
        >
          {resume.label}
        </a>
      </nav>
    </div>
  );
}
