import { readFileSync } from "fs";

const dir = readFileSync("scraper/scripts/baylor-staff-directory.html", "utf8");
const profile = readFileSync("scraper/scripts/baylor-glenn-moore.html", "utf8");

const idx = dir.indexOf("SOFTBALL |");
console.log("dir context", dir.slice(idx, idx + 2500));

const emails = [...profile.matchAll(/[a-z0-9._%+-]+@baylor\.edu/gi)].map((m) => m[0]);
console.log("profile emails", [...new Set(emails)]);

const payload = profile.match(/__NUXT__|window\.__INITIAL_STATE__|staffMember|member_id.:310/gi);
console.log("payload hints", payload?.slice(0, 5));

const mooreJson = profile.match(/"slug":"glenn-moore"[\s\S]{0,800}/);
console.log("slug json", mooreJson?.[0]?.slice(0, 500));

const titleArea = profile.match(/Title:[\s\S]{0,400}/i);
console.log("title area", titleArea?.[0]);
