CREATE TYPE "public"."content_section" AS ENUM('professional', 'faith');--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "section" "content_section" DEFAULT 'professional' NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "section" "content_section" DEFAULT 'professional' NOT NULL;--> statement-breakpoint
CREATE INDEX "posts_section_idx" ON "posts" USING btree ("section");