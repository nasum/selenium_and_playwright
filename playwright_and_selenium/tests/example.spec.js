import { test, expect } from '@playwright/test';

test.describe('Example.com E2E Tests with Selenium Grid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display correct page title', async ({ page }) => {
    await expect(page).toHaveTitle('Example Domain');
  });

  test('should display main heading text', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Example Domain');
  });

  test('should display domain information paragraph', async ({ page }) => {
    const paragraph = page.locator('p').first();
    await expect(paragraph).toBeVisible();
    await expect(paragraph).toContainText('This domain is for use in illustrative examples');
    await expect(paragraph).toContainText('You may use this domain in literature');
  });

  test('should have a "More information..." link', async ({ page }) => {
    const link = page.locator('a[href*="iana.org"]');
    await expect(link).toBeVisible();
    await expect(link).toHaveText('More information...');
  });

  test('should verify page URL', async ({ page }) => {
    expect(page.url()).toBe('https://example.com/');
  });

  test('should verify page contains expected meta information', async ({ page }) => {
    // Check for charset meta tag
    const metaCharset = page.locator('meta[charset]');
    await expect(metaCharset).toHaveCount(1);
    
    // Check for viewport meta tag
    const viewportMeta = page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toHaveCount(1);
  });

  test('should verify browser and page information', async ({ page, browserName }) => {
    console.log(`Testing with browser: ${browserName}`);
    
    // Verify the page is loaded correctly
    await expect(page).toHaveURL('https://example.com/');
    await expect(page).toHaveTitle('Example Domain');
    
    // Get and log browser info
    const userAgent = await page.evaluate(() => navigator.userAgent);
    console.log(`User Agent: ${userAgent}`);
    
    // Verify page content is accessible
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toContain('Example Domain');
    expect(bodyText).toContain('This domain is for use in illustrative examples');
  });

  test('should be responsive and accessible', async ({ page }) => {
    // Test different viewport sizes
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1')).toBeVisible();
    
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toBeVisible();
    
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();
    
    // Reset to default
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test('should handle page interactions', async ({ page }) => {
    // Click on the "More information..." link
    const link = page.locator('a[href*="iana.org"]');
    await expect(link).toBeVisible();
    
    // Get the href attribute
    const href = await link.getAttribute('href');
    expect(href).toContain('iana.org');
    
    // Test hover effect (if any)
    await link.hover();
    
    // Verify link is still visible after hover
    await expect(link).toBeVisible();
  });

  test('should verify page structure and elements', async ({ page }) => {
    // Check document structure
    await expect(page.locator('html')).toHaveCount(1);
    await expect(page.locator('head')).toHaveCount(1);
    await expect(page.locator('body')).toHaveCount(1);
    
    // Check main content elements
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('p')).toHaveCount(2);
    await expect(page.locator('a')).toHaveCount(1);
    
    // Verify text content
    const bodyContent = await page.locator('body').textContent();
    expect(bodyContent).toBeTruthy();
    expect(bodyContent.length).toBeGreaterThan(0);
  });
}); 