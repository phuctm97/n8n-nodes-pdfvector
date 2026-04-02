import type { IExecuteFunctions } from 'n8n-workflow';
import type { JsonRequestBody, JsonRequestModel, JsonRequestSchema } from '../shared/api.js';
import { apiRequest, getDocumentInput } from '../shared/helpers.js';
import { allModelOptions, makeDocumentProperties } from '../shared/options.js';

type DocumentAskRequest = JsonRequestBody<'/document/ask'>;
type DocumentExtractRequest = JsonRequestBody<'/document/extract'>;

export const documentProperties = makeDocumentProperties(
	'document',
	'Document',
	allModelOptions,
	allModelOptions,
);

export async function executeDocument(
	ef: IExecuteFunctions,
	domain: string,
	operation: string,
	i: number,
): Promise<Record<string, unknown>> {
	const input = await getDocumentInput(ef, i);
	const documentId = ef.getNodeParameter('documentId', i, '') as string;

	if (operation === 'parse') {
		const model = ef.getNodeParameter('model', i, 'auto') as JsonRequestModel<'/document/parse'>;
		return await apiRequest(ef, domain, '/document/parse', { ...input, model }, documentId);
	}
	if (operation === 'ask') {
		const question = ef.getNodeParameter('question', i) as DocumentAskRequest['question'];
		const model = ef.getNodeParameter('model', i, 'auto') as JsonRequestModel<'/document/ask'>;
		return await apiRequest(
			ef,
			domain,
			'/document/ask',
			{ ...input, question, model },
			documentId,
		);
	}
	if (operation === 'extract') {
		const prompt = ef.getNodeParameter('prompt', i) as DocumentExtractRequest['prompt'];
		const schemaParameter = ef.getNodeParameter('schema', i) as DocumentExtractRequest['schema'];
		const model = ef.getNodeParameter('model', i, 'auto') as JsonRequestModel<'/document/extract'>;
		const schema =
			typeof schemaParameter === 'string'
				? (JSON.parse(schemaParameter) as JsonRequestSchema<'/document/extract'>)
				: schemaParameter;
		return await apiRequest(
			ef,
			domain,
			'/document/extract',
			{ ...input, prompt, schema, model },
			documentId,
		);
	}
	return {};
}
