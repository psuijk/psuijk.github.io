---
heading: Client Work at RTS Labs
intro: Production AI systems built for enterprise clients across logistics, manufacturing, and private equity. Built as the sole developer unless otherwise noted. Industries are named; clients are anonymized.
---

## Invoice processing for a major logistics company

Problem: Contractors submitted invoices in widely varied formats, and a team of people was translating them manually into the client's internal system.

Solution: I built an AWS Lambda-based pipeline that extracted the relevant fields from any given format, normalized them, and sent the payload to another api in their system. The automation eliminated 87% of the manual effort that had been part of this work.

*Stack: Python, AWS Lambda, S3, Claude.*

## Natural-language-to-SQL system for a manufacturing client

Problem: The client had large volumes of archival data in a format that was not easily processed by digital systems. They wanted to extract and load data into a database and then be able to query that database via natural langauge.

Solution: I built the backend for a two part system. One part was a one-time ingestion pipeline that processed 4,000+ PDFs and legacy Excel files, extracting structured data and populating an MS SQL Server database. The second part was a natural-language-to-SQL agent that sat on top of that database, letting the client query their own historical data in plain English. The agent used an iterative refinement workflow: it generated a query, evaluated the results, and revised its approach when it failed to get results, rather than returning the first answer the model produced.

*Stack: Python, FastAPI, MS SQL Server, Azure, Gemini.*

## Financial data pipeline for a private equity firm

Problem: A PE firm was pulling economic metrics from many different vendors across its portfolio, with each vendor delivering data in their own format.

Solution: I built a pipeline that parsed the disparate files, extracted the key metrics, and outputted them in a single uniform shape. This reduced manual processing time by 33%.

*Stack: Python, Azure Functions, Claude, Gemini.*
