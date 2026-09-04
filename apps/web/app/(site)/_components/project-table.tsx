import Link from "next/link";
import type { Project } from "@geaklabs/db";

function yearRange(start: Date | null, end: Date | null) {
  if (!start) return null;
  const from = start.getFullYear();
  if (!end) return `${from} —`;
  const to = end.getFullYear();
  return from === to ? `${from}` : `${from} — ${String(to).slice(2)}`;
}

/** The selected-work table: name / role / what it is / years, ruled like a contents page. */
export function ProjectTable({ projects }: { projects: Project[] }) {
  const hasYears = projects.some((p) => p.startDate);
  return (
    <div>
      <div className="hidden grid-cols-12 gap-6 pt-10 lg:grid">
        <span className="kicker col-span-2 text-ink-500">Selected work</span>
        <span className="kicker col-span-2 text-ink-500">Role</span>
        <span className="kicker col-span-5 text-ink-500">What it is</span>
        {hasYears && <span className="kicker col-span-3 text-right text-ink-500">Years</span>}
      </div>
      <ul className="border-b border-ink-900 lg:mt-3">
        {projects.map((p, i) => {
          const years = yearRange(p.startDate, p.endDate);
          return (
            <li key={p.slug} className={i === 0 ? "border-t border-ink-900" : "border-t border-rule"}>
              <Link
                href={`/work/${p.slug}`}
                className="group grid gap-2 py-7 lg:grid-cols-12 lg:gap-6 lg:py-8"
              >
                <span className="text-[34px] font-semibold leading-none tracking-[-0.03em] text-ink-900 transition-colors group-hover:text-cyan-ink lg:col-span-2">
                  {p.title.split(" — ")[0]}
                </span>
                {p.role && (
                  <span className="text-[15px] leading-[1.45] text-ink-700 lg:col-span-2 lg:pt-2">
                    {p.role}
                  </span>
                )}
                {p.summary && (
                  <span className="text-[15px] leading-normal text-ink-700 lg:col-span-5 lg:col-start-5 lg:pt-2">
                    {p.summary}
                  </span>
                )}
                {years && (
                  <span className="text-[15px] text-ink-700 lg:col-span-3 lg:col-start-10 lg:pt-2 lg:text-right">
                    {years}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
