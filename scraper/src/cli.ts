import "./env.js";
import { closeBrowser } from "./fetcher.js";
import { closePool, getSchoolByName, getAllSchools } from "./persist.js";
import { loadSeedSchools, findSeedSchool, scrapeAndPersist } from "./scraper.js";
import type { SeedSchool } from "./types.js";
import { logger } from "./logger.js";

interface CliArgs {
  school?: string;
  all: boolean;
  dryRun: boolean;
  state?: string;
  division?: string;
  concurrency: number;
}

interface BulkScrapeRow {
  school_name: string;
  success: boolean;
  contactCount: number;
  emailCount: number;
  error?: string;
}

function parseArgs(argv: string[]): CliArgs {
  let school: string | undefined;
  let all = false;
  let dryRun = false;
  let state: string | undefined;
  let division: string | undefined;
  let concurrency = 2;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case "--school":
        school = argv[++i];
        break;
      case "--all":
        all = true;
        break;
      case "--dry-run":
        dryRun = true;
        break;
      case "--state":
        state = argv[++i];
        break;
      case "--division":
        division = argv[++i];
        break;
      case "--concurrency": {
        const value = Number(argv[++i]);
        if (!Number.isInteger(value) || value < 1) {
          throw new Error("--concurrency must be a positive integer");
        }
        concurrency = value;
        break;
      }
      default:
        if (!arg.startsWith("-") && !school) {
          school = arg;
        }
        break;
    }
  }

  return { school, all, dryRun, state, division, concurrency };
}

function toSeedSchool(school: SeedSchool): SeedSchool {
  return {
    school_name: school.school_name,
    abbreviation: school.abbreviation,
    aliases: school.aliases,
    division: school.division,
    state: school.state,
    athletics_url: school.athletics_url,
  };
}

function filterSeedSchools(
  schools: SeedSchool[],
  filters: { state?: string; division?: string },
): SeedSchool[] {
  return schools.filter((school) => {
    if (filters.state && school.state.toUpperCase() !== filters.state.toUpperCase()) {
      return false;
    }
    if (filters.division && school.division.toUpperCase() !== filters.division.toUpperCase()) {
      return false;
    }
    return true;
  });
}

async function resolveSchoolList(filters: {
  state?: string;
  division?: string;
}): Promise<SeedSchool[]> {
  const dbSchools = await getAllSchools(filters);
  if (dbSchools.length > 0) {
    return dbSchools.map(toSeedSchool);
  }

  return filterSeedSchools(loadSeedSchools(), filters);
}

async function scrapeOneSchool(schoolName: string): Promise<void> {
  const seedSchools = loadSeedSchools();
  let school = findSeedSchool(seedSchools, schoolName);

  if (!school) {
    const dbSchool = await getSchoolByName(schoolName);
    if (dbSchool) {
      school = toSeedSchool(dbSchool);
    }
  }

  if (!school) {
    throw new Error(`School not found in seed or database: ${schoolName}`);
  }

  const result = await scrapeAndPersist(school);
  logger.info("Scrape complete", {
    school: result.school_name,
    staffPage: result.staff_page_url,
    contactsFound: result.contacts.length,
    withEmail: result.contacts.filter((contact) => contact.email).length,
  });
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  if (items.length === 0) return [];

  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (true) {
      const index = nextIndex++;
      if (index >= items.length) return;
      results[index] = await fn(items[index], index);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}

function formatFilterLabel(filters: { state?: string; division?: string }): string {
  const parts: string[] = [];
  if (filters.state) parts.push(filters.state.toUpperCase());
  if (filters.division) parts.push(filters.division.toUpperCase());
  return parts.length > 0 ? parts.join(" ") : "all";
}

async function scrapeAllSchools(options: {
  state?: string;
  division?: string;
  concurrency: number;
}): Promise<void> {
  const schools = await resolveSchoolList({
    state: options.state,
    division: options.division,
  });

  const label = formatFilterLabel(options);
  logger.info(`Starting bulk scrape of ${schools.length} ${label} schools`, {
    concurrency: options.concurrency,
  });

  const startedAt = Date.now();
  let completed = 0;

  const rows = await mapWithConcurrency(schools, options.concurrency, async (school, index) => {
    const position = index + 1;
    logger.info(`[${position}/${schools.length}] Scraping ${school.school_name}`);

    try {
      const result = await scrapeAndPersist(school);
      const emailCount = result.contacts.filter((contact) => contact.email).length;
      completed++;
      logger.info(`[${position}/${schools.length}] Done ${school.school_name}`, {
        contacts: result.contacts.length,
        withEmail: emailCount,
        completed,
      });
      return {
        school_name: school.school_name,
        success: true,
        contactCount: result.contacts.length,
        emailCount,
      } satisfies BulkScrapeRow;
    } catch (error) {
      completed++;
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`[${position}/${schools.length}] Failed ${school.school_name}`, {
        error: message,
        completed,
      });
      return {
        school_name: school.school_name,
        success: false,
        contactCount: 0,
        emailCount: 0,
        error: message,
      } satisfies BulkScrapeRow;
    }
  });

  const success = rows.filter((row) => row.success).length;
  const failed = rows.length - success;
  const totalContacts = rows.reduce((sum, row) => sum + row.contactCount, 0);
  const totalEmails = rows.reduce((sum, row) => sum + row.emailCount, 0);
  const elapsedMinutes = ((Date.now() - startedAt) / 60_000).toFixed(1);

  logger.info("Bulk scrape finished", {
    label,
    success,
    failed,
    total: rows.length,
    totalContacts,
    totalEmails,
    elapsedMinutes,
  });

  if (failed > 0) {
    const failedNames = rows
      .filter((row) => !row.success)
      .map((row) => row.school_name)
      .join(", ");
    logger.warn("Schools that failed", { schools: failedNames });
  }
}

function printUsage(): void {
  console.log(`
RecruitConnect Scraper

Usage:
  npm run scrape -- "Odessa College"
  npm run scrape -- --school "University of Alabama"
  npm run scrape:all
  npm run scrape:tx
  npm run scrape:tx-juco

Options:
  --school <name>       Scrape a single school by name
  --all                 Scrape all matching schools (DB first, then seed file)
  --state <code>        Filter bulk scrape by state (e.g. TX)
  --division <div>      Filter bulk scrape by division (D1, D2, D3, JUCO, NAIA)
  --concurrency <n>     Schools to scrape in parallel (default: 2)
  --dry-run             Parse only, do not persist (not yet implemented)

Examples:
  npm run scrape:all -- --concurrency 3
  npm run scrape:tx -- --division JUCO
  npm run scrape -- --all --state TX --division D1
`);
}

async function main(): Promise<void> {
  const { school, all, state, division, concurrency } = parseArgs(process.argv.slice(2));

  try {
    if (all) {
      await scrapeAllSchools({ state, division, concurrency });
    } else if (school) {
      await scrapeOneSchool(school);
    } else {
      printUsage();
      process.exit(1);
    }
  } finally {
    await closeBrowser();
    await closePool();
  }
}

main().catch((error) => {
  logger.error("Scraper failed", { error: error instanceof Error ? error.message : String(error) });
  process.exit(1);
});
