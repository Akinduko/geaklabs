import Link from "next/link";
import { db, categories, posts } from "@geaklabs/db";
import { asc, eq, sql } from "drizzle-orm";
import { DeleteButton } from "../_components/delete-button";
import { deleteCategory } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      sortOrder: categories.sortOrder,
      postCount: sql<number>`count(${posts.id})`.mapWith(Number),
    })
    .from(categories)
    .leftJoin(posts, eq(posts.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy(asc(categories.sortOrder));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Categories</h1>
          <p className="mt-1 font-serif text-ink-500">
            {rows.length} categories · each one gets a topic page on the site
          </p>
        </div>
        <Link
          href="/categories/new"
          className="rounded-lg bg-ink-900 px-4 py-2 font-display text-sm font-medium text-paper hover:opacity-90"
        >
          New category
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {rows.length === 0 ? (
          <p className="rounded-2xl border border-ink-200 bg-paper p-8 text-center font-serif text-ink-500">
            No categories yet — add one to start grouping your posts.
          </p>
        ) : (
          rows.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-6 rounded-2xl border border-ink-200 bg-paper px-5 py-4"
            >
              <div className="min-w-0">
                <Link
                  href={`/categories/${c.id}`}
                  className="font-display text-sm font-medium text-ink-900 hover:underline"
                >
                  {c.name}
                </Link>
                {c.description && (
                  <p className="mt-0.5 truncate font-serif text-sm text-ink-500">{c.description}</p>
                )}
                <p className="mt-1 font-display text-xs text-ink-400">
                  /topics/{c.slug} · {c.postCount} {c.postCount === 1 ? "post" : "posts"} · order{" "}
                  {c.sortOrder}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3 font-display text-sm">
                <Link href={`/categories/${c.id}`} className="text-ink-500 hover:text-ink-900">
                  Edit
                </Link>
                <DeleteButton
                  id={c.id}
                  action={deleteCategory}
                  label={`Delete “${c.name}”?`}
                  disabled={c.postCount > 0}
                  disabledHint="In use by posts"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
