import { copyFileSync, existsSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const env = {
  ...process.env,
  GITHUB_PAGES: "1",
  NITRO_PRESET: "github-pages",
};

const result = spawnSync("node", ["scripts/with-app-env.mjs", "vite", "build"], {
  stdio: "inherit",
  env,
});

const publicDir = join(process.cwd(), ".output", "public");
const index = join(publicDir, "index.html");

if (!existsSync(index)) {
  console.error("GitHub Pages build did not emit .output/public/index.html");
  process.exit(result.status === 0 ? 1 : result.status ?? 1);
}

copyFileSync(index, join(publicDir, "404.html"));
writeFileSync(join(publicDir, ".nojekyll"), "");
console.log("GitHub Pages output ready in .output/public");
process.exit(0);
