import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import type { ApiOperation, ApiRequestBodyFor, ApiResource } from './helpers.js';

type TypedOption<TValue extends string> = INodePropertyOptions & { value: TValue };
type OptionMetadata = Pick<INodePropertyOptions, 'name' | 'description'>;
type ActionOptionMetadata = OptionMetadata & Pick<INodePropertyOptions, 'action'>;
type DocumentResource = Exclude<ApiResource, 'academic'>;
type DocumentOperation = ApiOperation<'document'>;
type DocumentParseModel = NonNullable<ApiRequestBodyFor<'document', 'parse'>['model']>;
type DocumentAiModel = NonNullable<ApiRequestBodyFor<'document', 'ask'>['model']>;
type IdentityParseModel = NonNullable<ApiRequestBodyFor<'identity', 'parse'>['model']>;
type IdentityAiModel = NonNullable<ApiRequestBodyFor<'identity', 'ask'>['model']>;
type InvoiceParseModel = NonNullable<ApiRequestBodyFor<'invoice', 'parse'>['model']>;
type InvoiceAiModel = NonNullable<ApiRequestBodyFor<'invoice', 'ask'>['model']>;
type BankStatementParseModel = NonNullable<ApiRequestBodyFor<'bankStatement', 'parse'>['model']>;
type BankStatementAiModel = NonNullable<ApiRequestBodyFor<'bankStatement', 'ask'>['model']>;

export function toTypedOptions<TValue extends string>(
	optionMetadata: Record<TValue, OptionMetadata>,
): TypedOption<TValue>[] {
	return (Object.entries(optionMetadata) as Array<[TValue, OptionMetadata]>).map(
		([value, metadata]) => ({
			...metadata,
			value,
		}),
	);
}

export function toActionOptions<TValue extends string>(
	optionMetadata: Record<TValue, ActionOptionMetadata>,
): TypedOption<TValue>[] {
	return (Object.entries(optionMetadata) as Array<[TValue, ActionOptionMetadata]>).map(
		([value, metadata]) => ({
			...metadata,
			value,
		}),
	);
}

function defineOptionMetadata<TValue extends string>(
	optionMetadata: Record<TValue, OptionMetadata>,
): Record<TValue, OptionMetadata> {
	return optionMetadata;
}

// ─── Model options ──────────────────────────────────────────

const generalModelOptionMetadata = {
	auto: {
		name: 'Auto',
		description:
			'Automatically selects the best model. Supports PDF, Word, Excel, CSV, Image. Up to 1000 pages, 500MB.',
	},
	nano: {
		name: 'Nano',
		description: 'Lightweight. PDF, Word, Excel, CSV only. Up to 30 pages, 10MB.',
	},
	mini: {
		name: 'Mini',
		description: 'Tables & structured content. PDF, Word, Excel, CSV only. Up to 30 pages, 10MB.',
	},
	pro: {
		name: 'Pro',
		description:
			'Images, handwriting, math, Arabic. PDF, Word, Excel, CSV, Image. Up to 30 pages, 40MB.',
	},
	max: {
		name: 'Max',
		description:
			'Full capabilities + enhanced multilingual + HTML output. PDF, Word, Excel, CSV, Image. Up to 1000 pages, 500MB.',
	},
};

const specializedParseModelOptionMetadata = {
	auto: {
		name: 'Auto',
		description: 'Automatically selects the best parsing strategy for structured document extraction',
	},
	pro: {
		name: 'Pro',
		description: 'Standard accuracy for structured parsing',
	},
	max: {
		name: 'Max',
		description: 'Highest structured-parsing accuracy with HTML output when available',
	},
};

export const documentParseModelOptions = toTypedOptions(
	defineOptionMetadata<DocumentParseModel>(generalModelOptionMetadata),
);
export const allModelOptions = toTypedOptions(
	defineOptionMetadata<DocumentAiModel>(generalModelOptionMetadata),
);

const identityParseModelOptions = toTypedOptions(
	defineOptionMetadata<IdentityParseModel>(specializedParseModelOptionMetadata),
);
const identityAiModelOptions = toTypedOptions(
	defineOptionMetadata<IdentityAiModel>(generalModelOptionMetadata),
);
const invoiceParseModelOptions = toTypedOptions(
	defineOptionMetadata<InvoiceParseModel>(specializedParseModelOptionMetadata),
);
const invoiceAiModelOptions = toTypedOptions(
	defineOptionMetadata<InvoiceAiModel>(generalModelOptionMetadata),
);
const bankStatementParseModelOptions = toTypedOptions(
	defineOptionMetadata<BankStatementParseModel>(specializedParseModelOptionMetadata),
);
const bankStatementAiModelOptions = toTypedOptions(
	defineOptionMetadata<BankStatementAiModel>(generalModelOptionMetadata),
);

const parseModelOptionsByResource = {
	document: documentParseModelOptions,
	identity: identityParseModelOptions,
	invoice: invoiceParseModelOptions,
	bankStatement: bankStatementParseModelOptions,
};

const aiModelOptionsByResource = {
	document: allModelOptions,
	identity: identityAiModelOptions,
	invoice: invoiceAiModelOptions,
	bankStatement: bankStatementAiModelOptions,
};

// ─── Shared document-like properties builder ────────────────

export function makeDocumentProperties(
	resource: DocumentResource,
	label: string,
): INodeProperties[] {
	const parseModelOptions = parseModelOptionsByResource[resource];
	const aiModelOptions = aiModelOptionsByResource[resource];
	const operationOptions = toActionOptions<DocumentOperation>({
		parse: {
			name: 'Parse',
			description: `Extract text and page count from a ${label.toLowerCase()}`,
			action: `Parse a ${label.toLowerCase()}`,
		},
		ask: {
			name: 'Ask',
			description: `Ask a question about a ${label.toLowerCase()} and get an AI answer`,
			action: `Ask about a ${label.toLowerCase()}`,
		},
		extract: {
			name: 'Extract',
			description: `Extract structured data from a ${label.toLowerCase()} using JSON Schema`,
			action: `Extract from a ${label.toLowerCase()}`,
		},
	});

	return [
		{
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			noDataExpression: true,
			displayOptions: { show: { resource: [resource] } },
			options: operationOptions,
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
			options: parseModelOptions,
			default: 'auto',
			displayOptions: { show: { resource: [resource], operation: ['parse'] } },
			description: 'AI model tier for parsing. Higher tiers support more complex documents but cost more credits.',
		},
		{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				options: aiModelOptions,
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
