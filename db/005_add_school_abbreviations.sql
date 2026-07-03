-- Add school abbreviations for search (e.g. LSU -> Louisiana State University)
-- Apply in pgAdmin after prior migrations.

ALTER TABLE schools
    ADD COLUMN IF NOT EXISTS abbreviation VARCHAR(20);

CREATE INDEX IF NOT EXISTS idx_schools_abbreviation_trgm
    ON schools USING GIN (LOWER(COALESCE(abbreviation, '')) gin_trgm_ops);

UPDATE schools SET abbreviation = 'ALA' WHERE school_name = 'University of Alabama';
UPDATE schools SET abbreviation = 'OU' WHERE school_name = 'University of Oklahoma';
UPDATE schools SET abbreviation = 'UF' WHERE school_name = 'University of Florida';
UPDATE schools SET abbreviation = 'UT' WHERE school_name = 'University of Texas';
UPDATE schools SET abbreviation = 'LSU' WHERE school_name = 'Louisiana State University';
UPDATE schools SET abbreviation = 'UTK' WHERE school_name = 'University of Tennessee';
UPDATE schools SET abbreviation = 'UGA' WHERE school_name = 'University of Georgia';
UPDATE schools SET abbreviation = 'ARK' WHERE school_name = 'University of Arkansas';
UPDATE schools SET abbreviation = 'ARIZ' WHERE school_name = 'University of Arizona';
UPDATE schools SET abbreviation = 'UW' WHERE school_name = 'University of Washington';
UPDATE schools SET abbreviation = 'UCLA' WHERE school_name = 'UCLA';
UPDATE schools SET abbreviation = 'MICH' WHERE school_name = 'University of Michigan';
UPDATE schools SET abbreviation = 'OSU' WHERE school_name = 'Ohio State University';
UPDATE schools SET abbreviation = 'ORE' WHERE school_name = 'University of Oregon';
UPDATE schools SET abbreviation = 'TAMU' WHERE school_name = 'Texas A&M University';
UPDATE schools SET abbreviation = 'SC' WHERE school_name = 'University of South Carolina';
UPDATE schools SET abbreviation = 'MIZZ' WHERE school_name = 'University of Missouri';
UPDATE schools SET abbreviation = 'AUB' WHERE school_name = 'Auburn University';
UPDATE schools SET abbreviation = 'MSST' WHERE school_name = 'Mississippi State University';
UPDATE schools SET abbreviation = 'UK' WHERE school_name = 'University of Kentucky';
UPDATE schools SET abbreviation = 'NEB' WHERE school_name = 'University of Nebraska';
UPDATE schools SET abbreviation = 'NU' WHERE school_name = 'Northwestern University';
UPDATE schools SET abbreviation = 'MINN' WHERE school_name = 'University of Minnesota';
UPDATE schools SET abbreviation = 'PUR' WHERE school_name = 'Purdue University';
UPDATE schools SET abbreviation = 'IU' WHERE school_name = 'Indiana University';
UPDATE schools SET abbreviation = 'UVA' WHERE school_name = 'University of Virginia';
UPDATE schools SET abbreviation = 'DUKE' WHERE school_name = 'Duke University';
UPDATE schools SET abbreviation = 'FSU' WHERE school_name = 'Florida State University';
UPDATE schools SET abbreviation = 'CLEM' WHERE school_name = 'Clemson University';
UPDATE schools SET abbreviation = 'STAN' WHERE school_name = 'Stanford University';
UPDATE schools SET abbreviation = 'ND' WHERE school_name = 'University of Notre Dame';
UPDATE schools SET abbreviation = 'BAY' WHERE school_name = 'Baylor University';
UPDATE schools SET abbreviation = 'OKST' WHERE school_name = 'Oklahoma State University';
UPDATE schools SET abbreviation = 'UTAH' WHERE school_name = 'University of Utah';
UPDATE schools SET abbreviation = 'ASU' WHERE school_name = 'Arizona State University';
