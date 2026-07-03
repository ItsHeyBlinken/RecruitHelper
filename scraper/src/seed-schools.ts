import "./env.js";
import { loadSeedSchools } from "./scraper.js";
import { upsertSchool, closePool } from "./persist.js";
import { logger } from "./logger.js";

async function main(): Promise<void> {
  const schools = loadSeedSchools();
  let count = 0;

  for (const school of schools) {
    await upsertSchool(school);
    count++;
  }

  logger.info(`Seeded ${count} schools from seed/schools.json`);
}

main()
  .catch((error) => {
    logger.error("Seed failed", { error: error instanceof Error ? error.message : String(error) });
    process.exit(1);
  })
  .finally(() => closePool());
