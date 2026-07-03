import { loadCheerio, resolveUrl } from "./fetcher.js";
import { logger } from "./logger.js";

const SOFTBALL_HREF_MARKERS = ["softball", "w-softbl", "wsoftbl", "w-softball", "sball"];
const STAFF_KEYWORDS = ["coach", "staff", "coaching", "roster"];

const KNOWN_STAFF_PATHS = [
  "/sports/sb/roster",
  "/sports/sball/coaches",
  "/sports/sball/coaches/index",
  "/sports/sball/Coaches",
  "/sports/sball/Coaches/index",
  "/sports/sball/roster",
  "/sport/w-softbl/roster",
  "/sport/w-softbl/roster/#coaches",
  "/sports/softball/coaches",
  "/sports/wsoftbl/coaches",
  "/sports/womens-softball/coaches",
  "/sports/softball/roster/staff",
];

const SOFTBALL_PATH_PATTERN = /\/sports?\/(?:sb|sball|softball|w-softbl|wsoftbl|w-softball)(?:\/|$)/i;

export function isSoftballSportHref(href: string): boolean {
  const lower = href.toLowerCase();
  if (SOFTBALL_PATH_PATTERN.test(lower)) return true;
  return SOFTBALL_HREF_MARKERS.some((marker) => lower.includes(marker));
}

export function isExcludedSportHref(href: string): boolean {
  const lower = href.toLowerCase();
  const wrongSports = [
    "m-basebl",
    "baseball",
    "m-footbl",
    "football",
    "m-baskbl",
    "basketball",
    "m-tennis",
    "w-tennis",
    "m-golf",
    "w-golf",
    "m-track",
    "w-track",
    "m-xc",
    "w-xc",
    "w-volley",
    "w-soccer",
    "w-swim",
    "w-gym",
  ];
  return wrongSports.some((sport) => lower.includes(sport));
}

export function isSoftballCoachProfileHref(href: string): boolean {
  const trimmed = href.trim();
  const lower = trimmed.toLowerCase();
  if (lower.startsWith("mailto:") || lower.startsWith("tel:") || lower.startsWith("javascript:")) {
    return false;
  }
  if (!/^https?:\/\//i.test(trimmed) && !trimmed.startsWith("/")) {
    return false;
  }
  if (!isSoftballSportHref(href) || isExcludedSportHref(href)) return false;
  if (/\/coaches\/?$/.test(lower.split("#")[0] ?? lower)) return false;
  if (/\/coaches\/index$/i.test(lower.split("#")[0] ?? lower)) return false;
  return /\/coaches\/[^/]+/i.test(lower) || /\/roster\/coach\/[^/]+/i.test(lower);
}

export function isSidearmStaffDirectoryProfileUrl(url: string): boolean {
  const path = url.split("#")[0]?.split("?")[0] ?? url;
  if (!/\/staff-directory\/[^/]+\/\d+/i.test(path)) return false;
  if (/\/staff-directory\/?$/i.test(path)) return false;
  return true;
}

export function isSidearmStaffDirectoryProfileHref(href: string): boolean {
  const trimmed = href.trim();
  if (trimmed.startsWith("mailto:") || trimmed.startsWith("tel:")) return false;
  if (!trimmed.startsWith("/") && !/^https?:\/\//i.test(trimmed)) return false;
  return isSidearmStaffDirectoryProfileUrl(trimmed);
}

function scoreLink(text: string, href: string): number {
  const combined = `${text} ${href}`.toLowerCase();
  const hrefLower = href.toLowerCase();

  if (!isSoftballSportHref(href) || isExcludedSportHref(href)) {
    return 0;
  }

  let score = 0;

  for (const marker of SOFTBALL_HREF_MARKERS) {
    if (combined.includes(marker)) score += 3;
  }
  for (const keyword of STAFF_KEYWORDS) {
    if (combined.includes(keyword)) score += 2;
  }
  if (hrefLower.includes("coaches") || hrefLower.includes("/coach")) score += 4;
  if (hrefLower.includes("/roster")) score += 5;
  if (hrefLower.includes("staff-directory")) score += 2;
  if (hrefLower.includes("insideathletics/directory")) score += 3;
  if (hrefLower.includes("#coaches")) score += 3;

  return score;
}

function rosterVariants(sportUrl: string): string[] {
  const base = sportUrl.replace(/\/$/, "").split("#")[0];
  if (base.includes("/roster")) {
    return [`${base}#coaches`];
  }
  return [`${base}/roster`, `${base}/roster#coaches`];
}

export function discoverSoftballStaffCandidates(
  athleticsUrl: string,
  homepageHtml: string,
): string[] {
  const base = athleticsUrl.replace(/\/$/, "");
  const candidates: string[] = [];
  const seen = new Set<string>();

  function add(url: string): void {
    if (!seen.has(url)) {
      seen.add(url);
      candidates.push(url);
    }
  }

  const $ = loadCheerio(homepageHtml);
  let bestUrl: string | null = null;
  let bestScore = 0;

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    const text = $(el).text().trim();
    const score = scoreLink(text, href);

    if (score > bestScore) {
      bestScore = score;
      bestUrl = resolveUrl(athleticsUrl, href);
    }
  });

  if (bestUrl && bestScore >= 4) {
    logger.info("Discovered staff page via link scoring", { url: bestUrl, score: bestScore });
    add(bestUrl);
    for (const variant of rosterVariants(bestUrl)) {
      add(variant);
    }
  }

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href || !/staff-directory/i.test(href)) return;
    add(resolveUrl(athleticsUrl, href));
  });

  for (const path of KNOWN_STAFF_PATHS) {
    add(`${base}${path}`);
  }

  return candidates;
}

export async function discoverSoftballStaffPage(
  athleticsUrl: string,
  homepageHtml: string,
): Promise<string> {
  const candidates = discoverSoftballStaffCandidates(athleticsUrl, homepageHtml);
  const fallback = candidates[0] ?? `${athleticsUrl.replace(/\/$/, "")}/sports/softball/coaches`;
  logger.info("Staff page candidates", { count: candidates.length, first: fallback });
  return fallback;
}
