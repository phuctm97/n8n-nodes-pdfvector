import type { IExecuteFunctions } from 'n8n-workflow';
import type { ApiOperation, ApiRequestBodyFor } from '../shared/helpers.js';
import {
	apiRequest,
	assertNever,
	getDocumentInput,
	getJsonSchemaParameter,
} from '../shared/helpers.js';
import { makeDocumentProperties } from '../shared/options.js';

export const bankStatementProperties = makeDocumentProperties('bankStatement', 'Bank Statement');
type BankStatementOperation = ApiOperation<'bankStatement'>;
type BankStatementParseModel = NonNullable<ApiRequestBodyFor<'bankStatement', 'parse'>['model']>;
type BankStatementAskExtractModel = NonNullable<ApiRequestBodyFor<'bankStatement', 'ask'>['model']>;

export async function executeBankStatement(
	ef: IExecuteFunctions,
	domain: string,
	apiKey: string,
	operation: BankStatementOperation,
	i: number,
){
	const input = await getDocumentInput(ef, i);
	const documentId = ef.getNodeParameter('documentId', i, '') as string;

	switch (operation) {
		case 'parse': {
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
		case 'ask': {
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
		case 'extract': {
			const prompt = ef.getNodeParameter('prompt', i) as string;
			const schema = getJsonSchemaParameter(ef, i, '/bankStatement/extract');
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
	}

	return assertNever(operation);
}
