import { loadSeedSchools, findSeedSchool, scrapeSchool } from "../scraper/src/scraper.ts";

const school = findSeedSchool(loadSeedSchools(), "University of Texas");
if (!school) throw new Error("not found");
const result = await scrapeSchool(school);
console.log("staff_page_url:", result.staff_page_url);
for (const c of result.contacts) {
  console.log(JSON.stringify({ name: c.coach_name, title: c.title, email: c.email }));
}
