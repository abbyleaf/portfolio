import Link from "next/link";
import type { ReactNode } from "react";
import type { CaseStudySummary } from "@/content/home";
import { Tag } from "./Tag";

type ProjectCardProps = {
  study: CaseStudySummary;
  /** The cover picture; it sits in a bordered frame on the right. */
  media: ReactNode;
};

export function ProjectCard({ study, media }: ProjectCardProps) {
  return (
    <article className="flex items-start gap-item-40 max-md:flex-col">
      <p className="w-item-64 shrink-0 font-mono text-mono-l uppercase text-text-muted">
        № {study.number} · {study.year}
      </p>
      <div className="flex min-w-0 flex-1 flex-col gap-item-24 self-stretch">
        <p className="font-mono text-mono-m uppercase text-text-muted">
          {study.category}
        </p>
        <div className="flex flex-1 flex-col gap-item-16">
          <h3 className="font-heading font-wonk text-heading-fraunces-xl text-text-primary">
            {study.title}
          </h3>
          <p className="font-sans text-paragraph-md text-text-body">
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
        <Link
          href={`/case-studies/${study.slug}`}
          className="group flex items-center gap-item-4 font-sans text-label-link text-text-accent-cool"
        >
          Read case study
          <span
            aria-hidden="true"
            className="transition-transform motion-safe:group-hover:translate-x-item-2 motion-safe:group-hover:-translate-y-item-2"
          >
            ↗
          </span>
        </Link>
      </div>
      <div className="relative aspect-project-card min-w-0 flex-1 overflow-hidden max-md:w-full">
        {media}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 border-(length:--stroke-hairline) border-border-canvas-subtle"
        />
      </div>
    </article>
  );
}
