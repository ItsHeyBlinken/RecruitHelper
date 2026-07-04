-- Clean jumbled / non-person contact rows from bad scrapes.
-- Keeps real program emails (softball@..., coachath-softball@...).
-- Safe to re-run. Review PREVIEW sections before running DELETE/UPDATE.

-- ---------------------------------------------------------------------------
-- PREVIEW: rows that will be deleted (not real people / duplicates of real coaches)
-- ---------------------------------------------------------------------------
SELECT c.id, sch.school_name, c.coach_name, c.title, c.email, c.phone
FROM contacts c
JOIN sports sp ON sp.id = c.sport_id
JOIN schools sch ON sch.id = sp.school_id
WHERE c.id IN (
  -- Texas A&M: news headlines + Sentry tracking emails
  5376, 5377, 5378, 5380, 5381,
  -- Garbage / non-person names
  5349,  -- PROGRAM ACCOLADES UNDER MIZE (LeTourneau; keep fixed Macey Mize row)
  5352,  -- Jacksonjb8 (keep Jeff Jackson 5353)
  5368,  -- Carlie Tibbetts — Communications GA, not coaching
  1626,  -- University of North Georgia Athletics (no email)
  -- Institution-as-name duplicates of a real coach with the same email
  5457,  -- NTCC Athletics (keep Taniece Tyson 5458)
  5385,  -- UT Tyler Athletics (keep Whitney Wyly 5386)
  5318,  -- Nelson University (keep Watty Watson 5319)
  5442,  -- "Navarro College" (keep Wesley Tunnell 5443 + program email)
  5455   -- "University of Dallas" volunteer label (not a person)
)
ORDER BY sch.school_name, c.coach_name;

-- ---------------------------------------------------------------------------
-- DELETE jumbled / non-person rows
-- ---------------------------------------------------------------------------
DELETE FROM contacts
WHERE id IN (
  5376, 5377, 5378, 5380, 5381,
  5349, 5352, 5368, 1626,
  5457, 5385, 5318, 5442, 5455
);

-- ---------------------------------------------------------------------------
-- PREVIEW: institution-as-name rows that will be renamed from email
-- ---------------------------------------------------------------------------
SELECT c.id, sch.school_name, c.coach_name, c.email
FROM contacts c
JOIN sports sp ON sp.id = c.sport_id
JOIN schools sch ON sch.id = sp.school_id
WHERE c.id IN (
  5322, 5379, 5323, 5347, 5360, 5324, 5348, 5387, 5439, 5467,
  5444, 5394, 5481, 5325, 5315, 5343, 5350, 5366, 5400, 5328,
  5351, 5404, 5321, 5346
)
ORDER BY sch.school_name;

-- ---------------------------------------------------------------------------
-- FIX coach names that were scraped as school/athletics branding
-- ---------------------------------------------------------------------------
UPDATE contacts SET coach_name = 'Daren Hays', updated_at = NOW()
WHERE id = 5322 AND email = 'daren.hays@lcu.edu';

UPDATE contacts SET coach_name = 'R. Wilson', updated_at = NOW()
WHERE id = 5379 AND email = 'rwilson@tlu.edu';

UPDATE contacts SET coach_name = 'Kaelani Bryan', updated_at = NOW()
WHERE id = 5323 AND email = 'kaelani.bryan@msutexas.edu';

UPDATE contacts SET coach_name = 'Scott Libby', updated_at = NOW()
WHERE id = 5347 AND email = 'scott.libby@tamiu.edu';

UPDATE contacts SET coach_name = 'R. McNutt', updated_at = NOW()
WHERE id = 5360 AND email = 'rmcnutt@twu.edu';

UPDATE contacts SET coach_name = 'Jeff Staton', updated_at = NOW()
WHERE id = 5324 AND email = 'jeff.staton@concordia.edu';

UPDATE contacts SET coach_name = 'Macey Mize', updated_at = NOW()
WHERE id = 5348 AND email = 'maceymize@letu.edu';

UPDATE contacts SET coach_name = 'B. Wittena', updated_at = NOW()
WHERE id = 5387 AND email = 'bwittena@trinity.edu';

UPDATE contacts SET coach_name = 'Casey Dickson', updated_at = NOW()
WHERE id = 5439 AND email = 'casey.dickson@utdallas.edu';

UPDATE contacts SET coach_name = 'Kara Dill', updated_at = NOW()
WHERE id = 5467 AND email = 'kara.dill@uta.edu';

UPDATE contacts SET coach_name = 'M. Mook', updated_at = NOW()
WHERE id = 5394 AND email = 'mmook@wtamu.edu';

UPDATE contacts SET coach_name = 'K. Idean', updated_at = NOW()
WHERE id = 5481 AND email = 'kidean@uiwtx.edu';

UPDATE contacts SET coach_name = 'V. Bland', updated_at = NOW()
WHERE id = 5325 AND email = 'vlbland@pvamu.edu';

UPDATE contacts SET coach_name = 'M. Hall', updated_at = NOW()
WHERE id = 5315 AND email = 'mhall@hc.edu';

UPDATE contacts SET coach_name = 'J. Shirley', updated_at = NOW()
WHERE id = 5343 AND email = 'jshirley@etbu.edu';

UPDATE contacts SET coach_name = 'Orlando Salinas', updated_at = NOW()
WHERE id = 5350 AND email = 'orlando.salinas@tamuk.edu';

UPDATE contacts SET coach_name = 'Lacey Middlebrooks', updated_at = NOW()
WHERE id = 5366 AND email = 'lacey.middlebrooks@sulross.edu';

UPDATE contacts SET coach_name = 'M. Mojica', updated_at = NOW()
WHERE id = 5400 AND email = 'mmojica@umhb.edu';

UPDATE contacts SET coach_name = 'S. Janda', updated_at = NOW()
WHERE id = 5328 AND email = 'sjanda@stedwards.edu';

UPDATE contacts SET coach_name = 'David McNally', updated_at = NOW()
WHERE id = 5351 AND email = 'mcnally.david@mcm.edu';

UPDATE contacts SET coach_name = 'F. Roboea', updated_at = NOW()
WHERE id = 5404 AND email = 'froboea@stthom.edu';

UPDATE contacts SET coach_name = 'A. Hooks', updated_at = NOW()
WHERE id = 5321 AND email = 'ahooks6@lamar.edu';

UPDATE contacts SET coach_name = 'C. Petroski', updated_at = NOW()
WHERE id = 5346 AND email = 'cpetroski@usw.edu';

-- Texas State: netid email only (rw15@txstate.edu) — name unknown; clear bogus phone.
-- Re-scrape Texas State when convenient to get the real coach name.
UPDATE contacts SET phone = NULL, updated_at = NOW()
WHERE id = 5444 AND email = 'rw15@txstate.edu';

-- ---------------------------------------------------------------------------
-- FIX mangled email: hunter@unt.eduhttps → hunter@unt.edu
-- ---------------------------------------------------------------------------
UPDATE contacts
SET email = 'hunter@unt.edu', updated_at = NOW()
WHERE id = 5464 AND email = 'hunter@unt.eduhttps';

-- Any other emails with http/https glued on
UPDATE contacts
SET email = regexp_replace(email, 'https?$', '', 'i'),
    updated_at = NOW()
WHERE email ~* 'https?$';

-- ---------------------------------------------------------------------------
-- CLEAR bad phones (leading-zero area codes / all zeros)
-- ---------------------------------------------------------------------------
UPDATE contacts
SET phone = NULL, updated_at = NOW()
WHERE phone IS NOT NULL
  AND (
    phone ~ '^\(0[0-9]{2}\)'
    OR phone = '(000) 000-0000'
  );

-- ---------------------------------------------------------------------------
-- VERIFY: remaining institution-like names (should be empty or only intentional)
-- ---------------------------------------------------------------------------
SELECT c.id, sch.school_name, c.coach_name, c.email
FROM contacts c
JOIN sports sp ON sp.id = c.sport_id
JOIN schools sch ON sch.id = sp.school_id
WHERE sp.sport_name = 'softball'
  AND (
    c.coach_name ~* '(university|college|athletics)$'
    OR c.coach_name ~* 'adds .+ to coaching'
    OR c.coach_name ~* 'program accolades'
    OR c.email ~* 'sentry\.'
    OR c.email ~* 'https?$'
  )
ORDER BY sch.school_name, c.coach_name;
