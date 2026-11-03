import { readdir } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { isCaseStudyVisible } from "@/lib/case-studies";

const CONTENT_DIR = path.join(process.cwd(), "content", "case-studies");

export default async function CaseStudy({
  params,
}: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const study = await import(`@/content/case-studies/${slug}.mdx`).catch(
    () => null,
  );
  if (!study || !(await isCaseStudyVisible(slug))) notFound();
  const Study = study.default;

  return (
    <main className="mx-auto w-full max-w-3xl p-8">
      <Study />
    </main>
  );
}

export async function generateStaticParams() {
  const files = await readdir(CONTENT_DIR);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => ({ slug: file.slice(0, -".mdx".length) }));
}
