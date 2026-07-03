import { writeFileSync } from "node:fs";
import { fetchHtml, loadCheerio } from "../scraper/src/fetcher.ts";
import { isSoftballCoachProfileHref } from "../scraper/src/discover.ts";

const url = "https://texaslonghorns.com/sports/softball/roster/coaches";
const html = await fetchHtml(url, true);
writeFileSync("scripts/ut-coaches-list.html", html);

const $ = loadCheerio(html);
const coachLinks = [];
$("a[href]").each((_, el) => {
  const href = $(el).attr("href") ?? "";
  if (isSoftballCoachProfileHref(href) || /roster\/coaches\//i.test(href)) {
    coachLinks.push(`${href} | ${$(el).text().trim().slice(0, 40)}`);
  }
});
console.log("coach links:", [...new Set(coachLinks)]);

const rosterCoach = /\/roster\/coaches\/[^/]+\/\d+/gi;
const matches = [...html.matchAll(rosterCoach)].map((m) => m[0]);
console.log("regex links:", [...new Set(matches)]);
