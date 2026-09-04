import Link from "next/link";
import { db, posts, categories } from "@geaklabs/db";
import { desc, eq } from "drizzle-orm";
import { DeleteButton } from "../_components/delete-button";
import { deletePost } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const rows = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      status: posts.status,
      featured: posts.featured,
      updatedAt: posts.updatedAt,
      categoryName: categories.name,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .orderBy(desc(posts.updatedAt));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Posts</h1>
          <p className="mt-1 font-serif text-ink-500">{rows.length} total</p>
        </div>
        <Link
          href="/posts/new"
          className="rounded-lg bg-ink-900 px-4 py-2 font-display text-sm font-medium text-paper hover:opacity-90"
        >
          New post
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-ink-200 bg-paper">
        {rows.length === 0 ? (
          <p className="p-8 text-center font-serif text-ink-500">No posts yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead className="border-b border-ink-100 bg-ink-50">
              <tr className="font-display text-xs uppercase tracking-wider text-ink-400">
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Topic</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {rows.map((p) => (
                <tr key={p.id} className="font-display text-sm">
                  <td className="px-5 py-3">
                    <Link href={`/posts/${p.id}`} className="font-medium text-ink-900 hover:underline">
                      {p.title}
                    </Link>
                    {p.featured && <span className="ml-2 text-xs text-ink-400">★ featured</span>}
                  </td>
                  <td className="px-5 py-3 text-ink-500">{p.categoryName ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        p.status === "published"
                          ? "rounded-full bg-ink-900 px-2 py-0.5 text-xs text-paper"
                          : "rounded-full bg-ink-100 px-2 py-0.5 text-xs text-ink-500"
                      }
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/posts/${p.id}`} className="text-ink-500 hover:text-ink-900">
                        Edit
                      </Link>
                      <DeleteButton id={p.id} action={deletePost} label="Delete post?" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
