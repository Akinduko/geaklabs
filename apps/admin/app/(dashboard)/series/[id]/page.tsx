import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, series } from "@geaklabs/db";
import { saveSeries } from "@/lib/actions";
import { SeriesForm } from "../_components/series-form";

export const dynamic = "force-dynamic";

export default async function EditSeriesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const [row] = await db.select().from(series).where(eq(series.id, id)).limit(1);
  if (!row) notFound();

  const action = saveSeries.bind(null, id);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Edit series</h1>
      <p className="mt-1 font-serif text-ink-500">{row.name}</p>
      <div className="mt-8">
        <SeriesForm series={row} action={action} error={error} />
      </div>
    </div>
  );
}
