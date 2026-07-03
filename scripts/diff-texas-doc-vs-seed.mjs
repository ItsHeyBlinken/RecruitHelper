import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { TEXAS_ATHLETIC_WEBSITES_MD } from "./texas-doc-paths.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const md = readFileSync(TEXAS_ATHLETIC_WEBSITES_MD, "utf8");
const schools = JSON.parse(readFileSync(resolve(root, "seed/schools.json"), "utf8"));

const NAME_ALIASES = new Map([
  ["University of Texas at Austin", "University of Texas"],
  ["University of St. Thomas (Houston)", "University of St. Thomas"],
  ["Alvin College", "Alvin Community College"],
  ["Houston-Victoria", "University of Houston-Victoria"],
  ["Texas A&M-Texarkana", "Texas A&M University-Texarkana"],
]);

const linkRegex = /\|\s*([^|]+?)\s*\|\s*\[https?:\/\/[^\]]+\]\((https?:\/\/[^)]+)\)\s*\|/g;
const docEntries = new Map();
for (const match of md.matchAll(linkRegex)) {
  const name = match[1].trim();
  let url = match[2].trim();
  docEntries.set(name, url);
  const alias = NAME_ALIASES.get(name);
  if (alias) docEntries.set(alias, url);
}

const txSchools = schools.filter((s) => s.state === "TX");
const seedByName = new Map(txSchools.map((s) => [s.school_name, s]));

const urlMismatches = [];
const inSeedNotDoc = [];
const inDocNotSeed = [];

for (const school of txSchools) {
  const docUrl = docEntries.get(school.school_name);
  if (!docUrl) {
    inSeedNotDoc.push(school);
    continue;
  }
  const norm = (u) => u.replace(/\/$/, "").toLowerCase();
  if (norm(school.athletics_url) !== norm(docUrl)) {
    urlMismatches.push({ school_name: school.school_name, seed: school.athletics_url, doc: docUrl });
  }
  docEntries.delete(school.school_name);
}

for (const [name, url] of docEntries) {
  if (NAME_ALIASES.has(name)) continue;
  inDocNotSeed.push({ school_name: name, athletics_url: url });
}

console.log(`TX in seed: ${txSchools.length}`);
console.log(`URL mismatches (seed vs doc): ${urlMismatches.length}`);
for (const m of urlMismatches) {
  console.log(`  ${m.school_name}`);
  console.log(`    seed: ${m.seed}`);
  console.log(`    doc:  ${m.doc}`);
}
console.log(`\nIn seed, not in doc: ${inSeedNotDoc.length}`);
for (const s of inSeedNotDoc) {
  console.log(`  ${s.division} | ${s.school_name} | ${s.athletics_url}`);
}
console.log(`\nIn doc, not in seed: ${inDocNotSeed.length}`);
for (const s of inDocNotSeed) {
  console.log(`  ${s.school_name} | ${s.athletics_url}`);
}
