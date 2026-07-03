import { fetchHtml } from "../scraper/src/fetcher.ts";
import {
  parseSoftballStaffDirectory,
  discoverSoftballStaffProfileLinks,
} from "../scraper/src/parsers/staff-directory.ts";
import { parseStaffProfilePage } from "../scraper/src/staff-profiles.ts";

const url = "https://texassports.com/staff-directory?path=general";
const html = await fetchHtml(url, true);
const contacts = parseSoftballStaffDirectory(html);
console.log("Directory contacts:", JSON.stringify(contacts, null, 2));
const links = discoverSoftballStaffProfileLinks(html, url);
console.log("Profile links:", links);
for (const link of links.slice(0, 4)) {
  const phtml = await fetchHtml(link, true);
  const profile = parseStaffProfilePage(phtml, link);
  const mailtos = [...phtml.matchAll(/mailto:([^"'?]+)/gi)].map((m) => m[1].toLowerCase());
  console.log("\n---", link);
  console.log("profile:", profile);
  console.log("mailtos:", [...new Set(mailtos)]);
}
