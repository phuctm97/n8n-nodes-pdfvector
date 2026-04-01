import type { INodeProperties } from 'n8n-workflow';
import type { JsonRequestModel, OptionValue } from './api.js';

// ─── Model options ──────────────────────────────────────────

export const allModelOptions: Array<OptionValue<JsonRequestModel<'/document/ask'>>> = [
	{
		name: 'Auto',
		value: 'auto',
		description:
			'Automatically selects the best model. Supports PDF, Word, Excel, CSV, Image. Up to 1000 pages, 500MB.',
	},
	{
		name: 'Nano',
		value: 'nano',
		description: 'Lightweight. PDF, Word, Excel, CSV only. Up to 30 pages, 10MB.',
	},
	{
		name: 'Mini',
		value: 'mini',
		description: 'Tables & structured content. PDF, Word, Excel, CSV only. Up to 30 pages, 10MB.',
	},
	{
		name: 'Pro',
		value: 'pro',
		description:
			'Images, handwriting, math, Arabic. PDF, Word, Excel, CSV, Image. Up to 30 pages, 40MB.',
	},
	{
		name: 'Max',
		value: 'max',
		description:
			'Full capabilities + enhanced multilingual + HTML output. PDF, Word, Excel, CSV, Image. Up to 1000 pages, 500MB.',
	},
];

export const proMaxModelOptions: Array<OptionValue<JsonRequestModel<'/identity/parse'>>> = [
	{ name: 'Auto', value: 'auto', description: 'Automatically selects between Pro and Max' },
	{ name: 'Pro', value: 'pro', description: 'Standard accuracy' },
	{ name: 'Max', value: 'max', description: 'Highest accuracy with HTML output' },
];

// ─── Shared document-like properties builder ────────────────

export function makeDocumentProperties(
	resource: string,
	label: string,
	parseModelOptions: ReadonlyArray<OptionValue<string>>,
	askExtractModelOptions: ReadonlyArray<OptionValue<string>>,
): INodeProperties[] {
	return [
		{
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			noDataExpression: true,
			displayOptions: { show: { resource: [resource] } },
			options: [
				{
					name: 'Parse',
					value: 'parse',
					description: `Extract text and page count from a ${label.toLowerCase()}`,
					action: `Parse a ${label.toLowerCase()}`,
				},
				{
					name: 'Ask',
					value: 'ask',
					description: `Ask a question about a ${label.toLowerCase()} and get an AI answer`,
					action: `Ask about a ${label.toLowerCase()}`,
				},
				{
					name: 'Extract',
					value: 'extract',
					description: `Extract structured data from a ${label.toLowerCase()} using JSON Schema`,
					action: `Extract from a ${label.toLowerCase()}`,
				},
			],
			default: 'parse',
		},
		{
			displayName: 'Input Type',
			name: 'inputType',
			type: 'options',
			options: [
				{ name: 'URL', value: 'url', description: 'Provide a public URL to the file' },
				{ name: 'Binary Data', value: 'file', description: 'Use binary data from a previous node' },
			],
			default: 'url',
			displayOptions: { show: { resource: [resource] } },
			description: `How to provide the ${label.toLowerCase()}`,
		},
		{
			displayName: `${label} URL`,
			name: 'url',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'https://example.com/document.pdf',
			displayOptions: { show: { resource: [resource], inputType: ['url'] } },
			description: `Public URL of the ${label.toLowerCase()} file (PDF, DOCX, XLSX, CSV, PNG, JPG)`,
		},
		{
			displayName: 'Input Binary Field',
			name: 'binaryPropertyName',
			type: 'string',
			default: 'data',
			required: true,
			hint: 'The name of the input binary field containing the file',
			displayOptions: { show: { resource: [resource], inputType: ['file'] } },
			description: 'Name of the binary property from a previous node',
		},
		{
			displayName: 'Model',
			name: 'model',
			type: 'options',
			options: [...parseModelOptions],
			default: 'auto',
			displayOptions: { show: { resource: [resource], operation: ['parse'] } },
			description: 'AI model tier for parsing. Higher tiers support more complex documents but cost more credits.',
		},
		{
			displayName: 'Model',
			name: 'model',
			type: 'options',
			options: [...askExtractModelOptions],
			default: 'auto',
			displayOptions: { show: { resource: [resource], operation: ['ask', 'extract'] } },
			description: 'AI model tier. Higher tiers produce better results but cost more credits.',
		},
		{
			displayName: 'Question',
			name: 'question',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'What are the main findings of this document?',
			typeOptions: { rows: 3 },
			displayOptions: { show: { resource: [resource], operation: ['ask'] } },
			description: `The question to ask about the ${label.toLowerCase()}. Min 4 characters.`,
		},
		{
			displayName: 'Extraction Prompt',
			name: 'prompt',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'Extract the title, authors, and publication year',
			typeOptions: { rows: 3 },
			displayOptions: { show: { resource: [resource], operation: ['extract'] } },
			description: `Instructions for what data to extract from the ${label.toLowerCase()}. Min 4 characters.`,
		},
		{
			displayName: 'JSON Schema',
			name: 'schema',
			type: 'json',
			default:
				'{\n  "type": "object",\n  "properties": {\n    "title": { "type": "string" },\n    "summary": { "type": "string" }\n  },\n  "required": ["title"]\n}',
			required: true,
			displayOptions: { show: { resource: [resource], operation: ['extract'] } },
			description: 'JSON Schema defining the structure of the data to extract',
		},
		{
			displayName: 'Document ID',
			name: 'documentId',
			type: 'string',
			default: '',
			placeholder: 'my-doc-123',
			displayOptions: { show: { resource: [resource] } },
			description: 'Optional identifier for usage tracking. Returned in the response.',
		},
	];
}
