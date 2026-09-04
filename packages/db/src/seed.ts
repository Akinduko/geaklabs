import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "./client";
import { users, categories, posts, projects, experiences, services } from "./schema";

/**
 * Seeds the database with the admin account, the three editorial topics,
 * and PLACEHOLDER content (original copy) to be replaced via the admin app.
 */

function readingMinutes(text: string) {
  return Math.max(1, Math.round(text.split(/\s+/).length / 200));
}

async function main() {
  console.log("Seeding GEAK LABS…");

  // ---- Admin user ----
  const email = process.env.ADMIN_EMAIL ?? "gb@geaklabs.com";
  const password = process.env.ADMIN_PASSWORD ?? "geaklabs-admin";
  const name = process.env.ADMIN_NAME ?? "Olugbenga Akinduko";
  const passwordHash = await bcrypt.hash(password, 10);

  await db
    .insert(users)
    .values({ email, passwordHash, name, role: "admin" })
    .onConflictDoUpdate({ target: users.email, set: { passwordHash, name } });
  console.log(`  ✓ admin user: ${email}`);

  // ---- Categories ----
  const cats = [
    { name: "Leadership", slug: "leadership", description: "Judgment, clarity, and the human parts of leading.", sortOrder: 1 },
    { name: "Management", slug: "management", description: "Systems, cadence, and getting things done.", sortOrder: 2 },
    { name: "Technology", slug: "technology", description: "Building products and the teams behind them.", sortOrder: 3 },
  ];
  await db.insert(categories).values(cats).onConflictDoNothing({ target: categories.slug });
  const catRows = await db.select().from(categories);
  const catBySlug = Object.fromEntries(catRows.map((c) => [c.slug, c.id]));
  console.log(`  ✓ categories: ${catRows.length}`);

  // ---- Seed posts ----
  const draftPosts = [
    {
      title: "The manager's real job is manufacturing clarity",
      slug: "manufacturing-clarity",
      categorySlug: "leadership",
      featured: true,
      excerpt:
        "Most teams don't lack talent or effort. They lack a shared, legible picture of where they're going — and closing that gap is the highest-leverage work a leader does.",
      body: `<p>Walk into a struggling team and you will rarely find lazy people. You will find hard-working people rowing in slightly different directions, each certain their direction is the agreed one. The deficit is not effort. It is clarity.</p><h2>Clarity is a product, not a memo</h2><p>Clarity is not achieved by sending a document. It is manufactured continuously — restated in standups, defended in reviews, and reinforced every time a trade-off is made in public. A leader's job is to keep the picture legible while the world keeps trying to blur it.</p><h2>Three questions worth over-answering</h2><p>Where are we going? Why does it matter now? What does "good" look like this week? Teams that can answer these without hesitation move faster than teams with twice the resources and half the alignment.</p>`,
    },
    {
      title: "Run the meeting you'd want to attend",
      slug: "run-the-meeting",
      categorySlug: "management",
      featured: false,
      excerpt: "A field guide to agendas, decisions, and the quiet discipline of ending on time.",
      body: `<p>The average recurring meeting is a tax everyone pays and no one audits. The fix is not fewer meetings in the abstract — it is meetings with a job.</p><h2>Every meeting owes you a decision or a change</h2><p>If a meeting cannot name the decision it exists to make or the shared understanding it exists to build, it should be an email. Protect the calendar the way you'd protect a budget.</p>`,
    },
    {
      title: "Boring technology is a competitive advantage",
      slug: "boring-technology",
      categorySlug: "technology",
      featured: false,
      excerpt: "Why the most ambitious teams choose the least exciting tools — and win.",
      body: `<p>Novel technology carries a hidden tax: the unknown unknowns you discover in production, at 2am, with customers watching. Boring, well-understood tools spend that budget on the product instead.</p><h2>Spend your innovation tokens deliberately</h2><p>You get a small number of genuinely novel bets per team. Spend them where novelty is the point — not on the database, the queue, and the deploy pipeline.</p>`,
    },
    {
      title: "Delegation is a design problem",
      slug: "delegation-design",
      categorySlug: "leadership",
      featured: false,
      excerpt: "You don't hand off tasks. You architect ownership. Here's the difference.",
      body: `<p>Delegation fails when it is framed as offloading. It succeeds when it is framed as designing an ownership boundary — clear enough that someone can act, wide enough that they can grow.</p>`,
    },
  ];

  for (const p of draftPosts) {
    await db
      .insert(posts)
      .values({
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        contentHtml: p.body,
        categoryId: catBySlug[p.categorySlug],
        status: "published",
        featured: p.featured,
        readingMinutes: readingMinutes(p.body),
        publishedAt: new Date(),
        tags: [],
      })
      .onConflictDoNothing({ target: posts.slug });
  }
  console.log(`  ✓ posts: ${draftPosts.length}`);

  // ---- Projects ----
  const projectRows = [
    {
      title: "Drivecars — AI-assisted vehicle marketplace",
      slug: "drivecars",
      summary: "A marketplace and booking platform for vehicles, with AI-assisted search and listing tools.",
      role: "Founder / Engineering",
      techStack: ["Next.js", "TypeScript", "Postgres", "Terraform", "AWS"],
      featured: true,
      sortOrder: 1,
      status: "draft" as const,
    },
    {
      title: "Tixxly — events & ticketing platform",
      slug: "tixxly",
      summary: "Ticketing, payments, and the marketing site for a live-events platform.",
      role: "Technical Lead",
      techStack: ["Next.js", "Stripe", "Sanity"],
      featured: true,
      sortOrder: 2,
      status: "draft" as const,
    },
    {
      title: "GEAK LABS — this publication",
      slug: "geaklabs",
      summary: "The publication you are reading. A Turborepo monorepo with a custom editorial CMS — writing, projects, and subscribers managed from an admin I built rather than a hosted platform.",
      role: "Design & Build",
      techStack: ["Turborepo", "Next.js", "Drizzle", "Tailwind"],
      featured: true,
      sortOrder: 3,
      status: "published" as const,
    },
  ];
  for (const pr of projectRows) {
    await db
      .insert(projects)
      .values(pr)
      .onConflictDoNothing({ target: projects.slug });
  }
  console.log(`  ✓ projects: ${projectRows.length}`);

  // ---- What I do ----
  const serviceRows = [
    {
      title: "Using AI",
      body: "Finding where AI earns its place in the business — and where it doesn’t — before anyone buys a licence.",
      sortOrder: 1,
    },
    {
      title: "Optimising with AI",
      body: "Redesigning the work around it: fewer handoffs, less manual operation, gains you can measure rather than demo.",
      sortOrder: 2,
    },
    {
      title: "Governance",
      body: "The policies, controls and accountability that let a company use AI without betting the brand on it.",
      sortOrder: 3,
    },
    {
      title: "Deploying and maintaining",
      body: "Getting it into production and keeping it there — monitoring, cost, drift and ownership, long after launch.",
      sortOrder: 4,
    },
  ];
  const existingServices = await db.select({ id: services.id }).from(services).limit(1);
  if (existingServices.length === 0) {
    await db.insert(services).values(serviceRows.map((s) => ({ ...s, status: "published" as const })));
  }
  console.log(`  ✓ services: ${serviceRows.length}`);

  // ---- Experience ----
  const expRows = [
    {
      company: "Drivecars",
      role: "Founder / Engineering Lead",
      location: "Remote",
      summary: "Building an AI-assisted vehicle marketplace.",
      highlights: ["Led product & engineering", "Architected the platform"],
      startDate: new Date("2024-01-01"),
      isCurrent: true,
      sortOrder: 1,
      status: "draft" as const,
    },
    {
      company: "Tixxly",
      role: "Technical Lead",
      location: "Remote",
      summary: "Events and ticketing platform.",
      highlights: ["Payments & booking", "Marketing site"],
      startDate: new Date("2022-01-01"),
      endDate: new Date("2024-01-01"),
      isCurrent: false,
      sortOrder: 2,
      status: "draft" as const,
    },
  ];
  for (const ex of expRows) {
    await db.insert(experiences).values(ex);
  }
  console.log(`  ✓ experiences: ${expRows.length}`);

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
