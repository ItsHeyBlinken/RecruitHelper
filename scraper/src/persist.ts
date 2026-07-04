import pg from "pg";
import type { ScrapedContact, SeedSchool } from "./types.js";
import { logger } from "./logger.js";

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    pool = new Pool({ connectionString });
  }
  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export async function upsertSchool(school: SeedSchool): Promise<number> {
  const db = getPool();
  const result = await db.query<{ id: number }>(
    `INSERT INTO schools (school_name, abbreviation, aliases, division, state, athletics_url)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (school_name)
     DO UPDATE SET
       abbreviation = EXCLUDED.abbreviation,
       aliases = EXCLUDED.aliases,
       division = EXCLUDED.division,
       state = EXCLUDED.state,
       athletics_url = EXCLUDED.athletics_url,
       updated_at = NOW()
     RETURNING id`,
    [
      school.school_name,
      school.abbreviation ?? null,
      school.aliases ?? [],
      school.division,
      school.state,
      school.athletics_url,
    ],
  );

  const row = result.rows[0];
  if (!row) {
    throw new Error(`Failed to upsert school: ${school.school_name}`);
  }
  return row.id;
}

export async function upsertSport(schoolId: number, sportName: string): Promise<number> {
  const db = getPool();
  const result = await db.query<{ id: number }>(
    `INSERT INTO sports (school_id, sport_name)
     VALUES ($1, $2)
     ON CONFLICT (school_id, sport_name)
     DO UPDATE SET sport_name = EXCLUDED.sport_name
     RETURNING id`,
    [schoolId, sportName],
  );

  const row = result.rows[0];
  if (!row) {
    throw new Error(`Failed to upsert sport: ${sportName} for school ${schoolId}`);
  }
  return row.id;
}

export async function upsertContact(sportId: number, contact: ScrapedContact): Promise<void> {
  const db = getPool();
  const title = contact.title ?? "";

  await db.query(
    `INSERT INTO contacts (sport_id, coach_name, title, email, phone)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (sport_id, coach_name, title)
     DO UPDATE SET
       email = COALESCE(EXCLUDED.email, contacts.email),
       phone = COALESCE(EXCLUDED.phone, contacts.phone),
       updated_at = NOW()`,
    [sportId, contact.coach_name, title, contact.email, contact.phone],
  );
}

export async function replaceContactsForSport(
  sportId: number,
  contacts: ScrapedContact[],
): Promise<void> {
  const db = getPool();
  const client = await db.connect();

  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM contacts WHERE sport_id = $1", [sportId]);

    for (const contact of contacts) {
      await client.query(
        `INSERT INTO contacts (sport_id, coach_name, title, email, phone)
         VALUES ($1, $2, $3, $4, $5)`,
        [sportId, contact.coach_name, contact.title ?? "", contact.email, contact.phone],
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function persistScrapeResult(
  school: SeedSchool,
  contacts: ScrapedContact[],
): Promise<{ schoolId: number; sportId: number; contactCount: number }> {
  const schoolId = await upsertSchool(school);
  const sportId = await upsertSport(schoolId, "softball");

  await replaceContactsForSport(sportId, contacts);

  logger.info("Persisted scrape result", {
    school: school.school_name,
    schoolId,
    sportId,
    contactCount: contacts.length,
  });

  return { schoolId, sportId, contactCount: contacts.length };
}

export async function getSchoolByName(name: string): Promise<SeedSchool & { id: number } | null> {
  const db = getPool();
  const result = await db.query<SeedSchool & { id: number }>(
    `SELECT id, school_name, abbreviation, aliases, division, state, athletics_url
     FROM schools
     WHERE LOWER(school_name) = LOWER($1)
     LIMIT 1`,
    [name],
  );
  return result.rows[0] ?? null;
}

function parseListFilter(value: string | undefined): string[] | null {
  if (!value) return null;
  const parts = value
    .split(",")
    .map((part) => part.trim().toUpperCase())
    .filter(Boolean);
  return parts.length > 0 ? parts : null;
}

export async function getAllSchools(filters?: {
  state?: string;
  division?: string;
}): Promise<(SeedSchool & { id: number })[]> {
  const db = getPool();
  const conditions: string[] = [];
  const params: string[] = [];

  const states = parseListFilter(filters?.state);
  if (states) {
    const placeholders = states.map((state) => {
      params.push(state);
      return `$${params.length}`;
    });
    conditions.push(`UPPER(state) IN (${placeholders.join(", ")})`);
  }

  const divisions = parseListFilter(filters?.division);
  if (divisions) {
    const placeholders = divisions.map((division) => {
      params.push(division);
      return `$${params.length}`;
    });
    conditions.push(`UPPER(division) IN (${placeholders.join(", ")})`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const result = await db.query<SeedSchool & { id: number }>(
    `SELECT id, school_name, abbreviation, aliases, division, state, athletics_url
     FROM schools
     ${where}
     ORDER BY division, school_name`,
    params,
  );
  return result.rows;
}
