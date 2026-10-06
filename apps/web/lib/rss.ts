import { getPublishedPosts, getSiteCopy, type ContentSection } from "@geaklabs/db";
import { SITE_URL } from "./seo";
import { postHref } from "./sections";

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!,
  );
}

/** One RSS feed per section, so professional subscribers aren't sent faith posts and vice versa. */
export async function buildFeed(section: ContentSection) {
  const [posts, copy] = await Promise.all([getPublishedPosts(50, section), getSiteCopy()]);

  const channel =
    section === "faith"
      ? { title: copy["faith.rssTitle"], link: `${SITE_URL}/faith`, description: copy["faith.metaDescription"] }
      : { title: "GEAK LABS — Notes", link: `${SITE_URL}/articles`, description: copy["articles.intro"] };

  const items = posts
    .map((p) => {
      const url = `${SITE_URL}${postHref(p)}`;
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      ${p.excerpt ? `<description>${escapeXml(p.excerpt)}</description>` : ""}
      ${p.publishedAt ? `<pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>` : ""}
      ${p.categoryName ? `<category>${escapeXml(p.categoryName)}</category>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(channel.title)}</title>
    <link>${channel.link}</link>
    <description>${escapeXml(channel.description)}</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
}
