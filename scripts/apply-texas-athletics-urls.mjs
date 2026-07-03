import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { TEXAS_ATHLETIC_WEBSITES_MD } from "./texas-doc-paths.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const mdPath = TEXAS_ATHLETIC_WEBSITES_MD;
const seedPath = resolve(root, "seed/schools.json");
const sqlPath = resolve(root, "db/013_update_texas_athletics_urls.sql");

const NAME_ALIASES = new Map([
  ["University of Texas at Austin", "University of Texas"],
  ["St. Mary's University", "St. Mary's University"],
  ["University of St. Thomas (Houston)", "University of St. Thomas"],
  ["Alvin College", "Alvin Community College"],
  ["Houston-Victoria", "University of Houston-Victoria"],
  ["Texas A&M-Texarkana", "Texas A&M University-Texarkana"],
]);

function normalizeUrl(url) {
  return url.replace(/\/$/, "").toLowerCase();
}

function parseMarkdown(md) {
  const entries = new Map();
  const linkRegex = /\|\s*([^|]+?)\s*\|\s*\[https?:\/\/[^\]]+\]\((https?:\/\/[^)]+)\)\s*\|/g;

  for (const match of md.matchAll(linkRegex)) {
    const name = match[1].trim();
    let url = match[2].trim();
    if (!url.startsWith("http")) url = `https://${url}`;
    entries.set(name, url);
    const alias = NAME_ALIASES.get(name);
    if (alias) entries.set(alias, url);
  }

  return entries;
}

const md = readFileSync(mdPath, "utf8");
const urlByName = parseMarkdown(md);
const schools = JSON.parse(readFileSync(seedPath, "utf8"));

const updates = [];
const unmatchedDoc = [...urlByName.keys()].filter((name) => !NAME_ALIASES.has(name));

for (const school of schools) {
  if (school.state !== "TX") continue;

  const newUrl = urlByName.get(school.school_name);
  if (!newUrl) continue;

  const idx = unmatchedDoc.indexOf(school.school_name);
  if (idx >= 0) unmatchedDoc.splice(idx, 1);

  if (normalizeUrl(school.athletics_url) === normalizeUrl(newUrl)) continue;

  updates.push({
    school_name: school.school_name,
    old_url: school.athletics_url,
    new_url: newUrl,
  });
  school.athletics_url = newUrl;
}

writeFileSync(seedPath, `${JSON.stringify(schools, null, 2)}\n`);

const sqlLines = [
  "-- Update Texas school athletics URLs from docs/texas/athletic-websites.md",
  "-- Apply in pgAdmin, then re-scrape: npm run scrape:tx -- --concurrency 2",
  "",
  ...updates.map(
    (u) =>
      `UPDATE schools SET athletics_url = '${u.new_url.replace(/'/g, "''")}', updated_at = NOW()\nWHERE school_name = '${u.school_name.replace(/'/g, "''")}';`,
  ),
  "",
  "-- Schools in the markdown not yet in seed (add separately if desired):",
  ...unmatchedDoc.map((name) => `--   ${name}: ${urlByName.get(name)}`),
];

writeFileSync(sqlPath, `${sqlLines.join("\n")}\n`);

console.log(`Updated ${updates.length} TX schools in seed/schools.json`);
console.log(`Wrote ${sqlPath}`);
console.log("\nURL changes:");
for (const u of updates) {
  console.log(`  ${u.school_name}`);
  console.log(`    ${u.old_url}`);
  console.log(`    -> ${u.new_url}`);
}
if (unmatchedDoc.length > 0) {
  console.log(`\n${unmatchedDoc.length} schools in markdown not in seed (candidates to add).`);
}
