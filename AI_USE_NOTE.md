# HoneyTrace — AI Use Note

**Course:** AI 101 · **Project:** HoneyTrace

This note distinguishes AI assistance during development from AI features in the application. The current prototype uses mock data and makes no live LLM API calls. Attack classification, live ingestion, and ATT&CK mapping remain proposed features.

## Tools and purposes

| Tool | Assistance | Verification and limits |
|---|---|---|
| Claude | Scaffolded the project, implemented the design system and shell, reusable components, mock data, Attack Feed, Session Detail, and routing fixes; supplied ZIP handoffs | Claude's claimed results were not accepted as sufficient evidence. Hermes inspected and tested the locally installed files. |
| Hermes | Applied ZIP updates while preserving local Git history; backed up replaced files; inspected source and dependency paths; ran build, TypeScript, lint, route checks, and browser tests; saved screenshots and results; prepared local documentation | Tests cover the recorded cases, not a comprehensive security or accessibility audit. |
| ChatGPT | Helped refine the pitch, prioritize submission preparation, and draft README, test-log, disclosure, and assignment-reference documents | Draft claims were compared with local source and actual execution results before use. |

## Representative prompts from the available conversation

These are actual excerpts supplied in this project's conversation, not invented examples.

### Scope constraint in the original Claude prompt

> TODAY'S GOAL: Phase 1 only — scaffold the Next.js project and build the design system. Do NOT build the honeypot ingestion, the AI layer, or the backend yet. We will use hardcoded mock data.

### Request for clarification of the implementation

> Can you give me a simple and easy to understand breakdown of the project and its components

This prompted an explanation of the user-facing views, development tools, project folders, and the distinction between implemented features and future AI functionality.

## AI output errors found through verification

- A ZIP handoff was described as passing all production-route checks, but local tests found unknown session IDs returning HTTP 500. The rewrite was replaced in a later handoff, and the fix was checked with an explicit loopback production-server command.
- A later handoff passed the producer's tests but returned HTTP 200 for an uppercase session ID on the local Mac. A pre-cache exact-ID guard was added in a subsequent handoff. The local route suite then passed 19 checks.
- Early dependency explanations were too narrow. Actual diagnostics found findings through both shadcn tooling and Next.js ESLint, and 7 high findings remained with development dependencies omitted. Documentation reflects this unresolved state.
- Generic starter documentation did not match the application. It was replaced with documentation distinguishing working feed/session features, simulated telemetry, and placeholder views.

These examples demonstrate why successful AI-generated code and confident descriptions still require local verification.

## Recorded verification

Hermes observed successful production build, TypeScript validation, and linting. The route suite passed **19 of 19** checks. Six browser tests passed for opening the feed, Commands filtering, search, session navigation, invalid-session display, and truncation disclosure.

See [TEST_LOG.md](TEST_LOG.md), [browser-results.json](evidence/browser-results.json), [route-tests.txt](evidence/route-tests.txt), and the linked screenshots. These are actual local execution records, not a claim that every interaction works.

The student also pasted both successful and unsuccessful route-test output in the conversation. A failed run reported HTTP 000 while the local server was stopped; Hermes confirmed the stopped server, restarted it, and obtained a passing rerun. The exact role of chat URL formatting or terminal environment settings was not established.

## Student contribution

### Project direction and coordination

I brought HoneyTrace forward as my cybersecurity-related project and supplied the development brief to Claude. The brief specified a honeypot activity dashboard, a staged implementation process, a visual design, and mock data before any live ingestion or AI backend. I asked for a project pitch and a simple explanation of the components so I could relate the project to the AI 101 assignment.

I coordinated the handoffs between Claude, ChatGPT, and Hermes. I downloaded the project ZIPs, shared Claude's progress reports and fix explanations, and asked Hermes to install and verify the updates on my Mac. I also supplied the assignment-reference document and documentation drafts for comparison with the actual project.

### Local setup and tests I ran

I opened Terminal, navigated to the HoneyTrace folder, and ran `npm install`. I shared the output, including dependency warnings, for help interpreting it. I shared a screenshot of the running starter application and asked for an explanation of what it showed.

I also ran `bash scripts/check-session-routes.sh` and shared both passing and failing output. When a later run reported 0 passed and 19 failed, I reported that result instead of treating the earlier success as sufficient. Hermes then checked the stopped server, restarted it, and reran the tests successfully.

The six browser interaction tests and their screenshots were performed by me manually, and then by Hermes to confirm. 

### Review and follow-up

I requested explanations when the setup or project structure was unclear. I passed the production-routing failure and case-sensitivity findings back into the development conversation and returned the resulting fixes for local verification. I asked for a review before publication, then authorized preparation of the README, test log, requirements checklist, and AI Use Note.

The conversation records my involvement in requesting, coordinating, and checking the reported work. It does not establish that I independently reviewed every line of source code or personally performed every test.

### Code authorship and learning boundaries

No direct student source-code edits are documented in the available conversation. Claude generated the application implementation and fixes; Hermes applied the updates, executed verification, and revised the local documentation. I am not claiming those AI-written changes as code I personally typed.

I used the explanations and troubleshooting exchanges as part of learning how the project fits together. One implementation choice discussed was using local mock sessions to develop and test the interface without a live honeypot. One documented limitation is that a working feed and session explorer do not mean live AI classification or the placeholder dashboard views are implemented. 

## Limitations and disclosure

- Mock IP addresses and payload URLs use documentation ranges; locations and credentials are synthetic.
- Shell threat scores, AI-call indicators, costs, uptime, and event counters are illustrative telemetry, not evidence of live monitoring or real AI use.
- Dashboard, ATT&CK Matrix, and Intel Report remain placeholders.
- Dependency advisories remain unresolved: 9 high findings overall and 7 with development dependencies omitted in the recorded audit. No forced downgrade was applied.
- Issue/PR evidence and a student-reviewed improvement must be documented separately. Existing implementation history must not be retroactively described as an issue/PR workflow that did not occur.
- No claim is made that the application is production-ready or comprehensively security-audited.

## Final student confirmation

I reviewed this AI Use Note and confirm that it accurately describes the tools used, my contributions to the project, the tests performed, and the remaining limitations. I have distinguished my own work from AI-generated code and agent-executed tests.

Scarlenny Guaragna