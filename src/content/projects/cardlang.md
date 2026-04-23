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
  - AWS Lambda
  - Neuromod
links:
  - label: cardlang.ai
    href: https://cardlang.ai
---

A natural language search engine for Magic: The Gathering cards. Describe what you're looking for in plain English, get cards back.

## Why I built it

I play Magic, which means I build a lot of decks, which means I spend a lot of time looking through cards. Magic has tens of thousands of them, and finding the right ones for a deck is its own job. Existing tools don't really solve it. Aggregators like "show me combos with this card" are useful, but they only know what they can scrape from deckbuilder sites, so they lock you into whatever the larger meta is doing. Scryfall and the other search engines are powerful, but they require you to learn a query syntax and chain together operators until you've narrowed the field to something worth reading.

Working in AI and building agentic systems every day had me circling the same question: why can't I just describe what I want and let an agent find it? So I built that.

Think of Cardlang as ChatGPT, except instead of returning text it returns cards. You can save results into lists, export those lists, revisit past queries, and apply filters and sorts on top of what the agent gives you back.

## The interesting part is under the hood

The first version of Cardlang called Scryfall's API directly. That's fine for a prototype. It is not fine if you plan to expose anything to the public, because you'll cross the API's rate limits almost immediately and get your app blocked. So I built a local pipeline instead.

A Lambda runs early every morning. It pulls Scryfall's full bulk export, parses it, and loads the entire card database into Postgres. The dataset is never more than a day old, and no user traffic ever touches Scryfall's servers.

The bigger challenge was the load itself. Rewriting the entire card table while users are querying it is a recipe for downtime and half-broken results. The fix is a blue/green schema setup: there are two full copies of the card data, and the Cardlang server queries a view rather than a table directly. Each morning's import writes into the inactive copy, and when it's done, the view is flipped to point at the newly-loaded side. Users querying during the swap never see partial data, and there's no maintenance window.

The LLM piece is the other half. When you type a query, the model doesn't generate SQL directly. It returns a structured representation that a service on my end parses and compiles into SQL against the Postgres database. Keeping the model out of the SQL-writing business means I control exactly what hits the database, which matters both for correctness and for not having to trust model output with query construction.

Context management is another place the design matters. Rather than stuffing every piece of MTG knowledge into the system prompt, the domain knowledge is split into discrete skills, each surfaced to the model as a tool in the agent loop. The model pulls what it needs when it needs it. A lot of MTG information is already in model training data, so assuming the model doesn't know something and flooding the context with it wastes tokens on the common case. Letting the agent *choose* when to reach for a skill keeps context lean when the model already knows the answer and gives it a clean escape hatch when it doesn't.

Model access runs through Neuromod, so Cardlang isn't tied to any single provider. The best model for the task can change monthly, and the code doesn't care.

## Treating it like a product, not a demo

Cardlang has an eval suite and a feedback loop built in. Users can report bad results directly in the app, and those reports automatically open a GitHub issue with everything I need to diagnose the problem: the original query, the structured output the model generated, the SQL it compiled to, and the results that came back.

From there the workflow is tight: figure out why the system got it wrong, make the change, and add the failing case to the eval suite so future changes can't regress it. Same discipline I apply to AI systems at work, applied to my own.

## Stack

TypeScript, Node.js, Angular frontend. Postgres with a blue/green schema for the card catalog. Lambda for the nightly bulk ingestion job. Neuromod for provider-agnostic model access.

## Link

[cardlang.ai](https://cardlang.ai)
