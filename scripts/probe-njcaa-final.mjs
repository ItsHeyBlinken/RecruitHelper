import { chromium } from "playwright";
import * as cheerio from "cheerio";

const URLS = [
  "https://eastfield.prestosports.com/sports/sball/coaches/index",
  "https://brookhaven.prestosports.com/sports/sball/coaches/index",
  "https://northlake.prestosports.com/sports/sball/coaches/index",
  "https://rlcsports.com/sports/sball/coaches/index",
  "https://www.gcvikings.com/sports/sball/coaches/index",
  "https://hillcollegeathletics.com/sports/sball/coaches/index",
  "https://www.rangersports.net/sports/sball/coaches/index",
  "https://www.laredo.edu/athletics",
  "https://laredo.prestosports.com/landing/index",
  "https://www.fpctx.edu/athletics",
  "https://fpclainsports.com/sports/sball/coaches/index",
  "https://www.cisco.edu/athletics/wrangler-sports",
  "https://www.wtc.edu/athletics",
  "https://wtccoyotes.com/sports/sball/coaches/index",
  "https://www.gcwhitecaps.com/sports/sball/coaches/index",
  "https://www.vernoncollege.edu/athletics/softball",
  "https://templecollegeathletics.com/sports/sball/coaches/index",
  "https://www.templejc.edu/athletics",
];

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const browser = await chromium.launch({ headless: true });
for (const url of URLS) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  try {
    const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(1500);
    const final = page.url();
    const html = await page.content();
    const emails = [...new Set((html.match(EMAIL_RE) ?? []).map((e) => e.toLowerCase()))]
      .filter((e) => !e.includes("presto") && !e.includes("sentry") && !e.includes("example"));
    const title = cheerio.load(html)("title").text().trim().slice(0, 70);
    console.log(`${res?.status() ?? "?"} | ${title}`);
    console.log(`  ${url}`);
    console.log(`  → ${final}`);
    if (emails.length) console.log(`  emails: ${emails.slice(0, 4).join(", ")}`);
    else console.log(`  emails: none`);
  } catch (e) {
    console.log(`ERR | ${url}`);
    console.log(`  ${e.message?.slice(0, 90)}`);
  } finally { await ctx.close(); }
}
await browser.close();
