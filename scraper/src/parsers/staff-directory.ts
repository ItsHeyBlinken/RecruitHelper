import type { CheerioAPI } from "cheerio";
import type { ScrapedContact } from "../types.js";
import { loadCheerio, resolveUrl } from "../fetcher.js";
import { revealCloudflareEmailsInHtml, decodeCloudflareEmail } from "../email-decode.js";
import type { PageParser } from "./types.js";
import { isStaffDirectoryUrl } from "./types.js";

const NEXT_SPORT_MARKERS = new Set([
  "baseball",
  "basketball",
  "soccer",
  "volleyball",
  "football",
  "gymnastics",
  "swimming",
  "tennis",
  "track",
  "cross country",
  "cheerleading",
  "golf",
  "spirit",
  "esports",
  "aquatics",
  "lacrosse",
  "field hockey",
  "dance",
  "swimming & diving",
  "swimming and diving",
]);

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;

function isLikelyName(text: string): boolean {
  const normalized = text.replace(/\s*'?\d{2}$/, "").trim();
  if (!normalized || normalized.length < 3 || normalized.length > 80) return false;
  if (normalized.includes("@")) return false;

  const lower = normalized.toLowerCase();
  if (
    /(department|information|marketing|administration|recreation|training|compliance|facilities|operations|communications)/i.test(
      lower,
    )
  ) {
    return false;
  }

  const words = normalized.trim().split(/\s+/);
  return words.length >= 2 && words.length <= 4;
}

function cleanCoachName(name: string): string {
  return name.replace(/\s*'?\d{2}$/, "").trim();
}

function extractEmailFromCell($: CheerioAPI, cell: unknown): string | null {
  const block = $(cell as never);

  const decoded = block.find("[data-decoded-email]").first().attr("data-decoded-email");
  if (decoded && EMAIL_REGEX.test(decoded)) return decoded.toLowerCase();

  const mailto = block.find('a[href^="mailto:"]').first().attr("href");
  if (mailto) {
    const email = mailto.replace("mailto:", "").split("?")[0]?.toLowerCase();
    if (email && EMAIL_REGEX.test(email)) return email;
  }

  const cfHex = block.find("[data-cfemail]").first().attr("data-cfemail");
  if (cfHex) {
    const decodedCf = decodeCloudflareEmail(cfHex);
    if (decodedCf) return decodedCf;
  }

  const match = block.text().match(EMAIL_REGEX);
  return match ? match[0].toLowerCase() : null;
}

function parseContactRow($: CheerioAPI, row: unknown): ScrapedContact | null {
  const cells = $(row as never).find("td, th");
  if (cells.length < 2) return null;

  const firstCell = cells.first().text().trim();
  if (/^softball$/i.test(firstCell)) return null;
  if (/^(position|name|email|phone|e-mail|email address)$/i.test(firstCell)) return null;

  const name =
    cells.first().find("a").first().text().trim() ||
    cells.first().text().trim();
  if (!isLikelyName(name)) return null;

  let title: string | null = null;
  let email: string | null = null;
  let phone: string | null = null;

  for (let i = 1; i < cells.length; i += 1) {
    const cell = cells.get(i);
    const cellText = cells.eq(i).text().trim();
    const cellEmail = extractEmailFromCell($, cell);
    const phoneMatch = cellText.match(PHONE_REGEX);

    if (cellEmail && !email) {
      email = cellEmail;
    } else if (phoneMatch && !phone) {
      phone = phoneMatch[0].trim();
    } else if (
      !title &&
      cellText &&
      !cellText.match(EMAIL_REGEX) &&
      !PHONE_REGEX.test(cellText)
    ) {
      title = cellText;
    }
  }

  return {
    coach_name: cleanCoachName(name),
    title,
    email,
    phone,
  };
}

function isSoftballSectionHeader($: CheerioAPI, row: unknown): boolean {
  const cells = $(row as never).find("td, th");
  if (cells.length === 0) return false;

  const first = cells.first().text().trim().toLowerCase();
  const second = cells.eq(1).text().trim().toLowerCase();

  return first === "softball" && (second === "position" || second === "");
}

function isNextSportHeader($: CheerioAPI, row: unknown): boolean {
  const cells = $(row as never).find("td, th");
  if (cells.length === 0) return false;

  const first = cells.first().text().trim().toLowerCase();
  if (first === "softball") return false;

  if (NEXT_SPORT_MARKERS.has(first)) return true;
  if ([...NEXT_SPORT_MARKERS].some((sport) => first.startsWith(sport))) return true;

  // Sidearm category rows: "Basketball (Men)", "Track and Field", etc.
  if (isCategoryHeaderRow($, row)) return true;

  return false;
}

function isCategoryHeaderRow($: CheerioAPI, row: unknown): boolean {
  const cells = $(row as never).find("td, th");
  const texts = cells
    .toArray()
    .map((cell) => $(cell).text().trim())
    .filter(Boolean);

  if (texts.length !== 1) return false;

  const label = texts[0];
  if (/^softball$/i.test(label)) return false;

  return !isLikelyName(label);
}

function isSidearmSoftballCategory($: CheerioAPI, row: unknown): boolean {
  const $row = $(row as never);
  if (!$row.hasClass("sidearm-staff-category")) return false;

  const text = $row.find("th").text().trim().toLowerCase();
  return text.startsWith("softball") || /^softball\b/.test(text);
}

function parseSidearmStaffMemberRow($: CheerioAPI, row: unknown): ScrapedContact | null {
  const $row = $(row as never);
  if (!$row.hasClass("sidearm-staff-member")) return null;

  const name =
    $row.find('td[headers*="col-fullname"] a').first().text().trim() ||
    $row.find("td").first().find("a").first().text().trim();
  if (!isLikelyName(name)) return null;

  const title =
    $row.find('td[headers*="col-staff_title"]').first().text().trim() ||
    $row.find("td").eq(1).text().trim() ||
    null;

  const emailCell = $row.find('td[headers*="col-staff_email"]').get(0) ?? $row.find("td").eq(2).get(0);
  let email = emailCell ? extractEmailFromCell($, emailCell) : null;

  if (!email) {
    const rowHtml = $row.html() ?? "";
    const obfuscated = rowHtml.match(/var firstHalf = "([^"]+)";\s*var secondHalf = "([^"]+)";/i);
    if (obfuscated) {
      email = `${obfuscated[1]}@${obfuscated[2]}`.toLowerCase();
    }
  }

  const phoneCell = $row.find('td[headers*="col-staff_phone"]').text().trim();
  const phoneMatch = phoneCell.match(PHONE_REGEX);

  return {
    coach_name: cleanCoachName(name),
    title: title || null,
    email,
    phone: phoneMatch ? phoneMatch[0].trim() : null,
  };
}

function collectSidearmSoftballMembers(
  $: CheerioAPI,
  onRow: (row: unknown) => void,
): boolean {
  let inSoftballSection = false;
  let foundSection = false;

  $("tr.sidearm-staff-category, tr.sidearm-staff-member").each((_, row) => {
    const $row = $(row);

    if ($row.hasClass("sidearm-staff-category")) {
      inSoftballSection = isSidearmSoftballCategory($, row);
      if (inSoftballSection) foundSection = true;
      return;
    }

    if (inSoftballSection && $row.hasClass("sidearm-staff-member")) {
      onRow(row);
    }
  });

  return foundSection;
}

const NEXTGEN_NEXT_CATEGORY =
  /,"(?:ADMINISTRATION|TENNIS|FOOTBALL|BASEBALL|BASKETBALL|VOLLEYBALL|TRACK|GOLF|SOCCER|SPIRIT|EQUESTRIAN|ACROBATICS|CROSS COUNTRY|WRESTLING|SWIM)/i;

function extractSoftballNuxtChunk(html: string): string | null {
  const match = html.match(/"SOFTBALL\s*(?:\||--)[^"]*"/i);
  if (match?.index === undefined) return null;

  const start = match.index;
  const rest = html.slice(start);
  const next = rest.slice(20).match(NEXTGEN_NEXT_CATEGORY);
  const end = next?.index !== undefined ? start + 20 + next.index : start + 25_000;
  return html.slice(start, Math.min(end, start + 25_000));
}

function slugToName(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function parsePersonCardBySlug($: CheerioAPI, slug: string): ScrapedContact | null {
  const profilePattern = new RegExp(`/staff-directory/${slug}/\\d+`, "i");
  const candidates = $("a[href]").filter((_, el) => profilePattern.test($(el).attr("href") ?? ""));

  for (let index = 0; index < candidates.length; index += 1) {
    const link = candidates.eq(index);
    const card = link.closest(".s-person-card");
    if (card.length === 0) continue;

    const name =
      card.find("h4").first().text().trim() ||
      link.attr("aria-label")?.replace(/\s+full bio$/i, "").trim() ||
      slugToName(slug);
    if (!isLikelyName(name)) continue;

    const title = card.find(".s-person-details__position div").first().text().trim() || null;
    const mailto = card.find('a[href^="mailto:"]').first().attr("href");
    const email = mailto?.replace("mailto:", "").split("?")[0]?.toLowerCase() ?? null;
    const phoneText = card.find('a[href^="tel:"]').first().text().trim();
    const phoneMatch = phoneText.match(PHONE_REGEX);

    return {
      coach_name: cleanCoachName(name),
      title,
      email,
      phone: phoneMatch ? phoneMatch[0].trim() : null,
    };
  }

  return null;
}

function parseSidearmNextgenSoftballDirectory(html: string): ScrapedContact[] {
  const chunk = extractSoftballNuxtChunk(html);
  if (!chunk) return [];

  const $ = loadCheerio(revealCloudflareEmailsInHtml(html));
  const slugs = [
    ...new Set(
      [...chunk.matchAll(/\/staff-directory\/([a-z0-9-]+)\/\d+/gi)].map((match) =>
        match[1].toLowerCase(),
      ),
    ),
  ];

  const contacts: ScrapedContact[] = [];
  const seen = new Set<string>();

  for (const slug of slugs) {
    const contact = parsePersonCardBySlug($, slug);
    if (!contact || seen.has(contact.coach_name.toLowerCase())) continue;
    seen.add(contact.coach_name.toLowerCase());
    contacts.push(contact);
  }

  return contacts;
}

function discoverNextgenSoftballProfileLinks(html: string, pageUrl: string): string[] {
  const chunk = extractSoftballNuxtChunk(html);
  if (!chunk) return [];

  return [
    ...new Set(
      [...chunk.matchAll(/\/staff-directory\/[a-z0-9-]+\/\d+/gi)].map((match) =>
        resolveUrl(pageUrl, match[0]),
      ),
    ),
  ];
}

function collectSoftballSectionRows(
  $: CheerioAPI,
  onRow: (row: unknown) => void,
): void {
  let inSoftballSection = false;
  let tableSectionFound = false;

  $("table tr").each((_, row) => {
    if (isSoftballSectionHeader($, row)) {
      inSoftballSection = true;
      tableSectionFound = true;
      return;
    }

    if (inSoftballSection && (isNextSportHeader($, row) || isCategoryHeaderRow($, row))) {
      inSoftballSection = false;
      return;
    }

    if (!inSoftballSection) return;
    onRow(row);
  });

  if (tableSectionFound) return;

  $("h2, h3, h4").each((_, heading) => {
    if ($(heading).text().trim().toLowerCase() !== "softball") return;

    const table = findTableAfterSportHeading($, heading);
    table.find("tr").each((__, row) => {
      if (isNextSportHeader($, row) || isCategoryHeaderRow($, row)) return false;
      onRow(row);
    });
  });
}

function findTableAfterSportHeading($: CheerioAPI, heading: unknown) {
  const $heading = $(heading as never);
  const wrapped = $heading.nextAll(".table-responsive").first().find("table").first();
  if (wrapped.length > 0) return wrapped;

  const direct = $heading.nextAll("table").first();
  if (direct.length > 0) return direct;

  return $heading.nextAll("div").first().find("table").first();
}

export function parseSoftballStaffDirectory(html: string): ScrapedContact[] {
  const $ = loadCheerio(revealCloudflareEmailsInHtml(html));
  const contacts: ScrapedContact[] = [];
  const seen = new Set<string>();

  function addContact(contact: ScrapedContact): void {
    const key = contact.coach_name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    contacts.push(contact);
  }

  const foundSidearmSection = collectSidearmSoftballMembers($, (row) => {
    const contact = parseSidearmStaffMemberRow($, row);
    if (contact) addContact(contact);
  });

  if (foundSidearmSection) {
    return contacts;
  }

  for (const contact of parseSidearmNextgenSoftballDirectory(html)) {
    addContact(contact);
  }

  if (contacts.length > 0) {
    return contacts;
  }

  collectSoftballSectionRows($, (row) => {
    const contact = parseContactRow($, row);
    if (contact) addContact(contact);
  });

  return contacts;
}

export function discoverSoftballStaffProfileLinks(html: string, pageUrl: string): string[] {
  const $ = loadCheerio(html);
  const links = new Set<string>();

  collectSoftballSectionRows($, (row) => {
    const href = $(row as never).find("td, th").first().find("a[href]").first().attr("href");
    if (!href) return;
    if (
      !/\/staff-directory\/[^/]+\/\d+/i.test(href) &&
      !/insideathletics\/directory\/bios/i.test(href)
    ) {
      return;
    }
    links.add(resolveUrl(pageUrl, href));
  });

  if (links.size === 0) {
    collectSidearmSoftballMembers($, (row) => {
      const href = $(row as never).find('a[href*="/staff-directory/"]').first().attr("href");
      if (!href || !/\/staff-directory\/[^/]+\/\d+/i.test(href)) return;
      links.add(resolveUrl(pageUrl, href));
    });
  }

  for (const url of discoverNextgenSoftballProfileLinks(html, pageUrl)) {
    links.add(url);
  }

  return [...links];
}

function htmlLooksLikeStaffDirectory(html: string): boolean {
  const lower = html.toLowerCase();
  return (
    lower.includes("staff directory") &&
    (lower.includes(">softball<") ||
      lower.includes("softball</h2") ||
      lower.includes("softball</h3") ||
      lower.includes("sidearm-staff-category") ||
      lower.includes('"softball |') ||
      lower.includes("s-person-details"))
  );
}

export const staffDirectoryParser: PageParser = {
  id: "staff-directory",
  matchesUrl: isStaffDirectoryUrl,
  matchesHtml: htmlLooksLikeStaffDirectory,
  parse: (html, _url) => parseSoftballStaffDirectory(html),
};
