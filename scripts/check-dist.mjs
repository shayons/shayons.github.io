import { checkDist } from "./dist-checks.mjs";

const distDir = process.argv[2] ?? "dist";
const problems = await checkDist(distDir);

if (problems.length === 0) {
  console.log(`dist checks passed (${distDir})`);
} else {
  for (const { file, message } of problems) console.error(`${file}: ${message}`);
  console.error(`\n${problems.length} problem(s). Fix the source, rebuild, and rerun.`);
  process.exitCode = 1;
}
