# ai

Python service that decides how the agent behaves. It builds the prompt and the Vapi assistant from the FAQs and settings, analyses every finished call with a LangGraph graph on Azure OpenAI (masking personal data, summary, topic, matched FAQ, fields and checks), masks live test-call lines, and tests the agent with Vapi Evals, Simulations and DeepEval. It never touches the database, and nothing here runs during a live call.

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
| POST | `/analysis` | backend, when a call ends | Runs the call analysis graph and returns masked lines, summary, topic, matched FAQ, fields, checks and a suggested review |
| POST | `/masking/line` | backend, for the Test call page | Masks one finished caller line |
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
   - the prompt-injection filter from `CompliancePlanFactory`
   - Vapi's own summary and structured data turned off, because ai/ analyses the call instead
   - recording off, and the backend webhook when `VAPI_WEBHOOK_URL` is set
4. `VapiAssistantClient` finds our assistant by its `metadata.service` tag and updates it, or creates it the first time. Other assistants in the Vapi account are never touched.
5. The prompt and its hash go back to the backend, which saves them as the current prompt version.

## Call analysis

There are no patterns or regular expressions. Azure OpenAI gpt-4o reads each line in context and returns the exact personal pieces with their kind; code checks each piece is really in the line and replaces it, so the model never rewrites what the caller said.

```
START ─▶ fan out lines ══Send × each line══▶ mask_line ─▶ join_lines
join_lines ─┬─▶ summarise ──────┐
            ├─▶ classify_topic ─┼─▶ check_call ─▶ END
            └─▶ extract_fields ─┘
```

| Node | Does | Output schema |
|---|---|---|
| `mask_line` | Finds names, card and account numbers (even a few spoken digits), emails, phone numbers and addresses in one line | `MaskingOutput { pieces: [{ text, kind }] }` |
| `summarise` | Two or three sentences from the masked transcript | `SummaryOutput { summary }` |
| `classify_topic` | Topic and the FAQ the agent answered from, `0` for none | `TopicOutput { topic, matched_faq_number }` |
| `extract_fields` | Amount, currency, date, country, status, each with a confidence and its line | `FieldsOutput { fields }` |
| `check_call` | Whether a hand-off was expected, whether the agent repeated personal data, and whether it made a mistake | `CheckOutput` |

Every model call uses a strict JSON schema and retries three times. A step that still fails is listed in `failedSteps`; a line that could not be checked is returned as "[waiting for privacy check]" and never in its raw form.

## Tests of the agent

| Kind | Where | How it runs |
|---|---|---|
| Evals | `evaluation/cases/E01…E11` | A scripted chat with the real assistant. Each checked reply is judged by an AI judge against an expectation, by a pattern for the exact hand-off sentence, or by the tool it calls. |
| Simulations | `simulation/scenarios/S01…S04` | A pretend caller has a whole conversation with the assistant over Vapi web chat. Yes or no questions about the conversation decide the result. `transferCall` is mocked. |
| DeepEval | `evaluation/masking/cases.json` (52 lines), `evaluation/analysis/calls.json` (4 calls) | `tests/live/`: masking checked line by line, and whole calls checked for matched FAQ, hand-off, review reason and fields, plus a GEval judge for summary quality. Run with `uv run pytest -m live`. |

Evals and Simulations cost Vapi credits and DeepEval calls Azure OpenAI, so they only run when asked. `uv run pytest` runs only the fast tests, which use a scripted model.

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
│   ├── analysis/       LangGraph call analysis graph, its nodes, schemas and Azure client
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
