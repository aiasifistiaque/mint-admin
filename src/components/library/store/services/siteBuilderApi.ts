import { mainApi, routeTags } from './mainApi';

/**
 * The site builder (backend docs/site-builder; routes-tenant/siteBuilder.router.ts):
 * /tenant/api/p/:project/site-builder/*. The editor keeps its own draft of the
 * open page (site-builder/_components/useDraft.ts), so saving a page doesn't
 * refetch it — only the page list, whose status chips change.
 */

export type SbBreakpoint = 'base' | 'md' | 'lg';

export type SbAction =
	| { type: 'link'; href: string; newTab?: boolean }
	| { type: 'page'; pageId: string; newTab?: boolean }
	| { type: 'open' | 'close' | 'toggle' | 'scroll'; target: string }
	| { type: 'widget'; widget: string; op?: 'open' | 'add' };

export type SbNode = {
	id: string;
	type: string;
	name?: string;
	props: Record<string, any>;
	style?: Partial<Record<SbBreakpoint, Record<string, any>>>;
	hidden?: Partial<Record<SbBreakpoint, boolean>>;
	bind?: Record<string, any>;
	children?: SbNode[];
	slots?: Record<string, SbNode[]>;
	action?: SbAction;
	locked?: boolean;
};

export type SbPropDef = {
	key: string;
	label: string;
	kind: string;
	options?: { value: string | number; label: string }[];
	default?: any;
	help?: string;
	bindable?: boolean;
	min?: number;
	max?: number;
	fields?: SbPropDef[];
};

export type SbBlockDef = {
	type: string;
	label: string;
	category: string;
	icon: string;
	description: string;
	aiHint: string;
	props: SbPropDef[];
	slots?: Record<string, { label?: string; allow?: string[] }>;
	canBeChildOf?: string[];
	style: 'all' | string[];
	defaults: { props: Record<string, any>; style?: SbNode['style']; children?: SbNode[] };
	client?: boolean;
	actions?: boolean;
};

export type SbManifest = {
	version: string;
	blocks: SbBlockDef[];
	presets: { key: string; label: string; category: string; thumbnail: string; tree: SbNode[] }[];
	themes: SbTheme[];
	tokens: Record<string, any>;
	fonts: { google: SbFont[]; system: string[] };
	style: Record<string, { group: string; kind: string; values?: (string | number)[]; min?: number; max?: number; also?: string[]; units?: Record<string, number> }>;
	icons: string[];
	embeds: string[];
	limits: { maxNodes: number; maxDepth: number; maxBytes: number };
};

export type SbColorPair = { light: string; dark: string };
export type SbTokens = {
	colors: Record<string, SbColorPair>;
	fonts: Record<'heading' | 'body' | 'mono', { family: string; weights: number[] }>;
	radius: Record<string, string>;
	shadow: Record<string, string>;
	space: Record<string, string>;
	container: number;
	button: { radius: string; weight: number; uppercase: boolean };
};
export type SbTheme = { key: string; label: string; description: string; tokens: SbTokens; preview: { bg: string; fg: string; primary: string; font: string } };
export type SbFont = { family: string; category: 'sans' | 'serif' | 'display' | 'mono' | 'hand'; weights: number[] };

export type SbSeo = { title: string; description: string; image: string; noIndex: boolean; canonical: string; keywords: string[] };

export type SbPageSummary = {
	id: string;
	name: string;
	path: string;
	kind: 'static' | 'template';
	status: 'draft' | 'published' | 'unpublished';
	isHome: boolean;
	showInMenu: boolean;
	menuLabel: string;
	priority: number;
	layout: string;
	changed: boolean;
	rev: number;
	updatedAt: string;
	publishedAt: string | null;
};

export type SbProblem = { level: 'error' | 'publish' | 'warning'; nodeId?: string; path: string; message: string; page?: string; pageName?: string; part?: 'page' | 'design' };

export type SbPage = SbPageSummary & {
	source: any;
	draft: { tree: SbNode[]; seo: SbSeo; rev: number; updatedAt: string | null };
	published: { path: string; version: number; publishedAt: string } | null;
	problems?: SbProblem[];
};

export type SbDesignDraft = {
	theme: string;
	tokens: Record<string, any>;
	colorScheme: 'light' | 'dark' | 'system';
	layouts: Record<string, { header: SbNode[]; footer: SbNode[] }>;
	sections: Record<string, { name: string; tree: SbNode[] }>;
	rev: number;
};

/** Where each saved section is used (page drafts and layouts). */
export type SbSectionUsage = Record<string, { pages: { id: string; name: string }[]; layouts: string[] }>;

export type SbDesign = { draft: SbDesignDraft; published: { version: number; publishedAt: string; theme: string } | null; changed: boolean; usage?: SbSectionUsage };

export type SbChanges = {
	pages: Record<'added' | 'changed' | 'removed' | 'unpublished', { id: string; name: string; path: string }[]>;
	design: boolean;
	any: boolean;
	problems: SbProblem[];
	canPublish: boolean;
	live: { version: number; publishedAt: string } | null;
	url: string | null;
};

export type SbPageInput = Partial<Pick<SbPageSummary, 'name' | 'path' | 'kind' | 'layout' | 'showInMenu' | 'menuLabel' | 'priority'>> & {
	tree?: SbNode[];
	seo?: Partial<SbSeo>;
	source?: any;
};

const PAGES = 'site-builder-pages';
const DESIGN = 'site-builder-design';
const CHANGES = 'site-builder-changes';
const RELEASES = 'site-builder-releases';

export const siteBuilderApi = mainApi.injectEndpoints({
	endpoints: builder => ({
		siteBuilderManifest: builder.query<SbManifest, void>({
			query: () => 'site-builder/manifest',
			keepUnusedDataFor: 3600,
		}),
		siteBuilderPages: builder.query<{ pages: SbPageSummary[]; url: string | null }, void>({
			query: () => 'site-builder/pages',
			providesTags: () => routeTags(PAGES),
		}),
		siteBuilderPage: builder.query<SbPage, string>({
			query: id => `site-builder/pages/${id}`,
			keepUnusedDataFor: 0,
		}),
		siteBuilderCreatePage: builder.mutation<SbPage, SbPageInput>({
			query: body => ({ url: 'site-builder/pages', method: 'POST', body }),
			invalidatesTags: () => routeTags(PAGES, CHANGES),
		}),
		siteBuilderSavePage: builder.mutation<SbPage, SbPageInput & { id: string; rev: number; status?: 'draft' }>({
			query: ({ id, ...body }) => ({ url: `site-builder/pages/${id}`, method: 'PUT', body }),
			invalidatesTags: () => routeTags(PAGES, CHANGES),
		}),
		siteBuilderDeletePage: builder.mutation<{ deleted: boolean; live: boolean }, string>({
			query: id => ({ url: `site-builder/pages/${id}`, method: 'DELETE' }),
			invalidatesTags: () => routeTags(PAGES, CHANGES),
		}),
		siteBuilderDuplicatePage: builder.mutation<SbPage, { id: string; name?: string; path?: string }>({
			query: ({ id, ...body }) => ({ url: `site-builder/pages/${id}/duplicate`, method: 'POST', body }),
			invalidatesTags: () => routeTags(PAGES, CHANGES),
		}),
		siteBuilderSetHome: builder.mutation<SbPage, string>({
			query: id => ({ url: `site-builder/pages/${id}/home`, method: 'POST' }),
			invalidatesTags: () => routeTags(PAGES, CHANGES),
		}),
		siteBuilderUnpublishPage: builder.mutation<SbPage, string>({
			query: id => ({ url: `site-builder/pages/${id}/unpublish`, method: 'POST' }),
			invalidatesTags: () => routeTags(PAGES, CHANGES),
		}),
		siteBuilderDesign: builder.query<SbDesign, void>({
			query: () => 'site-builder/design',
			providesTags: () => routeTags(DESIGN),
		}),
		siteBuilderSaveDesign: builder.mutation<SbDesign, Partial<Omit<SbDesignDraft, 'rev'>> & { rev: number }>({
			query: body => ({ url: 'site-builder/design', method: 'PUT', body }),
			invalidatesTags: () => routeTags(DESIGN, CHANGES),
		}),
		siteBuilderValidate: builder.mutation<{ ok: boolean; problems: SbProblem[] }, { tree?: SbNode[]; design?: Partial<SbDesignDraft>; externalIds?: string[] }>({
			query: body => ({ url: 'site-builder/validate', method: 'POST', body }),
		}),
		siteBuilderChanges: builder.query<SbChanges, void>({
			query: () => 'site-builder/changes',
			providesTags: () => routeTags(CHANGES),
			keepUnusedDataFor: 0,
		}),
		siteBuilderPublish: builder.mutation<{ version: number; publishedAt: string; url: string | null; revalidated: boolean; pages: number }, { note?: string }>({
			query: body => ({ url: 'site-builder/publish', method: 'POST', body }),
			invalidatesTags: () => routeTags(PAGES, DESIGN, CHANGES, RELEASES),
		}),
		siteBuilderReleases: builder.query<{ releases: { version: number; note: string; publishedBy: { id: string; name: string } | null; publishedAt: string; restoredFrom: number | null; pages: number }[] }, void>({
			query: () => 'site-builder/releases',
			providesTags: () => routeTags(RELEASES),
		}),
		siteBuilderRestore: builder.mutation<{ version: number; restoredFrom: number; url: string | null }, number>({
			query: version => ({ url: `site-builder/releases/${version}/restore`, method: 'POST' }),
			invalidatesTags: () => routeTags(PAGES, DESIGN, CHANGES, RELEASES),
		}),
	}),
});

export const {
	useSiteBuilderManifestQuery,
	useSiteBuilderPagesQuery,
	useSiteBuilderPageQuery,
	useLazySiteBuilderPageQuery,
	useSiteBuilderCreatePageMutation,
	useSiteBuilderSavePageMutation,
	useSiteBuilderDeletePageMutation,
	useSiteBuilderDuplicatePageMutation,
	useSiteBuilderSetHomeMutation,
	useSiteBuilderUnpublishPageMutation,
	useSiteBuilderDesignQuery,
	useSiteBuilderSaveDesignMutation,
	useSiteBuilderValidateMutation,
	useSiteBuilderChangesQuery,
	useSiteBuilderPublishMutation,
	useSiteBuilderReleasesQuery,
	useSiteBuilderRestoreMutation,
} = siteBuilderApi;
