import type { Metadata } from "next";
import { JobTracker } from "@/components/JobTracker";
import { PageFrame } from "@/components/PageFrame";

export const metadata: Metadata = {
  title: "Job tracker",
  description: "A private tracker for job applications.",
  // A personal tool at an unlisted address: keep it out of search results.
  robots: { index: false, follow: false },
};

export default function JobTrackerPage() {
  return (
    <PageFrame topLabel="Abi / TRACKER" bottomLabel="TRACKER / END">
      <section
        aria-labelledby="tracker-title"
        data-ruler-section="Tracker"
        className="px-item-120 py-item-80 max-xl:px-item-40 max-md:px-item-24"
      >
        <div className="mx-auto flex w-full max-w-width-1200 flex-col gap-item-40">
          <div className="flex flex-col gap-item-18">
            <p className="font-mono text-mono-marker uppercase text-text-muted">
              Job hunt / 2026
            </p>
            <h1 id="tracker-title" className="flex flex-col">
              <span className="font-sans text-heading-inter-xl text-text-primary">
                Application
              </span>
              <span className="font-heading font-wonk text-heading-fraunces-italic-xl italic text-text-accent-cool">
                tracker
              </span>
            </h1>
          </div>
          <JobTracker />
        </div>
      </section>
    </PageFrame>
  );
}
