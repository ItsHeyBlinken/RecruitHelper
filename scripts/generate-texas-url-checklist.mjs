import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { TEXAS_URL_CHECKLIST_HTML } from "./texas-doc-paths.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const seedPath = resolve(root, "seed/schools.json");
const outPath = TEXAS_URL_CHECKLIST_HTML;

const DIVISION_ORDER = ["D1", "D2", "D3", "JUCO", "NAIA"];

const schools = JSON.parse(readFileSync(seedPath, "utf8"))
  .filter((s) => s.state === "TX")
  .sort((a, b) => {
    const div = DIVISION_ORDER.indexOf(a.division) - DIVISION_ORDER.indexOf(b.division);
    if (div !== 0) return div;
    return a.school_name.localeCompare(b.school_name);
  });

const byDivision = new Map();
for (const school of schools) {
  if (!byDivision.has(school.division)) byDivision.set(school.division, []);
  byDivision.get(school.division).push(school);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const sections = DIVISION_ORDER.filter((d) => byDivision.has(d))
  .map((division) => {
    const rows = byDivision
      .get(division)
      .map((school) => {
        const id = slugify(school.school_name);
        return `
        <tr data-school-id="${id}">
          <td><input type="checkbox" id="chk-${id}" data-school-id="${id}" aria-label="Verified ${escapeHtml(school.school_name)}" /></td>
          <td><label for="chk-${id}">${escapeHtml(school.school_name)}</label></td>
          <td><a href="${escapeHtml(school.athletics_url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(school.athletics_url)}</a></td>
          <td><input type="text" class="notes" data-school-id="${id}" placeholder="Notes (wrong URL, no softball, etc.)" /></td>
        </tr>`;
      })
      .join("");

    return `
    <section class="division">
      <h2>${division} <span class="count" data-division="${division}">0 / ${byDivision.get(division).length}</span></h2>
      <table>
        <thead>
          <tr>
            <th>OK</th>
            <th>School</th>
            <th>Athletics URL</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </section>`;
  })
  .join("");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Texas Softball URL Verification</title>
  <style>
    :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
    body { margin: 0; padding: 1.5rem; max-width: 1200px; }
    h1 { margin-top: 0; }
    .summary { margin: 1rem 0 2rem; padding: 1rem; border: 1px solid #8884; border-radius: 8px; }
    .division { margin-bottom: 2.5rem; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid #8883; vertical-align: top; }
    th { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.04em; }
    td:first-child { width: 2.5rem; }
    td:nth-child(2) { width: 28%; }
    .notes { width: 100%; box-sizing: border-box; padding: 0.35rem 0.5rem; }
    tr.verified td { opacity: 0.65; }
    tr.verified td:nth-child(2) label { text-decoration: line-through; }
    .count { font-size: 0.9rem; font-weight: normal; opacity: 0.8; }
    .actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1rem; }
    button { padding: 0.45rem 0.8rem; cursor: pointer; }
    a { word-break: break-all; }
  </style>
</head>
<body>
  <h1>Texas Softball Athletics URL Verification</h1>
  <p>Check each link before bulk scraping. Progress saves in this browser.</p>
  <div class="summary">
    <strong>Total:</strong> <span id="total-progress">0 / ${schools.length}</span> verified
    <div class="actions">
      <button type="button" id="reset-progress">Reset all progress</button>
      <button type="button" id="export-notes">Copy notes to clipboard</button>
    </div>
  </div>
  ${sections}
  <script>
    const STORAGE_KEY = "recruithelper-tx-url-verification-v1";

    function loadState() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      } catch {
        return {};
      }
    }

    function saveState(state) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function updateCounts() {
      const checked = document.querySelectorAll('input[type="checkbox"]:checked').length;
      const total = document.querySelectorAll('input[type="checkbox"]').length;
      document.getElementById("total-progress").textContent = checked + " / " + total;

      document.querySelectorAll("section.division").forEach((section) => {
        const boxes = section.querySelectorAll('input[type="checkbox"]');
        const done = section.querySelectorAll('input[type="checkbox"]:checked').length;
        const countEl = section.querySelector(".count");
        if (countEl) countEl.textContent = done + " / " + boxes.length;
      });
    }

    function applyState(state) {
      document.querySelectorAll('input[type="checkbox"]').forEach((box) => {
        const id = box.dataset.schoolId;
        box.checked = Boolean(state[id]?.checked);
        const row = box.closest("tr");
        if (row) row.classList.toggle("verified", box.checked);
      });
      document.querySelectorAll("input.notes").forEach((input) => {
        const id = input.dataset.schoolId;
        input.value = state[id]?.notes || "";
      });
      updateCounts();
    }

    function persist() {
      const state = loadState();
      document.querySelectorAll('input[type="checkbox"]').forEach((box) => {
        const id = box.dataset.schoolId;
        state[id] = { ...(state[id] || {}), checked: box.checked };
      });
      document.querySelectorAll("input.notes").forEach((input) => {
        const id = input.dataset.schoolId;
        state[id] = { ...(state[id] || {}), notes: input.value };
      });
      saveState(state);
      updateCounts();
    }

    document.querySelectorAll('input[type="checkbox"]').forEach((box) => {
      box.addEventListener("change", () => {
        const row = box.closest("tr");
        if (row) row.classList.toggle("verified", box.checked);
        persist();
      });
    });

    document.querySelectorAll("input.notes").forEach((input) => {
      input.addEventListener("input", persist);
    });

    document.getElementById("reset-progress").addEventListener("click", () => {
      if (!confirm("Clear all checkboxes and notes?")) return;
      localStorage.removeItem(STORAGE_KEY);
      applyState({});
    });

    document.getElementById("export-notes").addEventListener("click", async () => {
      const lines = [];
      document.querySelectorAll("tbody tr").forEach((row) => {
        const name = row.querySelector("label")?.textContent?.trim();
        const url = row.querySelector("a")?.href;
        const checked = row.querySelector('input[type="checkbox"]')?.checked;
        const notes = row.querySelector("input.notes")?.value?.trim();
        if (!checked && !notes) return;
        lines.push((checked ? "[OK] " : "[TODO] ") + name + " | " + url + (notes ? " | " + notes : ""));
      });
      const text = lines.join("\\n") || "No verified schools or notes yet.";
      await navigator.clipboard.writeText(text);
      alert("Copied " + lines.length + " line(s) to clipboard.");
    });

    applyState(loadState());
  </script>
</body>
</html>`;

writeFileSync(outPath, html, "utf8");
console.log(`Wrote ${schools.length} TX schools to ${outPath}`);
