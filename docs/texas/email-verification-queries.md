# Email Verification Queries

Run these in pgAdmin to find contacts or schools missing emails for manual verification.

## Contacts missing email

Lists each coach without an email, with the athletics URL for manual checking.

```sql
SELECT
  sch.division,
  sch.state,
  sch.school_name,
  c.coach_name,
  c.title,
  c.phone,
  sch.athletics_url
FROM contacts c
JOIN sports sp ON sp.id = c.sport_id
JOIN schools sch ON sch.id = sp.school_id
WHERE sp.sport_name = 'softball'
  AND (c.email IS NULL OR TRIM(c.email) = '')
ORDER BY sch.state, sch.division, sch.school_name, c.coach_name;
```

## Schools where every contact has no email

Useful when an entire program scraped with names/titles but zero emails.

```sql
SELECT
  sch.division,
  sch.state,
  sch.school_name,
  COUNT(*)::int AS contacts_without_email,
  sch.athletics_url
FROM contacts c
JOIN sports sp ON sp.id = c.sport_id
JOIN schools sch ON sch.id = sp.school_id
WHERE sp.sport_name = 'softball'
  AND (c.email IS NULL OR TRIM(c.email) = '')
GROUP BY sch.division, sch.state, sch.school_name, sch.athletics_url
HAVING COUNT(*) = (
  SELECT COUNT(*)
  FROM contacts c2
  JOIN sports sp2 ON sp2.id = c2.sport_id
  WHERE sp2.school_id = sch.id
    AND sp2.sport_name = 'softball'
)
ORDER BY sch.state, sch.division, sch.school_name;
```

## Texas-only: contacts missing email

```sql
SELECT
  sch.division,
  sch.school_name,
  c.coach_name,
  c.title,
  sch.athletics_url
FROM contacts c
JOIN sports sp ON sp.id = c.sport_id
JOIN schools sch ON sch.id = sp.school_id
WHERE sp.sport_name = 'softball'
  AND sch.state = 'TX'
  AND (c.email IS NULL OR TRIM(c.email) = '')
ORDER BY sch.division, sch.school_name, c.coach_name;
```

## Schools with zero contacts

Programs not scraped yet (or scrape returned nothing).

```sql
SELECT
  sch.division,
  sch.state,
  sch.school_name,
  sch.athletics_url
FROM schools sch
LEFT JOIN sports sp ON sp.school_id = sch.id AND sp.sport_name = 'softball'
LEFT JOIN contacts c ON c.sport_id = sp.id
WHERE c.id IS NULL
ORDER BY sch.state, sch.division, sch.school_name;
```

## Sanity check: inflated contact counts

Should return zero rows after a clean scrape. Any school with more than 12 contacts is likely bad data.

```sql
SELECT
  sch.school_name,
  sch.division,
  COUNT(*)::int AS contact_count
FROM contacts c
JOIN sports sp ON sp.id = c.sport_id
JOIN schools sch ON sch.id = sp.school_id
WHERE sp.sport_name = 'softball'
GROUP BY sch.school_name, sch.division
HAVING COUNT(*) > 12
ORDER BY contact_count DESC;
```
