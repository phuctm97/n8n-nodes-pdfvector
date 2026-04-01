import type { paths } from './pdfvector-api.types.js';

export type ApiPath = Extract<keyof paths, string>;

type PostOperation<Path extends ApiPath> = NonNullable<paths[Path]['post']>;

export type JsonRequestBody<Path extends ApiPath> = PostOperation<Path> extends {
	requestBody: { content: { 'application/json': infer Body } };
}
	? Body
	: never;

export type JsonResponseBody<Path extends ApiPath> = PostOperation<Path> extends {
	responses: { 200: { content: { 'application/json': infer Body } } };
}
	? Body
	: never;

export type JsonRequestModel<Path extends ApiPath> = JsonRequestBody<Path> extends {
	model?: infer Model;
}
	? NonNullable<Model>
	: never;

export type JsonRequestSchema<Path extends ApiPath> = JsonRequestBody<Path> extends {
	schema: infer Schema;
}
	? Exclude<Schema, string>
	: never;

type ArrayElement<Value> = Value extends readonly (infer Item)[] ? Item : never;

export type AcademicProvider = ArrayElement<
	Exclude<JsonRequestBody<'/academic/search'>['providers'], null | undefined>
>;

export type AcademicField = ArrayElement<
	Exclude<JsonRequestBody<'/academic/search'>['fields'], null | undefined>
>;

export type OptionValue<T extends string> = {
	name: string;
	value: T;
	description?: string;
};

export type DocumentInput = { url: string } | { base64: string };
