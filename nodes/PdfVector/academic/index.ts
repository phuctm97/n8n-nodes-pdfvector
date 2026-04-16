import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import type {
	AcademicField,
	AcademicProvider,
	GrantField,
	GrantProvider,
	JsonRequestBody,
	OptionValue,
} from '../shared/api.js';
import { apiRequest } from '../shared/helpers.js';

type AcademicSearchRequest = JsonRequestBody<'/academic/search'>;
type AcademicFetchRequest = JsonRequestBody<'/academic/fetch'>;
type AcademicFindCitationsRequest = JsonRequestBody<'/academic/findCitations'>;
type AcademicPaperGraphRequest = JsonRequestBody<'/academic/paperGraph'>;
type AcademicSimilarPapersRequest = JsonRequestBody<'/academic/similarPapers'>;
type AcademicSearchGrantsRequest = JsonRequestBody<'/academic/searchGrants'>;

type AcademicProviders = Exclude<AcademicSearchRequest['providers'], undefined>;
type AcademicFields = Exclude<AcademicSearchRequest['fields'], null | undefined>;

const providerOptions: Array<OptionValue<AcademicProvider>> = [
	{ name: 'Semantic Scholar', value: 'semantic-scholar', description: 'Semanticscholar.org — largest free academic search engine' },
	{ name: 'PubMed', value: 'pubmed', description: 'Pubmed.ncbi.nlm.nih.gov — biomedical literature' },
	{ name: 'ArXiv', value: 'arxiv', description: 'Arxiv.org — physics, math, CS preprints' },
	{ name: 'Google Scholar', value: 'google-scholar', description: 'Scholar.google.com — broad academic search' },
	{ name: 'OpenAlex', value: 'openalex', description: 'Openalex.org — open catalog of scholarly works' },
	{ name: 'ERIC', value: 'eric', description: 'Eric.ed.gov — education research' },
	{ name: 'Europe PMC', value: 'europe-pmc', description: 'Europepmc.org — European biomedical literature' },
	{ name: 'Crossref', value: 'crossref', description: 'Crossref.org — DOI registration and metadata' },
];

const fieldOptions: Array<OptionValue<AcademicField>> = [
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

const grantProviderOptions: Array<OptionValue<GrantProvider>> = [
	{ name: 'Grants.gov', value: 'grants-gov', description: 'Grants.gov — USA federal grants' },
	{ name: 'NIH RePORTER', value: 'nih-reporter', description: 'NIH RePORTER — National Institutes of Health' },
	{ name: 'CORDIS', value: 'cordis', description: 'CORDIS — EU research funding' },
	{ name: 'UKRI', value: 'ukri', description: 'UKRI — UK Research and Innovation' },
];

const grantFieldOptions: Array<OptionValue<GrantField>> = [
	{ name: 'Source ID', value: 'sourceId' },
	{ name: 'Title', value: 'title' },
	{ name: 'URL', value: 'url' },
	{ name: 'Agency', value: 'agency' },
	{ name: 'Program', value: 'program' },
	{ name: 'Description', value: 'description' },
	{ name: 'Eligibility', value: 'eligibility' },
	{ name: 'Funding Amount Min', value: 'fundingAmountMin' },
	{ name: 'Funding Amount Max', value: 'fundingAmountMax' },
	{ name: 'Currency', value: 'currency' },
	{ name: 'Deadline Date', value: 'deadlineDate' },
	{ name: 'Open Date', value: 'openDate' },
	{ name: 'Close Date', value: 'closeDate' },
	{ name: 'Grant Type', value: 'grantType' },
	{ name: 'Region', value: 'region' },
	{ name: 'Keywords', value: 'keywords' },
	{ name: 'PI Name', value: 'piName' },
	{ name: 'Organization Name', value: 'organizationName' },
	{ name: 'Provider', value: 'provider' },
	{ name: 'Provider Data', value: 'providerData', description: 'Raw provider-specific metadata' },
];

export const academicProperties: INodeProperties[] = [
	{
		displayName: '',
		name: 'academicDocsNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['academic'] } },
		description: 'See the <a href="https://global.pdfvector.com/api/reference" target="_blank">API Reference</a> for full documentation on Academic operations',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['academic'] } },
		options: [
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
			{
				name: 'Paper Graph',
				value: 'paperGraph',
				description: 'Get citations and references for a paper',
				action: 'Get paper citation graph',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search for academic papers across multiple databases',
				action: 'Search academic papers',
			},
			{
				name: 'Search Grants',
				value: 'searchGrants',
				description: 'Search for research grants across multiple funding databases',
				action: 'Search research grants',
			},
			{
				name: 'Similar Papers',
				value: 'similarPapers',
				description: 'Find papers similar to a given paper using citation network analysis',
				action: 'Find similar papers',
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
		displayOptions: { show: { resource: ['academic'], operation: ['search'] } },
		description: 'Only include papers published in or after this year (e.g. 2020). Leave empty for no filter.',
	},
	{
		displayName: 'Year To',
		name: 'yearTo',
		type: 'number',
		default: '',
		displayOptions: { show: { resource: ['academic'], operation: ['search'] } },
		description: 'Only include papers published in or before this year (e.g. 2025). Leave empty for no filter.',
	},
	{
		displayName: 'Fields to Return',
		name: 'fields',
		type: 'multiOptions',
		options: fieldOptions,
		default: [],
		displayOptions: { show: { resource: ['academic'], operation: ['search', 'fetch', 'findCitations', 'paperGraph', 'similarPapers'] } },
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

	// ─── Paper Graph ────────────────────────────────────
	{
		displayName: 'Paper ID',
		name: 'paperId',
		type: 'string',
		default: '',
		required: true,
		placeholder: '10.1038/nature12373',
		displayOptions: { show: { resource: ['academic'], operation: ['paperGraph', 'similarPapers'] } },
		description:
			'Paper identifier. Supports DOI, Semantic Scholar ID, ArXiv ID, PubMed ID, OpenAlex ID, or URL.',
	},
	{
		displayName: 'Citations Limit',
		name: 'citationsLimit',
		type: 'number',
		default: 100,
		typeOptions: { minValue: 0, maxValue: 1000 },
		displayOptions: { show: { resource: ['academic'], operation: ['paperGraph'] } },
		description: 'Max number of citing papers to return',
	},
	{
		displayName: 'References Limit',
		name: 'referencesLimit',
		type: 'number',
		default: 100,
		typeOptions: { minValue: 0, maxValue: 1000 },
		displayOptions: { show: { resource: ['academic'], operation: ['paperGraph'] } },
		description: 'Max number of referenced papers to return',
	},
	{
		displayName: 'Citations Offset',
		name: 'citationsOffset',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0 },
		displayOptions: { show: { resource: ['academic'], operation: ['paperGraph'] } },
		description: 'Number of citing papers to skip (for pagination)',
	},
	{
		displayName: 'References Offset',
		name: 'referencesOffset',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0 },
		displayOptions: { show: { resource: ['academic'], operation: ['paperGraph'] } },
		description: 'Number of referenced papers to skip (for pagination)',
	},

	// ─── Similar Papers ─────────────────────────────────
	{
		displayName: 'Limit',
		name: 'similarLimit',
		type: 'number',
		default: 30,
		typeOptions: { minValue: 1, maxValue: 100 },
		displayOptions: { show: { resource: ['academic'], operation: ['similarPapers'] } },
		description: 'Max number of similar papers to return',
	},
	{
		displayName: 'Include Edges',
		name: 'includeEdges',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['academic'], operation: ['similarPapers'] } },
		description: 'Whether to include citation graph edge data (citingIds, citedByIds) in results',
	},

	// ─── Search Grants ──────────────────────────────────
	{
		displayName: 'Query',
		name: 'grantQuery',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'machine learning healthcare',
		displayOptions: { show: { resource: ['academic'], operation: ['searchGrants'] } },
		description: 'Search query for research grants. 1–400 characters.',
	},
	{
		displayName: 'Providers',
		name: 'grantProviders',
		type: 'multiOptions',
		options: grantProviderOptions,
		default: ['grants-gov', 'nih-reporter', 'cordis', 'ukri'],
		displayOptions: { show: { resource: ['academic'], operation: ['searchGrants'] } },
		description: 'Grant databases to search. Results are merged across providers.',
	},
	{
		displayName: 'Limit',
		name: 'grantLimit',
		type: 'number',
		default: 10,
		typeOptions: { minValue: 1, maxValue: 50 },
		displayOptions: { show: { resource: ['academic'], operation: ['searchGrants'] } },
		description: 'Max number of results per provider',
	},
	{
		displayName: 'Offset',
		name: 'grantOffset',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0 },
		displayOptions: { show: { resource: ['academic'], operation: ['searchGrants'] } },
		description: 'Number of results to skip (for pagination)',
	},
	{
		displayName: 'Deadline From',
		name: 'deadlineFrom',
		type: 'string',
		default: '',
		placeholder: '2025-01-01',
		displayOptions: { show: { resource: ['academic'], operation: ['searchGrants'] } },
		description: 'Only include grants with deadline on or after this date (YYYY-MM-DD)',
	},
	{
		displayName: 'Deadline To',
		name: 'deadlineTo',
		type: 'string',
		default: '',
		placeholder: '2025-12-31',
		displayOptions: { show: { resource: ['academic'], operation: ['searchGrants'] } },
		description: 'Only include grants with deadline on or before this date (YYYY-MM-DD)',
	},
	{
		displayName: 'Minimum Funding',
		name: 'fundingMin',
		type: 'number',
		default: '',
		displayOptions: { show: { resource: ['academic'], operation: ['searchGrants'] } },
		description: 'Minimum funding amount to filter by. Leave empty for no filter.',
	},
	{
		displayName: 'Maximum Funding',
		name: 'fundingMax',
		type: 'number',
		default: '',
		displayOptions: { show: { resource: ['academic'], operation: ['searchGrants'] } },
		description: 'Maximum funding amount to filter by. Leave empty for no filter.',
	},
	{
		displayName: 'Fields to Return',
		name: 'grantFields',
		type: 'multiOptions',
		options: grantFieldOptions,
		default: [],
		displayOptions: { show: { resource: ['academic'], operation: ['searchGrants'] } },
		description: 'Which fields to include in results. Leave empty for all default fields.',
	},
];

export async function executeAcademic(
	ef: IExecuteFunctions,
	domain: string,
	operation: string,
	i: number,
): Promise<Record<string, unknown>> {
	if (operation === 'search') {
		const query = ef.getNodeParameter('query', i) as AcademicSearchRequest['query'];
		const providers = ef.getNodeParameter('providers', i, ['semantic-scholar']) as AcademicProviders;
		const limit = ef.getNodeParameter('limit', i, 50) as NonNullable<AcademicSearchRequest['limit']>;
		const offset = ef.getNodeParameter('offset', i, 0) as NonNullable<AcademicSearchRequest['offset']>;
		const yearFrom = ef.getNodeParameter('yearFrom', i, '') as number | '';
		const yearTo = ef.getNodeParameter('yearTo', i, '') as number | '';
		const fields = ef.getNodeParameter('fields', i, []) as AcademicFields;
		return await apiRequest(ef, domain, '/academic/search', {
			query,
			providers,
			limit,
			offset,
			...(yearFrom ? { yearFrom } : {}),
			...(yearTo ? { yearTo } : {}),
			...(fields.length > 0 ? { fields } : {}),
		});
	}
	if (operation === 'fetch') {
		const ids = (ef.getNodeParameter('ids', i) as string)
			.split(',')
			.map((id) => id.trim())
			.filter(Boolean) as AcademicFetchRequest['ids'];
		const fields = ef.getNodeParameter('fields', i, []) as AcademicFields;
		return await apiRequest(ef, domain, '/academic/fetch', {
			ids,
			...(fields.length > 0 ? { fields } : {}),
		});
	}
	if (operation === 'findCitations') {
		const paragraph = ef.getNodeParameter('paragraph', i) as AcademicFindCitationsRequest['paragraph'];
		const providers = ef.getNodeParameter('providers', i, ['semantic-scholar']) as AcademicProviders;
		const fields = ef.getNodeParameter('fields', i, []) as AcademicFields;
		return await apiRequest(ef, domain, '/academic/findCitations', {
			paragraph,
			providers,
			...(fields.length > 0 ? { fields } : {}),
		});
	}
	if (operation === 'paperGraph') {
		const id = ef.getNodeParameter('paperId', i) as AcademicPaperGraphRequest['id'];
		const citationsLimit = ef.getNodeParameter('citationsLimit', i, 100) as number;
		const referencesLimit = ef.getNodeParameter('referencesLimit', i, 100) as number;
		const citationsOffset = ef.getNodeParameter('citationsOffset', i, 0) as number;
		const referencesOffset = ef.getNodeParameter('referencesOffset', i, 0) as number;
		const fields = ef.getNodeParameter('fields', i, []) as AcademicFields;
		return await apiRequest(ef, domain, '/academic/paperGraph', {
			id,
			citationsLimit,
			referencesLimit,
			citationsOffset,
			referencesOffset,
			...(fields.length > 0 ? { fields } : {}),
		});
	}
	if (operation === 'similarPapers') {
		const id = ef.getNodeParameter('paperId', i) as AcademicSimilarPapersRequest['id'];
		const limit = ef.getNodeParameter('similarLimit', i, 30) as number;
		const includeEdges = ef.getNodeParameter('includeEdges', i, false) as boolean;
		const fields = ef.getNodeParameter('fields', i, []) as AcademicFields;
		return await apiRequest(ef, domain, '/academic/similarPapers', {
			id,
			limit,
			includeEdges,
			...(fields.length > 0 ? { fields } : {}),
		});
	}
	if (operation === 'searchGrants') {
		type GrantProviders = Exclude<AcademicSearchGrantsRequest['providers'], undefined>;
		type GrantFields = Exclude<AcademicSearchGrantsRequest['fields'], null | undefined>;
		const query = ef.getNodeParameter('grantQuery', i) as AcademicSearchGrantsRequest['query'];
		const providers = ef.getNodeParameter('grantProviders', i, ['grants-gov', 'nih-reporter', 'cordis', 'ukri']) as GrantProviders;
		const limit = ef.getNodeParameter('grantLimit', i, 10) as number;
		const offset = ef.getNodeParameter('grantOffset', i, 0) as number;
		const deadlineFrom = ef.getNodeParameter('deadlineFrom', i, '') as string;
		const deadlineTo = ef.getNodeParameter('deadlineTo', i, '') as string;
		const fundingMin = ef.getNodeParameter('fundingMin', i, '') as number | '';
		const fundingMax = ef.getNodeParameter('fundingMax', i, '') as number | '';
		const fields = ef.getNodeParameter('grantFields', i, []) as GrantFields;
		return await apiRequest(ef, domain, '/academic/searchGrants', {
			query,
			providers,
			limit,
			offset,
			...(deadlineFrom ? { deadlineFrom } : {}),
			...(deadlineTo ? { deadlineTo } : {}),
			...(fundingMin !== '' && fundingMin > 0 ? { fundingMin } : {}),
			...(fundingMax !== '' && fundingMax > 0 ? { fundingMax } : {}),
			...(fields.length > 0 ? { fields } : {}),
		});
	}
	return {};
}
