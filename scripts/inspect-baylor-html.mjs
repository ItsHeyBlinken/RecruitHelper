import { readFileSync } from "fs";

const profile = readFileSync("scraper/scripts/baylor-glenn-moore.html", "utf8");
const dir = readFileSync("scraper/scripts/baylor-staff-directory.html", "utf8");

console.log("profile title tag", profile.match(/<title>([^<]+)/)?.[1]);
console.log("og:title", profile.match(/property="og:title" content="([^"]+)"/)?.[1]);

const emailScript = profile.match(/var firstHalf = "([^"]+)";\s*var secondHalf = "([^"]+)"/);
console.log("obfuscated email", emailScript ? `${emailScript[1]}@${emailScript[2]}` : "none");

const jsonLd = profile.match(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/);
if (jsonLd) console.log("jsonld snippet", jsonLd[1].slice(0, 300));

const staffMember = profile.match(/"first_name":"Glenn"[^}]{0,400}/);
console.log("embedded staff json", staffMember?.[0]?.slice(0, 200));

const glennLinks = [...dir.matchAll(/staff-directory\/glenn-moore\/310/gi)];
console.log("glenn link count in dir", glennLinks.length);

const softballInDir = dir.toLowerCase().includes("softball");
console.log("softball in dir html", softballInDir);

const categorySoftball = [...dir.matchAll(/SOFTBALL[^<]{0,80}/gi)].slice(0, 5);
console.log("SOFTBALL snippets", categorySoftball.map((m) => m[0]));

const profileLinks = [...dir.matchAll(/\/staff-directory\/[a-z0-9-]+\/\d+/gi)];
console.log("profile links in dir", profileLinks.length);
