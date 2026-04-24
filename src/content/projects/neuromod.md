---
title: Neuromod
slug: neuromod
status: Active, publishing soon
tier: featured
order: 2
oneLiner: A composable, type-safe LLM inference library with step-function pipelines, Pydantic-based tools, and opt-in thread persistence. TypeScript and Python.
stack:
  - Python
  - TypeScript
links: []
---

A composable, type-safe LLM inference library. Step-function pipelines, Pydantic-based tools, opt-in thread persistence. Available in TypeScript and Python, with identical design principles across both.

## Why I built it

Every AI job I've had has involved the same two chores: build an abstraction layer to swap models and providers in and out, and build eval suites that exercise that abstraction so you can tell which model is actually best for a given task. That second one becomes critical the week a new model drops and a client wants to know whether to switch.

Along the way I've used most of the existing options. Raw SDKs (Anthropic, OpenAI, Google GenAI, Vercel AI). Heavier frameworks (LangChain, Mastra).

The SDKs are minimal but leave you reimplementing the same provider-abstraction and chaining logic every project. The frameworks solve that but bring overcomplicated APIs, heavy dependencies, and a lot of machinery for something that's actually pretty simple once you break it down.

The other thing I kept running into with existing libraries is that the abstractions didn't fit how I actually wanted to build. You're rarely calling a model and returning the raw response. You're chaining steps, routing between specialized agents, gating with intent guardrails (so your embedded chatbot doesn't get turned into a free ChatGPT), tailoring outputs, running expert agents for things like text-to-SQL.

Some libraries address pieces of this, but the ergonomics always felt clunky, and I didn't want my projects bottlenecked on someone else's roadmap. A good library should make all of that feel natural without forcing the complexity on people who don't need it.

Neuromod is that library, shaped by everything I got wrong the first several times.

## The core idea

Everything in Neuromod is a step function: `async (context) -> context`. Agents, model calls, scoped sub-pipelines, tools, threads: all step functions. They compose with `compose()` and `scope()`.

That's the entire primitive. It's the thing I kept reaching for in other libraries and not quite finding cleanly. Once you commit to it, most of the features people bolt on elsewhere fall out naturally:

- A pipeline is just composed step functions.
- A sub-agent with its own tools and isolation rules is a `scope()` around a step function.
- An agent is syntactic sugar over a `model()` step, available for when you want readable, reusable units, and peelable when you want to get weird.

The "readable by default, weird on demand" ergonomics are the part I'm proudest of.

## Design principles that came out of doing this wrong repeatedly

- Step functions are the primitive. Everything composes through `async (ctx) -> ctx`.
- Single source of truth: `ConversationContext.messages` is the truth.
- Content is always a list. `Message.content` is always `list[Content]`, never `str | list`. This sounds trivial and it's actually load-bearing.
- Tool calls are content parts. They live inside `content[]`, not on separate fields. Roles are `system | user | assistant` only.
- Provider = API connection, not model binding. One provider per API, model passed per request.
- Errors typed by HTTP status. Auth, RateLimit, Network, API.
- Immutability where practical. Models and tools are frozen. Context updates produce new instances.

These all sound obvious written down. Getting here took several earlier versions where they weren't true and the rough edges stacked up fast.

## Why two languages

TypeScript came first because so much consulting work is AI injected into Node servers. TypeScript is everywhere in that world.

Python is the other half of my actual stack and has a deeper gravitational pull for anything AI or ML. If I had my way it would have been Python-only, but the reality of consulting is that the next project might be either. So both exist, with the same design principles, adapted to each language's idioms rather than mechanically ported.

## Production use

An older version of Neuromod (on my work GitHub) is running in production across several internal client projects. The current public version is running in Cardlang. Publishing to PyPI and npm is coming soon.

## Stack

Python 3.11+ with `pydantic` and `httpx` as the only dependencies. TypeScript version with a similarly minimal footprint. Provider support includes Anthropic, OpenAI, Google Gemini, and xAI, with thread persistence as an optional add-on package (`neuromod-sqlalchemy`).
