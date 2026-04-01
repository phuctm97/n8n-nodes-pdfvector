import type { IExecuteFunctions, INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import type { ApiOperation, ApiRequestBodyFor } from '../shared/helpers.js';
import { apiRequest, assertNever } from '../shared/helpers.js';
import { toActionOptions, toTypedOptions } from '../shared/options.js';

type TypedOption<TValue extends string> = INodePropertyOptions & { value: TValue };
type AcademicOperation = ApiOperation<'academic'>;
type AcademicProvider = NonNullable<ApiRequestBodyFor<'academic', 'search'>['providers']>[number];
type AcademicField = NonNullable<ApiRequestBodyFor<'academic', 'search'>['fields']>[number];

const providerOptionMetadata: Record<
	AcademicProvider,
	Pick<INodePropertyOptions, 'name' | 'description'>
> = {
	'semantic-scholar': {
		name: 'Semantic Scholar',
		description: 'Semanticscholar.org — largest free academic search engine',
	},
	pubmed: {
		name: 'PubMed',
		description: 'Pubmed.ncbi.nlm.nih.gov — biomedical literature',
	},
	arxiv: {
		name: 'ArXiv',
		description: 'Arxiv.org — physics, math, CS preprints',
	},
	'google-scholar': {
		name: 'Google Scholar',
		description: 'Scholar.google.com — broad academic search',
	},
	openalex: {
		name: 'OpenAlex',
		description: 'Openalex.org — open catalog of scholarly works',
	},
	eric: {
		name: 'ERIC',
		description: 'Eric.ed.gov — education research',
	},
	'europe-pmc': {
		name: 'Europe PMC',
		description: 'Europepmc.org — European biomedical literature',
	},
};

const fieldOptionMetadata: Record<
	AcademicField,
	Pick<INodePropertyOptions, 'name' | 'description'>
> = {
	title: { name: 'Title' },
	authors: { name: 'Authors' },
	year: { name: 'Year' },
	abstract: { name: 'Abstract' },
	doi: { name: 'DOI' },
	url: { name: 'URL' },
	pdfURL: { name: 'PDF URL' },
	date: { name: 'Date' },
	totalCitations: { name: 'Total Citations' },
	totalReferences: { name: 'Total References' },
	provider: { name: 'Provider' },
	providerURL: { name: 'Provider URL' },
	providerData: {
		name: 'Provider Data',
		description: 'Raw provider-specific metadata',
	},
};

const providerOptions = toTypedOptions(providerOptionMetadata) as TypedOption<AcademicProvider>[];
const fieldOptions = toTypedOptions(fieldOptionMetadata) as TypedOption<AcademicField>[];
const academicOperationOptions = toActionOptions<AcademicOperation>({
	search: {
		name: 'Search',
		description: 'Search for academic papers across multiple databases',
		action: 'Search academic papers',
	},
	fetch: {
		name: 'Fetch',
		description: 'Fetch specific papers by DOI, PubMed ID, ArXiv ID, etc',
		action: 'Fetch papers by ID',
	},
	findCitations: {
		name: 'Find Citations',
		description: 'Find relevant academic citations for a paragraph of text',
		action: 'Find citations for text',
	},
});

export const academicProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['academic'] } },
		options: academicOperationOptions,
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
		displayOptions: { show: { resource: ['academic'], operation: ['search', 'fetch', 'findCitations'] } },
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
	operation: AcademicOperation,
	i: number,
){
	switch (operation) {
		case 'search': {
			const query = ef.getNodeParameter('query', i) as string;
			const providers = ef.getNodeParameter('providers', i, [
				'semantic-scholar',
			]) as AcademicProvider[];
			const limit = ef.getNodeParameter('limit', i, 50) as number;
			const offset = ef.getNodeParameter('offset', i, 0) as number;
			const yearFrom = ef.getNodeParameter('yearFrom', i, '') as number | '';
			const yearTo = ef.getNodeParameter('yearTo', i, '') as number | '';
			const fields = ef.getNodeParameter('fields', i, []) as AcademicField[];

			return await apiRequest(ef, domain, apiKey, '/academic/search', {
				query,
				providers,
				limit,
				offset,
				...(yearFrom === '' ? {} : { yearFrom }),
				...(yearTo === '' ? {} : { yearTo }),
				...(fields.length > 0 ? { fields } : {}),
			});
		}
		case 'fetch': {
			const ids = (ef.getNodeParameter('ids', i) as string)
				.split(',')
				.map((id) => id.trim())
				.filter(Boolean);
			const fields = ef.getNodeParameter('fields', i, []) as AcademicField[];

			return await apiRequest(ef, domain, apiKey, '/academic/fetch', {
				ids,
				...(fields.length > 0 ? { fields } : {}),
			});
		}
		case 'findCitations': {
			const paragraph = ef.getNodeParameter('paragraph', i) as string;
			const providers = ef.getNodeParameter('providers', i, [
				'semantic-scholar',
			]) as AcademicProvider[];
			const fields = ef.getNodeParameter('fields', i, []) as AcademicField[];

			return await apiRequest(ef, domain, apiKey, '/academic/findCitations', {
				paragraph,
				providers,
				...(fields.length > 0 ? { fields } : {}),
			});
		}
	}

	return assertNever(operation);
}
