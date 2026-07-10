-- Fix emails where a job-title word was fused onto the local part during scraping.
-- Examples: coordinatorvshippy@okstate.edu → vshippy@okstate.edu
--            coachkenny.g@okstate.edu → kenny.g@okstate.edu
--
-- Keeps intentional coach-prefixed inboxes (coachdawson@purdue.edu, coachmarissa.young@duke.edu).
-- Safe to re-run. Run PREVIEW sections first.

-- ---------------------------------------------------------------------------
-- PREVIEW: non-coach role prefixes fused into local part
-- ---------------------------------------------------------------------------
SELECT
  c.id,
  sch.school_name,
  c.coach_name,
  c.title,
  c.email AS current_email,
  lower(
    regexp_replace(
      split_part(c.email, '@', 1),
      '^(coordinator|manager|trainer|director|assistant|operations|associate|performance|equipment|player|athletic|communication|development|sports)+',
      ''
    ) || '@' || split_part(c.email, '@', 2)
  ) AS fixed_email
FROM contacts c
JOIN sports sp ON sp.id = c.sport_id
JOIN schools sch ON sch.id = sp.school_id
WHERE c.email IS NOT NULL
  AND lower(split_part(c.email, '@', 1)) ~ '^(coordinator|manager|trainer|director|assistant|operations|associate|performance|equipment|player|athletic|communication|development|sports)[a-z0-9]'
ORDER BY sch.school_name, c.coach_name;

-- ---------------------------------------------------------------------------
-- PREVIEW: fused coach + first.lastinitial at schools that do not use coach@ convention
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
  AND lower(split_part(c.email, '@', 1)) ~ '^coach[a-z]+\.[a-z]$'
  AND EXISTS (
    SELECT 1
    FROM contacts c2
    WHERE c2.id <> c.id
      AND c2.email IS NOT NULL
      AND split_part(c2.email, '@', 2) = split_part(c.email, '@', 2)
      AND lower(split_part(c2.email, '@', 1)) !~ '^coach'
  )
ORDER BY sch.school_name, c.coach_name;

-- ---------------------------------------------------------------------------
-- FIX: strip fused non-coach role prefixes (coordinator, manager, etc.)
-- ---------------------------------------------------------------------------
UPDATE contacts
SET
  email = lower(
    regexp_replace(
      split_part(email, '@', 1),
      '^(coordinator|manager|trainer|director|assistant|operations|associate|performance|equipment|player|athletic|communication|development|sports)+',
      ''
    ) || '@' || split_part(email, '@', 2)
  ),
  updated_at = NOW()
WHERE email IS NOT NULL
  AND lower(split_part(email, '@', 1)) ~ '^(coordinator|manager|trainer|director|assistant|operations|associate|performance|equipment|player|athletic|communication|development|sports)[a-z0-9]'
  AND lower(
    regexp_replace(
      split_part(email, '@', 1),
      '^(coordinator|manager|trainer|director|assistant|operations|associate|performance|equipment|player|athletic|communication|development|sports)+',
      ''
    ) || '@' || split_part(email, '@', 2)
  ) <> lower(email);

-- ---------------------------------------------------------------------------
-- FIX: strip fused coach prefix on first.lastinitial handles when the school
--       already has non-coach-prefixed staff emails on the same domain
-- ---------------------------------------------------------------------------
UPDATE contacts c
SET
  email = lower(regexp_replace(split_part(c.email, '@', 1), '^coach', '') || '@' || split_part(c.email, '@', 2)),
  updated_at = NOW()
WHERE c.email IS NOT NULL
  AND lower(split_part(c.email, '@', 1)) ~ '^coach[a-z]+\.[a-z]$'
  AND EXISTS (
    SELECT 1
    FROM contacts c2
    WHERE c2.id <> c.id
      AND c2.email IS NOT NULL
      AND split_part(c2.email, '@', 2) = split_part(c.email, '@', 2)
      AND lower(split_part(c2.email, '@', 1)) !~ '^coach'
  )
  AND lower(regexp_replace(split_part(c.email, '@', 1), '^coach', '') || '@' || split_part(c.email, '@', 2)) <> lower(c.email);

-- ---------------------------------------------------------------------------
-- PREVIEW: duplicate contacts after email repair (same sport + email)
-- ---------------------------------------------------------------------------
SELECT
  c.sport_id,
  sch.school_name,
  c.email,
  array_agg(c.id ORDER BY length(c.coach_name) DESC, c.id) AS contact_ids,
  array_agg(c.coach_name ORDER BY length(c.coach_name) DESC, c.id) AS coach_names
FROM contacts c
JOIN sports sp ON sp.id = c.sport_id
JOIN schools sch ON sch.id = sp.school_id
WHERE c.email IS NOT NULL
GROUP BY c.sport_id, sch.school_name, c.email
HAVING count(*) > 1
ORDER BY sch.school_name, c.email;

-- ---------------------------------------------------------------------------
-- MERGE: Oklahoma State duplicate Shippy rows (keep fuller name)
-- Delete the short-name duplicate first — renaming it would violate unique constraint.
-- ---------------------------------------------------------------------------
DELETE FROM contacts
WHERE id = 1469
  AND email = 'vshippy@okstate.edu'
  AND coach_name = 'V. Shippy';

UPDATE contacts
SET title = 'Assistant Coach/Recruiting Coordinator', updated_at = NOW()
WHERE id = 1468
  AND coach_name = 'Vanessa Shippy-Fletcher'
  AND email = 'vshippy@okstate.edu'
  AND title = 'Assistant Coach';

-- ---------------------------------------------------------------------------
-- VERIFY: emails that still look like fused title artifacts (not legitimate coach@ inboxes)
-- ---------------------------------------------------------------------------
SELECT c.id, sch.school_name, c.coach_name, c.title, c.email
FROM contacts c
JOIN sports sp ON sp.id = c.sport_id
JOIN schools sch ON sch.id = sp.school_id
WHERE c.email IS NOT NULL
  AND (
    lower(c.email) LIKE 'coordinator%@%'
    OR lower(c.email) ~ '^coach[a-z]+\.[a-z]@'
  )
ORDER BY sch.school_name, c.coach_name;

-- ---------------------------------------------------------------------------
-- REFERENCE: after db/025, remaining coach-prefixed emails should be program inboxes only
-- (coachsoftball@, coachath-softball@) or non-.edu addresses needing manual review.
-- ---------------------------------------------------------------------------
