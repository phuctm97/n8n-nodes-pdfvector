import type { IExecuteFunctions } from 'n8n-workflow';
import type { paths } from '../shared/pdfvector-api.types.js';
import { apiRequest, getDocumentInput, getJsonSchemaParameter } from '../shared/helpers.js';
import { makeDocumentProperties } from '../shared/options.js';

export const bankStatementProperties = makeDocumentProperties('bankStatement', 'Bank Statement');
type BankStatementParseModel = NonNullable<
	paths['/bankStatement/parse']['post']['requestBody']['content']['application/json']['model']
>;
type BankStatementAskExtractModel = NonNullable<
	paths['/bankStatement/ask']['post']['requestBody']['content']['application/json']['model']
>;

export async function executeBankStatement(
	ef: IExecuteFunctions,
	domain: string,
	apiKey: string,
	operation: string,
	i: number,
){
	const input = await getDocumentInput(ef, i);
	const documentId = ef.getNodeParameter('documentId', i, '') as string;

	if (operation === 'parse') {
		const model = ef.getNodeParameter('model', i, 'auto') as BankStatementParseModel;
		return await apiRequest(
			ef,
			domain,
			apiKey,
			'/bankStatement/parse',
			{ ...input, model },
			documentId,
		);
	}
	if (operation === 'ask') {
		const question = ef.getNodeParameter('question', i) as string;
		const model = ef.getNodeParameter('model', i, 'auto') as BankStatementAskExtractModel;
		return await apiRequest(
			ef,
			domain,
			apiKey,
			'/bankStatement/ask',
			{ ...input, question, model },
			documentId,
		);
	}
	if (operation === 'extract') {
		const prompt = ef.getNodeParameter('prompt', i) as string;
		const schema = getJsonSchemaParameter(ef, i);
		const model = ef.getNodeParameter('model', i, 'auto') as BankStatementAskExtractModel;
		return await apiRequest(
			ef,
			domain,
			apiKey,
			'/bankStatement/extract',
			{ ...input, prompt, schema, model },
			documentId,
		);
	}
	return {};
}
