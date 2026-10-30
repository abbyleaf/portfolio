import type { Metadata } from "next";
import { AboutHeading } from "@/components/AboutHeading";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Marquee } from "@/components/Marquee";
import { PageFrame } from "@/components/PageFrame";
import { PortraitPolaroid } from "@/components/PortraitPolaroid";
import { Tag } from "@/components/Tag";
import { howIWork } from "@/content/home";
import {
  experience,
  personalInterests,
  skillGroups,
} from "@/content/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "Senior product designer in Singapore with nine years of design experience.",
};

const sectionPadding =
  "px-item-120 py-item-80 max-xl:px-item-40 max-md:px-item-24";
const sideColumn = "w-item-320 max-w-width-360 shrink-0 max-lg:w-full";

export default function AboutPage() {
  return (
    <PageFrame topLabel="Abi / ABOUT" bottomLabel="ABOUT / END">
      <section
        aria-labelledby="about-title"
        data-ruler-section="About"
        className={sectionPadding}
      >
        <div className="mx-auto flex w-full max-w-width-1200 items-start gap-item-80 max-lg:flex-col max-lg:gap-item-40">
          <div className={`flex flex-col gap-item-16 ${sideColumn}`}>
            <div className="flex flex-wrap items-center gap-item-12">
              <Badge tone="neutral" tilt="left" status>
                Open to work
              </Badge>
              <Badge tone="warm" tilt="right" star>
                Singapore
              </Badge>
            </div>
            <div className="my-item-12 max-lg:mx-item-12">
              <PortraitPolaroid
                src="/images/about/abigail-portrait.webp"
                alt="Abigail smiling and looking to the side, seated on a red sculpture among large paper flowers"
                caption="Hi there!"
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-item-40">
            <h1 id="about-title" className="flex flex-col gap-item-8">
              <span className="font-heading font-wonk text-heading-fraunces-italic-md italic text-text-accent-cool">
                Senior Product Designer
              </span>
              <span className="font-heading font-wonk text-heading-fraunces-name text-text-primary">
                Abigail Yeap
              </span>
            </h1>
            <div className="flex flex-col gap-item-24 font-sans text-paragraph-md text-text-body">
              <p>
                Based in Singapore with 9 years of design experience, including
                over 6 years designing logistics tools and passenger transport
                apps across Southeast Asia and Japan, and 3 years in multimedia
                design.
              </p>
              <p>
                I enjoy understanding how things work, questioning assumptions
                and figuring out how to make complex workflows simpler.
              </p>
              <p>
                Outside of work, I enjoy crafting, especially when I get to
                create things for children through volunteer work. I also love
                collecting stamps and stickers from around the world, and having
                a good cup of bubble tea (less sugar, always 🧋).
              </p>
              <p>
                I’m open to new opportunities from{" "}
                <strong className="font-bold">December 2026 onwards</strong>.
                Reach out if you’d like to work together or just say hello!
              </p>
            </div>
            <div className="flex flex-wrap gap-item-20">
              <Button href="mailto:abigailyeap@gmail.com" variant="outline">
                Get in touch!
              </Button>
              <Button href="/resume.pdf" newTab>
                View resume
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Marquee items={personalInterests} label="Interests" tone="warm" />

      <section
        aria-labelledby="experience-title"
        data-ruler-section="Experience"
        className={`bg-surface-canvas ${sectionPadding}`}
      >
        <div className="mx-auto flex w-full max-w-width-1200 items-start gap-item-80 max-lg:flex-col max-lg:gap-item-40">
          <div className={sideColumn}>
            <AboutHeading
              id="experience-title"
              marker="Experience"
              lead="Nine years,"
              accent="two companies."
            />
          </div>
          <ol className="flex min-w-0 flex-1 flex-col">
            {experience.map((job) => (
              <li
                key={job.title + job.period}
                className="flex gap-item-m border-t-(length:--stroke-hairline) border-border-subtle py-item-m first:border-t-0 max-md:flex-col-reverse max-md:gap-item-8"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-item-8">
                  <h3 className="font-heading font-wonk text-heading-fraunces-lg leading-natural text-text-body">
                    {job.title}
                  </h3>
                  <p className="font-sans text-heading-inter-sm uppercase leading-natural text-text-accent-cool">
                    {job.company}
                  </p>
                  <p className="pt-item-2 font-sans text-paragraph-md text-text-muted">
                    {job.summary}
                  </p>
                </div>
                <p className="w-item-150 shrink-0 pt-item-4 text-right font-sans text-label-caption tracking-date text-text-muted max-md:w-auto max-md:text-left">
                  {job.period}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Marquee
        items={howIWork}
        label="How I work"
        direction="right"
        tone="warm"
      />

      <section
        aria-labelledby="skills-title"
        data-ruler-section="Skills"
        className={sectionPadding}
      >
        <div className="mx-auto flex w-full max-w-width-1200 items-start gap-item-40 max-lg:flex-col">
          <div className={sideColumn}>
            <AboutHeading
              id="skills-title"
              marker="Skills"
              lead="What I bring"
              accent="to the table"
            />
          </div>
          <div className="grid min-w-0 flex-1 grid-cols-2 gap-item-36 max-md:grid-cols-1">
            {skillGroups.map((group) => (
              <div key={group.label} className="flex flex-col gap-item-16">
                <h3 className="font-sans text-heading-inter-xs uppercase text-text-sub-headers">
                  {group.label}
                </h3>
                <ul className="flex flex-wrap gap-item-8">
                  {group.skills.map((skill) => (
                    <Tag key={skill} size="md">
                      {skill}
                    </Tag>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
