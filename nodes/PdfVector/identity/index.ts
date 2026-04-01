import type { IExecuteFunctions } from 'n8n-workflow';
import type { JsonRequestBody } from '../shared/api-types.js';
import { apiRequest, getDocumentInput } from '../shared/helpers.js';
import { makeDocumentProperties } from '../shared/options.js';

export const identityProperties = makeDocumentProperties('identity', 'Identity Document');

export async function executeIdentity(
	ef: IExecuteFunctions,
	domain: string,
	apiKey: string,
	operation: string,
	i: number,
): Promise<Record<string, unknown>> {
	const input = await getDocumentInput(ef, i);
	const documentId = ef.getNodeParameter('documentId', i, '') as string;

	if (operation === 'parse') {
		const model = ef.getNodeParameter('model', i, 'auto') as JsonRequestBody<'/identity/parse'>['model'];
		const body: JsonRequestBody<'/identity/parse'> = { ...input, model };
		return await apiRequest(ef, domain, apiKey, '/identity/parse', body, documentId);
	}
	if (operation === 'ask') {
		const question = ef.getNodeParameter('question', i) as string;
		const model = ef.getNodeParameter('model', i, 'auto') as JsonRequestBody<'/identity/ask'>['model'];
		const body: JsonRequestBody<'/identity/ask'> = { ...input, question, model };
		return await apiRequest(ef, domain, apiKey, '/identity/ask', body, documentId);
	}
	if (operation === 'extract') {
		const prompt = ef.getNodeParameter('prompt', i) as string;
		const schemaStr = ef.getNodeParameter('schema', i) as string;
		const schema = typeof schemaStr === 'string' ? JSON.parse(schemaStr) : schemaStr;
		const model =
			ef.getNodeParameter('model', i, 'auto') as JsonRequestBody<'/identity/extract'>['model'];
		const body: JsonRequestBody<'/identity/extract'> = { ...input, prompt, schema, model };
		return await apiRequest(ef, domain, apiKey, '/identity/extract', body, documentId);
	}
	return {};
}
