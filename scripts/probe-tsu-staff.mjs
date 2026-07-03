import { writeFileSync } from "fs";
import { fetchHtml } from "../scraper/src/fetcher.js";
import { parseSoftballStaffDirectory } from "../scraper/src/parsers/staff-directory.js";
import { parseStaffPage } from "../scraper/src/parse.js";
import { closeBrowser } from "../scraper/src/fetcher.js";

const url = "https://tsusports.com/staff-directory";
const html = await fetchHtml(url);
writeFileSync("scraper/scripts/tsu-staff-directory.html", html);
console.log("html length", html.length);
console.log("staff-dir parser", parseSoftballStaffDirectory(html).length);
console.log("sidearm parseStaffPage", parseStaffPage(html).length);

const lower = html.toLowerCase();
const idx = lower.indexOf("softball");
console.log("softball index", idx);
if (idx >= 0) console.log("context", html.slice(Math.max(0, idx - 80), idx + 200));

await closeBrowser();
