import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { paths } from './pdfvector-api.types.js';

type JsonContent<T> = T extends { content: { 'application/json': infer TJson } } ? TJson : never;
type PostOperation<TPath extends keyof paths> = NonNullable<paths[TPath]['post']>;
type ApiPath = keyof paths;
type ApiRequestBody<TPath extends ApiPath> = JsonContent<PostOperation<TPath>['requestBody']>;
type ApiResponse<TPath extends ApiPath> = JsonContent<PostOperation<TPath>['responses'][200]>;
type DocumentInput = Pick<ApiRequestBody<'/document/parse'>, 'url' | 'base64'>;
type ExtractSchema = ApiRequestBody<'/document/extract'>['schema'];

export function getBaseUrl(domain: string): string {
	const d = domain || 'global.pdfvector.com';
	const protocol = d.startsWith('localhost') || d.startsWith('127.0.0.1') ? 'http' : 'https';
	return `${protocol}://${d}`;
}

export async function getDocumentInput(
	ef: IExecuteFunctions,
	i: number,
): Promise<DocumentInput> {
	const inputType = ef.getNodeParameter('inputType', i) as string;
	if (inputType === 'url') {
		return { url: ef.getNodeParameter('url', i) as string };
	}
	const binaryPropertyName = ef.getNodeParameter('binaryPropertyName', i, 'data') as string;
	ef.helpers.assertBinaryData(i, binaryPropertyName);
	const buffer = await ef.helpers.getBinaryDataBuffer(i, binaryPropertyName);
	if (!buffer || buffer.length === 0) {
		throw new NodeOperationError(ef.getNode(), 'Binary data is empty', { itemIndex: i });
	}
	return { base64: buffer.toString('base64') };
}

export function getJsonSchemaParameter(
	ef: IExecuteFunctions,
	i: number,
	parameterName = 'schema',
): ExtractSchema {
	const rawSchema = ef.getNodeParameter(parameterName, i) as ExtractSchema;

	if (typeof rawSchema !== 'string') {
		return rawSchema;
	}

	try {
		return JSON.parse(rawSchema) as ExtractSchema;
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		throw new NodeOperationError(ef.getNode(), `Invalid JSON schema: ${message}`, {
			itemIndex: i,
		});
	}
}

export async function apiRequest<TPath extends ApiPath>(
	ef: IExecuteFunctions,
	domain: string,
	apiKey: string,
	path: TPath,
	body: ApiRequestBody<TPath>,
	documentId?: string,
): Promise<ApiResponse<TPath>> {
	const headers: Record<string, string> = {
		Authorization: `Bearer ${apiKey}`,
		'Content-Type': 'application/json',
	};
	if (documentId) {
		headers['x-pdfvector-document-id'] = documentId;
	}
	return (await ef.helpers.httpRequest({
		method: 'POST',
		url: `${getBaseUrl(domain)}/api${path}`,
		headers,
		body,
		json: true,
	})) as ApiResponse<TPath>;
}
