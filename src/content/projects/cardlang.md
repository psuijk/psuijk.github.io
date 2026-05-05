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

A natural language search engine for Magic: The Gathering cards. Describe the desired cards in plain English, get results back.

## Why I built it

I play Magic, which means I build a lot of decks, which means I spend a lot of time searching through cards. Magic has tens of thousands of them, and finding the right cards for a deck takes real effort.

Existing tools don't fully solve the discovery problem. Aggregators like "show me combos with this card" are useful, but they only surface scraped data from deckbuilder sites, skewed toward the established meta. Scryfall and similar search engines are powerful, but they require learning a query syntax and chaining operators to narrow results.

Working in AI and building agentic systems led me to a question: why not describe what I want in plain English and let an agent find it? The question became Cardlang.

Cardlang functions like a conversational AI, except instead of returning text it returns cards. Users can save results into lists, export lists, revisit past queries, and apply filters and sorts on top of the agent's results.

## What's interesting technically

The first version of Cardlang called Scryfall's API directly. Direct API calls work for a prototype, but not for a public-facing application — rate limits would quickly block access. So I built a local pipeline instead.

A Lambda runs early every morning. It pulls Scryfall's full bulk export, parses it, and loads the entire card database into Postgres. The dataset is never more than a day old, and no user traffic ever reaches Scryfall's servers.

The bigger challenge was the load itself. Rewriting the entire card table while users are querying it risks downtime and inconsistent results. The solution is a blue/green schema setup: two full copies of the card data, with the Cardlang server querying a view rather than a table directly. Each morning's import writes into the inactive copy, and once the import completes, the view switches to the newly-loaded side. Users querying during the swap never see partial data, and there's no maintenance window.

The LLM piece is the other half. When a user types a query, the model doesn't generate SQL directly. It returns a structured representation that a service on my end parses and compiles into SQL against the Postgres database. Keeping the model out of direct SQL generation means I control exactly what reaches the database, which matters for both correctness and security.

Context management is another place the design matters. Rather than loading all MTG domain knowledge into the system prompt, the knowledge is split into discrete skills, each exposed to the model as a tool in the agent loop. The model retrieves what it needs when it needs it.

Much of the MTG domain is already in model training data, so preloading the context with information the model likely already has wastes tokens in the common case. Letting the agent choose when to retrieve a skill keeps context minimal when the model already knows the answer and provides a fallback when additional domain knowledge is needed.

Model access runs through Neuromod, so Cardlang isn't coupled to any single provider. The best model for the task can change monthly, and switching providers requires no code changes.

## Treating it like a product, not a demo

Cardlang has an eval suite and a feedback loop built in. Users can report bad results directly in the app, and reports automatically open a GitHub issue with everything needed to diagnose the problem: the original query, the structured output the model generated, the SQL it compiled to, and the results returned.

The diagnostic workflow is: identify why the system produced incorrect results, apply a fix, and add the failing case to the eval suite to prevent regression. The same discipline I apply to professional AI systems.

## Stack

TypeScript, Node.js, Angular frontend. Postgres with a blue/green schema for the card catalog. Lambda for the nightly bulk ingestion job. Neuromod for provider-agnostic model access.

## Link

[cardlang.ai](https://cardlang.ai)
