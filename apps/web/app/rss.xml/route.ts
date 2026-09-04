import { getPublishedPosts } from "@geaklabs/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const revalidate = 300;

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!,
  );
}

export async function GET() {
  const posts = await getPublishedPosts(50);

  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/articles/${p.slug}`;
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
    <title>GEAK LABS — The Review</title>
    <link>${SITE_URL}</link>
    <description>Essays on leadership, management, and technology.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
}
