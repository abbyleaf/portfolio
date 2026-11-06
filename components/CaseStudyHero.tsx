import Image from "next/image";
import type { CaseStudyMeta } from "@/lib/case-studies";
import { Badge } from "./Badge";
import { Tag } from "./Tag";

const labelClass =
  "font-sans text-heading-inter-sm uppercase text-text-sub-headers";

/** Title block, cover picture and facts at the top of a case study. */
export function CaseStudyHero({ meta }: { meta: CaseStudyMeta }) {
  const facts: readonly (readonly [string, string | undefined])[] = meta.facts
    ? meta.facts.map(({ label, value }) => [label, value] as const)
    : [
        ["Platform", meta.platform],
        ["Timeline", meta.timeline],
        ["Role", meta.role],
      ];

  return (
    <section
      id="overview"
      aria-labelledby="study-title"
      data-ruler-section="Overview"
      className="flex scroll-mt-item-20 flex-col gap-item-40"
    >
      <div className="flex flex-col gap-item-12">
        <div className="flex flex-wrap-reverse items-start gap-x-item-12 gap-y-item-16">
          {meta.number && (
            <p
              aria-hidden="true"
              className="flex-1 whitespace-nowrap font-heading font-wonk text-display-case italic text-trim-cap text-outline opacity-45 max-toc:text-display-case-tablet max-md:text-display-case-mobile"
            >
              case {meta.number}
            </p>
          )}
          {meta.badges && (
            <div className="flex flex-wrap items-center gap-item-12">
              <Badge tone="neutral" tilt="left" status="blue">
                {meta.badges[0]}
              </Badge>
              <Badge tone="warm" tilt="right" star>
                {meta.badges[1]}
              </Badge>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-item-20">
          {meta.category && (
            <p className={labelClass}>{meta.category}</p>
          )}
          <div className="flex flex-col gap-item-16">
            <h1
              id="study-title"
              className="font-heading font-wonk text-heading-fraunces-xxl text-text-primary"
            >
              {meta.title}
            </h1>
            {meta.summary && (
              <p className="font-sans text-paragraph-md text-text-muted">
                {meta.summary}
              </p>
            )}
          </div>
        </div>
      </div>

      {meta.hero && (
        <Image
          src={meta.hero.src}
          alt={meta.hero.alt}
          width={meta.hero.width}
          height={meta.hero.height}
          sizes="(min-width: 64rem) 780px, 100vw"
          preload
          className="h-auto w-full"
        />
      )}

      <div className="flex flex-col gap-item-40">
        <dl className="flex flex-wrap gap-x-item-m gap-y-item-16">
          {facts.map(
            ([label, value]) =>
              value && (
                <div key={label} className="flex flex-col gap-item-8">
                  <dt className={labelClass}>{label}</dt>
                  <dd className="font-sans text-paragraph-md text-text-primary">
                    {value}
                  </dd>
                </div>
              ),
          )}
        </dl>
        {meta.team && (
          <div className="flex flex-col gap-item-12">
            <h2 className={labelClass}>Team</h2>
            <p className="font-sans text-paragraph-md text-text-primary">
              {meta.team}
            </p>
          </div>
        )}
        {meta.contribution && (
          <div className="flex flex-col gap-item-12">
            <h2 className={labelClass}>My contribution</h2>
            <ul className="flex flex-wrap gap-item-8">
              {meta.contribution.map((item) => (
                <Tag key={item} tone="neutral">
                  {item}
                </Tag>
              ))}
            </ul>
          </div>
        )}
        {meta.responsibilities && (
          <div className="flex flex-col gap-item-12">
            <h2 className={labelClass}>Responsibilities</h2>
            <p className="font-sans text-paragraph-md text-text-primary">
              {meta.responsibilities}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
