-- Sync with updated Texas_College_Softball_Athletic_Websites.md
-- TCU/Rice removed (club softball only). Dallas College split into 4 campuses.

-- Remove non-varsity / superseded programs
DELETE FROM schools
WHERE school_name IN ('TCU', 'Rice University', 'Dallas College');

-- St. Thomas (Houston) athletics site
UPDATE schools
SET athletics_url = 'https://ustcelts.com',
    aliases = ARRAY['UST', 'St. Thomas', 'St. Thomas Houston', 'Celts'],
    updated_at = NOW()
WHERE school_name = 'University of St. Thomas';

UPDATE schools
SET aliases = ARRAY['TAMUT', 'A&M-Texarkana', 'Texas A&M-Texarkana', 'Eagles'],
    updated_at = NOW()
WHERE school_name = 'Texas A&M University-Texarkana';

INSERT INTO schools (school_name, abbreviation, aliases, division, state, athletics_url) VALUES
    ('Dallas College Brookhaven', 'Brookhaven', ARRAY['Dallas College Brookhaven', 'Brookhaven', 'Bears'], 'JUCO', 'TX', 'https://www.brookhavenbears.com'),
    ('Dallas College Eastfield', 'Eastfield', ARRAY['Dallas College Eastfield', 'Eastfield', 'Bees'], 'JUCO', 'TX', 'https://www.eastfieldbees.com'),
    ('Dallas College North Lake', 'North Lake', ARRAY['Dallas College North Lake', 'North Lake', 'Blazers'], 'JUCO', 'TX', 'https://www.nlcblazers.com'),
    ('Dallas College Richland', 'Richland', ARRAY['Dallas College Richland', 'Richland', 'Thunderducks'], 'JUCO', 'TX', 'https://richlandthunderducks.com')
ON CONFLICT (school_name) DO UPDATE SET
    abbreviation = EXCLUDED.abbreviation,
    aliases = EXCLUDED.aliases,
    division = EXCLUDED.division,
    state = EXCLUDED.state,
    athletics_url = EXCLUDED.athletics_url,
    updated_at = NOW();
