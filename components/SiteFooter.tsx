import Link from "next/link";
import { caseStudies, footerLinks } from "@/content/home";

const labelClass =
  "font-sans text-label-upper uppercase text-grey-44";

export function SiteFooter() {
  return (
    <footer className="flex flex-col items-center gap-item-m bg-surface-primary px-item-64 pb-item-m pt-item-56">
      <div className="grid min-h-item-117_4 w-full max-w-width-1280 grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-item-40 max-md:grid-cols-1">
        <div className="flex flex-col gap-item-9">
          <p className={labelClass}>Work with me</p>
          <a
            href="mailto:abigailyeap@gmail.com"
            className="font-sans text-heading-inter-lg text-grey-10"
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
                  className="font-sans text-label-sm text-grey-10 hover:underline"
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
            {caseStudies.map((study) => (
              <li key={study.slug} className="font-sans text-label-sm text-text-primary">
                {study.number} —{" "}
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="hover:underline"
                >
                  {footerTitles[study.slug]}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <p className="w-full max-w-width-1312 border-t-(length:--stroke-hairline) border-grey-10/10 pt-item-33 text-center font-sans text-label-caption uppercase text-text-sub-headers">
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
