class SwagLabsPage {
  constructor(page) {
    this.page = page;
    // Login page locator list
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('input[type="submit"]');
    this.errorMessage = page.locator('[data-test="error"]');
    // Inventory page locators= list
    this.inventoryList = page.locator('[data-test="inventory-container"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
 
  async addToCart(productId) {
    await this.page.click(`[data-test="add-to-cart-${productId}"]`);
  }

  async navigateTo() {
    await this.page.goto('/');
  }
}

module.exports = SwagLabsPage;
