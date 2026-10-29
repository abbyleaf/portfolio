import Image from "next/image";
import { Badge } from "@/components/Badge";
import { LoopVideo } from "@/components/LoopVideo";
import { Marquee } from "@/components/Marquee";
import { ProjectCard } from "@/components/ProjectCard";
import { RotatingPhrase } from "@/components/RotatingPhrase";
import { Ruler } from "@/components/Ruler";
import { SectionHeader } from "@/components/SectionHeader";
import { StickyTop } from "@/components/StickyTop";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TestimonialMarquee } from "@/components/TestimonialMarquee";
import {
  caseStudies,
  currently,
  designStrengths,
  heroPhrases,
  howIWork,
  testimonials,
} from "@/content/home";

function Cover({ slug }: { slug: string }) {
  if (slug === "campus-ride-booking") {
    return (
      <LoopVideo
        src="/videos/case-study-1-hero.mp4"
        label="Campus ride app showing shuttle and on-demand booking side by side"
        className="size-full object-cover"
      />
    );
  }
  const isOrderSplitting = slug === "order-splitting";
  return (
    <Image
      src={
        isOrderSplitting
          ? "/images/home/case-study-2-cover.png"
          : "/images/home/case-study-3-cover.png"
      }
      alt={
        isOrderSplitting
          ? "Soft green and lilac gradient cover for the order splitting case study"
          : "Route planning interface on a desktop monitor"
      }
      fill
      sizes="(min-width: 768px) 40vw, 100vw"
      className="object-cover"
    />
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-surface-primary">
      <StickyTop>
        <SiteHeader />
        <Ruler edge="top" left="Abi / HOME" right="★ Folio/26" />
      </StickyTop>
      <main className="flex flex-col">
        <section
          id="about"
          aria-labelledby="hero-title"
          className="px-item-120 py-item-64 max-xl:px-item-40 max-md:px-item-24"
        >
          <div className="mx-auto flex w-full max-w-width-1200 flex-col gap-item-80 max-md:gap-item-40">
            <div className="flex flex-col gap-item-56">
              <div className="flex min-h-item-47 flex-wrap items-center gap-item-14">
                <Badge tone="neutral" tilt="left" status>
                  Open to work
                </Badge>
                <Badge tone="warm" tilt="right">
                  ★ Hello from Singapore
                </Badge>
              </div>
              <h1
                id="hero-title"
                className="flex flex-col items-start gap-item-8 font-heading font-wonk text-heading-fraunces-hero text-text-primary"
              >
                <span className="flex flex-wrap items-baseline gap-item-12">
                  I bring
                  <em className="text-text-accent-cool">clarity</em>
                  to
                </span>
                <RotatingPhrase
                  phrases={heroPhrases}
                  className="border-(length:--stroke-sticker) border-border-strong bg-surface-raised px-item-17 py-px shadow-sticker max-lg:leading-display-tight"
                />
              </h1>
            </div>
            <div className="flex items-start gap-item-56 max-md:flex-col">
              <p className="max-w-width-580 flex-1 font-sans text-paragraph-md text-text-body">
                I’m Abigail, a senior product designer with over 6 years of
                experience designing mobile and web products for logistics and
                passenger transport, plus 3 years of experience in multimedia
                gallery interfaces.
              </p>
              <dl className="flex flex-1 flex-col gap-item-12">
                {currently.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex min-h-item-20 items-baseline gap-item-16"
                  >
                    <dt className="w-item-100 shrink-0 font-sans text-heading-inter-xs uppercase text-text-muted">
                      {label}
                    </dt>
                    <dd className="font-sans text-label-sm text-text-primary">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <Marquee items={designStrengths} label="Design strengths" />

        <section
          id="work"
          aria-labelledby="work-title"
          className="px-item-120 py-item-80 max-xl:px-item-40 max-md:px-item-24"
        >
          <div className="mx-auto flex w-full max-w-width-1200 flex-col">
            <SectionHeader
              marker="§02 · Selected work"
              title="Case studies"
              subtitle="A closer look at my work."
              titleId="work-title"
            />
            {caseStudies.map((study) => (
              <div key={study.slug} className="flex flex-col">
                <hr className="my-item-40 border-0 border-t-(length:--stroke-hairline) border-border-subtle" />
                <ProjectCard
                  study={study}
                  media={<Cover slug={study.slug} />}
                />
              </div>
            ))}
          </div>
        </section>

        <Marquee items={howIWork} label="How I work" direction="right" />

        <section
          id="testimonials"
          aria-labelledby="testimonials-title"
          className="flex flex-col items-center bg-surface-light-accent-warm py-item-80"
        >
          <div className="w-full max-w-width-1200 max-xl:px-item-40 max-md:px-item-24">
            <SectionHeader
              marker="§03 · Testimonials"
              title="What others say"
              subtitle="From past teammates"
              tone="warm"
              titleId="testimonials-title"
            />
            <hr className="my-item-40 border-0 border-t-(length:--stroke-hairline) border-border-subtle" />
          </div>
          <TestimonialMarquee testimonials={testimonials} />
        </section>
      </main>
      <Ruler edge="bottom" left="HOME / END" right="EST. 2026" />
      <SiteFooter />
    </div>
  );
}
