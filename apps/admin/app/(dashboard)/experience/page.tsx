import Link from "next/link";
import { db, experiences } from "@geaklabs/db";
import { asc, desc } from "drizzle-orm";
import { DeleteButton } from "../_components/delete-button";
import { deleteExperience } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function ExperiencePage() {
  const rows = await db
    .select()
    .from(experiences)
    .orderBy(asc(experiences.sortOrder), desc(experiences.startDate));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Experience</h1>
          <p className="mt-1 font-serif text-ink-500">{rows.length} total</p>
        </div>
        <Link
          href="/experience/new"
          className="rounded-lg bg-ink-900 px-4 py-2 font-display text-sm font-medium text-paper hover:opacity-90"
        >
          New experience
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {rows.length === 0 ? (
          <p className="rounded-2xl border border-ink-200 bg-paper p-8 text-center font-serif text-ink-500">
            No experience yet.
          </p>
        ) : (
          rows.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between rounded-2xl border border-ink-200 bg-paper px-5 py-4"
            >
              <div>
                <Link
                  href={`/experience/${e.id}`}
                  className="font-display text-sm font-medium text-ink-900 hover:underline"
                >
                  {e.role} · {e.company}
                </Link>
                <p className="mt-0.5 font-display text-xs text-ink-400">
                  {e.startDate.getFullYear()} — {e.isCurrent ? "Present" : e.endDate?.getFullYear() ?? ""}
                  {e.location ? ` · ${e.location}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3 font-display text-sm">
                <Link href={`/experience/${e.id}`} className="text-ink-500 hover:text-ink-900">
                  Edit
                </Link>
                <DeleteButton id={e.id} action={deleteExperience} label="Delete experience?" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
