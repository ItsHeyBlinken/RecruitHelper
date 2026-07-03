import { readFileSync } from "fs";
import { loadCheerio } from "../scraper/src/fetcher.js";

const dir = readFileSync("scraper/scripts/baylor-staff-directory.html", "utf8");
const $ = loadCheerio(dir);
const link = $("a[href*='glenn-moore/310']").first();
console.log("link classes", link.attr("class"), link.attr("data-test-id"));
const card = link.closest(".s-person-card");
const details = link.closest(".s-person-details");
console.log("card len", card.length, "details len", details.length);
console.log("card h4", card.find("h4").text());
console.log("card title", card.find(".s-person-details__position div").text());
console.log("card mailto", card.find('a[href^="mailto:"]').attr("href"));
console.log("details h4", details.find("h4").text());
console.log("details mailto", details.find('a[href^="mailto:"]').attr("href"));

// walk up parents for mailto
let el = link;
for (let i = 0; i < 8; i++) {
  el = el.parent();
  const mailto = el.find('a[href^="mailto:"]').first().attr("href");
  const h4 = el.find("h4").first().text();
  if (mailto || h4) console.log("level", i, "h4", h4, "mailto", mailto);
}
