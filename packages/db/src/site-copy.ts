/**
 * Every line of site copy that is editable in the admin.
 * The database stores overrides by key; anything unset falls back to the default here,
 * so a fresh database renders the site exactly as designed.
 */
export type CopyKind = "text" | "textarea" | "lines" | "paragraphs";

export type CopyField = {
  key: string;
  group: string;
  label: string;
  kind: CopyKind;
  hint?: string;
  default: string;
};

export const SITE_COPY_FIELDS = [
  // ---- Header ----
  {
    key: "header.tagline",
    group: "Header",
    label: "Tagline beside your name",
    kind: "text",
    default: "Engineering · AI · Leadership · Faith",
  },

  // ---- Home: hero ----
  {
    key: "hero.kicker",
    group: "Home — hero",
    label: "Small line above the headline",
    kind: "text",
    default: "Principal Engineer · Builder · Writing on faith",
  },
  {
    key: "hero.headline",
    group: "Home — hero",
    label: "Headline",
    kind: "textarea",
    hint: "One line per row. The full stop is added automatically.",
    default: "I build systems\nthat scale",
  },
  {
    key: "hero.subline",
    group: "Home — hero",
    label: "Italic line under the headline",
    kind: "text",
    default: "And write about what I’m learning — at work, and in faith.",
  },
  {
    key: "hero.intro",
    group: "Home — hero",
    label: "Introduction paragraph",
    kind: "textarea",
    default:
      "I'm a software engineer and engineering leader with more than a decade of experience building products, platforms and teams. My work spans distributed systems, APIs, cloud infrastructure and AI — turning ambitious ideas into software that works in production and keeps working as the business grows. I'm also a Christian. Alongside the engineering, I write about following Jesus in ordinary working life — two sides of one person, kept side by side here.",
  },
  {
    key: "hero.now",
    group: "Home — hero",
    label: "“Now” list",
    kind: "lines",
    hint: "One item per line. Leave empty to hide the block.",
    default: "Principal Engineer\nBuilding at GEAK LABS\nExploring AI-native engineering",
  },
  {
    key: "hero.open_to",
    group: "Home — hero",
    label: "“Open to” list",
    kind: "lines",
    hint: "One item per line. Leave empty to hide the block.",
    default: "Advisory\nEngineering leadership\nInteresting problems",
  },

  // ---- Home: sections ----
  {
    key: "services.heading",
    group: "Home — sections",
    label: "“What I do” heading",
    kind: "text",
    default: "Engineering, end to end.",
  },
  {
    key: "writing.heading",
    group: "Home — sections",
    label: "Writing heading",
    kind: "textarea",
    default: "Notes from building, leading and learning.",
  },
  {
    key: "faith.heading",
    group: "Home — sections",
    label: "Faith heading",
    kind: "textarea",
    hint: "Heading of the faith block on the home page. The block only shows once a faith post is published.",
    default: "Faith, written down.",
  },

  // ---- About ----
  {
    key: "about.headline",
    group: "About",
    label: "Headline",
    kind: "textarea",
    default: "I build technology, teams and companies, follow Jesus, and write about what I learn along the way.",
  },
  {
    key: "about.bio",
    group: "About",
    label: "Bio",
    kind: "paragraphs",
    hint: "Separate paragraphs with a blank line.",
    default:
      "I'm Olugbenga Akinduko — a software engineer and engineering leader based in the UK. I've spent more than a decade building software, from payments and media platforms to distributed travel systems, APIs and cloud infrastructure.\n\nMy career has moved from hands-on engineering into technical and organisational leadership. I've been a founding engineer, Head of Engineering and today work at Principal Engineer level. I still like being close to the technology: architecture, backend systems, reliability, developer experience and increasingly the systems being built around AI.\n\nI've also spent a meaningful part of my career building from zero. I've joined companies as an early engineer, helped grow engineering teams, and built products outside my main roles. That experience taught me that the hardest technology decisions are rarely just about technology — they are also about customers, economics, people, timing and knowing what not to build.\n\nI'm also a Christian, and that isn't a separate compartment from the rest. Faith shapes how I think about work, ambition, failure and the people I build with. I write about it here too — scripture, prayer and what following Jesus asks of an ordinary working life — mostly to work things out for myself, and shared in case they help someone else.\n\nGEAK LABS is where I think and build in public. The professional writing covers engineering, AI, leadership and company building — usually through something I've built, a decision I've had to make, or something I understood differently after getting it wrong. The faith writing has its own section, so you can read one side, the other, or both.",
  },

  // ---- Work & Writing pages ----
  {
    key: "work.intro",
    group: "Work page",
    label: "Introduction under “Selected work”",
    kind: "textarea",
    default:
      "Products, platforms and companies I've built or helped build — from production systems inside global businesses to ideas started from zero.",
  },
  {
    key: "work.outro",
    group: "Work page",
    label: "Closing line under the list",
    kind: "textarea",
    hint: "Leave empty to hide.",
    default: "Some of the most interesting work can't be shown here. The writing is where I unpack the thinking behind it.",
  },
  {
    key: "articles.intro",
    group: "Writing page",
    label: "Introduction under “Writing”",
    kind: "textarea",
    default:
      "Notes on engineering, AI, leadership and building things — mostly lessons from doing the work rather than observing it.",
  },

  // ---- Faith section ----
  {
    key: "nav.faith",
    group: "Faith",
    label: "Navigation label",
    kind: "text",
    hint: "The link in the header and footer.",
    default: "Faith",
  },
  {
    key: "faith.title",
    group: "Faith",
    label: "Page heading",
    kind: "text",
    default: "Faith",
  },
  {
    key: "faith.intro",
    group: "Faith",
    label: "Introduction under the heading",
    kind: "textarea",
    default:
      "Notes on following Jesus — scripture, prayer and what faith asks of an ordinary working life. Written down to work them out, and shared in case they help someone else.",
  },
  {
    key: "faith.metaDescription",
    group: "Faith",
    label: "Search description for the faith section",
    kind: "textarea",
    default:
      "Faith writing by Olugbenga Akinduko, a Christian and Principal Engineer — notes on scripture, prayer and following Jesus in ordinary working life.",
  },
  {
    key: "faith.rssTitle",
    group: "Faith",
    label: "RSS feed title",
    kind: "text",
    default: "GEAK LABS — Faith",
  },

  // ---- Footer / contact ----
  { key: "footer.cta", group: "Footer", label: "Call to action", kind: "text", default: "Let's build something." },
  { key: "footer.email", group: "Footer", label: "Contact email", kind: "text", hint: "Leave empty to hide.", default: "" },
  { key: "footer.linkedin", group: "Footer", label: "LinkedIn URL", kind: "text", hint: "Leave empty to hide.", default: "" },
  { key: "footer.github", group: "Footer", label: "GitHub URL", kind: "text", hint: "Leave empty to hide.", default: "" },

  // ---- Search & sharing ----
  {
    key: "meta.title",
    group: "Search & sharing",
    label: "Site title",
    kind: "text",
    hint: "Shown in the browser tab and in search results.",
    default: "GEAK LABS — Engineering, AI, Leadership & Faith",
  },
  {
    key: "meta.description",
    group: "Search & sharing",
    label: "Site description",
    kind: "textarea",
    default:
      "Olugbenga Akinduko is a Principal Engineer and a Christian, writing about software engineering, AI, technical leadership and building companies — and about following Jesus in ordinary working life.",
  },
] as const satisfies readonly CopyField[];

export type CopyKey = (typeof SITE_COPY_FIELDS)[number]["key"];
export type SiteCopy = Record<CopyKey, string>;

export const SITE_COPY_DEFAULTS: SiteCopy = Object.fromEntries(
  SITE_COPY_FIELDS.map((f) => [f.key, f.default]),
) as SiteCopy;

/** Split a "lines" value into trimmed, non-empty items. */
export function copyLines(value: string): string[] {
  return value.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
}

/** Split a "paragraphs" value on blank lines. */
export function copyParagraphs(value: string): string[] {
  return value.split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter(Boolean);
}
