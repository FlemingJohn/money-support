# Money Support Agent

A phone and web voice agent that answers questions about money that is on its way, and hands every other question to a person. A dashboard shows each call, its redacted transcript, and the calls a person still needs to follow up.

## Problem statement

Build a simple voice agent that can handle incoming calls, using any open-source tool or provider.

1. The agent is a customer support representative that answers questions from the **"Where is my money?"** section of Wise's [Sending money help topic](https://wise.com/help/topics/5bVKT0uQdBrDp6T62keyfz/sending-money).
2. When a caller asks anything else, the agent deflects to a human agent. For this exercise it may say so and end the call.

## Solution

The voice part runs on **Vapi** with its built-in **gpt-4o**. Vapi answers the phone, turns speech into text, runs the model, speaks the reply and hangs up. None of our code sits on the live call, so a slow or failed service of ours can never stall a caller.

Our code does the work around the call:

- **ai/** builds what the agent knows and how it behaves (the prompt with the six FAQs, the hand-off rule, tools, hooks and privacy filters) and pushes it to Vapi. It also removes personal data from transcripts and tests the agent's behaviour.
- **backend/** owns the database. It receives Vapi's call events, saves redacted calls, runs the review queue and call backs, and serves the dashboard.
- **frontend/** is the dashboard: overview, calls, call detail, review queue, FAQ editor, test call and settings.

The six topics the agent answers:

1. How do I check my transfer's status?
2. When will my money arrive?
3. Why does it say my transfer's complete when the money hasn't arrived yet?
4. Why is my transfer taking longer than the estimate?
5. What is a proof of payment?
6. What's a banking partner reference number?

## Functional requirements

| # | Requirement |
|---|---|
| F1 | Answer incoming phone calls and browser calls. |
| F2 | Answer the six "Where is my money?" topics in short spoken replies. |
| F3 | For any other question, say the hand-off sentence and end the call. |
| F4 | End the call when the caller says goodbye, or after a long silence. |
| F5 | Remove card numbers, account numbers and other personal data before the model sees them and before anything is stored. |
| F6 | Save every call with its redacted transcript, summary, outcome and extracted fields. |
| F7 | Put handed-off calls, and calls where a guardrail fired, into a review queue. |
| F8 | Let a reviewer confirm extracted fields, mark the agent correct or wrong, add a note and resolve the call. |
| F9 | Let a reviewer call a caller back without ever seeing their full number. |
| F10 | Let an admin edit the FAQs and update the agent from the dashboard. |
| F11 | Let an admin place a test call and watch the live transcript. |
| F12 | Show today's calls, outcomes and hand-off reasons on an overview. |
| F13 | Keep an activity log of views, edits, hand-offs and call backs. |

## Non-functional requirements

| Area | Requirement |
|---|---|
| Latency | The agent starts speaking within about one second of the caller finishing. Nothing of ours is called during a turn. |
| Privacy | Raw personal data is never stored or shown. Caller numbers appear as the last four digits. Recording is off. |
| Reliability | Calls keep working if the backend or ai/ is down; only saving and the dashboard wait. |
| Security | Webhooks are checked with a shared secret. API keys stay on the server. Inputs are validated with Zod and Pydantic. |
| Accessibility | Keyboard reachable controls, visible focus, 44 px touch targets, text contrast of at least 4.5:1. |
| Maintainability | One thing per file, no comments, plain names, as set out in the project's coding rules. |
| Observability | Health checks for backend and ai/, an activity log, and behaviour tests that run before each agent update. |

## Architecture

```
 Caller ─phone─▶ ┌──────────────────── Vapi ────────────────────┐
 Browser ─web──▶ │ speech to text · gpt-4o · voice · hang-up    │
                 │ live PII filter · hooks · post-call analysis │
                 └──────┬──────────────────────────────▲────────┘
                        │ webhooks (call events)       │ assistant update
                        ▼                              │
 ┌─────────── backend/ (NestJS) ──────────┐     ┌──────┴──── ai/ (Python) ────────┐
 │ webhooks · calls · review queue        │────▶│ prompt and agent builder        │
 │ call backs · FAQs · settings · activity│◀────│ PII redaction · behaviour tests │
 └───────────┬────────────────────────────┘     └─────────────────────────────────┘
             │ Prisma
             ▼
      Supabase Postgres
             ▲
 ┌───────────┴──────── frontend/ (Next.js) ────────────────────────────────┐
 │ overview · calls · call detail · review queue · FAQs · test call · settings │
 └─────────────────────────────────────────────────────────────────────────────┘
```

**When an admin edits an FAQ:** frontend → backend saves it → ai/ rebuilds the prompt → Vapi is updated.

**When a customer calls:** Vapi handles the whole call → backend receives the end-of-call report → ai/ redacts the transcript → backend saves it → the dashboard shows it.

## Tech stack

| Part | Technology |
|---|---|
| Voice and model | Vapi, gpt-4o, Deepgram speech to text |
| frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, TanStack Table, Recharts, lucide-react |
| backend | NestJS, TypeScript, Prisma, Zod |
| ai | Python 3.12, FastAPI, Pydantic, Jinja2, Microsoft Presidio, pytest |
| Database | Supabase Postgres |

## Project structure

```
money-support/
├── frontend/          Next.js dashboard
│   └── src/
│       ├── app/          routes
│       ├── components/   shared components, one per file
│       ├── overview/     overview page parts
│       ├── hooks/        one hook per file
│       ├── types/        one type per file
│       ├── navigation/   sidebar items
│       ├── sample/       sample data until the backend is connected
│       ├── icons/        custom SVG marks
│       ├── lib/          logic with no screen attached
│       └── styles/       theme.css, the only place colours and fonts are defined
├── backend/           NestJS API (planned)
├── ai/                Python agent builder and redaction service (planned)
├── LICENSE
└── README.md
```

## Local setup

### Requirements

- Node.js 24 or later and npm 11 or later
- Python 3.12 or later, for ai/
- A Vapi account and a Supabase project, for the backend and ai/

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000. The dashboard uses sample data until the backend is connected.

| Command | What it does |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds for production |
| `npm run start` | Serves the production build |
| `npm run lint` | Checks the code |

### Backend and ai/

Not built yet. Their planned structure is in [backend/README.md](backend/README.md) and [ai/README.md](ai/README.md).

## Status

| Part | State |
|---|---|
| Dashboard shell: sidebar with collapse, header, theme | Done |
| Overview page | Done, with sample data |
| Calls, call detail, review queue, FAQs, test call, settings | Next |
| backend/ | Planned |
| ai/ | Planned |

## License

[MIT](LICENSE)
