import { parseStaffProfilePage, looksLikeJobTitle } from "../staff-profiles.js";
import { isSoftballCoachProfileHref } from "../discover.js";
import type { PageParser } from "./types.js";

function htmlHasPrestoCoachProfileBody(html: string): boolean {
  const lower = html.toLowerCase();
  return (
    lower.includes('class="name') ||
    lower.includes("data-title=") ||
    (lower.includes("email:") && lower.includes("title:"))
  );
}

function htmlLooksLikeCoachProfile(html: string): boolean {
  const lower = html.toLowerCase();
  return (
    lower.includes("email:") &&
    (lower.includes("head softball coach") || lower.includes("assistant softball coach"))
  );
}

export const prestosportsCoachParser: PageParser = {
  id: "prestosports-coach",
  matchesUrl: isSoftballCoachProfileHref,
  matchesHtml: (html) => htmlLooksLikeCoachProfile(html) && htmlHasPrestoCoachProfileBody(html),
  parse: (html, url) => {
    if (!isSoftballCoachProfileHref(url) && !htmlHasPrestoCoachProfileBody(html)) {
      return [];
    }

    const contact = parseStaffProfilePage(html, url);
    if (!contact) return [];
    if (looksLikeJobTitle(contact.coach_name) && !contact.email) return [];

    return [contact];
  },
};
