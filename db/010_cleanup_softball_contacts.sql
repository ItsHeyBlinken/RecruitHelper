-- Remove non-softball coaching contacts accidentally saved during bulk scrape.
-- Safe to re-run. Review the preview queries before running the DELETE.

-- ---------------------------------------------------------------------------
-- Preview: schools with unusually high contact counts (likely bad scrape data)
-- ---------------------------------------------------------------------------
SELECT sch.school_name,
       sch.division,
       COUNT(*)::int AS contact_count
FROM contacts c
JOIN sports sp ON sp.id = c.sport_id
JOIN schools sch ON sch.id = sp.school_id
WHERE sp.sport_name = 'softball'
GROUP BY sch.school_name, sch.division
HAVING COUNT(*) > 12
ORDER BY contact_count DESC;

-- ---------------------------------------------------------------------------
-- Preview: contacts that will be removed
-- ---------------------------------------------------------------------------
SELECT sch.school_name,
       c.coach_name,
       c.title,
       c.email
FROM contacts c
JOIN sports sp ON sp.id = c.sport_id
JOIN schools sch ON sch.id = sp.school_id
WHERE sp.sport_name = 'softball'
  AND NOT (
    COALESCE(c.title, '') ~* '(head|assistant|associate|volunteer|graduate|student)\s+(softball\s+)?coach'
    OR COALESCE(c.title, '') ~* 'softball\s+coach'
    OR COALESCE(c.title, '') ~* 'graduate assistant'
    OR COALESCE(c.title, '') ~* 'student assistant'
    OR COALESCE(c.title, '') ~* 'recruiting coordinator'
  )
ORDER BY sch.school_name, c.coach_name;

-- ---------------------------------------------------------------------------
-- Delete contacts that are not softball coaching staff
-- ---------------------------------------------------------------------------
DELETE FROM contacts c
USING sports sp
WHERE c.sport_id = sp.id
  AND sp.sport_name = 'softball'
  AND NOT (
    COALESCE(c.title, '') ~* '(head|assistant|associate|volunteer|graduate|student)\s+(softball\s+)?coach'
    OR COALESCE(c.title, '') ~* 'softball\s+coach'
    OR COALESCE(c.title, '') ~* 'graduate assistant'
    OR COALESCE(c.title, '') ~* 'student assistant'
    OR COALESCE(c.title, '') ~* 'recruiting coordinator'
  );

-- ---------------------------------------------------------------------------
-- Delete contacts whose titles reference other sports or admin roles
-- ---------------------------------------------------------------------------
DELETE FROM contacts c
USING sports sp
WHERE c.sport_id = sp.id
  AND sp.sport_name = 'softball'
  AND (
    COALESCE(c.title, '') ~* '(football|basketball|baseball|soccer|volleyball|track|cross.?country|golf|tennis|bowling|lacrosse|swim|wrestling|cheer|spirit|esports|hockey|rowing|field hockey|men''s basketball|women''s basketball)'
    OR COALESCE(c.title, '') ~* '(athletic director|business manager|compliance|sports information|communications director|facilities|marketing|development|academic enhancement|equipment manager|sports medicine|athletic trainer|strength and conditioning|strength & conditioning|video coordinator|ticketing|senior woman administrator)'
  );

-- ---------------------------------------------------------------------------
-- Remove any non-softball sport rows (future-proof; app is softball-only for now)
-- ---------------------------------------------------------------------------
DELETE FROM sports
WHERE sport_name <> 'softball';

-- ---------------------------------------------------------------------------
-- Summary after cleanup
-- ---------------------------------------------------------------------------
SELECT sch.division,
       COUNT(DISTINCT sch.id)::int AS schools_with_contacts,
       COUNT(c.id)::int AS total_contacts,
       COUNT(c.id) FILTER (WHERE c.email IS NOT NULL)::int AS contacts_with_email
FROM schools sch
LEFT JOIN sports sp ON sp.school_id = sch.id AND sp.sport_name = 'softball'
LEFT JOIN contacts c ON c.sport_id = sp.id
GROUP BY sch.division
ORDER BY sch.division;
