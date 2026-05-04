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

Consulting work kept surfacing the same request: extract structured data from a pile of PDFs. Different clients, different schemas, different document challenges, but structurally the same problem. Every new engagement meant someone rebuilding the same chunking, extraction, and parsing logic.

The underlying principle is that in a services context, formerly bespoke work can become configurable. Chonker started as the internal Python library that handles chunking, extraction, and parsing. Pass the library a 2-page PDF or a 2,000-page PDF along with a `chonker.config` JSON declaring the desired fields, and it returns structured output. Each field carries a name, description, default value, and any applicable extraction rules.

Chonker solved the extraction problem, but the config was slow to author. Nested schemas and complex extraction rules take real time to write and validate. So I built the Playground on top.

## Chonker Playground

A FastAPI server wrapping the Chonker library, with a React frontend, built so anyone on the team can create, test, and ship extraction use cases without writing code.

The workflow looks like:

- Create a project and a use case inside the project. A use case maps to a config.

<!-- screenshot: chonker-new-usecase.png -->

- Paste Read.ai notes from the client meeting. The Playground uses an AI assist to generate a first-pass config from the notes.
- Edit the config in a proper UI — no manual JSON editing. Nested objects, field rules, defaults: everything editable in a form.

<!-- screenshot: chonker-schema-editor.png -->

- Upload sample files in the browser to test extraction immediately and see the results.
- Once the config is ready, either copy it into the project codebase or generate API keys for the use case and call the Playground directly. The Playground becomes the extraction backend.
- Share projects with other devs for collaboration on the same use case.

The Playground is protected by company SSO and hosted on internal AWS, so access requires a company email.

## The pre-sale unlock

The biggest impact isn't delivery speed — it's pre-sale. Consulting means doing solution architecture for prospective clients, often with difficult documents and a short turnaround on whether the work is even feasible.

Before Chonker Playground, answering "how extractable is a client's data?" meant building scaffolding, writing code, and spending a day or two before producing a confident assessment.

Now the flow is: paste the meeting notes into the Playground, let the AI draft the config, upload the sample files the prospect provided. The process takes under five minutes and produces a clear answer on data extractability and how much of the project actually needs to be built.

Sometimes the answer is that the Playground alone is sufficient and no custom extraction system needs to be built.

Internally, Chonker Playground cut estimation turnaround on extraction projects by 50%.

## What's interesting technically

<!-- screenshot: chonker-usecase-edit.png -->

- Provider-agnostic model access, same principle as Neuromod and Golem.
- Chonker performs two distinct steps: it builds extraction prompts from the config, and it sends the prompts plus the document to an LLM for extraction. Both steps are independently configurable — Claude Sonnet 4.6 can handle prompt construction while Gemini 3.0 handles the actual extraction, if that combination produces the best results for a given use case.
- The library is document-size agnostic. The chunking strategy lets a 2,000-page PDF go through the same code path as a 2-page PDF.
- The config schema is the interface contract. Everything above the schema — the Playground UI, the AI-assisted config generation, the API layer — is a nicer surface on the same underlying data structure.
- AI-assisted config generation makes the Playground genuinely usable by non-specialists. Meeting notes in, working config out, iterate in a UI.

## Stack

Python and FastAPI for the library and server. React for the Playground frontend. Multi-provider LLM access. Hosted on internal AWS, SSO-gated for company access.
