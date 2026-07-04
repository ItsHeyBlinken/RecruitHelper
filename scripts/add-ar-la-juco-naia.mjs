import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const seedPath = resolve(root, "seed/schools.json");
const sqlPath = resolve(root, "db/022_add_ar_la_juco_naia_schools.sql");

/** @type {import("../scraper/src/types.ts").SeedSchool[]} */
const NEW_SCHOOLS = [
  // Arkansas JUCO
  {
    school_name: "Arkansas State University Mid-South",
    abbreviation: "ASU Mid-South",
    aliases: ["ASU Mid-South", "Mid-South", "Greyhounds"],
    division: "JUCO",
    state: "AR",
    athletics_url: "https://www.asumidsouthsports.com",
  },
  {
    school_name: "Arkansas State University Mountain Home",
    abbreviation: "ASUMH",
    aliases: ["ASUMH", "ASU Mountain Home", "Mountain Home", "TrailBlazers"],
    division: "JUCO",
    state: "AR",
    athletics_url: "https://www.asumhathletics.com",
  },
  {
    school_name: "Arkansas State University Three Rivers",
    abbreviation: "ASUTR",
    aliases: ["ASUTR", "ASU Three Rivers", "Three Rivers", "Kickers"],
    division: "JUCO",
    state: "AR",
    athletics_url: "https://www.asutr.edu/o/athletics",
  },
  {
    school_name: "National Park College",
    abbreviation: "NPC",
    aliases: ["NPC", "National Park", "Nighthawks"],
    division: "JUCO",
    state: "AR",
    athletics_url: "https://np.edu/student-life-services/athletics/softball/",
  },
  {
    school_name: "North Arkansas College",
    abbreviation: "Northark",
    aliases: ["Northark", "North Arkansas", "Pioneers"],
    division: "JUCO",
    state: "AR",
    athletics_url: "https://www.northark.edu/athletics/softball/",
  },
  {
    school_name: "Southeast Arkansas College",
    abbreviation: "SEARK",
    aliases: ["SEARK", "Southeast Arkansas", "Sharks"],
    division: "JUCO",
    state: "AR",
    athletics_url: "https://searksharks.com",
  },
  {
    school_name: "Southern Arkansas University Tech",
    abbreviation: "SAU Tech",
    aliases: ["SAU Tech", "Southern Arkansas Tech", "Rockets"],
    division: "JUCO",
    state: "AR",
    athletics_url: "https://sautrockets.com",
  },
  {
    school_name: "University of Arkansas Rich Mountain",
    abbreviation: "UA Rich Mountain",
    aliases: ["UA Rich Mountain", "UARM", "Rich Mountain", "Bucks"],
    division: "JUCO",
    state: "AR",
    athletics_url: "https://bucksathletics.com",
  },
  // Arkansas NAIA
  {
    school_name: "Central Baptist College",
    abbreviation: "CBC",
    aliases: ["CBC", "Central Baptist", "Mustangs"],
    division: "NAIA",
    state: "AR",
    athletics_url: "https://cbcmustangs.com",
  },
  {
    school_name: "Crowley's Ridge College",
    abbreviation: "CRC",
    aliases: ["CRC", "Crowley's Ridge", "Pioneers"],
    division: "NAIA",
    state: "AR",
    athletics_url: "https://www.crcpioneers.com",
  },
  {
    school_name: "Williams Baptist University",
    abbreviation: "WBU",
    aliases: ["WBU", "Williams Baptist", "Eagles"],
    division: "NAIA",
    state: "AR",
    athletics_url: "https://wbueagles.com",
  },
  // Louisiana JUCO
  {
    school_name: "Baton Rouge Community College",
    abbreviation: "BRCC",
    aliases: ["BRCC", "Baton Rouge CC", "Bears", "Lady Bears"],
    division: "JUCO",
    state: "LA",
    athletics_url: "https://brccathletics.com",
  },
  {
    school_name: "Bossier Parish Community College",
    abbreviation: "BPCC",
    aliases: ["BPCC", "Bossier Parish", "Cavaliers", "Lady Cavaliers"],
    division: "JUCO",
    state: "LA",
    athletics_url: "https://bpcc.prestosports.com/sports/sball/coaches/index",
  },
  {
    school_name: "Louisiana State University Eunice",
    abbreviation: "LSUE",
    aliases: ["LSUE", "LSU Eunice", "Lady Bengals"],
    division: "JUCO",
    state: "LA",
    athletics_url: "https://athletics.lsue.edu",
  },
  // Louisiana NAIA
  {
    school_name: "Louisiana Christian University",
    abbreviation: "LCU",
    aliases: ["LCU", "Louisiana Christian", "Wildcats"],
    division: "NAIA",
    state: "LA",
    athletics_url: "https://www.lcwildcats.net",
  },
  {
    school_name: "Louisiana State University at Alexandria",
    abbreviation: "LSUA",
    aliases: ["LSUA", "LSU Alexandria", "LSU-A", "Generals"],
    division: "NAIA",
    state: "LA",
    athletics_url: "https://lsuagenerals.com",
  },
  {
    school_name: "Xavier University of Louisiana",
    abbreviation: "XULA",
    aliases: ["XULA", "Xavier Louisiana", "Xavier", "Gold Rush"],
    division: "NAIA",
    state: "LA",
    athletics_url: "https://xulagold.com",
  },
];

function sqlString(value) {
  return `'${value.replace(/'/g, "''")}'`;
}

function toSqlRow(school) {
  const aliases = `ARRAY[${school.aliases.map(sqlString).join(", ")}]`;
  return `    (${sqlString(school.school_name)}, ${sqlString(school.abbreviation)}, ${aliases}, ${sqlString(school.division)}, ${sqlString(school.state)}, ${sqlString(school.athletics_url)})`;
}

const schools = JSON.parse(readFileSync(seedPath, "utf8"));
const existing = new Set(schools.map((s) => s.school_name));
const added = NEW_SCHOOLS.filter((s) => !existing.has(s.school_name));
const skipped = NEW_SCHOOLS.filter((s) => existing.has(s.school_name));

if (added.length > 0) {
  writeFileSync(seedPath, `${JSON.stringify([...schools, ...added], null, 2)}\n`);
}

const sql = [
  "-- Add Arkansas & Louisiana JUCO + NAIA softball programs.",
  "-- Regional expansion: smaller schools first. Safe to re-run.",
  "-- Apply in pgAdmin, then: npm run scrape:ar-la",
  "",
  "INSERT INTO schools (school_name, abbreviation, aliases, division, state, athletics_url) VALUES",
  added.map(toSqlRow).join(",\n") + (added.length ? "" : "    -- (no new schools)"),
  "ON CONFLICT (school_name) DO UPDATE SET",
  "    abbreviation = EXCLUDED.abbreviation,",
  "    aliases = EXCLUDED.aliases,",
  "    division = EXCLUDED.division,",
  "    state = EXCLUDED.state,",
  "    athletics_url = EXCLUDED.athletics_url,",
  "    updated_at = NOW();",
  "",
  `-- Added ${added.length} schools (${skipped.length} already in seed).`,
  "-- Totals: AR JUCO 8, AR NAIA 3, LA JUCO 3, LA NAIA 3 (17).",
  "-- Excluded: ASU-Newport (softball discontinued 2026-07-01), Loyola NOLA (no varsity softball).",
].join("\n");

writeFileSync(sqlPath, `${sql}\n`);

console.log(`Seed: added ${added.length}, skipped ${skipped.length}`);
console.log(`SQL: ${sqlPath}`);
console.log(`Total schools in seed: ${schools.length + added.length}`);
