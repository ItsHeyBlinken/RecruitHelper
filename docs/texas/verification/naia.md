# NAIA Texas Softball Athletics URL Verification

**Date:** 2026-07-02  
**Source doc:** `Texas_College_Softball_Athletic_Websites.md` (NAIA section)  
**Method:** HTTP checks + project scraper dry-run (no database writes)

## Summary

| Result | Count |
|--------|-------|
| URLs confirmed correct | 7 / 9 |
| URLs need replacement | 2 / 9 |

**Action required:** Update Jarvis Christian and Texas College URLs in the doc, seed, and database before bulk scraping.

---

## Quick reference

| School | Doc URL | Status | Recommended URL |
|--------|---------|--------|-----------------|
| Houston-Victoria (UHV) | `https://uhvjaguars.com` | ✅ OK | Keep |
| Jarvis Christian University | `https://jarvisathletics.com` | ❌ Replace | `https://jcubulldogs.com` |
| Nelson University | `https://nelsonlions.com` | ✅ OK | Keep |
| Our Lady of the Lake (OLLU) | `https://ollusaintsathletics.com` | ✅ OK | Keep |
| Texas A&M-Texarkana | `https://tamuteagles.com` | ✅ OK | Keep |
| Texas College | `https://texascollege.edu/athletics` | ❌ Replace | `https://www.tcsteersathletics.com` |
| Texas Wesleyan University | `https://ramsports.net/sports/softball` | ✅ OK | Keep |
| University of the Southwest | `https://uswathletics.com` | ✅ OK | Keep |
| Wayland Baptist University | `https://wbuathletics.com` | ✅ OK | Keep |

---

## Per-school details

### ✅ Houston-Victoria (UHV)

| Field | Value |
|-------|-------|
| **Doc URL** | `https://uhvjaguars.com` |
| **Verdict** | Correct — official A&M-Victoria athletics site (Sidearm/PrestoSports) |
| **Softball program** | Yes — news and RRAC softball content on homepage |
| **Best coach page** | `https://uhvjaguars.com/sports/sball/coaches` |
| **Staff directory** | `https://uhvjaguars.com/staff-directory/index` (exists; coaches page worked better) |
| **Scraper result** | 2 contacts, 2 with email |

**Coaches found:**

| Name | Title | Email |
|------|-------|-------|
| Lindsey Ortiz | Head Coach | `ortizln@tamuv.edu` |
| Cameron Henneke | Assistant Coach | `cowancl1@tamuv.edu` |

**Manual check:** [ ] Verified

---

### ❌ Jarvis Christian University

| Field | Value |
|-------|-------|
| **Doc URL** | `https://jarvisathletics.com` |
| **Verdict** | **Wrong** — domain does not resolve (`ERR_NAME_NOT_RESOLVED`) |
| **Recommended URL** | `https://jcubulldogs.com` |
| **Softball page** | `https://jcubulldogs.com/sports/sball/index` |
| **Coaches page** | `https://jcubulldogs.com/sports/sball/coaches/index` |
| **RRAC listing** | [Red River Athletic Conference](https://www.redriverconference.com/sports/sball/2025-26/teams/jarvischristian) links to jcubulldogs.com |
| **Scraper result** | 0 contacts, 0 emails |

**Notes:**

- `jarvisathletics.com` fails DNS lookup entirely.
- `jcubulldogs.com` loads and has an active softball program with schedules, rosters, and news.
- Coaches page returns **403 Forbidden** to simple HTTP clients; Playwright-based scraper still found **no coach contacts**.
- Coach/recruiter emails may not be published on the athletics site — may require university directory lookup or direct contact.

**Manual check:** [ ] Verified replacement URL  
**Manual check:** [ ] Confirmed whether coach emails are published anywhere on site

---

### ✅ Nelson University

| Field | Value |
|-------|-------|
| **Doc URL** | `https://nelsonlions.com` |
| **Verdict** | Correct — Nelson University athletics (Sidearm NextGen) |
| **Softball page** | `https://nelsonlions.com/sports/softball` |
| **Best coach page** | `https://nelsonlions.com/staff-directory` |
| **Scraper result** | 4 contacts, 3 with email |

**Coaches found:**

| Name | Title | Email |
|------|-------|-------|
| Watty Watson | Head Softball Coach | `swatson@nelson.edu` |
| Autumn Graham | Assistant Softball Coach | `agraham@nelson.edu` |
| Caleb Munoz | Student Assistant | *(no email)* |

**Parser note:** One duplicate/misparse listed "Nelson University" as a coach name with `swatson@nelson.edu` — likely a site markup quirk; Watson is the actual head coach.

**Manual check:** [ ] Verified

---

### ✅ Our Lady of the Lake University (OLLU)

| Field | Value |
|-------|-------|
| **Doc URL** | `https://ollusaintsathletics.com` |
| **Verdict** | Correct — OLLU Saints athletics (Sidearm) |
| **Softball program** | Yes — active NAIA program (ranked nationally in 2025) |
| **Best coach page** | `https://ollusaintsathletics.com/sports/sball/coaches` |
| **Staff directory** | `https://ollusaintsathletics.com/staff-directory` (exists) |
| **Scraper result** | 1 contact, 1 with email |

**Coaches found:**

| Name | Title | Email |
|------|-------|-------|
| Bruce Lenington | Head Coach | `blenington@ollusa.edu` |

**Manual check:** [ ] Verified

---

### ✅ Texas A&M University-Texarkana (TAMUT)

| Field | Value |
|-------|-------|
| **Doc URL** | `https://tamuteagles.com` |
| **Verdict** | Correct — TAMUT Eagles athletics (PrestoSports) |
| **Best coach page** | `https://tamuteagles.com/sports/sball/coaches` |
| **Scraper result** | 2 contacts, 1 with email |

**Coaches found:**

| Name | Title | Email |
|------|-------|-------|
| Tony McKnight | Head Coach | `tmcknight@tamut.edu` |
| Brian Baisch | Assistant Coach | *(no email published)* |

**Manual check:** [ ] Verified

---

### ❌ Texas College

| Field | Value |
|-------|-------|
| **Doc URL** | `https://texascollege.edu/athletics` |
| **Verdict** | **Wrong** — returns **404 Not Found** |
| **Recommended URL** | `https://www.tcsteersathletics.com` |
| **Alternate** | `https://tcsteersathletics.com` (same site) |
| **Softball page** | `https://www.tcsteersathletics.com/sports/sball/index` |
| **Coaches page** | `https://www.tcsteersathletics.com/sports/sball/coaches/index` |
| **RRAC listing** | [RRAC members](https://www.redriverconference.com/member) links to tcsteersathletics.com |
| **Scraper result** | 1 contact, 0 with email |

**Notes:**

- `texascollege.edu` main site loads (200) but `/athletics` and all athletics subpaths return 404.
- Athletics are hosted on a separate PrestoSports domain (`tcsteersathletics.com`).
- Coaches page currently shows **"Head Coach: Open"** with a broken template (`Open ${lastName}`) — position may be vacant.
- No coach email found on the coaches page at time of crawl. Historical reference: Cecilia Abad was listed as head coach with `cabad@texascollege.edu` in older listings; not present on current page.

**Manual check:** [ ] Verified replacement URL  
**Manual check:** [ ] Confirmed current head coach and whether email is published

---

### ✅ Texas Wesleyan University

| Field | Value |
|-------|-------|
| **Doc URL** | `https://ramsports.net/sports/softball` |
| **Verdict** | Correct — Texas Wesleyan Rams athletics (Sidearm) |
| **Note** | Root `https://ramsports.net` also works; softball-specific URL is fine as seed entry |
| **Best coach page** | `https://ramsports.net/sports/softball/coaches` |
| **Staff directory** | `https://ramsports.net/staff-directory` (exists) |
| **Scraper result** | 2 contacts, 2 with email |

**Coaches found:**

| Name | Title | Email |
|------|-------|-------|
| Shannon Gower | Head Coach | `sgower@txwes.edu` |
| Darian Dunn | Assistant Coach | `drdunn@txwes.edu` |

**Manual check:** [ ] Verified

---

### ✅ University of the Southwest (USW)

| Field | Value |
|-------|-------|
| **Doc URL** | `https://uswathletics.com` |
| **Verdict** | Correct — USW Mustangs athletics (Sidearm) |
| **Softball page** | `https://uswathletics.com/sports/softball` |
| **Best coach page** | `https://uswathletics.com/sports/softball/roster` (coach info on roster) |
| **Scraper result** | 1 contact, 1 with email |

**Coaches found:**

| Name | Title | Email |
|------|-------|-------|
| *(parser used site name)* | Head Coach | `cpetroski@usw.edu` |

**Parser note:** Coach name parsed as "University of the Southwest Athletics" — site markup issue; email `cpetroski@usw.edu` is valid.

**Manual check:** [ ] Verified coach name matches email

---

### ✅ Wayland Baptist University (WBU)

| Field | Value |
|-------|-------|
| **Doc URL** | `https://wbuathletics.com` |
| **Verdict** | Correct — Wayland Baptist Pioneers athletics (Sidearm) |
| **Softball page** | `https://wbuathletics.com/sports/softball` |
| **Best coach page** | `https://wbuathletics.com/staff-directory` |
| **Scraper result** | 4 contacts, 2 with email |

**Coaches found:**

| Name | Title | Email |
|------|-------|-------|
| Enrique Villa | Head Coach | `villae@wbu.edu` |
| Brooklyn Araujo | Assistant Coach | `araujob@wbu.edu` |
| Amber Poorbaugh | Graduate Assistant | *(no email)* |
| Kisbel Vizcaya | Graduate Assistant | *(no email)* |

**Manual check:** [ ] Verified

---

## Recommended doc/seed updates

When manually verified, apply these URL changes:

| School | Change from | Change to |
|--------|-------------|-----------|
| Jarvis Christian University | `https://jarvisathletics.com` | `https://jcubulldogs.com` |
| Texas College | `https://texascollege.edu/athletics` | `https://www.tcsteersathletics.com` |

**Files to update after manual sign-off:**

- `Texas_College_Softball_Athletic_Websites.md`
- `seed/schools.json`
- `docs/texas-url-verification.html` (regenerate via `npm run texas:url-checklist`)
- New SQL migration for pgAdmin (e.g. `db/017_fix_naia_urls.sql`)

---

## Verification checklist

Use this when reviewing each site in a browser:

- [ ] UHV — `https://uhvjaguars.com`
- [ ] Jarvis Christian — `https://jcubulldogs.com` *(replacement)*
- [ ] Nelson — `https://nelsonlions.com`
- [ ] OLLU — `https://ollusaintsathletics.com`
- [ ] TAMUT — `https://tamuteagles.com`
- [ ] Texas College — `https://www.tcsteersathletics.com` *(replacement)*
- [ ] Texas Wesleyan — `https://ramsports.net/sports/softball`
- [ ] USW — `https://uswathletics.com`
- [ ] Wayland Baptist — `https://wbuathletics.com`

---

## HTTP probe notes

Some Sidearm/PrestoSports sites return **404 on HEAD requests** but **200/202 on GET** for softball paths (e.g. `/sports/wsoftbl`, `/sports/sball`). The scraper handles this via Playwright fallback.

| Path pattern | Schools using it |
|--------------|------------------|
| `/sports/sball/coaches` | UHV, OLLU, TAMUT, Jarvis, Texas College |
| `/sports/softball/coaches` | Texas Wesleyan |
| `/staff-directory` | Nelson, Wayland Baptist |
| `/sports/softball/roster` | USW |
