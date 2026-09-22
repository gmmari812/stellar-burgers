import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.pl.tsx',

  use: {
    baseURL: 'http://localhost:4000',
    trace: 'on-first-retry'
  },

  webServer: {
    command: 'npm start',
    url: 'http://localhost:4000',
    reuseExistingServer: true
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    }
  ]
});