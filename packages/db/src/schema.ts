import {
  pgTable,
  pgEnum,
  uuid,
  text,
  varchar,
  boolean,
  integer,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const contentStatus = pgEnum("content_status", ["draft", "published"]);

/**
 * Which part of the site a post (or category) belongs to. Professional notes live
 * under /articles, faith writing under /faith, and the journal (life, days, experience)
 * under /journal. Set on the post itself so a post can never leak into the wrong feed
 * just because it has no category.
 */
export const contentSection = pgEnum("content_section", ["professional", "faith", "journal"]);
export const CONTENT_SECTIONS = ["professional", "faith", "journal"] as const;
export type ContentSection = (typeof CONTENT_SECTIONS)[number];

/** Single admin (extendable to multi-user later). */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  role: varchar("role", { length: 32 }).notNull().default("admin"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Editorial topics, each scoped to one section (Engineering / AI / … or Faith). */
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  description: text("description"),
  section: contentSection("section").notNull().default("professional"),
  sortOrder: integer("sort_order").notNull().default(0),
});

/**
 * A series threads posts from either section into an ordered sequence (e.g. a memoir).
 * Posts keep their own section; the series only supplies the order and a contents page.
 */
export const series = pgTable("series", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  description: text("description"),
  coverImageUrl: text("cover_image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Posts: professional notes and faith writing. Body stored as TipTap JSON. */
export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    excerpt: text("excerpt"),
    contentJson: jsonb("content_json"),
    contentHtml: text("content_html"),
    coverImageUrl: text("cover_image_url"),
    coverImageAlt: varchar("cover_image_alt", { length: 200 }),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    tags: text("tags").array().notNull().default([]),
    section: contentSection("section").notNull().default("professional"),
    seriesId: uuid("series_id").references(() => series.id, { onDelete: "set null" }),
    seriesPart: integer("series_part"),
    status: contentStatus("status").notNull().default("draft"),
    featured: boolean("featured").notNull().default(false),
    readingMinutes: integer("reading_minutes").notNull().default(1),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("posts_status_idx").on(t.status),
    index("posts_category_idx").on(t.categoryId),
    index("posts_section_idx").on(t.section),
    index("posts_series_idx").on(t.seriesId),
    index("posts_published_idx").on(t.publishedAt),
  ],
);

/** Portfolio projects. */
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    summary: text("summary"),
    descriptionJson: jsonb("description_json"),
    descriptionHtml: text("description_html"),
    role: varchar("role", { length: 160 }),
    techStack: text("tech_stack").array().notNull().default([]),
    liveUrl: text("live_url"),
    repoUrl: text("repo_url"),
    coverImageUrl: text("cover_image_url"),
    images: text("images").array().notNull().default([]),
    featured: boolean("featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    startDate: timestamp("start_date", { withTimezone: true }),
    endDate: timestamp("end_date", { withTimezone: true }),
    status: contentStatus("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("projects_status_idx").on(t.status)],
);

/** Career experience / CV timeline. */
export const experiences = pgTable("experiences", {
  id: uuid("id").defaultRandom().primaryKey(),
  company: varchar("company", { length: 160 }).notNull(),
  role: varchar("role", { length: 160 }).notNull(),
  location: varchar("location", { length: 160 }),
  summary: text("summary"),
  highlights: text("highlights").array().notNull().default([]),
  logoUrl: text("logo_url"),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }),
  isCurrent: boolean("is_current").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  status: contentStatus("status").notNull().default("draft"),
});

/** Newsletter subscribers. */
export const subscribers = pgTable("subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Series = typeof series.$inferSelect;
export type NewSeries = typeof series.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Experience = typeof experiences.$inferSelect;
export type NewExperience = typeof experiences.$inferInsert;

/** "What I do" items on the home page — one title and one line each. */
export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 160 }).notNull(),
  body: text("body"),
  section: contentSection("section").notNull().default("professional"),
  sortOrder: integer("sort_order").notNull().default(0),
  status: contentStatus("status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;

/** Site copy overrides, keyed by the ids in site-copy.ts. Unset keys use the defaults there. */
export const siteCopy = pgTable("site_copy", {
  key: varchar("key", { length: 80 }).primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
export type User = typeof users.$inferSelect;
