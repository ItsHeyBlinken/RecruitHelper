import { writeFileSync } from "node:fs";
import { fetchHtml } from "../scraper/src/fetcher.ts";
import { revealCloudflareEmailsInHtml } from "../scraper/src/email-decode.ts";

const url = "https://texassports.com/staff-directory/mike-white/382";
const html = await fetchHtml(url, true);
writeFileSync("scripts/ut-mike-white.html", html);

const revealed = revealCloudflareEmailsInHtml(html);
const emails = [...revealed.matchAll(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)].map((m) => m[0]);
console.log("All emails in revealed HTML:", [...new Set(emails)]);

const jsonEmails = [...html.matchAll(/"email"\s*:\s*"([^"]+)"/gi)].map((m) => m[1]);
console.log("JSON email fields:", [...new Set(jsonEmails)]);

const cfEmails = [...html.matchAll(/data-cfemail="([^"]+)"/gi)].map((m) => m[1]);
console.log("cfemail count:", cfEmails.length, cfEmails.slice(0, 5));

const obfuscated = html.match(/var firstHalf = "([^"]+)";\s*var secondHalf = "([^"]+)";/gi);
console.log("obfuscated patterns:", obfuscated);

// bio fields component
const bioEmail = html.match(/staff-directory-bio-fields[^]{0,2000}email/gi);
console.log("bio field snippets:", bioEmail?.slice(0, 3));
