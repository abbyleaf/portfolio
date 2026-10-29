import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
];

export function SiteHeader() {
  return (
    <header className="h-item-80 shrink-0 border-b-(length:--stroke-hairline) border-border-canvas-subtle bg-surface-primary px-item-64">
      <div className="mx-auto flex h-full w-full max-w-width-1312 items-center justify-between">
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
        <nav aria-label="Primary" className="flex items-center gap-item-28">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-sans text-label-link text-text-muted underline-offset-4 hover:text-text-primary hover:underline"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="#"
            className="flex h-item-40 items-center bg-surface-inverted px-item-24 font-sans text-label-link text-text-on-inverted"
          >
            Resume
          </a>
        </nav>
      </div>
    </header>
  );
}
