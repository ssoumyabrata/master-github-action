const { expect } = require("@playwright/test");

class LoginPage {

    async validLogin(page) {
        const lUsername = page.locator('#userEmail')     
        const lPassword = page.locator('#userPassword')  
        const lSignIn = page.locator("#login")
        const lProduct = page.locator(".card-body")
        await page.goto("https://rahulshettyacademy.com/client")
        console.log(await page.title());
        await lUsername.fill("soumyabratasaha8@gmail.com")
        await lPassword.fill("Password@1")
        await lSignIn.click()
        await lProduct.first().waitFor();
        console.log(await lProduct.allTextContents());
        return page;
    }

}

module.exports = { LoginPage };