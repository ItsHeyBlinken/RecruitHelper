import "../scraper/src/env.js";
import { closePool, getPool } from "../scraper/src/persist.js";

const db = getPool();
const schools = ["Texas State University", "Texas Southern University", "Abilene Christian University"];

for (const name of schools) {
  const r = await db.query(
    `SELECT c.coach_name, c.title, c.email
     FROM contacts c
     JOIN sports sp ON sp.id = c.sport_id
     JOIN schools sch ON sch.id = sp.school_id
     WHERE sch.school_name = $1 AND sp.sport_name = 'softball'
     ORDER BY c.title, c.coach_name
     LIMIT 15`,
    [name],
  );
  const count = await db.query(
    `SELECT COUNT(*)::int AS n FROM contacts c
     JOIN sports sp ON sp.id = c.sport_id
     JOIN schools sch ON sch.id = sp.school_id
     WHERE sch.school_name = $1 AND sp.sport_name = 'softball'`,
    [name],
  );
  console.log(`\n=== ${name} (${count.rows[0].n} total) ===`);
  for (const row of r.rows) {
    console.log(`  ${row.coach_name} | ${row.title} | ${row.email ?? "-"}`);
  }
}

await closePool();
