const FUSED_ROLE_PREFIX_WORDS = [
  "coordinator",
  "manager",
  "trainer",
  "director",
  "assistant",
  "operations",
  "associate",
  "performance",
  "equipment",
  "player",
  "athletic",
  "communication",
  "development",
  "sports",
] as const;

function stripRolePrefixOnce(local: string, word: string): string {
  if (local.startsWith(word) && local.length > word.length + 2) {
    return local.slice(word.length);
  }
  return local;
}

function isPlausibleEmail(email: string): boolean {
  if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)) return false;
  if (/https?/i.test(email)) return false;
  const tld = email.split(".").pop() ?? "";
  if (tld.length > 24) return false;
  return true;
}

function shouldStripCoachPrefix(local: string, domain: string): boolean {
  if (!domain.endsWith(".edu")) return false;
  return local.startsWith("coach") && local.length > 7;
}

/** Strip job-title words accidentally fused onto the email local part during scraping. */
export function repairFusedRoleEmailPrefix(email: string): string {
  const lower = email.toLowerCase();
  const at = lower.indexOf("@");
  if (at <= 0) return lower;

  let local = lower.slice(0, at);
  const domain = lower.slice(at + 1);

  for (const word of FUSED_ROLE_PREFIX_WORDS) {
    local = stripRolePrefixOnce(local, word);
  }

  if (shouldStripCoachPrefix(local, domain)) {
    local = local.slice(5);
  }

  const repaired = `${local}@${domain}`;
  return isPlausibleEmail(repaired) ? repaired : lower;
}
