import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyLayout } from "@/components/CaseStudyLayout";
import { LockedGate } from "@/components/LockedGate";
import { PasswordGate } from "@/components/PasswordGate";
import { isCaseStudyVisible, type CaseStudyMeta } from "@/lib/case-studies";

const CONTENT_DIR = path.join(process.cwd(), "content", "case-studies");

export const instant = false;

// The locked version is what a visitor without the password gets at /case-studies/<slug>
// (proxy.ts rewrites to it), so search engines should skip it.
export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * A case study as a visitor without the password sees it: the page frame and hero come from
 * the frontmatter, the body is drawn with `Locked` swapped for the password box, and the
 * hidden part is never rendered, so none of it reaches the browser. A study with no
 * <Locked> block in its body shows only the hero and the password box.
 */
export default async function LockedCaseStudy({
  params,
}: PageProps<"/case-studies/[slug]/locked">) {
  const { slug } = await params;
  const study = await import(`@/content/case-studies/${slug}.mdx`).catch(() => null);
  if (!study || !(await isCaseStudyVisible(slug))) notFound();
  const Study = study.default;
  const meta = study.frontmatter as CaseStudyMeta;
  const source = await readFile(path.join(CONTENT_DIR, `${slug}.mdx`), "utf8");
  const hasLockedBlock = source.includes("<Locked>");
  // Ignores the hidden children, so none of them is rendered or sent (see LockedGate).
  const lockedIds = (meta.toc ?? []).map((item) => item.id);
  const anchors = meta.lockedFrom ? lockedIds.slice(lockedIds.indexOf(meta.lockedFrom)) : [];
  const Gate = () => <LockedGate landOn={meta.lockedFrom} anchors={anchors} />;

  // Stubs only have a title and status, so they keep the plain page.
  if (!meta.hero) {
    return (
      <main className="mx-auto w-full max-w-3xl p-8">
        <h1 className="font-heading text-heading-fraunces-xl">{meta.title}</h1>
        <PasswordGate />
      </main>
    );
  }
  return (
    <CaseStudyLayout slug={slug} meta={meta} locked>
      {hasLockedBlock ? <Study components={{ Locked: Gate }} /> : <PasswordGate landOn={meta.lockedFrom} anchors={anchors} />}
    </CaseStudyLayout>
  );
}

export async function generateStaticParams() {
  const files = await readdir(CONTENT_DIR);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => ({ slug: file.slice(0, -".mdx".length) }));
}
