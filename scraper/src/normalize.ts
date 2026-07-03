import type { ScrapedContact } from "./types.js";
import { filterSoftballCoachingContacts } from "./softball-filter.js";
import { isGenericAthleticsEmail } from "./generic-email.js";

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

const TITLE_PATTERNS = [
  /Associate Director of Performance, Olympic Sports/i,
  /Assistant Director, Athletics Communication/i,
  /Coordinator, Player Development/i,
  /Operations Coordinator/i,
  /Associate Head Coach/i,
  /Assistant Equipment Manager/i,
  /Head Coach/i,
  /Assistant Coach/i,
  /Athletic Trainer/i,
  /Associate Director[\w\s,]+/i,
  /Assistant Director[\w\s,]+/i,
  /Director[\w\s,]+/i,
  /Coordinator[\w\s,]+/i,
  /Equipment Manager/i,
  /Manager/i,
];

function extractTitle(text: string): string | null {
  let best: string | null = null;

  for (const pattern of TITLE_PATTERNS) {
    const match = text.match(pattern);
    if (!match) continue;

    const candidate = normalizeWhitespace(match[0]);
    if (!best || candidate.length > best.length) {
      best = candidate;
    }
  }

  return best;
}

const GARBAGE_EMAIL_PREFIX =
  /^(coach|coordinator|manager|trainer|communication|development|sports|director|assistant|operations|athletic|associate|performance|equipment|player)+/i;

const MAX_VARCHAR = 255;

function truncate(value: string, max = MAX_VARCHAR): string {
  return value.length > max ? value.slice(0, max) : value;
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function isLikelyTitle(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("coach") ||
    lower.includes("director") ||
    lower.includes("coordinator") ||
    lower.includes("assistant") ||
    lower.includes("manager") ||
    lower.includes("trainer") ||
    lower.includes("recruit") ||
    lower.includes("operations")
  );
}

function isLikelyName(text: string): boolean {
  if (!text || text.length < 3 || text.length > 80) return false;
  if (text.includes("@")) return false;
  if (/\$\{/.test(text)) return false;
  if (/^open\s/i.test(text)) return false;
  if (/^to be announced$/i.test(text.trim())) return false;
  if (/^\d+$/.test(text)) return false;
  const words = text.trim().split(/\s+/);
  return words.length >= 2 && words.length <= 5;
}

export function cleanEmail(raw: string | null): string | null {
  if (!raw) return null;

  const candidates = raw.match(EMAIL_REGEX);
  if (!candidates || candidates.length === 0) return null;

  const scored = candidates.map((email) => {
    const [local] = email.split("@");
    let score = 0;
    if (!local) return { email, score: -100 };

    if (PHONE_REGEX.test(local)) score -= 50;
    if (GARBAGE_EMAIL_PREFIX.test(local)) score -= 30;
    if (/\d{3}/.test(local)) score -= 20;
    if (local.length <= 20) score += 10;
    if (local.length <= 12) score += 5;
    if (/^[a-z][a-z0-9._-]+$/i.test(local)) score += 10;

    return { email: email.toLowerCase(), score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored.find((entry) => !isGenericAthleticsEmail(entry.email)) ?? scored[0];
  if (!best || best.score < -40) {
    const buried = raw.match(/([a-z][a-z0-9]{2,24}@(?:[a-z0-9-]+\.)+[a-z]{2,})$/i);
    const buriedEmail = buried ? buried[1].toLowerCase() : null;
    return isGenericAthleticsEmail(buriedEmail) ? null : buriedEmail;
  }

  return isGenericAthleticsEmail(best.email) ? null : best.email;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function titleContainsName(title: string, coachName: string): boolean {
  const lower = title.toLowerCase();
  return coachName
    .split(/\s+/)
    .some((part) => part.length > 2 && lower.includes(part.toLowerCase()));
}

function stripCoachNameFromTitle(title: string, coachName: string): string {
  let cleaned = title;
  const fullName = coachName.trim();

  if (fullName) {
    cleaned = cleaned.replace(new RegExp(`^${escapeRegExp(fullName)}\\s*`, "i"), "");
    const fusedName = fullName.replace(/\s+/g, "");
    cleaned = cleaned.replace(new RegExp(`^${escapeRegExp(fusedName)}`, "i"), "");
  }

  for (const part of coachName.split(/\s+/)) {
    if (part.length > 2) {
      cleaned = cleaned.replace(new RegExp(escapeRegExp(part), "gi"), " ");
    }
  }

  return normalizeWhitespace(cleaned);
}

export function cleanTitle(title: string | null, coachName: string): string | null {
  if (!title) return null;

  const stripped = title.replace(EMAIL_REGEX, " ").replace(PHONE_REGEX, " ");

  const fromRaw = extractTitle(stripped);
  if (fromRaw && !titleContainsName(fromRaw, coachName)) {
    return fromRaw;
  }

  let cleaned = stripCoachNameFromTitle(stripped, coachName);
  const extracted = extractTitle(cleaned);
  if (extracted) {
    cleaned = extracted;
  }

  if (!cleaned || cleaned.length < 3) return null;
  if (!isLikelyTitle(cleaned)) return null;
  if (titleContainsName(cleaned, coachName)) return fromRaw;

  return cleaned;
}

function normalizePhone(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone.trim();
}

function pickBetterName(a: string, b: string): string {
  const aFull = isLikelyName(a);
  const bFull = isLikelyName(b);
  if (aFull && !bFull) return a;
  if (bFull && !aFull) return b;
  return a.length >= b.length ? a : b;
}

function pickBetterTitle(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  if (isLikelyTitle(a) && !isLikelyTitle(b)) return a;
  if (isLikelyTitle(b) && !isLikelyTitle(a)) return b;
  return a.length >= b.length ? a : b;
}

function mergeDuplicates(contacts: ScrapedContact[]): ScrapedContact[] {
  const groups = new Map<string, ScrapedContact[]>();

  for (const contact of contacts) {
    const key = contact.email
      ? `email:${contact.email}|name:${contact.coach_name.toLowerCase()}`
      : `name:${contact.coach_name.toLowerCase()}`;

    const existing = groups.get(key) ?? [];
    existing.push(contact);
    groups.set(key, existing);
  }

  const merged: ScrapedContact[] = [];

  for (const group of groups.values()) {
    const combined = group.reduce<ScrapedContact>(
      (best, current) => ({
        coach_name: pickBetterName(best.coach_name, current.coach_name),
        title: pickBetterTitle(best.title, current.title),
        email: best.email ?? current.email,
        phone: best.phone ?? current.phone,
      }),
      group[0],
    );
    merged.push(combined);
  }

  return merged.sort((a, b) => a.coach_name.localeCompare(b.coach_name));
}

export function normalizeContact(contact: ScrapedContact): ScrapedContact {
  const email = cleanEmail(contact.email);
  const coachName = truncate(normalizeWhitespace(contact.coach_name));
  const title = cleanTitle(contact.title, coachName);

  return {
    coach_name: coachName,
    title: title ? truncate(title) : null,
    email,
    phone: normalizePhone(contact.phone),
  };
}

function isMalformedTitle(title: string | null, coachName: string): boolean {
  if (!title) return false;
  if (title.length > 55) return true;
  if ((title.match(/Coach/gi) ?? []).length > 1) return true;
  if ((title.match(/Coordinator/gi) ?? []).length > 1) return true;
  const nameParts = coachName.split(/\s+/).filter((p) => p.length > 2);
  const otherNames = nameParts.filter((part) => {
    const lower = title.toLowerCase();
    return lower.includes(part.toLowerCase()) && part.toLowerCase() !== coachName.toLowerCase();
  });
  return titleContainsName(title, coachName) && title.length > 25 && otherNames.length > 0;
}

function mergeContactPair(a: ScrapedContact, b: ScrapedContact): ScrapedContact {
  const withEmail = a.email ? a : b.email ? b : a;
  const other = withEmail === a ? b : a;

  return {
    coach_name: pickBetterName(a.coach_name, b.coach_name),
    title: pickBetterTitle(withEmail.title, other.title),
    email: a.email ?? b.email,
    phone: a.phone ?? b.phone,
  };
}

function mergeByCoachName(contacts: ScrapedContact[]): ScrapedContact[] {
  const byName = new Map<string, ScrapedContact>();

  for (const contact of contacts) {
    if (isMalformedTitle(contact.title, contact.coach_name)) continue;

    const key = contact.coach_name.toLowerCase();
    const existing = byName.get(key);

    if (!existing) {
      byName.set(key, contact);
      continue;
    }

    byName.set(key, mergeContactPair(existing, contact));
  }

  return Array.from(byName.values());
}

export function normalizeContacts(contacts: ScrapedContact[]): ScrapedContact[] {
  const cleaned = contacts.map(normalizeContact);
  const byEmail = mergeDuplicates(cleaned);
  const merged = mergeByCoachName(byEmail);
  return filterSoftballCoachingContacts(merged);
}
