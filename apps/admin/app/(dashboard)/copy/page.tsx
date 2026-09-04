import { getSiteCopy, SITE_COPY_FIELDS, type CopyField, type CopyKey } from "@geaklabs/db";
import { saveSiteCopy } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function SiteCopyPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [copy, { saved }] = await Promise.all([getSiteCopy(), searchParams]);

  // Widen the registry so optional fields (hint) type-check across every entry.
  const fields: readonly CopyField[] = SITE_COPY_FIELDS;
  const groups = Array.from(new Set(fields.map((f) => f.group)));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Site copy</h1>
      <p className="mt-1 font-serif text-ink-500">
        Every line of text on the site that isn&rsquo;t a post, project or list item. Saving
        publishes to the live site.
      </p>

      {saved && (
        <p className="mt-6 rounded-lg bg-mint/30 px-4 py-2.5 font-display text-sm text-ink-900">
          Saved. The site will show the new copy within a minute.
        </p>
      )}

      <form action={saveSiteCopy} className="mt-8 space-y-12">
        {groups.map((group) => (
          <fieldset key={group} className="space-y-6">
            <legend className="kicker mb-2 text-ink-400">{group}</legend>
            {fields.filter((f) => f.group === group).map((f) => (
              <label key={f.key} className="block">
                <span className="mb-1.5 block font-display text-sm font-medium text-ink-700">
                  {f.label}
                </span>
                {f.kind === "text" ? (
                  <input name={f.key} defaultValue={copy[f.key as CopyKey]} className="input" />
                ) : (
                  <textarea
                    name={f.key}
                    defaultValue={copy[f.key as CopyKey]}
                    rows={f.kind === "paragraphs" ? 8 : f.kind === "lines" ? 3 : 4}
                    className="input"
                  />
                )}
                {f.hint && <span className="mt-1 block font-display text-xs text-ink-400">{f.hint}</span>}
              </label>
            ))}
          </fieldset>
        ))}

        <div className="sticky bottom-0 flex items-center gap-3 border-t border-ink-200 bg-paper py-4">
          <button
            type="submit"
            className="rounded-lg bg-ink-900 px-5 py-2.5 font-display text-sm font-semibold text-paper hover:opacity-90"
          >
            Save all copy
          </button>
          <span className="font-display text-sm text-ink-500">
            Fields you leave empty are left out of the site.
          </span>
        </div>
      </form>
    </div>
  );
}
