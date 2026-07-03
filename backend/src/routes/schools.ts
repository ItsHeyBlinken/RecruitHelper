import { Router, type Request, type Response } from "express";
import { getPool } from "../db.js";
import type { School, Contact } from "../types.js";
import { parseDivisionParam } from "../divisions.js";
import { SCHOOL_SELECT_COLUMNS } from "../school-columns.js";
import { SCHOOL_SEARCH_MATCH, SCHOOL_SEARCH_RANK } from "../school-search.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const division = parseDivisionParam(req.query.division);
  const state =
    typeof req.query.state === "string" && /^[A-Za-z]{2}$/.test(req.query.state.trim())
      ? req.query.state.trim().toUpperCase()
      : null;

  try {
    const conditions: string[] = [];
    const params: string[] = [];

    if (division) {
      params.push(division);
      conditions.push(`division = $${params.length}`);
    }

    if (state) {
      params.push(state);
      conditions.push(`state = $${params.length}`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await getPool().query<School>(
      `SELECT ${SCHOOL_SELECT_COLUMNS}
       FROM schools
       ${where}
       ORDER BY school_name`,
      params,
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch schools" });
  }
});

router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const result = await getPool().query<{ division: string; count: string; state: string }>(
      `SELECT division, state, COUNT(*)::int AS count
       FROM schools
       GROUP BY division, state
       ORDER BY division, state`,
    );

    const byDivision: Record<string, number> = {};
    const texasByDivision: Record<string, number> = {};
    let total = 0;
    let texasTotal = 0;

    for (const row of result.rows) {
      const count = Number(row.count);
      byDivision[row.division] = (byDivision[row.division] ?? 0) + count;
      total += count;

      if (row.state === "TX") {
        texasByDivision[row.division] = (texasByDivision[row.division] ?? 0) + count;
        texasTotal += count;
      }
    }

    res.json({ total, byDivision, texasTotal, texasByDivision });
  } catch {
    res.status(500).json({ error: "Failed to fetch school stats" });
  }
});

router.get("/search", async (req: Request, res: Response) => {
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const division = parseDivisionParam(req.query.division);

  if (!q && !division) {
    res.status(400).json({ error: "Query parameter 'q' or 'division' is required" });
    return;
  }

  if (division && !q) {
    res.status(400).json({
      error: "School name search is required. Division filter applies alongside a name search.",
    });
    return;
  }

  try {
    const pattern = `%${q}%`;
    const conditions = [`(${SCHOOL_SEARCH_MATCH})`];
    const params: string[] = [pattern];

    if (division) {
      params.push(division);
      conditions.push(`division = $${params.length}`);
    }

    const result = await getPool().query<School>(
      `SELECT ${SCHOOL_SELECT_COLUMNS}
       FROM schools
       WHERE ${conditions.join(" AND ")}
       ORDER BY ${SCHOOL_SEARCH_RANK}, school_name
       LIMIT 50`,
      [...params, q],
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Failed to search schools" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid school id" });
    return;
  }

  try {
    const result = await getPool().query<School>(
      `SELECT ${SCHOOL_SELECT_COLUMNS}
       FROM schools
       WHERE id = $1`,
      [id],
    );

    const school = result.rows[0];
    if (!school) {
      res.status(404).json({ error: "School not found" });
      return;
    }

    res.json(school);
  } catch {
    res.status(500).json({ error: "Failed to fetch school" });
  }
});

router.get("/:id/contacts", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid school id" });
    return;
  }

  try {
    const result = await getPool().query<Contact>(
      `SELECT c.id, c.sport_id, c.coach_name, c.title, c.email, c.phone, c.updated_at
       FROM contacts c
       JOIN sports s ON s.id = c.sport_id
       WHERE s.school_id = $1 AND s.sport_name = 'softball'
       ORDER BY c.coach_name`,
      [id],
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

export default router;
