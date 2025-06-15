import { test, expect } from '@playwright/test';

test.describe('Advanced Example.com Tests', () => {
  test('should perform performance checks', async ({ page }) => {
    // Start timing
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime}ms`);
    
    // Verify page loads within reasonable time (adjust as needed)
    expect(loadTime).toBeLessThan(5000);
    
    // Check for basic performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime
      };
    });
    
    console.log('Performance metrics:', performanceMetrics);
    expect(performanceMetrics.domContentLoaded).toBeGreaterThanOrEqual(0);
  });

  test('should handle network conditions', async ({ page }) => {
    // Simulate slow network
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 100);
    });
    
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Example Domain');
  });

  test('should capture screenshot for visual regression', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot(`example-page-${browserName}.png`, {
      fullPage: true,
      threshold: 0.2,
      maxDiffPixels: 100
    });
  });

  test('should test keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Focus on the link using keyboard navigation
    await page.keyboard.press('Tab');
    
    // Check if the link is focused
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(focusedElement).toBe('A');
    
    // Press Enter to follow the link
    await page.keyboard.press('Enter');
    
    // Wait for navigation or new tab
    await page.waitForTimeout(1000);
  });

  test('should verify SEO elements', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle('Example Domain');
    
    // Check meta description (if exists)
    const metaDescription = page.locator('meta[name="description"]');
    const descriptionCount = await metaDescription.count();
    if (descriptionCount > 0) {
      const description = await metaDescription.getAttribute('content');
      expect(description).toBeTruthy();
      console.log('Meta description:', description);
    }
    
    // Check for heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    // Verify alt attributes on images (if any)
    const images = page.locator('img');
    const imageCount = await images.count();
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });

  test('should test form interactions (if any)', async ({ page }) => {
    await page.goto('/');
    
    // Check for any form elements
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      console.log(`Found ${formCount} form(s) on the page`);
      
      // Test form interactions
      const inputs = page.locator('input');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const inputType = await input.getAttribute('type');
        console.log(`Input type: ${inputType}`);
        
        if (inputType === 'text' || inputType === 'email') {
          await input.fill('test input');
          await expect(input).toHaveValue('test input');
        }
      }
    } else {
      console.log('No forms found on the page');
    }
  });

  test('should test cross-browser compatibility features', async ({ page, browserName }) => {
    await page.goto('/');
    
    // Test CSS features support
    const cssSupport = await page.evaluate(() => {
      const div = document.createElement('div');
      return {
        flexbox: CSS.supports('display', 'flex'),
        grid: CSS.supports('display', 'grid'),
        customProperties: CSS.supports('--test', 'initial'),
      };
    });
    
    console.log(`CSS Support in ${browserName}:`, cssSupport);
    
    // Test JavaScript features
    const jsFeatures = await page.evaluate(() => {
      return {
        es6Classes: typeof class {} === 'function',
        arrowFunctions: (() => typeof (() => {}) === 'function')(),
        promises: typeof Promise !== 'undefined',
        fetch: typeof fetch !== 'undefined',
      };
    });
    
    console.log(`JavaScript Features in ${browserName}:`, jsFeatures);
    
    // Verify basic functionality works
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('a')).toBeVisible();
  });
});
