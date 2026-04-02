import type { IExecuteFunctions } from 'n8n-workflow';
import type { JsonRequestBody, JsonRequestModel, JsonRequestSchema } from '../shared/api.js';
import { apiRequest, getDocumentInput } from '../shared/helpers.js';
import { allModelOptions, makeDocumentProperties, proMaxModelOptions } from '../shared/options.js';

type BankStatementAskRequest = JsonRequestBody<'/bankStatement/ask'>;
type BankStatementExtractRequest = JsonRequestBody<'/bankStatement/extract'>;

export const bankStatementProperties = makeDocumentProperties(
	'bankStatement',
	'Bank Statement',
	proMaxModelOptions,
	allModelOptions,
);

export async function executeBankStatement(
	ef: IExecuteFunctions,
	domain: string,
	operation: string,
	i: number,
): Promise<Record<string, unknown>> {
	const input = await getDocumentInput(ef, i);
	const documentId = ef.getNodeParameter('documentId', i, '') as string;

	if (operation === 'parse') {
		const model = ef.getNodeParameter('model', i, 'auto') as JsonRequestModel<'/bankStatement/parse'>;
		return await apiRequest(
			ef,
			domain,
			'/bankStatement/parse',
			{ ...input, model },
			documentId,
		);
	}
	if (operation === 'ask') {
		const question = ef.getNodeParameter('question', i) as BankStatementAskRequest['question'];
		const model = ef.getNodeParameter('model', i, 'auto') as JsonRequestModel<'/bankStatement/ask'>;
		return await apiRequest(
			ef,
			domain,
			'/bankStatement/ask',
			{ ...input, question, model },
			documentId,
		);
	}
	if (operation === 'extract') {
		const prompt = ef.getNodeParameter('prompt', i) as BankStatementExtractRequest['prompt'];
		const schemaParameter = ef.getNodeParameter('schema', i) as BankStatementExtractRequest['schema'];
		const model = ef.getNodeParameter('model', i, 'auto') as JsonRequestModel<'/bankStatement/extract'>;
		const schema =
			typeof schemaParameter === 'string'
				? (JSON.parse(schemaParameter) as JsonRequestSchema<'/bankStatement/extract'>)
				: schemaParameter;
		return await apiRequest(
			ef,
			domain,
			'/bankStatement/extract',
			{ ...input, prompt, schema, model },
			documentId,
		);
	}
	return {};
}
