import type { ScrapedContact } from "./types.js";

export function namesMatch(a: string, b: string): boolean {
  const normalize = (name: string) => name.toLowerCase().replace(/[^a-z]/g, "");
  const aNorm = normalize(a);
  const bNorm = normalize(b);
  return aNorm === bNorm || aNorm.includes(bNorm) || bNorm.includes(aNorm);
}

export function mergeEmailsByName(
  contacts: ScrapedContact[],
  sources: ScrapedContact[],
): ScrapedContact[] {
  const enriched = contacts.map((contact) => ({ ...contact }));

  for (const source of sources) {
    if (!source.email) continue;

    const match = enriched.find((contact) => namesMatch(contact.coach_name, source.coach_name));
    if (!match || match.email) continue;

    match.email = source.email;
    if (!match.phone && source.phone) {
      match.phone = source.phone;
    }
  }

  return enriched;
}
