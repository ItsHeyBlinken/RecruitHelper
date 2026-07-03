import type { ScrapedContact } from "./types.js";
import { fetchHtml } from "./fetcher.js";
import { mergeEmailsByName } from "./contact-utils.js";
import { logger } from "./logger.js";
import {
  discoverStaffDirectoryCandidates,
  parseSoftballStaffDirectory,
} from "./parsers/index.js";

export { parseSoftballStaffDirectory } from "./parsers/index.js";

export async function enrichFromAthleticsStaffDirectory(
  contacts: ScrapedContact[],
  athleticsUrl: string,
  homepageHtml?: string,
): Promise<ScrapedContact[]> {
  const missing = contacts.filter((contact) => !contact.email).length;
  if (missing === 0 && contacts.length > 0) return contacts;

  const urls = discoverStaffDirectoryCandidates(athleticsUrl, homepageHtml);

  for (const url of urls) {
    try {
      const html = await fetchHtml(url, true);
      const directoryContacts = parseSoftballStaffDirectory(html);
      if (directoryContacts.length === 0) continue;

      if (contacts.length === 0) {
        logger.info("Athletics staff directory is primary contact source", {
          url,
          softballRows: directoryContacts.length,
        });
        return directoryContacts;
      }

      const enriched = mergeEmailsByName(contacts, directoryContacts);
      const found =
        enriched.filter((contact) => contact.email).length -
        contacts.filter((contact) => contact.email).length;

      if (found > 0) {
        logger.info(`Athletics staff directory added ${found} emails`, {
          url,
          softballRows: directoryContacts.length,
        });
        return enriched;
      }
    } catch (error) {
      logger.warn("Athletics staff directory fetch failed", {
        url,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return contacts;
}
