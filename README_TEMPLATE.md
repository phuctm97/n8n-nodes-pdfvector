# n8n-nodes-pdfvector

This is an n8n community node. It lets you use PDF Vector in your n8n workflows.

PDF Vector parses PDF, Word, Excel, CSV, and image documents, extracts structured data with JSON Schema, answers questions about uploaded files, and searches academic literature across multiple providers.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

Install the package name:

```
n8n-nodes-pdfvector
```

## Operations

This node supports:

* Generic document parse, ask, and extract operations
* Identity document parse, ask, and extract operations
* Invoice parse, ask, and extract operations
* Bank statement parse, ask, and extract operations
* Academic paper search, fetch, and citation discovery

## Credentials

Create a PDF Vector API credential in n8n with:

* An API key from [app.pdfvector.com](https://app.pdfvector.com)
* An optional custom domain if you are not using `global.pdfvector.com`

## Compatibility

* n8n 1.0+
* Node.js 22+ for local development and CI

## Usage

Use the `Resource` and `Operation` selectors to pick the parser or academic workflow you need. Document-style resources accept either a URL or binary input, and support optional document IDs for usage tracking.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [PDF Vector API reference](https://global.pdfvector.com/api/reference)
* [PDF Vector dashboard](https://app.pdfvector.com)

## Version history

* `2.x`: Unified PDF Vector node covering document parsing, extraction, Q&A, and academic search.
* `1.x`: Initial PDF Vector n8n integration.
