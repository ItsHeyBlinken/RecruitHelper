import type { DivisionFilter, School, SchoolDivision } from "../types";

/** Texas programs highlighted on the home page (search still covers all schools). */
export const POPULAR_BY_DIVISION: Record<SchoolDivision, string[]> = {
  JUCO: [
    "Tyler Junior College",
    "McLennan Community College",
    "Odessa College",
    "Grayson College",
    "Midland College",
    "Blinn College",
    "Kilgore College",
    "Navarro College",
    "Temple College",
    "Weatherford College",
  ],
  D3: [
    "Texas Lutheran University",
    "East Texas Baptist University",
    "Trinity University",
    "University of Mary Hardin-Baylor",
    "Hardin-Simmons University",
    "Concordia University Texas",
    "Southwestern University",
    "University of Dallas",
  ],
  D2: [
    "West Texas A&M University",
    "University of Texas at Tyler",
    "Angelo State University",
    "Texas Woman's University",
    "Texas A&M University-Kingsville",
    "Lubbock Christian University",
    "St. Mary's University",
    "University of Texas Permian Basin",
  ],
  D1: [
    "University of Texas",
    "Texas A&M University",
    "Texas Tech University",
    "Baylor University",
    "University of Houston",
    "Texas State University",
    "University of Texas at San Antonio",
    "TCU",
  ],
  NAIA: [
    "Texas Wesleyan University",
    "Our Lady of the Lake University",
    "Wayland Baptist University",
    "University of Houston-Victoria",
    "Jarvis Christian University",
  ],
};

export const POPULAR_ALL: string[] = [
  "University of Texas",
  "Texas A&M University",
  "Tyler Junior College",
  "McLennan Community College",
  "West Texas A&M University",
  "Texas Lutheran University",
  "Angelo State University",
  "Baylor University",
  "Odessa College",
  "University of Texas at Tyler",
];

function normalizeKey(value: string): string {
  return value.trim().toLowerCase();
}

function schoolLookupKeys(school: School): string[] {
  const keys = [school.school_name, ...(school.aliases ?? [])];
  if (school.abbreviation) keys.push(school.abbreviation);
  return keys.map(normalizeKey);
}

export function pickPopularSchools(schools: School[], keys: string[]): School[] {
  const index = new Map<string, School>();
  for (const school of schools) {
    for (const key of schoolLookupKeys(school)) {
      if (!index.has(key)) index.set(key, school);
    }
  }

  const seen = new Set<number>();
  const picked: School[] = [];

  for (const key of keys) {
    const school = index.get(normalizeKey(key));
    if (!school || seen.has(school.id)) continue;
    seen.add(school.id);
    picked.push(school);
  }

  return picked;
}

export function getPopularProgramKeys(division: DivisionFilter): string[] {
  if (division === "ALL") return POPULAR_ALL;
  return POPULAR_BY_DIVISION[division];
}

export function getPopularHeading(division: DivisionFilter): string {
  switch (division) {
    case "ALL":
      return "Popular Texas programs";
    case "D1":
      return "Popular Texas Division I programs";
    case "D2":
      return "Popular Texas Division II programs";
    case "D3":
      return "Popular Texas Division III programs";
    case "JUCO":
      return "Popular Texas JUCO programs";
    case "NAIA":
      return "Popular Texas NAIA programs";
    default: {
      const exhaustive: never = division;
      return exhaustive;
    }
  }
}
