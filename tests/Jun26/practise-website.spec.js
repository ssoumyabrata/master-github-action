const { test, expect } = require('@playwright/test')

test("first test in playwright", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://google.com")

})

test("second test in playwright", async ({ page }) => {
    const lUsername = page.locator('#username')
    const lPassword = page.locator('#password')
    const lSignIn = page.locator("#signInBtn")

    const lProduct = page.locator(".card-body a")

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
    console.log(await page.title());
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy")
    await lUsername.fill('rahulshetty');
    await lPassword.fill('learning');
    await lSignIn.click();
    await expect(page.locator("[style*='display: block']")).toContainText("Incorrect username/password.");

    await lUsername.fill("rahulshettyacademy")
    await lPassword.fill("Learning@830$3mK2")
    await lSignIn.click()

    //console.log(await lProduct.first().textContent());
    console.log(await lProduct.allTextContents());

})

test("different types of elementws in playwright", async ({ page }) => {
    const lUsername = page.locator('#username')
    const lPassword = page.locator('#password')
    const lSignIn = page.locator("#signInBtn")
    const lProduct = page.locator(".card-body a")

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
    await lUsername.fill("rahulshettyacademy")
    await lPassword.fill("Learning@830$3mK2")
    await page.locator('select.form-control').selectOption('consult')
    await page.locator("input[value='user'] + .checkmark").click();
    await page.locator("#okayBtn").click();
    await expect(page.locator("input[value='user'] + .checkmark")).toBeChecked()


    const iAgree = page.locator("#terms")
    await iAgree.click();
    await expect(iAgree).toBeChecked()

    await iAgree.uncheck();
    await expect(iAgree).not.toBeChecked()
    expect(await iAgree.isChecked()).toBeFalsy()
    expect(await iAgree.isChecked()).toBe(false)

    await expect(page.locator("[href*='documents-request']")).toHaveAttribute("class", "blinkingText")

    await lSignIn.click()

})

test("handle new page in playwright", async ({ browser }) => {

    const context = await browser.newContext()
    const page = await context.newPage();
    const lUsername = page.locator('#username')

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
    
    await lUsername.fill("rahulshettyacademy")
    const blinklink = page.locator("[href*='documents-request']")
    await expect(blinklink).toHaveAttribute("class", "blinkingText")
    
    //to get new page
    const [blinkPage] = await Promise.all(
    [
        context.waitForEvent('page'),
        blinklink.click()
    ])
    console.log(await blinkPage.locator(".red").textContent());

    console.log(await lUsername.inputValue())


})