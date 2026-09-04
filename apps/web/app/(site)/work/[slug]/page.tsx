import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@geaklabs/ui";
import { getProjectBySlug, getProjects } from "@geaklabs/db";
import { sanitizeArticleHtml } from "@/lib/sanitize";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || project.status !== "published") return { title: "Not found" };
  return {
    title: project.title,
    description: project.summary ?? undefined,
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || project.status !== "published") notFound();

  return (
    <article className="pb-20">
      <Container size="wide">
        <div className="pt-14">
          <Link href="/work" className="text-sm text-ink-500 transition-colors hover:text-cyan-ink">
            ← All work
          </Link>
          {project.role && <p className="kicker mt-8 text-ink-500">{project.role}</p>}
          <h1 className="mt-5 font-serif text-[clamp(3rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.03em] text-ink-900">
            {project.title}
          </h1>
          {project.summary && (
            <p className="mt-7 max-w-[58ch] text-xl leading-[1.5] text-ink-700">
              {project.summary}
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-ink-900 px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-cyan-ink"
              >
                Visit live ↗
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-ink-900 px-5 py-2.5 text-sm font-medium text-ink-900 transition-colors hover:border-cyan-ink hover:text-cyan-ink"
              >
                Source ↗
              </a>
            )}
          </div>
          {project.techStack.length > 0 && (
            <p className="mt-6 text-xs text-ink-500">
              {project.techStack.join(" · ")}
            </p>
          )}
        </div>
      </Container>

      {(project.coverImageUrl || project.descriptionHtml) && (
        <Container size="wide">
          <div className="mt-10 border-b border-ink-900" />
        </Container>
      )}

      {project.coverImageUrl && (
        <Container size="default">
          <div className="relative mt-10 aspect-[16/9] overflow-hidden bg-ink-100">
            <Image
              src={project.coverImageUrl}
              alt={project.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        </Container>
      )}

      {project.descriptionHtml && (
        <Container size="prose">
          <div
            className="prose-editorial mt-12 [&_a]:text-cyan-ink [&_a]:underline [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_p]:mt-6"
            dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(project.descriptionHtml) }}
          />
        </Container>
      )}
    </article>
  );
}
