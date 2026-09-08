-- Category taxonomy migration — Engineering / AI / Leadership / Building
--
-- SAFE BY DESIGN:
--   * Touches ONLY the `categories` table. Never writes to posts, projects,
--     experiences, services or site_copy.
--   * Never changes any post's category_id — no post is reassigned.
--   * Idempotent: re-running it makes no further changes.
--   * Deletes an old category ONLY when zero posts reference it.
--
-- Run:  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f taxonomy-2026-09.sql

BEGIN;

-- 1. Reuse the existing Leadership row: update in place, never duplicate.
UPDATE categories
   SET description = 'Clarity, judgment, ownership and the human side of building engineering organisations.',
       sort_order  = 3
 WHERE slug = 'leadership';

-- 2. Add the three new categories. ON CONFLICT keeps this re-runnable and
--    guarantees no duplicate slugs.
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Engineering', 'engineering',
   'Architecture, systems, reliability and the craft of building software.', 1),
  ('AI', 'ai',
   'Building useful systems around models, agents, automation and new ways of working.', 2),
  ('Building', 'building',
   'Products, startups, experiments and lessons from turning ideas into something real.', 4)
ON CONFLICT (slug) DO UPDATE
  SET name        = EXCLUDED.name,
      description = EXCLUDED.description,
      sort_order  = EXCLUDED.sort_order;

-- 3. Retire the old categories, but ONLY if no post still points at them.
--    A category still in use is left untouched and must be emptied in the CMS.
DELETE FROM categories c
 WHERE c.slug IN ('management', 'technology')
   AND NOT EXISTS (SELECT 1 FROM posts p WHERE p.category_id = c.id);

COMMIT;

-- Report: what survived, and why.
SELECT c.sort_order,
       c.name,
       c.slug,
       count(p.id) AS posts,
       CASE WHEN c.slug IN ('management','technology')
            THEN 'RETAINED — still in use, reassign its posts then delete in the CMS'
            ELSE 'target taxonomy' END AS note
  FROM categories c
  LEFT JOIN posts p ON p.category_id = c.id
 GROUP BY c.id
 ORDER BY c.sort_order, c.name;
