import Link from "next/link";
import { caseStudies, footerLinks } from "@/content/home";
import { isCaseStudyVisible } from "@/lib/case-studies";

const labelClass =
  "font-sans text-label-upper uppercase text-grey-44";

export async function SiteFooter() {
  const visible = await Promise.all(
    caseStudies.map((study) => isCaseStudyVisible(study.slug)),
  );
  return (
    <footer id="contact" data-ruler-section="Contact" className="flex flex-col border-t-(length:--stroke-sticker) border-border-strong items-center gap-item-m bg-surface-primary px-item-64 max-xl:px-item-40 max-md:px-item-24 pb-item-m pt-item-56">
      <div className="grid min-h-item-117_4 w-full max-w-width-1400 grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-item-40 max-md:grid-cols-1">
        <div className="flex flex-col gap-item-9">
          <p className={labelClass}>Work with me</p>
          <a
            href="mailto:abigailyeap@gmail.com"
            className="font-sans text-heading-inter-lg text-text-primary"
          >
            abigailyeap@gmail.com
          </a>
        </div>
        <nav aria-label="My info" className="flex flex-col gap-item-10">
          <p className={labelClass}>My info</p>
          <ul className="flex flex-col gap-item-6">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...((link.href.endsWith(".pdf") || link.href.startsWith("http")) && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                  className="font-sans text-label-sm text-text-primary hover:underline"
                >
                  {link.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav
          aria-label="Recommended case studies"
          className="flex flex-col gap-item-10"
        >
          <p className={labelClass}>Recommended case studies</p>
          <ol className="flex flex-col gap-item-6">
            {caseStudies.map((study, index) => (
              <li key={study.slug} className="font-sans text-label-sm text-text-primary">
                {study.number} —{" "}
                {visible[index] ? (
                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="hover:underline"
                  >
                    {footerTitles[study.slug]}
                  </Link>
                ) : (
                  <span className="text-text-muted">
                    {footerTitles[study.slug]} (coming soon)
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <p className="w-full max-w-width-1400 border-t-(length:--stroke-hairline) border-grey-10/10 pt-item-33 text-center font-sans text-label-caption uppercase text-text-sub-headers">
        © Copyright 2026 Abigail Yeap · Singapore
      </p>
    </footer>
  );
}

const footerTitles: Record<string, string> = {
  "campus-ride-booking": "Campus Ride Booking",
  "order-splitting": "Order Splitting",
  "manual-route-planning": "Manual Route Planning",
};
