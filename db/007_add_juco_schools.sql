-- Add JUCO softball programs (NJCAA)
-- Requires abbreviation/aliases columns from db/006_search_aliases.sql
-- Safe to re-run.

ALTER TABLE schools
    ADD COLUMN IF NOT EXISTS abbreviation VARCHAR(20);

ALTER TABLE schools
    ADD COLUMN IF NOT EXISTS aliases TEXT[] NOT NULL DEFAULT '{}';

INSERT INTO schools (school_name, abbreviation, aliases, division, state, athletics_url) VALUES
    ('Chipola College', 'Chipola', ARRAY['Chipola', 'Lady Indians', 'Indians'], 'JUCO', 'FL', 'https://chipolaathletics.com'),
    ('Wallace State Community College', 'Wallace State', ARRAY['Wallace State', 'WSCC', 'Lions'], 'JUCO', 'AL', 'https://athletics.wallacestate.edu'),
    ('Odessa College', 'Odessa', ARRAY['Odessa', 'OC', 'Wranglers'], 'JUCO', 'TX', 'https://www.wranglersports.com'),
    ('Tyler Junior College', 'TJC', ARRAY['TJC', 'Tyler Junior', 'Apaches'], 'JUCO', 'TX', 'https://www.apacheathletics.com'),
    ('Eastern Arizona College', 'EAC', ARRAY['EAC', 'Eastern Arizona', 'Monsters'], 'JUCO', 'AZ', 'https://www.eacmonsters.com'),
    ('Iowa Western Community College', 'IWCC', ARRAY['IWCC', 'Iowa Western', 'Reivers'], 'JUCO', 'IA', 'https://www.goreivers.com'),
    ('Seminole State College', 'SSC', ARRAY['SSC', 'Seminole State', 'Trojans'], 'JUCO', 'OK', 'https://sscathletics.com'),
    ('Central Arizona College', 'CAC', ARRAY['CAC', 'Central Arizona', 'Vaqueros'], 'JUCO', 'AZ', 'https://www.centralaz.edu/athletics'),
    ('Butler Community College', 'Butler CC', ARRAY['Butler CC', 'Butler', 'Grizzlies'], 'JUCO', 'KS', 'https://www.butlergrizzlies.com'),
    ('McLennan Community College', 'McLennan', ARRAY['McLennan', 'MCC', 'Highlanders'], 'JUCO', 'TX', 'https://www.mclennanathletics.com'),
    ('Tallahassee State College', 'TCC', ARRAY['TCC', 'Tallahassee State', 'Eagles'], 'JUCO', 'FL', 'https://www.tccathletics.com'),
    ('Crowder College', 'Crowder', ARRAY['Crowder', 'Roughriders'], 'JUCO', 'MO', 'https://www.crowderathletics.com'),
    ('Northwest Florida State College', 'NWFSC', ARRAY['NWFSC', 'Northwest Florida', 'Raiders'], 'JUCO', 'FL', 'https://www.raiderathletics.com'),
    ('Grayson College', 'Grayson', ARRAY['Grayson', 'Vikings'], 'JUCO', 'TX', 'https://gcathletics.com'),
    ('Gadsden State Community College', 'Gadsden State', ARRAY['Gadsden State', 'Cardinals'], 'JUCO', 'AL', 'https://www.gadsdenstate.edu/athletics')
ON CONFLICT (school_name) DO UPDATE SET
    abbreviation = EXCLUDED.abbreviation,
    aliases = EXCLUDED.aliases,
    division = EXCLUDED.division,
    state = EXCLUDED.state,
    athletics_url = EXCLUDED.athletics_url,
    updated_at = NOW();
