import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";

const template = new URL("./og-card.html", import.meta.url);
const output = fileURLToPath(new URL("../public/og.png", import.meta.url));

const browser = await chromium.launch({ args: ["--allow-file-access-from-files"] });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto(template.href);
  await page.evaluate(() => document.fonts.ready);
  const fontsLoaded = await page.evaluate(
    () => document.fonts.check('66px "Newsreader"') && document.fonts.check('26px "Inter Tight"'),
  );
  if (!fontsLoaded) {
    throw new Error("Card fonts did not load. Run npm install, then npm run og again.");
  }
  await page.screenshot({ path: output, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log(`wrote ${output}`);
} finally {
  await browser.close();
}
