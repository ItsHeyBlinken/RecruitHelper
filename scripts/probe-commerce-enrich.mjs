import { fetchHtml } from "../scraper/src/fetcher.ts";
import { parsePage } from "../scraper/src/parsers/index.ts";
import { normalizeContacts } from "../scraper/src/normalize.ts";
import {
  discoverSoftballStaffProfileLinks,
  parseSoftballStaffDirectory,
} from "../scraper/src/parsers/staff-directory.ts";
import { enrichContactsFromStaffProfiles } from "../scraper/src/staff-profiles.ts";
import { isSoftballStaffProfilePage, parseStaffProfilePage } from "../scraper/src/staff-profiles.ts";

const url = "https://lionathletics.com/staff-directory";
const html = await fetchHtml(url, true);
const links = discoverSoftballStaffProfileLinks(html, url);
console.log("profile links:", links.length, links.slice(0, 5));

const parsed = normalizeContacts(parsePage(html, url));
console.log("parsePage:", parsed.length, parsed.map((c) => c.coach_name));

const enriched = await enrichContactsFromStaffProfiles(parsed, html, url);
console.log("after profile enrich:", enriched.length);
console.log(enriched.map((c) => `${c.coach_name} | ${c.title}`).slice(0, 10));

// Test isSoftballStaffProfilePage on a football coach
const footballUrl = "https://lionathletics.com/staff-directory/clint-dolezel/1374";
const footballHtml = await fetchHtml(footballUrl, true);
const footballProfile = parseStaffProfilePage(footballHtml, footballUrl);
console.log("\nFootball profile:", footballProfile);
console.log(
  "isSoftballStaffProfilePage:",
  footballProfile && isSoftballStaffProfilePage(footballHtml, footballProfile),
);
console.log("html includes softball:", footballHtml.toLowerCase().includes("softball"));
