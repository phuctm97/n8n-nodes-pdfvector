import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { ApiPath, JsonRequestBody, JsonResponseBody } from './api-types.js';

export function getBaseUrl(domain: string): string {
	const d = domain || 'global.pdfvector.com';
	const protocol = d.startsWith('localhost') || d.startsWith('127.0.0.1') ? 'http' : 'https';
	return `${protocol}://${d}`;
}

export async function getDocumentInput(
	ef: IExecuteFunctions,
	i: number,
): Promise<{ url: string } | { base64: string }> {
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

export async function apiRequest<TPath extends ApiPath>(
	ef: IExecuteFunctions,
	domain: string,
	apiKey: string,
	path: TPath,
	body: JsonRequestBody<TPath>,
	documentId?: string,
): Promise<JsonResponseBody<TPath>> {
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
		body: body as Record<string, unknown>,
		json: true,
	})) as JsonResponseBody<TPath>;
}
