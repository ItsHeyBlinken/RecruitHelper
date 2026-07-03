import { readFileSync } from "fs";
import { parseSoftballStaffDirectory } from "../scraper/src/parsers/staff-directory.js";
import { parsePage } from "../scraper/src/parsers/index.js";
import { parseStaffProfilePage } from "../scraper/src/staff-profiles.js";

const dir = readFileSync("scraper/scripts/baylor-staff-directory.html", "utf8");
const prof = readFileSync("scraper/scripts/baylor-glenn-moore.html", "utf8");

console.log(parseSoftballStaffDirectory(dir));
console.log(parseStaffProfilePage(prof, "https://baylorbears.com/staff-directory/glenn-moore/310"));
console.log(parsePage(prof, "https://baylorbears.com/staff-directory/glenn-moore/310"));
