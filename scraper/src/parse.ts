import type { CheerioAPI } from "cheerio";
import type { ScrapedContact } from "./types.js";
import { loadCheerio } from "./fetcher.js";
import { revealCloudflareEmailsInHtml, decodeCloudflareEmail } from "./email-decode.js";
import { logger } from "./logger.js";

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

const SKIP_TITLES = new Set([
  "full bio",
  "bio",
  "view bio",
  "read more",
  "more",
]);

function extractEmailFromElement($: CheerioAPI, el: unknown, blockText: string): string | null {
  const block = $(el as never);

  const decoded = block.find("[data-decoded-email]").first().attr("data-decoded-email");
  if (decoded) return decoded.toLowerCase();

  const mailto = block.find('a[href^="mailto:"]').first().attr("href");
  if (mailto) {
    return mailto.replace("mailto:", "").split("?")[0]?.toLowerCase() ?? null;
  }

  const cfHex = block.find("[data-cfemail]").first().attr("data-cfemail");
  if (cfHex) {
    const decodedCf = decodeCloudflareEmail(cfHex);
    if (decodedCf) return decodedCf;
  }

  const match = blockText.match(EMAIL_REGEX);
  return match ? match[0].toLowerCase() : null;
}

function extractEmail(text: string): string | null {
  const match = text.match(EMAIL_REGEX);
  return match ? match[0].toLowerCase() : null;
}

function extractPhone(text: string): string | null {
  const match = text.match(PHONE_REGEX);
  return match ? match[0].trim() : null;
}

function isLikelyName(text: string): boolean {
  if (!text || text.length < 3 || text.length > 80) return false;
  if (SKIP_TITLES.has(text.toLowerCase())) return false;
  if (text.includes("@")) return false;
  if (/^\d+$/.test(text)) return false;
  const words = text.trim().split(/\s+/);
  return words.length >= 2 && words.length <= 5;
}

function isLikelyTitle(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("coach") ||
    lower.includes("director") ||
    lower.includes("coordinator") ||
    lower.includes("assistant") ||
    lower.includes("head") ||
    lower.includes("recruit") ||
    lower.includes("operations") ||
    lower.includes("trainer") ||
    lower.includes("manager")
  );
}

function parseStaffCards($: CheerioAPI): ScrapedContact[] {
  const contacts: ScrapedContact[] = [];
  const seen = new Set<string>();

  $(".sidearm-staff-member, .staff-member, .coaches-list li, .coach-card").each(
    (_, el) => {
      const block = $(el);
      const blockText = block.text();

      let name =
        block.find(".sidearm-staff-member-name, .staff-name, .name, h3, h4").first().text().trim() ||
        block.find("a").first().text().trim();

      let title =
        block.find(".sidearm-staff-member-title, .staff-title, .title, .position").first().text().trim() ||
        "";

      const email =
        extractEmailFromElement($, el, blockText) ||
        extractEmail(blockText);

      const phone = extractPhone(blockText);

      if (!name || !isLikelyName(name)) return;

      if (!title) {
        const lines = blockText
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);
        for (const line of lines) {
          if (line !== name && isLikelyTitle(line)) {
            title = line;
            break;
          }
        }
      }

      const key = `${name}|${title}|${email ?? ""}`;
      if (seen.has(key)) return;
      seen.add(key);

      contacts.push({
        coach_name: name,
        title: title || null,
        email: email ? email.toLowerCase() : null,
        phone: phone || null,
      });
    },
  );

  return contacts;
}

function parseTableRows($: CheerioAPI): ScrapedContact[] {
  const contacts: ScrapedContact[] = [];

  $("table tr").each((_, row) => {
    const cells = $(row).find("td, th");
    if (cells.length < 2) return;

    const rowText = $(row).text();
    const email = extractEmail(rowText);
    const phone = extractPhone(rowText);

    const name = $(cells[0]).text().trim();
    const title = $(cells[1]).text().trim();

    if (!isLikelyName(name)) return;

    contacts.push({
      coach_name: name,
      title: isLikelyTitle(title) ? title : null,
      email,
      phone,
    });
  });

  return contacts;
}

function parseMailtoLinks($: CheerioAPI): ScrapedContact[] {
  const contacts: ScrapedContact[] = [];
  const seen = new Set<string>();

  $('a[href^="mailto:"]').each((_, el) => {
    const email = $(el).attr("href")?.replace("mailto:", "").split("?")[0]?.toLowerCase();
    if (!email) return;

    const parent = $(el).closest("li, tr, .sidearm-staff-member, .staff-member, div");
    const parentText = parent.text();
    const lines = parentText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && l !== email);

    let name = lines.find((l) => isLikelyName(l)) ?? $(el).text().trim();
    let title = lines.find((l) => isLikelyTitle(l)) ?? null;

    if (!isLikelyName(name)) {
      name = email.split("@")[0].replace(/[._]/g, " ");
      name = name
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }

    const key = `${name}|${email}`;
    if (seen.has(key)) return;
    seen.add(key);

    contacts.push({
      coach_name: name,
      title,
      email,
      phone: extractPhone(parentText),
    });
  });

  return contacts;
}

function isValidStaffEmail(email: string): boolean {
  const lower = email.toLowerCase();
  if (lower.includes("sentry") || lower.includes("example.com")) return false;
  return lower.includes(".edu") || lower.includes(".org");
}

function parseEmbeddedJsonStaff(html: string): ScrapedContact[] {
  const contacts: ScrapedContact[] = [];
  const seen = new Set<string>();

  function add(first: string, last: string, title: string, email: string): void {
    const normalizedEmail = email.toLowerCase();
    if (!isValidStaffEmail(normalizedEmail)) return;
    if (seen.has(normalizedEmail)) return;

    const cleanTitle = title.replace(/\\u002F/g, "/").trim();
    const lowerTitle = cleanTitle.toLowerCase();
    const isSoftballStaff =
      lowerTitle.includes("softball") ||
      (lowerTitle.includes("recruiting") && lowerTitle.includes("coordinator"));
    if (!isSoftballStaff) return;

    seen.add(normalizedEmail);

    contacts.push({
      coach_name: `${first} ${last}`.trim(),
      title: cleanTitle || null,
      email: normalizedEmail,
      phone: null,
    });
  }

  const withGender = /"([^"]+)","([^"]+)","([^"]+)","(?:male|female)","([^"]+@[^"]+)"/gi;
  for (const match of html.matchAll(withGender)) {
    add(match[1], match[2], match[3], match[4]);
  }

  const withEmail = /"([^"]+)","([^"]+)","([^"]+)","([^"]+@[^"]+\.edu)"/gi;
  for (const match of html.matchAll(withEmail)) {
    const [, first, last, title, email] = match;
    if (title === "male" || title === "female") continue;
    add(first, last, title, email);
  }

  return contacts;
}

function mergeContacts(results: ScrapedContact[][]): ScrapedContact[] {
  const all: ScrapedContact[] = [];

  for (const contacts of results) {
    all.push(...contacts);
  }

  return all;
}

export function parseStaffPage(html: string): ScrapedContact[] {
  const $ = loadCheerio(revealCloudflareEmailsInHtml(html));

  const embedded = parseEmbeddedJsonStaff(html);
  const strategies = [parseStaffCards, parseTableRows, parseMailtoLinks];
  const results = [embedded, ...strategies.map((strategy) => strategy($))];
  const contacts = mergeContacts(results);

  if (contacts.length > 0) {
    logger.info(`Parsed ${contacts.length} contacts after merging strategies`);
    return contacts;
  }

  logger.warn("No contacts found with any parsing strategy");
  return [];
}
