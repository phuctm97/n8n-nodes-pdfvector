import type { IExecuteFunctions } from 'n8n-workflow';
import type { ApiOperation, ApiRequestBodyFor } from '../shared/helpers.js';
import {
	apiRequest,
	assertNever,
	getDocumentInput,
	getJsonSchemaParameter,
} from '../shared/helpers.js';
import { makeDocumentProperties } from '../shared/options.js';

export const documentProperties = makeDocumentProperties('document', 'Document');
type DocumentOperation = ApiOperation<'document'>;
type DocumentParseModel = NonNullable<ApiRequestBodyFor<'document', 'parse'>['model']>;
type DocumentAskExtractModel = NonNullable<ApiRequestBodyFor<'document', 'ask'>['model']>;

export async function executeDocument(
	ef: IExecuteFunctions,
	domain: string,
	apiKey: string,
	operation: DocumentOperation,
	i: number,
){
	const input = await getDocumentInput(ef, i);
	const documentId = ef.getNodeParameter('documentId', i, '') as string;

	switch (operation) {
		case 'parse': {
			const model = ef.getNodeParameter('model', i, 'auto') as DocumentParseModel;
			return await apiRequest(
				ef,
				domain,
				apiKey,
				'/document/parse',
				{ ...input, model },
				documentId,
			);
		}
		case 'ask': {
			const question = ef.getNodeParameter('question', i) as string;
			const model = ef.getNodeParameter('model', i, 'auto') as DocumentAskExtractModel;

			return await apiRequest(
				ef,
				domain,
				apiKey,
				'/document/ask',
				{ ...input, question, model },
				documentId,
			);
		}
		case 'extract': {
			const prompt = ef.getNodeParameter('prompt', i) as string;
			const schema = getJsonSchemaParameter(ef, i, '/document/extract');
			const model = ef.getNodeParameter('model', i, 'auto') as DocumentAskExtractModel;

			return await apiRequest(
				ef,
				domain,
				apiKey,
				'/document/extract',
				{ ...input, prompt, schema, model },
				documentId,
			);
		}
	}

	return assertNever(operation);
}
