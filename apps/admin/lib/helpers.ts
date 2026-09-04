export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function readingMinutes(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Parse comma/space separated input into a clean string array. */
export function parseList(input: FormDataEntryValue | null): string[] {
  if (!input) return [];
  return String(input)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
