import { expect, test } from "@playwright/test";

test.describe("home hero", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has the title, a single h1, and the hero copy", async ({ page }) => {
    await expect(page).toHaveTitle("Shayon Sanyal | Applied AI architect");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(
      "I help enterprises take AI from proof of value to production.",
    );
    await expect(page.getByText("Applied AI architect in New York")).toBeVisible();
  });

  test("shows the portrait with alt text and modern formats", async ({ page }) => {
    const picture = page.locator(".hero picture");
    await expect(picture.locator('source[type="image/avif"]')).toHaveCount(1);
    await expect(picture.locator("img")).toHaveAttribute("alt", "Portrait of Shayon Sanyal");
  });

  test("primary nav links use trailing slashes", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Primary" });
    const hrefs = await nav
      .getByRole("link")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    expect(hrefs).toEqual(["/#work", "/#approach", "/talks/", "/blog/", "/#contact"]);
  });

  test("the skip link moves focus to the main content", async ({ page }) => {
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });
});
