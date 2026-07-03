export const SCHOOL_DIVISIONS = ["D1", "D2", "D3", "JUCO", "NAIA"] as const;

export type SchoolDivision = (typeof SCHOOL_DIVISIONS)[number];

export function isSchoolDivision(value: string): value is SchoolDivision {
  return (SCHOOL_DIVISIONS as readonly string[]).includes(value);
}

export function parseDivisionParam(value: unknown): SchoolDivision | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const upper = value.trim().toUpperCase();
  return isSchoolDivision(upper) ? upper : null;
}
