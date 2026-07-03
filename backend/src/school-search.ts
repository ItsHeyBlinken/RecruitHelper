export const SCHOOL_SEARCH_MATCH = `
  LOWER(school_name) LIKE LOWER($1)
  OR LOWER(COALESCE(abbreviation, '')) LIKE LOWER($1)
  OR EXISTS (
    SELECT 1
    FROM unnest(COALESCE(aliases, ARRAY[]::text[])) AS alias
    WHERE LOWER(alias) LIKE LOWER($1)
  )
`;

export const SCHOOL_SEARCH_RANK = `
  CASE
    WHEN LOWER(abbreviation) = LOWER($2) THEN 0
    WHEN LOWER($2) = ANY (
      SELECT LOWER(a) FROM unnest(COALESCE(aliases, ARRAY[]::text[])) AS a
    ) THEN 0
    WHEN LOWER(COALESCE(abbreviation, '')) LIKE LOWER($1) THEN 1
    WHEN EXISTS (
      SELECT 1
      FROM unnest(COALESCE(aliases, ARRAY[]::text[])) AS alias
      WHERE LOWER(alias) LIKE LOWER($1)
    ) THEN 1
    ELSE 2
  END
`;
