-- Follow-up to 019: remaining jumbled coach names.
-- Preserves real emails (including program inboxes). Safe to re-run.

-- ---------------------------------------------------------------------------
-- PREVIEW
-- ---------------------------------------------------------------------------
SELECT c.id, sch.school_name, c.coach_name, c.title, c.email
FROM contacts c
JOIN sports sp ON sp.id = c.sport_id
JOIN schools sch ON sch.id = sp.school_id
WHERE c.id IN (5478, 5339, 1469, 1744, 1750, 5444)
ORDER BY c.id;

-- ---------------------------------------------------------------------------
-- FIX: news headline → real coach (email is vann.stuedeman@utsa.edu)
-- ---------------------------------------------------------------------------
UPDATE contacts
SET coach_name = 'Vann Stuedeman', updated_at = NOW()
WHERE id = 5478
  AND coach_name = 'UTSA Softball Shatters Attendance Records'
  AND email = 'vann.stuedeman@utsa.edu';

-- ---------------------------------------------------------------------------
-- FIX: username scrapes → initials from email local (keep real emails)
-- ---------------------------------------------------------------------------
UPDATE contacts
SET coach_name = 'V. Shippy', updated_at = NOW()
WHERE id = 1469
  AND coach_name = 'Vshippy'
  AND email = 'vshippy@okstate.edu';

UPDATE contacts
SET coach_name = 'H. Tarr', updated_at = NOW()
WHERE id = 1744
  AND coach_name = 'Htarr'
  AND email = 'htarr@uw.edu';

UPDATE contacts
SET coach_name = 'L. Glasoe', updated_at = NOW()
WHERE id = 1750
  AND coach_name = 'Lglasoe'
  AND email = 'lglasoe@uw.edu';

-- ---------------------------------------------------------------------------
-- FIX: bare "Softball" label → program contact (keep samhoustonsb@ program email)
-- ---------------------------------------------------------------------------
UPDATE contacts
SET coach_name = 'Sam Houston Softball', updated_at = NOW()
WHERE id = 5339
  AND coach_name = 'Softball'
  AND email = 'samhoustonsb@shsu.edu';

-- ---------------------------------------------------------------------------
-- DELETE: institution branding + netid-only email (no recoverable person name)
-- Re-scrape Texas State when convenient.
-- ---------------------------------------------------------------------------
DELETE FROM contacts
WHERE id = 5444
  AND coach_name = 'Texas State Athletics'
  AND email = 'rw15@txstate.edu';

-- ---------------------------------------------------------------------------
-- VERIFY: should return zero rows
-- ---------------------------------------------------------------------------
SELECT c.id, sch.school_name, c.coach_name, c.email
FROM contacts c
JOIN sports sp ON sp.id = c.sport_id
JOIN schools sch ON sch.id = sp.school_id
WHERE sp.sport_name = 'softball'
  AND (
    c.coach_name IN (
      'UTSA Softball Shatters Attendance Records',
      'Softball',
      'Vshippy',
      'Htarr',
      'Lglasoe',
      'Texas State Athletics'
    )
    OR c.coach_name ~* 'shatters attendance'
    OR c.coach_name ~* 'adds .+ to coaching'
  )
ORDER BY sch.school_name, c.coach_name;
