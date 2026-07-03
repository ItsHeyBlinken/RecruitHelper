import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { SeedSchool, ScrapeResult, ScrapedContact } from "./types.js";
import { fetchHtml } from "./fetcher.js";
import { isExcludedSportHref, isSoftballSportHref } from "./discover.js";
import { discoverAllScrapeCandidates, parsePage } from "./parsers/index.js";
import { isStaffDirectoryUrl, usesStaffDirectoryParser } from "./parsers/types.js";
import { normalizeContacts } from "./normalize.js";
import { enrichContactsFromStaffProfiles } from "./staff-profiles.js";
import { enrichFromAthleticsStaffDirectory } from "./athletics-directory.js";
import { persistScrapeResult } from "./persist.js";
import { logger } from "./logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function loadSeedSchools(): SeedSchool[] {
  const seedPath = resolve(__dirname, "../../seed/schools.json");
  const raw = readFileSync(seedPath, "utf-8");
  return JSON.parse(raw) as SeedSchool[];
}

export function findSeedSchool(schools: SeedSchool[], name: string): SeedSchool | undefined {
  const lower = name.toLowerCase();
  return schools.find((s) => s.school_name.toLowerCase() === lower);
}

async function scrapeStaffPage(url: string): Promise<{ contacts: ScrapedContact[]; html: string }> {
  let html = await fetchHtml(url);
  let contacts = normalizeContacts(parsePage(html, url));

  if (!contacts.some((c) => c.email)) {
    logger.info("No emails in static HTML, retrying with Playwright", { url });
    html = await fetchHtml(url, true);
    const rendered = normalizeContacts(parsePage(html, url));
    if (rendered.length > contacts.length || rendered.some((c) => c.email)) {
      contacts = rendered;
    }
  }

  if (contacts.length === 0 || contacts.some((c) => !c.email)) {
    contacts = normalizeContacts(
      await enrichContactsFromStaffProfiles(contacts, html, url),
    );
  }

  return { contacts, html };
}

const MAX_REASONABLE_SOFTBALL_CONTACTS = 12;

function shouldStopAfterUrl(url: string, contacts: ScrapedContact[]): boolean {
  if (contacts.length === 0) return false;

  if (usesStaffDirectoryParser(url) && contacts.length <= MAX_REASONABLE_SOFTBALL_CONTACTS) {
    return true;
  }

  if (!contacts.some((contact) => contact.email)) return false;

  if (isStaffDirectoryUrl(url)) return true;
  if (url.toLowerCase().includes("/coaches")) return true;
  if (/prestosports\.com/i.test(url) && /\/sports\/sball\/coaches/i.test(url)) return true;
  if (isSoftballSportHref(url) && url.includes("/roster")) return true;
  return false;
}

function scoreScrapeCandidate(url: string, contacts: ScrapedContact[]): number {
  if (contacts.length === 0) return -1;

  let score = contacts.length;
  if (isStaffDirectoryUrl(url)) score += 100;
  if (isSoftballSportHref(url)) score += 50;
  if (contacts.some((contact) => contact.email)) score += 10;

  if (contacts.length > MAX_REASONABLE_SOFTBALL_CONTACTS) {
    if (usesStaffDirectoryParser(url)) {
      score -= 500;
      logger.warn("Staff directory returned too many softball contacts", {
        url,
        contactCount: contacts.length,
      });
    } else if (!url.toLowerCase().includes("/coaches")) {
      score -= 500;
      logger.warn("Ignoring suspiciously large contact set from non-softball page", {
        url,
        contactCount: contacts.length,
      });
    }
  }

  return score;
}

export async function scrapeSchool(school: SeedSchool): Promise<ScrapeResult> {
  logger.info(`Scraping ${school.school_name}`, { url: school.athletics_url });

  const homepageHtml = await fetchHtml(school.athletics_url);
  const candidates = discoverAllScrapeCandidates(school.athletics_url, homepageHtml);

  let contacts: ScrapedContact[] = [];
  let bestScore = -1;
  let staffPageUrl = candidates[0] ?? `${school.athletics_url}/sports/softball/coaches`;

  for (const url of candidates) {
    if (!isStaffDirectoryUrl(url) && isExcludedSportHref(url)) {
      logger.info("Skipping non-softball sport URL", { url });
      continue;
    }

    try {
      logger.info("Trying scrape candidate", { url });
      const result = await scrapeStaffPage(url);
      const candidateScore = scoreScrapeCandidate(url, result.contacts);

      if (candidateScore > bestScore) {
        contacts = result.contacts;
        staffPageUrl = url;
        bestScore = candidateScore;
      }

      if (shouldStopAfterUrl(url, contacts)) {
        break;
      }
    } catch (error) {
      logger.warn("Scrape candidate fetch failed", {
        url,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (contacts.length === 0 || contacts.some((contact) => !contact.email)) {
    const beforeCount = contacts.length;
    contacts = normalizeContacts(
      await enrichFromAthleticsStaffDirectory(contacts, school.athletics_url, homepageHtml),
    );
    if (beforeCount === 0 && contacts.length > 0) {
      const directoryUrl = candidates.find(isStaffDirectoryUrl);
      if (directoryUrl) staffPageUrl = directoryUrl;
    }
  }

  if (contacts.length === 0) {
    logger.warn(`No contacts extracted for ${school.school_name}`);
  } else {
    const withEmail = contacts.filter((contact) => contact.email).length;
    logger.info(`Found ${contacts.length} contacts (${withEmail} with email)`, { url: staffPageUrl });
  }

  return {
    school_name: school.school_name,
    contacts,
    staff_page_url: staffPageUrl,
  };
}

export async function scrapeAndPersist(school: SeedSchool): Promise<ScrapeResult> {
  const result = await scrapeSchool(school);
  await persistScrapeResult(school, result.contacts);
  return result;
}
