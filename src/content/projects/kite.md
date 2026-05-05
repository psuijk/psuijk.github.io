---
title: Kite
slug: kite
status: Public template
tier: other
order: 6
oneLiner: A personal learning system powered by Claude Code. Builds a knowledge graph, quizzes adaptively, tracks skill level, imports learning from other LLM conversations.
stack:
  - Claude Code
  - Markdown
  - YAML
links:
  - label: GitHub
    href: https://github.com/psuijk/kite
---

A personal learning system powered by Claude Code. Open the repo in Claude Code and start talking. Claude builds a knowledge graph of the chosen domain, tracks skill level across topics, quizzes adaptively, recommends what to study next, and generates learning plans and hands-on projects calibrated to current proficiency.

## Why I built it

Between my professional work and side projects, a significant portion of my time goes to research: reading, talking with LLMs, exploring ideas to understand them more deeply. The problem is that without recall, most of learning doesn't persist. A concept feels understood in the moment but becomes difficult to articulate a week later.

Additionally, learning conversations happen across whichever tool is convenient at the time, so notes never accumulate in a single place.

Kite started as a way to force recall and consolidate learning across tools. If I have a knowledge graph of everything I've claimed to learn, the system can test me on it and incorporate what I've discussed elsewhere.

## How it's built

Kite is interesting in that there's no traditional code. It's a collection of markdown instructions, prompt files, and YAML data structures that Claude Code reads and follows. The capability comes from how the prompts are designed, not from a runtime I wrote.

The repo defines:

- A main `CLAUDE.md` with the workflows Claude follows and the triggers it listens for in natural conversation.
- A `prompts/` directory with detailed specs for each workflow: how quizzes are structured, how scoring works, how learning plans are generated, how imports from other LLM conversations get reconciled with the existing graph.
- Three data files Claude maintains: a knowledge graph (topics, relationships, priorities, difficulty), a skills file (proficiency level on each topic from 0 to 4), and an append-only learning log.
- A paired extract/import flow. At the end of a learning conversation in any LLM (ChatGPT, Gemini, Claude.ai, anything), paste the extract prompt. The model outputs a structured YAML summary of what was discussed. Paste the YAML back into Kite, and the import prompt tells Claude how to reconcile new information against the existing knowledge graph: match new topics to existing topics, update skills, log changes. Learning stays consolidated regardless of where conversations happen.

On first use, Claude detects the uninitialized state and runs a five-minute interview to set up the domain. After setup, Claude responds to natural triggers: "status," "quiz me on X," "what should I learn next," "learning plan for X," "import."

## Why it's a public template

Kite is a template meant to be cloned into a personal instance, not a hosted service. Everything is in plain text, so anyone can fork the repo, configure it for a different domain, and customize the prompts to change how quizzes, scoring, or plans work. I wanted others to be able to use Kite without me running infrastructure.

## Stack

Claude Code. Markdown for instructions. YAML for data. No dependencies, no scripts.
