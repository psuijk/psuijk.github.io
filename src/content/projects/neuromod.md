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

Neuromod is a composable, type-safe LLM inference library. Step-function pipelines, Pydantic-based tools, opt-in thread persistence. Available in TypeScript and Python, with identical design principles across both.

## Why I built it

Every AI project I have worked on has involved the same two tasks: build an abstraction layer to swap models and providers in and out, and build eval suites that exercise that abstraction so you can tell which model performs best for a given task. The eval suites become critical the week a new model drops and a client wants to know whether to switch models.

In that process I've worked with most of the existing options, such as raw SDKs (e.g. Anthropic, OpenAI, Google GenAI, Vercel AI). Heavier frameworks (e.g. LangChain, Mastra).

The SDKs are minimal but require reimplementing provider abstraction and chaining logic on every project. Some frameworks address that but also introduce complex APIs, heavy dependencies, and significant unecessary overhead.

The other limitation I encountered is that existing abstractions didn't align with how I wanted to build. Developers are rarely calling a model and returning the raw response. Instead, they are chaining steps, routing between specialized agents, gating with intent guardrails (so your embedded chatbot doesn't get turned into a free ChatGPT), tailoring outputs, running expert agents for things like text-to-SQL.

Some libraries address aspects of these hurdles, but the ergonomics never felt right, and I didn't want my projects dependent on someone else's roadmap. A good library should make these feel natural without imposing uneeded complexity on users.

Neuromod is that library, shaped by the lessons of several earlier iterations.

## How it's designed

Everything in Neuromod is a step function: `async (context) -> context`. Agents, model calls, scoped sub-pipelines, tools, threads are all step functions. They compose with `compose()` and `scope()`.

That entire primitive is the thing I kept reaching for in other libraries but not quite finding. Once you commit to it, most of the features people bolt on elsewhere are developed naturally:

- A pipeline is just composed step functions.
- A sub-agent with its own tools and isolation rules is a `scope()` around a step function.
- An agent is syntactic sugar over a `model()` step, available for when you want readable, reusable units, and peelable when you want more control.

The "readable by default, composable on demand" ergonomics are the design choice I value most.

## What design principles I stumbled upon the hard way

When I first started the project, I was not using the below principles and I discovered the resulting friction compounded quickly. It took several versions to commit to them.

- Step functions are the primitive. Everything composes through `async (ctx) -> ctx`.
- Single source of truth: `ConversationContext.messages` is the truth.
- Content is always a list. `Message.content` is always `list[Content]`, never `str | list`. This sounds trivial and it's actually load-bearing.
- Tool calls are content parts. They live inside `content[]`, not on separate fields. Roles are `system | user | assistant` only.
- Provider = API connection, not model binding. One provider per API, model passed per request.
- Errors typed by HTTP status. Auth, RateLimit, Network, API.
- Immutability where practical. Models and tools are frozen. Context updates produce new instances.

## Why two languages

I implemented TypeScript first because much of my consulting work involves AI integrated into Node servers, where TypeScript is prevalent.

I implemented Python next becuase it is the other half of my stack and has stronger alignment with the AI and ML ecosystem. Ideally Neuromod would be Python-only. However, in consulting, the next project could require either language, so both exist, with the same design principles, adapted to each language's idioms rather than mechanically ported.

## Production use

An older version of Neuromod (on my work GitHub) is running in production across several internal client projects. The current public version is running in Cardlang. The Python package is live on PyPI; npm publishing for the TypeScript version is coming soon.

## Stack

Python 3.11+ with `pydantic` and `httpx` as the only dependencies. TypeScript version with a similarly minimal footprint. Provider support includes Anthropic, OpenAI, Google Gemini, and xAI, with thread persistence as an optional add-on package (`neuromod-sqlalchemy`).
