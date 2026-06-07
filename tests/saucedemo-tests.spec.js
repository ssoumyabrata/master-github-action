const { test, expect } = require('@playwright/test');
const SwagLabsPage = require('./pages/SwagLabsPage');

test.describe('Swag Labs Automation Tests', () => {
  let swagLabsPage;

  test.beforeEach(async ({ page }) => {
    swagLabsPage = new SwagLabsPage(page);
    await swagLabsPage.navigateTo();
  });

  test('1. Successful Login with Valid Credentials', async ({ page }) => {
    await swagLabsPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('2. Failed Login with Invalid Password', async ({ page }) => {
    await swagLabsPage.login('standard_user', 'wrong_password');
    await expect(swagLabsPage.errorMessage).toContainText('Username and password');
  });

  test('3. Verify Product Inventory Page After Login', async ({ page }) => {
    await swagLabsPage.login('standard_user', 'secret_sauce');
    await expect(swagLabsPage.inventoryList).toBeVisible();
  });

  test('4. Add Item to Shopping Cart', async ({ page }) => {
    await swagLabsPage.login('standard_user', 'secret_sauce');
    await swagLabsPage.addToCart('sauce-labs-backpack');
    await expect(swagLabsPage.cartBadge).toContainText('1');
  });

  test('5. Logout Functionality', async ({ page }) => {
    await swagLabsPage.login('standard_user', 'secret_sauce');
    await swagLabsPage.logout();
    await expect(page).toHaveURL(/.*\//);
    const loginButton = page.locator('input[type="submit"]');
    await expect(loginButton).toBeVisible();
  });
});
