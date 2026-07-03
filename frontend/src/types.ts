export const SCHOOL_DIVISIONS = ["D1", "D2", "D3", "JUCO", "NAIA"] as const;

export type SchoolDivision = (typeof SCHOOL_DIVISIONS)[number];

export const DIVISION_LABELS: Record<SchoolDivision, string> = {
  D1: "Division I",
  D2: "Division II",
  D3: "Division III",
  JUCO: "JUCO",
  NAIA: "NAIA",
};

export interface School {
  id: number;
  school_name: string;
  abbreviation: string | null;
  aliases: string[];
  division: string;
  state: string;
  athletics_url: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: number;
  sport_id: number;
  coach_name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  updated_at: string;
}

export type DivisionFilter = SchoolDivision | "ALL";

export interface SchoolStats {
  total: number;
  byDivision: Partial<Record<SchoolDivision, number>>;
  texasTotal: number;
  texasByDivision: Partial<Record<SchoolDivision, number>>;
}
