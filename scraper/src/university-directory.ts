import type { CheerioAPI } from "cheerio";
import type { ScrapedContact } from "./types.js";
import { fetchHtml, loadCheerio, resolveUrl } from "./fetcher.js";
import { namesMatch } from "./contact-utils.js";
import { revealCloudflareEmailsInHtml, decodeCloudflareEmail } from "./email-decode.js";
import { logger } from "./logger.js";

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

function isValidUniversityEmail(email: string): boolean {
  const lower = email.toLowerCase();
  return lower.endsWith(".edu") && !lower.includes("example.com");
}

function apexEduDomain(host: string): string {
  const parts = host.toLowerCase().replace(/^www\./, "").split(".");
  if (parts.length < 2) return host;
  return parts.slice(-2).join(".");
}

export function discoverUniversityDomains(html: string, athleticsUrl: string): string[] {
  const scores = new Map<string, number>();
  const athleticsHost = new URL(athleticsUrl).hostname.toLowerCase();

  function addDomain(rawHost: string, weight: number): void {
    const host = rawHost.toLowerCase().replace(/^www\./, "");
    if (!host.endsWith(".edu")) return;
    if (host.includes("ncaa.org") || host.includes("nfca.org")) return;

    const apex = apexEduDomain(host);
    if (apex === athleticsHost) return;

    scores.set(apex, (scores.get(apex) ?? 0) + weight);
    if (host !== apex) {
      scores.set(host, (scores.get(host) ?? 0) + weight);
    }
  }

  const urlPattern = /https?:\/\/([^/"'\s>]+)/gi;
  for (const match of html.matchAll(urlPattern)) {
    addDomain(match[1], 1);
  }

  const $ = loadCheerio(html);
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    try {
      const url = new URL(resolveUrl(athleticsUrl, href));
      const text = $(el).text().toLowerCase();
      const weight =
        text.includes("university") || text.includes("campus") || text.includes("directory") ? 3 : 1;
      addDomain(url.hostname, weight);
    } catch {
      // ignore invalid URLs
    }
  });

  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].split(".").length - b[0].split(".").length)
    .map(([domain]) => domain);
}

function buildDirectorySearchUrls(domain: string, coachName: string): string[] {
  const encoded = encodeURIComponent(coachName);
  const lastName = encodeURIComponent(coachName.split(/\s+/).pop() ?? coachName);
  const hosts = domain.includes(".") ? [domain, `www.${domain}`] : [domain];

  const urls: string[] = [];

  for (const host of hosts) {
    urls.push(
      `https://directory.${host}/search?query=${encoded}`,
      `https://${host}/directory/?q=${encoded}`,
      `https://${host}/search/people?q=${encoded}`,
      `https://${host}/search/people/?q=${encoded}`,
      `https://${host}/people/search?name=${encoded}`,
      `https://${host}/name/?s=${lastName}`,
      `https://search.${host}/s/search/a?query=${encoded}`,
    );
  }

  return [...new Set(urls)];
}

function extractEmailFromBlock($: CheerioAPI, el: unknown): string | null {
  const block = $(el as never);

  const decoded = block.find("[data-decoded-email]").first().attr("data-decoded-email");
  if (decoded && isValidUniversityEmail(decoded)) return decoded.toLowerCase();

  const mailto = block.find('a[href^="mailto:"]').first().attr("href");
  if (mailto) {
    const email = mailto.replace("mailto:", "").split("?")[0]?.toLowerCase();
    if (email && isValidUniversityEmail(email)) return email;
  }

  const cfEmail = block.find("[data-cfemail]").first().attr("data-cfemail");
  if (cfEmail) {
    const decodedCf = decodeCloudflareEmail(cfEmail);
    if (decodedCf && isValidUniversityEmail(decodedCf)) return decodedCf;
  }

  const matches = block.text().match(EMAIL_REGEX);
  if (!matches) return null;

  const edu = matches.find((email) => isValidUniversityEmail(email));
  return edu ? edu.toLowerCase() : null;
}

function findEmailNearName(html: string, coachName: string): string | null {
  const $ = loadCheerio(revealCloudflareEmailsInHtml(html));
  const parts = coachName
    .toLowerCase()
    .split(/\s+/)
    .filter((part) => part.length > 2);
  const lastName = parts[parts.length - 1];
  if (!lastName) return null;

  const selectors = "tr, li, article, .result, .person, .search-result, .directory-result, [class*='people']";

  let bestEmail: string | null = null;

  $(selectors).each((_, el) => {
    if (bestEmail) return;

    const text = $(el).text().toLowerCase();
    if (!text.includes(lastName)) return;
    if (parts[0] && !text.includes(parts[0])) return;

    const email = extractEmailFromBlock($, el);
    if (email) bestEmail = email;
  });

  return bestEmail;
}

async function lookupCoachEmail(domain: string, coachName: string): Promise<string | null> {
  const urls = buildDirectorySearchUrls(domain, coachName);

  for (const url of urls) {
    try {
      const html = await fetchHtml(url);
      const email = findEmailNearName(html, coachName);
      if (email) {
        logger.info("University directory email found", { coachName, domain, url });
        return email;
      }
    } catch {
      // try next URL pattern
    }
  }

  return null;
}

export async function enrichFromUniversityDirectory(
  contacts: ScrapedContact[],
  homepageHtml: string,
  athleticsUrl: string,
): Promise<ScrapedContact[]> {
  const missingContacts = contacts.filter((contact) => !contact.email);
  if (missingContacts.length === 0) return contacts;

  const domains = discoverUniversityDomains(homepageHtml, athleticsUrl);
  if (domains.length === 0) {
    logger.info("No university .edu domains discovered from athletics homepage");
    return contacts;
  }

  logger.info("University directory lookup", {
    domains: domains.slice(0, 3),
    missing: missingContacts.length,
  });

  const enriched = contacts.map((contact) => ({ ...contact }));

  for (const contact of enriched) {
    if (contact.email) continue;

    for (const domain of domains.slice(0, 3)) {
      const email = await lookupCoachEmail(domain, contact.coach_name);
      if (email) {
        contact.email = email;
        break;
      }
    }
  }

  return enriched;
}
