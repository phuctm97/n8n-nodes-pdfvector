import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PDFVectorApi implements ICredentialType {
	name = 'pdfVectorApi';
	displayName = 'PDF Vector API';
	documentationUrl = 'https://global.pdfvector.com/api/reference';
	icon = 'file:icon.svg' as const;
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			hint: '<a href="https://app.pdfvector.com" target="_blank">Get your API key from the PDF Vector dashboard</a>',
			description:
				'Your PDF Vector API key',
		},
		{
			displayName: 'Domain or Base URL',
			name: 'domain',
			type: 'string',
			default: 'global.pdfvector.com',
			required: false,
			description:
				'PDF Vector API domain or base URL. Leave default for the shared instance. Change only for custom instances.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
				'x-pdfvector-source': 'n8n',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{(() => { const input = ($credentials.domain || "global.pdfvector.com").trim(); const base = input.replace(/\\/api(?:\\/.*)?$/, "").replace(/\\/+$/, ""); if (base.startsWith("http://") || base.startsWith("https://")) return base; return ((base.startsWith("localhost") || base.startsWith("127.0.0.1")) ? "http://" : "https://") + base; })()}}',
			url: '/api/authenticate/validateCredential',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: '{}',
		},
		rules: [
			{
				type: 'responseCode',
				properties: {
					value: 200,
					message: 'API key is valid',
				},
			},
			{
				type: 'responseCode',
				properties: {
					value: 401,
					message: 'Invalid API key',
				},
			},
		],
	};
}
