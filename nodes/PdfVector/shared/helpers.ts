import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { paths } from './pdfvector-api.types.js';

export type JsonContent<T> = T extends { content: { 'application/json': infer TJson } }
	? TJson
	: never;
type PostOperation<TPath extends keyof paths> = NonNullable<paths[TPath]['post']>;

export type ApiPath = keyof paths;
type ResourceFromPath<TPath extends string> = TPath extends `/${infer TResource}/${string}`
	? TResource
	: never;
type OperationFromPath<TPath extends string> = TPath extends `/${string}/${infer TOperation}`
	? TOperation
	: never;

export type ApiResource = ResourceFromPath<ApiPath>;
export type ApiOperation<TResource extends ApiResource> = OperationFromPath<
	Extract<ApiPath, `/${TResource}/${string}`>
>;
export type ApiPathFor<TResource extends ApiResource, TOperation extends string> = Extract<
	ApiPath,
	`/${TResource}/${TOperation}`
>;
export type ApiRequestBody<TPath extends ApiPath> = JsonContent<PostOperation<TPath>['requestBody']>;
export type ApiResponse<TPath extends ApiPath> = JsonContent<PostOperation<TPath>['responses'][200]>;
export type ApiRequestBodyFor<
	TResource extends ApiResource,
	TOperation extends ApiOperation<TResource>,
> = ApiRequestBody<ApiPathFor<TResource, TOperation>>;
export type ApiResponseFor<
	TResource extends ApiResource,
	TOperation extends ApiOperation<TResource>,
> = ApiResponse<ApiPathFor<TResource, TOperation>>;

type ApiSchema<TPath extends ApiPath> = ApiRequestBody<TPath> extends { schema: infer TSchema }
	? TSchema
	: never;

export type DocumentInput = Pick<ApiRequestBodyFor<'document', 'parse'>, 'url' | 'base64'>;

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

export function getJsonSchemaParameter<TPath extends ApiPath>(
	ef: IExecuteFunctions,
	i: number,
	path: TPath,
	parameterName = 'schema',
): ApiSchema<TPath> {
	const rawSchema = ef.getNodeParameter(parameterName, i) as ApiSchema<TPath>;

	if (typeof rawSchema !== 'string') {
		return rawSchema;
	}

	try {
		return JSON.parse(rawSchema) as ApiSchema<TPath>;
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		throw new NodeOperationError(ef.getNode(), `Invalid JSON schema: ${message}`, {
			itemIndex: i,
		});
	}
}

export function assertNever(value: never): never {
	throw new Error(`Unhandled PDF Vector API value: ${String(value)}`);
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
