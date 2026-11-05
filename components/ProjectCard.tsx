import Link from "next/link";
import type { ReactNode } from "react";
import type { CaseStudySummary } from "@/content/home";
import { ClickableCard } from "./ClickableCard";
import { Tag } from "./Tag";

type ProjectCardProps = {
  study: CaseStudySummary;
  /** The cover picture; it sits in a bordered frame on the right. */
  media: ReactNode;
};

export function ProjectCard({ study, media }: ProjectCardProps) {
  const href = `/case-studies/${study.slug}`;
  return (
    <ClickableCard
      href={study.comingSoon ? undefined : href}
      className="group relative flex items-start gap-item-40 has-focus-visible:outline-(length:--stroke-sticker) has-focus-visible:outline-offset-8 has-focus-visible:outline-surface-accent-cool max-lg:flex-col"
    >
      <p className="w-item-64 shrink-0 max-lg:w-auto font-mono text-mono-l uppercase text-text-muted">
        № {study.number} · {study.year}
      </p>
      <div className="flex min-w-0 flex-1 flex-col gap-item-24 self-stretch">
        <p className="font-mono text-mono-m uppercase text-text-muted">
          {study.category}
        </p>
        <div className="flex flex-1 flex-col gap-item-16">
          <h3 className={`font-heading font-wonk text-heading-fraunces-xl text-text-primary underline-offset-4 ${study.comingSoon ? "" : "group-hover:underline"}`}>
            {study.title}
          </h3>
          <p className="font-sans text-paragraph-md text-text-muted">
            {study.summary}
          </p>
          <ul
            aria-label="Skills"
            className="flex flex-wrap gap-item-8 py-item-8"
          >
            {study.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </ul>
        </div>
        {/* The whole card opens the case study (see ClickableCard), and its text stays
            selectable. This is the real link for keyboards and screen readers. */}
        {study.comingSoon ? (
          <p className="font-sans text-label-link-lg text-text-disabled">
            Coming soon
          </p>
        ) : (
          <Link
            href={href}
            aria-label={`Read case study: ${study.title}`}
            className="flex items-center gap-item-4 font-sans text-label-link-lg text-text-accent-cool focus-visible:outline-none"
          >
            Read case study
            <span
              aria-hidden="true"
              className="transition-transform motion-safe:group-hover:translate-x-item-2 motion-safe:group-hover:-translate-y-item-2"
            >
              ↗
            </span>
          </Link>
        )}
      </div>
      <div className="relative aspect-project-card min-w-0 flex-1 overflow-hidden max-lg:w-full">
        <div className={`absolute inset-0 transition-transform duration-500 ease-out ${study.comingSoon ? "" : "motion-safe:group-hover:scale-(--scale-media-hover)"}`}>
          {media}
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 border-(length:--stroke-hairline) border-border-canvas-subtle"
        />
      </div>
    </ClickableCard>
  );
}
