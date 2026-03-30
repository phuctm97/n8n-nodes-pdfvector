import type { IExecuteFunctions } from 'n8n-workflow';
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
	const model = ef.getNodeParameter('model', i, 'auto') as string;
	const documentId = ef.getNodeParameter('documentId', i, '') as string;

	if (operation === 'parse') {
		return await apiRequest(ef, domain, apiKey, 'identity/parse', { ...input, model }, documentId);
	}
	if (operation === 'ask') {
		const question = ef.getNodeParameter('question', i) as string;
		return await apiRequest(
			ef,
			domain,
			apiKey,
			'identity/ask',
			{ ...input, question, model },
			documentId,
		);
	}
	if (operation === 'extract') {
		const prompt = ef.getNodeParameter('prompt', i) as string;
		const schemaStr = ef.getNodeParameter('schema', i) as string;
		const schema = typeof schemaStr === 'string' ? JSON.parse(schemaStr) : schemaStr;
		return await apiRequest(
			ef,
			domain,
			apiKey,
			'identity/extract',
			{ ...input, prompt, schema, model },
			documentId,
		);
	}
	return {};
}
