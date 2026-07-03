import { parseStaffPage } from "../parse.js";
import type { PageParser } from "./types.js";
import { isStaffDirectoryUrl } from "./types.js";

function htmlLooksLikeSidearmRoster(html: string): boolean {
  const lower = html.toLowerCase();
  return (
    lower.includes("sidearm") ||
    lower.includes("sidearm-staff-member") ||
    lower.includes("/roster/coach/") ||
    lower.includes("coaches-list")
  );
}

export const sidearmRosterParser: PageParser = {
  id: "sidearm-roster",
  matchesUrl: (url) => !isStaffDirectoryUrl(url),
  matchesHtml: htmlLooksLikeSidearmRoster,
  parse: (html, _url) => parseStaffPage(html),
};
