import type { CaseStudySummary } from "@/content/home";
import { isCaseStudyVisible } from "@/lib/case-studies";
import { ProjectCard } from "./ProjectCard";
import { ProjectCover } from "./ProjectCover";

/** Case study cards, each under a hairline rule. Hidden studies show as "Coming soon". */
export async function CaseStudyList({ studies }: { studies: CaseStudySummary[] }) {
  const visible = await Promise.all(
    studies.map((study) => isCaseStudyVisible(study.slug)),
  );
  return (
    <>
      {studies.map((study, index) => (
        <div key={study.slug} className="flex flex-col">
          <hr className="my-item-40 border-0 border-t-(length:--stroke-hairline) border-border-subtle" />
          <ProjectCard
            study={{ ...study, comingSoon: !visible[index] }}
            media={<ProjectCover slug={study.slug} />}
          />
        </div>
      ))}
    </>
  );
}
