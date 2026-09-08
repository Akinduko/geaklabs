import type { Category } from "@geaklabs/db";

export function CategoryForm({
  category,
  action,
  error,
}: {
  category?: Category;
  action: (fd: FormData) => void;
  error?: string;
}) {
  return (
    <form action={action} className="space-y-6">
      {error === "slug" && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 font-display text-sm text-red-600">
          That slug is already used by another category. Pick a different one.
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name">
          <input
            name="name"
            defaultValue={category?.name}
            required
            className="input"
            placeholder="Engineering"
          />
        </Field>
        <Field label="Slug">
          <input
            name="slug"
            defaultValue={category?.slug ?? ""}
            className="input"
            placeholder="engineering"
          />
        </Field>
      </div>
      <p className="-mt-3 font-display text-xs text-ink-400">
        The slug is the topic page address, e.g. /topics/engineering. Leave it empty to generate
        one from the name.
      </p>

      <Field label="Description">
        <textarea
          name="description"
          defaultValue={category?.description ?? ""}
          rows={3}
          className="input"
          placeholder="Architecture, systems, reliability and the craft of building software."
        />
      </Field>
      <p className="-mt-3 font-display text-xs text-ink-400">
        Shown under the heading on the topic page, and used as its search description.
      </p>

      <Field label="Sort order (lower = first)">
        <input
          name="sortOrder"
          type="number"
          defaultValue={category?.sortOrder ?? 0}
          className="input"
        />
      </Field>

      <div className="flex items-center gap-3 border-t border-ink-200 pt-6">
        <button
          type="submit"
          className="rounded-lg bg-ink-900 px-5 py-2.5 font-display text-sm font-semibold text-paper hover:opacity-90"
        >
          Save category
        </button>
        <a href="/categories" className="font-display text-sm text-ink-500 hover:text-ink-900">
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
