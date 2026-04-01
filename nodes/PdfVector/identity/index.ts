import type { IExecuteFunctions } from 'n8n-workflow';
import type { paths } from '../shared/pdfvector-api.types.js';
import { apiRequest, getDocumentInput, getJsonSchemaParameter } from '../shared/helpers.js';
import { makeDocumentProperties } from '../shared/options.js';

export const identityProperties = makeDocumentProperties('identity', 'Identity Document');
type IdentityParseModel = NonNullable<
	paths['/identity/parse']['post']['requestBody']['content']['application/json']['model']
>;
type IdentityAskExtractModel = NonNullable<
	paths['/identity/ask']['post']['requestBody']['content']['application/json']['model']
>;

export async function executeIdentity(
	ef: IExecuteFunctions,
	domain: string,
	apiKey: string,
	operation: string,
	i: number,
){
	const input = await getDocumentInput(ef, i);
	const documentId = ef.getNodeParameter('documentId', i, '') as string;

	if (operation === 'parse') {
		const model = ef.getNodeParameter('model', i, 'auto') as IdentityParseModel;
		return await apiRequest(ef, domain, apiKey, '/identity/parse', { ...input, model }, documentId);
	}
	if (operation === 'ask') {
		const question = ef.getNodeParameter('question', i) as string;
		const model = ef.getNodeParameter('model', i, 'auto') as IdentityAskExtractModel;
		return await apiRequest(ef, domain, apiKey, '/identity/ask', { ...input, question, model }, documentId);
	}
	if (operation === 'extract') {
		const prompt = ef.getNodeParameter('prompt', i) as string;
		const schema = getJsonSchemaParameter(ef, i);
		const model = ef.getNodeParameter('model', i, 'auto') as IdentityAskExtractModel;
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
