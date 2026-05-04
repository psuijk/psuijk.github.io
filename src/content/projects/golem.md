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

Golem is an agent harness written from scratch in Go. Modeled on Claude Code and designed to be the core brain that plugs in anywhere you want an LLM agent handling a workload.

## Why build a harness

My professional work involves building agent systems, but those are always oriented around a specific problem: extract this kind of data, answer this kind of question, automate this workflow. The north star of agent work is the opposite: a harness general enough to handle any task you throw at it. Golem is my approach to building toward that, without a specific client use-case shaping the design.

The first milestone for Golem is to be good enough to replace Claude Code as my daily driver for development work. Reaching this concrete and demanding object means the harness works on real tasks which then opens up the potential for more interesting experiments.

I am writing Golem in Go two accomplish two objectives. First, Go fits the usecase (i.e. single binary, good concurrency primitives, comfortable in systems contexts). Second, implementing a harness by hand in a language I'm still learning requires me to understand every design decision rather than rely on a framework.

## Why I'm building it by hand

My decision to write Golem by hand, with no coding agent involved, reflects how I think developers should mastering their skills to most effectively use AI in development.

Most of the discourse sits in one of two camps: minimize AI tools to preserve your skills, or go all-in on prompting because coding is dead. I believe both mindsets are partially right but insufficient on their own. Developers need projects where they work primarily through prompting because that builds context engineering skills and keeps intuition current with models that are changing quickly. What developers learned about agentic coding six months is already partially outdated, which is why AI upskilling should be an ongoing practice, rather than a one-time learning activity.

Developers also need projects where they write every line themselves, because without that kinesthetic learning experience, developers become complacent in their understanding and the model's capabilities become the ceiling.

Writing a harness by hand in Go is an effective way for me to take steps toward mastering the language, and mastery is the goal.

## What it's for

Beyond the first milestone, the more interesting applications are:

- Servers with no REST API. One endpoint, natural language in, tool calls out. "Update this user's name" becomes a prompt, not an HTTP route.
- Infrastructure provisioning by agent. Plug in pre-built Terraform modules and let an agent spin up services without anyone writing IaC directly.
- Drop-in replacement brains for existing agent-powered products.

Golem is the substrate for all of these applications.

## How it's built

The architecture centers on a reusable core agent. The same code path handles the top-level agent and any subagents it spawns, parameterized by things like max step count.

Subagents are constrained (i.e. much smaller step budgets) so the main agent can't lose control of the loop. Spawning a subagent is itself a tool the main agent calls.

Tools live in a dedicated directory. Adding a new tool means implementing the tool interface and registering it with the dispatcher. The goal is that once Golem is open source, anyone can either contribute Go-native tools upstream or fork and add their own without touching the core.

Model access follows the same pattern as Neuromod: a thin provider-agnostic layer so Golem runs on whatever model you want.

I'm particularly interested in testing with Ollama-hosted local models, both to keep inference costs down during development and to verify the harness doesn't assume a specific provider's quirks.

Sandboxing and tool guardrails are an active focus right now. I'm working through the design before the first LLM touches it: the harness should have correct isolation semantics independent of whether the model is well-behaved.

## Status

Core loop, dispatcher, and tools framework are in a bare-bones working state. Active work is on sandboxing and tool guardrails. First milestone: stable enough to replace Claude Code in my own workflow. Open source on release.
