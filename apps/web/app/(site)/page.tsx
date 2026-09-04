import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@geaklabs/ui";
import { getPublishedPosts, getProjects, getServices, getSiteCopy, copyLines } from "@geaklabs/db";
import { ProjectTable } from "./_components/project-table";
import { JsonLd } from "./_components/json-ld";
import { siteJsonLd } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getSiteCopy();
  return {
    title: { absolute: copy["meta.title"] },
    description: copy["meta.description"],
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const [posts, projects, services, copy] = await Promise.all([
    getPublishedPosts(4),
    getProjects(),
    getServices(),
    getSiteCopy(),
  ]);
  const headline = copyLines(copy["hero.headline"]);
  const now = copyLines(copy["hero.now"]);
  const openTo = copyLines(copy["hero.open_to"]);

  return (
    <>
      <JsonLd data={siteJsonLd(copy, services)} />
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
              {now.length > 0 && (
                <div className="flex flex-col gap-1 text-sm text-ink-500 lg:col-span-3 lg:col-start-7">
                  <span className="font-semibold text-ink-900">Now</span>
                  {now.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </div>
              )}
              {openTo.length > 0 && (
                <div className="flex flex-col gap-1 text-sm text-ink-500 lg:col-span-3 lg:col-start-10">
                  <span className="font-semibold text-ink-900">Open to</span>
                  {openTo.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* What I do — edited in the admin */}
      {services.length > 0 && (
        <section className="border-b border-rule">
          <Container size="wide">
            <div className="grid gap-10 py-20 lg:grid-cols-12 lg:gap-6">
              <div className="lg:col-span-4">
                <span className="kicker text-ink-500">What I do</span>
                <h2 className="mt-5 max-w-[360px] text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink-900 sm:text-[40px]">
                  {copy["services.heading"]}
                </h2>
              </div>
              <ul className="border-b border-ink-900 lg:col-span-7 lg:col-start-6">
                {services.map((item) => (
                  <li
                    key={item.id}
                    className="grid gap-1.5 border-t border-rule py-5 lg:grid-cols-[264px_1fr] lg:gap-6"
                  >
                    <span className="text-xl font-medium leading-tight tracking-[-0.02em] text-ink-900">
                      {item.title}
                    </span>
                    {item.body && (
                      <span className="text-[15px] leading-normal text-ink-700">{item.body}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      )}

      {/* Selected work */}
      {projects.length > 0 && (
        <section>
          <Container size="wide">
            <ProjectTable projects={projects} />
          </Container>
        </section>
      )}

      {/* Writing */}
      {posts.length > 0 && (
        <section>
          <Container size="wide">
            <div className="grid gap-10 py-20 lg:grid-cols-12 lg:gap-6">
              <div className="lg:col-span-4">
                <span className="kicker text-ink-500">Writing</span>
                <h2 className="mt-5 max-w-[360px] text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink-900 sm:text-[40px]">
                  {copy["writing.heading"]}
                </h2>
                <Link
                  href="/articles"
                  className="mt-7 inline-block border-b border-ink-900 pb-0.5 text-sm font-medium text-ink-900 transition-colors hover:border-cyan-ink hover:text-cyan-ink"
                >
                  All essays
                </Link>
              </div>
              <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
                {posts.map((post) => (
                  <Link key={post.slug} href={`/articles/${post.slug}`} className="group block">
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
    </>
  );
}
