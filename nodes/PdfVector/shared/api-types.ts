import type { paths } from './pdfvector-api';

export type ApiPath = {
	[TPath in keyof paths & string]: paths[TPath] extends { post: unknown } ? TPath : never;
}[keyof paths & string];

type PostOperation<TPath extends ApiPath> = paths[TPath] extends { post: infer TOperation }
	? TOperation
	: never;

type RequestContent<TPath extends ApiPath> = PostOperation<TPath> extends {
	requestBody: { content: infer TContent };
}
	? TContent
	: never;

type ResponseContent<TPath extends ApiPath> = PostOperation<TPath> extends {
	responses: { 200: { content: infer TContent } };
}
	? TContent
	: never;

export type JsonRequestBody<TPath extends ApiPath> = RequestContent<TPath> extends {
	'application/json': infer TBody;
}
	? TBody
	: never;

export type JsonResponseBody<TPath extends ApiPath> = ResponseContent<TPath> extends {
	'application/json': infer TBody;
}
	? TBody
	: never;
