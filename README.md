# RecruitConnect

Centralized NCAA softball recruiting contact search. MVP foundation monorepo.

## Structure

```
frontend/   React + Vite + TypeScript
backend/    Express + PostgreSQL API
scraper/    Cheerio + Playwright data collector
db/         SQL migrations (apply manually in pgAdmin)
seed/       School seed JSON
docs/       Setup guides + Texas verification docs (`docs/texas/`)
memory-bank/ Project context and progress
```

## Quick Start

1. **Database** — follow [docs/database-setup.md](docs/database-setup.md)
2. **Install**
   ```bash
   npm install
   npx playwright install chromium
   ```
3. **Configure** — copy `.env.example` to `.env` and set `DATABASE_URL`
4. **Scrape one school (POC)**
   ```bash
   npm run scrape -- --school "University of Alabama"
   ```
5. **Dev servers**
   ```bash
   npm run dev            # frontend (:5173) + backend (:3001)
   ```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/schools` | List all schools |
| GET | `/schools/search?q=` | Search by name |
| GET | `/schools/:id` | School details |
| GET | `/schools/:id/contacts` | Softball contacts |

## Scripts

```bash
npm run typecheck    # Typecheck all packages
npm run build        # Build all packages
npm run scrape       # Scrape one school
npm run scrape:tx    # Bulk scrape all TX schools
npm run texas:url-checklist  # Regenerate docs/texas/url-checklist.html
```
