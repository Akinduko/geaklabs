import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import { Container } from "@geaklabs/ui";
import { getPostBySlug, getPostsByCategory, type ContentSection } from "@geaklabs/db";
import { ArticleCard } from "./article-card";
import { JsonLd } from "./json-ld";
import { formatDate } from "@/lib/format";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { SECTIONS, postHref } from "@/lib/sections";

/**
 * One article page, shared by /articles/[slug] and /faith/[slug].
 * A post requested under the wrong section is redirected to its canonical URL,
 * so each slug has exactly one address.
 */
export type ArticleParams = { params: Promise<{ slug: string }> };

export async function articleMetadata(
  { params }: ArticleParams,
  section: ContentSection,
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") return { title: "Not found" };
  const href = postHref(post);
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: href },
    authors: [{ name: "Olugbenga Akinduko" }],
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      url: href,
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      authors: ["Olugbenga Akinduko"],
      section: post.category?.name ?? SECTIONS[section].label,
      images: [post.coverImageUrl ?? "/opengraph-image"],
    },
  };
}

export async function ArticlePage({ params, section }: ArticleParams & { section: ContentSection }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") notFound();
  if (post.section !== section) permanentRedirect(postHref(post));

  const home = SECTIONS[section];
  const related = post.category
    ? (await getPostsByCategory(post.category.slug, 4)).filter((p) => p.slug !== post.slug).slice(0, 3)
    : [];

  return (
    <article className="pb-8">
      <JsonLd data={articleJsonLd({ ...post, categoryName: post.category?.name ?? null })} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: home.label, path: home.path },
          { name: post.title, path: postHref(post) },
        ])}
      />
      {/* Article header */}
      <Container size="prose">
        <div className="pt-14">
          {post.category ? (
            <Link href={`/topics/${post.category.slug}`} className="kicker text-ink-500">
              {post.category.name}
            </Link>
          ) : (
            <span className="kicker text-ink-500">{section === "faith" ? "Faith" : "Essay"}</span>
          )}
          <h1 className="mt-5 font-serif text-[clamp(3rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.03em] text-ink-900">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-7 text-xl leading-[1.5] text-ink-700">{post.excerpt}</p>
          )}
          <div className="mt-7 flex items-center gap-3 text-sm text-ink-500">
            <span>Olugbenga Akinduko</span>
            <span aria-hidden>·</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span aria-hidden>·</span>
            <span>{post.readingMinutes} min read</span>
          </div>
        </div>
      </Container>

      <Container size="prose">
        <div className="mt-10 border-b border-ink-900" />
      </Container>

      {/* Cover */}
      {post.coverImageUrl && (
        <Container size="default">
          <div className="relative mt-10 aspect-[16/9] overflow-hidden bg-ink-100">
            <Image
              src={post.coverImageUrl}
              alt={post.coverImageAlt ?? post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        </Container>
      )}

      {/* Body */}
      <Container size="prose">
        <div
          className="prose-editorial mt-12 [&_a]:text-cyan-ink [&_a]:underline [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-ink-900 [&_p]:mt-6"
          dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(post.contentHtml ?? "") }}
        />
      </Container>

      {/* Related */}
      {related.length > 0 && (
        <Container size="wide">
          <section className="mt-20 border-t border-ink-900 py-12">
            <span className="kicker text-ink-500">More in {post.category?.name}</span>
            <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-3">
              {related.map((r) => (
                <ArticleCard key={r.slug} post={r} />
              ))}
            </div>
          </section>
        </Container>
      )}
    </article>
  );
}
