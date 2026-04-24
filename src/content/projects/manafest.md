---
title: ManaFest
slug: manafest
status: Launching soon
tier: featured
order: 5
oneLiner: An MTG companion platform for tracking games, managing decks and playgroups, playing with a live life counter on iOS, and building out play-history analytics. Team project; I own the backend server and the web app.
stack:
  - Node.js
  - TypeScript
  - React
  - Postgres
  - DynamoDB
  - Step Functions
links:
  - label: manafest.gg (launching soon)
    href: https://manafest.gg
---

An MTG companion platform: track your games, manage your decks and playgroups, play with a live life counter on iOS, and build out analytics on your own play history. A team project where I own the backend server and the web app.

## The problem

Magic players play a lot of games, and they have no good way to see themselves across them. What decks did I bring last month? Who do I play with most? What's my win rate on this new commander versus my old one? Which of my friends keeps beating me and what are they playing when they do it?

Tracking this by hand is tedious enough that almost nobody does it. ManaFest is the platform that makes it worth doing, with the game-tracking, the social layer, and the analytics all tied together.

## What it is

Three things wrapped into one product:

- **A social layer.** Create decks, friend other players, form and manage playgroups, record games, invite people, comment on each other's play history.
- **A live life counter.** The iOS app is a full life counter for actually playing a game of Magic, with the rest of the app's features layered on top. Players can "join" a live game in progress, and when the game ends it auto-records with all the right context: who played, what deck each person brought, who won.
- **Analytics.** Currently template-driven: leaderboards by commander, by player, by playgroup, recent wins, and similar cuts. The roadmap is a query builder so players can construct their own views and save them as shareable templates.

## What I own

I own the backend server (Node.js / TypeScript) and the web app (TypeScript / React). The server powers both the web app and the iOS client, and the web app includes most features from iOS except the live life counter itself, including the ability to join a live game from a browser so non-iOS players can still be recorded into someone else's tracked session. A teammate owns iOS. Another works with me on AWS infrastructure and owns the data engineering side of things.

## The data model is not trivial

Commander is Magic's most popular format, and it's the format ManaFest is built around. That means the domain model gets interesting fast:

- A user has decks. A deck has versions. A version has a commander. A commander is a card. A card has many printings. (We don't yet expose it in the UI, but the schema supports a deck version switching which printing of its commander shows.)
- A playgroup has members, who are users.
- A game has players *and* decks, because what matters is that a specific player brought a specific deck to a specific game.
- A live game session is its own thing, with its own state, that eventually becomes a recorded game.

Painting all of that as English flattens what it actually feels like to model and query. Loading three hundred games with full relationships can blow past what you want the server holding in memory at once, so the repository layer uses targeted queries and carefully scoped DTOs.

We suffered from DTO fragmentation early and had to redesign some of it when the patterns we'd started with stopped scaling.

Partway through I migrated the backend from TypeORM to Drizzle, which was invasive but paid for itself quickly. Drizzle's ergonomics match how we actually write queries and the type safety is meaningfully better.

## Privacy is a server concern, not a UI concern

Users and playgroups can both be set private, and that introduces a serialization problem most apps get wrong. You can't hide private data by just not rendering it on the frontend. Anyone running a JS app in a browser can inspect the network response and see whatever the server sent. Privacy has to be enforced at the response layer, where the server filters each object based on who's asking for it.

Doing that naively is slow. If every request re-fetches privacy settings and walks every relationship checking visibility, you bloat every endpoint and you pay for it under load.

The server does this carefully: resolve visibility once per request against the current viewer, scope queries to return only what that viewer is allowed to see, and build response DTOs that were privacy-aware from the start rather than stripped after the fact.

## The live game piece

The iOS life counter isn't decorative. It runs an active session with real state: turn order, life totals, per-player tracking, players joining mid-game. That introduces failure modes most MTG apps don't need to think about.

The most interesting one is host failover. The "host" phone is where the live state actually lives, and if it drops, the session needs to survive. Detecting that the host is gone is a timing problem: EventBridge's minimum trigger interval is one minute, which is too slow to feel responsive in a live game.

The solution is a Step Function that triggers a Lambda on a 15-second interval, scanning DynamoDB for live sessions whose host has gone stale. When one is found, the server notifies the remaining guests so someone can claim the host role and resume play.

That claim is its own can of worms: multiple guests might try to take host at the same moment, and the server has to serialize that race and pick one winner without dropping the game's state. Once a new host is elected, play continues from where it was, and when the game ends the session gets promoted into a recorded game with all the right data attached.

Designing the server to support that cleanly, while also fanning events out to notifications and to the analytics pipeline, is where most of the interesting server work ended up.

## Infrastructure

The backend runs on AWS ECS behind an ALB, with Postgres on RDS and DynamoDB for live session state. The event-driven parts of the system use SNS, SQS, and EventBridge to fan out game events to notifications and to the analytics pipeline. S3 and CloudFront handle static assets. Glue handles the card data ingestion from Scryfall (same problem as Cardlang, solved similarly: don't hit their API at runtime, pull the bulk export, keep the card catalog fresh on a schedule).

Auth0 handles authentication. Patreon is integrated for supporter-tier features. Bug reports and feature requests from inside the app create Jira tickets automatically, which keeps the triage loop short.

## Stack

Backend: Node.js, TypeScript, Drizzle ORM, Postgres, DynamoDB. Web: TypeScript, React. Infrastructure: AWS (ECS, ALB, RDS, DynamoDB, Step Functions, Lambda, SNS, SQS, EventBridge, Glue, S3, CloudFront). Auth0 for auth. Team of three: I own backend + web, one teammate owns iOS, one works with me on AWS and owns data engineering.

## Status

Soft-launched to a small group, public launch after current cleanup. Live at [manafest.gg](https://manafest.gg) when ready.
