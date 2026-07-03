import "../scraper/src/env.js";
import { closePool, getPool } from "../scraper/src/persist.js";

const db = getPool();

const inflated = await db.query(`
  SELECT sch.school_name, COUNT(*)::int AS contact_count
  FROM contacts c
  JOIN sports sp ON sp.id = c.sport_id
  JOIN schools sch ON sch.id = sp.school_id
  WHERE sp.sport_name = 'softball' AND sch.state = 'TX'
  GROUP BY sch.school_name
  HAVING COUNT(*) > 12
  ORDER BY contact_count DESC
`);

if (inflated.rows.length === 0) {
  console.log("No TX schools with more than 12 contacts.");
} else {
  console.log(`TX schools with >12 contacts (${inflated.rows.length}):`);
  for (const row of inflated.rows) {
    console.log(`  ${row.school_name}: ${row.contact_count}`);
  }
}

await closePool();
