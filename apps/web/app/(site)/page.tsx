import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@geaklabs/ui";
import {
  getPublishedPosts,
  getServices,
  getSiteCopy,
  getAllCategories,
  copyLines,
} from "@geaklabs/db";
import { JsonLd } from "./_components/json-ld";
import { siteJsonLd } from "@/lib/seo";
import { postHref } from "@/lib/sections";
import { formatDate } from "@/lib/format";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getSiteCopy();
  return {
    title: { absolute: copy["meta.title"] },
    description: copy["meta.description"],
    alternates: {
      canonical: "/",
      types: {
        "application/rss+xml": [
          { url: "/rss.xml", title: "GEAK LABS — Notes" },
          { url: "/faith/rss.xml", title: copy["faith.rssTitle"] },
          { url: "/journal/rss.xml", title: copy["journal.rssTitle"] },
        ],
      },
    },
  };
}

export default async function HomePage() {
  const [posts, faithPosts, journalEntries, faithTopics, services, copy] = await Promise.all([
    getPublishedPosts(4, "professional"),
    getPublishedPosts(3, "faith"),
    getPublishedPosts(3, "journal"),
    getAllCategories("faith"),
    getServices(),
    getSiteCopy(),
  ]);
  const headline = copyLines(copy["hero.headline"]);
  const work = services.filter((s) => s.section !== "faith");
  const faithServices = services.filter((s) => s.section === "faith");
  const verse = copy["hero.verse"].trim();

  return (
    <>
      <JsonLd data={siteJsonLd(copy, services, faithTopics)} />
      {/* Hero — the one place the serif and the gradient are spent */}
      <section className="border-b border-rule">
        <Container size="wide">
          <div className="relative py-16 lg:py-[88px]">
            <div
              aria-hidden
              className="absolute right-0 top-8 hidden h-[500px] w-[480px] gradient-bg opacity-90 lg:block"
            />
            <div
              aria-hidden
              className="absolute right-11 top-[76px] hidden h-[500px] w-[480px] border border-ink-900 lg:block"
            />

            <div className="relative max-w-[980px]">
              {copy["hero.kicker"] && (
                <p className="text-sm font-medium tracking-[0.02em] text-ink-500">
                  {copy["hero.kicker"]}
                </p>
              )}
              <h1 className="mt-7 font-serif text-[clamp(4.25rem,11.5vw,10.5rem)] leading-[0.88] tracking-[-0.035em] text-ink-900">
                {headline.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                    {i === headline.length - 1 && <span className="text-cyan-ink">.</span>}
                  </span>
                ))}
              </h1>
              {copy["hero.subline"] && (
                <p className="mt-7 font-serif text-[clamp(2rem,4.4vw,4rem)] italic leading-none tracking-[-0.02em] text-ink-700 lg:ml-[220px]">
                  {copy["hero.subline"]}
                </p>
              )}
            </div>

            <div className="relative mt-16 grid gap-8 lg:mt-[88px] lg:grid-cols-12 lg:gap-6">
              {copy["hero.intro"] && (
                <p className="text-lg leading-[1.55] text-ink-700 lg:col-span-5">{copy["hero.intro"]}</p>
              )}
              {verse && (
                <blockquote className="lg:col-span-5 lg:col-start-8">
                  <p className="font-serif text-[1.65rem] leading-[1.25] tracking-[-0.01em] text-ink-700">
                    “{verse}”
                  </p>
                  {copy["hero.verseRef"] && (
                    <cite className="mt-3 block text-sm not-italic text-ink-500">{copy["hero.verseRef"]}</cite>
                  )}
                </blockquote>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* What I do — two groups, both edited in the admin */}
      {(work.length > 0 || faithServices.length > 0) && (
        <section className="border-b border-rule">
          <Container size="wide">
            {work.length > 0 && (
              <ServiceGroup kicker="What I do" heading={copy["services.heading"]} items={work} />
            )}
            {faithServices.length > 0 && (
              <ServiceGroup
                kicker="In faith"
                heading={copy["faith.servicesHeading"]}
                items={faithServices}
                className={work.length > 0 ? "border-t border-rule" : undefined}
              />
            )}
          </Container>
        </section>
      )}

      {/* Writing */}
      {posts.length > 0 && (
        <section>
          <Container size="wide">
            <div className="grid gap-10 py-20 lg:grid-cols-12 lg:gap-6">
              <div className="lg:col-span-4">
                <span className="kicker text-ink-500">Notes</span>
                <h2 className="mt-5 max-w-[360px] text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink-900 sm:text-[40px]">
                  {copy["writing.heading"]}
                </h2>
                <Link
                  href="/articles"
                  className="mt-7 inline-block border-b border-ink-900 pb-0.5 text-sm font-medium text-ink-900 transition-colors hover:border-cyan-ink hover:text-cyan-ink"
                >
                  All notes
                </Link>
              </div>
              <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
                {posts.map((post) => (
                  <Link key={post.slug} href={postHref(post)} className="group block">
                    {post.categoryName && (
                      <span className="kicker text-ink-500">{post.categoryName}</span>
                    )}
                    <span className="mt-2.5 block text-2xl font-medium leading-[1.2] tracking-[-0.02em] text-ink-900 transition-colors group-hover:text-cyan-ink">
                      {post.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Faith — a smaller block, only once something is published there */}
      {faithPosts.length > 0 && (
        <section className="border-t border-rule">
          <Container size="wide">
            <div className="grid gap-8 py-16 lg:grid-cols-12 lg:gap-6">
              <div className="lg:col-span-4">
                <span className="kicker text-ink-500">{copy["nav.faith"] || "Faith"}</span>
                <h2 className="mt-5 max-w-[360px] text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink-900">
                  {copy["faith.heading"]}
                </h2>
                <Link
                  href="/faith"
                  className="mt-6 inline-block border-b border-ink-900 pb-0.5 text-sm font-medium text-ink-900 transition-colors hover:border-cyan-ink hover:text-cyan-ink"
                >
                  More on faith
                </Link>
              </div>
              <ul className="divide-y divide-rule border-y border-rule lg:col-span-7 lg:col-start-6">
                {faithPosts.map((post) => (
                  <li key={post.slug}>
                    <Link href={postHref(post)} className="group flex flex-col gap-1.5 py-5">
                      <span className="text-xl font-medium leading-[1.25] tracking-[-0.02em] text-ink-900 transition-colors group-hover:text-cyan-ink">
                        {post.title}
                      </span>
                      {post.excerpt && (
                        <span className="text-[15px] leading-normal text-ink-700">{post.excerpt}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      )}

      {/* Journal — latest entries as a dated list, only once something is written */}
      {journalEntries.length > 0 && (
        <section className="border-t border-rule">
          <Container size="wide">
            <div className="grid gap-8 py-16 lg:grid-cols-12 lg:gap-6">
              <div className="lg:col-span-4">
                <span className="kicker text-ink-500">Journal</span>
                <h2 className="mt-5 max-w-[360px] text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink-900">
                  {copy["journal.heading"]}
                </h2>
                <Link
                  href="/journal"
                  className="mt-6 inline-block border-b border-ink-900 pb-0.5 text-sm font-medium text-ink-900 transition-colors hover:border-cyan-ink hover:text-cyan-ink"
                >
                  All entries
                </Link>
              </div>
              <ul className="divide-y divide-rule border-y border-rule lg:col-span-7 lg:col-start-6">
                {journalEntries.map((entry) => (
                  <li key={entry.slug}>
                    <Link href={postHref(entry)} className="group grid gap-1 py-5 sm:grid-cols-[160px_1fr] sm:gap-6">
                      <span className="font-serif text-lg leading-tight text-ink-500">{formatDate(entry.publishedAt)}</span>
                      <span className="text-xl font-medium leading-[1.25] tracking-[-0.02em] text-ink-900 transition-colors group-hover:text-cyan-ink">
                        {entry.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

function ServiceGroup({
  kicker,
  heading,
  items,
  className,
}: {
  kicker: string;
  heading: string;
  items: { id: string; title: string; body: string | null }[];
  className?: string;
}) {
  return (
    <div className={`grid gap-10 py-20 lg:grid-cols-12 lg:gap-6 ${className ?? ""}`}>
      <div className="lg:col-span-4">
        <span className="kicker text-ink-500">{kicker}</span>
        <h2 className="mt-5 max-w-[360px] text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink-900 sm:text-[40px]">
          {heading}
        </h2>
      </div>
      <ul className="border-b border-ink-900 lg:col-span-7 lg:col-start-6">
        {items.map((item) => (
          <li
            key={item.id}
            className="grid gap-1.5 border-t border-rule py-5 lg:grid-cols-[264px_1fr] lg:gap-6"
          >
            <span className="text-xl font-medium leading-tight tracking-[-0.02em] text-ink-900">
              {item.title}
            </span>
            {item.body && <span className="text-[15px] leading-normal text-ink-700">{item.body}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
