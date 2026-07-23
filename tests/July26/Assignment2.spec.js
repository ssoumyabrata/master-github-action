const { test, expect, request } = require('@playwright/test');


const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const API_URL = 'https://api.eventhub.rahulshettyacademy.com/api';
const yahooEmail = "testdata_saha@yahoo.in";
const gmailEmail = "soumyabratasaha8@gmail.com";
const password = "Password@1";
const yahooLoginPayLoad = { email: yahooEmail, password: password };
let token;

test('Verify booking using yahoo not accessible using gmail id', async ({ page }, testInfo) => {

    const apiContext = await request.newContext();
    token = await loginAndGetToken(apiContext);
    //console.log(`Token is ${token}`);

    const eventId = await getRandomEventId(apiContext);
    console.log(`eventId is ${eventId}`);

    const bookingId = await createBooking(apiContext, eventId);
    console.log(`Booked ID = ${bookingId}`);

    await takeBookingScreenshot(page, testInfo);

    page = await loginToEventApp(gmailEmail, password, page);
    await verifyAccessDenied(page, bookingId, testInfo);

    //cleaning the bookings for repetitive execution
    await deleteAllBookings(apiContext)

});

async function takeBookingScreenshot(page, testInfo) {
    await test.step('Take booking screenshot', async () => {
        await page.goto(BASE_URL);
        await page.evaluate((t) => window.localStorage.setItem('eventhub_token', t), token);
        await page.goto(BASE_URL + '/bookings');
        await expect(page.getByText('View and manage all your ticket bookings')).toBeVisible();
        await page.screenshot({ path: testInfo.outputPath('booking.png') });
    });
}

async function deleteAllBookings(apiContext) {
    await test.step('Delete all bookings (cleanup)', async () => {
        const getBookingsResp = await apiContext.get(API_URL + '/bookings', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });
        await expect(getBookingsResp.ok()).toBe(true);
        const bookings = (await getBookingsResp.json()).data;

        for (const booking of bookings) {
            const deleteResp = await apiContext.delete(`${API_URL}/bookings/${booking.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            console.log(`Deleted booking ${booking.id}: ${deleteResp.status()}`);
        }
    });
}

async function loginToEventApp(user, pwd, page) {
    await test.step(`Login as ${user}`, async () => {
        await page.goto(`${BASE_URL}/login`);
        await page.waitForLoadState('networkidle');
        await page.locator('input[type="email"], input[type="text"]').first().fill(user);
        await page.locator('input[type="password"]').fill(pwd);
        await page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In"), button:has-text("Log In")').first().click();
        await expect(page.locator("#nav-bookings")).toBeVisible();
    });
    return page;
}

async function loginAndGetToken(apiContext) {
    return await test.step('Login via API and get token (Yahoo)', async () => {
        const loginResp = await apiContext.post(API_URL + '/auth/login', { data: yahooLoginPayLoad });
        await expect(loginResp.ok()).toBe(true);
        return (await loginResp.json()).token;
    });
}

async function getRandomEventId(apiContext) {
    return await test.step('Fetch events and pick a random event ID', async () => {
        const getEventsResp = await apiContext.get(API_URL + '/events', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });
        await expect(getEventsResp.ok()).toBe(true);
        const respJson = await getEventsResp.json();
        const randomIndex = Math.floor(Math.random() * respJson.data.length);
        return respJson.data[randomIndex].id;
    });
}

async function createBooking(apiContext, eventId) {
    return await test.step('Create booking via API (Yahoo)', async () => {
        const bookEventResp = await apiContext.post(API_URL + '/bookings', {
            data: {
                "eventId": eventId,
                "customerName": "Yahoo User",
                "customerEmail": yahooEmail,
                "customerPhone": "+91-9555595632",
                "quantity": 2
            },
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });
        await expect(bookEventResp.ok()).toBe(true);
        return (await bookEventResp.json()).data.id;
    });
}

async function verifyAccessDenied(page, bookingId, testInfo) {
    await test.step('Verify Access Denied for gmail user', async () => {
        await page.goto(BASE_URL + `/bookings/${bookingId}`);
        await expect(page.getByRole('heading', { name: 'Access Denied' })).toBeVisible();
        await page.screenshot({ path: testInfo.outputPath('AccessDenied.png') });
    });
}