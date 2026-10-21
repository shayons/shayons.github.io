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

for (const width of [768, 1024]) {
  test(`results and session links stay with their descriptions at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    for (const [description, supporting] of [
      [".study .body", ".study .metrics"],
      [".talk .what", ".talk .how"],
    ]) {
      const main = await page.locator(description).first().boundingBox();
      const details = await page.locator(supporting).first().boundingBox();
      expect(main).not.toBeNull();
      expect(details).not.toBeNull();
      expect(Math.abs(main!.x - details!.x)).toBeLessThanOrEqual(1);
    }
  });

  test(`the four approach steps form two balanced rows at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const tops = await page
      .locator("#approach .steps li")
      .evaluateAll((items) => items.map((item) => Math.round(item.getBoundingClientRect().top)));
    expect(tops[0]).toBe(tops[1]);
    expect(tops[2]).toBe(tops[3]);
    expect(tops[2]).toBeGreaterThan(tops[0]);
  });
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
