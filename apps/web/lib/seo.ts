import type { SiteCopy } from "@geaklabs/db";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const PERSON_NAME = "Olugbenga Akinduko";
export const ORG_NAME = "GEAK LABS";

/** Absolute URL for a site-relative path. */
export function abs(path: string) {
  return new URL(path, SITE_URL).toString();
}

/**
 * Person + Organization + WebSite graph for the home page.
 * Search engines and LLM crawlers use this to answer "who is this and what do they do".
 */
export function siteJsonLd(copy: SiteCopy, services: { title: string; body: string | null }[]) {
  const personId = `${SITE_URL}/#person`;
  const orgId = `${SITE_URL}/#organization`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: PERSON_NAME,
        url: SITE_URL,
        jobTitle: copy["hero.kicker"],
        description: copy["hero.intro"],
        knowsAbout: services.map((s) => s.title),
        worksFor: { "@id": orgId },
      },
      {
        "@type": "Organization",
        "@id": orgId,
        name: ORG_NAME,
        url: SITE_URL,
        description: copy["meta.description"],
        founder: { "@id": personId },
        logo: abs("/icon.svg"),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: ORG_NAME,
        description: copy["meta.description"],
        publisher: { "@id": orgId },
        inLanguage: "en",
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profilepage`,
        url: SITE_URL,
        mainEntity: { "@id": personId },
        about: { "@id": personId },
      },
    ],
  };
}

/** Article graph for a single essay. */
export function articleJsonLd(post: {
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: Date | string | null;
  updatedAt?: Date | string | null;
  readingMinutes: number;
  coverImageUrl: string | null;
  categoryName?: string | null;
}) {
  const url = abs(`/articles/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": url,
    headline: post.title,
    description: post.excerpt ?? undefined,
    url,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: new Date(post.updatedAt ?? post.publishedAt ?? Date.now()).toISOString(),
    author: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: PERSON_NAME },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: ORG_NAME },
    image: post.coverImageUrl ?? abs("/opengraph-image"),
    articleSection: post.categoryName ?? undefined,
    timeRequired: `PT${Math.max(1, post.readingMinutes)}M`,
    isAccessibleForFree: true,
    inLanguage: "en",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

/** CreativeWork graph for a project. */
export function projectJsonLd(project: {
  title: string;
  slug: string;
  summary: string | null;
  role: string | null;
  techStack: string[];
  startDate: Date | null;
  endDate: Date | null;
  liveUrl: string | null;
}) {
  const url = abs(`/work/${project.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": url,
    name: project.title,
    description: project.summary ?? undefined,
    url,
    creator: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: PERSON_NAME },
    author: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: PERSON_NAME },
    keywords: project.techStack.join(", ") || undefined,
    dateCreated: project.startDate ? new Date(project.startDate).toISOString() : undefined,
    sameAs: project.liveUrl ?? undefined,
    inLanguage: "en",
  };
}

/** Breadcrumbs help both search results and crawlers understand site structure. */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: abs(t.path),
    })),
  };
}
