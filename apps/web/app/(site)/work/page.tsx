import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@geaklabs/ui";
import { getProjects, getSiteCopy } from "@geaklabs/db";
import { ProjectTable } from "../_components/project-table";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/work" },
  title: "Work",
  description: "Selected projects and products.",
};

export default async function WorkPage() {
  const [projects, copy] = await Promise.all([getProjects(), getSiteCopy()]);

  return (
    <>
      <Container size="wide">
        <header className="max-w-3xl py-14 lg:py-20">
          <h1 className="font-serif text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.92] tracking-[-0.03em] text-ink-900">
            Selected work
          </h1>
          <p className="mt-7 max-w-[52ch] text-lg leading-[1.55] text-ink-700">{copy["work.intro"]}</p>
        </header>
      </Container>

      <Container size="wide">
        {projects.length === 0 ? (
          <p className="border-t border-ink-900 py-24 text-lg text-ink-500">
            Nothing published here yet.{" "}
            <Link href="/articles" className="text-ink-900 underline underline-offset-4">
              Read the writing instead
            </Link>
            .
          </p>
        ) : (
          <>
            <ProjectTable projects={projects} />
            {copy["work.outro"] && (
              <p className="max-w-[52ch] py-14 text-lg leading-[1.55] text-ink-500">
                {copy["work.outro"]}{" "}
                <Link
                  href="/articles"
                  className="text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors hover:decoration-cyan-ink"
                >
                  Read the essays
                </Link>
              </p>
            )}
          </>
        )}
      </Container>
    </>
  );
}
