import "../scraper/src/env.js";
import { closePool, getPool } from "../scraper/src/persist.js";

const db = getPool();

const contacts = await db.query(
  `SELECT c.coach_name, c.title, c.email, c.phone, c.updated_at
   FROM contacts c
   JOIN sports sp ON sp.id = c.sport_id
   JOIN schools sch ON sch.id = sp.school_id
   WHERE sch.school_name = 'Baylor University'
     AND sp.sport_name = 'softball'
   ORDER BY c.coach_name`,
);

console.log(`Baylor softball contacts in DB: ${contacts.rows.length}\n`);
for (const row of contacts.rows) {
  console.log(`- ${row.coach_name} | ${row.title ?? ""} | ${row.email ?? "no email"}`);
}

const otherSports = await db.query(
  `SELECT sp.sport_name, COUNT(c.id)::int AS contact_count
   FROM schools sch
   JOIN sports sp ON sp.school_id = sch.id
   LEFT JOIN contacts c ON c.sport_id = sp.id
   WHERE sch.school_name = 'Baylor University'
   GROUP BY sp.sport_name
   ORDER BY sp.sport_name`,
);

console.log("\nAll sports rows for Baylor:");
for (const row of otherSports.rows) {
  console.log(`- ${row.sport_name}: ${row.contact_count} contacts`);
}

await closePool();
