import type { IExecuteFunctions } from 'n8n-workflow';
import type { JsonRequestBody, JsonRequestModel, JsonRequestSchema } from '../shared/api.js';
import { apiRequest, getDocumentInput } from '../shared/helpers.js';
import { allModelOptions, makeDocumentProperties, proMaxModelOptions } from '../shared/options.js';

type InvoiceAskRequest = JsonRequestBody<'/invoice/ask'>;
type InvoiceExtractRequest = JsonRequestBody<'/invoice/extract'>;

export const invoiceProperties = makeDocumentProperties(
	'invoice',
	'Invoice',
	proMaxModelOptions,
	allModelOptions,
);

export async function executeInvoice(
	ef: IExecuteFunctions,
	domain: string,
	operation: string,
	i: number,
): Promise<Record<string, unknown>> {
	const input = await getDocumentInput(ef, i);
	const documentId = ef.getNodeParameter('documentId', i, '') as string;

	if (operation === 'parse') {
		const model = ef.getNodeParameter('model', i, 'auto') as JsonRequestModel<'/invoice/parse'>;
		return await apiRequest(ef, domain, '/invoice/parse', { ...input, model }, documentId);
	}
	if (operation === 'ask') {
		const question = ef.getNodeParameter('question', i) as InvoiceAskRequest['question'];
		const model = ef.getNodeParameter('model', i, 'auto') as JsonRequestModel<'/invoice/ask'>;
		return await apiRequest(
			ef,
			domain,
			'/invoice/ask',
			{ ...input, question, model },
			documentId,
		);
	}
	if (operation === 'extract') {
		const prompt = ef.getNodeParameter('prompt', i) as InvoiceExtractRequest['prompt'];
		const schemaParameter = ef.getNodeParameter('schema', i) as InvoiceExtractRequest['schema'];
		const model = ef.getNodeParameter('model', i, 'auto') as JsonRequestModel<'/invoice/extract'>;
		const schema =
			typeof schemaParameter === 'string'
				? (JSON.parse(schemaParameter) as JsonRequestSchema<'/invoice/extract'>)
				: schemaParameter;
		return await apiRequest(
			ef,
			domain,
			'/invoice/extract',
			{ ...input, prompt, schema, model },
			documentId,
		);
	}
	return {};
}
