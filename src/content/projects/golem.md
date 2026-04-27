---
title: Golem
slug: golem
status: In development
tier: featured
order: 1
oneLiner: An agent harness written from scratch in Go, designed to plug in anywhere you want an LLM agent handling a workload.
stack:
  - Go
  - Ollama
links: []
---

An agent harness written from scratch in Go. Modeled on Claude Code and designed to be the core brain that plugs in anywhere you want an LLM agent handling a workload.

## Why I'm building it

My professional work involves building agent systems, but those are always oriented around a specific problem: extract this kind of data, answer this kind of question, automate this workflow. The north star of agent work is the opposite: a harness general enough to handle any task you throw at it. Golem is my approach to building toward that, on my own terms and without a specific client use case shaping the design.

Claude Code is the clearest existing example of a general-purpose harness done well, which is why it's the model. The first milestone for Golem is to be good enough to replace Claude Code as my daily driver for development work. That is a concrete and demanding bar, and reaching it means the harness works on real tasks. Once it does, the more interesting experiments open up.

Writing it in Go is deliberate on two fronts. Go fits the use case (single binary, good concurrency primitives, comfortable in systems contexts), and implementing a harness by hand in a language I'm still deepening in requires me to understand every design decision rather than rely on a framework.

## Built by hand

Golem is written by hand, no coding agent involved. That's a deliberate choice, and it reflects how I think developers should be using AI tools right now.

Most of the discourse sits in one of two camps: minimize AI tools to preserve your skills, or go all in on prompting because coding is dead. I believe both are partially right and insufficient on their own. Developers need projects where they work primarily through prompting, because that builds context engineering skills and keeps intuition current with models that are changing fast. What you learned about working with them six months ago is already partially out of date, which is why it has to be an ongoing practice rather than a one-time skill.

Developers also need projects where they write every line themselves, because without that, the model's capabilities become the ceiling.

Golem is the latter. Writing a harness by hand in Go is the most effective way for me to master the language, and that mastery is the goal.

## What it's for

Beyond the first milestone, the more interesting applications are:

- Servers with no REST API. One endpoint, natural language in, tool calls out. "Update this user's name" becomes a prompt, not an HTTP route.
- Infrastructure provisioning by agent. Plug in pre-built Terraform modules and let an agent spin up services without anyone writing IaC directly.
- Drop-in replacement brains for existing agent-powered products.

Golem is the substrate for all of that.

## How it's built

The architecture centers on a reusable core agent. The same code path handles the top-level agent and any subagents it spawns, parameterized by things like max step count.

Subagents are constrained (much smaller step budgets) so the main agent can't lose control of the loop. Spawning a subagent is itself a tool the main agent calls.

Tools live in a dedicated directory. Adding one means implementing the tool interface and registering it with the dispatcher. The goal is that once Golem is open source, anyone can either contribute Go-native tools upstream or fork and add their own without touching the core.

Model access follows the same pattern as Neuromod: a thin provider-agnostic layer so Golem runs on whatever model you want.

I'm particularly interested in testing with Ollama-hosted local models, both to keep inference costs down during development and to verify the harness doesn't assume a specific provider's quirks.

Sandboxing and tool guardrails are an active focus right now. I'm working through the design before the first LLM touches it, which I believe is the right order: the harness should have correct isolation semantics independent of whether the model is well-behaved.

## Status

Core loop, dispatcher, and tools framework are in a bare-bones working state. Active work is on sandboxing and tool guardrails. First milestone: stable enough to replace Claude Code in my own workflow. Open source on release.
