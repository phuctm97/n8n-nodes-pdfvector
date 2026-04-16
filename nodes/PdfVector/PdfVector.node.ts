import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { academicProperties, executeAcademic } from './academic/index.js';
import { bankStatementProperties, executeBankStatement } from './bankStatement/index.js';
import { documentProperties, executeDocument } from './document/index.js';
import { identityProperties, executeIdentity } from './identity/index.js';
import { invoiceProperties, executeInvoice } from './invoice/index.js';

export class PdfVector implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'PDF Vector',
		name: 'pdfVector',
		icon: 'file:icon.svg',
		group: ['transform'],
		usableAsTool: true,
		version: 2,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Convert PDFs, Word, Excel documents, and images to clean markdown, extract structured data with AI, process invoices with specialized parsing, and search millions of academic papers across PubMed, ArXiv, Google Scholar, and more.',
		documentationUrl: 'https://global.pdfvector.com/api/reference',
		defaults: { name: 'PDF Vector' },
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'pdfVectorApi', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Academic', value: 'academic' },
					{ name: 'Bank Statement', value: 'bankStatement' },
					{ name: 'Document', value: 'document' },
					{ name: 'Identity Document', value: 'identity' },
					{ name: 'Invoice', value: 'invoice' },
				],
				default: 'document',
			},
			...documentProperties,
			...identityProperties,
			...invoiceProperties,
			...bankStatementProperties,
			...academicProperties,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('pdfVectorApi');
		const domain = (credentials.domain as string) || 'global.pdfvector.com';

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: Record<string, unknown> = {};

				switch (resource) {
					case 'document':
						result = await executeDocument(this, domain, operation, i);
						break;
					case 'identity':
						result = await executeIdentity(this, domain, operation, i);
						break;
					case 'invoice':
						result = await executeInvoice(this, domain, operation, i);
						break;
					case 'bankStatement':
						result = await executeBankStatement(this, domain, operation, i);
						break;
					case 'academic':
						result = await executeAcademic(this, domain, operation, i);
						break;
				}

				returnData.push({ json: result as IDataObject, pairedItem: { item: i } });
			} catch (error) {
				if (this.continueOnFail()) {
					let message: string;
					if (error instanceof Error && 'code' in error) {
						const err = error as Error & { code: string };
						message = `[${err.code}] ${err.message}`;
					} else if (error instanceof Error) {
						message = error.message;
					} else {
						message = String(error);
					}
					returnData.push({ json: { error: message }, pairedItem: { item: i } });
					continue;
				}
				if (error && typeof error === 'object' && 'context' in error) {
					const errorWithContext = error as { context?: { itemIndex?: number } };
					errorWithContext.context ??= {};
					errorWithContext.context.itemIndex = i;
					throw error;
				}
				if (
					error &&
					typeof error === 'object' &&
					('statusCode' in error || 'response' in error || 'httpCode' in error)
				) {
					throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
				}
				throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
