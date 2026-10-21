import { existsSync, readFileSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const BANNED = [
  { name: "em dash", pattern: /\u2014|&mdash;|&#8212;|&#x2014;/gi },
  { name: "middle dot", pattern: /\u00b7|&middot;|&#183;|&#xb7;/gi },
];

const LINK_ATTRIBUTE = /\s(?:href|src)="([^"]+)"/g;
const THEME_SCRIPT = readFileSync(
  new URL("../src/scripts/theme.js", import.meta.url),
  "utf8",
).trim();

function stripCode(html) {
  return html.replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<script[\s\S]*?<\/script>/gi, " ");
}

/**
 * Finds em dashes and middle dots (literal or entity-encoded) outside style and script blocks.
 * @param {string} html Page HTML.
 * @returns {{name: string, context: string}[]} One finding per occurrence, with nearby text.
 */
export function findBannedCharacters(html) {
  const text = stripCode(html);
  const findings = [];
  for (const { name, pattern } of BANNED) {
    for (const match of text.matchAll(pattern)) {
      const start = Math.max(0, match.index - 40);
      const context = text
        .slice(start, match.index + 40)
        .replace(/\s+/g, " ")
        .trim();
      findings.push({ name, context });
    }
  }
  return findings;
}

/**
 * Counts opening script tags so the build can reject unexpected JavaScript.
 * @param {string} html Page HTML.
 * @returns {number} Number of script tags.
 */
export function countScriptTags(html) {
  return (html.match(/<script\b/gi) ?? []).length;
}

/**
 * Lists every file under a directory, recursively.
 * @param {string} dir Directory to walk.
 * @returns {Promise<string[]>} File paths joined with their parent directory.
 */
export async function listFiles(dir) {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath, entry.name));
}

/**
 * Extracts root-relative href and src values (internal links and assets).
 * @param {string} html Page HTML.
 * @returns {string[]} Values that start with a single slash.
 */
export function internalTargets(html) {
  const targets = [];
  for (const [, value] of html.matchAll(LINK_ATTRIBUTE)) {
    if (value.startsWith("/") && !value.startsWith("//")) targets.push(value);
  }
  return targets;
}

function resolveTarget(distDir, href) {
  const [withoutHash, fragment = ""] = href.split("#");
  const pathname = withoutHash.split("?")[0];
  const hasExtension = path.extname(pathname) !== "";
  if (!hasExtension && !pathname.endsWith("/")) {
    return { problem: `missing trailing slash: ${href}` };
  }
  const file = hasExtension
    ? path.join(distDir, pathname)
    : path.join(distDir, pathname, "index.html");
  if (!existsSync(file)) return { problem: `no file for ${href}` };
  return { file, fragment };
}

async function checkLinks(distDir, html, readCached) {
  const problems = [];
  for (const href of internalTargets(html)) {
    const target = resolveTarget(distDir, href);
    if (target.problem) {
      problems.push(target.problem);
      continue;
    }
    if (target.fragment && !(await readCached(target.file)).includes(`id="${target.fragment}"`)) {
      problems.push(`missing #${target.fragment} for ${href}`);
    }
  }
  return problems;
}

async function checkPage(distDir, file, readCached) {
  const html = await readCached(file);
  const messages = findBannedCharacters(html).map((f) => `${f.name} near "${f.context}"`);
  // Allow exactly one inline theme controller, byte-matched to its source. Other
  // inline scripts, duplicate controllers, and all JavaScript assets remain banned.
  const withoutTheme = html.replace(
    /<script id="color-theme-controller">([\s\S]*?)<\/script>/,
    (tag, source) => (source.trim() === THEME_SCRIPT ? "" : tag),
  );
  if (countScriptTags(withoutTheme) > 0) messages.push("<script> tag in page");
  messages.push(...(await checkLinks(distDir, html, readCached)));
  return messages.map((message) => ({ file, message }));
}

/**
 * Runs every build-output check: no JavaScript assets, only the approved theme script, no banned characters,
 * and every internal link resolves to a file (and to its #fragment when one is given).
 * @param {string} distDir Build output directory.
 * @returns {Promise<{file: string, message: string}[]>} Problems found; empty when clean.
 */
export async function checkDist(distDir) {
  const files = await listFiles(distDir);
  const cache = new Map();
  const readCached = async (file) => {
    if (!cache.has(file)) cache.set(file, await readFile(file, "utf8"));
    return cache.get(file);
  };
  const problems = files
    .filter((file) => /\.m?js$/.test(file))
    .map((file) => ({ file, message: "JavaScript file in build output" }));
  for (const file of files.filter((f) => f.endsWith(".html"))) {
    problems.push(...(await checkPage(distDir, file, readCached)));
  }
  return problems;
}
