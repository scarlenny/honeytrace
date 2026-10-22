# HoneyTrace test log

Execution time: 2026-10-21T16:32:31.918026-04:00

Executed by Hermes automation on the local Mac, not represented as student-performed manual tests. Production server: `http://127.0.0.1:3001`.

## Browser tests

| ID | Test | Expected | Actual observation | Result | Evidence |
|---|---|---|---|---|---|
| T1 | Open Attack Feed | 47 of 47 events and simulation notice | Showing 47 of 47 events; SIMULATED DATA visible | PASS | [Screenshot](evidence/test-01-feed.png) |
| T2 | Commands filter | 11 of 47 events | Showing 11 of 47 events | PASS | [Screenshot](evidence/test-02-commands.png) |
| T3 | Search uname -a | One matching command event | Showing 1 of 47 events; one table row containing uname -a | PASS | [Screenshot](evidence/test-03-search.png) |
| T4 | Open session from filtered feed row | Matching session detail with timeline | Navigated to /sessions/c0a8e1f2b3d4; details and timeline rendered | PASS | [Screenshot](evidence/test-04-session-link.png) |
| T5 | Unknown session ID | Signal lost page and HTTP 404 | Signal lost page rendered; HTTP status checked in route suite | PASS | [Screenshot](evidence/test-05-unknown-session.png) |
| T6 | Truncated brute-force session | 24 of 214 events; 190 omitted | Partial timeline notice visible; 24 raw-event disclosures; 214 recorded and 190 omitted | PASS | [Screenshot](evidence/test-06-truncated.png) |

## Automated route suite

Command: `bash scripts/check-session-routes.sh http://127.0.0.1:3001`

Actual result: **19 passed, 0 failed**. Full output: [route-tests.txt](evidence/route-tests.txt). Valid sessions return 200, unknown/case-variant IDs return 404, malformed encoding returns 400.

## Failure investigated

The student reported a run with 0 passed and 19 failed (HTTP 000). Hermes independently confirmed that the server was not listening, restarted it, and reran with an explicit plain URL; 19 checks passed. The `@url:` wrapper in pasted chat text may also indicate a separate formatting/environment issue; it was not established as the cause. HTTP 000 is not an application HTTP response.

## Scope and limitations

All data is simulated. These tests cover the listed interactions and routes, not every feature, accessibility requirement, or security property. No live AI calls or honeypot ingestion exist. Screenshots and JSON contain actual execution evidence. The test harness initially used mixed-case text for a CSS-uppercase heading and failed its own assertion; correcting that assertion did not require an app change.

No packages, application source, commits, or GitHub resources were changed by this test run.
