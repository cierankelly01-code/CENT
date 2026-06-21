import { defineConfig, devices } from "@playwright/test";

// Accessibility (axe-core) E2E config. Builds are produced separately (npm run build);
// this starts `next start` and runs the axe checks against it.
const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

const DUMMY_ENV = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "dummy-anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "dummy-service-role-key",
};

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: BASE_URL },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run start",
    url: BASE_URL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    env: DUMMY_ENV,
  },
});
