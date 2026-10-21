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

test("robots.txt allows crawling and points at the sitemap", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain("User-agent: *");
  expect(body).toContain("Sitemap: https://shayons.github.io/sitemap-index.xml");
});

test("the 404 page is not indexed and declares no canonical", async ({ page }) => {
  await page.goto("/404.html");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await page.goto("/");
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
});

test("the headline font is preloaded and is the same file the CSS uses", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const preload = page.locator('link[rel="preload"][as="font"]');
  await expect(preload).toHaveCount(1);
  await expect(preload).toHaveAttribute("type", "font/woff2");
  await expect(preload).toHaveAttribute("crossorigin", "");
  const href = (await preload.getAttribute("href")) ?? "";
  expect(href).toMatch(/newsreader-latin-opsz-normal\.[\w-]+\.woff2$/);
  const cssHrefs = await page
    .locator('link[rel="stylesheet"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
  const inlineCss = await page.locator("style").allTextContents();
  const css = [
    ...inlineCss,
    ...(await Promise.all(cssHrefs.map(async (cssHref) => (await request.get(cssHref)).text()))),
  ].join("\n");
  expect(css).toContain(href);
});
