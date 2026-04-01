import type { IExecuteFunctions } from 'n8n-workflow';
import type { JsonRequestBody } from '../shared/api-types.js';
import { apiRequest, getDocumentInput } from '../shared/helpers.js';
import { makeDocumentProperties } from '../shared/options.js';

export const invoiceProperties = makeDocumentProperties('invoice', 'Invoice');

export async function executeInvoice(
	ef: IExecuteFunctions,
	domain: string,
	apiKey: string,
	operation: string,
	i: number,
): Promise<Record<string, unknown>> {
	const input = await getDocumentInput(ef, i);
	const documentId = ef.getNodeParameter('documentId', i, '') as string;

	if (operation === 'parse') {
		const model = ef.getNodeParameter('model', i, 'auto') as JsonRequestBody<'/invoice/parse'>['model'];
		const body: JsonRequestBody<'/invoice/parse'> = { ...input, model };
		return await apiRequest(ef, domain, apiKey, '/invoice/parse', body, documentId);
	}
	if (operation === 'ask') {
		const question = ef.getNodeParameter('question', i) as string;
		const model = ef.getNodeParameter('model', i, 'auto') as JsonRequestBody<'/invoice/ask'>['model'];
		const body: JsonRequestBody<'/invoice/ask'> = { ...input, question, model };
		return await apiRequest(ef, domain, apiKey, '/invoice/ask', body, documentId);
	}
	if (operation === 'extract') {
		const prompt = ef.getNodeParameter('prompt', i) as string;
		const schemaStr = ef.getNodeParameter('schema', i) as string;
		const schema = typeof schemaStr === 'string' ? JSON.parse(schemaStr) : schemaStr;
		const model =
			ef.getNodeParameter('model', i, 'auto') as JsonRequestBody<'/invoice/extract'>['model'];
		const body: JsonRequestBody<'/invoice/extract'> = { ...input, prompt, schema, model };
		return await apiRequest(ef, domain, apiKey, '/invoice/extract', body, documentId);
	}
	return {};
}
