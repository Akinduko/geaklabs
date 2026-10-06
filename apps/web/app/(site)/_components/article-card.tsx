import Link from "next/link";
import type { ContentSection } from "@geaklabs/db";
import { formatDate } from "@/lib/format";
import { postHref } from "@/lib/sections";
import { ArticleCover } from "./article-cover";

export type ArticleCardData = {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  readingMinutes: number;
  publishedAt: Date | string | null;
  categoryName: string | null;
  categorySlug: string | null;
  section?: ContentSection | null;
};

export function ArticleCard({ post, priority }: { post: ArticleCardData; priority?: boolean }) {
  return (
    <article className="group flex flex-col">
      <Link href={postHref(post)} className="flex flex-col">
        <ArticleCover
          post={post}
          priority={priority}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="mb-5 aspect-[16/10]"
        />
        {post.categoryName && <span className="kicker text-ink-500">{post.categoryName}</span>}
        <h3 className="mt-2.5 text-2xl font-medium leading-[1.2] tracking-[-0.02em] text-ink-900 transition-colors group-hover:text-cyan-ink">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-3 text-[15px] leading-normal text-ink-700">{post.excerpt}</p>
        )}
      </Link>
      <span className="mt-3 text-xs text-ink-500">
        {formatDate(post.publishedAt)} · {post.readingMinutes} min read
      </span>
    </article>
  );
}
