# backend

NestJS API that owns the database. It receives Vapi call events, stores redacted calls, runs the review queue and call backs, and serves the dashboard. Nothing here runs during a live call: if this service is down, callers still get answers and Vapi retries the webhooks.

## How it is built

- Classes only. Controllers handle HTTP, services hold the rules, repositories run queries, presenters shape responses.
- Each layer only talks to the one below it: controller → service → repository → Prisma.
- Anything with more than one implementation sits behind an abstract class, and the module picks one from the environment:

| Abstract class | Used when configured | Used otherwise |
|---|---|---|
| `RedactionClient` | `AiRedactionClient` (ai/ with Presidio, falls back to patterns if ai/ fails) | `PatternRedactionClient` |
| `AssistantSyncClient` | `AiAssistantSyncClient` | `SkippedAssistantSyncClient` |
| `OutboundCallClient` | `TwilioBridgeClient` | `SimulatedBridgeClient` |
| `VapiEventHandler` | `StatusUpdateHandler`, `EndOfCallReportHandler`, chosen by event type | |

## Endpoints

| Method | Path | Used by |
|---|---|---|
| POST | `/vapi/webhook` | Vapi, with the `x-vapi-secret` header |
| GET | `/overview` | Overview |
| GET | `/calls?outcome=&search=&page=&pageSize=` | Calls |
| GET | `/calls/:callId` | Call detail |
| POST | `/calls/:callId/unmasked-reports` | Report unmasked data |
| GET | `/reviews?status=open\|inProgress\|done` | Review queue |
| GET · PATCH | `/reviews/:callId` | Review detail, status and note |
| PUT | `/reviews/:callId/verdict` | Correct or wrong |
| POST | `/reviews/:callId/field-confirmations` | Confirm all fields |
| GET · POST | `/reviews/:callId/callbacks` | List or start a call back |
| GET | `/callbacks/:callbackId` | Call back progress |
| POST | `/callbacks/:callbackId/end` | End a call back |
| GET · POST | `/faqs` | FAQ list and create |
| PATCH · DELETE | `/faqs/:faqId` | FAQ edit and delete |
| PUT | `/faqs/order` | FAQ reorder |
| GET | `/settings` | All settings |
| PUT | `/settings/agent` · `/settings/hand-off` · `/settings/privacy` · `/settings/phone` | Settings tabs |
| GET | `/activity?limit=` | Activity tab |
| GET | `/health` | Connections tab |
| GET | `/internal/faqs` | ai/, with the `x-service-secret` header |

## What happens when a call ends

1. `VapiSecretGuard` checks the secret and the Zod DTO checks the payload.
2. `VapiReportReader` turns the payload into a `FinishedCallReport`.
3. `ReportRedactor` removes personal data from the transcript, summary, topic and field values.
4. `ReviewTriage` decides whether a person needs to look at it: hand-off, removed data or a field under 75% confidence.
5. `CallCompletionBuilder` masks the caller's number, and encrypts it only when a review needs a call back.
6. `FinishedCallWriter` saves the call, messages, fields, guardrail events, review and activity in one transaction.
7. `VapiCallArchive` deletes Vapi's own copy when that privacy setting is on.

## Structure

One folder per area. The module sits at the top of each area, and every other file goes in the subfolder for its kind. An area only has the subfolders it needs.

```
src/
├── main.ts · ApplicationServer.ts · AppModule.ts
├── configuration/   environment schema and typed AppConfiguration
├── prisma/          PrismaService and the transaction type
├── common/          guards, SecretMatcher, EncryptionService, Clock
├── vapi/            webhook, report reading, redaction, recording
├── calls/           calls, messages, extracted fields, number protection
├── review/          review queue, triage, verdicts, unmasked reports
├── callbacks/       call backs through Twilio or the simulator
├── faqs/            FAQ editing and the internal list for ai/
├── assistant/       agent sync with ai/ and prompt versions
├── guardrails/      redaction clients and guardrail events
├── overview/        statistics for the overview page
├── settings/        settings sections with defaults
├── activity/        activity log
├── retention/       hourly clean-up of old transcripts and numbers
└── health/          health checks
```

Inside an area, for example `calls/`:

```
calls/
├── CallsModule.ts
├── controllers/    CallController
├── services/       CallQueryService · CustomerNumberProtector
├── repositories/   CallRepository · CallMessageRepository · ExtractedFieldRepository
├── queries/        callDetailInclude
├── presenters/     CallPresenter
├── dto/            CallFilterDto
├── responses/      CallSummaryResponse · CallDetailResponse · CallPageResponse · …
├── types/          CallCompletion · CallRows · CallWithDetails · LocatedField · ProtectedCustomerNumber
└── exceptions/     CallNotFoundException
```

| Subfolder | Holds |
|---|---|
| `controllers/` | HTTP routes |
| `services/` | Business rules |
| `repositories/` | Database queries |
| `queries/` | Prisma include shapes used by repositories |
| `presenters/` | Turn database rows into API responses |
| `clients/` | Outside services: an abstract class and its implementations |
| `handlers/` | One class per Vapi event type |
| `jobs/` | Scheduled tasks |
| `guards/` | Request checks |
| `dto/` | Request validation with Zod |
| `responses/` | Shapes the API returns to the frontend |
| `types/` | Data passed between classes inside the backend |
| `exceptions/` | Named errors |

Tests mirror the source layout: `test/review/services/ReviewTriage.test.ts` tests `src/review/services/ReviewTriage.ts`.

## Local setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Supabase pooled connection string (port 6543), or a local database |
| `DIRECT_URL` | Supabase direct connection string (port 5432), used for migrations |
| `VAPI_WEBHOOK_SECRET`, `SERVICE_SECRET` | Long random strings |
| `ENCRYPTION_KEY` | 32 random bytes in base64: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `AI_SERVICE_URL` | Leave empty until ai/ runs |
| `TWILIO_*` | Leave empty to use the call back simulator |

Without Supabase, `npx prisma dev` runs a local Postgres and prints a connection string to use for both database variables.

```bash
npx prisma migrate dev
npm run dev
```

The API listens on http://localhost:4000. Vapi needs a public URL for the webhook, so expose the port with a tunnel such as ngrok or cloudflared when testing real calls.

| Command | What it does |
|---|---|
| `npm run dev` | Starts the API and restarts on changes |
| `npm run build` | Compiles to `dist/` |
| `npm start` | Runs the compiled API |
| `npm test` | Runs the unit tests |
| `npm run typecheck` | Checks types |
| `npm run prisma:migrate` | Creates and applies a migration |
