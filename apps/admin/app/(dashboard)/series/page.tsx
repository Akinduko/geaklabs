import Link from "next/link";
import { db, series, posts } from "@geaklabs/db";
import { asc, eq, sql } from "drizzle-orm";
import { DeleteButton } from "../_components/delete-button";
import { deleteSeries } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function SeriesPage() {
  const rows = await db
    .select({
      id: series.id,
      name: series.name,
      slug: series.slug,
      description: series.description,
      sortOrder: series.sortOrder,
      postCount: sql<number>`count(${posts.id})`.mapWith(Number),
    })
    .from(series)
    .leftJoin(posts, eq(posts.seriesId, series.id))
    .groupBy(series.id)
    .orderBy(asc(series.sortOrder), asc(series.name));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Series</h1>
          <p className="mt-1 font-serif text-ink-500">
            {rows.length} series · posts from either section, read in order
          </p>
        </div>
        <Link
          href="/series/new"
          className="rounded-lg bg-ink-900 px-4 py-2 font-display text-sm font-medium text-paper hover:opacity-90"
        >
          New series
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {rows.length === 0 ? (
          <p className="rounded-2xl border border-ink-200 bg-paper p-8 text-center font-serif text-ink-500">
            No series yet — add one, then file posts into it from the post form.
          </p>
        ) : (
          rows.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-6 rounded-2xl border border-ink-200 bg-paper px-5 py-4"
            >
              <div className="min-w-0">
                <Link href={`/series/${s.id}`} className="font-display text-sm font-medium text-ink-900 hover:underline">
                  {s.name}
                </Link>
                {s.description && (
                  <p className="mt-0.5 truncate font-serif text-sm text-ink-500">{s.description}</p>
                )}
                <p className="mt-1 font-display text-xs text-ink-400">
                  /series/{s.slug} · {s.postCount} {s.postCount === 1 ? "part" : "parts"} · order {s.sortOrder}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3 font-display text-sm">
                <Link href={`/series/${s.id}`} className="text-ink-500 hover:text-ink-900">
                  Edit
                </Link>
                <DeleteButton
                  id={s.id}
                  action={deleteSeries}
                  label={`Delete “${s.name}”?`}
                  disabled={s.postCount > 0}
                  disabledHint="Has parts"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
