import { readdir } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { CaseStudyLayout } from "@/components/CaseStudyLayout";
import { isCaseStudyVisible, type CaseStudyMeta } from "@/lib/case-studies";

const CONTENT_DIR = path.join(process.cwd(), "content", "case-studies");

// Every study is prerendered by generateStaticParams, so the page is allowed to read
// `params` directly. Wrapping it in Suspense instead streamed the page in behind a blank
// placeholder in development, which made a reload lose the scroll position.
export const instant = false;

export default async function CaseStudy({
  params,
}: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const study = await import(`@/content/case-studies/${slug}.mdx`).catch(
    () => null,
  );
  if (!study || !(await isCaseStudyVisible(slug))) notFound();
  const Study = study.default;
  const meta = study.frontmatter as CaseStudyMeta;

  // Stubs only have a title and status, so they keep the plain page.
  if (!meta.hero) {
    return (
      <main className="mx-auto w-full max-w-3xl p-8">
        <Study />
      </main>
    );
  }
  return (
    <CaseStudyLayout slug={slug} meta={meta}>
      <Study />
    </CaseStudyLayout>
  );
}

export async function generateStaticParams() {
  const files = await readdir(CONTENT_DIR);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => ({ slug: file.slice(0, -".mdx".length) }));
}
