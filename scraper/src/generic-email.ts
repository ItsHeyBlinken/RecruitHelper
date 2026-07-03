const GENERIC_EMAIL_LOCALS = new Set([
  "tickets",
  "ticket",
  "ticketing",
  "hr",
  "info",
  "athletics",
  "communications",
  "communication",
  "marketing",
  "media",
  "compliance",
  "facilities",
  "admin",
  "administration",
  "sportsinfo",
  "sportinfo",
  "noreply",
  "donotreply",
  "webmaster",
  "support",
  "help",
  "contact",
  "general",
  "office",
  "reception",
  "sponsorship",
  "sales",
  "booking",
  "events",
  "groups",
  "group",
]);

export function isGenericAthleticsEmail(email: string | null | undefined): boolean {
  if (!email) return false;

  const [local] = email.toLowerCase().split("@");
  if (!local) return false;

  if (GENERIC_EMAIL_LOCALS.has(local)) return true;
  if (/^ticket(s|ing)?$/i.test(local)) return true;

  return false;
}

export function rejectGenericEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  return isGenericAthleticsEmail(email) ? null : email.toLowerCase();
}
