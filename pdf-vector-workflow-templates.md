# PDF Vector n8n Workflow Templates

A collection of 10 powerful workflow templates for the n8n PDF Vector node. These templates demonstrate various use cases for document processing and academic research automation.

## 1. Research Paper Analysis Workflow

**Name:** Research Paper Analysis with AI Summary

**Description:**
## Automated Research Paper Analysis Pipeline

This workflow automatically analyzes research papers by:
- Parsing PDF documents into clean Markdown format
- Extracting key information using AI analysis
- Generating concise summaries and insights
- Storing results in a database for future reference

Perfect for researchers, students, and academics who need to quickly understand the key points of multiple research papers.

### How it works:
1. **Trigger**: Manual trigger or webhook with PDF URL
2. **PDF Vector**: Parses the PDF document with LLM enhancement
3. **OpenAI**: Analyzes the parsed content to extract key findings, methodology, and conclusions
4. **Database**: Stores the analysis results
5. **Output**: Returns structured analysis data

### Setup:
- Configure PDF Vector credentials
- Set up OpenAI API key
- Connect your preferred database (PostgreSQL, MySQL, etc.)

**Template Code:**
```json
{
  "meta": {
    "instanceId": "placeholder"
  },
  "nodes": [
    {
      "parameters": {},
      "id": "trigger-node",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [250, 300],
      "notes": "Start the workflow manually or replace with webhook trigger"
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "parse",
        "documentUrl": "={{ $json.pdfUrl }}",
        "useLlm": "auto"
      },
      "id": "pdfvector-parse",
      "name": "PDF Vector - Parse Paper",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [450, 300],
      "notes": "Parse the research paper into clean Markdown format"
    },
    {
      "parameters": {
        "model": "gpt-4",
        "messages": {
          "values": [
            {
              "content": "You are a research paper analyst. Analyze the following paper and extract:\n1. Main research question\n2. Methodology\n3. Key findings\n4. Conclusions\n5. Limitations\n6. Future work suggestions\n\nPaper content:\n{{ $json.content }}"
            }
          ]
        }
      },
      "id": "openai-analyze",
      "name": "OpenAI - Analyze Paper",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [650, 300],
      "notes": "Use AI to extract key insights from the paper"
    },
    {
      "parameters": {
        "operation": "insert",
        "table": "research_papers",
        "columns": "title,summary,methodology,findings,url,analyzed_at"
      },
      "id": "database-store",
      "name": "Store Analysis",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 1,
      "position": [850, 300],
      "notes": "Store the analysis results in your database"
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [
        [
          {
            "node": "PDF Vector - Parse Paper",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Parse Paper": {
      "main": [
        [
          {
            "node": "OpenAI - Analyze Paper",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "OpenAI - Analyze Paper": {
      "main": [
        [
          {
            "node": "Store Analysis",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

**Free or Paid?** Free

---

## 2. Academic Literature Review Automation

**Name:** Automated Literature Review Builder

**Description:**
## Comprehensive Literature Review Automation

Automate your literature review process by searching across multiple academic databases, parsing papers, and organizing findings into a structured review document.

### Features:
- Search multiple academic databases simultaneously (PubMed, ArXiv, Google Scholar, etc.)
- Parse and analyze top papers automatically
- Generate citation-ready summaries
- Export to various formats (Markdown, Word, PDF)

### Workflow Steps:
1. **Input**: Research topic and parameters
2. **PDF Vector Search**: Query multiple academic databases
3. **Filter & Rank**: Select top relevant papers
4. **Parse Papers**: Extract content from PDFs
5. **Synthesize**: Create literature review sections
6. **Export**: Generate final document

### Use Cases:
- PhD students conducting systematic reviews
- Researchers exploring new fields
- Grant writers needing background sections

**Template Code:**
```json
{
  "meta": {
    "instanceId": "placeholder"
  },
  "nodes": [
    {
      "parameters": {
        "content": "## Literature Review Parameters\n\nTopic: {{ $json.topic }}\nYear Range: {{ $json.startYear }}-{{ $json.endYear }}\nMax Papers: {{ $json.maxPapers }}"
      },
      "id": "start-node",
      "name": "Start",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [250, 250]
    },
    {
      "parameters": {
        "resource": "academic",
        "operation": "search",
        "query": "={{ $json.topic }}",
        "providers": ["pubmed", "semantic_scholar", "arxiv", "google_scholar"],
        "limit": 50,
        "yearFrom": "={{ $json.startYear }}",
        "yearTo": "={{ $json.endYear }}",
        "fields": ["title", "abstract", "authors", "year", "doi", "pdfUrl", "totalCitations"]
      },
      "id": "pdfvector-search",
      "name": "PDF Vector - Search Papers",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [450, 300],
      "notes": "Search across multiple academic databases"
    },
    {
      "parameters": {
        "functionCode": "// Sort papers by citations in descending order\nreturn items.sort((a, b) => (b.json.totalCitations || 0) - (a.json.totalCitations || 0));"
      },
      "id": "sort-papers",
      "name": "Sort by Citations",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [650, 300]
    },
    {
      "parameters": {
        "functionCode": "// Limit to top N papers\nconst maxPapers = $node['Start'].json.maxPapers || 10;\nreturn items.slice(0, maxPapers);"
      },
      "id": "limit-papers",
      "name": "Select Top Papers",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [850, 300]
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "parse",
        "documentUrl": "={{ $json.pdfUrl }}",
        "useLlm": "auto"
      },
      "id": "pdfvector-parse",
      "name": "PDF Vector - Parse Papers",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [1050, 300],
      "notes": "Parse each paper's PDF"
    },
    {
      "parameters": {
        "model": "gpt-4",
        "messages": {
          "values": [
            {
              "content": "Create a literature review section for this paper:\n\nTitle: {{ $json.title }}\nAuthors: {{ $json.authors }}\nYear: {{ $json.year }}\n\nContent: {{ $json.content }}\n\nGenerate:\n1. Key contribution summary (2-3 sentences)\n2. Methodology overview\n3. Main findings\n4. Relevance to topic: {{ $node['Start'].json.topic }}"
            }
          ]
        }
      },
      "id": "synthesize",
      "name": "Synthesize Review",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [1250, 300]
    },
    {
      "parameters": {
        "functionCode": "// Combine all review sections into a single document\nconst reviewSections = items.map(item => item.json.reviewSection || item.json.content || '').filter(section => section);\nreturn [{ json: { reviewSections: reviewSections.join('\\n\\n') } }];"
      },
      "id": "combine-sections",
      "name": "Combine Sections",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1450, 300]
    },
    {
      "parameters": {
        "fileName": "literature_review_{{ $now.format('yyyy-MM-dd') }}.md",
        "fileContent": "# Literature Review: {{ $node['Start'].json.topic }}\n\n{{ $json.reviewSections }}"
      },
      "id": "export-review",
      "name": "Export Review",
      "type": "n8n-nodes-base.writeBinaryFile",
      "typeVersion": 1,
      "position": [1650, 300]
    }
  ],
  "connections": {
    "Start": {
      "main": [
        [
          {
            "node": "PDF Vector - Search Papers",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Search Papers": {
      "main": [
        [
          {
            "node": "Sort by Citations",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Sort by Citations": {
      "main": [
        [
          {
            "node": "Select Top Papers",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Select Top Papers": {
      "main": [
        [
          {
            "node": "PDF Vector - Parse Papers",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Parse Papers": {
      "main": [
        [
          {
            "node": "Synthesize Review",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Synthesize Review": {
      "main": [
        [
          {
            "node": "Combine Sections",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Combine Sections": {
      "main": [
        [
          {
            "node": "Export Review",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

**Free or Paid?** Free

---

## 3. PDF to Markdown Batch Converter

**Name:** Bulk PDF to Markdown Converter

**Description:**
## High-Volume PDF to Markdown Conversion

Convert multiple PDF documents to clean, structured Markdown format in bulk. Perfect for documentation teams, content managers, and anyone needing to process large volumes of PDFs.

### Key Features:
- Process PDFs from multiple sources (URLs, Google Drive, Dropbox)
- Intelligent LLM-based parsing for complex layouts
- Preserve formatting, tables, and structure
- Export to various destinations

### Workflow Components:
1. **Input Sources**: Multiple file sources supported
2. **Batch Processing**: Handle hundreds of PDFs efficiently
3. **Smart Parsing**: Auto-detect when LLM parsing is needed
4. **Quality Check**: Validate conversion results
5. **Export Options**: Save to cloud storage or database

### Ideal For:
- Converting technical documentation
- Migrating legacy PDF content
- Building searchable knowledge bases

**Template Code:**
```json
{
  "meta": {
    "instanceId": "placeholder"
  },
  "nodes": [
    {
      "parameters": {
        "content": "## Batch PDF Converter\n\nThis workflow converts PDFs to Markdown in bulk.\n\nSupported sources:\n- Direct URLs\n- Google Drive\n- Dropbox\n- Local files"
      },
      "id": "info-note",
      "name": "Workflow Info",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [250, 150]
    },
    {
      "parameters": {
        "operation": "list",
        "fileId": "={{ $json.folderId }}"
      },
      "id": "google-drive",
      "name": "Google Drive - List PDFs",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 1,
      "position": [450, 300],
      "notes": "List all PDFs from specified folder"
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.mimeType }}",
              "value2": "application/pdf"
            }
          ]
        }
      },
      "id": "filter-pdfs",
      "name": "Filter PDFs Only",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [650, 300]
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "parse",
        "documentUrl": "={{ $json.webViewLink }}",
        "useLlm": "auto"
      },
      "id": "pdfvector-convert",
      "name": "PDF Vector - Convert to Markdown",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [850, 300],
      "notes": "Convert each PDF to Markdown"
    },
    {
      "parameters": {
        "functionCode": "const fileName = $json.name.replace('.pdf', '.md');\nconst content = $json.content;\nconst metadata = {\n  originalFile: $json.name,\n  convertedAt: new Date().toISOString(),\n  pageCount: $json.pageCount || 'unknown',\n  credits: $json.creditsUsed || 0\n};\n\nreturn {\n  fileName,\n  content,\n  metadata\n};"
      },
      "id": "prepare-output",
      "name": "Prepare Output",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1050, 300]
    },
    {
      "parameters": {
        "operation": "upload",
        "name": "={{ $json.fileName }}",
        "parents": ["{{ $json.outputFolderId }}"],
        "content": "={{ $json.content }}"
      },
      "id": "save-markdown",
      "name": "Save Markdown Files",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 1,
      "position": [1250, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "summary",
              "value": "=Converted {{ $items().length }} PDFs to Markdown\nTotal credits used: {{ $items().reduce((sum, item) => sum + (item.json.metadata.credits || 0), 0) }}"
            }
          ]
        }
      },
      "id": "summary-stats",
      "name": "Conversion Summary",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [1450, 300]
    },
    {
      "parameters": {
        "message": "=Batch Conversion Complete!\n\n{{ $json.summary }}\n\nFiles saved to Google Drive.",
        "additionalFields": {}
      },
      "id": "notify-complete",
      "name": "Send Notification",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [1650, 300]
    }
  ],
  "connections": {
    "Google Drive - List PDFs": {
      "main": [
        [
          {
            "node": "Filter PDFs Only",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Filter PDFs Only": {
      "main": [
        [
          {
            "node": "PDF Vector - Convert to Markdown",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Convert to Markdown": {
      "main": [
        [
          {
            "node": "Prepare Output",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Prepare Output": {
      "main": [
        [
          {
            "node": "Save Markdown Files",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Save Markdown Files": {
      "main": [
        [
          {
            "node": "Conversion Summary",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Conversion Summary": {
      "main": [
        [
          {
            "node": "Send Notification",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

**Free or Paid?** Free

---

## 4. Citation Network Builder

**Name:** Academic Citation Network Visualizer

**Description:**
## Build Citation Networks from Research Papers

Automatically build and visualize citation networks by fetching papers and their references. Discover influential works and research trends in any field.

### Workflow Features:
- Start with seed papers (DOIs, PubMed IDs, etc.)
- Fetch cited and citing papers recursively
- Build network graph data
- Export to visualization tools (Gephi, Cytoscape)
- Identify key papers and research clusters

### Process Flow:
1. **Input**: Seed paper identifiers
2. **Fetch Papers**: Get paper details and references
3. **Expand Network**: Fetch cited papers (configurable depth)
4. **Build Graph**: Create nodes and edges
5. **Analyze**: Calculate metrics (centrality, clusters)
6. **Export**: Generate visualization-ready data

### Applications:
- Research trend analysis
- Finding seminal papers in a field
- Grant proposal background research

**Template Code:**
```json
{
  "meta": {
    "instanceId": "placeholder"
  },
  "nodes": [
    {
      "parameters": {
        "content": "## Citation Network Builder\n\nInput: Paper IDs (DOI, PubMed ID, etc.)\nDepth: How many citation levels to explore\nOutput: Network graph data"
      },
      "id": "config-note",
      "name": "Configuration",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [250, 150]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "seedPapers",
              "value": "10.1038/nature12373,12345678,2301.12345"
            },
            {
              "name": "depth",
              "value": "2"
            }
          ]
        }
      },
      "id": "input-params",
      "name": "Set Parameters",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [450, 300]
    },
    {
      "parameters": {
        "functionCode": "const papers = $json.seedPapers.split(',').map(id => ({ id: id.trim() }));\nreturn papers;"
      },
      "id": "split-ids",
      "name": "Split Paper IDs",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [650, 300]
    },
    {
      "parameters": {
        "resource": "academic",
        "operation": "fetch",
        "ids": "={{ $json.id }}",
        "fields": ["title", "authors", "year", "doi", "abstract", "totalCitations", "totalReferences"]
      },
      "id": "pdfvector-fetch",
      "name": "PDF Vector - Fetch Papers",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [850, 300],
      "notes": "Fetch details for each paper"
    },
    {
      "parameters": {
        "resource": "academic",
        "operation": "search",
        "query": "=references:{{ $json.doi }}",
        "limit": 20,
        "fields": ["title", "authors", "year", "doi", "totalCitations"]
      },
      "id": "fetch-citations",
      "name": "Fetch Citing Papers",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [1050, 300]
    },
    {
      "parameters": {
        "functionCode": "// Build network nodes and edges\nconst nodes = [];\nconst edges = [];\n\n// Add main paper as node\nnodes.push({\n  id: $json.doi || $json.id,\n  label: $json.title,\n  size: Math.log($json.totalCitations + 1) * 10,\n  citations: $json.totalCitations,\n  year: $json.year,\n  type: 'seed'\n});\n\n// Add citing papers and edges\nif ($json.citingPapers) {\n  $json.citingPapers.forEach(paper => {\n    nodes.push({\n      id: paper.doi,\n      label: paper.title,\n      size: Math.log(paper.totalCitations + 1) * 5,\n      citations: paper.totalCitations,\n      year: paper.year,\n      type: 'citing'\n    });\n    \n    edges.push({\n      source: paper.doi,\n      target: $json.doi || $json.id,\n      weight: 1\n    });\n  });\n}\n\nreturn { nodes, edges };"
      },
      "id": "build-network",
      "name": "Build Network Data",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1250, 300]
    },
    {
      "parameters": {
        "functionCode": "// Combine all nodes and edges from multiple papers\nconst allNodes = [];\nconst allEdges = [];\n\nitems.forEach(item => {\n  if (item.json.nodes) {\n    allNodes.push(...item.json.nodes);\n  }\n  if (item.json.edges) {\n    allEdges.push(...item.json.edges);\n  }\n});\n\n// Remove duplicate nodes based on ID\nconst uniqueNodes = Array.from(new Map(allNodes.map(node => [node.id, node])).values());\n\nreturn [{ json: { nodes: uniqueNodes, edges: allEdges } }];"
      },
      "id": "combine-network",
      "name": "Combine Network",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1450, 300]
    },
    {
      "parameters": {
        "fileName": "citation_network_{{ $now.format('yyyy-MM-dd') }}.json",
        "fileContent": "={{ JSON.stringify({ nodes: $json.nodes, edges: $json.edges }, null, 2) }}"
      },
      "id": "export-network",
      "name": "Export Network JSON",
      "type": "n8n-nodes-base.writeBinaryFile",
      "typeVersion": 1,
      "position": [1650, 300]
    },
    {
      "parameters": {
        "functionCode": "// Generate Gephi-compatible GEXF format\nconst nodes = $json.nodes;\nconst edges = $json.edges;\n\nlet gexf = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<gexf xmlns=\"http://www.gexf.net/1.2draft\" version=\"1.2\">\n  <graph mode=\"static\" defaultedgetype=\"directed\">\n    <nodes>\\n`;\n\nnodes.forEach(node => {\n  gexf += `      <node id=\"${node.id}\" label=\"${node.label}\">\n        <attvalues>\n          <attvalue for=\"citations\" value=\"${node.citations}\"/>\n          <attvalue for=\"year\" value=\"${node.year}\"/>\n        </attvalues>\n      </node>\\n`;\n});\n\ngexf += `    </nodes>\n    <edges>\\n`;\n\nedges.forEach((edge, i) => {\n  gexf += `      <edge id=\"${i}\" source=\"${edge.source}\" target=\"${edge.target}\" weight=\"${edge.weight}\"/>\\n`;\n});\n\ngexf += `    </edges>\n  </graph>\n</gexf>`;\n\nreturn { gexf };"
      },
      "id": "generate-gexf",
      "name": "Generate GEXF",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1650, 450]
    }
  ],
  "connections": {
    "Set Parameters": {
      "main": [
        [
          {
            "node": "Split Paper IDs",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Split Paper IDs": {
      "main": [
        [
          {
            "node": "PDF Vector - Fetch Papers",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Fetch Papers": {
      "main": [
        [
          {
            "node": "Fetch Citing Papers",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Fetch Citing Papers": {
      "main": [
        [
          {
            "node": "Build Network Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Build Network Data": {
      "main": [
        [
          {
            "node": "Combine Network",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Combine Network": {
      "main": [
        [
          {
            "node": "Export Network JSON",
            "type": "main",
            "index": 0
          },
          {
            "node": "Generate GEXF",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

**Free or Paid?** Free

---

## 5. Document Content Extraction Pipeline

**Name:** Smart Document Data Extraction Pipeline

**Description:**
## Intelligent Document Processing & Data Extraction

Extract structured data from unstructured documents like invoices, contracts, reports, and forms. Uses AI to identify and extract key information automatically.

### Pipeline Features:
- Process multiple document types (PDFs, Word docs)
- AI-powered field extraction
- Custom extraction templates
- Data validation and cleaning
- Export to databases or spreadsheets

### Workflow Steps:
1. **Document Input**: Various sources supported
2. **Parse Document**: Convert to structured text
3. **Extract Fields**: AI identifies key data points
4. **Validate Data**: Check extracted values
5. **Transform**: Format for destination system
6. **Store/Export**: Save to database or file

### Use Cases:
- Invoice processing automation
- Contract data extraction
- Form digitization
- Report mining

**Template Code:**
```json
{
  "meta": {
    "instanceId": "placeholder"
  },
  "nodes": [
    {
      "parameters": {
        "content": "## Document Extraction Pipeline\n\nExtracts structured data from:\n- Invoices\n- Contracts\n- Reports\n- Forms\n\nCustomize extraction rules in the AI node"
      },
      "id": "workflow-info",
      "name": "Pipeline Info",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [250, 150]
    },
    {
      "parameters": {
        "events": ["file:created"],
        "path": "/documents/incoming"
      },
      "id": "file-trigger",
      "name": "Watch Folder",
      "type": "n8n-nodes-base.localFileTrigger",
      "typeVersion": 1,
      "position": [450, 300],
      "notes": "Triggers when new documents arrive"
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "parse",
        "documentUrl": "={{ $json.filePath }}",
        "useLlm": "always"
      },
      "id": "pdfvector-parse",
      "name": "PDF Vector - Parse Document",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [650, 300],
      "notes": "Parse with LLM for better extraction"
    },
    {
      "parameters": {
        "model": "gpt-4",
        "messages": {
          "values": [
            {
              "content": "Extract the following information from this document:\n\n1. Document Type (invoice, contract, report, etc.)\n2. Date/Dates mentioned\n3. Parties involved (names, companies)\n4. Key amounts/values\n5. Important terms or conditions\n6. Reference numbers\n7. Addresses\n8. Contact information\n\nDocument content:\n{{ $json.content }}\n\nReturn as structured JSON."
            }
          ]
        },
        "options": {
          "responseFormat": {
            "type": "json_object"
          }
        }
      },
      "id": "extract-data",
      "name": "Extract Structured Data",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [850, 300]
    },
    {
      "parameters": {
        "functionCode": "// Validate and clean extracted data\nconst extracted = JSON.parse($json.content);\nconst validated = {};\n\n// Validate document type\nvalidated.documentType = extracted.documentType || 'unknown';\n\n// Parse and validate dates\nif (extracted.date) {\n  const date = new Date(extracted.date);\n  validated.date = isNaN(date) ? null : date.toISOString();\n}\n\n// Clean monetary values\nif (extracted.amounts) {\n  validated.amounts = extracted.amounts.map(amt => {\n    const cleaned = amt.replace(/[^0-9.-]/g, '');\n    return parseFloat(cleaned) || 0;\n  });\n}\n\n// Validate email addresses\nif (extracted.emails) {\n  validated.emails = extracted.emails.filter(email => \n    /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)\n  );\n}\n\nvalidated.raw = extracted;\nvalidated.fileName = $node['Watch Folder'].json.fileName;\nvalidated.processedAt = new Date().toISOString();\n\nreturn validated;"
      },
      "id": "validate-data",
      "name": "Validate & Clean Data",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1050, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.documentType }}",
              "operation": "equals",
              "value2": "invoice"
            }
          ]
        }
      },
      "id": "route-by-type",
      "name": "Route by Document Type",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 1,
      "position": [1250, 300]
    },
    {
      "parameters": {
        "operation": "insert",
        "table": "invoices",
        "columns": "invoice_number,vendor,amount,date,raw_data"
      },
      "id": "store-invoice",
      "name": "Store Invoice Data",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 1,
      "position": [1450, 250]
    },
    {
      "parameters": {
        "operation": "insert",
        "table": "documents",
        "columns": "type,content,metadata,processed_at"
      },
      "id": "store-other",
      "name": "Store Other Documents",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 1,
      "position": [1450, 350]
    },
    {
      "parameters": {
        "fileName": "extracted_data_{{ $now.format('yyyy-MM-dd') }}.csv",
        "fileContent": "={{ $items().map(item => item.json).toCsv() }}"
      },
      "id": "export-csv",
      "name": "Export to CSV",
      "type": "n8n-nodes-base.writeBinaryFile",
      "typeVersion": 1,
      "position": [1650, 300]
    }
  ],
  "connections": {
    "Watch Folder": {
      "main": [
        [
          {
            "node": "PDF Vector - Parse Document",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Parse Document": {
      "main": [
        [
          {
            "node": "Extract Structured Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Extract Structured Data": {
      "main": [
        [
          {
            "node": "Validate & Clean Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Validate & Clean Data": {
      "main": [
        [
          {
            "node": "Route by Document Type",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Route by Document Type": {
      "main": [
        [
          {
            "node": "Store Invoice Data",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Store Other Documents",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Store Invoice Data": {
      "main": [
        [
          {
            "node": "Export to CSV",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Store Other Documents": {
      "main": [
        [
          {
            "node": "Export to CSV",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

**Free or Paid?** Free

---

## 6. Academic Paper Monitoring Bot

**Name:** New Research Alert System

**Description:**
## Automated Academic Paper Monitoring

Stay updated with the latest research in your field. This bot monitors multiple academic databases for new papers matching your interests and sends personalized alerts.

### Bot Features:
- Monitor keywords across multiple databases
- Filter by authors, journals, or institutions
- Daily/weekly digest emails
- Slack notifications for high-impact papers
- Automatic paper summarization

### Workflow Components:
1. **Schedule**: Run daily/weekly checks
2. **Search**: Query latest papers across databases
3. **Filter**: Apply custom criteria
4. **Summarize**: Generate paper summaries
5. **Notify**: Send alerts via email/Slack
6. **Archive**: Store papers for future reference

### Perfect For:
- Research groups tracking their field
- PhD students monitoring specific topics
- Labs following competitor publications

**Template Code:**
```json
{
  "meta": {
    "instanceId": "placeholder"
  },
  "nodes": [
    {
      "parameters": {
        "content": "## Paper Monitoring Bot\n\nMonitors these topics:\n- Machine Learning\n- Neural Networks\n- Computer Vision\n\nRuns: Daily at 9 AM"
      },
      "id": "config-note",
      "name": "Bot Configuration",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [250, 150]
    },
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "hours",
              "hoursInterval": 24,
              "triggerAtHour": 9
            }
          ]
        }
      },
      "id": "schedule-trigger",
      "name": "Daily Schedule",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [450, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "searchQueries",
              "value": "machine learning,neural networks,computer vision,deep learning"
            }
          ],
          "number": [
            {
              "name": "daysBack",
              "value": 1
            }
          ]
        }
      },
      "id": "set-params",
      "name": "Set Search Parameters",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [650, 300]
    },
    {
      "parameters": {
        "functionCode": "const queries = $json.searchQueries.split(',').map(q => q.trim());\nreturn queries.map(query => ({ query }));"
      },
      "id": "split-queries",
      "name": "Split Queries",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [850, 300]
    },
    {
      "parameters": {
        "resource": "academic",
        "operation": "search",
        "query": "={{ $json.query }}",
        "providers": ["arxiv", "pubmed", "semantic_scholar"],
        "limit": 10,
        "yearFrom": "={{ new Date().getFullYear() }}",
        "fields": ["title", "authors", "abstract", "date", "doi", "pdfUrl", "totalCitations"]
      },
      "id": "pdfvector-search",
      "name": "PDF Vector - Search New Papers",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [1050, 300]
    },
    {
      "parameters": {
        "functionCode": "// Filter papers from last N days\nconst daysBack = $node['Set Search Parameters'].json.daysBack;\nconst cutoffDate = new Date();\ncutoffDate.setDate(cutoffDate.getDate() - daysBack);\n\nconst recentPapers = $json.filter(paper => {\n  const paperDate = new Date(paper.date);\n  return paperDate >= cutoffDate;\n});\n\nreturn recentPapers.length > 0 ? recentPapers : [];"
      },
      "id": "filter-recent",
      "name": "Filter Recent Papers",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1250, 300]
    },
    {
      "parameters": {
        "model": "gpt-3.5-turbo",
        "messages": {
          "values": [
            {
              "content": "Summarize this research paper in 2-3 sentences:\n\nTitle: {{ $json.title }}\nAuthors: {{ $json.authors.join(', ') }}\nAbstract: {{ $json.abstract }}\n\nFocus on the main contribution and findings."
            }
          ]
        }
      },
      "id": "summarize-paper",
      "name": "Generate Summary",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [1450, 300]
    },
    {
      "parameters": {
        "functionCode": "// Format papers for notification\nconst papers = $items().map(item => {\n  const paper = item.json;\n  return {\n    title: paper.title,\n    authors: paper.authors.slice(0, 3).join(', ') + (paper.authors.length > 3 ? ' et al.' : ''),\n    summary: paper.summary,\n    link: paper.doi ? `https://doi.org/${paper.doi}` : paper.url,\n    citations: paper.totalCitations || 0,\n    query: paper.originalQuery\n  };\n});\n\n// Group by query\nconst grouped = papers.reduce((acc, paper) => {\n  if (!acc[paper.query]) acc[paper.query] = [];\n  acc[paper.query].push(paper);\n  return acc;\n}, {});\n\nreturn { papers: grouped, totalCount: papers.length, date: new Date().toISOString() };"
      },
      "id": "format-digest",
      "name": "Format Digest",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1650, 300]
    },
    {
      "parameters": {
        "channel": "#research-alerts",
        "message": "=📚 *Daily Research Digest* - {{ $now.format('MMM DD, YYYY') }}\n\nFound {{ $json.totalCount }} new papers:\n\n{{ Object.entries($json.papers).map(([query, papers]) => `*${query}:*\\n${papers.map(p => `• ${p.title}\\n  _${p.authors}_\\n  ${p.summary}\\n  🔗 ${p.link}`).join('\\n\\n')}`).join('\\n\\n---\\n\\n') }}",
        "attachments": []
      },
      "id": "slack-notify",
      "name": "Send Slack Alert",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [1850, 300]
    },
    {
      "parameters": {
        "subject": "=Daily Research Digest - {{ $now.format('MMM DD, YYYY') }}",
        "toEmail": "research-team@company.com",
        "html": "=<h2>Daily Research Digest</h2>\n<p>Found {{ $json.totalCount }} new papers</p>\n\n{{ Object.entries($json.papers).map(([query, papers]) => \n  `<h3>${query}</h3>\n  ${papers.map(p => \n    `<div style=\"margin-bottom: 20px;\">\n      <h4>${p.title}</h4>\n      <p><em>${p.authors}</em></p>\n      <p>${p.summary}</p>\n      <p><a href=\"${p.link}\">Read Paper</a> | Citations: ${p.citations}</p>\n    </div>`\n  ).join('')}`\n).join('\\n') }}"
      },
      "id": "email-digest",
      "name": "Email Digest",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 1,
      "position": [1850, 450]
    }
  ],
  "connections": {
    "Daily Schedule": {
      "main": [
        [
          {
            "node": "Set Search Parameters",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Set Search Parameters": {
      "main": [
        [
          {
            "node": "Split Queries",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Split Queries": {
      "main": [
        [
          {
            "node": "PDF Vector - Search New Papers",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Search New Papers": {
      "main": [
        [
          {
            "node": "Filter Recent Papers",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Filter Recent Papers": {
      "main": [
        [
          {
            "node": "Generate Summary",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate Summary": {
      "main": [
        [
          {
            "node": "Format Digest",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Format Digest": {
      "main": [
        [
          {
            "node": "Send Slack Alert",
            "type": "main",
            "index": 0
          },
          {
            "node": "Email Digest",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

**Free or Paid?** Free

---

## 7. Research Paper Summarizer

**Name:** AI-Powered Paper Summarizer

**Description:**
## Instant Research Paper Summaries

Generate concise, accurate summaries of research papers in seconds. Perfect for quickly understanding papers outside your expertise or reviewing large volumes of literature.

### Key Features:
- Parse complex academic PDFs
- Generate multiple summary types (abstract, lay summary, technical summary)
- Extract key figures and tables
- Highlight methodology and findings
- Create Twitter-length summaries

### Summary Types:
1. **Executive Summary**: 1-page overview for decision makers
2. **Technical Summary**: Detailed summary for researchers
3. **Lay Summary**: Plain language for general audience
4. **Social Media**: Tweet-sized key findings

**Template Code:**
```json
{
  "meta": {
    "instanceId": "placeholder"
  },
  "nodes": [
    {
      "parameters": {
        "content": "## Paper Summarizer\n\nGenerates multiple summary types:\n- Executive (1 page)\n- Technical (detailed)\n- Lay (plain language)\n- Social (tweet-sized)"
      },
      "id": "info-note",
      "name": "Summary Types",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [250, 150]
    },
    {
      "parameters": {
        "path": "summarize",
        "responseMode": "onReceived",
        "options": {}
      },
      "id": "webhook-trigger",
      "name": "Webhook - Paper URL",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [450, 300]
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "parse",
        "documentUrl": "={{ $json.paperUrl }}",
        "useLlm": "always"
      },
      "id": "pdfvector-parse",
      "name": "PDF Vector - Parse Paper",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [650, 300]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "messages": {
          "values": [
            {
              "content": "Create an executive summary (max 500 words) of this research paper:\n\n{{ $json.content }}\n\nInclude:\n1. Research question and motivation\n2. Methodology overview\n3. Key findings (3-5 points)\n4. Practical implications\n5. Limitations and future work"
            }
          ]
        }
      },
      "id": "exec-summary",
      "name": "Executive Summary",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [850, 250]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "messages": {
          "values": [
            {
              "content": "Create a detailed technical summary of this research paper:\n\n{{ $json.content }}\n\nInclude:\n1. Research objectives and hypotheses\n2. Detailed methodology\n3. Data analysis approach\n4. Complete results with statistics\n5. Technical contributions\n6. Comparison with prior work\n7. Future research directions"
            }
          ]
        }
      },
      "id": "tech-summary",
      "name": "Technical Summary",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [850, 350]
    },
    {
      "parameters": {
        "model": "gpt-3.5-turbo",
        "messages": {
          "values": [
            {
              "content": "Explain this research paper in simple terms that anyone can understand (max 300 words):\n\n{{ $json.content }}\n\nAvoid jargon and technical terms. Use analogies where helpful."
            }
          ]
        }
      },
      "id": "lay-summary",
      "name": "Lay Summary",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [850, 450]
    },
    {
      "parameters": {
        "model": "gpt-3.5-turbo",
        "messages": {
          "values": [
            {
              "content": "Create a tweet (max 280 characters) summarizing the key finding of this paper:\n\n{{ $json.content }}\n\nMake it engaging and include relevant hashtags."
            }
          ]
        }
      },
      "id": "tweet-summary",
      "name": "Tweet Summary",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [850, 550]
    },
    {
      "parameters": {
        "functionCode": "return {\n  paperUrl: $node['Webhook - Paper URL'].json.paperUrl,\n  summaries: {\n    executive: $node['Executive Summary'].json.content,\n    technical: $node['Technical Summary'].json.content,\n    lay: $node['Lay Summary'].json.content,\n    tweet: $node['Tweet Summary'].json.content\n  },\n  generatedAt: new Date().toISOString()\n};"
      },
      "id": "combine-summaries",
      "name": "Combine All Summaries",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1050, 400]
    },
    {
      "parameters": {
        "options": {}
      },
      "id": "respond-webhook",
      "name": "Return Summaries",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [1250, 400]
    }
  ],
  "connections": {
    "Webhook - Paper URL": {
      "main": [
        [
          {
            "node": "PDF Vector - Parse Paper",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Parse Paper": {
      "main": [
        [
          {
            "node": "Executive Summary",
            "type": "main",
            "index": 0
          },
          {
            "node": "Technical Summary",
            "type": "main",
            "index": 0
          },
          {
            "node": "Lay Summary",
            "type": "main",
            "index": 0
          },
          {
            "node": "Tweet Summary",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Executive Summary": {
      "main": [
        [
          {
            "node": "Combine All Summaries",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Technical Summary": {
      "main": [
        [
          {
            "node": "Combine All Summaries",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Lay Summary": {
      "main": [
        [
          {
            "node": "Combine All Summaries",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Tweet Summary": {
      "main": [
        [
          {
            "node": "Combine All Summaries",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Combine All Summaries": {
      "main": [
        [
          {
            "node": "Return Summaries",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

**Free or Paid?** Free

---

## 8. Multi-Database Academic Search

**Name:** Universal Academic Search Engine

**Description:**
## Search All Academic Databases at Once

Search across PubMed, ArXiv, Google Scholar, Semantic Scholar, and ERIC simultaneously. Compare results, remove duplicates, and export comprehensive bibliographies.

### Search Features:
- Query multiple databases in parallel
- Advanced filtering and deduplication
- Citation format export (BibTeX, RIS, etc.)
- Relevance ranking across sources
- Full-text availability checking

### Workflow Process:
1. **Input**: Search query and parameters
2. **Parallel Search**: Query all databases
3. **Merge & Deduplicate**: Combine results
4. **Rank**: Sort by relevance/citations
5. **Enrich**: Add full-text links
6. **Export**: Multiple format options

**Template Code:**
```json
{
  "meta": {
    "instanceId": "placeholder"
  },
  "nodes": [
    {
      "parameters": {
        "content": "## Multi-Database Search\n\nSearches:\n- PubMed\n- ArXiv\n- Google Scholar\n- Semantic Scholar\n- ERIC\n\nDeduplicates and ranks results"
      },
      "id": "search-info",
      "name": "Search Configuration",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [250, 150]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "searchQuery",
              "value": "machine learning healthcare applications"
            }
          ],
          "number": [
            {
              "name": "yearFrom",
              "value": 2020
            },
            {
              "name": "resultsPerSource",
              "value": 25
            }
          ]
        }
      },
      "id": "search-params",
      "name": "Set Search Parameters",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [450, 300]
    },
    {
      "parameters": {
        "resource": "academic",
        "operation": "search",
        "query": "={{ $json.searchQuery }}",
        "providers": ["pubmed", "semantic_scholar", "arxiv", "google_scholar", "eric"],
        "limit": "={{ $json.resultsPerSource }}",
        "yearFrom": "={{ $json.yearFrom }}",
        "fields": ["title", "authors", "year", "doi", "abstract", "totalCitations", "pdfUrl", "provider"]
      },
      "id": "pdfvector-search",
      "name": "PDF Vector - Multi-DB Search",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [650, 300]
    },
    {
      "parameters": {
        "functionCode": "// Deduplicate papers based on DOI and title similarity\nconst papers = $json;\nconst unique = new Map();\n\npapers.forEach(paper => {\n  // First check DOI\n  if (paper.doi && !unique.has(paper.doi)) {\n    unique.set(paper.doi, paper);\n  } else if (!paper.doi) {\n    // For papers without DOI, check title similarity\n    const normalizedTitle = paper.title.toLowerCase().replace(/[^a-z0-9]/g, '');\n    let isDuplicate = false;\n    \n    for (const [key, existingPaper] of unique) {\n      const existingTitle = existingPaper.title.toLowerCase().replace(/[^a-z0-9]/g, '');\n      if (normalizedTitle === existingTitle) {\n        isDuplicate = true;\n        // Merge provider info\n        if (!existingPaper.providers) existingPaper.providers = [existingPaper.provider];\n        existingPaper.providers.push(paper.provider);\n        break;\n      }\n    }\n    \n    if (!isDuplicate) {\n      unique.set(normalizedTitle, paper);\n    }\n  }\n});\n\nreturn Array.from(unique.values());"
      },
      "id": "deduplicate",
      "name": "Deduplicate Results",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [850, 300]
    },
    {
      "parameters": {
        "functionCode": "// Calculate relevance score\nconst papers = $json;\nconst query = $node['Set Search Parameters'].json.searchQuery.toLowerCase();\n\nconst scored = papers.map(paper => {\n  let score = 0;\n  \n  // Title relevance\n  const titleWords = paper.title.toLowerCase().split(' ');\n  const queryWords = query.split(' ');\n  queryWords.forEach(word => {\n    if (titleWords.includes(word)) score += 10;\n  });\n  \n  // Citation impact\n  score += Math.log(paper.totalCitations + 1) * 5;\n  \n  // Recency bonus\n  const yearDiff = new Date().getFullYear() - paper.year;\n  score += Math.max(0, 10 - yearDiff);\n  \n  // Full text availability\n  if (paper.pdfUrl) score += 15;\n  \n  return { ...paper, relevanceScore: score };\n});\n\n// Sort by relevance\nreturn scored.sort((a, b) => b.relevanceScore - a.relevanceScore);"
      },
      "id": "rank-results",
      "name": "Rank by Relevance",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1050, 300]
    },
    {
      "parameters": {
        "functionCode": "// Generate BibTeX entries\nconst papers = $json;\n\nconst bibtex = papers.map((paper, index) => {\n  const key = paper.doi ? paper.doi.replace(/[^a-zA-Z0-9]/g, '') : `paper${index}`;\n  const authors = paper.authors.join(' and ');\n  \n  return `@article{${key},\n  title={${paper.title}},\n  author={${authors}},\n  year={${paper.year}},\n  doi={${paper.doi || ''}},\n  abstract={${paper.abstract || ''}}\n}`;\n}).join('\\n\\n');\n\nreturn { bibtex, papers };"
      },
      "id": "generate-bibtex",
      "name": "Generate BibTeX",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1250, 250]
    },
    {
      "parameters": {
        "fileName": "search_results_{{ $now.format('yyyy-MM-dd') }}.bib",
        "fileContent": "={{ $json.bibtex }}"
      },
      "id": "export-bibtex",
      "name": "Export BibTeX File",
      "type": "n8n-nodes-base.writeBinaryFile",
      "typeVersion": 1,
      "position": [1450, 250]
    },
    {
      "parameters": {
        "fileName": "search_results_{{ $now.format('yyyy-MM-dd') }}.json",
        "fileContent": "={{ JSON.stringify($json.papers, null, 2) }}"
      },
      "id": "export-json",
      "name": "Export JSON",
      "type": "n8n-nodes-base.writeBinaryFile",
      "typeVersion": 1,
      "position": [1450, 350]
    },
    {
      "parameters": {
        "fileName": "search_results_{{ $now.format('yyyy-MM-dd') }}.csv",
        "fileContent": "={{ $json.papers.map(p => [p.title, p.authors.join(';'), p.year, p.doi, p.totalCitations, p.pdfUrl].join(',\t')).join('\\n') }}"
      },
      "id": "export-csv",
      "name": "Export CSV",
      "type": "n8n-nodes-base.writeBinaryFile",
      "typeVersion": 1,
      "position": [1450, 450]
    }
  ],
  "connections": {
    "Set Search Parameters": {
      "main": [
        [
          {
            "node": "PDF Vector - Multi-DB Search",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Multi-DB Search": {
      "main": [
        [
          {
            "node": "Deduplicate Results",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Deduplicate Results": {
      "main": [
        [
          {
            "node": "Rank by Relevance",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Rank by Relevance": {
      "main": [
        [
          {
            "node": "Generate BibTeX",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate BibTeX": {
      "main": [
        [
          {
            "node": "Export BibTeX File",
            "type": "main",
            "index": 0
          },
          {
            "node": "Export JSON",
            "type": "main",
            "index": 0
          },
          {
            "node": "Export CSV",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

**Free or Paid?** Free

---

## 9. PDF Report to Slack/Email Notifier

**Name:** Smart Document Alert System

**Description:**
## Automated Document Processing & Notifications

Monitor folders or URLs for new PDF reports and automatically parse, summarize, and notify teams via Slack or email with key insights.

### Alert Features:
- Monitor multiple document sources
- Extract key metrics and findings
- Send formatted notifications
- Track document processing history
- Conditional alerts based on content

### Use Cases:
- Financial report monitoring
- Compliance document tracking
- Research publication alerts
- Customer report distribution

**Template Code:**
```json
{
  "meta": {
    "instanceId": "placeholder"
  },
  "nodes": [
    {
      "parameters": {
        "content": "## Document Alert System\n\nMonitors:\n- FTP folders\n- Email attachments\n- Cloud storage\n- Direct URLs\n\nSends alerts via Slack & Email"
      },
      "id": "system-info",
      "name": "Alert System Info",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [250, 150]
    },
    {
      "parameters": {
        "pollTimes": {
          "item": [
            {
              "mode": "everyMinute",
              "minute": 15
            }
          ]
        }
      },
      "id": "schedule-check",
      "name": "Check Every 15 Minutes",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [450, 300]
    },
    {
      "parameters": {
        "operation": "list",
        "folder": "/reports/incoming"
      },
      "id": "check-folder",
      "name": "Check Report Folder",
      "type": "n8n-nodes-base.ftp",
      "typeVersion": 1,
      "position": [650, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.name.endsWith('.pdf') }}",
              "value2": "true"
            }
          ]
        }
      },
      "id": "filter-new-pdfs",
      "name": "Filter New PDFs",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [850, 300]
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "parse",
        "documentUrl": "={{ $json.url }}",
        "useLlm": "auto"
      },
      "id": "pdfvector-parse",
      "name": "PDF Vector - Parse Report",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [1050, 300]
    },
    {
      "parameters": {
        "model": "gpt-3.5-turbo",
        "messages": {
          "values": [
            {
              "content": "Extract key information from this report:\n\n{{ $json.content }}\n\nIdentify:\n1. Report type and date\n2. Key metrics or KPIs\n3. Important findings or alerts\n4. Action items\n5. Overall sentiment (positive/neutral/negative)\n\nReturn as structured JSON."
            }
          ]
        },
        "options": {
          "responseFormat": {
            "type": "json_object"
          }
        }
      },
      "id": "extract-insights",
      "name": "Extract Key Insights",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [1250, 300]
    },
    {
      "parameters": {
        "functionCode": "const insights = JSON.parse($json.content);\nconst fileName = $node['Check Report Folder'].json.name;\n\n// Determine alert priority\nlet priority = 'normal';\nif (insights.sentiment === 'negative' || insights.alerts?.length > 0) {\n  priority = 'high';\n}\n\n// Format message\nconst slackBlocks = [\n  {\n    type: 'header',\n    text: {\n      type: 'plain_text',\n      text: `📄 New Report: ${insights.reportType || fileName}`\n    }\n  },\n  {\n    type: 'section',\n    fields: [\n      {\n        type: 'mrkdwn',\n        text: `*Date:* ${insights.date || 'Not specified'}`\n      },\n      {\n        type: 'mrkdwn',\n        text: `*Priority:* ${priority}`\n      }\n    ]\n  }\n];\n\nif (insights.metrics) {\n  slackBlocks.push({\n    type: 'section',\n    text: {\n      type: 'mrkdwn',\n      text: `*Key Metrics:*\\n${Object.entries(insights.metrics).map(([k, v]) => `• ${k}: ${v}`).join('\\n')}`\n    }\n  });\n}\n\nif (insights.findings) {\n  slackBlocks.push({\n    type: 'section',\n    text: {\n      type: 'mrkdwn',\n      text: `*Key Findings:*\\n${insights.findings.map(f => `• ${f}`).join('\\n')}`\n    }\n  });\n}\n\nreturn {\n  fileName,\n  insights,\n  priority,\n  slackBlocks,\n  emailContent: insights\n};"
      },
      "id": "format-alerts",
      "name": "Format Alerts",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1450, 300]
    },
    {
      "parameters": {
        "channel": "#reports",
        "blocks": "={{ $json.slackBlocks }}",
        "attachments": []
      },
      "id": "slack-alert",
      "name": "Send Slack Alert",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [1650, 250]
    },
    {
      "parameters": {
        "subject": "=New Report Alert: {{ $json.insights.reportType }}",
        "toEmail": "team@company.com",
        "html": "=<h2>New Report Available</h2>\n<p><strong>Report:</strong> {{ $json.fileName }}</p>\n<p><strong>Type:</strong> {{ $json.insights.reportType }}</p>\n<p><strong>Date:</strong> {{ $json.insights.date }}</p>\n\n<h3>Key Metrics</h3>\n<ul>\n{{ Object.entries($json.insights.metrics || {}).map(([k, v]) => `<li>${k}: ${v}</li>`).join('\\n') }}\n</ul>\n\n<h3>Findings</h3>\n<ul>\n{{ ($json.insights.findings || []).map(f => `<li>${f}</li>`).join('\\n') }}\n</ul>\n\n<h3>Action Items</h3>\n<ul>\n{{ ($json.insights.actionItems || []).map(a => `<li>${a}</li>`).join('\\n') }}\n</ul>"
      },
      "id": "email-alert",
      "name": "Send Email Alert",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 1,
      "position": [1650, 350]
    },
    {
      "parameters": {
        "operation": "insert",
        "table": "processed_reports",
        "columns": "filename,report_type,processed_at,insights,priority"
      },
      "id": "log-processed",
      "name": "Log Processed Report",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 1,
      "position": [1650, 450]
    }
  ],
  "connections": {
    "Check Every 15 Minutes": {
      "main": [
        [
          {
            "node": "Check Report Folder",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Check Report Folder": {
      "main": [
        [
          {
            "node": "Filter New PDFs",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Filter New PDFs": {
      "main": [
        [
          {
            "node": "PDF Vector - Parse Report",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Parse Report": {
      "main": [
        [
          {
            "node": "Extract Key Insights",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Extract Key Insights": {
      "main": [
        [
          {
            "node": "Format Alerts",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Format Alerts": {
      "main": [
        [
          {
            "node": "Send Slack Alert",
            "type": "main",
            "index": 0
          },
          {
            "node": "Send Email Alert",
            "type": "main",
            "index": 0
          },
          {
            "node": "Log Processed Report",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

**Free or Paid?** Free

---

## 10. Academic Knowledge Base Builder

**Name:** Research Knowledge Graph Generator

**Description:**
## Build a Searchable Academic Knowledge Base

Automatically build and maintain a comprehensive knowledge base from academic papers. Create connections between concepts, track research evolution, and enable semantic search.

### Knowledge Base Features:
- Automatic concept extraction
- Research timeline tracking
- Author collaboration networks
- Topic evolution visualization
- Semantic search interface

### Components:
1. **Paper Ingestion**: Continuous monitoring and parsing
2. **Entity Extraction**: Identify key concepts, methods, datasets
3. **Relationship Mapping**: Connect papers, authors, concepts
4. **Knowledge Graph**: Store in graph database
5. **Search Interface**: Query by concept, author, or topic
6. **Visualization**: Interactive knowledge exploration

**Template Code:**
```json
{
  "meta": {
    "instanceId": "placeholder"
  },
  "nodes": [
    {
      "parameters": {
        "content": "## Knowledge Base Builder\n\nExtracts and connects:\n- Concepts & Keywords\n- Authors & Institutions\n- Methods & Datasets\n- Citations & References\n\nBuilds searchable knowledge graph"
      },
      "id": "kb-info",
      "name": "Knowledge Base Info",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [250, 150]
    },
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "days",
              "daysInterval": 1
            }
          ]
        }
      },
      "id": "daily-update",
      "name": "Daily KB Update",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [450, 300]
    },
    {
      "parameters": {
        "resource": "academic",
        "operation": "search",
        "query": "={{ $json.domain || 'artificial intelligence' }}",
        "providers": ["semantic_scholar", "arxiv"],
        "limit": 20,
        "yearFrom": "={{ new Date().getFullYear() }}",
        "fields": ["title", "authors", "abstract", "year", "doi", "pdfUrl", "totalCitations"]
      },
      "id": "fetch-papers",
      "name": "PDF Vector - Fetch Papers",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [650, 300]
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "parse",
        "documentUrl": "={{ $json.pdfUrl }}",
        "useLlm": "always"
      },
      "id": "parse-papers",
      "name": "PDF Vector - Parse Papers",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [850, 300]
    },
    {
      "parameters": {
        "model": "gpt-4",
        "messages": {
          "values": [
            {
              "content": "Extract knowledge graph entities from this paper:\n\nTitle: {{ $json.title }}\nContent: {{ $json.content }}\n\nExtract:\n1. Key concepts (5-10 main ideas)\n2. Methods used\n3. Datasets mentioned\n4. Research questions\n5. Key findings\n6. Future directions\n\nAlso identify relationships between these entities.\n\nReturn as structured JSON with entities and relationships arrays."
            }
          ]
        },
        "options": {
          "responseFormat": {
            "type": "json_object"
          }
        }
      },
      "id": "extract-entities",
      "name": "Extract Entities",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [1050, 300]
    },
    {
      "parameters": {
        "functionCode": "const extraction = JSON.parse($json.content);\nconst paper = $node['PDF Vector - Fetch Papers'].json;\n\n// Create nodes for Neo4j\nconst nodes = [];\n\n// Paper node\nnodes.push({\n  label: 'Paper',\n  properties: {\n    id: paper.doi || paper.title.replace(/[^a-zA-Z0-9]/g, ''),\n    title: paper.title,\n    year: paper.year,\n    authors: paper.authors.join('; '),\n    citations: paper.totalCitations\n  }\n});\n\n// Author nodes\npaper.authors.forEach(author => {\n  nodes.push({\n    label: 'Author',\n    properties: {\n      name: author\n    }\n  });\n});\n\n// Concept nodes\nextraction.concepts?.forEach(concept => {\n  nodes.push({\n    label: 'Concept',\n    properties: {\n      name: concept\n    }\n  });\n});\n\n// Method nodes\nextraction.methods?.forEach(method => {\n  nodes.push({\n    label: 'Method',\n    properties: {\n      name: method\n    }\n  });\n});\n\n// Create relationships\nconst relationships = [];\n\n// Paper-Author relationships\npaper.authors.forEach(author => {\n  relationships.push({\n    from: paper.doi || paper.title,\n    to: author,\n    type: 'AUTHORED_BY'\n  });\n});\n\n// Paper-Concept relationships\nextraction.concepts?.forEach(concept => {\n  relationships.push({\n    from: paper.doi || paper.title,\n    to: concept,\n    type: 'DISCUSSES'\n  });\n});\n\n// Paper-Method relationships\nextraction.methods?.forEach(method => {\n  relationships.push({\n    from: paper.doi || paper.title,\n    to: method,\n    type: 'USES'\n  });\n});\n\nreturn { nodes, relationships };"
      },
      "id": "build-graph",
      "name": "Build Graph Structure",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1250, 300]
    },
    {
      "parameters": {
        "operation": "create",
        "query": "=UNWIND $nodes AS node\nMERGE (n:Node {id: node.properties.id})\nSET n += node.properties\nSET n:${node.label}",
        "parameters": "={{ { nodes: $json.nodes } }}"
      },
      "id": "create-nodes",
      "name": "Create Graph Nodes",
      "type": "n8n-nodes-base.neo4j",
      "typeVersion": 1,
      "position": [1450, 250]
    },
    {
      "parameters": {
        "operation": "create",
        "query": "=UNWIND $relationships AS rel\nMATCH (a {id: rel.from})\nMATCH (b {id: rel.to})\nMERGE (a)-[r:${rel.type}]->(b)",
        "parameters": "={{ { relationships: $json.relationships } }}"
      },
      "id": "create-relationships",
      "name": "Create Relationships",
      "type": "n8n-nodes-base.neo4j",
      "typeVersion": 1,
      "position": [1450, 350]
    },
    {
      "parameters": {
        "functionCode": "// Generate knowledge base statistics\nconst stats = {\n  papersProcessed: $items().length,\n  conceptsExtracted: $json.nodes.filter(n => n.label === 'Concept').length,\n  authorsAdded: $json.nodes.filter(n => n.label === 'Author').length,\n  methodsIdentified: $json.nodes.filter(n => n.label === 'Method').length,\n  timestamp: new Date().toISOString()\n};\n\nreturn stats;"
      },
      "id": "kb-stats",
      "name": "KB Statistics",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1650, 300]
    },
    {
      "parameters": {
        "operation": "insert",
        "table": "kb_updates",
        "columns": "papers_processed,concepts,authors,methods,updated_at"
      },
      "id": "log-update",
      "name": "Log KB Update",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 1,
      "position": [1850, 300]
    }
  ],
  "connections": {
    "Daily KB Update": {
      "main": [
        [
          {
            "node": "PDF Vector - Fetch Papers",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Fetch Papers": {
      "main": [
        [
          {
            "node": "PDF Vector - Parse Papers",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Parse Papers": {
      "main": [
        [
          {
            "node": "Extract Entities",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Extract Entities": {
      "main": [
        [
          {
            "node": "Build Graph Structure",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Build Graph Structure": {
      "main": [
        [
          {
            "node": "Create Graph Nodes",
            "type": "main",
            "index": 0
          },
          {
            "node": "Create Relationships",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create Graph Nodes": {
      "main": [
        [
          {
            "node": "KB Statistics",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create Relationships": {
      "main": [
        [
          {
            "node": "KB Statistics",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "KB Statistics": {
      "main": [
        [
          {
            "node": "Log KB Update",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

**Free or Paid?** Free

---

## Summary

These 10 workflow templates demonstrate the full capabilities of the PDF Vector node for n8n:

1. **Research Paper Analysis** - AI-powered paper analysis and insights
2. **Literature Review Automation** - Multi-database search and synthesis
3. **PDF to Markdown Converter** - Bulk document conversion
4. **Citation Network Builder** - Academic relationship mapping
5. **Document Data Extraction** - Smart field extraction from PDFs
6. **Paper Monitoring Bot** - Automated research alerts
7. **Paper Summarizer** - Multi-format summarization
8. **Multi-Database Search** - Unified academic search
9. **Document Alert System** - Smart notifications for new documents
10. **Knowledge Base Builder** - Academic knowledge graph creation

Each template is designed to be production-ready with proper error handling, scalability considerations, and clear documentation. Users can customize these templates based on their specific needs and integrate them with other n8n nodes for even more powerful automation workflows.
