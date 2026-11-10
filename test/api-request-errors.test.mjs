import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test } from 'node:test';

const require = createRequire(import.meta.url);
const { NodeApiError } = require('n8n-workflow');
const { apiRequest, apiErrorDetails } = require('../dist/nodes/PdfVector/shared/helpers.js');

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

const unpaid =
	'Your account is blocked because invoice ABC-0001 ($25.00, due Nov 9, 2026) is unpaid. Pay it at https://invoice.stripe.com/i/acct_x/test_y to continue.';
const billingHoldBody = {
	defined: false,
	code: 'PAYMENT_REQUIRED',
	status: 402,
	message: unpaid,
	data: {
		userError: true,
		code: 'BILLING_UNPAID_INVOICE',
		reason: 'uncollectible',
		invoiceCount: 1,
		amountDue: 2500,
		currency: 'usd',
		billingUrl: 'https://app.pdfvector.com/workspace/billing',
		payUrl: 'https://invoice.stripe.com/i/acct_x/test_y',
	},
};

test('leads with the billing-hold message and exposes its code and pay link', async () => {
	const wrapped = new NodeApiError(node, httpError(402, billingHoldBody));

	await assert.rejects(
		apiRequest(contextFailingWith(wrapped), 'global.pdfvector.com', '/academic/search', {
			query: 'llm',
		}),
		(error) => {
			assert.ok(error instanceof NodeApiError);
			assert.equal(error.message, unpaid);
			assert.deepEqual(apiErrorDetails(error), {
				httpCode: 402,
				code: 'BILLING_UNPAID_INVOICE',
				reason: 'uncollectible',
				invoiceCount: 1,
				amountDue: 2500,
				currency: 'usd',
				billingUrl: 'https://app.pdfvector.com/workspace/billing',
				payUrl: 'https://invoice.stripe.com/i/acct_x/test_y',
			});
			return true;
		},
	);
});

test('exposes CREDITS_EXHAUSTED details from a raw request error', async () => {
	const raw = Object.assign(new Error('Request failed'), {
		statusCode: 402,
		error: JSON.stringify({
			code: 'PAYMENT_REQUIRED',
			status: 402,
			message: outOfCredits,
			data: { userError: true, code: 'CREDITS_EXHAUSTED', total: 100, remaining: 0, resetsAt: null },
		}),
	});

	await assert.rejects(
		apiRequest(contextFailingWith(raw), 'global.pdfvector.com', '/academic/search', {
			query: 'llm',
		}),
		(error) => {
			assert.equal(error.message, outOfCredits);
			assert.deepEqual(apiErrorDetails(error), {
				httpCode: 402,
				code: 'CREDITS_EXHAUSTED',
				total: 100,
				remaining: 0,
				resetsAt: null,
			});
			return true;
		},
	);
});

test('returns no details for a non-API error', () => {
	assert.deepEqual(apiErrorDetails(new Error('socket hang up')), {});
});
