import type { IExecuteFunctions } from 'n8n-workflow';
import type { JsonRequestBody } from '../shared/api-types.js';
import { apiRequest, getDocumentInput } from '../shared/helpers.js';
import { makeDocumentProperties } from '../shared/options.js';

export const documentProperties = makeDocumentProperties('document', 'Document');

export async function executeDocument(
	ef: IExecuteFunctions,
	domain: string,
	apiKey: string,
	operation: string,
	i: number,
): Promise<Record<string, unknown>> {
	const input = await getDocumentInput(ef, i);
	const documentId = ef.getNodeParameter('documentId', i, '') as string;

	if (operation === 'parse') {
		const model = ef.getNodeParameter('model', i, 'auto') as JsonRequestBody<'/document/parse'>['model'];
		const body: JsonRequestBody<'/document/parse'> = { ...input, model };
		return await apiRequest(ef, domain, apiKey, '/document/parse', body, documentId);
	}
	if (operation === 'ask') {
		const question = ef.getNodeParameter('question', i) as string;
		const model = ef.getNodeParameter('model', i, 'auto') as JsonRequestBody<'/document/ask'>['model'];
		const body: JsonRequestBody<'/document/ask'> = { ...input, question, model };
		return await apiRequest(ef, domain, apiKey, '/document/ask', body, documentId);
	}
	if (operation === 'extract') {
		const prompt = ef.getNodeParameter('prompt', i) as string;
		const schemaStr = ef.getNodeParameter('schema', i) as string;
		const schema = typeof schemaStr === 'string' ? JSON.parse(schemaStr) : schemaStr;
		const model =
			ef.getNodeParameter('model', i, 'auto') as JsonRequestBody<'/document/extract'>['model'];
		const body: JsonRequestBody<'/document/extract'> = { ...input, prompt, schema, model };
		return await apiRequest(ef, domain, apiKey, '/document/extract', body, documentId);
	}
	return {};
}
