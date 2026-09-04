import type { Experience } from "@geaklabs/db";

function toDateInput(d: Date | null | undefined): string {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export function ExperienceForm({
  experience,
  action,
}: {
  experience?: Experience;
  action: (fd: FormData) => void;
}) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Company">
          <input name="company" defaultValue={experience?.company} required className="input" />
        </Field>
        <Field label="Role">
          <input name="role" defaultValue={experience?.role} required className="input" />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Field label="Location">
          <input name="location" defaultValue={experience?.location ?? ""} className="input" />
        </Field>
        <Field label="Start date">
          <input
            name="startDate"
            type="date"
            defaultValue={toDateInput(experience?.startDate)}
            required
            className="input"
          />
        </Field>
        <Field label="End date">
          <input
            name="endDate"
            type="date"
            defaultValue={toDateInput(experience?.endDate)}
            className="input"
          />
        </Field>
      </div>

      <Field label="Summary">
        <textarea
          name="summary"
          defaultValue={experience?.summary ?? ""}
          rows={2}
          className="input"
        />
      </Field>

      <Field label="Highlights (comma separated)">
        <input
          name="highlights"
          defaultValue={experience?.highlights?.join(", ")}
          className="input"
          placeholder="Led product & engineering, Scaled the team"
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="flex items-center gap-2 font-display text-sm text-ink-700">
          <input
            type="checkbox"
            name="isCurrent"
            defaultChecked={experience?.isCurrent}
            className="h-4 w-4"
          />
          Current role
        </label>
        <Field label="Sort order (lower = first)">
          <input
            name="sortOrder"
            type="number"
            defaultValue={experience?.sortOrder ?? 0}
            className="input"
          />
        </Field>
      </div>

      <div className="flex items-center gap-3 border-t border-ink-200 pt-6">
        <button
          type="submit"
          className="rounded-lg bg-ink-900 px-5 py-2.5 font-display text-sm font-semibold text-paper hover:opacity-90"
        >
          Save experience
        </button>
        <a href="/experience" className="font-display text-sm text-ink-500 hover:text-ink-900">
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
