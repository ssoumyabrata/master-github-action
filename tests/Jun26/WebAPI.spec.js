const { test, expect, request } = require("@playwright/test");
const {ApiUtils} = require("./utils/ApiUtils")

const loginPayLoad = { userEmail: "soumyabratasaha8@gmail.com", userPassword: "Password@1" }
const orderPayLoad = {orders: [{country: "Cuba", productOrderedId: "6960ea76c941646b7a8b3dd5"}]}
let token;
let apiUtils;

test.beforeAll( async() => {
    const apiContext = await request.newContext();
    apiUtils = new ApiUtils(apiContext, loginPayLoad)
    token = await apiUtils.getLoginToken()

    });

test.beforeEach( async() => {

})


test("Create Order and Verify order without Login", async ({ page }) => {

    page.addInitScript(value => 
        {
            window.localStorage.setItem('token', value);
        }, token);

     await page.goto("https://rahulshettyacademy.com/client/")


    const lProduct = page.locator(".card-body")
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
    await tableRows.first().waitFor()
    await tableRows.filter({
        hasText: orderId
    }).locator("button:has-text('View')").click()

    await expect(page.locator(".email-title")).toHaveText(" order summary ")
    await expect(page.locator("//small[text()='Order Id']/../*[@class='col-text -main']")).toHaveText(orderId)

    //await page.pause()

})

test("Verify Order by Login and Creating order using API ", async ({ page }) => {

    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", 
        { 
            data: loginPayLoad 
        })
    expect(loginResponse.ok()).toBe(true);
    token = (await loginResponse.json()).token;
    console.log(`Token is ${token}`)

    page.addInitScript(value => 
        {
            window.localStorage.setItem('token', value);
        }, token);

    
    const createOrderResp = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", 
        { 
            data: orderPayLoad, 
            headers: {
                'Authorization': token,
                'Content-Type' : 'application/json'
            },
        })
    expect(createOrderResp.ok()).toBe(true);

    let orderId = (await createOrderResp.json()).orders[0]
    console.log(`order id is ${orderId}`)

    await page.goto("https://rahulshettyacademy.com/client/#/dashboard/myorders");

    await page.locator("button[routerlink*=myorders]").click()
    const tableRows = await page.locator("table tr")
    await tableRows.first().waitFor()
    await tableRows.filter({
        hasText: orderId
    }).locator("button:has-text('View')").click()

    await expect(page.locator(".email-title")).toHaveText(" order summary ")
    await expect(page.locator("//small[text()='Order Id']/../*[@class='col-text -main']")).toHaveText(orderId)

    //await page.pause()

})

test("Verify Order by Login and Creating order using API - With ApiUtils and Cleaner way", async ({ page }) => {

    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token);

    const orderId = await apiUtils.createOrder(orderPayLoad)

    await page.goto("https://rahulshettyacademy.com/client/#/dashboard/myorders");

    await page.locator("button[routerlink*=myorders]").click()
    const tableRows = await page.locator("table tr")
    await tableRows.first().waitFor()
    await tableRows.filter({
        hasText: orderId
    }).locator("button:has-text('View')").click()

    await expect(page.locator(".email-title")).toHaveText(" order summary ")
    await expect(page.locator("//small[text()='Order Id']/../*[@class='col-text -main']")).toHaveText(orderId)

    //await page.pause()

})