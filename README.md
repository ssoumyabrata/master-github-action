# Automation Exercise - Playwright Tests

This project contains Playwright test cases for [automationexercise.com](https://automationexercise.com/), a practice website for automation engineers.

## Test Cases Included

1. **Test Case 1: Register User** - Tests user registration functionality
2. **Test Case 2: Login User** - Tests login with correct credentials
3. **Test Case 3: Login with incorrect credentials** - Tests error handling for invalid login
4. **Test Case 4: Logout User** - Tests logout functionality
5. **Test Case 6: Contact Us Form** - Tests the contact form submission
6. **Test Case 8: Verify All Products** - Tests product page and product details
7. **Test Case 9: Search Product** - Tests product search functionality

## Setup

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

```bash
npm install
```

This will install Playwright and all necessary dependencies.

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests with debug mode
```bash
npm run test:debug
```

### Run tests in UI mode (interactive mode)
```bash
npm run test:ui
```

### View test report
```bash
npm run test:report
```

## Project Structure

```
├── tests/
│   ├── auth.spec.ts          # Authentication tests (Register, Login, Logout)
│   ├── contactUs.spec.ts     # Contact form tests
│   └── search.spec.ts        # Product search and browse tests
├── playwright.config.ts       # Playwright configuration
├── package.json               # Project dependencies and scripts
└── README.md                  # This file
```

## Configuration

The `playwright.config.ts` file contains:
- Test directory path
- Browser types (Chromium, Firefox, WebKit)
- Base URL: https://automationexercise.com
- Screenshot capture on failure
- HTML report generation

## Features

- ✅ Cross-browser testing (Chrome, Firefox, Safari)
- ✅ Automatic screenshots on failure
- ✅ HTML test reports
- ✅ Parallel test execution
- ✅ Retry logic for flaky tests

## CI/CD Integration

These tests are designed to run in GitHub Actions. Update `.github/workflows/first-action.yml` to include:

```yaml
- name: Run Playwright tests
  run: npm test
```

## Notes

- Tests create unique email addresses using timestamps to avoid conflicts
- Some tests may need data-qa attributes to exist on the website
- Adjust selectors in test files if the website structure changes
- Tests currently run sequentially in CI environments for stability

## Troubleshooting

If tests fail:
1. Check if the website is accessible: https://automationexercise.com
2. Verify element selectors exist on the page (use Playwright Inspector)
3. Check browser logs for JavaScript errors
4. Review test reports in `playwright-report/` folder

## License

These tests are for educational purposes on automationexercise.com
