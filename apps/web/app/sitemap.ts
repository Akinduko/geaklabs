import type { MetadataRoute } from "next";
import { getPublishedPosts, getProjects, getAllCategories } from "@geaklabs/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects, categories] = await Promise.all([
    getPublishedPosts(),
    getProjects(),
    getAllCategories(),
  ]);

  const staticRoutes = ["", "/articles", "/work", "/about"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...categories.map((c) => ({ url: `${SITE_URL}/topics/${c.slug}`, lastModified: new Date() })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/articles/${p.slug}`,
      lastModified: p.publishedAt ?? new Date(),
    })),
    ...projects.map((p) => ({ url: `${SITE_URL}/work/${p.slug}`, lastModified: new Date() })),
  ];
}
