---
title: Kite
slug: kite
status: Public template
tier: other
order: 6
oneLiner: A personal learning system powered by Claude Code. Builds a knowledge graph, quizzes you, tracks skill level, imports learning from other LLM conversations.
stack:
  - Claude Code
  - Markdown
  - YAML
links:
  - label: GitHub
    href: https://github.com/psuijk/kite
---

A personal learning system powered by Claude Code. Open the repo in Claude Code and start talking. Claude builds a knowledge graph of whatever domain you're learning, tracks your skill level across topics, quizzes you adaptively, recommends what to study next, and generates learning plans and hands-on projects calibrated to your level.

## Why I built it

Between my professional work and side projects, a significant portion of my time goes to research: reading, talking with LLMs, pushing on ideas to understand them more deeply. The problem is that without recall, most of that learning doesn't persist. Something feels understood in the moment but becomes difficult to articulate a week later.

Additionally, learning conversations happen across whichever tool is convenient at the time, so even with notes there is no single place they accumulate.

Kite started as a way to force recall and consolidate learning across tools. If I have a knowledge graph of everything I've claimed to learn, the system can test me on it and incorporate what I've discussed elsewhere.

## How it's built

Kite is interesting in that there's no traditional code. It's a collection of markdown instructions, prompt files, and YAML data structures that Claude Code reads and follows. The intelligence lives in how the prompts are designed, not in a runtime I wrote.

The repo defines:

- A main `CLAUDE.md` with the workflows Claude follows and the triggers it listens for in natural conversation.
- A `prompts/` directory with detailed specs for each workflow: how quizzes are structured, how scoring works, how learning plans are generated, how imports from other LLM conversations get reconciled with your graph.
- Three data files Claude maintains for you: a knowledge graph (topics, relationships, priorities, difficulty), a skills file (your level on each topic from 0 to 4), and an append-only learning log.
- A paired extract/import flow. At the end of a learning conversation in any LLM (ChatGPT, Gemini, Claude.ai, anything), you paste the extract prompt. The model outputs a structured YAML summary of what was discussed. Paste that YAML back into Kite, and the import prompt tells Claude how to reconcile it against your existing knowledge graph: match new topics to existing ones, update skills, log changes. Your learning stays consolidated even though your conversations are scattered.

When you open the repo in Claude Code and say something, Claude detects whether you're initialized, walks you through a five-minute interview to set up your domain if not, and from there responds to natural triggers: "status," "quiz me on X," "what should I learn next," "learning plan for X," "import."

## Why it's a public template

Kite is the template you clone to get your own instance, not a hosted service. Everything is in plain text, so anyone can fork it, point it at their own domain, and customize the prompts to change how quizzes or scoring or plans work for them. I wanted others to be able to use it without me having to run anything.

## Stack

Claude Code. Markdown for instructions. YAML for data. No dependencies, no scripts.
