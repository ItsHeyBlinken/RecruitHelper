import type { SchoolDivision } from "../types";

export function getDivisionCount(
  counts: Partial<Record<SchoolDivision, number>>,
  division: SchoolDivision,
): number {
  return counts[division] ?? 0;
}
