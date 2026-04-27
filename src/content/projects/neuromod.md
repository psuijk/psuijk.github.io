---
title: Neuromod
slug: neuromod
status: Active, Python published
tier: featured
order: 2
oneLiner: A composable, type-safe LLM inference library with step-function pipelines, Pydantic-based tools, and opt-in thread persistence. TypeScript and Python.
stack:
  - Python
  - TypeScript
links:
  - label: PyPI
    href: https://pypi.org/project/neuromod/
---

A composable, type-safe LLM inference library. Step-function pipelines, Pydantic-based tools, opt-in thread persistence. Available in TypeScript and Python, with identical design principles across both.

## Why I built it

Every AI role I've held has involved the same two tasks: build an abstraction layer to swap models and providers in and out, and build eval suites that exercise that abstraction so you can tell which model is actually best for a given task. That second one becomes critical the week a new model drops and a client wants to know whether to switch.

In that process I've worked with most of the existing options. Raw SDKs (Anthropic, OpenAI, Google GenAI, Vercel AI). Heavier frameworks (LangChain, Mastra).

The SDKs are minimal but require reimplementing provider abstraction and chaining logic on every project. The frameworks address that but introduce complex APIs, heavy dependencies, and significant overhead for what is fundamentally a composable problem.

The other limitation I encountered is that existing abstractions didn't align with how I wanted to build. You're rarely calling a model and returning the raw response. You're chaining steps, routing between specialized agents, gating with intent guardrails (so your embedded chatbot doesn't get turned into a free ChatGPT), tailoring outputs, running expert agents for things like text-to-SQL.

Some libraries address pieces of this, but the ergonomics never felt right, and I didn't want my projects dependent on someone else's roadmap. A good library should make all of this feel natural without imposing complexity on users who don't need it.

Neuromod is that library, shaped by the lessons of several earlier iterations.

## The core idea

Everything in Neuromod is a step function: `async (context) -> context`. Agents, model calls, scoped sub-pipelines, tools, threads: all step functions. They compose with `compose()` and `scope()`.

That's the entire primitive. It's the thing I kept reaching for in other libraries and not quite finding cleanly. Once you commit to it, most of the features people bolt on elsewhere fall out naturally:

- A pipeline is just composed step functions.
- A sub-agent with its own tools and isolation rules is a `scope()` around a step function.
- An agent is syntactic sugar over a `model()` step, available for when you want readable, reusable units, and peelable when you want to get weird.

The "readable by default, composable on demand" ergonomics are the design choice I value most.

## Design principles that came out of doing this wrong repeatedly

- Step functions are the primitive. Everything composes through `async (ctx) -> ctx`.
- Single source of truth: `ConversationContext.messages` is the truth.
- Content is always a list. `Message.content` is always `list[Content]`, never `str | list`. This sounds trivial and it's actually load-bearing.
- Tool calls are content parts. They live inside `content[]`, not on separate fields. Roles are `system | user | assistant` only.
- Provider = API connection, not model binding. One provider per API, model passed per request.
- Errors typed by HTTP status. Auth, RateLimit, Network, API.
- Immutability where practical. Models and tools are frozen. Context updates produce new instances.

These principles sound straightforward in retrospect. Arriving at them took several earlier versions where they weren't true and the resulting friction compounded quickly.

## Why two languages

TypeScript came first because much of my consulting work involves AI integrated into Node servers, where TypeScript is prevalent.

Python is the other half of my stack and has stronger alignment with the AI and ML ecosystem. Ideally Neuromod would be Python-only, but in consulting the next project could require either language. So both exist, with the same design principles, adapted to each language's idioms rather than mechanically ported.

## Production use

An older version of Neuromod (on my work GitHub) is running in production across several internal client projects. The current public version is running in Cardlang. The Python package is live on PyPI; npm publishing for the TypeScript version is coming soon.

## Stack

Python 3.11+ with `pydantic` and `httpx` as the only dependencies. TypeScript version with a similarly minimal footprint. Provider support includes Anthropic, OpenAI, Google Gemini, and xAI, with thread persistence as an optional add-on package (`neuromod-sqlalchemy`).
