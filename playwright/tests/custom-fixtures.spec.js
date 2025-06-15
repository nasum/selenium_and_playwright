import { test, expect } from './fixtures.js';

test.describe('Example.com Tests with Custom Fixtures', () => {
  test('should use custom page setup', async ({ setupPage }) => {
    // Page is already set up and loaded
    await expect(setupPage.locator('h1')).toHaveText('Example Domain');
  });

  test('should display browser information', async ({ browserInfo }) => {
    console.log(`Browser: ${browserInfo.name}`);
    console.log(`User Agent: ${browserInfo.userAgent}`);
    console.log(`Viewport: ${browserInfo.viewport.width}x${browserInfo.viewport.height}`);
    
    expect(browserInfo.name).toBeTruthy();
    expect(browserInfo.userAgent).toBeTruthy();
    expect(browserInfo.viewport.width).toBeGreaterThan(0);
    expect(browserInfo.viewport.height).toBeGreaterThan(0);
  });

  test('should monitor performance', async ({ page, performanceMonitor }) => {
    performanceMonitor.mark('navigation-start');
    
    await page.goto('/');
    performanceMonitor.mark('navigation-end');
    
    await page.waitForLoadState('networkidle');
    performanceMonitor.mark('load-complete');
    
    const marks = performanceMonitor.getMarks();
    console.log('Performance marks:', marks);
    
    expect(marks['navigation-end']).toBeGreaterThan(marks['navigation-start']);
    expect(marks['load-complete']).toBeGreaterThan(marks['navigation-end']);
  });

  test('should verify page elements with enhanced assertions', async ({ page }) => {
    await page.goto('/');
    
    // Multiple assertions in one test
    await test.step('Verify page title and heading', async () => {
      await expect(page).toHaveTitle('Example Domain');
      await expect(page.locator('h1')).toHaveText('Example Domain');
    });

    await test.step('Verify page content', async () => {
      const paragraph = page.locator('p').first();
      await expect(paragraph).toContainText('This domain is for use in illustrative examples');
    });

    await test.step('Verify external link', async () => {
      const link = page.locator('a[href*="iana.org"]');
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', /iana\.org/);
    });
  });
});
