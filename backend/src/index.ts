import dotenv from "dotenv";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import schoolsRouter from "./routes/schools.js";
import { getPool } from "./db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../../.env") });

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const frontendDist = resolve(__dirname, "../../frontend/dist");

function resolvePort(): number {
  const fromEnv = Number(process.env.PORT);
  if (process.env.PORT && Number.isFinite(fromEnv) && fromEnv > 0) {
    return fromEnv;
  }
  return isProduction ? 80 : 3001;
}

const PORT = resolvePort();

app.use(cors());
app.use(express.json());

async function healthHandler(
  _req: express.Request,
  res: express.Response,
): Promise<void> {
  try {
    await getPool().query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(503).json({ status: "error", database: "disconnected" });
  }
}

app.get("/health", healthHandler);
app.get("/api/health", healthHandler);

app.use("/schools", schoolsRouter);
app.use("/api/schools", schoolsRouter);

if (isProduction && existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  app.get(/^(?!\/api\/).*/, (_req, res) => {
    res.sendFile(resolve(frontendDist, "index.html"));
  });
}

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

if (!isProduction) {
  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });
}

app.listen(PORT, () => {
  console.log(`RecruitConnect listening on http://localhost:${PORT}`);
  if (isProduction && existsSync(frontendDist)) {
    console.log(`Serving frontend from ${frontendDist}`);
  }
});
