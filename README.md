# HoneyTrace

**An educational SSH honeypot activity explorer for the AI 101 midterm.**

HoneyTrace helps introductory cybersecurity students understand security logs by browsing simulated login attempts, commands, and session timelines. A honeypot is a decoy system used to observe suspicious activity. This prototype uses synthetic records; it does not operate a live honeypot or provide production security monitoring.

## Working features

### Attack Feed — `/feed`

- Browse 47 included events from three mock sessions.
- Filter by event category and session.
- Search IPs, credentials, commands, hashes, URLs, and messages with case-insensitive substring matching.
- Switch between newest-first and oldest-first order.
- Open the corresponding Session Detail page through a session-ID link.
- See when a source session is truncated.

### Session Detail — `/sessions/[id]`

- Inspect source IP, simulated location, SSH client, timestamps, duration, and event counts.
- Read a chronological timeline and expand raw JSON records.
- Switch between the three mock sessions.
- See a partial-timeline notice when records are omitted.

The scenarios represent automated scanning, password guessing, and activity after access. The dataset includes **47 events**, while the simulated sessions declare **237 recorded events** in total. The password-guessing session includes only 24 of its 214 recorded events; the omitted records are not analyzed or displayed.

All example source and payload IP addresses use documentation ranges. Locations are invented. Captured commands and URLs are displayed as escaped text, not executed or linked to payload hosts.

## Technology

Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Recharts, and Lucide. The installed versions are defined in `package.json` and `package-lock.json`.

## Run locally

Install Node.js and npm compatible with the installed Next.js version. In the project directory:

```bash
npm install
npm run dev
```

Open the address printed by Next.js, then visit `/feed`. The homepage redirects to `/dashboard`, which is currently a placeholder. Stop a foreground server with **Control+C**.

For a loopback-only development server on port 3001:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3001
```

Open `http://127.0.0.1:3001/feed`. Keep the server running while using the application. If the port is already occupied, choose another port and use that same address for testing.

### Production build and local preview

```bash
npm run build
npm run start -- --hostname 127.0.0.1 --port 3001
```

Do not start this preview on a port already used by a development server.

## Tests and verification

```bash
npm run lint
npm run build
npx tsc --noEmit
```

With the production server running, open a second terminal in the project directory and run:

```bash
bash scripts/check-session-routes.sh http://127.0.0.1:3001
```

The latest recorded local verification found:

- Production build, TypeScript, and lint: passed.
- Production route suite: **19 passed, 0 failed**.
- Six browser tests: passed, covering the feed, Commands filter, search, session navigation, unknown-session page, and truncated-session notice.

Hermes executed these checks on the local Mac. They are not described as student-performed manual tests. See [TEST_LOG.md](TEST_LOG.md) and the screenshots, JSON results, and terminal output in [evidence/](evidence/).

Unknown session IDs return HTTP 404. Case variants of known IDs are rejected with a plain-text 404 before cache lookup. Malformed URL encoding returns HTTP 400. These checks do not establish that all interactions, accessibility requirements, or security properties have been tested.

## Known limitations

- Dashboard, ATT&CK Matrix, and Intel Report are placeholder views. The component reference page is at `/styleguide`.
- No live Cowrie ingestion, backend sensor connection, LLM API calls, AI classifications, or live ATT&CK mapping exist.
- DEMO mode simulates shell telemetry, including event counts, threat score, sensor uptime, AI-call timestamps, and API cost. A visible **DEMO DATA** notice and simulated metric labels identify these as illustrative values; no actual AI calls or charges occur.
- LIVE mode displays **Unavailable** instead of retained demo metrics and reports **OFFLINE · NO BACKEND**. Feed and Session Detail still use the clearly labeled mock dataset; LIVE does not connect to a real sensor.
- Global top-bar search is UI-only. The Attack Feed's own search is functional.
- Feed filter choices are not stored in the URL and reset on reload.
- AI-assisted implementations require review; no production-security or independent security-audit guarantee is made.

## Unresolved dependency advisory

Local diagnostics on October 21, 2026 reported **9 high-severity package findings** in `npm audit`, and **7** with `npm audit --omit=dev`. These findings trace to the `braces@3.0.3` stack-exhaustion denial-of-service advisory through shadcn tooling and the Next.js ESLint dependency chain:

<https://github.com/advisories/GHSA-vfj7-8cjw-p6xm>

The findings are related dependency-chain reports, not nine separate underlying flaws. Because shadcn is declared as a regular dependency, they cannot all be dismissed as development-only. Runtime exploitability through this application has not been established; this is not proof of either exploitability or security.

No remediation has been applied. npm's forced fix proposed a breaking downgrade to shadcn 1.0.0. Do not run `npm audit fix --force` blindly. Review compatible changes separately and rerun build and regression checks. Advisory results may change over time.

## AI assistance and submission status

Claude assisted with implementation; Hermes applied downloaded updates, reviewed and tested the local project, and prepared evidence; ChatGPT helped plan the submission and draft documentation. There is **no runtime AI service** in this version. See [AI_USE_NOTE.md](AI_USE_NOTE.md) for prompts, verification, and personal-contribution fields requiring student confirmation.

The supplied assignment copy and preparation checklist are in [AI101_MIDTERM_REQUIREMENTS.md](AI101_MIDTERM_REQUIREMENTS.md). Issue/PR review evidence, before/after improvement screenshots, personal disclosure confirmation, and demonstration preparation are not completed merely by having these documents. They must be completed and checked before submission.

This repository should be presented as an educational prototype, not a completed threat-intelligence platform. No project license has been selected yet; public visibility alone does not grant an open-source reuse license.
