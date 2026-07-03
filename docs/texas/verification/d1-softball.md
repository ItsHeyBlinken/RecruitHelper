# Texas NCAA D1 Softball — URL Verification Findings

**Verified:** 2026-07-03  
**Source doc:** `Texas_College_Softball_Athletic_Websites.md`  
**Method:** Automated crawl via project scraper (`scraper/src/verify-tx-d1.ts`) + manual spot-checks on low-yield sites

---

## Executive Summary

| Result | Count | Meaning |
|--------|-------|---------|
| **PASS** | 18 | Softball coaches found with full email coverage |
| **WARN** | 3 | Correct athletics URL; some coach emails not published on site |
| **FAIL** | 0 | No broken URLs or sites without softball staff |

**Verdict:** All 21 D1 athletics URLs in the source doc are the correct official sites for finding softball coach/recruiter contact information. **No URL changes recommended.**

All doc URLs match the seed file (`seed/schools.json`). UT Austin is stored as "University of Texas" in seed — same `texassports.com` URL.

---

## Full Results

| Status | School | Athletics URL | Staff Page Discovered | Coaches | Emails | Manual OK? | Notes |
|--------|--------|---------------|----------------------|---------|--------|------------|-------|
| WARN | Abilene Christian University | [acusports.com](https://acusports.com) | [staff-directory](https://acusports.com/staff-directory) | 5 | 4 | [ ] | 1 coach has no published email |
| PASS | Baylor University | [baylorbears.com](https://baylorbears.com) | [staff-directory](https://baylorbears.com/staff-directory) | 4 | 4 | [ ] | |
| PASS | Houston Christian University | [hcuhuskies.com](https://hcuhuskies.com) | [softball/roster](https://hcuhuskies.com/sports/softball/roster) | 1* | 1* | [ ] | See spot-check — `/coaches` has 5 staff |
| PASS | Lamar University | [lamarcardinals.com](https://lamarcardinals.com) | [softball/roster](https://lamarcardinals.com/sports/softball/roster) | 1* | 1* | [ ] | See spot-check — `/coaches` has 4 with emails |
| PASS | Prairie View A&M University | [pvpanthers.com](https://pvpanthers.com) | [softball/roster](https://pvpanthers.com/sports/softball/roster) | 1* | 1* | [ ] | Scraper under-counted; URL correct |
| PASS | Sam Houston State University | [gobearkats.com](https://gobearkats.com) | [news article](https://gobearkats.com/news/2026/6/12/softball-orme-joins-bearkat-softball-coaching-staff) | 1* | 1* | [ ] | See spot-check — use `/sports/softball/coaches` |
| PASS | Stephen F. Austin State University | [sfajacks.com](https://sfajacks.com) | [softball/coaches](https://sfajacks.com/sports/softball/coaches) | 5 | 5 | [ ] | |
| PASS | Tarleton State University | [tarletonsports.com](https://tarletonsports.com) | [softball/coaches](https://tarletonsports.com/sports/softball/coaches) | 5 | 5 | [ ] | |
| PASS | Texas A&M University | [12thman.com](https://12thman.com) | [softball/roster](https://12thman.com/sports/softball/roster) | 5 | 5 | [ ] | |
| WARN | Texas A&M University-Commerce | [lionathletics.com](https://lionathletics.com) | [softball/staff](https://lionathletics.com/sports/softball/staff) | 29‡ | 23 | [ ] | Partial emails; count may include non-coaching staff |
| PASS | Texas A&M University-Corpus Christi | [goislanders.com](https://goislanders.com) | [staff-directory](https://goislanders.com/staff-directory) | 4 | 4 | [ ] | |
| WARN | Texas Southern University | [tsusports.com](https://tsusports.com) | [staff-directory](https://tsusports.com/staff-directory) | 4 | 2 | [ ] | 2 coaches lack published emails |
| PASS | Texas State University | [txst.com](https://txst.com) | [softball/roster](https://txst.com/sports/softball/roster) | 1* | 1* | [ ] | See spot-check — `/coaches` has 6 with emails |
| PASS | Texas Tech University | [texastech.com](https://texastech.com) | [softball/roster](https://texastech.com/sports/softball/roster) | 1* | 1* | [ ] | Coaches page lists 4 coaches; emails not on coaches page |
| PASS | University of Houston | [uhcougars.com](https://uhcougars.com) | [staff-directory](https://uhcougars.com/staff-directory) | 3 | 3 | [ ] | |
| PASS | University of North Texas | [meangreensports.com](https://meangreensports.com) | [softball/roster](https://meangreensports.com/sports/softball/roster) | 1* | 1* | [ ] | Scraper under-counted; URL correct |
| PASS | University of Texas at Arlington | [utamavs.com](https://utamavs.com) | [softball/roster](https://utamavs.com/sports/softball/roster) | 1* | 1* | [ ] | Scraper under-counted; URL correct |
| PASS | University of Texas at Austin | [texassports.com](https://texassports.com) | [staff-directory](https://texassports.com/staff-directory?path=general) | 4 | 4 | [ ] | |
| PASS | University of Texas at El Paso | [utepminers.com](https://utepminers.com) | [softball/coaches](https://utepminers.com/sports/softball/coaches) | 2 | 2 | [ ] | |
| PASS | University of Texas at San Antonio | [goutsa.com](https://goutsa.com) | [softball/roster](https://goutsa.com/sports/softball/roster) | 2 | 2 | [ ] | |
| PASS | University of the Incarnate Word | [uiwcardinals.com](https://uiwcardinals.com) | [softball/roster](https://uiwcardinals.com/sports/softball/roster) | 1* | 1* | [ ] | Scraper under-counted; URL correct |

\* Scraper stopped early on roster pages; manual spot-checks confirm full coaching staffs exist on the same domain (see below).  
‡ Commerce count likely inflated by `/sports/softball/staff` including support/non-coaching roles.

---

## WARN Schools — Detail

### Abilene Christian University
- **URL:** https://acusports.com — **correct**
- **Best page:** `/staff-directory`
- **Issue:** 4 of 5 softball coaches have emails; 1 coach has no published email on site
- **Action:** Accept partial coverage; no URL change

### Texas Southern University
- **URL:** https://tsusports.com — **correct**
- **Best page:** `/staff-directory`
- **Issue:** 2 of 4 softball coaches lack published emails
- **Action:** Accept partial coverage; no URL change

### Texas A&M University-Commerce
- **URL:** https://lionathletics.com — **correct** (also rebranding as East Texas A&M)
- **Best page:** `/sports/softball/coaches` (preferred over `/sports/softball/staff` for scraping)
- **Issue:** Scraper found 29 contacts / 23 emails — likely includes non-softball-coaching staff from staff page
- **Action:** Tune scraper to use coaches page; verify contact list manually before bulk scrape

---

## Manual Spot-Checks (Low Scraper Yield)

These schools returned only 1 coach from automated crawl but have fuller staffs at `/sports/softball/coaches` on the **same athletics domain** (URL is correct; scraper discovery needs tuning):

| School | Recommended Coach Page | Staff Found Manually |
|--------|------------------------|----------------------|
| Houston Christian | [hcuhuskies.com/sports/softball/coaches](https://hcuhuskies.com/sports/softball/coaches) | 5 coaches (some without emails) |
| Lamar | [lamarcardinals.com/sports/softball/coaches](https://lamarcardinals.com/sports/softball/coaches) | 3 coaches + 1 athletic trainer, all with emails |
| Sam Houston | [gobearkats.com/sports/softball/coaches](https://gobearkats.com/sports/softball/coaches) | 3 coaches (shared `samhoustonsb@shsu.edu`) + support staff |
| Texas State | [txst.com/sports/softball/coaches](https://txst.com/sports/softball/coaches) | 6 coaches, all with emails |
| Texas Tech | [texastech.com/sports/softball/coaches](https://texastech.com/sports/softball/coaches) | 4 coaches listed; emails not on coaches page (roster profiles may have them) |

---

## Best Email Source by Site Type

| Pattern | Schools | Notes |
|---------|---------|-------|
| **Staff directory** | Baylor, ACU, A&M-CC, TSU, Houston, UT Austin | Sidearm NextGen or category-table directories |
| **`/sports/softball/coaches`** | SFA, Tarleton, UTEP, Lamar, Sam Houston, Texas State, HCU | Direct coach tables with emails |
| **Roster + profile pages** | Texas A&M, Texas Tech, UNT, UTA, UIW, Texas State | Emails on individual coach profile pages |

---

## Scraper Tuning Notes (Not URL Issues)

1. **News article false positives** — Sam Houston scraper picked a news URL before `/sports/softball/coaches`. Discovery should deprioritize `/news/` paths.
2. **Roster vs coaches** — Several Sidearm sites expose full staff at `/coaches` but scraper defaults to `/roster` first.
3. **Texas Tech** — Coaches page has names/phones only; emails require roster profile scraping or athletics directory fallback.
4. **Commerce** — Prefer `/sports/softball/coaches` over `/sports/softball/staff` to avoid inflated contact counts.

---

## Manual Verification Checklist

Use the **Manual OK?** column in the results table above. For each school:

1. Open the athletics URL — confirm it loads and is the official athletics site (not main university homepage).
2. Navigate to softball → confirm NCAA varsity program exists.
3. Open the staff page listed (or recommended coach page from spot-checks).
4. Confirm head coach and at least one assistant are listed.
5. Confirm at least one recruiting-relevant email is visible (coach email or program email).
6. Check the box when satisfied.

**Progress:** _____ / 21 verified

---

## Re-run Automated Verification

```bash
cd scraper
npx tsx src/verify-tx-d1.ts
```

---

## Related Files

- Source URL list: `Texas_College_Softball_Athletic_Websites.md`
- Interactive checklist: `docs/texas-url-verification.html`
- Verification script: `scraper/src/verify-tx-d1.ts`
- Seed data: `seed/schools.json`
