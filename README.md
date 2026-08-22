# Playwright Conduit Automation Framework

[![Playwright Quality Pipeline](https://github.com/shyam-sqa/playwright-conduit-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/shyam-sqa/playwright-conduit-framework/actions/workflows/playwright.yml)

A portfolio-grade UI and API automation framework for the
[Conduit application](https://conduit.bondaracademy.com/), built with Playwright, TypeScript,
custom fixtures, page objects, API clients, and GitHub Actions.

The project demonstrates practical automation QA skills: risk-based coverage, isolated test
data, API-assisted UI testing, automatic cleanup, negative testing, cross-browser validation,
CI quality gates, and failure diagnostics.

## What the framework demonstrates

- UI and REST API automation in one Playwright project
- Page Object Model with typed domain objects
- Test-scoped authenticated and anonymous fixtures
- API-created test data to keep UI tests focused and fast
- Guaranteed article cleanup, including after failures
- Positive, negative, authorization, validation, and not-found coverage
- Smoke, regression, API, and cross-browser test selection
- Chromium regression coverage with focused Firefox and WebKit checks
- Strict TypeScript, ESLint, Prettier, and automated CI enforcement
- HTML, JUnit, traces, screenshots, videos, and GitHub annotations

## Architecture

```text
tests/                     Business scenarios and assertions
├── api/                   REST contract and negative tests
├── auth.spec.ts           Registration and login scenarios
├── articlee2e.spec.ts     Hybrid UI + API lifecycle scenario
├── favorites.spec.ts      API setup followed by UI verification
└── filterArticle.spec.ts  Feed filtering behavior
        │
        ├── pages/         UI interactions and page-level expectations
        ├── api/           Typed HTTP clients
        ├── fixtures/      Authentication, contexts, and automatic cleanup
        ├── models/        Shared TypeScript domain contracts
        └── config/        Environment-specific URLs
```

Tests describe user behavior. Page objects own UI interaction, API clients own HTTP behavior,
and fixtures own setup and teardown. This separation keeps failures easier to diagnose and
reduces duplicated test code.

## Coverage snapshot

| Area           | Positive coverage              | Negative or risk coverage                           | Layer                     |
| -------------- | ------------------------------ | --------------------------------------------------- | ------------------------- |
| Authentication | Registration and valid login   | Unknown user, incorrect password, duplicate account | UI + API                  |
| Articles       | Create, retrieve, edit, delete | Anonymous creation, missing fields, unknown slug    | UI + API                  |
| Comments       | Add and display comment        | Planned validation extensions                       | UI                        |
| Favorites      | Add and remove favorite        | Count synchronization                               | UI with API setup         |
| Feed           | Filter by every popular tag    | Each returned article is validated independently    | UI                        |
| Compatibility  | Login smoke scenario           | Browser-specific regressions                        | Chrome + Firefox + WebKit |

The current configuration discovers **16 executions across 6 specification files**. Chromium
runs the main suite; Firefox and WebKit run the focused `@cross-browser` scenario.

See [Test Strategy](docs/TEST_STRATEGY.md) for risk priorities, test design, and exit criteria.

## Getting started

Requirements:

- Node.js 24 or a current LTS release
- npm

```bash
git clone git@github.com:shyam-sqa/playwright-conduit-framework.git
cd playwright-conduit-framework
npm ci
npx playwright install
npm test
```

No credentials are required. Tests create unique users through the public Conduit API.

## Running selected suites

| Command                      | Purpose                                   |
| ---------------------------- | ----------------------------------------- |
| `npm test`                   | Complete configured suite                 |
| `npm run test:smoke`         | Fast critical-path checks                 |
| `npm run test:regression`    | Tagged regression coverage                |
| `npm run test:api`           | API specifications only                   |
| `npm run test:cross-browser` | Focused Chrome, Firefox, and WebKit check |
| `npm run test:headed`        | Visible browser execution                 |
| `npm run test:debug`         | Playwright Inspector debugging            |
| `npm run test:ui`            | Interactive Playwright UI mode            |
| `npm run report`             | Open the most recent HTML report          |

Run all repository quality gates with:

```bash
npm run check
```

## Environment configuration

Defaults are defined in `config/environment.ts` and can be overridden without editing code:

```bash
BASE_URL=https://example-web.test/ \
API_BASE_URL=https://example-api.test/ \
npm test
```

Copy `.env.example` as documentation for the supported values. Environment variables should be
injected by the shell or CI environment; secret files are ignored by Git.

## Test data and cleanup

Each test receives an isolated user. Authenticated API contexts include that user's token, while
anonymous contexts support authorization testing. `articleApi.createTrackedArticle()` records
created articles and deletes them during fixture teardown—even when the test body fails.

UI-created articles call `trackForCleanup()` as soon as their slug is available. Explicit UI
deletion remains part of the lifecycle test, and teardown safely accepts an already-deleted
resource. This prevents test pollution without hiding the behavior under test.

## CI/CD pipeline

GitHub Actions runs on pushes and pull requests to `main`, on weekday schedules, and manually
with a selectable suite. The pipeline:

1. Restores the npm cache and installs locked dependencies.
2. Enforces TypeScript, ESLint, and Prettier in a dedicated quality job.
3. Installs supported Playwright browsers.
4. Executes the requested suite with CI retries and one worker.
5. Adds GitHub annotations and a run summary.
6. Uploads HTML and JUnit reports plus failure traces, screenshots, and videos.

Concurrent runs for the same branch are cancelled so obsolete commits do not consume runner
time. Scheduled runs execute the regression suite.

## Diagnosing failures

1. Read the GitHub annotation or terminal error first.
2. Download `playwright-report-*` from the workflow run and open `index.html`.
3. Inspect the trace for DOM snapshots, network activity, and action timing.
4. Use the retained screenshot or video to confirm visible application state.
5. Reproduce locally with the same tag or project, for example:

```bash
npx playwright test --grep @smoke --project=chromium
npx playwright show-trace test-results/<test-name>/trace.zip
```

## Engineering decisions

- API setup is preferred when UI setup is not the behavior under test.
- Semantic locators are preferred; CSS is limited to application structures without accessible
  identifiers.
- Assertions remain in tests or explicit expectation methods so intent stays visible.
- Cross-browser scope is risk-based instead of multiplying every API and UI test unnecessarily.
- Retries are CI-only and failure evidence is retained, making flaky behavior observable rather
  than silently ignored.

## Planned extensions

- Accessibility checks with axe-core
- JSON schema validation for core API contracts
- Mobile viewport smoke coverage
- Mocked network-failure scenarios
- Performance baselines for critical API endpoints
