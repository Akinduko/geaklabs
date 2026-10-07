import { getPostBySlug, type ContentSection } from "@geaklabs/db";
import { socialCard } from "@/lib/og";
import { SECTIONS } from "@/lib/sections";

/** One social card for a post, used by the article routes of every section. */
export async function postOgImage(params: Promise<{ slug: string }>, section: ContentSection) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const published = post && post.status === "published";
  return socialCard({
    title: published ? post.title : "GEAK LABS",
    kicker: published ? (post.category?.name ?? SECTIONS[post.section].label) : SECTIONS[section].label,
    coverImageUrl: published ? post.coverImageUrl : null,
    seed: slug,
    section: published ? post.section : section,
  });
}
