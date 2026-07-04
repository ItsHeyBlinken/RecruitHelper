# Active Context

## Current Phase
**Session paused 2026-07-03 (night).** Regional expansion in progress. TX done. AR/LA JUCO+NAIA scraped. **Next session: Oklahoma JUCO/NAIA.**

## Regional roadmap
1. **TX** — done (90 programs, all divisions; contacts cleaned)
2. **AR/LA JUCO + NAIA** — done (17 schools seeded + scraped)
3. **OK JUCO + NAIA** — **NEXT SESSION** (same pattern: doc → seed → SQL → scrape)
4. Later: D3 → D2 → D1 in those regions (smaller schools first within region)

Home page stays **Texas-first** (popular programs); AR/LA/OK via search + division filters.

## Next session: Oklahoma JUCO/NAIA
1. Research OK NJCAA + NAIA varsity softball programs and athletics URLs
2. Add `docs/ok/athletic-websites.md` (or `docs/ok/`)
3. Append to `seed/schools.json` + `db/023_add_ok_juco_naia_schools.sql`
4. User applies SQL in pgAdmin
5. Add `npm run scrape:ok` (or `--state OK --division JUCO,NAIA`) and run scrape
6. Spot-check contacts / fix bad URLs

## Key Decisions
- TypeScript across all packages
- npm workspaces monorepo
- User applies SQL migrations manually in pgAdmin
- User handles all git commits
- Texas-first home page — popular programs and stats highlight TX; nationwide schools retained in DB
- Expand regionally: JUCO/NAIA first, then higher divisions

## Session Log
- 2026-07-02: Initialized RecruitConnect monorepo per MVP foundation plan
- 2026-07-02: Foundation complete — all packages build, scraper POC parses Alabama (17 contacts)
- 2026-07-02: Added `npm run dev` to start frontend + backend concurrently
- 2026-07-02: Wired frontend search UI + school detail page to API
- 2026-07-02: Visual UI refresh — layout, typography, cards, dark hero theme
- 2026-07-02: Scraper data cleanup — email/title normalization, dedup by email, replace-on-scrape
- 2026-07-02: Expanded seed to 35 D1 schools; bulk scrape 33/35 success (Auburn + OK State fixed)
- 2026-07-02: Staff profile page scraping for mailto emails (ASU/WMT Digital sites)
- 2026-07-02: Division search filter — API `division` param (D1/D2/D3/JUCO), Home page chip filter, optional `db/004_division_index.sql`
- 2026-07-02: Arkansas scraper fix — `w-softbl` URL discovery, exclude baseball (`m-basebl`); 9 softball coaches; emails not published on site
- 2026-07-02: Athletics staff-directory enrichment — parse Softball section from `/staff-directory/#coaches` (Arkansas: 4/5 coach emails)
- 2026-07-02: Bulk re-scrape 35/35 schools with staff-directory enrichment; Arkansas + Kentucky emails via staff-directory
- 2026-07-02: LSU fix — `/sports/sb/roster` discovery + `/roster/coach/` profile pages (5 coaches, 5 emails)
- 2026-07-02: School abbreviation search — `abbreviation` + `aliases[]` (LSU, UofA, OSU, Mizzou, etc.), API + UI badges
- 2026-07-02: Added 15 JUCO softball schools to seed + `db/007_add_juco_schools.sql`; scraper recognizes `/sports/sball/` paths
- 2026-07-02: PrestoSports staff directory support — `/insideAthletics/directory/index` discovery + parse Softball section from `.table-responsive` tables (Chipola: 2 coaches + emails)
- 2026-07-02: Added 15 D2 + 15 D3 softball schools to seed + `db/008_add_d2_d3_schools.sql` (80 schools total in seed)
- 2026-07-02: Unified scraper parser registry — `parsers/` module with Sidearm roster + staff-directory (Sidearm/PrestoSports) parsers; directory URLs are first-class scrape candidates
- 2026-07-02: Sidearm `/staff-directory` prioritized for D2/D3 — tried before roster paths; category-table parsing (TLU/Pace) with section boundaries, class-year names, profile email enrichment
- 2026-07-02: PrestoSports coach profile parser — `/sports/sball/coaches/Name` URLs (Butler CC), profile link discovery from coaches list, Email/Title/Phone label parsing
- 2026-07-02: Home page popular programs — division-filtered featured school list when search is empty; updates on D1/D2/D3/JUCO chip selection
- 2026-07-02: Home page database stats note — `GET /api/schools/stats` shows total + per-division school counts; highlights active division chip
- 2026-07-02: Texas focus — keep all 80 nationwide schools, add 53 TX programs (133 total, 65 TX); `GET /api/schools?state=TX`, stats include `texasTotal`/`texasByDivision`; home popular programs TX-only; `db/009_add_texas_schools.sql`
- 2026-07-02: PrestoSports coach profile pages (Odessa `/sports/sball/Coaches/Name`) — fixed early-exit on empty staff-directory, profile name/email parsing, mailto link false positives; Odessa scrape: 3 coaches, 2 emails
- 2026-07-02: Bulk scrape CLI — `npm run scrape:all` with `--state`, `--division`, `--concurrency`; shortcuts `scrape:tx`, `scrape:tx-juco`
- 2026-07-02: Softball-only data — staff-directory Sidearm category parsing (TSU); persist filter for coaching titles; `db/010_cleanup_softball_contacts.sql`
- 2026-07-02: Sidearm NextGen staff directory (Baylor) — parse embedded `SOFTBALL |` NUXT group + `/staff-directory/slug/id` profile pages without softball in URL
- 2026-07-03: Diagnosed inflated TX contact counts (49/41/34) — stale bulk scrape from roster parser accepting generic "Assistant Coach" across all sports; re-scrape fixes TXST (5), TSU (4), ACU (5); added scraper candidate scoring + embedded JSON softball-title filter; remaining inflated: Texas Tech + UNT need re-scrape
- 2026-07-03: Fixed JUCO athletics URLs — Howard College → hchawk.com (2 coaches); Navarro College → navarrobulldogs.com; normalize dedup keeps separate coaches with shared program email; `db/011_allow_shared_program_emails.sql` drops per-sport email unique index
- 2026-07-03: Applied `Texas_College_Softball_Athletic_Websites.md` — 37 TX seed URL updates + `db/013_update_texas_athletics_urls.sql`; 27 TX programs in doc not yet in seed (NAIA, new JUCO, D1 additions)
- 2026-07-03: Added 27 missing TX schools to seed (160 total) + `db/014_add_missing_texas_schools.sql`; NAIA division support in API/frontend filter
- 2026-07-03: Synced updated `Texas_College_Softball_Athletic_Websites.md` — removed TCU/Rice (club only); split Dallas College into 4 campuses; UST → ustcelts.com; `db/015_sync_texas_doc_updates.sql`; seed now 93 TX programs, 0 doc/seed mismatches
- 2026-07-03: Texas Wesleyan → `https://ramsports.net/sports/softball`; `db/016_fix_texas_wesleyan_url.sql`
- 2026-07-03: Added `docs/texas-url-verification.html` + `npm run texas:url-checklist` for manual URL review before scraping
- 2026-07-03: Applied `Texas_Softball_URL_Verification_Master.md` — 25 URL fixes, 3 NJCAA removals (SWTJC, Texarkana, Laredo); `db/018_texas_verification_master_updates.sql`; 90 TX schools; seed/doc 0 mismatches
- 2026-07-03: Root cleanup — moved Texas verification docs to `docs/texas/`; root now config-only; `scripts/texas-doc-paths.mjs` centralizes doc paths
- 2026-07-03: Overnight TX bulk scrape — 90/90 schools, 188 contacts, 158 emails; verification: A&M-Commerce inflated (29), 9 TX zero-contact, ~30 coaches missing email
- 2026-07-03: Fixed Commerce inflation — `/sports/softball/staff` routed through staff-directory softball section parser; verified 1 coach (Rodney DeLong) after re-scrape
- 2026-07-03: Automated crawl of all 21 TX D1 athletics URLs (`scraper/src/verify-tx-d1.ts`) — 18 PASS, 3 WARN (partial emails), 0 FAIL; all doc URLs match seed; every site has discoverable softball coach contacts
- 2026-07-02: NJCAA URL crawl — verified 36 TX JUCO sites; wrote `NJCAA_URL_Verification_Findings.md` at repo root for manual sign-off
- 2026-07-03: Crawled all 15 NCAA D3 TX athletics URLs — 12 confirmed PASS, 3 need URL updates (mcmurryads→mcmurrysports.com, schreinerathletics→schreinermountaineers.com, hputx.edu/athletics→hpusports.com), ETBU redirect OK (goetbutigers.com), U Dallas PARTIAL (staff-directory, sparse coach emails); added `scripts/verify-d3-tx-urls.mjs`; wrote `Texas_D3_Athletics_URL_Verification.md` for manual sign-off
- 2026-07-02: Crawled all 12 NCAA D2 TX athletics URLs — 11/12 GOOD; fixed UTPB `utpbbasinguns.com` → `utpbfalcons.com`; results in `docs/d2-url-verification-results.json`; `db/017_fix_utpb_athletics_url.sql`
- 2026-07-02: Added `Texas_D2_Softball_URL_Verification.md` in project root for manual D2 URL verification checklist
- 2026-07-02: Added `NAIA_Texas_Softball_URL_Verification.md` at project root — 7/9 NAIA URLs confirmed, Jarvis + Texas College need replacement
- 2026-07-03: Consolidated all 5 division URL verification reports into `Texas_Softball_URL_Verification_Master.md` — single actionable checklist for 93 TX schools (21 URL fixes, 3 removals, scrape workflow)
- 2026-07-03: Fixed UT bogus `tickets@athletics.utexas.edu` on all coaches — added `scraper/src/generic-email.ts` blocklist; scraper now returns null email when only site-wide addresses found; current UT staff do not publish individual emails on texassports.com
- 2026-07-03: Coolify deploy fix — added `nixpacks.toml` start command; backend serves `frontend/dist` in production with `/api/schools` routes (single Node container, no nginx static wrapper)
- 2026-07-03: Contact data cleanup — `db/019`–`021` jumbled names, Texas State staff manual add; program emails kept; phones de-emphasized in UI
- 2026-07-03: Email templates tab — `/templates` (intro, follow-up, camp, showcase) + best practices; Copy email on contact cards; mobile-friendly UI pass
- 2026-07-03: Team beta shared (158 programs / 90 TX at share time)
- 2026-07-03: Regional expansion AR/LA JUCO+NAIA — 17 schools (`docs/ar-la/athletic-websites.md`, `db/022`, seed 175); BPCC coaches URL; scrape **17/17 success**, 25 contacts, 19 emails (~12 min); `npm run scrape:ar-la`; CLI comma-separated `--state` / `--division`
- 2026-07-03: **Session pin** — AR/LA JUCO+NAIA complete; **next session: Oklahoma JUCO/NAIA**
- 2026-07-03: Templates refined per `recruiting_email_improvements.md` — metric subjects, early personalization, bullet stats, Hudl/YouTube + profile links, CC coach, ID-camp ask, showcase jersey #/color, timing tips
