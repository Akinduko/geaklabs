import Link from "next/link";
import { formatDate } from "@/lib/format";
import { postHref } from "@/lib/sections";
import { ArticleCover } from "./article-cover";
import type { ArticleCardData } from "./article-card";

/** The newest post on a listing, set large with its cover beside the text. */
export function ArticleLead({ post }: { post: ArticleCardData }) {
  return (
    <article className="group border-t border-ink-900 py-10 lg:py-14">
      <Link href={postHref(post)} className="grid gap-8 lg:grid-cols-12 lg:gap-6">
        <ArticleCover
          post={post}
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="aspect-video lg:col-span-7"
        />
        <div className="flex flex-col justify-center lg:col-span-5">
          {post.categoryName && <span className="kicker text-ink-500">{post.categoryName}</span>}
          <h2 className="mt-4 font-serif text-[clamp(2.25rem,4.2vw,3.75rem)] leading-[0.98] tracking-[-0.025em] text-ink-900 transition-colors group-hover:text-cyan-ink">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="mt-5 max-w-[48ch] text-lg leading-[1.5] text-ink-700">{post.excerpt}</p>
          )}
          <span className="mt-6 text-sm text-ink-500">
            {formatDate(post.publishedAt)}
            <span className="mx-2" aria-hidden>
              —
            </span>
            {post.readingMinutes} min read
          </span>
        </div>
      </Link>
    </article>
  );
}
