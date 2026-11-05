# Money Support Agent

A voice agent that answers Wise customers' "Where is my money?" questions over the phone or in the browser, and hands every other question to a person. A dashboard shows each call with personal data masked, and emails the team when a caller needs a human.

Live dashboard: [money-support-frontend.vercel.app](https://money-support-frontend.vercel.app)

## Problem statement

Build a simple voice agent that can handle incoming calls, using any open-source tool or provider.

1. The agent is a customer support representative that answers questions from the **"Where is my money?"** section of Wise's [Sending money help topic](https://wise.com/help/topics/5bVKT0uQdBrDp6T62keyfz/sending-money).
2. When a caller asks anything else, the agent deflects to a human agent. For this exercise it may say so and end the call.

## Solution

**Vapi runs the live call.** Speech to text (Deepgram), the model (gpt-4o) and the voice all run inside Vapi, so none of our services sit between the caller and the agent. A slow or failed service of ours can never stall a caller.

**Our code works around the call:**

- **ai/** builds the agent from the FAQs and settings and pushes it to Vapi. That covers the prompt, the hand-off rule, tools, speaking and noise settings, and guardrails. After each call it runs a **LangGraph** graph on **Azure OpenAI**, which masks personal data and writes the summary, topic, matched FAQ, fields and checks.
- **backend/** receives Vapi's call events, saves the masked call, decides whether a person must review it, and emails the team after a hand-off. It also serves the dashboard.
- **frontend/** is the dashboard: overview, calls, review queue with call backs, FAQ editor, test call and settings.

The agent answers six topics, the "Where is my money?" section:

1. How do I check my transfer's status?
2. When will my money arrive?
3. Why does it say my transfer's complete when the money hasn't arrived yet?
4. Why is my transfer taking longer than the estimate?
5. What is a proof of payment?
6. What's a banking partner reference number?

Anything else gets the hand-off sentence, *"Please contact the Wise support team through the Help section of the Wise app or website."* Saying it ends the call. In transfer mode the call goes to the team's number instead.

## Architecture

![Money Support Agent architecture: caller, Twilio, Vapi, backend, ai, Azure OpenAI, Supabase, Gmail and the dashboard, with numbered steps](docs/architecture.svg)

### A call, step by step

```mermaid
sequenceDiagram
    autonumber
    actor Caller
    participant Vapi
    participant Backend as backend/
    participant AI as ai/
    participant Azure as Azure OpenAI
    participant DB as Supabase
    participant Mail as Gmail
    Caller->>Vapi: Calls the Twilio number or starts a web call
    Vapi->>Caller: Greets, listens, answers from the six FAQs
    alt Out of scope, or asks for a person
        Vapi->>Caller: Says the hand-off sentence, then hangs up or transfers
    else Done
        Caller->>Vapi: "No, that's all, bye"
        Vapi->>Caller: "Thanks for calling Wise. Take care." and hangs up
    end
    Vapi->>Backend: end-of-call report (secret checked)
    Backend->>AI: POST /analysis with transcript, FAQs, privacy settings
    AI->>Azure: mask each line, then summary, topic and fields in parallel, then checks
    AI-->>Backend: masked lines, summary, topic, matched FAQ, fields, suggested review
    Backend->>DB: save call, masked lines, fields, review, activity
    opt Handed off, missed transfer or out of hours
        Backend->>Mail: one email to the team, masked details only
    end
    Backend->>Vapi: delete Vapi's own copy when that privacy setting is on
```

### The call analysis graph in ai/

```mermaid
flowchart LR
    start(["START"]) --> fan["fan out lines"]
    fan -- "Send x each line" --> mask["mask_line"]
    mask --> join["join_lines"]
    join --> summary["summarise"]
    join --> topic["classify_topic"]
    join --> fields["extract_fields"]
    summary --> check["check_call"]
    topic --> check
    fields --> check
    check --> finish(["END"])
```

## Components

| Component | What it does |
|---|---|
| **Vapi** | Runs the live call. Deepgram nova-3 hears the caller, with Wise key terms such as "bank account" and "IBAN". gpt-4o replies at temperature 0, and the Vapi voice speaks at 0.9 speed. LiveKit smart endpointing waits for the caller to finish, and Krisp removes background noise. Vapi also enforces the end-call rules. |
| **Twilio** | Gives the agent a real phone number (+1 978 951 4979), connected to the Vapi assistant. |
| **ai/ assistant builder** | `PromptBuilder` renders [SystemPrompt.md](ai/prompts/assistant/SystemPrompt.md) from the active FAQs and settings. `AssistantConfigurationBuilder` adds tools, hooks, voice, transcriber, speaking and noise plans, and the prompt-injection filter. `VapiAssistantClient` updates only the assistant tagged `money-support`. |
| **ai/ call analysis** | The LangGraph graph above. Each node calls Azure OpenAI with a strict JSON schema and three retries. The masking node returns the exact personal pieces, and code replaces them, so the model never rewrites what the caller said. |
| **ai/ tests** | Vapi Evals (25 scripted replies), Vapi Simulations (5 full conversations with a pretend caller), and DeepEval (52 masking lines and 4 whole calls). |
| **backend/ webhook** | Checks Vapi's secret, reads the report, sends it to ai/ for analysis, and saves everything in one transaction. |
| **backend/ review triage** | Puts a call in the review queue for a hand-off, masked or unchecked data, a field under 75% confidence, or a possible mistake. |
| **backend/ hand-off email** | Emails the team after a hand-off, a missed transfer, a caller who hung up during a transfer, or an out-of-hours call. It sends once per call with masked details only, through `@nestjs-modules/mailer` and Gmail. |
| **backend/ call backs** | Rings the reviewer first, then the caller, so the full number is never shown. The number is stored encrypted. |
| **backend/ live masking** | Masks the test call's live transcript while the caller speaks, through ai/. |
| **backend/ retention** | Supabase Cron calls it every hour to delete old calls and stored numbers. |
| **Supabase** | Postgres for calls, masked lines, fields, reviews, call backs, FAQs, settings, prompt versions and activity. Also Vault and Cron. |
| **frontend/** | Overview, Calls, Call detail, Review (verdicts, notes, call back), FAQs, Test call with the live masked transcript, and Settings. |

## Functional requirements

These come straight from the problem statement.

| # | Requirement | How it is met |
|---|---|---|
| F1 | Handle incoming calls | Phone calls through the Twilio number, and web calls from the Test call page, both answered by the Vapi assistant |
| F2 | Act as a Wise customer support representative | A calm, kind, professional agent. It acknowledges problems, checks what it misheard, asks one question at a time, and says it is an automated assistant if asked. |
| F3 | Answer questions from the "Where is my money?" section | The six FAQs are the agent's only knowledge. It answers in under 40 words, never invents facts, and never claims to look up an account. |
| F4 | Deflect any other question to a human agent | Out-of-scope questions, requests for a person, scams, abuse after one warning, and other languages all get the hand-off sentence, or a transfer in transfer mode |
| F5 | Say so and end the call | Saying the hand-off sentence ends the call through Vapi's end-call phrase. Goodbyes end it through the endCall tool, which Vapi blocks until the agent has asked "anything else?" or the caller has said goodbye. |

## Non-functional requirements

| Area | Requirement and how it is met |
|---|---|
| **Latency** | Nothing of ours is called during a turn. A real phone call measured about 3.7 s per turn: 1.7 s waiting for the caller to finish, 1.0 s model, 0.7 s voice, 0.4 s speech to text. Replies stay short so speaking starts sooner. |
| **Prompt caching** | The 2,577-token agent prompt keeps its fixed text first and the live UK time last, and sends a `promptCacheKey` per prompt version. On the last phone call, 48% of prompt tokens were served from OpenAI's cache. The Azure analysis prompts are under Azure's 1,024-token minimum, so Azure doesn't cache them. |
| **Guardrails** | Scope limited to the six FAQs. Vapi's prompt-injection filter. Refuses card numbers, even a few digits. Never repeats personal details. One calm warning for insults. Hand-off sentence spoken word for word. endCall rejection rules. Every agent change is checked by Evals and Simulations. |
| **Data masking** | Every caller line is masked by gpt-4o reading it in context, with no regular expressions. It covers names, card and account numbers (even partial), emails, phone numbers and addresses. A line that can't be checked is saved as "[waiting for privacy check]", never raw. The test call shows lines masked while the caller is still speaking. |
| **Privacy** | Recording is off. Raw transcripts are never stored. Vapi's copy is deleted after analysis. Caller numbers show as the last digits only, and are kept encrypted only when a call back may be needed. Retention deletes old data every hour. Emails carry masked details only. |
| **Reliability** | Calls keep working if our services are down. If ai/ is down, lines are saved as waiting. A failed email never stops a call being saved, and is retried and logged. Repeated Vapi reports never save or email twice. |
| **Security** | Vapi webhooks, internal routes and the retention job each check their own secret. API keys stay on the server. Inputs are validated with Zod and Pydantic. Database connections verify Supabase's certificate. |
| **Observability** | Health checks for the database, ai/ and call backs. An activity log of calls, hand-offs, emails, reviews and edits. Prompt versions saved with a hash. |

## Tech stack

| Part | Technology |
|---|---|
| Voice | Vapi, gpt-4o, Deepgram nova-3, Vapi voice, LiveKit smart endpointing, Krisp denoising |
| Telephony | Twilio |
| Call analysis | Python 3.12, FastAPI, LangGraph, LangChain, Azure OpenAI gpt-4o, Pydantic, Jinja2 |
| Agent tests | Vapi Evals and Simulations, DeepEval, pytest |
| backend | NestJS 11, TypeScript, Prisma 7, Zod 4, `@nestjs-modules/mailer` with nodemailer and Gmail SMTP, Jest |
| frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, TanStack Table, Recharts, `@vapi-ai/web`, lucide-react |
| Database | Supabase Postgres, Vault, Cron |
| Hosting | Vercel: three projects from this repository, deployed from `main` |

## License

[MIT](LICENSE)
