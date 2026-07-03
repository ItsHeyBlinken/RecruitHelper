import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export const TEXAS_DIR = resolve(root, "docs/texas");
export const TEXAS_ATHLETIC_WEBSITES_MD = resolve(TEXAS_DIR, "athletic-websites.md");
export const TEXAS_VERIFICATION_MASTER_MD = resolve(TEXAS_DIR, "verification-master.md");
export const TEXAS_URL_CHECKLIST_HTML = resolve(TEXAS_DIR, "url-checklist.html");
export const TEXAS_RESULTS_DIR = resolve(TEXAS_DIR, "results");
