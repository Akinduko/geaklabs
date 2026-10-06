"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import {
  db,
  posts,
  projects,
  experiences,
  services,
  siteCopy,
  categories,
  SITE_COPY_FIELDS,
  CONTENT_SECTIONS,
  type ContentSection,
} from "@geaklabs/db";
import { auth } from "@/auth";
import { slugify, readingMinutes, parseList } from "./helpers";
import { revalidateWeb } from "./revalidate-web";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/login");
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}
function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === "on" || fd.get(key) === "true";
}
function section(fd: FormData): ContentSection {
  const v = str(fd, "section");
  return CONTENT_SECTIONS.find((s) => s === v) ?? "professional";
}

/** Listing + feed paths that show a post, by section. */
function sectionPaths(s: ContentSection) {
  return s === "faith" ? ["/faith", "/faith/rss.xml"] : ["/articles", "/rss.xml"];
}

/* ----------------------------- Posts ----------------------------- */

export async function savePost(id: string | null, fd: FormData) {
  await requireAuth();

  const title = str(fd, "title");
  const contentHtml = str(fd, "contentHtml");
  const slug = str(fd, "slug") || slugify(title);
  const status = bool(fd, "published") ? "published" : "draft";
  const postSection = section(fd);
  const categoryId = str(fd, "categoryId") || null;

  // A topic belongs to one section; refuse to file a post under a topic from the other side.
  // The form already hides mismatched topics, so this only catches a stale or hand-edited submit.
  let categorySlug: string | null = null;
  if (categoryId) {
    const [cat] = await db
      .select({ slug: categories.slug, section: categories.section })
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);
    if (!cat || cat.section !== postSection) {
      redirect(`/posts${id ? `/${id}` : "/new"}?error=section`);
    }
    categorySlug = cat.slug;
  }

  // Keep the original publish date when editing an already-published post.
  const [existing] = id
    ? await db
        .select({ publishedAt: posts.publishedAt, section: posts.section, slug: posts.slug })
        .from(posts)
        .where(eq(posts.id, id))
        .limit(1)
    : [];

  const values = {
    title,
    slug,
    excerpt: str(fd, "excerpt") || null,
    contentHtml,
    coverImageUrl: str(fd, "coverImageUrl") || null,
    coverImageAlt: str(fd, "coverImageAlt") || null,
    categoryId,
    section: postSection,
    tags: parseList(fd.get("tags")),
    status: status as "draft" | "published",
    featured: bool(fd, "featured"),
    readingMinutes: readingMinutes(contentHtml),
    publishedAt: status === "published" ? (existing?.publishedAt ?? new Date()) : null,
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(posts).set(values).where(eq(posts.id, id));
  } else {
    await db.insert(posts).values(values);
  }

  // Revalidate wherever this post shows now — and wherever it used to, if it moved section or slug.
  const paths = new Set<string>(["/", ...sectionPaths(postSection), `${sectionPaths(postSection)[0]}/${slug}`]);
  if (existing) {
    for (const p of sectionPaths(existing.section)) paths.add(p);
    paths.add(`${sectionPaths(existing.section)[0]}/${existing.slug}`);
  }
  if (categorySlug) paths.add(`/topics/${categorySlug}`);

  revalidatePath("/posts");
  await revalidateWeb([...paths]);
  redirect("/posts");
}

export async function deletePost(id: string) {
  await requireAuth();
  const [row] = await db
    .select({ section: posts.section })
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);
  await db.delete(posts).where(eq(posts.id, id));
  revalidatePath("/posts");
  await revalidateWeb(["/", ...sectionPaths(row?.section ?? "professional")]);
}

/* ---------------------------- Projects ---------------------------- */

export async function saveProject(id: string | null, fd: FormData) {
  await requireAuth();

  const title = str(fd, "title");
  const slug = str(fd, "slug") || slugify(title);

  const values = {
    title,
    slug,
    summary: str(fd, "summary") || null,
    descriptionHtml: str(fd, "descriptionHtml") || null,
    role: str(fd, "role") || null,
    techStack: parseList(fd.get("techStack")),
    liveUrl: str(fd, "liveUrl") || null,
    repoUrl: str(fd, "repoUrl") || null,
    coverImageUrl: str(fd, "coverImageUrl") || null,
    featured: bool(fd, "featured"),
    sortOrder: Number(str(fd, "sortOrder")) || 0,
    status: (bool(fd, "published") ? "published" : "draft") as "draft" | "published",
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(projects).set(values).where(eq(projects.id, id));
  } else {
    await db.insert(projects).values(values);
  }

  revalidatePath("/projects");
  await revalidateWeb(["/", "/work", `/work/${slug}`]);
  redirect("/projects");
}

export async function deleteProject(id: string) {
  await requireAuth();
  await db.delete(projects).where(eq(projects.id, id));
  revalidatePath("/projects");
  await revalidateWeb(["/", "/work"]);
}

/* --------------------------- Experience --------------------------- */

export async function saveExperience(id: string | null, fd: FormData) {
  await requireAuth();

  const startDate = str(fd, "startDate");
  const endDate = str(fd, "endDate");
  const isCurrent = bool(fd, "isCurrent");

  const values = {
    company: str(fd, "company"),
    role: str(fd, "role"),
    location: str(fd, "location") || null,
    summary: str(fd, "summary") || null,
    highlights: parseList(fd.get("highlights")),
    startDate: startDate ? new Date(startDate) : new Date(),
    endDate: !isCurrent && endDate ? new Date(endDate) : null,
    isCurrent,
    sortOrder: Number(str(fd, "sortOrder")) || 0,
    status: (bool(fd, "published") ? "published" : "draft") as "draft" | "published",
  };

  if (id) {
    await db.update(experiences).set(values).where(eq(experiences.id, id));
  } else {
    await db.insert(experiences).values(values);
  }

  revalidatePath("/experience");
  await revalidateWeb(["/about"]);
  redirect("/experience");
}

export async function deleteExperience(id: string) {
  await requireAuth();
  await db.delete(experiences).where(eq(experiences.id, id));
  revalidatePath("/experience");
  await revalidateWeb(["/about"]);
}

/* ---------------------------- Services ---------------------------- */

export async function saveService(id: string | null, fd: FormData) {
  await requireAuth();

  const values = {
    title: str(fd, "title"),
    body: str(fd, "body") || null,
    sortOrder: Number(str(fd, "sortOrder")) || 0,
    status: (bool(fd, "published") ? "published" : "draft") as "draft" | "published",
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(services).set(values).where(eq(services.id, id));
  } else {
    await db.insert(services).values(values);
  }

  revalidatePath("/services");
  await revalidateWeb(["/"]);
  redirect("/services");
}

export async function deleteService(id: string) {
  await requireAuth();
  await db.delete(services).where(eq(services.id, id));
  revalidatePath("/services");
  await revalidateWeb(["/"]);
}

/* ---------------------------- Site copy ---------------------------- */

export async function saveSiteCopy(fd: FormData) {
  await requireAuth();

  const now = new Date();
  for (const field of SITE_COPY_FIELDS) {
    const value = String(fd.get(field.key) ?? "").replace(/\r\n/g, "\n").trim();
    await db
      .insert(siteCopy)
      .values({ key: field.key, value, updatedAt: now })
      .onConflictDoUpdate({ target: siteCopy.key, set: { value, updatedAt: now } });
  }

  revalidatePath("/copy");
  await revalidateWeb(["/", "/about", "/work", "/articles", "/faith", "/rss.xml", "/faith/rss.xml"]);
  redirect("/copy?saved=1");
}

/* --------------------------- Categories --------------------------- */

export async function saveCategory(id: string | null, fd: FormData) {
  await requireAuth();

  const name = str(fd, "name");
  const slug = str(fd, "slug") || slugify(name);

  const values = {
    name,
    slug,
    description: str(fd, "description") || null,
    section: section(fd),
    sortOrder: Number(str(fd, "sortOrder")) || 0,
  };

  // Slugs are unique: block a clash rather than letting the insert throw.
  const [clash] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  if (clash && clash.id !== id) {
    redirect(`/categories${id ? `/${id}` : "/new"}?error=slug`);
  }

  if (id) {
    await db.update(categories).set(values).where(eq(categories.id, id));
  } else {
    await db.insert(categories).values(values);
  }

  revalidatePath("/categories");
  revalidatePath("/posts");
  await revalidateWeb(["/", ...sectionPaths(values.section), `/topics/${slug}`]);
  redirect("/categories");
}

/**
 * Deleting a category would set category_id to NULL on any post using it
 * (the FK is ON DELETE SET NULL), silently un-categorising published posts.
 * So refuse the delete while posts still reference it and report the count.
 */
export async function deleteCategory(id: string) {
  await requireAuth();

  const [usage] = await db
    .select({ n: sql<number>`count(*)`.mapWith(Number) })
    .from(posts)
    .where(eq(posts.categoryId, id));
  const n = usage?.n ?? 0;

  if (n > 0) {
    return {
      ok: false as const,
      message: `This category is used by ${n} post${n === 1 ? "" : "s"}. Reassign ${n === 1 ? "it" : "them"} before deleting it.`,
    };
  }

  const [row] = await db
    .select({ slug: categories.slug })
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);

  await db.delete(categories).where(eq(categories.id, id));

  revalidatePath("/categories");
  revalidatePath("/posts");
  await revalidateWeb(["/", "/articles", "/faith", ...(row ? [`/topics/${row.slug}`] : [])]);
  return { ok: true as const };
}
