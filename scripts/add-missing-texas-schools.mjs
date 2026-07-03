import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const seedPath = resolve(root, "seed/schools.json");
const sqlPath = resolve(root, "db/014_add_missing_texas_schools.sql");

const NEW_TEXAS_SCHOOLS = [
  {
    school_name: "Houston Christian University",
    abbreviation: "HCU",
    aliases: ["HCU", "Houston Christian", "Huskies"],
    division: "D1",
    state: "TX",
    athletics_url: "https://hcuhuskies.com",
  },
  {
    school_name: "Lamar University",
    abbreviation: "Lamar",
    aliases: ["Lamar", "Cardinals", "LU"],
    division: "D1",
    state: "TX",
    athletics_url: "https://lamarcardinals.com",
  },
  {
    school_name: "Prairie View A&M University",
    abbreviation: "PVAMU",
    aliases: ["PVAMU", "Prairie View", "Panthers"],
    division: "D1",
    state: "TX",
    athletics_url: "https://pvpanthers.com",
  },
  {
    school_name: "Stephen F. Austin State University",
    abbreviation: "SFA",
    aliases: ["SFA", "Stephen F. Austin", "Lumberjacks"],
    division: "D1",
    state: "TX",
    athletics_url: "https://sfajacks.com",
  },
  {
    school_name: "Tarleton State University",
    abbreviation: "Tarleton",
    aliases: ["Tarleton", "Texans"],
    division: "D1",
    state: "TX",
    athletics_url: "https://tarletonsports.com",
  },
  {
    school_name: "Texas A&M University-Commerce",
    abbreviation: "TAMUC",
    aliases: ["TAMUC", "A&M-Commerce", "Lions", "East Texas A&M"],
    division: "D1",
    state: "TX",
    athletics_url: "https://lionathletics.com",
  },
  {
    school_name: "Texas A&M University-Corpus Christi",
    abbreviation: "TAMUCC",
    aliases: ["TAMUCC", "A&M-Corpus Christi", "Islanders"],
    division: "D1",
    state: "TX",
    athletics_url: "https://goislanders.com",
  },
  {
    school_name: "Midwestern State University",
    abbreviation: "MSU Texas",
    aliases: ["MSU Texas", "Midwestern State", "Mustangs"],
    division: "D2",
    state: "TX",
    athletics_url: "https://msumustangs.com",
  },
  {
    school_name: "Sul Ross State University",
    abbreviation: "Sul Ross",
    aliases: ["Sul Ross", "SRSU", "Lobos"],
    division: "D3",
    state: "TX",
    athletics_url: "https://srlobos.com",
  },
  {
    school_name: "Alvin Community College",
    abbreviation: "Alvin",
    aliases: ["Alvin", "Alvin College", "Dolphins"],
    division: "JUCO",
    state: "TX",
    athletics_url: "https://www.alvincollege.edu/athletics/softball.html",
  },
  {
    school_name: "Angelina College",
    abbreviation: "Angelina",
    aliases: ["Angelina", "Roadrunners"],
    division: "JUCO",
    state: "TX",
    athletics_url: "https://angelinaathletics.com",
  },
  {
    school_name: "Coastal Bend College",
    abbreviation: "CBC",
    aliases: ["CBC", "Coastal Bend", "Cougars"],
    division: "JUCO",
    state: "TX",
    athletics_url: "https://cbcathletics.com",
  },
  {
    school_name: "Galveston College",
    abbreviation: "Galveston",
    aliases: ["Galveston College", "Whitecaps"],
    division: "JUCO",
    state: "TX",
    athletics_url: "https://gc.edu/athletics",
  },
  {
    school_name: "Laredo College",
    abbreviation: "Laredo",
    aliases: ["Laredo College", "Palominos"],
    division: "JUCO",
    state: "TX",
    athletics_url: "https://laredo.edu/athletics",
  },
  {
    school_name: "Northeast Texas Community College",
    abbreviation: "NETCC",
    aliases: ["NETCC", "Northeast Texas", "Eagles", "NTCC"],
    division: "JUCO",
    state: "TX",
    athletics_url: "https://ntcceagles.com",
  },
  {
    school_name: "South Plains College",
    abbreviation: "SPC",
    aliases: ["SPC", "South Plains", "Texans"],
    division: "JUCO",
    state: "TX",
    athletics_url: "https://spctexans.com",
  },
  {
    school_name: "Southwest Texas Junior College",
    abbreviation: "SWTJC",
    aliases: ["SWTJC", "Southwest Texas Junior College"],
    division: "JUCO",
    state: "TX",
    athletics_url: "https://swtjc.edu/athletics",
  },
  {
    school_name: "Texarkana College",
    abbreviation: "Texarkana",
    aliases: ["Texarkana College", "Bulldogs"],
    division: "JUCO",
    state: "TX",
    athletics_url: "https://texarkanacollege.edu/athletics",
  },
  {
    school_name: "University of Houston-Victoria",
    abbreviation: "UHV",
    aliases: ["UHV", "Houston-Victoria", "Jaguars"],
    division: "NAIA",
    state: "TX",
    athletics_url: "https://uhvjaguars.com",
  },
  {
    school_name: "Jarvis Christian University",
    abbreviation: "Jarvis",
    aliases: ["Jarvis Christian", "JC", "Bulldogs"],
    division: "NAIA",
    state: "TX",
    athletics_url: "https://jarvisathletics.com",
  },
  {
    school_name: "Nelson University",
    abbreviation: "Nelson",
    aliases: ["Nelson", "Lions"],
    division: "NAIA",
    state: "TX",
    athletics_url: "https://nelsonlions.com",
  },
  {
    school_name: "Our Lady of the Lake University",
    abbreviation: "OLLU",
    aliases: ["OLLU", "Our Lady of the Lake", "Saints"],
    division: "NAIA",
    state: "TX",
    athletics_url: "https://ollusaintsathletics.com",
  },
  {
    school_name: "Texas A&M University-Texarkana",
    abbreviation: "TAMUT",
    aliases: ["TAMUT", "A&M-Texarkana", "Eagles"],
    division: "NAIA",
    state: "TX",
    athletics_url: "https://tamuteagles.com",
  },
  {
    school_name: "Texas College",
    abbreviation: "Texas College",
    aliases: ["Texas College", "Steers"],
    division: "NAIA",
    state: "TX",
    athletics_url: "https://texascollege.edu/athletics",
  },
  {
    school_name: "Texas Wesleyan University",
    abbreviation: "TXWES",
    aliases: ["TXWES", "Texas Wesleyan", "Rams"],
    division: "NAIA",
    state: "TX",
    athletics_url: "https://ramsports.net/sports/softball",
  },
  {
    school_name: "University of the Southwest",
    abbreviation: "USW",
    aliases: ["USW", "Southwest", "Mustangs"],
    division: "NAIA",
    state: "TX",
    athletics_url: "https://uswathletics.com",
  },
  {
    school_name: "Wayland Baptist University",
    abbreviation: "Wayland",
    aliases: ["Wayland Baptist", "WBU", "Pioneers"],
    division: "NAIA",
    state: "TX",
    athletics_url: "https://wbuathletics.com",
  },
];

function sqlEscape(value) {
  return value.replace(/'/g, "''");
}

function toSqlRow(school) {
  const aliases = `ARRAY[${school.aliases.map((a) => `'${sqlEscape(a)}'`).join(", ")}]`;
  return `    ('${sqlEscape(school.school_name)}', '${sqlEscape(school.abbreviation)}', ${aliases}, '${school.division}', '${school.state}', '${sqlEscape(school.athletics_url)}')`;
}

const schools = JSON.parse(readFileSync(seedPath, "utf8"));
const existing = new Set(schools.map((s) => s.school_name));
const added = NEW_TEXAS_SCHOOLS.filter((s) => !existing.has(s.school_name));
const skipped = NEW_TEXAS_SCHOOLS.filter((s) => existing.has(s.school_name));

if (added.length > 0) {
  writeFileSync(seedPath, `${JSON.stringify([...schools, ...added], null, 2)}\n`);
}

const sql = [
  "-- Add 27 Texas softball programs from docs/texas/athletic-websites.md",
  "-- Safe to re-run. Apply before bulk scrape.",
  "",
  "INSERT INTO schools (school_name, abbreviation, aliases, division, state, athletics_url) VALUES",
  added.map(toSqlRow).join(",\n"),
  "ON CONFLICT (school_name) DO UPDATE SET",
  "    abbreviation = EXCLUDED.abbreviation,",
  "    aliases = EXCLUDED.aliases,",
  "    division = EXCLUDED.division,",
  "    state = EXCLUDED.state,",
  "    athletics_url = EXCLUDED.athletics_url,",
  "    updated_at = NOW();",
  "",
  `-- Added ${added.length} schools (${skipped.length} already in seed).`,
].join("\n");

writeFileSync(sqlPath, `${sql}\n`);

console.log(`Added ${added.length} schools to seed (${schools.length + added.length} total).`);
if (skipped.length > 0) {
  console.log(`Skipped ${skipped.length} already present:`, skipped.map((s) => s.school_name).join(", "));
}
console.log(`Wrote ${sqlPath}`);
