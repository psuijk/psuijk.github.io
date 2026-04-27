---
title: Cardlang
slug: cardlang
status: Live
tier: featured
order: 4
oneLiner: "A natural language search engine for Magic: The Gathering cards. Describe what you want in plain English, get cards back."
stack:
  - TypeScript
  - Node.js
  - Angular
  - Postgres
  - Lambda
  - Neuromod
links:
  - label: cardlang.ai
    href: https://cardlang.ai
---

A natural language search engine for Magic: The Gathering cards. Describe what you're looking for in plain English, get cards back.

## Why I built it

I play Magic, which means I build a lot of decks, which means I spend a lot of time looking through cards. Magic has tens of thousands of them, and finding the right ones for a deck is its own job.

Existing tools don't fully address this. Aggregators like "show me combos with this card" are useful, but they only surface what they can scrape from deckbuilder sites, which tends to reflect the established meta. Scryfall and similar search engines are powerful, but they require learning a query syntax and chaining operators to narrow results.

Working in AI and building agentic systems led me to a question: why not describe what I want in plain English and let an agent find it? That question became Cardlang.

Cardlang functions like a conversational AI, except instead of returning text it returns cards. You can save results into lists, export those lists, revisit past queries, and apply filters and sorts on top of what the agent gives you back.

## The interesting part is under the hood

The first version of Cardlang called Scryfall's API directly. That works for a prototype, but it is not viable for a public-facing application — API rate limits would quickly block access. So I built a local pipeline instead.

A Lambda runs early every morning. It pulls Scryfall's full bulk export, parses it, and loads the entire card database into Postgres. The dataset is never more than a day old, and no user traffic ever touches Scryfall's servers.

The bigger challenge was the load itself. Rewriting the entire card table while users are querying it risks downtime and inconsistent results. The solution is a blue/green schema setup: there are two full copies of the card data, and the Cardlang server queries a view rather than a table directly. Each morning's import writes into the inactive copy, and when it's done, the view is flipped to point at the newly-loaded side. Users querying during the swap never see partial data, and there's no maintenance window.

The LLM piece is the other half. When you type a query, the model doesn't generate SQL directly. It returns a structured representation that a service on my end parses and compiles into SQL against the Postgres database. Keeping the model out of direct SQL generation means I control exactly what reaches the database, which matters for both correctness and security.

Context management is another place the design matters. Rather than stuffing every piece of MTG knowledge into the system prompt, the domain knowledge is split into discrete skills, each surfaced to the model as a tool in the agent loop. The model retrieves what it needs when it needs it.

Much of the MTG domain is already in model training data, so preloading the context with information the model likely already has wastes tokens in the common case. Letting the agent choose when to retrieve a skill keeps context lean when the model already knows the answer and provides a clean fallback when it doesn't.

Model access runs through Neuromod, so Cardlang isn't tied to any single provider. The best model for the task can change monthly, and the code doesn't care.

## Treating it like a product, not a demo

Cardlang has an eval suite and a feedback loop built in. Users can report bad results directly in the app, and those reports automatically open a GitHub issue with everything I need to diagnose the problem: the original query, the structured output the model generated, the SQL it compiled to, and the results that came back.

From there the workflow is tight: figure out why the system got it wrong, make the change, and add the failing case to the eval suite so future changes can't regress it. The same discipline I apply to professional AI systems.

## Stack

TypeScript, Node.js, Angular frontend. Postgres with a blue/green schema for the card catalog. Lambda for the nightly bulk ingestion job. Neuromod for provider-agnostic model access.

## Link

[cardlang.ai](https://cardlang.ai)
