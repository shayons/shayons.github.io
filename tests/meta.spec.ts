import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

function pngSize(file: URL) {
  const bytes = readFileSync(file);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

test("the home page declares canonical, Open Graph, and card metadata", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://shayons.github.io/",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://shayons.github.io/og.png",
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
});

test("the social card is served and is 1200 by 630", async ({ request }) => {
  expect((await request.get("/og.png")).status()).toBe(200);
  expect(pngSize(new URL("../public/og.png", import.meta.url))).toEqual({
    width: 1200,
    height: 630,
  });
});

test("the sitemap lists the three pages and not the 404", async ({ request }) => {
  const xml = await (await request.get("/sitemap-0.xml")).text();
  for (const loc of [
    "https://shayons.github.io/",
    "https://shayons.github.io/talks/",
    "https://shayons.github.io/blog/",
  ]) {
    expect(xml).toContain(`<loc>${loc}</loc>`);
  }
  expect(xml).not.toContain("404");
});

function icoSizes(file: URL) {
  const bytes = readFileSync(file);
  const count = bytes.readUInt16LE(4);
  return Array.from({ length: count }, (_, index) => bytes[6 + index * 16] || 256);
}

test("the head declares the SVG, ICO, and Apple touch icons", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute(
    "href",
    "/favicon.svg",
  );
  await expect(page.locator('link[rel="icon"][sizes="32x32"]')).toHaveAttribute(
    "href",
    "/favicon.ico",
  );
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
    "href",
    "/apple-touch-icon.png",
  );
});

test("every icon is served, at the sizes browsers and iOS expect", async ({ request }) => {
  for (const path of ["/favicon.svg", "/favicon.ico", "/apple-touch-icon.png"]) {
    expect((await request.get(path)).status(), path).toBe(200);
  }
  expect(pngSize(new URL("../public/apple-touch-icon.png", import.meta.url))).toEqual({
    width: 180,
    height: 180,
  });
  expect(icoSizes(new URL("../public/favicon.ico", import.meta.url))).toEqual([16, 32, 48]);
});
