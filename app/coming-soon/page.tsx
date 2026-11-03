import type { Metadata } from "next";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Ruler } from "@/components/Ruler";
import { Star } from "@/components/Star";

export const metadata: Metadata = {
  title: "Coming soon · Abigail Yeap",
  description:
    "Abigail Yeap's portfolio is being finished. Case studies and craft are coming soon.",
};

/**
 * Shown on abigailyeap.com while the portfolio is being finished (see proxy.ts).
 * It uses no images, so nothing unfinished is exposed.
 */
export default function ComingSoon() {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-primary">
      <Ruler edge="top" left="Abi / COMING SOON" right="Folio/26" star jump={false} />
      <main className="flex flex-1 items-center px-item-120 py-item-80 max-xl:px-item-40 max-md:px-item-24 max-md:py-item-48">
        <div className="mx-auto grid w-full max-w-width-1200 grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-center gap-item-56 max-lg:grid-cols-1 max-lg:gap-item-48">
          <div className="flex flex-col gap-item-40">
            <div className="flex flex-wrap items-center gap-item-14">
              <Badge tone="neutral" tilt="left" status>
                Portfolio in progress
              </Badge>
              <Badge tone="warm" tilt="right" star>
                Hello from Singapore
              </Badge>
            </div>
            <h1 className="flex flex-col items-start gap-item-12 font-heading font-wonk text-heading-fraunces-hero text-text-primary">
              <span>My portfolio is</span>
              <span className="rotate-(--rotate-tilt-left) border-(length:--stroke-sticker) border-border-strong bg-surface-raised px-item-17 py-px shadow-sticker max-lg:leading-display-tight">
                <em className="text-text-accent-cool">coming soon</em>
              </span>
            </h1>
            <p className="max-w-width-540 font-sans text-paragraph-md text-text-body">
              I’m Abigail, a senior product designer. The case studies are still
              being put together. Come back soon, or say hello in the meantime.
            </p>
            <div className="flex flex-wrap items-center gap-item-16">
              <Button href="mailto:abigailyeap@gmail.com">Say hello</Button>
              <Button
                href="https://www.linkedin.com/in/abigailyeap/"
                variant="outline"
                newTab
              >
                LinkedIn
              </Button>
            </div>
          </div>

          <aside
            aria-label="Status"
            className="flex flex-col gap-item-24 self-center justify-self-center max-lg:justify-self-start lg:justify-self-end"
          >
            <div className="rotate-(--rotate-tilt-right) border-(length:--stroke-sticker) border-border-strong bg-surface-accent-warm p-item-24 shadow-sticker">
              <p className="font-mono text-mono-m uppercase text-text-accent-warm">
                № 00 · 2026
              </p>
              <p className="mt-item-16 font-heading font-wonk text-heading-fraunces-xl text-text-accent-warm">
                Case studies are still in the studio.
              </p>
              <p className="mt-item-16 flex items-center gap-item-8 font-mono text-mono-m uppercase text-text-accent-warm">
                <Star className="size-item-9" />
                Back soon
              </p>
            </div>
            <ul
              aria-label="What to expect"
              className="flex flex-wrap gap-item-8 rotate-(--rotate-tilt-left)"
            >
              {["Case studies", "Process", "Craft"].map((label) => (
                <li
                  key={label}
                  className="border-(length:--stroke-hairline) border-border-strong bg-surface-canvas px-item-8 py-item-4 font-mono text-mono-m uppercase text-text-primary"
                >
                  {label}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>
      <Ruler edge="bottom" left="COMING SOON / END" right="EST. 2026" jump={false} />
      <p className="bg-surface-primary px-item-24 py-item-24 text-center font-sans text-label-caption uppercase text-text-sub-headers">
        © Copyright 2026 Abigail Yeap · Singapore
      </p>
    </div>
  );
}
