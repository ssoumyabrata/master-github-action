const { test, expect } = require('@playwright/test');

test.describe('Product Search Tests', () => {
  test('Test Case 9: Search Product', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');

    // Navigate to products page
    await page.click('a[href="/products"]');
    
    // Verify products page
    await expect(page).toHaveURL(/.*products/);
    await expect(page.locator('h2:has-text("All Products")')).toBeVisible();

    // Search for a product
    const searchKeyword = 'Top';
    await page.fill('input#search_product', searchKeyword);
    
    // Click search button
    await page.click('button#submit_search');

    // Wait for search results
    await page.waitForLoadState('networkidle');

    // Verify search results page
    await expect(page.locator('h2:has-text("Searched Products")')).toBeVisible();

    // Verify at least one product is displayed
    await expect(page.locator('.productinfo')).toHaveCount(1, { timeout: 5000 });

    // Verify product contains search keyword in name or description
    const productText = await page.locator('.productinfo').first().textContent();
    expect(productText?.toUpperCase()).toContain(searchKeyword.toUpperCase());

    // Verify "No products found" is NOT shown
    const noProductsMessage = page.locator('text=No products found');
    await expect(noProductsMessage).not.toBeVisible();
  });

  test('Test Case 8: Verify All Products and product detail page', async ({ page }) => {
    // Navigate to products page
    await page.goto('/products');

    // Verify products page title
    await expect(page.locator('h2:has-text("All Products")')).toBeVisible();

    // Verify product list is displayed
    const productList = page.locator('.productinfo');
    const productCount = await productList.count();
    expect(productCount).toBeGreaterThan(0);

    // Click on first product's "View Product" button
    await page.click('a[href*="/product_details/"]', { timeout: 5000 });

    // Verify we're on product detail page
    await expect(page).toHaveURL(/.*product_details/);

    // Verify product details are displayed
    await expect(page.locator('.product-information')).toBeVisible();
    
    // Verify product name is displayed
    const productName = page.locator('h2');
    await expect(productName).toBeVisible();

    // Verify product price is displayed
    await expect(page.locator('text=/Rs\\./i')).toBeVisible();

    // Verify product availability is displayed
    await expect(page.locator('text=/Availability|Stock/i')).toBeVisible();

    // Verify add to cart button exists
    await expect(page.locator('button:has-text("Add to cart")')).toBeVisible();
  });
});
