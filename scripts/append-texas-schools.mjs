import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedPath = resolve(__dirname, "../seed/schools.json");
const schools = JSON.parse(readFileSync(seedPath, "utf8"));

const texasAdditions = [
  { school_name: "Midland College", abbreviation: "Midland", aliases: ["Midland", "Lady Chaps", "Chaps"], division: "JUCO", state: "TX", athletics_url: "https://www.gochaps.com" },
  { school_name: "Temple College", abbreviation: "Temple", aliases: ["Temple", "Leopards"], division: "JUCO", state: "TX", athletics_url: "https://templecollege.edu/athletics" },
  { school_name: "Weatherford College", abbreviation: "Weatherford", aliases: ["Weatherford", "Roos"], division: "JUCO", state: "TX", athletics_url: "https://www.roos.com" },
  { school_name: "North Central Texas College", abbreviation: "NCTC", aliases: ["NCTC", "North Central Texas"], division: "JUCO", state: "TX", athletics_url: "https://www.nctcathletics.com" },
  { school_name: "Vernon College", abbreviation: "Vernon", aliases: ["Vernon", "Chaparrals"], division: "JUCO", state: "TX", athletics_url: "https://www.vernoncollege.edu/athletics" },
  { school_name: "Cisco College", abbreviation: "Cisco", aliases: ["Cisco", "Wranglers"], division: "JUCO", state: "TX", athletics_url: "https://www.cisco.edu/athletics" },
  { school_name: "Howard College", abbreviation: "Howard", aliases: ["Howard College", "Hawks"], division: "JUCO", state: "TX", athletics_url: "https://www.hchawk.com" },
  { school_name: "Western Texas College", abbreviation: "WTC", aliases: ["WTC", "Western Texas", "Westerners"], division: "JUCO", state: "TX", athletics_url: "https://www.wtc.edu/athletics" },
  { school_name: "Kilgore College", abbreviation: "Kilgore", aliases: ["Kilgore", "Rangers"], division: "JUCO", state: "TX", athletics_url: "https://www.kilgore.edu/athletics" },
  { school_name: "Navarro College", abbreviation: "Navarro", aliases: ["Navarro", "Bulldogs"], division: "JUCO", state: "TX", athletics_url: "https://navarrobulldogs.com" },
  { school_name: "Dallas College", abbreviation: "Dallas College", aliases: ["Dallas College", "Brookhaven", "Mountain View"], division: "JUCO", state: "TX", athletics_url: "https://www.dallascollege.edu/athletics" },
  { school_name: "Blinn College", abbreviation: "Blinn", aliases: ["Blinn", "Buccaneers", "Bucs"], division: "JUCO", state: "TX", athletics_url: "https://blinn.prestosports.com" },
  { school_name: "San Jacinto College", abbreviation: "San Jac", aliases: ["San Jac", "San Jacinto", "Gators"], division: "JUCO", state: "TX", athletics_url: "https://sanjac.prestosports.com" },
  { school_name: "Trinity Valley Community College", abbreviation: "TVCC", aliases: ["TVCC", "Trinity Valley", "Cardinals"], division: "JUCO", state: "TX", athletics_url: "https://tvcc.prestosports.com" },
  { school_name: "Paris Junior College", abbreviation: "PJC", aliases: ["PJC", "Paris JC", "Dragons"], division: "JUCO", state: "TX", athletics_url: "https://parisjc.prestosports.com" },
  { school_name: "Hill College", abbreviation: "Hill", aliases: ["Hill College", "Rebels"], division: "JUCO", state: "TX", athletics_url: "https://hillcollege.prestosports.com" },
  { school_name: "Clarendon College", abbreviation: "Clarendon", aliases: ["Clarendon", "Bulldogs"], division: "JUCO", state: "TX", athletics_url: "https://www.clarendoncollege.edu" },
  { school_name: "Frank Phillips College", abbreviation: "Frank Phillips", aliases: ["Frank Phillips", "FPC", "Plainsmen"], division: "JUCO", state: "TX", athletics_url: "https://frankphillips.prestosports.com" },
  { school_name: "El Paso Community College", abbreviation: "EPCC", aliases: ["EPCC", "El Paso CC", "Tejanos"], division: "JUCO", state: "TX", athletics_url: "https://epcc.prestosports.com" },
  { school_name: "Ranger College", abbreviation: "Ranger", aliases: ["Ranger", "Rangers"], division: "JUCO", state: "TX", athletics_url: "https://rangercollege.prestosports.com" },
  { school_name: "Trinity University", abbreviation: "Trinity", aliases: ["Trinity", "Tigers"], division: "D3", state: "TX", athletics_url: "https://www.trinity.edu/athletics" },
  { school_name: "Concordia University Texas", abbreviation: "Concordia TX", aliases: ["Concordia Texas", "CTX", "Tornados"], division: "D3", state: "TX", athletics_url: "https://athletics.concordia.edu" },
  { school_name: "University of Dallas", abbreviation: "UDallas", aliases: ["UDallas", "UD", "Crusaders"], division: "D3", state: "TX", athletics_url: "https://udallasathletics.com" },
  { school_name: "Austin College", abbreviation: "Austin College", aliases: ["Austin College", "Kangaroos"], division: "D3", state: "TX", athletics_url: "https://www.austincollege.edu/athletics" },
  { school_name: "Hardin-Simmons University", abbreviation: "HSU", aliases: ["HSU", "Hardin-Simmons", "Cowgirls"], division: "D3", state: "TX", athletics_url: "https://hsusports.com" },
  { school_name: "Howard Payne University", abbreviation: "HPU", aliases: ["HPU", "Howard Payne", "Yellow Jackets"], division: "D3", state: "TX", athletics_url: "https://www.hputx.edu/athletics" },
  { school_name: "University of Mary Hardin-Baylor", abbreviation: "UMHB", aliases: ["UMHB", "Mary Hardin-Baylor", "Crusaders"], division: "D3", state: "TX", athletics_url: "https://www.umhb.edu/athletics" },
  { school_name: "Southwestern University", abbreviation: "Southwestern", aliases: ["Southwestern", "Pirates"], division: "D3", state: "TX", athletics_url: "https://www.southwestern.edu/athletics" },
  { school_name: "Schreiner University", abbreviation: "Schreiner", aliases: ["Schreiner", "Mountaineers"], division: "D3", state: "TX", athletics_url: "https://schreiner.edu/athletics" },
  { school_name: "LeTourneau University", abbreviation: "LETU", aliases: ["LETU", "LeTourneau", "Yellowjackets"], division: "D3", state: "TX", athletics_url: "https://www.letu.edu/athletics" },
  { school_name: "McMurry University", abbreviation: "McMurry", aliases: ["McMurry", "War Hawks"], division: "D3", state: "TX", athletics_url: "https://mcmurrysports.com" },
  { school_name: "University of St. Thomas", abbreviation: "UST", aliases: ["UST", "St. Thomas", "Celts"], division: "D3", state: "TX", athletics_url: "https://www.stthom.edu/athletics" },
  { school_name: "University of Texas at Dallas", abbreviation: "UTD", aliases: ["UTD", "UT Dallas", "Comets"], division: "D3", state: "TX", athletics_url: "https://utdcomets.com" },
  { school_name: "Texas Woman's University", abbreviation: "TWU", aliases: ["TWU", "Texas Woman's", "Pioneers"], division: "D2", state: "TX", athletics_url: "https://twuathletics.com" },
  { school_name: "Texas A&M University-Kingsville", abbreviation: "TAMUK", aliases: ["TAMUK", "A&M Kingsville", "Javelinas"], division: "D2", state: "TX", athletics_url: "https://javelinaathletics.com" },
  { school_name: "Texas A&M International University", abbreviation: "TAMIU", aliases: ["TAMIU", "Dustdevils"], division: "D2", state: "TX", athletics_url: "https://www.tamiu.edu/athletics" },
  { school_name: "University of Texas Permian Basin", abbreviation: "UTPB", aliases: ["UTPB", "Permian Basin", "Falcons"], division: "D2", state: "TX", athletics_url: "https://www.utpb.edu/athletics" },
  { school_name: "Lubbock Christian University", abbreviation: "LCU", aliases: ["LCU", "Lubbock Christian", "Chaps"], division: "D2", state: "TX", athletics_url: "https://lcuchaps.com" },
  { school_name: "St. Mary's University", abbreviation: "St. Mary's", aliases: ["St. Mary's", "Rattlers"], division: "D2", state: "TX", athletics_url: "https://www.rattlerathletics.com" },
  { school_name: "St. Edward's University", abbreviation: "St. Edward's", aliases: ["St. Edward's", "Hilltoppers"], division: "D2", state: "TX", athletics_url: "https://www.stedwards.edu/athletics" },
  { school_name: "Texas Tech University", abbreviation: "TTU", aliases: ["TTU", "Texas Tech", "Red Raiders"], division: "D1", state: "TX", athletics_url: "https://texastech.com" },
  { school_name: "University of Houston", abbreviation: "Houston", aliases: ["Houston", "UH", "Cougars"], division: "D1", state: "TX", athletics_url: "https://uhcougars.com" },
  { school_name: "Texas State University", abbreviation: "Texas State", aliases: ["Texas State", "TXST", "Bobcats"], division: "D1", state: "TX", athletics_url: "https://txst.com" },
  { school_name: "University of Texas at San Antonio", abbreviation: "UTSA", aliases: ["UTSA", "Roadrunners"], division: "D1", state: "TX", athletics_url: "https://goutsa.com" },
  { school_name: "University of Texas at Arlington", abbreviation: "UTA", aliases: ["UTA", "UT Arlington", "Mavericks"], division: "D1", state: "TX", athletics_url: "https://utamavs.com" },
  { school_name: "University of Texas at El Paso", abbreviation: "UTEP", aliases: ["UTEP", "Miners"], division: "D1", state: "TX", athletics_url: "https://utepminers.com" },
  { school_name: "Texas Southern University", abbreviation: "TSU", aliases: ["TSU", "Texas Southern", "Tigers"], division: "D1", state: "TX", athletics_url: "https://tsusports.com" },
  { school_name: "University of the Incarnate Word", abbreviation: "UIW", aliases: ["UIW", "Incarnate Word", "Cardinals"], division: "D1", state: "TX", athletics_url: "https://uiwcardinals.com" },
  { school_name: "Sam Houston State University", abbreviation: "Sam Houston", aliases: ["Sam Houston", "SHSU", "Bearkats"], division: "D1", state: "TX", athletics_url: "https://gobearkats.com" },
  { school_name: "University of North Texas", abbreviation: "UNT", aliases: ["UNT", "North Texas", "Mean Green"], division: "D1", state: "TX", athletics_url: "https://meangreensports.com" },
  { school_name: "TCU", abbreviation: "TCU", aliases: ["TCU", "Texas Christian", "Horned Frogs"], division: "D1", state: "TX", athletics_url: "https://gofrogs.com" },
  { school_name: "Rice University", abbreviation: "Rice", aliases: ["Rice", "Owls"], division: "D1", state: "TX", athletics_url: "https://riceowls.com" },
  { school_name: "Abilene Christian University", abbreviation: "ACU", aliases: ["ACU", "Abilene Christian", "Wildcats"], division: "D1", state: "TX", athletics_url: "https://acusports.com" },
];

const names = new Set(schools.map((s) => s.school_name));
const added = texasAdditions.filter((s) => !names.has(s.school_name));
const merged = [...schools, ...added];

writeFileSync(seedPath, `${JSON.stringify(merged, null, 2)}\n`);

const counts = { JUCO: 0, D3: 0, D2: 0, D1: 0, TX: 0 };
for (const school of merged) {
  counts[school.division] += 1;
  if (school.state === "TX") counts.TX += 1;
}

console.log(`Added ${added.length} Texas schools. Total: ${merged.length} (${counts.TX} in TX)`);
console.log(counts);
