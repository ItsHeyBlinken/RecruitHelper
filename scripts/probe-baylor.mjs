import { writeFileSync } from "fs";
import { fetchHtml, closeBrowser } from "../scraper/src/fetcher.js";
import { parseSoftballStaffDirectory, discoverSoftballStaffProfileLinks } from "../scraper/src/parsers/staff-directory.js";
import { parseStaffProfilePage } from "../scraper/src/staff-profiles.js";
import { discoverStaffProfileLinks } from "../scraper/src/staff-profiles.js";

const dirUrl = "https://baylorbears.com/staff-directory";
const profileUrl = "https://baylorbears.com/staff-directory/glenn-moore/310";

const dirHtml = await fetchHtml(dirUrl, true);
writeFileSync("scraper/scripts/baylor-staff-directory.html", dirHtml);

const profileHtml = await fetchHtml(profileUrl, true);
writeFileSync("scraper/scripts/baylor-glenn-moore.html", profileHtml);

console.log("directory softball contacts", parseSoftballStaffDirectory(dirHtml).length);
console.log("softball profile links", discoverSoftballStaffProfileLinks(dirHtml, dirUrl).length);
console.log("all profile links", discoverStaffProfileLinks(dirHtml, dirUrl).length);
console.log("profile parse", JSON.stringify(parseStaffProfilePage(profileHtml, profileUrl), null, 2));

await closeBrowser();
