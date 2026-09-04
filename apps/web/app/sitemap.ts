import type { MetadataRoute } from "next";
import { getPublishedPosts, getProjects, getAllCategories } from "@geaklabs/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects, categories] = await Promise.all([
    getPublishedPosts(),
    getProjects(),
    getAllCategories(),
  ]);

  const newestPost = posts[0]?.publishedAt ?? new Date();

  return [
    { url: SITE_URL, lastModified: newestPost, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/articles`,
      lastModified: newestPost,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    { url: `${SITE_URL}/work`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    ...posts.map((p) => ({
      url: `${SITE_URL}/articles/${p.slug}`,
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
    ...categories.map((c) => ({
      url: `${SITE_URL}/topics/${c.slug}`,
      lastModified: newestPost,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
