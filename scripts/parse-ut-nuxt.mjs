import { readFileSync } from "node:fs";

const h = readFileSync("scripts/ut-mike-white.html", "utf8");
const idx = h.indexOf('"email":21');
console.log("context", h.slice(idx - 200, idx + 400));

const mikeIdx = h.indexOf("Mike White");
console.log("mike context", h.slice(mikeIdx - 100, mikeIdx + 500));

// Find all @utexas emails in full html
const emails = [...h.matchAll(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]*utexas[a-zA-Z0-9.-]*/gi)].map((m) => m[0]);
console.log("utexas emails:", [...new Set(emails)]);

// Look for emailUsername
const eu = h.match(/emailUsername.{0,100}/gi);
console.log("emailUsername samples:", eu?.slice(0, 5));
