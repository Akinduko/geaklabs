import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@geaklabs/ui";
import { getPublishedPosts, getSiteCopy } from "@geaklabs/db";
import { formatDate } from "@/lib/format";
import { postHref } from "@/lib/sections";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getSiteCopy();
  return {
    alternates: {
      canonical: "/journal",
      types: { "application/rss+xml": [{ url: "/journal/rss.xml", title: copy["journal.rssTitle"] }] },
    },
    title: copy["journal.title"],
    description: copy["journal.metaDescription"],
  };
}

/** The journal reads as a dated log: no covers, no lead entry, newest first. */
export default async function JournalPage() {
  const [entries, copy] = await Promise.all([getPublishedPosts(undefined, "journal"), getSiteCopy()]);

  return (
    <>
      <Container size="wide">
        <header className="max-w-3xl py-14 lg:py-20">
          <h1 className="font-serif text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.92] tracking-[-0.03em] text-ink-900">
            {copy["journal.title"]}
          </h1>
          <p className="mt-7 max-w-[52ch] text-lg leading-[1.55] text-ink-700">{copy["journal.intro"]}</p>
        </header>
      </Container>

      <Container size="wide">
        {entries.length === 0 ? (
          <p className="border-t border-ink-900 py-24 text-lg text-ink-500">Nothing written yet.</p>
        ) : (
          <ol className="border-t border-ink-900">
            {entries.map((entry) => (
              <li key={entry.slug} className="border-b border-rule">
                <Link href={postHref(entry)} className="group grid gap-2 py-7 lg:grid-cols-12 lg:gap-6">
                  <time
                    dateTime={entry.publishedAt ? new Date(entry.publishedAt).toISOString() : undefined}
                    className="font-serif text-xl leading-tight text-ink-500 lg:col-span-3"
                  >
                    {formatDate(entry.publishedAt)}
                  </time>
                  <div className="lg:col-span-8">
                    <h2 className="text-2xl font-medium leading-[1.2] tracking-[-0.02em] text-ink-900 transition-colors group-hover:text-cyan-ink">
                      {entry.title}
                    </h2>
                    {entry.excerpt && (
                      <p className="mt-2 max-w-[60ch] text-[15px] leading-normal text-ink-700">{entry.excerpt}</p>
                    )}
                    <span className="mt-2 block text-xs text-ink-500">{entry.readingMinutes} min read</span>
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
