import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { listFiles } from "./dist-checks.mjs";

const EXTERNAL = /\shref="(https:\/\/[^"]+)"/g;
const SKIP_HOSTS = new Set(["www.linkedin.com", "x.com"]);
const TIMEOUT_MS = 10_000;

async function fetchStatus(url, method) {
  const response = await fetch(url, {
    method,
    redirect: "follow",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  return response.status;
}

async function linkStatus(url) {
  try {
    const status = await fetchStatus(url, "HEAD");
    if (status < 400) return status;
  } catch {
    // Some servers reject HEAD; fall through to GET.
  }
  try {
    return await fetchStatus(url, "GET");
  } catch (error) {
    return `error: ${error.message}`;
  }
}

const distDir = "dist";
if (!existsSync(distDir)) {
  console.error(`dist directory not found: ${distDir}. Run npm run build first.`);
  process.exit(1);
}

const urls = new Set();
for (const file of (await listFiles(distDir)).filter((f) => f.endsWith(".html"))) {
  for (const [, url] of (await readFile(file, "utf8")).matchAll(EXTERNAL)) {
    if (!SKIP_HOSTS.has(new URL(url).hostname)) urls.add(url);
  }
}

let failures = 0;
for (const url of urls) {
  const status = await linkStatus(url);
  const ok = typeof status === "number" && status < 400;
  if (!ok) failures += 1;
  console.log(`${ok ? "ok  " : "FAIL"} ${status} ${url}`);
}
console.log(
  `\n${urls.size} links checked, ${failures} failed (LinkedIn and X skipped: they block bots).`,
);
process.exitCode = failures > 0 ? 1 : 0;
