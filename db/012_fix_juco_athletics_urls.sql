-- Fix athletics URLs that point at college main sites instead of real athletics CMS.
-- Pattern: Howard College (hchawk.com), Navarro (navarrobulldogs.com), etc.
-- Apply in pgAdmin, then re-scrape affected schools.

UPDATE schools SET athletics_url = 'https://www.tcleopards.com', updated_at = NOW()
WHERE school_name = 'Temple College';

UPDATE schools SET athletics_url = 'https://www.gochapsports.com', updated_at = NOW()
WHERE school_name = 'Vernon College';

UPDATE schools SET athletics_url = 'https://www.wranglersports.net', updated_at = NOW()
WHERE school_name = 'Cisco College';

UPDATE schools SET athletics_url = 'https://www.wtcathletics.com', updated_at = NOW()
WHERE school_name = 'Western Texas College';

UPDATE schools SET athletics_url = 'https://kcrangernation.com', updated_at = NOW()
WHERE school_name = 'Kilgore College';

UPDATE schools SET athletics_url = 'https://www.clarendonbulldogs.com', updated_at = NOW()
WHERE school_name = 'Clarendon College';

UPDATE schools SET athletics_url = 'https://www.hchawk.com', updated_at = NOW()
WHERE school_name = 'Howard College';

UPDATE schools SET athletics_url = 'https://navarrobulldogs.com', updated_at = NOW()
WHERE school_name = 'Navarro College';

-- Dallas College: Brookhaven has a softball field but no intercollegiate softball team
-- per Dallas College catalog (baseball, basketball, soccer, volleyball only).
-- Review whether to remove from seed or keep for future program.

-- Preview schools still using suspicious .edu/athletics URLs:
SELECT school_name, division, state, athletics_url
FROM schools
WHERE athletics_url ~* '\.edu/athletics/?$' OR athletics_url ~* '\.edu/?$'
ORDER BY state, division, school_name;
