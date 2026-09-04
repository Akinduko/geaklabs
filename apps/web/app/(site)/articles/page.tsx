import type { Metadata } from "next";
import { Container } from "@geaklabs/ui";
import { getPublishedPosts, getSiteCopy } from "@geaklabs/db";
import { ArticleCard } from "../_components/article-card";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/articles" },
  title: "Writing",
  description: "Essays on leadership, management, and technology.",
};

export default async function ArticlesPage() {
  const [posts, copy] = await Promise.all([getPublishedPosts(), getSiteCopy()]);

  return (
    <>
      <Container size="wide">
        <header className="max-w-3xl py-14 lg:py-20">
          <h1 className="font-serif text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.92] tracking-[-0.03em] text-ink-900">
            Writing
          </h1>
          <p className="mt-7 max-w-[52ch] text-lg leading-[1.55] text-ink-700">
            {copy["articles.intro"]}
          </p>
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
