import { readFileSync } from "fs";

const dir = readFileSync("scraper/scripts/baylor-staff-directory.html", "utf8");
for (const needle of ["Head Coach", "Assistant Coach", "Jennifer_fuller", "Baylor.edu", "baylor.edu", "7303", "7272"]) {
  const i = dir.indexOf(needle);
  console.log(needle, i >= 0 ? dir.slice(Math.max(0, i - 40), i + 60) : "missing");
}
