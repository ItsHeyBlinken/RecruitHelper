import type { ScrapedContact } from "../types.js";
import { loadCheerio } from "../fetcher.js";
import { revealCloudflareEmailsInHtml } from "../email-decode.js";
import { isSoftballCoachProfileHref } from "../discover.js";
import { parseStaffProfilePage } from "../staff-profiles.js";
import type { PageParser } from "./types.js";
import { isStaffDirectoryUrl } from "./types.js";

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;

function isPrestoCoachesListingUrl(url: string): boolean {
  if (isStaffDirectoryUrl(url)) return false;
  if (!/prestosports\.com/i.test(url)) return false;
  if (!/\/sports\/sball\/coaches/i.test(url)) return false;
  return !isSoftballCoachProfileHref(url);
}

function htmlLooksLikePrestoCoachesListing(html: string): boolean {
  const lower = html.toLowerCase();
  return (
    lower.includes("prestosports") &&
    lower.includes("/sports/sball/coaches") &&
    (lower.includes("head softball coach") || lower.includes("assistant softball coach"))
  );
}

function isLikelyName(text: string): boolean {
  if (!text || text.length < 3 || text.length > 80) return false;
  if (text.includes("@")) return false;
  const words = text.trim().split(/\s+/);
  return words.length >= 2 && words.length <= 4;
}

function nameFromCoachSlug(slug: string): string | null {
  if (/^(index|assistant|coach)$/i.test(slug)) return null;

  if (slug.includes("_")) {
    return slug
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  }

  const spaced = slug.replace(/([a-z])([A-Z])/g, "$1 $2");
  if (/\s/.test(spaced)) {
    return spaced
      .split(/\s+/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  }

  return null;
}

function parseLabeledCoachBlocks($: ReturnType<typeof loadCheerio>): ScrapedContact[] {
  const contacts: ScrapedContact[] = [];
  const seen = new Set<string>();

  function add(contact: ScrapedContact): void {
    const key = contact.coach_name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    contacts.push(contact);
  }

  $("option[data-url][data-title]").each((_, el) => {
    const href = $(el).attr("data-url");
    const name = $(el).attr("data-title")?.trim();
    if (!href || !name || !isLikelyName(name)) return;
    if (!isSoftballCoachProfileHref(href)) return;

    add({
      coach_name: name,
      title: null,
      email: null,
      phone: null,
    });
  });

  $('a[href*="/sports/sball/coaches/"]').each((_, el) => {
    const href = $(el).attr("href");
    if (!href || !isSoftballCoachProfileHref(href)) return;

    const name = $(el).text().trim();
    const slug = href.match(/\/coaches\/([^/?#]+)/i)?.[1] ?? "";
    const coachName = isLikelyName(name) ? name : nameFromCoachSlug(slug);
    if (!coachName) return;

    const block = $(el).closest("div, li, section, article, tr");
    const blockText = block.text();
    const mailto = block.find('a[href^="mailto:"]').first().attr("href");
    const email =
      mailto?.replace("mailto:", "").split("?")[0]?.toLowerCase() ??
      blockText.match(/Email:\s*([^\n]+)/i)?.[1]?.trim().toLowerCase() ??
      null;
    const titleMatch = blockText.match(/Title:\s*([^\n]+)/i);
    const phoneMatch = blockText.match(/Phone:\s*([^\n]+)/i);

    add({
      coach_name: coachName,
      title: titleMatch?.[1]?.trim() ?? null,
      email: email && EMAIL_REGEX.test(email) ? email : null,
      phone: phoneMatch?.[1]?.match(PHONE_REGEX)?.[0]?.trim() ?? null,
    });
  });

  return contacts;
}

function parseMailtoCoachCards($: ReturnType<typeof loadCheerio>): ScrapedContact[] {
  const contacts: ScrapedContact[] = [];
  const seen = new Set<string>();

  $('a[href^="mailto:"]').each((_, el) => {
    const email = $(el).attr("href")?.replace("mailto:", "").split("?")[0]?.toLowerCase();
    if (!email || !EMAIL_REGEX.test(email)) return;

    const block = $(el).closest("div, li, section, article, td");
    const blockText = block.text();

    let name =
      block.find("h4, h5, h3, .name").first().text().trim() ||
      block.prevAll("h4, h5, h3").first().text().trim();

    if (!isLikelyName(name)) {
      const beforeEmail = blockText.split(/Email:/i)[0] ?? "";
      const lines = beforeEmail
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      name = lines.find((line) => isLikelyName(line)) ?? "";
    }

    if (!isLikelyName(name)) return;

    const titleMatch = blockText.match(/Title:\s*([^\n]+)/i);
    const phoneMatch = blockText.match(PHONE_REGEX);
    const key = name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);

    contacts.push({
      coach_name: name,
      title: titleMatch?.[1]?.trim() ?? null,
      email,
      phone: phoneMatch?.[0]?.trim() ?? null,
    });
  });

  return contacts;
}

export function parsePrestoSportsCoachesListing(html: string, pageUrl: string): ScrapedContact[] {
  const $ = loadCheerio(revealCloudflareEmailsInHtml(html));
  const merged = new Map<string, ScrapedContact>();

  function merge(contact: ScrapedContact): void {
    const key = contact.coach_name.toLowerCase();
    const existing = merged.get(key);
    if (!existing) {
      merged.set(key, contact);
      return;
    }
    merged.set(key, {
      coach_name: existing.coach_name,
      title: existing.title ?? contact.title,
      email: existing.email ?? contact.email,
      phone: existing.phone ?? contact.phone,
    });
  }

  for (const contact of [...parseLabeledCoachBlocks($), ...parseMailtoCoachCards($)]) {
    merge(contact);
  }

  if (merged.size === 0 && isSoftballCoachProfileHref(pageUrl)) {
    const profile = parseStaffProfilePage(html, pageUrl);
    if (profile) merge(profile);
  }

  return [...merged.values()].sort((a, b) => a.coach_name.localeCompare(b.coach_name));
}

export const prestosportsCoachesListParser: PageParser = {
  id: "prestosports-coaches-list",
  matchesUrl: isPrestoCoachesListingUrl,
  matchesHtml: htmlLooksLikePrestoCoachesListing,
  parse: (html, url) => parsePrestoSportsCoachesListing(html, url),
};
