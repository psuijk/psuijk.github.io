---
heading: Client Work at RTS Labs
intro: Production AI systems built for enterprise clients across logistics, manufacturing, and private equity. Built as the sole developer unless otherwise noted. Industries named; clients anonymized.
---

## Invoice processing for a major logistics company

Contractors submitted invoices in wildly varied formats, and a team of people was translating them by hand into the client's internal system. I built an AWS Lambda-based pipeline that extracts the relevant fields from whatever format came in, normalizes them, and submits them downstream. The automation eliminated 87% of the manual headcount that had been doing this work.

*Stack: Python, AWS Lambda, S3, Claude.*

## Natural-language-to-SQL system for a manufacturing client

A larger system in two halves. The first half was a one-time ingestion pipeline that processed 4,000+ PDFs and legacy Excel files, extracting structured data and populating an MS SQL Server database. The second half was a natural-language-to-SQL agent that sits on top of that database, letting the client query their own historical data in plain English.

The agent uses an iterative refinement workflow: it generates a query, evaluates the results, and revises its approach when something looks off, rather than returning the first answer the model produces. I built the backend and the agent; a second developer built the frontend.

*Stack: Python, FastAPI, MS SQL Server, Azure, Gemini.*

## Financial data pipeline for a PE firm

A PE firm was pulling economic metrics from many different vendors across its portfolio, each vendor delivering data in their own format. The pipeline I built parses the disparate files, extracts the key metrics, and outputs them in a single uniform shape the firm can actually work with. Cut manual processing time by 33%.

*Stack: Python, Azure Functions, Claude, Gemini.*
