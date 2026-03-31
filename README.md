# n8n-nodes-pdfvector

[n8n](https://n8n.io/) community node for [PDF Vector](https://www.pdfvector.com) — parse PDF, Word, Excel, and image documents to structured markdown, ask AI questions about documents, extract structured data with JSON Schema, and search academic papers across multiple databases.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

In n8n, go to **Settings > Community Nodes** and install:

```
n8n-nodes-pdfvector
```

## Credentials

1. Sign up at [app.pdfvector.com](https://app.pdfvector.com)
2. Go to **Settings** to get your API key
3. In n8n, create a new **PDF Vector API** credential and paste your API key

**Custom instance:** If you have a custom PDF Vector instance, enter your instance domain in the credential's Domain field. Otherwise, leave it as `global.pdfvector.com`.

## Operations

### Document

Parse, ask, and extract from generic documents (PDF, Word, Excel, CSV, Image).

| Operation | Description |
|-----------|-------------|
| **Parse** | Extract text content and page count |
| **Ask** | Ask a question about the document and get an AI answer |
| **Extract** | Extract structured data using a JSON Schema |

### Identity Document

Parse, ask, and extract from identity documents (passports, driver's licenses, ID cards).

| Operation | Description |
|-----------|-------------|
| **Parse** | Extract text from identity documents (Pro/Max models only) |
| **Ask** | Ask a question about the identity document |
| **Extract** | Extract structured fields (name, DOB, document number, etc.) |

### Invoice

Parse, ask, and extract from invoices.

| Operation | Description |
|-----------|-------------|
| **Parse** | Extract text from invoices (Pro/Max models only) |
| **Ask** | Ask a question about the invoice |
| **Extract** | Extract structured invoice data (number, date, items, totals) |

### Bank Statement

Parse, ask, and extract from bank statements.

| Operation | Description |
|-----------|-------------|
| **Parse** | Extract text from bank statements (Pro/Max models only) |
| **Ask** | Ask a question about the bank statement |
| **Extract** | Extract structured bank statement data |

### Academic

Search, fetch, and find citations across academic databases.

| Operation | Description |
|-----------|-------------|
| **Search** | Search for papers across 7 academic databases |
| **Fetch** | Fetch specific papers by DOI, PubMed ID, ArXiv ID, etc. |
| **Find Citations** | Find relevant citations for a paragraph of text |

**Supported providers:** Semantic Scholar, PubMed, ArXiv, Google Scholar, OpenAlex, ERIC, Europe PMC.

## Model Tiers

All document operations support model selection:

| Tier | Best for | Max pages | Max size |
|------|----------|-----------|----------|
| **Auto** | Automatic selection (default) | 1000 | 500MB |
| **Nano** | Simple text documents | 30 | 10MB |
| **Mini** | Tables, structured content | 30 | 10MB |
| **Pro** | Complex docs, images, handwriting | 30 | 40MB |
| **Max** | Large docs, full capabilities + HTML | 1000 | 500MB |

Identity, Invoice, and Bank Statement **parse** operations only support Auto, Pro, and Max.

## Document ID Tracking

All document operations (except Academic) support an optional **Document ID** field for usage tracking. The ID is returned in the response and saved in your usage records.

## Compatibility

- **n8n version:** 1.0+
- **Node.js version for local development and CI:** 22+

## Resources

- [PDF Vector API Reference](https://global.pdfvector.com/api/reference)
- [PDF Vector Dashboard](https://app.pdfvector.com)
- [PDF Vector Website](https://www.pdfvector.com)
- [Report Issues](https://github.com/phuctm97/n8n-nodes-pdfvector/issues)

## Version History

- **2.x:** Unified PDF Vector node with document, identity, invoice, bank statement, and academic operations
- **1.x:** Earlier PDF Vector integration releases

## License

MIT
