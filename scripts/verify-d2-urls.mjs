/**
 * Crawl NCAA D2 URLs from docs/texas/athletic-websites.md
 * and verify they are suitable for finding softball coach/recruiter emails.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";
import { TEXAS_ATHLETIC_WEBSITES_MD, TEXAS_RESULTS_DIR } from "./texas-doc-paths.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const doc = readFileSync(TEXAS_ATHLETIC_WEBSITES_MD, "utf8");

const D2_SECTION = doc.split("## NCAA D2")[1]?.split("## NCAA D3")[0] ?? "";
const rows = [...D2_SECTION.matchAll(/\|\s*([^|]+?)\s*\|\s*\[([^\]]+)\]\(([^)]+)\)\s*\|/g)];
const schools = rows.map((m) => ({
  name: m[1].trim(),
  url: m[3].trim(),
}));

const SOFTBALL_MARKERS = /softball|sball|w-softbl|wsoftbl|w-softball/i;
const STAFF_MARKERS = /staff.?directory|coaches?|roster|insideathletics\/directory/i;
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const MAILTO_RE = /mailto:([^"'>\s]+)/gi;

const COMMON_PROBE_PATHS = [
  "/sports/softball/coaches",
  "/sports/w-softbl/coaches",
  "/sports/sball/coaches",
  "/sports/softball/roster",
  "/staff-directory",
  "/staff-directory/",
  "/insideAthletics/directory/index",
];

function detectPlatform(html, url) {
  const lower = `${html} ${url}`.toLowerCase();
  if (lower.includes("sidearmsports") || lower.includes("sidearm")) return "Sidearm";
  if (lower.includes("prestosports")) return "PrestoSports";
  if (lower.includes("wmt.digital") || lower.includes("wmtdigital")) return "WMT Digital";
  if (/\.edu\/athletics/i.test(url)) return "College main site";
  return "Other/Unknown";
}

function findStaffLinks($, baseUrl) {
  const links = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    const text = $(el).text().trim();
    if (!href) return;
    const combined = `${text} ${href}`;
    if (STAFF_MARKERS.test(combined) && SOFTBALL_MARKERS.test(combined)) {
      try {
        links.push(new URL(href, baseUrl).href);
      } catch {
        /* skip */
      }
    } else if (STAFF_MARKERS.test(href) && SOFTBALL_MARKERS.test(href)) {
      try {
        links.push(new URL(href, baseUrl).href);
      } catch {
        /* skip */
      }
    } else if (/staff-directory|insideathletics\/directory/i.test(href)) {
      try {
        links.push(new URL(href, baseUrl).href);
      } catch {
        /* skip */
      }
    } else if (SOFTBALL_MARKERS.test(href) && /coach|roster|staff/i.test(href)) {
      try {
        links.push(new URL(href, baseUrl).href);
      } catch {
        /* skip */
      }
    }
  });
  return [...new Set(links)].slice(0, 8);
}

function extractEmails(html) {
  const emails = new Set();
  for (const m of html.matchAll(EMAIL_RE)) {
    const e = m[0].toLowerCase();
    if (!e.endsWith(".png") && !e.endsWith(".jpg") && !e.includes("example.com")) {
      emails.add(e);
    }
  }
  for (const m of html.matchAll(MAILTO_RE)) {
    emails.add(m[1].toLowerCase().split("?")[0]);
  }
  return [...emails];
}

function schoolNameOnPage(name, html) {
  const tokens = name
    .replace(/University|College/gi, "")
    .split(/\s+/)
    .map((t) => t.replace(/['.]/g, ""))
    .filter((t) => t.length > 3);
  const lower = html.toLowerCase();
  const hits = tokens.filter((t) => lower.includes(t.toLowerCase()));
  return hits.length >= Math.min(2, tokens.length);
}

async function fetchPage(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent": "RecruitConnect-URL-Verifier/1.0",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
    });
    const finalUrl = res.url;
    const status = res.status;
    let html = "";
    const ct = res.headers.get("content-type") ?? "";
    if (ct.includes("text/html") || ct.includes("application/xhtml")) {
      html = await res.text();
    }
    return { status, finalUrl, html, error: null };
  } catch (err) {
    return { status: 0, finalUrl: url, html: "", error: err instanceof Error ? err.message : String(err) };
  } finally {
    clearTimeout(timer);
  }
}

function rateVerdict(result) {
  const { status, html, finalUrl, requestedUrl, staffLinks, emails, platform, softballOnPage, schoolMatch } = result;

  if (status === 0 || status >= 400) {
    return { verdict: "FAIL", reason: `HTTP ${status || "error"}: ${result.error ?? "unreachable"}` };
  }

  const redirected = new URL(finalUrl).hostname !== new URL(requestedUrl).hostname;

  if (!schoolMatch && redirected) {
    return { verdict: "FAIL", reason: `Redirects to unrelated host: ${new URL(finalUrl).hostname}` };
  }

  if (emails.length > 0) {
    return { verdict: "GOOD", reason: `${emails.length} email(s) found` };
  }
  if (staffLinks.length > 0 && (platform === "Sidearm" || platform === "PrestoSports" || platform === "WMT Digital")) {
    return { verdict: "GOOD", reason: `${platform} + staff/coach link(s) found` };
  }
  if (staffLinks.length > 0) {
    return { verdict: "LIKELY", reason: `Staff/coach links found (${staffLinks.length})` };
  }
  if (softballOnPage && (platform === "Sidearm" || platform === "PrestoSports" || platform === "WMT Digital")) {
    return { verdict: "LIKELY", reason: `${platform} site with softball content` };
  }
  if (!softballOnPage) {
    return { verdict: "CHECK", reason: "No softball content detected on landing page" };
  }
  if (redirected) {
    return { verdict: "CHECK", reason: `Redirects to different host: ${new URL(finalUrl).hostname}` };
  }
  return { verdict: "CHECK", reason: "Loads but no obvious coach email path" };
}

async function probeForEmails(baseUrl, staffLinks) {
  const probed = [];
  const urlsToTry = [...staffLinks];

  for (const path of COMMON_PROBE_PATHS) {
    try {
      urlsToTry.push(new URL(path, baseUrl).href);
    } catch {
      /* skip */
    }
  }

  const seen = new Set();
  for (const url of urlsToTry) {
    if (seen.has(url)) continue;
    seen.add(url);

    const page = await fetchPage(url);
    if (page.status < 400 && page.html) {
      const emails = extractEmails(page.html);
      probed.push({ url: page.finalUrl, status: page.status, emails });
      if (emails.length > 0) {
        return { probedUrl: page.finalUrl, emails, probed };
      }
    }
    await new Promise((r) => setTimeout(r, 150));
  }

  return { probedUrl: probed[0]?.url ?? null, emails: [], probed };
}

async function verifySchool(school) {
  const home = await fetchPage(school.url);
  const $ = cheerio.load(home.html || "<html></html>");
  const softballOnPage = SOFTBALL_MARKERS.test(home.html) || SOFTBALL_MARKERS.test($("title").text());
  const platform = detectPlatform(home.html, home.finalUrl);
  const staffLinks = home.html ? findStaffLinks($, home.finalUrl) : [];
  let emails = home.html ? extractEmails(home.html) : [];
  const schoolMatch = home.html ? schoolNameOnPage(school.name, home.html) : false;

  let probedUrl = null;
  let probed = [];
  if (emails.length === 0) {
    const probeResult = await probeForEmails(home.finalUrl || school.url, staffLinks);
    probedUrl = probeResult.probedUrl;
    emails = probeResult.emails;
    probed = probeResult.probed;
  }

  const result = {
    name: school.name,
    requestedUrl: school.url,
    status: home.status,
    finalUrl: home.finalUrl,
    error: home.error,
    platform,
    softballOnPage,
    schoolMatch,
    staffLinks,
    probedUrl,
    probed,
    emails: emails.slice(0, 5),
    emailCount: emails.length,
  };

  const { verdict, reason } = rateVerdict({ ...result, requestedUrl: school.url });
  result.verdict = verdict;
  result.reason = reason;
  return result;
}

console.log(`Verifying ${schools.length} NCAA D2 URLs...\n`);

const results = [];
for (const school of schools) {
  process.stdout.write(`  ${school.name}...`);
  const r = await verifySchool(school);
  results.push(r);
  console.log(` ${r.verdict}`);
  await new Promise((r) => setTimeout(r, 300));
}

const byVerdict = { GOOD: [], LIKELY: [], CHECK: [], FAIL: [] };
for (const r of results) byVerdict[r.verdict].push(r);

console.log("\n========== SUMMARY ==========");
console.log(`GOOD:   ${byVerdict.GOOD.length}`);
console.log(`LIKELY: ${byVerdict.LIKELY.length}`);
console.log(`CHECK:  ${byVerdict.CHECK.length}`);
console.log(`FAIL:   ${byVerdict.FAIL.length}`);

function printGroup(label, items) {
  if (items.length === 0) return;
  console.log(`\n--- ${label} (${items.length}) ---`);
  for (const r of items) {
    console.log(`\n${r.name}`);
    console.log(`  URL:     ${r.requestedUrl}`);
    if (r.finalUrl !== r.requestedUrl) console.log(`  Final:   ${r.finalUrl}`);
    console.log(`  Status:  ${r.status}${r.error ? ` (${r.error})` : ""}`);
    console.log(`  Platform: ${r.platform}`);
    console.log(`  Softball on page: ${r.softballOnPage}`);
    console.log(`  School name match: ${r.schoolMatch}`);
    console.log(`  Reason:  ${r.reason}`);
    if (r.staffLinks.length) console.log(`  Staff links: ${r.staffLinks.slice(0, 3).join(", ")}`);
    if (r.probedUrl) console.log(`  Probed:  ${r.probedUrl}`);
    if (r.emails.length) console.log(`  Emails:  ${r.emails.join(", ")}`);
  }
}

printGroup("FAIL — fix URL", byVerdict.FAIL);
printGroup("CHECK — review manually", byVerdict.CHECK);
printGroup("LIKELY — probably OK", byVerdict.LIKELY);
printGroup("GOOD — verified", byVerdict.GOOD);

const outPath = resolve(TEXAS_RESULTS_DIR, "d2-url-verification-results.json");
writeFileSync(outPath, JSON.stringify(results, null, 2));
console.log(`\nFull results written to ${outPath}`);
