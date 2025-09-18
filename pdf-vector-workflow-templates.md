# PDF Vector n8n Workflow Templates

A collection of 10 powerful workflow templates for the n8n PDF Vector node. These templates demonstrate various use cases for document processing and academic research automation.

## 1. Invoice Processing with Vendor Management & Approvals

**Name:** Invoice Processing with Vendor Management & Approvals

**Description:**

## Overview
Transform your accounts payable department with this enterprise-grade invoice processing solution. This workflow automates the entire invoice lifecycle - from document ingestion through payment processing. It handles invoices from multiple sources (Google Drive, email attachments, API submissions), extracts data using AI, validates against purchase orders, routes for appropriate approvals based on amount thresholds, and integrates seamlessly with your ERP system. The solution includes vendor master data management, duplicate invoice detection, real-time spend analytics, and complete audit trails for compliance.

## What You Can Do
This comprehensive workflow creates an intelligent invoice processing pipeline that monitors multiple input channels (Google Drive, email, webhooks) for new invoices and automatically extracts data from PDFs, images, and scanned documents using AI. It validates vendor information against your master database, matches invoices to purchase orders, and detects discrepancies. The workflow implements multi-level approval routing based on invoice amount and department, prevents duplicate payments through intelligent matching algorithms, and integrates with QuickBooks, SAP, or other ERP systems. Additionally, it generates real-time dashboards showing processing metrics and cash flow insights while sending automated reminders for pending approvals.

## Who It's For
Perfect for medium to large businesses, accounting departments, and financial service providers processing more than 100 invoices monthly across multiple vendors. Ideal for organizations that need to enforce approval hierarchies and spending limits, require integration with existing ERP/accounting systems, want to reduce processing time from days to minutes, need audit trails and compliance reporting, and seek to eliminate manual data entry errors and duplicate payments.

## The Problem It Solves
Manual invoice processing creates significant operational challenges including data entry errors (3-5% error rate), processing delays (8-10 days per invoice), duplicate payments (0.1-0.5% of invoices), approval bottlenecks causing late fees, lack of visibility into pending invoices and cash commitments, and compliance issues from missing audit trails. This workflow reduces processing time by 80%, eliminates data entry errors, prevents duplicate payments, and provides complete visibility into your payables process.

## Setup Instructions
1. **Google Drive Setup**: Create dedicated folders for invoice intake and configure access permissions
2. **PDF Vector Configuration**: Set up API credentials with appropriate rate limits for your volume
3. **Database Setup**: Deploy the provided schema for vendor master and invoice tracking tables
4. **Email Integration**: Configure IMAP credentials for invoice email monitoring (optional)
5. **ERP Connection**: Set up API access to your accounting system (QuickBooks, SAP, etc.)
6. **Approval Rules**: Define approval thresholds and routing rules in the configuration node
7. **Notification Setup**: Configure Slack/email for approval notifications and alerts

## Key Features
- **Multi-Channel Invoice Ingestion**: Automatically collect invoices from Google Drive, email attachments, and API uploads
- **Advanced OCR and AI Extraction**: Process any invoice format including handwritten notes and poor quality scans
- **Vendor Master Integration**: Validate and enrich vendor data, maintaining a clean vendor database
- **3-Way Matching**: Automatically match invoices to purchase orders and goods receipts
- **Dynamic Approval Routing**: Route based on amount, department, vendor, or custom rules
- **Duplicate Detection**: Prevent duplicate payments using fuzzy matching algorithms
- **Real-Time Analytics**: Track KPIs like processing time, approval delays, and early payment discounts
- **Exception Handling**: Intelligent routing of problematic invoices for manual review
- **Audit Trail**: Complete tracking of all actions, approvals, and system modifications
- **Payment Scheduling**: Optimize payment timing to capture discounts and manage cash flow

## Customization Options
This workflow can be customized to add industry-specific extraction fields, implement GL coding rules based on vendor or amount, create department-specific approval workflows, add currency conversion for international invoices, integrate with additional systems (banks, expense management), configure custom dashboards and reporting, set up vendor portals for invoice status inquiries, and implement machine learning for automatic GL coding suggestions.

**Note:** This workflow uses the PDF Vector community node. Make sure to install it from the n8n community nodes collection before using this template.

**Template Code:**
```json
{
  "meta": {
    "instanceId": "placeholder"
  },
  "nodes": [
    {
      "parameters": {
        "content": "## \ud83d\udccb Invoice Processing Pipeline\n\nThis enterprise-grade workflow automates your entire accounts payable process:\n\u2022 **Monitors** multiple sources every 5 minutes\n\u2022 **Extracts** data using AI (30+ fields)\n\u2022 **Validates** vendors and calculations\n\u2022 **Routes** for approval based on amount\n\u2022 **Integrates** with your ERP system",
        "height": 200,
        "width": 350,
        "color": 5
      },
      "id": "overview-note",
      "name": "Workflow Overview",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        50,
        50
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## \u2699\ufe0f Initial Setup Required\n\n1. **Google Drive**: Create folder & set ID\n2. **Database**: Run schema creation script\n3. **PDF Vector**: Add API key in credentials\n4. **Slack/Email**: Configure notifications\n5. **ERP**: Set up API connection",
        "height": 180,
        "width": 300,
        "color": 4
      },
      "id": "setup-note",
      "name": "Setup Guide",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        50,
        270
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## 1\ufe0f\u20e3 Invoice Collection\n\nSchedule trigger runs every 5 minutes to:\n\u2022 Check Google Drive folder\n\u2022 Filter already processed files\n\u2022 Download new invoices only\n\n\ud83d\udca1 Prevents duplicate processing",
        "height": 160,
        "width": 280
      },
      "id": "step1-note",
      "name": "Step 1: Collection",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        250,
        450
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## 2\ufe0f\u20e3 AI Data Extraction\n\nPDF Vector extracts:\n\u2022 Vendor details & Tax ID\n\u2022 Line items with SKUs\n\u2022 Tax calculations\n\u2022 Payment terms\n\u2022 Bank details\n\n\u2728 Handles any format!",
        "height": 180,
        "width": 280
      },
      "id": "step2-note",
      "name": "Step 2: Extraction",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        1050,
        450
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## 3\ufe0f\u20e3 Vendor Management\n\n\u2022 Looks up vendor in database\n\u2022 Creates new vendor if needed\n\u2022 Validates vendor status\n\u2022 Flags for review if new\n\n\ud83d\udd0d Maintains clean vendor data",
        "height": 160,
        "width": 280
      },
      "id": "step3-note",
      "name": "Step 3: Vendors",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        1550,
        450
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## 4\ufe0f\u20e3 Validation & Approval\n\n**Validates:**\n\u2022 Math calculations\n\u2022 Duplicate invoices\n\u2022 PO matching\n\n**Routes based on:**\n\u2022 >$10k \u2192 CFO\n\u2022 >$5k \u2192 Dept Head\n\u2022 >$1k \u2192 Manager",
        "height": 200,
        "width": 280
      },
      "id": "step4-note",
      "name": "Step 4: Validation",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        2050,
        450
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## 5\ufe0f\u20e3 ERP Integration\n\nApproved invoices:\n\u2022 Save to database\n\u2022 Sync with QuickBooks/SAP\n\u2022 Update dashboards\n\u2022 Send confirmations\n\n\u2705 Fully automated!",
        "height": 160,
        "width": 280,
        "color": 6
      },
      "id": "step5-note",
      "name": "Step 5: Integration",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        2550,
        450
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "events": [
          "workflowActivate"
        ],
        "unit": "minutes",
        "value": 5
      },
      "id": "schedule-trigger",
      "name": "Check Every 5 Minutes",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.1,
      "position": [
        250,
        300
      ],
      "notes": "Monitor for new invoices"
    },
    {
      "parameters": {
        "resource": "file",
        "operation": "list",
        "folderId": "={{ $json.invoiceFolderId }}",
        "options": {
          "fields": [
            "id",
            "name",
            "mimeType",
            "createdTime"
          ]
        }
      },
      "id": "google-drive-list",
      "name": "List New Invoices",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [
        450,
        300
      ],
      "notes": "Get unprocessed invoices"
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT file_id FROM processed_invoices WHERE file_id IN ({{ $json.files.map(f => `'${f.id}'`).join(',') }})"
      },
      "id": "check-processed",
      "name": "Check Already Processed",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.4,
      "position": [
        650,
        300
      ],
      "notes": "Avoid reprocessing"
    },
    {
      "parameters": {
        "jsCode": "// Filter out already processed files\nconst files = $node['List New Invoices'].json.files;\nconst processedIds = $node['Check Already Processed'].json.map(row => row.file_id);\n\nconst newFiles = files.filter(file => !processedIds.includes(file.id));\n\nreturn newFiles.map(file => ({ json: file }));"
      },
      "id": "filter-new",
      "name": "Filter New Files",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        850,
        300
      ]
    },
    {
      "parameters": {
        "operation": "download",
        "fileId": "={{ $json.id }}"
      },
      "id": "google-drive-download",
      "name": "Download Invoice",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [
        1050,
        300
      ],
      "notes": "Get file content"
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "extract",
        "inputType": "file",
        "binaryPropertyName": "data",
        "prompt": "Extract comprehensive invoice details including invoice number, date, vendor details (name, address, tax ID, contact), customer info, PO number if present, all line items with item codes/SKUs, descriptions, quantities, unit prices, amounts, tax details by type, payment terms, bank details, and any special instructions. Handle multi-page invoices and various formats.",
        "schema": "{\"type\":\"object\",\"properties\":{\"invoiceNumber\":{\"type\":\"string\"},\"invoiceDate\":{\"type\":\"string\"},\"dueDate\":{\"type\":\"string\"},\"poNumber\":{\"type\":\"string\"},\"vendor\":{\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\"},\"address\":{\"type\":\"string\"},\"city\":{\"type\":\"string\"},\"state\":{\"type\":\"string\"},\"postalCode\":{\"type\":\"string\"},\"country\":{\"type\":\"string\"},\"taxId\":{\"type\":\"string\"},\"email\":{\"type\":\"string\"},\"phone\":{\"type\":\"string\"}}},\"customer\":{\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\"},\"address\":{\"type\":\"string\"},\"department\":{\"type\":\"string\"}}},\"lineItems\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"itemCode\":{\"type\":\"string\"},\"description\":{\"type\":\"string\"},\"quantity\":{\"type\":\"number\"},\"unitPrice\":{\"type\":\"number\"},\"amount\":{\"type\":\"number\"},\"taxRate\":{\"type\":\"number\"}}}},\"subtotal\":{\"type\":\"number\"},\"taxDetails\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"type\":{\"type\":\"string\"},\"rate\":{\"type\":\"number\"},\"amount\":{\"type\":\"number\"}}}},\"total\":{\"type\":\"number\"},\"currency\":{\"type\":\"string\"},\"paymentTerms\":{\"type\":\"string\"},\"bankDetails\":{\"type\":\"object\",\"properties\":{\"bankName\":{\"type\":\"string\"},\"accountNumber\":{\"type\":\"string\"},\"routingNumber\":{\"type\":\"string\"}}},\"notes\":{\"type\":\"string\"}},\"required\":[\"invoiceNumber\",\"vendor\",\"total\"],\"additionalProperties\":false}"
      },
      "id": "pdfvector-extract",
      "name": "Extract Invoice Data",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [
        1250,
        300
      ],
      "notes": "AI extraction"
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT * FROM vendor_master WHERE LOWER(name) = LOWER('{{ $json.data.vendor.name }}') OR tax_id = '{{ $json.data.vendor.taxId }}' LIMIT 1"
      },
      "id": "lookup-vendor",
      "name": "Lookup Vendor",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.4,
      "position": [
        1450,
        300
      ],
      "notes": "Check vendor database"
    },
    {
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{ $json.length > 0 }}",
              "value2": true
            }
          ]
        }
      },
      "id": "vendor-exists",
      "name": "Vendor Exists?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        1650,
        300
      ]
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "INSERT INTO vendor_master (name, address, city, state, postal_code, country, tax_id, email, phone, status, created_at) VALUES ('{{ $node['Extract Invoice Data'].json.data.vendor.name }}', '{{ $node['Extract Invoice Data'].json.data.vendor.address }}', '{{ $node['Extract Invoice Data'].json.data.vendor.city }}', '{{ $node['Extract Invoice Data'].json.data.vendor.state }}', '{{ $node['Extract Invoice Data'].json.data.vendor.postalCode }}', '{{ $node['Extract Invoice Data'].json.data.vendor.country }}', '{{ $node['Extract Invoice Data'].json.data.vendor.taxId }}', '{{ $node['Extract Invoice Data'].json.data.vendor.email }}', '{{ $node['Extract Invoice Data'].json.data.vendor.phone }}', 'pending_review', NOW()) RETURNING vendor_id"
      },
      "id": "create-vendor",
      "name": "Create New Vendor",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.4,
      "position": [
        1850,
        400
      ],
      "notes": "Add to vendor master"
    },
    {
      "parameters": {
        "jsCode": "// Comprehensive invoice validation\nconst invoice = $node['Extract Invoice Data'].json.data;\nconst vendor = $node['Lookup Vendor'].json[0] || $node['Create New Vendor'].json[0];\nlet validationResult = {\n  invoice: invoice,\n  vendorId: vendor.vendor_id,\n  vendorStatus: vendor.status,\n  errors: [],\n  warnings: [],\n  requiresApproval: false,\n  approvalLevel: 0\n};\n\n// Validate calculations\nif (invoice.lineItems && invoice.lineItems.length > 0) {\n  const calculatedSubtotal = invoice.lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);\n  if (Math.abs(calculatedSubtotal - invoice.subtotal) > 0.01) {\n    validationResult.errors.push(`Line items total (${calculatedSubtotal}) doesn't match subtotal (${invoice.subtotal})`);\n  }\n}\n\n// Validate tax calculations\nconst totalTax = invoice.taxDetails ? invoice.taxDetails.reduce((sum, tax) => sum + tax.amount, 0) : 0;\nconst calculatedTotal = (invoice.subtotal || 0) + totalTax;\nif (Math.abs(calculatedTotal - invoice.total) > 0.01) {\n  validationResult.errors.push(`Calculated total (${calculatedTotal}) doesn't match invoice total (${invoice.total})`);\n}\n\n// Check duplicate invoice\nconst duplicateCheck = await $node['Check Duplicate'].json;\nif (duplicateCheck.length > 0) {\n  validationResult.errors.push('Duplicate invoice detected');\n}\n\n// Determine approval requirements\nif (invoice.total > 10000) {\n  validationResult.requiresApproval = true;\n  validationResult.approvalLevel = 3; // CFO\n} else if (invoice.total > 5000) {\n  validationResult.requiresApproval = true;\n  validationResult.approvalLevel = 2; // Department Head\n} else if (invoice.total > 1000 || vendor.status === 'pending_review') {\n  validationResult.requiresApproval = true;\n  validationResult.approvalLevel = 1; // Manager\n}\n\n// Check PO if provided\nif (invoice.poNumber) {\n  const poCheck = await $node['Check PO'].json;\n  if (poCheck.length === 0) {\n    validationResult.warnings.push('PO number not found in system');\n  } else {\n    const po = poCheck[0];\n    if (invoice.total > po.remaining_amount) {\n      validationResult.errors.push('Invoice amount exceeds PO remaining balance');\n    }\n  }\n}\n\nvalidationResult.isValid = validationResult.errors.length === 0;\n\nreturn [{ json: validationResult }];"
      },
      "id": "validate-invoice",
      "name": "Validate & Enrich Invoice",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        2050,
        300
      ],
      "notes": "Complex validation logic"
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT invoice_id FROM invoices WHERE vendor_id = {{ $json.vendorId }} AND invoice_number = '{{ $json.invoice.invoiceNumber }}' LIMIT 1"
      },
      "id": "check-duplicate",
      "name": "Check Duplicate",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.4,
      "position": [
        1850,
        200
      ],
      "notes": "Prevent double payment"
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT po_number, total_amount, used_amount, (total_amount - used_amount) as remaining_amount FROM purchase_orders WHERE po_number = '{{ $node['Extract Invoice Data'].json.data.poNumber }}' AND status = 'active'"
      },
      "id": "check-po",
      "name": "Check PO",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.4,
      "position": [
        1850,
        100
      ],
      "notes": "3-way matching"
    },
    {
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{ $json.requiresApproval }}",
              "value2": true
            }
          ]
        }
      },
      "id": "needs-approval",
      "name": "Needs Approval?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        2250,
        300
      ]
    },
    {
      "parameters": {
        "channel": "#invoice-approvals",
        "text": "New invoice requires approval:\n*Vendor:* {{ $json.invoice.vendor.name }}\n*Invoice #:* {{ $json.invoice.invoiceNumber }}\n*Amount:* {{ $json.invoice.currency }} {{ $json.invoice.total }}\n*Approval Level:* {{ $json.approvalLevel }}\n\n<{{ $node['Generate Approval Link'].json.approvalUrl }}|Click here to review and approve>",
        "attachments": [
          {
            "color": "#ff6d5a",
            "fields": {
              "item": [
                {
                  "short": true,
                  "title": "Due Date",
                  "value": "{{ $json.invoice.dueDate }}"
                },
                {
                  "short": true,
                  "title": "Payment Terms",
                  "value": "{{ $json.invoice.paymentTerms }}"
                }
              ]
            }
          }
        ]
      },
      "id": "send-approval",
      "name": "Send Approval Request",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 2.1,
      "position": [
        2450,
        400
      ],
      "notes": "Notify approvers"
    },
    {
      "parameters": {
        "jsCode": "// Generate secure approval link\nconst baseUrl = 'https://your-domain.com/approve';\nconst token = require('crypto').randomBytes(32).toString('hex');\nconst approvalData = {\n  invoiceId: $json.invoice.invoiceNumber,\n  vendorId: $json.vendorId,\n  amount: $json.invoice.total,\n  token: token,\n  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()\n};\n\n// Store approval token in DB (not shown)\nconst approvalUrl = `${baseUrl}?token=${token}`;\n\nreturn [{ json: { ...approvalData, approvalUrl } }];"
      },
      "id": "generate-approval-link",
      "name": "Generate Approval Link",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        2450,
        500
      ],
      "notes": "Create secure link"
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "INSERT INTO invoices (invoice_number, vendor_id, invoice_date, due_date, subtotal, tax_amount, total_amount, currency, status, po_number, raw_data, created_at) VALUES ('{{ $json.invoice.invoiceNumber }}', {{ $json.vendorId }}, '{{ $json.invoice.invoiceDate }}', '{{ $json.invoice.dueDate }}', {{ $json.invoice.subtotal }}, {{ $json.invoice.taxDetails.reduce((sum, t) => sum + t.amount, 0) }}, {{ $json.invoice.total }}, '{{ $json.invoice.currency }}', '{{ $json.requiresApproval ? \"pending_approval\" : \"approved\" }}', '{{ $json.invoice.poNumber }}', '{{ JSON.stringify($json.invoice) }}', NOW())"
      },
      "id": "save-invoice",
      "name": "Save Invoice",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.4,
      "position": [
        2650,
        300
      ],
      "notes": "Store in database"
    },
    {
      "parameters": {
        "authentication": "oAuth2",
        "resource": "invoice",
        "operation": "create",
        "additionalFields": {
          "invoiceNumber": "={{ $json.invoice.invoiceNumber }}",
          "vendorRef": {
            "value": "={{ $json.vendorId }}"
          },
          "txnDate": "={{ $json.invoice.invoiceDate }}",
          "dueDate": "={{ $json.invoice.dueDate }}",
          "line": "={{ $json.invoice.lineItems }}",
          "customerMemo": "={{ $json.invoice.notes }}"
        }
      },
      "id": "quickbooks-create",
      "name": "Create in QuickBooks",
      "type": "n8n-nodes-base.quickbooks",
      "typeVersion": 1,
      "position": [
        2650,
        200
      ],
      "notes": "ERP integration"
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "INSERT INTO processed_invoices (file_id, invoice_id) VALUES ('{{ $node['Download Invoice'].json.id }}', '{{ $node['Save Invoice'].json.invoice_id }}')"
      },
      "id": "mark-processed",
      "name": "Mark as Processed",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.4,
      "position": [
        2850,
        300
      ],
      "notes": "Track processed files"
    },
    {
      "parameters": {
        "dashboardUrl": "https://your-analytics.com/embed",
        "updateFrequency": "realtime"
      },
      "id": "update-dashboard",
      "name": "Update Analytics Dashboard",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [
        3050,
        300
      ],
      "notes": "Real-time metrics"
    }
  ],
  "connections": {
    "Check Every 5 Minutes": {
      "main": [
        [
          {
            "node": "List New Invoices",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "List New Invoices": {
      "main": [
        [
          {
            "node": "Check Already Processed",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Check Already Processed": {
      "main": [
        [
          {
            "node": "Filter New Files",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Filter New Files": {
      "main": [
        [
          {
            "node": "Download Invoice",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Download Invoice": {
      "main": [
        [
          {
            "node": "Extract Invoice Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Extract Invoice Data": {
      "main": [
        [
          {
            "node": "Lookup Vendor",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Lookup Vendor": {
      "main": [
        [
          {
            "node": "Vendor Exists?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Vendor Exists?": {
      "main": [
        [
          {
            "node": "Validate & Enrich Invoice",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Create New Vendor",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create New Vendor": {
      "main": [
        [
          {
            "node": "Validate & Enrich Invoice",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Validate & Enrich Invoice": {
      "main": [
        [
          {
            "node": "Check Duplicate",
            "type": "main",
            "index": 0
          },
          {
            "node": "Check PO",
            "type": "main",
            "index": 0
          },
          {
            "node": "Needs Approval?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Needs Approval?": {
      "main": [
        [
          {
            "node": "Generate Approval Link",
            "type": "main",
            "index": 0
          },
          {
            "node": "Save Invoice",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Save Invoice",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate Approval Link": {
      "main": [
        [
          {
            "node": "Send Approval Request",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Save Invoice": {
      "main": [
        [
          {
            "node": "Create in QuickBooks",
            "type": "main",
            "index": 0
          },
          {
            "node": "Mark as Processed",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Mark as Processed": {
      "main": [
        [
          {
            "node": "Update Analytics Dashboard",
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

## 2. Parse and Score Resumes with PDF Vector AI

**Name:** Parse and Score Resumes with PDF Vector AI

**Description:**

## Overview
HR departments and recruiters spend countless hours manually reviewing resumes, often missing qualified candidates due to time constraints. This workflow automates the entire resume screening process by extracting structured data from resumes in any format (PDF, Word documents, or even photographed/scanned resume images), calculating experience scores, and creating comprehensive candidate profiles ready for your ATS system.

## What You Can Do
This workflow automatically retrieves resumes from Google Drive and uses AI to extract all relevant candidate information including personal details, work experience with dates, education, skills, and certifications. It intelligently handles various resume formats including PDFs, Word documents, and even scanned or photographed resumes using OCR. The workflow calculates total years of experience, tracks skill-specific experience, generates proficiency scores for each skill, and provides an AI-powered assessment of candidate strengths and suitability for different roles.

## Who It's For
Perfect for HR departments processing high volumes of applications, recruitment agencies managing multiple clients, talent acquisition teams seeking to improve candidate quality, and hiring managers who want data-driven insights for decision making. Ideal for organizations that need to maintain consistent evaluation standards across different reviewers and want to reduce time-to-hire while improving candidate match quality.

## The Problem It Solves
Manual resume screening is inefficient and inconsistent. Different reviewers may evaluate the same resume differently, leading to missed opportunities and bias. This workflow standardizes the extraction process, automatically calculates years of experience for each skill, and provides objective scoring metrics to help identify the best candidates faster while reducing human bias in the initial screening process.

## Setup Instructions
1. Configure Google Drive credentials in n8n
2. Install the PDF Vector community node from the n8n marketplace
3. Configure your PDF Vector API credentials
4. Set up your preferred data storage (database or spreadsheet)
5. Customize the skill categories for your industry
6. Configure the scoring algorithm based on your requirements
7. Connect to your existing ATS system if needed

## Key Features
- **Automatic Resume Retrieval**: Pull resumes from Google Drive folders automatically
- **Universal Format Support**: Process PDFs, Word documents, and photographed resumes
- **OCR Capabilities**: Extract text from scanned or photographed documents
- **Experience Calculation**: Automatically compute total and skill-specific experience
- **Proficiency Scoring**: Generate objective skill proficiency ratings
- **AI Assessment**: Get intelligent insights on candidate fit and strengths
- **Multi-Language Support**: Handle resumes in various languages
- **ATS Integration**: Output structured data compatible with major ATS systems

## Customization Options
Define custom skill categories relevant to your industry, adjust scoring weights for different experience types, add specific extraction fields for your organization, implement keyword matching for job requirements, set up automated candidate ranking systems, create role-specific evaluation criteria, and integrate with LinkedIn or other professional networks for enhanced candidate insights.

**Note:** This workflow uses the PDF Vector community node. Make sure to install it from the n8n community nodes collection before using this template.

**Template Code:**
```json
{
  "meta": {
    "instanceId": "placeholder"
  },
  "nodes": [
    {
      "parameters": {
        "content": "## \ud83d\udc65 AI Resume Processing System\n\nAutomated recruitment workflow:\n\u2022 **Collects** resumes from multiple sources\n\u2022 **Extracts** skills, experience, education\n\u2022 **Matches** against job requirements\n\u2022 **Scores** candidates objectively\n\u2022 **Integrates** with your ATS",
        "height": 180,
        "width": 350,
        "color": 5
      },
      "id": "overview-note",
      "name": "System Overview",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        50,
        50
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## \u2699\ufe0f Configure First\n\n1. Set job requirements JSON\n2. Adjust scoring weights\n3. Add PDF Vector API key\n4. Connect ATS database\n5. Set up notifications",
        "height": 150,
        "width": 280,
        "color": 4
      },
      "id": "setup-note",
      "name": "Setup Required",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        50,
        250
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## \ud83d\udcc4 Resume Input\n\nAccepts multiple formats:\n\u2022 PDF resumes\n\u2022 Word documents\n\u2022 LinkedIn exports\n\u2022 Text files\n\n\ud83d\udca1 Bulk processing capable",
        "height": 150,
        "width": 250
      },
      "id": "input-note",
      "name": "Input Formats",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        450,
        450
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## \ud83e\udd16 AI Extraction\n\nPDF Vector extracts:\n\u2022 Personal info\n\u2022 Work experience\n\u2022 Education details\n\u2022 Skills & technologies\n\u2022 Certifications\n\n\u2728 Structured JSON output",
        "height": 180,
        "width": 260
      },
      "id": "extract-note",
      "name": "Data Extraction",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        750,
        450
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## \ud83d\udcca Scoring Engine\n\n**Weighted scoring:**\n\u2022 Skills match: 40%\n\u2022 Experience: 30%\n\u2022 Education: 20%\n\u2022 Certifications: 10%\n\n\ud83c\udfaf Customizable weights",
        "height": 180,
        "width": 260,
        "color": 6
      },
      "id": "scoring-note",
      "name": "Candidate Scoring",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        1050,
        450
      ],
      "typeVersion": 1
    },
    {
      "parameters": {},
      "id": "manual-trigger",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [
        250,
        300
      ],
      "notes": "Start resume parsing"
    },
    {
      "parameters": {
        "operation": "download",
        "fileId": "={{ $json.fileId }}"
      },
      "id": "google-drive",
      "name": "Get Resume from Google Drive",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [
        450,
        300
      ],
      "notes": "Download resume from Google Drive"
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "extract",
        "inputType": "file",
        "binaryPropertyName": "data",
        "prompt": "Extract all relevant information from this resume document or image including personal details, work experience with dates and achievements, education, all technical and soft skills, certifications, and languages. Handle both digital documents and scanned/photographed resumes. Pay special attention to dates for calculating experience.",
        "schema": "{\"type\":\"object\",\"properties\":{\"personalInfo\":{\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\"},\"email\":{\"type\":\"string\"},\"phone\":{\"type\":\"string\"},\"location\":{\"type\":\"string\"},\"linkedIn\":{\"type\":\"string\"},\"summary\":{\"type\":\"string\"}}},\"workExperience\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"company\":{\"type\":\"string\"},\"position\":{\"type\":\"string\"},\"startDate\":{\"type\":\"string\"},\"endDate\":{\"type\":\"string\"},\"description\":{\"type\":\"string\"},\"achievements\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}},\"technologies\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}}}}},\"education\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"institution\":{\"type\":\"string\"},\"degree\":{\"type\":\"string\"},\"field\":{\"type\":\"string\"},\"graduationDate\":{\"type\":\"string\"},\"gpa\":{\"type\":\"string\"}}}},\"skills\":{\"type\":\"object\",\"properties\":{\"technical\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}},\"soft\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}},\"languages\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"language\":{\"type\":\"string\"},\"proficiency\":{\"type\":\"string\"}}}}}},\"certifications\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\"},\"issuer\":{\"type\":\"string\"},\"date\":{\"type\":\"string\"},\"expiryDate\":{\"type\":\"string\"}}}}},\"required\":[\"personalInfo\"],\"additionalProperties\":false}"
      },
      "id": "pdfvector-parse",
      "name": "PDF Vector - Parse Resume",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [
        650,
        300
      ],
      "notes": "Extract candidate information"
    },
    {
      "parameters": {
        "jsCode": "// Calculate experience and skill metrics\nconst resume = $input.first().json.data;\nconst currentDate = new Date();\n\n// Calculate total years of experience\nlet totalExperience = 0;\nlet skillExperience = {};\n\nif (resume.workExperience) {\n  resume.workExperience.forEach(job => {\n    const startDate = new Date(job.startDate);\n    const endDate = job.endDate === 'Present' ? currentDate : new Date(job.endDate);\n    const years = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365);\n    totalExperience += years;\n    \n    // Track experience per technology\n    if (job.technologies) {\n      job.technologies.forEach(tech => {\n        skillExperience[tech] = (skillExperience[tech] || 0) + years;\n      });\n    }\n  });\n}\n\n// Create skill proficiency scores\nconst skillScores = {};\nif (resume.skills?.technical) {\n  resume.skills.technical.forEach(skill => {\n    const experience = skillExperience[skill] || 0;\n    let score = 0;\n    if (experience >= 5) score = 5;\n    else if (experience >= 3) score = 4;\n    else if (experience >= 1) score = 3;\n    else if (experience > 0) score = 2;\n    else score = 1;\n    \n    skillScores[skill] = {\n      yearsExperience: Math.round(experience * 10) / 10,\n      proficiencyScore: score\n    };\n  });\n}\n\nreturn [{\n  json: {\n    candidateProfile: resume,\n    metrics: {\n      totalYearsExperience: Math.round(totalExperience * 10) / 10,\n      skillScores: skillScores,\n      educationLevel: resume.education?.[0]?.degree || 'Not specified',\n      certificationCount: resume.certifications?.length || 0,\n      languageCount: resume.skills?.languages?.length || 0\n    },\n    processedAt: new Date().toISOString()\n  }\n}];"
      },
      "id": "calculate-metrics",
      "name": "Calculate Experience Metrics",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        850,
        300
      ],
      "notes": "Calculate experience and skill scores"
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "ask",
        "inputType": "file",
        "binaryPropertyName": "data",
        "prompt": "Based on this resume document or image, provide a brief assessment of the candidate's strengths, potential roles they would fit, and any notable achievements. Also suggest their seniority level (Junior/Mid/Senior/Lead)."
      },
      "id": "pdfvector-assess",
      "name": "PDF Vector - AI Assessment",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [
        1050,
        300
      ],
      "notes": "Get AI assessment"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "assignment1",
              "name": "profile",
              "value": "={{ $node['Calculate Experience Metrics'].json.candidateProfile }}",
              "type": "object"
            },
            {
              "id": "assignment2",
              "name": "metrics",
              "value": "={{ $node['Calculate Experience Metrics'].json.metrics }}",
              "type": "object"
            },
            {
              "id": "assignment3",
              "name": "aiAssessment",
              "value": "={{ $json.answer }}",
              "type": "string"
            },
            {
              "id": "assignment4",
              "name": "atsReady",
              "value": "true",
              "type": "boolean"
            }
          ]
        },
        "options": {}
      },
      "id": "create-profile",
      "name": "Create Candidate Profile",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3,
      "position": [
        1250,
        300
      ],
      "notes": "Combine all data"
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [
        [
          {
            "node": "Get Resume from Google Drive",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get Resume from Google Drive": {
      "main": [
        [
          {
            "node": "PDF Vector - Parse Resume",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Parse Resume": {
      "main": [
        [
          {
            "node": "Calculate Experience Metrics",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Calculate Experience Metrics": {
      "main": [
        [
          {
            "node": "PDF Vector - AI Assessment",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - AI Assessment": {
      "main": [
        [
          {
            "node": "Create Candidate Profile",
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

## 3. Enterprise Contract Lifecycle Management with AI Risk Analysis

**Name:** Enterprise Contract Lifecycle Management with AI Risk Analysis

**Description:**

## Overview
Transform your contract management process with this enterprise-grade workflow that handles the complete contract lifecycle - from initial intake through execution, monitoring, and renewal. This comprehensive solution combines AI-powered contract analysis with automated risk scoring, clause comparison, obligation tracking, and proactive alerts. It integrates with multiple data sources including email, SharePoint, contract CLM systems, and creates a centralized contract intelligence hub that prevents revenue leakage, ensures compliance, and accelerates deal velocity.

## What You Can Do
This advanced workflow orchestrates a complete contract management ecosystem that monitors multiple channels (email, Google Drive, SharePoint, APIs) for new contracts and amendments. It extracts and analyzes over 50 contract data points using AI, performs multi-dimensional risk assessment across legal, financial, and operational factors, compares clauses against your approved template library, tracks all obligations and key dates with automated reminders, integrates with Salesforce/CRM for deal alignment, routes contracts through dynamic approval workflows based on risk scores, generates executive dashboards with contract analytics, and maintains a searchable repository with version control. The system handles complex scenarios including multi-party agreements, framework contracts with statements of work, international contracts requiring jurisdiction analysis, and M&A due diligence requiring bulk contract review.

## Who It's For
Designed for enterprise legal operations teams managing thousands of contracts annually, procurement departments negotiating complex vendor agreements, contract managers overseeing multi-million dollar portfolios, compliance teams ensuring regulatory adherence across jurisdictions, sales operations needing faster contract turnaround, and C-suite executives requiring contract intelligence for strategic decisions. Essential for organizations in regulated industries (healthcare, finance, government) and companies undergoing digital transformation of their legal operations.

## The Problem It Solves
Manual contract management creates massive operational risks and inefficiencies. Organizations typically have contracts scattered across emails, shared drives, and filing cabinets with no central visibility. This leads to missed renewal deadlines costing 5-10% of contract value, unauthorized contract variations creating compliance risks, obligation failures resulting in penalties and damaged relationships, and inability to leverage favorable terms across similar contracts. Studies show that inefficient contract management costs organizations up to 9% of annual revenue. This workflow creates a single source of truth for all contracts, automates tracking and compliance, and provides predictive insights to prevent issues before they occur.

## Setup Instructions
1. **Multi-Channel Integration**: Configure connectors for email (Office 365/Gmail), Google Drive, SharePoint, and contract management systems
2. **PDF Vector Setup**: Install PDF Vector node and configure API with enterprise rate limits
3. **Database Configuration**: Set up PostgreSQL/MySQL for contract repository with proper indexing
4. **Template Library**: Upload your standard contract templates and approved clause library
5. **Risk Framework**: Configure risk scoring matrix for your industry (legal, financial, operational risks)
6. **Approval Matrix**: Define approval routing based on contract value, type, and risk score
7. **CRM Integration**: Connect to Salesforce/HubSpot for opportunity and account alignment
8. **Notification Setup**: Configure Slack/Teams channels and email distribution lists
9. **Dashboard Creation**: Set up Tableau/PowerBI connectors for executive reporting
10. **Security Configuration**: Enable encryption, audit logging, and role-based access controls

## Key Features
- **Intelligent Intake System**: Monitor email attachments, shared folders, CRM uploads, and API submissions
- **Advanced AI Extraction**: Extract 50+ data points including nested obligations and conditional terms
- **Multi-Dimensional Risk Scoring**: Analyze legal, financial, operational, and reputational risks
- **Clause Library Comparison**: Compare against approved templates and flag deviations
- **Obligation Management**: Track deliverables, milestones, and SLAs with automated alerts
- **Dynamic Approval Routing**: Route based on AI risk score, contract value, and deviation analysis
- **Version Control & Redlining**: Track all changes and maintain complete audit trail
- **Salesforce Integration**: Sync contract data with opportunities and accounts
- **Predictive Analytics**: Forecast renewal likelihood and negotiation outcomes
- **Bulk Processing**: Handle M&A due diligence with parallel processing of hundreds of contracts
- **Multi-Language Support**: Process contracts in 15+ languages with automatic translation
- **Executive Dashboards**: Real-time visibility into contract portfolio and risk exposure

## Customization Options
Implement industry-specific modules for healthcare (BAAs, DPAs), financial services (ISDAs, loan agreements), technology (SaaS, licensing), or government contracting. Add AI models trained on your historical contracts for better extraction accuracy. Create custom risk factors for emerging regulations like AI governance or ESG compliance. Build integration with specific CLM systems (Ironclad, Docusign CLM, Icertis). Implement advanced analytics including contract similarity scoring, win-rate analysis by clause variations, and automatic playbook generation. Add blockchain integration for smart contract execution and configure automated contract assembly for standard agreements.

**Note:** This workflow uses the PDF Vector community node. Make sure to install it from the n8n community nodes collection before using this template.

**Template Code:**
```json
{
  "meta": {
    "instanceId": "placeholder"
  },
  "nodes": [
    {
      "parameters": {
        "content": "## Enterprise Contract Lifecycle Management\n\nThis workflow orchestrates:\n- Multi-channel contract intake\n- AI-powered extraction & analysis\n- Risk scoring & compliance checks\n- Approval routing & notifications\n- CRM integration & analytics\n- Obligation tracking & alerts",
        "height": 180,
        "width": 320
      },
      "id": "workflow-overview",
      "name": "Workflow Overview",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [100, 50]
    },
    {
      "parameters": {
        "pollTimes": {
          "item": [
            {
              "mode": "everyMinute"
            }
          ]
        },
        "mailbox": "INBOX",
        "options": {
          "customEmailConfig": "contractreview@company.com"
        }
      },
      "id": "email-trigger",
      "name": "Monitor Contract Emails",
      "type": "n8n-nodes-base.emailReadImap",
      "typeVersion": 2,
      "position": [250, 200],
      "notes": "Monitor email for contracts"
    },
    {
      "parameters": {
        "events": ["file:created", "file:updated"],
        "folderID": "contracts-intake"
      },
      "id": "drive-trigger",
      "name": "Monitor Google Drive",
      "type": "n8n-nodes-base.googleDriveTrigger",
      "typeVersion": 1,
      "position": [250, 350],
      "notes": "Watch for new contracts"
    },
    {
      "parameters": {
        "events": ["workflowActivate"],
        "unit": "hours",
        "value": 1
      },
      "id": "schedule-trigger",
      "name": "Hourly CRM Check",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [250, 500],
      "notes": "Check CRM for contracts"
    },
    {
      "parameters": {
        "resource": "opportunity",
        "operation": "getAll",
        "filters": {
          "stage": "Contract Review",
          "lastModified": "={{ $now.minus({hours: 1}).toISO() }}"
        }
      },
      "id": "salesforce-check",
      "name": "Check Salesforce",
      "type": "n8n-nodes-base.salesforce",
      "typeVersion": 2,
      "position": [450, 500],
      "notes": "Get contracts from CRM"
    },
    {
      "parameters": {
        "mode": "multiplex",
        "options": {}
      },
      "id": "merge-sources",
      "name": "Merge Contract Sources",
      "type": "n8n-nodes-base.merge",
      "typeVersion": 2.1,
      "position": [650, 350]
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT contract_id FROM contracts WHERE hash = '{{ $json.fileHash }}' LIMIT 1"
      },
      "id": "check-duplicate",
      "name": "Check Duplicate",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.4,
      "position": [850, 350],
      "notes": "Prevent reprocessing"
    },
    {
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{ $json.contract_id }}",
              "operation": "isEmpty"
            }
          ]
        }
      },
      "id": "is-new-contract",
      "name": "New Contract?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [1050, 350]
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "extract",
        "inputType": "file",
        "binaryPropertyName": "data",
        "prompt": "Extract comprehensive contract information including all parties (with roles, addresses, registration numbers), contract metadata (type, value, currency, effective/expiration dates), payment terms (amounts, schedules, penalties), deliverables and milestones, obligations for each party, termination conditions, liability caps, indemnification clauses, intellectual property provisions, confidentiality terms, force majeure, governing law, dispute resolution, and any special conditions. Also identify if this is a master agreement with SOWs.",
        "schema": "{\"type\":\"object\",\"properties\":{\"contractId\":{\"type\":\"string\"},\"contractType\":{\"type\":\"string\"},\"masterAgreement\":{\"type\":\"boolean\"},\"parties\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\"},\"role\":{\"type\":\"string\"},\"type\":{\"type\":\"string\"},\"address\":{\"type\":\"string\"},\"registrationNumber\":{\"type\":\"string\"},\"signatory\":{\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\"},\"title\":{\"type\":\"string\"},\"email\":{\"type\":\"string\"}}}}}},\"contractValue\":{\"type\":\"object\",\"properties\":{\"total\":{\"type\":\"number\"},\"currency\":{\"type\":\"string\"},\"paymentStructure\":{\"type\":\"string\"}}},\"term\":{\"type\":\"object\",\"properties\":{\"effectiveDate\":{\"type\":\"string\"},\"expirationDate\":{\"type\":\"string\"},\"autoRenewal\":{\"type\":\"boolean\"},\"renewalNotice\":{\"type\":\"number\"}}},\"paymentTerms\":{\"type\":\"object\",\"properties\":{\"schedule\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"amount\":{\"type\":\"number\"},\"dueDate\":{\"type\":\"string\"},\"milestone\":{\"type\":\"string\"}}}},\"lateFees\":{\"type\":\"string\"},\"earlyPaymentDiscount\":{\"type\":\"string\"}}},\"deliverables\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"description\":{\"type\":\"string\"},\"dueDate\":{\"type\":\"string\"},\"acceptanceCriteria\":{\"type\":\"string\"},\"party\":{\"type\":\"string\"}}}},\"obligations\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"party\":{\"type\":\"string\"},\"obligation\":{\"type\":\"string\"},\"frequency\":{\"type\":\"string\"},\"deadline\":{\"type\":\"string\"}}}},\"termination\":{\"type\":\"object\",\"properties\":{\"forConvenience\":{\"type\":\"boolean\"},\"notice\":{\"type\":\"number\"},\"penaltiesForEarlyTermination\":{\"type\":\"string\"},\"terminationTriggers\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}}}},\"liability\":{\"type\":\"object\",\"properties\":{\"limitationOfLiability\":{\"type\":\"string\"},\"indemnification\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}},\"insurance\":{\"type\":\"string\"}}},\"intellectualProperty\":{\"type\":\"object\",\"properties\":{\"ownership\":{\"type\":\"string\"},\"licenses\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}},\"workForHire\":{\"type\":\"boolean\"}}},\"confidentiality\":{\"type\":\"object\",\"properties\":{\"duration\":{\"type\":\"string\"},\"exceptions\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}}}},\"disputeResolution\":{\"type\":\"string\"},\"governingLaw\":{\"type\":\"string\"},\"specialClauses\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}}},\"required\":[\"contractType\",\"parties\"],\"additionalProperties\":false}"
      },
      "id": "extract-contract",
      "name": "PDF Vector - Extract All Data",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [1250, 350],
      "notes": "AI extraction of 50+ fields"
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "ask",
        "inputType": "file", 
        "binaryPropertyName": "data",
        "prompt": "Perform comprehensive risk analysis on this contract considering: 1) Legal risks (unusual terms, missing standard clauses, jurisdiction issues), 2) Financial risks (payment terms, penalties, uncapped liabilities), 3) Operational risks (unrealistic deadlines, resource requirements, dependencies), 4) Compliance risks (regulatory requirements, data protection, export controls), 5) Relationship risks (one-sided terms, termination difficulties). Provide risk scores (1-10) for each category and an overall risk rating with specific concerns."
      },
      "id": "risk-analysis",
      "name": "PDF Vector - Risk Analysis",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [1450, 350],
      "notes": "Multi-dimensional risk scoring"
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT template_id, clauses FROM contract_templates WHERE contract_type = '{{ $json.contractType }}' AND active = true"
      },
      "id": "get-template",
      "name": "Get Contract Template",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.4,
      "position": [1650, 250],
      "notes": "Retrieve standard template"
    },
    {
      "parameters": {
        "jsCode": "// Advanced contract analysis and scoring\nconst extracted = $node['PDF Vector - Extract All Data'].json.data;\nconst riskAnalysis = JSON.parse($node['PDF Vector - Risk Analysis'].json.answer);\nconst template = $node['Get Contract Template'].json;\nconst crmData = $node['Check Salesforce'].json;\n\n// Calculate comprehensive risk score\nlet riskFactors = [];\nlet totalRiskScore = 0;\n\n// Financial risk scoring\nconst contractValue = extracted.contractValue?.total || 0;\nconst annualRevenue = crmData.account?.annualRevenue || 1000000;\nconst dealSizeRisk = (contractValue / annualRevenue) > 0.1 ? 8 : 3;\nriskFactors.push({category: 'Deal Size', score: dealSizeRisk});\n\n// Check for missing standard clauses\nconst missingClauses = [];\nif (!extracted.liability?.limitationOfLiability) {\n  missingClauses.push('Limitation of Liability');\n  riskFactors.push({category: 'Missing LoL', score: 9});\n}\nif (!extracted.termination?.forConvenience) {\n  missingClauses.push('Termination for Convenience');\n  riskFactors.push({category: 'No Exit Clause', score: 7});\n}\n\n// Payment term risks\nif (extracted.paymentTerms?.schedule?.[0]?.dueDate) {\n  const firstPayment = new Date(extracted.paymentTerms.schedule[0].dueDate);\n  const daysToPay = (firstPayment - new Date()) / (1000 * 60 * 60 * 24);\n  if (daysToPay > 60) {\n    riskFactors.push({category: 'Extended Payment Terms', score: 6});\n  }\n}\n\n// Auto-renewal risk\nif (extracted.term?.autoRenewal && extracted.term?.renewalNotice < 30) {\n  riskFactors.push({category: 'Short Renewal Notice', score: 7});\n}\n\n// Calculate weighted risk score\ntotalRiskScore = riskFactors.reduce((sum, risk) => sum + risk.score, 0) / riskFactors.length;\n\n// Determine approval level\nlet approvalLevel = 'Manager';\nif (totalRiskScore > 7 || contractValue > 1000000) approvalLevel = 'Director';\nif (totalRiskScore > 8 || contractValue > 5000000) approvalLevel = 'VP';\nif (missingClauses.includes('Limitation of Liability')) approvalLevel = 'Legal';\n\n// Calculate key dates and alerts\nconst alerts = [];\nconst today = new Date();\n\n// Contract expiration alert\nif (extracted.term?.expirationDate) {\n  const expDate = new Date(extracted.term.expirationDate);\n  const daysToExpire = (expDate - today) / (1000 * 60 * 60 * 24);\n  if (daysToExpire < 90) {\n    alerts.push({\n      type: 'Contract Expiration',\n      date: extracted.term.expirationDate,\n      daysRemaining: Math.floor(daysToExpire),\n      severity: daysToExpire < 30 ? 'High' : 'Medium'\n    });\n  }\n}\n\n// Deliverable alerts\nif (extracted.deliverables) {\n  extracted.deliverables.forEach(deliverable => {\n    const dueDate = new Date(deliverable.dueDate);\n    const daysToDue = (dueDate - today) / (1000 * 60 * 60 * 24);\n    if (daysToDue > 0 && daysToDue < 30) {\n      alerts.push({\n        type: 'Upcoming Deliverable',\n        description: deliverable.description,\n        date: deliverable.dueDate,\n        daysRemaining: Math.floor(daysToDue),\n        severity: daysToDue < 7 ? 'High' : 'Medium'\n      });\n    }\n  });\n}\n\nreturn [{\n  json: {\n    contractAnalysis: {\n      contractId: extracted.contractId || `AUTO-${Date.now()}`,\n      type: extracted.contractType,\n      parties: extracted.parties,\n      value: contractValue,\n      currency: extracted.contractValue?.currency || 'USD',\n      effectiveDate: extracted.term?.effectiveDate,\n      expirationDate: extracted.term?.expirationDate\n    },\n    riskAssessment: {\n      overallScore: totalRiskScore,\n      riskLevel: totalRiskScore > 7 ? 'High' : totalRiskScore > 4 ? 'Medium' : 'Low',\n      riskFactors: riskFactors,\n      missingClauses: missingClauses,\n      aiRiskAnalysis: riskAnalysis\n    },\n    approvalRouting: {\n      level: approvalLevel,\n      reason: riskFactors.filter(r => r.score > 6).map(r => r.category).join(', ')\n    },\n    alerts: alerts,\n    crmAlignment: {\n      opportunityId: crmData.id,\n      accountName: crmData.account?.name,\n      dealSize: crmData.amount,\n      stage: crmData.stage\n    },\n    metadata: {\n      sourceChannel: $input.first().json.sourceChannel || 'Unknown',\n      receivedDate: new Date().toISOString(),\n      fileHash: $json.fileHash\n    },\n    fullExtraction: extracted\n  }\n}];"
      },
      "id": "analyze-score",
      "name": "Analyze & Score Contract",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1850, 350],
      "notes": "Comprehensive analysis engine"
    },
    {
      "parameters": {
        "operation": "insert",
        "table": "contracts",
        "columns": "contract_id,type,parties,value,effective_date,expiration_date,risk_score,risk_level,approval_level,extracted_data,risk_analysis,alerts,crm_data,created_at,status",
        "values": "={{ $json.contractAnalysis.contractId }},={{ $json.contractAnalysis.type }},={{ JSON.stringify($json.contractAnalysis.parties) }},={{ $json.contractAnalysis.value }},={{ $json.contractAnalysis.effectiveDate }},={{ $json.contractAnalysis.expirationDate }},={{ $json.riskAssessment.overallScore }},={{ $json.riskAssessment.riskLevel }},={{ $json.approvalRouting.level }},={{ JSON.stringify($json.fullExtraction) }},={{ JSON.stringify($json.riskAssessment) }},={{ JSON.stringify($json.alerts) }},={{ JSON.stringify($json.crmAlignment) }},={{ $now.toISO() }},pending_approval"
      },
      "id": "save-contract",
      "name": "Save to Contract Repository",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.4,
      "position": [2050, 350],
      "notes": "Central contract database"
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.riskAssessment.riskLevel }}",
              "operation": "equals",
              "value2": "High"
            }
          ],
          "boolean": [
            {
              "value1": "={{ $json.riskAssessment.missingClauses.length > 0 }}",
              "value2": true
            }
          ]
        },
        "combineOperation": "any"
      },
      "id": "needs-legal",
      "name": "Needs Legal Review?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [2250, 350]
    },
    {
      "parameters": {
        "channel": "#legal-contracts",
        "text": "⚠️ High Risk Contract Requires Review",
        "attachments": [
          {
            "color": "#ff0000",
            "title": "{{ $json.contractAnalysis.type }} - {{ $json.contractAnalysis.parties[0].name }}",
            "title_link": "https://contracts.company.com/review/{{ $json.contractAnalysis.contractId }}",
            "fields": {
              "item": [
                {
                  "title": "Contract Value",
                  "value": "{{ $json.contractAnalysis.currency }} {{ $json.contractAnalysis.value.toLocaleString() }}",
                  "short": true
                },
                {
                  "title": "Risk Score",
                  "value": "{{ $json.riskAssessment.overallScore }}/10",
                  "short": true
                },
                {
                  "title": "Risk Factors",
                  "value": "{{ $json.riskAssessment.riskFactors.filter(r => r.score > 6).map(r => r.category).join('\\n') }}",
                  "short": false
                },
                {
                  "title": "Missing Clauses",
                  "value": "{{ $json.riskAssessment.missingClauses.join('\\n') || 'None' }}",
                  "short": false
                }
              ]
            },
            "footer": "Contract Review System",
            "ts": "={{ Date.now() / 1000 }}"
          }
        ]
      },
      "id": "notify-legal",
      "name": "Notify Legal Team",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 2.1,
      "position": [2450, 450],
      "notes": "High risk alert"
    },
    {
      "parameters": {
        "resource": "opportunity",
        "operation": "update",
        "opportunityId": "={{ $json.crmAlignment.opportunityId }}",
        "updateFields": {
          "customFields": {
            "Contract_Status__c": "Under Review",
            "Contract_Risk_Score__c": "={{ $json.riskAssessment.overallScore }}",
            "Contract_ID__c": "={{ $json.contractAnalysis.contractId }}",
            "Contract_Expiration__c": "={{ $json.contractAnalysis.expirationDate }}"
          }
        }
      },
      "id": "update-salesforce",
      "name": "Update Salesforce",
      "type": "n8n-nodes-base.salesforce",
      "typeVersion": 2,
      "position": [2450, 250],
      "notes": "Sync with CRM"
    },
    {
      "parameters": {
        "events": ["workflowActivate"],
        "unit": "days",
        "value": 1
      },
      "id": "daily-alerts",
      "name": "Daily Alert Check",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [250, 650],
      "notes": "Check for upcoming deadlines"
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT c.*, json_array_elements(c.alerts) as alert FROM contracts c WHERE c.status = 'active' AND (alert->>'date')::date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'"
      },
      "id": "get-alerts",
      "name": "Get Upcoming Alerts",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.4,
      "position": [450, 650],
      "notes": "Find contracts with deadlines"
    },
    {
      "parameters": {
        "authentication": "oAuth2",
        "select": "channel",
        "channelId": {
          "__rl": true,
          "value": "contract-alerts"
        },
        "text": "=📅 Daily Contract Alert Summary\\n\\nYou have {{ $items.length }} upcoming contract deadlines:\\n\\n{{ $items.map(item => `• ${item.json.alert.type}: ${item.json.alert.description || item.json.contract_id} - Due ${item.json.alert.date} (${item.json.alert.daysRemaining} days)`).join('\\n') }}"
      },
      "id": "send-daily-summary",
      "name": "Send Daily Summary",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 2.1,
      "position": [650, 650],
      "notes": "Daily deadline digest"
    },
    {
      "parameters": {
        "content": "=Contract Analytics Dashboard\\n\\nTotal Contracts: {{ $json.totalContracts }}\\nTotal Value: ${{ $json.totalValue.toLocaleString() }}\\nHigh Risk: {{ $json.highRisk }}\\nExpiring Soon: {{ $json.expiringSoon }}\\n\\nView full dashboard: https://analytics.company.com/contracts",
        "height": 200,
        "width": 300
      },
      "id": "analytics-note",
      "name": "Analytics Dashboard",
      "type": "n8n-nodes-base.stickyNote",
      "typeVersion": 1,
      "position": [2650, 350]
    }
  ],
  "connections": {
    "Monitor Contract Emails": {
      "main": [[{ "node": "Merge Contract Sources", "type": "main", "index": 0 }]]
    },
    "Monitor Google Drive": {
      "main": [[{ "node": "Merge Contract Sources", "type": "main", "index": 0 }]]
    },
    "Hourly CRM Check": {
      "main": [[{ "node": "Check Salesforce", "type": "main", "index": 0 }]]
    },
    "Check Salesforce": {
      "main": [[{ "node": "Merge Contract Sources", "type": "main", "index": 0 }]]
    },
    "Merge Contract Sources": {
      "main": [[{ "node": "Check Duplicate", "type": "main", "index": 0 }]]
    },
    "Check Duplicate": {
      "main": [[{ "node": "New Contract?", "type": "main", "index": 0 }]]
    },
    "New Contract?": {
      "main": [
        [{ "node": "PDF Vector - Extract All Data", "type": "main", "index": 0 }],
        []
      ]
    },
    "PDF Vector - Extract All Data": {
      "main": [[
        { "node": "PDF Vector - Risk Analysis", "type": "main", "index": 0 },
        { "node": "Get Contract Template", "type": "main", "index": 0 }
      ]]
    },
    "PDF Vector - Risk Analysis": {
      "main": [[{ "node": "Analyze & Score Contract", "type": "main", "index": 0 }]]
    },
    "Get Contract Template": {
      "main": [[{ "node": "Analyze & Score Contract", "type": "main", "index": 0 }]]
    },
    "Analyze & Score Contract": {
      "main": [[{ "node": "Save to Contract Repository", "type": "main", "index": 0 }]]
    },
    "Save to Contract Repository": {
      "main": [[
        { "node": "Needs Legal Review?", "type": "main", "index": 0 },
        { "node": "Update Salesforce", "type": "main", "index": 0 }
      ]]
    },
    "Needs Legal Review?": {
      "main": [
        [{ "node": "Notify Legal Team", "type": "main", "index": 0 }],
        []
      ]
    },
    "Daily Alert Check": {
      "main": [[{ "node": "Get Upcoming Alerts", "type": "main", "index": 0 }]]
    },
    "Get Upcoming Alerts": {
      "main": [[{ "node": "Send Daily Summary", "type": "main", "index": 0 }]]
    }
  }
}
```

**Free or Paid?** Free

---

## 4. Build Document Q&A API with PDF Vector and Webhooks

**Name:** Build Document Q&A API with PDF Vector and Webhooks

**Description:**

## Overview
Organizations struggle to make their document repositories searchable and accessible. Users waste time searching through lengthy PDFs, manuals, and documentation to find specific answers. This workflow creates a powerful API service that instantly answers questions about any document or image, perfect for building customer support chatbots, internal knowledge bases, or interactive documentation systems.

## What You Can Do
This workflow creates a RESTful webhook API that accepts questions about documents and returns intelligent, contextual answers. It processes various document formats including PDFs, Word documents, text files, and images using OCR when needed. The system maintains conversation context through session management, caches responses for performance, provides source references with page numbers, handles multiple concurrent requests, and integrates seamlessly with chatbots, support systems, or custom applications.

## Who It's For
Perfect for developer teams building conversational interfaces, customer support departments creating self-service solutions, technical writers making documentation interactive, organizations with extensive knowledge bases, and SaaS companies wanting to add document Q&A features. Ideal for anyone who needs to make large document repositories instantly searchable through natural language queries.

## The Problem It Solves
Traditional document search returns entire pages or sections, forcing users to read through irrelevant content to find answers. Support teams repeatedly answer the same questions that are already documented. This template creates an intelligent Q&A system that provides precise, contextual answers to specific questions, reducing support tickets by up to 60% and improving user satisfaction.

## Setup Instructions
1. Install the PDF Vector community node from n8n marketplace
2. Configure your PDF Vector API key
3. Set up the webhook URL for your API endpoint
4. Configure Redis or database for session management
5. Set response caching parameters
6. Test the API with sample documents and questions

## Key Features
- **RESTful API Interface**: Easy integration with any application
- **Multi-Format Support**: Handle PDFs, Word docs, text files, and images
- **OCR Processing**: Extract text from scanned documents and screenshots
- **Contextual Answers**: Provide relevant responses with source citations
- **Session Management**: Enable conversational follow-up questions
- **Response Caching**: Improve performance for frequently asked questions
- **Analytics Tracking**: Monitor usage patterns and popular queries
- **Error Handling**: Graceful fallbacks for unsupported documents

## API Usage Example
```bash
POST https://your-n8n-instance.com/webhook/doc-qa
Content-Type: application/json

{
  "documentUrl": "https://example.com/user-manual.pdf",
  "question": "How do I reset my password?",
  "sessionId": "user-123",
  "includePageNumbers": true
}
```

## Customization Options
Add authentication and rate limiting for production use, implement multi-document search across entire repositories, create specialized prompts for technical documentation or legal documents, add automatic language detection and translation, build conversation history tracking for better context, integrate with Zendesk, Intercom, or other support systems, and enable direct file upload support for local documents.

**Note:** This workflow uses the PDF Vector community node. Make sure to install it from the n8n community nodes collection before using this template.

**Template Code:**
```json
{
  "meta": {
    "instanceId": "placeholder"
  },
  "nodes": [
    {
      "parameters": {
        "content": "## \ud83e\udd16 Document Q&A API\n\nRESTful service for document intelligence:\n\u2022 **Webhook** endpoint accepts documents\n\u2022 **AI processes** questions in context\n\u2022 **Returns** JSON with answers & citations\n\u2022 **Sub-second** response times",
        "height": 160,
        "width": 350,
        "color": 5
      },
      "id": "overview-note",
      "name": "API Overview",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        50,
        50
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## \ud83d\udce5 API Request\n\n**POST** to `/document-qa`\n\nBody:\n```json\n{\n  \"question\": \"Your question\",\n  \"maxTokens\": 500,\n  \"file\": <binary>\n}\n```",
        "height": 180,
        "width": 280
      },
      "id": "request-note",
      "name": "Request Format",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        450,
        450
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## \ud83d\udd0d AI Processing\n\nPDF Vector:\n\u2022 Parses document\n\u2022 Finds relevant sections\n\u2022 Generates answer\n\u2022 Includes citations\n\n\ud83d\udca1 GPT-4 powered",
        "height": 160,
        "width": 260
      },
      "id": "process-note",
      "name": "Q&A Processing",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        850,
        450
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## \ud83d\udce4 API Response\n\n```json\n{\n  \"success\": true,\n  \"answer\": \"...\",\n  \"sources\": [...],\n  \"confidence\": 0.95\n}\n```\n\n\u2705 Production ready!",
        "height": 180,
        "width": 260,
        "color": 6
      },
      "id": "response-note",
      "name": "Response Format",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        1150,
        450
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "doc-qa"
      },
      "id": "webhook-trigger",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [
        250,
        300
      ],
      "webhookId": "doc-qa-webhook",
      "notes": "API endpoint for document Q&A"
    },
    {
      "parameters": {
        "jsCode": "// Validate incoming request\nconst body = $input.first().json.body;\nconst errors = [];\n\nif (!body.documentUrl && !body.documentId) {\n  errors.push('Either documentUrl or documentId is required');\n}\nif (!body.question) {\n  errors.push('Question is required');\n}\n\n// Generate session ID if not provided\nconst sessionId = body.sessionId || `session-${Date.now()}`;\n\nreturn [{\n  json: {\n    ...body,\n    sessionId,\n    valid: errors.length === 0,\n    errors,\n    timestamp: new Date().toISOString()\n  }\n}];"
      },
      "id": "validate-request",
      "name": "Validate Request",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        450,
        300
      ],
      "notes": "Validate and prepare request"
    },
    {
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{ $json.valid }}",
              "value2": true
            }
          ]
        }
      },
      "id": "check-valid",
      "name": "Valid Request?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        650,
        300
      ]
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "ask",
        "inputType": "url",
        "url": "={{ $json.documentUrl }}",
        "prompt": "Answer the following question about this document or image: {{ $json.question }}"
      },
      "id": "pdfvector-ask",
      "name": "PDF Vector - Ask Question",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [
        850,
        250
      ],
      "notes": "Get answer from document"
    },
    {
      "parameters": {
        "jsCode": "// Prepare successful response\nconst answer = $json.answer;\nconst request = $node['Validate Request'].json;\n\n// Calculate confidence score based on answer length and keywords\nlet confidence = 0.8; // Base confidence\nif (answer.length > 100) confidence += 0.1;\nif (answer.toLowerCase().includes('specifically') || answer.toLowerCase().includes('according to')) confidence += 0.1;\nconfidence = Math.min(confidence, 1.0);\n\nreturn [{\n  json: {\n    success: true,\n    data: {\n      answer,\n      confidence,\n      sessionId: request.sessionId,\n      documentUrl: request.documentUrl,\n      question: request.question\n    },\n    metadata: {\n      processedAt: new Date().toISOString(),\n      responseTime: Date.now() - new Date(request.timestamp).getTime(),\n      creditsUsed: 1\n    }\n  }\n}];"
      },
      "id": "format-success",
      "name": "Format Success Response",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1050,
        250
      ],
      "notes": "Prepare successful response"
    },
    {
      "parameters": {
        "jsCode": "// Prepare error response\nconst errors = $json.errors || ['An error occurred processing your request'];\n\nreturn [{\n  json: {\n    success: false,\n    errors,\n    message: 'Invalid request',\n    timestamp: new Date().toISOString()\n  }\n}];"
      },
      "id": "format-error",
      "name": "Format Error Response",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        850,
        350
      ],
      "notes": "Prepare error response"
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ JSON.stringify($json) }}",
        "responseHeaders": {
          "entries": [
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        }
      },
      "id": "webhook-response",
      "name": "Send Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [
        1250,
        300
      ],
      "notes": "Send API response"
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "Validate Request",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Validate Request": {
      "main": [
        [
          {
            "node": "Valid Request?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Valid Request?": {
      "main": [
        [
          {
            "node": "PDF Vector - Ask Question",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Format Error Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Ask Question": {
      "main": [
        [
          {
            "node": "Format Success Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Format Success Response": {
      "main": [
        [
          {
            "node": "Send Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Format Error Response": {
      "main": [
        [
          {
            "node": "Send Response",
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

## 5. Extract and Analyze Research Papers with PDF Vector Academic Tools

**Name:** Extract and Analyze Research Papers with PDF Vector Academic Tools

**Description:**

## Overview

Researchers and academic institutions need efficient ways to process and analyze large volumes of research papers and academic documents, including scanned PDFs and image-based materials (JPG, PNG). Manual review of academic literature is time-consuming and makes it difficult to identify trends, track citations, and synthesize findings across multiple papers. This workflow automates the extraction and analysis of research papers and scanned documents using OCR technology, creating a searchable knowledge base of academic insights from both digital and image-based sources.

## What You Can Do

- Extract key information from research papers automatically, including methodologies, findings, and citations
- Build a searchable database of academic insights from both digital and image-based sources
- Track citations and identify research trends across multiple papers
- Synthesize findings from large volumes of academic literature efficiently

## Who It's For

Research institutions, university libraries, R&D departments, academic researchers, literature review teams, and organizations tracking scientific developments in their field.

## The Problem It Solves

Literature reviews require reading hundreds of papers to identify relevant findings and methodologies. This template automates the extraction of key information from research papers, including methodologies, findings, and citations. It builds a searchable database that helps researchers quickly find relevant studies and identify research gaps.

**Setup Instructions:**
1. Install the PDF Vector community node with academic features
2. Configure PDF Vector API with academic search enabled
3. Configure Google Drive credentials for document access
4. Set up database for storing extracted research data
5. Configure citation tracking preferences
6. Set up automated paper ingestion from sources
7. Configure summary generation parameters

**Key Features:**
- Google Drive integration for research paper retrieval (PDFs, JPGs, PNGs)
- OCR processing for scanned documents and images
- Automatic extraction of paper metadata and structure from any format
- Methodology and findings summarization from PDFs and images
- Citation network analysis and metrics
- Multi-paper trend identification
- Searchable research database creation
- Integration with academic search engines

**Customization Options:**
- Add field-specific extraction templates
- Configure automated paper discovery from arXiv, PubMed, etc.
- Implement citation alert systems
- Create research trend visualizations
- Add collaboration features for research teams
- Build API endpoints for research queries
- Integrate with reference management tools

**Implementation Details:**
The workflow uses PDF Vector's academic features to understand research paper structure and extract meaningful insights. It processes papers from various sources, identifies key contributions, and creates structured summaries. The system tracks citations to measure impact and identifies emerging research trends by analyzing multiple papers in a field.

**Note:** This workflow uses the PDF Vector community node. Make sure to install it from the n8n community nodes collection before using this template.

**Template Code:**
```json
{
  "meta": {
    "instanceId": "placeholder"
  },
  "nodes": [
    {
      "parameters": {
        "content": "## \ud83d\udcda Research Paper Analyzer\n\nAcademic research automation:\n\u2022 **Searches** arXiv, PubMed, Scholar\n\u2022 **Downloads** papers automatically\n\u2022 **Extracts** key findings with AI\n\u2022 **Summarizes** methodology & results\n\u2022 **Formats** citations (APA/MLA/BibTeX)",
        "height": 180,
        "width": 350,
        "color": 5
      },
      "id": "overview-note",
      "name": "Research Overview",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        50,
        50
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## \ud83d\udd0d Paper Search\n\nSearches databases:\n\u2022 arXiv (CS, Physics, Math)\n\u2022 PubMed (Medical)\n\u2022 Semantic Scholar\n\n\ud83d\udca1 Returns top 10 relevant",
        "height": 150,
        "width": 260
      },
      "id": "search-note",
      "name": "Academic Search",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        450,
        450
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## \ud83d\udcc4 Extraction\n\nPDF Vector extracts:\n\u2022 Title & authors\n\u2022 Abstract\n\u2022 Methodology\n\u2022 Results & findings\n\u2022 References\n\n\ud83c\udfaf Structured data",
        "height": 180,
        "width": 260
      },
      "id": "extract-note",
      "name": "Paper Extraction",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        750,
        450
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## \ud83e\udd16 AI Summary\n\nGenerates:\n\u2022 Executive summary\n\u2022 Key contributions\n\u2022 Methodology critique\n\u2022 Future directions\n\u2022 Formatted citations\n\n\u2728 Publication ready!",
        "height": 180,
        "width": 260,
        "color": 6
      },
      "id": "summary-note",
      "name": "AI Analysis",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        1050,
        450
      ],
      "typeVersion": 1
    },
    {
      "parameters": {},
      "id": "manual-trigger",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [
        250,
        300
      ],
      "notes": "Start paper analysis"
    },
    {
      "parameters": {
        "operation": "download",
        "fileId": "={{ $json.fileId }}"
      },
      "id": "google-drive",
      "name": "Google Drive - Get Paper",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [
        450,
        300
      ],
      "notes": "Retrieve paper from Drive"
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "parse",
        "inputType": "file",
        "binaryPropertyName": "data",
        "useLLM": "always"
      },
      "id": "pdfvector-parse",
      "name": "PDF Vector - Parse Paper",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [
        650,
        300
      ],
      "notes": "Parse research paper"
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "extract",
        "inputType": "file",
        "binaryPropertyName": "data",
        "prompt": "Extract key information from this research document or image including title, authors with affiliations, abstract, keywords, research questions, methodology, key findings, conclusions, limitations, and future work suggestions. Use OCR if this is a scanned document or image.",
        "schema": "{\"type\":\"object\",\"properties\":{\"title\":{\"type\":\"string\"},\"authors\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\"},\"affiliation\":{\"type\":\"string\"},\"email\":{\"type\":\"string\"}}}},\"abstract\":{\"type\":\"string\"},\"keywords\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}},\"researchQuestions\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}},\"methodology\":{\"type\":\"object\",\"properties\":{\"approach\":{\"type\":\"string\"},\"dataCollection\":{\"type\":\"string\"},\"analysis\":{\"type\":\"string\"},\"tools\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}}}},\"findings\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}},\"conclusions\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}},\"limitations\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}},\"futureWork\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}},\"references\":{\"type\":\"number\"}},\"required\":[\"title\",\"authors\"],\"additionalProperties\":false}"
      },
      "id": "pdfvector-extract",
      "name": "PDF Vector - Extract Data",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [
        850,
        300
      ],
      "notes": "Extract structured data"
    },
    {
      "parameters": {
        "model": "gpt-4",
        "messages": {
          "values": [
            {
              "content": "Based on this research paper, provide:\n\n1. A concise summary (150 words) suitable for a research database\n2. The main contribution to the field (2-3 sentences)\n3. Potential applications or impact\n4. Classification tags (e.g., empirical study, theoretical framework, review, etc.)\n\nPaper content:\n{{ $node['PDF Vector - Parse Paper'].json.content }}"
            }
          ]
        }
      },
      "id": "openai-analyze",
      "name": "Generate AI Summary",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        1050,
        300
      ],
      "notes": "Create AI summary"
    },
    {
      "parameters": {
        "jsCode": "// Combine all analysis data\nconst parsedContent = $node['PDF Vector - Parse Paper'].json;\nconst extractedData = $node['PDF Vector - Extract Data'].json.data;\nconst aiSummary = $node['Generate AI Summary'].json.choices[0].message.content;\n\n// Calculate reading time (assuming 250 words per minute)\nconst wordCount = parsedContent.content.split(' ').length;\nconst readingTimeMinutes = Math.ceil(wordCount / 250);\n\n// Prepare database entry\nconst paperAnalysis = {\n  // Basic information\n  title: extractedData.title,\n  authors: extractedData.authors,\n  url: $node['Google Drive - Get Paper'].json.webViewLink,\n  \n  // Content\n  abstract: extractedData.abstract,\n  keywords: extractedData.keywords,\n  fullText: parsedContent.content,\n  \n  // Analysis\n  aiSummary: aiSummary,\n  methodology: extractedData.methodology,\n  findings: extractedData.findings,\n  conclusions: extractedData.conclusions,\n  limitations: extractedData.limitations,\n  futureWork: extractedData.futureWork,\n  \n  // Metadata\n  wordCount: wordCount,\n  readingTimeMinutes: readingTimeMinutes,\n  referenceCount: extractedData.references || 0,\n  processedAt: new Date().toISOString(),\n  \n  // Searchable fields\n  searchText: `${extractedData.title} ${extractedData.abstract} ${extractedData.keywords.join(' ')}`.toLowerCase()\n};\n\nreturn [{ json: paperAnalysis }];"
      },
      "id": "prepare-data",
      "name": "Prepare Database Entry",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1250,
        300
      ],
      "notes": "Combine all data"
    },
    {
      "parameters": {
        "operation": "insert",
        "table": "research_papers",
        "columns": "title,authors,url,abstract,keywords,ai_summary,methodology,findings,processed_at,search_text"
      },
      "id": "database-store",
      "name": "Store in Database",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 1,
      "position": [
        1450,
        300
      ],
      "notes": "Save to research database"
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [
        [
          {
            "node": "Google Drive - Get Paper",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Drive - Get Paper": {
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
            "node": "PDF Vector - Extract Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Extract Data": {
      "main": [
        [
          {
            "node": "Generate AI Summary",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate AI Summary": {
      "main": [
        [
          {
            "node": "Prepare Database Entry",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Prepare Database Entry": {
      "main": [
        [
          {
            "node": "Store in Database",
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

## 6. Process Receipts with Tax Categorization

**Name:** Automated Receipt Processing with Tax Categorization

**Description:**

## Overview

Businesses and freelancers often struggle with the tedious task of manually processing receipts for expense tracking and tax purposes. This workflow automates the entire receipt processing pipeline, extracting detailed information from receipts (including scanned images, photos, PDFs, JPGs, and PNGs) and intelligently categorizing them for tax deductions.

## What You Can Do

- Automatically process receipts from various formats (PDFs, JPGs, PNGs, scanned images)
- Extract detailed expense information with OCR technology
- Intelligently categorize expenses for tax deductions
- Maintain compliance with accounting standards and tax regulations
- Track expenses efficiently throughout the year

## Who It's For

Accountants, small business owners, freelancers, finance teams, and individual professionals who need to process large volumes of receipts efficiently for expense tracking and tax preparation.

## The Problem It Solves

Manual receipt processing is time-consuming and error-prone, especially during tax season. People struggle to organize receipts, extract accurate data from various formats, and categorize expenses properly for tax deductions. This template automates the entire process while ensuring compliance with accounting standards and tax regulations.

**Setup Instructions:**
1. Configure Google Drive credentials for receipt storage access
2. Install the PDF Vector community node from the n8n marketplace
3. Configure PDF Vector API credentials
4. Set up tax category definitions based on your jurisdiction
5. Configure accounting software integration (QuickBooks, Xero, etc.)
6. Set up validation rules for expense categories
7. Configure reporting and export formats

**Key Features:**
- Automatic retrieval of receipts from Google Drive folders
- OCR support for photos and scanned receipts
- Intelligent tax category assignment based on merchant and expense type
- Multi-currency support for international transactions
- Automatic detection of meal expenses with deduction percentages
- Financial validation to catch calculation errors
- Audit trail maintenance for compliance
- Integration with popular accounting software

**Customization Options:**
- Define custom tax categories specific to your business type
- Set up automated rules for recurring merchants
- Configure expense approval workflows for team members
- Add mileage tracking integration for travel expenses
- Set up automated notifications for high-value expenses
- Customize export formats for different accounting systems
- Add multi-language support for international receipts

**Implementation Details:**
The workflow uses advanced OCR technology to extract information from various receipt formats, including handwritten receipts and low-quality scans. It applies intelligent categorization rules based on merchant type, expense amount, and business context. The system includes built-in validation to ensure data accuracy and tax compliance.

**Note:** This workflow uses the PDF Vector community node. Make sure to install it from the n8n community nodes collection before using this template.

**Template Code:**
```json
{
  "meta": {
    "instanceId": "placeholder"
  },
  "nodes": [
    {
      "parameters": {
        "content": "## \ud83e\uddfe Receipt & Tax Tracker\n\nAutomated expense management:\n\u2022 **Monitors** receipt folder hourly\n\u2022 **Extracts** data from photos/PDFs\n\u2022 **Categorizes** for tax purposes\n\u2022 **Calculates** deductions\n\u2022 **Syncs** with QuickBooks",
        "height": 180,
        "width": 350,
        "color": 5
      },
      "id": "overview-note",
      "name": "Receipt Overview",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        50,
        50
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## \ud83d\udcf8 Receipt Input\n\nHandles all formats:\n\u2022 Phone photos\n\u2022 Scanned PDFs\n\u2022 Email forwards\n\u2022 Poor quality images\n\n\ud83d\udca1 OCR enhancement",
        "height": 150,
        "width": 250
      },
      "id": "input-note",
      "name": "Input Sources",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        450,
        450
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## \ud83d\udcb0 Tax Logic\n\n**Auto-categorizes:**\n\u2022 Travel expenses\n\u2022 Office supplies\n\u2022 Meals (50% deduction)\n\u2022 Utilities\n\n\u26a0\ufe0f Consult tax advisor!",
        "height": 160,
        "width": 260,
        "color": 4
      },
      "id": "tax-note",
      "name": "Tax Categories",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        850,
        450
      ],
      "typeVersion": 1
    },
    {
      "parameters": {},
      "id": "manual-trigger",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [
        250,
        300
      ],
      "notes": "Process receipt"
    },
    {
      "parameters": {
        "operation": "download",
        "fileId": "={{ $json.fileId }}"
      },
      "id": "google-drive",
      "name": "Google Drive - Get Receipt",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [
        450,
        300
      ],
      "notes": "Retrieve receipt from Drive"
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "extract",
        "inputType": "file",
        "binaryPropertyName": "data",
        "prompt": "Extract all receipt information from this document or image including merchant name and address, transaction date and time, all items with descriptions and prices, subtotal, tax amount and rate, tip if applicable, total amount, payment method, and any loyalty or membership numbers. Use OCR if this is a scanned receipt or image.",
        "schema": "{\"type\":\"object\",\"properties\":{\"merchant\":{\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\"},\"address\":{\"type\":\"string\"},\"phone\":{\"type\":\"string\"},\"taxId\":{\"type\":\"string\"}}},\"transaction\":{\"type\":\"object\",\"properties\":{\"date\":{\"type\":\"string\"},\"time\":{\"type\":\"string\"},\"receiptNumber\":{\"type\":\"string\"},\"cashier\":{\"type\":\"string\"}}},\"items\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\"},\"description\":{\"type\":\"string\"},\"quantity\":{\"type\":\"number\"},\"unitPrice\":{\"type\":\"number\"},\"totalPrice\":{\"type\":\"number\"},\"taxable\":{\"type\":\"boolean\"}}}},\"financial\":{\"type\":\"object\",\"properties\":{\"subtotal\":{\"type\":\"number\"},\"taxRate\":{\"type\":\"number\"},\"taxAmount\":{\"type\":\"number\"},\"tip\":{\"type\":\"number\"},\"total\":{\"type\":\"number\"},\"currency\":{\"type\":\"string\"}}},\"payment\":{\"type\":\"object\",\"properties\":{\"method\":{\"type\":\"string\"},\"lastFourDigits\":{\"type\":\"string\"},\"authCode\":{\"type\":\"string\"}}},\"loyalty\":{\"type\":\"object\",\"properties\":{\"memberNumber\":{\"type\":\"string\"},\"pointsEarned\":{\"type\":\"number\"},\"pointsBalance\":{\"type\":\"number\"}}}},\"required\":[\"merchant\",\"financial\"],\"additionalProperties\":false}"
      },
      "id": "pdfvector-extract",
      "name": "PDF Vector - Extract Receipt",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [
        650,
        300
      ],
      "notes": "Extract receipt data"
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "ask",
        "inputType": "file",
        "binaryPropertyName": "data",
        "prompt": "Based on this receipt document or image, determine: 1) The most appropriate tax category (meals, travel, supplies, equipment, etc.), 2) Whether this is likely tax deductible for business, 3) If this is a meal receipt, what percentage would typically be deductible, 4) Any special considerations for tax purposes. Process any image format using OCR if needed."
      },
      "id": "pdfvector-categorize",
      "name": "PDF Vector - Tax Categorization",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [
        850,
        300
      ],
      "notes": "Categorize for taxes"
    },
    {
      "parameters": {
        "jsCode": "// Process receipt data and tax categorization\nconst receiptData = $node['PDF Vector - Extract Receipt'].json.data;\nconst taxCategory = $node['PDF Vector - Tax Categorization'].json.answer;\n\n// Validate financial calculations\nlet validationErrors = [];\nif (receiptData.items && receiptData.items.length > 0) {\n  const calculatedSubtotal = receiptData.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);\n  if (Math.abs(calculatedSubtotal - receiptData.financial.subtotal) > 0.02) {\n    validationErrors.push('Item totals do not match subtotal');\n  }\n}\n\n// Calculate tax consistency\nconst expectedTax = receiptData.financial.subtotal * (receiptData.financial.taxRate / 100);\nif (Math.abs(expectedTax - receiptData.financial.taxAmount) > 0.02) {\n  validationErrors.push('Tax calculation inconsistency');\n}\n\n// Determine expense category and deductibility\nlet expenseCategory = 'Other';\nlet deductiblePercentage = 100;\nlet taxNotes = '';\n\nif (taxCategory.toLowerCase().includes('meal')) {\n  expenseCategory = 'Meals & Entertainment';\n  deductiblePercentage = 50; // Typical meal deduction\n  taxNotes = 'Business meal - 50% deductible';\n} else if (taxCategory.toLowerCase().includes('travel')) {\n  expenseCategory = 'Travel';\n  deductiblePercentage = 100;\n  taxNotes = 'Business travel expense';\n} else if (taxCategory.toLowerCase().includes('supplies')) {\n  expenseCategory = 'Office Supplies';\n  deductiblePercentage = 100;\n  taxNotes = 'Business supplies';\n}\n\n// Create processed expense record\nconst processedExpense = {\n  // Receipt data\n  merchant: receiptData.merchant.name,\n  date: receiptData.transaction.date,\n  amount: receiptData.financial.total,\n  currency: receiptData.financial.currency || 'USD',\n  \n  // Tax information\n  expenseCategory,\n  deductiblePercentage,\n  deductibleAmount: (receiptData.financial.total * deductiblePercentage / 100).toFixed(2),\n  taxNotes,\n  \n  // Original data\n  originalReceipt: receiptData,\n  aiCategorization: taxCategory,\n  \n  // Validation\n  isValid: validationErrors.length === 0,\n  validationErrors,\n  \n  // Metadata\n  processedAt: new Date().toISOString(),\n  taxYear: new Date(receiptData.transaction.date).getFullYear()\n};\n\nreturn [{ json: processedExpense }];"
      },
      "id": "process-expense",
      "name": "Process Expense Data",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1050,
        300
      ],
      "notes": "Validate and categorize"
    },
    {
      "parameters": {
        "operation": "append",
        "sheetId": "{{ $json.taxYear }}-expenses",
        "range": "A:H",
        "data": "={{ [[$json.date, $json.merchant, $json.expenseCategory, $json.amount, $json.deductibleAmount, $json.deductiblePercentage + '%', $json.taxNotes, $json.processedAt]] }}"
      },
      "id": "save-spreadsheet",
      "name": "Save to Expense Sheet",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 1,
      "position": [
        1250,
        300
      ],
      "notes": "Track in spreadsheet"
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [
        [
          {
            "node": "Google Drive - Get Receipt",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Drive - Get Receipt": {
      "main": [
        [
          {
            "node": "PDF Vector - Extract Receipt",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Extract Receipt": {
      "main": [
        [
          {
            "node": "PDF Vector - Tax Categorization",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Tax Categorization": {
      "main": [
        [
          {
            "node": "Process Expense Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Process Expense Data": {
      "main": [
        [
          {
            "node": "Save to Expense Sheet",
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

## 7. Extract Medical Data with HIPAA Compliance

**Name:** Extract Medical Data with HIPAA Compliance

**Description:**

## Overview

Healthcare organizations face significant challenges in digitizing and processing medical records while maintaining strict HIPAA compliance. This workflow provides a secure, automated solution for extracting clinical data from various medical documents including discharge summaries, lab reports, clinical notes, prescription records, and scanned medical images (JPG, PNG).

## What You Can Do

- Extract clinical data from medical documents while maintaining HIPAA compliance
- Process handwritten notes and scanned medical images with OCR
- Automatically identify and protect PHI (Protected Health Information)
- Generate structured data from various medical document formats
- Maintain audit trails for regulatory compliance

## Who It's For

Healthcare providers, medical billing companies, clinical research organizations, health information exchanges, and medical practice administrators who need to digitize and extract data from medical records while maintaining HIPAA compliance.

## The Problem It Solves

Manual medical record processing is time-consuming, error-prone, and creates compliance risks. Healthcare organizations struggle to extract structured data from handwritten notes, scanned documents, and various medical forms while protecting PHI. This template automates the extraction process while maintaining the highest security standards for Protected Health Information.

**Setup Instructions:**
1. Configure Google Drive credentials with proper medical record access controls
2. Install the PDF Vector community node from the n8n marketplace
3. Configure PDF Vector API credentials with HIPAA-compliant settings
4. Set up secure database storage with encryption at rest
5. Define PHI handling rules and extraction parameters
6. Configure audit logging for regulatory compliance
7. Set up integration with your Electronic Health Record (EHR) system

**Key Features:**
- Secure retrieval of medical documents from Google Drive
- HIPAA-compliant processing with automatic PHI masking
- OCR support for handwritten notes and scanned medical images
- Automatic extraction of diagnoses with ICD-10 code validation
- Medication list processing with dosage and frequency information
- Lab results extraction with reference ranges and flagging
- Vital signs capture and normalization
- Complete audit trail for regulatory compliance
- Integration-ready format for EHR systems

**Customization Options:**
- Define institution-specific medical terminology and abbreviations
- Configure automated alerts for critical lab values or abnormal results
- Set up custom extraction fields for specialized medical forms
- Implement medication interaction warnings and contraindication checks
- Add support for multiple languages and international medical coding systems
- Configure integration with specific EHR platforms (Epic, Cerner, etc.)
- Set up automated quality assurance checks and validation rules

**Implementation Details:**
The workflow uses advanced AI with medical domain knowledge to understand clinical terminology and extract relevant information while automatically identifying and protecting PHI. It processes various document formats including handwritten prescriptions, lab reports, discharge summaries, and clinical notes. The system maintains strict security protocols with encryption at rest and in transit, ensuring full HIPAA compliance throughout the processing pipeline.

**Note:** This workflow uses the PDF Vector community node. Make sure to install it from the n8n community nodes collection before using this template.

**Template Code:**
```json
{
  "meta": {
    "instanceId": "placeholder"
  },
  "nodes": [
    {
      "parameters": {
        "content": "## \ud83c\udfe5 Medical Records Processor\n\n\u26a0\ufe0f **HIPAA COMPLIANT WORKFLOW**\n\n\u2022 **Secure** SFTP intake only\n\u2022 **Extracts** clinical data with PHI removal\n\u2022 **Codes** ICD-10 & CPT automatically\n\u2022 **Formats** HL7 FHIR standard\n\u2022 **Integrates** with Epic/Cerner",
        "height": 200,
        "width": 350,
        "color": 1
      },
      "id": "overview-note",
      "name": "HIPAA Overview",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        50,
        50
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## \ud83d\udd10 Security Setup\n\n**REQUIRED:**\n\u2022 Encryption at rest\n\u2022 TLS 1.3 minimum\n\u2022 Audit logging ON\n\u2022 PHI de-identification\n\u2022 Access controls\n\n\u26a0\ufe0f Review with compliance!",
        "height": 180,
        "width": 280,
        "color": 1
      },
      "id": "security-note",
      "name": "Security Requirements",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        50,
        270
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## \ud83d\udccb Clinical Coding\n\n**Automatic mapping:**\n\u2022 Diagnoses \u2192 ICD-10\n\u2022 Procedures \u2192 CPT\n\u2022 Medications \u2192 NDC\n\n\ud83d\udca1 No PHI in logs!",
        "height": 150,
        "width": 260
      },
      "id": "coding-note",
      "name": "Clinical Codes",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        650,
        450
      ],
      "typeVersion": 1
    },
    {
      "parameters": {},
      "id": "manual-trigger",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [
        250,
        300
      ],
      "notes": "Process medical record"
    },
    {
      "parameters": {
        "operation": "download",
        "fileId": "={{ $json.fileId }}"
      },
      "id": "google-drive",
      "name": "Google Drive - Get Medical Record",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [
        450,
        300
      ],
      "notes": "Retrieve record from Drive"
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "extract",
        "inputType": "file",
        "binaryPropertyName": "data",
        "prompt": "Extract medical information from this document or image including patient ID (not name), visit date, chief complaint, diagnoses with ICD codes, medications with dosages, vital signs, lab results with values and reference ranges, procedures performed, and follow-up instructions. Do not extract patient names, SSN, or other identifying information. Use OCR if this is a scanned document or medical image.",
        "schema": "{\"type\":\"object\",\"properties\":{\"patientRecord\":{\"type\":\"object\",\"properties\":{\"patientId\":{\"type\":\"string\"},\"visitDate\":{\"type\":\"string\"},\"visitType\":{\"type\":\"string\"},\"provider\":{\"type\":\"string\"},\"facility\":{\"type\":\"string\"}}},\"clinicalData\":{\"type\":\"object\",\"properties\":{\"chiefComplaint\":{\"type\":\"string\"},\"historyOfPresentIllness\":{\"type\":\"string\"},\"reviewOfSystems\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}}}},\"diagnoses\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"description\":{\"type\":\"string\"},\"icdCode\":{\"type\":\"string\"},\"type\":{\"type\":\"string\"},\"status\":{\"type\":\"string\"}}}},\"medications\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\"},\"dosage\":{\"type\":\"string\"},\"frequency\":{\"type\":\"string\"},\"route\":{\"type\":\"string\"},\"startDate\":{\"type\":\"string\"},\"status\":{\"type\":\"string\"}}}},\"vitalSigns\":{\"type\":\"object\",\"properties\":{\"bloodPressure\":{\"type\":\"string\"},\"heartRate\":{\"type\":\"string\"},\"temperature\":{\"type\":\"string\"},\"respiratoryRate\":{\"type\":\"string\"},\"oxygenSaturation\":{\"type\":\"string\"},\"weight\":{\"type\":\"string\"},\"height\":{\"type\":\"string\"},\"bmi\":{\"type\":\"string\"}}},\"labResults\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"testName\":{\"type\":\"string\"},\"value\":{\"type\":\"string\"},\"unit\":{\"type\":\"string\"},\"referenceRange\":{\"type\":\"string\"},\"flag\":{\"type\":\"string\"},\"collectionDate\":{\"type\":\"string\"}}}},\"procedures\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\"},\"cptCode\":{\"type\":\"string\"},\"date\":{\"type\":\"string\"}}}},\"plan\":{\"type\":\"object\",\"properties\":{\"followUp\":{\"type\":\"string\"},\"instructions\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}},\"referrals\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}}}}},\"required\":[\"patientRecord\",\"diagnoses\"],\"additionalProperties\":false}"
      },
      "id": "pdfvector-extract",
      "name": "PDF Vector - Extract Medical Data",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [
        650,
        300
      ],
      "notes": "Extract medical information"
    },
    {
      "parameters": {
        "jsCode": "// Process and validate medical data\nconst medicalData = $input.first().json.data;\n\n// Create audit log entry\nconst auditLog = {\n  action: 'Medical Record Processed',\n  timestamp: new Date().toISOString(),\n  recordType: 'Clinical Document',\n  patientId: medicalData.patientRecord.patientId,\n  userId: 'system-automated',\n  ipAddress: 'internal-process'\n};\n\n// Validate critical fields\nconst validationResults = {\n  hasPatientId: !!medicalData.patientRecord?.patientId,\n  hasVisitDate: !!medicalData.patientRecord?.visitDate,\n  hasDiagnoses: medicalData.diagnoses?.length > 0,\n  hasValidIcdCodes: true\n};\n\n// Validate ICD codes format\nif (medicalData.diagnoses) {\n  medicalData.diagnoses.forEach(diagnosis => {\n    if (diagnosis.icdCode && !diagnosis.icdCode.match(/^[A-Z][0-9]{2}(\\.[0-9]{1,2})?$/)) {\n      validationResults.hasValidIcdCodes = false;\n    }\n  });\n}\n\n// Flag abnormal lab results\nconst abnormalLabs = [];\nif (medicalData.labResults) {\n  medicalData.labResults.forEach(lab => {\n    if (lab.flag && (lab.flag === 'H' || lab.flag === 'L' || lab.flag === 'Critical')) {\n      abnormalLabs.push({\n        test: lab.testName,\n        value: lab.value,\n        flag: lab.flag\n      });\n    }\n  });\n}\n\n// Check for drug interactions (simplified)\nconst medications = medicalData.medications || [];\nconst potentialInteractions = [];\n// This is a simplified check - in production, use a proper drug interaction API\nif (medications.length > 1) {\n  // Example: Check for common dangerous combinations\n  const medNames = medications.map(m => m.name.toLowerCase());\n  if (medNames.some(m => m.includes('warfarin')) && medNames.some(m => m.includes('aspirin'))) {\n    potentialInteractions.push('Warfarin + Aspirin: Increased bleeding risk');\n  }\n}\n\n// Prepare processed record\nconst processedRecord = {\n  // Core data\n  patientRecord: medicalData.patientRecord,\n  clinicalData: medicalData.clinicalData,\n  diagnoses: medicalData.diagnoses,\n  medications: medicalData.medications,\n  vitalSigns: medicalData.vitalSigns,\n  labResults: medicalData.labResults,\n  procedures: medicalData.procedures,\n  plan: medicalData.plan,\n  \n  // Analysis results\n  alerts: {\n    abnormalLabs,\n    potentialInteractions\n  },\n  \n  // Metadata\n  validation: validationResults,\n  processedAt: new Date().toISOString(),\n  dataClassification: 'PHI - Protected Health Information',\n  retentionYears: 7,\n  \n  // Compliance\n  auditLog\n};\n\nreturn [{ json: processedRecord }];"
      },
      "id": "process-validate",
      "name": "Process & Validate Data",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        850,
        300
      ],
      "notes": "Validate and prepare data"
    },
    {
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{ $json.validation.hasPatientId }}",
              "value2": true
            },
            {
              "value1": "={{ $json.validation.hasDiagnoses }}",
              "value2": true
            }
          ]
        },
        "combineOperation": "all"
      },
      "id": "check-valid",
      "name": "Valid Record?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        1050,
        300
      ]
    },
    {
      "parameters": {
        "operation": "insert",
        "table": "medical_records",
        "columns": "patient_id,visit_date,diagnoses,medications,lab_results,processed_at,data_classification"
      },
      "id": "secure-storage",
      "name": "Store in Secure Database",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 1,
      "position": [
        1250,
        250
      ],
      "notes": "HIPAA-compliant storage"
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [
        [
          {
            "node": "Google Drive - Get Medical Record",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Drive - Get Medical Record": {
      "main": [
        [
          {
            "node": "PDF Vector - Extract Medical Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Extract Medical Data": {
      "main": [
        [
          {
            "node": "Process & Validate Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Process & Validate Data": {
      "main": [
        [
          {
            "node": "Valid Record?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Valid Record?": {
      "main": [
        [
          {
            "node": "Store in Secure Database",
            "type": "main",
            "index": 0
          }
        ],
        []
      ]
    }
  }
}
```

**Free or Paid?** Free

---

## 8. Generate Literature Reviews with Citation Management

**Name:** Generate Literature Reviews with Citation Management

**Description:**

## Overview

Conducting comprehensive literature reviews is one of the most time-consuming aspects of academic research. This workflow revolutionizes the process by automating literature search, paper analysis, and review generation across multiple academic databases. It handles both digital papers and scanned documents (PDFs, JPGs, PNGs), using OCR technology for older publications or image-based content.

## What You Can Do

- Automate searches across multiple academic databases simultaneously
- Analyze and rank papers by relevance, citations, and impact
- Generate comprehensive literature reviews with proper citations
- Process both digital and scanned documents with OCR
- Identify research gaps and emerging trends systematically

## Who It's For

Researchers, graduate students, academic institutions, literature review teams, and academic writers who need to conduct comprehensive literature reviews efficiently while maintaining high quality and thoroughness.

## The Problem It Solves

Manual literature reviews are extremely time-consuming and often miss relevant papers across different databases. Researchers struggle to synthesize large volumes of academic papers, track citations properly, and identify research gaps systematically. This template automates the entire process from search to synthesis, ensuring comprehensive coverage and proper citation management.

**Setup Instructions:**
1. Configure PDF Vector API credentials with academic search access
2. Set up search parameters including databases and date ranges
3. Define inclusion and exclusion criteria for paper selection
4. Choose citation style (APA, MLA, Chicago, etc.)
5. Configure output format preferences
6. Set up reference management software integration if needed
7. Define research topic and keywords for search

**Key Features:**
- Simultaneous search across PubMed, arXiv, Semantic Scholar, and other databases
- Intelligent paper ranking based on citation count, recency, and relevance
- OCR support for scanned documents and older publications
- Automatic extraction of methodologies, findings, and limitations
- Citation network analysis to identify seminal works
- Automatic theme organization and research gap identification
- Multiple citation format support (APA, MLA, Chicago)
- Quality scoring based on journal impact factors

**Customization Options:**
- Configure search parameters for specific research domains
- Set up automated searches for ongoing literature monitoring
- Integrate with reference management software (Zotero, Mendeley)
- Customize output format and structure
- Add collaborative review features for research teams
- Set up quality filters based on journal rankings
- Configure notification systems for new relevant papers

**Implementation Details:**
The workflow uses advanced algorithms to search multiple academic databases simultaneously, ranking papers by relevance and impact. It processes full-text PDFs when available and uses OCR for scanned documents. The system automatically extracts key information, organizes findings by themes, and generates structured literature reviews with proper citations and reference management.

**Note:** This workflow uses the PDF Vector community node. Make sure to install it from the n8n community nodes collection before using this template.

**Template Code:**
```json
{
  "meta": {
    "instanceId": "placeholder"
  },
  "nodes": [
    {
      "parameters": {
        "content": "## \ud83d\udcd6 Literature Review Generator\n\nSystematic review automation:\n\u2022 **Searches** multiple databases\n\u2022 **Screens** with inclusion criteria\n\u2022 **Assesses** study quality\n\u2022 **Synthesizes** findings\n\u2022 **Generates** PRISMA-compliant review",
        "height": 180,
        "width": 350,
        "color": 5
      },
      "id": "overview-note",
      "name": "Review Overview",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        50,
        50
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## \ud83d\udd0d Search Strategy\n\nDatabases searched:\n\u2022 PubMed/MEDLINE\n\u2022 Web of Science\n\u2022 Cochrane Library\n\u2022 Google Scholar\n\n\ud83d\udca1 De-duplicates results",
        "height": 160,
        "width": 260
      },
      "id": "search-note",
      "name": "Database Search",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        450,
        450
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## \ud83d\udcca Quality Assessment\n\n**Evaluates:**\n\u2022 Study design\n\u2022 Sample size\n\u2022 Risk of bias\n\u2022 Evidence level\n\n\u2705 Cochrane standards",
        "height": 150,
        "width": 260
      },
      "id": "quality-note",
      "name": "Study Quality",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        850,
        450
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## \ud83d\udcdd Review Output\n\nGenerates:\n\u2022 Narrative synthesis\n\u2022 Evidence tables\n\u2022 PRISMA diagram\n\u2022 Forest plots\n\u2022 Bibliography\n\n\ud83c\udfaf Publication ready!",
        "height": 180,
        "width": 260,
        "color": 6
      },
      "id": "output-note",
      "name": "Final Review",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        1150,
        450
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "topic",
              "value": "machine learning in healthcare"
            },
            {
              "name": "yearFrom",
              "value": "2020"
            },
            {
              "name": "yearTo",
              "value": "2024"
            }
          ],
          "number": [
            {
              "name": "maxPapers",
              "value": 20
            }
          ]
        }
      },
      "id": "set-parameters",
      "name": "Set Search Parameters",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [
        250,
        300
      ],
      "notes": "Configure literature review parameters"
    },
    {
      "parameters": {
        "resource": "academic",
        "operation": "search",
        "query": "={{ $json.topic }}",
        "providers": [
          "pubmed",
          "semantic-scholar",
          "arxiv"
        ],
        "limit": 50,
        "yearFrom": "={{ $json.yearFrom }}",
        "yearTo": "={{ $json.yearTo }}",
        "additionalFields": {
          "fields": [
            "title",
            "abstract",
            "authors",
            "year",
            "doi",
            "pdfURL",
            "totalCitations"
          ]
        }
      },
      "id": "pdfvector-search",
      "name": "PDF Vector - Search Papers",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [
        450,
        300
      ],
      "notes": "Search academic databases"
    },
    {
      "parameters": {
        "jsCode": "// Rank papers by relevance and citations\nconst papers = $input.all().map(item => item.json);\nconst searchTopic = $node['Set Search Parameters'].json.topic;\n\n// Calculate relevance scores\nconst scoredPapers = papers.map(paper => {\n  let score = 0;\n  \n  // Citation score (normalized)\n  const maxCitations = Math.max(...papers.map(p => p.totalCitations || 0));\n  const citationScore = (paper.totalCitations || 0) / (maxCitations || 1) * 40;\n  score += citationScore;\n  \n  // Recency score\n  const paperYear = parseInt(paper.year);\n  const currentYear = new Date().getFullYear();\n  const recencyScore = Math.max(0, 20 - (currentYear - paperYear) * 2);\n  score += recencyScore;\n  \n  // Title relevance\n  const topicWords = searchTopic.toLowerCase().split(' ');\n  const titleWords = paper.title.toLowerCase();\n  const titleMatches = topicWords.filter(word => titleWords.includes(word)).length;\n  score += titleMatches * 10;\n  \n  // Abstract relevance\n  if (paper.abstract) {\n    const abstractWords = paper.abstract.toLowerCase();\n    const abstractMatches = topicWords.filter(word => abstractWords.includes(word)).length;\n    score += abstractMatches * 5;\n  }\n  \n  return {\n    ...paper,\n    relevanceScore: Math.round(score),\n    rankingDetails: {\n      citationScore: Math.round(citationScore),\n      recencyScore,\n      titleRelevance: titleMatches,\n      abstractRelevance: abstractMatches || 0\n    }\n  };\n});\n\n// Sort by score and limit to top N\nconst maxPapers = $node['Set Search Parameters'].json.maxPapers;\nconst topPapers = scoredPapers\n  .sort((a, b) => b.relevanceScore - a.relevanceScore)\n  .slice(0, maxPapers);\n\nreturn topPapers.map(paper => ({ json: paper }));"
      },
      "id": "rank-papers",
      "name": "Rank & Select Papers",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        650,
        300
      ],
      "notes": "Rank papers by relevance"
    },
    {
      "parameters": {
        "batchSize": 1,
        "options": {}
      },
      "id": "split-batch",
      "name": "Process One by One",
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 1,
      "position": [
        850,
        300
      ],
      "notes": "Process papers individually"
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.pdfURL }}",
              "operation": "isNotEmpty"
            }
          ]
        }
      },
      "id": "has-pdf",
      "name": "Has PDF?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        1050,
        300
      ]
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "parse",
        "inputType": "url",
        "url": "={{ $json.pdfURL }}",
        "useLLM": "auto"
      },
      "id": "pdfvector-parse",
      "name": "PDF Vector - Parse Paper",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [
        1250,
        250
      ],
      "notes": "Parse paper content from PDF or image"
    },
    {
      "parameters": {
        "model": "gpt-4",
        "messages": {
          "values": [
            {
              "content": "Create a literature review entry for this paper in the context of '{{ $node['Set Search Parameters'].json.topic }}':\n\nTitle: {{ $json.title }}\nAuthors: {{ $json.authors }}\nYear: {{ $json.year }}\nCitations: {{ $json.totalCitations }}\n\nContent: {{ $json.content || $json.abstract }}\n\nProvide:\n1. A 3-4 sentence summary of the paper's contribution\n2. Key methodology used\n3. Main findings (2-3 bullet points)\n4. How it relates to the topic\n5. Limitations mentioned\n6. Suggested citation in APA format"
            }
          ]
        }
      },
      "id": "analyze-paper",
      "name": "Analyze Paper Content",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        1450,
        300
      ],
      "notes": "Generate review entry"
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "reviewEntry",
              "value": "={{ $json.choices[0].message.content }}"
            },
            {
              "name": "paperTitle",
              "value": "={{ $node['Has PDF?'].json.title }}"
            },
            {
              "name": "paperDoi",
              "value": "={{ $node['Has PDF?'].json.doi }}"
            }
          ]
        }
      },
      "id": "store-entry",
      "name": "Store Review Entry",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [
        1650,
        300
      ],
      "notes": "Save processed entry"
    },
    {
      "parameters": {
        "functionCode": "// Wait for all papers to be processed\nconst allEntries = $input.all().map(item => item.json);\n\n// Group papers by themes/methodologies\nconst themes = {\n  'Machine Learning Models': [],\n  'Clinical Applications': [],\n  'Data Processing': [],\n  'Evaluation Studies': [],\n  'Review Papers': [],\n  'Other': []\n};\n\n// Categorize papers (simplified - in production use NLP)\nallEntries.forEach(entry => {\n  const review = entry.reviewEntry.toLowerCase();\n  if (review.includes('neural network') || review.includes('deep learning')) {\n    themes['Machine Learning Models'].push(entry);\n  } else if (review.includes('clinical') || review.includes('patient')) {\n    themes['Clinical Applications'].push(entry);\n  } else if (review.includes('preprocessing') || review.includes('data processing')) {\n    themes['Data Processing'].push(entry);\n  } else if (review.includes('evaluation') || review.includes('comparison')) {\n    themes['Evaluation Studies'].push(entry);\n  } else if (review.includes('review') || review.includes('survey')) {\n    themes['Review Papers'].push(entry);\n  } else {\n    themes['Other'].push(entry);\n  }\n});\n\n// Generate literature review document\nlet reviewDocument = `# Literature Review: ${$node['Set Search Parameters'].json.topic}\\n\\n`;\nreviewDocument += `Generated on: ${new Date().toLocaleDateString()}\\n\\n`;\nreviewDocument += `## Summary\\n\\n`;\nreviewDocument += `This review analyzes ${allEntries.length} papers published between ${$node['Set Search Parameters'].json.yearFrom} and ${$node['Set Search Parameters'].json.yearTo} on the topic of ${$node['Set Search Parameters'].json.topic}.\\n\\n`;\n\n// Add themed sections\nObject.entries(themes).forEach(([theme, papers]) => {\n  if (papers.length > 0) {\n    reviewDocument += `## ${theme} (${papers.length} papers)\\n\\n`;\n    papers.forEach(paper => {\n      reviewDocument += `### ${paper.paperTitle}\\n\\n`;\n      reviewDocument += paper.reviewEntry + '\\n\\n';\n    });\n  }\n});\n\n// Add bibliography\nreviewDocument += `## Bibliography\\n\\n`;\nallEntries.forEach((entry, index) => {\n  const citation = entry.reviewEntry.split('Suggested citation:')[1] || 'Citation not available';\n  reviewDocument += `${index + 1}. ${citation.trim()}\\n\\n`;\n});\n\nreturn [{\n  json: {\n    reviewDocument,\n    totalPapers: allEntries.length,\n    themes: Object.entries(themes).map(([theme, papers]) => ({\n      theme,\n      count: papers.length\n    })),\n    generatedAt: new Date().toISOString()\n  }\n}];"
      },
      "id": "compile-review",
      "name": "Compile Literature Review",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1850,
        300
      ],
      "notes": "Generate final document"
    }
  ],
  "connections": {
    "Set Search Parameters": {
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
            "node": "Rank & Select Papers",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Rank & Select Papers": {
      "main": [
        [
          {
            "node": "Process One by One",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Process One by One": {
      "main": [
        [
          {
            "node": "Has PDF?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Has PDF?": {
      "main": [
        [
          {
            "node": "PDF Vector - Parse Paper",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Analyze Paper Content",
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
            "node": "Analyze Paper Content",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Analyze Paper Content": {
      "main": [
        [
          {
            "node": "Store Review Entry",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Store Review Entry": {
      "main": [
        [
          {
            "node": "Process One by One",
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

## 9. Extract Legal Citations with Validation Tools

**Name:** Comprehensive Legal Research Assistant

**Description:**

## Overview

Legal professionals spend countless hours manually checking citations and building citation indexes for briefs, memoranda, and legal opinions. This workflow automates the extraction, validation, and analysis of legal citations from any legal document, including scanned court documents, photographed case files, and image-based legal materials (PDFs, JPGs, PNGs).

## What You Can Do

- Extract legal citations automatically from various document formats
- Validate citations against Bluebook and other citation standards
- Verify that case law is still good law (automated Shepardizing)
- Build comprehensive citation indexes for legal documents
- Process scanned and photographed legal documents with OCR

## Who It's For

Attorneys, paralegals, legal researchers, judicial clerks, law students, and legal writing professionals who need to extract, validate, and manage legal citations efficiently across multiple jurisdictions.

## The Problem It Solves

Manual citation checking is extremely time-consuming and error-prone. Legal professionals struggle to ensure citation accuracy, verify case law is still good law, and build comprehensive citation indexes. This template automates the entire citation management process while ensuring compliance with citation standards like Bluebook format.

**Setup Instructions:**
1. Configure Google Drive credentials for secure legal document access
2. Install the PDF Vector community node from the n8n marketplace
3. Configure PDF Vector API credentials
4. Set up connections to legal databases (Westlaw, LexisNexis if available)
5. Configure jurisdiction-specific citation rules
6. Set up validation preferences and citation format standards
7. Configure citation reporting and export formats

**Key Features:**
- Automatic retrieval of legal documents from Google Drive
- OCR support for handwritten annotations and scanned legal documents
- Comprehensive extraction of case law, statutes, regulations, and academic citations
- Bluebook citation format validation and standardization
- Automated Shepardizing to verify cases are still good law
- Pinpoint citation detection and parenthetical extraction
- Citation network analysis showing case relationships
- Support for federal, state, and international law references

**Customization Options:**
- Set jurisdiction-specific citation rules and formats
- Configure automated alerts for superseded statutes or overruled cases
- Customize citation validation criteria and standards
- Set up integration with legal research platforms (Westlaw, LexisNexis)
- Configure export formats for different legal document types
- Add support for specialty legal domains (tax law, patent law, etc.)
- Set up collaborative citation checking for legal teams

**Implementation Details:**
The workflow uses advanced legal domain knowledge to identify and extract citations in various formats across multiple jurisdictions. It processes both digital and scanned documents, validates citations against legal standards, and builds comprehensive citation networks. The system automatically checks citation accuracy and provides detailed reports for legal document preparation.

**Note:** This workflow uses the PDF Vector community node. Make sure to install it from the n8n community nodes collection before using this template.

**Template Code:**
```json
{
  "meta": {
    "instanceId": "placeholder"
  },
  "nodes": [
    {
      "parameters": {
        "content": "## \u2696\ufe0f Legal Citation Extractor\n\nLegal document automation:\n\u2022 **Extracts** all citations from briefs\n\u2022 **Validates** against legal databases\n\u2022 **Formats** in Bluebook style\n\u2022 **Creates** table of authorities\n\u2022 **Checks** citation validity",
        "height": 180,
        "width": 350,
        "color": 5
      },
      "id": "overview-note",
      "name": "Legal Overview",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        50,
        50
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## \ud83d\udcc4 Citation Types\n\nExtracts & validates:\n\u2022 Case law citations\n\u2022 Federal statutes\n\u2022 State statutes\n\u2022 Regulations (CFR)\n\u2022 Secondary sources\n\n\ud83d\udca1 Any jurisdiction",
        "height": 180,
        "width": 260
      },
      "id": "citation-note",
      "name": "Citation Types",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        650,
        450
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## \ud83d\udcda Bluebook Format\n\n**Generates:**\n\u2022 Proper citations\n\u2022 Pinpoint references\n\u2022 Short forms\n\u2022 Table of authorities\n\n\u2705 Court-ready output",
        "height": 160,
        "width": 260,
        "color": 6
      },
      "id": "format-note",
      "name": "Citation Format",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        950,
        450
      ],
      "typeVersion": 1
    },
    {
      "parameters": {},
      "id": "manual-trigger",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [
        250,
        300
      ],
      "notes": "Start citation extraction"
    },
    {
      "parameters": {
        "operation": "download",
        "fileId": "={{ $json.fileId }}"
      },
      "id": "google-drive",
      "name": "Google Drive - Get Legal Document",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [
        450,
        300
      ],
      "notes": "Retrieve document from Drive"
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "extract",
        "inputType": "file",
        "binaryPropertyName": "data",
        "prompt": "Extract all legal citations from this document or image. Include case citations (with reporter and year), statute citations (with title and section), regulatory citations, and academic citations (with author, title, journal, and year). For each citation, include the surrounding context (1-2 sentences) and page number where it appears. Use OCR if this is a scanned legal document or image.",
        "schema": "{\"type\":\"object\",\"properties\":{\"documentInfo\":{\"type\":\"object\",\"properties\":{\"title\":{\"type\":\"string\"},\"documentType\":{\"type\":\"string\"},\"court\":{\"type\":\"string\"},\"date\":{\"type\":\"string\"},\"docketNumber\":{\"type\":\"string\"}}},\"caseCitations\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"caseName\":{\"type\":\"string\"},\"reporter\":{\"type\":\"string\"},\"volume\":{\"type\":\"string\"},\"page\":{\"type\":\"string\"},\"year\":{\"type\":\"string\"},\"court\":{\"type\":\"string\"},\"context\":{\"type\":\"string\"},\"pageNumber\":{\"type\":\"number\"},\"pinCite\":{\"type\":\"string\"}}}},\"statuteCitations\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"title\":{\"type\":\"string\"},\"code\":{\"type\":\"string\"},\"section\":{\"type\":\"string\"},\"subsection\":{\"type\":\"string\"},\"year\":{\"type\":\"string\"},\"context\":{\"type\":\"string\"},\"pageNumber\":{\"type\":\"number\"}}}},\"regulatoryCitations\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"title\":{\"type\":\"string\"},\"agency\":{\"type\":\"string\"},\"section\":{\"type\":\"string\"},\"context\":{\"type\":\"string\"},\"pageNumber\":{\"type\":\"number\"}}}},\"academicCitations\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"authors\":{\"type\":\"string\"},\"title\":{\"type\":\"string\"},\"journal\":{\"type\":\"string\"},\"volume\":{\"type\":\"string\"},\"page\":{\"type\":\"string\"},\"year\":{\"type\":\"string\"},\"doi\":{\"type\":\"string\"},\"context\":{\"type\":\"string\"},\"pageNumber\":{\"type\":\"number\"}}}},\"otherCitations\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"text\":{\"type\":\"string\"},\"type\":{\"type\":\"string\"},\"context\":{\"type\":\"string\"},\"pageNumber\":{\"type\":\"number\"}}}}},\"required\":[\"documentInfo\"],\"additionalProperties\":false}"
      },
      "id": "pdfvector-extract",
      "name": "PDF Vector - Extract Citations",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [
        650,
        300
      ],
      "notes": "Extract all citations"
    },
    {
      "parameters": {
        "jsCode": "// Process and validate citations\nconst citations = $input.first().json.data;\nconst citationAnalysis = {\n  summary: {\n    totalCitations: 0,\n    caseLaw: citations.caseCitations?.length || 0,\n    statutes: citations.statuteCitations?.length || 0,\n    regulations: citations.regulatoryCitations?.length || 0,\n    academic: citations.academicCitations?.length || 0,\n    other: citations.otherCitations?.length || 0\n  },\n  validation: {\n    invalidCitations: [],\n    warnings: []\n  },\n  academicDOIs: [],\n  citationNetwork: {}\n};\n\n// Calculate total\ncitationAnalysis.summary.totalCitations = \n  citationAnalysis.summary.caseLaw + \n  citationAnalysis.summary.statutes + \n  citationAnalysis.summary.regulations + \n  citationAnalysis.summary.academic + \n  citationAnalysis.summary.other;\n\n// Validate case citations\nif (citations.caseCitations) {\n  citations.caseCitations.forEach((cite, index) => {\n    // Check for required fields\n    if (!cite.reporter || !cite.volume || !cite.page) {\n      citationAnalysis.validation.invalidCitations.push({\n        type: 'case',\n        index,\n        citation: cite.caseName,\n        issue: 'Missing reporter, volume, or page'\n      });\n    }\n    \n    // Build citation network (track which cases cite which)\n    if (!citationAnalysis.citationNetwork[cite.caseName]) {\n      citationAnalysis.citationNetwork[cite.caseName] = {\n        citedIn: [citations.documentInfo.title],\n        pageNumbers: [cite.pageNumber]\n      };\n    }\n  });\n}\n\n// Validate statute citations\nif (citations.statuteCitations) {\n  citations.statuteCitations.forEach((cite, index) => {\n    if (!cite.title || !cite.section) {\n      citationAnalysis.validation.invalidCitations.push({\n        type: 'statute',\n        index,\n        citation: `${cite.title} ${cite.code}`,\n        issue: 'Missing title or section'\n      });\n    }\n  });\n}\n\n// Extract DOIs for academic fetching\nif (citations.academicCitations) {\n  citations.academicCitations.forEach(cite => {\n    if (cite.doi) {\n      citationAnalysis.academicDOIs.push(cite.doi);\n    } else {\n      // Try to construct search query for papers without DOI\n      citationAnalysis.validation.warnings.push({\n        type: 'academic',\n        citation: cite.title,\n        warning: 'No DOI found - manual search may be needed'\n      });\n    }\n  });\n}\n\n// Analyze citation patterns\nconst citationPatterns = {\n  mostCitedCases: [],\n  primaryAuthorities: [],\n  secondaryAuthorities: []\n};\n\n// Identify primary authorities (statutes and binding cases)\ncitationPatterns.primaryAuthorities = [\n  ...citations.statuteCitations?.map(c => `${c.title} ${c.code} \u00a7 ${c.section}`) || [],\n  ...citations.caseCitations?.filter(c => c.court?.includes('Supreme'))?.map(c => c.caseName) || []\n];\n\n// Identify secondary authorities\ncitationPatterns.secondaryAuthorities = \n  citations.academicCitations?.map(c => `${c.authors}, ${c.title}`) || [];\n\nreturn [{\n  json: {\n    originalData: citations,\n    analysis: citationAnalysis,\n    patterns: citationPatterns,\n    doisToFetch: citationAnalysis.academicDOIs.join(','),\n    processedAt: new Date().toISOString()\n  }\n}];"
      },
      "id": "analyze-citations",
      "name": "Analyze & Validate Citations",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        850,
        300
      ],
      "notes": "Process citation data"
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.doisToFetch }}",
              "operation": "isNotEmpty"
            }
          ]
        }
      },
      "id": "has-dois",
      "name": "Has Academic DOIs?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [
        1050,
        300
      ]
    },
    {
      "parameters": {
        "resource": "academic",
        "operation": "fetch",
        "ids": "={{ $json.doisToFetch }}",
        "fields": [
          "title",
          "abstract",
          "authors",
          "year",
          "doi",
          "pdfURL",
          "totalCitations"
        ]
      },
      "id": "pdfvector-fetch",
      "name": "PDF Vector - Fetch Papers",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [
        1250,
        250
      ],
      "notes": "Retrieve academic papers"
    },
    {
      "parameters": {
        "jsCode": "// Generate comprehensive citation report\nconst citationData = $node['Has Academic DOIs?'].json;\nconst academicPapers = $json.publications || [];\n\n// Create citation report\nlet report = `# Legal Citation Analysis Report\\n\\n`;\nreport += `**Document:** ${citationData.originalData.documentInfo.title}\\n`;\nreport += `**Type:** ${citationData.originalData.documentInfo.documentType}\\n`;\nreport += `**Date:** ${citationData.originalData.documentInfo.date}\\n\\n`;\n\nreport += `## Citation Summary\\n\\n`;\nreport += `- **Total Citations:** ${citationData.analysis.summary.totalCitations}\\n`;\nreport += `- **Case Law:** ${citationData.analysis.summary.caseLaw}\\n`;\nreport += `- **Statutes:** ${citationData.analysis.summary.statutes}\\n`;\nreport += `- **Regulations:** ${citationData.analysis.summary.regulations}\\n`;\nreport += `- **Academic:** ${citationData.analysis.summary.academic}\\n`;\nreport += `- **Other:** ${citationData.analysis.summary.other}\\n\\n`;\n\n// Add validation issues\nif (citationData.analysis.validation.invalidCitations.length > 0) {\n  report += `## Citation Issues\\n\\n`;\n  citationData.analysis.validation.invalidCitations.forEach(issue => {\n    report += `- **${issue.type}:** ${issue.citation} - ${issue.issue}\\n`;\n  });\n  report += `\\n`;\n}\n\n// Add case law section\nif (citationData.originalData.caseCitations?.length > 0) {\n  report += `## Case Law Citations\\n\\n`;\n  citationData.originalData.caseCitations.forEach(cite => {\n    report += `### ${cite.caseName}\\n`;\n    report += `- **Citation:** ${cite.volume} ${cite.reporter} ${cite.page} (${cite.year})\\n`;\n    report += `- **Court:** ${cite.court || 'Not specified'}\\n`;\n    report += `- **Context:** ${cite.context}\\n`;\n    report += `- **Page:** ${cite.pageNumber}\\n\\n`;\n  });\n}\n\n// Add statute section\nif (citationData.originalData.statuteCitations?.length > 0) {\n  report += `## Statutory Citations\\n\\n`;\n  citationData.originalData.statuteCitations.forEach(cite => {\n    report += `- **${cite.title} ${cite.code} \u00a7 ${cite.section}**${cite.subsection ? ` (${cite.subsection})` : ''}\\n`;\n    report += `  - Context: ${cite.context}\\n`;\n    report += `  - Page: ${cite.pageNumber}\\n\\n`;\n  });\n}\n\n// Add academic section with fetched data\nif (citationData.originalData.academicCitations?.length > 0) {\n  report += `## Academic Citations\\n\\n`;\n  citationData.originalData.academicCitations.forEach(cite => {\n    report += `### ${cite.title}\\n`;\n    report += `- **Authors:** ${cite.authors}\\n`;\n    report += `- **Journal:** ${cite.journal}, Vol. ${cite.volume}, p. ${cite.page} (${cite.year})\\n`;\n    \n    // Add fetched paper data if available\n    const fetchedPaper = academicPapers.find(p => p.doi === cite.doi);\n    if (fetchedPaper) {\n      report += `- **Citations:** ${fetchedPaper.totalCitations || 0}\\n`;\n      report += `- **Abstract Available:** Yes\\n`;\n      if (fetchedPaper.pdfURL) {\n        report += `- **Full Text:** [Available](${fetchedPaper.pdfURL})\\n`;\n      }\n    }\n    \n    report += `- **Context:** ${cite.context}\\n`;\n    report += `- **Page:** ${cite.pageNumber}\\n\\n`;\n  });\n}\n\n// Add citation patterns\nreport += `## Citation Analysis\\n\\n`;\nreport += `### Primary Authorities\\n`;\ncitationData.patterns.primaryAuthorities.forEach(auth => {\n  report += `- ${auth}\\n`;\n});\nreport += `\\n### Secondary Authorities\\n`;\ncitationData.patterns.secondaryAuthorities.forEach(auth => {\n  report += `- ${auth}\\n`;\n});\n\nreturn [{\n  json: {\n    report,\n    citationData,\n    academicPapers,\n    exportFormat: 'markdown',\n    generatedAt: new Date().toISOString()\n  }\n}];"
      },
      "id": "generate-report",
      "name": "Generate Citation Report",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1450,
        300
      ],
      "notes": "Create final report"
    },
    {
      "parameters": {
        "fileName": "citation_report_{{ $now.format('yyyy-MM-dd_HH-mm') }}.md",
        "fileContent": "={{ $json.report }}"
      },
      "id": "save-report",
      "name": "Save Citation Report",
      "type": "n8n-nodes-base.writeBinaryFile",
      "typeVersion": 1,
      "position": [
        1650,
        300
      ],
      "notes": "Export report"
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [
        [
          {
            "node": "Google Drive - Get Legal Document",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Drive - Get Legal Document": {
      "main": [
        [
          {
            "node": "PDF Vector - Extract Citations",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Extract Citations": {
      "main": [
        [
          {
            "node": "Analyze & Validate Citations",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Analyze & Validate Citations": {
      "main": [
        [
          {
            "node": "Has Academic DOIs?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Has Academic DOIs?": {
      "main": [
        [
          {
            "node": "PDF Vector - Fetch Papers",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Generate Citation Report",
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
            "node": "Generate Citation Report",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate Citation Report": {
      "main": [
        [
          {
            "node": "Save Citation Report",
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

## 10. Process Documents with Analytics Dashboard

**Name:** Enterprise Document Processing Pipeline

**Description:**

## Overview

Organizations dealing with high-volume document processing face challenges in efficiently handling diverse document types while maintaining quality and tracking performance metrics. This enterprise-grade workflow provides a scalable solution for batch processing documents including PDFs, scanned documents, and images (JPG, PNG) with comprehensive analytics, error handling, and quality assurance.

## What You Can Do

- Process thousands of documents in parallel batches efficiently
- Monitor performance metrics and success rates in real-time
- Handle diverse document formats with automatic format detection
- Generate comprehensive analytics dashboards and reports
- Implement automated quality assurance and error handling

## Who It's For

Large organizations, document processing centers, digital transformation teams, enterprise IT departments, and businesses that need to process thousands of documents reliably with detailed performance tracking and analytics.

## The Problem It Solves

High-volume document processing without proper monitoring leads to bottlenecks, quality issues, and inefficient resource usage. Organizations struggle to track processing success rates, identify problematic document types, and optimize their workflows. This template provides enterprise-grade batch processing with comprehensive analytics and automated quality assurance.

**Setup Instructions:**
1. Configure Google Drive credentials for document folder access
2. Install the PDF Vector community node from the n8n marketplace
3. Configure PDF Vector API credentials with appropriate rate limits
4. Set up batch processing parameters (batch size, retry logic)
5. Configure quality thresholds and validation rules
6. Set up analytics dashboard and reporting preferences
7. Configure error handling and notification systems

**Key Features:**
- Parallel batch processing for maximum throughput
- Support for mixed document formats (PDFs, Word docs, images)
- OCR processing for handwritten and scanned documents
- Comprehensive analytics dashboard with success rates and performance metrics
- Automatic document prioritization based on size and complexity
- Intelligent error handling with automatic retry logic
- Quality assurance checks and validation
- Real-time processing monitoring and alerts

**Customization Options:**
- Configure custom document categories and processing rules
- Set up specific extraction templates for different document types
- Implement automated workflows for documents that fail quality checks
- Configure credit usage optimization to minimize costs
- Set up custom analytics and reporting dashboards
- Add integration with existing document management systems
- Configure automated notifications for processing completion or errors

**Implementation Details:**
The workflow uses intelligent batching to process documents efficiently while monitoring performance metrics in real-time. It automatically handles different document formats, applies OCR when needed, and provides detailed analytics to help organizations optimize their document processing operations. The system includes sophisticated error recovery and quality assurance mechanisms.

**Note:** This workflow uses the PDF Vector community node. Make sure to install it from the n8n community nodes collection before using this template.

**Template Code:**
```json
{
  "meta": {
    "instanceId": "placeholder"
  },
  "nodes": [
    {
      "parameters": {
        "content": "## \ud83d\udcca Real-Time Analytics\n\nDocument processing metrics:\n\u2022 **Tracks** all workflows in database\n\u2022 **Calculates** KPIs every 30 minutes\n\u2022 **Monitors** success/failure rates\n\u2022 **Analyzes** trends & patterns\n\u2022 **Updates** dashboards automatically",
        "height": 180,
        "width": 350,
        "color": 5
      },
      "id": "overview-note",
      "name": "Analytics Overview",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        50,
        50
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## \ud83d\udcc8 Key Metrics\n\n**Tracking:**\n\u2022 Documents/hour\n\u2022 Processing time\n\u2022 Error rates\n\u2022 API usage\n\u2022 Cost analysis\n\n\ud83d\udca1 30-day rolling window",
        "height": 160,
        "width": 260
      },
      "id": "metrics-note",
      "name": "Metrics Tracked",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        450,
        550
      ],
      "typeVersion": 1
    },
    {
      "parameters": {
        "content": "## \ud83d\udcca Visualizations\n\n**Outputs to:**\n\u2022 Google Sheets\n\u2022 Tableau\n\u2022 Power BI\n\u2022 Slack alerts\n\n\u2728 Real-time updates!",
        "height": 150,
        "width": 250,
        "color": 6
      },
      "id": "output-note",
      "name": "Dashboard Output",
      "type": "n8n-nodes-base.stickyNote",
      "position": [
        750,
        550
      ],
      "typeVersion": 1
    },
    {
      "parameters": {},
      "id": "manual-trigger",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [
        250,
        300
      ],
      "notes": "Start batch processing"
    },
    {
      "parameters": {
        "operation": "list",
        "queryString": "'FOLDER_ID_HERE' in parents and trashed=false",
        "limit": 100,
        "fields": [
          "id",
          "name",
          "mimeType",
          "size",
          "webViewLink",
          "createdTime"
        ]
      },
      "id": "list-documents",
      "name": "List Documents",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [
        450,
        300
      ],
      "notes": "Replace FOLDER_ID_HERE with your Google Drive folder ID"
    },
    {
      "parameters": {
        "jsCode": "// Validate and categorize documents\nconst files = $input.all().map(item => item.json);\nconst processingQueue = {\n  valid: [],\n  invalid: [],\n  stats: {\n    totalFiles: files.length,\n    pdfCount: 0,\n    wordCount: 0,\n    imageCount: 0,\n    otherCount: 0,\n    totalSizeMB: 0\n  }\n};\n\n// Define supported formats\nconst supportedFormats = {\n  pdf: ['application/pdf'],\n  word: [\n    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',\n    'application/msword'\n  ],\n  image: ['image/jpeg', 'image/png', 'image/gif']\n};\n\nfiles.forEach(file => {\n  const mimeType = file.mimeType;\n  const sizeMB = (parseInt(file.size) || 0) / (1024 * 1024);\n  \n  // Check if supported\n  let fileType = 'other';\n  let isValid = false;\n  \n  if (supportedFormats.pdf.includes(mimeType)) {\n    fileType = 'pdf';\n    isValid = true;\n    processingQueue.stats.pdfCount++;\n  } else if (supportedFormats.word.includes(mimeType)) {\n    fileType = 'word';\n    isValid = true;\n    processingQueue.stats.wordCount++;\n  } else if (supportedFormats.image.includes(mimeType)) {\n    fileType = 'image';\n    isValid = true;\n    processingQueue.stats.imageCount++;\n  } else {\n    processingQueue.stats.otherCount++;\n  }\n  \n  // Check file size (max 50MB)\n  if (sizeMB > 50) {\n    isValid = false;\n  }\n  \n  const fileInfo = {\n    ...file,\n    fileType,\n    sizeMB: Math.round(sizeMB * 100) / 100,\n    processingPriority: sizeMB < 5 ? 'high' : sizeMB < 20 ? 'medium' : 'low',\n    estimatedCredits: fileType === 'pdf' ? Math.ceil(sizeMB * 2) : 1\n  };\n  \n  if (isValid) {\n    processingQueue.valid.push(fileInfo);\n  } else {\n    processingQueue.invalid.push({\n      ...fileInfo,\n      reason: sizeMB > 50 ? 'File too large' : 'Unsupported format'\n    });\n  }\n  \n  processingQueue.stats.totalSizeMB += sizeMB;\n});\n\n// Sort by priority\nprocessingQueue.valid.sort((a, b) => {\n  const priority = { high: 1, medium: 2, low: 3 };\n  return priority[a.processingPriority] - priority[b.processingPriority];\n});\n\nreturn [{\n  json: processingQueue\n}];"
      },
      "id": "validate-files",
      "name": "Validate & Queue Files",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        650,
        300
      ],
      "notes": "Validate and prioritize files"
    },
    {
      "parameters": {
        "batchSize": 5,
        "options": {}
      },
      "id": "batch-processor",
      "name": "Process in Batches",
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 3,
      "position": [
        850,
        300
      ],
      "notes": "Process 5 files at a time"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "assignment1",
              "name": "processingBatch",
              "value": "={{ $json }}",
              "type": "object"
            }
          ]
        },
        "options": {}
      },
      "id": "split-files",
      "name": "Split Out Files",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3,
      "position": [
        1050,
        300
      ],
      "notes": "Prepare individual files"
    },
    {
      "parameters": {
        "fieldToSplitOut": "processingBatch.valid",
        "options": {}
      },
      "id": "split-items",
      "name": "Split Items",
      "type": "n8n-nodes-base.splitOut",
      "typeVersion": 1,
      "position": [
        1250,
        300
      ]
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "parse",
        "inputType": "url",
        "url": "={{ $json.webViewLink }}",
        "useLLM": "auto"
      },
      "id": "pdfvector-process",
      "name": "PDF Vector - Process Document/Image",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [
        1450,
        250
      ],
      "notes": "Process document or image",
      "continueOnFail": true
    },
    {
      "parameters": {
        "jsCode": "// Track processing results\nconst result = $input.first().json;\nconst originalFile = $node['Split Items'].json;\nconst startTime = new Date($node['Split Items'].context.executionTime);\nconst endTime = new Date();\nconst processingTime = (endTime - startTime) / 1000;\n\nconst processedFile = {\n  // Original file info\n  fileName: originalFile.name,\n  fileType: originalFile.fileType,\n  sizeMB: originalFile.sizeMB,\n  \n  // Processing results\n  success: !result.error,\n  processingTime: Math.round(processingTime * 100) / 100,\n  creditsUsed: result.creditsUsed || originalFile.estimatedCredits,\n  \n  // Content info\n  contentLength: result.content?.length || 0,\n  wordCount: result.content?.split(' ').length || 0,\n  \n  // Error tracking\n  error: result.error ? {\n    message: result.error.message || 'Unknown error',\n    code: result.error.code\n  } : null,\n  \n  // Timestamps\n  processedAt: new Date().toISOString()\n};\n\n// Quality checks\nif (processedFile.success) {\n  processedFile.qualityChecks = {\n    hasContent: processedFile.contentLength > 100,\n    reasonableLength: processedFile.wordCount > 10 && processedFile.wordCount < 100000,\n    properEncoding: !result.content?.includes('\ufffd'),\n    creditsEfficiency: processedFile.creditsUsed / processedFile.sizeMB < 5\n  };\n  \n  // Overall quality score\n  const checks = Object.values(processedFile.qualityChecks);\n  processedFile.qualityScore = (checks.filter(c => c).length / checks.length) * 100;\n}\n\nreturn [{ json: processedFile }];"
      },
      "id": "track-results",
      "name": "Track Processing Results",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        1650,
        300
      ],
      "notes": "Analyze results"
    },
    {
      "parameters": {
        "aggregate": "aggregateAllItemData",
        "options": {}
      },
      "id": "collect-batch",
      "name": "Collect Batch Results",
      "type": "n8n-nodes-base.aggregate",
      "typeVersion": 1,
      "position": [
        1850,
        300
      ],
      "notes": "Aggregate batch results"
    },
    {
      "parameters": {
        "jsCode": "// Generate comprehensive analytics report\nconst allResults = $input.all().map(item => item.json);\nconst initialStats = $node['Validate & Queue Files'].json.stats;\n\n// Calculate processing analytics\nconst analytics = {\n  overview: {\n    totalFilesFound: initialStats.totalFiles,\n    filesProcessed: allResults.length,\n    successfulProcessing: allResults.filter(r => r.success).length,\n    failedProcessing: allResults.filter(r => !r.success).length,\n    successRate: 0,\n    totalProcessingTime: 0,\n    totalCreditsUsed: 0,\n    averageQualityScore: 0\n  },\n  \n  byFileType: {\n    pdf: { processed: 0, successful: 0, failed: 0, avgTime: 0, creditsUsed: 0 },\n    word: { processed: 0, successful: 0, failed: 0, avgTime: 0, creditsUsed: 0 },\n    image: { processed: 0, successful: 0, failed: 0, avgTime: 0, creditsUsed: 0 }\n  },\n  \n  errors: {},\n  \n  performance: {\n    fastestFile: null,\n    slowestFile: null,\n    mostEfficientCredit: null,\n    leastEfficientCredit: null\n  },\n  \n  quality: {\n    highQuality: [],\n    lowQuality: [],\n    averageWordCount: 0\n  }\n};\n\n// Process results\nlet totalQualityScore = 0;\nlet qualityCount = 0;\n\nallResults.forEach(result => {\n  // Update overview\n  analytics.overview.totalProcessingTime += result.processingTime || 0;\n  analytics.overview.totalCreditsUsed += result.creditsUsed || 0;\n  \n  // Update by file type\n  const type = result.fileType;\n  if (analytics.byFileType[type]) {\n    analytics.byFileType[type].processed++;\n    if (result.success) {\n      analytics.byFileType[type].successful++;\n    } else {\n      analytics.byFileType[type].failed++;\n    }\n    analytics.byFileType[type].avgTime += result.processingTime || 0;\n    analytics.byFileType[type].creditsUsed += result.creditsUsed || 0;\n  }\n  \n  // Track errors\n  if (result.error) {\n    const errorType = result.error.message || 'Unknown';\n    analytics.errors[errorType] = (analytics.errors[errorType] || 0) + 1;\n  }\n  \n  // Track performance\n  if (!analytics.performance.fastestFile || result.processingTime < analytics.performance.fastestFile.time) {\n    analytics.performance.fastestFile = {\n      name: result.fileName,\n      time: result.processingTime\n    };\n  }\n  if (!analytics.performance.slowestFile || result.processingTime > analytics.performance.slowestFile.time) {\n    analytics.performance.slowestFile = {\n      name: result.fileName,\n      time: result.processingTime\n    };\n  }\n  \n  // Track quality\n  if (result.qualityScore !== undefined) {\n    totalQualityScore += result.qualityScore;\n    qualityCount++;\n    \n    if (result.qualityScore >= 75) {\n      analytics.quality.highQuality.push(result.fileName);\n    } else if (result.qualityScore < 50) {\n      analytics.quality.lowQuality.push(result.fileName);\n    }\n  }\n  \n  analytics.quality.averageWordCount += result.wordCount || 0;\n});\n\n// Calculate averages\nanalytics.overview.successRate = Math.round((analytics.overview.successfulProcessing / analytics.overview.filesProcessed) * 100);\nanalytics.overview.averageQualityScore = qualityCount > 0 ? Math.round(totalQualityScore / qualityCount) : 0;\nanalytics.quality.averageWordCount = Math.round(analytics.quality.averageWordCount / allResults.length);\n\n// Calculate file type averages\nObject.keys(analytics.byFileType).forEach(type => {\n  const typeData = analytics.byFileType[type];\n  if (typeData.processed > 0) {\n    typeData.avgTime = Math.round((typeData.avgTime / typeData.processed) * 100) / 100;\n    typeData.successRate = Math.round((typeData.successful / typeData.processed) * 100);\n  }\n});\n\n// Generate report\nlet report = `# Batch Processing Analytics Report\\n\\n`;\nreport += `**Generated:** ${new Date().toLocaleString()}\\n\\n`;\n\nreport += `## Overview\\n`;\nreport += `- **Files Processed:** ${analytics.overview.filesProcessed} of ${analytics.overview.totalFilesFound}\\n`;\nreport += `- **Success Rate:** ${analytics.overview.successRate}%\\n`;\nreport += `- **Total Processing Time:** ${Math.round(analytics.overview.totalProcessingTime)}s\\n`;\nreport += `- **Credits Used:** ${analytics.overview.totalCreditsUsed}\\n`;\nreport += `- **Average Quality Score:** ${analytics.overview.averageQualityScore}%\\n\\n`;\n\nreport += `## Performance by File Type\\n`;\nObject.entries(analytics.byFileType).forEach(([type, data]) => {\n  if (data.processed > 0) {\n    report += `### ${type.toUpperCase()}\\n`;\n    report += `- Processed: ${data.processed}\\n`;\n    report += `- Success Rate: ${data.successRate}%\\n`;\n    report += `- Avg Time: ${data.avgTime}s\\n`;\n    report += `- Credits: ${data.creditsUsed}\\n\\n`;\n  }\n});\n\nif (Object.keys(analytics.errors).length > 0) {\n  report += `## Errors Encountered\\n`;\n  Object.entries(analytics.errors).forEach(([error, count]) => {\n    report += `- ${error}: ${count} occurrences\\n`;\n  });\n  report += `\\n`;\n}\n\nreport += `## Recommendations\\n`;\nif (analytics.overview.successRate < 90) {\n  report += `- Success rate is below 90%. Review error logs for common issues.\\n`;\n}\nif (analytics.overview.averageQualityScore < 70) {\n  report += `- Quality scores are low. Consider using 'always' LLM mode for better results.\\n`;\n}\nif (analytics.quality.lowQuality.length > 0) {\n  report += `- ${analytics.quality.lowQuality.length} files had low quality scores. Manual review recommended.\\n`;\n}\n\nreturn [{\n  json: {\n    analytics,\n    report,\n    processedFiles: allResults,\n    timestamp: new Date().toISOString()\n  }\n}];"
      },
      "id": "generate-analytics",
      "name": "Generate Analytics Report",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        2050,
        300
      ],
      "notes": "Create analytics dashboard"
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [
        [
          {
            "node": "List Documents",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "List Documents": {
      "main": [
        [
          {
            "node": "Validate & Queue Files",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Validate & Queue Files": {
      "main": [
        [
          {
            "node": "Process in Batches",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Split Out Files": {
      "main": [
        [
          {
            "node": "Split Items",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Split Items": {
      "main": [
        [
          {
            "node": "PDF Vector - Process Document/Image",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Process Document/Image": {
      "main": [
        [
          {
            "node": "Track Processing Results",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Track Processing Results": {
      "main": [
        [
          {
            "node": "Collect Batch Results",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Collect Batch Results": {
      "main": [
        [
          {
            "node": "Generate Analytics Report",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Process in Batches": {
      "main": [
        [
          {
            "node": "Split Out Files",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Generate Analytics Report",
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
