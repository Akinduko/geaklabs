import type { ContentSection } from "@geaklabs/db";

/**
 * The two halves of the site. Professional notes live under /articles,
 * faith writing under /faith; each has its own listing and RSS feed.
 */
export const SECTIONS = {
  professional: { path: "/articles", label: "Notes", feed: "/rss.xml" },
  faith: { path: "/faith", label: "Faith", feed: "/faith/rss.xml" },
} as const satisfies Record<ContentSection, { path: string; label: string; feed: string }>;

export function isSection(value: string): value is ContentSection {
  return value in SECTIONS;
}

/** Canonical site-relative URL for a post, based on its section. */
export function postHref(post: { slug: string; section?: ContentSection | null }) {
  return `${SECTIONS[post.section ?? "professional"].path}/${post.slug}`;
}
