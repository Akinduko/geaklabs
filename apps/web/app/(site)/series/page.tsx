import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@geaklabs/ui";
import { getAllSeries, getSiteCopy } from "@geaklabs/db";
import { ArticleCover } from "../_components/article-cover";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getSiteCopy();
  return {
    alternates: { canonical: "/series" },
    title: "Series",
    description: copy["series.intro"],
  };
}

export default async function SeriesIndexPage() {
  const [all, copy] = await Promise.all([getAllSeries(), getSiteCopy()]);
  const list = all.filter((s) => s.partCount > 0);

  return (
    <>
      <Container size="wide">
        <header className="max-w-3xl py-14 lg:py-20">
          <h1 className="font-serif text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.92] tracking-[-0.03em] text-ink-900">
            Series
          </h1>
          <p className="mt-7 max-w-[52ch] text-lg leading-[1.55] text-ink-700">{copy["series.intro"]}</p>
        </header>
      </Container>

      <Container size="wide">
        {list.length === 0 ? (
          <p className="border-t border-ink-900 py-24 text-lg text-ink-500">Nothing published yet.</p>
        ) : (
          <ul className="border-t border-ink-900">
            {list.map((s) => (
              <li key={s.id} className="border-b border-rule">
                <Link href={`/series/${s.slug}`} className="group grid gap-6 py-10 lg:grid-cols-12 lg:gap-6">
                  <ArticleCover
                    post={{ slug: `series:${s.slug}`, title: s.name, coverImageUrl: s.coverImageUrl, coverImageAlt: s.name }}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="aspect-video lg:col-span-4"
                  />
                  <div className="flex flex-col justify-center lg:col-span-7 lg:col-start-6">
                    <h2 className="font-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1] tracking-[-0.02em] text-ink-900 transition-colors group-hover:text-cyan-ink">
                      {s.name}
                    </h2>
                    {s.description && (
                      <p className="mt-4 max-w-[52ch] text-lg leading-[1.5] text-ink-700">{s.description}</p>
                    )}
                    <span className="mt-5 text-sm text-ink-500">
                      {s.partCount} {s.partCount === 1 ? "part" : "parts"}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
