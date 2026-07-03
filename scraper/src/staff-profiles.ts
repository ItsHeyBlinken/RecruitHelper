import type { ScrapedContact } from "./types.js";
import { loadCheerio, resolveUrl, fetchHtml } from "./fetcher.js";
import {
  isExcludedSportHref,
  isSoftballSportHref,
  isSoftballCoachProfileHref,
} from "./discover.js";
import { discoverSoftballStaffProfileLinks } from "./parsers/staff-directory.js";
import { isStaffDirectoryUrl } from "./parsers/types.js";
import { namesMatch } from "./contact-utils.js";
import { isSoftballCoachingContact } from "./softball-filter.js";
import { revealCloudflareEmailsInHtml, decodeCloudflareEmail } from "./email-decode.js";
import { logger } from "./logger.js";

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const EMAIL_REGEX_GLOBAL = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;

function extractLabeledField(bodyText: string, label: string): string | null {
  const pattern = new RegExp(`${label}\\s*:?\\s*([^\\n]+?)(?=\\s*(?:Email|Phone|Title|Hometown|Twitter|Alma Mater|Bio|$))`, "i");
  const match = bodyText.match(pattern);
  return match?.[1]?.trim() ?? null;
}

function extractEmailFromText(text: string): string | null {
  const matches = text.match(EMAIL_REGEX_GLOBAL);
  if (!matches) return null;
  const edu = matches.find((e) => e.toLowerCase().includes(".edu"));
  return (edu ?? matches[0]).toLowerCase();
}

export function discoverStaffProfileLinks(html: string, pageUrl: string): string[] {
  if (isStaffDirectoryUrl(pageUrl)) {
    return discoverSoftballStaffProfileLinks(html, pageUrl);
  }

  const $ = loadCheerio(html);
  const links = new Set<string>();

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    const lower = href.toLowerCase();
    if (isExcludedSportHref(href)) return;

    const isProfile =
      isSoftballCoachProfileHref(href) ||
      /insideathletics\/directory\/bios/i.test(href) ||
      (lower.includes("/roster/coach/") && isSoftballSportHref(href)) ||
      (lower.includes("softball") && lower.includes("/staff/")) ||
      lower.includes("/coache/") ||
      lower.includes("/support-staff/");

    if (!isProfile) return;

    links.add(resolveUrl(pageUrl, href));
  });

  $("option[data-url]").each((_, el) => {
    const href = $(el).attr("data-url");
    if (!href || !isSoftballCoachProfileHref(href)) return;
    links.add(resolveUrl(pageUrl, href));
  });

  return [...links];
}

export function isSoftballStaffProfilePage(html: string, contact: ScrapedContact): boolean {
  const lower = html.toLowerCase();
  const title = (contact.title ?? "").toLowerCase();

  if (/softball/i.test(title)) return isSoftballCoachingContact(contact);
  if (!lower.includes("softball")) return false;

  const pageTitle = html.match(/<title>([^<]+)/i)?.[1]?.toLowerCase() ?? "";
  if (
    pageTitle.includes("football") ||
    pageTitle.includes("basketball") ||
    pageTitle.includes("baseball")
  ) {
    return false;
  }

  return isSoftballCoachingContact(contact);
}

export function looksLikeJobTitle(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;
  if (/softball/i.test(trimmed) && /coach/i.test(trimmed)) return true;
  if (/^(head|assistant|associate|volunteer|graduate)\s/i.test(trimmed)) return true;
  return false;
}

function nameFromStaffDirectorySlug(url: string): string | null {
  const match = url.match(/\/staff-directory\/([a-z0-9-]+)\/\d+/i);
  if (!match) return null;

  return match[1]
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function nameFromPageTitle(html: string): string | null {
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
  if (!title) return null;

  const match = title.match(/^(.+?)\s+-\s+([^-]+)\s+-\s+Staff Directory/i);
  return match?.[1]?.trim() ?? null;
}

function nameFromCoachProfileSlug(url: string): string | null {
  const match = url.match(/\/coaches\/([^/?#]+)/i);
  if (!match) return null;

  const slug = decodeURIComponent(match[1]);
  if (/^(index|assistant|coach)$/i.test(slug) || /assistant_softball_coach/i.test(slug)) {
    return null;
  }
  if (!slug.includes("_")) {
    const spaced = slug.replace(/([a-z])([A-Z])/g, "$1 $2");
    if (/\s/.test(spaced)) {
      return spaced
        .split(/\s+/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(" ");
    }
    return null;
  }

  return slug
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function extractProfileName(
  $: ReturnType<typeof loadCheerio>,
  pageUrl?: string,
  html?: string,
): string | null {
  const fromH4 = $("h4").filter((_, el) => {
    const text = $(el).text().trim();
    return text.length > 0 && !looksLikeJobTitle(text);
  }).first().text().trim();
  if (fromH4) return fromH4;

  const fromSpan = $("span.name").first().text().trim();
  if (fromSpan) return fromSpan;

  if (html) {
    const fromTitle = nameFromPageTitle(html);
    if (fromTitle && !looksLikeJobTitle(fromTitle)) return fromTitle;
  }

  const fromOption =
    $("option[selected][data-title]").attr("data-title")?.trim() ??
    $("option[data-title]").first().attr("data-title")?.trim();
  if (fromOption) return fromOption;

  const h1 = $("h1").not(".d-none").first().text().trim() || $("h1").first().text().trim();
  if (h1 && !looksLikeJobTitle(h1) && !/^staff directory$/i.test(h1)) return h1;

  const cardTitle = $("[class*='card-title']").first().text().trim();
  if (cardTitle && !looksLikeJobTitle(cardTitle)) return cardTitle;

  if (pageUrl) {
    return nameFromStaffDirectorySlug(pageUrl) ?? nameFromCoachProfileSlug(pageUrl);
  }

  return null;
}

function extractBioFieldValue($: ReturnType<typeof loadCheerio>, label: string): string | null {
  let value: string | null = null;

  $('[data-test-id="staff-directory-bio-fields-component__field-label"]').each((_, el) => {
    if (value) return;
    if (!$(el).text().trim().toLowerCase().startsWith(label.toLowerCase())) return;

    const field =
      $(el).next('[data-test-id="staff-directory-bio-fields-component__field-value"]') ||
      $(el).parent().find('[data-test-id="staff-directory-bio-fields-component__field-value"]').first();

    if (label.toLowerCase() === "email") {
      const mailto = field.find('a[href^="mailto:"]').first().attr("href");
      if (mailto) {
        value = mailto.replace("mailto:", "").split("?")[0]?.toLowerCase() ?? null;
        return;
      }
    }

    value = field.text().trim() || null;
  });

  return value;
}

export function parseStaffProfilePage(html: string, pageUrl?: string): ScrapedContact | null {
  const $ = loadCheerio(revealCloudflareEmailsInHtml(html));

  const decoded = $("[data-decoded-email]").first().attr("data-decoded-email");
  const cfHex = $("[data-cfemail]").first().attr("data-cfemail");
  const mailto = $('a[href^="mailto:"]').first().attr("href");
  let email =
    decoded?.toLowerCase() ??
    (cfHex ? decodeCloudflareEmail(cfHex) : null) ??
    mailto?.replace("mailto:", "").split("?")[0]?.toLowerCase() ??
    null;

  const name = extractProfileName($, pageUrl, html);

  let title = extractBioFieldValue($, "title");

  $("dt, th, label, span, div, p").each((_, el) => {
    if (title) return;
    const label = $(el).text().trim().toLowerCase().replace(/:$/, "");
    if (label === "title" || label === "position") {
      const value =
        $(el).next("dd, td").text().trim() ||
        $(el).parent().text().replace(new RegExp(label, "i"), "").trim();
      if (value && value.length < 80) title = value;
    }
  });

  const bodyText = $("body").text().replace(/\s+/g, " ");

  if (!title) {
    title = extractLabeledField(bodyText, "Title");
    if (title && title.length > 60) title = null;
    if (!title) {
      const titleMatch = bodyText.match(/Title\s*:?\s*([^E]+?)(?:Email|Organization|Phone|$)/i);
      if (titleMatch) title = titleMatch[1].trim();
    }
  }

  if (!email) {
    const bioEmail = extractBioFieldValue($, "email");
    if (bioEmail && EMAIL_REGEX.test(bioEmail)) {
      email = bioEmail.toLowerCase();
    }
  }

  if (!email) {
    const emailMatch = bodyText.match(/Email\s*:?\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
    if (emailMatch) email = emailMatch[1].toLowerCase();
    if (!email) email = extractEmailFromText(bodyText);
  }

  let phone = extractBioFieldValue($, "phone");
  const phoneFromLabel = extractLabeledField(bodyText, "Phone");
  if (phoneFromLabel) {
    const phoneMatch = phoneFromLabel.match(PHONE_REGEX);
    if (phoneMatch) phone = phoneMatch[0].trim();
  }
  if (!phone) {
    const phoneMatch = bodyText.match(PHONE_REGEX);
    if (phoneMatch) phone = phoneMatch[0].trim();
  }

  if (!name) return null;

  return {
    coach_name: name,
    title,
    email,
    phone,
  };
}

function mergeProfileEmail(contacts: ScrapedContact[], profile: ScrapedContact): void {
  const match = contacts.find((c) => namesMatch(c.coach_name, profile.coach_name));
  if (match) {
    if (!match.email && profile.email) match.email = profile.email;
    if (!match.title && profile.title) match.title = profile.title;
    if (!match.phone && profile.phone) match.phone = profile.phone;
    return;
  }

  contacts.push(profile);
}

export async function enrichContactsFromStaffProfiles(
  contacts: ScrapedContact[],
  staffPageHtml: string,
  staffPageUrl: string,
): Promise<ScrapedContact[]> {
  let profileUrls = discoverStaffProfileLinks(staffPageHtml, staffPageUrl);

  if (profileUrls.length === 0 && isStaffDirectoryUrl(staffPageUrl)) {
    profileUrls = discoverSoftballStaffProfileLinks(staffPageHtml, staffPageUrl);
  }

  if (profileUrls.length === 0) return contacts;

  const missingEmailCount = contacts.filter((c) => !c.email).length;
  logger.info(`Found ${profileUrls.length} staff profile links (${missingEmailCount} contacts missing email)`);

  const enriched = contacts.map((c) => ({ ...c }));

  for (const profileUrl of profileUrls) {
    try {
      const html = await fetchHtml(profileUrl, true);
      const profile = parseStaffProfilePage(html, profileUrl);
      if (profile && (!isStaffDirectoryUrl(profileUrl) || isSoftballStaffProfilePage(html, profile))) {
        mergeProfileEmail(enriched, profile);
      }
    } catch (error) {
      logger.warn("Staff profile fetch failed", {
        url: profileUrl,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return enriched;
}
