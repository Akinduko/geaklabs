import type { MetadataRoute } from "next";
import { getPublishedPosts, getProjects, getAllCategories, getAllSeries } from "@geaklabs/db";
import { postHref } from "@/lib/sections";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects, categories, allSeries] = await Promise.all([
    getPublishedPosts(),
    getProjects(),
    getAllCategories(),
    getAllSeries(),
  ]);
  const seriesList = allSeries.filter((s) => s.partCount > 0);

  const newestPost = posts[0]?.publishedAt ?? new Date();
  const newestFaith = posts.find((p) => p.section === "faith")?.publishedAt ?? newestPost;
  const newestJournal = posts.find((p) => p.section === "journal")?.publishedAt ?? newestPost;

  return [
    { url: SITE_URL, lastModified: newestPost, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/articles`,
      lastModified: newestPost,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/faith`,
      lastModified: newestFaith,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/journal`,
      lastModified: newestJournal,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { url: `${SITE_URL}/work`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    ...posts.map((p) => ({
      url: `${SITE_URL}${postHref(p)}`,
      lastModified: p.publishedAt ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...projects.map((p) => ({
      url: `${SITE_URL}/work/${p.slug}`,
      lastModified: p.updatedAt ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...(seriesList.length > 0
      ? [{ url: `${SITE_URL}/series`, lastModified: newestPost, changeFrequency: "weekly" as const, priority: 0.7 }]
      : []),
    ...seriesList.map((s) => ({
      url: `${SITE_URL}/series/${s.slug}`,
      lastModified: newestPost,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...categories.map((c) => ({
      url: `${SITE_URL}/topics/${c.slug}`,
      lastModified: newestPost,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
