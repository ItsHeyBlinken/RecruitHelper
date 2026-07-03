-- RecruitConnect MVP - Initial Schema
-- Apply in pgAdmin: create database "recruitconnect", then run this script.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ---------------------------------------------------------------------------
-- schools
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS schools (
    id SERIAL PRIMARY KEY,
    school_name VARCHAR(255) NOT NULL UNIQUE,
    division VARCHAR(50) NOT NULL,
    state CHAR(2) NOT NULL,
    athletics_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_schools_name_trgm
    ON schools USING GIN (LOWER(school_name) gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- sports
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sports (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    sport_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (school_id, sport_name)
);

CREATE INDEX IF NOT EXISTS idx_sports_school_id ON sports (school_id);

-- ---------------------------------------------------------------------------
-- contacts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    sport_id INTEGER NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
    coach_name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (sport_id, coach_name, title)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_contacts_sport_email_unique
    ON contacts (sport_id, LOWER(email))
    WHERE email IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_contacts_sport_id ON contacts (sport_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_schools_updated_at ON schools;
CREATE TRIGGER trg_schools_updated_at
    BEFORE UPDATE ON schools
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_contacts_updated_at ON contacts;
CREATE TRIGGER trg_contacts_updated_at
    BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
