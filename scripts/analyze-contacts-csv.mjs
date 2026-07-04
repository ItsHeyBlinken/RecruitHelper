import { readFileSync } from "node:fs";

const file = process.argv[2] ?? "data-7-3v2.csv";

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (c === '"') {
      inQ = !inQ;
      continue;
    }
    if ((c === "," && !inQ) || ((c === "\n" || c === "\r") && !inQ)) {
      row.push(cur);
      cur = "";
      if (c === "\n" || (c === "\r" && text[i + 1] !== "\n")) {
        if (row.some((cell) => cell.length)) rows.push(row);
        row = [];
      }
      continue;
    }
    cur += c;
  }
  if (cur.length || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows;
}

const rows = parseCsv(readFileSync(file, "utf8"));
const data = rows.slice(1).map((r) => ({
  id: Number(r[0]),
  sport_id: Number(r[1]),
  coach_name: (r[2] ?? "").trim(),
  title: (r[3] ?? "").trim(),
  email: (r[4] ?? "").trim(),
  phone: (r[5] ?? "").trim(),
}));

const nullEmail = (e) => !e || e.toUpperCase() === "NULL";

console.log("File:", file);
console.log("Total contacts:", data.length);
console.log("With email:", data.filter((r) => !nullEmail(r.email)).length);
console.log("No email:", data.filter((r) => nullEmail(r.email)).length);

const issues = {
  institutionNames: [],
  newsGarbage: [],
  sentry: [],
  httpsEmail: [],
  badPhone: [],
  initialsOnly: [],
  handleNames: [],
  sharedEmail: [],
  nonCoaching: [],
};

for (const r of data) {
  const name = r.coach_name;
  const email = r.email.toLowerCase();
  const title = r.title.toLowerCase();

  if (/\b(university|college|athletics)\b/i.test(name)) issues.institutionNames.push(r);
  if (/adds .+ to coaching|the .+ file|war and peace|program accolades/i.test(name)) {
    issues.newsGarbage.push(r);
  }
  if (email.includes("sentry.") || email.includes(".wmt.dev")) issues.sentry.push(r);
  if (/https?$/i.test(email) || /https?/i.test(email.replace(/@.*$/, ""))) {
    if (/https?/i.test(r.email)) issues.httpsEmail.push(r);
  }
  if (r.phone && (/^\(0\d{2}\)/.test(r.phone) || r.phone === "(000) 000-0000")) {
    issues.badPhone.push(r);
  }
  if (/^[A-Z]\.\s+[A-Z][a-z]+$/.test(name)) issues.initialsOnly.push(r);
  if (/^[a-z]+\d+$/i.test(name) || (name.split(/\s+/).length === 1 && /\d/.test(name))) {
    issues.handleNames.push(r);
  }
  if (
    title &&
    /communications|trainer|equipment|marketing|compliance|facilities|sports information/i.test(title) &&
    !/coach/i.test(title)
  ) {
    issues.nonCoaching.push(r);
  }
}

const byEmail = new Map();
for (const r of data.filter((x) => !nullEmail(x.email))) {
  const key = r.email.toLowerCase();
  if (!byEmail.has(key)) byEmail.set(key, []);
  byEmail.get(key).push(r);
}
for (const [email, list] of byEmail) {
  if (list.length > 1) issues.sharedEmail.push({ email, list });
}

function print(label, items, fmt) {
  console.log(`\n=== ${label} (${items.length}) ===`);
  for (const item of items) console.log(fmt(item));
}

print("Institution/org names remaining", issues.institutionNames, (r) =>
  `  id=${r.id} sport=${r.sport_id} "${r.coach_name}" email=${r.email}`,
);
print("News/garbage names", issues.newsGarbage, (r) =>
  `  id=${r.id} "${r.coach_name}" email=${r.email}`,
);
print("Sentry emails", issues.sentry, (r) => `  id=${r.id} "${r.coach_name}" ${r.email}`);
print("Emails with http/https", issues.httpsEmail, (r) =>
  `  id=${r.id} "${r.coach_name}" ${r.email}`,
);
print("Bad phones", issues.badPhone, (r) => `  id=${r.id} "${r.coach_name}" ${r.phone}`);
print("Initials-only names (from email guess)", issues.initialsOnly, (r) =>
  `  id=${r.id} sport=${r.sport_id} "${r.coach_name}" email=${r.email}`,
);
print("Handle-like names", issues.handleNames, (r) =>
  `  id=${r.id} "${r.coach_name}" email=${r.email}`,
);
print("Non-coaching titles", issues.nonCoaching, (r) =>
  `  id=${r.id} "${r.coach_name}" title=${r.title}`,
);

console.log(`\n=== Shared emails (${issues.sharedEmail.length}) ===`);
for (const { email, list } of issues.sharedEmail) {
  console.log(`  ${email} (${list.length})`);
  for (const r of list) console.log(`    id=${r.id} "${r.coach_name}"`);
}

// Odd names: single word, all caps, very long, etc.
const odd = data.filter((r) => {
  const n = r.coach_name;
  if (!n) return true;
  if (n === n.toUpperCase() && n.length > 3) return true;
  if (n.split(/\s+/).length === 1) return true;
  if (n.length > 40) return true;
  if (/[^a-zA-Z\s.'-]/.test(n)) return true;
  return false;
});
print("Other odd names", odd, (r) => `  id=${r.id} sport=${r.sport_id} "${r.coach_name}" email=${r.email}`);

// Hunter check
const hunter = data.filter((r) => /hunter/i.test(r.coach_name) || /hunter@/i.test(r.email));
print("Jon Hunter / UNT email check", hunter, (r) =>
  `  id=${r.id} "${r.coach_name}" email=${r.email}`,
);
