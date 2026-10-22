# Issue #1 verification and screenshot evidence

Issue: https://github.com/scarlenny/honeytrace/issues/1

Baseline: `55dc073c64fc4f34d01347499e5adb9785883b2d`.
Branch: `fix/1-clarify-simulated-metrics` (uncommitted working tree).

Executed by Hermes automation on the local Mac, against a production server started with:

```bash
npm run start -- --hostname 127.0.0.1 --port 3001
```

## Actual results

- Lint, standalone TypeScript, production build: passed. [Output](quality-checks.txt).
- Existing production route suite: **19 passed, 0 failed**. [Output](route-tests.txt).
- New initial-render DEMO labeling test: **1 passed**. [Output](demo-label-tests.txt).
- Browser mode checks: **6 passed** (desktop and phone DEMO, LIVE, and return to DEMO). [Results](after-results.json).
- Browser regression groups: **10 passed** (5 at each viewport). [Results](regression-results.json).

Viewport sizes: desktop 1440×1000; phone 390×844. All screenshots in this directory were captured by Hermes, not by the student. Before images show the actual baseline before source edits. After images show the rebuilt application. Simulated counters vary naturally and are not expected to match between captures.

## Before and after

| View | Before | After |
|---|---|---|
| Desktop DEMO | [Before](before-demo-desktop.png) | [After](after-demo-desktop.png) |
| Desktop LIVE | [Before](before-live-desktop.png) | [After](after-live-desktop.png) |
| Phone DEMO | [Before](before-demo-phone.png) | [After](after-demo-phone.png) |
| Phone LIVE | [Before](before-live-phone.png) | [After](after-live-phone.png) |

The mode checks found no page-level horizontal overflow. DEMO labeling is visible on both sizes. The footer remains horizontally scrollable by design; its leftmost badge is visible on phones. Uptime remains hidden on phones as before. In LIVE, all three footer metric values become Unavailable, the threat meter is removed, desktop uptime is Unavailable, and the no-backend message is preserved. Returning to DEMO restores labeled simulated values.

The browser regressions verified category counts (47 all, 24 logins, 11 commands, 1 download, 11 connections), case-insensitive search, feed-row navigation to the correct 19-event session, continued mock-data labeling in LIVE, absence of payload links, the 24-of-214 truncated session, and the 4-event scanner session. No captured console errors or window errors were observed on these flows. This is not a comprehensive browser, accessibility, or security audit.

## Test-first evidence and harness corrections

Before editing the app, `python3 scripts/check-demo-labels.py http://127.0.0.1:3001` failed because DEMO DATA was absent. The browser also confirmed missing DEMO DATA and missing LIVE Unavailable behavior at both widths: [before-results.json](before-results.json). The same initial-render test passes after the change.

During browser automation, an early mode assertion ran before the UI update settled; the check was rerun after awaiting the transition. A separate payload-link assertion initially had an invalid JavaScript selector; the test harness was corrected without an app change. The recorded results above are the completed reruns.

## Reproduce

With the production server running:

```bash
python3 scripts/check-demo-labels.py http://127.0.0.1:3001
bash scripts/check-session-routes.sh http://127.0.0.1:3001
```

Browser reproduction: inspect DEMO labels, switch to LIVE and wait for OFFLINE · NO BACKEND, confirm Unavailable values, then return to DEMO. At desktop and phone widths, filter/search the feed and follow a session link. Inspect the truncated and scanner sessions.

No dependencies, mock records, feed/session source, backend integration, or simulator logic were changed. No commit, push, merge, PR, or GitHub issue edit was performed for this implementation.
