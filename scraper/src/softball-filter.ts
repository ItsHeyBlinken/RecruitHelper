import type { ScrapedContact } from "./types.js";

const OTHER_SPORT_MARKERS = [
  "football",
  "basketball",
  "baseball",
  "soccer",
  "volleyball",
  "track",
  "cross country",
  "cross-country",
  "golf",
  "tennis",
  "bowling",
  "lacrosse",
  "swimming",
  "wrestling",
  "cheer",
  "spirit",
  "esports",
  "hockey",
  "rowing",
  "field hockey",
  "men's basketball",
  "women's basketball",
  "m/w track",
  "m/w golf",
];

const ADMIN_TITLE_MARKERS = [
  "athletic director",
  "business manager",
  "compliance",
  "sports information",
  "communications director",
  "facilities",
  "marketing",
  "development",
  "academic enhancement",
  "equipment manager",
  "sports medicine",
  "athletic trainer",
  "strength and conditioning",
  "strength & conditioning",
  "video coordinator",
  "ticketing",
  "senior woman administrator",
  "operations and facilities",
];

const COACHING_TITLE_PATTERN =
  /(head|assistant|associate|volunteer|graduate|student)\s+(softball\s+)?coach|softball\s+coach|graduate assistant|student assistant|recruiting coordinator/i;

export function isSoftballCoachingContact(contact: ScrapedContact): boolean {
  const title = (contact.title ?? "").trim();
  if (!title) return false;

  const lower = title.toLowerCase();

  if (OTHER_SPORT_MARKERS.some((sport) => lower.includes(sport))) {
    return false;
  }

  if (ADMIN_TITLE_MARKERS.some((role) => lower.includes(role))) {
    return false;
  }

  return COACHING_TITLE_PATTERN.test(title);
}

export function filterSoftballCoachingContacts(contacts: ScrapedContact[]): ScrapedContact[] {
  return contacts.filter(isSoftballCoachingContact);
}
