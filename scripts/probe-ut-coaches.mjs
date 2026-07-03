import { fetchHtml } from "../scraper/src/fetcher.ts";
import { parsePage } from "../scraper/src/parsers/index.ts";
import { discoverSoftballStaffCandidates } from "../scraper/src/discover.ts";
import { discoverStaffProfileLinks, parseStaffProfilePage } from "../scraper/src/staff-profiles.ts";
import { isSoftballCoachProfileHref } from "../scraper/src/discover.ts";
import { normalizeContacts } from "../scraper/src/normalize.ts";

const urls = [
  "https://texassports.com",
  "https://texaslonghorns.com/sports/softball/roster/coaches",
  "https://texassports.com/sports/softball/roster/coaches",
];

for (const url of urls) {
  console.log("\n===", url, "===");
  try {
    const html = await fetchHtml(url, true);
    const candidates = url.includes("texassports.com") && !url.includes("/sports/")
      ? discoverSoftballStaffCandidates(url, html)
      : [];
    if (candidates.length) console.log("candidates:", candidates.filter((c) => c.includes("coach")).slice(0, 10));
    const contacts = normalizeContacts(parsePage(html, url));
    console.log("parsed contacts:", contacts);
    const profiles = discoverStaffProfileLinks(html, url);
    console.log("profile links:", profiles.slice(0, 8));
  } catch (e) {
    console.log("error:", e instanceof Error ? e.message : e);
  }
}

const singleton =
  "https://texaslonghorns.com/sports/softball/roster/coaches/steve-singleton/3419";
console.log("\n=== singleton profile ===");
console.log("matches coach href:", isSoftballCoachProfileHref(singleton));
const sh = await fetchHtml(singleton, true);
console.log("profile:", parseStaffProfilePage(sh, singleton));
