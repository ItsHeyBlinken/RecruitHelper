import dotenv from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import schoolsRouter from "./routes/schools.js";
import { getPool } from "./db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../../.env") });

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await getPool().query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(503).json({ status: "error", database: "disconnected" });
  }
});

app.use("/schools", schoolsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`RecruitConnect API listening on http://localhost:${PORT}`);
});
