import { expect, test, type Page } from "@playwright/test";

// Reading must not depend on experimental scroll-animation support or on the
// visitor passing through a trigger range. Check the entire ancestor chain.
async function hiddenReadingContent(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    [...document.querySelectorAll("h1, h2, h3, .metrics, .post .title, .build, #contact .stack")]
      .filter((element) => {
        for (let node: Element | null = element; node; node = node.parentElement) {
          const style = getComputedStyle(node);
          if (Number(style.opacity) < 1 || style.visibility === "hidden") return true;
        }
        return false;
      })
      .map((element) => element.id || element.textContent?.trim().slice(0, 60) || element.tagName),
  );
}

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  test.describe(`reading at ${viewport.width}px`, () => {
    test.use({ viewport });
    for (const path of ["/", "/talks/", "/blog/"]) {
      test(`${path} is readable immediately and after jumping to the bottom`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "no-preference" });
        await page.goto(path);
        expect(await hiddenReadingContent(page)).toEqual([]);
        await page.keyboard.press("End");
        expect(await hiddenReadingContent(page)).toEqual([]);
        await page.keyboard.press("Home");
        expect(await hiddenReadingContent(page)).toEqual([]);
      });
    }
    test("a direct contact link and restored scroll never leave earlier content hidden", async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto("/#contact");
      await expect(page.locator("#contact")).toBeInViewport();
      expect(await hiddenReadingContent(page)).toEqual([]);
      await page.reload();
      expect(await hiddenReadingContent(page)).toEqual([]);
    });
  });
}

test("reduced motion disables the entrance and smooth scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  expect(await hiddenReadingContent(page)).toEqual([]);
  expect(
    await page.locator("html").evaluate((element) => getComputedStyle(element).scrollBehavior),
  ).toBe("auto");
});

test("print remains static and readable", async ({ page }) => {
  await page.emulateMedia({ media: "print", reducedMotion: "no-preference" });
  await page.goto("/");
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  expect(await hiddenReadingContent(page)).toEqual([]);
});

test("all reading content remains visible with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("http://localhost:4321/#contact");
    expect(await hiddenReadingContent(page)).toEqual([]);
    await page.locator("#work summary").first().click();
    await expect(page.locator("#work dd").first()).toBeVisible();
  } finally {
    await context.close();
  }
});
