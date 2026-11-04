# ai

Python service that decides how the agent behaves. It builds the prompt and the Vapi assistant from the FAQs and settings, removes personal data from transcripts before the backend stores them, and tests the agent with Vapi Evals and Simulations. It never touches the database, and nothing here runs during a live call.

## How it is built

- Classes only. Routers handle HTTP, services hold the steps, factories and catalogs build pieces of the Vapi assistant, clients talk to the backend and Vapi.
- Every class is alone in a file named after it.
- `ServiceContainer` creates every object once and hands each router what it needs. `ApplicationFactory` turns the routers into the FastAPI app.
- Prompts are Markdown files in `prompts/`. Jinja fills in the FAQs and settings; `{% raw %}` keeps Vapi's own `{{…}}` placeholders as they are.

## Endpoints

| Method | Path | Used by | What it does |
|---|---|---|---|
| GET | `/health` | backend Connections tab | Says the service is up |
| POST | `/assistant/sync` | backend, after FAQ or settings changes | Rebuilds the prompt and creates or updates the assistant in Vapi |
| POST | `/guardrails/redact` | backend, when a call ends | Removes personal data from each text. `entityTypes` lists the kinds to remove, following the privacy settings; phone numbers are always removed. |
| POST | `/evaluations/run` | a person, on demand | Runs every case in `evaluation/cases/` as a Vapi Eval and waits for the results |
| POST | `/simulations/run` | a person, on demand | Starts one Vapi Simulation run with every scenario in `simulation/scenarios/` |
| GET | `/simulations/runs/{runId}` | a person, on demand | Shows how many simulations passed, failed or are still running |

Everything except `/health` needs the `x-service-secret` header, with the same value as the backend's `SERVICE_SECRET`.

## What happens on a sync

1. `BackendClient` reads the active FAQs from `GET /internal/faqs` and the settings from `GET /internal/settings`.
2. `PromptBuilder` fills `prompts/assistant/SystemPrompt.md` with them, and the prompt is hashed.
3. `AssistantConfigurationBuilder` builds the assistant:
   - gpt-4o with the prompt and the tools from `ToolCatalog`: `endCall` always, `transferCall` in transfer mode
   - a Vapi voice and Deepgram nova-3 speech to text
   - the hand-off sentence as an end-call phrase, so Vapi ends the call when the agent says it
   - silence and unclear-speech hooks from `HookCatalog`
   - the prompt-injection and number filters from `CompliancePlanFactory`
   - the summary and the extracted fields from `AnalysisPlanFactory`, in the shape the backend reads
   - recording off, and the backend webhook when `VAPI_WEBHOOK_URL` is set
4. `VapiAssistantClient` finds our assistant by its `metadata.service` tag and updates it, or creates it the first time. Other assistants in the Vapi account are never touched.
5. The prompt and its hash go back to the backend, which saves them as the current prompt version.

## Redaction

Presidio finds personal data in two ways. Fixed formats such as card numbers, IBANs, emails, phone numbers and sort codes are found by patterns, which catch every match the same way each time. Names have no format, so spaCy's English model finds them, with two additions: a pattern for names after "my name is", "this is", "I am" or "I'm", and a list of everyday words, such as "Email" or "Thanks", that the model must not mistake for names.

## Tests of the agent

| Kind | Where | How it runs |
|---|---|---|
| Evals | `evaluation/cases/E01…E11` | A scripted chat with the real assistant. Each checked reply is judged by an AI judge against an expectation, by a pattern for the exact hand-off sentence, or by the tool it calls. |
| Simulations | `simulation/scenarios/S01…S04` | A pretend caller has a whole conversation with the assistant over Vapi web chat. Yes or no questions about the conversation decide the result. `transferCall` is mocked. |

Both cost Vapi credits, so they only run when asked.

## Structure

```
ai/
├── app/
│   ├── main.py · ApplicationFactory.py · ServiceContainer.py
│   ├── configuration/  AppConfiguration
│   ├── common/         CamelModel, ServiceSecretGuard, TemplateRenderer, RunPoller, errors
│   ├── backend/        BackendClient and the FAQ and settings models
│   ├── vapi/           VapiClient
│   ├── assistant/      prompt, assistant configuration, tools, hooks, plans, sync
│   ├── guardrails/     Presidio redaction with extra recognizers
│   ├── evaluation/     Vapi Evals from the case files
│   ├── simulation/     Vapi Simulations from the scenario files
│   └── health/
├── prompts/            assistant · analysis · evaluation · simulation
├── evaluation/cases/   one JSON file per eval case
├── simulation/scenarios/  one JSON file per scenario
└── tests/              mirrors app/
```

## Local setup

Needs Python 3.12 and [uv](https://docs.astral.sh/uv/).

```bash
cd ai
uv sync
cp .env.example .env
uv run uvicorn app.main:app --port 8000
```

| Variable | Value |
|---|---|
| `SERVICE_SECRET` | Same as the backend |
| `BACKEND_URL` | `http://localhost:4000` |
| `VAPI_API_KEY` | Vapi private key |
| `VAPI_WEBHOOK_URL` | Public URL of the backend's `/vapi/webhook`, for example through a tunnel. Leave empty to keep the webhook as it is. |
| `VAPI_WEBHOOK_SECRET` | Same as the backend |
| `ASSISTANT_MODEL` | `gpt-4o` |
| `JUDGE_MODEL` | Model for the eval judge, `gpt-4.1` by default |
| `RUN_TIMEOUT_SECONDS` | How long `/evaluations/run` waits, 240 by default so it ends inside Vercel's 300-second limit |

Then set `AI_SERVICE_URL=http://localhost:8000` in `backend/.env` so the backend uses this service.

| Command | What it does |
|---|---|
| `uv run pytest` | Runs the tests |
| `uv run uvicorn app.main:app --reload --port 8000` | Starts the service and restarts on changes |
