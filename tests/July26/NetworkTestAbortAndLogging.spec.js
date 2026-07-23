const { test, expect, request } = require("@playwright/test");
const { ApiUtils } = require("../utils/ApiUtils")

const loginPayLoad = { userEmail: "soumyabratasaha8@gmail.com", userPassword: "Password@1" }
const orderPayLoad = { orders: [{ country: "Cuba", productOrderedId: "6960ea76c941646b7a8b3dd5" }] }
let token;
let apiUtils
let fakePayLoadOrders = { data: [], message: "No Orders" };

test.beforeAll(async () => {
    const apiContext = await request.newContext();
    apiUtils = new ApiUtils(apiContext, loginPayLoad)
    token = await apiUtils.getLoginToken()

});

test.beforeEach(async () => {

})

test("Verify No Image Load and API Logging for Req-Resp", async ({ page }) => {

    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token);

    page.route('**/*.{jpg,png,jpeg}', route=> route.abort());
    page.on('request', request => console.log(request.url()));
    page.on('response', response => console.log(response.url(), response.status()))



    await page.goto("https://rahulshettyacademy.com/client/");

    await page.locator("button[routerlink*=myorders]").click()

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        route => route.continue({
            url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=4546454655646545"
        })
    )

    await page.locator("button:has-text('View')").nth(0).click();
    await expect(page.locator(".blink_me")).toHaveText("You are not authorize to view this order");

})