import { load as loadCheerio } from "cheerio";

const D3_SCHOOLS = [
  { name: "Austin College", url: "https://acroos.com" },
  { name: "Concordia University Texas", url: "https://athletics.concordia.edu" },
  { name: "East Texas Baptist University", url: "https://etbuathletics.com" },
  { name: "Hardin-Simmons University", url: "https://hsuathletics.com" },
  { name: "Howard Payne University", url: "https://hputx.edu/athletics" },
  { name: "LeTourneau University", url: "https://letuathletics.com" },
  { name: "McMurry University", url: "https://mcmurryads.com" },
  { name: "Schreiner University", url: "https://schreinerathletics.com" },
  { name: "Southwestern University", url: "https://southwesternpirates.com" },
  { name: "Sul Ross State University", url: "https://srlobos.com" },
  { name: "Texas Lutheran University", url: "https://tlubulldogs.com" },
  { name: "Trinity University", url: "https://trinitytigers.com" },
  { name: "University of Dallas", url: "https://udallasathletics.com" },
  { name: "University of Mary Hardin-Baylor", url: "https://cruathletics.com" },
  { name: "University of St. Thomas (Houston)", url: "https://ustcelts.com" },
];

const STAFF_PATHS = [
  "/staff-directory",
  "/insideAthletics/directory/index",
  "/sports/sb/roster",
  "/sports/sball/coaches",
  "/sports/softball/coaches",
  "/sports/w-softbl/roster",
  "/sports/softball/roster",
];

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

async function fetchPage(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "RecruitConnect-URL-Verifier/1.0 (+https://github.com/recruitconnect)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    const html = await res.text();
    return { ok: res.ok, status: res.status, finalUrl: res.url, html };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      finalUrl: url,
      html: "",
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

function resolveUrl(base, href) {
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

function analyzeHomepage(html, baseUrl) {
  const $ = loadCheerio(html);
  const title = $("title").text().trim();
  const bodyText = $("body").text().toLowerCase();
  const hasSoftball = bodyText.includes("softball");

  const links = new Set();
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    const lower = href.toLowerCase();
    if (
      lower.includes("softball") ||
      lower.includes("sball") ||
      lower.includes("w-softbl") ||
      lower.includes("staff-directory") ||
      lower.includes("directory")
    ) {
      const resolved = resolveUrl(baseUrl, href);
      if (resolved) links.add(resolved);
    }
  });

  return { links: [...links], title, hasSoftball };
}

function countEmails(html) {
  const matches = html.match(EMAIL_RE) ?? [];
  const filtered = matches.filter(
    (email) =>
      !email.endsWith(".png") &&
      !email.endsWith(".jpg") &&
      !email.includes("example.com") &&
      !email.includes("sentry.io"),
  );
  return [...new Set(filtered)];
}

async function probeStaffPaths(baseUrl) {
  const base = baseUrl.replace(/\/$/, "");
  const hits = [];

  for (const path of STAFF_PATHS) {
    const url = `${base}${path}`;
    const page = await fetchPage(url);
    if (!page.ok || page.html.length < 500) continue;

    const lower = page.html.toLowerCase();
    const hasSoftball = lower.includes("softball");
    const emails = countEmails(page.html);
    const coachSignals =
      lower.includes("head coach") ||
      lower.includes("assistant coach") ||
      lower.includes("coaching staff");

    if (hasSoftball || coachSignals || emails.length > 0) {
      hits.push({
        url: page.finalUrl,
        hasSoftball,
        coachSignals,
        emailCount: emails.length,
        sampleEmails: emails.slice(0, 3),
      });
    }
  }

  return hits;
}

async function verifySchool(school) {
  const home = await fetchPage(school.url);
  const result = {
    name: school.name,
    listedUrl: school.url,
    status: home.status,
    ok: home.ok,
    finalUrl: home.finalUrl,
    redirected: home.finalUrl.replace(/\/$/, "") !== school.url.replace(/\/$/, ""),
    error: home.error ?? null,
    title: "",
    hasSoftballOnHome: false,
    discoveredLinks: [],
    staffPathHits: [],
    verdict: "UNKNOWN",
    notes: [],
  };

  if (!home.ok) {
    result.verdict = "FAIL";
    result.notes.push("Homepage did not load");
    return result;
  }

  const analysis = analyzeHomepage(home.html, home.finalUrl);
  result.title = analysis.title;
  result.hasSoftballOnHome = analysis.hasSoftball;
  result.discoveredLinks = analysis.links.slice(0, 8);

  result.staffPathHits = await probeStaffPaths(home.finalUrl);

  const totalEmails = result.staffPathHits.reduce((sum, hit) => sum + hit.emailCount, 0);
  const hasStaffPage = result.staffPathHits.length > 0;
  const hasSoftballStaff =
    result.hasSoftballOnHome ||
    result.discoveredLinks.some((link) => link.toLowerCase().includes("softball")) ||
    result.staffPathHits.some((hit) => hit.hasSoftball);

  if (!hasSoftballStaff) {
    result.verdict = "REVIEW";
    result.notes.push("No clear softball program signal on athletics site");
  } else if (hasStaffPage && totalEmails > 0) {
    result.verdict = "PASS";
    result.notes.push("Softball staff page found with published email(s)");
  } else if (hasStaffPage) {
    result.verdict = "PARTIAL";
    result.notes.push("Softball/coach page found but no emails on probed pages");
  } else {
    result.verdict = "REVIEW";
    result.notes.push("Softball likely exists but no standard staff path responded");
  }

  if (result.redirected) {
    result.notes.push(`Redirects to ${home.finalUrl}`);
  }

  return result;
}

const results = [];
for (const school of D3_SCHOOLS) {
  process.stderr.write(`Checking ${school.name}...\n`);
  results.push(await verifySchool(school));
}

console.log(JSON.stringify(results, null, 2));
