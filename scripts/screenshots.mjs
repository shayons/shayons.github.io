import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE_URL ?? "http://localhost:4321";
const PAGES = { home: "/", talks: "/talks/", blog: "/blog/", "not-found": "/404.html" };
const WIDTHS = [390, 1440];
const OUT = ".local/screenshots";

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
try {
  for (const width of WIDTHS) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    for (const [name, path] of Object.entries(PAGES)) {
      await page.goto(`${BASE}${path}`);
      await page.screenshot({ path: `${OUT}/${name}-${width}.png`, fullPage: true });
      console.log(`${OUT}/${name}-${width}.png`);
    }
    await page.close();
  }
} finally {
  await browser.close();
}
