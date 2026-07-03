import { loadCheerio, resolveUrl } from "../fetcher.js";
import type { ScrapedContact } from "../types.js";
import { discoverSoftballStaffCandidates } from "../discover.js";
import { logger } from "../logger.js";
import { staffDirectoryParser } from "./staff-directory.js";
import { sidearmRosterParser } from "./sidearm-roster.js";
import { prestosportsCoachParser } from "./prestosports-coach.js";
import { prestosportsCoachesListParser } from "./prestosports-coaches-list.js";
import { sidearmStaffProfileParser } from "./sidearm-staff-profile.js";
import type { PageParser } from "./types.js";
import { STAFF_DIRECTORY_PATHS } from "./types.js";
import { isSoftballCoachProfileHref, isSidearmStaffDirectoryProfileUrl } from "../discover.js";
import { isStaffDirectoryUrl, usesStaffDirectoryParser } from "./types.js";

export { parseSoftballStaffDirectory, discoverSoftballStaffProfileLinks } from "./staff-directory.js";
export { isStaffDirectoryUrl, STAFF_DIRECTORY_PATHS } from "./types.js";

const PARSERS: PageParser[] = [
  sidearmStaffProfileParser,
  prestosportsCoachParser,
  prestosportsCoachesListParser,
  staffDirectoryParser,
  sidearmRosterParser,
];

function rankParsers(url: string, html: string): PageParser[] {
  if (isSidearmStaffDirectoryProfileUrl(url)) {
    return [sidearmStaffProfileParser, staffDirectoryParser, sidearmRosterParser, prestosportsCoachParser];
  }

  if (isSoftballCoachProfileHref(url)) {
    return [prestosportsCoachParser, prestosportsCoachesListParser, staffDirectoryParser, sidearmRosterParser];
  }

  if (prestosportsCoachesListParser.matchesUrl(url)) {
    return [prestosportsCoachesListParser, prestosportsCoachParser, staffDirectoryParser, sidearmRosterParser];
  }

  if (isStaffDirectoryUrl(url)) {
    return [staffDirectoryParser, sidearmRosterParser, prestosportsCoachParser];
  }

  const urlMatches = PARSERS.filter((parser) => parser.matchesUrl(url));
  const htmlMatches = PARSERS.filter((parser) => parser.matchesHtml(html));

  const ranked = new Set<PageParser>();
  for (const parser of urlMatches) ranked.add(parser);
  for (const parser of htmlMatches) ranked.add(parser);
  for (const parser of PARSERS) ranked.add(parser);

  return [...ranked];
}

export function parsePage(html: string, url: string): ScrapedContact[] {
  if (usesStaffDirectoryParser(url)) {
    const contacts = staffDirectoryParser.parse(html, url);
    if (contacts.length > 0) {
      logger.info(`Parser "${staffDirectoryParser.id}" extracted ${contacts.length} contacts`, { url });
      return contacts;
    }
    logger.warn("Staff directory listing had no softball section", { url });
    return [];
  }

  for (const parser of rankParsers(url, html)) {
    const contacts = parser.parse(html, url);
    if (contacts.length > 0) {
      logger.info(`Parser "${parser.id}" extracted ${contacts.length} contacts`, { url });
      return contacts;
    }
  }

  logger.warn("No parser extracted contacts", { url });
  return [];
}

export function discoverStaffDirectoryCandidates(
  athleticsUrl: string,
  homepageHtml?: string,
): string[] {
  const base = athleticsUrl.replace(/\/$/, "");
  const urls = new Set<string>();

  for (const path of STAFF_DIRECTORY_PATHS) {
    urls.add(`${base}${path}`);
  }

  if (homepageHtml) {
    const $ = loadCheerio(homepageHtml);
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (
        !href ||
        (!/staff-directory/i.test(href) &&
          !/insideAthletics\/directory/i.test(href) &&
          !/\/directory\/index/i.test(href))
      ) {
        return;
      }
      urls.add(resolveUrl(athleticsUrl, href));
    });
  }

  return [...urls];
}

export function discoverAllScrapeCandidates(
  athleticsUrl: string,
  homepageHtml: string,
): string[] {
  const seen = new Set<string>();
  const candidates: string[] = [];

  function add(url: string): void {
    if (seen.has(url)) return;
    seen.add(url);
    candidates.push(url);
  }

  for (const url of discoverSoftballStaffCandidates(athleticsUrl, homepageHtml)) {
    add(url);
  }

  for (const url of discoverStaffDirectoryCandidates(athleticsUrl, homepageHtml)) {
    add(url);
  }

  return candidates;
}
