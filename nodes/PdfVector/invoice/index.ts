import type { IExecuteFunctions } from 'n8n-workflow';
import type { ApiOperation, ApiRequestBodyFor } from '../shared/helpers.js';
import {
	apiRequest,
	assertNever,
	getDocumentInput,
	getJsonSchemaParameter,
} from '../shared/helpers.js';
import { makeDocumentProperties } from '../shared/options.js';

export const invoiceProperties = makeDocumentProperties('invoice', 'Invoice');
type InvoiceOperation = ApiOperation<'invoice'>;
type InvoiceParseModel = NonNullable<ApiRequestBodyFor<'invoice', 'parse'>['model']>;
type InvoiceAskExtractModel = NonNullable<ApiRequestBodyFor<'invoice', 'ask'>['model']>;

export async function executeInvoice(
	ef: IExecuteFunctions,
	domain: string,
	apiKey: string,
	operation: InvoiceOperation,
	i: number,
){
	const input = await getDocumentInput(ef, i);
	const documentId = ef.getNodeParameter('documentId', i, '') as string;

	switch (operation) {
		case 'parse': {
			const model = ef.getNodeParameter('model', i, 'auto') as InvoiceParseModel;
			return await apiRequest(
				ef,
				domain,
				apiKey,
				'/invoice/parse',
				{ ...input, model },
				documentId,
			);
		}
		case 'ask': {
			const question = ef.getNodeParameter('question', i) as string;
			const model = ef.getNodeParameter('model', i, 'auto') as InvoiceAskExtractModel;

			return await apiRequest(
				ef,
				domain,
				apiKey,
				'/invoice/ask',
				{ ...input, question, model },
				documentId,
			);
		}
		case 'extract': {
			const prompt = ef.getNodeParameter('prompt', i) as string;
			const schema = getJsonSchemaParameter(ef, i, '/invoice/extract');
			const model = ef.getNodeParameter('model', i, 'auto') as InvoiceAskExtractModel;

			return await apiRequest(
				ef,
				domain,
				apiKey,
				'/invoice/extract',
				{ ...input, prompt, schema, model },
				documentId,
			);
		}
	}

	return assertNever(operation);
}
