# backend

NestJS API that owns the database. It receives Vapi call events, stores redacted calls, runs the review queue and call backs, and serves the dashboard. Nothing here runs during a live call.

## Planned structure

```
backend/
├── prisma/schema.prisma
└── src/
    ├── common/         VapiSecretGuard · ServiceSecretGuard · EncryptionService
    ├── configuration/  ConfigurationSchema · ConfigurationModule
    ├── prisma/         PrismaService · PrismaModule
    ├── vapi/           VapiWebhookController · VapiWebhookService · VapiEventHandler
    │                   StatusUpdateHandler · EndOfCallReportHandler · VapiWebhookDto
    ├── calls/          CallController · CallService · CallRepository · CallMessageRepository
    ├── review/         ReviewController · ReviewService · ReviewRepository · ExtractedFieldRepository
    ├── callbacks/      CallbackController · CallbackService · OutboundCallClient
    ├── faqs/           FaqController · FaqService · FaqRepository · CreateFaqDto · UpdateFaqDto
    ├── assistant/      AssistantSyncClient · PromptVersionRepository
    ├── guardrails/     RedactionClient · GuardrailEventRepository
    ├── settings/       SettingsController · SettingsService · SettingsRepository
    ├── activity/       ActivityService · ActivityRepository · ActivityListener
    ├── retention/      RetentionJob
    └── health/         HealthController
```

Each class sits in its own file, named after the class.
