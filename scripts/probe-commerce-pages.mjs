import { parseSoftballStaffDirectory } from "../scraper/src/parsers/staff-directory.ts";
import { parsePage } from "../scraper/src/parsers/index.ts";
import { normalizeContacts } from "../scraper/src/normalize.ts";

const urls = [
  "https://lionathletics.com/staff-directory",
  "https://lionathletics.com/sports/softball/staff",
];

for (const url of urls) {
  const res = await fetch(url);
  const html = await res.text();
  const directory = parseSoftballStaffDirectory(html);
  const page = normalizeContacts(parsePage(html, url));
  console.log("\n===", url, "===");
  console.log("parseSoftballStaffDirectory:", directory.length, directory.map((c) => c.coach_name));
  console.log("parsePage (normalized):", page.length, page.map((c) => `${c.coach_name} (${c.title})`));
}
