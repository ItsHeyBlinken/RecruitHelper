import type { ScrapedContact } from "../types.js";

export type PageParser = {
  id: string;
  matchesUrl: (url: string) => boolean;
  matchesHtml: (html: string) => boolean;
  parse: (html: string, url: string) => ScrapedContact[];
};

export const STAFF_DIRECTORY_PATHS = [
  "/staff-directory/#coaches",
  "/staff-directory/",
  "/staff-directory",
  "/insideAthletics/directory/index",
  "/insideAthletics/directory/",
  "/InsideAthletics/directory/index",
] as const;

export function isStaffDirectoryUrl(url: string): boolean {
  const lower = url.toLowerCase();
  if (/\/staff-directory\/[^/]+\/\d+/.test(lower)) return false;
  return (
    lower.includes("staff-directory") ||
    lower.includes("insideathletics/directory") ||
    /\/directory\/index/.test(lower)
  );
}

/** Sidearm sites mirror the full athletics staff directory at this path. */
export function isSoftballStaffMirrorUrl(url: string): boolean {
  return /\/sports\/softball\/staff\/?(?:[#?].*)?$/i.test(url);
}

export function usesStaffDirectoryParser(url: string): boolean {
  return isStaffDirectoryUrl(url) || isSoftballStaffMirrorUrl(url);
}
