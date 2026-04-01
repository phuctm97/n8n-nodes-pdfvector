import { mkdir, writeFile } from 'node:fs/promises';

const REFERENCE_URL = 'https://global.pdfvector.com/api/reference';
const OUTPUT_PATH = new URL('../openapi/pdfvector.openapi.json', import.meta.url);

async function main() {
	const response = await fetch(REFERENCE_URL);

	if (!response.ok) {
		throw new Error(`Failed to fetch ${REFERENCE_URL}: ${response.status} ${response.statusText}`);
	}

	const html = await response.text();
	const match = html.match(/const scalarConfig = (\{.*?\})\s*Scalar\.createApiReference/s);

	if (!match) {
		throw new Error('Could not find embedded OpenAPI config in PDF Vector API reference page');
	}

	const scalarConfig = JSON.parse(match[1]);

	if (typeof scalarConfig.content !== 'string') {
		throw new Error('Embedded API reference config did not contain a string OpenAPI payload');
	}

	const spec = JSON.parse(scalarConfig.content);

	await mkdir(new URL('../openapi', import.meta.url), { recursive: true });
	await writeFile(OUTPUT_PATH, `${JSON.stringify(spec, null, 2)}\n`);

	console.log(`Wrote OpenAPI spec to ${OUTPUT_PATH.pathname}`);
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
