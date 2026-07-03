# NJCAA (JUCO) URL Verification Findings

**Date:** 2026-07-02  
**Source doc:** `Texas_College_Softball_Athletic_Websites.md` (NJCAA section, 36 schools)  
**Method:** Static HTTP fetch + Playwright crawl; coach-page probes for email discovery  
**Machine-readable results:** `docs/njcaa-url-verification-results.json`, `docs/njcaa-url-verification-playwright.json`

Use the checkboxes below during manual review. Mark each row once you have confirmed the recommended URL (or decided to remove the school).

---

## Summary

| Category | Count |
|---|---|
| Correct as listed | 4 |
| Correct with minor canonical tweak (same domain) | 9 |
| Wrong URL — replacement found | 15 |
| Dallas College — dead URLs, no softball coach pages | 4 |
| Remove from list (no varsity NJCAA softball) | 3 |
| **Total** | **36** (includes overlap in categories above) |

---

## ✅ Correct as listed (4)

These doc URLs load, host softball content, and expose staff/coach paths suitable for scraping.

| OK | School | Doc URL | Platform | Coach / email path | Notes |
|---|---|---|---|---|---|
| [ ] | Blinn College | https://buccaneersports.com | Sidearm | `/staff-directory`, `/sports/softball/roster` | Verified GOOD |
| [ ] | San Jacinto College | https://sanjacsports.com | Sidearm | `/staff-directory` | Verified GOOD |
| [ ] | Northeast Texas Community College | https://ntcceagles.com | Sidearm | `/staff-directory` | Verified GOOD |
| [ ] | Angelina College | https://angelinaathletics.com | PrestoSports | `/sports/sball/coaches/index`, `/sports/sball/2025-26/roster` | Loads via `/landing/index`; no emails on homepage |

---

## ✅ Correct domain — minor canonical URL tweak (9)

Same athletics domain as the doc; prefer `/landing/index` or trailing-slash canonical. Softball coach paths confirmed.

| OK | School | Doc URL | Recommended canonical | Platform | Coach / email path | Notes |
|---|---|---|---|---|---|---|
| [ ] | Coastal Bend College | https://cbcathletics.com | https://cbcathletics.com/landing/index | PrestoSports | Softball content on site | No staff links on homepage; probe coaches index |
| [ ] | Trinity Valley Community College | https://tvccsports.com | https://tvccsports.com/landing/index | PrestoSports | `/sports/sball/2025-26/roster` | Verified GOOD |
| [ ] | McLennan Community College | https://mclennanathletics.com | https://mclennanathletics.com/landing/index | PrestoSports | `/sports/sball/2026-27/roster` | Softball confirmed |
| [ ] | Midland College | https://gochaps.com | https://gochaps.com/landing/index | PrestoSports | `/sports/sball/2025-26/roster` | Verified GOOD |
| [ ] | Odessa College | https://wranglersports.com | https://wranglersports.com/landing/index | PrestoSports | `/sports/sball/2025-26/roster` | Known working from prior scraper session |
| [ ] | Tyler Junior College | https://apacheathletics.com | https://apacheathletics.com/landing/index | PrestoSports | `/sports/sball/2025-26/roster` | Verified GOOD |
| [ ] | Weatherford College | https://wcathletics.com | https://wcathletics.com/landing/index | PrestoSports | Softball on site | Coach page exists |
| [ ] | North Central Texas College | https://nctcathletics.com | https://nctcathletics.com/landing/index | PrestoSports | `/sports/sball/coaches/index` | Emails found: `vhedrick@nctc.edu`, `tchristian@nctc.edu` |
| [ ] | Clarendon College | https://clarendonbulldogs.com | https://clarendonbulldogs.com/landing/index | PrestoSports | `/sports/sball/2025-26/roster` | Verified GOOD |

---

## ❌ Wrong URL — use replacement (15)

Doc URL is dead, wrong domain, or redirects away from athletics. Replacement verified via Playwright.

| OK | School | Doc URL (problem) | Recommended URL | Platform | Verified emails / coach path | Problem |
|---|---|---|---|---|---|---|
| [ ] | Alvin College | https://www.alvincollege.edu/athletics/softball.html | https://athletics.alvincollege.edu | PrestoSports | `/sports/sball/coaches/index` | Doc page 404; dedicated athletics subdomain |
| [ ] | Howard College | https://hchawkssports.com | https://www.hchawk.com | PrestoSports | `/sports/sball/coaches/index` — `aclopez@howardcollege.edu`, `kmartinez@howardcollege.edu` | `hchawkssports.com` DNS does not resolve |
| [ ] | Navarro College | https://navarroathletics.com | https://navarrobulldogs.com | Sidearm | `/sports/softball/coaches` — `softball@navarrocollege.edu` | `navarroathletics.com` DNS does not resolve |
| [ ] | Cisco College | https://ciscoathletics.com | https://www.wranglersports.net | PrestoSports | `/sports/sball/coaches/index` — `cody.lecroy@cisco.edu`, `andrea.cuellar@cisco.edu` | `ciscoathletics.com` invalid SSL cert |
| [ ] | Galveston College | https://gc.edu/athletics | https://www.gcwhitecaps.com | PrestoSports | `/sports/sball/coaches/index` — `kraines@gc.edu`, `rmcnary@gc.edu` | `gc.edu/athletics` 404; also tried `whitecapsports.com` (wrong domain) |
| [ ] | Grayson College | https://grayson.edu/athletics | https://www.gcvikings.com | PrestoSports | `/sports/sball/coaches/index` — `mcbrayerm@grayson.edu`, `boyterb@grayson.edu` | College main `/athletics` returns 403 |
| [ ] | Hill College | https://hillcollege.edu/athletics | https://hillcollegeathletics.com | PrestoSports | `/sports/sball/coaches/index` | College main site redirect fails; coach page loads, emails may need profile scrape |
| [ ] | Kilgore College | https://kilgore.edu/athletics | https://www.kcrangernation.com | PrestoSports | `/sports/sball/2025-26/roster` | `kilgore.edu/athletics` redirects to `kcrangernation.com` |
| [ ] | Paris Junior College | https://pjc.edu/athletics | https://pjcathletics.com | PrestoSports | `/sports/sball/2025-26/roster` | `pjc.edu/athletics` DNS does not resolve |
| [ ] | Ranger College | https://rangercollegeathletics.com | https://www.rangersports.net | PrestoSports | `/sports/sball/coaches/index` — `spaige@rangercollege.edu`, `jfox@rangercollege.edu` | `rangercollegeathletics.com` DNS does not resolve |
| [ ] | Frank Phillips College | https://fpclainsports.com | https://plainsmensports.com | PrestoSports | `/sports/sball/2025-26/coaches` | `fpclainsports.com` DNS does not resolve |
| [ ] | Temple College | https://templejc.edu/athletics | https://www.tcleopards.com | PrestoSports | `/sports/sball/coaches/index` — `kadie.berlin@templejc.edu`, `carmichaelr440@templejc.edu` | `templejc.edu/athletics` redirects to main college homepage |
| [ ] | Western Texas College | https://wtccoyotes.com | https://www.wtcathletics.com | PrestoSports | `/sports/sball/coaches/index` — `selena.reyna@wtc.edu`, `valaree.reyes@wtc.edu` | `wtccoyotes.com` DNS does not resolve |
| [ ] | El Paso Community College | https://epcc.edu/Athletics | https://www.epcc.edu/Services/Athletics/softball | College main | Page lists coach — `aavil210@epcc.edu` | `epcc.edu/Athletics` SSL common-name error; use `www` + `/Services/Athletics/softball` |
| [ ] | Vernon College | https://vernoncollege.edu/athletics | https://www.vernoncollege.edu/athletics | College main | `/athletics/softball` loads; no emails on page | Prefer `www` subdomain; emails not published on site |

---

## ⚠️ Dallas College campuses — dead URLs, no softball coach pages (4)

Doc lists custom domains that **do not resolve**. Replacement athletics sites load but **softball coach pages return 404** and staff directories list no softball staff.

NJCAA Region 5 DAC standings still list these campuses for softball, but current athletics websites only show baseball, basketball, soccer, and volleyball. **Manual verification needed** — confirm programs still exist and locate softball-specific site if any.

| OK | School | Doc URL (dead) | Best athletics URL found | Softball coach page | Notes |
|---|---|---|---|---|---|
| [ ] | Dallas College Brookhaven | https://www.brookhavenbears.com | https://brookhavenathletics.com | `/sports/sball/coaches/index` → **404** | `brookhavenbears.com` DNS fail; tried `brookhaven.prestosports.com` — Cloudflare 403 |
| [ ] | Dallas College Eastfield | https://www.eastfieldbees.com | https://eastfieldathletics.com | `/sports/sball/coaches/index` → **404** | `eastfieldbees.com` DNS fail; `eastfield.prestosports.com` has no softball in staff directory |
| [ ] | Dallas College North Lake | https://www.nlcblazers.com | https://northlakecollegeathletics.com | `/sports/sball/coaches/index` → **404** | `nlcblazers.com` DNS fail |
| [ ] | Dallas College Richland | https://richlandthunderducks.com | https://rlcsports.com | `/sports/sball/coaches/index` → **404** | `richlandthunderducks.com` DNS fail; Wikipedia lists no softball at Richland |

**Possible next steps for manual review:**
- Contact Dallas College athletics (`dallascollege.edu/slife/athletics/`) for softball coach contacts
- Check NJCAA Region 5 (`njcaaregion5.com`) for team-specific links
- Confirm whether DAC softball uses a shared hub not linked from campus sites

---

## 🚫 Recommend removing — no active varsity NJCAA softball (3)

These schools appear in the doc but likely **cannot yield recruiter/coach emails** because they do not run varsity NJCAA softball.

| OK | School | Doc URL | Finding | Action |
|---|---|---|---|---|
| [ ] | Southwest Texas Junior College | https://swtjc.edu/athletics | College rebranded to Southwest Texas College (`swtxc.edu`); offers **club/intramural** softball only, not NJCAA | Remove from seed + doc |
| [ ] | Texarkana College | https://texarkanacollege.edu/athletics | **No intercollegiate athletics** — intramural basketball/volleyball/soccer only | Remove from seed + doc |
| [ ] | Laredo College | https://laredo.edu/athletics | Board voted to **disband all sports (2022)**, replaced with esports; `laredo.edu/athletics` 404 | Remove from seed + doc |

---

## Borderline — loads but emails not confirmed on first pass (2)

Worth a manual click-through; scraper may still succeed with profile enrichment.

| OK | School | Doc URL | Recommended URL | Notes |
|---|---|---|---|---|
| [ ] | South Plains College | https://spctexans.com | https://spctexans.com/landing/index | PrestoSports; `/sports/sball/coaches/index` loads (HTTP 202) but no emails in automated probe |
| [ ] | Vernon College | (see replacement table above) | https://www.vernoncollege.edu/athletics/softball | Page loads; coach names may be on PDF roster rather than HTML |

---

## Quick-reference: all recommended seed URLs

Copy-paste list for updating `seed/schools.json` and `Texas_College_Softball_Athletic_Websites.md` after manual sign-off.

```
Alvin College              → https://athletics.alvincollege.edu
Angelina College           → https://angelinaathletics.com
Blinn College              → https://buccaneersports.com
Cisco College              → https://www.wranglersports.net
Clarendon College          → https://clarendonbulldogs.com
Coastal Bend College       → https://cbcathletics.com
Dallas College Brookhaven  → https://brookhavenathletics.com  ⚠️ no softball coach page found
Dallas College Eastfield   → https://eastfieldathletics.com   ⚠️ no softball coach page found
Dallas College North Lake  → https://northlakecollegeathletics.com  ⚠️ no softball coach page found
Dallas College Richland    → https://rlcsports.com            ⚠️ no softball coach page found
El Paso Community College  → https://www.epcc.edu/Services/Athletics/softball
Frank Phillips College     → https://plainsmensports.com
Galveston College          → https://www.gcwhitecaps.com
Grayson College            → https://www.gcvikings.com
Hill College               → https://hillcollegeathletics.com
Howard College             → https://www.hchawk.com
Kilgore College            → https://www.kcrangernation.com
Laredo College             → REMOVE (program disbanded)
McLennan Community College → https://mclennanathletics.com
Midland College            → https://gochaps.com
Navarro College            → https://navarrobulldogs.com
North Central Texas College→ https://nctcathletics.com
Northeast Texas CC         → https://ntcceagles.com
Odessa College             → https://wranglersports.com
Paris Junior College       → https://pjcathletics.com
Ranger College             → https://www.rangersports.net
San Jacinto College        → https://sanjacsports.com
South Plains College       → https://spctexans.com
Southwest Texas Junior College → REMOVE (no varsity softball)
Temple College             → https://www.tcleopards.com
Texarkana College          → REMOVE (no intercollegiate athletics)
Trinity Valley CC          → https://tvccsports.com
Tyler Junior College       → https://apacheathletics.com
Vernon College             → https://www.vernoncollege.edu/athletics
Weatherford College        → https://wcathletics.com
Western Texas College      → https://www.wtcathletics.com
```

---

## Scraper notes

- **HTTP 202 responses:** Many PrestoSports sites return 202 to plain `fetch` but render fully in Playwright. The existing scraper Playwright fallback should handle these.
- **Sidearm schools** (Blinn, San Jac, NTCC, Navarro): Prioritize `/staff-directory` and `/sports/softball/coaches` or roster coach profiles.
- **PrestoSports schools:** Prioritize `/sports/sball/coaches/index` and `/sports/sball/20XX-XX/roster`; use coach profile pages for mailto emails.
- **College main sites** (EPCC, Vernon): May need PDF roster parsing or staff-directory enrichment; emails less consistently in HTML.

---

## Verification scripts (re-run anytime)

```bash
node scripts/verify-njcaa-urls.mjs          # static fetch pass
node scripts/verify-njcaa-playwright.mjs    # Playwright pass for bot-protected sites
node scripts/probe-njcaa-remaining.mjs      # targeted alt-URL probes
node scripts/probe-njcaa-coaches.mjs        # coach-page email probe
```

---

## Manual verification log

| Date | Reviewer | Schools verified | Notes |
|---|---|---|---|
| | | | |
| | | | |
