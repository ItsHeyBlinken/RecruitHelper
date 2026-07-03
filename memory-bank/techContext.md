# Tech Context

## Stack
| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 19, Vite 6, TypeScript        |
| Backend  | Node.js 22, Express 4, TypeScript   |
| Database | PostgreSQL 17                       |
| Scraper  | Cheerio, Playwright, TypeScript     |

## Local Toolchain (verified)
- Node v22.22.2
- npm 11.3.0
- PostgreSQL 17.10 (psql)
- git 2.49.0

## Environment Variables
See `.env.example`:
- `DATABASE_URL` — PostgreSQL connection string
- `PORT` — backend server port (default 3001)
- `VITE_API_URL` — frontend API base URL

## Package Manager
npm workspaces at repo root. Packages: `frontend`, `backend`, `scraper`.

## Database Setup (manual)
1. Create database `recruitconnect` in pgAdmin
2. Run `db/001_init.sql`
3. Run `db/002_seed_schools.sql`

## Dev Commands
```bash
npm install                  # install all workspaces
npm run dev                  # start frontend (:5173) + backend (:3001)
npm run seed                 # upsert schools from seed/schools.json
npm run scrape:all           # scrape all schools in database
npm run scrape -- --school "University of Alabama"
npm run typecheck            # typecheck all packages
```
