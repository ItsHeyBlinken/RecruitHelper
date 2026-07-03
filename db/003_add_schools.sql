-- RecruitConnect - Add 20 more D1 softball schools
-- Run after 002_seed_schools.sql (safe to re-run)

INSERT INTO schools (school_name, division, state, athletics_url) VALUES
    ('University of South Carolina', 'D1', 'SC', 'https://gamecocksonline.com'),
    ('University of Missouri', 'D1', 'MO', 'https://mutigers.com'),
    ('Auburn University', 'D1', 'AL', 'https://auburntigers.com'),
    ('Mississippi State University', 'D1', 'MS', 'https://hailstate.com'),
    ('University of Kentucky', 'D1', 'KY', 'https://ukathletics.com'),
    ('University of Nebraska', 'D1', 'NE', 'https://huskers.com'),
    ('Northwestern University', 'D1', 'IL', 'https://nusports.com'),
    ('University of Minnesota', 'D1', 'MN', 'https://gophersports.com'),
    ('Purdue University', 'D1', 'IN', 'https://purduesports.com'),
    ('Indiana University', 'D1', 'IN', 'https://iuhoosiers.com'),
    ('University of Virginia', 'D1', 'VA', 'https://virginiasports.com'),
    ('Duke University', 'D1', 'NC', 'https://goduke.com'),
    ('Florida State University', 'D1', 'FL', 'https://seminoles.com'),
    ('Clemson University', 'D1', 'SC', 'https://clemsontigers.com'),
    ('Stanford University', 'D1', 'CA', 'https://gostanford.com'),
    ('University of Notre Dame', 'D1', 'IN', 'https://fightingirish.com'),
    ('Baylor University', 'D1', 'TX', 'https://baylorbears.com'),
    ('Oklahoma State University', 'D1', 'OK', 'https://okstate.com'),
    ('University of Utah', 'D1', 'UT', 'https://utahutes.com'),
    ('Arizona State University', 'D1', 'AZ', 'https://thesundevils.com')
ON CONFLICT (school_name) DO NOTHING;
