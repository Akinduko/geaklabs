import type { Series } from "@geaklabs/db";

export function SeriesForm({
  series,
  action,
  error,
}: {
  series?: Series;
  action: (fd: FormData) => void;
  error?: string;
}) {
  return (
    <form action={action} className="space-y-6">
      {error === "slug" && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 font-display text-sm text-red-600">
          That slug is already used by another series. Pick a different one.
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name">
          <input name="name" defaultValue={series?.name} required className="input" placeholder="Memoir" />
        </Field>
        <Field label="Slug">
          <input name="slug" defaultValue={series?.slug ?? ""} className="input" placeholder="memoir" />
        </Field>
      </div>
      <p className="-mt-3 font-display text-xs text-ink-400">
        The slug is the series page address, e.g. /series/memoir. Leave it empty to generate one from
        the name.
      </p>

      <Field label="Description">
        <textarea
          name="description"
          defaultValue={series?.description ?? ""}
          rows={3}
          className="input"
          placeholder="What this series is, and who it's for."
        />
      </Field>
      <p className="-mt-3 font-display text-xs text-ink-400">
        Shown under the heading on the series page, and used as its search description.
      </p>

      <Field label="Sort order (lower = first)">
        <input name="sortOrder" type="number" defaultValue={series?.sortOrder ?? 0} className="input" />
      </Field>

      <div className="flex items-center gap-3 border-t border-ink-200 pt-6">
        <button
          type="submit"
          className="rounded-lg bg-ink-900 px-5 py-2.5 font-display text-sm font-semibold text-paper hover:opacity-90"
        >
          Save series
        </button>
        <a href="/series" className="font-display text-sm text-ink-500 hover:text-ink-900">
          Cancel
        </a>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-display text-sm font-medium text-ink-700">{label}</span>
      {children}
    </label>
  );
}
