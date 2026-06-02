const { test, expect } = require('@playwright/test');

test.describe('Authentication Tests', () => {
  test('Test Case 1: Register User', async ({ page }) => {
    // Navigate to signup page
    await page.goto('/');
    await page.click('a[href="/login"]');
    
    // Fill signup form
    const email = `testuser${Date.now()}@example.com`;
    await page.fill('input[data-qa="signup-name"]', 'Test User');
    await page.fill('input[data-qa="signup-email"]', email);
    await page.click('button[data-qa="signup-button"]');

    // Wait for registration form to load
    await page.waitForLoadState('networkidle');

    // Fill registration form
    await page.click('input#id_gender1'); // Select gender (Mr.)
    await page.fill('input#password', 'TestPassword123');
    await page.fill('input[data-qa="first_name"]', 'Test');
    await page.fill('input[data-qa="last_name"]', 'User');
    await page.fill('input[data-qa="company"]', 'Test Company');
    await page.fill('input[data-qa="address"]', '123 Test Street');
    await page.fill('input[data-qa="state"]', 'California');
    await page.fill('input[data-qa="city"]', 'San Francisco');
    await page.fill('input[data-qa="zipcode"]', '94107');
    await page.fill('input[data-qa="mobile_number"]', '1234567890');
    
    // Select country from dropdown
    await page.selectOption('select#country', 'United States');
    
    // Select date of birth
    await page.selectOption('select#days', '15');
    await page.selectOption('select#months', 'January');
    await page.selectOption('select#years', '1990');
    
    // Submit form
    await page.click('button[data-qa="create-account"]');

    // Verify account created message
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Account Created!')).toBeVisible();
    
    // Click continue button
    await page.click('a[data-qa="continue-button"]');
    
    // Verify user is logged in
    await expect(page.locator('text=Logged in as')).toBeVisible();
  });

  test('Test Case 2: Login User with correct email and password', async ({ page }) => {
    const testEmail = `testuser${Date.now()}@example.com`;
    
    // Navigate to login and register a new user
    await page.goto('/');
    await page.click('a[href="/login"]');

    // Fill signup form
    await page.fill('input[data-qa="signup-name"]', 'Login Test');
    await page.fill('input[data-qa="signup-email"]', testEmail);
    await page.click('button[data-qa="signup-button"]');

    // Wait for registration form
    await page.waitForLoadState('networkidle');

    // Fill registration details
    await page.click('input#id_gender1');
    await page.fill('input#password', 'TestPassword123');
    await page.fill('input[data-qa="first_name"]', 'Login');
    await page.fill('input[data-qa="last_name"]', 'Test');
    await page.fill('input[data-qa="company"]', 'Test Co');
    await page.fill('input[data-qa="address"]', '123 Street');
    await page.selectOption('select#country', 'United States');
    await page.fill('input[data-qa="state"]', 'CA');
    await page.fill('input[data-qa="city"]', 'SF');
    await page.fill('input[data-qa="zipcode"]', '94107');
    await page.fill('input[data-qa="mobile_number"]', '1234567890');
    await page.selectOption('select#days', '15');
    await page.selectOption('select#months', 'January');
    await page.selectOption('select#years', '1990');
    
    await page.click('button[data-qa="create-account"]');
    await page.waitForLoadState('networkidle');
    await page.click('a[data-qa="continue-button"]');

    // Logout
    await page.click('a[href="/logout"]');
    await page.waitForLoadState('networkidle');

    // Now login with correct credentials
    await page.click('a[href="/login"]');
    await page.fill('input[data-qa="login-email"]', testEmail);
    await page.fill('input[data-qa="login-password"]', 'TestPassword123');
    await page.click('button[data-qa="login-button"]');

    // Verify successful login
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Logged in as')).toBeVisible();
  });

  test('Test Case 3: Login User with incorrect email and password', async ({ page }) => {
    // Navigate to login
    await page.goto('/');
    await page.click('a[href="/login"]');

    // Try to login with incorrect credentials
    await page.fill('input[data-qa="login-email"]', 'incorrectemail@example.com');
    await page.fill('input[data-qa="login-password"]', 'IncorrectPassword123');
    await page.click('button[data-qa="login-button"]');

    // Verify error message
    await expect(page.locator('text=Your email or password is incorrect')).toBeVisible();
  });

  test('Test Case 4: Logout User', async ({ page }) => {
    const testEmail = `logouttest${Date.now()}@example.com`;
    
    // Navigate and register
    await page.goto('/');
    await page.click('a[href="/login"]');
    
    await page.fill('input[data-qa="signup-name"]', 'Logout Test');
    await page.fill('input[data-qa="signup-email"]', testEmail);
    await page.click('button[data-qa="signup-button"]');

    // Wait for registration form
    await page.waitForLoadState('networkidle');

    // Fill registration form
    await page.click('input#id_gender1');
    await page.fill('input#password', 'TestPassword123');
    await page.fill('input[data-qa="first_name"]', 'Logout');
    await page.fill('input[data-qa="last_name"]', 'Test');
    await page.fill('input[data-qa="company"]', 'Test Co');
    await page.fill('input[data-qa="address"]', '123 Street');
    await page.selectOption('select#country', 'United States');
    await page.fill('input[data-qa="state"]', 'CA');
    await page.fill('input[data-qa="city"]', 'SF');
    await page.fill('input[data-qa="zipcode"]', '94107');
    await page.fill('input[data-qa="mobile_number"]', '1234567890');
    await page.selectOption('select#days', '15');
    await page.selectOption('select#months', 'January');
    await page.selectOption('select#years', '1990');
    
    await page.click('button[data-qa="create-account"]');
    await page.waitForLoadState('networkidle');
    await page.click('a[data-qa="continue-button"]');

    // Verify user is logged in
    await expect(page.locator('text=Logged in as')).toBeVisible();

    // Logout
    await page.click('a[href="/logout"]');
    await page.waitForLoadState('networkidle');

    // Verify redirected to login page
    await expect(page).toHaveURL(/.*login/);
  });
});
