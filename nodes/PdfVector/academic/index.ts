import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import type { JsonRequestBody } from '../shared/api-types.js';
import { apiRequest } from '../shared/helpers.js';

type AcademicSearchBody = JsonRequestBody<'/academic/search'>;
type AcademicFetchBody = JsonRequestBody<'/academic/fetch'>;
type AcademicFindCitationsBody = JsonRequestBody<'/academic/findCitations'>;

const providerOptions = [
	{ name: 'Semantic Scholar', value: 'semantic-scholar', description: 'Semanticscholar.org — largest free academic search engine' },
	{ name: 'PubMed', value: 'pubmed', description: 'Pubmed.ncbi.nlm.nih.gov — biomedical literature' },
	{ name: 'ArXiv', value: 'arxiv', description: 'Arxiv.org — physics, math, CS preprints' },
	{ name: 'Google Scholar', value: 'google-scholar', description: 'Scholar.google.com — broad academic search' },
	{ name: 'OpenAlex', value: 'openalex', description: 'Openalex.org — open catalog of scholarly works' },
	{ name: 'ERIC', value: 'eric', description: 'Eric.ed.gov — education research' },
	{ name: 'Europe PMC', value: 'europe-pmc', description: 'Europepmc.org — European biomedical literature' },
];

const fieldOptions = [
	{ name: 'Title', value: 'title' },
	{ name: 'Authors', value: 'authors' },
	{ name: 'Year', value: 'year' },
	{ name: 'Abstract', value: 'abstract' },
	{ name: 'DOI', value: 'doi' },
	{ name: 'URL', value: 'url' },
	{ name: 'PDF URL', value: 'pdfURL' },
	{ name: 'Date', value: 'date' },
	{ name: 'Total Citations', value: 'totalCitations' },
	{ name: 'Total References', value: 'totalReferences' },
	{ name: 'Provider', value: 'provider' },
	{ name: 'Provider URL', value: 'providerURL' },
	{ name: 'Provider Data', value: 'providerData', description: 'Raw provider-specific metadata' },
];

export const academicProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['academic'] } },
		options: [
			{
				name: 'Search',
				value: 'search',
				description: 'Search for academic papers across multiple databases',
				action: 'Search academic papers',
			},
			{
				name: 'Fetch',
				value: 'fetch',
				description: 'Fetch specific papers by DOI, PubMed ID, ArXiv ID, etc',
				action: 'Fetch papers by ID',
			},
			{
				name: 'Find Citations',
				value: 'findCitations',
				description: 'Find relevant academic citations for a paragraph of text',
				action: 'Find citations for text',
			},
		],
		default: 'search',
	},

	// ─── Search ─────────────────────────────────────────
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'deep learning natural language processing',
		displayOptions: { show: { resource: ['academic'], operation: ['search'] } },
		description: 'Search query for academic papers. 1–400 characters.',
	},
	{
		displayName: 'Providers',
		name: 'providers',
		type: 'multiOptions',
		options: providerOptions,
		default: ['semantic-scholar'],
		displayOptions: { show: { resource: ['academic'], operation: ['search', 'findCitations'] } },
		description: 'Academic databases to search. Results are merged across providers.',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1, maxValue: 100 },
		displayOptions: { show: { resource: ['academic'], operation: ['search'] } },
		description: 'Max number of results to return',
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0 },
		displayOptions: { show: { resource: ['academic'], operation: ['search'] } },
		description: 'Number of results to skip (for pagination)',
	},
	{
		displayName: 'Year From',
		name: 'yearFrom',
		type: 'number',
		default: '',
		typeOptions: { minValue: 1900, maxValue: 2100 },
		displayOptions: { show: { resource: ['academic'], operation: ['search'] } },
		description: 'Only include papers published in or after this year',
	},
	{
		displayName: 'Year To',
		name: 'yearTo',
		type: 'number',
		default: '',
		typeOptions: { minValue: 1900, maxValue: 2100 },
		displayOptions: { show: { resource: ['academic'], operation: ['search'] } },
		description: 'Only include papers published in or before this year',
	},
	{
		displayName: 'Fields to Return',
		name: 'fields',
		type: 'multiOptions',
		options: fieldOptions,
		default: [],
		displayOptions: { show: { resource: ['academic'], operation: ['search', 'fetch'] } },
		description: 'Which fields to include in results. Leave empty for all default fields.',
	},

	// ─── Fetch ──────────────────────────────────────────
	{
		displayName: 'Publication IDs',
		name: 'ids',
		type: 'string',
		default: '',
		required: true,
		placeholder: '10.1038/nature12373, 2301.08745, 33293753',
		displayOptions: { show: { resource: ['academic'], operation: ['fetch'] } },
		description:
			'Comma-separated list of publication identifiers. Supports DOI, PubMed ID, ArXiv ID, Semantic Scholar ID, ERIC ID, Europe PMC ID, OpenAlex ID. Max 100.',
	},

	// ─── Find Citations ─────────────────────────────────
	{
		displayName: 'Paragraph',
		name: 'paragraph',
		type: 'string',
		default: '',
		required: true,
		placeholder:
			'Transformers have revolutionized natural language processing. Attention mechanisms allow models to focus on relevant parts of the input.',
		typeOptions: { rows: 5 },
		displayOptions: { show: { resource: ['academic'], operation: ['findCitations'] } },
		description:
			'Text paragraph to find citations for. The text is split into sentences, and relevant papers are found for each. Max 5000 characters.',
	},
];

export async function executeAcademic(
	ef: IExecuteFunctions,
	domain: string,
	apiKey: string,
	operation: string,
	i: number,
): Promise<Record<string, unknown>> {
	if (operation === 'search') {
		const query = ef.getNodeParameter('query', i) as string;
		const providers = ef.getNodeParameter('providers', i, ['semantic-scholar']) as NonNullable<
			AcademicSearchBody['providers']
		>;
		const limit = ef.getNodeParameter('limit', i, 50) as number;
		const offset = ef.getNodeParameter('offset', i, 0) as number;
		const yearFrom = ef.getNodeParameter('yearFrom', i, '') as number | '';
		const yearTo = ef.getNodeParameter('yearTo', i, '') as number | '';
		const fields = ef.getNodeParameter('fields', i, []) as NonNullable<
			NonNullable<AcademicSearchBody['fields']>
		>;
		const body: AcademicSearchBody = {
			query,
			providers,
			limit,
			offset,
			...(yearFrom ? { yearFrom } : {}),
			...(yearTo ? { yearTo } : {}),
			...(fields.length > 0 ? { fields } : {}),
		};
		return await apiRequest(ef, domain, apiKey, '/academic/search', body);
	}
	if (operation === 'fetch') {
		const ids = (ef.getNodeParameter('ids', i) as string)
			.split(',')
			.map((id) => id.trim())
			.filter(Boolean);
		const fields = ef.getNodeParameter('fields', i, []) as NonNullable<
			NonNullable<AcademicFetchBody['fields']>
		>;
		const body: AcademicFetchBody = {
			ids,
			...(fields.length > 0 ? { fields } : {}),
		};
		return await apiRequest(ef, domain, apiKey, '/academic/fetch', body);
	}
	if (operation === 'findCitations') {
		const paragraph = ef.getNodeParameter('paragraph', i) as string;
		const providers = ef.getNodeParameter('providers', i, ['semantic-scholar']) as NonNullable<
			AcademicFindCitationsBody['providers']
		>;
		const body: AcademicFindCitationsBody = {
			paragraph,
			providers,
		};
		return await apiRequest(ef, domain, apiKey, '/academic/findCitations', body);
	}
	return {};
}
