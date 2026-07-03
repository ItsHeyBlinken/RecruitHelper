/**
 * Re-verify NJCAA URLs with Playwright for bot-protected sites.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import * as cheerio from "cheerio";

import { TEXAS_RESULTS_DIR } from "./texas-doc-paths.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const priorPath = resolve(TEXAS_RESULTS_DIR, "njcaa-url-verification-results.json");
const prior = JSON.parse(readFileSync(priorPath, "utf8"));

// Known corrections from prior scraping sessions
const ALT_URLS = {
  "Howard College": ["https://hchawks.com", "https://www.hchawks.com"],
  "Navarro College": ["https://navarrobulldogs.com", "https://www.navarrobulldogs.com"],
  "Cisco College": ["https://www.cisco.edu/athletics", "https://cisco.edu/athletics"],
  "Galveston College": ["https://www.gc.edu/athletics", "https://whitecapsports.com"],
  "Grayson College": ["https://graysonvikings.com", "https://www.graysonvikings.com"],
  "Hill College": ["https://hillcollegerebels.com", "https://www.hillcollegerebels.com"],
  "Alvin College": ["https://www.alvincollege.edu/athletics", "https://alvincollege.edu/athletics"],
  "El Paso Community College": ["https://www.epcc.edu/Athletics", "https://epccathletics.com"],
  "Paris Junior College": ["https://www.pjc.edu/athletics", "https://pjcathletics.com"],
  "Laredo College": ["https://www.laredo.edu/athletics", "https://laredoathletics.com"],
  "Southwest Texas Junior College": ["https://www.swtjc.edu/athletics", "https://swtjcathletics.com"],
  "Texarkana College": ["https://www.texarkanacollege.edu/athletics", "https://texarkanacollegeathletics.com"],
  "Western Texas College": ["https://www.wtccoyotes.com", "https://wtccoyotes.com"],
  "Frank Phillips College": ["https://www.fpclainsports.com"],
  "Ranger College": ["https://www.rangercollegeathletics.com"],
  "Temple College": ["https://www.templecollegeathletics.com", "https://templecollegeathletics.com"],
  "Vernon College": ["https://www.vernoncollege.edu/athletics", "https://vernoncollegeathletics.com"],
};

const SOFTBALL_MARKERS = /softball|sball|w-softbl|wsoftbl|w-softball/i;
const STAFF_MARKERS = /staff.?directory|coaches?|roster|insideathletics\/directory/i;
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

function detectPlatform(html, url) {
  const lower = `${html} ${url}`.toLowerCase();
  if (lower.includes("sidearmsports") || lower.includes("sidearm")) return "Sidearm";
  if (lower.includes("prestosports")) return "PrestoSports";
  if (lower.includes("wmt.digital")) return "WMT Digital";
  if (/\.edu\/athletics/i.test(url)) return "College main site";
  return "Other";
}

function analyze(html, url) {
  const $ = cheerio.load(html);
  const softball = SOFTBALL_MARKERS.test(html) || SOFTBALL_MARKERS.test($("title").text());
  const platform = detectPlatform(html, url);
  const staffLinks = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    const text = $(el).text();
    const combined = `${text} ${href}`;
    if ((STAFF_MARKERS.test(combined) && SOFTBALL_MARKERS.test(combined)) ||
        /staff-directory|insideathletics\/directory/i.test(href)) {
      try { staffLinks.push(new URL(href, url).href); } catch { /* */ }
    }
  });
  const emails = [...new Set((html.match(EMAIL_RE) ?? []).map((e) => e.toLowerCase()))]
    .filter((e) => !e.endsWith(".png") && !e.includes("example.com") && !e.includes("sentry"));
  return { softball, platform, staffLinks: [...new Set(staffLinks)].slice(0, 3), emails: emails.slice(0, 5) };
}

const toCheck = prior.filter((r) => r.verdict === "FAIL" || r.verdict === "CHECK" || r.status === 202);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const results = [];

for (const school of toCheck) {
  const urls = [school.requestedUrl, ...(ALT_URLS[school.name] ?? [])];
  let best = null;

  for (const url of urls) {
    try {
      const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
      await page.waitForTimeout(2000);
      const finalUrl = page.url();
      const status = res?.status() ?? 0;
      const html = await page.content();
      const info = analyze(html, finalUrl);
      const score =
        (status >= 200 && status < 400 ? 10 : 0) +
        (info.softball ? 5 : 0) +
        (info.staffLinks.length * 3) +
        (info.emails.length * 2) +
        (info.platform === "Sidearm" || info.platform === "PrestoSports" ? 4 : 0);

      if (!best || score > best.score) {
        best = { url, finalUrl, status, score, ...info, htmlLen: html.length };
      }
      if (score >= 15) break;
    } catch (err) {
      if (!best) best = { url, error: err.message, score: -1 };
    }
  }

  const verdict =
    best?.score >= 15 ? "GOOD" :
    best?.score >= 10 ? "LIKELY" :
    best?.score >= 5 ? "CHECK" :
    "FAIL";

  results.push({ name: school.name, priorVerdict: school.verdict, ...best, verdict });
  console.log(`${school.name}: ${verdict} (${best?.finalUrl ?? best?.url ?? "n/a"})`);
}

await browser.close();

writeFileSync(resolve(TEXAS_RESULTS_DIR, "njcaa-url-verification-playwright.json"), JSON.stringify(results, null, 2));

// Print summary of recommended URL changes
console.log("\n=== RECOMMENDED URL UPDATES ===");
for (const r of results) {
  if (r.finalUrl && r.finalUrl !== prior.find((p) => p.name === r.name)?.requestedUrl && r.verdict !== "FAIL") {
    const orig = prior.find((p) => p.name === r.name)?.requestedUrl;
    console.log(`${r.name}`);
    console.log(`  Was:  ${orig}`);
    console.log(`  Use:  ${r.finalUrl}`);
    console.log(`  Why:  ${r.platform}, softball=${r.softball}, staff=${r.staffLinks?.length ?? 0}, emails=${r.emails?.length ?? 0}`);
  }
}
