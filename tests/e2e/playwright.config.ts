import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, devices } from '@playwright/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

export default defineConfig({
  testDir: './specs',
  timeout: 90_000,
  // Almost every spec mutates shared server-side state (talentai.db, the single
  // `user-default` account, dark-mode DOM class) — serialize to avoid cross-test races
  // rather than pretending these are independent, parallelizable tests.
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // reuseExistingServer means this works whether the user already has both dev
  // processes running (as in this session) or is starting from a clean checkout.
  webServer: [
    {
      command: 'npm run server',
      cwd: projectRoot,
      url: 'http://localhost:3001/api/config/status',
      reuseExistingServer: true,
      timeout: 30_000,
    },
    {
      command: 'npm run dev',
      cwd: projectRoot,
      url: 'http://localhost:3000',
      reuseExistingServer: true,
      timeout: 30_000,
    },
  ],
});
