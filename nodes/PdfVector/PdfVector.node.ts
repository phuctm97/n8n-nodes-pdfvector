import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class PdfVector implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'PDF Vector',
		name: 'pdfVector',
		icon: 'file:icon.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Convert PDFs, Word, Excel documents, and images to clean markdown, extract structured data with AI, process invoices with specialized parsing, and search millions of academic papers across PubMed, ArXiv, Google Scholar, and more.',
		defaults: {
			name: 'PDF Vector',
		},
		documentationUrl: 'https://www.pdfvector.com/v1/api/scalar',
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'pdfVectorApi',
				required: true,
				testedBy: 'pdfVectorApiTest',
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Academic',
						value: 'academic',
					},
					{
						name: 'Document',
						value: 'document',
					},
					{
						name: 'Identity Document',
						value: 'identityDocument',
					},
					{
						name: 'Invoice',
						value: 'invoice',
					},
				],
				default: 'academic',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['academic'],
					},
				},
				options: [
					{
						name: 'Search',
						value: 'search',
						description: 'Search across PubMed, ArXiv, Google Scholar, and more',
						action: 'Search academic publications',
					},
					{
						name: 'Fetch',
						value: 'fetch',
						description: 'Fetch publications by DOI, PubMed ID, ArXiv ID, etc',
						action: 'Fetch a specific publication',
					},
				],
				default: 'search',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['document'],
					},
				},
				options: [
					{
						name: 'Parse',
						value: 'parse',
						description: 'Convert PDFs, Word, Excel, or images to markdown',
						action: 'Parse a document',
					},
					{
						name: 'Ask',
						value: 'ask',
						description: 'Ask questions about PDF, Word, Excel, or image',
						action: 'Ask questions about a document',
					},
					{
						name: 'Extract',
						value: 'extract',
						description:
							'Extract structured data from PDF, Word, Excel, or image using JSON Schema',
						action: 'Extract structured data from a document',
					},
				],
				default: 'parse',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
					},
				},
				options: [
					{
						name: 'Parse',
						value: 'parse',
						description: 'Parse invoice, expense, bank statement or financial document',
						action: 'Parse an invoice',
					},
					{
						name: 'Ask',
						value: 'ask',
						description:
							'Ask questions about invoice, expense, bank statement or financial document',
						action: 'Ask questions about an invoice',
					},
					{
						name: 'Extract',
						value: 'extract',
						description:
							'Extract invoice, expense, bank statement or financial document structured data',
						action: 'Extract structured data from an invoice',
					},
				],
				default: 'parse',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['identityDocument'],
					},
				},
				options: [
					{
						name: 'Parse',
						value: 'parse',
						description:
							'Parse identity documents (passports, driver licenses, ID cards, national IDs) to markdown',
						action: 'Parse an identity document',
					},
					{
						name: 'Ask',
						value: 'ask',
						description: 'Ask questions about identity document content',
						action: 'Ask questions about an identity document',
					},
					{
						name: 'Extract',
						value: 'extract',
						description: 'Extract structured data from identity documents using JSON Schema',
						action: 'Extract structured data from an identity document',
					},
				],
				default: 'parse',
			},
			// Academic Search Parameters
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['academic'],
						operation: ['search'],
					},
				},
				default: '',
				description: 'Search query for academic publications (1-400 characters)',
				placeholder: 'machine learning in healthcare',
			},
			{
				displayName: 'Providers',
				name: 'providers',
				type: 'multiOptions',
				displayOptions: {
					show: {
						resource: ['academic'],
						operation: ['search'],
					},
				},
				options: [
					{
						name: 'ArXiv',
						value: 'arxiv',
					},
					{
						name: 'ERIC',
						value: 'eric',
					},
					{
						name: 'Europe PMC',
						value: 'europe-pmc',
					},
					{
						name: 'Google Scholar',
						value: 'google-scholar',
					},
					{
						name: 'OpenAlex',
						value: 'openalex',
					},
					{
						name: 'PubMed',
						value: 'pubmed',
					},
					{
						name: 'Semantic Scholar',
						value: 'semantic-scholar',
					},
				],
				default: ['semantic-scholar'],
				description:
					'Academic database providers to search. Select multiple to search across databases.',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['academic'],
						operation: ['search'],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['academic'],
						operation: ['search'],
					},
				},
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Number of results to skip per provider',
			},
			{
				displayName: 'Year From',
				name: 'yearFrom',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['academic'],
						operation: ['search'],
					},
				},
				typeOptions: {
					minValue: 1900,
				},
				default: 1900,
				description: 'Filter results published after this year (inclusive)',
			},
			{
				displayName: 'Year To',
				name: 'yearTo',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['academic'],
						operation: ['search'],
					},
				},
				typeOptions: {
					maxValue: 2100,
				},
				default: 2050,
				description: 'Filter results published before this year (inclusive)',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['academic'],
						operation: ['search'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Fields',
						name: 'fields',
						type: 'multiOptions',
						options: [
							{
								name: 'Abstract',
								value: 'abstract',
							},
							{
								name: 'Authors',
								value: 'authors',
							},
							{
								name: 'Date',
								value: 'date',
							},
							{
								name: 'DOI',
								value: 'doi',
							},
							{
								name: 'PDF URL',
								value: 'pdfURL',
							},
							{
								name: 'Provider',
								value: 'provider',
							},
							{
								name: 'Provider Data',
								value: 'providerData',
							},
							{
								name: 'Provider URL',
								value: 'providerURL',
							},
							{
								name: 'Title',
								value: 'title',
							},
							{
								name: 'Total Citations',
								value: 'totalCitations',
							},
							{
								name: 'Total References',
								value: 'totalReferences',
							},
							{
								name: 'URL',
								value: 'url',
							},
							{
								name: 'Year',
								value: 'year',
							},
						],
						default: [],
						description: 'Fields to include in the response',
					},
				],
			},
			// Academic Fetch Parameters
			{
				displayName: 'IDs',
				name: 'ids',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['academic'],
						operation: ['fetch'],
					},
				},
				default: '',
				description:
					'Publication IDs with auto-detection. Supports DOI, PubMed ID, ArXiv ID, Semantic Scholar ID, ERIC ID, Europe PMC ID, and OpenAlex ID. Separate multiple IDs with commas (max 100).',
				placeholder: '10.1038/nature12373, PMC3883140, arXiv:1234.5678, ED123456',
			},
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'multiOptions',
				displayOptions: {
					show: {
						resource: ['academic'],
						operation: ['fetch'],
					},
				},
				options: [
					{
						name: 'Abstract',
						value: 'abstract',
					},
					{
						name: 'Authors',
						value: 'authors',
					},
					{
						name: 'Date',
						value: 'date',
					},
					{
						name: 'DOI',
						value: 'doi',
					},
					{
						name: 'PDF URL',
						value: 'pdfURL',
					},
					{
						name: 'Provider',
						value: 'provider',
					},
					{
						name: 'Provider Data',
						value: 'providerData',
					},
					{
						name: 'Provider URL',
						value: 'providerURL',
					},
					{
						name: 'Title',
						value: 'title',
					},
					{
						name: 'Total Citations',
						value: 'totalCitations',
					},
					{
						name: 'Total References',
						value: 'totalReferences',
					},
					{
						name: 'URL',
						value: 'url',
					},
					{
						name: 'Year',
						value: 'year',
					},
				],
				default: [],
				description: 'Fields to include in the response',
			},
			// Document Parse Parameters
			{
				displayName: 'Input Type',
				name: 'inputType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['parse'],
					},
				},
				options: [
					{
						name: 'URL',
						value: 'url',
						description: 'Provide a public URL to the document',
					},
					{
						name: 'File',
						value: 'file',
						description: 'Upload a PDF, Word, Excel, or image file',
					},
				],
				default: 'url',
				description: 'Choose how to provide the document',
			},
			{
				displayName: 'Document URL',
				name: 'url',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['parse'],
						inputType: ['url'],
					},
				},
				default: '',
				description: 'URL of the document to parse (PDF, Word, Excel, Image)',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['parse'],
						inputType: ['file'],
					},
				},
				description: 'Name of the binary property containing the file',
				hint: 'The name of the property that holds the binary data from the previous node',
			},
			{
				displayName: 'Use LLM',
				name: 'useLLM',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['parse'],
					},
				},
				options: [
					{
						name: 'Auto',
						value: 'auto',
						description: 'Automatically decide if LLM parsing is needed (1-2 credits per page)',
					},
					{
						name: 'Always',
						value: 'always',
						description: 'Always use LLM parsing (2 credits per page)',
					},
					{
						name: 'Never',
						value: 'never',
						description: 'Never use LLM parsing (1 credit per page)',
					},
				],
				default: 'auto',
				description: 'Determines LLM parsing approach',
			},
			// Document Ask Parameters
			{
				displayName: 'Input Type',
				name: 'inputType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['ask'],
					},
				},
				options: [
					{
						name: 'URL',
						value: 'url',
						description: 'Provide a public URL to the document',
					},
					{
						name: 'File',
						value: 'file',
						description: 'Upload a PDF, Word, Excel, or image file',
					},
				],
				default: 'url',
				description: 'Choose how to provide the document',
			},
			{
				displayName: 'Document URL',
				name: 'url',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['ask'],
						inputType: ['url'],
					},
				},
				default: '',
				description: 'URL of the document to ask questions about (PDF, Word, Excel, Image)',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['ask'],
						inputType: ['file'],
					},
				},
				description: 'Name of the binary property containing the file',
				hint: 'The name of the property that holds the binary data from the previous node',
			},
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['ask'],
					},
				},
				default: '',
				description: 'Question about the document (1-2000 characters)',
				typeOptions: {
					rows: 4,
				},
			},
			// Document Extract Parameters
			{
				displayName: 'Input Type',
				name: 'inputType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['extract'],
					},
				},
				options: [
					{
						name: 'URL',
						value: 'url',
						description: 'Provide a public URL to the document',
					},
					{
						name: 'File',
						value: 'file',
						description: 'Upload a PDF, Word, Excel, or image file',
					},
				],
				default: 'url',
				description: 'Choose how to provide the document',
			},
			{
				displayName: 'Document URL',
				name: 'url',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['extract'],
						inputType: ['url'],
					},
				},
				default: '',
				description: 'URL of the document to extract data from (PDF, Word, Excel, Image)',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['extract'],
						inputType: ['file'],
					},
				},
				description: 'Name of the binary property containing the file',
				hint: 'The name of the property that holds the binary data from the previous node',
			},
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['extract'],
					},
				},
				default: '',
				description: 'Instructions for data extraction (1-2000 characters)',
				typeOptions: {
					rows: 4,
				},
				placeholder: 'Extract all invoice details including line items, totals, and dates',
			},
			{
				displayName: 'JSON Schema',
				name: 'schema',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['extract'],
					},
				},
				default:
					'{\n  "type": "object",\n  "properties": {\n    "invoiceNumber": { "type": "string" },\n    "date": { "type": "string" },\n    "total": { "type": "number" },\n    "items": {\n      "type": "array",\n      "items": {\n        "type": "object",\n        "properties": {\n          "description": { "type": "string" },\n          "quantity": { "type": "number" },\n          "price": { "type": "number" }\n        }\n      }\n    }\n  },\n  "required": ["invoiceNumber"],\n  "additionalProperties": false\n}',
				description: 'JSON schema that defines the structure of data to extract',
				typeOptions: {
					rows: 10,
				},
				hint: 'Use our free [JSON Schema Editor](https://www.pdfvector.com/json-schema-editor) to create and validate your schema.',
			},
			// Invoice Parse Parameters
			{
				displayName: 'Input Type',
				name: 'inputType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['parse'],
					},
				},
				options: [
					{
						name: 'URL',
						value: 'url',
						description:
							'Provide a public URL to the invoice, expense, bank statement or financial document',
					},
					{
						name: 'File',
						value: 'file',
						description: 'Upload an invoice, expense, bank statement or financial document file',
					},
				],
				default: 'url',
				description: 'Choose how to provide the invoice',
			},
			{
				displayName: 'Invoice URL',
				name: 'url',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['parse'],
						inputType: ['url'],
					},
				},
				default: '',
				description:
					'URL of the invoice, expense, bank statement or financial document to parse (PDF, Word, Image)',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['parse'],
						inputType: ['file'],
					},
				},
				description: 'Name of the binary property containing the invoice file',
				hint: 'The name of the property that holds the binary data from the previous node',
			},
			// Invoice Ask Parameters
			{
				displayName: 'Input Type',
				name: 'inputType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['ask'],
					},
				},
				options: [
					{
						name: 'URL',
						value: 'url',
						description:
							'Provide a public URL to the invoice, expense, bank statement or financial document',
					},
					{
						name: 'File',
						value: 'file',
						description: 'Upload an invoice, expense, bank statement or financial document file',
					},
				],
				default: 'url',
				description: 'Choose how to provide the invoice',
			},
			{
				displayName: 'Invoice URL',
				name: 'url',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['ask'],
						inputType: ['url'],
					},
				},
				default: '',
				description:
					'URL of the invoice, expense, bank statement or financial document to ask questions about (PDF, Word, Image)',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['ask'],
						inputType: ['file'],
					},
				},
				description: 'Name of the binary property containing the invoice file',
				hint: 'The name of the property that holds the binary data from the previous node',
			},
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['ask'],
					},
				},
				default: '',
				description: 'Question about the invoice (1-2000 characters)',
				typeOptions: {
					rows: 4,
				},
				placeholder: 'What is the total amount and due date?',
			},
			// Invoice Extract Parameters
			{
				displayName: 'Input Type',
				name: 'inputType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['extract'],
					},
				},
				options: [
					{
						name: 'URL',
						value: 'url',
						description:
							'Provide a public URL to the invoice, expense, bank statement or financial document',
					},
					{
						name: 'File',
						value: 'file',
						description: 'Upload an invoice, expense, bank statement or financial document file',
					},
				],
				default: 'url',
				description: 'Choose how to provide the invoice',
			},
			{
				displayName: 'Invoice URL',
				name: 'url',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['extract'],
						inputType: ['url'],
					},
				},
				default: '',
				description:
					'URL of the invoice, expense, bank statement or financial document to extract data from (PDF, Word, Image)',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['extract'],
						inputType: ['file'],
					},
				},
				description: 'Name of the binary property containing the invoice file',
				hint: 'The name of the property that holds the binary data from the previous node',
			},
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['extract'],
					},
				},
				default: '',
				description: 'Instructions for data extraction from the invoice (1-2000 characters)',
				typeOptions: {
					rows: 4,
				},
				placeholder: 'Extract vendor details, line items, totals, taxes, and payment terms',
			},
			{
				displayName: 'JSON Schema',
				name: 'schema',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['extract'],
					},
				},
				default:
					'{\n  "type": "object",\n  "properties": {\n    "invoiceNumber": { "type": "string" },\n    "vendorName": { "type": "string" },\n    "date": { "type": "string" },\n    "dueDate": { "type": "string" },\n    "subtotal": { "type": "number" },\n    "tax": { "type": "number" },\n    "total": { "type": "number" },\n    "lineItems": {\n      "type": "array",\n      "items": {\n        "type": "object",\n        "properties": {\n          "description": { "type": "string" },\n          "quantity": { "type": "number" },\n          "unitPrice": { "type": "number" },\n          "amount": { "type": "number" }\n        }\n      }\n    }\n  },\n  "required": ["invoiceNumber", "total"],\n  "additionalProperties": false\n}',
				description: 'JSON schema that defines the structure of invoice data to extract',
				typeOptions: {
					rows: 10,
				},
				hint: 'Use our free [JSON Schema Editor](https://www.pdfvector.com/json-schema-editor) to create and validate your schema.',
			},
			// Identity Document Parse Parameters
			{
				displayName: 'Input Type',
				name: 'inputType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['identityDocument'],
						operation: ['parse'],
					},
				},
				options: [
					{
						name: 'URL',
						value: 'url',
						description: 'Provide a public URL to the identity document',
					},
					{
						name: 'File',
						value: 'file',
						description: 'Upload a PDF or image file of the identity document',
					},
				],
				default: 'url',
				description: 'Choose how to provide the identity document',
			},
			{
				displayName: 'Identity Document URL',
				name: 'url',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['identityDocument'],
						operation: ['parse'],
						inputType: ['url'],
					},
				},
				default: '',
				description:
					'URL of the identity document to parse (passport, driver license, ID card, national ID)',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						resource: ['identityDocument'],
						operation: ['parse'],
						inputType: ['file'],
					},
				},
				description: 'Name of the binary property containing the identity document file',
				hint: 'The name of the property that holds the binary data from the previous node',
			},
			// ID Document Ask Parameters
			{
				displayName: 'Input Type',
				name: 'inputType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['identityDocument'],
						operation: ['ask'],
					},
				},
				options: [
					{
						name: 'URL',
						value: 'url',
						description: 'Provide a public URL to the identity document',
					},
					{
						name: 'File',
						value: 'file',
						description: 'Upload a PDF or image file of the identity document',
					},
				],
				default: 'url',
				description: 'Choose how to provide the identity document',
			},
			{
				displayName: 'Identity Document URL',
				name: 'url',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['identityDocument'],
						operation: ['ask'],
						inputType: ['url'],
					},
				},
				default: '',
				description:
						'URL of the identity document to ask questions about (passport, driver license, ID card, national ID)',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						resource: ['identityDocument'],
						operation: ['ask'],
						inputType: ['file'],
					},
				},
				description: 'Name of the binary property containing the identity document file',
				hint: 'The name of the property that holds the binary data from the previous node',
			},
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['identityDocument'],
						operation: ['ask'],
					},
				},
				default: '',
				description: 'Question about the identity document (1-2000 characters)',
				typeOptions: {
					rows: 4,
				},
				placeholder: 'What is the full name, date of birth, and expiry date on this ID?',
			},
			// ID Document Extract Parameters
			{
				displayName: 'Input Type',
				name: 'inputType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['identityDocument'],
						operation: ['extract'],
					},
				},
				options: [
					{
						name: 'URL',
						value: 'url',
						description: 'Provide a public URL to the identity document',
					},
					{
						name: 'File',
						value: 'file',
						description: 'Upload a PDF or image file of the identity document',
					},
				],
				default: 'url',
				description: 'Choose how to provide the identity document',
			},
			{
				displayName: 'Identity Document URL',
				name: 'url',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['identityDocument'],
						operation: ['extract'],
						inputType: ['url'],
					},
				},
				default: '',
				description:
					'URL of the identity document to extract data from (passport, driver license, ID card, national ID)',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						resource: ['identityDocument'],
						operation: ['extract'],
						inputType: ['file'],
					},
				},
				description: 'Name of the binary property containing the identity document file',
				hint: 'The name of the property that holds the binary data from the previous node',
			},
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['identityDocument'],
						operation: ['extract'],
					},
				},
				default: '',
				description: 'Instructions for data extraction from the identity document (1-2000 characters)',
				typeOptions: {
					rows: 4,
				},
				placeholder: 'Extract all personal and document information from this identity document',
			},
			{
				displayName: 'JSON Schema',
				name: 'schema',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						resource: ['identityDocument'],
						operation: ['extract'],
					},
				},
				default:
					'{\n  "type": "object",\n  "properties": {\n    "documentType": { "type": "string" },\n    "documentNumber": { "type": "string" },\n    "issuingCountry": { "type": "string" },\n    "fullName": { "type": "string" },\n    "firstName": { "type": "string" },\n    "lastName": { "type": "string" },\n    "dateOfBirth": { "type": "string" },\n    "gender": { "type": "string" },\n    "nationality": { "type": "string" },\n    "address": { "type": "string" },\n    "issueDate": { "type": "string" },\n    "expiryDate": { "type": "string" }\n  },\n  "required": ["documentType", "documentNumber", "fullName"],\n  "additionalProperties": false\n}',
					description: 'JSON schema that defines the structure of identity document data to extract',
				typeOptions: {
					rows: 10,
				},
				hint: 'Use our free [JSON Schema Editor](https://www.pdfvector.com/json-schema-editor) to create and validate your schema.',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject = {};
				const baseURL = 'https://www.pdfvector.com/v1/api';

				switch (resource) {
					case 'academic': {
						if (operation === 'search') {
							const query = this.getNodeParameter('query', i) as string;
							const providers = this.getNodeParameter('providers', i) as string[];
							const limit = this.getNodeParameter('limit', i);
							const offset = this.getNodeParameter('offset', i) as number;
							const yearFrom = this.getNodeParameter('yearFrom', i) as number;
							const yearTo = this.getNodeParameter('yearTo', i) as number;
							const additionalFields = this.getNodeParameter('additionalFields', i);

							const body: IDataObject = {
								query,
								providers,
								limit,
								offset,
								yearFrom,
								yearTo,
							};

							// Add fields from additional fields
							if (
								additionalFields.fields &&
								Array.isArray(additionalFields.fields) &&
								additionalFields.fields.length > 0
							)
								body.fields = additionalFields.fields;

							responseData = (await this.helpers.httpRequestWithAuthentication.call(
								this,
								'pdfVectorApi',
								{
									method: 'POST' as IHttpRequestMethods,
									url: `${baseURL}/academic-search`,
									body,
									json: true,
								},
							)) as IDataObject;
						} else if (operation === 'fetch') {
							const idsString = this.getNodeParameter('ids', i) as string;
							const fields = this.getNodeParameter('fields', i) as string[];

							// Convert comma-separated IDs to array and trim whitespace
							const ids = String(idsString)
								.split(',')
								.map((id) => id.trim())
								.filter(Boolean);

							const body: IDataObject = {
								ids,
							};

							if (fields.length > 0) body.fields = fields;

							responseData = (await this.helpers.httpRequestWithAuthentication.call(
								this,
								'pdfVectorApi',
								{
									method: 'POST' as IHttpRequestMethods,
									url: `${baseURL}/academic-fetch`,
									body,
									json: true,
								},
							)) as IDataObject;
						}

						break;
					}
					case 'document': {
						if (operation === 'parse') {
							const inputType = this.getNodeParameter('inputType', i) as string;
							const useLLM = this.getNodeParameter('useLLM', i) as string;
							// Create a clean body object with only the required fields
							const body: IDataObject = {};

							// Always include useLLM
							body.useLLM = useLLM;

							if (inputType === 'file') {
								// Handle binary file upload - send as base64
								const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

								// Check if binary data exists
								if (!items[i].binary?.[binaryPropertyName]) {
									throw new NodeOperationError(
										this.getNode(),
										`No binary data found in property "${binaryPropertyName}"`,
										{ itemIndex: i },
									);
								}

								// Get the binary data reference
								const binaryData = items[i].binary![binaryPropertyName];

								// Get the buffer using n8n helper method
								const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

								// Check if buffer is empty
								if (!buffer || buffer.length === 0) {
									throw new NodeOperationError(
										this.getNode(),
										`Binary data in property "${binaryPropertyName}" is empty or invalid`,
										{ itemIndex: i },
									);
								}

								// Convert buffer to base64
								const base64File = buffer.toString('base64');

								// Send file as base64 in the request body
								body.file = base64File;

								// Optional: Add filename if available
								if (binaryData.fileName) {
									body.fileName = binaryData.fileName;
								}
							} else if (inputType === 'url') {
								// Use URL directly
								const documentUrl = this.getNodeParameter('url', i) as string;
								body.url = documentUrl;
							} else {
								throw new NodeOperationError(
									this.getNode(),
									`Invalid input type: ${inputType}. Must be either 'file' or 'url'`,
									{ itemIndex: i },
								);
							}

							responseData = (await this.helpers.httpRequestWithAuthentication.call(
								this,
								'pdfVectorApi',
								{
									method: 'POST' as IHttpRequestMethods,
									url: `${baseURL}/parse`,
									body,
									json: true,
								},
							)) as IDataObject;
						} else if (operation === 'ask') {
							const inputType = this.getNodeParameter('inputType', i) as string;
							const prompt = this.getNodeParameter('prompt', i) as string;

							// Create a clean body object with only the required fields
							const body: IDataObject = {};

							// Always include prompt
							body.prompt = prompt;

							if (inputType === 'file') {
								// Handle binary file upload - send as base64
								const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

								// Check if binary data exists
								if (!items[i].binary?.[binaryPropertyName]) {
									throw new NodeOperationError(
										this.getNode(),
										`No binary data found in property "${binaryPropertyName}"`,
										{ itemIndex: i },
									);
								}

								// Get the binary data reference
								const binaryData = items[i].binary![binaryPropertyName];

								// Get the buffer using n8n helper method
								const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

								// Check if buffer is empty
								if (!buffer || buffer.length === 0) {
									throw new NodeOperationError(
										this.getNode(),
										`Binary data in property "${binaryPropertyName}" is empty or invalid`,
										{ itemIndex: i },
									);
								}

								// Convert buffer to base64
								const base64File = buffer.toString('base64');

								// Send file as base64 in the request body
								body.file = base64File;

								// Optional: Add filename if available
								if (binaryData.fileName) {
									body.fileName = binaryData.fileName;
								}
							} else if (inputType === 'url') {
								// Use URL directly
								const documentUrl = this.getNodeParameter('url', i) as string;
								body.url = documentUrl;
							} else {
								throw new NodeOperationError(
									this.getNode(),
									`Invalid input type: ${inputType}. Must be either 'file' or 'url'`,
									{ itemIndex: i },
								);
							}

							responseData = (await this.helpers.httpRequestWithAuthentication.call(
								this,
								'pdfVectorApi',
								{
									method: 'POST' as IHttpRequestMethods,
									url: `${baseURL}/ask`,
									body,
									json: true,
								},
							)) as IDataObject;
						} else if (operation === 'extract') {
							const inputType = this.getNodeParameter('inputType', i) as string;
							const prompt = this.getNodeParameter('prompt', i) as string;
							const schemaString = this.getNodeParameter('schema', i) as string;

							// Create a clean body object with only the required fields
							const body: IDataObject = {};

							// Always include prompt
							body.prompt = prompt;

							// Parse and validate the JSON schema
							try {
								const schema = JSON.parse(schemaString);

								// Validate that the schema is an object type with additionalProperties: false
								if (schema.type !== 'object') {
									throw new NodeOperationError(this.getNode(), 'Schema must have type "object"', {
										itemIndex: i,
									});
								}

								if (schema.additionalProperties !== false) {
									throw new NodeOperationError(
										this.getNode(),
										'Schema must include "additionalProperties": false',
										{ itemIndex: i },
									);
								}

								body.schema = schema;
							} catch (error) {
								if (error instanceof NodeOperationError) {
									throw error;
								}
								throw new NodeOperationError(
									this.getNode(),
									`Invalid JSON schema: ${(error as Error).message}`,
									{ itemIndex: i },
								);
							}

							if (inputType === 'file') {
								// Handle binary file upload - send as base64
								const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

								// Check if binary data exists
								if (!items[i].binary?.[binaryPropertyName]) {
									throw new NodeOperationError(
										this.getNode(),
										`No binary data found in property "${binaryPropertyName}"`,
										{ itemIndex: i },
									);
								}

								// Get the binary data reference
								const binaryData = items[i].binary![binaryPropertyName];

								// Get the buffer using n8n helper method
								const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

								// Check if buffer is empty
								if (!buffer || buffer.length === 0) {
									throw new NodeOperationError(
										this.getNode(),
										`Binary data in property "${binaryPropertyName}" is empty or invalid`,
										{ itemIndex: i },
									);
								}

								// Convert buffer to base64
								const base64File = buffer.toString('base64');

								// Send file as base64 in the request body
								body.file = base64File;

								// Optional: Add filename if available
								if (binaryData.fileName) {
									body.fileName = binaryData.fileName;
								}
							} else if (inputType === 'url') {
								// Use URL directly
								const documentUrl = this.getNodeParameter('url', i) as string;
								body.url = documentUrl;
							} else {
								throw new NodeOperationError(
									this.getNode(),
									`Invalid input type: ${inputType}. Must be either 'file' or 'url'`,
									{ itemIndex: i },
								);
							}

							responseData = (await this.helpers.httpRequestWithAuthentication.call(
								this,
								'pdfVectorApi',
								{
									method: 'POST' as IHttpRequestMethods,
									url: `${baseURL}/extract`,
									body,
									json: true,
								},
							)) as IDataObject;
						}
						break;
					}
					case 'invoice': {
						if (operation === 'parse') {
							const inputType = this.getNodeParameter('inputType', i) as string;

							// Create a clean body object with only the required fields
							const body: IDataObject = {};

							if (inputType === 'file') {
								// Handle binary file upload - send as base64
								const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

								// Check if binary data exists
								if (!items[i].binary?.[binaryPropertyName]) {
									throw new NodeOperationError(
										this.getNode(),
										`No binary data found in property "${binaryPropertyName}"`,
										{ itemIndex: i },
									);
								}

								// Get the binary data reference
								const binaryData = items[i].binary![binaryPropertyName];

								// Get the buffer using n8n helper method
								const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

								// Check if buffer is empty
								if (!buffer || buffer.length === 0) {
									throw new NodeOperationError(
										this.getNode(),
										`Binary data in property "${binaryPropertyName}" is empty or invalid`,
										{ itemIndex: i },
									);
								}

								// Convert buffer to base64
								const base64File = buffer.toString('base64');

								// Send file as base64 in the request body
								body.file = base64File;

								// Optional: Add filename if available
								if (binaryData.fileName) {
									body.fileName = binaryData.fileName;
								}
							} else if (inputType === 'url') {
								// Use URL directly
								const invoiceUrl = this.getNodeParameter('url', i) as string;
								body.url = invoiceUrl;
							} else {
								throw new NodeOperationError(
									this.getNode(),
									`Invalid input type: ${inputType}. Must be either 'file' or 'url'`,
									{ itemIndex: i },
								);
							}

							responseData = (await this.helpers.httpRequestWithAuthentication.call(
								this,
								'pdfVectorApi',
								{
									method: 'POST' as IHttpRequestMethods,
									url: `${baseURL}/invoice-parse`,
									body,
									json: true,
								},
							)) as IDataObject;
						} else if (operation === 'ask') {
							const inputType = this.getNodeParameter('inputType', i) as string;
							const prompt = this.getNodeParameter('prompt', i) as string;

							// Create a clean body object with only the required fields
							const body: IDataObject = {};

							// Always include prompt
							body.prompt = prompt;

							if (inputType === 'file') {
								// Handle binary file upload - send as base64
								const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

								// Check if binary data exists
								if (!items[i].binary?.[binaryPropertyName]) {
									throw new NodeOperationError(
										this.getNode(),
										`No binary data found in property "${binaryPropertyName}"`,
										{ itemIndex: i },
									);
								}

								// Get the binary data reference
								const binaryData = items[i].binary![binaryPropertyName];

								// Get the buffer using n8n helper method
								const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

								// Check if buffer is empty
								if (!buffer || buffer.length === 0) {
									throw new NodeOperationError(
										this.getNode(),
										`Binary data in property "${binaryPropertyName}" is empty or invalid`,
										{ itemIndex: i },
									);
								}

								// Convert buffer to base64
								const base64File = buffer.toString('base64');

								// Send file as base64 in the request body
								body.file = base64File;

								// Optional: Add filename if available
								if (binaryData.fileName) {
									body.fileName = binaryData.fileName;
								}
							} else if (inputType === 'url') {
								// Use URL directly
								const invoiceUrl = this.getNodeParameter('url', i) as string;
								body.url = invoiceUrl;
							} else {
								throw new NodeOperationError(
									this.getNode(),
									`Invalid input type: ${inputType}. Must be either 'file' or 'url'`,
									{ itemIndex: i },
								);
							}

							responseData = (await this.helpers.httpRequestWithAuthentication.call(
								this,
								'pdfVectorApi',
								{
									method: 'POST' as IHttpRequestMethods,
									url: `${baseURL}/invoice-ask`,
									body,
									json: true,
								},
							)) as IDataObject;
						} else if (operation === 'extract') {
							const inputType = this.getNodeParameter('inputType', i) as string;
							const prompt = this.getNodeParameter('prompt', i) as string;
							const schemaString = this.getNodeParameter('schema', i) as string;

							// Create a clean body object with only the required fields
							const body: IDataObject = {};

							// Always include prompt
							body.prompt = prompt;

							// Parse and validate the JSON schema
							try {
								const schema = JSON.parse(schemaString);

								// Validate that the schema is an object type with additionalProperties: false
								if (schema.type !== 'object') {
									throw new NodeOperationError(this.getNode(), 'Schema must have type "object"', {
										itemIndex: i,
									});
								}

								if (schema.additionalProperties !== false) {
									throw new NodeOperationError(
										this.getNode(),
										'Schema must include "additionalProperties": false',
										{ itemIndex: i },
									);
								}

								body.schema = schema;
							} catch (error) {
								if (error instanceof NodeOperationError) {
									throw error;
								}
								throw new NodeOperationError(
									this.getNode(),
									`Invalid JSON schema: ${(error as Error).message}`,
									{ itemIndex: i },
								);
							}

							if (inputType === 'file') {
								// Handle binary file upload - send as base64
								const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

								// Check if binary data exists
								if (!items[i].binary?.[binaryPropertyName]) {
									throw new NodeOperationError(
										this.getNode(),
										`No binary data found in property "${binaryPropertyName}"`,
										{ itemIndex: i },
									);
								}

								// Get the binary data reference
								const binaryData = items[i].binary![binaryPropertyName];

								// Get the buffer using n8n helper method
								const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

								// Check if buffer is empty
								if (!buffer || buffer.length === 0) {
									throw new NodeOperationError(
										this.getNode(),
										`Binary data in property "${binaryPropertyName}" is empty or invalid`,
										{ itemIndex: i },
									);
								}

								// Convert buffer to base64
								const base64File = buffer.toString('base64');

								// Send file as base64 in the request body
								body.file = base64File;

								// Optional: Add filename if available
								if (binaryData.fileName) {
									body.fileName = binaryData.fileName;
								}
							} else if (inputType === 'url') {
								// Use URL directly
								const invoiceUrl = this.getNodeParameter('url', i) as string;
								body.url = invoiceUrl;
							} else {
								throw new NodeOperationError(
									this.getNode(),
									`Invalid input type: ${inputType}. Must be either 'file' or 'url'`,
									{ itemIndex: i },
								);
							}

							responseData = (await this.helpers.httpRequestWithAuthentication.call(
								this,
								'pdfVectorApi',
								{
									method: 'POST' as IHttpRequestMethods,
									url: `${baseURL}/invoice-extract`,
									body,
									json: true,
								},
							)) as IDataObject;
						}
						break;
					}
					case 'identityDocument': {
						if (operation === 'parse') {
							const inputType = this.getNodeParameter('inputType', i) as string;

							// Create a clean body object with only the required fields
							const body: IDataObject = {};

							if (inputType === 'file') {
								// Handle binary file upload - send as base64
								const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

								// Check if binary data exists
								if (!items[i].binary?.[binaryPropertyName]) {
									throw new NodeOperationError(
										this.getNode(),
										`No binary data found in property "${binaryPropertyName}"`,
										{ itemIndex: i },
									);
								}

								// Get the binary data reference
								const binaryData = items[i].binary![binaryPropertyName];

								// Get the buffer using n8n helper method
								const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

								// Check if buffer is empty
								if (!buffer || buffer.length === 0) {
									throw new NodeOperationError(
										this.getNode(),
										`Binary data in property "${binaryPropertyName}" is empty or invalid`,
										{ itemIndex: i },
									);
								}

								// Convert buffer to base64
								const base64File = buffer.toString('base64');

								// Send file as base64 in the request body
								body.file = base64File;

								// Optional: Add filename if available
								if (binaryData.fileName) {
									body.fileName = binaryData.fileName;
								}
							} else if (inputType === 'url') {
								// Use URL directly
								const idDocumentUrl = this.getNodeParameter('url', i) as string;
								body.url = idDocumentUrl;
							} else {
								throw new NodeOperationError(
									this.getNode(),
									`Invalid input type: ${inputType}. Must be either 'file' or 'url'`,
									{ itemIndex: i },
								);
							}

							responseData = (await this.helpers.httpRequestWithAuthentication.call(
								this,
								'pdfVectorApi',
								{
									method: 'POST' as IHttpRequestMethods,
									url: `${baseURL}/id-parse`,
									body,
									json: true,
								},
							)) as IDataObject;
						} else if (operation === 'ask') {
							const inputType = this.getNodeParameter('inputType', i) as string;
							const prompt = this.getNodeParameter('prompt', i) as string;

							// Create a clean body object with only the required fields
							const body: IDataObject = {};

							// Always include prompt
							body.prompt = prompt;

							if (inputType === 'file') {
								// Handle binary file upload - send as base64
								const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

								// Check if binary data exists
								if (!items[i].binary?.[binaryPropertyName]) {
									throw new NodeOperationError(
										this.getNode(),
										`No binary data found in property "${binaryPropertyName}"`,
										{ itemIndex: i },
									);
								}

								// Get the binary data reference
								const binaryData = items[i].binary![binaryPropertyName];

								// Get the buffer using n8n helper method
								const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

								// Check if buffer is empty
								if (!buffer || buffer.length === 0) {
									throw new NodeOperationError(
										this.getNode(),
										`Binary data in property "${binaryPropertyName}" is empty or invalid`,
										{ itemIndex: i },
									);
								}

								// Convert buffer to base64
								const base64File = buffer.toString('base64');

								// Send file as base64 in the request body
								body.file = base64File;

								// Optional: Add filename if available
								if (binaryData.fileName) {
									body.fileName = binaryData.fileName;
								}
							} else if (inputType === 'url') {
								// Use URL directly
								const idDocumentUrl = this.getNodeParameter('url', i) as string;
								body.url = idDocumentUrl;
							} else {
								throw new NodeOperationError(
									this.getNode(),
									`Invalid input type: ${inputType}. Must be either 'file' or 'url'`,
									{ itemIndex: i },
								);
							}

							responseData = (await this.helpers.httpRequestWithAuthentication.call(
								this,
								'pdfVectorApi',
								{
									method: 'POST' as IHttpRequestMethods,
									url: `${baseURL}/id-ask`,
									body,
									json: true,
								},
							)) as IDataObject;
						} else if (operation === 'extract') {
							const inputType = this.getNodeParameter('inputType', i) as string;
							const prompt = this.getNodeParameter('prompt', i) as string;
							const schemaString = this.getNodeParameter('schema', i) as string;

							// Create a clean body object with only the required fields
							const body: IDataObject = {};

							// Always include prompt
							body.prompt = prompt;

							// Parse and validate the JSON schema
							try {
								const schema = JSON.parse(schemaString);

								// Validate that the schema is an object type with additionalProperties: false
								if (schema.type !== 'object') {
									throw new NodeOperationError(this.getNode(), 'Schema must have type "object"', {
										itemIndex: i,
									});
								}

								if (schema.additionalProperties !== false) {
									throw new NodeOperationError(
										this.getNode(),
										'Schema must include "additionalProperties": false',
										{ itemIndex: i },
									);
								}

								body.schema = schema;
							} catch (error) {
								if (error instanceof NodeOperationError) {
									throw error;
								}
								throw new NodeOperationError(
									this.getNode(),
									`Invalid JSON schema: ${(error as Error).message}`,
									{ itemIndex: i },
								);
							}

							if (inputType === 'file') {
								// Handle binary file upload - send as base64
								const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

								// Check if binary data exists
								if (!items[i].binary?.[binaryPropertyName]) {
									throw new NodeOperationError(
										this.getNode(),
										`No binary data found in property "${binaryPropertyName}"`,
										{ itemIndex: i },
									);
								}

								// Get the binary data reference
								const binaryData = items[i].binary![binaryPropertyName];

								// Get the buffer using n8n helper method
								const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

								// Check if buffer is empty
								if (!buffer || buffer.length === 0) {
									throw new NodeOperationError(
										this.getNode(),
										`Binary data in property "${binaryPropertyName}" is empty or invalid`,
										{ itemIndex: i },
									);
								}

								// Convert buffer to base64
								const base64File = buffer.toString('base64');

								// Send file as base64 in the request body
								body.file = base64File;

								// Optional: Add filename if available
								if (binaryData.fileName) {
									body.fileName = binaryData.fileName;
								}
							} else if (inputType === 'url') {
								// Use URL directly
								const idDocumentUrl = this.getNodeParameter('url', i) as string;
								body.url = idDocumentUrl;
							} else {
								throw new NodeOperationError(
									this.getNode(),
									`Invalid input type: ${inputType}. Must be either 'file' or 'url'`,
									{ itemIndex: i },
								);
							}

							responseData = (await this.helpers.httpRequestWithAuthentication.call(
								this,
								'pdfVectorApi',
								{
									method: 'POST' as IHttpRequestMethods,
									url: `${baseURL}/id-extract`,
									body,
									json: true,
								},
							)) as IDataObject;
						}
						break;
					}
					// No default
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					let errorMessage = (error as Error).message;
					let errorDetails: IDataObject = { error: errorMessage };

					// Handle API-specific error responses
					if ((error as any).response) {
						const response = (error as any).response;
						if (response.body) {
							errorDetails = {
								error: response.body.error || response.body.message || errorMessage,
								statusCode: response.statusCode,
								details: response.body,
							};
						} else {
							errorDetails = {
								error: errorMessage,
								statusCode: response.statusCode,
							};
						}

						// Provide user-friendly messages for common errors
						if (response.statusCode === 401) {
							errorDetails.error = 'Invalid API key. Please check your PDFVector API credentials.';
						} else if (response.statusCode === 402) {
							errorDetails.error =
								'Insufficient credits. Please add more credits to your PDFVector account.';
						} else if (response.statusCode === 429) {
							errorDetails.error = 'Rate limit exceeded. Please wait before making more requests.';
						} else if (response.statusCode === 400) {
							errorDetails.error = `Bad request: ${errorDetails.error}`;
						}
					}

					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(errorDetails),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
