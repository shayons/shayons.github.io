import { expect, test, type Page } from "@playwright/test";

const DARK = "rgb(24, 24, 27)";
const LIGHT = "rgb(255, 255, 255)";

function background(page: Page) {
  return page.locator("body").evaluate((element) => getComputedStyle(element).backgroundColor);
}

test("automatic theme follows system changes", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect.poll(() => background(page)).toBe(DARK);
  await expect(page.getByRole("combobox", { name: "Color theme" })).toHaveValue("system");
  await page.emulateMedia({ colorScheme: "light" });
  await expect.poll(() => background(page)).toBe(LIGHT);
});

test("a chosen theme persists through navigation and reloads", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.getByRole("combobox", { name: "Color theme" }).selectOption("dark");
  await expect.poll(() => background(page)).toBe(DARK);
  for (const path of ["/talks/", "/blog/", "/404.html", "/"]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(await background(page)).toBe(DARK);
    await expect(page.getByRole("combobox", { name: "Color theme" })).toHaveValue("dark");
  }
  await page.reload();
  expect(await background(page)).toBe(DARK);
});

test("light overrides a dark system setting, and Auto restores it", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const picker = page.getByRole("combobox", { name: "Color theme" });
  await picker.selectOption("light");
  await expect.poll(() => background(page)).toBe(LIGHT);
  await picker.selectOption("system");
  await expect.poll(() => background(page)).toBe(DARK);
  expect(await page.evaluate(() => localStorage.getItem("color-theme"))).toBeNull();
});

test("a saved preference is applied before the first rendered frame", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.addInitScript(() => {
    localStorage.setItem("color-theme", "dark");
    requestAnimationFrame(() => {
      document.documentElement.setAttribute(
        "data-first-frame-scheme",
        getComputedStyle(document.documentElement).colorScheme,
      );
    });
  });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-first-frame-scheme", "dark");
  expect(await background(page)).toBe(DARK);
  const colors = await page
    .locator('meta[name="theme-color"]')
    .evaluateAll((elements) => elements.map((element) => element.getAttribute("content")));
  expect(colors.every((color) => color === "#18181b")).toBe(true);
});

test("blocked preference storage does not break the theme switch", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Storage is blocked", "SecurityError");
      },
    });
  });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("combobox", { name: "Color theme" }).selectOption("dark");
  await expect.poll(() => background(page)).toBe(DARK);
  expect(errors).toEqual([]);
});

test("invalid saved preferences fall back to the system theme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => localStorage.setItem("color-theme", "unknown"));
  await page.goto("/");
  await expect.poll(() => background(page)).toBe(DARK);
  await expect(page.getByRole("combobox", { name: "Color theme" })).toHaveValue("system");
});

test("theme changes stay in sync between tabs", async ({ page, context }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const other = await context.newPage();
  await other.goto("/talks/");
  await page.getByRole("combobox", { name: "Color theme" }).selectOption("dark");
  await expect.poll(() => background(other)).toBe(DARK);
  await expect(other.getByRole("combobox", { name: "Color theme" })).toHaveValue("dark");
  await page.getByRole("combobox", { name: "Color theme" }).selectOption("light");
  await expect.poll(() => background(other)).toBe(LIGHT);
});

test("dark mode remains automatic without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    colorScheme: "dark",
    reducedMotion: "reduce",
  });
  try {
    const page = await context.newPage();
    await page.goto("http://localhost:4321/");
    expect(await background(page)).toBe(DARK);
    await expect(page.getByRole("combobox", { name: "Color theme" })).toBeHidden();
    await expect(page.locator("h1")).toHaveText("PostgreSQL at scale. AI in production.");
    await page.getByRole("link", { name: "Talks", exact: true }).click();
    expect(await background(page)).toBe(DARK);
  } finally {
    await context.close();
  }
});

test("printing a dark page uses the light palette", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await page.getByRole("combobox", { name: "Color theme" }).selectOption("dark");
  await page.emulateMedia({ media: "print" });
  expect(await background(page)).toBe(LIGHT);
  await expect(page.getByRole("combobox", { name: "Color theme" })).toBeHidden();
});

test("the theme picker is keyboard accessible and fits on a small phone", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  const picker = page.getByRole("combobox", { name: "Color theme" });
  await picker.focus();
  await expect(picker).toBeFocused();
  const box = await picker.boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

test("the theme control keeps navigation on one row on a standard phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const rows = await page
    .locator('nav[aria-label="Primary"] a')
    .evaluateAll((links) => links.map((link) => Math.round(link.getBoundingClientRect().top)));
  expect(new Set(rows).size).toBe(1);
});
