import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  TEXAS_ATHLETIC_WEBSITES_MD,
  TEXAS_VERIFICATION_MASTER_MD,
} from "./texas-doc-paths.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const seedPath = resolve(root, "seed/schools.json");
const sqlPath = resolve(root, "db/018_texas_verification_master_updates.sql");
const docPath = TEXAS_ATHLETIC_WEBSITES_MD;

/** school_name in seed → verified athletics_url */
const URL_UPDATES = {
  "McMurry University": "https://mcmurrysports.com",
  "Schreiner University": "https://schreinermountaineers.com",
  "Howard Payne University": "https://hpusports.com",
  "East Texas Baptist University": "https://goetbutigers.com",
  "Jarvis Christian University": "https://jcubulldogs.com",
  "Texas College": "https://www.tcsteersathletics.com",
  "Alvin Community College": "https://athletics.alvincollege.edu",
  "Howard College": "https://www.hchawk.com",
  "Navarro College": "https://navarrobulldogs.com",
  "Cisco College": "https://www.wranglersports.net",
  "Galveston College": "https://www.gcwhitecaps.com",
  "Grayson College": "https://www.gcvikings.com",
  "Hill College": "https://hillcollegeathletics.com",
  "Kilgore College": "https://www.kcrangernation.com",
  "Paris Junior College": "https://pjcathletics.com",
  "Ranger College": "https://www.rangersports.net",
  "Frank Phillips College": "https://plainsmensports.com",
  "Temple College": "https://www.tcleopards.com",
  "Western Texas College": "https://www.wtcathletics.com",
  "El Paso Community College": "https://www.epcc.edu/Services/Athletics/softball",
  "Vernon College": "https://www.vernoncollege.edu/athletics",
  "Dallas College Brookhaven": "https://brookhavenathletics.com",
  "Dallas College Eastfield": "https://eastfieldathletics.com",
  "Dallas College North Lake": "https://northlakecollegeathletics.com",
  "Dallas College Richland": "https://rlcsports.com",
};

const REMOVALS = [
  "Southwest Texas Junior College",
  "Texarkana College",
  "Laredo College",
];

/** seed school_name → display name in docs/texas/athletic-websites.md */
const DOC_NAMES = {
  "Alvin Community College": "Alvin College",
  "University of St. Thomas": "University of St. Thomas (Houston)",
  "University of Houston-Victoria": "Houston-Victoria",
  "Texas A&M University-Texarkana": "Texas A&M-Texarkana",
};

function sqlEscape(value) {
  return value.replace(/'/g, "''");
}

const schools = JSON.parse(readFileSync(seedPath, "utf8"));
let urlUpdateCount = 0;
let removalCount = 0;

const updatedSchools = schools
  .filter((school) => {
    if (REMOVALS.includes(school.school_name)) {
      removalCount++;
      return false;
    }
    return true;
  })
  .map((school) => {
    const nextUrl = URL_UPDATES[school.school_name];
    if (!nextUrl) return school;
    urlUpdateCount++;
    return { ...school, athletics_url: nextUrl };
  });

writeFileSync(seedPath, `${JSON.stringify(updatedSchools, null, 2)}\n`, "utf8");

const sqlLines = [
  "-- Apply URL fixes and removals from docs/texas/verification-master.md",
  "",
  `DELETE FROM schools WHERE school_name IN (${REMOVALS.map((n) => `'${sqlEscape(n)}'`).join(", ")});`,
  "",
];

for (const [name, url] of Object.entries(URL_UPDATES)) {
  sqlLines.push(
    `UPDATE schools SET athletics_url = '${sqlEscape(url)}', updated_at = NOW()`,
    `WHERE school_name = '${sqlEscape(name)}';`,
    "",
  );
}

writeFileSync(sqlPath, `${sqlLines.join("\n")}`, "utf8");

const docUrlByName = new Map();
for (const school of updatedSchools) {
  if (school.state !== "TX") continue;
  const docName = DOC_NAMES[school.school_name] ?? school.school_name;
  docUrlByName.set(docName, school.athletics_url);
}

let doc = readFileSync(docPath, "utf8");

for (const removed of REMOVALS) {
  const docName = DOC_NAMES[removed] ?? removed;
  doc = doc.replace(new RegExp(`\\| ${escapeRegex(docName)} \\| \\[[^\\]]+\\]\\([^)]+\\) \\|\\n`, "g"), "");
}

for (const [docName, url] of docUrlByName) {
  const line = `| ${docName} | [${url}](${url}) |`;
  doc = doc.replace(
    new RegExp(`\\| ${escapeRegex(docName)} \\| \\[[^\\]]+\\]\\([^)]+\\) \\|`),
    line,
  );
}

const removalNote =
  "- **Removed (no varsity NJCAA softball):** Southwest Texas Junior College, Texarkana College, Laredo College.";
if (!doc.includes(removalNote)) {
  doc = doc.replace(
    "### Verification Notes:",
    `### Verification Notes:\n${removalNote}`,
  );
}

const dallasNote =
  "- **Dallas College campuses:** Athletics URLs updated to brookhavenathletics.com, eastfieldathletics.com, northlakecollegeathletics.com, rlcsports.com (softball coach pages may still be missing).";
if (!doc.includes("brookhavenathletics.com")) {
  doc = doc.replace(
    "- **Dallas College:** Softball programs are specifically hosted at the **Brookhaven, Eastfield, North Lake, and Richland** campuses.",
    "- **Dallas College:** Softball programs are specifically hosted at the **Brookhaven, Eastfield, North Lake, and Richland** campuses.\n" +
      dallasNote,
  );
}

writeFileSync(docPath, doc, "utf8");

console.log(`Seed: ${urlUpdateCount} URL updates, ${removalCount} removals`);
console.log(`TX schools remaining: ${updatedSchools.filter((s) => s.state === "TX").length}`);
console.log(`Wrote ${sqlPath}`);

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
