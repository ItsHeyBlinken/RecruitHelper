/**
 * Targeted probe of remaining NJCAA URLs with fresh browser contexts.
 */
import { chromium } from "playwright";
import * as cheerio from "cheerio";

const PROBES = [
  { name: "Howard College", urls: ["https://www.hchawk.com", "https://hchawk.com"] },
  { name: "Navarro College", urls: ["https://navarrobulldogs.com", "https://www.navarrobulldogs.com"] },
  { name: "Cisco College", urls: ["https://www.cisco.edu/athletics", "https://cisco.edu/athletics", "https://ciscoathletics.com"] },
  { name: "Dallas College Brookhaven", urls: ["https://brookhavenathletics.com", "https://www.brookhavenathletics.com", "https://dallascollege.edu/athletics/brookhaven"] },
  { name: "Dallas College Eastfield", urls: ["https://eastfieldathletics.com", "https://www.eastfieldathletics.com", "https://dallascollege.edu/athletics/eastfield"] },
  { name: "Dallas College North Lake", urls: ["https://northlakeathletics.com", "https://www.northlakeathletics.com", "https://dallascollege.edu/athletics/northlake"] },
  { name: "Dallas College Richland", urls: ["https://richlandathletics.com", "https://www.richlandathletics.com", "https://dallascollege.edu/athletics/richland"] },
  { name: "El Paso CC", urls: ["https://www.epcc.edu/Athletics", "https://epccathletics.com", "https://www.epccathletics.com"] },
  { name: "Frank Phillips College", urls: ["https://www.fpclainsports.com", "https://fpclainsports.com", "https://www.fpctx.edu/athletics"] },
  { name: "Grayson College", urls: ["https://graysonvikings.com", "https://www.graysonvikings.com", "https://www.grayson.edu/athletics"] },
  { name: "Hill College", urls: ["https://hillcollegerebels.com", "https://www.hillcollegerebels.com", "https://www.hillcollege.edu/athletics"] },
  { name: "Kilgore College", urls: ["https://www.kcrangernation.com", "https://kcrangernation.com", "https://www.kilgore.edu/athletics"] },
  { name: "Laredo College", urls: ["https://www.laredo.edu/athletics", "https://laredoathletics.com", "https://www.laredoathletics.com"] },
  { name: "McLennan CC", urls: ["https://mclennanathletics.com", "https://www.mclennanathletics.com"] },
  { name: "Midland College", urls: ["https://gochaps.com", "https://www.gochaps.com"] },
  { name: "NCTC", urls: ["https://nctcathletics.com", "https://www.nctcathletics.com"] },
  { name: "Odessa College", urls: ["https://wranglersports.com", "https://www.wranglersports.com"] },
  { name: "Paris JC", urls: ["https://www.pjc.edu/athletics", "https://pjcathletics.com", "https://www.pjcathletics.com"] },
  { name: "Ranger College", urls: ["https://rangercollegeathletics.com", "https://www.rangercollegeathletics.com", "https://www.rangercollege.edu/athletics"] },
  { name: "South Plains College", urls: ["https://spctexans.com", "https://www.spctexans.com"] },
  { name: "SWTJC", urls: ["https://www.swtjc.edu/athletics", "https://swtjcathletics.com"] },
  { name: "Texarkana College", urls: ["https://www.texarkanacollege.edu/athletics", "https://texarkanacollegeathletics.com"] },
  { name: "Tyler JC", urls: ["https://apacheathletics.com", "https://www.apacheathletics.com"] },
  { name: "Weatherford College", urls: ["https://wcathletics.com", "https://www.wcathletics.com", "https://www.wc.edu/athletics"] },
  { name: "Western Texas College", urls: ["https://wtccoyotes.com", "https://www.wtccoyotes.com", "https://www.wtc.edu/athletics"] },
  { name: "Vernon College", urls: ["https://www.vernoncollege.edu/athletics", "https://vernoncollegeathletics.com"] },
  { name: "Clarendon College", urls: ["https://clarendonbulldogs.com/landing/index", "https://clarendonbulldogs.com/sports/sball/coaches/index"] },
  { name: "Galveston College", urls: ["https://www.whitecapsports.com/", "https://whitecapsports.com/sports/softball/coaches"] },
];

const SOFTBALL = /softball|sball|w-softbl/i;
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const browser = await chromium.launch({ headless: true });
const results = [];

for (const probe of PROBES) {
  let best = null;
  for (const url of probe.urls) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    try {
      const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
      await page.waitForTimeout(2500);
      const finalUrl = page.url();
      if (finalUrl.startsWith("chrome-error")) throw new Error("chrome error");
      const html = await page.content();
      const $ = cheerio.load(html);
      const softball = SOFTBALL.test(html);
      const emails = [...new Set((html.match(EMAIL_RE) ?? []).map((e) => e.toLowerCase()))]
        .filter((e) => !e.endsWith(".png") && !e.includes("sentry") && !e.includes("example"));
      const coachLinks = [];
      $("a[href]").each((_, el) => {
        const href = $(el).attr("href") ?? "";
        if (/coach|staff-directory|roster/i.test(href) && SOFTBALL.test(href)) {
          try { coachLinks.push(new URL(href, finalUrl).href); } catch { /* */ }
        }
      });
      const platform = /sidearm/i.test(html) ? "Sidearm" : /presto/i.test(html) ? "PrestoSports" : "Other";
      const status = res?.status() ?? 0;
      const score = (status < 400 ? 10 : 0) + (softball ? 5 : 0) + coachLinks.length * 3 + emails.length * 2;
      const row = { url, finalUrl, status, softball, platform, coachLinks: coachLinks.slice(0, 2), emails: emails.slice(0, 3), score, htmlLen: html.length };
      if (!best || score > best.score) best = row;
      if (score >= 15) break;
    } catch (err) {
      if (!best) best = { url, error: err.message?.slice(0, 80), score: -1 };
    } finally {
      await ctx.close();
    }
  }
  results.push({ name: probe.name, ...best });
  const tag = best?.score >= 15 ? "GOOD" : best?.score >= 10 ? "LIKELY" : best?.score >= 0 ? "CHECK" : "FAIL";
  console.log(`${probe.name}: ${tag}`);
  if (best?.finalUrl) console.log(`  → ${best.finalUrl} (${best.platform}, sb=${best.softball}, coaches=${best.coachLinks?.length ?? 0}, emails=${best.emails?.length ?? 0})`);
  else if (best?.error) console.log(`  → ERROR: ${best.error}`);
}

await browser.close();
console.log("\n=== BEST URLS ===");
for (const r of results.filter((r) => r.score >= 10)) {
  console.log(`${r.name}: ${r.finalUrl}`);
  if (r.coachLinks?.length) console.log(`  Coach path: ${r.coachLinks[0]}`);
  if (r.emails?.length) console.log(`  Emails: ${r.emails.join(", ")}`);
}
