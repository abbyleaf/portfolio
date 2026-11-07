import type { CaseStudySummary } from "@/content/home";
import { Button } from "./Button";

type CaseStudyNextProps = {
  study: CaseStudySummary;
  /** False while the study is a hidden draft: shows "Coming soon" instead of a link. */
  available: boolean;
};

/** Closing band that points to the next case study. */
export function CaseStudyNext({ study, available }: CaseStudyNextProps) {
  const words = study.shortTitle.split(" ");
  const last = words.pop();
  return (
    <section
      aria-label="Next case study"
      className="border-b-(length:--stroke-rule) border-border-strong bg-surface-light-accent-warm px-item-80 py-item-47 max-xl:px-item-40 max-md:px-item-24"
    >
      <div className="mx-auto flex w-full max-w-width-1400 items-center gap-item-48 max-md:flex-col max-md:items-start max-md:gap-item-24">
        <div className="flex min-w-0 flex-1 flex-col gap-item-20">
          <p className="font-mono text-mono-m uppercase text-text-accent-warm">
            Next case study
          </p>
          <p className="font-heading font-wonk text-heading-fraunces-band text-text-primary max-md:text-heading-fraunces-xl">
            {words.join(" ")}{" "}
            <em className="font-normal text-text-accent-cool">
              {last?.toLowerCase()}
            </em>
          </p>
          <p className="max-w-width-700 font-sans text-paragraph-md text-text-body">
            {study.summary}
          </p>
        </div>
        {available ? (
          <Button href={`/case-studies/${study.slug}`}>Read case study</Button>
        ) : (
          <p className="font-sans text-label-link-lg text-text-muted">
            Coming soon
          </p>
        )}
      </div>
    </section>
  );
}
