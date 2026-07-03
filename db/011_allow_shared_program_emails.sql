-- Allow multiple coaches at the same school to share a program email
-- (e.g. softball@navarrocollege.edu for head + assistants).
-- Apply in pgAdmin before re-scraping schools like Navarro College.

DROP INDEX IF EXISTS idx_contacts_sport_email_unique;

-- Optional: verify Navarro-style shared emails can coexist
-- SELECT coach_name, title, email
-- FROM contacts c
-- JOIN sports sp ON sp.id = c.sport_id
-- JOIN schools sch ON sch.id = sp.school_id
-- WHERE sch.school_name = 'Navarro College' AND sp.sport_name = 'softball';
