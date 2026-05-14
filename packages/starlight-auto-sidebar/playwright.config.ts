import { defineConfig, devices } from '@playwright/test'

const isCI = !!process.env['CI']

export default defineConfig({
  forbidOnly: isCI,
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Re-use system Chrome on CI to avoid re-installing it on every run.
        channel: isCI ? 'chrome' : undefined,
        headless: true,
      },
    },
  ],
})
