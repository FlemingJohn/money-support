# ai

Python service that decides how the agent behaves. It builds the prompt and the Vapi assistant from the FAQs, removes personal data from transcripts before they are stored, and tests the agent's behaviour. It never touches the database and nothing here runs during a live call.

## Planned structure

```
ai/
├── app/
│   ├── routes/       assistant sync · redaction
│   ├── services/     assistant sync · prompt builder · assistant configuration builder · PII redactor
│   ├── catalogs/     tools · hooks
│   ├── factories/    compliance plan · analysis plan
│   ├── clients/      Vapi · backend
│   ├── models/       Pydantic models, one per file
│   ├── evaluation/   evaluation runner · cases · outcomes
│   └── settings
├── prompts/          role · scope · knowledge · guardrails · hand-off · voice
└── tests/            behaviour tests built from reviewed calls
```
