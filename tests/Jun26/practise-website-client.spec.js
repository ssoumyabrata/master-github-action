const { test, expect } = require('@playwright/test')

test.only("Order E2E flow in Client website", async ({ page }) => {
    const lUsername = page.locator('#userEmail')
    const lPassword = page.locator('#userPassword')
    const lSignIn = page.locator("#login")

    const lProduct = page.locator(".card-body")

    await page.goto("https://rahulshettyacademy.com/client/#/auth/login")
    console.log(await page.title());
    await expect(page).toHaveTitle("Let's Shop")
    await lUsername.fill('soumyabratasaha8@gmail.com');
    await lPassword.fill('Password@1');
    await lSignIn.click();


    await lProduct.first().waitFor();
    console.log(await lProduct.allTextContents());

    lProduct.filter({
        hasText: "ZARA COAT 3"
    }).locator("text= Add To Cart").click()
    await expect(page.locator("[aria-label='Product Added To Cart']")).toBeVisible()

    await page.locator("[routerlink = '/dashboard/cart']").click()
    await page.locator('div li').first().waitFor()
    expect(await page.locator("h3:has-text('ZARA COAT 3')").isVisible()).toBe(true)

    await page.locator("button:has-text('Checkout')").click()

    await page.locator("[placeholder*='Country']").pressSequentially("ind");
    const listOfCountries = page.locator('.ta-results')
    await listOfCountries.first().waitFor()
    await listOfCountries.getByText(' India', { exact: true }).click();

    await page.locator("a:has-text('PLACE ORDER')").click()

    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");

    let orderId = await page.locator("td label.ng-star-inserted").textContent();
    orderId = orderId.split("|")[1].trim();
 
    // await test.info().attach("Order ID", {
    // body: await page.locator("td label.ng-star-inserted").textContent(),
    // contentType: "text/plain"
    // });

    await page.locator("button[routerlink*=myorders]").click()
    const tableRows = await page.locator("table tr")
    tableRows.first().waitFor()
    await tableRows.filter ({
        hasText: orderId
    }).locator("button:has-text('View')").click()

    await expect(page.locator(".email-title")).toHaveText(" order summary ")
    await expect(page.locator("//small[text()='Order Id']/../*[@class='col-text -main']")).toHaveText(orderId)

   //await page.pause()

})

