-- Add Arkansas & Louisiana JUCO + NAIA softball programs.
-- Regional expansion: smaller schools first. Safe to re-run.
-- Apply in pgAdmin, then: npm run scrape:ar-la

INSERT INTO schools (school_name, abbreviation, aliases, division, state, athletics_url) VALUES
    ('Arkansas State University Mid-South', 'ASU Mid-South', ARRAY['ASU Mid-South', 'Mid-South', 'Greyhounds'], 'JUCO', 'AR', 'https://www.asumidsouthsports.com'),
    ('Arkansas State University Mountain Home', 'ASUMH', ARRAY['ASUMH', 'ASU Mountain Home', 'Mountain Home', 'TrailBlazers'], 'JUCO', 'AR', 'https://www.asumhathletics.com'),
    ('Arkansas State University Three Rivers', 'ASUTR', ARRAY['ASUTR', 'ASU Three Rivers', 'Three Rivers', 'Kickers'], 'JUCO', 'AR', 'https://www.asutr.edu/o/athletics'),
    ('National Park College', 'NPC', ARRAY['NPC', 'National Park', 'Nighthawks'], 'JUCO', 'AR', 'https://np.edu/student-life-services/athletics/softball/'),
    ('North Arkansas College', 'Northark', ARRAY['Northark', 'North Arkansas', 'Pioneers'], 'JUCO', 'AR', 'https://www.northark.edu/athletics/softball/'),
    ('Southeast Arkansas College', 'SEARK', ARRAY['SEARK', 'Southeast Arkansas', 'Sharks'], 'JUCO', 'AR', 'https://searksharks.com'),
    ('Southern Arkansas University Tech', 'SAU Tech', ARRAY['SAU Tech', 'Southern Arkansas Tech', 'Rockets'], 'JUCO', 'AR', 'https://sautrockets.com'),
    ('University of Arkansas Rich Mountain', 'UA Rich Mountain', ARRAY['UA Rich Mountain', 'UARM', 'Rich Mountain', 'Bucks'], 'JUCO', 'AR', 'https://bucksathletics.com'),
    ('Central Baptist College', 'CBC', ARRAY['CBC', 'Central Baptist', 'Mustangs'], 'NAIA', 'AR', 'https://cbcmustangs.com'),
    ('Crowley''s Ridge College', 'CRC', ARRAY['CRC', 'Crowley''s Ridge', 'Pioneers'], 'NAIA', 'AR', 'https://www.crcpioneers.com'),
    ('Williams Baptist University', 'WBU', ARRAY['WBU', 'Williams Baptist', 'Eagles'], 'NAIA', 'AR', 'https://wbueagles.com'),
    ('Baton Rouge Community College', 'BRCC', ARRAY['BRCC', 'Baton Rouge CC', 'Bears', 'Lady Bears'], 'JUCO', 'LA', 'https://brccathletics.com'),
    ('Bossier Parish Community College', 'BPCC', ARRAY['BPCC', 'Bossier Parish', 'Cavaliers', 'Lady Cavaliers'], 'JUCO', 'LA', 'https://bpcc.prestosports.com/sports/sball/coaches/index'),
    ('Louisiana State University Eunice', 'LSUE', ARRAY['LSUE', 'LSU Eunice', 'Lady Bengals'], 'JUCO', 'LA', 'https://athletics.lsue.edu'),
    ('Louisiana Christian University', 'LCU', ARRAY['LCU', 'Louisiana Christian', 'Wildcats'], 'NAIA', 'LA', 'https://www.lcwildcats.net'),
    ('Louisiana State University at Alexandria', 'LSUA', ARRAY['LSUA', 'LSU Alexandria', 'LSU-A', 'Generals'], 'NAIA', 'LA', 'https://lsuagenerals.com'),
    ('Xavier University of Louisiana', 'XULA', ARRAY['XULA', 'Xavier Louisiana', 'Xavier', 'Gold Rush'], 'NAIA', 'LA', 'https://xulagold.com')
ON CONFLICT (school_name) DO UPDATE SET
    abbreviation = EXCLUDED.abbreviation,
    aliases = EXCLUDED.aliases,
    division = EXCLUDED.division,
    state = EXCLUDED.state,
    athletics_url = EXCLUDED.athletics_url,
    updated_at = NOW();

-- Added 17 schools (0 already in seed).
-- Totals: AR JUCO 8, AR NAIA 3, LA JUCO 3, LA NAIA 3 (17).
-- Excluded: ASU-Newport (softball discontinued 2026-07-01), Loyola NOLA (no varsity softball).
