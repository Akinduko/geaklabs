import Link from "next/link";
import { db, posts, projects, experiences, services } from "@geaklabs/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function count(
  table: typeof posts | typeof projects | typeof experiences | typeof services,
) {
  const [row] = await db.select({ n: sql<number>`count(*)`.mapWith(Number) }).from(table);
  return row?.n ?? 0;
}

export default async function DashboardPage() {
  const [postCount, projectCount, expCount, serviceCount] = await Promise.all([
    count(posts),
    count(projects),
    count(experiences),
    count(services),
  ]);

  const cards = [
    { label: "Posts", count: postCount, href: "/posts", cta: "Write a post" },
    { label: "Projects", count: projectCount, href: "/projects", cta: "Add a project" },
    { label: "Experience", count: expCount, href: "/experience", cta: "Add experience" },
    { label: "What I do", count: serviceCount, href: "/services", cta: "Edit the list" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Dashboard</h1>
      <p className="mt-1 font-serif text-ink-500">Manage everything that appears on GEAK LABS.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-ink-200 bg-paper p-6">
            <p className="kicker text-ink-400">{c.label}</p>
            <p className="mt-3 font-display text-4xl font-semibold text-ink-900">{c.count}</p>
            <Link
              href={c.href}
              className="mt-4 inline-block font-display text-sm text-ink-500 hover:text-ink-900"
            >
              {c.cta} →
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-ink-200 bg-paper p-6">
        <div className="h-px w-full gradient-bg" />
        <p className="mt-4 font-serif text-ink-600">
          Draft a post, add a project, or update your experience — changes publish to the live site
          automatically.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/posts/new"
            className="rounded-lg bg-ink-900 px-4 py-2 font-display text-sm font-medium text-paper hover:opacity-90"
          >
            New post
          </Link>
          <Link
            href="/projects/new"
            className="rounded-lg border border-ink-300 px-4 py-2 font-display text-sm font-medium text-ink-900 hover:bg-ink-50"
          >
            New project
          </Link>
          <Link
            href="/experience/new"
            className="rounded-lg border border-ink-300 px-4 py-2 font-display text-sm font-medium text-ink-900 hover:bg-ink-50"
          >
            New experience
          </Link>
          <Link
            href="/copy"
            className="rounded-lg border border-ink-300 px-4 py-2 font-display text-sm font-medium text-ink-900 hover:bg-ink-50"
          >
            Edit site copy
          </Link>
        </div>
      </div>
    </div>
  );
}
