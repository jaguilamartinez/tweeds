import { defineConfig, devices } from '@playwright/test';

// Use the existing Windows browser; other platforms use Playwright's Chromium.
// Keep each channel's baselines separate because browser rendering can differ.
const channel = process.env.PLAYWRIGHT_CHANNEL?.trim() || (process.platform === 'win32' ? 'msedge' : undefined);
const browserLabel = channel ?? 'chromium';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  workers: 2,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:5173',
    contextOptions: { reducedMotion: 'reduce' },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    channel,
  },
  expect: {
    toHaveScreenshot: { animations: 'disabled', caret: 'hide', maxDiffPixelRatio: 0.005 },
  },
  snapshotPathTemplate: '{testDir}/__screenshots__/{platform}/{projectName}/{testFilePath}/{arg}{ext}',
  projects: [
    { name: `desktop-${browserLabel}`, use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: `mobile-${browserLabel}`, use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'pnpm dev --host 127.0.0.1',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
