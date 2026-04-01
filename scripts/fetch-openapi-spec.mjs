import { mkdir, writeFile } from 'node:fs/promises';

const REFERENCE_URL = 'https://global.pdfvector.com/api/reference.json';
const OUTPUT_PATH = new URL('../openapi/pdfvector.openapi.json', import.meta.url);

async function main() {
	const response = await fetch(REFERENCE_URL);

	if (!response.ok) {
		throw new Error(`Failed to fetch ${REFERENCE_URL}: ${response.status} ${response.statusText}`);
	}

	const spec = await response.json();

	await mkdir(new URL('../openapi', import.meta.url), { recursive: true });
	await writeFile(OUTPUT_PATH, `${JSON.stringify(spec, null, 2)}\n`);

	console.log(`Wrote OpenAPI spec to ${OUTPUT_PATH.pathname}`);
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
