import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "./client";
import { posts, categories, projects, experiences, services, siteCopy } from "./schema";
import { SITE_COPY_DEFAULTS, type SiteCopy } from "./site-copy";

/** Published posts, newest first, with category joined. */
export async function getPublishedPosts(limit?: number) {
  const rows = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      coverImageUrl: posts.coverImageUrl,
      readingMinutes: posts.readingMinutes,
      publishedAt: posts.publishedAt,
      featured: posts.featured,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt))
    .limit(limit ?? 100);
  return rows;
}

export async function getFeaturedPost() {
  const [row] = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      coverImageUrl: posts.coverImageUrl,
      readingMinutes: posts.readingMinutes,
      publishedAt: posts.publishedAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(and(eq(posts.status, "published"), eq(posts.featured, true)))
    .orderBy(desc(posts.publishedAt))
    .limit(1);
  return row ?? null;
}

export async function getPostBySlug(slug: string) {
  const [row] = await db
    .select()
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(eq(posts.slug, slug))
    .limit(1);
  if (!row) return null;
  return { ...row.posts, category: row.categories };
}

export async function getPostsByCategory(categorySlug: string, limit?: number) {
  const rows = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      coverImageUrl: posts.coverImageUrl,
      readingMinutes: posts.readingMinutes,
      publishedAt: posts.publishedAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(posts)
    .innerJoin(categories, eq(posts.categoryId, categories.id))
    .where(and(eq(posts.status, "published"), eq(categories.slug, categorySlug)))
    .orderBy(desc(posts.publishedAt))
    .limit(limit ?? 100);
  return rows;
}

export async function getAllCategories() {
  return db.select().from(categories).orderBy(categories.sortOrder);
}

export async function getCategoryBySlug(slug: string) {
  const [row] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return row ?? null;
}

/** Published projects, featured first. */
export async function getProjects(onlyFeatured = false) {
  const where = onlyFeatured
    ? and(eq(projects.status, "published"), eq(projects.featured, true))
    : eq(projects.status, "published");
  return db
    .select()
    .from(projects)
    .where(where)
    .orderBy(projects.sortOrder, desc(projects.startDate));
}

export async function getProjectBySlug(slug: string) {
  const [row] = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  return row ?? null;
}

/** Published experience entries only. */
export async function getExperiences() {
  return db
    .select()
    .from(experiences)
    .where(eq(experiences.status, "published"))
    .orderBy(experiences.sortOrder, desc(experiences.startDate));
}

/** Counts for the admin dashboard. */
export async function getContentCounts() {
  const [row] = await db
    .select({
      posts: sql<number>`count(*) filter (where ${posts.status} = 'published')`.mapWith(Number),
      drafts: sql<number>`count(*) filter (where ${posts.status} = 'draft')`.mapWith(Number),
    })
    .from(posts);
  return row ?? { posts: 0, drafts: 0 };
}

/** Published "What I do" items, in sort order. */
export async function getServices() {
  return db
    .select()
    .from(services)
    .where(eq(services.status, "published"))
    .orderBy(services.sortOrder);
}

/** All site copy: the defaults, with any values saved in the admin laid over them. */
export async function getSiteCopy(): Promise<SiteCopy> {
  const rows = await db.select().from(siteCopy);
  const copy: SiteCopy = { ...SITE_COPY_DEFAULTS };
  for (const row of rows) {
    if (row.key in copy) copy[row.key as keyof SiteCopy] = row.value;
  }
  return copy;
}
