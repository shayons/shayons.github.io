import { expect, test } from "@playwright/test";
import { newestFirst } from "@/lib/dates.mjs";
import { posts, talks } from "./support";

test.describe("home hero", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has the title, a single h1, and the hero copy", async ({ page }) => {
    await expect(page).toHaveTitle("Shayon Sanyal | PostgreSQL, Data & AI");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Agents, retrieval, evals and PostgreSQL.");
    await expect(page.locator(".hero .role")).toHaveText(
      "Agentic AI tech lead for databases at AWS",
    );
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
    expect(hrefs).toEqual(["/#work", "/talks/", "/blog/", "/#contact"]);
  });

  test("the skip link moves focus to the main content", async ({ page }) => {
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });

  test("the primary action responds to hover", async ({ page }) => {
    const action = page.locator(".hero .primary-link");
    const background = () => action.evaluate((element) => getComputedStyle(element).background);
    const idle = await background();
    await action.hover();
    await expect.poll(background).not.toBe(idle);
  });
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`hero headline and role leave no word alone on a last line at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const stranded = await page.evaluate(() =>
      [...document.querySelectorAll(".hero h1 span, .hero .role")]
        .filter((element) => {
          // Words share a line when their vertical centres sit within half a line of each
          // other. Comparing tops would split a line whose words mix roman and italic faces.
          const lineOfEachWord: number[] = [];
          let previousCentre = Number.NEGATIVE_INFINITY;
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
          for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            for (const word of (node.textContent ?? "").matchAll(/\S+/g)) {
              const range = document.createRange();
              range.setStart(node, word.index);
              range.setEnd(node, word.index + word[0].length);
              const box = range.getBoundingClientRect();
              const centre = box.top + box.height / 2;
              const line = lineOfEachWord.at(-1) ?? 0;
              const startsLine = Math.abs(centre - previousCentre) > box.height / 2;
              lineOfEachWord.push(startsLine ? line + 1 : line);
              previousCentre = centre;
            }
          }
          const lastLine = lineOfEachWord.at(-1);
          const wordsOnLastLine = lineOfEachWord.filter((line) => line === lastLine).length;
          return (lastLine ?? 0) > 1 && wordsOnLastLine === 1;
        })
        .map((element) => element.textContent?.trim()),
    );
    expect(stranded).toEqual([]);
  });
}

test.describe("selected work", () => {
  test("lists five engagements in order with the three-part structure", async ({ page }) => {
    await page.goto("/");
    const studies = page.locator("#work article");
    await expect(studies).toHaveCount(5);
    await expect(studies.first().locator(".industry")).toHaveText("Global media company");
    await expect(studies.last().locator(".industry")).toHaveText("Global bank");
    for (const term of ["Challenge", "What I did", "Result"]) {
      await expect(page.locator("#work dt", { hasText: term })).toHaveCount(5);
    }
  });

  test("a card opens to show its full story and closes again", async ({ page }) => {
    await page.goto("/");
    const card = page.locator("#work article").first();
    const challenge = card.locator("dd").first();
    await expect(challenge).toBeHidden();
    await card.locator("summary").click();
    await expect(challenge).toBeVisible();
    await card.locator("summary").click();
    await expect(challenge).toBeHidden();
  });

  test("names no customers and links nowhere", async ({ page }) => {
    await page.goto("/");
    const text = await page.locator("#work").innerText();
    expect(text).not.toMatch(/\b(Netflix|Ring)\b/);
    await expect(page.locator("#work a")).toHaveCount(0);
  });
});

test.describe("on stage", () => {
  test("shows the five newest sessions and links to all of them", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#on-stage .talk h3")).toHaveText(
      newestFirst(talks)
        .slice(0, 5)
        .map((talk) => talk.title),
    );
    const all = page
      .locator("#on-stage")
      .getByRole("link", { name: `All ${talks.length} sessions` });
    await expect(all).toHaveAttribute("href", "/talks/");
  });
});

test.describe("writing, builds, and contact", () => {
  test("shows the four newest posts", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#writing .post .title")).toHaveText(
      newestFirst(posts)
        .slice(0, 4)
        .map((post) => post.title),
    );
  });

  test("lists YADA first and unlinked, then the public repositories", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#writing .builds .name")).toHaveText([
      "YADA",
      "Pellier",
      "Mosaic",
      "Meridian",
    ]);
    await expect(page.locator("#writing .builds span.name")).toHaveText(["YADA"]);
  });

  test("offers three contact links", async ({ page }) => {
    await page.goto("/");
    const hrefs = await page
      .locator("#contact .socials a")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    expect(hrefs).toEqual([
      "https://www.linkedin.com/in/shayonsanyal/",
      "https://github.com/shayons",
      "https://x.com/shayon23",
    ]);
  });
});
