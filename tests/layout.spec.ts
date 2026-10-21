import { expect, test } from "@playwright/test";
import { PAGES, WIDTHS } from "./support";

for (const path of PAGES) {
  for (const width of WIDTHS) {
    test(`${path} has no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
}

test("nav, hero, and contact links are at least 44px tall on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/");
  const selector =
    '.wordmark, nav[aria-label="Primary"] a, .hero .links a, #contact .socials a, #writing .builds a.name';
  const heights = await page
    .locator(selector)
    .evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().height));
  expect(heights).toHaveLength(14);
  for (const height of heights) expect(height).toBeGreaterThanOrEqual(44);
});
