-- RecruitConnect MVP - Seed Schools (softball programs)
-- Run after 001_init.sql

INSERT INTO schools (school_name, division, state, athletics_url) VALUES
    ('University of Alabama', 'D1', 'AL', 'https://rolltide.com'),
    ('University of Oklahoma', 'D1', 'OK', 'https://soonersports.com'),
    ('University of Florida', 'D1', 'FL', 'https://floridagators.com'),
    ('University of Texas', 'D1', 'TX', 'https://texassports.com'),
    ('Louisiana State University', 'D1', 'LA', 'https://lsusports.net'),
    ('University of Tennessee', 'D1', 'TN', 'https://utsports.com'),
    ('University of Georgia', 'D1', 'GA', 'https://georgiadogs.com'),
    ('University of Arkansas', 'D1', 'AR', 'https://arkansasrazorbacks.com'),
    ('University of Arizona', 'D1', 'AZ', 'https://arizonawildcats.com'),
    ('University of Washington', 'D1', 'WA', 'https://gohuskies.com'),
    ('UCLA', 'D1', 'CA', 'https://uclabruins.com'),
    ('University of Michigan', 'D1', 'MI', 'https://mgoblue.com'),
    ('Ohio State University', 'D1', 'OH', 'https://ohiostatebuckeyes.com'),
    ('University of Oregon', 'D1', 'OR', 'https://goducks.com'),
    ('Texas A&M University', 'D1', 'TX', 'https://12thman.com')
ON CONFLICT (school_name) DO NOTHING;
