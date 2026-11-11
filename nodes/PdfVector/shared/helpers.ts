import type { IDataObject, IExecuteFunctions, INodeExecutionData, JsonObject } from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import type { ApiPath, DocumentInput, JsonRequestBody, JsonResponseBody } from './api.js';

export function getBaseUrl(domain: string): string {
	const input = (domain || 'global.pdfvector.com').trim();
	const d = input.replace(/\/api(?:\/.*)?$/, '').replace(/\/+$/, '');
	if (d.startsWith('http://') || d.startsWith('https://')) {
		return d;
	}
	const protocol = d.startsWith('localhost') || d.startsWith('127.0.0.1') ? 'http' : 'https';
	return `${protocol}://${d}`;
}

export async function getDocumentInput(ef: IExecuteFunctions, i: number): Promise<DocumentInput> {
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

// n8n's request helpers already throw a NodeApiError headed by a generic status text
// ("Payment required - perhaps check your payment details?"); lead with the API's message.
function leadWithApiMessage(error: NodeApiError, apiMessage: string | undefined): NodeApiError {
	if (apiMessage && error.message !== apiMessage) {
		error.messages.push(error.message);
		error.message = apiMessage;
		if (error.description === apiMessage) error.description = undefined;
	}
	return error;
}

export async function apiRequest<Path extends ApiPath>(
	ef: IExecuteFunctions,
	domain: string,
	path: Path,
	body: JsonRequestBody<Path>,
	documentId?: string,
): Promise<JsonResponseBody<Path>> {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};
	if (documentId) {
		headers['x-pdfvector-document-id'] = documentId;
	}
	try {
		return (await ef.helpers.httpRequestWithAuthentication.call(ef, 'pdfVectorApi', {
			method: 'POST',
			url: `${getBaseUrl(domain)}/api${path}`,
			headers,
			body: body as Record<string, unknown>,
			json: true,
		})) as JsonResponseBody<Path>;
	} catch (error) {
		const apiMessage = extractApiErrorMessage(error);
		if (error instanceof NodeApiError) throw leadWithApiMessage(error, apiMessage);
		const wrapped = new NodeApiError(ef.getNode(), error as JsonObject, {
			...(apiMessage ? { message: apiMessage } : {}),
		});
		// Keep the API body so apiErrorDetails() can read it, as for errors n8n wraps itself.
		const body = extractApiErrorBody(error);
		if (body && wrapped.context.data === undefined) wrapped.context.data = body;
		throw wrapped;
	}
}

function extractApiErrorBody(error: unknown): Record<string, unknown> | undefined {
	if (!error || typeof error !== 'object') return undefined;
	const err = error as Record<string, unknown>;
	if (error instanceof NodeApiError) return extractApiErrorBody({ data: error.context.data });
	// n8n HTTP helpers put the response body in error.error (string or object)
	for (const key of ['error', 'body', 'data']) {
		let val = err[key];
		if (typeof val === 'string') {
			try {
				val = JSON.parse(val);
			} catch {
				continue;
			}
		}
		if (
			val &&
			typeof val === 'object' &&
			typeof (val as Record<string, unknown>).message === 'string'
		) {
			return val as Record<string, unknown>;
		}
	}
	return undefined;
}

function extractApiErrorMessage(error: unknown): string | undefined {
	return extractApiErrorBody(error)?.message as string | undefined;
}

/**
 * Machine-readable fields of a PDF Vector API error for "Continue (using error output)" items, e.g.
 * { code: 'BILLING_UNPAID_INVOICE', httpCode: 402, payUrl, billingUrl, amountDue, ... } or
 * { code: 'CREDITS_EXHAUSTED', httpCode: 402, total, remaining, resetsAt }.
 */
export function apiErrorDetails(error: unknown): IDataObject {
	const body = extractApiErrorBody(error);
	if (!body) return {};
	const details: IDataObject = {};
	const status = body.status ?? (error as { httpCode?: unknown }).httpCode;
	if (status !== undefined && Number.isFinite(Number(status))) details.httpCode = Number(status);
	if (typeof body.code === 'string') details.code = body.code;
	const data = body.data;
	if (data && typeof data === 'object' && !Array.isArray(data)) {
		for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
			if (key === 'userError' || value === undefined) continue;
			details[key] = value as IDataObject[string];
		}
	}
	return details;
}

/**
 * The item for a failed call when the node continues on error. n8n routes an item to the error output
 * only when its json has just error/message/details keys (or it has `item.error`, but then n8n replaces
 * the json with `{ error }` and drops the API fields), so the error output nests them under `details`;
 * the regular output keeps them flat next to `error`.
 */
export function continueOnFailItem(
	message: string,
	details: IDataObject,
	itemIndex: number,
	onError: string | undefined,
): INodeExecutionData {
	const json: IDataObject =
		onError === 'continueErrorOutput' ? { error: message, details } : { error: message, ...details };
	return { json, pairedItem: { item: itemIndex } };
}
