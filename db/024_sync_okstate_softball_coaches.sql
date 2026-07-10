-- Sync Oklahoma State softball coaching staff from official coaches page.
-- Source: https://okstate.com/sports/softball/coaches
-- Run after db/023_fix_fused_role_email_prefixes.sql (or standalone — includes OKST email fixes).
-- Safe to re-run (upserts on sport_id + coach_name + title).

-- ---------------------------------------------------------------------------
-- PREVIEW: current OK State softball contacts
-- ---------------------------------------------------------------------------
SELECT c.id, c.coach_name, c.title, c.email, c.phone
FROM contacts c
JOIN sports sp ON sp.id = c.sport_id
JOIN schools sch ON sch.id = sp.school_id
WHERE sch.school_name = 'Oklahoma State University'
  AND sp.sport_name = 'softball'
ORDER BY
  CASE
    WHEN c.title ILIKE 'Head Coach%' THEN 1
    WHEN c.title ILIKE '%Recruiting%' THEN 2
    WHEN c.title ILIKE 'Assistant%' THEN 3
    ELSE 4
  END,
  c.coach_name;

-- ---------------------------------------------------------------------------
-- FIX: fused-prefix emails on known OK State rows (safety net if 023 not run yet)
-- ---------------------------------------------------------------------------
UPDATE contacts
SET email = 'kenny.g@okstate.edu', updated_at = NOW()
WHERE id = 1460
  AND coach_name = 'Kenny Gajewski'
  AND lower(email) = 'coachkenny.g@okstate.edu';

UPDATE contacts
SET
  email = 'vshippy@okstate.edu',
  coach_name = 'Vanessa Shippy-Fletcher',
  title = 'Assistant Coach/Recruiting Coordinator',
  updated_at = NOW()
WHERE id = 1468
  AND lower(email) = 'coordinatorvshippy@okstate.edu';

-- Remove duplicate Shippy row (keep Vanessa Shippy-Fletcher)
DELETE FROM contacts
WHERE id = 1469
  AND coach_name = 'V. Shippy'
  AND email = 'vshippy@okstate.edu';

-- ---------------------------------------------------------------------------
-- UPSERT: official 2026-27 coaching staff (coaching staff table only)
-- ---------------------------------------------------------------------------
INSERT INTO contacts (sport_id, coach_name, title, email, phone)
SELECT
  sp.id,
  v.coach_name,
  v.title,
  v.email,
  NULL
FROM sports sp
JOIN schools sch ON sch.id = sp.school_id
CROSS JOIN (
  VALUES
    ('Kenny Gajewski', 'Head Coach', 'kenny.g@okstate.edu'),
    ('Vanessa Shippy-Fletcher', 'Assistant Coach/Recruiting Coordinator', 'vshippy@okstate.edu'),
    ('Carrie Eberle Parker', 'Assistant Coach', NULL),
    ('Greg Bergeron', 'Assistant Coach/Defensive Coordinator', NULL)
) AS v(coach_name, title, email)
WHERE sch.school_name = 'Oklahoma State University'
  AND sp.sport_name = 'softball'
ON CONFLICT (sport_id, coach_name, title)
DO UPDATE SET
  email = EXCLUDED.email,
  phone = NULL,
  updated_at = NOW();

-- ---------------------------------------------------------------------------
-- CLEANUP: remove stale generic-title duplicates when official title row exists
-- ---------------------------------------------------------------------------
DELETE FROM contacts c
USING sports sp, schools sch
WHERE c.sport_id = sp.id
  AND sp.school_id = sch.id
  AND sch.school_name = 'Oklahoma State University'
  AND sp.sport_name = 'softball'
  AND c.coach_name = 'Vanessa Shippy-Fletcher'
  AND c.title = 'Assistant Coach'
  AND EXISTS (
    SELECT 1
    FROM contacts c2
    WHERE c2.sport_id = c.sport_id
      AND c2.coach_name = 'Vanessa Shippy-Fletcher'
      AND c2.title = 'Assistant Coach/Recruiting Coordinator'
  );

DELETE FROM contacts c
USING sports sp, schools sch
WHERE c.sport_id = sp.id
  AND sp.school_id = sch.id
  AND sch.school_name = 'Oklahoma State University'
  AND sp.sport_name = 'softball'
  AND c.coach_name = 'Greg Bergeron'
  AND c.title = 'Assistant Coach'
  AND EXISTS (
    SELECT 1
    FROM contacts c2
    WHERE c2.sport_id = c.sport_id
      AND c2.coach_name = 'Greg Bergeron'
      AND c2.title = 'Assistant Coach/Defensive Coordinator'
  );

-- ---------------------------------------------------------------------------
-- VERIFY
-- ---------------------------------------------------------------------------
SELECT c.coach_name, c.title, c.email
FROM contacts c
JOIN sports sp ON sp.id = c.sport_id
JOIN schools sch ON sch.id = sp.school_id
WHERE sch.school_name = 'Oklahoma State University'
  AND sp.sport_name = 'softball'
ORDER BY
  CASE
    WHEN c.title ILIKE 'Head Coach%' THEN 1
    WHEN c.title ILIKE '%Recruiting%' THEN 2
    WHEN c.title ILIKE 'Assistant%' THEN 3
    ELSE 4
  END,
  c.coach_name;
