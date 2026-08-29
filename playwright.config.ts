import {defineConfig} from '@playwright/test';
import {cucumberReporter, defineBddConfig} from "playwright-bdd";
import {ENVINFO} from "./env/envInfo";

const testDir = defineBddConfig({
    features: 'features/**/*.feature',
    steps: ['step-definitions/**/*.ts', 'support/globalParamConfig/fixtures.ts'],
});

export default defineConfig({

    testDir,
    timeout: ENVINFO.execution.defaultTimeout,
    // testDir: './tests',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        ['html', {outputFolder: 'reports/playwright-html', open: 'never'}],
        cucumberReporter('json', {outputFile: 'reports/cucumber-json/report.json'}),
    ],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('')`. */
        // baseURL: 'http://localhost:3000',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'retain-on-failure',
        navigationTimeout: 30000,
        actionTimeout: 10000,
        testIdAttribute: 'data-test',
        screenshot: "only-on-failure",
        headless: false,
        launchOptions: {
            args: ['--start-maximized'],
        },
        browserName: "chromium",
        ignoreHTTPSErrors: true,
        viewport: null,
        permissions: ['geolocation'],
    },

    /* Configure projects for major browsers */
    // projects: [
    // {
    //     name: 'chromium',
    //     use: {...devices['Desktop Chrome']},
    // },
    //
    // {
    //     name: 'firefox',
    //     use: {...devices['Desktop Firefox']},
    // },
    //
    // {
    //     name: 'webkit',
    //     use: {...devices['Desktop Safari']},
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
    // ],

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   url: 'http://localhost:3000',
    //   reuseExistingServer: !process.env.CI,
    // },
});