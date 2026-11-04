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
 │ call backs · FAQs · settings · activity│◀────│ LangGraph call analysis · tests │
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

**When a customer calls:** Vapi handles the whole call → backend receives the end-of-call report → ai/'s LangGraph graph masks personal data and writes the summary, topic, matched FAQ and fields on Azure OpenAI → backend saves it → the dashboard shows it.

## Tech stack

| Part | Technology |
|---|---|
| Voice and model | Vapi, gpt-4o, Deepgram speech to text |
| frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, TanStack Table, Recharts, lucide-react |
| backend | NestJS 11, TypeScript, Prisma 7, Zod 4, nestjs-zod, Twilio, Jest |
| ai | Python 3.12, FastAPI, Pydantic, Jinja2, LangGraph, LangChain Azure OpenAI, pytest, DeepEval |
| Call analysis model | Azure OpenAI gpt-4o |
| Database | Supabase Postgres, Supabase Cron |
| Hosting | Vercel, three projects from this one repository |

## Project structure

```
money-support/
├── frontend/          Next.js dashboard
│   └── src/
│       ├── app/          routes
│       ├── components/   shared components, one per file
│       ├── overview/     overview page parts
│       ├── calls/        calls list and call detail
│       ├── review/       review queue and call backs
│       ├── faqs/         FAQ list and editor
│       ├── settings/     settings tabs
│       ├── test-call/    browser test call with live transcript
│       ├── hooks/        one hook per file
│       ├── types/        one type per file
│       ├── navigation/   sidebar items
│       ├── icons/        custom SVG marks
│       ├── lib/          logic with no screen attached
│       └── styles/       theme.css, the only place colours and fonts are defined
├── backend/           NestJS API
├── ai/                Python agent builder, LangGraph call analysis and agent tests
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

Open http://localhost:3000. The dashboard reads live data from the backend at `BACKEND_URL` (default `http://localhost:4000`), so start the backend first.

| Command | What it does |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds for production |
| `npm run start` | Serves the production build |
| `npm run lint` | Checks the code |

### Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

The API listens on http://localhost:4000. Fill in `.env` first; [backend/README.md](backend/README.md) explains each variable, the endpoints and how to run a local database without Supabase.

### ai/

```bash
cd ai
uv sync
cp .env.example .env
uv run uvicorn app.main:app --port 8000
```

The service listens on http://localhost:8000. Set `AI_SERVICE_URL=http://localhost:8000` in `backend/.env` so the backend uses it. [ai/README.md](ai/README.md) explains each variable, the endpoints and the agent tests.

## Deployment

Everything runs in Tokyo, next to the database.

```
GitHub: this repository, branch main
        │ every push
        ▼
Vercel ─┬─ money-support-frontend   Root Directory: frontend   Next.js
        ├─ money-support-backend    Root Directory: backend    NestJS
        └─ money-support-ai         Root Directory: ai         FastAPI
                     │
                     ▼
Supabase (ap-northeast-1) ── Postgres · Vault · Cron
```

**How a deploy works.** Each push to `main` builds only the projects whose folder changed; the check is the `ignoreCommand` in each `vercel.json`. A build that fails never replaces production. To roll back, promote the previous deployment:

```bash
vercel promote <previous-deployment-url> --scope <team>
```

**Database.** Tables and the six FAQs come from the Prisma migrations:

```bash
cd backend
DIRECT_URL="<session pooler url>?sslmode=verify-full&sslrootcert=certs/supabase-ca.crt" npx prisma migrate deploy
```

The backend connects through the transaction pooler and verifies Supabase's certificate from `DATABASE_CA_CERTIFICATE`.

**Environment variables**, set per project with `vercel env add <name> production`:

| Project | Variables |
|---|---|
| backend | `DATABASE_URL`, `DATABASE_CA_CERTIFICATE`, `VAPI_WEBHOOK_SECRET`, `VAPI_API_KEY`, `SERVICE_SECRET`, `CRON_SECRET`, `ENCRYPTION_KEY`, `AI_SERVICE_URL`, `FRONTEND_ORIGIN` |
| ai | `SERVICE_SECRET`, `BACKEND_URL`, `VAPI_API_KEY`, `VAPI_WEBHOOK_URL`, `VAPI_WEBHOOK_SECRET`, `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_DEPLOYMENT`, `AZURE_OPENAI_API_VERSION` |
| frontend | `BACKEND_URL` for the `/api` rewrite, `VAPI_PUBLIC_KEY` and `VAPI_ASSISTANT_ID` for the Test call page |

**Retention.** Supabase Cron calls the backend's retention endpoint every hour. [backend/README.md](backend/README.md#retention-on-supabase) has the setup.

**Vapi.** Saving FAQs or agent settings in the dashboard syncs the assistant. The first sync creates it; later syncs update only the assistant tagged `money-support`.

## Agent test results

Run on 4 November 2026 against the live assistant.

| Test | Result |
|---|---|
| Evals, 11 cases | 10 to 11 passing per run. E03 and E05 sometimes answer longer than the three-sentence limit. |
| Simulations, 4 scenarios | 4 passing |
| DeepEval: masking (52 lines) and whole-call analysis (4 calls) | 56 passing |

## Status

| Part | State |
|---|---|
| Dashboard shell: sidebar with collapse, header, theme | Done |
| Overview page | Done, with live data from the backend |
| Calls, call detail, review queue, FAQs, test call, settings | Done, with live data from the backend |
| backend/ | Done: webhooks, calls, review queue, call backs, FAQs, settings, overview, activity, retention, health |
| ai/ | Done: prompt and assistant sync, LangGraph call analysis, live masking, Vapi Evals, Simulations and DeepEval |
| Deployment | Done: Vercel and Supabase, deploys from `main` |

## Known limitations

| Limitation | Effect |
|---|---|
| No login yet | The dashboard and its API are open to anyone with the URL. The webhook, internal and retention routes are protected by secrets. |
| Team hours are fixed | In transfer mode with weekday hours, the agent transfers Monday to Friday, 9am to 5pm UK time. |
| Call backs use the simulator | Real call backs need the Twilio variables. |
| No phone number attached | Calls are made from the dashboard's Test call page until a Vapi number is assigned. |

## License

[MIT](LICENSE)
