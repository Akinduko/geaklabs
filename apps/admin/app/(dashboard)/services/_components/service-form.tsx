import type { Service } from "@geaklabs/db";

export function ServiceForm({
  service,
  action,
}: {
  service?: Service;
  action: (fd: FormData) => void;
}) {
  return (
    <form action={action} className="space-y-6">
      <Field label="Title">
        <input
          name="title"
          defaultValue={service?.title}
          required
          className="input"
          placeholder="Governance"
        />
      </Field>

      <Field label="One line on what it means">
        <textarea
          name="body"
          defaultValue={service?.body ?? ""}
          rows={3}
          className="input"
          placeholder="The policies, controls and accountability that let a company use AI without betting the brand on it."
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Sort order (lower = first)">
          <input
            name="sortOrder"
            type="number"
            defaultValue={service?.sortOrder ?? 0}
            className="input"
          />
        </Field>
        <label className="flex items-center gap-2 self-end pb-2.5 font-display text-sm text-ink-700">
          <input
            type="checkbox"
            name="published"
            defaultChecked={service ? service.status === "published" : true}
            className="h-4 w-4"
          />
          Show on the site
        </label>
      </div>

      <div className="flex items-center gap-3 border-t border-ink-200 pt-6">
        <button
          type="submit"
          className="rounded-lg bg-ink-900 px-5 py-2.5 font-display text-sm font-semibold text-paper hover:opacity-90"
        >
          Save item
        </button>
        <a href="/services" className="font-display text-sm text-ink-500 hover:text-ink-900">
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
