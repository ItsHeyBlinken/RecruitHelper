/** Quick probe of coach pages and softball presence for borderline NJCAA schools */
import { chromium } from "playwright";
import * as cheerio from "cheerio";

const PROBES = [
  { name: "Navarro coaches", url: "https://navarrobulldogs.com/sports/softball/coaches" },
  { name: "Howard coaches", url: "https://www.hchawk.com/sports/sball/coaches/index" },
  { name: "Brookhaven sb", url: "https://brookhavenathletics.com/sports/sball/coaches/index" },
  { name: "Eastfield sb", url: "https://eastfieldathletics.com/sports/sball/coaches/index" },
  { name: "North Lake sb", url: "https://northlakecollegeathletics.com/sports/sball/coaches/index" },
  { name: "Richland sb", url: "https://richlandathletics.com/sports/sball/coaches/index" },
  { name: "EPCC softball", url: "https://www.epcc.edu/Services/Athletics/softball" },
  { name: "Grayson vikings", url: "https://graysonvikings.com/landing/index" },
  { name: "Hill rebels", url: "https://hillcollegerebels.com/landing/index" },
  { name: "Ranger athletics", url: "https://rangercollegeathletics.com/landing/index" },
  { name: "Texarkana athletics", url: "https://texarkanacollegeathletics.com/landing/index" },
  { name: "Laredo athletics", url: "https://laredoathletics.com/landing/index" },
  { name: "Frank Phillips", url: "https://fpclainsports.com/landing/index" },
  { name: "Cisco sb", url: "https://www.cisco.edu/athletics/softball" },
  { name: "SWTJC athletics", url: "https://www.swtjc.edu/athletics" },
  { name: "Galveston coaches", url: "https://www.whitecapsports.com/sports/softball/coaches" },
  { name: "Vernon sb", url: "https://www.vernoncollege.edu/athletics/softball" },
  { name: "Temple athletics", url: "https://templecollegeathletics.com/landing/index" },
];

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const browser = await chromium.launch({ headless: true });

for (const p of PROBES) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  try {
    const res = await page.goto(p.url, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(2000);
    const finalUrl = page.url();
    const html = await page.content();
    const $ = cheerio.load(html);
    const title = $("title").text().trim();
    const emails = [...new Set((html.match(EMAIL_RE) ?? []).map((e) => e.toLowerCase()))]
      .filter((e) => !e.includes("sentry") && !e.endsWith(".png") && !e.includes("example") && !e.includes("presto"));
    const coaches = [];
    $("h2,h3,h4,td,.staff-name,.sidearm-roster-coach-name").each((_, el) => {
      const t = $(el).text().trim();
      if (/coach/i.test(t) && t.length < 80) coaches.push(t);
    });
    console.log(`\n${p.name}`);
    console.log(`  Status: ${res?.status()} → ${finalUrl}`);
    console.log(`  Title: ${title.slice(0, 80)}`);
    console.log(`  Emails (${emails.length}): ${emails.slice(0, 5).join(", ") || "none"}`);
    if (coaches.length) console.log(`  Coach text: ${coaches.slice(0, 4).join(" | ")}`);
  } catch (e) {
    console.log(`\n${p.name}: ERROR ${e.message?.slice(0, 100)}`);
  } finally {
    await ctx.close();
  }
}
await browser.close();
