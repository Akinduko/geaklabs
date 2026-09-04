import type { Metadata } from "next";
import { Container } from "@geaklabs/ui";
import { getExperiences, getSiteCopy, copyParagraphs } from "@geaklabs/db";
import { formatMonthYear } from "@/lib/format";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About",
  description: "About Olugbenga Akinduko and GEAK LABS.",
};

export default async function AboutPage() {
  const [experiences, copy] = await Promise.all([getExperiences(), getSiteCopy()]);
  const bio = copyParagraphs(copy["about.bio"]);

  return (
    <>
      <Container size="wide">
        <header className="max-w-3xl py-14 lg:py-20">
          <h1 className="font-serif text-[clamp(3rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.03em] text-ink-900">
            {copy["about.headline"]}
          </h1>
          {bio.length > 0 && (
            <div className="mt-8 max-w-[58ch] space-y-5 text-lg leading-[1.55] text-ink-700">
              {bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
        </header>
      </Container>

      {experiences.length > 0 && (
        <Container size="wide">
          <section className="border-t border-ink-900 py-14">
            <h2 className="kicker text-ink-900">Experience</h2>
            <ol className="mt-8 border-l border-ink-200">
              {experiences.map((exp) => (
                <li key={exp.id} className="relative pb-10 pl-8 last:pb-0">
                  <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full gradient-bg" />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold text-ink-900">
                      {exp.role} · <span className="text-ink-600">{exp.company}</span>
                    </h3>
                    <span className="font-display text-sm text-ink-500">
                      {formatMonthYear(exp.startDate)} —{" "}
                      {exp.isCurrent ? "Present" : formatMonthYear(exp.endDate)}
                    </span>
                  </div>
                  {exp.location && (
                    <p className="mt-0.5 font-display text-sm text-ink-500">{exp.location}</p>
                  )}
                  {exp.summary && (
                    <p className="mt-3 max-w-2xl text-base text-ink-700">{exp.summary}</p>
                  )}
                  {exp.highlights.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="flex gap-2 text-base text-ink-700">
                          <span className="gradient-text">—</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </section>
        </Container>
      )}
    </>
  );
}
