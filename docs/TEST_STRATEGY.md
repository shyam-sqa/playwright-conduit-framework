# Conduit Automation Test Strategy

## Objective

Provide fast, repeatable confidence in Conduit's authentication, publishing, engagement, and
feed-filtering behaviors while demonstrating maintainable UI and API automation practices.

## Scope

In scope:

- Registration and login
- Article creation, retrieval, editing, and deletion
- Article validation, authorization, and missing-resource behavior
- Comment creation
- Favorite state and count synchronization
- Popular-tag filtering
- Critical-path compatibility across Chromium, Firefox, and WebKit

Out of scope for the current public test environment:

- Email verification and password recovery
- Administrative capabilities
- Production data migration
- Backend performance service-level objectives
- Destructive security testing

## Risk-based priorities

| Priority | Risk                                    | Automation response                                    |
| -------- | --------------------------------------- | ------------------------------------------------------ |
| P0       | Users cannot authenticate               | UI and API smoke coverage; focused cross-browser login |
| P0       | Published content is lost or corrupted  | Hybrid UI/API lifecycle verification                   |
| P1       | Authorization permits anonymous writes  | Explicit unauthenticated article-creation test         |
| P1       | Invalid data is accepted                | Required-field and duplicate-account checks            |
| P1       | Engagement state is inconsistent        | Favorite toggle and count polling                      |
| P2       | Feed filters return unrelated content   | Validate tags on every displayed article               |
| P2       | Browser engine differences block access | Firefox and WebKit critical-path smoke test            |

## Test levels and design

API tests validate contracts and negative behavior quickly. UI tests cover rendering and user
workflows. Hybrid tests create prerequisites through APIs and verify only the UI behavior in
scope. The article lifecycle intentionally crosses UI and API layers to confirm persisted data,
not only visible text.

Test techniques represented:

- Positive and negative testing
- Equivalence partitioning for valid and invalid authentication
- Boundary-aware required-field validation
- State-transition testing for favorite/unfavorite and article CRUD
- Contract assertions for status codes and response shapes
- Risk-based cross-browser selection

## Test data strategy

- Generate unique usernames, emails, and article titles for parallel safety.
- Keep credentials test-local and avoid committed secrets.
- Create data through authenticated APIs when setup is not under test.
- Track article slugs in a fixture and delete them during teardown.
- Accept `404` only during cleanup because an explicit UI deletion may already have occurred.

## Reliability controls

- Prefer Playwright auto-waiting and web-first assertions.
- Avoid fixed sleeps and `networkidle` as readiness signals.
- Use semantic locators where the application exposes accessible roles and names.
- Poll only for genuinely asynchronous state, such as favorite counts.
- Run with one CI worker to respect the shared public environment.
- Retry only in CI and retain traces, screenshots, and videos for investigation.

## Entry criteria

- Target web and API environments are reachable.
- Playwright browsers and locked npm dependencies are installed.
- TypeScript, linting, and formatting checks pass.
- No known outage affects the public Conduit environment.

## Exit criteria

- All P0 smoke scenarios pass.
- No unexplained regression failure remains.
- Automatic cleanup completes without masking a test failure.
- CI publishes readable reports and diagnostic artifacts.
- Any accepted environmental failure is documented with evidence.

## CI execution model

- Push and pull request: complete configured suite
- Weekday schedule: tagged regression suite
- Manual dispatch: full, smoke, regression, API, or cross-browser selection
- Chromium: main functional coverage
- Firefox and WebKit: focused cross-browser coverage

## Defect reporting expectations

A useful automation defect includes the failing behavior, expected and actual results,
environment, browser, reproducibility, relevant test data, trace/report attachment, and a concise
risk statement. Framework failures should be separated from confirmed product defects.

## Metrics worth tracking

- Pass rate by suite and browser
- First-run pass rate versus retry pass rate
- Test duration and slowest scenarios
- Failure distribution: product, automation, data, or environment
- Flaky-test recurrence
- Mean time to diagnose using attached evidence
