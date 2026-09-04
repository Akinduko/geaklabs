"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, posts, projects, experiences, services, siteCopy, SITE_COPY_FIELDS } from "@geaklabs/db";
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

/* ----------------------------- Posts ----------------------------- */

export async function savePost(id: string | null, fd: FormData) {
  await requireAuth();

  const title = str(fd, "title");
  const contentHtml = str(fd, "contentHtml");
  const slug = str(fd, "slug") || slugify(title);
  const status = bool(fd, "published") ? "published" : "draft";
  const categoryId = str(fd, "categoryId") || null;

  const values = {
    title,
    slug,
    excerpt: str(fd, "excerpt") || null,
    contentHtml,
    coverImageUrl: str(fd, "coverImageUrl") || null,
    coverImageAlt: str(fd, "coverImageAlt") || null,
    categoryId,
    tags: parseList(fd.get("tags")),
    status: status as "draft" | "published",
    featured: bool(fd, "featured"),
    readingMinutes: readingMinutes(contentHtml),
    publishedAt: status === "published" ? new Date() : null,
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(posts).set(values).where(eq(posts.id, id));
  } else {
    await db.insert(posts).values(values);
  }

  revalidatePath("/posts");
  await revalidateWeb(["/", "/articles", `/articles/${slug}`]);
  redirect("/posts");
}

export async function deletePost(id: string) {
  await requireAuth();
  await db.delete(posts).where(eq(posts.id, id));
  revalidatePath("/posts");
  await revalidateWeb(["/", "/articles"]);
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
  await revalidateWeb(["/", "/about", "/work", "/articles"]);
  redirect("/copy?saved=1");
}
