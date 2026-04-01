import type { IExecuteFunctions } from 'n8n-workflow';
import type { paths } from '../shared/pdfvector-api.types.js';
import { apiRequest, getDocumentInput, getJsonSchemaParameter } from '../shared/helpers.js';
import { makeDocumentProperties } from '../shared/options.js';

export const documentProperties = makeDocumentProperties('document', 'Document');
type DocumentParseModel = NonNullable<
	paths['/document/parse']['post']['requestBody']['content']['application/json']['model']
>;

export async function executeDocument(
	ef: IExecuteFunctions,
	domain: string,
	apiKey: string,
	operation: string,
	i: number,
){
	const input = await getDocumentInput(ef, i);
	const model = ef.getNodeParameter('model', i, 'auto') as DocumentParseModel;
	const documentId = ef.getNodeParameter('documentId', i, '') as string;

	if (operation === 'parse') {
		return await apiRequest(ef, domain, apiKey, '/document/parse', { ...input, model }, documentId);
	}
	if (operation === 'ask') {
		const question = ef.getNodeParameter('question', i) as string;
		return await apiRequest(
			ef,
			domain,
			apiKey,
			'/document/ask',
			{ ...input, question, model },
			documentId,
		);
	}
	if (operation === 'extract') {
		const prompt = ef.getNodeParameter('prompt', i) as string;
		const schema = getJsonSchemaParameter(ef, i);
		return await apiRequest(
			ef,
			domain,
			apiKey,
			'/document/extract',
			{ ...input, prompt, schema, model },
			documentId,
		);
	}
	return {};
}
