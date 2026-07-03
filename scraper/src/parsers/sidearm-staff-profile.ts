import { parseStaffProfilePage } from "../staff-profiles.js";
import { isSidearmStaffDirectoryProfileUrl } from "../discover.js";
import { isSoftballStaffProfilePage } from "../staff-profiles.js";
import { isSoftballCoachingContact } from "../softball-filter.js";
import type { PageParser } from "./types.js";

export const sidearmStaffProfileParser: PageParser = {
  id: "sidearm-staff-profile",
  matchesUrl: isSidearmStaffDirectoryProfileUrl,
  matchesHtml: (html) =>
    html.toLowerCase().includes("staff directory") &&
    (html.includes("staff-directory-bio-fields") || html.includes("s-person-details")),
  parse: (html, url) => {
    if (!isSidearmStaffDirectoryProfileUrl(url)) return [];

    const contact = parseStaffProfilePage(html, url);
    if (!contact) return [];
    if (!isSoftballStaffProfilePage(html, contact)) return [];
    if (!isSoftballCoachingContact(contact)) return [];

    return [contact];
  },
};
