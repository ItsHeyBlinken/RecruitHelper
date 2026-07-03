# Texas NCAA D3 Athletics URL Verification

**Date:** 2026-07-03  
**Source doc:** `Texas_College_Softball_Athletic_Websites.md` (NCAA D3 section)  
**Purpose:** Confirm listed athletics URLs are correct for finding softball coach/recruiter contact emails before bulk scraping.

---

## Summary

| Verdict | Count | Meaning |
|---------|-------|---------|
| **PASS** | 10 | Listed URL works; coach emails found on athletics site |
| **PASS (with notes)** | 2 | URL works but redirect or platform quirks apply |
| **URL FIX** | 2 | Listed domain is wrong/dead; correct URL identified |
| **UPDATE RECOMMENDED** | 1 | Redirect works; canonical URL should be updated |
| **PARTIAL** | 1 | Correct athletics site; limited public coach emails |

**Action required:** Update 3 URLs in seed/doc (McMurry, Schreiner, Howard Payne). Optionally canonicalize ETBU to `goetbutigers.com`.

---

## Methodology

1. Fetched each listed athletics homepage and probed common coach/staff paths:
   - `/staff-directory`
   - `/sports/softball/coaches`
   - `/sports/sball/coaches`
   - `/sports/sb/roster`
   - `/sports/softball/roster`
2. Checked for softball program signals and published email addresses on those pages.
3. Followed redirects to determine canonical domains.
4. For ambiguous cases, ran the project scraper (with Playwright fallback) against live sites.
5. Manually verified corrected URLs for McMurry and Schreiner after listed domains failed.

Raw JSON output: `docs/d3-tx-verification-results.json`

---

## Quick Reference — Manual Verification Checklist

Use this table to sign off each school. Check the box when you've confirmed the recommended URL and coach email path.

| ✓ | School | Listed URL | Verdict | Recommended URL | Best Coach Email Page |
|---|--------|-----------|---------|-----------------|----------------------|
| [ ] | Austin College | acroos.com | PASS (notes) | `https://acroos.com` | `/sports/sball/coaches` + bio pages |
| [ ] | Concordia University Texas | athletics.concordia.edu | PASS | `https://athletics.concordia.edu` | `/sports/softball/coaches` |
| [ ] | East Texas Baptist University | etbuathletics.com | PASS (redirect) | `https://goetbutigers.com` | `/sports/softball/coaches` |
| [ ] | Hardin-Simmons University | hsuathletics.com | PASS | `https://hsuathletics.com` | `/sports/softball/coaches` |
| [ ] | Howard Payne University | hputx.edu/athletics | UPDATE | `https://hpusports.com` | `/sports/softball/coaches` |
| [ ] | LeTourneau University | letuathletics.com | PASS | `https://letuathletics.com` | `/sports/softball/coaches` |
| [ ] | McMurry University | mcmurryads.com | **URL FIX** | `https://mcmurrysports.com` | `/sports/softball/coaches` |
| [ ] | Schreiner University | schreinerathletics.com | **URL FIX** | `https://schreinermountaineers.com` | `/Sports/sball/coaches/index` |
| [ ] | Southwestern University | southwesternpirates.com | PASS | `https://southwesternpirates.com` | `/sports/softball/coaches` |
| [ ] | Sul Ross State University | srlobos.com | PASS | `https://srlobos.com` | `/sports/softball/coaches` |
| [ ] | Texas Lutheran University | tlubulldogs.com | PASS | `https://tlubulldogs.com` | `/sports/softball/coaches` |
| [ ] | Trinity University | trinitytigers.com | PASS | `https://trinitytigers.com` | `/sports/softball/coaches` |
| [ ] | University of Dallas | udallasathletics.com | PARTIAL | `https://udallasathletics.com` | `/staff-directory` (sparse emails) |
| [ ] | University of Mary Hardin-Baylor | cruathletics.com | PASS | `https://cruathletics.com` | `/sports/softball/coaches` |
| [ ] | University of St. Thomas (Houston) | ustcelts.com | PASS | `https://ustcelts.com` | `/sports/softball/coaches` |

---

## Recommended URL Updates

Apply these changes to `Texas_College_Softball_Athletic_Websites.md`, `seed/schools.json`, and a new SQL migration when ready:

| School | Current (listed) | Change to |
|--------|------------------|-----------|
| McMurry University | `https://mcmurryads.com` | `https://mcmurrysports.com` |
| Schreiner University | `https://schreinerathletics.com` | `https://schreinermountaineers.com` |
| Howard Payne University | `https://hputx.edu/athletics` | `https://hpusports.com` |
| East Texas Baptist University *(optional)* | `https://etbuathletics.com` | `https://goetbutigers.com` |

---

## Detailed Findings by School

### Austin College — PASS (with notes)

| Field | Value |
|-------|-------|
| Listed URL | `https://acroos.com` |
| HTTP status | 202 (bot protection on bare fetch) |
| Platform | PrestoSports |
| Softball on homepage | Not detected via static fetch |
| Coach page | `https://acroos.com/sports/sball/coaches` |
| Email source | Coach bio profile pages (e.g. `/information/directory/bios/Gracie_Ore`) |
| Sample emails | `gore@austincollege.edu` |

**Notes:**
- Static HTTP fetch returns empty/minimal HTML; site requires Playwright/browser rendering.
- Scraper test: 3 coaches found, 1 email via profile page enrichment.
- URL is **correct** — do not change.

**Manual check:** Open coaches page → click "Full Bio" on each coach → confirm email appears.

---

### Concordia University Texas — PASS

| Field | Value |
|-------|-------|
| Listed URL | `https://athletics.concordia.edu` |
| Redirect | None |
| Platform | Sidearm |
| Coach page | `https://athletics.concordia.edu/sports/softball/coaches` |
| Sample emails | `Jeff.Staton@concordia.edu`, `haylee.guest@concordia.edu`, `jim.martin@concordia.edu` |

Staff directory lists softball coaches but emails are on the dedicated coaches page.

---

### East Texas Baptist University — PASS (redirect)

| Field | Value |
|-------|-------|
| Listed URL | `https://etbuathletics.com` |
| Redirects to | `https://goetbutigers.com/` |
| Platform | Sidearm |
| Coach page | `https://goetbutigers.com/sports/softball/coaches` |
| Sample emails | `jshirley@etbu.edu`, `wgalloway@etbu.edu`, `tbarney@etbu.edu`, `etbusoftball@etbu.edu`, `mpyle@etbu.edu` |

**Notes:** Listed URL works via redirect. Recommend updating seed/doc to canonical `goetbutigers.com`.

---

### Hardin-Simmons University — PASS

| Field | Value |
|-------|-------|
| Listed URL | `https://hsuathletics.com` |
| Redirect | None |
| Platform | Sidearm |
| Coach page | `https://hsuathletics.com/sports/softball/coaches` |
| Sample emails | `casey.wilson@hsutx.edu`, `aubrianna.salazar@hsutx.edu`, `tiffany.mcmurray@hsutx.edu` |

Also responds at `/sports/sball/coaches` with partial email data.

---

### Howard Payne University — UPDATE RECOMMENDED

| Field | Value |
|-------|-------|
| Listed URL | `https://hputx.edu/athletics` |
| Redirects to | `https://hpusports.com/splash.aspx?id=splash_32` |
| Recommended URL | `https://hpusports.com` |
| Platform | Sidearm |
| Coach page | `https://hpusports.com/sports/softball/coaches` |
| Sample emails | `bgonzales@hputx.edu` |

**Notes:**
- Listed URL redirects through a splash/interstitial page; probing from splash did not discover softball links.
- Direct access to `hpusports.com/sports/softball/coaches` confirms correct athletics domain and published head coach email.
- **Update listed URL to `https://hpusports.com`.**

---

### LeTourneau University — PASS

| Field | Value |
|-------|-------|
| Listed URL | `https://letuathletics.com` |
| Redirect | None |
| Platform | Sidearm |
| Coach page | `https://letuathletics.com/sports/softball/coaches` |
| Sample emails | `maceymize@letu.edu`, `whitneyhubeek@letu.edu`, `jodidehart@letu.edu` |

---

### McMurry University — URL FIX REQUIRED

| Field | Value |
|-------|-------|
| Listed URL | `https://mcmurryads.com` |
| Status | **Dead / unreachable** (fetch failed, 503) |
| Correct URL | `https://mcmurrysports.com` |
| Platform | Sidearm |
| Coach page | `https://mcmurrysports.com/sports/softball/coaches` |
| Sample emails | `mcnally.david@mcm.edu`, `england.cayleigh@mcm.edu`, `carrillo.kayla@mcm.edu` |

**Notes:** `mcmurryads.com` appears to be an outdated domain. Current athletics site is `mcmurrysports.com`.

---

### Schreiner University — URL FIX REQUIRED

| Field | Value |
|-------|-------|
| Listed URL | `https://schreinerathletics.com` |
| Status | **Unreachable** (DNS/fetch failed) |
| Correct URL | `https://schreinermountaineers.com` |
| Platform | PrestoSports |
| Coach page | `https://schreinermountaineers.com/Sports/sball/coaches/index` |
| Sample emails | `mchristensen@schreiner.edu`, `rtovar@schreiner.edu` |

**Notes:** Homepage may return 403 to some automated clients but coaches page loads with full email listing.

---

### Southwestern University — PASS

| Field | Value |
|-------|-------|
| Listed URL | `https://southwesternpirates.com` |
| Redirect | None |
| Platform | Sidearm |
| Coach page | `https://southwesternpirates.com/sports/softball/coaches` |
| Sample emails | `lynna@southwestern.edu`, `crusek@southwestern.edu`, `athletics@southwestern.edu` |

---

### Sul Ross State University — PASS

| Field | Value |
|-------|-------|
| Listed URL | `https://srlobos.com` |
| Redirect | None |
| Platform | Sidearm |
| Coach page | `https://srlobos.com/sports/softball/coaches` |
| Sample emails | `Lacey.Middlebrooks@sulross.edu`, `sxc19ih@sulross.edu` |

---

### Texas Lutheran University — PASS

| Field | Value |
|-------|-------|
| Listed URL | `https://tlubulldogs.com` |
| Redirect | None |
| Platform | Sidearm |
| Coach page | `https://tlubulldogs.com/sports/softball/coaches` |
| Sample emails | `rwilson@tlu.edu`, `kmlockley@tlu.edu`, `cmiller@tlu.edu` |

---

### Trinity University — PASS

| Field | Value |
|-------|-------|
| Listed URL | `https://trinitytigers.com` |
| Redirect | None |
| Platform | Sidearm |
| Coach page | `https://trinitytigers.com/sports/softball/coaches` |
| Sample emails | `bwittena@trinity.edu`, `jcortina@trinity.edu`, `riserpri973@trinity.edu` |

Staff directory does not publish emails; coaches page has full staff emails.

---

### University of Dallas — PARTIAL

| Field | Value |
|-------|-------|
| Listed URL | `https://udallasathletics.com` |
| Redirect | None |
| Platform | Sidearm |
| Softball coach page | `https://udallasathletics.com/sports/softball/coaches` (no emails) |
| Staff directory | `https://udallasathletics.com/staff-directory` |
| Recruiting contact | Chris Conaty — Recruiting Coordinator (phone: 972-265-5779, no email listed) |

**Softball staff listed in directory (no emails):**
- Emily Martin — Volunteer Coach
- Sage Jenkins — Volunteer Coach
- Bella Halsey — Graduate Assistant

**Notes:**
- Athletics URL is **correct**, but the site does not publish softball coach emails on coaches page or staff directory table.
- Scraper test: 4 contacts found, 1 email (via staff profile page enrichment).
- Expect low email yield; may need profile-page scraping or phone-only contacts.

---

### University of Mary Hardin-Baylor — PASS

| Field | Value |
|-------|-------|
| Listed URL | `https://cruathletics.com` |
| Redirect | None |
| Platform | Sidearm |
| Coach page | `https://cruathletics.com/sports/softball/coaches` |
| Sample emails | `mmojica@umhb.edu`, `awachtendorf@umhb.edu` |

Staff directory has profile links (e.g. `/staff-directory/rachel-acosta/297`) but emails are on coaches page.

---

### University of St. Thomas (Houston) — PASS

| Field | Value |
|-------|-------|
| Listed URL | `https://ustcelts.com` |
| Redirect | None |
| Platform | Sidearm |
| Coach page | `https://ustcelts.com/sports/softball/coaches` |
| Sample emails | `froboea@stthom.edu`, `bailey.tisdale@stthom.edu` |

---

## Scraper Live Tests

These schools were additionally tested with `npm run scrape`:

| School | Staff page used | Contacts | With email | Notes |
|--------|----------------|----------|------------|-------|
| Austin College | `/sports/sball/coaches` | 3 | 1 | PrestoSports; emails on bio pages |
| University of Dallas | `/staff-directory` | 4 | 1 | Sparse public emails |

---

## Platform Breakdown

| Platform | Schools | Email pattern |
|----------|---------|---------------|
| Sidearm | 12 | Usually `/sports/softball/coaches` table with email column |
| PrestoSports | 3 (Austin College, Schreiner, McMurry*) | `/sports/sball/coaches` — emails inline or on bio pages |

*McMurry uses Sidearm on `mcmurrysports.com`; Schreiner and Austin College use PrestoSports.

---

## Next Steps After Manual Verification

1. Check off each school in the checklist table above.
2. Update `Texas_College_Softball_Athletic_Websites.md` with corrected URLs (McMurry, Schreiner, Howard Payne, optionally ETBU).
3. Update `seed/schools.json` to match.
4. Create SQL migration for URL updates (user applies in pgAdmin).
5. Run bulk scrape: `npm run scrape:tx -- --division D3`
