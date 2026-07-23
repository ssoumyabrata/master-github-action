const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';

const SIX_EVENTS_RESPONSE = {
  data: [
    { id: 1, title: 'Tech Summit 2025',    category: 'Conference', eventDate: '2027-06-01T10:00:00.000Z', venue: 'HICC',                                    city: 'Hyderabad',  price: '999',  totalSeats: 200,  availableSeats: 150,  imageUrl: null, isStatic: false, userId: null, description: 'Tech Summit 2025 description.',    createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
    { id: 2, title: 'Rock Night Live',      category: 'Concert',    eventDate: '2027-06-05T18:00:00.000Z', venue: 'Palace Grounds',                          city: 'Bangalore',  price: '1500', totalSeats: 500,  availableSeats: 300,  imageUrl: null, isStatic: false, userId: null, description: 'Rock Night Live description.',      createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
    { id: 3, title: 'IPL Finals',           category: 'Sports',     eventDate: '2027-06-10T19:30:00.000Z', venue: 'Chinnaswamy',                             city: 'Bangalore',  price: '2000', totalSeats: 800,  availableSeats: 50,   imageUrl: null, isStatic: false, userId: null, description: 'IPL Finals description.',          createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
    { id: 4, title: 'UX Design Workshop',   category: 'Workshop',   eventDate: '2027-06-15T09:00:00.000Z', venue: 'WeWork',                                  city: 'Mumbai',     price: '500',  totalSeats: 50,   availableSeats: 20,   imageUrl: null, isStatic: false, userId: null, description: 'UX Design Workshop description.',  createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
    { id: 5, title: 'Lollapalooza India',   category: 'Festival',   eventDate: '2027-06-20T12:00:00.000Z', venue: 'Mahalaxmi Racecourse',                    city: 'Mumbai',     price: '3000', totalSeats: 5000, availableSeats: 2000, imageUrl: null, isStatic: false, userId: null, description: 'Lollapalooza India description.',  createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
    { id: 6, title: 'AI & ML Expo',         category: 'Conference', eventDate: '2027-06-25T10:00:00.000Z', venue: 'Bangalore International Exhibition Centre', city: 'Bangalore',  price: '750',  totalSeats: 300,  availableSeats: 180,  imageUrl: null, isStatic: false, userId: null, description: 'AI & ML Expo description.',        createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
  ],
  pagination: { page: 1, totalPages: 1, total: 6, limit: 12 },
};

const FOUR_EVENTS_RESPONSE = {
  data: [
    { id: 1, title: 'Tech Summit 2025',    category: 'Conference', eventDate: '2027-06-01T10:00:00.000Z', venue: 'HICC',           city: 'Hyderabad', price: '999',  totalSeats: 200, availableSeats: 150, imageUrl: null, isStatic: false, userId: null, description: 'Tech Summit 2025 description.',    createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
    { id: 2, title: 'Rock Night Live',      category: 'Concert',    eventDate: '2027-06-05T18:00:00.000Z', venue: 'Palace Grounds', city: 'Bangalore', price: '1500', totalSeats: 500, availableSeats: 300, imageUrl: null, isStatic: false, userId: null, description: 'Rock Night Live description.',      createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
    { id: 3, title: 'IPL Finals',           category: 'Sports',     eventDate: '2027-06-10T19:30:00.000Z', venue: 'Chinnaswamy',    city: 'Bangalore', price: '2000', totalSeats: 800, availableSeats: 50,  imageUrl: null, isStatic: false, userId: null, description: 'IPL Finals description.',          createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
    { id: 4, title: 'UX Design Workshop',   category: 'Workshop',   eventDate: '2027-06-15T09:00:00.000Z', venue: 'WeWork',         city: 'Mumbai',    price: '500',  totalSeats: 50,  availableSeats: 20,  imageUrl: null, isStatic: false, userId: null, description: 'UX Design Workshop description.',  createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
  ],
  pagination: { page: 1, totalPages: 1, total: 4, limit: 12 },
};

async function loginAndGoToEvents(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');
  await page.locator('input[type="email"], input[type="text"]').first().fill('soumyabratasaha8@gmail.com');
  await page.locator('input[type="password"]').fill('Password@1');
 // await page.pause()
  await page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In"), button:has-text("Log In")').first().click();
  
  await expect(page.locator("#nav-bookings")).toBeVisible();
  await page.goto(`${BASE_URL}/events`);
}

test('Test 1 - Banner IS visible when 6 events are returned', async ({ page }) => {
  // Step 1 — Set up the API mock
  await page.route('**/api/events**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(SIX_EVENTS_RESPONSE),
    });
  });

  // Step 2 — Login and navigate
  await loginAndGoToEvents(page);

  // Step 3 — Verify cards loaded from mock
  const cards = page.getByTestId('event-card');
  await expect(cards.first()).toBeVisible();
  await expect(cards).toHaveCount(6);

  // Step 4 — Verify banner is visible
  const banner = page.getByText(/sandbox holds up to/i);
  await expect(banner).toBeVisible();
  await expect(banner).toContainText('9 bookings');
});

test('Test 2 - Banner is NOT visible when 4 events are returned', async ({ page }) => {
  // Step 1 — Set up the API mock
  await page.route('**/api/events**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(FOUR_EVENTS_RESPONSE),
    });
  });

  // Step 2 — Login and navigate
  await loginAndGoToEvents(page);

  // Step 3 — Verify cards loaded from mock
  const cards = page.getByTestId('event-card');
  await expect(cards.first()).toBeVisible();
  await expect(cards).toHaveCount(4);

  // Step 4 — Verify banner is hidden
  const banner = page.getByText(/sandbox holds up to/i);
  await expect(banner).not.toBeVisible();
});
