const { test, expect, request } = require("@playwright/test");
const { ApiUtils } = require("./utils/ApiUtils");
const { LoginPage } = require("./pages/LoginPage");

const orderPayLoad = { orders: [{ country: "Cuba", productOrderedId: "6960ea76c941646b7a8b3dd5" }] }
let token;
let apiUtils;

let webContext;

test.beforeAll(async ({ browser }) => {

    const context = await browser.newContext();
    let page = await context.newPage();
    page = await new LoginPage().validLogin(page);
    await context.storageState({ path: 'state.json' });

    webContext = await browser.newContext({ storageState: 'state.json' });

    token = await page.evaluate(() => localStorage.getItem('token'));
    const apiContext = await request.newContext();
    apiUtils = new ApiUtils(apiContext, null, apiUtils);
    
});

test.beforeEach(async () => {

})

test("Verify Order by Login and Creating order using API - using Storage State", async () => {

    
    const page = await webContext.newPage();
    
    //await page.pause()

    const orderId = await apiUtils.createOrder(orderPayLoad, token);

    await page.goto("https://rahulshettyacademy.com/client/#/dashboard/myorders");

    await page.locator("button[routerlink*=myorders]").click()
    const tableRows = await page.locator("table tr")
    await tableRows.first().waitFor()
    await tableRows.filter({
        hasText: orderId
    }).locator("button:has-text('View')").click()

    await expect(page.locator(".email-title")).toHaveText(" order summary ")
    await expect(page.locator("//small[text()='Order Id']/../*[@class='col-text -main']")).toHaveText(orderId)



})