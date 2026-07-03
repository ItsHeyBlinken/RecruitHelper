import { readFileSync } from "fs";

const dir = readFileSync("scraper/scripts/baylor-staff-directory.html", "utf8");
const mailtos = [...dir.matchAll(/mailto:([A-Za-z0-9._%+-]+@baylor\.edu)/gi)].map((m) => m[1]);
console.log("unique mailtos", [...new Set(mailtos)].length);

const glennMailto = dir.match(/glenn-moore[\s\S]{0,1200}mailto:([^"']+)/i);
console.log("glenn mailto context", glennMailto?.[1]);

// visible titles near glenn
const glennBlock = dir.match(/glenn-moore\/310[\s\S]{0,2000}/i)?.[0] ?? "";
console.log("glenn block has Head Coach", glennBlock.includes("Head Coach"));
console.log("glenn block snippet", glennBlock.slice(0, 1200));
