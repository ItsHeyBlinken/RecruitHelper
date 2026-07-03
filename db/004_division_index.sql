-- Optional: add index for division filtering (run if search feels slow at scale)
CREATE INDEX IF NOT EXISTS idx_schools_division ON schools (division);
