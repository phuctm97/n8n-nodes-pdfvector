import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test } from 'node:test';

const require = createRequire(import.meta.url);
const { NodeApiError } = require('n8n-workflow');
const { apiRequest } = require('../dist/nodes/PdfVector/shared/helpers.js');

const node = {
	id: 'node-1',
	name: 'PDF Vector',
	type: 'n8n-nodes-pdfvector.pdfVector',
	typeVersion: 2,
	position: [0, 0],
	parameters: {},
};

function contextFailingWith(error) {
	return {
		getNode: () => node,
		helpers: {
			httpRequestWithAuthentication: async () => {
				throw error;
			},
		},
	};
}

function httpError(status, data) {
	return Object.assign(new Error(`Request failed with status code ${status}`), {
		response: { status, data },
	});
}

const outOfCredits =
	'Your workspace has used all 100 monthly credits. Credits reset on 2026-12-01. Upgrade your plan at https://app.pdfvector.com/plan.';

test('leads with the API message when n8n already wrapped the response in a NodeApiError', async () => {
	const wrapped = new NodeApiError(
		node,
		httpError(402, { code: 'PAYMENT_REQUIRED', status: 402, message: outOfCredits }),
	);
	assert.equal(wrapped.message, 'Payment required - perhaps check your payment details?');

	await assert.rejects(
		apiRequest(contextFailingWith(wrapped), 'global.pdfvector.com', '/academic/search', {
			query: 'llm',
		}),
		(error) => {
			assert.ok(error instanceof NodeApiError);
			assert.equal(error.message, outOfCredits);
			assert.equal(String(error.httpCode), '402');
			assert.equal(error.description, undefined);
			return true;
		},
	);
});

test('shows the API message for a deleted API key', async () => {
	const wrapped = new NodeApiError(
		node,
		httpError(401, { code: 'UNAUTHORIZED', status: 401, message: 'Invalid API key' }),
	);

	await assert.rejects(
		apiRequest(contextFailingWith(wrapped), 'global.pdfvector.com', '/academic/search', {
			query: 'llm',
		}),
		(error) => error instanceof NodeApiError && error.message === 'Invalid API key',
	);
});

test('keeps n8n’s message when the response has no API message', async () => {
	const wrapped = new NodeApiError(node, httpError(502, '<html>Bad gateway</html>'));
	const message = wrapped.message;

	await assert.rejects(
		apiRequest(contextFailingWith(wrapped), 'global.pdfvector.com', '/academic/search', {
			query: 'llm',
		}),
		(error) => error === wrapped && error.message === message,
	);
});

test('wraps a raw request error with the API message from its body', async () => {
	const raw = Object.assign(new Error('Request failed'), {
		statusCode: 402,
		error: JSON.stringify({ message: outOfCredits }),
	});

	await assert.rejects(
		apiRequest(contextFailingWith(raw), 'global.pdfvector.com', '/academic/search', {
			query: 'llm',
		}),
		(error) => error instanceof NodeApiError && error.message === outOfCredits,
	);
});
