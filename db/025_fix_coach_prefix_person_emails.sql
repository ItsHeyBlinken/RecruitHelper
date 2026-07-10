-- Strip fused "coach" title from ALL .edu emails (including coachsoftball → softball).
-- Examples:
--   coachsoftball@iu.edu → softball@iu.edu
--   coachmarissa.young@duke.edu → marissa.young@duke.edu
--   coachath-softball@osu.edu → ath-softball@osu.edu
-- Safe to re-run. Run PREVIEW first.

-- ---------------------------------------------------------------------------
-- PREVIEW: all coach-prefixed .edu emails that will be fixed
-- ---------------------------------------------------------------------------
SELECT
  c.id,
  sch.school_name,
  c.coach_name,
  c.title,
  c.email AS current_email,
  lower(regexp_replace(split_part(c.email, '@', 1), '^coach', '') || '@' || split_part(c.email, '@', 2)) AS fixed_email
FROM contacts c
JOIN sports sp ON sp.id = c.sport_id
JOIN schools sch ON sch.id = sp.school_id
WHERE c.email IS NOT NULL
  AND lower(split_part(c.email, '@', 1)) ~ '^coach[a-z0-9]'
  AND split_part(c.email, '@', 2) ~ '\.edu$'
ORDER BY sch.school_name, c.coach_name;

-- ---------------------------------------------------------------------------
-- FIX: strip fused coach prefix from all matching .edu emails
-- ---------------------------------------------------------------------------
UPDATE contacts
SET
  email = lower(
    regexp_replace(split_part(email, '@', 1), '^coach', '') || '@' || split_part(email, '@', 2)
  ),
  updated_at = NOW()
WHERE email IS NOT NULL
  AND lower(split_part(email, '@', 1)) ~ '^coach[a-z0-9]'
  AND split_part(email, '@', 2) ~ '\.edu$'
  AND lower(
    regexp_replace(split_part(email, '@', 1), '^coach', '') || '@' || split_part(email, '@', 2)
  ) <> lower(email);

-- ---------------------------------------------------------------------------
-- VERIFY: remaining coach-prefixed emails (should only be non-.edu)
-- ---------------------------------------------------------------------------
SELECT c.id, sch.school_name, c.coach_name, c.title, c.email
FROM contacts c
JOIN sports sp ON sp.id = c.sport_id
JOIN schools sch ON sch.id = sp.school_id
WHERE c.email IS NOT NULL
  AND lower(c.email) LIKE 'coach%@%'
ORDER BY sch.school_name, c.coach_name;

-- ---------------------------------------------------------------------------
-- VERIFY: Duke, SFA, IU coaching staff
-- ---------------------------------------------------------------------------
SELECT sch.school_name, c.coach_name, c.title, c.email
FROM contacts c
JOIN sports sp ON sp.id = c.sport_id
JOIN schools sch ON sch.id = sp.school_id
WHERE sch.school_name IN (
    'Duke University',
    'Stephen F. Austin State University',
    'Indiana University'
  )
  AND sp.sport_name = 'softball'
ORDER BY sch.school_name,
  CASE WHEN c.title ILIKE 'Head Coach%' THEN 1 WHEN c.title ILIKE 'Associate%' THEN 2 ELSE 3 END,
  c.coach_name;
