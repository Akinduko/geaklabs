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
    default: "AI strategy · governance · operations",
  },

  // ---- Home: hero ----
  {
    key: "hero.kicker",
    group: "Home — hero",
    label: "Small line above the headline",
    kind: "text",
    default: "AI strategy, governance and operations leader",
  },
  {
    key: "hero.headline",
    group: "Home — hero",
    label: "Headline",
    kind: "textarea",
    hint: "One line per row. The full stop is added automatically.",
    default: "I put AI\nto work",
  },
  {
    key: "hero.subline",
    group: "Home — hero",
    label: "Italic line under the headline",
    kind: "text",
    default: "And write about what breaks.",
  },
  {
    key: "hero.intro",
    group: "Home — hero",
    label: "Introduction paragraph",
    kind: "textarea",
    default:
      "I help companies put AI to work — where to use it, how to optimise with it, and the strategy, governance and operating discipline to deploy it and keep it running well after launch. Whichever industry the work is in. The essays here come out of that work.",
  },
  {
    key: "hero.now",
    group: "Home — hero",
    label: "“Now” list",
    kind: "lines",
    hint: "One item per line. Leave empty to hide the block.",
    default: "Writing at GEAK LABS",
  },
  {
    key: "hero.open_to",
    group: "Home — hero",
    label: "“Open to” list",
    kind: "lines",
    hint: "One item per line. Leave empty to hide the block.",
    default: "Advisory\nFractional leadership",
  },

  // ---- Home: sections ----
  {
    key: "services.heading",
    group: "Home — sections",
    label: "“What I do” heading",
    kind: "text",
    default: "AI, end to end.",
  },
  {
    key: "writing.heading",
    group: "Home — sections",
    label: "Writing heading",
    kind: "textarea",
    default: "Notes from doing the work, not observing it.",
  },

  // ---- About ----
  {
    key: "about.headline",
    group: "About",
    label: "Headline",
    kind: "textarea",
    default: "I help companies use AI well, and write about what I learn doing it.",
  },
  {
    key: "about.bio",
    group: "About",
    label: "Bio",
    kind: "paragraphs",
    hint: "Separate paragraphs with a blank line.",
    default:
      "I’m Olugbenga Akinduko. I lead AI in companies end to end — deciding where it earns its place, optimising the work with it, and building the strategy, governance and operating discipline to deploy it and maintain it once the launch excitement fades. The industry changes from one engagement to the next; the pattern doesn’t.\n\nGEAK LABS is where I think out loud about that work — leadership, management and technology, and the parts of each that only make sense once you’ve done them. Most of what I write starts as something I got wrong first.",
  },

  // ---- Work & Writing pages ----
  {
    key: "work.intro",
    group: "Work page",
    label: "Introduction under “Selected work”",
    kind: "textarea",
    default:
      "Products, platforms and AI programmes I’ve built or led. The essays come out of this work — the problems here are the ones I end up writing about.",
  },
  {
    key: "work.outro",
    group: "Work page",
    label: "Closing line under the list",
    kind: "textarea",
    hint: "Leave empty to hide.",
    default: "More of this work is under wraps for now. The writing is where the thinking behind it lives.",
  },
  {
    key: "articles.intro",
    group: "Writing page",
    label: "Introduction under “Writing”",
    kind: "textarea",
    default:
      "Notes on leadership, management and technology — from doing the work, not observing it.",
  },

  // ---- Footer / contact ----
  { key: "footer.cta", group: "Footer", label: "Call to action", kind: "text", default: "Let’s talk." },
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
    default: "GEAK LABS — AI strategy, governance and operations leadership",
  },
  {
    key: "meta.description",
    group: "Search & sharing",
    label: "Site description",
    kind: "textarea",
    default:
      "Olugbenga Akinduko — AI leader: using AI, optimising with it, and the strategy and governance to deploy and maintain it in a company. Field notes on leadership, management and technology.",
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
