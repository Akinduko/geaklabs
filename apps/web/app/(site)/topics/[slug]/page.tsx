import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@geaklabs/ui";
import { getCategoryBySlug, getPostsByCategory, getAllCategories } from "@geaklabs/db";
import { ArticleCard } from "../../_components/article-card";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const cats = await getAllCategories();
  return cats.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Topic" };
  return { title: category.name, description: category.description ?? undefined };
}

export default async function TopicPage({ params }: Params) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const posts = await getPostsByCategory(slug);

  return (
    <>
      <Container size="wide">
        <header className="max-w-3xl py-14 lg:py-20">
          <span className="kicker text-ink-500">Topic</span>
          <h1 className="mt-5 font-serif text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.92] tracking-[-0.03em] text-ink-900">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-7 max-w-[52ch] text-lg leading-[1.55] text-ink-700">
              {category.description}
            </p>
          )}
        </header>
      </Container>

      <Container size="wide">
        {posts.length === 0 ? (
          <p className="border-t border-ink-900 py-24 text-lg text-ink-500">
            Nothing in {category.name} yet.
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
