---
title: Chonker & Chonker Playground
slug: chonker
status: In production, internal
tier: featured
order: 3
oneLiner: A Python library for structured data extraction from documents, paired with a full-stack app that turns extraction from a coding problem into a UI problem.
stack:
  - Python
  - FastAPI
  - React
  - AWS
links: []
---

A Python library for structured data extraction from documents, paired with a full-stack app that turns extraction from a coding problem into a UI problem. Built internally to stop rebuilding the same system on every client engagement.

## Why I built it

Consulting work kept surfacing the same request: extract structured data from a pile of PDFs. Different clients, different schemas, different file horrors, but structurally the same problem. Every time we spun up a new engagement, someone was rebuilding the same chunking, extraction, and parsing logic from scratch.

I'd come out of NimbleBrain primed to generalize. That's the whole promise of AI in a services context: the task that used to be bespoke becomes configurable. Chonker started as the internal Python library that handles the chunking, extraction, and parsing for you. Point it at a 2-page PDF or a 2000-page PDF, give it a `chonker.config` JSON that declares the fields you want, and it hands back structured output. Each field carries a name, description, default value, and any extraction rules that apply.

That worked. But the config itself became the friction point. Nested schemas and complex extraction rules take real time to author and validate. So I built the Playground on top.

## Chonker Playground

A FastAPI server wrapping the Chonker library, with a React frontend, built so anyone on the team could create, test, and ship extraction use cases without touching code.

The workflow ends up looking like this:

- Create a project and a use case inside it. A use case is, under the hood, a config.

<!-- screenshot: chonker-new-usecase.png -->

- Drop in your Read.ai notes from the client meeting. The Playground uses an AI assist to generate a first-pass config from the notes.
- Edit the config in a proper UI, no JSON wrangling. Nested objects, field rules, defaults, everything editable in a form.

<!-- screenshot: chonker-schema-editor.png -->

- Drop sample files in the browser to test extraction immediately and see what comes back.
- When you're happy with it, either copy the config into your project, or generate API keys for the use case and call the Playground directly. The Playground becomes the extraction backend.
- Share projects with other devs so you can collaborate on the same use case.

The whole thing is locked behind company SSO and hosted on our internal AWS, so access is limited to people with a company email.

## The pre-sale unlock

The impact that matters most isn't delivery speed, it's pre-sale. Consulting means doing solution architecture for prospective clients, often with genuinely nasty files and a tight turnaround on whether the work is even feasible.

Before Chonker Playground, answering "how extractable is this client's data?" meant building scaffolding, writing code, and burning a day or two before you could say anything confident.

Now the flow is: paste the meeting notes into the Playground, let it draft the config, drop the sample files the prospect gave us. The whole thing takes under five minutes, and you walk out of that session knowing exactly how extractable the data is and how much of the project actually needs to be built.

Sometimes the answer is that the Playground alone is enough and no custom extraction system needs to be built at all.

Internally, this cut estimation turnaround on extraction projects by 50%.

## What's interesting technically

<!-- screenshot: chonker-usecase-edit.png -->

- Provider-agnostic model access, same principle as Neuromod and Golem.
- Chonker does two distinct things under the hood: it builds its own extraction prompts from your config, and it sends those prompts plus your document to an LLM for extraction. Both steps are independently configurable, so you can use Claude Sonnet 4.6 for prompt construction and Gemini 3.0 for the actual extraction if that's the combination that works best for your use case.
- The library doesn't care about document size. The chunking strategy lets a 2000-page PDF go through the same code path as a 2-page one.
- The config schema is the interface contract. Everything above it (the Playground UI, the AI-assisted config generation, the API layer) is just a nicer surface on the same underlying thing.
- The AI-assisted config generation is the bridge that makes the Playground genuinely usable by non-specialists. Meeting notes in, working config out, iterate in a UI.

## Stack

Python and FastAPI for the library and server. React for the Playground frontend. Multi-provider LLM access. Hosted on internal AWS, SSO-gated for company access.
