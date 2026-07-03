-- Add 27 Texas softball programs from Texas_College_Softball_Athletic_Websites.md
-- Safe to re-run. Apply before bulk scrape.

INSERT INTO schools (school_name, abbreviation, aliases, division, state, athletics_url) VALUES
    ('Houston Christian University', 'HCU', ARRAY['HCU', 'Houston Christian', 'Huskies'], 'D1', 'TX', 'https://hcuhuskies.com'),
    ('Lamar University', 'Lamar', ARRAY['Lamar', 'Cardinals', 'LU'], 'D1', 'TX', 'https://lamarcardinals.com'),
    ('Prairie View A&M University', 'PVAMU', ARRAY['PVAMU', 'Prairie View', 'Panthers'], 'D1', 'TX', 'https://pvpanthers.com'),
    ('Stephen F. Austin State University', 'SFA', ARRAY['SFA', 'Stephen F. Austin', 'Lumberjacks'], 'D1', 'TX', 'https://sfajacks.com'),
    ('Tarleton State University', 'Tarleton', ARRAY['Tarleton', 'Texans'], 'D1', 'TX', 'https://tarletonsports.com'),
    ('Texas A&M University-Commerce', 'TAMUC', ARRAY['TAMUC', 'A&M-Commerce', 'Lions', 'East Texas A&M'], 'D1', 'TX', 'https://lionathletics.com'),
    ('Texas A&M University-Corpus Christi', 'TAMUCC', ARRAY['TAMUCC', 'A&M-Corpus Christi', 'Islanders'], 'D1', 'TX', 'https://goislanders.com'),
    ('Midwestern State University', 'MSU Texas', ARRAY['MSU Texas', 'Midwestern State', 'Mustangs'], 'D2', 'TX', 'https://msumustangs.com'),
    ('Sul Ross State University', 'Sul Ross', ARRAY['Sul Ross', 'SRSU', 'Lobos'], 'D3', 'TX', 'https://srlobos.com'),
    ('Alvin Community College', 'Alvin', ARRAY['Alvin', 'Alvin College', 'Dolphins'], 'JUCO', 'TX', 'https://www.alvincollege.edu/athletics/softball.html'),
    ('Angelina College', 'Angelina', ARRAY['Angelina', 'Roadrunners'], 'JUCO', 'TX', 'https://angelinaathletics.com'),
    ('Coastal Bend College', 'CBC', ARRAY['CBC', 'Coastal Bend', 'Cougars'], 'JUCO', 'TX', 'https://cbcathletics.com'),
    ('Galveston College', 'Galveston', ARRAY['Galveston College', 'Whitecaps'], 'JUCO', 'TX', 'https://gc.edu/athletics'),
    ('Laredo College', 'Laredo', ARRAY['Laredo College', 'Palominos'], 'JUCO', 'TX', 'https://laredo.edu/athletics'),
    ('Northeast Texas Community College', 'NETCC', ARRAY['NETCC', 'Northeast Texas', 'Eagles', 'NTCC'], 'JUCO', 'TX', 'https://ntcceagles.com'),
    ('South Plains College', 'SPC', ARRAY['SPC', 'South Plains', 'Texans'], 'JUCO', 'TX', 'https://spctexans.com'),
    ('Southwest Texas Junior College', 'SWTJC', ARRAY['SWTJC', 'Southwest Texas Junior College'], 'JUCO', 'TX', 'https://swtjc.edu/athletics'),
    ('Texarkana College', 'Texarkana', ARRAY['Texarkana College', 'Bulldogs'], 'JUCO', 'TX', 'https://texarkanacollege.edu/athletics'),
    ('University of Houston-Victoria', 'UHV', ARRAY['UHV', 'Houston-Victoria', 'Jaguars'], 'NAIA', 'TX', 'https://uhvjaguars.com'),
    ('Jarvis Christian University', 'Jarvis', ARRAY['Jarvis Christian', 'JC', 'Bulldogs'], 'NAIA', 'TX', 'https://jarvisathletics.com'),
    ('Nelson University', 'Nelson', ARRAY['Nelson', 'Lions'], 'NAIA', 'TX', 'https://nelsonlions.com'),
    ('Our Lady of the Lake University', 'OLLU', ARRAY['OLLU', 'Our Lady of the Lake', 'Saints'], 'NAIA', 'TX', 'https://ollusaintsathletics.com'),
    ('Texas A&M University-Texarkana', 'TAMUT', ARRAY['TAMUT', 'A&M-Texarkana', 'Eagles'], 'NAIA', 'TX', 'https://tamuteagles.com'),
    ('Texas College', 'Texas College', ARRAY['Texas College', 'Steers'], 'NAIA', 'TX', 'https://texascollege.edu/athletics'),
    ('Texas Wesleyan University', 'TXWES', ARRAY['TXWES', 'Texas Wesleyan', 'Rams'], 'NAIA', 'TX', 'https://txwesathletics.com'),
    ('University of the Southwest', 'USW', ARRAY['USW', 'Southwest', 'Mustangs'], 'NAIA', 'TX', 'https://uswathletics.com'),
    ('Wayland Baptist University', 'Wayland', ARRAY['Wayland Baptist', 'WBU', 'Pioneers'], 'NAIA', 'TX', 'https://wbuathletics.com')
ON CONFLICT (school_name) DO UPDATE SET
    abbreviation = EXCLUDED.abbreviation,
    aliases = EXCLUDED.aliases,
    division = EXCLUDED.division,
    state = EXCLUDED.state,
    athletics_url = EXCLUDED.athletics_url,
    updated_at = NOW();

-- Added 27 schools (0 already in seed).
