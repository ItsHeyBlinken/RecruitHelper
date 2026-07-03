import dotenv from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../../.env") });

export interface School {
  id: number;
  school_name: string;
  division: string;
  state: string;
  athletics_url: string;
  created_at: Date;
  updated_at: Date;
}

export interface Sport {
  id: number;
  school_id: number;
  sport_name: string;
}

export interface Contact {
  id: number;
  sport_id: number;
  coach_name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  updated_at: Date;
}

export interface SeedSchool {
  school_name: string;
  abbreviation?: string | null;
  aliases?: string[];
  division: string;
  state: string;
  athletics_url: string;
}

export interface ScrapedContact {
  coach_name: string;
  title: string | null;
  email: string | null;
  phone: string | null;
}

export interface ScrapeResult {
  school_name: string;
  contacts: ScrapedContact[];
  staff_page_url: string;
}
