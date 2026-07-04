-- Manual Texas State softball staff (from staff directory).
-- Safe to re-run (upserts on sport_id + coach_name + title).

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
    ('Ricci Woodard', 'Head Coach', 'rw15@txstate.edu'),
    ('Scott Woodard', 'Assistant Coach', 'swoodard22@txstate.edu'),
    ('Peejay Brun', 'Assistant Coach', 'pb21@txstate.edu'),
    ('Alisa Goler', 'Assistant Coach', 'vad77@txstate.edu'),
    ('Max Lopez', 'Director of Player Development', 'bcp89@txstate.edu'),
    ('JJ Smith', 'Graduate Assistant', 'vrt33@txstate.edu')
) AS v(coach_name, title, email)
WHERE sch.school_name = 'Texas State University'
  AND sp.sport_name = 'softball'
ON CONFLICT (sport_id, coach_name, title)
DO UPDATE SET
  email = EXCLUDED.email,
  phone = NULL,
  updated_at = NOW();

-- Verify
SELECT c.coach_name, c.title, c.email
FROM contacts c
JOIN sports sp ON sp.id = c.sport_id
JOIN schools sch ON sch.id = sp.school_id
WHERE sch.school_name = 'Texas State University'
  AND sp.sport_name = 'softball'
ORDER BY
  CASE
    WHEN c.title ILIKE 'Head Coach%' THEN 1
    WHEN c.title ILIKE 'Associate%' THEN 2
    WHEN c.title ILIKE 'Assistant%' THEN 3
    ELSE 4
  END,
  c.coach_name;
