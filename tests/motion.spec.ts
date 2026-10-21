import { expect, test } from "@playwright/test";

test("reduced motion: nothing animates and everything is visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  const opacity = await page
    .locator("#work article")
    .last()
    .evaluate((element) => getComputedStyle(element).opacity);
  expect(opacity).toBe("1");
});

test("default motion: the hero animates on load and rows animate on scroll", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const hero = await page.locator(".hero h1").evaluate((element) => element.getAnimations().length);
  expect(hero).toBeGreaterThan(0);
  const row = await page
    .locator("#work article")
    .first()
    .evaluate((element) => element.getAnimations().length);
  expect(row).toBeGreaterThan(0);
});

test("print: nothing animates and below-the-fold content is visible", async ({ page }) => {
  await page.emulateMedia({ media: "print", reducedMotion: "no-preference" });
  await page.goto("/");
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  const opacity = await page
    .locator("#contact h2")
    .evaluate((element) => getComputedStyle(element).opacity);
  expect(opacity).toBe("1");
});
