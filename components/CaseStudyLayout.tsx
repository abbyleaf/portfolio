import type { ReactNode } from "react";
import { workStudies } from "@/content/work";
import { isCaseStudyVisible, type CaseStudyMeta } from "@/lib/case-studies";
import { CaseStudyHeader } from "./CaseStudyHeader";
import { CaseStudyHero } from "./CaseStudyHero";
import { CaseStudyNext } from "./CaseStudyNext";
import { CaseStudyToc } from "./CaseStudyToc";
import { Ruler } from "./Ruler";
import { SiteFooter } from "./SiteFooter";
import { StickyTop } from "./StickyTop";

type CaseStudyLayoutProps = {
  slug: string;
  meta: CaseStudyMeta;
  children: ReactNode;
  /** The version a visitor without the password sees: locked rail entries, password box. */
  locked?: boolean;
};

/** Frame for a full case study: pinned bar and ruler, hero, text, closing band, footer. */
export async function CaseStudyLayout({
  slug,
  meta,
  children,
  locked,
}: CaseStudyLayoutProps) {
  const current = workStudies.find((study) => study.slug === slug);
  const next = workStudies.find((study) => study.slug === meta.next);
  const nextAvailable = next ? await isCaseStudyVisible(next.slug) : false;
  const position = next
    ? `${String(workStudies.indexOf(next) + 1).padStart(2, "0")} / ${String(workStudies.length).padStart(2, "0")}`
    : "";

  return (
    <div className="flex flex-1 flex-col bg-surface-primary">
      <StickyTop compact>
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
      </StickyTop>
      <main className="relative px-item-64 pt-item-60 pb-item-80 max-xl:px-item-40 max-md:px-item-24 max-md:pt-item-40 toc:px-0">
        {meta.toc && (
          <CaseStudyToc items={meta.toc} lockedFrom={locked ? meta.lockedFrom : undefined} />
        )}
        <div className="study-column flex flex-col">
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
