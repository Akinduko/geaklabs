import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@geaklabs/ui";
import { getAllSeries, getSeriesBySlug, getSeriesParts } from "@geaklabs/db";
import { ArticleCover } from "../../_components/article-cover";
import { JsonLd } from "../../_components/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { postHref } from "@/lib/sections";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const all = await getAllSeries();
  return all.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const s = await getSeriesBySlug(slug);
  if (!s) return { title: "Series" };
  return {
    title: s.name,
    description: s.description ?? undefined,
    alternates: { canonical: `/series/${slug}` },
    openGraph: { type: "website", siteName: "GEAK LABS", url: `/series/${slug}`, title: s.name, description: s.description ?? undefined },
  };
}

export default async function SeriesPage({ params }: Params) {
  const { slug } = await params;
  const s = await getSeriesBySlug(slug);
  if (!s) notFound();
  const parts = await getSeriesParts(s.id);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Series", path: "/series" },
          { name: s.name, path: `/series/${s.slug}` },
        ])}
      />
      <Container size="wide">
        <header className="max-w-3xl py-14 lg:py-20">
          <Link href="/series" className="kicker text-ink-500 transition-colors hover:text-cyan-ink">
            Series
          </Link>
          <h1 className="mt-5 font-serif text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.92] tracking-[-0.03em] text-ink-900">
            {s.name}
          </h1>
          {s.description && (
            <p className="mt-7 max-w-[52ch] text-lg leading-[1.55] text-ink-700">{s.description}</p>
          )}
        </header>
      </Container>

      <Container size="wide">
        {parts.length === 0 ? (
          <p className="border-t border-ink-900 py-24 text-lg text-ink-500">No parts published yet.</p>
        ) : (
          <ol className="border-t border-ink-900">
            {parts.map((p, i) => (
              <li key={p.id} className="border-b border-rule">
                <Link href={postHref(p)} className="group grid gap-6 py-8 sm:grid-cols-12 sm:gap-6">
                  <span className="font-serif text-3xl leading-none text-ink-500 sm:col-span-1 sm:pt-1">
                    {p.seriesPart ?? i + 1}
                  </span>
                  <ArticleCover
                    post={p}
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="aspect-video sm:col-span-3"
                  />
                  <div className="sm:col-span-7 sm:col-start-6 sm:self-center">
                    {p.categoryName && <span className="kicker text-ink-500">{p.categoryName}</span>}
                    <h2 className="mt-2 text-2xl font-medium leading-[1.2] tracking-[-0.02em] text-ink-900 transition-colors group-hover:text-cyan-ink sm:text-3xl">
                      {p.title}
                    </h2>
                    {p.excerpt && (
                      <p className="mt-3 max-w-[52ch] text-[15px] leading-normal text-ink-700">{p.excerpt}</p>
                    )}
                    <span className="mt-3 block text-xs text-ink-500">
                      {formatDate(p.publishedAt)} · {p.readingMinutes} min read
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </Container>
    </>
  );
}
