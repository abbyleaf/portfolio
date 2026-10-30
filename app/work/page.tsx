import type { Metadata } from "next";
import { CaseStudyList } from "@/components/CaseStudyList";
import { PageFrame } from "@/components/PageFrame";
import { SectionHeader } from "@/components/SectionHeader";
import { workStudies } from "@/content/work";

export const metadata: Metadata = {
  title: "Work",
  description: "The problems, decisions and outcomes behind each case study.",
};

export default function WorkPage() {
  return (
    <PageFrame topLabel="Abi / Work" bottomLabel="WORK / END">
      <section
        aria-labelledby="work-title"
        data-ruler-section="All case studies"
        className="px-item-120 py-item-80 max-xl:px-item-40 max-md:px-item-24"
      >
        <div className="mx-auto flex w-full max-w-width-1200 flex-col">
          <SectionHeader
            marker="My work"
            title="All case studies"
            subtitle="The problems, decisions and outcomes."
            titleId="work-title"
          />
          <CaseStudyList studies={workStudies} />
        </div>
      </section>
    </PageFrame>
  );
}
