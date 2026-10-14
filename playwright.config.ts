// End-to-end tests (D-14) run against the production build in Chromium, Firefox and
// WebKit, the Safari stand-in (D-21). Port 3100 keeps them clear of `pnpm dev` on 3000.
import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const isCI = Boolean(process.env.CI);

export default defineConfig({
  forbidOnly: isCI,
  fullyParallel: true,
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  retries: isCI ? 2 : 0,
  testDir: "e2e",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  webServer: {
    // CI builds in an earlier step; locally the build runs here.
    command: isCI
      ? `pnpm start --port ${PORT}`
      : `pnpm build && pnpm start --port ${PORT}`,
    reuseExistingServer: !isCI,
    timeout: 180_000,
    url: `http://localhost:${PORT}`,
  },
});
