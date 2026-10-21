import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const SOURCE = new URL("../public/favicon.svg", import.meta.url);
const ICO_SIZES = [16, 32, 48];
const APPLE_SIZE = 180;
const APPLE_BACKGROUND = "#8a1c2b";

const output = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url));

async function render(page, svgDataUrl, size, background) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<body style="margin:0;background:${background ?? "transparent"}">` +
      `<img src="${svgDataUrl}" width="${size}" height="${size}" style="display:block"></body>`,
  );
  await page.locator("img").evaluate((img) => img.decode());
  return page.screenshot({
    omitBackground: !background,
    clip: { x: 0, y: 0, width: size, height: size },
  });
}

function packIco(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, index) => {
    const entry = 6 + index * 16;
    header.writeUInt8(size, entry);
    header.writeUInt8(size, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((image) => image.data)]);
}

const svg = await readFile(SOURCE);
const svgDataUrl = `data:image/svg+xml;base64,${svg.toString("base64")}`;
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const images = [];
  for (const size of ICO_SIZES) {
    images.push({ size, data: await render(page, svgDataUrl, size) });
  }
  await writeFile(output("favicon.ico"), packIco(images));
  await writeFile(
    output("apple-touch-icon.png"),
    await render(page, svgDataUrl, APPLE_SIZE, APPLE_BACKGROUND),
  );
  console.log("wrote public/favicon.ico (16, 32, 48) and public/apple-touch-icon.png (180)");
} finally {
  await browser.close();
}
