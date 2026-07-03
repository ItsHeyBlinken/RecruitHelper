import { fetchHtml } from "../scraper/src/fetcher.ts";
import { parseStaffProfilePage } from "../scraper/src/staff-profiles.ts";

const profiles = [
  "https://texaslonghorns.com/sports/softball/roster/coaches/mike-white",
  "https://texaslonghorns.com/sports/softball/roster/coaches/amber-freeman",
  "https://texaslonghorns.com/sports/softball/roster/coaches/richard-fremin-iii",
  "https://texaslonghorns.com/sports/softball/roster/coaches/pattie-ruth-taylor",
];

for (const url of profiles) {
  try {
    const html = await fetchHtml(url, true);
    const profile = parseStaffProfilePage(html, url);
    console.log(url.split("/").pop(), "->", profile);
  } catch (e) {
    console.log(url, "error:", e instanceof Error ? e.message : e);
  }
}
