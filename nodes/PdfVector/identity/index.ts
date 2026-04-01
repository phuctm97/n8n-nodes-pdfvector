import type { IExecuteFunctions } from 'n8n-workflow';
import type { ApiOperation, ApiRequestBodyFor } from '../shared/helpers.js';
import {
	apiRequest,
	assertNever,
	getDocumentInput,
	getJsonSchemaParameter,
} from '../shared/helpers.js';
import { makeDocumentProperties } from '../shared/options.js';

export const identityProperties = makeDocumentProperties('identity', 'Identity Document');
type IdentityOperation = ApiOperation<'identity'>;
type IdentityParseModel = NonNullable<ApiRequestBodyFor<'identity', 'parse'>['model']>;
type IdentityAskExtractModel = NonNullable<ApiRequestBodyFor<'identity', 'ask'>['model']>;

export async function executeIdentity(
	ef: IExecuteFunctions,
	domain: string,
	apiKey: string,
	operation: IdentityOperation,
	i: number,
){
	const input = await getDocumentInput(ef, i);
	const documentId = ef.getNodeParameter('documentId', i, '') as string;

	switch (operation) {
		case 'parse': {
			const model = ef.getNodeParameter('model', i, 'auto') as IdentityParseModel;
			return await apiRequest(
				ef,
				domain,
				apiKey,
				'/identity/parse',
				{ ...input, model },
				documentId,
			);
		}
		case 'ask': {
			const question = ef.getNodeParameter('question', i) as string;
			const model = ef.getNodeParameter('model', i, 'auto') as IdentityAskExtractModel;

			return await apiRequest(
				ef,
				domain,
				apiKey,
				'/identity/ask',
				{ ...input, question, model },
				documentId,
			);
		}
		case 'extract': {
			const prompt = ef.getNodeParameter('prompt', i) as string;
			const schema = getJsonSchemaParameter(ef, i, '/identity/extract');
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
	}

	return assertNever(operation);
}
