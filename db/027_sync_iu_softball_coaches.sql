-- Sync Indiana University softball coaching staff from official roster.
-- Source: https://iuhoosiers.com/sports/softball/roster
-- Run after db/025_fix_coach_prefix_person_emails.sql
-- Safe to re-run (upserts on sport_id + coach_name + title).

-- ---------------------------------------------------------------------------
-- PREVIEW: current IU softball contacts
-- ---------------------------------------------------------------------------
SELECT c.id, c.coach_name, c.title, c.email
FROM contacts c
JOIN sports sp ON sp.id = c.sport_id
JOIN schools sch ON sch.id = sp.school_id
WHERE sch.school_name = 'Indiana University'
  AND sp.sport_name = 'softball'
ORDER BY
  CASE
    WHEN c.title ILIKE 'Head Coach%' THEN 1
    WHEN c.title ILIKE 'Associate%' THEN 2
    WHEN c.title ILIKE 'Assistant%' THEN 3
    ELSE 4
  END,
  c.coach_name;

-- ---------------------------------------------------------------------------
-- FIX: known fused emails (safety net if 025 not run yet)
-- ---------------------------------------------------------------------------
UPDATE contacts
SET email = 'softball@iu.edu', updated_at = NOW()
WHERE id = 1394
  AND coach_name = 'Shonda Stanton'
  AND lower(email) IN ('coachsoftball@iu.edu', 'softball@iu.edu');

UPDATE contacts
SET email = 'bell1@iu.edu', updated_at = NOW()
WHERE id = 1384
  AND coach_name = 'Chanda Bell'
  AND lower(email) = 'coachbell1@iu.edu';

UPDATE contacts
SET email = 'kennkirk@iu.edu', updated_at = NOW()
WHERE id = 1389
  AND coach_name = 'Kendra Kirkhoff'
  AND lower(email) = 'coachkennkirk@iu.edu';

-- ---------------------------------------------------------------------------
-- UPSERT: official coaching staff
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
    ('Shonda Stanton', 'Head Coach', 'softball@iu.edu'),
    ('Chanda Bell', 'Associate Head Coach', 'bell1@iu.edu'),
    ('Kendra Kirkhoff', 'Assistant Coach', 'kennkirk@iu.edu'),
    ('Cassie Hendrix', 'Assistant Coach/Director of Operations', 'hendrix@iu.edu')
) AS v(coach_name, title, email)
WHERE sch.school_name = 'Indiana University'
  AND sp.sport_name = 'softball'
ON CONFLICT (sport_id, coach_name, title)
DO UPDATE SET
  email = EXCLUDED.email,
  phone = NULL,
  updated_at = NOW();

-- ---------------------------------------------------------------------------
-- VERIFY
-- ---------------------------------------------------------------------------
SELECT c.coach_name, c.title, c.email
FROM contacts c
JOIN sports sp ON sp.id = c.sport_id
JOIN schools sch ON sch.id = sp.school_id
WHERE sch.school_name = 'Indiana University'
  AND sp.sport_name = 'softball'
ORDER BY
  CASE
    WHEN c.title ILIKE 'Head Coach%' THEN 1
    WHEN c.title ILIKE 'Associate%' THEN 2
    WHEN c.title ILIKE 'Assistant%' THEN 3
    ELSE 4
  END,
  c.coach_name;
