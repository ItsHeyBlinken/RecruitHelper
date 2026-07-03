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

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractTitle(text: string): string | null {
  let best: string | null = null;

  for (const pattern of TITLE_PATTERNS) {
    const match = text.match(pattern);
    if (!match) continue;

    const candidate = match[0].replace(/\s+/g, " ").trim();
    if (!best || candidate.length > best.length) {
      best = candidate;
    }
  }

  return best;
}

function titleContainsName(title: string, coachName: string): boolean {
  const lower = title.toLowerCase();
  return coachName
    .split(/\s+/)
    .some((part) => part.length > 2 && lower.includes(part.toLowerCase()));
}

export function formatContactTitle(title: string | null, coachName: string): string | null {
  if (!title) return null;

  const trimmed = title.trim();
  if (!titleContainsName(trimmed, coachName)) return trimmed;

  const extracted = extractTitle(trimmed);
  if (extracted && !titleContainsName(extracted, coachName)) return extracted;

  let cleaned = trimmed;
  const fullName = coachName.trim();
  if (fullName) {
    cleaned = cleaned.replace(new RegExp(`^${escapeRegExp(fullName)}`, "i"), "");
    cleaned = cleaned.replace(new RegExp(`^${escapeRegExp(fullName.replace(/\s+/g, ""))}`, "i"), "");
  }

  for (const part of coachName.split(/\s+/)) {
    if (part.length > 2) {
      cleaned = cleaned.replace(new RegExp(escapeRegExp(part), "gi"), "");
    }
  }

  cleaned = cleaned.replace(/\s+/g, " ").trim();
  const fromCleaned = extractTitle(cleaned) ?? cleaned;

  return fromCleaned || null;
}
