import { readFileSync } from "fs";

const dir = readFileSync("scraper/scripts/baylor-staff-directory.html", "utf8");
const start = dir.indexOf('"SOFTBALL |');
const chunk = dir.slice(start, start + 4000);
console.log(chunk);

// find all /staff-directory/*/310 style in chunk after softball
const links = [...chunk.matchAll(/\/staff-directory\/[a-z0-9-]+\/\d+/gi)].map((m) => m[0]);
console.log("links in softball chunk", links);

const members = [...chunk.matchAll(/,\d+,"([A-Za-z]+)","([A-Za-z0-9_]+)","(\d{4})"/g)];
console.log("member tuples", members.map((m) => ({ id: m[0], first: m[1], emailUser: m[2], phone: m[3] })));
