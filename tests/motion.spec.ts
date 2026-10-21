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
    .evaluate((element) => element.getAnimations({ subtree: true }).length);
  expect(row).toBeGreaterThan(0);
});

test("default motion: section rules draw in and row parts arrive staggered", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const ruleAnimations = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter(
          (animation) =>
            animation.effect instanceof KeyframeEffect &&
            animation.effect.pseudoElement === "::before",
        ).length,
  );
  expect(ruleAnimations).toBeGreaterThan(0);
  const steps = await page
    .locator("#work article")
    .first()
    .locator("[data-reveal]")
    .evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element).getPropertyValue("--reveal-step").trim()),
    );
  expect(steps).toEqual(["0", "1", "2"]);
});

test("default motion: the portrait is visible on load and zooms only on scroll", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const figure = page.locator(".hero figure");
  expect(await figure.evaluate((element) => element.getAnimations().length)).toBe(0);
  expect(await figure.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
  expect(
    await figure.locator("img").evaluate((element) => element.getAnimations().length),
  ).toBeGreaterThan(0);
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

test("in-page navigation scrolls smoothly, except for reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const html = page.locator("html");
  expect(await html.evaluate((element) => getComputedStyle(element).scrollBehavior)).toBe("smooth");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await html.evaluate((element) => getComputedStyle(element).scrollBehavior)).toBe("auto");
});

test("every home section block eases in, including the work note and contact links", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#work > .note[data-reveal='scroll']")).toHaveCount(1);
  await expect(page.locator("#contact .socials[data-reveal='scroll']")).toHaveCount(1);
});
