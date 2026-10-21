import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: "http://localhost:4321" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Astro 7 backgrounds `astro preview` when it detects an AI agent; --ignore-lock keeps a
    // one-off server in the foreground for Playwright (withastro/astro#17903).
    command: "npm run preview -- --port 4321 --ignore-lock",
    url: "http://localhost:4321/",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
