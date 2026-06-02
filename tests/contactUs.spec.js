const { test, expect } = require('@playwright/test');

test.describe('Contact Us Form Tests', () => {
  test('Test Case 6: Contact Us Form', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');

    // Click on Contact Us
    await page.click('a[href="/contact_us"]');
    
    // Verify page title
    await expect(page.locator('h2:has-text("Contact Us")')).toBeVisible();

    // Fill contact form
    await page.fill('input[data-qa="name"]', 'Test User');
    await page.fill('input[data-qa="email"]', `testuser${Date.now()}@example.com`);
    await page.fill('input[data-qa="subject"]', 'Test Subject');
    await page.fill('textarea[data-qa="message"]', 'This is a test message for the contact form.');

    // Upload file (optional)
    // await page.fill('input[name="upload_file"]', '/path/to/file');

    // Submit form
    await page.click('button[data-qa="submit-button"]');

    // Verify success message
    await expect(page.locator('text=Success! Your details have been submitted successfully.')).toBeVisible();

    // Verify alert and confirm
    await page.on('dialog', dialog => {
      expect(dialog.type()).toBe('alert');
      dialog.accept();
    });

    // After confirming, should be redirected to home
    await expect(page).toHaveURL('https://automationexercise.com/');
  });
});
