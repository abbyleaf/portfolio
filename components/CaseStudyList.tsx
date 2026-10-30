import type { CaseStudySummary } from "@/content/home";
import { ProjectCard } from "./ProjectCard";
import { ProjectCover } from "./ProjectCover";

/** Case study cards, each under a hairline rule. */
export function CaseStudyList({ studies }: { studies: CaseStudySummary[] }) {
  return (
    <>
      {studies.map((study) => (
        <div key={study.slug} className="flex flex-col">
          <hr className="my-item-40 border-0 border-t-(length:--stroke-hairline) border-border-subtle" />
          <ProjectCard
            study={study}
            media={<ProjectCover slug={study.slug} />}
          />
        </div>
      ))}
    </>
  );
}
