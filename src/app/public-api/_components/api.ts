/**
 * The project's public API as the backend describes it (GET /public/api/<project>/,
 * backend routes-public/public.router.ts), and what the reference and the
 * tester build from it: endpoints, example bodies, example responses.
 */

export type ApiField = { key: string; label: string; kind: string; required: boolean; options?: string[] };
export type ApiModel = {
	route: string;
	title: string;
	actions: string[];
	auth: 'none' | 'customer';
	ownerOnly: boolean;
	fields: ApiField[];
};
export type ApiInfo = { name: string; type: 'app' | 'website'; slug: string; models: ApiModel[] };

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type Endpoint = {
	method: Method;
	/** Relative to the API's base: `/products`, `/products/:id`, `/auth/login`. */
	path: string;
	summary: string;
	/** Needs `Authorization: Bearer <customer token>`. */
	customer?: boolean;
	/** An example JSON body (POST, PUT). */
	body?: Record<string, any>;
};

/** Read filters the list takes (the backend's FILTERABLE kinds). */
export const FILTERABLE = new Set(['text', 'email', 'url', 'select', 'multiselect', 'tags', 'number', 'boolean', 'date', 'reference']);

// Formula fields are worked out by the server; they come back but can't be sent.
const sendable = (f: ApiField) => f.kind !== 'formula';

/** A plausible value for a field, for example bodies and responses. */
export const exampleOf = (f: ApiField): any => {
	switch (f.kind) {
		case 'email':
			return 'name@example.com';
		case 'url':
			return 'https://example.com';
		case 'number':
		case 'formula':
			return 10;
		case 'boolean':
			return true;
		case 'date':
			return '2026-10-02';
		case 'color':
			return '#2563eb';
		case 'select':
			return f.options?.[0] ?? 'value';
		case 'multiselect':
		case 'tags':
			return f.options?.slice(0, 2) ?? ['one', 'two'];
		case 'reference':
			return '<id of the linked record>';
		case 'references':
			return ['<id>', '<id>'];
		case 'image':
		case 'file':
		case 'video':
			return 'https://…/file.jpg';
		case 'images':
		case 'files':
			return ['https://…/1.jpg'];
		case 'section':
			return {};
		case 'sectionlist':
			return [];
		default:
			return f.label || 'Text';
	}
};

/** What a create sends: every required field, then the rest, by example. */
export const exampleBody = (m: ApiModel, all = false): Record<string, any> =>
	Object.fromEntries(m.fields.filter(f => sendable(f) && (all || f.required)).map(f => [f.key, exampleOf(f)]));

/** A record as the API returns it. */
export const exampleRecord = (m: ApiModel) => ({
	_id: '66f0c1d2e3a4b5c6d7e8f901',
	...Object.fromEntries(m.fields.map(f => [f.key, exampleOf(f)])),
	createdAt: '2026-10-02T09:30:00.000Z',
	updatedAt: '2026-10-02T09:30:00.000Z',
});

const ACTION_ENDPOINT: Record<string, (m: ApiModel) => Endpoint> = {
	list: m => ({ method: 'GET', path: `/${m.route}`, summary: `List ${m.title}` }),
	get: m => ({ method: 'GET', path: `/${m.route}/:id`, summary: 'Read one' }),
	create: m => ({ method: 'POST', path: `/${m.route}`, summary: 'Create', body: exampleBody(m, true) }),
	update: m => ({ method: 'PUT', path: `/${m.route}/:id`, summary: 'Update (send only what changes)', body: exampleBody(m) }),
	delete: m => ({ method: 'DELETE', path: `/${m.route}/:id`, summary: 'Delete' }),
};
const ORDER = ['list', 'get', 'create', 'update', 'delete'];

/** A model's endpoints, in the usual order. */
export const endpointsOf = (m: ApiModel): Endpoint[] =>
	ORDER.filter(a => m.actions.includes(a)).map(a => ({ ...ACTION_ENDPOINT[a](m), customer: m.auth === 'customer' }));

/** The customer sign-in endpoints every project has. */
export const AUTH_ENDPOINTS: Endpoint[] = [
	{ method: 'POST', path: '/auth/register', summary: 'Sign a customer up → { token, customer }', body: { name: 'Ada Lovelace', email: 'ada@example.com', password: 'at-least-8-characters' } },
	{ method: 'POST', path: '/auth/login', summary: 'Sign in → { token, customer }', body: { email: 'ada@example.com', password: 'at-least-8-characters' } },
	{ method: 'GET', path: '/auth/me', summary: 'The signed-in customer', customer: true },
	{ method: 'PUT', path: '/auth/me', summary: 'Change their name or phone', customer: true, body: { name: 'Ada King', phone: '+44 20 0000 0000' } },
	{ method: 'POST', path: '/auth/logout-everywhere', summary: 'Sign them out on every device', customer: true },
];

/** A website project's content endpoints. */
export const SITE_ENDPOINTS: Endpoint[] = [
	{ method: 'GET', path: '/site', summary: 'Site settings and menu' },
	{ method: 'GET', path: '/pages/by-path?path=/about', summary: 'A published page with its SEO and contents' },
];

export const METHOD_TONE: Record<Method, string> = { GET: 'green', POST: 'blue', PUT: 'orange', DELETE: 'red' };
