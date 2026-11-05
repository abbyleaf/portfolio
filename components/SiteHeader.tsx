import Link from "next/link";
import { MobileNav } from "./MobileNav";

const resume = { label: "Resume", href: "/resume.pdf" };

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
];

export function SiteHeader() {
  return (
    <header className="relative h-item-80 shrink-0 motion-safe:transition-[height] motion-safe:duration-200 group-data-scrolled/bar:h-item-54 border-b-(length:--stroke-hairline) border-border-canvas-subtle bg-surface-primary px-item-64 max-xl:px-item-40 max-md:px-item-24">
      <div className="mx-auto flex h-full w-full max-w-width-1400 items-center justify-between">
        <Link href="/" className="flex items-center gap-item-12">
          <span
            aria-hidden="true"
            className="flex size-item-m items-center justify-center rounded-pill bg-surface-inverted font-sans text-heading-inter-xs text-surface-primary"
          >
            AY
          </span>
          <span className="font-heading font-wonk text-heading-fraunces-md text-text-primary">
            Abigail Yeap
          </span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-item-28 max-md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-sans text-label-link text-text-primary underline-offset-4 hover:underline"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={resume.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-item-40 items-center bg-surface-inverted px-item-24 font-sans text-label-link text-text-on-inverted transition-[translate,box-shadow] duration-150 motion-safe:hover:-translate-x-item-2 motion-safe:hover:-translate-y-item-2 hover:shadow-button-hover"
          >
            {resume.label}
            <span className="sr-only"> (opens PDF in a new tab)</span>
          </a>
        </nav>
        <MobileNav links={navLinks} resume={resume} />
      </div>
    </header>
  );
}
