/**
 * Which panel this build is (docs: backend/docs/multi-tenancy, D7/D8).
 *
 * The super-admin panel and the tenant panel are the same app. The tenant one
 * runs with NEXT_PUBLIC_PANEL=tenant and NEXT_PUBLIC_BACKEND=<api>/tenant/api,
 * and every component in this library works in both — never copy one for the
 * tenant panel; branch on IS_TENANT_PANEL instead.
 *
 * No imports here: the store and the API slice read this module.
 */
export type Panel = 'admin' | 'tenant';

export const PANEL: Panel = process.env.NEXT_PUBLIC_PANEL === 'tenant' ? 'tenant' : 'admin';
export const IS_TENANT_PANEL = PANEL === 'tenant';

export const BACKEND = (process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:5000').replace(/\/+$/, '');

/* ------------------------------------------------- the current project */

const PROJECT_KEY = 'mint:tenant-project';

/** The project the tenant panel is working in (one per browser; switching reloads). */
export const getProjectId = (): string | null => {
	if (!IS_TENANT_PANEL || typeof window === 'undefined') return null;
	try {
		const id = localStorage.getItem(PROJECT_KEY);
		return id && /^[a-f0-9]{24}$/.test(id) ? id : null;
	} catch {
		return null;
	}
};

export const setProjectId = (id: string | null) => {
	try {
		if (id) localStorage.setItem(PROJECT_KEY, id);
		else localStorage.removeItem(PROJECT_KEY);
	} catch {
		/* storage blocked: the panel opens with no project */
	}
};

/* ------------------------------------------------------- API addresses */

/**
 * Account and organization calls go to the tenant API's root; everything else
 * — tables, the builder, the sidebar, media — is inside the current project
 * (`<api>/p/<projectId>/…`), mirroring the admin API's paths.
 */
const ACCOUNT_PATH = /^\/?(auth|org|projects|invitations)(\/|\?|$)/;

/** The base URL a request for `path` goes to. */
export const apiBase = (path = ''): string => {
	if (!IS_TENANT_PANEL) return BACKEND;
	const project = getProjectId();
	if (!project || ACCOUNT_PATH.test(path)) return BACKEND;
	return `${BACKEND}/p/${project}`;
};

/** A full API URL for `path` (relative to the admin API's root). */
export const apiUrl = (path = ''): string => {
	if (/^https?:\/\//i.test(path)) return path;
	return `${apiBase(path)}/${path.replace(/^\/+/, '')}`;
};

/* ------------------------------------------------------- page addresses */

/**
 * A model's table page. The tenant panel serves its projects' tables under
 * /t/<route>: the two panels are one app, and a project route named like one
 * of the admin's own pages (`/invoices`, `/clients`…) would otherwise open
 * that page instead of its table.
 */
export const pagePath = (route = ''): string => {
	const r = String(route).replace(/^\/+/, '');
	return IS_TENANT_PANEL ? `/t/${r}` : `/${r}`;
};

/* ------------------------------------------------------------- guides */

/**
 * The tenant panel's guides are the user guides (/user-docs); /docs belongs
 * to the super-admin panel (its guides and the component library). Screens
 * shared by both panels link to a /docs guide — `docsPath` turns that into
 * the user guide covering the same thing, keeping the section anchor (the user
 * guides use the same ids). In the super-admin panel it changes nothing.
 */
const USER_DOCS = '/user-docs';

const userDocsFor = (guide: string, anchor: string): [string, string] => {
	switch (guide) {
		case '':
			return ['', ''];
		case 'builder':
			if (/^mcp/.test(anchor)) return ['connect-ai', anchor];
			if (/^features/.test(anchor)) return ['models', 'features'];
			if (/^(models|notifications)/.test(anchor)) return ['models', anchor];
			return ['pages', anchor];
		case 'sidebar-builder':
			return ['sidebar', anchor];
		case 'dashboard-builder':
			return ['dashboard', anchor];
		case 'media':
			return ['media', anchor];
		case 'two-factor':
			return ['account', anchor];
		case 'themes':
			return ['account', 'appearance'];
		default:
			return ['', ''];
	}
};

/** A guide link for this panel: `/docs/<guide>#<section>`, or its user guide in the tenant panel. */
export const docsPath = (href: string): string => {
	if (!IS_TENANT_PANEL) return href;
	const [path, anchor = ''] = href.split('#');
	const match = path.match(/^\/docs(?:\/([^/?]+))?/);
	if (!match) return href;
	const [page, section] = userDocsFor(match[1] || '', anchor);
	return `${USER_DOCS}${page ? `/${page}` : ''}${section ? `#${section}` : ''}`;
};
