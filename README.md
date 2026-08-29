# playwright-typescript-bdd-web-ui-automation

A Playwright + TypeScript + BDD (Cucumber/Gherkin) web UI automation framework built for
reliable, maintainable and scalable end-to-end testing across modern web applications.

It uses [`playwright-bdd`](https://vitalets.github.io/playwright-bdd/) to run Gherkin
feature files on top of the Playwright Test runner, so you get Cucumber-style specs with
Playwright's tracing, parallelism, auto-waiting and HTML reporting.

The sample suite automates the [Sauce Demo](https://www.saucedemo.com/) store
(login → add to cart → checkout).

![Cucumber HTML report dashboard](docs/images/report-dashboard.png)

---

## Table of contents

- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Running tests](#running-tests)
- [Reports](#reports)
- [Configuration](#configuration)
- [Writing a new test](#writing-a-new-test)
- [Design concepts](#design-concepts)
- [Troubleshooting](#troubleshooting)

---

## Tech stack

| Purpose | Tool |
| --- | --- |
| Test runner | `@playwright/test` |
| BDD layer | `playwright-bdd` (Gherkin → Playwright specs) |
| Language | TypeScript (`ts-node`, `commonjs`) |
| Logging | `winston` |
| Env / secrets | `dotenv` |
| Reporting | Playwright HTML, `cucumber-html-reporter`, `multiple-cucumber-html-reporter` |

**Requirements**

- Node.js 18+ (developed on Node 24)
- npm
- OS: macOS / Linux / Windows

---

## Project structure

```
.
├── features/                     # Gherkin .feature files (the specs)
│   └── saudeDemo.feature
├── step-definitions/             # Glue code: Gherkin steps → page actions
│   └── sauceDemo-steps.ts
├── pages/                        # Page Object Model
│   ├── basePage.ts               # Abstract base: page ref, isLoaded(), goto()
│   ├── pageManager.ts            # Aggregates all page objects behind one entry point
│   ├── loginPage.ts
│   ├── inventoryPage.ts
│   ├── cartPage.ts
│   ├── checkout-step-onePage.ts
│   ├── checkout-step-twoPage.ts
│   └── checkout-complete.ts
├── support/
│   ├── globalParamConfig/
│   │   └── fixtures.ts           # Custom playwright-bdd test fixtures (pages, scenarioContext)
│   ├── framework-helpers/
│   │   ├── openUrl.ts            # Navigate + log
│   │   └── getCurrentUrl.ts
│   └── reporting-helpers/
│       └── logger.ts             # Winston console logger
├── env/
│   └── envInfo.ts                # Central config: baseUrl, credentials, timeouts, test data
├── playwright.config.ts          # Playwright + BDD config
├── tsconfig.json                 # TS config + path aliases (@pages/*, @support/*, @config/*)
├── generate-reports.ts           # Single cucumber HTML report generator
├── generate-multiple-html-reports.ts  # multiple-cucumber-html-reporter generator
├── .features-gen/                # AUTO-GENERATED specs from feature files (do not edit / commit)
├── reports/                      # Generated reports & JSON output
│   ├── index.html                # multiple-cucumber-html-reporter dashboard
│   ├── features/                 # per-feature HTML pages
│   ├── cucumber-json/report.json # raw cucumber JSON (report source)
│   └── playwright-html/          # Playwright HTML report
├── docs/images/                  # README screenshots
└── test-results/                 # Playwright artifacts (traces, screenshots) on failure
```

---

## Getting started

### 1. Clone

```bash
git clone https://github.com/QaSquadTech/playwright-typescript-bdd-web-ui-automation.git
cd playwright-typescript-bdd-web-ui-automation
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install
# or just Chromium (the default browser used here):
npx playwright install chromium
```

### 4. (Optional) Create a `.env` file

`.env` is git-ignored. Use it for anything you don't want committed — e.g. log level or
credential overrides:

```bash
LOG_LEVEL=info
```

### 5. Run the sample suite

```bash
npm run test:bdd
```

This runs `bddgen && playwright test`:

1. `bddgen` reads `features/**/*.feature` + `step-definitions/**` and regenerates the
   Playwright specs into `.features-gen/`.
2. `playwright test` executes those generated specs.

You should see a browser open (tests run **headed** by default), drive the Sauce Demo
checkout flow, and finish green.

---

## Running tests

| Command | What it does |
| --- | --- |
| `npm run test:bdd` | Generate specs from features, then run all tests |
| `npx bddgen` | Only regenerate `.features-gen/` specs |
| `npx playwright test` | Run already-generated specs (skips regeneration) |
| `npx playwright test --headed` | Force headed mode |
| `npx playwright test --debug` | Step through with the Playwright Inspector |
| `npx playwright test --workers=1` | Run serially |
| `npx playwright test -g "verify user can login"` | Run a single scenario by title |
| `npm run test:report` | Build a combined HTML report from `reports/*.json` |

### Running by tag

Add tags in the feature file:

```gherkin
@smoke
Scenario: verify user can login
  ...
```

Then filter with the BDD tag flag:

```bash
npx bddgen --tags "@smoke" && npx playwright test
```

> Note: the `test:smoke` script in `package.json` currently calls `cucumber-js` directly,
> which is not the runner this framework uses. Prefer the `bddgen --tags` approach above.

---

## Reports

The framework produces two kinds of HTML report after every run.

### 1. Multiple Cucumber HTML report (`reports/index.html`)

Built by `multiple-cucumber-html-reporter` from the cucumber JSON. Gives a
dashboard with feature/scenario pass-rate doughnuts, a run-info panel, and a
searchable features table that drills into each scenario's steps.

```bash
npm run test:report          # regenerate from reports/*.json
open reports/index.html       # macOS ('start' on Windows, 'xdg-open' on Linux)
```

**Dashboard**

![Cucumber HTML report dashboard](docs/images/report-dashboard.png)

**Feature drill-down**

![Cucumber HTML report feature view](docs/images/report-feature.png)

### 2. Playwright HTML report (`reports/playwright-html/`)

Generated automatically by the Playwright `html` reporter. Best for
investigating failures — it embeds traces, screenshots and step timings.

```bash
npx playwright show-report reports/playwright-html
```

![Playwright HTML report](docs/images/playwright-html-report.png)

Traces are retained on failure (`trace: 'retain-on-failure'`); open one with:

```bash
npx playwright show-trace test-results/<path-to-trace>.zip
```

### Cucumber JSON

`playwright-bdd`'s `cucumberReporter('json', ...)` writes `reports/cucumber-json/report.json`
— this is the source consumed by the HTML reporters above.

### Single-file Cucumber HTML report (optional)

```bash
npx ts-node generate-reports.ts
```

> `generate-reports.ts` expects `reports/cucumber_report.json`. Adjust the `jsonFile`
> path (or the reporter `outputFile` in `playwright.config.ts`) so they line up.

---

## Configuration

### `env/envInfo.ts`

Single source of truth for environment data:

```ts
export const ENVINFO = {
    ui:          { baseUrl: "https://www.saucedemo.com/" },
    credentials: { defaultUsername: "standard_user", defaultPassword: "secret_sauce" },
    execution:   { defaultTimeout: 60000 },
    personalData:{ firstName: "Arif", lastName: "Aman", postCode: "3000" },
}
```

To target another environment, change `baseUrl` / credentials here (or wire these values
to `process.env` and supply them via `.env`).

### `playwright.config.ts` highlights

| Setting | Value | Notes |
| --- | --- | --- |
| `features` | `features/**/*.feature` | Where Gherkin lives |
| `steps` | `step-definitions/**/*.ts`, `support/globalParamConfig/fixtures.ts` | Step + fixture sources |
| `timeout` | `ENVINFO.execution.defaultTimeout` (60s) | Per-test timeout |
| `fullyParallel` | `true` | Files run in parallel |
| `retries` | `2` on CI, `0` locally | |
| `workers` | `1` on CI, unlimited locally | |
| `headless` | `false` | Runs headed; set `true` for CI |
| `testIdAttribute` | `data-test` | `getByTestId()` maps to `data-test` |
| `trace` | `retain-on-failure` | |
| `screenshot` | `only-on-failure` | |
| `browserName` | `chromium` | Firefox/WebKit projects are stubbed in the config |

For CI, set `headless: true` (or run with `CI=true` and add a headless override) and
consider enabling the commented-out `projects` block for cross-browser runs.

### Path aliases (`tsconfig.json`)

```
@pages/*    → pages/*
@support/*  → support/*
@config/*   → config/*
```

---

## Continuous integration

Workflow: [`.github/workflows/ci.yml`](.github/workflows/ci.yml) — **E2E Tests**.

**Triggers:** push to `main`, pull request targeting `main`, and manual
`workflow_dispatch`.

**Job** (`Run Playwright BDD tests`, `ubuntu-latest`, 30-min timeout):

| Step | Command |
| --- | --- |
| Checkout | `actions/checkout@v4` |
| Node.js | `actions/setup-node@v4` — Node 20, npm cache |
| Install deps | `npm ci` |
| Install browsers | `npx playwright install --with-deps chromium` |
| Run tests | `xvfb-run -a npm run test:bdd` — config runs headed, so CI needs a virtual display |
| Build report | `cp reports/cucumber-json/report.json reports/report.json` then `npm run test:report` |
| Upload report | `actions/upload-artifact@v4` → **`cucumber-html-report`** (`reports/index.html`) |
| Upload PW report | `actions/upload-artifact@v4` → **`playwright-report`** (`reports/playwright-html/`) |

The report/upload steps use `if: ${{ !cancelled() }}` so artifacts are still
published when tests fail. Artifacts are kept for 30 days — download them from the
run's summary page.

> The `cucumber-html-report` artifact currently uploads only `reports/index.html`.
> That page needs its sibling `reports/assets/` and `reports/features/` folders to
> render — point the artifact `path:` at `reports/` (or list the extra paths) to
> get a browsable report.

---

## Writing a new test

### 1. Add a scenario — `features/<name>.feature`

```gherkin
Feature: verify sauceDemo website

  Scenario: verify user can login
    Given I navigate to the website
    When I login with default credentials
    Then I add the item "Sauce Labs Backpack" to cart
    And I complete express checkout
```

### 2. Implement the steps — `step-definitions/<name>-steps.ts`

```ts
import { createBdd } from "playwright-bdd";
import { test } from "@support/globalParamConfig/fixtures";
import { PageManager } from "@pages/pageManager";
import { expect } from "@playwright/test";

const { Given } = createBdd(test);

Given(/^I login with default credentials$/, async function ({ page }) {
    const pm = new PageManager(page);
    await pm.loginPage.isLoaded();
    await pm.loginPage.loginAsDefaultUser();
    expect(await pm.inventoryPage.isLoaded()).toBeTruthy();
});
```

### 3. Add / extend a Page Object — `pages/<name>Page.ts`

```ts
import { Locator, Page } from "@playwright/test";
import { BasePage } from "@pages/basePage";

export class LoginPage extends BasePage {
    private username: Locator;

    constructor(page: Page) {
        super(page);
        this.username = page.getByPlaceholder("Username");
    }

    async isLoaded(): Promise<boolean> { /* ... */ return true; }
}
```

Register it in `pages/pageManager.ts` so it's reachable via `new PageManager(page).<page>`.

### 4. Run it

```bash
npm run test:bdd
```

---

## Design concepts

- **BDD-first** — feature files are the specification; `playwright-bdd` compiles them into
  Playwright specs under `.features-gen/` at runtime. Never edit `.features-gen/` by hand.
- **Page Object Model** — every page extends `BasePage` (which mandates an `isLoaded()`
  method used as an explicit synchronization point). `PageManager` is the single façade
  that instantiates and exposes all page objects.
- **Fixtures** — `support/globalParamConfig/fixtures.ts` extends the `playwright-bdd`
  `test` object with a `pages` (PageManager) fixture and a `scenarioContext` bag for
  sharing state between steps in a scenario.
- **Centralised config** — no magic strings in tests; URLs, credentials, timeouts and
  test data all live in `env/envInfo.ts`.
- **Helpers** — thin reusable utilities in `support/framework-helpers/`
  (`openUrl`, `getCurrentUrl`) and a Winston logger in `support/reporting-helpers/`.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Cannot find module '@pages/...'` | Run through `ts-node`/Playwright (aliases come from `tsconfig.json`); run `npm install`. |
| Steps not found / specs stale | Re-run `npx bddgen` (or `npm run test:bdd`). |
| Browser not installed | `npx playwright install chromium`. |
| Tests hang on `waitForURL` | Check `ENVINFO.ui.baseUrl` and network access to saucedemo.com. |
| Want headless runs | Set `use.headless: true` in `playwright.config.ts`. |
| Cucumber HTML report empty | Ensure the JSON path in `generate-reports.ts` matches the reporter output in `playwright.config.ts`. |
| Flaky first run | Browsers download on first `npm install`; give the initial run extra time. |

---

## npm scripts reference

```jsonc
"scripts": {
  "test:smoke":  "npx cucumber-js --tags @smoke",          // legacy; prefer: bddgen --tags "@smoke" && playwright test
  "test:report": "ts-node generate-multiple-html-reports.ts",
  "test:bdd":    "bddgen && playwright test"                // primary entry point
}
```
