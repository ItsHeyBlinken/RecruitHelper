# RecruitConnect - Database Setup

Apply these steps in **pgAdmin** before running the scraper or backend.

## 1. Create the database

1. Open pgAdmin and connect to your local PostgreSQL server.
2. Right-click **Databases** → **Create** → **Database**.
3. Name: `recruitconnect`
4. Click **Save**.

## 2. Run the schema migration

1. Select the `recruitconnect` database.
2. Open **Query Tool** (Tools → Query Tool).
3. Open and paste the contents of [`db/001_init.sql`](../db/001_init.sql).
4. Click **Execute** (F5).
5. Verify tables exist: `schools`, `sports`, `contacts`.

## 3. Seed school data

1. In the same Query Tool (connected to `recruitconnect`).
2. Open and paste the contents of [`db/002_seed_schools.sql`](../db/002_seed_schools.sql).
3. Click **Execute**.
4. Verify: `SELECT COUNT(*) FROM schools;` should return **15**.

## Optional migrations

After the initial schema, apply additional scripts in order as needed:

| File | Purpose |
|------|---------|
| `db/003_add_schools.sql` | Extra school rows (if not using `npm run seed`) |
| `db/004_division_index.sql` | Index on `schools.division` for faster filtering |
| `db/005_add_school_abbreviations.sql` | `abbreviation` column (superseded by 006 if not yet applied) |
| `db/006_search_aliases.sql` | Common recruiting aliases — LSU, UofA, OSU, Mizzou, etc. |
| `db/007_add_juco_schools.sql` | 15 NJCAA JUCO softball programs |

After `006`, run `npm run seed` to sync aliases from `seed/schools.json`.
After `007`, run `npm run seed` or scrape JUCO schools individually.

## 4. Configure environment

1. Copy `.env.example` to `.env` at the repo root.
2. Update `DATABASE_URL` with your PostgreSQL credentials:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/recruitconnect
   ```

## 5. Run the scraper (POC)

```bash
npm install
npx playwright install chromium
npm run scrape -- --school "University of Alabama"
```

## 6. Verify idempotency

Re-run the same scrape command. Contact count should not increase:

```sql
SELECT COUNT(*) FROM contacts;
```

## 7. Start dev servers

```bash
npm run dev    # frontend http://localhost:5173 + backend http://localhost:3001
```

Test health: `GET http://localhost:3001/health`
