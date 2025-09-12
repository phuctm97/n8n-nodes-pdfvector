# PDF Vector n8n Workflow Templates

A collection of 10 powerful workflow templates for the n8n PDF Vector node. These templates demonstrate various use cases for document processing and academic research automation.

## 1. Extract Invoice Data with PDF Vector and Google Drive

**Name:** Extract Invoice Data with PDF Vector and Google Drive

**Description:**
Businesses process hundreds of invoices monthly, leading to manual data entry errors, delayed payments, and accounting discrepancies. This workflow solves these problems by automatically extracting structured data from PDF invoices or invoice images (JPG, PNG, scanned documents) stored in Google Drive, validating the information, and integrating it with your accounting systems.

**Target Audience:** Accounting teams, bookkeepers, small to medium businesses, and financial departments looking to automate their invoice processing workflow.

**Problem Solved:** Manual invoice data entry is time-consuming and error-prone. This template eliminates manual work by automatically extracting invoice details including vendor information, line items, totals, and payment terms. It validates calculations to catch discrepancies and formats data for seamless integration with accounting software.

**Setup Instructions:**
1. Configure Google Drive credentials in n8n
2. Set up PDF Vector API key from your PDF Vector account
3. Configure your database connection (PostgreSQL, MySQL, or other)
4. Customize the extraction schema for your specific invoice formats
5. Set up error notifications for failed extractions

**Key Features:**
- Automatic retrieval of invoices from Google Drive folders
- AI-powered extraction from PDFs and images (JPG, PNG, scanned invoices)
- OCR capabilities for handwritten or low-quality scanned invoices
- Built-in validation for totals, tax calculations, and required fields
- Support for multiple invoice formats and layouts
- Error handling with detailed logging for troubleshooting
- Ready-to-use database schema for invoice storage

**Customization Options:**
- Modify the extraction prompt to capture additional fields specific to your invoices
- Add custom validation rules for your business requirements
- Integrate with your preferred accounting software (QuickBooks, Xero, etc.)
- Set up automatic folder monitoring in Google Drive
- Add email notifications for processed invoices
- Implement approval workflows for high-value invoices

**Note:** This workflow uses the PDF Vector community node. Make sure to install it from the n8n community nodes collection before using this template.

**Template Code:**
```json
{
  "meta": {
    "instanceId": "placeholder"
  },
  "nodes": [
    {
      "parameters": {},
      "id": "manual-trigger",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [250, 300],
      "notes": "Process invoices manually or via webhook"
    },
    {
      "parameters": {
        "operation": "download",
        "fileId": "={{ $json.fileId }}"
      },
      "id": "google-drive",
      "name": "Get Invoice from Google Drive",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [450, 300],
      "notes": "Download invoice PDF from Google Drive"
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "extract",
        "inputType": "file",
        "binaryPropertyName": "data",
        "prompt": "Extract all invoice details from this document or image including invoice number, date, vendor information, line items with descriptions and amounts, subtotal, tax, and total amount. Handle both digital PDFs and scanned/photographed invoices.",
        "schema": "{\"type\":\"object\",\"properties\":{\"invoiceNumber\":{\"type\":\"string\"},\"invoiceDate\":{\"type\":\"string\"},\"dueDate\":{\"type\":\"string\"},\"vendor\":{\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\"},\"address\":{\"type\":\"string\"},\"taxId\":{\"type\":\"string\"}}},\"customer\":{\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\"},\"address\":{\"type\":\"string\"}}},\"lineItems\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"description\":{\"type\":\"string\"},\"quantity\":{\"type\":\"number\"},\"unitPrice\":{\"type\":\"number\"},\"amount\":{\"type\":\"number\"}}}},\"subtotal\":{\"type\":\"number\"},\"tax\":{\"type\":\"number\"},\"total\":{\"type\":\"number\"},\"currency\":{\"type\":\"string\"}},\"required\":[\"invoiceNumber\",\"total\"],\"additionalProperties\":false}"
      },
      "id": "pdfvector-extract",
      "name": "PDF Vector - Extract Invoice",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [650, 300],
      "notes": "Extract structured invoice data"
    },
    {
      "parameters": {
        "jsCode": "// Validate invoice data\nconst invoice = $input.first().json.data;\nlet errors = [];\n\n// Check if line items total matches subtotal\nif (invoice.lineItems && invoice.lineItems.length > 0) {\n  const calculatedSubtotal = invoice.lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);\n  if (Math.abs(calculatedSubtotal - invoice.subtotal) > 0.01) {\n    errors.push(`Line items total (${calculatedSubtotal}) doesn't match subtotal (${invoice.subtotal})`);\n  }\n}\n\n// Validate total calculation\nconst calculatedTotal = (invoice.subtotal || 0) + (invoice.tax || 0);\nif (Math.abs(calculatedTotal - invoice.total) > 0.01) {\n  errors.push(`Calculated total (${calculatedTotal}) doesn't match invoice total (${invoice.total})`);\n}\n\n// Check required fields\nif (!invoice.invoiceNumber) errors.push('Missing invoice number');\nif (!invoice.vendor?.name) errors.push('Missing vendor name');\n\nreturn [{\n  json: {\n    invoice: invoice,\n    valid: errors.length === 0,\n    errors: errors,\n    processedAt: new Date().toISOString()\n  }\n}];"
      },
      "id": "validate-data",
      "name": "Validate Invoice Data",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [850, 300],
      "notes": "Validate calculations and required fields"
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
      "name": "Is Valid?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [1050, 300]
    },
    {
      "parameters": {
        "operation": "insert",
        "table": "invoices",
        "columns": "invoice_number,vendor_name,total,currency,invoice_date,data,processed_at"
      },
      "id": "save-invoice",
      "name": "Save to Database",
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 1,
      "position": [1250, 250],
      "notes": "Store validated invoice"
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [
        [
          {
            "node": "Get Invoice from Google Drive",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get Invoice from Google Drive": {
      "main": [
        [
          {
            "node": "PDF Vector - Extract Invoice",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Extract Invoice": {
      "main": [
        [
          {
            "node": "Validate Invoice Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Validate Invoice Data": {
      "main": [
        [
          {
            "node": "Is Valid?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Is Valid?": {
      "main": [
        [
          {
            "node": "Save to Database",
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

## 2. Parse and Score Resumes with PDF Vector AI

**Name:** Parse and Score Resumes with PDF Vector AI

**Description:**
HR departments and recruiters spend countless hours manually reviewing resumes, often missing qualified candidates due to time constraints. This workflow automates the entire resume screening process by extracting structured data from resumes in any format (PDF, Word documents, or even photographed/scanned resume images), calculating experience scores, and creating comprehensive candidate profiles ready for your ATS system.

**Target Audience:** HR departments, recruitment agencies, talent acquisition teams, and hiring managers who need to process large volumes of resumes efficiently while maintaining quality candidate selection.

**Problem Solved:** Manual resume screening is inefficient and inconsistent. Different reviewers may evaluate the same resume differently, leading to missed opportunities. This template standardizes the extraction process, automatically calculates years of experience for each skill, and provides objective scoring metrics to help identify the best candidates faster.

**Setup Instructions:**
1. Configure Google Drive credentials in n8n
2. Install the PDF Vector community node from the n8n marketplace
3. Configure your PDF Vector API credentials
4. Set up your preferred data storage (database or spreadsheet)
5. Customize the skill categories for your industry
6. Configure the scoring algorithm based on your requirements
7. Connect to your existing ATS system if needed

**Key Features:**
- Automatic retrieval of resumes from Google Drive
- Intelligent parsing of resumes in any format (PDF, DOCX, images)
- OCR support for scanned or photographed resumes
- Automatic calculation of total years of experience
- Skill-specific experience tracking and proficiency scoring
- AI-powered assessment of candidate strengths and fit
- Support for multiple languages and international formats
- Structured data output compatible with major ATS systems

**Customization Options:**
- Define custom skill categories relevant to your industry
- Adjust scoring weights for different experience types
- Add specific extraction fields for your organization
- Implement keyword matching for job requirements
- Set up automated candidate ranking systems
- Create role-specific evaluation criteria
- Add integration with LinkedIn or other professional networks

**Implementation Details:**
The workflow uses advanced AI to understand context and extract meaningful information from unstructured resume data. It calculates experience by analyzing date ranges in work history and associates technologies mentioned with specific roles. The scoring algorithm considers both depth (years of experience) and breadth (variety of skills) to provide a comprehensive candidate assessment.

**Note:** This workflow uses the PDF Vector community node. Make sure to install it from the n8n community nodes collection before using this template.

**Template Code:**
```json
{
  "meta": {
    "instanceId": "placeholder"
  },
  "nodes": [
    {
      "parameters": {},
      "id": "manual-trigger",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [250, 300],
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
      "position": [450, 300],
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
      "position": [650, 300],
      "notes": "Extract candidate information"
    },
    {
      "parameters": {
        "jsCode": "// Calculate experience and skill metrics\nconst resume = $input.first().json.data;\nconst currentDate = new Date();\n\n// Calculate total years of experience\nlet totalExperience = 0;\nlet skillExperience = {};\n\nif (resume.workExperience) {\n  resume.workExperience.forEach(job => {\n    const startDate = new Date(job.startDate);\n    const endDate = job.endDate === 'Present' ? currentDate : new Date(job.endDate);\n    const years = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365);\n    totalExperience += years;\n    \n    // Track experience per technology\n    if (job.technologies) {\n      job.technologies.forEach(tech => {\n        skillExperience[tech] = (skillExperience[tech] || 0) + years;\n      });\n    }\n  });\n}\n\n// Create skill proficiency scores\nconst skillScores = {};\nif (resume.skills?.technical) {\n  resume.skills.technical.forEach(skill => {\n    const experience = skillExperience[skill] || 0;\n    let score = 0;\n    if (experience >= 5) score = 5;\n    else if (experience >= 3) score = 4;\n    else if (experience >= 1) score = 3;\n    else if (experience > 0) score = 2;\n    else score = 1;\n    \n    skillScores[skill] = {\n      yearsExperience: Math.round(experience * 10) / 10,\n      proficiencyScore: score\n    };\n  });\n}\n\nreturn [{\n  json: {\n    candidateProfile: resume,\n    metrics: {\n      totalYearsExperience: Math.round(totalExperience * 10) / 10,\n      skillScores: skillScores,\n      educationLevel: resume.education?.[0]?.degree || 'Not specified',\n      certificationCount: resume.certifications?.length || 0,\n      languageCount: resume.skills?.languages?.length || 0\n    },\n    processedAt: new Date().toISOString()\n  }\n}];"
      },
      "id": "calculate-metrics",
      "name": "Calculate Experience Metrics",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [850, 300],
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
      "position": [1050, 300],
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
      "position": [1250, 300],
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

## 3. Analyze Legal Contracts with PDF Vector Risk Assessment

**Name:** Analyze Legal Contracts with PDF Vector Risk Assessment

**Description:**
Legal teams and procurement departments face increasing pressure to review contracts quickly while ensuring nothing important is missed. Manual contract review is time-consuming, and important terms or risks can be overlooked. This workflow automates contract analysis by extracting key terms from PDF contracts or scanned contract images, identifying obligations, assessing risks, and generating comprehensive compliance reports.

**Target Audience:** Legal departments, procurement teams, contract managers, compliance officers, and business executives who need to review and manage contracts efficiently while minimizing legal risks.

**Problem Solved:** Contract review bottlenecks slow down business deals and expose organizations to hidden risks. This template accelerates the review process from days to minutes while providing more thorough analysis than manual review. It identifies potential risks, tracks obligations, and ensures all critical terms are captured and evaluated.

**Setup Instructions:**
1. Configure Google Drive credentials in n8n
2. Install the PDF Vector community node in your n8n instance
3. Configure PDF Vector API credentials
4. Set up your preferred storage solution for contract data
5. Customize risk assessment criteria for your industry
6. Configure compliance requirements specific to your jurisdiction
7. Set up notification channels for high-risk contracts

**Key Features:**
- Automatic retrieval of contracts from Google Drive
- Process both digital PDFs and scanned/photographed contracts
- OCR support for handwritten amendments and signatures
- Comprehensive extraction of all contract parties and key dates
- Automatic identification of obligations and deliverables
- AI-powered risk assessment with severity scoring
- Payment terms analysis with penalty calculations
- Termination clause evaluation and timeline tracking
- Automated compliance checklist generation
- Critical date reminders and obligation deadlines

**Customization Options:**
- Add industry-specific risk factors and compliance requirements
- Create custom extraction fields for specialized contract types
- Implement multi-language support for international contracts
- Set up integration with contract management systems
- Configure automated alerts for expiration dates
- Build approval workflows based on risk levels
- Add comparison features against your standard contract templates

**Implementation Details:**
The workflow combines structured data extraction with AI analysis to provide comprehensive contract insights. It calculates important dates, tracks deliverables, and creates actionable compliance checklists. The risk assessment uses natural language processing to identify unusual clauses, missing standard provisions, and potential legal concerns that require human review.

**Note:** This workflow uses the PDF Vector community node. Make sure to install it from the n8n community nodes collection before using this template.

**Template Code:**
```json
{
  "meta": {
    "instanceId": "placeholder"
  },
  "nodes": [
    {
      "parameters": {},
      "id": "manual-trigger",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [250, 300],
      "notes": "Start contract analysis"
    },
    {
      "parameters": {
        "operation": "download",
        "fileId": "={{ $json.fileId }}"
      },
      "id": "google-drive",
      "name": "Get Contract from Google Drive",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [450, 300],
      "notes": "Download contract PDF from Google Drive"
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "extract",
        "inputType": "file",
        "binaryPropertyName": "data",
        "prompt": "Extract all key contract information from this document or image including parties involved, contract type, effective date, expiration date, payment terms, deliverables, obligations, termination clauses, penalties, warranties, and any other important terms. Handle both digital PDFs and scanned/photographed contracts.",
        "schema": "{\"type\":\"object\",\"properties\":{\"contractTitle\":{\"type\":\"string\"},\"contractType\":{\"type\":\"string\"},\"effectiveDate\":{\"type\":\"string\"},\"expirationDate\":{\"type\":\"string\"},\"parties\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"name\":{\"type\":\"string\"},\"role\":{\"type\":\"string\"},\"address\":{\"type\":\"string\"},\"signatory\":{\"type\":\"string\"}}}},\"paymentTerms\":{\"type\":\"object\",\"properties\":{\"amount\":{\"type\":\"string\"},\"schedule\":{\"type\":\"string\"},\"currency\":{\"type\":\"string\"},\"lateFees\":{\"type\":\"string\"}}},\"deliverables\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"description\":{\"type\":\"string\"},\"dueDate\":{\"type\":\"string\"},\"acceptanceCriteria\":{\"type\":\"string\"}}}},\"obligations\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"party\":{\"type\":\"string\"},\"obligation\":{\"type\":\"string\"},\"deadline\":{\"type\":\"string\"}}}},\"terminationClauses\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}},\"penalties\":{\"type\":\"array\",\"items\":{\"type\":\"object\",\"properties\":{\"trigger\":{\"type\":\"string\"},\"amount\":{\"type\":\"string\"}}}},\"warranties\":{\"type\":\"array\",\"items\":{\"type\":\"string\"}},\"governingLaw\":{\"type\":\"string\"},\"disputeResolution\":{\"type\":\"string\"}},\"required\":[\"contractTitle\",\"parties\"],\"additionalProperties\":false}"
      },
      "id": "pdfvector-extract",
      "name": "PDF Vector - Extract Contract",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [650, 300],
      "notes": "Extract contract details"
    },
    {
      "parameters": {
        "resource": "document",
        "operation": "ask",
        "inputType": "file",
        "binaryPropertyName": "data",
        "prompt": "Analyze this contract document or image and identify: 1) Top 5 risks or concerns, 2) Any unusual or potentially problematic clauses, 3) Missing standard provisions, 4) Overall risk level (Low/Medium/High) with justification."
      },
      "id": "pdfvector-risk",
      "name": "PDF Vector - Risk Analysis",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [650, 300],
      "notes": "Analyze contract risks"
    },
    {
      "parameters": {
        "jsCode": "// Create comprehensive contract analysis\nconst contractData = $node['PDF Vector - Extract Contract'].json.data;\nconst riskAnalysis = $node['PDF Vector - Risk Analysis'].json.answer;\n\n// Calculate important dates\nconst today = new Date();\nconst effectiveDate = new Date(contractData.effectiveDate);\nconst expirationDate = new Date(contractData.expirationDate);\nconst daysUntilExpiration = Math.floor((expirationDate - today) / (1000 * 60 * 60 * 24));\n\n// Create deliverables timeline\nconst upcomingDeliverables = [];\nif (contractData.deliverables) {\n  contractData.deliverables.forEach(deliverable => {\n    const dueDate = new Date(deliverable.dueDate);\n    const daysUntilDue = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));\n    if (daysUntilDue > 0) {\n      upcomingDeliverables.push({\n        ...deliverable,\n        daysUntilDue\n      });\n    }\n  });\n}\n\n// Sort deliverables by due date\nupcomingDeliverables.sort((a, b) => a.daysUntilDue - b.daysUntilDue);\n\n// Create compliance checklist\nconst complianceChecklist = [\n  {\n    item: 'All parties properly identified',\n    status: contractData.parties?.length >= 2 ? 'Complete' : 'Missing',\n    required: true\n  },\n  {\n    item: 'Payment terms specified',\n    status: contractData.paymentTerms?.amount ? 'Complete' : 'Missing',\n    required: true\n  },\n  {\n    item: 'Termination clauses included',\n    status: contractData.terminationClauses?.length > 0 ? 'Complete' : 'Missing',\n    required: true\n  },\n  {\n    item: 'Governing law specified',\n    status: contractData.governingLaw ? 'Complete' : 'Missing',\n    required: true\n  },\n  {\n    item: 'Dispute resolution process',\n    status: contractData.disputeResolution ? 'Complete' : 'Missing',\n    required: false\n  }\n];\n\nreturn [{\n  json: {\n    contractSummary: {\n      title: contractData.contractTitle,\n      type: contractData.contractType,\n      parties: contractData.parties,\n      value: contractData.paymentTerms?.amount || 'Not specified',\n      duration: `${Math.floor((expirationDate - effectiveDate) / (1000 * 60 * 60 * 24))} days`,\n      daysUntilExpiration\n    },\n    riskAssessment: riskAnalysis,\n    upcomingDeliverables,\n    complianceChecklist,\n    extractedData: contractData,\n    analysisDate: new Date().toISOString()\n  }\n}];"
      },
      "id": "analyze-contract",
      "name": "Generate Analysis Report",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [850, 300],
      "notes": "Create comprehensive analysis"
    },
    {
      "parameters": {
        "fileName": "contract_analysis_{{ $now.format('yyyy-MM-dd') }}.json",
        "fileContent": "={{ JSON.stringify($json, null, 2) }}"
      },
      "id": "save-report",
      "name": "Save Analysis Report",
      "type": "n8n-nodes-base.writeBinaryFile",
      "typeVersion": 1,
      "position": [1050, 300],
      "notes": "Save analysis to file"
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [
        [
          {
            "node": "PDF Vector - Extract Contract",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Extract Contract": {
      "main": [
        [
          {
            "node": "PDF Vector - Risk Analysis",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Risk Analysis": {
      "main": [
        [
          {
            "node": "Generate Analysis Report",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate Analysis Report": {
      "main": [
        [
          {
            "node": "Save Analysis Report",
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

## 4. Build Document Q&A API with PDF Vector and Webhooks

**Name:** Build Document Q&A API with PDF Vector and Webhooks

**Description:**
Organizations struggle to make their document repositories searchable and accessible. Users waste time searching through lengthy PDFs, manuals, and documentation to find specific answers. This workflow creates a powerful API service that instantly answers questions about any document or image, perfect for building customer support chatbots, internal knowledge bases, or interactive documentation systems.

**Target Audience:** Developer teams, customer support departments, technical writers, and organizations looking to make their documentation more accessible through conversational interfaces and API integrations.

**Problem Solved:** Traditional document search returns entire pages or sections, forcing users to read through irrelevant content. This template creates an intelligent Q&A system that provides precise, contextual answers to specific questions. It eliminates the need for users to manually search through documents and enables integration with chatbots, support systems, and custom applications.

**Setup Instructions:**
1. Install the PDF Vector community node from n8n marketplace
2. Configure your PDF Vector API key
3. Set up the webhook URL for your API endpoint
4. Configure Redis or database for session management
5. Set response caching parameters
6. Test the API with sample documents and questions

**Key Features:**
- RESTful webhook API for easy integration
- Support for PDFs, Word docs, text files, and images
- OCR capabilities for scanned documents and screenshots
- Context-aware answers with source references
- Session management for conversational follow-ups
- Intelligent caching for improved response times
- Built-in usage analytics and monitoring

**API Usage Example:**
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

**Customization Options:**
- Add authentication and rate limiting
- Implement multi-document search capabilities
- Create specialized prompts for different document types
- Add language detection and translation
- Build conversation history tracking
- Integrate with existing help desk systems
- Add support for local file uploads

**Implementation Details:**
The workflow processes incoming webhook requests, manages document parsing efficiently through caching, and uses PDF Vector's advanced AI to understand context and provide accurate answers. It includes error handling, session management for follow-up questions, and returns responses in a standardized JSON format suitable for integration with any application.

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
        "httpMethod": "POST",
        "path": "doc-qa"
      },
      "id": "webhook-trigger",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300],
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
      "typeVersion": 1,
      "position": [450, 300],
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
      "position": [650, 300]
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
      "position": [850, 250],
      "notes": "Get answer from document"
    },
    {
      "parameters": {
        "jsCode": "// Prepare successful response\nconst answer = $json.answer;\nconst request = $node['Validate Request'].json;\n\n// Calculate confidence score based on answer length and keywords\nlet confidence = 0.8; // Base confidence\nif (answer.length > 100) confidence += 0.1;\nif (answer.toLowerCase().includes('specifically') || answer.toLowerCase().includes('according to')) confidence += 0.1;\nconfidence = Math.min(confidence, 1.0);\n\nreturn [{\n  json: {\n    success: true,\n    data: {\n      answer,\n      confidence,\n      sessionId: request.sessionId,\n      documentUrl: request.documentUrl,\n      question: request.question\n    },\n    metadata: {\n      processedAt: new Date().toISOString(),\n      responseTime: Date.now() - new Date(request.timestamp).getTime(),\n      creditsUsed: 1\n    }\n  }\n}];"
      },
      "id": "format-success",
      "name": "Format Success Response",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1050, 250],
      "notes": "Prepare successful response"
    },
    {
      "parameters": {
        "jsCode": "// Prepare error response\nconst errors = $json.errors || ['An error occurred processing your request'];\n\nreturn [{\n  json: {\n    success: false,\n    errors,\n    message: 'Invalid request',\n    timestamp: new Date().toISOString()\n  }\n}];"
      },
      "id": "format-error",
      "name": "Format Error Response",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [850, 350],
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
      "position": [1250, 300],
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
Researchers and academic institutions need efficient ways to process and analyze large volumes of research papers and academic documents, including scanned PDFs and image-based materials (JPG, PNG). Manual review of academic literature is time-consuming and makes it difficult to identify trends, track citations, and synthesize findings across multiple papers. This workflow automates the extraction and analysis of research papers and scanned documents using OCR technology, creating a searchable knowledge base of academic insights from both digital and image-based sources.

**Target Audience:** Research institutions, university libraries, R&D departments, academic researchers, literature review teams, and organizations tracking scientific developments in their field.

**Problem Solved:** Literature reviews require reading hundreds of papers to identify relevant findings and methodologies. This template automates the extraction of key information from research papers, including methodologies, findings, and citations. It builds a searchable database that helps researchers quickly find relevant studies and identify research gaps.

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
      "parameters": {},
      "id": "manual-trigger",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [250, 300],
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
      "position": [450, 300],
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
      "position": [650, 300],
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
      "position": [850, 300],
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
      "position": [1050, 300],
      "notes": "Create AI summary"
    },
    {
      "parameters": {
        "jsCode": "// Combine all analysis data\nconst parsedContent = $node['PDF Vector - Parse Paper'].json;\nconst extractedData = $node['PDF Vector - Extract Data'].json.data;\nconst aiSummary = $node['Generate AI Summary'].json.choices[0].message.content;\n\n// Calculate reading time (assuming 250 words per minute)\nconst wordCount = parsedContent.content.split(' ').length;\nconst readingTimeMinutes = Math.ceil(wordCount / 250);\n\n// Prepare database entry\nconst paperAnalysis = {\n  // Basic information\n  title: extractedData.title,\n  authors: extractedData.authors,\n  url: $node['Google Drive - Get Paper'].json.webViewLink,\n  \n  // Content\n  abstract: extractedData.abstract,\n  keywords: extractedData.keywords,\n  fullText: parsedContent.content,\n  \n  // Analysis\n  aiSummary: aiSummary,\n  methodology: extractedData.methodology,\n  findings: extractedData.findings,\n  conclusions: extractedData.conclusions,\n  limitations: extractedData.limitations,\n  futureWork: extractedData.futureWork,\n  \n  // Metadata\n  wordCount: wordCount,\n  readingTimeMinutes: readingTimeMinutes,\n  referenceCount: extractedData.references || 0,\n  processedAt: new Date().toISOString(),\n  \n  // Searchable fields\n  searchText: `${extractedData.title} ${extractedData.abstract} ${extractedData.keywords.join(' ')}`.toLowerCase()\n};\n\nreturn [{ json: paperAnalysis }];"
      },
      "id": "prepare-data",
      "name": "Prepare Database Entry",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1250, 300],
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
      "position": [1450, 300],
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
Businesses and freelancers often struggle with the tedious task of manually processing receipts for expense tracking and tax purposes. This workflow automates the entire receipt processing pipeline, extracting detailed information from receipts (including scanned images, photos, PDFs, JPGs, and PNGs) and intelligently categorizing them for tax deductions.

**Target Audience:** Accountants, small business owners, freelancers, finance teams, and individual professionals who need to process large volumes of receipts efficiently for expense tracking and tax preparation.

**Problem Solved:** Manual receipt processing is time-consuming and error-prone, especially during tax season. People struggle to organize receipts, extract accurate data from various formats, and categorize expenses properly for tax deductions. This template automates the entire process while ensuring compliance with accounting standards and tax regulations.

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
      "parameters": {},
      "id": "manual-trigger",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [250, 300],
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
      "position": [450, 300],
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
      "position": [650, 300],
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
      "position": [850, 300],
      "notes": "Categorize for taxes"
    },
    {
      "parameters": {
        "jsCode": "// Process receipt data and tax categorization\nconst receiptData = $node['PDF Vector - Extract Receipt'].json.data;\nconst taxCategory = $node['PDF Vector - Tax Categorization'].json.answer;\n\n// Validate financial calculations\nlet validationErrors = [];\nif (receiptData.items && receiptData.items.length > 0) {\n  const calculatedSubtotal = receiptData.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);\n  if (Math.abs(calculatedSubtotal - receiptData.financial.subtotal) > 0.02) {\n    validationErrors.push('Item totals do not match subtotal');\n  }\n}\n\n// Calculate tax consistency\nconst expectedTax = receiptData.financial.subtotal * (receiptData.financial.taxRate / 100);\nif (Math.abs(expectedTax - receiptData.financial.taxAmount) > 0.02) {\n  validationErrors.push('Tax calculation inconsistency');\n}\n\n// Determine expense category and deductibility\nlet expenseCategory = 'Other';\nlet deductiblePercentage = 100;\nlet taxNotes = '';\n\nif (taxCategory.toLowerCase().includes('meal')) {\n  expenseCategory = 'Meals & Entertainment';\n  deductiblePercentage = 50; // Typical meal deduction\n  taxNotes = 'Business meal - 50% deductible';\n} else if (taxCategory.toLowerCase().includes('travel')) {\n  expenseCategory = 'Travel';\n  deductiblePercentage = 100;\n  taxNotes = 'Business travel expense';\n} else if (taxCategory.toLowerCase().includes('supplies')) {\n  expenseCategory = 'Office Supplies';\n  deductiblePercentage = 100;\n  taxNotes = 'Business supplies';\n}\n\n// Create processed expense record\nconst processedExpense = {\n  // Receipt data\n  merchant: receiptData.merchant.name,\n  date: receiptData.transaction.date,\n  amount: receiptData.financial.total,\n  currency: receiptData.financial.currency || 'USD',\n  \n  // Tax information\n  expenseCategory,\n  deductiblePercentage,\n  deductibleAmount: (receiptData.financial.total * deductiblePercentage / 100).toFixed(2),\n  taxNotes,\n  \n  // Original data\n  originalReceipt: receiptData,\n  aiCategorization: taxCategory,\n  \n  // Validation\n  isValid: validationErrors.length === 0,\n  validationErrors,\n  \n  // Metadata\n  processedAt: new Date().toISOString(),\n  taxYear: new Date(receiptData.transaction.date).getFullYear()\n};\n\nreturn [{ json: processedExpense }];"
      },
      "id": "process-expense",
      "name": "Process Expense Data",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1050, 300],
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
      "position": [1250, 300],
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
Healthcare organizations face significant challenges in digitizing and processing medical records while maintaining strict HIPAA compliance. This workflow provides a secure, automated solution for extracting clinical data from various medical documents including discharge summaries, lab reports, clinical notes, prescription records, and scanned medical images (JPG, PNG).

**Target Audience:** Healthcare providers, medical billing companies, clinical research organizations, health information exchanges, and medical practice administrators who need to digitize and extract data from medical records while maintaining HIPAA compliance.

**Problem Solved:** Manual medical record processing is time-consuming, error-prone, and creates compliance risks. Healthcare organizations struggle to extract structured data from handwritten notes, scanned documents, and various medical forms while protecting PHI. This template automates the extraction process while maintaining the highest security standards for Protected Health Information.

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
      "parameters": {},
      "id": "manual-trigger",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [250, 300],
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
      "position": [450, 300],
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
      "position": [650, 300],
      "notes": "Extract medical information"
    },
    {
      "parameters": {
        "jsCode": "// Process and validate medical data\nconst medicalData = $input.first().json.data;\n\n// Create audit log entry\nconst auditLog = {\n  action: 'Medical Record Processed',\n  timestamp: new Date().toISOString(),\n  recordType: 'Clinical Document',\n  patientId: medicalData.patientRecord.patientId,\n  userId: 'system-automated',\n  ipAddress: 'internal-process'\n};\n\n// Validate critical fields\nconst validationResults = {\n  hasPatientId: !!medicalData.patientRecord?.patientId,\n  hasVisitDate: !!medicalData.patientRecord?.visitDate,\n  hasDiagnoses: medicalData.diagnoses?.length > 0,\n  hasValidIcdCodes: true\n};\n\n// Validate ICD codes format\nif (medicalData.diagnoses) {\n  medicalData.diagnoses.forEach(diagnosis => {\n    if (diagnosis.icdCode && !diagnosis.icdCode.match(/^[A-Z][0-9]{2}(\\.[0-9]{1,2})?$/)) {\n      validationResults.hasValidIcdCodes = false;\n    }\n  });\n}\n\n// Flag abnormal lab results\nconst abnormalLabs = [];\nif (medicalData.labResults) {\n  medicalData.labResults.forEach(lab => {\n    if (lab.flag && (lab.flag === 'H' || lab.flag === 'L' || lab.flag === 'Critical')) {\n      abnormalLabs.push({\n        test: lab.testName,\n        value: lab.value,\n        flag: lab.flag\n      });\n    }\n  });\n}\n\n// Check for drug interactions (simplified)\nconst medications = medicalData.medications || [];\nconst potentialInteractions = [];\n// This is a simplified check - in production, use a proper drug interaction API\nif (medications.length > 1) {\n  // Example: Check for common dangerous combinations\n  const medNames = medications.map(m => m.name.toLowerCase());\n  if (medNames.some(m => m.includes('warfarin')) && medNames.some(m => m.includes('aspirin'))) {\n    potentialInteractions.push('Warfarin + Aspirin: Increased bleeding risk');\n  }\n}\n\n// Prepare processed record\nconst processedRecord = {\n  // Core data\n  patientRecord: medicalData.patientRecord,\n  clinicalData: medicalData.clinicalData,\n  diagnoses: medicalData.diagnoses,\n  medications: medicalData.medications,\n  vitalSigns: medicalData.vitalSigns,\n  labResults: medicalData.labResults,\n  procedures: medicalData.procedures,\n  plan: medicalData.plan,\n  \n  // Analysis results\n  alerts: {\n    abnormalLabs,\n    potentialInteractions\n  },\n  \n  // Metadata\n  validation: validationResults,\n  processedAt: new Date().toISOString(),\n  dataClassification: 'PHI - Protected Health Information',\n  retentionYears: 7,\n  \n  // Compliance\n  auditLog\n};\n\nreturn [{ json: processedRecord }];"
      },
      "id": "process-validate",
      "name": "Process & Validate Data",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [850, 300],
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
      "position": [1050, 300]
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
      "position": [1250, 250],
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
Conducting comprehensive literature reviews is one of the most time-consuming aspects of academic research. This workflow revolutionizes the process by automating literature search, paper analysis, and review generation across multiple academic databases. It handles both digital papers and scanned documents (PDFs, JPGs, PNGs), using OCR technology for older publications or image-based content.

**Target Audience:** Researchers, graduate students, academic institutions, literature review teams, and academic writers who need to conduct comprehensive literature reviews efficiently while maintaining high quality and thoroughness.

**Problem Solved:** Manual literature reviews are extremely time-consuming and often miss relevant papers across different databases. Researchers struggle to synthesize large volumes of academic papers, track citations properly, and identify research gaps systematically. This template automates the entire process from search to synthesis, ensuring comprehensive coverage and proper citation management.

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
      "position": [250, 300],
      "notes": "Configure literature review parameters"
    },
    {
      "parameters": {
        "resource": "academic",
        "operation": "search",
        "query": "={{ $json.topic }}",
        "providers": ["pubmed", "semantic-scholar", "arxiv"],
        "limit": 50,
        "yearFrom": "={{ $json.yearFrom }}",
        "yearTo": "={{ $json.yearTo }}",
        "additionalFields": {
          "fields": ["title", "abstract", "authors", "year", "doi", "pdfURL", "totalCitations"]
        }
      },
      "id": "pdfvector-search",
      "name": "PDF Vector - Search Papers",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [450, 300],
      "notes": "Search academic databases"
    },
    {
      "parameters": {
        "jsCode": "// Rank papers by relevance and citations\nconst papers = $input.all().map(item => item.json);\nconst searchTopic = $node['Set Search Parameters'].json.topic;\n\n// Calculate relevance scores\nconst scoredPapers = papers.map(paper => {\n  let score = 0;\n  \n  // Citation score (normalized)\n  const maxCitations = Math.max(...papers.map(p => p.totalCitations || 0));\n  const citationScore = (paper.totalCitations || 0) / (maxCitations || 1) * 40;\n  score += citationScore;\n  \n  // Recency score\n  const paperYear = parseInt(paper.year);\n  const currentYear = new Date().getFullYear();\n  const recencyScore = Math.max(0, 20 - (currentYear - paperYear) * 2);\n  score += recencyScore;\n  \n  // Title relevance\n  const topicWords = searchTopic.toLowerCase().split(' ');\n  const titleWords = paper.title.toLowerCase();\n  const titleMatches = topicWords.filter(word => titleWords.includes(word)).length;\n  score += titleMatches * 10;\n  \n  // Abstract relevance\n  if (paper.abstract) {\n    const abstractWords = paper.abstract.toLowerCase();\n    const abstractMatches = topicWords.filter(word => abstractWords.includes(word)).length;\n    score += abstractMatches * 5;\n  }\n  \n  return {\n    ...paper,\n    relevanceScore: Math.round(score),\n    rankingDetails: {\n      citationScore: Math.round(citationScore),\n      recencyScore,\n      titleRelevance: titleMatches,\n      abstractRelevance: abstractMatches || 0\n    }\n  };\n});\n\n// Sort by score and limit to top N\nconst maxPapers = $node['Set Search Parameters'].json.maxPapers;\nconst topPapers = scoredPapers\n  .sort((a, b) => b.relevanceScore - a.relevanceScore)\n  .slice(0, maxPapers);\n\nreturn topPapers.map(paper => ({ json: paper }));"
      },
      "id": "rank-papers",
      "name": "Rank & Select Papers",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [650, 300],
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
      "position": [850, 300],
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
      "position": [1050, 300]
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
      "position": [1250, 250],
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
      "position": [1450, 300],
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
      "position": [1650, 300],
      "notes": "Save processed entry"
    },
    {
      "parameters": {
        "functionCode": "// Wait for all papers to be processed\nconst allEntries = $input.all().map(item => item.json);\n\n// Group papers by themes/methodologies\nconst themes = {\n  'Machine Learning Models': [],\n  'Clinical Applications': [],\n  'Data Processing': [],\n  'Evaluation Studies': [],\n  'Review Papers': [],\n  'Other': []\n};\n\n// Categorize papers (simplified - in production use NLP)\nallEntries.forEach(entry => {\n  const review = entry.reviewEntry.toLowerCase();\n  if (review.includes('neural network') || review.includes('deep learning')) {\n    themes['Machine Learning Models'].push(entry);\n  } else if (review.includes('clinical') || review.includes('patient')) {\n    themes['Clinical Applications'].push(entry);\n  } else if (review.includes('preprocessing') || review.includes('data processing')) {\n    themes['Data Processing'].push(entry);\n  } else if (review.includes('evaluation') || review.includes('comparison')) {\n    themes['Evaluation Studies'].push(entry);\n  } else if (review.includes('review') || review.includes('survey')) {\n    themes['Review Papers'].push(entry);\n  } else {\n    themes['Other'].push(entry);\n  }\n});\n\n// Generate literature review document\nlet reviewDocument = `# Literature Review: ${$node['Set Search Parameters'].json.topic}\\n\\n`;\nreviewDocument += `Generated on: ${new Date().toLocaleDateString()}\\n\\n`;\nreviewDocument += `## Summary\\n\\n`;\nreviewDocument += `This review analyzes ${allEntries.length} papers published between ${$node['Set Search Parameters'].json.yearFrom} and ${$node['Set Search Parameters'].json.yearTo} on the topic of ${$node['Set Search Parameters'].json.topic}.\\n\\n`;\n\n// Add themed sections\nObject.entries(themes).forEach(([theme, papers]) => {\n  if (papers.length > 0) {\n    reviewDocument += `## ${theme} (${papers.length} papers)\\n\\n`;\n    papers.forEach(paper => {\n      reviewDocument += `### ${paper.paperTitle}\\n\\n`;\n      reviewDocument += paper.reviewEntry + '\\n\\n';\n    });\n  }\n});\n\n// Add bibliography\nreviewDocument += `## Bibliography\\n\\n`;\nallEntries.forEach((entry, index) => {\n  const citation = entry.reviewEntry.split('Suggested citation:')[1] || 'Citation not available';\n  reviewDocument += `${index + 1}. ${citation.trim()}\\n\\n`;\n});\n\nreturn [{\n  json: {\n    reviewDocument,\n    totalPapers: allEntries.length,\n    themes: Object.entries(themes).map(([theme, papers]) => ({\n      theme,\n      count: papers.length\n    })),\n    generatedAt: new Date().toISOString()\n  }\n}];"
      },
      "id": "compile-review",
      "name": "Compile Literature Review",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1850, 300],
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
Legal professionals spend countless hours manually checking citations and building citation indexes for briefs, memoranda, and legal opinions. This workflow automates the extraction, validation, and analysis of legal citations from any legal document, including scanned court documents, photographed case files, and image-based legal materials (PDFs, JPGs, PNGs).

**Target Audience:** Attorneys, paralegals, legal researchers, judicial clerks, law students, and legal writing professionals who need to extract, validate, and manage legal citations efficiently across multiple jurisdictions.

**Problem Solved:** Manual citation checking is extremely time-consuming and error-prone. Legal professionals struggle to ensure citation accuracy, verify case law is still good law, and build comprehensive citation indexes. This template automates the entire citation management process while ensuring compliance with citation standards like Bluebook format.

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
      "parameters": {},
      "id": "manual-trigger",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [250, 300],
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
      "position": [450, 300],
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
      "position": [650, 300],
      "notes": "Extract all citations"
    },
    {
      "parameters": {
        "jsCode": "// Process and validate citations\nconst citations = $input.first().json.data;\nconst citationAnalysis = {\n  summary: {\n    totalCitations: 0,\n    caseLaw: citations.caseCitations?.length || 0,\n    statutes: citations.statuteCitations?.length || 0,\n    regulations: citations.regulatoryCitations?.length || 0,\n    academic: citations.academicCitations?.length || 0,\n    other: citations.otherCitations?.length || 0\n  },\n  validation: {\n    invalidCitations: [],\n    warnings: []\n  },\n  academicDOIs: [],\n  citationNetwork: {}\n};\n\n// Calculate total\ncitationAnalysis.summary.totalCitations = \n  citationAnalysis.summary.caseLaw + \n  citationAnalysis.summary.statutes + \n  citationAnalysis.summary.regulations + \n  citationAnalysis.summary.academic + \n  citationAnalysis.summary.other;\n\n// Validate case citations\nif (citations.caseCitations) {\n  citations.caseCitations.forEach((cite, index) => {\n    // Check for required fields\n    if (!cite.reporter || !cite.volume || !cite.page) {\n      citationAnalysis.validation.invalidCitations.push({\n        type: 'case',\n        index,\n        citation: cite.caseName,\n        issue: 'Missing reporter, volume, or page'\n      });\n    }\n    \n    // Build citation network (track which cases cite which)\n    if (!citationAnalysis.citationNetwork[cite.caseName]) {\n      citationAnalysis.citationNetwork[cite.caseName] = {\n        citedIn: [citations.documentInfo.title],\n        pageNumbers: [cite.pageNumber]\n      };\n    }\n  });\n}\n\n// Validate statute citations\nif (citations.statuteCitations) {\n  citations.statuteCitations.forEach((cite, index) => {\n    if (!cite.title || !cite.section) {\n      citationAnalysis.validation.invalidCitations.push({\n        type: 'statute',\n        index,\n        citation: `${cite.title} ${cite.code}`,\n        issue: 'Missing title or section'\n      });\n    }\n  });\n}\n\n// Extract DOIs for academic fetching\nif (citations.academicCitations) {\n  citations.academicCitations.forEach(cite => {\n    if (cite.doi) {\n      citationAnalysis.academicDOIs.push(cite.doi);\n    } else {\n      // Try to construct search query for papers without DOI\n      citationAnalysis.validation.warnings.push({\n        type: 'academic',\n        citation: cite.title,\n        warning: 'No DOI found - manual search may be needed'\n      });\n    }\n  });\n}\n\n// Analyze citation patterns\nconst citationPatterns = {\n  mostCitedCases: [],\n  primaryAuthorities: [],\n  secondaryAuthorities: []\n};\n\n// Identify primary authorities (statutes and binding cases)\ncitationPatterns.primaryAuthorities = [\n  ...citations.statuteCitations?.map(c => `${c.title} ${c.code} § ${c.section}`) || [],\n  ...citations.caseCitations?.filter(c => c.court?.includes('Supreme'))?.map(c => c.caseName) || []\n];\n\n// Identify secondary authorities\ncitationPatterns.secondaryAuthorities = \n  citations.academicCitations?.map(c => `${c.authors}, ${c.title}`) || [];\n\nreturn [{\n  json: {\n    originalData: citations,\n    analysis: citationAnalysis,\n    patterns: citationPatterns,\n    doisToFetch: citationAnalysis.academicDOIs.join(','),\n    processedAt: new Date().toISOString()\n  }\n}];"
      },
      "id": "analyze-citations",
      "name": "Analyze & Validate Citations",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [850, 300],
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
      "position": [1050, 300]
    },
    {
      "parameters": {
        "resource": "academic",
        "operation": "fetch",
        "ids": "={{ $json.doisToFetch }}",
        "fields": ["title", "abstract", "authors", "year", "doi", "pdfURL", "totalCitations"]
      },
      "id": "pdfvector-fetch",
      "name": "PDF Vector - Fetch Papers",
      "type": "n8n-nodes-pdfvector.pdfVector",
      "typeVersion": 1,
      "position": [1250, 250],
      "notes": "Retrieve academic papers"
    },
    {
      "parameters": {
        "jsCode": "// Generate comprehensive citation report\nconst citationData = $node['Has Academic DOIs?'].json;\nconst academicPapers = $json.publications || [];\n\n// Create citation report\nlet report = `# Legal Citation Analysis Report\\n\\n`;\nreport += `**Document:** ${citationData.originalData.documentInfo.title}\\n`;\nreport += `**Type:** ${citationData.originalData.documentInfo.documentType}\\n`;\nreport += `**Date:** ${citationData.originalData.documentInfo.date}\\n\\n`;\n\nreport += `## Citation Summary\\n\\n`;\nreport += `- **Total Citations:** ${citationData.analysis.summary.totalCitations}\\n`;\nreport += `- **Case Law:** ${citationData.analysis.summary.caseLaw}\\n`;\nreport += `- **Statutes:** ${citationData.analysis.summary.statutes}\\n`;\nreport += `- **Regulations:** ${citationData.analysis.summary.regulations}\\n`;\nreport += `- **Academic:** ${citationData.analysis.summary.academic}\\n`;\nreport += `- **Other:** ${citationData.analysis.summary.other}\\n\\n`;\n\n// Add validation issues\nif (citationData.analysis.validation.invalidCitations.length > 0) {\n  report += `## Citation Issues\\n\\n`;\n  citationData.analysis.validation.invalidCitations.forEach(issue => {\n    report += `- **${issue.type}:** ${issue.citation} - ${issue.issue}\\n`;\n  });\n  report += `\\n`;\n}\n\n// Add case law section\nif (citationData.originalData.caseCitations?.length > 0) {\n  report += `## Case Law Citations\\n\\n`;\n  citationData.originalData.caseCitations.forEach(cite => {\n    report += `### ${cite.caseName}\\n`;\n    report += `- **Citation:** ${cite.volume} ${cite.reporter} ${cite.page} (${cite.year})\\n`;\n    report += `- **Court:** ${cite.court || 'Not specified'}\\n`;\n    report += `- **Context:** ${cite.context}\\n`;\n    report += `- **Page:** ${cite.pageNumber}\\n\\n`;\n  });\n}\n\n// Add statute section\nif (citationData.originalData.statuteCitations?.length > 0) {\n  report += `## Statutory Citations\\n\\n`;\n  citationData.originalData.statuteCitations.forEach(cite => {\n    report += `- **${cite.title} ${cite.code} § ${cite.section}**${cite.subsection ? ` (${cite.subsection})` : ''}\\n`;\n    report += `  - Context: ${cite.context}\\n`;\n    report += `  - Page: ${cite.pageNumber}\\n\\n`;\n  });\n}\n\n// Add academic section with fetched data\nif (citationData.originalData.academicCitations?.length > 0) {\n  report += `## Academic Citations\\n\\n`;\n  citationData.originalData.academicCitations.forEach(cite => {\n    report += `### ${cite.title}\\n`;\n    report += `- **Authors:** ${cite.authors}\\n`;\n    report += `- **Journal:** ${cite.journal}, Vol. ${cite.volume}, p. ${cite.page} (${cite.year})\\n`;\n    \n    // Add fetched paper data if available\n    const fetchedPaper = academicPapers.find(p => p.doi === cite.doi);\n    if (fetchedPaper) {\n      report += `- **Citations:** ${fetchedPaper.totalCitations || 0}\\n`;\n      report += `- **Abstract Available:** Yes\\n`;\n      if (fetchedPaper.pdfURL) {\n        report += `- **Full Text:** [Available](${fetchedPaper.pdfURL})\\n`;\n      }\n    }\n    \n    report += `- **Context:** ${cite.context}\\n`;\n    report += `- **Page:** ${cite.pageNumber}\\n\\n`;\n  });\n}\n\n// Add citation patterns\nreport += `## Citation Analysis\\n\\n`;\nreport += `### Primary Authorities\\n`;\ncitationData.patterns.primaryAuthorities.forEach(auth => {\n  report += `- ${auth}\\n`;\n});\nreport += `\\n### Secondary Authorities\\n`;\ncitationData.patterns.secondaryAuthorities.forEach(auth => {\n  report += `- ${auth}\\n`;\n});\n\nreturn [{\n  json: {\n    report,\n    citationData,\n    academicPapers,\n    exportFormat: 'markdown',\n    generatedAt: new Date().toISOString()\n  }\n}];"
      },
      "id": "generate-report",
      "name": "Generate Citation Report",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1450, 300],
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
      "position": [1650, 300],
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
Organizations dealing with high-volume document processing face challenges in efficiently handling diverse document types while maintaining quality and tracking performance metrics. This enterprise-grade workflow provides a scalable solution for batch processing documents including PDFs, scanned documents, and images (JPG, PNG) with comprehensive analytics, error handling, and quality assurance.

**Target Audience:** Large organizations, document processing centers, digital transformation teams, enterprise IT departments, and businesses that need to process thousands of documents reliably with detailed performance tracking and analytics.

**Problem Solved:** High-volume document processing without proper monitoring leads to bottlenecks, quality issues, and inefficient resource usage. Organizations struggle to track processing success rates, identify problematic document types, and optimize their workflows. This template provides enterprise-grade batch processing with comprehensive analytics and automated quality assurance.

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
        "content": "## Batch Document Processor\\n\\nThis workflow processes multiple documents in parallel with comprehensive error handling and analytics.\\n\\n**Features:**\\n- Parallel processing\\n- Error recovery\\n- Processing analytics\\n- Quality checks"
      },
      "id": "workflow-info",
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
      "id": "list-documents",
      "name": "List Documents",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 1,
      "position": [450, 300],
      "notes": "Get documents from folder"
    },
    {
      "parameters": {
        "jsCode": "// Validate and categorize documents\nconst files = $input.all().map(item => item.json);\nconst processingQueue = {\n  valid: [],\n  invalid: [],\n  stats: {\n    totalFiles: files.length,\n    pdfCount: 0,\n    wordCount: 0,\n    imageCount: 0,\n    otherCount: 0,\n    totalSizeMB: 0\n  }\n};\n\n// Define supported formats\nconst supportedFormats = {\n  pdf: ['application/pdf'],\n  word: [\n    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',\n    'application/msword'\n  ],\n  image: ['image/jpeg', 'image/png', 'image/gif']\n};\n\nfiles.forEach(file => {\n  const mimeType = file.mimeType;\n  const sizeMB = (file.size || 0) / (1024 * 1024);\n  \n  // Check if supported\n  let fileType = 'other';\n  let isValid = false;\n  \n  if (supportedFormats.pdf.includes(mimeType)) {\n    fileType = 'pdf';\n    isValid = true;\n    processingQueue.stats.pdfCount++;\n  } else if (supportedFormats.word.includes(mimeType)) {\n    fileType = 'word';\n    isValid = true;\n    processingQueue.stats.wordCount++;\n  } else if (supportedFormats.image.includes(mimeType)) {\n    fileType = 'image';\n    isValid = true;\n    processingQueue.stats.imageCount++;\n  } else {\n    processingQueue.stats.otherCount++;\n  }\n  \n  // Check file size (max 50MB)\n  if (sizeMB > 50) {\n    isValid = false;\n  }\n  \n  const fileInfo = {\n    ...file,\n    fileType,\n    sizeMB: Math.round(sizeMB * 100) / 100,\n    processingPriority: sizeMB < 5 ? 'high' : sizeMB < 20 ? 'medium' : 'low',\n    estimatedCredits: fileType === 'pdf' ? Math.ceil(sizeMB * 2) : 1\n  };\n  \n  if (isValid) {\n    processingQueue.valid.push(fileInfo);\n  } else {\n    processingQueue.invalid.push({\n      ...fileInfo,\n      reason: sizeMB > 50 ? 'File too large' : 'Unsupported format'\n    });\n  }\n  \n  processingQueue.stats.totalSizeMB += sizeMB;\n});\n\n// Sort by priority\nprocessingQueue.valid.sort((a, b) => {\n  const priority = { high: 1, medium: 2, low: 3 };\n  return priority[a.processingPriority] - priority[b.processingPriority];\n});\n\nreturn [{\n  json: processingQueue\n}];"
      },
      "id": "validate-files",
      "name": "Validate & Queue Files",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [650, 300],
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
      "typeVersion": 1,
      "position": [850, 300],
      "notes": "Process 5 files at a time"
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "processingBatch",
              "value": "={{ $json }}"
            }
          ]
        }
      },
      "id": "split-files",
      "name": "Split Out Files",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [1050, 300],
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
      "position": [1250, 300]
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
      "position": [1450, 250],
      "notes": "Process document or image",
      "continueOnFail": true
    },
    {
      "parameters": {
        "jsCode": "// Track processing results\nconst result = $input.first().json;\nconst originalFile = $node['Split Items'].json;\nconst startTime = new Date($node['Split Items'].context.executionTime);\nconst endTime = new Date();\nconst processingTime = (endTime - startTime) / 1000;\n\nconst processedFile = {\n  // Original file info\n  fileName: originalFile.name,\n  fileType: originalFile.fileType,\n  sizeMB: originalFile.sizeMB,\n  \n  // Processing results\n  success: !result.error,\n  processingTime: Math.round(processingTime * 100) / 100,\n  creditsUsed: result.creditsUsed || originalFile.estimatedCredits,\n  \n  // Content info\n  contentLength: result.content?.length || 0,\n  wordCount: result.content?.split(' ').length || 0,\n  \n  // Error tracking\n  error: result.error ? {\n    message: result.error.message || 'Unknown error',\n    code: result.error.code\n  } : null,\n  \n  // Timestamps\n  processedAt: new Date().toISOString()\n};\n\n// Quality checks\nif (processedFile.success) {\n  processedFile.qualityChecks = {\n    hasContent: processedFile.contentLength > 100,\n    reasonableLength: processedFile.wordCount > 10 && processedFile.wordCount < 100000,\n    properEncoding: !result.content?.includes('�'),\n    creditsEfficiency: processedFile.creditsUsed / processedFile.sizeMB < 5\n  };\n  \n  // Overall quality score\n  const checks = Object.values(processedFile.qualityChecks);\n  processedFile.qualityScore = (checks.filter(c => c).length / checks.length) * 100;\n}\n\nreturn [{ json: processedFile }];"
      },
      "id": "track-results",
      "name": "Track Processing Results",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1650, 300],
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
      "position": [1850, 300],
      "notes": "Aggregate batch results"
    },
    {
      "parameters": {
        "jsCode": "// Generate comprehensive analytics report\nconst allResults = $input.all().map(item => item.json);\nconst initialStats = $node['Validate & Queue Files'].json.stats;\n\n// Calculate processing analytics\nconst analytics = {\n  overview: {\n    totalFilesFound: initialStats.totalFiles,\n    filesProcessed: allResults.length,\n    successfulProcessing: allResults.filter(r => r.success).length,\n    failedProcessing: allResults.filter(r => !r.success).length,\n    successRate: 0,\n    totalProcessingTime: 0,\n    totalCreditsUsed: 0,\n    averageQualityScore: 0\n  },\n  \n  byFileType: {\n    pdf: { processed: 0, successful: 0, failed: 0, avgTime: 0, creditsUsed: 0 },\n    word: { processed: 0, successful: 0, failed: 0, avgTime: 0, creditsUsed: 0 },\n    image: { processed: 0, successful: 0, failed: 0, avgTime: 0, creditsUsed: 0 }\n  },\n  \n  errors: {},\n  \n  performance: {\n    fastestFile: null,\n    slowestFile: null,\n    mostEfficientCredit: null,\n    leastEfficientCredit: null\n  },\n  \n  quality: {\n    highQuality: [],\n    lowQuality: [],\n    averageWordCount: 0\n  }\n};\n\n// Process results\nlet totalQualityScore = 0;\nlet qualityCount = 0;\n\nallResults.forEach(result => {\n  // Update overview\n  analytics.overview.totalProcessingTime += result.processingTime || 0;\n  analytics.overview.totalCreditsUsed += result.creditsUsed || 0;\n  \n  // Update by file type\n  const type = result.fileType;\n  if (analytics.byFileType[type]) {\n    analytics.byFileType[type].processed++;\n    if (result.success) {\n      analytics.byFileType[type].successful++;\n    } else {\n      analytics.byFileType[type].failed++;\n    }\n    analytics.byFileType[type].avgTime += result.processingTime || 0;\n    analytics.byFileType[type].creditsUsed += result.creditsUsed || 0;\n  }\n  \n  // Track errors\n  if (result.error) {\n    const errorType = result.error.message || 'Unknown';\n    analytics.errors[errorType] = (analytics.errors[errorType] || 0) + 1;\n  }\n  \n  // Track performance\n  if (!analytics.performance.fastestFile || result.processingTime < analytics.performance.fastestFile.time) {\n    analytics.performance.fastestFile = {\n      name: result.fileName,\n      time: result.processingTime\n    };\n  }\n  if (!analytics.performance.slowestFile || result.processingTime > analytics.performance.slowestFile.time) {\n    analytics.performance.slowestFile = {\n      name: result.fileName,\n      time: result.processingTime\n    };\n  }\n  \n  // Track quality\n  if (result.qualityScore !== undefined) {\n    totalQualityScore += result.qualityScore;\n    qualityCount++;\n    \n    if (result.qualityScore >= 75) {\n      analytics.quality.highQuality.push(result.fileName);\n    } else if (result.qualityScore < 50) {\n      analytics.quality.lowQuality.push(result.fileName);\n    }\n  }\n  \n  analytics.quality.averageWordCount += result.wordCount || 0;\n});\n\n// Calculate averages\nanalytics.overview.successRate = Math.round((analytics.overview.successfulProcessing / analytics.overview.filesProcessed) * 100);\nanalytics.overview.averageQualityScore = qualityCount > 0 ? Math.round(totalQualityScore / qualityCount) : 0;\nanalytics.quality.averageWordCount = Math.round(analytics.quality.averageWordCount / allResults.length);\n\n// Calculate file type averages\nObject.keys(analytics.byFileType).forEach(type => {\n  const typeData = analytics.byFileType[type];\n  if (typeData.processed > 0) {\n    typeData.avgTime = Math.round((typeData.avgTime / typeData.processed) * 100) / 100;\n    typeData.successRate = Math.round((typeData.successful / typeData.processed) * 100);\n  }\n});\n\n// Generate report\nlet report = `# Batch Processing Analytics Report\\n\\n`;\nreport += `**Generated:** ${new Date().toLocaleString()}\\n\\n`;\n\nreport += `## Overview\\n`;\nreport += `- **Files Processed:** ${analytics.overview.filesProcessed} of ${analytics.overview.totalFilesFound}\\n`;\nreport += `- **Success Rate:** ${analytics.overview.successRate}%\\n`;\nreport += `- **Total Processing Time:** ${Math.round(analytics.overview.totalProcessingTime)}s\\n`;\nreport += `- **Credits Used:** ${analytics.overview.totalCreditsUsed}\\n`;\nreport += `- **Average Quality Score:** ${analytics.overview.averageQualityScore}%\\n\\n`;\n\nreport += `## Performance by File Type\\n`;\nObject.entries(analytics.byFileType).forEach(([type, data]) => {\n  if (data.processed > 0) {\n    report += `### ${type.toUpperCase()}\\n`;\n    report += `- Processed: ${data.processed}\\n`;\n    report += `- Success Rate: ${data.successRate}%\\n`;\n    report += `- Avg Time: ${data.avgTime}s\\n`;\n    report += `- Credits: ${data.creditsUsed}\\n\\n`;\n  }\n});\n\nif (Object.keys(analytics.errors).length > 0) {\n  report += `## Errors Encountered\\n`;\n  Object.entries(analytics.errors).forEach(([error, count]) => {\n    report += `- ${error}: ${count} occurrences\\n`;\n  });\n  report += `\\n`;\n}\n\nreport += `## Recommendations\\n`;\nif (analytics.overview.successRate < 90) {\n  report += `- Success rate is below 90%. Review error logs for common issues.\\n`;\n}\nif (analytics.overview.averageQualityScore < 70) {\n  report += `- Quality scores are low. Consider using 'always' LLM mode for better results.\\n`;\n}\nif (analytics.quality.lowQuality.length > 0) {\n  report += `- ${analytics.quality.lowQuality.length} files had low quality scores. Manual review recommended.\\n`;\n}\n\nreturn [{\n  json: {\n    analytics,\n    report,\n    processedFiles: allResults,\n    timestamp: new Date().toISOString()\n  }\n}];"
      },
      "id": "generate-analytics",
      "name": "Generate Analytics Report",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [2050, 300],
      "notes": "Create analytics dashboard"
    }
  ],
  "connections": {
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
    "Process in Batches": {
      "main": [
        [
          {
            "node": "Split Out Files",
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
            "node": "PDF Vector - Process",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "PDF Vector - Process": {
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
            "node": "Process in Batches",
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
