const { test } = require("@playwright/test");

test("pop up handling in playwright", async({page}) =>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    page.on('dialog', dialog => dialog.accept());
    await page.locator("#confirmbtn").click();

    const framespage = page.frameLocator("#courses-iframe")
    await framespage.locator("li a[href*='lifetime-access']:visible").click()
    console.log(await framespage.locator(".text h2").textContent())



    await page.pause();

})
