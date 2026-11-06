export type CaseStudyStatus = "draft" | "published";

/** Frontmatter of a full case study page. Stubs only carry `title` and `status`. */
export type CaseStudyMeta = {
  title: string;
  status: CaseStudyStatus;
  /** "01" in "case 01". */
  number?: string;
  /** Badge texts next to the big "case" number: [status, role]. */
  badges?: [string, string];
  category?: string;
  summary?: string;
  hero?: { src: string; alt: string; width: number; height: number };
  platform?: string;
  /** Replaces platform, timeline and role when a study needs different facts (e.g. two timelines). */
  facts?: { label: string; value: string }[];
  timeline?: string;
  role?: string;
  team?: string;
  contribution?: string[];
  responsibilities?: string;
  /** Entries for the contents rail; each `id` is a `<Section id>` in the body. */
  toc?: { id: string; label: string }[];
  /** `id` of the first `toc` entry that sits inside the body's <Locked> block. */
  lockedFrom?: string;
  /** Slug of the case study the header and the closing band point to. */
  next?: string;
};

/**
 * Whether draft case studies are shown. Set SHOW_DRAFTS=true for the `test` branch only
 * (see "Draft case studies" in CLAUDE.md). The code is identical on every branch.
 */
export const showDrafts = process.env.SHOW_DRAFTS === "true";

/** A case study's `status` frontmatter, or null when it has no MDX file yet. */
export async function getCaseStudyStatus(
  slug: string,
): Promise<CaseStudyStatus | null> {
  const study = await import(`@/content/case-studies/${slug}.mdx`).catch(
    () => null,
  );
  if (!study) return null;
  return study.frontmatter?.status === "published" ? "published" : "draft";
}

/** Published studies are always visible; drafts only when SHOW_DRAFTS is "true". */
export async function isCaseStudyVisible(slug: string): Promise<boolean> {
  const status = await getCaseStudyStatus(slug);
  if (status === null) return false;
  return status === "published" || showDrafts;
}
