# Texas Softball Athletics URL Verification — Master Processing Guide

**Compiled:** 2026-07-03  
**Source doc:** `docs/texas/athletic-websites.md`  
**Seed:** `seed/schools.json` (90 TX programs)  
**Interactive checklist:** `docs/texas/url-checklist.html` (`npm run texas:url-checklist`)

This document consolidates findings from all division-specific verification reports into one actionable workflow for manual sign-off, URL corrections, and bulk scraping.

---

## Executive Summary

| Division | Schools | URLs OK | URL Fixes | Partial / WARN | Remove | Manual OK |
|----------|---------|---------|-----------|----------------|--------|-----------|
| **NCAA D1** | 21 | 21 | 0 | 3 (partial emails) | 0 | 0 / 21 |
| **NCAA D2** | 12 | 12 | 1 *(applied)* | 2 (email gaps) | 0 | 0 / 12 |
| **NCAA D3** | 15 | 12 | 3 required + 1 optional | 1 (sparse emails) | 0 | 0 / 15 |
| **NAIA** | 9 | 7 | 2 | 2 (low email yield) | 0 | 0 / 9 |
| **NJCAA** | 36 | 13 | 15 | 6 (Dallas + borderline) | 3 | 0 / 36 |
| **TOTAL** | **93** | **65** | **21** | **14** | **3** | **0 / 93** |

**Bottom line:** 65 schools are ready to scrape as-is. **21 schools need URL updates** in doc, seed, and SQL before scraping. **3 NJCAA schools should be removed** (no varsity softball). **14 schools** have correct URLs but expect partial email coverage or scraper tuning.

---

## Processing Workflow (Recommended Order)

### Step 1 — Apply URL corrections (before scraping)

Update `docs/texas/athletic-websites.md`, `seed/schools.json`, and create/apply SQL migrations in pgAdmin.

| Priority | School | Division | Change from | Change to |
|----------|--------|----------|-------------|-----------|
| P1 | McMurry University | D3 | `https://mcmurryads.com` | `https://mcmurrysports.com` |
| P1 | Schreiner University | D3 | `https://schreinerathletics.com` | `https://schreinermountaineers.com` |
| P1 | Howard Payne University | D3 | `https://hputx.edu/athletics` | `https://hpusports.com` |
| P1 | Jarvis Christian University | NAIA | `https://jarvisathletics.com` | `https://jcubulldogs.com` |
| P1 | Texas College | NAIA | `https://texascollege.edu/athletics` | `https://www.tcsteersathletics.com` |
| P1 | University of Texas Permian Basin | D2 | `https://utpbbasinguns.com` | `https://utpbfalcons.com` *(may already be applied)* |
| P2 | East Texas Baptist University | D3 | `https://etbuathletics.com` | `https://goetbutigers.com` *(optional canonical)* |
| P2 | Alvin College | JUCO | `https://www.alvincollege.edu/athletics/softball.html` | `https://athletics.alvincollege.edu` |
| P2 | Howard College | JUCO | `https://hchawkssports.com` | `https://www.hchawk.com` |
| P2 | Navarro College | JUCO | `https://navarroathletics.com` | `https://navarrobulldogs.com` |
| P2 | Cisco College | JUCO | `https://ciscoathletics.com` | `https://www.wranglersports.net` |
| P2 | Galveston College | JUCO | `https://gc.edu/athletics` | `https://www.gcwhitecaps.com` |
| P2 | Grayson College | JUCO | `https://grayson.edu/athletics` | `https://www.gcvikings.com` |
| P2 | Hill College | JUCO | `https://hillcollege.edu/athletics` | `https://hillcollegeathletics.com` |
| P2 | Kilgore College | JUCO | `https://kilgore.edu/athletics` | `https://www.kcrangernation.com` |
| P2 | Paris Junior College | JUCO | `https://pjc.edu/athletics` | `https://pjcathletics.com` |
| P2 | Ranger College | JUCO | `https://rangercollegeathletics.com` | `https://www.rangersports.net` |
| P2 | Frank Phillips College | JUCO | `https://fpclainsports.com` | `https://plainsmensports.com` |
| P2 | Temple College | JUCO | `https://templejc.edu/athletics` | `https://www.tcleopards.com` |
| P2 | Western Texas College | JUCO | `https://wtccoyotes.com` | `https://www.wtcathletics.com` |
| P2 | El Paso Community College | JUCO | `https://epcc.edu/Athletics` | `https://www.epcc.edu/Services/Athletics/softball` |
| P2 | Vernon College | JUCO | `https://vernoncollege.edu/athletics` | `https://www.vernoncollege.edu/athletics` |
| P2 | Dallas College Brookhaven | JUCO | `https://www.brookhavenbears.com` | `https://brookhavenathletics.com` |
| P2 | Dallas College Eastfield | JUCO | `https://www.eastfieldbees.com` | `https://eastfieldathletics.com` |
| P2 | Dallas College North Lake | JUCO | `https://www.nlcblazers.com` | `https://northlakecollegeathletics.com` |
| P2 | Dallas College Richland | JUCO | `https://richlandthunderducks.com` | `https://rlcsports.com` |

### Step 2 — Remove schools with no varsity NJCAA softball

| School | Reason |
|--------|--------|
| Southwest Texas Junior College | Rebranded to Southwest Texas College; club/intramural softball only |
| Texarkana College | No intercollegiate athletics |
| Laredo College | All sports disbanded (2022); replaced with esports |

### Step 3 — Manual browser verification

Use the master checklist below. For each school:

1. Open athletics URL — confirm official athletics site (not main university homepage).
2. Navigate to softball — confirm NCAA/NAIA/NJCAA varsity program exists.
3. Open the **Best Coach Page** listed.
4. Confirm head coach + at least one assistant listed.
5. Confirm at least one recruiting-relevant email (coach or program email).
6. Check the **OK** box.

### Step 4 — Bulk scrape (after URLs confirmed)

```bash
npm run scrape:tx-juco    # JUCO first (highest URL churn)
npm run scrape:tx -- --division D3
npm run scrape:tx -- --division D2
npm run scrape:tx -- --division D1
npm run scrape:tx -- --division NAIA   # if supported; else scrape by school name
```

---

## Master Checklist — All 93 Schools

**Progress:** _____ / 93 verified

### NCAA Division I (21) — All URLs correct; no changes needed

| OK | School | Athletics URL | Status | Best Coach Page | Email Notes |
|:--:|--------|---------------|--------|-----------------|-------------|
| [ ] | Abilene Christian University | [acusports.com](https://acusports.com) | WARN | [/staff-directory](https://acusports.com/staff-directory) | 4/5 coaches have emails |
| [ ] | Baylor University | [baylorbears.com](https://baylorbears.com) | PASS | [/staff-directory](https://baylorbears.com/staff-directory) | Full coverage |
| [ ] | Houston Christian University | [hcuhuskies.com](https://hcuhuskies.com) | PASS | [/sports/softball/coaches](https://hcuhuskies.com/sports/softball/coaches) | Use `/coaches` not `/roster` |
| [ ] | Lamar University | [lamarcardinals.com](https://lamarcardinals.com) | PASS | [/sports/softball/coaches](https://lamarcardinals.com/sports/softball/coaches) | 3 coaches + trainer, all emails |
| [ ] | Prairie View A&M University | [pvpanthers.com](https://pvpanthers.com) | PASS | [/sports/softball/coaches](https://pvpanthers.com/sports/softball/coaches) | Scraper under-counted roster |
| [ ] | Sam Houston State University | [gobearkats.com](https://gobearkats.com) | PASS | [/sports/softball/coaches](https://gobearkats.com/sports/softball/coaches) | Shared `samhoustonsb@shsu.edu` |
| [ ] | Stephen F. Austin State University | [sfajacks.com](https://sfajacks.com) | PASS | [/sports/softball/coaches](https://sfajacks.com/sports/softball/coaches) | Full coverage |
| [ ] | Tarleton State University | [tarletonsports.com](https://tarletonsports.com) | PASS | [/sports/softball/coaches](https://tarletonsports.com/sports/softball/coaches) | Full coverage |
| [ ] | Texas A&M University | [12thman.com](https://12thman.com) | PASS | [/sports/softball/roster](https://12thman.com/sports/softball/roster) | Emails on roster profiles |
| [ ] | Texas A&M University-Commerce | [lionathletics.com](https://lionathletics.com) | WARN | [/sports/softball/coaches](https://lionathletics.com/sports/softball/coaches) | Use `/coaches` not `/staff`; partial emails |
| [ ] | Texas A&M University-Corpus Christi | [goislanders.com](https://goislanders.com) | PASS | [/staff-directory](https://goislanders.com/staff-directory) | Full coverage |
| [ ] | Texas Southern University | [tsusports.com](https://tsusports.com) | WARN | [/staff-directory](https://tsusports.com/staff-directory) | 2/4 coaches lack emails |
| [ ] | Texas State University | [txst.com](https://txst.com) | PASS | [/sports/softball/coaches](https://txst.com/sports/softball/coaches) | 6 coaches, all emails |
| [ ] | Texas Tech University | [texastech.com](https://texastech.com) | PASS | [/sports/softball/coaches](https://texastech.com/sports/softball/coaches) | Names/phones on coaches page; emails on roster profiles |
| [ ] | University of Houston | [uhcougars.com](https://uhcougars.com) | PASS | [/staff-directory](https://uhcougars.com/staff-directory) | Full coverage |
| [ ] | University of North Texas | [meangreensports.com](https://meangreensports.com) | PASS | [/sports/softball/coaches](https://meangreensports.com/sports/softball/coaches) | Scraper under-counted roster |
| [ ] | University of Texas at Arlington | [utamavs.com](https://utamavs.com) | PASS | [/sports/softball/coaches](https://utamavs.com/sports/softball/coaches) | Scraper under-counted roster |
| [ ] | University of Texas at Austin | [texassports.com](https://texassports.com) | PASS | [/staff-directory](https://texassports.com/staff-directory?path=general) | Seed name: "University of Texas" |
| [ ] | University of Texas at El Paso | [utepminers.com](https://utepminers.com) | PASS | [/sports/softball/coaches](https://utepminers.com/sports/softball/coaches) | Full coverage |
| [ ] | University of Texas at San Antonio | [goutsa.com](https://goutsa.com) | PASS | [/sports/softball/roster](https://goutsa.com/sports/softball/roster) | Full coverage |
| [ ] | University of the Incarnate Word | [uiwcardinals.com](https://uiwcardinals.com) | PASS | [/sports/softball/coaches](https://uiwcardinals.com/sports/softball/coaches) | Scraper under-counted roster |

---

### NCAA Division II (12) — UTPB URL fix applied

| OK | School | Athletics URL | Status | Best Coach Page | Sample Emails |
|:--:|--------|---------------|--------|-----------------|---------------|
| [ ] | Angelo State University | [angelosports.com](https://angelosports.com) | GOOD | [/sports/softball/coaches](https://angelosports.com/sports/softball/coaches) | travis.scott@angelo.edu, katie.scott@angelo.edu |
| [ ] | Lubbock Christian University | [lcuchaps.com](https://lcuchaps.com) | GOOD | [/staff-directory](https://lcuchaps.com/staff-directory) | chris.due@lcu.edu, everett.corder@lcu.edu |
| [ ] | Midwestern State University | [msumustangs.com](https://msumustangs.com) | GOOD | [/sports/softball/coaches](https://msumustangs.com/sports/softball/coaches) | kaelani.bryan@msutexas.edu, katelynn.taylor@msutexas.edu |
| [ ] | St. Edward's University | [gohilltoppers.com](https://gohilltoppers.com) | GOOD | [/staff-directory](https://gohilltoppers.com/staff-directory) | athletics@stedwards.edu *(generic only)* |
| [ ] | St. Mary's University | [rattlerathletics.com](https://rattlerathletics.com) | GOOD | [/sports/softball/coaches](https://rattlerathletics.com/sports/softball/coaches) | tlira@stmarytx.edu, cgicante@stmarytx.edu |
| [ ] | Texas A&M International University | [godustdevils.com](https://godustdevils.com) | GOOD | [/sports/softball/coaches](https://godustdevils.com/sports/softball/coaches) | scott.libby@tamiu.edu, anthony.saldivar@tamiu.edu |
| [ ] | Texas A&M University-Kingsville | [javelinaathletics.com](https://javelinaathletics.com) | GOOD | [/sports/softball/coaches](https://javelinaathletics.com/sports/softball/coaches) | orlando.salinas@tamuk.edu, cornelius.gallegos@tamuk.edu |
| [ ] | Texas Woman's University | [twuathletics.com](https://twuathletics.com) | GOOD | [/sports/softball/coaches](https://twuathletics.com/sports/softball/coaches) | rmcnutt@twu.edu, mrobinson28@twu.edu |
| [ ] | University of Texas Permian Basin | [utpbfalcons.com](https://utpbfalcons.com) | **FIXED** | [/sports/softball/coaches](https://utpbfalcons.com/sports/softball/coaches) | martinez_da@utpb.edu, johnson_b@utpb.edu |
| [ ] | University of Texas at Dallas | [utdcomets.com](https://utdcomets.com) | GOOD | [/sports/softball/coaches](https://utdcomets.com/sports/softball/coaches) | casey.dickson@utdallas.edu, jami.clinton@utdallas.edu |
| [ ] | University of Texas at Tyler | [uttylerpatriots.com](https://uttylerpatriots.com) | GOOD* | [/staff-directory](https://uttylerpatriots.com/staff-directory) | No inline emails — profile enrichment needed |
| [ ] | West Texas A&M University | [gobuffsgo.com](https://gobuffsgo.com) | GOOD | [/sports/softball/coaches](https://gobuffsgo.com/sports/softball/coaches) | mmook@wtamu.edu, jtrautmann@wtamu.edu |

---

### NCAA Division III (15) — 3 URL fixes required

| OK | School | Athletics URL | Status | Best Coach Page | Notes |
|:--:|--------|---------------|--------|-----------------|-------|
| [ ] | Austin College | [acroos.com](https://acroos.com) | PASS | [/sports/sball/coaches](https://acroos.com/sports/sball/coaches) | PrestoSports; emails on bio pages; needs Playwright |
| [ ] | Concordia University Texas | [athletics.concordia.edu](https://athletics.concordia.edu) | PASS | [/sports/softball/coaches](https://athletics.concordia.edu/sports/softball/coaches) | Full emails on coaches page |
| [ ] | East Texas Baptist University | [goetbutigers.com](https://goetbutigers.com) | PASS | [/sports/softball/coaches](https://goetbutigers.com/sports/softball/coaches) | Redirect from etbuathletics.com |
| [ ] | Hardin-Simmons University | [hsuathletics.com](https://hsuathletics.com) | PASS | [/sports/softball/coaches](https://hsuathletics.com/sports/softball/coaches) | Full coverage |
| [ ] | Howard Payne University | [hpusports.com](https://hpusports.com) | **URL FIX** | [/sports/softball/coaches](https://hpusports.com/sports/softball/coaches) | Was hputx.edu/athletics |
| [ ] | LeTourneau University | [letuathletics.com](https://letuathletics.com) | PASS | [/sports/softball/coaches](https://letuathletics.com/sports/softball/coaches) | Full coverage |
| [ ] | McMurry University | [mcmurrysports.com](https://mcmurrysports.com) | **URL FIX** | [/sports/softball/coaches](https://mcmurrysports.com/sports/softball/coaches) | Was mcmurryads.com (dead) |
| [ ] | Schreiner University | [schreinermountaineers.com](https://schreinermountaineers.com) | **URL FIX** | [/Sports/sball/coaches/index](https://schreinermountaineers.com/Sports/sball/coaches/index) | Was schreinerathletics.com (dead) |
| [ ] | Southwestern University | [southwesternpirates.com](https://southwesternpirates.com) | PASS | [/sports/softball/coaches](https://southwesternpirates.com/sports/softball/coaches) | Full coverage |
| [ ] | Sul Ross State University | [srlobos.com](https://srlobos.com) | PASS | [/sports/softball/coaches](https://srlobos.com/sports/softball/coaches) | Full coverage |
| [ ] | Texas Lutheran University | [tlubulldogs.com](https://tlubulldogs.com) | PASS | [/sports/softball/coaches](https://tlubulldogs.com/sports/softball/coaches) | Full coverage |
| [ ] | Trinity University | [trinitytigers.com](https://trinitytigers.com) | PASS | [/sports/softball/coaches](https://trinitytigers.com/sports/softball/coaches) | Emails on coaches page only |
| [ ] | University of Dallas | [udallasathletics.com](https://udallasathletics.com) | PARTIAL | [/staff-directory](https://udallasathletics.com/staff-directory) | Sparse public emails; profile enrichment |
| [ ] | University of Mary Hardin-Baylor | [cruathletics.com](https://cruathletics.com) | PASS | [/sports/softball/coaches](https://cruathletics.com/sports/softball/coaches) | Full coverage |
| [ ] | University of St. Thomas (Houston) | [ustcelts.com](https://ustcelts.com) | PASS | [/sports/softball/coaches](https://ustcelts.com/sports/softball/coaches) | Full coverage |

---

### NAIA (9) — 2 URL fixes required

| OK | School | Athletics URL | Status | Best Coach Page | Sample Emails |
|:--:|--------|---------------|--------|-----------------|---------------|
| [ ] | Houston-Victoria (UHV) | [uhvjaguars.com](https://uhvjaguars.com) | OK | [/sports/sball/coaches](https://uhvjaguars.com/sports/sball/coaches) | ortizln@tamuv.edu, cowancl1@tamuv.edu |
| [ ] | Jarvis Christian University | [jcubulldogs.com](https://jcubulldogs.com) | **URL FIX** | [/sports/sball/coaches/index](https://jcubulldogs.com/sports/sball/coaches/index) | No emails found; 403 to HTTP clients |
| [ ] | Nelson University | [nelsonlions.com](https://nelsonlions.com) | OK | [/staff-directory](https://nelsonlions.com/staff-directory) | swatson@nelson.edu, agraham@nelson.edu |
| [ ] | Our Lady of the Lake (OLLU) | [ollusaintsathletics.com](https://ollusaintsathletics.com) | OK | [/sports/sball/coaches](https://ollusaintsathletics.com/sports/sball/coaches) | blenington@ollusa.edu |
| [ ] | Texas A&M-Texarkana | [tamuteagles.com](https://tamuteagles.com) | OK | [/sports/sball/coaches](https://tamuteagles.com/sports/sball/coaches) | tmcknight@tamut.edu |
| [ ] | Texas College | [tcsteersathletics.com](https://www.tcsteersathletics.com) | **URL FIX** | [/sports/sball/coaches/index](https://www.tcsteersathletics.com/sports/sball/coaches/index) | Head coach vacant; no email on page |
| [ ] | Texas Wesleyan University | [ramsports.net/sports/softball](https://ramsports.net/sports/softball) | OK | [/sports/softball/coaches](https://ramsports.net/sports/softball/coaches) | sgower@txwes.edu, drdunn@txwes.edu |
| [ ] | University of the Southwest | [uswathletics.com](https://uswathletics.com) | OK | [/sports/softball/roster](https://uswathletics.com/sports/softball/roster) | cpetroski@usw.edu |
| [ ] | Wayland Baptist University | [wbuathletics.com](https://wbuathletics.com) | OK | [/staff-directory](https://wbuathletics.com/staff-directory) | villae@wbu.edu, araujob@wbu.edu |

---

### NJCAA / JUCO (36) — 15 replacements, 4 Dallas College issues, 3 removals

#### Correct as listed (4)

| OK | School | Athletics URL | Best Coach Page |
|:--:|--------|---------------|-----------------|
| [ ] | Blinn College | [buccaneersports.com](https://buccaneersports.com) | `/staff-directory`, `/sports/softball/roster` |
| [ ] | San Jacinto College | [sanjacsports.com](https://sanjacsports.com) | `/staff-directory` |
| [ ] | Northeast Texas CC | [ntcceagles.com](https://ntcceagles.com) | `/staff-directory` |
| [ ] | Angelina College | [angelinaathletics.com](https://angelinaathletics.com) | `/sports/sball/coaches/index` |

#### Correct domain — minor canonical tweak (9)

| OK | School | Athletics URL | Best Coach Page |
|:--:|--------|---------------|-----------------|
| [ ] | Coastal Bend College | [cbcathletics.com](https://cbcathletics.com) | Probe `/sports/sball/coaches/index` |
| [ ] | Trinity Valley CC | [tvccsports.com](https://tvccsports.com) | `/sports/sball/2025-26/roster` |
| [ ] | McLennan CC | [mclennanathletics.com](https://mclennanathletics.com) | `/sports/sball/2026-27/roster` |
| [ ] | Midland College | [gochaps.com](https://gochaps.com) | `/sports/sball/2025-26/roster` |
| [ ] | Odessa College | [wranglersports.com](https://wranglersports.com) | `/sports/sball/2025-26/roster` |
| [ ] | Tyler Junior College | [apacheathletics.com](https://apacheathletics.com) | `/sports/sball/2025-26/roster` |
| [ ] | Weatherford College | [wcathletics.com](https://wcathletics.com) | `/sports/sball/coaches/index` |
| [ ] | North Central Texas College | [nctcathletics.com](https://nctcathletics.com) | `/sports/sball/coaches/index` — vhedrick@nctc.edu |
| [ ] | Clarendon College | [clarendonbulldogs.com](https://clarendonbulldogs.com) | `/sports/sball/2025-26/roster` |

#### Wrong URL — use replacement (15)

| OK | School | Recommended URL | Verified Emails |
|:--:|--------|-----------------|-----------------|
| [ ] | Alvin College | [athletics.alvincollege.edu](https://athletics.alvincollege.edu) | Probe coaches index |
| [ ] | Howard College | [hchawk.com](https://www.hchawk.com) | aclopez@howardcollege.edu, kmartinez@howardcollege.edu |
| [ ] | Navarro College | [navarrobulldogs.com](https://navarrobulldogs.com) | softball@navarrocollege.edu |
| [ ] | Cisco College | [wranglersports.net](https://www.wranglersports.net) | cody.lecroy@cisco.edu, andrea.cuellar@cisco.edu |
| [ ] | Galveston College | [gcwhitecaps.com](https://www.gcwhitecaps.com) | kraines@gc.edu, rmcnary@gc.edu |
| [ ] | Grayson College | [gcvikings.com](https://www.gcvikings.com) | mcbrayerm@grayson.edu, boyterb@grayson.edu |
| [ ] | Hill College | [hillcollegeathletics.com](https://hillcollegeathletics.com) | Profile scrape may be needed |
| [ ] | Kilgore College | [kcrangernation.com](https://www.kcrangernation.com) | `/sports/sball/2025-26/roster` |
| [ ] | Paris Junior College | [pjcathletics.com](https://pjcathletics.com) | `/sports/sball/2025-26/roster` |
| [ ] | Ranger College | [rangersports.net](https://www.rangersports.net) | spaige@rangercollege.edu, jfox@rangercollege.edu |
| [ ] | Frank Phillips College | [plainsmensports.com](https://plainsmensports.com) | `/sports/sball/2025-26/coaches` |
| [ ] | Temple College | [tcleopards.com](https://www.tcleopards.com) | kadie.berlin@templejc.edu, carmichaelr440@templejc.edu |
| [ ] | Western Texas College | [wtcathletics.com](https://www.wtcathletics.com) | selena.reyna@wtc.edu, valaree.reyes@wtc.edu |
| [ ] | El Paso CC | [epcc.edu/Services/Athletics/softball](https://www.epcc.edu/Services/Athletics/softball) | aavil210@epcc.edu |
| [ ] | Vernon College | [vernoncollege.edu/athletics](https://www.vernoncollege.edu/athletics) | No emails on page |

#### Dallas College campuses — athletics site found, no softball coach page (4)

| OK | School | Recommended URL | Issue |
|:--:|--------|-----------------|-------|
| [ ] | Dallas College Brookhaven | [brookhavenathletics.com](https://brookhavenathletics.com) | `/sports/sball/coaches/index` → 404 |
| [ ] | Dallas College Eastfield | [eastfieldathletics.com](https://eastfieldathletics.com) | No softball in staff directory |
| [ ] | Dallas College North Lake | [northlakecollegeathletics.com](https://northlakecollegeathletics.com) | `/sports/sball/coaches/index` → 404 |
| [ ] | Dallas College Richland | [rlcsports.com](https://rlcsports.com) | `/sports/sball/coaches/index` → 404 |

**Manual follow-up:** Contact Dallas College athletics or check NJCAA Region 5 for softball-specific links.

#### Borderline — correct URL, emails unconfirmed (1)

| OK | School | URL | Notes |
|:--:|--------|-----|-------|
| [ ] | South Plains College | [spctexans.com](https://spctexans.com) | Coaches page loads (HTTP 202) but no emails in probe |

#### Remove from seed — no varsity NJCAA softball (3)

| OK | School | Action |
|:--:|--------|--------|
| [ ] | Southwest Texas Junior College | **REMOVE** — club/intramural only |
| [ ] | Texarkana College | **REMOVE** — no intercollegiate athletics |
| [ ] | Laredo College | **REMOVE** — sports disbanded 2022 |

---

## Schools Needing Scraper Tuning (URLs correct)

These sites are valid but the automated crawler under-counted or missed emails. Tune discovery before bulk scrape.

| School | Division | Issue | Fix |
|--------|----------|-------|-----|
| Houston Christian, Lamar, PVAMU, Sam Houston, UNT, UTA, UIW | D1 | Scraper stopped on `/roster` | Prefer `/sports/softball/coaches` |
| Sam Houston | D1 | Picked news URL | Deprioritize `/news/` paths |
| Texas Tech | D1 | No emails on coaches page | Scrape roster profile pages |
| A&M-Commerce | D1 | Inflated count from `/staff` | Use `/sports/softball/coaches` |
| Angelo State, UTPB | D2 | Splash homepage hides nav | Probe `/sports/softball/coaches` directly |
| St. Edward's | D2 | Generic email only | Try staff profile pages |
| UT Tyler | D2 | No inline emails | Staff profile enrichment |
| Austin College | D3 | Bot protection (HTTP 202) | Playwright required; bio page emails |
| University of Dallas | D3 | Sparse public emails | Staff profile enrichment |
| Jarvis Christian | NAIA | 403 to HTTP; no emails | Playwright + university directory fallback |
| Texas College | NAIA | Vacant head coach | Manual check before scrape |
| Hill College, Vernon, South Plains | JUCO | Emails not in static HTML | Profile/PDF enrichment |
| All PrestoSports JUCO | JUCO | HTTP 202 on fetch | Playwright fallback (already in scraper) |

---

## Platform & Path Patterns

| Platform | Divisions | Typical coach path | Email location |
|----------|-----------|-------------------|----------------|
| **Sidearm** | D1, D2, D3, NAIA, some JUCO | `/sports/softball/coaches` or `/staff-directory` | Inline table or profile pages |
| **Sidearm NextGen** | D1 (Baylor, etc.) | `/staff-directory` with embedded JSON | Profile pages `/staff-directory/slug/id` |
| **PrestoSports** | D3, NAIA, most JUCO | `/sports/sball/coaches/index` | Inline or `/information/directory/bios/` |
| **College main site** | EPCC, Vernon | `/athletics/softball` | Often sparse; may need PDF roster |

**Path priority for scraper:**
1. `/sports/softball/coaches` or `/sports/sball/coaches/index`
2. `/staff-directory` (filter Softball section)
3. `/sports/softball/roster` + coach profile pages
4. Avoid `/news/` URLs for staff discovery

---

## Pending SQL Migrations (apply in pgAdmin, in order)

| Migration | Purpose |
|-----------|---------|
| `db/011_allow_shared_program_emails.sql` | Shared program emails (e.g. Sam Houston) |
| `db/013_update_texas_athletics_urls.sql` | 37 TX URL updates from doc |
| `db/014_add_missing_texas_schools.sql` | 27 missing TX schools |
| `db/015_sync_texas_doc_updates.sql` | Doc sync (Dallas College split, etc.) |
| `db/016_fix_texas_wesleyan_url.sql` | Texas Wesleyan → ramsports.net |
| `db/017_fix_utpb_athletics_url.sql` | UTPB → utpbfalcons.com |
| **New (to create)** | D3 fixes (McMurry, Schreiner, Howard Payne, ETBU) |
| **New (to create)** | NAIA fixes (Jarvis, Texas College) |
| **New (to create)** | NJCAA URL batch (15 replacements + 4 Dallas + 3 removals) |

Example UTPB fix (already drafted):

```sql
UPDATE schools SET athletics_url = 'https://utpbfalcons.com', updated_at = NOW()
WHERE school_name = 'University of Texas Permian Basin';
```

---

## Re-run Verification Scripts

| Division | Command | Output |
|----------|---------|--------|
| D1 | `cd scraper && npx tsx src/verify-tx-d1.ts` | Console + inline report |
| D2 | `node scripts/verify-d2-urls.mjs` | `docs/texas/results/d2-url-verification-results.json` |
| D3 | `node scripts/verify-d3-tx-urls.mjs` | `docs/texas/results/d3-tx-verification-results.json` |
| NAIA | Scraper dry-run per school | — |
| JUCO | `node scripts/verify-njcaa-urls.mjs` | `docs/texas/results/njcaa-url-verification-results.json` |
| JUCO (Playwright) | `node scripts/verify-njcaa-playwright.mjs` | `docs/texas/results/njcaa-url-verification-playwright.json` |

Regenerate interactive HTML checklist:

```bash
npm run texas:url-checklist
```

---

## Manual Verification Log

| Date | Reviewer | Schools Verified | Notes |
|------|----------|------------------|-------|
| | | | |

---

## Source Reports (archived)

Division-specific reports live under `docs/texas/verification/`:

- `d1-softball.md`
- `d2-softball.md`
- `d3-athletics.md`
- `naia.md`
- `njcaa-findings.md`
