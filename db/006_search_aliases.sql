-- Known recruiting abbreviations and alternate search terms (UofA, OSU, Mizzou, etc.)
-- Apply in pgAdmin after db/005_add_school_abbreviations.sql (or instead of it if 005 not run yet).

ALTER TABLE schools
    ADD COLUMN IF NOT EXISTS abbreviation VARCHAR(20);

ALTER TABLE schools
    ADD COLUMN IF NOT EXISTS aliases TEXT[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_schools_aliases_gin
    ON schools USING GIN (aliases);

UPDATE schools SET abbreviation = 'Bama', aliases = ARRAY['Bama', 'Alabama', 'UA', 'ALA', 'Roll Tide'] WHERE school_name = 'University of Alabama';
UPDATE schools SET abbreviation = 'OU', aliases = ARRAY['OU', 'Oklahoma', 'Sooners'] WHERE school_name = 'University of Oklahoma';
UPDATE schools SET abbreviation = 'UF', aliases = ARRAY['UF', 'Florida', 'Gators'] WHERE school_name = 'University of Florida';
UPDATE schools SET abbreviation = 'UT', aliases = ARRAY['UT', 'Texas', 'Longhorns', 'UT Austin'] WHERE school_name = 'University of Texas';
UPDATE schools SET abbreviation = 'LSU', aliases = ARRAY['LSU', 'Louisiana State', 'Tigers'] WHERE school_name = 'Louisiana State University';
UPDATE schools SET abbreviation = 'UT', aliases = ARRAY['UT', 'UTK', 'Tennessee', 'Vols', 'Volunteers'] WHERE school_name = 'University of Tennessee';
UPDATE schools SET abbreviation = 'UGA', aliases = ARRAY['UGA', 'Georgia', 'Dawgs', 'Bulldogs'] WHERE school_name = 'University of Georgia';
UPDATE schools SET abbreviation = 'Arkansas', aliases = ARRAY['Arkansas', 'UA', 'UARK', 'Hogs', 'Razorbacks'] WHERE school_name = 'University of Arkansas';
UPDATE schools SET abbreviation = 'UofA', aliases = ARRAY['UofA', 'U of A', 'Arizona', 'UA', 'Wildcats'] WHERE school_name = 'University of Arizona';
UPDATE schools SET abbreviation = 'UW', aliases = ARRAY['UW', 'Washington', 'Huskies', 'U-Dub'] WHERE school_name = 'University of Washington';
UPDATE schools SET abbreviation = 'UCLA', aliases = ARRAY['UCLA', 'Bruins'] WHERE school_name = 'UCLA';
UPDATE schools SET abbreviation = 'Michigan', aliases = ARRAY['Michigan', 'UM', 'MICH', 'UMich', 'Wolverines'] WHERE school_name = 'University of Michigan';
UPDATE schools SET abbreviation = 'OSU', aliases = ARRAY['OSU', 'Ohio State', 'tOSU', 'Buckeyes'] WHERE school_name = 'Ohio State University';
UPDATE schools SET abbreviation = 'Oregon', aliases = ARRAY['Oregon', 'UO', 'ORE', 'Ducks'] WHERE school_name = 'University of Oregon';
UPDATE schools SET abbreviation = 'A&M', aliases = ARRAY['A&M', 'TAMU', 'Texas A&M', 'Aggies'] WHERE school_name = 'Texas A&M University';
UPDATE schools SET abbreviation = 'SC', aliases = ARRAY['SC', 'UofSC', 'South Carolina', 'Gamecocks'] WHERE school_name = 'University of South Carolina';
UPDATE schools SET abbreviation = 'Mizzou', aliases = ARRAY['Mizzou', 'MIZ', 'Missouri', 'MU', 'Tigers'] WHERE school_name = 'University of Missouri';
UPDATE schools SET abbreviation = 'Auburn', aliases = ARRAY['Auburn', 'AU', 'Tigers'] WHERE school_name = 'Auburn University';
UPDATE schools SET abbreviation = 'MSU', aliases = ARRAY['MSU', 'MSST', 'Mississippi State', 'State', 'Bulldogs'] WHERE school_name = 'Mississippi State University';
UPDATE schools SET abbreviation = 'UK', aliases = ARRAY['UK', 'Kentucky', 'Wildcats'] WHERE school_name = 'University of Kentucky';
UPDATE schools SET abbreviation = 'Nebraska', aliases = ARRAY['Nebraska', 'NU', 'NEB', 'Huskers'] WHERE school_name = 'University of Nebraska';
UPDATE schools SET abbreviation = 'NU', aliases = ARRAY['NU', 'Northwestern', 'Wildcats'] WHERE school_name = 'Northwestern University';
UPDATE schools SET abbreviation = 'Minnesota', aliases = ARRAY['Minnesota', 'UMN', 'MINN', 'Gophers'] WHERE school_name = 'University of Minnesota';
UPDATE schools SET abbreviation = 'Purdue', aliases = ARRAY['Purdue', 'PUR', 'Boilermakers'] WHERE school_name = 'Purdue University';
UPDATE schools SET abbreviation = 'IU', aliases = ARRAY['IU', 'Indiana', 'Hoosiers'] WHERE school_name = 'Indiana University';
UPDATE schools SET abbreviation = 'UVA', aliases = ARRAY['UVA', 'Virginia', 'Cavaliers', 'Wahoos'] WHERE school_name = 'University of Virginia';
UPDATE schools SET abbreviation = 'Duke', aliases = ARRAY['Duke', 'Blue Devils'] WHERE school_name = 'Duke University';
UPDATE schools SET abbreviation = 'FSU', aliases = ARRAY['FSU', 'Florida State', 'Seminoles', 'Noles'] WHERE school_name = 'Florida State University';
UPDATE schools SET abbreviation = 'Clemson', aliases = ARRAY['Clemson', 'CLEM', 'Tigers'] WHERE school_name = 'Clemson University';
UPDATE schools SET abbreviation = 'Stanford', aliases = ARRAY['Stanford', 'STAN', 'Cardinal'] WHERE school_name = 'Stanford University';
UPDATE schools SET abbreviation = 'ND', aliases = ARRAY['ND', 'Notre Dame', 'Fighting Irish', 'Irish'] WHERE school_name = 'University of Notre Dame';
UPDATE schools SET abbreviation = 'Baylor', aliases = ARRAY['Baylor', 'BAY', 'Bears'] WHERE school_name = 'Baylor University';
UPDATE schools SET abbreviation = 'OKST', aliases = ARRAY['OKST', 'OSU', 'Oklahoma State', 'Cowboys', 'Pokes'] WHERE school_name = 'Oklahoma State University';
UPDATE schools SET abbreviation = 'Utah', aliases = ARRAY['Utah', 'UTAH', 'Utes'] WHERE school_name = 'University of Utah';
UPDATE schools SET abbreviation = 'ASU', aliases = ARRAY['ASU', 'Arizona State', 'Sun Devils'] WHERE school_name = 'Arizona State University';
