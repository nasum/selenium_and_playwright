import { test as base } from '@playwright/test';

// Extend basic test with custom fixtures
export const test = base.extend({
  // Custom fixture for common page setup
  setupPage: async ({ page }, use) => {
    // Common setup that can be reused across tests
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await use(page);
    
    // Cleanup if needed
  },

  // Custom fixture for browser info
  browserInfo: async ({ page, browserName }, use) => {
    const userAgent = await page.evaluate(() => navigator.userAgent);
    const viewport = await page.viewportSize();
    
    const info = {
      name: browserName,
      userAgent,
      viewport,
    };
    
    await use(info);
  },

  // Custom fixture for performance monitoring
  performanceMonitor: async ({ page }, use) => {
    const metrics = {
      startTime: Date.now(),
      marks: new Map(),
    };

    // Add performance mark
    const mark = (name) => {
      metrics.marks.set(name, Date.now() - metrics.startTime);
    };

    // Get all marks
    const getMarks = () => Object.fromEntries(metrics.marks);

    await use({ mark, getMarks });
  },
});

export { expect } from '@playwright/test';
