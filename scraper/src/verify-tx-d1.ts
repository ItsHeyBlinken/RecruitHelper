import { closeBrowser } from "./fetcher.js";
import { loadSeedSchools, scrapeSchool } from "./scraper.js";

const DOC_D1_URLS: Record<string, string> = {
  "Abilene Christian University": "https://acusports.com",
  "Baylor University": "https://baylorbears.com",
  "Houston Christian University": "https://hcuhuskies.com",
  "Lamar University": "https://lamarcardinals.com",
  "Prairie View A&M University": "https://pvpanthers.com",
  "Sam Houston State University": "https://gobearkats.com",
  "Stephen F. Austin State University": "https://sfajacks.com",
  "Tarleton State University": "https://tarletonsports.com",
  "Texas A&M University": "https://12thman.com",
  "Texas A&M University-Commerce": "https://lionathletics.com",
  "Texas A&M University-Corpus Christi": "https://goislanders.com",
  "Texas Southern University": "https://tsusports.com",
  "Texas State University": "https://txst.com",
  "Texas Tech University": "https://texastech.com",
  "University of Houston": "https://uhcougars.com",
  "University of North Texas": "https://meangreensports.com",
  "University of Texas at Arlington": "https://utamavs.com",
  "University of Texas at Austin": "https://texassports.com",
  "University of Texas at El Paso": "https://utepminers.com",
  "University of Texas at San Antonio": "https://goutsa.com",
  "University of the Incarnate Word": "https://uiwcardinals.com",
};

interface VerifyRow {
  school: string;
  docUrl: string;
  seedUrl: string;
  urlMatch: boolean;
  homepageOk: boolean;
  staffPageUrl: string | null;
  contacts: number;
  emails: number;
  coachNames: string[];
  status: "PASS" | "WARN" | "FAIL";
  notes: string;
}

async function verifySchool(
  name: string,
  docUrl: string,
  seedUrl: string,
): Promise<VerifyRow> {
  const row: VerifyRow = {
    school: name,
    docUrl,
    seedUrl,
    urlMatch: docUrl.replace(/\/$/, "") === seedUrl.replace(/\/$/, ""),
    homepageOk: false,
    staffPageUrl: null,
    contacts: 0,
    emails: 0,
    coachNames: [],
    status: "FAIL",
    notes: "",
  };

  if (!row.urlMatch) {
    row.notes = "Doc URL differs from seed URL";
    return row;
  }

  try {
    const result = await scrapeSchool({
      school_name: name,
      division: "D1",
      state: "TX",
      athletics_url: docUrl,
    });

    row.homepageOk = true;
    row.staffPageUrl = result.staff_page_url;
    row.contacts = result.contacts.length;
    row.emails = result.contacts.filter((c) => c.email).length;
    row.coachNames = result.contacts.map((c) => c.name).filter(Boolean).slice(0, 5);

    if (row.contacts === 0) {
      row.status = "FAIL";
      row.notes = "No softball coaches found on site";
    } else if (row.emails === 0) {
      row.status = "WARN";
      row.notes = "Coaches found but no emails published";
    } else if (row.emails < row.contacts) {
      row.status = "WARN";
      row.notes = `Partial emails (${row.emails}/${row.contacts})`;
    } else {
      row.status = "PASS";
      row.notes = "Softball coaches with emails found";
    }
  } catch (error) {
    row.notes = error instanceof Error ? error.message : String(error);
  }

  return row;
}

async function main(): Promise<void> {
  const seedSchools = loadSeedSchools().filter(
    (s) => s.state === "TX" && s.division === "D1",
  );

  const SEED_NAME_ALIASES: Record<string, string> = {
    "University of Texas at Austin": "University of Texas",
  };

  const docNames = Object.keys(DOC_D1_URLS);
  const seedNames = seedSchools.map((s) => s.school_name);
  const missingInSeed = docNames.filter(
    (n) => !seedNames.includes(n) && !seedNames.includes(SEED_NAME_ALIASES[n] ?? n),
  );
  const extraInSeed = seedNames.filter(
    (n) => !docNames.includes(n) && !Object.values(SEED_NAME_ALIASES).includes(n),
  );

  if (missingInSeed.length > 0 || extraInSeed.length > 0) {
    console.log("DOC/SEED MISMATCH:");
    if (missingInSeed.length) console.log("  Missing in seed:", missingInSeed.join(", "));
    if (extraInSeed.length) console.log("  Extra in seed:", extraInSeed.join(", "));
  }

  const results: VerifyRow[] = [];
  for (const name of docNames) {
    const seedName = SEED_NAME_ALIASES[name] ?? name;
    const seed = seedSchools.find((s) => s.school_name === seedName);
    const docUrl = DOC_D1_URLS[name];
    const seedUrl = seed?.athletics_url ?? "(not in seed)";
    console.error(`Verifying: ${name}...`);
    results.push(await verifySchool(name, docUrl, seedUrl));
  }

  console.log("\n=== TEXAS D1 URL VERIFICATION ===\n");
  for (const r of results) {
    const icon = r.status === "PASS" ? "✓" : r.status === "WARN" ? "!" : "✗";
    console.log(`${icon} ${r.status} | ${r.school}`);
    console.log(`    URL: ${r.docUrl}`);
    if (r.staffPageUrl) console.log(`    Staff page: ${r.staffPageUrl}`);
    console.log(`    Coaches: ${r.contacts} | Emails: ${r.emails}`);
    if (r.coachNames.length) console.log(`    Names: ${r.coachNames.join(", ")}`);
    if (r.notes) console.log(`    Notes: ${r.notes}`);
    console.log();
  }

  const pass = results.filter((r) => r.status === "PASS").length;
  const warn = results.filter((r) => r.status === "WARN").length;
  const fail = results.filter((r) => r.status === "FAIL").length;
  console.log(`SUMMARY: ${pass} PASS, ${warn} WARN, ${fail} FAIL out of ${results.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => closeBrowser());
