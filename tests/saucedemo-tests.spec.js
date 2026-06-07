const { test, expect } = require('@playwright/test');
const SwagLabsPage = require('./pages/SwagLabsPage');

// Test Credentials - Load from environment variables or use defaults
const CREDENTIALS = {
  validUsername: process.env.SAUCE_USER || 'standard_user',
  validPassword: process.env.SAUCE_PASSWORD || 'secret_sauce',
  invalidPassword: process.env.INVALID_PASSWORD || 'wrong_password'
};

test.describe('Swag Labs Automation Tests', () => {
  let swagLabsPage;

  test.beforeEach(async ({ page }) => {
    swagLabsPage = new SwagLabsPage(page);
    await swagLabsPage.navigateTo();
  });

  test('1. Successful Login with Valid Credentials', async ({ page }) => {
    await swagLabsPage.login(CREDENTIALS.validUsername, CREDENTIALS.validPassword);
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('2. Failed Login with Invalid Password', async ({ page }) => {
    await swagLabsPage.login(CREDENTIALS.validUsername, CREDENTIALS.invalidPassword);
    await expect(swagLabsPage.errorMessage).toContainText('Username and password');
  });

  test('3. Verify Product Inventory Page After Login', async ({ page }) => {
    await swagLabsPage.login(CREDENTIALS.validUsername, CREDENTIALS.validPassword);
    await expect(swagLabsPage.inventoryList).toBeVisible();
  });

  test('4. Add Item to Shopping Cart', async ({ page }) => {
    await swagLabsPage.login(CREDENTIALS.validUsername, CREDENTIALS.validPassword);
    await swagLabsPage.addToCart('sauce-labs-backpack');
    await expect(swagLabsPage.cartBadge).toContainText('1');
  });

  test('5. Logout Functionality', async ({ page }) => {
    await swagLabsPage.login(CREDENTIALS.validUsername, CREDENTIALS.validPassword);
    await swagLabsPage.logout();
    await expect(page).toHaveURL(/.*\//);
    const loginButton = page.locator('input[type="submit"]');
    await expect(loginButton).toBeVisible();
  });
});
