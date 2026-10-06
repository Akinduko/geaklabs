-- Faith section — seeds the first faith category.
--
-- Run AFTER the Drizzle migration that adds the `section` column
-- (`pnpm --filter @geaklabs/db migrate`). That migration defaults every
-- existing post and category to 'professional', so nothing is reassigned here.
--
-- SAFE BY DESIGN:
--   * Touches ONLY the `categories` table.
--   * Idempotent: re-running it makes no further changes.
--
-- Run:  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f faith-2026-10.sql

BEGIN;

INSERT INTO categories (name, slug, description, section, sort_order) VALUES
  ('Faith', 'faith',
   'Scripture, prayer and following Jesus in ordinary life.', 'faith', 10)
ON CONFLICT (slug) DO UPDATE
  SET name        = EXCLUDED.name,
      description = EXCLUDED.description,
      section     = EXCLUDED.section,
      sort_order  = EXCLUDED.sort_order;

COMMIT;

-- Report: every category and the section it belongs to.
SELECT c.section, c.sort_order, c.name, c.slug, count(p.id) AS posts
  FROM categories c
  LEFT JOIN posts p ON p.category_id = c.id
 GROUP BY c.id
 ORDER BY c.section, c.sort_order, c.name;
