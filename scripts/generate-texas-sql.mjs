import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const schools = JSON.parse(
  fs.readFileSync(path.join(root, "seed/schools.json"), "utf8"),
);

const tx = schools.filter((s) => s.state === "TX");
const esc = (v) => v.replace(/'/g, "''");

const values = tx
  .map((s) => {
    const aliases =
      "ARRAY[" + s.aliases.map((a) => `'${esc(a)}'`).join(", ") + "]";
    return `    ('${esc(s.school_name)}', '${esc(s.abbreviation)}', ${aliases}, '${s.division}', 'TX', '${esc(s.athletics_url)}')`;
  })
  .join(",\n");

const sql = `-- Add / update Texas softball programs (keeps all existing out-of-state schools)
-- Safe to re-run. Run npm run seed after applying.

ALTER TABLE schools ADD COLUMN IF NOT EXISTS abbreviation VARCHAR(20);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS aliases TEXT[] NOT NULL DEFAULT '{}';

INSERT INTO schools (school_name, abbreviation, aliases, division, state, athletics_url) VALUES
${values}
ON CONFLICT (school_name) DO UPDATE SET
    abbreviation = EXCLUDED.abbreviation,
    aliases = EXCLUDED.aliases,
    division = EXCLUDED.division,
    state = EXCLUDED.state,
    athletics_url = EXCLUDED.athletics_url,
    updated_at = NOW();
`;

fs.writeFileSync(path.join(root, "db/009_add_texas_schools.sql"), sql);
console.log(`Wrote ${tx.length} Texas schools to db/009_add_texas_schools.sql`);
