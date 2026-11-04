import type { ReactNode } from "react";
import { workStudies } from "@/content/work";
import { isCaseStudyVisible, type CaseStudyMeta } from "@/lib/case-studies";
import { CaseStudyHeader } from "./CaseStudyHeader";
import { CaseStudyHero } from "./CaseStudyHero";
import { CaseStudyNext } from "./CaseStudyNext";
import { CaseStudyToc } from "./CaseStudyToc";
import { Ruler } from "./Ruler";
import { SiteFooter } from "./SiteFooter";

type CaseStudyLayoutProps = {
  slug: string;
  meta: CaseStudyMeta;
  children: ReactNode;
};

/** Frame for a full case study: pinned bar and ruler, hero, text, closing band, footer. */
export async function CaseStudyLayout({
  slug,
  meta,
  children,
}: CaseStudyLayoutProps) {
  const current = workStudies.find((study) => study.slug === slug);
  const next = workStudies.find((study) => study.slug === meta.next);
  const nextAvailable = next ? await isCaseStudyVisible(next.slug) : false;
  const position = next
    ? `${String(workStudies.indexOf(next) + 1).padStart(2, "0")} / ${String(workStudies.length).padStart(2, "0")}`
    : "";

  return (
    <div className="flex flex-1 flex-col bg-surface-primary">
      <div className="sticky top-0 z-30">
        <CaseStudyHeader
          name={current?.shortTitle ?? meta.title}
          nextHref={next && nextAvailable ? `/case-studies/${next.slug}` : undefined}
        />
        <Ruler
          edge="top"
          left={`§${meta.number ?? "00"} / CASE STUDY`}
          right="Folio/26"
          star
        />
      </div>
      <main className="px-item-64 py-item-60 max-xl:px-item-40 max-md:px-item-24 max-md:py-item-40">
        <div className="relative mx-auto flex w-full max-w-width-840 flex-col">
          {meta.toc && <CaseStudyToc items={meta.toc} />}
          <CaseStudyHero meta={meta} />
          {children}
        </div>
      </main>
      {next && (
        <CaseStudyNext study={next} position={position} available={nextAvailable} />
      )}
      <Ruler edge="bottom" left="CASE / END" right="EST. 2026" jump={false} />
      <SiteFooter />
    </div>
  );
}
