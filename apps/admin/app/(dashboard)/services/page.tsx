import Link from "next/link";
import { db, services } from "@geaklabs/db";
import { asc } from "drizzle-orm";
import { DeleteButton } from "../_components/delete-button";
import { deleteService } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const rows = await db.select().from(services).orderBy(asc(services.sortOrder));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">What I do</h1>
          <p className="mt-1 font-serif text-ink-500">
            {rows.length} items · shown on the home page under the hero
          </p>
        </div>
        <Link
          href="/services/new"
          className="rounded-lg bg-ink-900 px-4 py-2 font-display text-sm font-medium text-paper hover:opacity-90"
        >
          New item
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {rows.length === 0 ? (
          <p className="rounded-2xl border border-ink-200 bg-paper p-8 text-center font-serif text-ink-500">
            Nothing here yet — the section stays hidden on the site until you add an item.
          </p>
        ) : (
          rows.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-6 rounded-2xl border border-ink-200 bg-paper px-5 py-4"
            >
              <div className="min-w-0">
                <Link
                  href={`/services/${s.id}`}
                  className="font-display text-sm font-medium text-ink-900 hover:underline"
                >
                  {s.title}
                </Link>
                {s.body && <p className="mt-0.5 truncate font-serif text-sm text-ink-500">{s.body}</p>}
                <p className="mt-1 font-display text-xs text-ink-400">
                  {s.status === "published" ? "Shown on the site" : "Hidden"} · order {s.sortOrder}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3 font-display text-sm">
                <Link href={`/services/${s.id}`} className="text-ink-500 hover:text-ink-900">
                  Edit
                </Link>
                <DeleteButton id={s.id} action={deleteService} label="Delete this item?" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
