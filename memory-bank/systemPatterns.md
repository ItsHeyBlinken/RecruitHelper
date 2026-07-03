# System Patterns

## Architecture
Three standalone applications sharing a PostgreSQL database:
1. **Frontend** — search UI and school detail display
2. **Backend** — REST API reading from PostgreSQL
3. **Scraper** — standalone CLI that discovers, parses, and upserts coach data

## Scraper Pipeline
```
fetcher → discover → parse → normalize → persist
```
- Static fetch + Cheerio first; Playwright fallback for JS-rendered pages
- Per-school try/catch; log errors, continue processing
- Idempotent upserts via `ON CONFLICT DO UPDATE`

## Database Idempotency
- `sports`: UNIQUE (school_id, sport_name)
- `contacts`: UNIQUE (sport_id, coach_name, title)
- `contacts`: partial UNIQUE (sport_id, LOWER(email)) WHERE email IS NOT NULL

## API Conventions
- REST, JSON responses
- `GET /schools` — list all
- `GET /schools/search?q=` — partial case-insensitive search
- `GET /schools/:id` — school detail
- `GET /schools/:id/contacts` — softball contacts for school

## Error Handling
- Scraper: log and continue per school
- API: standard HTTP status codes with JSON error body

## TypeScript Conventions
- Strict mode enabled
- Exhaustive switch with `never` check on discriminated unions
- Imports at top of file (no inline imports)
