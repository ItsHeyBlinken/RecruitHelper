import { readFileSync } from "fs";

const dir = readFileSync("scraper/scripts/baylor-staff-directory.html", "utf8");

const mooreIdx = dir.indexOf("glenn-moore");
console.log("glenn context", dir.slice(mooreIdx - 200, mooreIdx + 400));

const softballStaff = [...dir.matchAll(/glenn-moore\/310[\s\S]{0,0}/gi)];
console.log("moore matches", softballStaff.length);

// find JSON near category softball
const catIdx = dir.indexOf('"SOFTBALL');
console.log("json cat", dir.slice(catIdx - 100, catIdx + 600));

const staffRows = [...dir.matchAll(/data-test-id="staff-directory-list-item__link"[^>]*href="([^"]+)"/gi)].slice(0, 5);
console.log("list links sample", staffRows.map((m) => m[1]));

const allListLinks = [...dir.matchAll(/staff-directory-list-item__link/gi)].length;
console.log("list item count", allListLinks);

const glennRow = dir.match(/staff-directory-list-item[\s\S]{0,500}glenn-moore[\s\S]{0,800}/i);
console.log("glenn row", glennRow?.[0]?.slice(0, 800));
