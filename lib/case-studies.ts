export type CaseStudyStatus = "draft" | "published";

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
