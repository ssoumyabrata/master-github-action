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

test("Verify No order Item with mocking response data", async ({ page }) => {

    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token);

    const orderId = await apiUtils.createOrder(orderPayLoad)

    await page.goto("https://rahulshettyacademy.com/client/");

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route => {
            const response = await page.request.fetch(route.request());
            let body = JSON.stringify(fakePayLoadOrders);
            route.fulfill({
                response,
                body,
            });
        }
    )

    //await page.pause();

    await page.locator("button[routerlink*=myorders]").click()
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");
    const errorMsg = await page.locator(".mt-4")
    await expect(errorMsg).toHaveText(" You have No Orders to show at this time. Please Visit Back Us ");

})