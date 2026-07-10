-- Sync Duke softball coaching staff from official coaches page.
-- Source: https://goduke.com/sports/softball/coaches
-- Run after db/025_fix_coach_prefix_person_emails.sql
-- Safe to re-run (upserts on sport_id + coach_name + title).

-- ---------------------------------------------------------------------------
-- PREVIEW: current Duke softball contacts
-- ---------------------------------------------------------------------------
SELECT c.id, c.coach_name, c.title, c.email
FROM contacts c
JOIN sports sp ON sp.id = c.sport_id
JOIN schools sch ON sch.id = sp.school_id
WHERE sch.school_name = 'Duke University'
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
-- UPSERT: official 2026 coaching staff (coaching staff table only)
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
    ('Marissa Young', 'Head Coach', 'marissa.young@duke.edu'),
    ('Taylor Wike', 'Associate Head Coach', 'taylor.wike@duke.edu'),
    ('Jala Wright', 'Assistant Coach', 'jala.wright@duke.edu')
) AS v(coach_name, title, email)
WHERE sch.school_name = 'Duke University'
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
WHERE sch.school_name = 'Duke University'
  AND sp.sport_name = 'softball'
ORDER BY
  CASE
    WHEN c.title ILIKE 'Head Coach%' THEN 1
    WHEN c.title ILIKE 'Associate%' THEN 2
    WHEN c.title ILIKE 'Assistant%' THEN 3
    ELSE 4
  END,
  c.coach_name;
