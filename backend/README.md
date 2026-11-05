# backend

NestJS API that owns the database. It receives Vapi call events, stores redacted calls, runs the review queue and call backs, and serves the dashboard. Nothing here runs during a live call: if this service is down, callers still get answers and Vapi retries the webhooks.

## How it is built

- Classes only. Controllers handle HTTP, services hold the rules, repositories run queries, presenters shape responses.
- Each layer only talks to the one below it: controller → service → repository → Prisma.
- Anything with more than one implementation sits behind an abstract class, and the module picks one from the environment:

| Abstract class | Used when configured | Used otherwise |
|---|---|---|
| `CallAnalysisClient` | `AiCallAnalysisClient` (ai/ analysis graph; saves lines as waiting if ai/ fails) | `PendingCallAnalysisClient` |
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
| GET | `/internal/settings` | ai/, with the `x-service-secret` header |
| POST | `/internal/retention/run` | Supabase Cron, with the `x-cron-secret` header |
| POST | `/masking/line` | Test call page, limited to 180 checks a minute per address |

## What happens when a call ends

1. `VapiSecretGuard` checks the secret and the Zod DTO checks the payload.
2. `VapiReportReader` turns the payload into a `FinishedCallReport`.
3. `ReportAnalyser` sends the transcript, the privacy toggles and the FAQs to ai/ `/analysis`, which returns masked lines, summary, topic, matched FAQ and fields. If ai/ is down, every line is saved as "[waiting for privacy check]" and Vapi's copy is kept.
4. `ReviewTriage` decides whether a person needs to look at it: hand-off, removed or unchecked data, a field under 75% confidence, or a possible mistake suggested by ai/.
5. `CallCompletionBuilder` masks the caller's number for display, and keeps the full number for call backs when that privacy setting is on. The caller's number is also sent to ai, so it stays in the transcript while any other phone number is masked.
6. `FinishedCallWriter` saves the call, messages, fields, guardrail events, review and activity in one transaction.
7. `HandOffEmailService` emails the team when the call was handed off, a transfer was not answered, the caller hung up during a transfer, or the caller rang out of hours. It sends once per call, using only masked details, and never stops the call being saved if Gmail fails.
8. `VapiCallArchive` deletes Vapi's own copy when that privacy setting is on and the analysis is complete.

## Hand-off emails

| Case | Vapi `endedReason` | Subject starts with |
|---|---|---|
| Handed off | the hand-off sentence was said | Follow up a handed-off call |
| Transfer not answered | `call.forwarding.no-answer`, `call.forwarding.operator-busy`, `call.in-progress.error-transfer-failed` | ⚠ Missed transfer, please call back |
| Caller left during transfer | `customer-ended-call-during-transfer` | ⚠ Caller hung up during transfer, please call back |
| Out of hours | transfer mode, weekday hours, outside Mon–Fri 9am–5pm UK | Out-of-hours caller, follow up next working day |
| Transfer answered | `assistant-forwarded-call` | no email |

Emails go through Gmail SMTP with an app password (`MAIL_USER`, `MAIL_APP_PASSWORD`) to the address in Settings → Hand-off. `reviews.hand_off_emailed_at` is claimed in one update before sending, so a repeated report never sends twice; a failed send clears it and logs `handOffEmailFailed`.

## Structure

One folder per area. The module sits at the top of each area, and every other file goes in the subfolder for its kind. An area only has the subfolders it needs.

```
src/
├── main.ts · ApplicationServer.ts · AppModule.ts
├── configuration/   environment schema and typed AppConfiguration
├── prisma/          PrismaService and the transaction type
├── common/          guards, SecretMatcher, EncryptionService, Clock
├── vapi/            webhook, report reading, call analysis, recording
├── calls/           calls, messages, extracted fields, number protection
├── review/          review queue, triage, verdicts, unmasked reports
├── callbacks/       call backs through Twilio or the simulator
├── faqs/            FAQ editing and the internal list for ai/
├── assistant/       agent sync with ai/ and prompt versions
├── guardrails/      guardrail events and the kinds of data to mask
├── masking/         live masking of test call lines
├── hand-off-email/  emails the team after hand-offs and missed transfers
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
| `DATABASE_URL` | Supabase pooler in transaction mode (port 6543), with no `sslmode` in the URL, or a local database |
| `DATABASE_CA_CERTIFICATE` | Text of `certs/supabase-ca.crt`, so the connection to Supabase is verified. Leave empty for a local database. |
| `DIRECT_URL` | Supabase pooler in session mode (port 5432) with `?sslmode=verify-full&sslrootcert=certs/supabase-ca.crt`, used for migrations |
| `VAPI_WEBHOOK_SECRET`, `SERVICE_SECRET`, `CRON_SECRET` | Long random strings |
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

## Retention on Supabase

The hourly clean-up runs inside the backend when it runs as one process. On Vercel nothing stays running, so Supabase Cron calls `POST /internal/retention/run` every hour instead. [supabase/schedule-retention.sql](supabase/schedule-retention.sql) turns on `pg_cron` and `pg_net` and schedules the call. It reads two secrets from Supabase Vault, which are added once by hand and never committed:

| Vault secret | Value |
|---|---|
| `retention_url` | `https://<backend>.vercel.app/internal/retention/run` |
| `cron_secret` | Same as `CRON_SECRET` |
