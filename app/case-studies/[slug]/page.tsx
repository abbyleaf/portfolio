import { readdir } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CaseStudyLayout } from "@/components/CaseStudyLayout";
import { isCaseStudyVisible, type CaseStudyMeta } from "@/lib/case-studies";

const CONTENT_DIR = path.join(process.cwd(), "content", "case-studies");

export default function CaseStudyPage(props: PageProps<"/case-studies/[slug]">) {
  // `params` is read inside Suspense so the page shell can render before the slug is known.
  return (
    <Suspense fallback={<div className="min-h-dvh bg-surface-primary" />}>
      <CaseStudy params={props.params} />
    </Suspense>
  );
}

async function CaseStudy({
  params,
}: Pick<PageProps<"/case-studies/[slug]">, "params">) {
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
