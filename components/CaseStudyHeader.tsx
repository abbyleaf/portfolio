import Image from "next/image";
import Link from "next/link";

type CaseStudyHeaderProps = {
  /** Short name of this case study, shown in the middle. */
  name: string;
  /** Link to the next case study; omitted when there is none to open. */
  nextHref?: string;
};

/**
 * Bar above the case study ruler: back link, current study, next link. It matches the
 * site header's width and shrinks the same way when the page scrolls (see StickyTop).
 */
export function CaseStudyHeader({ name, nextHref }: CaseStudyHeaderProps) {
  return (
    <header className="relative h-item-64 shrink-0 motion-safe:transition-[height] motion-safe:duration-200 group-data-scrolled/bar:h-item-54 border-b-(length:--stroke-hairline) border-border-canvas-subtle bg-surface-primary px-item-64 max-xl:px-item-40 max-md:px-item-24">
      <div className="mx-auto flex h-full w-full max-w-width-1400 items-center justify-between gap-item-16">
        <Link
          href="/"
          className="-ml-item-14 flex h-item-36 shrink-0 items-center gap-item-10 border-(length:--stroke-hairline) border-transparent px-item-14 font-sans text-label-link text-text-primary transition-[translate,box-shadow,border-color] duration-150 motion-safe:hover:-translate-x-item-2 motion-safe:hover:-translate-y-item-2 hover:border-border-strong hover:bg-surface-primary hover:shadow-button-hover"
        >
          <Image src="/images/case-studies/ui/arrow-back.svg" alt="" width={20} height={20} />
          Back to home
        </Link>
        <p className="flex min-w-0 items-center justify-center gap-item-12 font-sans text-label-link text-text-primary max-md:hidden">
          <Image src="/images/case-studies/ui/sparkle.svg" alt="" width={14} height={14} />
          <span className="truncate">{name}</span>
        </p>
        {nextHref ? (
          <Link
            href={nextHref}
            className="flex h-item-36 shrink-0 items-center bg-surface-inverted px-item-14 font-sans text-label-link text-text-on-inverted transition-[translate,box-shadow] duration-150 motion-safe:hover:-translate-x-item-2 motion-safe:hover:-translate-y-item-2 hover:shadow-button-hover"
          >
            Next case study →
          </Link>
        ) : (
          <span aria-hidden="true" className="w-item-120 max-md:hidden" />
        )}
      </div>
    </header>
  );
}
