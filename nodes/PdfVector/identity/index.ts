import type { IExecuteFunctions } from 'n8n-workflow';
import type { JsonRequestBody, JsonRequestModel, JsonRequestSchema } from '../shared/api.js';
import { apiRequest, getDocumentInput } from '../shared/helpers.js';
import { allModelOptions, makeDocumentProperties, proMaxModelOptions } from '../shared/options.js';

type IdentityAskRequest = JsonRequestBody<'/identity/ask'>;
type IdentityExtractRequest = JsonRequestBody<'/identity/extract'>;

export const identityProperties = makeDocumentProperties(
	'identity',
	'Identity Document',
	proMaxModelOptions,
	allModelOptions,
);

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
		const model = ef.getNodeParameter('model', i, 'auto') as JsonRequestModel<'/identity/parse'>;
		return await apiRequest(ef, domain, apiKey, '/identity/parse', { ...input, model }, documentId);
	}
	if (operation === 'ask') {
		const question = ef.getNodeParameter('question', i) as IdentityAskRequest['question'];
		const model = ef.getNodeParameter('model', i, 'auto') as JsonRequestModel<'/identity/ask'>;
		return await apiRequest(
			ef,
			domain,
			apiKey,
			'/identity/ask',
			{ ...input, question, model },
			documentId,
		);
	}
	if (operation === 'extract') {
		const prompt = ef.getNodeParameter('prompt', i) as IdentityExtractRequest['prompt'];
		const schemaParameter = ef.getNodeParameter('schema', i) as IdentityExtractRequest['schema'];
		const model = ef.getNodeParameter('model', i, 'auto') as JsonRequestModel<'/identity/extract'>;
		const schema =
			typeof schemaParameter === 'string'
				? (JSON.parse(schemaParameter) as JsonRequestSchema<'/identity/extract'>)
				: schemaParameter;
		return await apiRequest(
			ef,
			domain,
			apiKey,
			'/identity/extract',
			{ ...input, prompt, schema, model },
			documentId,
		);
	}
	return {};
}
