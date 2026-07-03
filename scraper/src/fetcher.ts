import * as cheerio from "cheerio";
import { chromium, type Browser } from "playwright";
import { logger } from "./logger.js";

let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browserInstance) {
    browserInstance = await chromium.launch({ headless: true });
  }
  return browserInstance;
}

export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

export async function fetchHtml(url: string, usePlaywright = false): Promise<string> {
  if (!usePlaywright) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "RecruitConnect-Scraper/0.1 (+https://github.com/recruitconnect; educational)",
          Accept: "text/html,application/xhtml+xml",
        },
        signal: AbortSignal.timeout(30_000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${url}`);
      }

      const html = await response.text();
      if (html.length < 500) {
        logger.warn("Response suspiciously short, retrying with Playwright", { url });
        return fetchHtml(url, true);
      }

      return html;
    } catch (error) {
      logger.warn("Static fetch failed, falling back to Playwright", {
        url,
        error: error instanceof Error ? error.message : String(error),
      });
      return fetchHtml(url, true);
    }
  }

  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await page.waitForTimeout(2_000);
    return await page.content();
  } finally {
    await page.close();
  }
}

export function loadCheerio(html: string): cheerio.CheerioAPI {
  return cheerio.load(html);
}

export function resolveUrl(baseUrl: string, href: string): string {
  try {
    return new URL(href, baseUrl).href;
  } catch {
    return href;
  }
}
