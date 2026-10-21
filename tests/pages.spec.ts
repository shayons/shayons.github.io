import { expect, test } from "@playwright/test";
import { groupByYear } from "@/lib/dates.mjs";
import { posts, talks } from "./support";

test.describe("/talks/", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/talks/");
  });

  test("lists every talk grouped by year, newest first", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Talks");
    await expect(page.locator(".talk")).toHaveCount(talks.length);
    await expect(page.locator("h2.year")).toHaveText(groupByYear(talks).map((g) => g.year));
  });

  test("credits co-presenters and labels links with their talk", async ({ page }) => {
    const row = page.locator(".talk", { hasText: "Rinisha Marar" });
    await expect(row).toHaveCount(1);
    await expect(row.getByRole("link", { name: /^Session page for Hybrid Search/ })).toHaveCount(1);
  });

  test("marks Talks as the current page in the nav", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByRole("link", { name: "Talks" })).toHaveAttribute("aria-current", "page");
  });
});

test.describe("/blog/", () => {
  test("lists every post grouped by year with https links", async ({ page }) => {
    await page.goto("/blog/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Writing");
    await expect(page.locator(".post")).toHaveCount(posts.length);
    const hrefs = await page
      .locator(".post a")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
    expect(hrefs.every((href) => href.startsWith("https://"))).toBe(true);
  });
});

test.describe("404", () => {
  test("explains and links home", async ({ page }) => {
    await page.goto("/404.html");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
    await expect(page.getByRole("link", { name: "Go to the home page" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});
