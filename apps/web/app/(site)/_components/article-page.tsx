import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { notFound, permanentRedirect } from "next/navigation";
import { Container } from "@geaklabs/ui";
import {
  getPostBySlug,
  getPostsByCategory,
  getPublishedPosts,
  getSeriesParts,
  type ContentSection,
} from "@geaklabs/db";
import { ArticleCard } from "./article-card";
import { ArticleCover } from "./article-cover";
import { JsonLd } from "./json-ld";
import { formatDate } from "@/lib/format";
import { sanitizeArticleHtml, decorateArticleHtml } from "@/lib/sanitize";
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
  const [related, siblings, parts] = await Promise.all([
    post.category
      ? getPostsByCategory(post.category.slug, 4).then((rows) =>
          rows.filter((p) => p.slug !== post.slug).slice(0, 3),
        )
      : Promise.resolve([]),
    getPublishedPosts(100, section),
    post.series ? getSeriesParts(post.series.id) : Promise.resolve([]),
  ]);
  const partIndex = parts.findIndex((p) => p.slug === post.slug);
  const prevPart = partIndex > 0 ? parts[partIndex - 1] : null;
  const nextPart = partIndex >= 0 ? (parts[partIndex + 1] ?? null) : null;
  // "Next" is the post published just before this one; the newest post points at the one after it.
  const at = siblings.findIndex((p) => p.slug === post.slug);
  const next = at === -1 ? null : (siblings[at + 1] ?? siblings[at - 1] ?? null);
  const body = decorateArticleHtml(sanitizeArticleHtml(post.contentHtml ?? ""));

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
      {/* Cover — uploaded photo or generated art, full width. Journal entries read as a log, so no hero. */}
      {section !== "journal" && (
        <Container size="wide">
          <ArticleCover
            post={post}
            priority
            sizes="(max-width: 1440px) 100vw, 1440px"
            className="mt-6 aspect-video"
          />
        </Container>
      )}

      {/* Article header */}
      <Container size="prose">
        <div className="pt-12">
          {post.category ? (
            <Link href={`/topics/${post.category.slug}`} className="kicker text-ink-500">
              {post.category.name}
            </Link>
          ) : (
            <span className="kicker text-ink-500">{section === "professional" ? "Note" : home.label}</span>
          )}
          <h1 className="mt-5 font-serif text-[clamp(3rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.03em] text-ink-900">
            {post.title}
          </h1>
          {post.series && (
            <p className="mt-5 text-sm text-ink-500">
              <Link href={`/series/${post.series.slug}`} className="font-medium text-ink-900 transition-colors hover:text-cyan-ink">
                {post.series.name}
              </Link>
              {partIndex >= 0 && (
                <>
                  <span className="mx-2" aria-hidden>
                    —
                  </span>
                  Part {post.seriesPart ?? partIndex + 1} of {parts.length}
                </>
              )}
            </p>
          )}
          {post.excerpt && (
            <p className="mt-7 text-xl leading-[1.5] text-ink-700">{post.excerpt}</p>
          )}
          <Byline publishedAt={post.publishedAt} readingMinutes={post.readingMinutes} />
        </div>
      </Container>

      <Container size="prose">
        <div className="mt-10 border-b border-ink-900" />
      </Container>

      {/* Body */}
      <Container size="prose">
        <div
          className="prose-editorial mt-12 [&_a]:text-cyan-ink [&_a]:underline [&_h2]:mt-14 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-ink-900 [&_h2+p]:mt-4 [&_p]:mt-[1.05em]"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </Container>

      {/* Series navigation replaces the generic Next teaser for a post in a series */}
      {post.series && (prevPart || nextPart) && (
        <Container size="wide">
          <section className="mt-20 border-t border-ink-900 pt-8">
            <span className="kicker text-ink-500">{post.series.name}</span>
            <div className="mt-6 grid gap-8 pb-12 sm:grid-cols-2">
              {[
                { label: "Previous part", part: prevPart },
                { label: "Next part", part: nextPart },
              ].map(({ label, part }) =>
                part ? (
                  <Link key={label} href={postHref(part)} className="group flex flex-col">
                    <span className="text-sm text-ink-500">{label}</span>
                    <span className="mt-2 font-serif text-[clamp(1.6rem,2.6vw,2.25rem)] leading-[1.05] tracking-[-0.02em] text-ink-900 transition-colors group-hover:text-cyan-ink">
                      {part.title}
                    </span>
                  </Link>
                ) : (
                  <span key={label} />
                ),
              )}
            </div>
          </section>
        </Container>
      )}

      {/* Next */}
      {!post.series && next && (
        <Container size="wide">
          <section className="mt-20 border-t border-ink-900 pt-8">
            <span className="kicker text-ink-500">{section === "journal" ? "Earlier" : "Next"}</span>
            <Link href={postHref(next)} className="group mt-6 grid gap-6 pb-12 sm:grid-cols-12">
              {section !== "journal" && (
                <ArticleCover
                  post={next}
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="aspect-video sm:col-span-4"
                />
              )}
              <div className={section === "journal" ? "sm:col-span-9" : "sm:col-span-7 sm:col-start-6 sm:self-center"}>
                {next.categoryName && <span className="kicker text-ink-500">{next.categoryName}</span>}
                <span className="mt-3 block font-serif text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.02] tracking-[-0.02em] text-ink-900 transition-colors group-hover:text-cyan-ink">
                  {next.title}
                </span>
                {next.excerpt && (
                  <span className="mt-3 block max-w-[52ch] text-base leading-[1.5] text-ink-700">
                    {next.excerpt}
                  </span>
                )}
              </div>
            </Link>
          </section>
        </Container>
      )}

      {/* Related */}
      {related.length > 0 && (
        <Container size="wide">
          <section className="border-t border-rule py-12">
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

/** Author block: the photo at public/brand/author.jpg if present, otherwise a monogram. */
const AUTHOR_PHOTO = existsSync(join(process.cwd(), "public", "brand", "author.jpg"))
  ? "/brand/author.jpg"
  : null;

function Byline({
  publishedAt,
  readingMinutes,
}: {
  publishedAt: Date | string | null;
  readingMinutes: number;
}) {
  return (
    <div className="mt-8 flex items-center gap-4">
      {AUTHOR_PHOTO ? (
        <Image
          src={AUTHOR_PHOTO}
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="flex h-12 w-12 items-center justify-center rounded-full gradient-bg font-display text-sm font-semibold tracking-[0.04em] text-ink-900"
        >
          OA
        </span>
      )}
      <div className="flex flex-col text-sm leading-snug">
        <span className="font-medium text-ink-900">Olugbenga Akinduko</span>
        <span className="text-ink-500">
          {formatDate(publishedAt)}
          <span className="mx-2" aria-hidden>
            —
          </span>
          {readingMinutes} min read
        </span>
      </div>
    </div>
  );
}
