# Texas NCAA D2 Softball — URL Verification Report

**Generated:** 2026-07-02  
**Source doc:** `Texas_College_Softball_Athletic_Websites.md` (NCAA D2 section)  
**Crawl script:** `node scripts/verify-d2-urls.mjs`  
**Raw JSON:** `docs/d2-url-verification-results.json`

---

## Executive Summary

| Metric | Count |
| :--- | :--- |
| Schools crawled | 12 |
| GOOD (ready to scrape) | 11 at crawl time → **12 after UTPB fix** |
| LIKELY | 0 |
| CHECK | 0 |
| FAIL | 1 (UT Permian Basin — **fixed**) |

**Platform:** All 12 schools use **Sidearm Sports** athletics sites.

**URL correction applied:** University of Texas Permian Basin was listed as `https://utpbbasinguns.com` (dead domain). Correct site is **`https://utpbfalcons.com`**. Updated in `Texas_College_Softball_Athletic_Websites.md`, `seed/schools.json`, and `db/017_fix_utpb_athletics_url.sql`.

---

## Manual Verification Checklist

Use the **Verified** column to mark each school after you confirm the URL and coach-email path in a browser.

| Verified | School | Athletics URL | Verdict | Best coach/recruiter path | Emails found (automated) |
| :---: | :--- | :--- | :---: | :--- | :--- |
| [ ] | Angelo State University | [angelosports.com](https://angelosports.com) | GOOD | [/sports/softball/coaches](https://angelosports.com/sports/softball/coaches) | travis.scott@angelo.edu, katie.scott@angelo.edu |
| [ ] | Lubbock Christian University | [lcuchaps.com](https://lcuchaps.com) | GOOD | [staff-directory](https://lcuchaps.com/staff-directory) or homepage | chris.due@lcu.edu, everett.corder@lcu.edu |
| [ ] | Midwestern State University | [msumustangs.com](https://msumustangs.com) | GOOD | [/sports/softball/coaches](https://msumustangs.com/sports/softball/coaches) | kaelani.bryan@msutexas.edu, katelynn.taylor@msutexas.edu |
| [ ] | St. Edward's University | [gohilltoppers.com](https://gohilltoppers.com) | GOOD | [staff-directory](https://gohilltoppers.com/staff-directory) | athletics@stedwards.edu *(generic only)* |
| [ ] | St. Mary's University | [rattlerathletics.com](https://rattlerathletics.com) | GOOD | [/sports/softball/coaches](https://rattlerathletics.com/sports/softball/coaches) | tlira@stmarytx.edu, cgicante@stmarytx.edu, khirlas@mail.stmarytx.edu |
| [ ] | Texas A&M International University | [godustdevils.com](https://godustdevils.com) | GOOD | [/sports/softball/coaches](https://godustdevils.com/sports/softball/coaches) | scott.libby@tamiu.edu, anthony.saldivar@tamiu.edu, melanie.gamboa@tamiu.edu |
| [ ] | Texas A&M University-Kingsville | [javelinaathletics.com](https://javelinaathletics.com) | GOOD | [/sports/softball/coaches](https://javelinaathletics.com/sports/softball/coaches) | orlando.salinas@tamuk.edu, cornelius.gallegos@tamuk.edu |
| [ ] | Texas Woman's University | [twuathletics.com](https://twuathletics.com) | GOOD | [/sports/softball/coaches](https://twuathletics.com/sports/softball/coaches) | rmcnutt@twu.edu, mrobinson28@twu.edu, khill32@twu.edu |
| [ ] | University of Texas Permian Basin | [utpbfalcons.com](https://utpbfalcons.com) | **FIXED** | [/sports/softball/coaches](https://utpbfalcons.com/sports/softball/coaches) | martinez_da@utpb.edu, johnson_b@utpb.edu |
| [ ] | University of Texas at Dallas | [utdcomets.com](https://utdcomets.com) | GOOD | [/sports/softball/coaches](https://utdcomets.com/sports/softball/coaches) | casey.dickson@utdallas.edu, jami.clinton@utdallas.edu, jacob.woolley@utdallas.edu |
| [ ] | University of Texas at Tyler | [uttylerpatriots.com](https://uttylerpatriots.com) | GOOD* | [staff-directory](https://uttylerpatriots.com/staff-directory) + profile pages | *(none on probed pages — see notes)* |
| [ ] | West Texas A&M University | [gobuffsgo.com](https://gobuffsgo.com) | GOOD | [/sports/softball/coaches](https://gobuffsgo.com/sports/softball/coaches) | mmook@wtamu.edu, jtrautmann@wtamu.edu |

\* UT Tyler: Site structure is correct (Sidearm + softball staff links) but coach emails were not in static HTML on coaches/roster/staff-directory pages. Scraper profile-page enrichment may be required.

---

## Per-School Details

### Angelo State University

| Field | Value |
| :--- | :--- |
| **Listed URL** | https://angelosports.com |
| **Final URL (redirect)** | https://angelosports.com/splash.aspx?id=splash_322 |
| **HTTP status** | 200 |
| **Platform** | Sidearm |
| **Softball on homepage** | No (splash page hides nav) |
| **School name on page** | Yes |
| **Staff links found** | None on homepage |
| **Best probe path** | https://angelosports.com/sports/softball/coaches |
| **Emails found** | travis.scott@angelo.edu, katie.scott@angelo.edu |
| **Verdict** | GOOD |
| **Manual notes** | Homepage splash may confuse discovery; `/sports/softball/coaches` works directly. |

---

### Lubbock Christian University

| Field | Value |
| :--- | :--- |
| **Listed URL** | https://lcuchaps.com |
| **Final URL** | https://lcuchaps.com/ |
| **HTTP status** | 200 |
| **Platform** | Sidearm |
| **Softball on homepage** | Yes |
| **School name on page** | Yes |
| **Staff links found** | /sports/softball/roster, /staff-directory |
| **Emails found** | chris.due@lcu.edu, everett.corder@lcu.edu |
| **Verdict** | GOOD |
| **Manual notes** | Emails found on homepage without probing deeper paths. |

---

### Midwestern State University

| Field | Value |
| :--- | :--- |
| **Listed URL** | https://msumustangs.com |
| **Final URL** | https://msumustangs.com/ |
| **HTTP status** | 200 |
| **Platform** | Sidearm |
| **Softball on homepage** | Yes |
| **School name on page** | Yes |
| **Staff links found** | /sports/softball/roster, /staff-directory |
| **Best probe path** | https://msumustangs.com/sports/softball/coaches |
| **Emails found** | kaelani.bryan@msutexas.edu, katelynn.taylor@msutexas.edu |
| **Verdict** | GOOD |
| **Manual notes** | Roster and staff-directory had no inline emails; coaches page had both. |

---

### St. Edward's University

| Field | Value |
| :--- | :--- |
| **Listed URL** | https://gohilltoppers.com |
| **Final URL** | https://gohilltoppers.com/ |
| **HTTP status** | 200 |
| **Platform** | Sidearm |
| **Softball on homepage** | Yes |
| **School name on page** | Yes |
| **Staff links found** | /sports/softball/roster, /staff-directory |
| **Best probe path** | https://gohilltoppers.com/staff-directory |
| **Emails found** | athletics@stedwards.edu |
| **Verdict** | GOOD |
| **Manual notes** | Only a **generic athletics email** found — no individual coach emails on probed pages. Verify whether coach profile pages or university directory has direct contacts. |

---

### St. Mary's University

| Field | Value |
| :--- | :--- |
| **Listed URL** | https://rattlerathletics.com |
| **Final URL** | https://rattlerathletics.com/ |
| **HTTP status** | 200 |
| **Platform** | Sidearm |
| **Softball on homepage** | Yes |
| **School name on page** | Yes |
| **Staff links found** | /sports/softball/roster, /staff-directory |
| **Best probe path** | https://rattlerathletics.com/sports/softball/coaches |
| **Emails found** | tlira@stmarytx.edu, cgicante@stmarytx.edu, khirlas@mail.stmarytx.edu |
| **Verdict** | GOOD |

---

### Texas A&M International University

| Field | Value |
| :--- | :--- |
| **Listed URL** | https://godustdevils.com |
| **Final URL** | https://godustdevils.com/ |
| **HTTP status** | 200 |
| **Platform** | Sidearm |
| **Softball on homepage** | Yes |
| **School name on page** | Yes |
| **Staff links found** | /sports/softball/roster, /staff-directory |
| **Best probe path** | https://godustdevils.com/sports/softball/coaches |
| **Emails found** | scott.libby@tamiu.edu, anthony.saldivar@tamiu.edu, melanie.gamboa@tamiu.edu |
| **Verdict** | GOOD |

---

### Texas A&M University-Kingsville

| Field | Value |
| :--- | :--- |
| **Listed URL** | https://javelinaathletics.com |
| **Final URL** | https://javelinaathletics.com/ |
| **HTTP status** | 200 |
| **Platform** | Sidearm |
| **Softball on homepage** | Yes |
| **School name on page** | Yes |
| **Staff links found** | /sports/softball/roster, /staff-directory |
| **Best probe path** | https://javelinaathletics.com/sports/softball/coaches |
| **Emails found** | orlando.salinas@tamuk.edu, cornelius.gallegos@tamuk.edu |
| **Verdict** | GOOD |

---

### Texas Woman's University

| Field | Value |
| :--- | :--- |
| **Listed URL** | https://twuathletics.com |
| **Final URL** | https://twuathletics.com/ |
| **HTTP status** | 200 |
| **Platform** | Sidearm |
| **Softball on homepage** | Yes |
| **School name on page** | No *(automated token match failed; site is correct)* |
| **Staff links found** | /sports/softball/roster, /staff-directory |
| **Best probe path** | https://twuathletics.com/sports/softball/coaches |
| **Emails found** | rmcnutt@twu.edu, mrobinson28@twu.edu, khill32@twu.edu |
| **Verdict** | GOOD |
| **Manual notes** | "Texas Woman's" branding may not match naive name-token check; URL is correct. |

---

### University of Texas Permian Basin — **URL CORRECTION**

| Field | Value |
| :--- | :--- |
| **Old (wrong) URL** | https://utpbbasinguns.com — **does not resolve** |
| **Correct URL** | https://utpbfalcons.com |
| **Final URL (redirect)** | https://utpbfalcons.com/splash.aspx?id=splash_54 |
| **HTTP status** | 200 (corrected URL) |
| **Platform** | Sidearm |
| **Softball on homepage** | No (splash page) |
| **Best probe path** | https://utpbfalcons.com/sports/softball/coaches |
| **Emails found** | martinez_da@utpb.edu, johnson_b@utpb.edu |
| **Original crawl verdict** | FAIL |
| **Corrected verdict** | GOOD |
| **Files updated** | `Texas_College_Softball_Athletic_Websites.md`, `seed/schools.json`, `db/017_fix_utpb_athletics_url.sql` |
| **Manual notes** | Apply `db/017_fix_utpb_athletics_url.sql` in pgAdmin before scraping. |

---

### University of Texas at Dallas

| Field | Value |
| :--- | :--- |
| **Listed URL** | https://utdcomets.com |
| **Final URL** | https://utdcomets.com/ |
| **HTTP status** | 200 |
| **Platform** | Sidearm |
| **Softball on homepage** | Yes |
| **School name on page** | Yes |
| **Staff links found** | /sports/softball/roster |
| **Best probe path** | https://utdcomets.com/sports/softball/coaches |
| **Emails found** | casey.dickson@utdallas.edu, jami.clinton@utdallas.edu, jacob.woolley@utdallas.edu |
| **Verdict** | GOOD |

---

### University of Texas at Tyler

| Field | Value |
| :--- | :--- |
| **Listed URL** | https://uttylerpatriots.com |
| **Final URL** | https://uttylerpatriots.com/ |
| **HTTP status** | 200 |
| **Platform** | Sidearm |
| **Softball on homepage** | Yes |
| **School name on page** | Yes |
| **Staff links found** | /sports/softball/roster, /staff-directory |
| **Pages probed (no emails)** | /sports/softball/roster, /staff-directory, /sports/softball/coaches |
| **Emails found** | None in static HTML |
| **Verdict** | GOOD *(structure only)* |
| **Manual notes** | Softball coaches appear on staff-directory but emails likely live on individual staff profile pages. Confirm in browser; scraper profile enrichment should be tested here. |

---

### West Texas A&M University

| Field | Value |
| :--- | :--- |
| **Listed URL** | https://gobuffsgo.com |
| **Final URL** | https://gobuffsgo.com/ |
| **HTTP status** | 200 |
| **Platform** | Sidearm |
| **Softball on homepage** | Yes |
| **School name on page** | Yes |
| **Staff links found** | /sports/softball/roster, /staff-directory, /staff-directory?path=general |
| **Best probe path** | https://gobuffsgo.com/sports/softball/coaches |
| **Emails found** | mmook@wtamu.edu, jtrautmann@wtamu.edu |
| **Verdict** | GOOD |

---

## Scraper Readiness Notes

| School | Scrape concern | Recommended approach |
| :--- | :--- | :--- |
| Angelo State | Splash homepage hides softball nav | Probe `/sports/softball/coaches` directly |
| St. Edward's | Only generic athletics email | Try staff profile pages or university directory |
| UT Permian Basin | Was wrong domain in seed | Use `utpbfalcons.com` after migration 017 |
| UT Tyler | No inline emails on standard paths | Staff profile page enrichment |
| All others | Standard Sidearm | `/sports/softball/coaches` or `/staff-directory` |

---

## Pending Database Action

Apply in pgAdmin (user-managed):

```sql
-- db/017_fix_utpb_athletics_url.sql
UPDATE schools SET athletics_url = 'https://utpbfalcons.com', updated_at = NOW()
WHERE school_name = 'University of Texas Permian Basin';
```

---

## Re-run Verification

```bash
node scripts/verify-d2-urls.mjs
```

Results are written to `docs/d2-url-verification-results.json`.

**Note:** Re-running before updating the script to use `utpbfalcons.com` for UTPB will still show FAIL for the old domain. The checklist above reflects the corrected URL.
