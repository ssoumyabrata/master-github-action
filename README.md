# Playwright JS - GitHub Actions

A Playwright test automation learning project using JavaScript, covering UI testing, API testing, network mocking, and the Page Object Model (POM).

## Prerequisites

- Node.js v16+
- npm

## Setup

```bash
npm install
npx playwright install
```

## Running Tests

```bash
npm test                # Run all tests
npm run test:headed     # Run with visible browser
npm run test:debug      # Run in debug mode
npm run test:ui         # Interactive UI mode
npm run test:report     # Open HTML report
```

## Project Structure

```
tests/
├── May26/              # SauceDemo UI tests + Page Object Model
│   ├── saucedemo-tests.spec.js
│   └── pages/SwagLabsPage.js
├── Jun26/              # Login, locators, API order flow
│   ├── practise-website.spec.js
│   ├── WebAPI.spec.js
│   └── ...
├── July26/             # Network mocking (request & response), storage state
│   ├── NetworkTestMockReq.spec.js
│   ├── NetworkTestMockResp.spec.js
│   └── WebAPI2.spec.js
├── pages/
│   └── LoginPage.js    # Shared login POM
└── utils/
    └── ApiUtils.js     # API helpers (login, create order)
```

## Key Concepts Covered

- **Page Object Model** — `LoginPage`, `SwagLabsPage`
- **API Testing** — Login, create order via Playwright `request`
- **Network Mocking** — Mock API requests and responses with `page.route()`
- **Storage State** — Reuse authenticated sessions across tests
- **Hybrid Testing** — API setup + UI verification

## Configuration

`playwright.config.js` — base URL: `https://www.saucedemo.com/`, trace/screenshot/video on, 60s timeout, Chromium only (other browsers commented out).

## CI/CD

Designed to run in GitHub Actions. Workers are limited to 1 in CI; retries set to 2.
