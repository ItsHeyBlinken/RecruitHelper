-- Add D2 and D3 softball programs
-- Requires abbreviation/aliases columns from db/006_search_aliases.sql
-- Safe to re-run.

ALTER TABLE schools
    ADD COLUMN IF NOT EXISTS abbreviation VARCHAR(20);

ALTER TABLE schools
    ADD COLUMN IF NOT EXISTS aliases TEXT[] NOT NULL DEFAULT '{}';

INSERT INTO schools (school_name, abbreviation, aliases, division, state, athletics_url) VALUES
    -- D2 (15)
    ('University of Texas at Tyler', 'UT Tyler', ARRAY['UT Tyler', 'Patriots'], 'D2', 'TX', 'https://uttylerpatriots.com'),
    ('University of Tampa', 'Tampa', ARRAY['Tampa', 'UTampa', 'Spartans'], 'D2', 'FL', 'https://www.tampaspartans.com'),
    ('Western Washington University', 'WWU', ARRAY['WWU', 'Western Washington', 'Vikings'], 'D2', 'WA', 'https://wwuvikings.com'),
    ('Pace University', 'Pace', ARRAY['Pace', 'Setters'], 'D2', 'NY', 'https://paceuathletics.com'),
    ('University of Central Oklahoma', 'UCO', ARRAY['UCO', 'Central Oklahoma', 'Bronchos'], 'D2', 'OK', 'https://bronchosports.com'),
    ('Saginaw Valley State University', 'SVSU', ARRAY['SVSU', 'Saginaw Valley', 'Cardinals'], 'D2', 'MI', 'https://svsucardinals.com'),
    ('University of North Georgia', 'UNG', ARRAY['UNG', 'North Georgia', 'Nighthawks'], 'D2', 'GA', 'https://ungathletics.com'),
    ('Shippensburg University', 'Ship', ARRAY['Ship', 'Shippensburg', 'Raiders'], 'D2', 'PA', 'https://shipraiders.com'),
    ('West Texas A&M University', 'WT', ARRAY['WT', 'West Texas A&M', 'Buffs', 'Buffaloes'], 'D2', 'TX', 'https://gobuffsgo.com'),
    ('Francis Marion University', 'FMU', ARRAY['FMU', 'Francis Marion', 'Patriots'], 'D2', 'SC', 'https://fmupatriots.com'),
    ('Auburn University at Montgomery', 'AUM', ARRAY['AUM', 'Auburn Montgomery', 'Warhawks'], 'D2', 'AL', 'https://aumathletics.com'),
    ('Augustana University', 'Augie', ARRAY['Augie', 'Augustana', 'Vikings'], 'D2', 'SD', 'https://goaugie.com'),
    ('Angelo State University', 'Angelo State', ARRAY['Angelo State', 'Angelo', 'Rams'], 'D2', 'TX', 'https://angelosports.com'),
    ('Grand Valley State University', 'GVSU', ARRAY['GVSU', 'Grand Valley', 'Lakers'], 'D2', 'MI', 'https://gvsulakers.com'),
    ('Colorado Mesa University', 'CMU', ARRAY['CMU', 'Colorado Mesa', 'Mavericks'], 'D2', 'CO', 'https://cmumavericks.com'),
    -- D3 (15)
    ('Trine University', 'Trine', ARRAY['Trine', 'Thunder'], 'D3', 'IN', 'https://trinethunder.com'),
    ('Virginia Wesleyan University', 'VWU', ARRAY['VWU', 'Virginia Wesleyan', 'Marlins'], 'D3', 'VA', 'https://vwuathletics.com'),
    ('Salisbury University', 'Salisbury', ARRAY['Salisbury', 'SU', 'Sea Gulls'], 'D3', 'MD', 'https://suseagulls.com'),
    ('Texas Lutheran University', 'TLU', ARRAY['TLU', 'Texas Lutheran', 'Bulldogs'], 'D3', 'TX', 'https://tlubulldogs.com'),
    ('Messiah University', 'Messiah', ARRAY['Messiah', 'Falcons'], 'D3', 'PA', 'https://gomessiah.com'),
    ('University of Redlands', 'Redlands', ARRAY['Redlands', 'Bulldogs'], 'D3', 'CA', 'https://goredlands.com'),
    ('East Texas Baptist University', 'ETBU', ARRAY['ETBU', 'East Texas Baptist', 'Tigers'], 'D3', 'TX', 'https://www.etbuathletics.com'),
    ('Christopher Newport University', 'CNU', ARRAY['CNU', 'Christopher Newport', 'Captains'], 'D3', 'VA', 'https://cnusports.com'),
    ('Tufts University', 'Tufts', ARRAY['Tufts', 'Jumbos'], 'D3', 'MA', 'https://gotuftsjumbos.com'),
    ('Emory University', 'Emory', ARRAY['Emory', 'Eagles'], 'D3', 'GA', 'https://emoryathletics.com'),
    ('Luther College', 'Luther', ARRAY['Luther', 'Norse'], 'D3', 'IA', 'https://luthernorse.com'),
    ('University of Wisconsin-Whitewater', 'UWW', ARRAY['UWW', 'Whitewater', 'Warhawks'], 'D3', 'WI', 'https://www.uwwsports.com'),
    ('Williams College', 'Williams', ARRAY['Williams', 'Ephs'], 'D3', 'MA', 'https://ephsports.williams.edu'),
    ('St. John Fisher University', 'Fisher', ARRAY['Fisher', 'St. John Fisher', 'Cardinals'], 'D3', 'NY', 'https://sjfas.com'),
    ('SUNY Cortland', 'Cortland', ARRAY['Cortland', 'SUNY Cortland', 'Red Dragons'], 'D3', 'NY', 'https://cortlandreddragons.com')
ON CONFLICT (school_name) DO UPDATE SET
    abbreviation = EXCLUDED.abbreviation,
    aliases = EXCLUDED.aliases,
    division = EXCLUDED.division,
    state = EXCLUDED.state,
    athletics_url = EXCLUDED.athletics_url,
    updated_at = NOW();
