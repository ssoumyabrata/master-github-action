const { expect } = require("@playwright/test");

class ApiUtils {


    constructor(apiContext, loginPayLoad) {
        this.apiContext = apiContext
        this.loginPayLoad = loginPayLoad
        this.token = null;
    }

    async getLoginToken() {
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
            {
                data: this.loginPayLoad
            })
        expect(loginResponse.ok()).toBe(true);
        this.token = (await loginResponse.json()).token;
        console.log(`Token is ${this.token}`)
        return this.token
    }

    async createOrder(orderPayLoad) {
        const createOrderResp = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
            {
                data: orderPayLoad,
                headers: {
                    'Authorization': this.token,
                    'Content-Type': 'application/json'
                },
            })
        expect(createOrderResp.ok()).toBe(true);

        let orderId = (await createOrderResp.json()).orders[0]
        console.log(`order id is ${orderId}`)
        return orderId
    }

}

module.exports = { ApiUtils };