import type { IExecuteFunctions } from 'n8n-workflow';
import type { JsonRequestBody } from '../shared/api-types.js';
import { apiRequest, getDocumentInput } from '../shared/helpers.js';
import { makeDocumentProperties } from '../shared/options.js';

export const bankStatementProperties = makeDocumentProperties('bankStatement', 'Bank Statement');

export async function executeBankStatement(
	ef: IExecuteFunctions,
	domain: string,
	apiKey: string,
	operation: string,
	i: number,
): Promise<Record<string, unknown>> {
	const input = await getDocumentInput(ef, i);
	const documentId = ef.getNodeParameter('documentId', i, '') as string;

	if (operation === 'parse') {
		const model =
			ef.getNodeParameter('model', i, 'auto') as JsonRequestBody<'/bankStatement/parse'>['model'];
		const body: JsonRequestBody<'/bankStatement/parse'> = { ...input, model };
		return await apiRequest(ef, domain, apiKey, '/bankStatement/parse', body, documentId);
	}
	if (operation === 'ask') {
		const question = ef.getNodeParameter('question', i) as string;
		const model =
			ef.getNodeParameter('model', i, 'auto') as JsonRequestBody<'/bankStatement/ask'>['model'];
		const body: JsonRequestBody<'/bankStatement/ask'> = { ...input, question, model };
		return await apiRequest(ef, domain, apiKey, '/bankStatement/ask', body, documentId);
	}
	if (operation === 'extract') {
		const prompt = ef.getNodeParameter('prompt', i) as string;
		const schemaStr = ef.getNodeParameter('schema', i) as string;
		const schema = typeof schemaStr === 'string' ? JSON.parse(schemaStr) : schemaStr;
		const model =
			ef.getNodeParameter('model', i, 'auto') as JsonRequestBody<'/bankStatement/extract'>['model'];
		const body: JsonRequestBody<'/bankStatement/extract'> = { ...input, prompt, schema, model };
		return await apiRequest(ef, domain, apiKey, '/bankStatement/extract', body, documentId);
	}
	return {};
}
