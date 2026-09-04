import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/format";

export type ArticleCardData = {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  readingMinutes: number;
  publishedAt: Date | string | null;
  categoryName: string | null;
  categorySlug: string | null;
};

export function ArticleCard({ post, priority }: { post: ArticleCardData; priority?: boolean }) {
  return (
    <article className="group flex flex-col">
      <Link href={`/articles/${post.slug}`} className="flex flex-col">
        {post.coverImageUrl && (
          <div className="relative mb-5 aspect-[16/10] overflow-hidden bg-ink-100">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        )}
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
