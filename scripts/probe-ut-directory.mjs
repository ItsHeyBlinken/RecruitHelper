import { writeFileSync } from "node:fs";
import { fetchHtml } from "../scraper/src/fetcher.ts";

const url = "https://texassports.com/staff-directory?path=general";
const html = await fetchHtml(url, true);
writeFileSync("scripts/ut-staff-directory.html", html);

const softballIdx = html.indexOf("SOFTBALL");
console.log("softball chunk sample:", html.slice(softballIdx, softballIdx + 3000).replace(/\s+/g, " ").slice(0, 1500));

const emails = [...html.matchAll(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)].map((m) => m[0]);
const utexas = [...new Set(emails.filter((e) => /utexas/i.test(e)))];
console.log("utexas emails in directory:", utexas);

const mailtos = [...html.matchAll(/mailto:([^"'?\\]+)/gi)].map((m) => m[1].toLowerCase());
console.log("unique mailtos:", [...new Set(mailtos)].slice(0, 20));
