import Link from "next/link";
import { db, projects } from "@geaklabs/db";
import { asc, desc } from "drizzle-orm";
import { DeleteButton } from "../_components/delete-button";
import { deleteProject } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const rows = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.sortOrder), desc(projects.updatedAt));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Projects</h1>
          <p className="mt-1 font-serif text-ink-500">{rows.length} total</p>
        </div>
        <Link
          href="/projects/new"
          className="rounded-lg bg-ink-900 px-4 py-2 font-display text-sm font-medium text-paper hover:opacity-90"
        >
          New project
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {rows.length === 0 ? (
          <p className="rounded-2xl border border-ink-200 bg-paper p-8 text-center font-serif text-ink-500">
            No projects yet.
          </p>
        ) : (
          rows.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-2xl border border-ink-200 bg-paper px-5 py-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/projects/${p.id}`}
                    className="font-display text-sm font-medium text-ink-900 hover:underline"
                  >
                    {p.title}
                  </Link>
                  {p.featured && <span className="text-xs text-ink-400">★</span>}
                  <span
                    className={
                      p.status === "published"
                        ? "rounded-full bg-ink-900 px-2 py-0.5 text-xs text-paper"
                        : "rounded-full bg-ink-100 px-2 py-0.5 text-xs text-ink-500"
                    }
                  >
                    {p.status}
                  </span>
                </div>
                {p.role && <p className="mt-0.5 font-display text-xs text-ink-400">{p.role}</p>}
              </div>
              <div className="flex items-center gap-3 font-display text-sm">
                <Link href={`/projects/${p.id}`} className="text-ink-500 hover:text-ink-900">
                  Edit
                </Link>
                <DeleteButton id={p.id} action={deleteProject} label="Delete project?" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
