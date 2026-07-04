# Progress

## Completed
- [x] PRD reviewed and plan approved
- [x] Monorepo scaffold (frontend, backend, scraper, db, seed, docs, memory-bank)
- [x] Database schema (`db/001_init.sql`)
- [x] Starter seed — 15 D1 softball schools (`seed/schools.json`, `db/002_seed_schools.sql`)
- [x] Memory Bank initialized
- [x] Scraper pipeline (fetcher, discover, parse, normalize, persist, logger, CLI)
- [x] Backend skeleton (Express + health route + school routes)
- [x] Frontend skeleton (Vite React TS + placeholder Home)
- [x] Typecheck and build pass for all packages
- [x] Scraper POC verified: University of Alabama returns 17 contacts from live site
- [x] Frontend search + school details pages wired to API
- [x] Division filter on search (D1, D2, D3, JUCO, NAIA)
- [x] Texas expansion — 90 TX programs (all divisions); TX-first home page UX
- [x] TX contact data cleanup (`db/019`–`021`); generic-email / garbage-name scraper guards
- [x] Email templates tab + copy email on contact cards; mobile-friendly UI
- [x] Templates refined (metric subjects, personalization lead, bullet stats, profile/CC, ID-camp ask, showcase jersey #/color)
- [x] Coolify production deploy (Express serves frontend + `/api`)
- [x] Team beta shared
- [x] AR/LA JUCO + NAIA — 17 schools seeded, scraped 17/17 (25 contacts, 19 emails)

## In Progress
- None (session ended)

## Next session
- [ ] **Oklahoma JUCO + NAIA** — research list, `docs/ok/`, seed, SQL, scrape (same pattern as AR/LA)
- [ ] Deploy latest frontend (templates refinements) if not already live

## Later (roadmap)
- D3 → D2 → D1 in AR/LA/OK regions (after OK JUCO/NAIA)
- Optional: spot-check AR/LA zero-contact / thin-email schools
- Remaining TX zero-contact / missing-email triage (lower priority)

## Session Log
### 2026-07-03 (evening — team share + AR/LA + templates)
- Contact cleanup SQL applied; Texas State staff added manually
- Templates tab (intro, follow-up, camp, showcase); copy email buttons; mobile CSS
- Templates upgraded per `recruiting_email_improvements.md` (metrics, personalization, ID camps, jersey #/color, CC coach)
- Shared site with daughter's team (158 programs / 90 TX at share time)
- Regional expansion: AR/LA JUCO+NAIA — 17 schools, scrape 17/17 success, 25 contacts, 19 emails
- Seed total: 175 schools
- **Next session: Oklahoma JUCO/NAIA** (deploy template updates if not live yet)


### 2026-07-03 (URL verification / TX scrape)
- Texas URL verification master applied; 90 TX schools; overnight scrape 90/90
- Commerce inflation fix; UT tickets@ email blocklist

### 2026-07-02 (Texas focus)
- Expanded seed and TX-first home page UX
- JUCO / D2 / D3 / NAIA support; PrestoSports + Sidearm parsers
- Division filter and bulk scrape CLI
