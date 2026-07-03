import { readFileSync } from "fs";

const dir = readFileSync("scraper/scripts/baylor-staff-directory.html", "utf8");
const idx = dir.toLowerCase().indexOf("glenn_moore@");
console.log("glenn email idx", idx, dir.slice(idx - 100, idx + 80));

const idx2 = dir.indexOf("Glenn Moore");
let count = 0;
let pos = 0;
while ((pos = dir.indexOf("Glenn Moore", pos)) !== -1 && count < 3) {
  console.log("occurrence", count, dir.slice(pos, pos + 300));
  pos += 1;
  count++;
}
