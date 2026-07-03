import "../scraper/src/env.js";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { closePool, getPool } from "../scraper/src/persist.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedPath = resolve(__dirname, "../seed/schools.json");
const schools = JSON.parse(readFileSync(seedPath, "utf8"));

const db = getPool();

const zeroContacts = await db.query(`
  SELECT sch.school_name, sch.division, sch.state, sch.athletics_url,
         COUNT(c.id)::int AS contact_count
  FROM schools sch
  LEFT JOIN sports sp ON sp.school_id = sch.id AND sp.sport_name = 'softball'
  LEFT JOIN contacts c ON c.sport_id = sp.id
  GROUP BY sch.id, sch.school_name, sch.division, sch.state, sch.athletics_url
  HAVING COUNT(c.id) = 0
  ORDER BY sch.state, sch.division, sch.school_name
`);

const suspiciousPatterns = [
  { id: "college-main-athletics", regex: /\.edu\/athletics\/?$/i, reason: "Main college site /athletics (often not real athletics CMS)" },
  { id: "college-root", regex: /\.edu\/?$/i, reason: "College root domain without dedicated athletics site" },
  { id: "missing-prestosports", regex: /prestosports/i, reason: null },
];

function flagUrl(url) {
  const flags = [];
  for (const pattern of suspiciousPatterns) {
    if (pattern.reason && pattern.regex.test(url)) {
      flags.push(pattern.reason);
    }
  }
  return flags;
}

const seedByName = new Map(schools.map((s) => [s.school_name, s]));

console.log(`\n=== Schools with ZERO contacts (${zeroContacts.rows.length}) ===\n`);

const suspiciousZero = [];
for (const row of zeroContacts.rows) {
  const flags = flagUrl(row.athletics_url);
  const marker = flags.length > 0 ? " ⚠️  " + flags.join("; ") : "";
  console.log(`${row.state} ${row.division.padEnd(4)} | ${row.school_name}${marker}`);
  console.log(`    ${row.athletics_url}`);
  if (flags.length > 0) suspiciousZero.push(row);
}

console.log(`\n=== Zero-contact schools with suspicious URLs (${suspiciousZero.length}) ===\n`);
for (const row of suspiciousZero) {
  console.log(`  ${row.school_name} → ${row.athletics_url}`);
}

const txJucoSuspicious = schools.filter(
  (s) => s.state === "TX" && s.division === "JUCO" && flagUrl(s.athletics_url).length > 0,
);
console.log(`\n=== All TX JUCO with suspicious seed URLs (${txJucoSuspicious.length}) ===\n`);
for (const s of txJucoSuspicious) {
  const zero = zeroContacts.rows.some((r) => r.school_name === s.school_name);
  console.log(`  ${zero ? "[0 contacts]" : "[has contacts]"} ${s.school_name} → ${s.athletics_url}`);
}

await closePool();
