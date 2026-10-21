import { expect, test, type Locator, type Page } from "@playwright/test";

type Pose = { opacity: number; rise: number; ruleScale: number };

async function poseWithTopInView(target: Locator, pixelsIntoView: number): Promise<Pose> {
  return target.evaluate(async (element, offset) => {
    const rise = new DOMMatrix(getComputedStyle(element).transform).m42;
    const layoutTop = element.getBoundingClientRect().top - rise + window.scrollY;
    window.scrollTo({ top: layoutTop - window.innerHeight + offset, behavior: "instant" });
    for (let frame = 0; frame < 3; frame += 1) {
      await new Promise(requestAnimationFrame);
    }
    const style = getComputedStyle(element);
    return {
      opacity: Number(style.opacity),
      rise: new DOMMatrix(style.transform).m42,
      ruleScale: new DOMMatrix(getComputedStyle(element, "::before").transform).a,
    };
  }, pixelsIntoView);
}

async function unsettledAtPageEnd(page: Page, path: string): Promise<string[]> {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(path);
  return page.evaluate(async () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
    for (let frame = 0; frame < 3; frame += 1) {
      await new Promise(requestAnimationFrame);
    }
    return [...document.querySelectorAll("[data-reveal='scroll'], [data-rule]")]
      .filter((element) => {
        const style = getComputedStyle(element);
        const rule = new DOMMatrix(getComputedStyle(element, "::before").transform);
        return style.opacity !== "1" || !new DOMMatrix(style.transform).isIdentity || rule.a !== 1;
      })
      .map((element) => element.id || element.className);
  });
}

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
    .locator("#contact .stack")
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

test("every home section block eases in, including the work note and contact block", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#work > .note[data-reveal='scroll']")).toHaveCount(1);
  await expect(page.locator("#contact > .stack[data-reveal='scroll'] .socials")).toHaveCount(1);
});

test("default motion: reveals play out where the reader is looking", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const column = page.locator("#work article").first().locator(".who");
  expect((await poseWithTopInView(column, 40)).opacity).toBeLessThan(0.35);
  const midway = await poseWithTopInView(column, 110);
  expect(midway.opacity).toBeGreaterThan(0.3);
  expect(midway.opacity).toBeLessThan(0.7);
  expect(midway.rise).toBeGreaterThan(6);
  expect(await poseWithTopInView(column, 280)).toMatchObject({ opacity: 1, rise: 0 });
});

test("default motion: a section rule draws while its heading rises", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const heading = page.locator("#work .section-heading");
  expect((await poseWithTopInView(heading, 30)).ruleScale).toBeLessThan(0.05);
  const drawing = (await poseWithTopInView(heading, 150)).ruleScale;
  expect(drawing).toBeGreaterThan(0.25);
  expect(drawing).toBeLessThan(0.75);
  expect((await poseWithTopInView(heading, 300)).ruleScale).toBe(1);
});

test("default motion: the portrait settles as soon as the page scrolls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const image = page.locator(".hero figure img");
  const scaleAt = (scrollY: number) =>
    image.evaluate(async (element, top) => {
      window.scrollTo({ top, behavior: "instant" });
      for (let frame = 0; frame < 3; frame += 1) {
        await new Promise(requestAnimationFrame);
      }
      return new DOMMatrix(getComputedStyle(element).transform).a;
    }, scrollY);
  expect(await scaleAt(0)).toBeLessThan(1.005);
  expect(await scaleAt(300)).toBeGreaterThan(1.01);
});

for (const path of ["/", "/talks/", "/blog/"]) {
  test(`default motion: everything has settled at the end of ${path}`, async ({ page }) => {
    expect(await unsettledAtPageEnd(page, path)).toEqual([]);
  });
}

test.describe("phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const path of ["/", "/talks/", "/blog/"]) {
    test(`default motion: everything has settled at the end of ${path}`, async ({ page }) => {
      expect(await unsettledAtPageEnd(page, path)).toEqual([]);
    });
  }
});
