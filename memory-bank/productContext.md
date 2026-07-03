# Product Context

## Problem
High school athletes spend significant time searching individual college athletic websites to find recruiting contact information. Every school structures its site differently.

## Solution
RecruitConnect centralizes publicly available recruiting contact information into one searchable interface.

## Target User
Prospective college softball athletes (and their parents/coaches) researching programs.

## User Journey (MVP)
1. Land on home page with search bar.
2. Type a school name (partial match supported).
3. Select a school from results.
4. View school details: name, division, state, athletics website, softball coaching staff with emails and phones.

## Data Model
- **schools**: institution metadata and athletics URL
- **sports**: links a school to a sport (softball for MVP)
- **contacts**: coach name, title, email, phone per sport

## Non-Functional Goals
- Responsive UI
- Search under 250ms (pg_trgm index)
- Restartable, idempotent scraper
- No duplicate contacts
