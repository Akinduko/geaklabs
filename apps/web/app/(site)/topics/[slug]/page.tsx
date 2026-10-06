import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@geaklabs/ui";
import { getCategoryBySlug, getPostsByCategory, getAllCategories } from "@geaklabs/db";
import { ArticleCard } from "../../_components/article-card";
import { ArticleLead } from "../../_components/article-lead";
import { SECTIONS } from "@/lib/sections";

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
  return {
    title: category.name,
    description: category.description ?? undefined,
    alternates: { canonical: `/topics/${slug}` },
  };
}

export default async function TopicPage({ params }: Params) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const posts = await getPostsByCategory(slug);
  const home = SECTIONS[category.section];

  return (
    <>
      <Container size="wide">
        <header className="max-w-3xl py-14 lg:py-20">
          <Link href={home.path} className="kicker text-ink-500 transition-colors hover:text-cyan-ink">
            {home.label} · Topic
          </Link>
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
          <>
            {posts[0] && <ArticleLead post={posts[0]} />}
            {posts.length > 1 && (
              <div className="grid gap-x-8 gap-y-14 border-t border-rule py-14 sm:grid-cols-2 lg:grid-cols-3">
                {posts.slice(1).map((post, i) => (
                  <ArticleCard key={post.slug} post={post} priority={i < 2} />
                ))}
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
}
