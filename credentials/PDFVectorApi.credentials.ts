import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PDFVectorApi implements ICredentialType {
	name = 'pdfVectorApi';
	displayName = 'PDF Vector API';
	documentationUrl = 'https://www.pdfvector.com/v1/api/scalar';
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
			description:
				'Your PDFVector API key (format: pdfvector_xxxxxxxxxxxxxxxx). You can get it from https://www.pdfvector.com/api-keys.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{"Bearer " + $credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://www.pdfvector.com/v1/api',
			url: '/validate-key',
			method: 'GET',
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
