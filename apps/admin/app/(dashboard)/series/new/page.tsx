import { saveSeries } from "@/lib/actions";
import { SeriesForm } from "../_components/series-form";

export const dynamic = "force-dynamic";

export default async function NewSeriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const action = saveSeries.bind(null, null);
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">New series</h1>
      <p className="mt-1 font-serif text-ink-500">A named thread that posts can be filed into, in order.</p>
      <div className="mt-8">
        <SeriesForm action={action} error={error} />
      </div>
    </div>
  );
}
