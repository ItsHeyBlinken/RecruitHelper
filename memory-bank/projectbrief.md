# Project Brief

## Name
RecruitConnect (working title)

## Purpose
A web application that centralizes publicly available NCAA softball recruiting contact information so prospective college athletes can search for a college and immediately view coaching staff contact details.

## MVP Scope
- Sport: NCAA softball only
- Data: school name, division, state, athletics URL, coach name, title, email, phone
- Search: case-insensitive partial match by school name
- Data collection: automated web scraper (no manual coach entry)

## Out of Scope (MVP)
User accounts, auth, admin dashboard, favorites, AI, messaging, multiple sports, paid subscriptions.

## Success Criteria
1. User searches for a college by name.
2. User opens the school page.
3. User views softball recruiting contacts without visiting the athletics website.

## Repository Structure
```
/frontend   - React + Vite + TypeScript
/backend    - Node + Express + TypeScript
/scraper    - Node + Cheerio + Playwright + TypeScript
/db         - SQL migrations (applied manually in pgAdmin)
/seed       - School seed data (JSON)
/docs       - PRD and architecture notes
/memory-bank
```
