import { getPublishedPosts, getProjects, getServices, getSiteCopy } from "@geaklabs/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const revalidate = 3600;

/**
 * llms.txt — a plain-text summary of the site for language models.
 * Convention: https://llmstxt.org
 */
export async function GET() {
  const [copy, services, projects, posts] = await Promise.all([
    getSiteCopy(),
    getServices(),
    getProjects(),
    getPublishedPosts(50),
  ]);

  const body = `# GEAK LABS

> ${copy["meta.description"]}

Olugbenga Akinduko — ${copy["hero.kicker"]}.

${copy["hero.intro"]}

## What he does

${services.map((s) => `- **${s.title}**: ${s.body ?? ""}`.trim()).join("\n")}

## Selected work

${projects
  .map((p) => {
    const years = p.startDate
      ? ` (${new Date(p.startDate).getFullYear()}${p.endDate ? `–${new Date(p.endDate).getFullYear()}` : "–present"})`
      : "";
    return `- [${p.title}](${SITE_URL}/work/${p.slug})${p.role ? ` — ${p.role}` : ""}${years}: ${p.summary ?? ""}`;
  })
  .join("\n")}

## Writing

${posts
  .map((p) => `- [${p.title}](${SITE_URL}/articles/${p.slug})${p.excerpt ? `: ${p.excerpt}` : ""}`)
  .join("\n")}

## Pages

- [Home](${SITE_URL}/): overview, what he does, selected work, recent essays
- [Work](${SITE_URL}/work): every published project
- [Writing](${SITE_URL}/articles): every published essay
- [About](${SITE_URL}/about): background and experience
- [RSS feed](${SITE_URL}/rss.xml)

## Contact

${copy["footer.email"] ? `Email: ${copy["footer.email"]}` : "See the site footer for contact details."}
${copy["footer.linkedin"] ? `LinkedIn: ${copy["footer.linkedin"]}` : ""}
${copy["footer.github"] ? `GitHub: ${copy["footer.github"]}` : ""}
`.replace(/\n{3,}/g, "\n\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
