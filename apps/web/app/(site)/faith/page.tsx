import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@geaklabs/ui";
import { getPublishedPosts, getAllCategories, getSiteCopy } from "@geaklabs/db";
import { ArticleCard } from "../_components/article-card";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getSiteCopy();
  return {
    alternates: {
      canonical: "/faith",
      types: { "application/rss+xml": [{ url: "/faith/rss.xml", title: copy["faith.rssTitle"] }] },
    },
    title: copy["faith.title"],
    description: copy["faith.metaDescription"],
  };
}

export default async function FaithPage() {
  const [posts, topics, copy] = await Promise.all([
    getPublishedPosts(undefined, "faith"),
    getAllCategories("faith"),
    getSiteCopy(),
  ]);

  return (
    <>
      <Container size="wide">
        <header className="max-w-3xl py-14 lg:py-20">
          <h1 className="font-serif text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.92] tracking-[-0.03em] text-ink-900">
            {copy["faith.title"]}
          </h1>
          <p className="mt-7 max-w-[52ch] text-lg leading-[1.55] text-ink-700">
            {copy["faith.intro"]}
          </p>
          {topics.length > 1 && (
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
              {topics.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/topics/${t.slug}`}
                    className="border-b border-ink-900 pb-0.5 text-ink-900 transition-colors hover:border-cyan-ink hover:text-cyan-ink"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </header>
      </Container>

      <Container size="wide">
        {posts.length === 0 ? (
          <p className="border-t border-ink-900 py-24 text-lg text-ink-500">
            Nothing published yet.
          </p>
        ) : (
          <div className="grid gap-x-8 gap-y-14 border-t border-ink-900 py-14 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <ArticleCard key={post.slug} post={post} priority={i < 3} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
