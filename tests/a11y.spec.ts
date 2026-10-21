import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { PAGES } from "./support";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

for (const path of PAGES) {
  for (const width of [390, 1440]) {
    test(`${path} at ${width}px has no axe violations`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      const violations = results.violations.map(
        (v) => `${v.id}: ${v.nodes.map((node) => node.target.join(" ")).join(", ")}`,
      );
      expect(violations).toEqual([]);
    });
  }
}
