import Image from "next/image";
import type { ContentSection } from "@geaklabs/db";
import { GeneratedCover } from "./generated-cover";

export type CoverPost = {
  slug: string;
  title: string;
  section?: ContentSection | null;
  coverImageUrl: string | null;
  coverImageAlt?: string | null;
};

/** An uploaded cover when there is one, otherwise generated art. Caller sets the aspect via className. */
export function ArticleCover({
  post,
  sizes,
  priority,
  className,
}: {
  post: CoverPost;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-ink-100 ${className ?? ""}`}>
      {post.coverImageUrl ? (
        <Image
          src={post.coverImageUrl}
          alt={post.coverImageAlt ?? post.title}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <GeneratedCover seed={post.slug} section={post.section} className="absolute inset-0 h-full w-full" />
      )}
    </div>
  );
}
